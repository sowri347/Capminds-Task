console.log("calendar.js loaded");

let current = new Date();

/* =========================
   DEFAULT SELECTED DATE = TODAY
========================= */
let selectedDate =
  current.getFullYear() +
  "-" +
  String(current.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(current.getDate()).padStart(2, "0");

/* =========================
   RENDER CALENDAR
========================= */
function renderCalendar() {
  const calendarDays = document.getElementById("calendarDays");
  const currentDateLabel = document.getElementById("currentDateLabel");
  const dayHeaders = document.querySelectorAll(".day-name");

  if (!calendarDays || !currentDateLabel) return;

  calendarDays.innerHTML = "";

  currentDateLabel.innerText = current.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  /* =========================
     HIGHLIGHT TODAY HEADER
  ========================= */
  const todayIndex = new Date().getDay(); // 0–6
  dayHeaders.forEach((h, i) => {
    h.classList.toggle("today-header", i === todayIndex);
  });

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const dateStr =
      cellDate.getFullYear() +
      "-" +
      String(cellDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(cellDate.getDate()).padStart(2, "0");

    const dayDiv = document.createElement("div");
    dayDiv.className = "day";

    if (cellDate.getMonth() !== month) {
      dayDiv.classList.add("other-month");
    }

    if (dateStr === selectedDate) {
      dayDiv.classList.add("selected");
    }

    if (cellDate.toDateString() === new Date().toDateString()) {
      dayDiv.classList.add("today");
    }

    dayDiv.innerHTML = `
      <div class="day-number">${cellDate.getDate()}</div>
    `;

    /* =========================
       SELECT DAY
    ========================= */
    dayDiv.addEventListener("click", () => {
      selectedDate = dateStr;
      renderCalendar();
    });

    /* =========================
       APPOINTMENTS
    ========================= */
    window.appointmentsStore
      .filter(a => a.date === dateStr)
      .forEach(a => {
        dayDiv.innerHTML += `
          <div class="appointment">
            ${a.patient} (${a.doctor}) ${formatTime(a.time)}
          </div>
        `;
      });

    calendarDays.appendChild(dayDiv);
  }

  updateCalendarOwner();
}

/* =========================
   OWNER ROW
========================= */
function updateCalendarOwner() {
  const owner = document.querySelector(".calendar-owner");
  if (!owner) return;

  const todaysAppointments = window.appointmentsStore.filter(
    a => a.date === selectedDate
  );

  if (todaysAppointments.length === 0) {
    owner.style.display = "none";
    return;
  }

  const patients = [
    ...new Set(todaysAppointments.map(a => a.patient))
  ];

  owner.innerText = patients.join(", ");
  owner.style.display = "flex";
}

/* =========================
   NAVIGATION
========================= */
function prevMonth() {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
}

function goToday() {
  current = new Date();
  selectedDate =
    current.getFullYear() +
    "-" +
    String(current.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(current.getDate()).padStart(2, "0");
  renderCalendar();
}

/* =========================
   HELPERS
========================= */
function formatTime(time24) {
  const [h, m] = time24.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

/* =========================
   EXPORTS
========================= */
window.renderCalendar = renderCalendar;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.goToday = goToday;
function changeMonth(monthIndex) {
  if (monthIndex === "") return;

  current.setMonth(parseInt(monthIndex, 10));
  renderCalendar();
}
