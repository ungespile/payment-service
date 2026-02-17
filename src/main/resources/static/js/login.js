(function () {
  const API_BASE = '';

  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  function hideError() {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideError();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      showError('Введите логин и пароль');
      return;
    }

    try {
      const res = await fetch(API_BASE + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success && data.operatorId != null) {
        sessionStorage.setItem('operatorId', String(data.operatorId));
        sessionStorage.setItem('username', data.username || username);
        window.location.href = '/dashboard.html';
      } else {
        showError(data.message || 'Неверный логин или пароль');
      }
    } catch (err) {
      showError('Ошибка соединения. Проверьте, что сервер запущен.');
    }
  });
})();
