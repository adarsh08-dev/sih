let currentMode = "login"; // "login" or "register"

const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const authForm = document.getElementById("authForm");
const authAlert = document.getElementById("authAlert");
const authSubmitBtn = document.getElementById("authSubmitBtn");

const groupName = document.getElementById("groupName");
const groupRole = document.getElementById("groupRole");
const authRole = document.getElementById("authRole");
const groupExtraStudent = document.getElementById("groupExtraStudent");
const groupExtraMentor = document.getElementById("groupExtraMentor");
const groupExtraCompany = document.getElementById("groupExtraCompany");

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
    groupRole.classList.add("hidden");
    groupExtraStudent.classList.add("hidden");
    groupExtraMentor.classList.add("hidden");
    groupExtraCompany.classList.add("hidden");
    authSubmitBtn.textContent = "Sign In";
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    groupName.classList.remove("hidden");
    groupRole.classList.remove("hidden");
    updateRoleFields();
    authSubmitBtn.textContent = "Create Account";
  }
}

// Role dropdown change
authRole.addEventListener("change", updateRoleFields);

function updateRoleFields() {
  if (currentMode !== "register") return;
  const role = authRole.value;
  groupExtraStudent.classList.toggle("hidden", role !== "student");
  groupExtraMentor.classList.toggle("hidden", role !== "mentor");
  groupExtraCompany.classList.toggle("hidden", role !== "company");
}

function showAlert(message, isError = true) {
  authAlert.textContent = message;
  authAlert.className = `auth-alert ${isError ? "error" : "success"}`;
  authAlert.classList.remove("hidden");
}

function hideAlert() {
  authAlert.classList.add("hidden");
}

// Handle Form Submit
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;

  authSubmitBtn.disabled = true;
  authSubmitBtn.textContent = "Processing...";

  try {
    if (currentMode === "login") {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save token and user
      localStorage.setItem("skillbridge_token", data.token);
      localStorage.setItem("skillbridge_user", JSON.stringify(data.user));

      showAlert("Login successful! Redirecting...", false);
      setTimeout(() => { window.location.href = "index.html"; }, 800);
    } else {
      const name = document.getElementById("authName").value.trim();
      const role = authRole.value;
      const extraInfo = {
        targetRole: document.getElementById("studentTargetRole")?.value.trim(),
        company: document.getElementById("mentorCompany")?.value.trim(),
        industry: document.getElementById("companyName")?.value.trim()
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, extraInfo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Save session
      localStorage.setItem("skillbridge_token", data.token);
      localStorage.setItem("skillbridge_user", JSON.stringify(data.user));

      showAlert("Account created successfully! Redirecting...", false);
      setTimeout(() => { window.location.href = "index.html"; }, 800);
    }
  } catch (err) {
    showAlert(err.message, true);
  } finally {
    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = currentMode === "login" ? "Sign In" : "Create Account";
  }
});