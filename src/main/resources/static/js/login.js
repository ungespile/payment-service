(function () {
  const API_BASE = '';

  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');

  function t(path) {
    return window.I18n ? window.I18n.t(path) : path;
  }

  function applyPageTranslations() {
    if (window.I18n) {
      document.title = t('login.pageTitle');
      window.I18n.applyTranslations();
    }
  }

  function updateLangButtons() {
    const lang = window.I18n ? window.I18n.getLang() : 'ru';
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  document.querySelectorAll('.lang-switcher .lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = btn.getAttribute('data-lang');
      if (window.I18n) window.I18n.setLang(lang);
      applyPageTranslations();
      updateLangButtons();
    });
  });

  applyPageTranslations();
  updateLangButtons();

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
      showError(t('login.errorEmpty'));
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
        showError(data.message || t('login.errorInvalid'));
      }
    } catch (err) {
      showError(t('login.errorConnection'));
    }
  });
})();
