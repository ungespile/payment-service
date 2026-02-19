(function () {
  // API основного сервиса (порт 8080). Можно задать через window.API_BASE или переменную окружения при сборке.
  const API_BASE = window.API_BASE != null ? window.API_BASE : 'http://localhost:8080';

  function init() {
    var apiUrlEl = document.getElementById('apiUrl');
    if (apiUrlEl) {
      apiUrlEl.textContent = API_BASE;
    }

    // Элементы интерфейса
    const actionSelection = document.getElementById('actionSelection');
    const topUpFormContainer = document.getElementById('topUpFormContainer');
    const cashoutFormContainer = document.getElementById('cashoutFormContainer');
    const topUpBtn = document.getElementById('topUpBtn');
    const cashoutBtn = document.getElementById('cashoutBtn');
    const backFromTopUp = document.getElementById('backFromTopUp');
    const backFromCashout = document.getElementById('backFromCashout');

    if (!actionSelection || !topUpFormContainer || !cashoutFormContainer || !topUpBtn || !cashoutBtn) {
      console.error('Не найдены необходимые элементы DOM');
      return;
    }

    // Показать экран выбора действия
    function showActionSelection() {
      if (actionSelection) {
        actionSelection.classList.remove('hidden');
      }
      if (topUpFormContainer) {
        topUpFormContainer.classList.add('hidden');
      }
      if (cashoutFormContainer) {
        cashoutFormContainer.classList.add('hidden');
      }
      // Очистить сообщения
      var topUpMessage = document.getElementById('topUpMessage');
      var cashoutMessage = document.getElementById('cashoutMessage');
      var topUpAmount = document.getElementById('topUpAmount');
      var cashoutAmount = document.getElementById('cashoutAmount');
      if (topUpMessage) topUpMessage.textContent = '';
      if (cashoutMessage) cashoutMessage.textContent = '';
      if (topUpAmount) topUpAmount.value = '';
      if (cashoutAmount) cashoutAmount.value = '';
    }

    // Показать форму пополнения
    function showTopUpForm() {
      console.log('showTopUpForm вызвана');
      if (actionSelection) {
        actionSelection.classList.add('hidden');
      }
      if (topUpFormContainer) {
        topUpFormContainer.classList.remove('hidden');
        console.log('topUpFormContainer показан, классы:', topUpFormContainer.className);
      }
      if (cashoutFormContainer) {
        cashoutFormContainer.classList.add('hidden');
      }
    }

    // Показать форму снятия
    function showCashoutForm() {
      console.log('showCashoutForm вызвана');
      if (actionSelection) {
        actionSelection.classList.add('hidden');
      }
      if (topUpFormContainer) {
        topUpFormContainer.classList.add('hidden');
      }
      if (cashoutFormContainer) {
        cashoutFormContainer.classList.remove('hidden');
        console.log('cashoutFormContainer показан, классы:', cashoutFormContainer.className);
      }
    }

    // Обработчики кнопок
    if (topUpBtn) {
      console.log('Добавляем обработчик для topUpBtn');
      topUpBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Кнопка topUpBtn нажата');
        showTopUpForm();
      });
    } else {
      console.error('topUpBtn не найден!');
    }
    if (cashoutBtn) {
      console.log('Добавляем обработчик для cashoutBtn');
      cashoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Кнопка cashoutBtn нажата');
        showCashoutForm();
      });
    } else {
      console.error('cashoutBtn не найден!');
    }
    if (backFromTopUp) {
      backFromTopUp.addEventListener('click', function(e) {
        e.preventDefault();
        showActionSelection();
      });
    }
    if (backFromCashout) {
      backFromCashout.addEventListener('click', function(e) {
        e.preventDefault();
        showActionSelection();
      });
    }

    function showMessage(elId, text, isError) {
      var el = document.getElementById(elId);
      if (!el) return;
      el.textContent = text;
      el.className = 'message' + (isError ? ' error' : ' success');
      el.style.display = text ? 'block' : 'none';
      if (text) setTimeout(function () { el.style.display = 'none'; el.textContent = ''; }, 5000);
    }

    var topUpForm = document.getElementById('topUpForm');
    if (topUpForm) {
      topUpForm.addEventListener('submit', async function (e) {
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
            // Вернуться к выбору действия через 3 секунды после успешного создания
            setTimeout(function() {
              showActionSelection();
            }, 3000);
          } else {
            showMessage('topUpMessage', data.message || 'Ошибка', true);
          }
        } catch (err) {
          showMessage('topUpMessage', 'Ошибка соединения с API. Проверьте, что сервис запущен на ' + API_BASE, true);
        }
        btn.disabled = false;
      });
    }

    var cashoutForm = document.getElementById('cashoutForm');
    if (cashoutForm) {
      cashoutForm.addEventListener('submit', async function (e) {
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
            // Вернуться к выбору действия через 3 секунды после успешного создания
            setTimeout(function() {
              showActionSelection();
            }, 3000);
          } else {
            showMessage('cashoutMessage', data.message || 'Ошибка', true);
          }
        } catch (err) {
          showMessage('cashoutMessage', 'Ошибка соединения с API. Проверьте, что сервис запущен на ' + API_BASE, true);
        }
        btn.disabled = false;
      });
    }
  }

  // Инициализация после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
