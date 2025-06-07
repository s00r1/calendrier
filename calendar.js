document.addEventListener('DOMContentLoaded', () => {
    // -------- PATCH BACKEND JSONBIN.IO --------
    const BIN_URL = "https://api.jsonbin.io/v3/b/6844456c8561e97a5020ae90";
    const API_KEY = "TA_CLE_API_ICI"; // Mets ta vraie clé ici !

    // Récupère toutes les assignations depuis jsonbin.io
    async function fetchAssignments() {
        try {
            const r = await fetch(BIN_URL + "/latest", {
                headers: {
                    "X-Master-Key": API_KEY
                }
            });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const data = await r.json();
            return data.record || [];
        } catch (err) {
            console.error(err);
            showRequestError("Erreur lors de la récupération des données");
            return [];
        }
    }

    // Sauvegarde ou supprime une assignation
    async function saveAssignment(date, chambre) {
        try {
            // 1. Récupère toutes les assignations actuelles
            let assignments = await fetchAssignments();

            // 2. Modifie ou supprime selon la valeur
            let found = false;
            assignments = assignments.map(a => {
                if (a.date === date) {
                    found = true;
                    return chambre ? {date, chambre} : null; // null = suppression
                }
                return a;
            }).filter(Boolean);

            // Ajoute nouvelle entrée si pas trouvée et non vide
            if (!found && chambre) assignments.push({date, chambre});

            // 3. Met à jour le bin entier (PUT)
            await fetch(BIN_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": API_KEY
                },
                body: JSON.stringify(assignments)
            });
        } catch (err) {
            console.error(err);
            showRequestError("Erreur lors de l'enregistrement des données");
        }
    }
    // -------- FIN PATCH BACKEND --------

    // -- TOUT TON CODE À TOI (inchallah tu copies tout, rien à changer ici sauf la fonction generateCalendar !) --

    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const calendar = document.getElementById('calendar');
    const printBtn = document.getElementById('print');
    const subtitle = document.getElementById('subtitle');
    const adminBtn = document.getElementById('admin-login');
    const adminControls = document.getElementById('admin-controls');
    const adminSection = document.querySelector('.admin-section');
    const startRoomInput = document.getElementById('start-room');
    const startDaySelect = document.getElementById('start-day');
    const autoAssignBtn = document.getElementById('auto-assign');
    const clearCalendarBtn = document.getElementById('clear-calendar');
    const excludeRoomInput = document.getElementById('exclude-room');
    const addExcludeBtn = document.getElementById('add-exclude');
    const excludedListDiv = document.getElementById('excluded-list');
    const errorMessageDiv = document.getElementById('error-message');
    const langSwitcher = document.getElementById('langSwitcher');
    const themeSwitcher = document.getElementById('themeSwitcher');
    const logoutModal = document.getElementById('logout-modal');
    const logoutConfirm = document.getElementById('logout-confirm');
    const logoutCancel = document.getElementById('logout-cancel');
    function showRequestError(msg) {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = msg;
        } else {
            alert(msg);
        }
    }

    let isAdmin = false;
    const excludedRooms = new Set([13]);

    let currentLang = 'fr';
    const monthNamesMap = {
        fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    };
    const dayNamesMap = {
        fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        ar: ['أحد', 'اثن', 'ثلث', 'أربع', 'خميس', 'جمع', 'سبت'],
    };
    const fullDayNamesMap = {
        fr: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        ar: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
    };
    const texts = {
        fr: {
            title: 'Calendrier du ménage de la cuisine',
            subtitlePrefix: 'Pour le mois de',
            startRoomLabel: 'Chambre de départ :',
            startRoomPlaceholder: 'Chambre',
            startDayLabel: 'Date de début :',
            excludeRoomLabel: 'Chambre à exclure :',
            excludeRoomPlaceholder: 'Exclure',
            autoAssign: 'Auto',
            clearCalendar: 'Clear',
            adminLogin: 'Admin',
            print: 'Imprimer',
            logoutPrompt: 'Quitter le mode admin ?',
            logoutConfirm: 'Oui',
            logoutCancel: 'Non',
            invalidRoom: 'La chambre de départ est invalide',
            invalidDate: 'La date de début est hors du mois',
            adminPassPrompt: 'Mot de passe admin ?',
            adminEnabled: 'Mode édition activé',
            adminWrongPass: 'Mot de passe incorrect',
            dayPrefix: 'Chambre',
        },
        ar: {
            title: 'جدول تنظيف المطبخ',
            subtitlePrefix: 'لشهر',
            startRoomLabel: 'غرفة البداية:',
            startRoomPlaceholder: 'غرفة',
            startDayLabel: 'تاريخ البداية:',
            excludeRoomLabel: 'الغرفة المستثناة:',
            excludeRoomPlaceholder: 'استثناء',
            autoAssign: 'تلقائي',
            clearCalendar: 'مسح',
            adminLogin: 'إدارة',
            print: 'طباعة',
            logoutPrompt: 'الخروج من وضع الإدارة؟',
            logoutConfirm: 'نعم',
            logoutCancel: 'لا',
            invalidRoom: 'رقم الغرفة غير صالح',
            invalidDate: 'التاريخ خارج الشهر',
            adminPassPrompt: 'كلمة مرور الإدارة؟',
            adminEnabled: 'تم تفعيل وضع التحرير',
            adminWrongPass: 'كلمة المرور غير صحيحة',
            dayPrefix: 'الغرفة',
        },
    };

    function updateExcludedList() {
        if (!excludedListDiv) return;
        const rooms = Array.from(excludedRooms).sort((a, b) => a - b);
        excludedListDiv.innerHTML = '';
        rooms.forEach(room => {
            const item = document.createElement('span');
            item.className = 'excluded-item';
            const label = document.createElement('span');
            label.textContent = room;
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-exclude';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => {
                excludedRooms.delete(room);
                updateExcludedList();
            });
            item.appendChild(label);
            item.appendChild(removeBtn);
            excludedListDiv.appendChild(item);
        });
    }

    function setDayInputsDisabled(disabled) {
        const inputs = calendar.querySelectorAll('.day input');
        inputs.forEach(inp => {
            inp.disabled = disabled;
        });
    }

    function updateAdminControls() {
        if (adminSection) adminSection.style.display = isAdmin ? 'block' : 'none';
        if (adminControls) adminControls.style.display = isAdmin ? 'flex' : 'none';
        if (excludedListDiv) excludedListDiv.style.display = isAdmin ? 'block' : 'none';
        if (errorMessageDiv) {
            errorMessageDiv.style.display = isAdmin ? 'block' : 'none';
            if (!isAdmin) errorMessageDiv.textContent = '';
        }
        if (autoAssignBtn) autoAssignBtn.disabled = !isAdmin;
        if (clearCalendarBtn) clearCalendarBtn.disabled = !isAdmin;
        setDayInputsDisabled(!isAdmin);
        updateExcludedList();
    }

    const today = new Date();
    function populateMonthSelect() {
        monthSelect.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = monthNamesMap[currentLang][i];
            monthSelect.appendChild(option);
        }
    }
    populateMonthSelect();
    for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 1; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }
    monthSelect.value = today.getMonth();
    yearSelect.value = today.getFullYear();

    function createHeader() {
        const fullDayNames = fullDayNamesMap[currentLang];
        fullDayNames.forEach(day => {
            const div = document.createElement('div');
            div.className = 'header';
            div.textContent = day;
            calendar.appendChild(div);
        });
    }

    // ------------ PATCH PRINCIPAL : gestion backend jsonbin.io -----------

    async function generateCalendar() {
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearSelect.value, 10);
        calendar.innerHTML = '';
        createHeader();
        if (subtitle) {
            subtitle.textContent = `${texts[currentLang].subtitlePrefix} ${monthNamesMap[currentLang][month]} ${year}`;
        }

        let firstDay = new Date(year, month, 1).getDay();
        firstDay = firstDay === 0 ? 7 : firstDay; // start Monday
        for (let i = 1; i < firstDay; i++) {
            calendar.appendChild(document.createElement('div'));
        }

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        if (startDaySelect) {
            startDaySelect.innerHTML = '';
            for (let i = 1; i <= daysInMonth; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i;
                startDaySelect.appendChild(opt);
            }
        }
        const dayNames = dayNamesMap[currentLang];
        for (let d = 1; d <= daysInMonth; d++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'room-input';
            const prefix = document.createElement('span');
            prefix.className = 'room-prefix';
            prefix.textContent = texts[currentLang].dayPrefix;
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 54;
            input.placeholder = texts[currentLang].dayPrefix;
            input.disabled = !isAdmin;
            input.dataset.day = d; // used for delegated change handler
            input.addEventListener('input', function () {
                if (this.value === '13') this.value = '';
            });
            inputWrapper.appendChild(prefix);
            inputWrapper.appendChild(input);
            const abbr = dayNames[new Date(year, month, d).getDay()];
            dayDiv.textContent = `${abbr} ${d}`;
            dayDiv.appendChild(document.createElement('br'));
            dayDiv.appendChild(inputWrapper);
            calendar.appendChild(dayDiv);
        }
        // --------- Ici, récupération des assignations depuis jsonbin.io --------
        const assignments = await fetchAssignments();
        const dayInputs = calendar.querySelectorAll('.day input');
        for (let d = 1; d <= dayInputs.length; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const found = assignments.find(a => a.date === dateStr);
            if (found) {
                dayInputs[d - 1].value = found.chambre;
            }
        }
        updateAdminControls();
    }

    // ------------ FIN PATCH PRINCIPAL ---------------

    function autoAssign() {
        const messages = [];
        if (errorMessageDiv) errorMessageDiv.textContent = '';
        const startRoom = parseInt(startRoomInput.value, 10);
        const startDay = parseInt(startDaySelect.value, 10);
        const dayInputs = calendar.querySelectorAll('.day input');
        const daysInMonth = dayInputs.length;

        if (isNaN(startRoom) || startRoom < 1 || startRoom > 54 || excludedRooms.has(startRoom)) {
            messages.push(texts[currentLang].invalidRoom);
        }
        if (isNaN(startDay) || startDay < 1 || startDay > daysInMonth) {
            messages.push(texts[currentLang].invalidDate);
        }

        if (messages.length > 0) {
            if (errorMessageDiv) {
                errorMessageDiv.textContent = messages.join(' - ');
            } else {
                alert(messages.join('\n'));
            }
            return;
        }

        let room = startRoom;
        for (let i = startDay - 1; i < dayInputs.length; i++) {
            while (excludedRooms.has(room)) {
                room++;
                if (room > 54) room = 1;
            }
            dayInputs[i].value = room;
            room++;
            if (room > 54) room = 1;
        }
    }

    function clearCalendar() {
        const dayInputs = calendar.querySelectorAll('.day input');
        dayInputs.forEach(inp => {
            inp.value = '';
            // PATCH: Suppression de l’assignation côté backend !
            const month = parseInt(monthSelect.value, 10);
            const year = parseInt(yearSelect.value, 10);
            const idx = Array.from(dayInputs).indexOf(inp);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(idx + 1).padStart(2, '0')}`;
            if (isAdmin) saveAssignment(dateStr, ""); // suppression dans jsonbin.io
        });
    }

    function addExcludedRoom() {
        const num = parseInt(excludeRoomInput.value, 10);
        if (!isNaN(num) && num >= 1 && num <= 54 && num !== 13) {
            excludedRooms.add(num);
            updateExcludedList();
        }
        excludeRoomInput.value = '';
    }

    function restoreInputs(values) {
        const inputs = calendar.querySelectorAll('.day input');
        inputs.forEach((input, i) => {
            input.value = values[i] || '';
        });
    }

    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        const t = texts[lang];
        document.title = t.title;
        document.querySelector('h1').textContent = t.title;
        document.querySelector('label[for="start-room"]').textContent = t.startRoomLabel;
        startRoomInput.placeholder = t.startRoomPlaceholder;
        document.querySelector('label[for="start-day"]').textContent = t.startDayLabel;
        document.querySelector('label[for="exclude-room"]').textContent = t.excludeRoomLabel;
        excludeRoomInput.placeholder = t.excludeRoomPlaceholder;
        autoAssignBtn.textContent = t.autoAssign;
        clearCalendarBtn.textContent = t.clearCalendar;
        adminBtn.textContent = t.adminLogin;
        printBtn.textContent = t.print;
        if (logoutModal) logoutModal.querySelector('p').textContent = t.logoutPrompt;
        logoutConfirm.textContent = t.logoutConfirm;
        logoutCancel.textContent = t.logoutCancel;
        if (langSwitcher) langSwitcher.textContent = lang === 'ar' ? 'FR' : 'AR';
        populateMonthSelect();
        generateCalendar();
    }

    // Update calendar whenever the month or year selection changes
    monthSelect.addEventListener('change', generateCalendar);
    yearSelect.addEventListener('change', generateCalendar);

    // Delegated change handler for day inputs
    calendar.addEventListener('change', async e => {
        if (!(e.target instanceof HTMLInputElement)) return;
        if (!e.target.closest('.day')) return;
        if (!isAdmin) return;
        const day = parseInt(e.target.dataset.day, 10);
        if (!day) return;
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearSelect.value, 10);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        await saveAssignment(dateStr, e.target.value);
    });

    printBtn.addEventListener('click', () => {
        const before = currentLang;
        const savedValues = Array.from(calendar.querySelectorAll('.day input')).map(inp => inp.value);
        if (before !== 'fr') {
            applyLanguage('fr');
            restoreInputs(savedValues);
            window.addEventListener(
                'afterprint',
                () => {
                    applyLanguage(before);
                    restoreInputs(savedValues);
                },
                { once: true }
            );
        }
        window.print();
    });
    if (themeSwitcher) {
        if (
            localStorage.getItem('theme') === 'dark' ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))
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
    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            const newLang = currentLang === 'fr' ? 'ar' : 'fr';
            langSwitcher.textContent = newLang === 'ar' ? 'FR' : 'AR';
            applyLanguage(newLang);
        });
    }
    if (autoAssignBtn) {
        autoAssignBtn.addEventListener('click', autoAssign);
    }
    if (clearCalendarBtn) {
        clearCalendarBtn.addEventListener('click', clearCalendar);
    }
    if (addExcludeBtn) {
        addExcludeBtn.addEventListener('click', addExcludedRoom);
    }
    if (excludeRoomInput) {
        excludeRoomInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addExcludedRoom();
            }
        });
    }
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            if (isAdmin) {
                if (logoutModal) logoutModal.style.display = 'flex';
                return;
            }
            const pass = prompt(texts[currentLang].adminPassPrompt);
            if (pass === 's00r1') {
                isAdmin = true;
                alert(texts[currentLang].adminEnabled);
                generateCalendar();
                updateAdminControls();
            } else {
                alert(texts[currentLang].adminWrongPass);
            }
        });
    }

    if (logoutCancel) {
        logoutCancel.addEventListener('click', () => {
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }

    if (logoutConfirm) {
        logoutConfirm.addEventListener('click', () => {
            isAdmin = false;
            if (logoutModal) logoutModal.style.display = 'none';
            updateAdminControls();
        });
    }

    applyLanguage(currentLang);
    updateAdminControls();
    updateExcludedList();
});
