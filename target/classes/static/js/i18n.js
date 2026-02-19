(function () {
  const STORAGE_KEY = 'payment-ui-lang';

  const translations = {
    ru: {
      login: {
        pageTitle: 'Вход — Payment Service',
        formTitle: 'Вход в систему',
        loginLabel: 'Логин',
        passwordLabel: 'Пароль',
        loginPlaceholder: 'Введите логин',
        passwordPlaceholder: 'Введите пароль',
        submitBtn: 'Войти',
        errorEmpty: 'Введите логин и пароль',
        errorInvalid: 'Неверный логин или пароль',
        errorConnection: 'Ошибка соединения. Проверьте, что сервер запущен.'
      },
      dashboard: {
        pageTitle: 'Панель оператора — Payment Service',
        headerTitle: 'Панель оператора',
        logout: 'Выйти',
        operator: 'Оператор',
        paymentPanelTitle: 'Payment requests (пополнение)',
        cashoutPanelTitle: 'Cashout requests (вывод)',
        loading: 'Загрузка…',
        noRecords: 'Нет записей',
        amount: 'Сумма',
        status: 'Статус',
        approved: 'Одобрен',
        pending: 'Ожидает',
        approve: 'Approve',
        errorApprove: 'Не удалось одобрить запрос',
        errorConnection: 'Ошибка соединения',
        loadError: 'Ошибка загрузки',
        beginSession: 'Начать сессию',
        endSession: 'Завершить сессию',
        sessionStarted: 'Сессия начата',
        sessionEnded: 'Сессия завершена',
        errorCloseOperations: 'Сначала закройте все текущие операции'
      },
      admin: {
        pageTitle: 'Панель администратора — Payment Service',
        headerTitle: 'Панель администратора',
        logout: 'Выйти',
        filterOperator: 'Оператор:',
        filterStartDate: 'С:',
        filterEndDate: 'По:',
        applyFilters: 'Применить',
        approvalHistory: 'История одобрений',
        loading: 'Загрузка…',
        noRecords: 'Нет записей',
        type: 'Тип',
        operatorId: 'ID оператора',
        accountId: 'ID счета',
        amount: 'Сумма',
        createdAt: 'Создано',
        approvedAt: 'Одобрено',
        allOperators: 'Все операторы',
        errorConnection: 'Ошибка соединения',
        loadError: 'Ошибка загрузки'
      }
    },
    en: {
      login: {
        pageTitle: 'Login — Payment Service',
        formTitle: 'Log in',
        loginLabel: 'Username',
        passwordLabel: 'Password',
        loginPlaceholder: 'Enter username',
        passwordPlaceholder: 'Enter password',
        submitBtn: 'Log in',
        errorEmpty: 'Enter username and password',
        errorInvalid: 'Invalid username or password',
        errorConnection: 'Connection error. Make sure the server is running.'
      },
      dashboard: {
        pageTitle: 'Operator Panel — Payment Service',
        headerTitle: 'Operator Panel',
        logout: 'Log out',
        operator: 'Operator',
        paymentPanelTitle: 'Payment requests (top-up)',
        cashoutPanelTitle: 'Cashout requests (withdrawal)',
        loading: 'Loading…',
        noRecords: 'No records',
        amount: 'Amount',
        status: 'Status',
        approved: 'Approved',
        pending: 'Pending',
        approve: 'Approve',
        errorApprove: 'Failed to approve request',
        errorConnection: 'Connection error',
        loadError: 'Load error',
        beginSession: 'Begin session',
        endSession: 'End session',
        sessionStarted: 'Session started',
        sessionEnded: 'Session ended',
        errorCloseOperations: 'First close all current operations'
      },
      admin: {
        pageTitle: 'Admin Panel — Payment Service',
        headerTitle: 'Admin Panel',
        logout: 'Log out',
        filterOperator: 'Operator:',
        filterStartDate: 'From:',
        filterEndDate: 'To:',
        applyFilters: 'Apply',
        approvalHistory: 'Approval History',
        loading: 'Loading…',
        noRecords: 'No records',
        type: 'Type',
        operatorId: 'Operator ID',
        accountId: 'Account ID',
        amount: 'Amount',
        createdAt: 'Created',
        approvedAt: 'Approved',
        allOperators: 'All operators',
        errorConnection: 'Connection error',
        loadError: 'Load error'
      }
    }
  };

  let LANG = localStorage.getItem(STORAGE_KEY) || 'ru';
  if (LANG !== 'ru' && LANG !== 'en') LANG = 'ru';

  function get(path) {
    const keys = path.split('.');
    let v = translations[LANG];
    for (const k of keys) v = v && v[k];
    return v != null ? v : path;
  }

  function setLang(lang) {
    if (lang !== 'ru' && lang !== 'en') return;
    LANG = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations();
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  }

  function getLang() {
    return LANG;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = get(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = get(key);
    });
    const titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl) document.title = get(titleEl.getAttribute('data-i18n-title'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.documentElement.lang = LANG;
    });
  } else {
    document.documentElement.lang = LANG;
  }

  window.I18n = {
    t: get,
    getLang: getLang,
    setLang: setLang,
    applyTranslations: applyTranslations
  };
})();
