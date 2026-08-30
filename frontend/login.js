import { COLLEGES_LIST } from './colleges.js';

let currentMode = "login"; // "login" or "register"
let selectedCollege = COLLEGES_LIST.find(c => c.id === 'mjpru') || COLLEGES_LIST[0];

const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const authForm = document.getElementById("authForm");
const authAlert = document.getElementById("authAlert");
const authSubmitBtn = document.getElementById("authSubmitBtn");

const groupName = document.getElementById("groupName");
const groupRole = document.getElementById("groupRole");
const authRole = document.getElementById("authRole");
const groupExtraStudent = document.getElementById("groupExtraStudent");
const groupExtraHod = document.getElementById("groupExtraHod");
const groupExtraMentor = document.getElementById("groupExtraMentor");

// Initialize College Selector & Check parameters
window.addEventListener("DOMContentLoaded", () => {
  initCollegeSelector();

  const urlParams = new URLSearchParams(window.location.search);
  const flashError = localStorage.getItem("auth_flash_error");
  
  if (urlParams.get("error") === "unauthorized" || flashError) {
    showAlert("Unauthorized Access - Please login with correct role", true);
    localStorage.removeItem("auth_flash_error");
  }

  // Preselect role if passed in query param
  const roleParam = urlParams.get("role");
  if (roleParam && ["student", "hod", "mentor"].includes(roleParam)) {
    authRole.value = roleParam;
    updateRoleFields();
  }
});

function initCollegeSelector() {
  const storedId = localStorage.getItem('selected_college_id');
  if (storedId) {
    const found = COLLEGES_LIST.find(c => c.id === storedId);
    if (found) selectedCollege = found;
  } else {
    localStorage.setItem('selected_college_id', selectedCollege.id);
    localStorage.setItem('selected_college_name', selectedCollege.name);
    localStorage.setItem('selected_college_short', selectedCollege.short);
  }

  updateSelectedCollegeUI();

  const searchInput = document.getElementById('collegeSearchInput');
  const dropdownList = document.getElementById('collegeDropdownList');

  if (searchInput && dropdownList) {
    searchInput.addEventListener('focus', () => {
      renderCollegeOptions(COLLEGES_LIST);
      dropdownList.style.display = 'block';
    });

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = COLLEGES_LIST.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.short.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q)
      );
      renderCollegeOptions(filtered);
      dropdownList.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdownList.contains(e.target)) {
        dropdownList.style.display = 'none';
      }
    });
  }
}

function renderCollegeOptions(list) {
  const dropdownList = document.getElementById('collegeDropdownList');
  if (!dropdownList) return;

  if (list.length === 0) {
    dropdownList.innerHTML = `<div style="padding: 12px; font-size: 13px; color: #94A3B8; text-align: center;">No matching institute found. Select Other below.</div>`;
    return;
  }

  dropdownList.innerHTML = list.map(c => `
    <div onclick="selectCollege('${c.id}')" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.04);" onmouseover="this.style.background='rgba(124,92,252,0.1)'" onmouseout="this.style.background='transparent'">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #7C5CFC; color: #FFF; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${c.logo || c.short}</div>
        <div>
          <div style="font-size: 13px; font-weight: 600; color: #FFF;">${c.name}</div>
          <div style="font-size: 11px; color: #94A3B8;">${c.city}</div>
        </div>
      </div>
      <span style="font-size: 11px; font-weight: 600; background: rgba(124,92,252,0.15); color: #A78BFA; padding: 3px 8px; border-radius: 20px;">${c.city}</span>
    </div>
  `).join('');
}

window.selectCollege = function(id) {
  const found = COLLEGES_LIST.find(c => c.id === id);
  if (found) {
    selectedCollege = found;
    localStorage.setItem('selected_college_id', found.id);
    localStorage.setItem('selected_college_name', found.name);
    localStorage.setItem('selected_college_short', found.short);
    updateSelectedCollegeUI();
    const dropdownList = document.getElementById('collegeDropdownList');
    if (dropdownList) dropdownList.style.display = 'none';
    const searchInput = document.getElementById('collegeSearchInput');
    if (searchInput) searchInput.value = '';
  }
};

function updateSelectedCollegeUI() {
  const logoEl = document.getElementById('selCollegeLogo');
  const nameEl = document.getElementById('selCollegeName');
  const cityEl = document.getElementById('selCollegeCity');
  if (logoEl) logoEl.textContent = selectedCollege.logo || selectedCollege.short;
  if (nameEl) nameEl.textContent = selectedCollege.name;
  if (cityEl) cityEl.textContent = selectedCollege.city;
}

// Switch Tabs
tabLogin.addEventListener("click", () => setMode("login"));
tabRegister.addEventListener("click", () => setMode("register"));

function setMode(mode) {
  currentMode = mode;
  hideAlert();
  if (mode === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    groupName.classList.add("hidden");
    groupExtraStudent.classList.add("hidden");
    groupExtraHod.classList.add("hidden");
    groupExtraMentor.classList.add("hidden");
    authSubmitBtn.textContent = "Sign In";
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    groupName.classList.remove("hidden");
    updateRoleFields();
    authSubmitBtn.textContent = "Create Account";
  }
}

