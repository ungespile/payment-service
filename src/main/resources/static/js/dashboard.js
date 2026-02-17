(function () {
  const API_BASE = '';

  const operatorId = sessionStorage.getItem('operatorId');
  if (!operatorId) {
    window.location.href = '/index.html';
    return;
  }

  document.getElementById('userName').textContent = sessionStorage.getItem('username') || 'Оператор';

  document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.removeItem('operatorId');
    sessionStorage.removeItem('username');
    window.location.href = '/index.html';
  });

  function renderPaymentTable(items) {
    if (!items || items.length === 0) {
      document.getElementById('paymentLoading').style.display = 'none';
      document.getElementById('paymentContent').style.display = 'none';
      document.getElementById('paymentEmpty').style.display = 'block';
      return;
    }
    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Account ID</th>
            <th>Сумма</th>
            <th>Статус</th>
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
                <td><span class="badge ${approved ? 'badge-approved' : 'badge-pending'}">${approved ? 'Одобрен' : 'Ожидает'}</span></td>
                <td>
                  ${approved ? '' : `<button type="button" class="btn btn-approve" data-id="${row.id}" data-type="payment">Approve</button>`}
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
    if (!items || items.length === 0) {
      document.getElementById('cashoutLoading').style.display = 'none';
      document.getElementById('cashoutContent').style.display = 'none';
      document.getElementById('cashoutEmpty').style.display = 'block';
      return;
    }
    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Account ID</th>
            <th>Сумма</th>
            <th>Статус</th>
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
                <td><span class="badge ${approved ? 'badge-approved' : 'badge-pending'}">${approved ? 'Одобрен' : 'Ожидает'}</span></td>
                <td>
                  ${approved ? '' : `<button type="button" class="btn btn-approve" data-id="${row.id}" data-type="cashout">Approve</button>`}
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
        alert('Не удалось одобрить запрос');
      }
    } catch (e) {
      btn.disabled = false;
      alert('Ошибка соединения');
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
        alert('Не удалось одобрить запрос');
      }
    } catch (e) {
      btn.disabled = false;
      alert('Ошибка соединения');
    }
  }

  async function loadPaymentRequests() {
    try {
      const res = await fetch(API_BASE + '/api/operator/' + operatorId + '/payment-requests');
      const data = await res.json();
      renderPaymentTable(Array.isArray(data) ? data : []);
    } catch (e) {
      document.getElementById('paymentLoading').textContent = 'Ошибка загрузки';
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
      document.getElementById('cashoutLoading').textContent = 'Ошибка загрузки';
      document.getElementById('cashoutContent').style.display = 'none';
      document.getElementById('cashoutEmpty').style.display = 'none';
    }
  }

  loadPaymentRequests();
  loadCashoutRequests();
})();
