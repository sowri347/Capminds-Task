console.log("dashboard.js loaded");

let filteredAppointments = null;

/* =========================
   RENDER DASHBOARD
========================= */
function renderDashboard() {
  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const data =
    filteredAppointments !== null
      ? filteredAppointments
      : window.appointmentsStore;

  data.forEach(item => {
    // IMPORTANT: get real index from global store
    const storeIndex = window.appointmentsStore.indexOf(item);

    const row = document.createElement("div");
    row.className = "table-row";

    row.innerHTML = `
      <a class="link">${item.patient}</a>
      <a class="link">${item.doctor}</a>
      <div>${item.hospital}</div>
      <div>${item.specialty}</div>
      <div>${formatDate(item.date)}</div>
      <a class="link">${formatTime(item.time)}</a>
      <div class="actions">
        <!-- EDIT -->
        <svg class="edit-btn" data-index="${storeIndex}" width="18" height="17" viewBox="0 0 18 17">
          <path d="M0 15H17.5V16.25H0V15ZM14.625 4.375L5.25 13.75H1.25V9.75L10.625 0.375L14.625 4.375Z"
                fill="#2C7BEF"/>
        </svg>

        <!-- DELETE -->
        <svg class="delete-btn" data-index="${storeIndex}" width="16" height="18" viewBox="0 0 16 18">
          <path d="M3 18C1.9 18 1 17.1 1 16V3H0V1H5V0H11V1H16V3H15V16C15 17.1 14.1 18 13 18H3Z"
                fill="#E23D28"/>
        </svg>
      </div>
    `;

    tableBody.appendChild(row);
  });

  // Maintain empty rows
  for (let i = data.length; i < 6; i++) {
    const empty = document.createElement("div");
    empty.className = "empty-row";
    tableBody.appendChild(empty);
  }
}

/* =========================
   LIVE SEARCH (PATIENT + DOCTOR)
========================= */
document.addEventListener("input", e => {
  if (!e.target.classList.contains("filter-input")) return;

  const inputs = document.querySelectorAll(".filter-input");
  const patientQ = inputs[0].value.toLowerCase();
  const doctorQ = inputs[1].value.toLowerCase();

  filteredAppointments = window.appointmentsStore.filter(a =>
    a.patient.toLowerCase().includes(patientQ) &&
    a.doctor.toLowerCase().includes(doctorQ)
  );

  renderDashboard();
});

/* =========================
   DATE RANGE FILTER (UPDATE)
========================= */
document.addEventListener("click", e => {
  if (!e.target.classList.contains("update-btn")) return;

  const inputs = document.querySelectorAll(".filter-input");
  const fromDate = inputs[2].value;
  const toDate = inputs[3].value;

  if (!fromDate || !toDate) {
    filteredAppointments = null;
    renderDashboard();
    return;
  }

  filteredAppointments = window.appointmentsStore.filter(a =>
    a.date >= fromDate && a.date <= toDate
  );

  renderDashboard();
});

/* =========================
   EDIT HANDLER
========================= */
document.addEventListener("click", e => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  const index = Number(editBtn.dataset.index);

  if (typeof window.openEditAppointment === "function") {
    window.openEditAppointment(index);
  }
});

/* =========================
   DELETE HANDLER
========================= */
document.addEventListener("click", e => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;

  const index = Number(deleteBtn.dataset.index);

  if (!confirm("Delete this appointment?")) return;

  window.appointmentsStore.splice(index, 1);

  filteredAppointments = null;

  renderDashboard();

  if (typeof window.renderCalendar === "function") {
    window.renderCalendar();
  }
});

/* =========================
   HELPERS
========================= */
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTime(time24) {
  const [h, m] = time24.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

/* =========================
   INIT
========================= */
window.renderDashboard = renderDashboard;
renderDashboard();