// Role dropdown change
authRole.addEventListener("change", updateRoleFields);

function updateRoleFields() {
  if (currentMode !== "register") return;
  const role = authRole.value;
  if (groupExtraStudent) groupExtraStudent.classList.toggle("hidden", role !== "student");
  if (groupExtraHod) groupExtraHod.classList.toggle("hidden", role !== "hod");
  if (groupExtraMentor) groupExtraMentor.classList.toggle("hidden", role !== "mentor");
}

function showAlert(message, isError = true) {
  authAlert.textContent = message;
  authAlert.className = `auth-alert ${isError ? "error" : "success"}`;
  authAlert.classList.remove("hidden");
}

function hideAlert() {
  authAlert.classList.add("hidden");
}

function routeToDashboard(role) {
  if (role === "student") {
    localStorage.setItem("role", "student");
    window.location.href = "/student-dashboard";
  } else if (role === "hod") {
    localStorage.setItem("role", "hod");
    window.location.href = "/faculty-dashboard";
  } else if (role === "mentor") {
    localStorage.setItem("role", "mentor");
    window.location.href = "/mentor-dashboard";
  } else {
    localStorage.setItem("role", "student");
    window.location.href = "/student-dashboard";
  }
}

// Helper to save student profile in localStorage
function saveStudentProfileAndUser(name, email, role) {
  const rollNo = document.getElementById('rollNo')?.value?.trim() || "2201460100012";
  const year = document.getElementById('year')?.value || "3rd Year";
  const course = document.getElementById('course')?.value || "B.Tech Computer Science & IT";
  const emailVal = email || document.getElementById('authEmail')?.value?.trim() || "student@skillbridge.ai";

  const inputName = document.getElementById('authName')?.value?.trim() || document.getElementById('fullName')?.value?.trim();
  const rawName = name || inputName || (emailVal && emailVal.includes('@') ? emailVal.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim() : '') || "Student User";
  const firstName = rawName.split(' ')[0] || rawName;

  const profileData = {
    fullName: rawName,
    firstName: firstName,
    collegeId: selectedCollege.id,
    collegeName: selectedCollege.name,
    collegeShort: selectedCollege.short,
    email: emailVal,
    rollNo: rollNo,
    course: course,
    year: year,
    role: role || "student",
    isVerified: (emailVal && (emailVal.includes('.ac.in') || emailVal.includes('.edu'))) || true
  };
  localStorage.setItem('student_profile', JSON.stringify(profileData));
  localStorage.setItem('skillbridge_user', JSON.stringify(profileData));
  localStorage.setItem('userName', rawName);
  localStorage.setItem('selected_college_id', selectedCollege.id);
  localStorage.setItem('selected_college_name', selectedCollege.name);
  localStorage.setItem('selected_college_short', selectedCollege.short);
}

// Handle Form Submit
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  const role = authRole.value;
  const email = document.getElementById("authEmail").value.trim();

  authSubmitBtn.disabled = true;
  authSubmitBtn.textContent = "Processing...";

  try {
    const inputName = document.getElementById("authName")?.value.trim() || document.getElementById("fullName")?.value.trim();
    let fullName = inputName;
    if (!fullName) {
      if (email.includes("hod")) fullName = "Dr. Arvind K. Sharma";
      else if (email.includes("mentor")) fullName = "Rohan Mehta";
      else fullName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim() || "Student User";
    }

    saveStudentProfileAndUser(fullName, email, role);
    localStorage.setItem("role", role);
    localStorage.setItem("skillbridge_token", "demo-jwt-token-active");

    showAlert(`Signed in as ${fullName}! Loading portal...`, false);
    setTimeout(() => {
      routeToDashboard(role);
    }, 400);

  } catch (err) {
    showAlert(err.message || "Authentication error", true);
    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = currentMode === "login" ? "Sign In" : "Create Account";
  }
});

// Demo Logins
function demoLogin(role) {
  hideAlert();
  let name = "";
  let email = "student@skillbridge.ai";

  if (role === "hod") {
    name = "Dr. Arvind K. Sharma";
    email = "hod.csit@university.edu";
  } else if (role === "mentor") {
    name = "Rohan Mehta";
    email = "mentor@skillbridge.ai";
  } else {
    name = document.getElementById("authName")?.value.trim() || document.getElementById("fullName")?.value.trim() || "Rahul Verma";
  }

  saveStudentProfileAndUser(name, email, role);
  localStorage.setItem("role", role);
  localStorage.setItem("skillbridge_token", "demo-jwt-token-active");
  
  showAlert(`Signed in as ${name} (${role.toUpperCase()})! Redirecting...`, false);
  setTimeout(() => {
    routeToDashboard(role);
  }, 350);
}

window.demoLogin = demoLogin;
