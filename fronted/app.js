/* =========================================================
   SKILLBRIDGE AI FRONTEND ENGINE
========================================================= */

const API_URL = "http://localhost:5000/api";


/* ================= DATA ================= */

const mentors = [

    {
        name:"Rohan Mehta",
        role:"Senior Software Architect",
        company:"TechNova Labs",
        experience:"12 years",
        skills:"Backend Architecture · System Design · Cloud",
        match:94
    },

    {
        name:"Priya Sharma",
        role:"Engineering Manager",
        company:"CloudSphere",
        experience:"10 years",
        skills:"React · Product Engineering · Leadership",
        match:91
    },

    {
        name:"Arjun Kapoor",
        role:"AI/ML Lead",
        company:"DataSphere AI",
        experience:"14 years",
        skills:"Python · AI · Machine Learning",
        match:88
    },

    {
        name:"Neha Verma",
        role:"Product Designer",
        company:"PixelCraft",
        experience:"9 years",
        skills:"UI/UX · Design Systems · Product",
        match:83
    }

];


const gigs = [

    {
        title:"Build a Responsive Product Landing Page",
        company:"TechNova Labs",
        skill:"Web Development",
        hours:3,
        pay:1500,
        level:"Beginner"
    },

    {
        title:"Clean and Validate Business Dataset",
        company:"DataSphere AI",
        skill:"Python",
        hours:4,
        pay:2200,
        level:"Intermediate"
    },

    {
        title:"Design Three Mobile Product Screens",
        company:"PixelCraft",
        skill:"UI/UX",
        hours:2,
        pay:1000,
        level:"Beginner"
    },

    {
        title:"Build an Authenticated REST API",
        company:"CloudSphere",
        skill:"Web Development",
        hours:5,
        pay:3500,
        level:"Advanced"
    },

    {
        title:"SQL Business Analytics Challenge",
        company:"FinEdge Systems",
        skill:"Data",
        hours:3,
        pay:1800,
        level:"Intermediate"
    },

    {
        title:"Build a Reusable React Component Set",
        company:"CodeWorks",
        skill:"Web Development",
        hours:4,
        pay:2800,
        level:"Intermediate"
    }

];


/* ================= PAGE SYSTEM ================= */

function openPage(pageId, element){

    document
        .querySelectorAll(".page")
        .forEach(page =>
            page.classList.remove("active")
        );


    const page =
        document.getElementById(pageId);

    if(page){
        page.classList.add("active");
    }


    document
        .querySelectorAll(".nav")
        .forEach(nav =>
            nav.classList.remove("active")
        );


    if(element){
        element.classList.add("active");
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


/* ================= MODAL ================= */

function showModal(title,content){

    document
        .getElementById("modalTitle")
        .innerText = title;

    document
        .getElementById("modalContent")
        .innerHTML = content;

    document
        .getElementById("modal")
        .classList.add("show");
}


function closeModal(){

    document
        .getElementById("modal")
        .classList.remove("show");
}


/* ================= TOAST ================= */

function showToast(message){

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    },2800);

}


/* ================= AI ASSESSMENT ================= */

function runAssessment(){

    showModal(

        "AI Career Assessment",

        `
        <div class="feature-card">

            <label>
                AI ANALYSIS COMPLETE
            </label>

            <h2 style="margin:10px 0">
                87% Full Stack Compatibility
            </h2>

            <p>
                Your current profile has strong
                frontend, programming and collaboration
                signals.
            </p>

        </div>

        <br>

        <div class="two-grid">

            <div class="panel">

                <b>Strongest Capability</b>

                <p>
                    Git & Collaboration · 88%
                </p>

            </div>

            <div class="panel">

                <b>Priority Gap</b>

                <p>
                    Backend Architecture · 42%
                </p>

            </div>

        </div>

        <br>

        <div class="panel">

            <b>AI Recommendation</b>

            <p>
                Complete a backend micro-internship,
                attend a system-design mentor capsule
                and deploy an authenticated REST API.
            </p>

        </div>

        <br>

        <button
            class="primary-btn"
            onclick="closeModal();generateRoadmap()"
        >
            Generate 30-Day Roadmap
        </button>
        `
    );
}


/* ================= ROADMAP ================= */

function generateRoadmap(){

    showModal(

        "30-Day AI Career Roadmap",

        `
        <div class="panel">

            <h3>Week 1 — Backend Foundations</h3>

            <p>
                HTTP, Node.js, Express and API architecture.
            </p>

        </div>

        <br>

        <div class="panel">

            <h3>Week 2 — Production APIs</h3>

            <p>
                Authentication, validation, error handling
                and API documentation.
            </p>

        </div>

        <br>

        <div class="panel">

            <h3>Week 3 — Database Engineering</h3>

            <p>
                SQL, PostgreSQL, indexes and optimization.
            </p>

        </div>

        <br>

        <div class="panel">

            <h3>Week 4 — Cloud Deployment</h3>

            <p>
                Deploy, monitor and document a production
                style project.
            </p>

        </div>
        `
    );
}


