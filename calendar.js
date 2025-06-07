document.addEventListener('DOMContentLoaded', () => {
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
    const excludeRoomInput = document.getElementById('exclude-room');
    const addExcludeBtn = document.getElementById('add-exclude');
    const excludedListDiv = document.getElementById('excluded-list');
    const errorMessageDiv = document.getElementById('error-message');
    const themeSwitcher = document.getElementById('themeSwitcher');
    const logoutModal = document.getElementById('logout-modal');
    const logoutConfirm = document.getElementById('logout-confirm');
    const logoutCancel = document.getElementById('logout-cancel');

    let isAdmin = false;
    const excludedRooms = new Set([13]);


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
        setDayInputsDisabled(!isAdmin);
        updateExcludedList();
    }

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    const today = new Date();
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = monthNames[i];
        monthSelect.appendChild(option);
    }
    for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 1; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }
    monthSelect.value = today.getMonth();
    yearSelect.value = today.getFullYear();

    function createHeader() {
        const fullDayNames = [
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi',
            'Dimanche',
        ];
        fullDayNames.forEach(day => {
            const div = document.createElement('div');
            div.className = 'header';
            div.textContent = day;
            calendar.appendChild(div);
        });
    }

    function generateCalendar() {
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearSelect.value, 10);
        calendar.innerHTML = '';
        createHeader();
        if (subtitle) {
            subtitle.textContent = `Pour le mois de ${monthNames[month]} ${year}`;
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
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        for (let d = 1; d <= daysInMonth; d++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'room-input';
            const prefix = document.createElement('span');
            prefix.className = 'room-prefix';
            prefix.textContent = '#';
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 54;
            input.placeholder = 'Chambre';
            input.disabled = !isAdmin;
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
        updateAdminControls();
    }

    function autoAssign() {
        const messages = [];
        if (errorMessageDiv) errorMessageDiv.textContent = '';
        const startRoom = parseInt(startRoomInput.value, 10);
        const startDay = parseInt(startDaySelect.value, 10);
        const dayInputs = calendar.querySelectorAll('.day input');
        const daysInMonth = dayInputs.length;

        if (isNaN(startRoom) || startRoom < 1 || startRoom > 54 || excludedRooms.has(startRoom)) {
            messages.push('La chambre de départ est invalide');
        }
        if (isNaN(startDay) || startDay < 1 || startDay > daysInMonth) {
            messages.push('La date de début est hors du mois');
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

    // Update calendar whenever the month or year selection changes
    monthSelect.addEventListener('change', generateCalendar);
    yearSelect.addEventListener('change', generateCalendar);

    printBtn.addEventListener('click', () => window.print());
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
    if (autoAssignBtn) {
        autoAssignBtn.addEventListener('click', autoAssign);
    }
    if (addExcludeBtn) {
        addExcludeBtn.addEventListener('click', () => {
            const num = parseInt(excludeRoomInput.value, 10);
            if (!isNaN(num) && num >= 1 && num <= 54 && num !== 13) {
                excludedRooms.add(num);
                updateExcludedList();
            }
            excludeRoomInput.value = '';
        });
    }
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            if (isAdmin) {
                if (logoutModal) logoutModal.style.display = 'flex';
                return;
            }
            const pass = prompt('Mot de passe admin ?');
            if (pass === 's00r1') {
                isAdmin = true;
                alert('Mode \u00e9dition activ\u00e9');
                generateCalendar();
                updateAdminControls();
            } else {
                alert('Mot de passe incorrect');
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

    updateAdminControls();
    generateCalendar();
    updateExcludedList();
});
