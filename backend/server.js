const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT =
    process.env.PORT || 5000;


/* ================= MIDDLEWARE ================= */

app.use(
    cors()
);

app.use(
    express.json()
);


/* ================= DEMO DATABASE ================= */

const students = [

    {
        id:1,

        name:"Adarsh Pratap Singh",

        course:"CSIT",

        batch:"2025-29",

        targetRole:
            "Full Stack Software Engineer",

        careerReadiness:81,

        experienceScore:64

    }

];


const mentors = [

    {
        id:1,

        name:"Rohan Mehta",

        role:"Senior Software Architect",

        company:"TechNova Labs",

        experience:12,

        match:94

    },

    {
        id:2,

        name:"Priya Sharma",

        role:"Engineering Manager",

        company:"CloudSphere",

        experience:10,

        match:91

    },

    {
        id:3,

        name:"Arjun Kapoor",

        role:"AI/ML Lead",

        company:"DataSphere AI",

        experience:14,

        match:88

    }

];


const gigs = [

    {
        id:1,

        title:
            "Build a Responsive Product Landing Page",

        company:
            "TechNova Labs",

        skill:
            "Web Development",

        hours:3,

        payment:1500

    },

    {
        id:2,

        title:
            "Build an Authenticated REST API",

        company:
            "CloudSphere",

        skill:
            "Backend",

        hours:5,

        payment:3500

    },

    {
        id:3,

        title:
            "SQL Business Analytics Challenge",

        company:
            "FinEdge Systems",

        skill:
            "SQL",

        hours:3,

        payment:1800

    }

];


/* ================= HEALTH ================= */

app.get(
    "/api/health",
    (req,res) => {

        res.json({

            status:"online",

            service:
                "SkillBridge AI Backend",

            version:"1.0.0"

        });

    }
);


/* ================= STUDENT ================= */

app.get(
    "/api/student",
    (req,res) => {

        res.json(
            students[0]
        );

    }
);


/* ================= MENTORS ================= */

app.get(
    "/api/mentors",
    (req,res) => {

        res.json(
            mentors
        );

    }
);


/* ================= BEST MENTOR ================= */

app.get(
    "/api/mentors/best-match",
    (req,res) => {

        const best =
            mentors
            .sort(
                (a,b) =>
                    b.match - a.match
            )[0];


        res.json(best);

    }
);


/* ================= GIGS ================= */

app.get(
    "/api/gigs",
    (req,res) => {

        res.json(gigs);

    }
);


/* ================= APPLY GIG ================= */

app.post(
    "/api/gigs/apply",
    (req,res) => {

        const {
            studentId,
            gigId,
            message
        } = req.body;


        if(
            !studentId ||
            !gigId
        ){

            return res.status(400)
                .json({

                    error:
                        "studentId and gigId are required"

                });

        }


        res.status(201)
            .json({

                success:true,

                applicationId:
                    "APP-" +
                    Date.now(),

                message:
                    "Application submitted successfully",

                studentId,

                gigId,

                applicantMessage:
                    message || ""

            });

    }
);


/* ================= MENTOR BOOKING ================= */

app.post(
    "/api/mentors/book",
    (req,res) => {

        const {
            studentId,
            mentorId,
            date,
            time
        } = req.body;


        if(
            !studentId ||
            !mentorId ||
            !date ||
            !time
        ){

            return res.status(400)
                .json({

                    error:
                        "Complete booking information is required"

                });

        }


        res.status(201)
            .json({

                success:true,

                bookingId:
                    "MENTOR-" +
                    Date.now(),

                status:
                    "pending",

                durationMinutes:15,

                studentId,

                mentorId,

                date,

                time

            });

    }
);


/* ================= CAREER ANALYSIS ================= */

app.get(
    "/api/ai/career-analysis",
    (req,res) => {

        res.json({

            student:
                "Adarsh Pratap Singh",

            recommendedRole:
                "Full Stack Software Engineer",

            compatibility:87,

            placementReadiness:91,

            strongestSkill:
                "Git & Collaboration",

            priorityGap:
                "Backend Architecture",

            recommendation:[
                "Complete backend micro-gig",
                "Attend system design mentor capsule",
                "Deploy authenticated REST API"
            ]

        });

    }
);


/* ================= SKILL GAP ================= */

app.get(
    "/api/ai/skill-gaps",
    (req,res) => {

        res.json({

            gaps:[

                {
                    skill:
                        "Backend Architecture",

                    severity:
                        "Critical",

                    current:
                        42,

                    required:
                        92

                },

                {
                    skill:
                        "REST API Design",

                    severity:
                        "High",

                    current:
                        55,

                    required:
                        86

                },

                {
                    skill:
                        "Database Optimization",

                    severity:
                        "Medium",

                    current:
                        61,

                    required:
                        88

                },

                {
                    skill:
                        "Cloud Deployment",

                    severity:
                        "Medium",

                    current:
                        57,

                    required:
                        78

                }

            ]

        });

    }
);


/* ================= START SERVER ================= */

app.listen(
    PORT,
    () => {

        console.log(
            `SkillBridge AI backend running on port ${PORT}`
        );

    }
);