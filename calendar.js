document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const calendar = document.getElementById('calendar');
    const generateBtn = document.getElementById('generate');
    const printBtn = document.getElementById('print');
    const subtitle = document.getElementById('subtitle');
    const adminBtn = document.getElementById('admin-login');
    const startRoomInput = document.getElementById('start-room');
    const startDaySelect = document.getElementById('start-day');
    const autoAssignBtn = document.getElementById('auto-assign');

    let isAdmin = false;

    function updateAdminControls() {
        if (startRoomInput) startRoomInput.style.display = isAdmin ? 'inline-block' : 'none';
        if (startDaySelect) startDaySelect.style.display = isAdmin ? 'inline-block' : 'none';
        if (autoAssignBtn) {
            autoAssignBtn.style.display = isAdmin ? 'inline-block' : 'none';
            autoAssignBtn.disabled = !isAdmin;
        }
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
        ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].forEach(day => {
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
        for (let d = 1; d <= daysInMonth; d++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 54;
            input.placeholder = 'Chambre';
            input.disabled = !isAdmin;
            input.addEventListener('input', function () {
                if (this.value === '13') this.value = '';
            });
            dayDiv.textContent = d;
            dayDiv.appendChild(document.createElement('br'));
            dayDiv.appendChild(input);
            calendar.appendChild(dayDiv);
        }
        updateAdminControls();
    }

    function autoAssign() {
        const startRoom = parseInt(startRoomInput.value, 10);
        const startDay = parseInt(startDaySelect.value, 10);
        const dayInputs = calendar.querySelectorAll('.day input');
        const daysInMonth = dayInputs.length;
        if (isNaN(startRoom) || isNaN(startDay) || startRoom < 1 || startRoom > 54 || startRoom === 13 || startDay < 1 || startDay > daysInMonth) {
            alert('Valeurs invalides');
            return;
        }
        let room = startRoom;
        for (let i = startDay - 1; i < dayInputs.length; i++) {
            dayInputs[i].value = room;
            room++;
            if (room === 13) room++;
            if (room > 54) room = 1;
        }
    }

    // Update calendar whenever the month or year selection changes
    monthSelect.addEventListener('change', generateCalendar);
    yearSelect.addEventListener('change', generateCalendar);

    generateBtn.addEventListener('click', generateCalendar);
    printBtn.addEventListener('click', () => window.print());
    if (autoAssignBtn) {
        autoAssignBtn.addEventListener('click', autoAssign);
    }
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
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

    updateAdminControls();
    generateCalendar();
});
