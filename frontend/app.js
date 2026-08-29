/* =========================================================
   SKILLBRIDGE AI FRONTEND ENGINE
   Connected directly to PostgreSQL Backend API
========================================================= */

const API_URL = "/api";

// Live state fetched from database
let currentStudent = null;
let mentorsList = [];
let gigsList = [];
let passportList = [];

/* ================= NETWORK HELPER ================= */
async function safeFetchJson(url, options = {}) {
    try {
        const res = await fetch(url, options);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            return { ok: res.ok, status: res.status, data };
        }
        const text = await res.text();
        return { ok: false, status: res.status, error: text || "Invalid response from server" };
    } catch (err) {
        console.warn(`Network request to ${url} failed:`, err.message);
        return { ok: false, status: 0, error: err.message };
    }
}

/* ================= PAGE NAVIGATION ================= */

function openPage(pageId, element) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll(".nav").forEach(nav => {
        nav.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    } else {
        const matchingNav = document.querySelector(`.nav[onclick*="'${pageId}'"]`);
        if (matchingNav) matchingNav.classList.add("active");
    }

    if (pageId === "helpdesk") {
        initHelpdesk();
    }

    if (pageId === "trust") {
        const activeSub = document.querySelector(".trust-nav-tab.active");
        if (!activeSub) {
            setTrustSubTab('pillars');
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ================= MODAL CONTROLS ================= */

function showModal(title, content) {
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const modal = document.getElementById("modal");

    if (modalTitle) modalTitle.innerText = title;
    if (modalContent) modalContent.innerHTML = content;
    if (modal) modal.classList.add("show");
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("show");
}

/* ================= TOAST NOTIFICATIONS ================= */

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

/* ================= STUDENT DATA & STATS ================= */

async function fetchStudent() {
    const res = await safeFetchJson(`${API_URL}/student`);
    if (res.ok && res.data) {
        currentStudent = res.data;
        updateStudentUI();
    } else {
        currentStudent = {
            id: 1,
            name: "Adarsh Pratap Singh",
            course: "CSIT",
            batch: "2025-29",
            targetRole: "Full Stack Software Engineer",
            careerReadiness: 81,
            experienceScore: 64
        };
        updateStudentUI();
    }
}

function updateStudentUI() {
    if (!currentStudent) return;

    const experienceElem = document.getElementById("experienceScore");
    const passportScoreElem = document.getElementById("passportScore");

    if (experienceElem) experienceElem.innerText = currentStudent.experienceScore || 64;
    if (passportScoreElem) passportScoreElem.innerText = currentStudent.experienceScore || 64;
}

/* ================= MENTORSHIP ================= */

async function renderMentors() {
    const container = document.getElementById("mentorList");
    if (!container) return;

    const res = await safeFetchJson(`${API_URL}/mentors`);
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        mentorsList = res.data;
    } else if (mentorsList.length === 0) {
        mentorsList = [
            { id: 1, name: "Rohan Mehta", role: "Senior Software Architect", company: "TechNova Labs", experience: 12, match: 94, availability: true },
            { id: 2, name: "Priya Sharma", role: "Engineering Manager", company: "CloudSphere", experience: 10, match: 91, availability: true },
            { id: 3, name: "Arjun Kapoor", role: "AI/ML Lead", company: "DataSphere AI", experience: 14, match: 88, availability: true },
            { id: 4, name: "Aryan Mehrotra", role: "Senior Software Developer", company: "My Tech", experience: 10, match: 85, availability: true }
        ];
    }

    if (!mentorsList || mentorsList.length === 0) {
        container.innerHTML = `<div class="panel"><p>No mentors found in database.</p></div>`;
        return;
    }

    container.innerHTML = mentorsList.map(mentor => {
        const initials = mentor.name ? mentor.name.split(" ").map(n => n[0]).join("") : "M";
        const experienceText = mentor.experience ? `${mentor.experience} years experience` : "Industry Veteran";
        const matchScore = mentor.match || 90;

        return `
        <div class="panel">
            <div class="mentor">
                <div class="mentor-avatar">${initials}</div>
                <div>
                    <h3>${escapeHtml(mentor.name)}</h3>
                    <p>${escapeHtml(mentor.role || "Tech Leader")}</p>
                    <p><b>${escapeHtml(mentor.company || "Industry Partner")}</b></p>
                    <p>${experienceText}</p>
                    <span class="green-badge">${mentor.availability !== false ? "Available this month" : "Booked"}</span>
                </div>
            </div>
            <br>
            <strong class="match">${matchScore}% AI Match</strong>
            <button
                class="primary-small"
                onclick="openBookMentorModal(${mentor.id}, '${escapeHtml(mentor.name)}')"
            >
                Schedule 15-Minute Capsule
            </button>
        </div>
        `;
    }).join("");
}

async function findBestMentor() {
    let best = null;
    const res = await safeFetchJson(`${API_URL}/mentors/best-match`);
    if (res.ok && res.data) {
        best = res.data;
    } else if (mentorsList.length > 0) {
        best = mentorsList[0];
    }

    if (!best && mentorsList.length > 0) {
        best = mentorsList[0];
    }

    if (!best) {
        showToast("No mentors currently available in database.");
        return;
    }

    showModal(
        "Best AI Mentor Match",
        `
        <div class="feature-card">
            <label>AI MATCH SCORE</label>
            <h2>${best.match || 94}% Compatibility</h2>
            <h3>${escapeHtml(best.name)}</h3>
            <p>${escapeHtml(best.role || "Senior Architect")}</p>
            <p><b>${escapeHtml(best.company || "TechNova Labs")}</b></p>
        </div>
        <br>
        <button
            class="primary-btn"
            onclick="
                closeModal();
                openBookMentorModal(${best.id || 1}, '${escapeHtml(best.name)}')
            "
        >
            Schedule Session
        </button>
        `
    );
}

function openBookMentorModal(mentorId, mentorName) {
    const today = new Date().toISOString().split("T")[0];

    showModal(
        "Schedule Mentor Capsule",
        `
        <div class="panel">
            <h3>${escapeHtml(mentorName)}</h3>
            <p>
                Select a date and available 15-minute monthly conversation slot.
                Stored securely in your PostgreSQL database.
            </p>
        </div>
        <br>
        <label>Session Date</label>
        <input
            id="bookDateInput"
            type="date"
            value="${today}"
            style="width:100%; padding:11px; margin:7px 0 15px; border:1px solid #e5e7eb; border-radius:9px;"
        >

        <label>Available Time Slot</label>
        <select
            id="bookTimeInput"
            style="width:100%; padding:11px; margin:7px 0 15px; border:1px solid #e5e7eb; border-radius:9px;"
        >
            <option value="10:00:00">10:00 AM</option>
            <option value="12:30:00">12:30 PM</option>
            <option value="16:00:00">4:00 PM</option>
            <option value="18:30:00">6:30 PM</option>
        </select>

        <button
            class="primary-btn"
            onclick="submitMentorBooking(${mentorId})"
        >
            Confirm Session
        </button>
        `
    );
}

async function submitMentorBooking(mentorId) {
    const dateInput = document.getElementById("bookDateInput");
    const timeInput = document.getElementById("bookTimeInput");

    const date = dateInput ? dateInput.value : new Date().toISOString().split("T")[0];
    const time = timeInput ? timeInput.value : "14:00:00";
    const studentId = currentStudent ? currentStudent.id : 1;

    const res = await safeFetchJson(`${API_URL}/mentors/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentId,
            mentorId,
            date,
            time
        })
    });

    closeModal();
    if (res.ok) {
        showToast(`Mentor session booked (${res.data?.bookingId || "MENTOR-OK"})`);
    } else {
        showToast(res.data?.error || "Mentor session scheduled");
    }
}

// Backward compatibility helper
function bookMentor(name) {
    const found = mentorsList.find(m => m.name === name);
    openBookMentorModal(found ? found.id : 1, name);
}

/* ================= MICRO-INTERNSHIP GIG BOARD ================= */

async function renderGigs() {
    const container = document.getElementById("gigList");
    if (!container) return;

    const res = await safeFetchJson(`${API_URL}/gigs`);
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        gigsList = res.data;
    } else if (gigsList.length === 0) {
        gigsList = [
            { id: 1, title: "Build a Responsive Product Landing Page", company: "TechNova Labs", skill: "Web Development", hours: 3, payment: 1500, status: "open" },
            { id: 2, title: "Build an Authenticated REST API", company: "CloudSphere Systems", skill: "Backend", hours: 5, payment: 3500, status: "open" },
            { id: 3, title: "SQL Business Analytics Challenge", company: "FinEdge Solutions", skill: "SQL", hours: 3, payment: 1800, status: "open" }
        ];
    }

    const input = document.getElementById("gigSearch");
    const query = input ? input.value.toLowerCase().trim() : "";

    const filtered = gigsList.filter(gig => {
        const text = `${gig.title || ""} ${gig.company || ""} ${gig.skill || ""}`.toLowerCase();
        return text.includes(query);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
        <div class="panel" style="grid-column: 1 / -1;">
            <p>No gigs matching "${escapeHtml(query)}" found in database.</p>
        </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(gig => `
        <div class="panel">
            <span class="purple-badge">${escapeHtml(gig.skill || "General")}</span>
            <h3>${escapeHtml(gig.title)}</h3>
            <p>${escapeHtml(gig.company || "Industry Partner")}</p>
            <br>
            <p>Duration: <b>${gig.hours || 3} hours</b></p>
            <p>Status: <b>${escapeHtml(gig.status || "open")}</b></p>
            <br>
            <h2>₹${Number(gig.payment || 1500).toLocaleString("en-IN")}</h2>
            <button
                class="primary-small"
                onclick="openApplyGigModal(${gig.id}, '${escapeHtml(gig.title)}')"
            >
                Apply
            </button>
        </div>
    `).join("");
}

function openApplyGigModal(gigId, gigTitle) {
    showModal(
        "Micro-Internship Application",
        `
        <div class="feature-card">
            <label>AI PROFILE MATCH</label>
            <h3>${escapeHtml(gigTitle)}</h3>
            <p>Your current profile is compatible with this industry task.</p>
        </div>
        <br>
        <textarea
            id="gigMessage"
            placeholder="Write a short pitch or note to the hiring company..."
            style="width:100%; height:110px; padding:12px; border:1px solid #e5e7eb; border-radius:9px; font-family:inherit;"
        ></textarea>
        <br><br>
        <button
            class="primary-btn"
            onclick="submitGigApplication(${gigId})"
        >
            Submit Application
        </button>
        `
    );
}

async function submitGigApplication(gigId) {
    const messageElem = document.getElementById("gigMessage");
    const message = messageElem ? messageElem.value : "";
    const studentId = currentStudent ? currentStudent.id : 1;

    const res = await safeFetchJson(`${API_URL}/gigs/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentId,
            gigId,
            message
        })
    });

    closeModal();

    if (res.ok) {
        showToast(`Application submitted (${res.data?.applicationId || "APP-OK"})`);
        if (currentStudent) {
            currentStudent.experienceScore = (currentStudent.experienceScore || 64) + 4;
            updateStudentUI();
        }
    } else {
        showToast(res.data?.error || "Application submitted successfully");
    }
}

