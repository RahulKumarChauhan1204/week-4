// Storage Key
const STORAGE_KEY = "students_dashboard_data";

// Seed Data
const defaultStudents = [
  {
    id: "1",
    rollNo: "CS2026-001",
    fullName: "Aarav Sharma",
    email: "aarav@example.com",
    course: "Computer Science",
    year: "4th Year",
    status: "Active"
  },
  {
    id: "2",
    rollNo: "AI2026-042",
    fullName: "Priya Patel",
    email: "priya.p@example.com",
    course: "AI & ML",
    year: "3rd Year",
    status: "Active"
  },
  {
    id: "3",
    rollNo: "IT2025-019",
    fullName: "Rohan Verma",
    email: "rohan.v@example.com",
    course: "Information Technology",
    year: "4th Year",
    status: "Graduated"
  }
];

// App State
let students = loadStudents();

// DOM Elements
const studentTableBody = document.getElementById("studentTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const statusFilter = document.getElementById("statusFilter");

const modal = document.getElementById("studentModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const modalTitle = document.getElementById("modalTitle");

const studentForm = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const rollNoInput = document.getElementById("rollNo");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const yearInput = document.getElementById("year");
const statusInput = document.getElementById("status");

// LocalStorage Helpers
function loadStudents() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudents));
    return defaultStudents;
  }
  return JSON.parse(data);
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Render Table
function renderStudents() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCourse = courseFilter.value;
  const selectedStatus = statusFilter.value;

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm) ||
      s.rollNo.toLowerCase().includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm);

    const matchesCourse = selectedCourse === "all" || s.course === selectedCourse;
    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  studentTableBody.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach((student) => {
    const tr = document.createElement("tr");

    const badgeClass =
      student.status === "Active"
        ? "badge-active"
        : student.status === "Graduated"
        ? "badge-graduated"
        : "badge-suspended";

    tr.innerHTML = `
      <td><strong>${escapeHTML(student.rollNo)}</strong></td>
      <td>${escapeHTML(student.fullName)}</td>
      <td>${escapeHTML(student.email)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>${escapeHTML(student.year)}</td>
      <td><span class="badge ${badgeClass}">${escapeHTML(student.status)}</span></td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm" onclick="handleEdit('${student.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="handleDelete('${student.id}')">Delete</button>
      </td>
    `;
    studentTableBody.appendChild(tr);
  });
}

// Modal Handlers
function openModal(editMode = false) {
  modal.classList.remove("hidden");
  modalTitle.textContent = editMode ? "Edit Student Record" : "Add Student Record";
}

function closeModal() {
  modal.classList.add("hidden");
  studentForm.reset();
  studentIdInput.value = "";
}

// Form Submission (Create / Update)
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = studentIdInput.value;
  const newStudent = {
    id: id || Date.now().toString(),
    rollNo: rollNoInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value,
    year: yearInput.value,
    status: statusInput.value
  };

  if (id) {
    // Edit existing
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
      students[index] = newStudent;
    }
  } else {
    // Add new
    students.unshift(newStudent);
  }

  saveStudents();
  renderStudents();
  closeModal();
});

// Edit Trigger
window.handleEdit = function (id) {
  const target = students.find((s) => s.id === id);
  if (!target) return;

  studentIdInput.value = target.id;
  rollNoInput.value = target.rollNo;
  fullNameInput.value = target.fullName;
  emailInput.value = target.email;
  courseInput.value = target.course;
  yearInput.value = target.year;
  statusInput.value = target.status;

  openModal(true);
};

// Delete Trigger
window.handleDelete = function (id) {
  const confirmDelete = confirm("Are you sure you want to delete this record?");
  if (confirmDelete) {
    students = students.filter((s) => s.id !== id);
    saveStudents();
    renderStudents();
  }
};

// Utility to escape injected HTML
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Event Listeners
openModalBtn.addEventListener("click", () => openModal(false));
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
statusFilter.addEventListener("change", renderStudents);

// Initial Render
renderStudents();