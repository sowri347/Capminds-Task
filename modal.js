console.log("modal.js loaded");

let editingIndex = null;

/* =========================
   OPEN / CLOSE MODAL
========================= */
function openModal() {
  const modal = document.getElementById("appointmentModal");
  if (!modal) return;

  // 🔴 CRITICAL FIX:
  // Reset edit state so new appointment does NOT overwrite old
  editingIndex = null;

  // Clear all fields every time modal opens
  const selects = modal.querySelectorAll("select.field-input");
  const dateInput = modal.querySelector("input[type='date']");
  const timeInput = modal.querySelector("input[type='time']");
  const reasonInput = modal.querySelector(".reason-input");

  selects.forEach(s => (s.selectedIndex = 0));
  if (dateInput) dateInput.value = "";
  if (timeInput) timeInput.value = "";
  if (reasonInput) reasonInput.value = "";

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("appointmentModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

window.openModal = openModal;
window.closeModal = closeModal;

/* =========================
   OPEN MODAL FOR EDIT (GLOBAL)
========================= */
window.openEditAppointment = function (storeIndex) {
  editingIndex = storeIndex;

  const appt = window.appointmentsStore[storeIndex];
  const modal = document.getElementById("appointmentModal");
  if (!modal) return;

  const selects = modal.querySelectorAll("select.field-input");
  const dateInput = modal.querySelector("input[type='date']");
  const timeInput = modal.querySelector("input[type='time']");
  const reasonInput = modal.querySelector(".reason-input");

  selects[0].value = appt.patient;
  selects[1].value = appt.doctor;
  selects[2].value = appt.hospital;
  selects[3].value = appt.specialty;
  dateInput.value = appt.date;
  timeInput.value = appt.time;
  reasonInput.value = appt.reason || "";

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

/* =========================
   SAVE HANDLER
========================= */
document.addEventListener("click", e => {
  const saveBtn = e.target.closest(".btn-primary");
  if (!saveBtn) return;

  const modal = document.getElementById("appointmentModal");
  if (!modal || !modal.classList.contains("active")) return;

  e.preventDefault();

  const selects = modal.querySelectorAll("select.field-input");
  const dateInput = modal.querySelector("input[type='date']");
  const timeInput = modal.querySelector("input[type='time']");
  const reasonInput = modal.querySelector(".reason-input");

  const appointment = {
    patient: selects[0].value,
    doctor: selects[1].value,
    hospital: selects[2].value,
    specialty: selects[3].value,
    date: dateInput.value,
    time: timeInput.value,
    reason: reasonInput.value
  };

  if (!appointment.patient || !appointment.doctor || !appointment.date || !appointment.time) {
    alert("Please fill all required fields");
    return;
  }

  /* =========================
     SAVE TO GLOBAL STORE
  ========================= */
  if (editingIndex !== null) {
    // EDIT
    window.appointmentsStore[editingIndex] = appointment;
    editingIndex = null;
  } else {
    // CREATE (multiple allowed on same day)
    window.appointmentsStore.push(appointment);
  }

  /* =========================
     UPDATE UI
  ========================= */
  if (typeof window.renderCalendar === "function") {
    window.renderCalendar();
  }
  if (typeof window.renderDashboard === "function") {
    window.renderDashboard();
  }

  /* =========================
     CLOSE MODAL
  ========================= */
  closeModal();
});