/* ================= MENTORS ================= */

function renderMentors(){

    const container =
        document.getElementById("mentorList");

    if(!container) return;

    container.innerHTML = mentors.map(
        mentor => `

        <div class="panel">

            <div class="mentor">

                <div class="mentor-avatar">

                    ${
                        mentor.name
                        .split(" ")
                        .map(x => x[0])
                        .join("")
                    }

                </div>

                <div>

                    <h3>
                        ${mentor.name}
                    </h3>

                    <p>
                        ${mentor.role}
                    </p>

                    <p>
                        ${mentor.company}
                    </p>

                    <p>
                        ${mentor.experience}
                    </p>

                    <span class="green-badge">
                        Available this month
                    </span>

                    <p>
                        ${mentor.skills}
                    </p>

                </div>

            </div>

            <br>

            <strong class="match">
                ${mentor.match}% Match
            </strong>

            <button
                class="primary-small"
                onclick="bookMentor('${mentor.name}')"
            >
                Schedule 15-Minute Capsule
            </button>

        </div>

        `
    ).join("");
}


function findBestMentor(){

    const mentor = mentors[0];

    showModal(

        "Best AI Mentor Match",

        `
        <div class="feature-card">

            <label>
                AI MATCH SCORE
            </label>

            <h2>
                ${mentor.match}% Compatibility
            </h2>

            <h3>
                ${mentor.name}
            </h3>

            <p>
                ${mentor.role}
            </p>

            <p>
                ${mentor.company}
            </p>

        </div>

        <br>

        <button
            class="primary-btn"
            onclick="
                closeModal();
                bookMentor('${mentor.name}')
            "
        >
            Schedule Session
        </button>
        `
    );
}


function bookMentor(name){

    showModal(

        "Schedule Mentor Capsule",

        `
        <div class="panel">

            <h3>
                ${name}
            </h3>

            <p>
                Select a date and available 15-minute
                monthly conversation slot.
            </p>

        </div>

        <br>

        <label>Date</label>

        <input
            type="date"
            style="
                width:100%;
                padding:11px;
                margin:7px 0 15px;
                border:1px solid #e5e7eb;
                border-radius:9px;
            "
        >

        <label>Available Time</label>

        <select
            style="
                width:100%;
                padding:11px;
                margin:7px 0 15px;
                border:1px solid #e5e7eb;
                border-radius:9px;
            "
        >

            <option>10:00 AM</option>
            <option>12:30 PM</option>
            <option>4:00 PM</option>
            <option>6:30 PM</option>

        </select>

        <button
            class="primary-btn"
            onclick="
                closeModal();
                showToast('Mentor session request submitted')
            "
        >
            Confirm Session
        </button>
        `
    );
}


/* ================= GIG BOARD ================= */

function renderGigs(){

    const container =
        document.getElementById("gigList");

    if(!container) return;


    const input =
        document.getElementById("gigSearch");

    const query =
        input ?
        input.value.toLowerCase() :
        "";


    const filtered =
        gigs.filter(gig => {

            const text =
                `
                ${gig.title}
                ${gig.company}
                ${gig.skill}
                `.toLowerCase();

            return text.includes(query);

        });


    container.innerHTML =
        filtered.map(
            gig => `

        <div class="panel">

            <span class="purple-badge">
                ${gig.skill}
            </span>

            <h3>
                ${gig.title}
            </h3>

            <p>
                ${gig.company}
            </p>

            <br>

            <p>
                Duration:
                <b>${gig.hours} hours</b>
            </p>

            <p>
                Difficulty:
                <b>${gig.level}</b>
            </p>

            <br>

            <h2>
                ₹${gig.pay}
            </h2>

            <button
                class="primary-small"
                onclick="applyGig('${gig.title}')"
            >
                Apply
            </button>

        </div>

        `
        ).join("");
}


function applyGig(title){

    showModal(

        "Micro-Internship Application",

        `
        <div class="feature-card">

            <label>
                AI PROFILE MATCH
            </label>

            <h3>
                ${title}
            </h3>

            <p>
                Your current profile is compatible
                with this task.
            </p>

        </div>

        <br>

        <textarea
            id="gigMessage"
            placeholder="Write a short message to the company..."
            style="
                width:100%;
                height:110px;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
            "
        ></textarea>

        <br><br>

        <button
            class="primary-btn"
            onclick="submitGig()"
        >
            Submit Application
        </button>
        `
    );
}


function submitGig(){

    let score =
        Number(
            localStorage.getItem(
                "skillbridgeScore"
            ) || 64
        );

    score += 4;

    localStorage.setItem(
        "skillbridgeScore",
        score
    );

    updateScore();

    closeModal();

    showToast(
        "Micro-internship application submitted"
    );
}