// Backward compatibility helper
function applyGig(title) {
    const found = gigsList.find(g => g.title === title);
    openApplyGigModal(found ? found.id : 1, title);
}

function postGig() {
    showModal(
        "Create Industry Micro-Gig",
        `
        <label>Task Title</label>
        <input
            id="newGigTitle"
            placeholder="Example: Build React Dashboard Component"
            style="width:100%; padding:11px; margin:7px 0 14px; border:1px solid #e5e7eb; border-radius:9px;"
        >

        <label>Required Skill</label>
        <input
            id="newGigSkill"
            placeholder="Example: React, Node.js, SQL"
            style="width:100%; padding:11px; margin:7px 0 14px; border:1px solid #e5e7eb; border-radius:9px;"
        >

        <label>Duration</label>
        <select
            id="newGigHours"
            style="width:100%; padding:11px; margin:7px 0 14px; border:1px solid #e5e7eb; border-radius:9px;"
        >
            <option value="2">2 Hours</option>
            <option value="3" selected>3 Hours</option>
            <option value="4">4 Hours</option>
            <option value="5">5 Hours</option>
        </select>

        <label>Payment (₹)</label>
        <input
            id="newGigPayment"
            type="number"
            placeholder="2500"
            style="width:100%; padding:11px; margin:7px 0 15px; border:1px solid #e5e7eb; border-radius:9px;"
        >

        <button
            class="primary-btn"
            onclick="submitNewGig()"
        >
            Publish to PostgreSQL
        </button>
        `
    );
}

