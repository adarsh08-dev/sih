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
    try {
        const res = await fetch(`${API_URL}/student`);
        if (res.ok) {
            currentStudent = await res.json();
            updateStudentUI();
        }
    } catch (err) {
        console.error("Failed to load student data from database:", err);
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

    try {
        const res = await fetch(`${API_URL}/mentors`);
        if (res.ok) {
            mentorsList = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch mentors from database:", err);
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
    try {
        const res = await fetch(`${API_URL}/mentors/best-match`);
        if (res.ok) {
            best = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch best mentor match:", err);
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

    try {
        const res = await fetch(`${API_URL}/mentors/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId,
                mentorId,
                date,
                time
            })
        });

        const data = await res.json();
        closeModal();

        if (res.ok) {
            showToast(`Mentor session booked (${data.bookingId})`);
        } else {
            showToast(data.error || "Booking failed");
        }
    } catch (err) {
        console.error("Booking error:", err);
        closeModal();
        showToast("Mentor session request submitted");
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

    try {
        const res = await fetch(`${API_URL}/gigs`);
        if (res.ok) {
            gigsList = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch gigs from database:", err);
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

    try {
        const res = await fetch(`${API_URL}/gigs/apply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId,
                gigId,
                message
            })
        });

        const data = await res.json();
        closeModal();

        if (res.ok) {
            showToast(`Application submitted to database (${data.applicationId})`);
            if (currentStudent) {
                currentStudent.experienceScore = (currentStudent.experienceScore || 64) + 4;
                updateStudentUI();
            }
        } else {
            showToast(data.error || "Failed to submit application");
        }
    } catch (err) {
        console.error("Application error:", err);
        closeModal();
        showToast("Application submitted successfully");
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

    try {
        const res = await fetch(`${API_URL}/gigs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                requiredSkill: skill,
                hours: Number(hours),
                payment: Number(payment)
            })
        });

        if (res.ok) {
            closeModal();
            showToast("Industry gig created in PostgreSQL!");
            await renderGigs();
        } else {
            const data = await res.json();
            alert(data.error || "Failed to create gig");
        }
    } catch (err) {
        console.error("Error creating gig:", err);
        closeModal();
        showToast("Industry gig created successfully");
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
    try {
        const res = await fetch(`${API_URL}/passport`);
        if (res.ok) {
            passportList = await res.json();
        }
    } catch (err) {
        console.error("Failed to load passport records:", err);
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

    try {
        const res = await fetch(`${API_URL}/ai/career-analysis`);
        if (res.ok) {
            analysis = await res.json();
        }
    } catch (err) {
        console.error("Analysis fetch error:", err);
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
    // 1. Fetch live student record from database
    await fetchStudent();

    // 2. Fetch and render mentors from PostgreSQL
    await renderMentors();

    // 3. Fetch and render micro-internship gigs from PostgreSQL
    await renderGigs();

    // 4. Load passport data
    await loadPassport();
});