function postGig(){

    showModal(

        "Create Industry Micro-Gig",

        `
        <label>Task Title</label>

        <input
            placeholder="Example: Build React Dashboard"
            style="
                width:100%;
                padding:11px;
                margin:7px 0 14px;
                border:1px solid #e5e7eb;
                border-radius:9px;
            "
        >

        <label>Required Skill</label>

        <input
            placeholder="Example: React"
            style="
                width:100%;
                padding:11px;
                margin:7px 0 14px;
                border:1px solid #e5e7eb;
                border-radius:9px;
            "
        >

        <label>Duration</label>

        <select
            style="
                width:100%;
                padding:11px;
                margin:7px 0 14px;
                border:1px solid #e5e7eb;
                border-radius:9px;
            "
        >
            <option>2 Hours</option>
            <option>3 Hours</option>
            <option>4 Hours</option>
            <option>5 Hours</option>
        </select>

        <label>Payment</label>

        <input
            placeholder="₹"
            style="
                width:100%;
                padding:11px;
                margin:7px 0 15px;
                border:1px solid #e5e7eb;
                border-radius:9px;
            "
        >

        <button
            class="primary-btn"
            onclick="
                closeModal();
                showToast('Industry gig created successfully')
            "
        >
            Publish Gig
        </button>
        `
    );
}


/* ================= JOBS ================= */

function applyJob(company){

    showToast(
        `Application submitted to ${company}`
    );

}


/* ================= INDUSTRY ================= */

function startCollaboration(){

    showModal(

        "Industry Collaboration",

        `
        <div class="two-grid">

            <button
                class="outline-btn"
                onclick="
                    closeModal();
                    showToast('Industry project request created')
                "
            >
                Industry Project
            </button>

            <button
                class="outline-btn"
                onclick="
                    closeModal();
                    showToast('Internship partnership request created')
                "
            >
                Internship Partnership
            </button>

            <button
                class="outline-btn"
                onclick="
                    closeModal();
                    showToast('Institution program request created')
                "
            >
                Institution Program
            </button>

            <button
                class="outline-btn"
                onclick="
                    closeModal();
                    showToast('Industry challenge request created')
                "
            >
                Industry Challenge
            </button>

        </div>
        `
    );
}


function acceptChallenge(name){

    showModal(

        "Industry Challenge",

        `
        <div class="feature-card">

            <label>
                COMPANY EVALUATED
            </label>

            <h2>
                ${name}
            </h2>

            <p>
                Completing this challenge creates a
                verified portfolio signal inside your
                Experience Passport.
            </p>

        </div>

        <br>

        <button
            class="primary-btn"
            onclick="
                closeModal();
                showToast('Challenge added to workspace')
            "
        >
            Accept Challenge
        </button>
        `
    );
}


/* ================= PASSPORT ================= */

function exportPassport(){

    const profile = {

        name:"Adarsh Pratap Singh",

        course:"CSIT",

        batch:"2025-29",

        careerReadiness:"81%",

        experienceScore:
            localStorage.getItem(
                "skillbridgeScore"
            ) || 64,

        verifiedTasks:3,

        projects:8

    };


    const file =
        new Blob(
            [
                JSON.stringify(
                    profile,
                    null,
                    2
                )
            ],
            {
                type:"application/json"
            }
        );


    const url =
        URL.createObjectURL(file);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "Adarsh_Experience_Passport.json";

    link.click();

    URL.revokeObjectURL(url);

}


/* ================= NOTIFICATIONS ================= */

function showNotifications(){

    showModal(

        "Notifications",

        `
        <div class="panel">

            <b>Mentor Capsule Available</b>

            <p>
                Your monthly mentorship session
                can now be scheduled.
            </p>

        </div>

        <br>

        <div class="panel">

            <b>New Backend Micro-Gig</b>

            <p>
                An authenticated REST API task
                matches your profile.
            </p>

        </div>

        <br>

        <div class="panel">

            <b>Skill Milestone</b>

            <p>
                Your career readiness increased
                this cycle.
            </p>

        </div>
        `
    );
}


/* ================= SCORE ================= */

function updateScore(){

    const score =
        localStorage.getItem(
            "skillbridgeScore"
        ) || 64;


    const experience =
        document.getElementById(
            "experienceScore"
        );

    const passport =
        document.getElementById(
            "passportScore"
        );


    if(experience){
        experience.innerText = score;
    }

    if(passport){
        passport.innerText = score;
    }
}


/* ================= BACKEND TEST ================= */

async function testBackend(){

    try{

        const response =
            await fetch(
                `${API_URL}/health`
            );


        const data =
            await response.json();


        console.log(
            "Backend:",
            data
        );

    }

    catch(error){

        console.log(
            "Backend is not running yet."
        );

    }

}


/* ================= INIT ================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        renderMentors();

        renderGigs();

        updateScore();

        testBackend();

    }
);