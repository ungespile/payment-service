(function () {
  // API основного сервиса (порт 8080). Можно задать через window.API_BASE или переменную окружения при сборке.
  const API_BASE = window.API_BASE != null ? window.API_BASE : 'http://localhost:8080';

  document.getElementById('apiUrl').textContent = API_BASE;

  function showMessage(elId, text, isError) {
    var el = document.getElementById(elId);
    el.textContent = text;
    el.className = 'message' + (isError ? ' error' : ' success');
    el.style.display = text ? 'block' : 'none';
    if (text) setTimeout(function () { el.style.display = 'none'; el.textContent = ''; }, 5000);
  }

  document.getElementById('topUpForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var amountEl = document.getElementById('topUpAmount');
    var amount = amountEl.value.trim();
    if (!amount || parseFloat(amount) <= 0) {
      showMessage('topUpMessage', 'Введите сумму больше 0', true);
      return;
    }
    var btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    showMessage('topUpMessage', '', false);
    try {
      var res = await fetch(API_BASE + '/api/payment/top-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      var data = await res.json();
      if (data.success) {
        showMessage('topUpMessage', 'Запрос на пополнение создан. ID: ' + data.paymentRequestId + ', счёт: ' + data.accountId, false);
        amountEl.value = '';
      } else {
        showMessage('topUpMessage', data.message || 'Ошибка', true);
      }
    } catch (err) {
      showMessage('topUpMessage', 'Ошибка соединения с API. Проверьте, что сервис запущен на ' + API_BASE, true);
    }
    btn.disabled = false;
  });

  document.getElementById('cashoutForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var amountEl = document.getElementById('cashoutAmount');
    var amount = amountEl.value.trim();
    if (!amount || parseFloat(amount) <= 0) {
      showMessage('cashoutMessage', 'Введите сумму больше 0', true);
      return;
    }
    var btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    showMessage('cashoutMessage', '', false);
    try {
      var res = await fetch(API_BASE + '/api/cashout/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      var data = await res.json();
      if (data.success) {
        showMessage('cashoutMessage', 'Запрос на снятие создан. ID: ' + data.cashoutRequestId + ', счёт: ' + data.accountId, false);
        amountEl.value = '';
      } else {
        showMessage('cashoutMessage', data.message || 'Ошибка', true);
      }
    } catch (err) {
      showMessage('cashoutMessage', 'Ошибка соединения с API. Проверьте, что сервис запущен на ' + API_BASE, true);
    }
    btn.disabled = false;
  });
})();
