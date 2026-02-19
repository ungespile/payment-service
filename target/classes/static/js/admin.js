(function () {
  const API_BASE = '';

  const role = sessionStorage.getItem('role');
  if (role !== 'ADMIN') {
    window.location.href = '/index.html';
    return;
  }

  function t(path) {
    return window.I18n ? window.I18n.t(path) : path;
  }

  function applyPageTranslations() {
    if (window.I18n) {
      document.title = t('admin.pageTitle');
      window.I18n.applyTranslations();
    }
    document.getElementById('userName').textContent = sessionStorage.getItem('username') || 'Admin';
  }

  function updateLangButtons() {
    const lang = window.I18n ? window.I18n.getLang() : 'ru';
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.removeItem('operatorId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    window.location.href = '/index.html';
  });

  document.querySelectorAll('.lang-switcher .lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = btn.getAttribute('data-lang');
      if (window.I18n) window.I18n.setLang(lang);
      applyPageTranslations();
      updateLangButtons();
      loadHistory();
    });
  });

  applyPageTranslations();
  updateLangButtons();

  async function loadOperators() {
    try {
      const res = await fetch(API_BASE + '/api/admin/operators');
      const data = await res.json();
      const select = document.getElementById('operatorFilter');
      select.innerHTML = '<option value="">' + t('admin.allOperators') + '</option>';
      if (Array.isArray(data)) {
        data.forEach(function (op) {
          const option = document.createElement('option');
          option.value = op.operatorId;
          option.textContent = op.username + ' (ID: ' + op.operatorId + ')';
          select.appendChild(option);
        });
      }
    } catch (e) {
      console.error('Failed to load operators', e);
    }
  }

  function formatDateTime(dt) {
    if (!dt) return '-';
    try {
      const d = new Date(dt);
      return d.toLocaleString();
    } catch (e) {
      return dt;
    }
  }

  function renderHistory(items) {
    if (!items || items.length === 0) {
      document.getElementById('historyLoading').style.display = 'none';
      document.getElementById('historyContent').style.display = 'none';
      document.getElementById('historyEmpty').style.display = 'block';
      document.getElementById('historyEmpty').textContent = t('admin.noRecords');
      return;
    }
    const typeLabel = t('admin.type');
    const operatorIdLabel = t('admin.operatorId');
    const accountIdLabel = t('admin.accountId');
    const amountLabel = t('admin.amount');
    const createdAtLabel = t('admin.createdAt');
    const approvedAtLabel = t('admin.approvedAt');
    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>${typeLabel}</th>
            <th>${operatorIdLabel}</th>
            <th>${accountIdLabel}</th>
            <th>${amountLabel}</th>
            <th>${createdAtLabel}</th>
            <th>${approvedAtLabel}</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(function (row) {
            return `
              <tr>
                <td>${row.id}</td>
                <td><span class="badge ${row.type === 'PAYMENT' ? 'badge-approved' : 'badge-pending'}">${row.type}</span></td>
                <td>${row.operatorId}</td>
                <td>${row.accountId}</td>
                <td>${row.amount}</td>
                <td>${formatDateTime(row.createdAt)}</td>
                <td>${formatDateTime(row.approvedAt)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('historyLoading').style.display = 'none';
    document.getElementById('historyEmpty').style.display = 'none';
    document.getElementById('historyContent').innerHTML = html;
    document.getElementById('historyContent').style.display = 'block';
  }

  function formatDateForAPI(dateStr) {
    if (!dateStr) return null;
    return dateStr + ':00';
  }

  async function loadHistory() {
    const operatorId = document.getElementById('operatorFilter').value || null;
    const startDateRaw = document.getElementById('startDate').value || null;
    const endDateRaw = document.getElementById('endDate').value || null;
    const startDate = formatDateForAPI(startDateRaw);
    const endDate = formatDateForAPI(endDateRaw);

    document.getElementById('historyLoading').style.display = 'block';
    document.getElementById('historyContent').style.display = 'none';
    document.getElementById('historyEmpty').style.display = 'none';
    document.getElementById('historyLoading').textContent = t('admin.loading');

    try {
      let url = API_BASE + '/api/admin/approval-history?';
      if (operatorId) url += 'operatorId=' + encodeURIComponent(operatorId) + '&';
      if (startDate) url += 'startDate=' + encodeURIComponent(startDate) + '&';
      if (endDate) url += 'endDate=' + encodeURIComponent(endDate) + '&';
      url = url.replace(/[&?]$/, '');

      const res = await fetch(url);
      const data = await res.json();
      renderHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      document.getElementById('historyLoading').textContent = t('admin.loadError');
      document.getElementById('historyContent').style.display = 'none';
      document.getElementById('historyEmpty').style.display = 'none';
    }
  }

  document.getElementById('applyFiltersBtn').addEventListener('click', loadHistory);

  loadOperators();
  loadHistory();
})();
