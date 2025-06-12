import {
    fetchAssignments,
    saveAssignments,
    saveAssignment,
    deleteAssignments,
} from './data.js';
import {
    showRequestError,
    populateMonthSelect,
    applyLanguage,
    restoreInputs,
    initThemeSwitcher,
    initLangSwitcher,
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

    // ----------- UI & LOGIQUE -----------

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
    const linkRoomAInput = document.getElementById('link-room-a');
    const linkRoomBInput = document.getElementById('link-room-b');
    const addLinkBtn = document.getElementById('add-link');
    const linkedListDiv = document.getElementById('linked-list');
    const linkGroup = document.getElementById('link-group');
    const errorMessageDiv = document.getElementById('error-message');
    const langSwitcher = document.getElementById('langSwitcher');
    const themeSwitcher = document.getElementById('themeSwitcher');
    const logoutModal = document.getElementById('logout-modal');
    const logoutConfirm = document.getElementById('logout-confirm');
    const logoutCancel = document.getElementById('logout-cancel');

    let isAdmin = false;
    const excludedRooms = new Set([13]);
    const linkedRooms = new Map();
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
            startRoomLabel: 'No de chambre de départ',
            startRoomPlaceholder: '#',
            startDayLabel: 'Jour :',
            excludeRoomLabel: 'Exclure :',
            excludeRoomPlaceholder: '#',
            autoAssign: 'Auto',
            clearCalendar: 'Vider',
            adminLogin: 'Admin',
            print: 'Imprimer',
            logoutPrompt: 'Quitter le mode admin ?',
            logoutConfirm: 'Oui',
            logoutCancel: 'Non',
            invalidRoom: 'La chambre de départ est invalide',
            invalidDate: 'La date de début est hors du mois',
            allExcluded: 'Toutes les chambres sont exclues',
            adminPassPrompt: 'Mot de passe admin ?',
            adminEnabled: 'Mode édition activé',
            adminWrongPass: 'Mot de passe incorrect',
            dayPrefix: 'Chambre',
        },
        ar: {
            title: 'جدول تنظيف المطبخ',
            subtitlePrefix: 'لشهر',
            startRoomLabel: 'رقم غرفة البداية',
            startRoomPlaceholder: '#',
            startDayLabel: 'اليوم:',
            excludeRoomLabel: 'استثناء:',
            excludeRoomPlaceholder: '#',
            autoAssign: 'تلقائي',
            clearCalendar: 'مسح',
            adminLogin: 'إدارة',
            print: 'طباعة',
            logoutPrompt: 'الخروج من وضع الإدارة؟',
            logoutConfirm: 'نعم',
            logoutCancel: 'لا',
            invalidRoom: 'رقم الغرفة غير صالح',
            invalidDate: 'التاريخ خارج الشهر',
            allExcluded: 'جميع الغرف مستبعدة',
            adminPassPrompt: 'كلمة مرور الإدارة؟',
            adminEnabled: 'تم تفعيل وضع التحرير',
            adminWrongPass: 'كلمة المرور غير صحيحة',
            dayPrefix: 'الغرفة',
        },
    };

    function setLanguage(lang) {
        currentLang = lang;
        applyLanguage(lang, {
            texts,
            monthNamesMap,
            monthSelect,
            startRoomInput,
            excludeRoomInput,
            autoAssignBtn,
            clearCalendarBtn,
            adminBtn,
            printBtn,
            logoutModal,
            logoutConfirm,
            logoutCancel,
            langSwitcher,
            populateMonthSelect,
            generateCalendar,
        });
    }

    function updateExcludedList() {
        if (!excludedListDiv) return;
        const rooms = Array.from(excludedRooms).sort((a, b) => a - b);
        excludedListDiv.innerHTML = '';
        rooms.forEach(room => {
            const item = document.createElement('span');
            item.className = 'excluded-item';
            const label = document.createElement('span');
            label.textContent = room;
            item.appendChild(label);
            if (room !== 13) {
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-exclude';
                removeBtn.textContent = '×';
                removeBtn.addEventListener('click', () => {
                    excludedRooms.delete(room);
                    updateExcludedList();
                });
                item.appendChild(removeBtn);
            }
            excludedListDiv.appendChild(item);
        });
    }

    function setDayInputsDisabled(disabled) {
        const inputs = calendar.querySelectorAll('.day input');
        inputs.forEach(inp => {
            inp.disabled = disabled;
        });
        const btns = calendar.querySelectorAll('.add-room');
        btns.forEach(btn => {
            btn.disabled = disabled;
        });
    }

    function updateAdminControls() {
        if (adminSection) adminSection.style.display = isAdmin ? 'block' : 'none';
        if (adminControls) adminControls.style.display = isAdmin ? 'flex' : 'none';
        if (excludedListDiv) excludedListDiv.style.display = isAdmin ? 'block' : 'none';
        if (linkGroup) linkGroup.style.display = isAdmin ? 'flex' : 'none';
        if (linkedListDiv) linkedListDiv.style.display = isAdmin ? 'block' : 'none';
        if (errorMessageDiv) {
            errorMessageDiv.style.display = isAdmin ? 'block' : 'none';
            if (!isAdmin) errorMessageDiv.textContent = '';
        }
        if (autoAssignBtn) autoAssignBtn.disabled = !isAdmin;
        if (clearCalendarBtn) clearCalendarBtn.disabled = !isAdmin;
        setDayInputsDisabled(!isAdmin);
        const addBtns = calendar.querySelectorAll('.add-room');
        addBtns.forEach(btn => {
            btn.style.display = isAdmin ? 'inline-block' : 'none';
        });
        updateExcludedList();
        updateLinkedList();
    }

    const today = new Date();
    populateMonthSelect(monthSelect, monthNamesMap[currentLang]);
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

    function createRoomInput(day) {
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'numeric';
        input.min = 1;
        input.max = 54;
        input.placeholder = texts[currentLang].dayPrefix;
        input.disabled = !isAdmin;
        input.dataset.day = day;
        input.addEventListener('input', function () {
            if (this.value === '13') this.value = '';
        });
        return input;
    }

    async function generateCalendar() {
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearSelect.value, 10);
        calendar.innerHTML = '';
        createHeader();
        if (subtitle) {
            subtitle.textContent = `${texts[currentLang].subtitlePrefix} ${monthNamesMap[currentLang][month]} ${year}`;
        }

        let firstDay = new Date(year, month, 1).getDay();
        firstDay = firstDay === 0 ? 7 : firstDay;
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
            const input = createRoomInput(d);
            inputWrapper.appendChild(prefix);
            inputWrapper.appendChild(input);
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'add-room';
            addBtn.textContent = '+';
            addBtn.style.display = isAdmin ? 'inline-block' : 'none';
            addBtn.addEventListener('click', () => {
                const newInput = createRoomInput(d);
                inputWrapper.insertBefore(newInput, addBtn);
            });
            inputWrapper.appendChild(addBtn);
            const abbr = dayNames[new Date(year, month, d).getDay()];
            dayDiv.textContent = `${abbr} ${d}`;
            dayDiv.appendChild(document.createElement('br'));
            dayDiv.appendChild(inputWrapper);
            calendar.appendChild(dayDiv);
        }
        let assignments = [];
        try {
            assignments = await fetchAssignments();
        } catch (err) {
            console.error(err);
            showRequestError(`Erreur de récupération : ${err.message}`);
        }
        const dayDivs = calendar.querySelectorAll('.day');
        for (let d = 1; d <= dayDivs.length; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const found = assignments.find(a => a.date === dateStr);
            if (found) {
                const wrapper = dayDivs[d - 1].querySelector('.room-input');
                const inputs = wrapper.querySelectorAll('input');
                if (found.chambres.length) {
                    inputs[0].value = found.chambres.join(' / ');
                }
            }
        }
        updateAdminControls();
    }

    async function autoAssign() {
        const messages = [];
        if (errorMessageDiv) errorMessageDiv.textContent = '';
        const startRoom = parseInt(startRoomInput.value, 10);
        const startDay = parseInt(startDaySelect.value, 10);
        const dayDivs = calendar.querySelectorAll('.day');
        const daysInMonth = dayDivs.length;

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

        if (excludedRooms.size === 54) {
            const msg = texts[currentLang].allExcluded || 'All rooms excluded';
            if (errorMessageDiv) {
                errorMessageDiv.textContent = msg;
            } else {
                alert(msg);
            }
            return;
        }

        let room = startRoom;
        const visited = new Set();
        const updates = [];
        for (let i = startDay - 1; i < dayDivs.length; i++) {
            let safety = 0;
            while (excludedRooms.has(room) || visited.has(room)) {
                room++;
                if (room > 54) room = 1;
                if (++safety > 54) break;
            }
            const wrapper = dayDivs[i].querySelector('.room-input');
            const inputs = wrapper.querySelectorAll('input');
            inputs.forEach((inp, idx) => {
                if (idx === 0) {
                    inp.value = '';
                } else {
                    inp.remove();
                }
            });
            const rooms = [room];
            if (linkedRooms.has(room)) {
                linkedRooms.get(room).forEach(r => {
                    if (!excludedRooms.has(r) && !visited.has(r) && !rooms.includes(r)) {
                        rooms.push(r);
                    }
                });
            }
            rooms.forEach(r => visited.add(r));
            if (inputs.length) {
                inputs[0].value = rooms.join(' / ');
            }
            if (isAdmin) {
                const month = parseInt(monthSelect.value, 10);
                const year = parseInt(yearSelect.value, 10);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                updates.push({ date: dateStr, chambre: rooms.join(' / ') });
            }
            room++;
            if (room > 54) room = 1;
        }
        if (isAdmin && updates.length) {
            try {
                const existing = await fetchAssignments();
                const map = {};
                existing.forEach(a => { map[a.date] = a.chambres.join(' / '); });
                updates.forEach(u => { map[u.date] = u.chambre; });
                const all = Object.entries(map).map(([date, chambre]) => ({ date, chambre }));
                await saveAssignments(all);
            } catch (err) {
                console.error(err);
                showRequestError(`Erreur lors de l'enregistrement : ${err.message}`);
            }
        }
    }

    async function clearCalendar() {
        const dayDivs = calendar.querySelectorAll('.day');
        const deleteDates = [];

        dayDivs.forEach((div, idx) => {
            const inputs = div.querySelectorAll('input');
            inputs.forEach((inp, i) => {
                if (i === 0) {
                    inp.value = '';
                } else {
                    inp.remove();
                }
            });
            if (isAdmin) {
                const month = parseInt(monthSelect.value, 10);
                const year = parseInt(yearSelect.value, 10);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(idx + 1).padStart(2, '0')}`;
                deleteDates.push(dateStr);
            }
        });

        if (isAdmin && deleteDates.length) {
            try {
                await deleteAssignments(deleteDates);
            } catch (err) {
                console.error(err);
                showRequestError(`Erreur suppression : ${err.message || JSON.stringify(err)}`);
            }
        }
    }


    function addExcludedRoom() {
        const num = parseInt(excludeRoomInput.value, 10);
        if (!isNaN(num) && num >= 1 && num <= 54 && num !== 13) {
            excludedRooms.add(num);
            updateExcludedList();
        }
        excludeRoomInput.value = '';
    }

    function addLinkedRoom(roomA, roomB) {
        if (!linkedRooms.has(roomA)) linkedRooms.set(roomA, new Set());
        if (!linkedRooms.has(roomB)) linkedRooms.set(roomB, new Set());
        linkedRooms.get(roomA).add(roomB);
        linkedRooms.get(roomB).add(roomA);
    }

    function removeLinkedRoom(roomA, roomB) {
        if (linkedRooms.has(roomA)) {
            linkedRooms.get(roomA).delete(roomB);
            if (linkedRooms.get(roomA).size === 0) linkedRooms.delete(roomA);
        }
        if (linkedRooms.has(roomB)) {
            linkedRooms.get(roomB).delete(roomA);
            if (linkedRooms.get(roomB).size === 0) linkedRooms.delete(roomB);
        }
    }

    function updateLinkedList() {
        if (!linkedListDiv) return;
        linkedListDiv.innerHTML = '';
        const pairs = [];
        linkedRooms.forEach((set, a) => {
            set.forEach(b => {
                if (a < b) pairs.push([a, b]);
            });
        });
        pairs.sort((p1, p2) => p1[0] - p2[0] || p1[1] - p2[1]);
        pairs.forEach(([a, b]) => {
            const item = document.createElement('span');
            item.className = 'linked-item';
            item.textContent = `${a} ⇔ ${b}`;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'remove-link';
            btn.textContent = '×';
            btn.addEventListener('click', () => {
                removeLinkedRoom(a, b);
                updateLinkedList();
            });
            item.appendChild(btn);
            linkedListDiv.appendChild(item);
        });
    }


    monthSelect.addEventListener('change', generateCalendar);
    yearSelect.addEventListener('change', generateCalendar);

    calendar.addEventListener('change', async e => {
        if (!(e.target instanceof HTMLInputElement)) return;
        const dayDiv = e.target.closest('.day');
        if (!dayDiv) return;
        if (!isAdmin) return;
        const day = parseInt(e.target.dataset.day, 10);
        if (!day) return;
        const wrapper = dayDiv.querySelector('.room-input');
        const inputs = wrapper.querySelectorAll('input');

        let values = Array.from(inputs)
            .map(inp => inp.value)
            .join(' / ')
            .split('/')
            .map(v => v.trim())
            .filter(v => v);

        values.slice().forEach(v => {
            const num = parseInt(v, 10);
            if (!isNaN(num) && linkedRooms.has(num)) {
                linkedRooms.get(num).forEach(r => {
                    const s = String(r);
                    if (!values.includes(s)) values.push(s);
                });
            }
        });

        const joined = values.join(' / ');
        if (inputs.length) {
            inputs[0].value = joined;
            for (let i = 1; i < inputs.length; i++) inputs[i].remove();
        }

        const value = joined;
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearSelect.value, 10);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        try {
            await saveAssignment(dateStr, value);
        } catch (err) {
            console.error(err);
            showRequestError(`Erreur sauvegarde : ${err.message}`);
        }
    });

    printBtn.addEventListener('click', () => {
        const before = currentLang;
        const savedValues = Array.from(calendar.querySelectorAll('.day input')).map(inp => inp.value);
        if (before !== 'fr') {
            setLanguage('fr');
            restoreInputs(calendar, savedValues);
            window.addEventListener(
                'afterprint',
                () => {
                    setLanguage(before);
                    restoreInputs(calendar, savedValues);
                },
                { once: true }
            );
        }
        window.print();
    });

    initThemeSwitcher(themeSwitcher);
    initLangSwitcher(langSwitcher, () => currentLang, setLanguage);
    if (autoAssignBtn) {
        autoAssignBtn.addEventListener('click', autoAssign);
    }
    if (clearCalendarBtn) {
        clearCalendarBtn.addEventListener('click', clearCalendar);
    }
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', () => {
            const a = parseInt(linkRoomAInput.value, 10);
            const b = parseInt(linkRoomBInput.value, 10);
            if (
                !isNaN(a) &&
                !isNaN(b) &&
                a >= 1 &&
                a <= 54 &&
                b >= 1 &&
                b <= 54 &&
                a !== b &&
                a !== 13 &&
                b !== 13
            ) {
                addLinkedRoom(a, b);
                updateLinkedList();
            }
            linkRoomAInput.value = '';
            linkRoomBInput.value = '';
        });
    }
    if (linkRoomAInput && linkRoomBInput) {
        [linkRoomAInput, linkRoomBInput].forEach(inp => {
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (addLinkBtn) addLinkBtn.click();
                }
            });
        });
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
            if (pass === (window.ADMIN_PASS || 's00r1')) {
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

    setLanguage(currentLang);
    updateAdminControls();
    updateExcludedList();
    updateLinkedList();
});
