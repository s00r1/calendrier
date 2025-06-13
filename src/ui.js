export function showRequestError(msg) {
  const errorMessageDiv = document.getElementById('error-message');
  if (errorMessageDiv) {
    const item = document.createElement('div');
    item.className = 'error-item';
    const label = document.createElement('span');
    label.textContent = msg;
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.className = 'error-close';
    close.addEventListener('click', () => item.remove());
    item.appendChild(label);
    item.appendChild(close);
    errorMessageDiv.appendChild(item);
  } else {
    alert(msg);
  }
}

export function populateMonthSelect(select, names) {
  select.innerHTML = '';
  names.forEach((name, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

export function applyLanguage(lang, {
  texts,
  monthNamesMap,
  monthSelect,
  startRoomInput,
  excludeRoomInput,
  autoAssignBtn,
  clearCalendarBtn,
  adminBtn,
  autoOptionsTitle,
  linkedRoomsTitle,
  addLinkBtn,
  printBtn,
  downloadPdfBtn,
  logoutModal,
  logoutConfirm,
  logoutCancel,
  langSwitcher,
  configSelect,
  loadConfigBtn,
  saveConfigBtn,
  deleteConfigBtn,
  changePassBtn,
  populateMonthSelect,
  generateCalendar,
}) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = texts[lang];
  document.title = t.title;
  document.querySelector('h1').textContent = t.title;
  const startRoomLabel = document.querySelector('label[for="start-room"]');
  if (startRoomLabel) startRoomLabel.textContent = t.startRoomLabel;
  document.querySelector('label[for="start-day"]').textContent = t.startDayLabel;
  document.querySelector('label[for="exclude-room"]').textContent = t.excludeRoomLabel;
  excludeRoomInput.placeholder = t.excludeRoomPlaceholder;
  autoAssignBtn.textContent = t.autoAssign;
  clearCalendarBtn.textContent = t.clearCalendar;
  adminBtn.textContent = t.adminLogin;
  if (autoOptionsTitle) autoOptionsTitle.textContent = t.adminSectionTitle;
  if (linkedRoomsTitle) linkedRoomsTitle.textContent = t.linkedRoomsTitle;
  if (addLinkBtn) addLinkBtn.textContent = t.linkRooms;
  printBtn.textContent = t.print;
  if (downloadPdfBtn) downloadPdfBtn.textContent = t.downloadPdf;
  if (logoutModal) logoutModal.querySelector('p').textContent = t.logoutPrompt;
  logoutConfirm.textContent = t.logoutConfirm;
  logoutCancel.textContent = t.logoutCancel;
  if (langSwitcher) langSwitcher.textContent = lang === 'ar' ? 'FR' : 'AR';
  if (loadConfigBtn) loadConfigBtn.textContent = t.loadConfig;
  if (saveConfigBtn) saveConfigBtn.textContent = t.saveConfig;
  if (deleteConfigBtn) deleteConfigBtn.textContent = t.deleteConfig;
  if (changePassBtn) changePassBtn.textContent = t.changePass;
  populateMonthSelect(monthSelect, monthNamesMap[lang]);
  return generateCalendar();
}

export function restoreInputs(calendar, values) {
  const inputs = calendar.querySelectorAll('.day input');
  inputs.forEach((input, i) => {
    input.value = values[i] || '';
  });
}

export function initThemeSwitcher(themeSwitcher) {
  if (!themeSwitcher) return;
  if (
    localStorage.getItem('theme') === 'dark' ||
    (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches &&
      !localStorage.getItem('theme'))
  ) {
    document.body.classList.add('dark');
    themeSwitcher.textContent = '☀️';
  }
  themeSwitcher.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
      themeSwitcher.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeSwitcher.textContent = '🌘';
      localStorage.setItem('theme', 'light');
    }
  });
}

export function initLangSwitcher(langSwitcher, getLang, setLang) {
  if (!langSwitcher) return;
  langSwitcher.addEventListener('click', () => {
    const newLang = getLang() === 'fr' ? 'ar' : 'fr';
    langSwitcher.textContent = newLang === 'ar' ? 'FR' : 'AR';
    setLang(newLang);
  });
}
