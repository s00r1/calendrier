document.addEventListener("DOMContentLoaded", function() {
    const calendar = document.getElementById("calendar");
    const eventDate = document.getElementById("event-date");
    const eventType = document.getElementById("event-type");
    const eventText = document.getElementById("event-text");
    const saveButton = document.getElementById("save-event");
    const deleteButton = document.getElementById("delete-event");
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");
    const currentMonthDisplay = document.getElementById("current-month");

    let events = JSON.parse(localStorage.getItem("events")) || {};
    let currentDate = new Date();

    const horaires = {
        ouverture: "07h00 - 15h00",
        fermeture: "15h00 - 23h00",
        nuit: "23h00 - 07h00",
        journee: "09h00 - 17h00",
        repos: ""
    };

    function displayCalendar() {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        let firstDay = new Date(year, month, 1).getDay();
        let daysInMonth = new Date(year, month + 1, 0).getDate();

        firstDay = firstDay === 0 ? 6 : firstDay - 1;

        currentMonthDisplay.textContent = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

        let html = "<div class='calendar-grid'>";

        const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
        html += daysOfWeek.map(day => `<div class="day-name">${day}</div>`).join('');

        let dayCounter = 1;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let dayClass = "day";
                if (i === 0 && j < firstDay) {
                    html += `<div class="day empty"></div>`;
                } else if (dayCounter > daysInMonth) {
                    html += `<div class="day empty"></div>`;
                } else {
                    let currentDay = new Date(year, month, dayCounter);
                    let event = events[`${year}-${String(month + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`];
                    if (event) {
                        dayClass += ` event-${event.type}`;
                    }
                    if (currentDay.toDateString() === new Date().toDateString()) {
                        dayClass += " today";
                    }
                    html += `<div class="${dayClass}" data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}">
                                <span>${dayCounter}</span>
                                <span class="event-type">${event ? event.type : ''}</span>
                                <span class="event-hours">${event ? horaires[event.type] : ''}</span>
                              </div>`;
                    dayCounter++;
                }
            }
        }

        html += "</div>";

        calendar.innerHTML = html;

        document.querySelectorAll(".day:not(.empty)").forEach(day => {
            day.addEventListener("click", function() {
                eventDate.value = this.dataset.date;
                eventType.value = events[this.dataset.date]?.type || "repos";
                eventText.value = events[this.dataset.date]?.note || "";
            });
        });
    }

    saveButton.addEventListener("click", function() {
        if (eventDate.value) {
            events[eventDate.value] = {
                type: eventType.value,
                note: eventText.value
            };
            localStorage.setItem("events", JSON.stringify(events));
            displayCalendar();
        }
    });

    deleteButton.addEventListener("click", function() {
        if (eventDate.value) {
            delete events[eventDate.value];
            localStorage.setItem("events", JSON.stringify(events));
            displayCalendar();
        }
    });

    prevMonthButton.addEventListener("click", function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        displayCalendar();
    });

    nextMonthButton.addEventListener("click", function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        displayCalendar();
    });

    displayCalendar();
});
