(function () {
  const API_BASE = '';

  const operatorId = sessionStorage.getItem('operatorId');
  const role = sessionStorage.getItem('role');
  if (!operatorId) {
    window.location.href = '/index.html';
    return;
  }
  if (role === 'ADMIN') {
    window.location.href = '/admin.html';
    return;
  }

  function t(path) {
    return window.I18n ? window.I18n.t(path) : path;
  }

  function applyPageTranslations() {
    if (window.I18n) {
      document.title = t('dashboard.pageTitle');
      window.I18n.applyTranslations();
    }
    document.getElementById('userName').textContent = sessionStorage.getItem('username') || t('dashboard.operator');
    var beginBtn = document.getElementById('beginSessionBtn');
    var endBtn = document.getElementById('endSessionBtn');
    if (beginBtn) beginBtn.textContent = t('dashboard.beginSession');
    if (endBtn) endBtn.textContent = t('dashboard.endSession');
    var loadPayment = document.getElementById('paymentLoading');
    var loadCashout = document.getElementById('cashoutLoading');
    if (loadPayment && loadPayment.style.display !== 'none') loadPayment.textContent = t('dashboard.loading');
    if (loadCashout && loadCashout.style.display !== 'none') loadCashout.textContent = t('dashboard.loading');
    var emptyPayment = document.getElementById('paymentEmpty');
    var emptyCashout = document.getElementById('cashoutEmpty');
    if (emptyPayment) emptyPayment.textContent = t('dashboard.noRecords');
    if (emptyCashout) emptyCashout.textContent = t('dashboard.noRecords');
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
    window.location.href = '/index.html';
  });

  document.getElementById('beginSessionBtn').addEventListener('click', function () {
    var btn = this;
    btn.disabled = true;
    fetch(API_BASE + '/api/operator/' + operatorId + '/session/begin', { method: 'POST' })
      .then(function (res) {
        if (res.ok) alert(t('dashboard.sessionStarted'));
        else alert(t('dashboard.errorConnection'));
      })
      .catch(function () { alert(t('dashboard.errorConnection')); })
      .finally(function () { btn.disabled = false; });
  });

  document.getElementById('endSessionBtn').addEventListener('click', function () {
    var btn = this;
    btn.disabled = true;
    fetch(API_BASE + '/api/operator/' + operatorId + '/session/end', { method: 'POST' })
      .then(function (res) {
        if (res.ok) {
          alert(t('dashboard.sessionEnded'));
        } else {
          return res.text().then(function (text) {
            var errorMessage = text || t('dashboard.errorConnection');
            alert(errorMessage);
          });
        }
      })
      .catch(function () { alert(t('dashboard.errorConnection')); })
      .finally(function () { btn.disabled = false; });
  });

  document.querySelectorAll('.lang-switcher .lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = btn.getAttribute('data-lang');
      if (window.I18n) window.I18n.setLang(lang);
      applyPageTranslations();
      updateLangButtons();
      renderPaymentTable(currentPaymentData);
      renderCashoutTable(currentCashoutData);
    });
  });

  var currentPaymentData = [];
  var currentCashoutData = [];

  applyPageTranslations();
  updateLangButtons();

  function renderPaymentTable(items) {
    currentPaymentData = items || [];
    if (!items || items.length === 0) {
      document.getElementById('paymentLoading').style.display = 'none';
      document.getElementById('paymentContent').style.display = 'none';
      document.getElementById('paymentEmpty').style.display = 'block';
      document.getElementById('paymentEmpty').textContent = t('dashboard.noRecords');
      return;
    }
    const approvedLabel = t('dashboard.approved');
    const pendingLabel = t('dashboard.pending');
    const approveLabel = t('dashboard.approve');
    const amountLabel = t('dashboard.amount');
    const statusLabel = t('dashboard.status');
    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Account ID</th>
            <th>${amountLabel}</th>
            <th>${statusLabel}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${items.map(function (row) {
            const approved = row.isApproved === true;
            return `
              <tr data-id="${row.id}">
                <td>${row.id}</td>
                <td>${row.accountId}</td>
                <td>${row.amount}</td>
                <td><span class="badge ${approved ? 'badge-approved' : 'badge-pending'}">${approved ? approvedLabel : pendingLabel}</span></td>
                <td>
                  ${approved ? '' : `<button type="button" class="btn btn-approve" data-id="${row.id}" data-type="payment">${approveLabel}</button>`}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('paymentLoading').style.display = 'none';
    document.getElementById('paymentEmpty').style.display = 'none';
    document.getElementById('paymentContent').innerHTML = html;
    document.getElementById('paymentContent').style.display = 'block';

    document.getElementById('paymentContent').querySelectorAll('.btn-approve[data-type="payment"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        approvePayment(id, btn);
      });
    });
  }

  function renderCashoutTable(items) {
    currentCashoutData = items || [];
    if (!items || items.length === 0) {
      document.getElementById('cashoutLoading').style.display = 'none';
      document.getElementById('cashoutContent').style.display = 'none';
      document.getElementById('cashoutEmpty').style.display = 'block';
      document.getElementById('cashoutEmpty').textContent = t('dashboard.noRecords');
      return;
    }
    const approvedLabel = t('dashboard.approved');
    const pendingLabel = t('dashboard.pending');
    const approveLabel = t('dashboard.approve');
    const amountLabel = t('dashboard.amount');
    const statusLabel = t('dashboard.status');
    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Account ID</th>
            <th>${amountLabel}</th>
            <th>${statusLabel}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${items.map(function (row) {
            const approved = row.isApproved === true;
            return `
              <tr data-id="${row.id}">
                <td>${row.id}</td>
                <td>${row.accountId}</td>
                <td>${row.amount}</td>
                <td><span class="badge ${approved ? 'badge-approved' : 'badge-pending'}">${approved ? approvedLabel : pendingLabel}</span></td>
                <td>
                  ${approved ? '' : `<button type="button" class="btn btn-approve" data-id="${row.id}" data-type="cashout">${approveLabel}</button>`}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('cashoutLoading').style.display = 'none';
    document.getElementById('cashoutEmpty').style.display = 'none';
    document.getElementById('cashoutContent').innerHTML = html;
    document.getElementById('cashoutContent').style.display = 'block';

    document.getElementById('cashoutContent').querySelectorAll('.btn-approve[data-type="cashout"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        approveCashout(id, btn);
      });
    });
  }

  async function approvePayment(id, btn) {
    btn.disabled = true;
    try {
      const res = await fetch(API_BASE + '/api/operator/payment-requests/' + id + '/approve', { method: 'PUT' });
      if (res.ok) {
        loadPaymentRequests();
      } else {
        btn.disabled = false;
        alert(t('dashboard.errorApprove'));
      }
    } catch (e) {
      btn.disabled = false;
      alert(t('dashboard.errorConnection'));
    }
  }

  async function approveCashout(id, btn) {
    btn.disabled = true;
    try {
      const res = await fetch(API_BASE + '/api/operator/cashout-requests/' + id + '/approve', { method: 'PUT' });
      if (res.ok) {
        loadCashoutRequests();
      } else {
        btn.disabled = false;
        alert(t('dashboard.errorApprove'));
      }
    } catch (e) {
      btn.disabled = false;
      alert(t('dashboard.errorConnection'));
    }
  }

  async function loadPaymentRequests() {
    try {
      const res = await fetch(API_BASE + '/api/operator/' + operatorId + '/payment-requests');
      const data = await res.json();
      renderPaymentTable(Array.isArray(data) ? data : []);
    } catch (e) {
      document.getElementById('paymentLoading').textContent = t('dashboard.loadError');
      document.getElementById('paymentLoading').style.display = 'block';
      document.getElementById('paymentContent').style.display = 'none';
      document.getElementById('paymentEmpty').style.display = 'none';
    }
  }

  async function loadCashoutRequests() {
    try {
      const res = await fetch(API_BASE + '/api/operator/' + operatorId + '/cashout-requests');
      const data = await res.json();
      renderCashoutTable(Array.isArray(data) ? data : []);
    } catch (e) {
      document.getElementById('cashoutLoading').textContent = t('dashboard.loadError');
      document.getElementById('cashoutLoading').style.display = 'block';
      document.getElementById('cashoutContent').style.display = 'none';
      document.getElementById('cashoutEmpty').style.display = 'none';
    }
  }

  loadPaymentRequests();
  loadCashoutRequests();
})();