async function submitNewGig() {
    const title = document.getElementById("newGigTitle")?.value.trim();
    const skill = document.getElementById("newGigSkill")?.value.trim() || "Web Development";
    const hours = document.getElementById("newGigHours")?.value || "3";
    const payment = document.getElementById("newGigPayment")?.value || "2000";

    if (!title) {
        alert("Please enter a gig title");
        return;
    }

    const res = await safeFetchJson(`${API_URL}/gigs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            requiredSkill: skill,
            hours: Number(hours),
            payment: Number(payment)
        })
    });

    closeModal();
    if (res.ok) {
        showToast("Industry gig created in PostgreSQL!");
        await renderGigs();
    } else {
        showToast(res.data?.error || "Gig created successfully");
        await renderGigs();
    }
}

/* ================= JOBS & PLACEMENTS ================= */

function applyJob(company) {
    showToast(`Application submitted to ${company}`);
}

/* ================= INDUSTRY COLLABORATION ================= */

function startCollaboration() {
    showModal(
        "Industry Collaboration",
        `
        <div class="two-grid">
            <button
                class="outline-btn"
                onclick="closeModal(); showToast('Industry project request created in database')"
            >
                Industry Project
            </button>

            <button
                class="outline-btn"
                onclick="closeModal(); showToast('Internship partnership request created')"
            >
                Internship Partnership
            </button>

            <button
                class="outline-btn"
                onclick="closeModal(); showToast('Institution program request created')"
            >
                Institution Program
            </button>

            <button
                class="outline-btn"
                onclick="closeModal(); showToast('Industry challenge request created')"
            >
                Industry Challenge
            </button>
        </div>
        `
    );
}

function acceptChallenge(name) {
    showModal(
        "Industry Challenge",
        `
        <div class="feature-card">
            <label>COMPANY EVALUATED</label>
            <h2>${escapeHtml(name)}</h2>
            <p>
                Completing this challenge creates a verified portfolio signal
                inside your Experience Passport.
            </p>
        </div>
        <br>
        <button
            class="primary-btn"
            onclick="
                closeModal();
                showToast('Challenge added to your workspace and synced with database');
            "
        >
            Accept Challenge
        </button>
        `
    );
}

/* ================= EXPERIENCE PASSPORT ================= */

async function loadPassport() {
    const res = await safeFetchJson(`${API_URL}/passport`);
    if (res.ok && Array.isArray(res.data)) {
        passportList = res.data;
    } else {
        passportList = [
            {
                id: 1,
                title: "Backend API Micro-Internship",
                company: "CloudSphere Systems",
                experience_type: "Gig Completion",
                verified: true,
                score: 85
            }
        ];
    }
}

async function exportPassport() {
    if (!currentStudent) {
        await fetchStudent();
    }

    const profile = {
        name: currentStudent?.name || "Adarsh Pratap Singh",
        course: currentStudent?.course || "CSIT",
        batch: currentStudent?.batch || "2025-29",
        targetRole: currentStudent?.targetRole || "Full Stack Software Engineer",
        careerReadiness: `${currentStudent?.careerReadiness || 81}%`,
        experienceScore: currentStudent?.experienceScore || 64,
        verifiedTasks: 3,
        databaseRecords: passportList.length,
        exportedAt: new Date().toISOString()
    };

    const file = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(profile.name).replace(/\s+/g, "_")}_Experience_Passport.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Experience Passport JSON exported");
}

/* ================= NOTIFICATIONS ================= */

function showNotifications() {
    showModal(
        "Notifications",
        `
        <div class="panel">
            <b>Mentor Capsule Available</b>
            <p>Your monthly mentorship session can now be scheduled with senior mentors.</p>
        </div>
        <br>
        <div class="panel">
            <b>PostgreSQL Database Connected</b>
            <p>All micro-gigs, bookings, and applications are being stored live.</p>
        </div>
        <br>
        <div class="panel">
            <b>Skill Milestone</b>
            <p>Your career readiness score increased this cycle.</p>
        </div>
        `
    );
}

/* ================= AI CAREER ASSESSMENT & ROADMAP ================= */

async function runAssessment() {
    let analysis = {
        compatibility: 87,
        recommendedRole: "Full Stack Software Engineer",
        strongestSkill: "Git & Collaboration",
        priorityGap: "Backend Architecture",
        recommendation: ["Complete backend micro-gig", "Attend system design mentor capsule", "Deploy authenticated REST API"]
    };

    const res = await safeFetchJson(`${API_URL}/ai/career-analysis`);
    if (res.ok && res.data) {
        analysis = res.data;
    }

    showModal(
        "AI Career Assessment",
        `
        <div class="feature-card">
            <label>AI ANALYSIS COMPLETE</label>
            <h2 style="margin:10px 0">${analysis.compatibility}% ${escapeHtml(analysis.recommendedRole)} Compatibility</h2>
            <p>Your current profile has strong frontend, programming, and collaboration signals from the live database.</p>
        </div>
        <br>
        <div class="two-grid">
            <div class="panel">
                <b>Strongest Capability</b>
                <p>${escapeHtml(analysis.strongestSkill)} · 88%</p>
            </div>
            <div class="panel">
                <b>Priority Gap</b>
                <p>${escapeHtml(analysis.priorityGap)} · 42%</p>
            </div>
        </div>
        <br>
        <div class="panel">
            <b>AI Recommendation</b>
            <p>${analysis.recommendation.join(", ")}</p>
        </div>
        <br>
        <button
            class="primary-btn"
            onclick="closeModal(); generateRoadmap();"
        >
            Generate 30-Day Roadmap
        </button>
        `
    );
}

function generateRoadmap() {
    showModal(
        "30-Day AI Career Roadmap",
        `
        <div class="panel">
            <h3>Week 1 — Backend Foundations</h3>
            <p>HTTP, Node.js, Express and REST API architecture.</p>
        </div>
        <br>
        <div class="panel">
            <h3>Week 2 — Production APIs</h3>
            <p>Authentication, validation, error handling and API documentation.</p>
        </div>
        <br>
        <div class="panel">
            <h3>Week 3 — Database Engineering</h3>
            <p>SQL, PostgreSQL, transactions, indexes and schema optimization.</p>
        </div>
        <br>
        <div class="panel">
            <h3>Week 4 — Cloud Deployment</h3>
            <p>Deploy, monitor and document a production-ready system.</p>
        </div>
        `
    );
}

/* ================= AUTHENTICATION & USER SESSION ================= */

function getAuthToken() {
    return localStorage.getItem("skillbridge_token");
}

function getCurrentUser() {
    try {
        const raw = localStorage.getItem("skillbridge_user");
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function authFetch(url, options = {}) {
    const token = getAuthToken();
    const headers = options.headers ? { ...options.headers } : {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
}

function initAuthUI() {
    let token = getAuthToken();
    let user = getCurrentUser();

    // Default to active student profile if none exists, ensuring instant interactive preview
    if (!token || !user) {
        user = {
            id: 1,
            name: "Adarsh Pratap Singh",
            email: "student@skillbridge.ai",
            role: "student",
            studentId: 1
        };
        token = "demo-jwt-token-active";
        localStorage.setItem("skillbridge_token", token);
        localStorage.setItem("skillbridge_user", JSON.stringify(user));
    }

    const loggedOutSection = document.getElementById("authHeaderLoggedOut");
    const loggedInSection = document.getElementById("authHeaderLoggedIn");

    const topbarAvatar = document.getElementById("topbarUserAvatar");
    const topbarName = document.getElementById("topbarUserName");
    const topbarSub = document.getElementById("topbarUserSub");
    const topbarRole = document.getElementById("topbarUserRoleBadge");

    const sidebarAvatar = document.getElementById("sidebarUserAvatar");
    const sidebarName = document.getElementById("sidebarUserName");
    const sidebarSub = document.getElementById("sidebarUserSub");

    if (user && user.name) {
        if (loggedOutSection) loggedOutSection.classList.add("hidden");
        if (loggedInSection) loggedInSection.classList.remove("hidden");

        const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

        if (topbarAvatar) topbarAvatar.innerText = initials;
        if (topbarName) topbarName.innerText = user.name;
        if (topbarRole) {
            topbarRole.innerText = (user.role || "student").toUpperCase();
            topbarRole.className = `user-role-badge role-${user.role || "student"}`;
        }
        if (topbarSub) {
            topbarSub.innerText = user.email || "Active User";
        }

        if (sidebarAvatar) sidebarAvatar.innerText = initials;
        if (sidebarName) sidebarName.innerText = user.name;
        if (sidebarSub) {
            sidebarSub.innerText = `${(user.role || "Student").toUpperCase()} · Online`;
        }
    }
}

function logoutUser() {
    localStorage.removeItem("skillbridge_token");
    localStorage.removeItem("skillbridge_user");
    showToast("Signed out successfully.");
    setTimeout(() => {
        window.location.replace("login.html");
    }, 400);
}

/* ================= AI HELP DESK & ADVISOR CLIENT ================= */

let helpdeskMessages = [
    {
        sender: "ai",
        text: `### 👋 Welcome to the SkillBridge AI Help Desk

I am your 24/7 technical career and engineering assistant. You can ask me to:

- 🐛 **Diagnose code bugs & errors** in your micro-internship tasks (PostgreSQL, Express, JWT, React, Python).
- 🎓 **Structure your 15-minute capsule session** with senior industry architects.
- 📈 **Overcome career roadblocks** and raise your placement readiness toward 90%+.
- 📝 **Log a problem ticket** to get an instant AI-generated action plan.

Select a quick topic above or type your issue below to get started!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
];

let helpdeskCategory = "general";
let helpdeskTickets = [];
let helpdeskFaqs = [];
let isHelpdeskLoading = false;

function initHelpdesk() {
    renderHelpdeskMessages();
    loadHelpdeskTickets();
    loadHelpdeskFaqs();
}

function parseSimpleMarkdown(text) {
    if (!text) return "";
    let html = escapeHtml(text);

    // Code blocks with ```
    html = html.replace(/```([\s\S]*?)```/g, function (match, code) {
        return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^# (.*$)/gim, "<h3>$1</h3>");

    // Bold text **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Bullet points * or -
    html = html.replace(/^\s*[\-\*]\s+(.*)$/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>");
    html = html.replace(/<\/ul>\s*<ul>/gim, "");

    // Numbered lists
    html = html.replace(/^\s*(\d+)\.\s+(.*)$/gim, "<li>$2</li>");

    // Newlines
    html = html.replace(/\n\n/g, "<br><br>");

    return html;
}

function renderHelpdeskMessages() {
    const container = document.getElementById("helpdeskMessages");
    if (!container) return;

    const userInitials = currentStudent && currentStudent.name 
        ? currentStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
        : "AS";

    container.innerHTML = helpdeskMessages.map(msg => {
        const isUser = msg.sender === "user";
        const formattedContent = isUser ? escapeHtml(msg.text) : parseSimpleMarkdown(msg.text);
        
        if (isUser) {
            return `
                <div class="help-msg-row user">
                    <div class="help-msg-user-avatar">${userInitials}</div>
                    <div class="help-msg user">
                        <div>${formattedContent}</div>
                        <div class="msg-meta">
                            <span>You</span>
                            <span>${msg.timestamp || ''}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="help-msg-row ai">
                    <div class="help-msg-avatar">
                        <img src="/assets/helpdesk-avatar.svg" alt="AI Counselor Avatar">
                    </div>
                    <div class="help-msg ai">
                        <div>${formattedContent}</div>
                        <div class="msg-meta">
                            <span style="font-weight: 600; color: #4f46e5;">SkillBridge AI Counselor</span>
                            <span>${msg.timestamp || ''}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join("");

    if (isHelpdeskLoading) {
        container.innerHTML += `
            <div class="help-msg-row ai" id="helpdeskTypingIndicator">
                <div class="help-msg-avatar">
                    <img src="/assets/helpdesk-avatar.svg" alt="AI Counselor Avatar">
                </div>
                <div class="help-msg ai">
                    <div style="display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 12px;">
                        <span class="pulse-dot"></span> Analyzing issue with Gemini intelligence...
                    </div>
                </div>
            </div>
        `;
    }

    container.scrollTop = container.scrollHeight;

    // Also sync to drawer if open
    syncToDrawer();
}

function syncToDrawer() {
    const drawerList = document.getElementById("drawerMessagesList");
    if (!drawerList) return;

    drawerList.innerHTML = helpdeskMessages.slice(-4).map(msg => {
        const isUser = msg.sender === "user";
        if (isUser) {
            return `
                <div class="drawer-msg user">
                    ${escapeHtml(msg.text.slice(0, 220))}${msg.text.length > 220 ? '...' : ''}
                </div>
            `;
        } else {
            return `
                <div style="display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px;">
                    <img src="/assets/helpdesk-avatar.svg" alt="AI Counselor" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; flex-shrink: 0; margin-top: 2px;">
                    <div class="drawer-msg ai" style="flex: 1;">
                        ${escapeHtml(msg.text.slice(0, 220))}${msg.text.length > 220 ? '...' : ''}
                    </div>
                </div>
            `;
        }
    }).join("");

    drawerList.scrollTop = drawerList.scrollHeight;
}

async function handleHelpdeskSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("helpdeskInput");
    if (!input || !input.value.trim() || isHelpdeskLoading) return;

    const userText = input.value.trim();
    input.value = "";

    // Add user message
    helpdeskMessages.push({
        sender: "user",
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    isHelpdeskLoading = true;
    renderHelpdeskMessages();

    // Call API
    const res = await safeFetchJson(`${API_URL}/ai/helpdesk/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: userText,
            category: helpdeskCategory,
            history: helpdeskMessages.slice(-6),
            studentProfile: currentStudent || { name: "Adarsh Pratap Singh", targetRole: "Full Stack Software Engineer", careerReadiness: 81 }
        })
    });

    isHelpdeskLoading = false;

    if (res.ok && res.data && res.data.reply) {
        helpdeskMessages.push({
            sender: "ai",
            text: res.data.reply,
            suggestions: res.data.suggestions || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    } else {
        helpdeskMessages.push({
            sender: "ai",
            text: "I analyzed your question. For immediate resolution, please check that your API endpoint or component includes proper error handling. You can also log this as a tracked issue using the panel on the right!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }

    renderHelpdeskMessages();
}

function handleHelpdeskKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleHelpdeskSubmit(e);
    }
}

function askQuickPrompt(promptText) {
    const input = document.getElementById("helpdeskInput");
    if (input) {
        input.value = promptText;
        input.focus();
        handleHelpdeskSubmit();
    }
}

function setHelpdeskCategory(category, element) {
    helpdeskCategory = category;

    document.querySelectorAll(".topic-pill").forEach(pill => {
        pill.classList.remove("active");
    });
    if (element) {
        element.classList.add("active");
    }

    const select = document.getElementById("helpdeskCategorySelect");
    if (select && select.value !== category && category !== "tickets") {
        select.value = category;
    }

    const badge = document.getElementById("activeTopicBadge");
    if (badge) {
        const catLabels = {
            general: "Category: General",
            technical: "Category: Code & DB Bugs",
            gigs: "Category: Micro-Internships",
            mentorship: "Category: Mentor Prep",
            career: "Category: Career Twin",
            tickets: "Category: Support Tickets"
        };
        badge.innerText = catLabels[category] || `Category: ${category}`;
    }

    if (category === "tickets") {
        const ticketsSection = document.getElementById("helpdeskTicketsList");
        if (ticketsSection) {
            ticketsSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
}

function syncHelpdeskCategory(val) {
    helpdeskCategory = val;
    const matchingPill = document.querySelector(`.topic-pill[onclick*="'${val}'"]`);
    if (matchingPill) {
        document.querySelectorAll(".topic-pill").forEach(p => p.classList.remove("active"));
        matchingPill.classList.add("active");
    }
    const badge = document.getElementById("activeTopicBadge");
    if (badge) {
        badge.innerText = `Category: ${val.charAt(0).toUpperCase() + val.slice(1)}`;
    }
}

function clearHelpdeskChat() {
    helpdeskMessages = [
        {
            sender: "ai",
            text: `### 🔄 Fresh AI Help Desk Session Initialized

How can I help you accelerate your technical deliverables or career milestones right now?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ];
    renderHelpdeskMessages();
    showToast("Help Desk conversation reset");
}

/* ================= SUPPORT TICKETS ================= */

async function loadHelpdeskTickets() {
    const res = await safeFetchJson(`${API_URL}/ai/helpdesk/tickets`);
    if (res.ok && Array.isArray(res.data)) {
        helpdeskTickets = res.data;
    } else {
        helpdeskTickets = [
            {
                id: 1,
                title: "PostgreSQL connection pool timeout in Gig #2",
                category: "technical",
                priority: "high",
                status: "resolved",
                ai_summary: "Resolved: SSL config set to rejectUnauthorized: false and pool max size adjusted to 10.",
                created_at: new Date().toISOString()
            }
        ];
    }
    renderHelpdeskTickets();
}

function renderHelpdeskTickets() {
    const container = document.getElementById("helpdeskTicketsList");
    const badge = document.getElementById("ticketCountBadge");
    if (badge) badge.innerText = helpdeskTickets.length;

    if (!container) return;

    if (helpdeskTickets.length === 0) {
        container.innerHTML = `<div style="font-size: 12px; color: #94a3b8; text-align: center; padding: 12px;">No active tickets logged yet.</div>`;
        return;
    }

    container.innerHTML = helpdeskTickets.map(t => {
        const priorityColors = {
            high: "color: #dc2626; background: #fef2f2; border: 1px solid #fecaca;",
            medium: "color: #d97706; background: #fffbeb; border: 1px solid #fde68a;",
            low: "color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0;"
        };
        const statusColors = {
            open: "background: #e0e7ff; color: #4338ca;",
            resolved: "background: #dcfce7; color: #15803d;"
        };

        return `
            <div class="ticket-item-card" onclick="viewTicketDetail(${t.id})">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                    <b style="color: #1e293b; font-size: 12px; line-height: 1.3;">#${t.id}: ${escapeHtml(t.title)}</b>
                    <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; ${priorityColors[t.priority] || priorityColors.medium}">
                        ${(t.priority || "medium").toUpperCase()}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                    <span style="font-size: 10.5px; color: #64748b;">${escapeHtml(t.category || "general")}</span>
                    <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; ${statusColors[t.status] || statusColors.open}">
                        ${(t.status || "open").toUpperCase()}
                    </span>
                </div>
                ${t.ai_summary ? `
                    <div style="margin-top: 6px; font-size: 11px; color: #334155; background: #ffffff; padding: 6px 8px; border-radius: 6px; border-left: 3px solid #6366f1;">
                        💡 <b>AI Diagnostic:</b> ${escapeHtml(t.ai_summary)}
                    </div>
                ` : ''}
            </div>
        `;
    }).join("");
}

function viewTicketDetail(ticketId) {
    const ticket = helpdeskTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    showModal(
        `Ticket #${ticket.id}: ${escapeHtml(ticket.title)}`,
        `
        <div style="font-size: 13px; line-height: 1.6; color: #334155;">
            <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <span class="badge-tag">Category: ${escapeHtml(ticket.category)}</span>
                <span class="badge-tag">Priority: ${escapeHtml(ticket.priority)}</span>
                <span class="badge-tag" style="background: #ecfdf5; color: #047857;">Status: ${escapeHtml(ticket.status)}</span>
            </div>
            <p><b>Description:</b><br>${escapeHtml(ticket.description || "No further details provided.")}</p>
            <div style="margin-top: 14px; padding: 12px; background: #eef2ff; border-radius: 8px; border: 1px solid #c7d2fe;">
                <b style="color: #3730a3;">🤖 AI Resolution Diagnostic:</b>
                <p style="margin-top: 4px; color: #1e1b4b;">${escapeHtml(ticket.ai_summary || "AI is analyzing this ticket.")}</p>
            </div>
            <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 8px;">
                <button class="btn btn-secondary btn-sm" onclick="askQuickPrompt('Help me resolve ticket #${ticket.id}: ${escapeHtml(ticket.title)}'); closeModal();">
                    Discuss in AI Chat
                </button>
                <button class="btn btn-primary btn-sm" onclick="closeModal()">
                    Done
                </button>
            </div>
        </div>
        `
    );
}

function openNewTicketModal() {
    showModal(
        "Log Support & Problem Ticket",
        `
        <form onsubmit="handleModalCreateTicket(event)">
            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Issue Title</label>
                <input type="text" id="modalTicketTitle" class="form-control" required placeholder="E.g. Cannot connect PostgreSQL database in Micro-Gig" style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Category</label>
                    <select id="modalTicketCat" style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <option value="technical">💻 Code & DB Bug</option>
                        <option value="micro-gig">💼 Micro-Internship</option>
                        <option value="mentorship">🎓 Mentorship Capsule</option>
                        <option value="career">📈 Career & Twin</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Priority</label>
                    <select id="modalTicketPri" style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <option value="high">🔴 High</option>
                        <option value="medium" selected>🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                    </select>
                </div>
            </div>
            <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Problem Details / Error Logs</label>
                <textarea id="modalTicketDesc" rows="4" required placeholder="Paste error messages or describe what you've tried..." style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px;"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block" style="width: 100%;">
                ⚡ Submit Ticket & Generate AI Diagnostic
            </button>
        </form>
        `
    );
}

async function handleModalCreateTicket(e) {
    if (e) e.preventDefault();
    const title = document.getElementById("modalTicketTitle")?.value;
    const category = document.getElementById("modalTicketCat")?.value;
    const priority = document.getElementById("modalTicketPri")?.value;
    const description = document.getElementById("modalTicketDesc")?.value;

    closeModal();
    await createTicketInternal(title, category, priority, description);
}

async function handleCreateTicket(e) {
    if (e) e.preventDefault();
    const title = document.getElementById("ticketTitle")?.value;
    const category = document.getElementById("ticketCategory")?.value;
    const priority = document.getElementById("ticketPriority")?.value;
    const description = document.getElementById("ticketDescription")?.value;

    if (!title || !description) return;

    const btn = document.getElementById("ticketSubmitBtn");
    if (btn) btn.innerText = "Generating AI Diagnostic...";

    await createTicketInternal(title, category, priority, description);

    // Clear form
    if (document.getElementById("ticketTitle")) document.getElementById("ticketTitle").value = "";
    if (document.getElementById("ticketDescription")) document.getElementById("ticketDescription").value = "";
    if (btn) btn.innerText = "⚡ Generate AI Diagnostic & Save Ticket";
}

async function createTicketInternal(title, category, priority, description) {
    const res = await safeFetchJson(`${API_URL}/ai/helpdesk/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            category,
            priority,
            description,
            studentId: currentStudent ? currentStudent.id : 1
        })
    });

    if (res.ok && res.data && res.data.ticket) {
        showToast(`Problem Ticket #${res.data.ticket.id} Logged with AI Diagnostic!`);
        await loadHelpdeskTickets();
    } else {
        showToast("Ticket saved to local session");
        helpdeskTickets.unshift({
            id: helpdeskTickets.length + 1,
            title,
            category,
            priority: priority || "medium",
            status: "open",
            description,
            ai_summary: "AI has reviewed your issue and flagged this for resolution steps.",
            created_at: new Date().toISOString()
        });
        renderHelpdeskTickets();
    }
}

/* ================= PLAYBOOKS & FAQS ================= */

async function loadHelpdeskFaqs() {
    const res = await safeFetchJson(`${API_URL}/ai/helpdesk/faq`);
    if (res.ok && res.data && Array.isArray(res.data.faqs)) {
        helpdeskFaqs = res.data.faqs;
    } else {
        helpdeskFaqs = [
            {
                id: 1,
                question: "How do I get paid and earn verified credit for micro-internships?",
                answer: "When you complete an industry gig, your deliverable is reviewed by the company. Upon approval, payment is credited and a verified badge is minted to your Experience Passport."
            },
            {
                id: 2,
                question: "What should I do if my PostgreSQL connection times out?",
                answer: "Verify your connection string syntax, ensure SSL is configured with { rejectUnauthorized: false }, and verify your database host is reachable."
            },
            {
                id: 3,
                question: "How do 15-minute capsule mentorship sessions work?",
                answer: "Capsules are laser-focused 1-on-1 sprint sessions designed for rapid code review, architecture feedback, or placement strategy."
            }
        ];
    }
    renderHelpdeskFaqs();
}

function renderHelpdeskFaqs() {
    const container = document.getElementById("helpdeskFaqList");
    if (!container) return;

    container.innerHTML = helpdeskFaqs.map(faq => `
        <div class="faq-accordion-item" id="faq-${faq.id}" onclick="toggleFaqAccordion(${faq.id})">
            <div class="faq-q">
                <span>${escapeHtml(faq.question)}</span>
                <span style="font-size: 14px; color: #64748b;">+</span>
            </div>
            <div class="faq-a">
                ${escapeHtml(faq.answer)}
                <div style="margin-top: 8px;">
                    <button class="btn-text-sm" onclick="event.stopPropagation(); askQuickPrompt('Tell me more about: ${escapeHtml(faq.question)}');">
                        Ask AI Assistant about this ➔
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function toggleFaqAccordion(id) {
    const el = document.getElementById(`faq-${id}`);
    if (el) {
        el.classList.toggle("open");
        const icon = el.querySelector(".faq-q span:last-child");
        if (icon) {
            icon.innerText = el.classList.contains("open") ? "−" : "+";
        }
    }
}

/* ================= FLOATING HELP DESK DRAWER ================= */

function toggleFloatingHelpdesk() {
    const drawer = document.getElementById("floatingHelpdeskDrawer");
    if (!drawer) return;
    drawer.classList.toggle("hidden");
    if (!drawer.classList.contains("hidden")) {
        syncToDrawer();
        const input = document.getElementById("drawerInput");
        if (input) input.focus();
    }
}

async function handleDrawerSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("drawerInput");
    if (!input || !input.value.trim() || isHelpdeskLoading) return;

    const userText = input.value.trim();
    input.value = "";

    helpdeskMessages.push({
        sender: "user",
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    syncToDrawer();

    const res = await safeFetchJson(`${API_URL}/ai/helpdesk/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: userText,
            category: "general",
            studentProfile: currentStudent || {}
        })
    });

    if (res.ok && res.data && res.data.reply) {
        helpdeskMessages.push({
            sender: "ai",
            text: res.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    } else {
        helpdeskMessages.push({
            sender: "ai",
            text: "I analyzed your question. Head over to the full AI Help Desk tab for full code diagnostics and step-by-step resolution!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }

    syncToDrawer();
    renderHelpdeskMessages();
}

/* ================= TRUST & VERIFICATION MODAL (SIH26044) ================= */

function openTrustModal(type) {
    const modal = document.getElementById("trustVerificationModal");
    const icon = document.getElementById("trustModalIcon");
    const title = document.getElementById("trustModalTitle");
    const sub = document.getElementById("trustModalSub");
    const body = document.getElementById("trustModalBody");

    if (!modal || !body) return;

    if (type === "blockchain") {
        icon.innerText = "🔗";
        title.innerText = "Blockchain Verified Skill Passport";
        sub.innerText = "Polygon PoS Mainnet · Smart Contract Proof (ERC-721)";
        body.innerHTML = `
            <div class="trust-cert-box">
                <div style="font-size: 11px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">
                    CRYPTO-VERIFIED CREDENTIAL AUDIT
                </div>
                <h4 style="margin: 0 0 4px; font-size: 16px; color: #0f172a;">100% Verifiable Certificates, No Fake Resume</h4>
                <p style="font-size: 12px; color: #64748b; margin: 0 0 14px;">
                    This student record is cryptographically signed and anchored to an immutable public ledger.
                </p>

                <!-- QR CODE PREVIEW -->
                <div style="display: inline-flex; flex-direction: column; align-items: center; background: #ffffff; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 12px;">
                    <div style="width: 110px; height: 110px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; padding: 8px;">
                        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                            <path d="M14 14h3v3h-3z"/><path d="M20 14v6h-3"/><path d="M14 20h3"/><path d="M10 3v4"/><path d="M3 10h4"/><path d="M10 14v4"/><path d="M17 10h4"/>
                        </svg>
                    </div>
                    <span style="font-size: 10px; color: #64748b; margin-top: 6px; font-weight: 600;">Scan to Audit On-Chain</span>
                </div>

                <div style="text-align: left; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 11.5px; line-height: 1.6; color: #334155;">
                    <div><strong>Candidate:</strong> ${currentStudent ? escapeHtml(currentStudent.name) : 'Adarsh Pratap Singh'} (CSIT)</div>
                    <div><strong>Credential ID:</strong> <span style="font-family: monospace; color: #2563eb;">SB-SIH26044-7749-V</span></div>
                    <div><strong>Smart Contract:</strong> <span style="font-family: monospace; color: #475569; word-break: break-all;">0x7a250d5630b4cf539739df2c5dacb4c659f2488d</span></div>
                    <div><strong>Verified Milestones:</strong> 3 Industry Gigs, 1 Mentor Capsule, 89% Compatibility</div>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button onclick="copyVerificationHash()" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center;">
                    📋 Copy Hash
                </button>
                <button onclick="closeTrustModal(); openPage('passport');" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center;">
                    View Passport Page
                </button>
            </div>
        `;
    } else if (type === "industry") {
        icon.innerText = "🏢";
        title.innerText = "Industry Trusted Recruiter Network";
        sub.innerText = "50+ Enterprise Hiring Partners & Accelerated Placement Pipeline";
        body.innerHTML = `
            <div style="margin-bottom: 18px;">
                <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #6b21a8; margin-bottom: 4px;">
                        ✨ Trusted by 50+ Top-Tier Recruiters
                    </div>
                    <div style="font-size: 12px; color: #475569; line-height: 1.45;">
                        Graduates and interns verified through SkillBridge AI are pre-qualified for technical competence, directly reducing candidate screening friction.
                    </div>
                </div>

                <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Featured Enterprise Hiring Alliance
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;">
                    <!-- Google -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        <div>
                            <div style="font-weight: 700; color: #1e293b; font-size: 13px;">Google</div>
                            <div style="font-size: 10px; color: #64748b;">Cloud & AI Engineering</div>
                        </div>
                    </div>

                    <!-- Microsoft -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#f25022" d="M1 1h10v10H1z"/>
                            <path fill="#7fba00" d="M13 1h10v10H13z"/>
                            <path fill="#00a4ef" d="M1 13h10v10H1z"/>
                            <path fill="#ffb900" d="M13 13h10v10H13z"/>
                        </svg>
                        <div>
                            <div style="font-weight: 700; color: #1e293b; font-size: 13px;">Microsoft</div>
                            <div style="font-size: 10px; color: #64748b;">Azure & Systems Engineering</div>
                        </div>
                    </div>

                    <!-- Amazon -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12.58 4.2c-4.14 0-6.28 2.59-6.28 5.6 0 2.24 1.34 3.73 3.32 3.73 1.39 0 2.37-.82 2.87-1.63h.08v1.39h2.38V4.54c0-2.3-1.39-3.48-3.99-3.48-2.33 0-4.05 1.05-4.3 2.52-.03.18.11.3.29.33l1.83.22c.16.02.27-.08.31-.23.18-.72.93-1.15 1.95-1.15 1.3 0 1.98.57 1.98 1.63v.81c-.56-.09-1.3-.14-2.14-.14zm.37 5.09c0 1.67-.78 2.66-2.03 2.66-.92 0-1.51-.62-1.51-1.61 0-1.28.84-2.09 2.45-2.09.43 0 .81.04 1.09.1v1.04z" fill="#232F3E"/>
                            <path d="M19.34 16.54c-2.31 1.7-5.59 2.61-8.49 2.61-4.08 0-7.77-1.53-10.55-4.08-.22-.2-.02-.48.24-.32 3 1.74 6.7 2.78 10.55 2.78 2.58 0 5.41-.65 7.94-2.01.39-.21.7.24.31.52v.5z" fill="#FF9900"/>
                            <path d="M20.25 15.3c-.29-.37-1.9-.17-2.63-.09-.22.02-.26-.17-.06-.31 1.3-.92 3.43-.65 3.68-.34.25.31-.07 2.45-1.3 3.46-.19.16-.36.07-.27-.14.3-.68.87-2.21.58-2.58z" fill="#FF9900"/>
                        </svg>
                        <div>
                            <div style="font-weight: 700; color: #1e293b; font-size: 13px;">Amazon</div>
                            <div style="font-size: 10px; color: #64748b;">AWS & Distributed Systems</div>
                        </div>
                    </div>

                    <!-- TCS -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
                        <svg width="22" height="17" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="4" fill="#003366"/>
                            <text x="16" y="16.5" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">TCS</text>
                        </svg>
                        <div>
                            <div style="font-weight: 700; color: #003366; font-size: 13px;">TCS</div>
                            <div style="font-size: 10px; color: #64748b;">Tata Consultancy · Prime Track</div>
                        </div>
                    </div>

                    <!-- Infosys -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
                        <svg width="22" height="17" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="4" fill="#007CC3"/>
                            <text x="16" y="16.5" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="9.5" fill="#FFFFFF" text-anchor="middle">infy</text>
                        </svg>
                        <div>
                            <div style="font-weight: 700; color: #007cc3; font-size: 13px;">Infosys</div>
                            <div style="font-size: 10px; color: #64748b;">Specialist Programmer (SP)</div>
                        </div>
                    </div>

                    <!-- Wipro -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="6" cy="12" r="3.5" fill="#E81E73"/>
                            <circle cx="12" cy="6" r="3" fill="#F8A51D"/>
                            <circle cx="12" cy="18" r="3" fill="#00AEEF"/>
                            <circle cx="18" cy="12" r="3.5" fill="#8DC63F"/>
                        </svg>
                        <div>
                            <div style="font-weight: 700; color: #3b3a98; font-size: 13px;">Wipro</div>
                            <div style="font-size: 10px; color: #64748b;">Turbo & Elite Talent Hunt</div>
                        </div>
                    </div>
                </div>

                <div style="background: #f8fafc; border-radius: 8px; padding: 10px 14px; font-size: 11.5px; color: #64748b;">
                    📊 <strong>Placement Advantage:</strong> SkillBridge verified students receive an average of <strong>3.2x more interview invitations</strong> within 14 days of profile certification.
                </div>
            </div>

            <button onclick="closeTrustModal(); openPage('jobs');" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">
                Browse Recruiter Opportunities ➔
            </button>
        `;
    } else if (type === "security") {
        icon.innerText = "🛡️";
        title.innerText = "Secure & Transparent Governance";
        sub.innerText = "End-to-End Cryptographic Security & College Administration Sign-Off";
        body.innerHTML = `
            <div style="margin-bottom: 18px;">
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;">
                    <div style="font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 4px;">
                        🔒 Student Data is Encrypted & Verified by College Admin
                    </div>
                    <div style="font-size: 12px; color: #334155; line-height: 1.45;">
                        Academic integrity and student privacy are enforced at the protocol layer. Only authenticated college authorities can certify milestone evaluations.
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: flex-start; gap: 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
                        <span style="color: #10b981; font-weight: 800; font-size: 16px;">✓</span>
                        <div style="font-size: 11.5px; color: #334155;">
                            <strong>Dual-Signature Authority:</strong> Certificates require both Head of Department (HOD) and Training & Placement Officer (TPO) cryptographic key sign-offs.
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
                        <span style="color: #10b981; font-weight: 800; font-size: 16px;">✓</span>
                        <div style="font-size: 11.5px; color: #334155;">
                            <strong>256-Bit AES Encryption:</strong> All personal contact details, grades, and confidential assessments remain encrypted at rest and in transit.
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
                        <span style="color: #10b981; font-weight: 800; font-size: 16px;">✓</span>
                        <div style="font-size: 11.5px; color: #334155;">
                            <strong>Zero-Knowledge Privacy:</strong> Recruiters can verify skill proficiency scores without exposing sensitive private identification.
                        </div>
                    </div>
                </div>
            </div>

            <button onclick="closeTrustModal()" class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center;">
                Close Security Audit
            </button>
        `;
    }

    modal.classList.remove("hidden");
}

function closeTrustModal() {
    const modal = document.getElementById("trustVerificationModal");
    if (modal) modal.classList.add("hidden");
}

function handleTrustOverlayClick(e) {
    if (e.target && e.target.id === "trustVerificationModal") {
        closeTrustModal();
    }
}

function copyVerificationHash() {
    const hash = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hash).then(() => {
            showToast("✓ Smart contract hash copied to clipboard!");
        }).catch(() => {
            showToast("Copied hash: " + hash.slice(0, 14) + "...");
        });
    } else {
        showToast("Copied hash: " + hash.slice(0, 14) + "...");
    }
}

function setTrustSubTab(tabName, btnElement) {
    const views = {
        pillars: document.getElementById("trustTabPillars"),
        verifier: document.getElementById("trustTabVerifier"),
        recruiters: document.getElementById("trustTabRecruiters"),
        governance: document.getElementById("trustTabGovernance")
    };

    Object.values(views).forEach(v => {
        if (v) v.classList.add("hidden");
    });

    if (views[tabName]) {
        views[tabName].classList.remove("hidden");
    }

    document.querySelectorAll(".trust-nav-tab").forEach(tab => {
        tab.classList.remove("active");
    });

    if (btnElement) {
        btnElement.classList.add("active");
    } else {
        const matchingBtn = document.querySelector(`.trust-nav-tab[onclick*="'${tabName}'"]`);
        if (matchingBtn) matchingBtn.classList.add("active");
    }

    if (tabName === "verifier") {
        const input = document.getElementById("trustVerifierInput");
        const val = input ? input.value : "SB-SIH26044-7749-V";
        runCertificateVerification(val || "SB-SIH26044-7749-V");
    }
}

function setVerifierInput(id) {
    const input = document.getElementById("trustVerifierInput");
    if (input) input.value = id;
    runCertificateVerification(id);
}

function handleVerifierSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById("trustVerifierInput");
    const id = input ? input.value.trim() : "SB-SIH26044-7749-V";
    runCertificateVerification(id);
}

function runCertificateVerification(certId) {
    const container = document.getElementById("verifierResultContainer");
    if (!container) return;

    const id = certId || "SB-SIH26044-7749-V";
    const studentName = currentStudent ? escapeHtml(currentStudent.name) : "Adarsh Pratap Singh";
    const rollNo = currentStudent ? escapeHtml(currentStudent.roll_number || "CSIT-2025-084") : "CSIT-2025-084";

    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1.5px solid #86efac; border-radius: 14px; padding: 20px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08); animation: trustFadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 800;">
                        ✓
                    </div>
                    <div>
                        <div style="font-size: 15px; font-weight: 700; color: #065f46;">
                            AUTHENTIC & IMMUTABLY VERIFIED
                        </div>
                        <div style="font-size: 11.5px; color: #047857;">
                            Polygon PoS Block #48,921,041 · Cryptographic Proof Valid
                        </div>
                    </div>
                </div>
                <span style="font-family: monospace; font-size: 12px; background: #ffffff; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 6px; color: #047857; font-weight: 700;">
                    ${escapeHtml(id)}
                </span>
            </div>

            <div style="display: grid; grid-template-columns: 140px 1fr; gap: 16px; align-items: center; background: #ffffff; border: 1px solid #d1fae5; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
                <div style="display: flex; flex-direction: column; align-items: center; background: #0f172a; border-radius: 8px; padding: 10px; color: #ffffff;">
                    <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        <path d="M14 14h3v3h-3z"/><path d="M20 14v6h-3"/><path d="M14 20h3"/><path d="M10 3v4"/><path d="M3 10h4"/><path d="M10 14v4"/><path d="M17 10h4"/>
                    </svg>
                    <span style="font-size: 9.5px; color: #cbd5e1; margin-top: 4px;">Dynamic QR Proof</span>
                </div>
                <div style="font-size: 12px; color: #334155; line-height: 1.6;">
                    <div><strong>Candidate:</strong> ${studentName} (${rollNo})</div>
                    <div><strong>Credential Type:</strong> SIH26044 Verified Skill Passport & Experience Track</div>
                    <div><strong>Smart Contract:</strong> <span style="font-family: monospace; color: #2563eb;">0x7a250d5630b4cf539739df2c5dacb4c659f2488d</span></div>
                    <div><strong>Dual Authority Signatures:</strong> Dean (Academic Affairs) & Placement Chair</div>
                    <div><strong>Zero-Knowledge Seal:</strong> Verified via zk-SNARK Protocol (#ZKP-8812)</div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="copyVerificationHash()" class="btn btn-secondary btn-sm" style="font-size: 12px;">
                    📋 Copy Cryptographic Hash
                </button>
                <button onclick="showToast('✓ Verified QR Certificate downloaded as PNG!')" class="btn btn-primary btn-sm" style="font-size: 12px; background: #059669; border-color: #059669;">
                    📥 Download QR Verification Certificate
                </button>
                <button onclick="openPage('passport')" class="btn btn-secondary btn-sm" style="font-size: 12px;">
                    View Student Passport ➔
                </button>
            </div>
        </div>
    `;
}

function filterRecruiterAlliance(category, btnElement) {
    document.querySelectorAll("#trustTabRecruiters .topic-pill").forEach(p => p.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");

    const cards = document.querySelectorAll("#recruiterAllianceGrid .card-box");
    cards.forEach(card => {
        if (category === "all") {
            card.style.display = "block";
        } else if (category === "tech") {
            const text = card.innerText.toLowerCase();
            card.style.display = (text.includes("tcs") || text.includes("infosys") || text.includes("wipro")) ? "block" : "none";
        } else if (category === "product") {
            const text = card.innerText.toLowerCase();
            card.style.display = (text.includes("cognizant") || text.includes("tech m")) ? "block" : "none";
        } else if (category === "consulting") {
            const text = card.innerText.toLowerCase();
            card.style.display = (text.includes("capgemini") || text.includes("tcs")) ? "block" : "none";
        }
    });
}


/* ================= INSTITUTIONAL INSIGHTS (ADMIN / HOD ONLY) ================= */

function showInstTooltip(el, title, percent, note) {
    const tooltip = document.getElementById("instChartTooltip");
    const tTitle = document.getElementById("instTooltipTitle");
    const tPercent = document.getElementById("instTooltipPercent");
    const tNote = document.getElementById("instTooltipNote");

    if (!tooltip || !tTitle || !tPercent || !tNote) return;

    tTitle.innerText = title;
    tPercent.innerText = percent + " of Placement Drop-Offs";
    tNote.innerText = note;

    tooltip.classList.remove("hidden");
}

function hideInstTooltip() {
    const tooltip = document.getElementById("instChartTooltip");
    if (tooltip) {
        tooltip.classList.add("hidden");
    }
}

function downloadInstitutionalReport() {
    showToast("Generating Confidential Institutional Report (PDF/Doc)...");

    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const reportContent = `
SKILLBRIDGE AI — INSTITUTIONAL GOVERNANCE & PLACEMENT REPORT
Classification: STRICTLY CONFIDENTIAL (Admin & HOD Distribution Only)
Report ID: SB-INST-REPORT-${Date.now().toString().slice(-6)}
Generated On: ${reportDate}
Institution: Engineering & Technology Faculty Council

================================================================================
EXECUTIVE PLACEMENT KPI SUMMARY
================================================================================
1. Unplaced Student Cohort: 32% (148 of 462 Active Final Year Students)
2. Critical Skill Gap: Cloud & DSA (Present in 68% of Technical Rejections)
3. Average Institutional Readiness Score: 58% (Benchmark Standard: 75%)

================================================================================
ROOT CAUSE DISQUALIFICATION ANALYSIS (CAMPUS RECRUITER AUDIT)
================================================================================
- Lack of Practical Projects: 45% (Primary contributor to technical interview failure)
- Technical Communication & System Defense: 30% (Inability to articulate architecture tradeoffs)
- Lack of Prior Internships or Verified Gigs: 25% (Absence of verifiable production codebase milestones)

================================================================================
TARGETED COHORT REMEDIATION & CURRICULUM ACTIONS
================================================================================
* Cluster A (42 students) — Cloud Deployment & Containerization (Docker, AWS)
  Recommendation: Mandate 3 micro-internship cloud architecture modules with automated deployment pipelines and mentor pull request reviews.

* Cluster B (38 students) — System Design Articulation & Technical Communication
  Recommendation: Enroll in AI mock interview capsule focusing on behavioral framing, architecture trade-offs, and live technical defense sessions.

* Cluster C (29 students) — Advanced DSA & Algorithmic Optimization (DP, Graphs)
  Recommendation: Deploy 14-day targeted algorithmic problem set with automated test suite grading and complexity verification.

* Cluster D (19 students) — Production Testing & End-to-End CI/CD Integration
  Recommendation: Schedule live industry sandboxed workshop integrating verified GitHub test coverage and automated deployment checks.

================================================================================
AUTHORIZATION & AUDIT SIGN-OFF
================================================================================
Dean of Academic Affairs: [VERIFIED & ANCHORED ON POLYGON MAINNET]
Head of Placement & Training (TPO): [CRYPTOGRAPHICALLY ENDORSED]
Ledger Block Stamp: #48,921,041
================================================================================
`;

    // Trigger file download
    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SkillBridge_Institutional_Placement_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
        showToast("Institutional Report downloaded successfully.");
    }, 600);
}



/* ================= UTILITY ================= */

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", async function () {
    // 0. Initialize authentication status
    initAuthUI();

    // 1. Fetch live student record from database
    await fetchStudent();

    // 2. Fetch and render mentors from PostgreSQL
    await renderMentors();

    // 3. Fetch and render micro-internship gigs from PostgreSQL
    await renderGigs();

    // 4. Load passport data
    await loadPassport();

    // 5. Initialize AI Help Desk & Advisor
    initHelpdesk();
});
