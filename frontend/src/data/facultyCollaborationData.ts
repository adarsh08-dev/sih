import { 
  ResearchCollaboration, 
  LiveIndustryProject, 
  FacultyStudentMentorship, 
  WorkshopGuestLecture,
  FacultyMyApplication,
  FacultyMyCollaboration,
  FacultyAchievementCertificate,
  AcademicIntelligenceMetrics
} from '../types';

// ==========================================
// 1. RESEARCH COLLABORATION SEED DATA
// ==========================================
export const initialResearchCollaborations: ResearchCollaboration[] = [
  {
    id: 'res-collab-01',
    title: 'Explainable AI Framework for Clinical Decision Support in Multi-Modal Oncology',
    partnerInstitution: 'AIIMS New Delhi & IIT Roorkee',
    pi: 'Dr. Arvind K. Sharma (PI)',
    coPis: ['Dr. Meenakshi Sundaram (Co-PI)', 'Dr. Rajesh Narang (AIIMS)'],
    fundingAgency: 'DST-SERB (Science and Engineering Research Board)',
    grantAmount: 3850000,
    grantAmountFormatted: '₹38,50,000',
    duration: '36 Months (2025–2028)',
    startDate: '2025-07-01',
    endDate: '2028-06-30',
    status: 'Active/Ongoing',
    researchDomain: 'Medical AI & Explainable Deep Learning',
    thrustArea: 'Healthcare Analytics, Computational Pathology, Trustworthy AI',
    description: 'Collaborative interdisciplinary research grant developing interpretable deep learning architectures and counterfactual attention mechanisms for early biomarker detection in oncological histopathology scans.',
    sanctionOrderNumber: 'DST/SERB/EEQ/2025/000418',
    keyDeliverables: [
      'Multi-modal transformer attention map visualization pipeline',
      'Clinical trial dataset validation with 5,000+ anonymized biopsy slides',
      'Federated learning protocol safeguarding multi-hospital patient privacy'
    ],
    publicationsExpected: '3 Q1 Scopus/SCI Indexed Journals & 1 PCT International Patent',
    milestones: [
      { id: 'rm1', title: 'Data Ingestion Architecture & Ethical Compliance Approval', targetDate: '2025-12-31', completed: true, grantShare: '₹12,00,000' },
      { id: 'rm2', title: 'Attention-Guided Transformer Benchmark & Model Training', targetDate: '2026-12-31', completed: true, grantShare: '₹14,50,000' },
      { id: 'rm3', title: 'Clinical Validation Pilot & Hospital EMR Integration Trials', targetDate: '2027-12-31', completed: false, grantShare: '₹12,00,000' }
    ]
  },
  {
    id: 'res-collab-02',
    title: 'Cryptographic Protocols for Post-Quantum Blockchain Ledgers & Zero-Knowledge Audits',
    partnerInstitution: 'IISc Bangalore & TechNova Labs',
    pi: 'Dr. Arvind K. Sharma (PI)',
    coPis: ['Dr. V. K. Singh (Co-PI, CSIT)', 'Prof. A. Sridhar (IISc)'],
    fundingAgency: 'MeitY (Ministry of Electronics & Information Technology R&D Division)',
    grantAmount: 4500000,
    grantAmountFormatted: '₹45,00,000',
    duration: '24 Months (2026–2028)',
    startDate: '2026-04-01',
    endDate: '2028-03-31',
    status: 'Active/Ongoing',
    researchDomain: 'Post-Quantum Cryptography & Distributed Systems',
    thrustArea: 'Lattice Cryptography, zk-SNARKs, Quantum-Resistant Ledger Consensus',
    description: 'National cybersecurity research initiative engineering lattice-based signature algorithms and succinct zero-knowledge proof primitives capable of resisting Shor algorithm attacks on distributed university credential ledgers.',
    sanctionOrderNumber: 'MeitY/R&D/CYBER/2026/089',
    keyDeliverables: [
      'Lattice-based Falcon & Dilithium cryptographic hardware acceleration module',
      'Quantum-safe transaction validation consensus benchmark',
      'Open-source Rust implementation with formal verification proofs'
    ],
    publicationsExpected: '2 IEEE Transactions on Dependable and Secure Computing (TDSC) Papers',
    milestones: [
      { id: 'rm1', title: 'Lattice Signature Benchmarking on ARM & x86_64', targetDate: '2026-10-30', completed: true, grantShare: '₹15,00,000' },
      { id: 'rm2', title: 'Zero-Knowledge Proof Circuit Construction & Verification', targetDate: '2027-04-30', completed: false, grantShare: '₹18,00,000' },
      { id: 'rm3', title: 'High-Throughput Testnet Deployment across Academic Consortium', targetDate: '2028-03-31', completed: false, grantShare: '₹12,00,000' }
    ]
  },
  {
    id: 'res-collab-03',
    title: 'Autonomous Edge IoT Sensor Networks for River Basin Telemetry & Flood Forecasting',
    partnerInstitution: 'CSIR-National Institute of Hydrology (NIH)',
    pi: 'Dr. Meenakshi Sundaram (PI)',
    coPis: ['Dr. Arvind K. Sharma (Co-PI)'],
    fundingAgency: 'Ministry of Jal Shakti / CSIR Joint Grant',
    grantAmount: 2600000,
    grantAmountFormatted: '₹26,00,000',
    duration: '18 Months (2025–2026)',
    startDate: '2025-01-15',
    endDate: '2026-07-15',
    status: 'Completed',
    researchDomain: 'IoT Edge Computing & Environmental Modeling',
    thrustArea: 'LoRaWAN Edge Nodes, Hydrological Runoff Prediction, Real-Time Telemetry',
    description: 'Deployment of solar-powered edge computing nodes along the Ramganga river basin to monitor hydraulic discharge, sediment runoff, and trigger automated alerts 12 hours ahead of peak flood crests.',
    sanctionOrderNumber: 'CSIR/JAL/2025/1104',
    keyDeliverables: [
      '30 Solar LoRaWAN hydrological sensing nodes installed along catchment zones',
      'Hydrological AI runoff forecasting model integrated with Bareilly District Disaster Unit',
      'Final Technology Transfer Documentation and Web GIS Dashboard handover'
    ],
    publicationsExpected: '2 Elsevier Journal of Hydrology Papers & 1 Best Paper Award',
    milestones: [
      { id: 'rm1', title: 'Sensor Hardware Design & Field Deployment', targetDate: '2025-06-30', completed: true, grantShare: '₹10,00,000' },
      { id: 'rm2', title: 'Monsoon Flood Prediction Benchmark & Telemetry Calibration', targetDate: '2025-11-30', completed: true, grantShare: '₹10,00,000' },
      { id: 'rm3', title: 'Final Report Submission & Institutional Signoff', targetDate: '2026-07-15', completed: true, grantShare: '₹6,00,000' }
    ]
  },
  {
    id: 'res-collab-04',
    title: 'Neuromorphic Spiking Neural Accelerators for Low-Power Micro-Satellites',
    partnerInstitution: 'ISRO Telemetry Tracking & Command Network (ISTRAC)',
    pi: 'Dr. Arvind K. Sharma (PI)',
    coPis: ['Dr. P. K. Rastogi (Co-PI, ECE)'],
    fundingAgency: 'ISRO RESPOND Research Scheme',
    grantAmount: 5200000,
    grantAmountFormatted: '₹52,00,000',
    duration: '36 Months (2026–2029)',
    startDate: '2026-11-01',
    endDate: '2029-10-31',
    status: 'Proposal Stage',
    researchDomain: 'Neuromorphic Computing & Space Electronics',
    thrustArea: 'Spiking Neural Networks (SNN), Radiation-Tolerant FPGA, On-Orbit AI',
    description: 'Joint research proposal exploring ultra-low power event-based neuromorphic computer vision circuits for real-time orbital debris tracking and satellite attitude estimation on CubeSat payloads.',
    sanctionOrderNumber: 'ISRO/RESPOND/2026/PROP-082',
    keyDeliverables: [
      'FPGA-synthesized SNN architecture consuming under 3.5 Watts in continuous inferencing',
      'Radiation-hardening-by-design (RHBD) simulation test bench',
      'Space-grade telemetry processor prototype with ESA/ISRO compatibility'
    ],
    publicationsExpected: 'IEEE Transactions on Aerospace and Electronic Systems Target',
    milestones: [
      { id: 'rm1', title: 'ISRO RESPOND Technical Board Review & Defense', targetDate: '2026-11-15', completed: false, grantShare: '₹10,00,000' },
      { id: 'rm2', title: 'Neuromorphic Simulator Development in Brian2/Lava', targetDate: '2027-06-30', completed: false, grantShare: '₹22,00,000' },
      { id: 'rm3', title: 'FPGA Payload Thermal-Vacuum Chamber Testing', targetDate: '2028-12-31', completed: false, grantShare: '₹20,00,000' }
    ]
  }
];

// ==========================================
// 2. LIVE INDUSTRY PROJECTS SEED DATA
// ==========================================
export const initialLiveProjects: LiveIndustryProject[] = [
  {
    id: 'live-proj-01',
    title: 'Real-Time Telemetry & Predictive Anomaly Engine for Heavy Turbines',
    clientCompany: 'Siemens Industrial India Ltd.',
    facultyMentor: 'Dr. Arvind K. Sharma (Lead Mentor)',
    coMentor: 'Er. Sandeep Bhasin (Siemens Principal Engineer)',
    teamSize: 5,
    teamSizeFormatted: '5 Students + 1 Faculty Mentor',
    studentTeam: [
      { name: 'Aarav Sharma', rollNo: '230104011', role: 'Team Lead & Backend Architecture', program: 'B.Tech CSE VII' },
      { name: 'Pooja Verma', rollNo: '230104056', role: 'Data Ingestion & Kafka Engineer', program: 'B.Tech CSE VII' },
      { name: 'Tanmay Saxena', rollNo: '230104078', role: 'ML Time-Series Modeler', program: 'B.Tech IT VII' },
      { name: 'Simran Kaur', rollNo: '230104092', role: 'Telemetry Dashboard UI (React/D3)', program: 'B.Tech CSE VII' },
      { name: 'Devendra Patel', rollNo: '230104104', role: 'Docker & Microservices Deployment', program: 'B.Tech IT VII' }
    ],
    techStack: ['Python', 'Apache Kafka', 'TimescaleDB', 'Docker', 'React', 'FastAPI'],
    domain: 'Industrial IoT & Predictive Maintenance',
    duration: '4 Months (Aug 2026 – Nov 2026)',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    status: 'Active/Ongoing',
    description: 'Students build high-frequency industrial telemetry ingestion pipelines capturing vibration, thermal dissipation, and rotational speeds across 200+ sensor streams to detect micro-cavitation anomalies in industrial turbines.',
    githubOrJiraRef: 'github.com/mjpru-csit/siemens-telemetry-engine',
    stipendOrBounty: '₹15,000/month per student + Pre-Placement Interviews (PPI)',
    deliverables: [
      'Zero-loss streaming buffer handling 50k events/sec',
      'Isolation Forest & LSTM anomaly detection microservice with <50ms latency',
      'Executive telemetry dashboard with threshold alerting and automated PDF incident logs'
    ],
    industrySupervisor: {
      name: 'Er. Sandeep Bhasin',
      designation: 'Director of Industrial Digitalization, Siemens Pune',
      email: 'sandeep.bhasin@siemens.com'
    },
    keyMilestones: [
      { id: 'lm1', title: 'Data Schema Definition & Simulator Pipeline', dueDate: '2026-08-30', completed: true },
      { id: 'lm2', title: 'Kafka Message Bus & TimescaleDB Ingestion Cluster', dueDate: '2026-09-30', completed: true },
      { id: 'lm3', title: 'LSTM Anomaly Detection & Live Threshold Alerting', dueDate: '2026-10-31', completed: false },
      { id: 'lm4', title: 'Final Siemens Review & Deployment Handoff', dueDate: '2026-11-30', completed: false }
    ]
  },
  {
    id: 'live-proj-02',
    title: 'Next-Gen Zero-Trust API Gateway with eBPF Kernel Auditing',
    clientCompany: 'Cisco Security Innovations',
    facultyMentor: 'Dr. Meenakshi Sundaram',
    coMentor: 'Dr. Arvind K. Sharma',
    teamSize: 4,
    teamSizeFormatted: '4 Students + 1 Faculty Mentor',
    studentTeam: [
      { name: 'Rohan Malhotra', rollNo: '230104082', role: 'eBPF Kernel Probes & C Programmer', program: 'B.Tech IT VII' },
      { name: 'Kritika Joshi', rollNo: '230104033', role: 'Golang Gateway & Reverse Proxy', program: 'B.Tech CSE VII' },
      { name: 'Abhishek Tiwari', rollNo: '230104005', role: 'mTLS Security & Vault Secrets', program: 'B.Tech CSE VII' },
      { name: 'Nisha Rawat', rollNo: '230104047', role: 'Prometheus & Grafana Observability', program: 'B.Tech IT VII' }
    ],
    techStack: ['Golang', 'eBPF (C)', 'gRPC', 'Kubernetes', 'Prometheus', 'Envoy'],
    domain: 'Cloud Security & Systems Programming',
    duration: '5 Months (Jul 2026 – Nov 2026)',
    startDate: '2026-07-15',
    endDate: '2026-11-30',
    status: 'Active/Ongoing',
    description: 'Undergraduate student capstone project designing an ultra-low latency API gateway enforcing zero-trust mTLS verification and tracing unauthorized kernel network socket calls via Linux eBPF telemetry.',
    githubOrJiraRef: 'github.com/mjpru-csit/cisco-ebpf-gateway',
    stipendOrBounty: '₹18,000/month per student + Cloud Compute Credits ($2,000)',
    deliverables: [
      'eBPF socket layer packet inspector blocking unauthenticated egress traffic',
      'High-throughput Golang HTTP/3 and gRPC reverse proxy',
      'Distributed tracing dashboard with openTelemetry spans'
    ],
    industrySupervisor: {
      name: 'Ms. Shalini Murthy',
      designation: 'Principal Security Architect, Cisco Bangalore',
      email: 'smurthy@cisco.com'
    },
    keyMilestones: [
      { id: 'lm1', title: 'Kernel Probes Architecture & C Compilation Setup', dueDate: '2026-08-15', completed: true },
      { id: 'lm2', title: 'Golang mTLS Proxy & Auth Header Validation', dueDate: '2026-09-30', completed: true },
      { id: 'lm3', title: 'Benchmarking vs Envoy/Nginx & Latency Optimization', dueDate: '2026-10-31', completed: false },
      { id: 'lm4', title: 'Cisco Engineering Demo & Code Repository Transfer', dueDate: '2026-11-30', completed: false }
    ]
  },
  {
    id: 'live-proj-03',
    title: 'AI-Powered Automated KYC & Document Verification Suite',
    clientCompany: 'HDFC Digital Banking Labs',
    facultyMentor: 'Prof. R. K. Gupta',
    coMentor: 'Dr. Arvind K. Sharma',
    teamSize: 4,
    teamSizeFormatted: '4 Students + 1 Faculty Mentor',
    studentTeam: [
      { name: 'Vikas Pandey', rollNo: '230104098', role: 'Computer Vision & OCR Lead', program: 'B.Tech CSE VII' },
      { name: 'Ananya Mishra', rollNo: '240104018', role: 'FastAPI Backend & Security', program: 'B.Tech CSE V' },
      { name: 'Deepak Choudhary', rollNo: '230104022', role: 'Face Liveness Detection', program: 'B.Tech IT VII' },
      { name: 'Riya Singhal', rollNo: '230104067', role: 'React Onboarding UI', program: 'B.Tech CSE VII' }
    ],
    techStack: ['PyTorch', 'YOLOv8', 'PaddleOCR', 'FastAPI', 'Next.js', 'PostgreSQL'],
    domain: 'FinTech & Computer Vision',
    duration: '3 Months (Apr 2026 – Jun 2026)',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    status: 'Completed',
    description: 'Industrial verification tool automating identity card parsing (Aadhaar/PAN/Passport), anti-spoofing facial liveness checks, and forgery detection for seamless retail customer banking onboarding.',
    githubOrJiraRef: 'github.com/mjpru-csit/hdfc-kyc-vision',
    stipendOrBounty: '₹2,00,000 Project Milestone Completion Grant (Shared Team Bounty)',
    deliverables: [
      'Document cropping & orientation correction using YOLOv8',
      'Multilingual OCR engine with 98.4% character accuracy on damaged cards',
      '3D passive liveness detection preventing photo/screen replay spoofing'
    ],
    industrySupervisor: {
      name: 'Mr. Tarun Mathur',
      designation: 'Head of FinTech Engineering, HDFC Digital Labs Mumbai',
      email: 'tarun.mathur@hdfcbank.com'
    },
    keyMilestones: [
      { id: 'lm1', title: 'Dataset Acquisition & Annotation Pipeline', dueDate: '2026-04-20', completed: true },
      { id: 'lm2', title: 'OCR & Liveness Model Training', dueDate: '2026-05-20', completed: true },
      { id: 'lm3', title: 'End-to-End API Integration & Bank Security Audit', dueDate: '2026-06-30', completed: true }
    ]
  },
  {
    id: 'live-proj-04',
    title: 'Decentralized Supply Chain Provenance Tracker with RFID Smart Contracts',
    clientCompany: 'Mahindra Logistics Innovation Hub',
    facultyMentor: 'Dr. Arvind K. Sharma',
    coMentor: 'Er. Amitav Sen (Supply Chain Tech Lead)',
    teamSize: 3,
    teamSizeFormatted: '3 Students + 1 Faculty Mentor',
    studentTeam: [
      { name: 'Karan Mehra', rollNo: '230104031', role: 'Smart Contract Solidity Developer', program: 'B.Tech CSE VII' },
      { name: 'Sakshi Gangwar', rollNo: '230104062', role: 'RFID Hardware Integration & IoT', program: 'B.Tech IT VII' },
      { name: 'Nikhil Agarwal', rollNo: '230104044', role: 'Full-Stack Frontend & Web3.js', program: 'B.Tech CSE VII' }
    ],
    techStack: ['Solidity', 'Polygon Network', 'Node.js', 'Web3.js', 'TailwindCSS', 'IPFS'],
    domain: 'Logistics & Decentralized Web3',
    duration: '4 Months (Sep 2026 – Dec 2026)',
    startDate: '2026-09-15',
    endDate: '2027-01-15',
    status: 'Proposal Stage',
    description: 'Proposed joint venture to develop tamper-proof cold-chain logistics tracing using lightweight RFID gateways that write temperature excursions and GPS waypoints directly to Polygon smart contracts.',
    githubOrJiraRef: 'github.com/mjpru-csit/mahindra-supplychain-poc',
    stipendOrBounty: '₹12,000/month per student proposed',
    deliverables: [
      'Smart contract protocol automating penalty clauses on cold chain threshold violations',
      'QR/RFID scan interface for truck drivers and warehouse receiving managers',
      'Real-time transit analytics dashboard with IPFS audit logs'
    ],
    industrySupervisor: {
      name: 'Er. Amitav Sen',
      designation: 'VP Technology Innovations, Mahindra Logistics Gurgaon',
      email: 'amitav.sen@mahindra.com'
    },
    keyMilestones: [
      { id: 'lm1', title: 'Requirement Gathering & Hardware Selection', dueDate: '2026-09-30', completed: false },
      { id: 'lm2', title: 'Solidity Contracts & Testnet Deployment', dueDate: '2026-11-15', completed: false },
      { id: 'lm3', title: 'Warehouse Pilot Trials & Final Evaluation', dueDate: '2027-01-15', completed: false }
    ]
  }
];

// ==========================================
// 3. STUDENT MENTORSHIP SEED DATA
// ==========================================
export const initialMentorshipProfiles: FacultyStudentMentorship[] = [
  {
    id: 'ment-01',
    studentName: 'Aarav Sharma',
    rollNo: '230104011',
    program: 'B.Tech Computer Science & Engineering',
    semester: 'Semester VII (Final Year)',
    cgpa: 8.92,
    email: 'aarav.sharma@mjpru.ac.in',
    phone: '+91 98765 43210',
    mentorshipArea: 'AI Research & Tier-1 Masters / Ph.D. Prep',
    mentor: 'Dr. Arvind K. Sharma (HOD & Research Advisor)',
    sessionsCompleted: 7,
    totalPlannedSessions: 10,
    status: 'Active/Ongoing',
    startDate: '2025-08-01',
    targetCareerGoal: 'Ph.D. / MS Admissions at Top Tier Global Universities (IISc / CMU / NUS) & High-Impact AI Research',
    skillGapsIdentified: ['Formal Mathematical Proof Writing', 'Advanced CUDA Memory Optimization', 'GRE Quant Verbal Balance'],
    strengths: ['Deep PyTorch Proficiency', 'Strong Systems Thinking', 'High Intrinsic Curiosity'],
    rating: 4.9,
    recentNotes: 'Aarav submitted a draft for the IEEE International Conference on Neural Networks. Review complete with feedback on Section 4 ablation studies. Advised him to prepare GRE mock test schedule for October.',
    actionChecklist: [
      { id: 'ac1', task: 'Revise Conference Paper Section IV (Ablation Benchmark)', completed: true, dueDate: '2026-09-10' },
      { id: 'ac2', task: 'Complete GRE Mock Exam 3 and submit score report', completed: true, dueDate: '2026-09-15' },
      { id: 'ac3', task: 'Draft Statement of Purpose (SOP) first cut for review', completed: false, dueDate: '2026-09-30' },
      { id: 'ac4', task: 'Identify 5 prospective faculty advisors at top target institutions', completed: false, dueDate: '2026-10-15' }
    ],
    sessionLogs: [
      { id: 'sl1', date: '2026-08-28', topic: 'Research Paper Methodology Refinement', duration: '45 mins', summary: 'Analyzed attention heatmaps for oncology classification. Defined test loss metrics.', actionItems: ['Refactor data loader', 'Add baseline 비교'], completed: true, attendance: 'Present' },
      { id: 'sl2', date: '2026-08-14', topic: 'SOP Strategy & University Shortlisting', duration: '60 mins', summary: 'Categorized dream, target, and safe universities across US, Europe, and India.', actionItems: ['Draft initial research interest blurb'], completed: true, attendance: 'Present' },
      { id: 'sl3', date: '2026-07-22', topic: 'Algorithm Optimization on GPU Clusters', duration: '40 mins', summary: 'Discussed PyTorch torch.compile and mixed precision fp16 training speedups.', actionItems: ['Profile CUDA memory'], completed: true, attendance: 'Present' }
    ]
  },
  {
    id: 'ment-02',
    studentName: 'Pooja Verma',
    rollNo: '230104056',
    program: 'B.Tech Computer Science & Engineering',
    semester: 'Semester VII (Final Year)',
    cgpa: 8.64,
    email: 'pooja.verma@mjpru.ac.in',
    phone: '+91 98111 22334',
    mentorshipArea: 'Full-Stack Systems & High-Frequency Placements',
    mentor: 'Dr. Arvind K. Sharma (HOD & Career Mentor)',
    sessionsCompleted: 5,
    totalPlannedSessions: 8,
    status: 'Active/Ongoing',
    startDate: '2025-08-01',
    targetCareerGoal: 'Product-Based Software Development Engineer (SDE-1) at Tier-1 Tech (Microsoft / Amazon / Atlassian)',
    skillGapsIdentified: ['System Design LLD/HLD', 'Concurrency & Deadlock Scenarios in Java/Go', 'Behavioral STAR Method'],
    strengths: ['Algorithmic Problem Solving (LeetCode 500+)', 'Clean Code Principles', 'Great Communication'],
    rating: 4.8,
    recentNotes: 'Pooja has cleared 2 rounds of Siemens Industrial Internship with glowing remarks. Mentored on low-level design patterns (Factory, Strategy, Observer) and rate limiter architectural trade-offs.',
    actionChecklist: [
      { id: 'ac1', task: 'Design a scalable URL shortener system design writeup', completed: true, dueDate: '2026-09-05' },
      { id: 'ac2', task: 'Practice 20 Hard LeetCode Dynamic Programming problems', completed: true, dueDate: '2026-09-20' },
      { id: 'ac3', task: 'Conduct 1-on-1 behavioral STAR mock interview with mentor', completed: false, dueDate: '2026-10-05' }
    ],
    sessionLogs: [
      { id: 'sl1', date: '2026-08-25', topic: 'Low-Level System Design (Parking Lot & Elevators)', duration: '50 mins', summary: 'Walked through OOP SOLID principles, UML class diagrams, and thread-safe lock management.', actionItems: ['Implement Java concurrency demo'], completed: true, attendance: 'Present' },
      { id: 'sl2', date: '2026-08-10', topic: 'Resume Audit & SDE Portfolio Highlighting', duration: '40 mins', summary: 'Streamlined resume bullet points using quantifiable metrics (e.g. reduced query latency by 42%).', actionItems: ['Update Overleaf template'], completed: true, attendance: 'Present' }
    ]
  },
  {
    id: 'ment-03',
    studentName: 'Rohan Malhotra',
    rollNo: '230104082',
    program: 'B.Tech Information Technology',
    semester: 'Semester VII (Final Year)',
    cgpa: 9.15,
    email: 'rohan.malhotra@mjpru.ac.in',
    phone: '+91 97722 33445',
    mentorshipArea: 'Open Source GSoC & Cloud Kernel Engineering',
    mentor: 'Dr. Meenakshi Sundaram',
    sessionsCompleted: 8,
    totalPlannedSessions: 8,
    status: 'Completed',
    startDate: '2025-06-01',
    targetCareerGoal: 'Linux Foundation / Cloud Native Computing Foundation (CNCF) Core Maintainer & Systems SRE',
    skillGapsIdentified: ['Resolved - Kernel Memory Debugging', 'Resolved - Git Bisect and Upstream Rebasing'],
    strengths: ['C / Rust Mastery', 'Deep Linux Internals knowledge', 'Proactive Community Contributor'],
    rating: 5.0,
    recentNotes: 'Rohan completed his GSoC 2026 project with Linux Foundation with distinction. Received direct full-time offer from Cisco Security Innovation Labs. Formal mentorship goals fulfilled successfully.',
    actionChecklist: [
      { id: 'ac1', task: 'Submit Final GSoC Work Product to Google Org Admins', completed: true, dueDate: '2026-08-20' },
      { id: 'ac2', task: 'Present Departmental Tech Talk on eBPF to Juniors', completed: true, dueDate: '2026-08-28' },
      { id: 'ac3', task: 'Sign Cisco PPO Offer Letter & Complete University NOC', completed: true, dueDate: '2026-09-02' }
    ],
    sessionLogs: [
      { id: 'sl1', date: '2026-08-28', topic: 'Final Mentorship Exit Interview & Career Roadmap', duration: '30 mins', summary: 'Celebrated successful completion. Outlined roadmap for first 2 years in industry R&D.', actionItems: [], completed: true, attendance: 'Present' }
    ]
  },
  {
    id: 'ment-04',
    studentName: 'Ananya Mishra',
    rollNo: '240104018',
    program: 'B.Tech Computer Science & Engineering',
    semester: 'Semester V (Pre-Final Year)',
    cgpa: 8.45,
    email: 'ananya.mishra@mjpru.ac.in',
    phone: '+91 99887 76655',
    mentorshipArea: 'Competitive Programming & Data Structures Mastery',
    mentor: 'Dr. Arvind K. Sharma (HOD & Faculty Mentor)',
    sessionsCompleted: 1,
    totalPlannedSessions: 6,
    status: 'Upcoming',
    startDate: '2026-08-15',
    targetCareerGoal: 'Summer 2027 Internship at Top Tech Firm & ICPC Regionalist Qualifier',
    skillGapsIdentified: ['Graph Algorithms (Tarjan, Dijkstra, Segment Trees)', 'Time-Constraint Stress Debugging'],
    strengths: ['Fast Mathematical Intuition', 'Hardworking & Consistent'],
    rating: 4.7,
    recentNotes: 'Orientation session completed. Set up 12-week CP drill roadmap on Codeforces (target 1600+ rating) and weekly problem review sessions every Thursday.',
    actionChecklist: [
      { id: 'ac1', task: 'Solve 15 Tree & Graph problems on CSES problem set', completed: false, dueDate: '2026-09-18' },
      { id: 'ac2', task: 'Participate in Codeforces Div 2 contest and submit editorial review', completed: false, dueDate: '2026-09-25' },
      { id: 'ac3', task: 'Draft initial technical portfolio on GitHub', completed: false, dueDate: '2026-10-10' }
    ],
    sessionLogs: [
      { id: 'sl1', date: '2026-08-20', topic: 'Mentorship Onboarding & Baseline Diagnostic', duration: '45 mins', summary: 'Diagnosed competitive coding baseline. Prescribed CSES Problem Set and weekly target metrics.', actionItems: ['Register for Codeforces contests', 'Setup GitHub repo'], completed: true, attendance: 'Present' }
    ]
  }
];

// ==========================================
// 4. WORKSHOPS & GUEST LECTURES SEED DATA
// ==========================================
export const initialWorkshops: WorkshopGuestLecture[] = [
  {
    id: 'wk-01',
    title: 'Building Production LLM Agentic Pipelines with LangGraph & Multi-Agent Swarms',
    type: 'Hands-on Bootcamp',
    speaker: {
      name: 'Er. Kunal Singhal',
      designation: 'Lead GenAI Architect',
      organization: 'Microsoft India IDC (Ex-Amazon Alexa AI)',
      bio: 'Pioneer in multi-agent orchestration loops, tool calling frameworks, and RAG evaluation systems.'
    },
    date: '2026-10-18',
    time: '10:00 AM – 04:30 PM IST',
    duration: 'Full-Day Intensive (6.5 Hours)',
    mode: 'Hybrid',
    venue: 'CSIT Central Auditorium (Offline) & MS Teams Live Stream',
    attendeesCount: 240,
    maxCapacity: 250,
    status: 'Upcoming',
    department: 'Computer Science & Information Technology',
    organizingCoordinator: 'Dr. Arvind K. Sharma (HOD)',
    description: 'An industry-grade practical workshop guiding senior undergraduate students, PG scholars, and faculty through constructing autonomous multi-agent pipelines with LangGraph, local vector databases, human-in-the-loop validation, and API tooling.',
    keyTakeaways: [
      'Architecting cyclic state graphs and conditional routing with LangGraph',
      'Implementing function calling and strict JSON schema guards',
      'Zero-shot RAG evaluation with RAGAS metrics (Faithfulness, Answer Relevance)',
      'Deploying lightweight models with Ollama & Docker for local testing'
    ],
    targetAudience: 'B.Tech CSE/IT (3rd & 4th Year), MCA, M.Tech, and Research Scholars',
    certificateProvided: true,
    collaboratingPartner: 'Microsoft Azure Developer Community Bareilly',
    recordingOrSlidesUrl: 'portal.mjpru.ac.in/events/genai-bootcamp-2026'
  },
  {
    id: 'wk-02',
    title: 'Zero-Trust Cyber Architecture & Real-World Threat Modeling in National Banking Networks',
    type: 'Industry Keynote',
    speaker: {
      name: 'Dr. Vasudha Chawla',
      designation: 'Chief Information Security Officer (CISO)',
      organization: 'National Payments Corporation of India (NPCI)',
      bio: '20+ years leading nation-scale cybersecurity defenses, UPI encryption protocols, and quantum-resilient banking infrastructures.'
    },
    date: '2026-09-25',
    time: '11:00 AM – 01:30 PM IST',
    duration: '2.5 Hours',
    mode: 'Offline',
    venue: 'Main University Multi-Purpose Hall & CSIT Smart Classroom',
    attendeesCount: 310,
    maxCapacity: 350,
    status: 'Active/Ongoing',
    department: 'Computer Science & Information Technology',
    organizingCoordinator: 'Dr. Arvind K. Sharma (HOD) & Dr. Meenakshi Sundaram',
    description: 'Special high-level institutional keynote on securing real-time payments infrastructure handling 10+ billion transactions monthly. Explores adversarial AI defense, API security gateways, and CERT-In compliance frameworks.',
    keyTakeaways: [
      'Decentralized defense-in-depth methodologies for FinTech networks',
      'Mitigating automated credential stuffing and bot-driven fraud',
      'Career paths in cybersecurity engineering, penetration testing, and digital forensics'
    ],
    targetAudience: 'All Engineering Students, Faculty Members, and IT Administrative Staff',
    certificateProvided: true,
    collaboratingPartner: 'NPCI Cyber Defense Taskforce & Data Security Council of India (DSCI)',
    recordingOrSlidesUrl: 'portal.mjpru.ac.in/events/npci-ciso-keynote-2026'
  },
  {
    id: 'wk-03',
    title: 'High-Scale Microservices & Chaos Engineering with Kubernetes in Production',
    type: 'Masterclass',
    speaker: {
      name: 'Mr. Arvind Swaminathan',
      designation: 'Principal Engineer & Systems Architect',
      organization: 'Amazon Web Services (AWS)',
      bio: 'Specialist in distributed consensus protocols, multi-region fault tolerance, and Chaos Mesh experiments.'
    },
    date: '2026-08-14',
    time: '02:00 PM – 05:00 PM IST',
    duration: '3.0 Hours',
    mode: 'Online',
    venue: 'Zoom Webinar Cloud (Meeting ID: 884-219-5501)',
    attendeesCount: 195,
    maxCapacity: 200,
    status: 'Completed',
    department: 'Computer Science & Information Technology',
    organizingCoordinator: 'Dr. Meenakshi Sundaram',
    description: 'Deep-dive masterclass explaining how top tier hyper-scalers engineer resilience against unexpected pod crashes, network partitioning, and cascading database failures using Chaos Engineering principles.',
    keyTakeaways: [
      'Injecting network latency and pod kill experiments safely in staging clusters',
      'Configuring resilient circuit breakers with Envoy and Istio Service Mesh',
      'Mastering SRE golden signals (Latency, Traffic, Errors, Saturation)'
    ],
    targetAudience: 'B.Tech/MCA Students specializing in Cloud Computing & Distributed Systems',
    certificateProvided: true,
    collaboratingPartner: 'AWS Educate & Cloud Native Bareilly Chapter',
    recordingOrSlidesUrl: 'portal.mjpru.ac.in/recordings/aws-chaos-masterclass'
  },
  {
    id: 'wk-04',
    title: 'Emerging Frontiers in Quantum Key Distribution (QKD) & Quantum Cryptography',
    type: 'Guest Lecture',
    speaker: {
      name: 'Prof. Debashis Sen',
      designation: 'Senior Professor & Dean of Physical Sciences',
      organization: 'Tata Institute of Fundamental Research (TIFR Mumbai)',
      bio: 'Leading researcher in experimental quantum optics, single photon entanglement, and quantum satellite communication.'
    },
    date: '2026-11-20',
    time: '03:00 PM – 05:00 PM IST',
    duration: '2.0 Hours',
    mode: 'Hybrid',
    venue: 'CSIT Seminar Hall 1 & YouTube Live Stream',
    attendeesCount: 85,
    maxCapacity: 150,
    status: 'Proposal Stage',
    department: 'Computer Science & Information Technology',
    organizingCoordinator: 'Dr. Arvind K. Sharma (HOD)',
    description: 'Upcoming academic and research colloquium discussing quantum photon entanglement, BB84 protocol implementations, and India National Quantum Mission opportunities for engineering scholars.',
    keyTakeaways: [
      'Theoretical foundations of no-cloning theorem and quantum measurement uncertainty',
      'Fiber-optic and free-space quantum key exchange testbeds in India',
      'Research fellowship opportunities under DST National Quantum Mission'
    ],
    targetAudience: 'Faculty, M.Tech, Research Scholars, and Final Year B.Tech Students',
    certificateProvided: true,
    collaboratingPartner: 'National Quantum Mission (DST) & IEEE Quantum Community',
    recordingOrSlidesUrl: 'portal.mjpru.ac.in/events/quantum-colloquium-2026'
  }
];

// ==========================================
// LOCAL STORAGE PERSISTENCE HELPERS
// ==========================================

const RESEARCH_STORAGE_KEY = 'ladder_research_collaborations_v1';
const LIVE_PROJECTS_STORAGE_KEY = 'ladder_live_industry_projects_v1';
const MENTORSHIP_STORAGE_KEY = 'ladder_student_mentorship_v1';
const WORKSHOPS_STORAGE_KEY = 'ladder_workshops_guest_lectures_v1';

// 1. Research Collaborations
export const getStoredResearchCollaborations = (): ResearchCollaboration[] => {
  try {
    const data = localStorage.getItem(RESEARCH_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load Research Collaborations from localStorage', e);
  }
  return initialResearchCollaborations;
};

export const saveStoredResearchCollaborations = (list: ResearchCollaboration[]) => {
  try {
    localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save Research Collaborations to localStorage', e);
  }
};

// 2. Live Industry Projects
export const getStoredLiveProjects = (): LiveIndustryProject[] => {
  try {
    const data = localStorage.getItem(LIVE_PROJECTS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load Live Projects from localStorage', e);
  }
  return initialLiveProjects;
};

export const saveStoredLiveProjects = (list: LiveIndustryProject[]) => {
  try {
    localStorage.setItem(LIVE_PROJECTS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save Live Projects to localStorage', e);
  }
};

// 3. Student Mentorship
export const getStoredMentorshipProfiles = (): FacultyStudentMentorship[] => {
  try {
    const data = localStorage.getItem(MENTORSHIP_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load Mentorship Profiles from localStorage', e);
  }
  return initialMentorshipProfiles;
};

export const saveStoredMentorshipProfiles = (list: FacultyStudentMentorship[]) => {
  try {
    localStorage.setItem(MENTORSHIP_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save Mentorship Profiles to localStorage', e);
  }
};

// 4. Workshops & Guest Lectures
export const getStoredWorkshops = (): WorkshopGuestLecture[] => {
  try {
    const data = localStorage.getItem(WORKSHOPS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load Workshops from localStorage', e);
  }
  return initialWorkshops;
};

export const saveStoredWorkshops = (list: WorkshopGuestLecture[]) => {
  try {
    localStorage.setItem(WORKSHOPS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save Workshops to localStorage', e);
  }
};

// ==========================================
// 5. MY APPLICATIONS SEED DATA
// ==========================================
export const initialFacultyMyApplications: FacultyMyApplication[] = [
  {
    id: 'app-01',
    title: 'DST-SERB High Performance Compute Cluster Modernization Grant',
    applicationType: 'Research Grant',
    dateApplied: '2026-06-12',
    status: 'Approved',
    hostOrGrantBody: 'DST-SERB (Science and Engineering Research Board)',
    sanctionAmountFormatted: '₹48,00,000',
    reviewer: 'Dr. S. K. Bhattacharya (SERB Advisory Board)',
    reviewerDesignation: 'Senior Technical Director, SERB New Delhi',
    remarks: 'Approved under FIST Category B scheme with full requested budget. Formal sanction order SERB/FIST/2026/CSIT-084 released for equipment procurement.',
    approvalDate: '2026-08-10',
    duration: '36 Months',
    submissionRefNo: 'SERB/FIST/2026/CSIT-084',
    department: 'Computer Science & Information Technology',
    documentsAttached: ['Detailed_Project_Report_v3.pdf', 'Budget_Justification_Quotation.pdf', 'Institutional_NOC_MJPRU.pdf'],
    timeline: [
      { id: 't1', title: 'Proposal Submitted Online', date: '2026-06-12', actor: 'Dr. Arvind K. Sharma', status: 'Completed', notes: 'Uploaded with Institutional endorsement via SERB portal.' },
      { id: 't2', title: 'Initial Screening & Eligibility Check', date: '2026-06-25', actor: 'SERB Secretariat', status: 'Completed', notes: 'Documents and budget heads verified compliant.' },
      { id: 't3', title: 'PAC Committee Presentation & Defense', date: '2026-07-18', actor: 'Dr. Arvind K. Sharma & Expert Panel', status: 'Completed', notes: 'Presented compute architecture for multi-modal medical AI workloads.' },
      { id: 't4', title: 'Sanction Letter & Grant Release Issued', date: '2026-08-10', actor: 'Finance Officer, DST-SERB', status: 'Completed', notes: 'First tranche of ₹20,00,000 disbursed to university account.' }
    ]
  },
  {
    id: 'app-02',
    title: 'Microsoft Azure Faculty Research Fellowship in Autonomous Systems',
    applicationType: 'Industry Fellowship',
    dateApplied: '2026-07-20',
    status: 'Under Review',
    hostOrGrantBody: 'Microsoft Research India (MSRI Bangalore)',
    sanctionAmountFormatted: '₹18,00,000 + $25,000 Cloud Credits',
    reviewer: 'Microsoft Academic Relations Committee',
    reviewerDesignation: 'Director of Academic Programs, MSR India',
    remarks: 'Application passed preliminary review (Top 5% quartile). Shortlisted for Stage 2 Live Research Pitch Defense on Oct 12, 2026.',
    duration: '12 Months',
    submissionRefNo: 'MSFT-FELLOW-2026-8812',
    department: 'Computer Science & Information Technology',
    documentsAttached: ['Research_Vision_Statement.pdf', 'Curriculum_Vitae_Sharma.pdf', 'Azure_Compute_Architecture.pdf'],
    timeline: [
      { id: 't1', title: 'Application Dossier Submitted', date: '2026-07-20', actor: 'Dr. Arvind K. Sharma', status: 'Completed', notes: 'Submitted under Autonomous Multi-Agent AI track.' },
      { id: 't2', title: 'Technical Committee Shortlisting', date: '2026-08-15', actor: 'MSR Senior Scientists', status: 'Completed', notes: 'Shortlisted for Stage 2 pitch presentations.' },
      { id: 't3', title: 'Virtual Defense & Q&A Panel', date: '2026-10-12', actor: 'Evaluation Panel', status: 'Current', notes: 'Scheduled for 45 min virtual presentation on Oct 12, 2026.' },
      { id: 't4', title: 'Final Fellowship Award Announcement', date: '2026-10-30', actor: 'MSR India Leadership', status: 'Pending', notes: 'Awaiting completion of Stage 2 defense.' }
    ]
  },
  {
    id: 'app-03',
    title: 'MeitY Cyber-Physical Systems National Security Consultancy Bid',
    applicationType: 'Consultancy Bid',
    dateApplied: '2026-05-15',
    status: 'Approved',
    hostOrGrantBody: 'Ministry of Electronics & Information Technology (MeitY)',
    sanctionAmountFormatted: '₹32,00,000',
    reviewer: 'Shri R. K. Verma (Joint Secretary, MeitY)',
    reviewerDesignation: 'Joint Secretary, Cyber Security Division',
    remarks: 'Technical score: 94/100. Financial bid awarded to MJPRU CSIT Department as lead knowledge partner for secure edge firmware audits.',
    approvalDate: '2026-07-02',
    duration: '24 Months',
    submissionRefNo: 'MEITY/CPS/BID/2026-033',
    department: 'Computer Science & Information Technology',
    documentsAttached: ['Technical_Bid_MeitY_CPS.pdf', 'Financial_Quotation_Signed.pdf', 'Lab_Audit_Certifications.pdf'],
    timeline: [
      { id: 't1', title: 'Tender Response & RFP Submitted', date: '2026-05-15', actor: 'Dr. Arvind K. Sharma', status: 'Completed', notes: 'Response to EOI No. MeitY/CYBER/2026/02.' },
      { id: 't2', title: 'Technical Bid Evaluation', date: '2026-06-10', actor: 'MeitY Technical Evaluation Committee', status: 'Completed', notes: 'Awarded 94/100 points for cryptography & firmware capabilities.' },
      { id: 't3', title: 'Financial Bid Opening & Negotiation', date: '2026-06-25', actor: 'Commercial Tender Board', status: 'Completed', notes: 'Finalized at ₹32,00,000 institutional consultancy value.' },
      { id: 't4', title: 'Contract Signed & Work Order Released', date: '2026-07-02', actor: 'MeitY Procurement & Registrar MJPRU', status: 'Completed', notes: 'Work order MeitY/WO/2026/748 executed.' }
    ]
  },
  {
    id: 'app-04',
    title: 'AICTE-UKIERI International Academic Faculty Exchange Program (Univ. of Edinburgh)',
    applicationType: 'Faculty Exchange',
    dateApplied: '2026-04-10',
    status: 'Rejected',
    hostOrGrantBody: 'AICTE-UKIERI Bilateral Academic Exchange',
    reviewer: 'AICTE International Cooperation Cell',
    reviewerDesignation: 'Member Secretary, Bilateral Exchanges',
    remarks: 'Proposal was ranked in the high-merit category, but the UK university institutional quota for Cycle 1 reached capacity. Re-submission strongly recommended for Cycle 2 (DST-DAAD Indo-German track).',
    rejectionReason: 'Institutional quota saturation for UK destination institutions in 2026 Cycle 1.',
    duration: '6 Months',
    submissionRefNo: 'AICTE/UKIERI/2026/FEX-109',
    department: 'Computer Science & Information Technology',
    documentsAttached: ['Exchange_Syllabus_Plan.pdf', 'Host_Invitation_Letter_Edinburgh.pdf', 'University_Relieving_NOC.pdf'],
    timeline: [
      { id: 't1', title: 'Application Dossier Submitted', date: '2026-04-10', actor: 'Dr. Arvind K. Sharma', status: 'Completed', notes: 'Applied with University of Edinburgh School of Informatics host.' },
      { id: 't2', title: 'Bilateral Panel Review', date: '2026-05-18', actor: 'AICTE & British Council Joint Board', status: 'Completed', notes: 'Technical merit verified (Score: 88/100).' },
      { id: 't3', title: 'Cycle 1 Selection Finalization', date: '2026-06-05', actor: 'AICTE Secretariat', status: 'Rejected', notes: 'Not selected due to country-level host quota limits.' }
    ]
  }
];

// ==========================================
// 6. MY COLLABORATIONS SEED DATA
// ==========================================
export const initialFacultyMyCollaborations: FacultyMyCollaboration[] = [
  {
    id: 'collab-01',
    title: 'AIIMS New Delhi Clinical AI & Computational Pathology Consortium',
    partnerType: 'Government',
    partnerName: 'AIIMS New Delhi & IIT Roorkee',
    partnerLogoOrInitials: 'AIIMS',
    facultyRole: 'Lead Principal Investigator',
    status: 'Ongoing',
    duration: '36 Months (Jul 2025 – Jun 2028)',
    startDate: '2025-07-01',
    endDate: '2028-06-30',
    mouOrSanctionRef: 'AIIMS-MJPRU-MOU-2025/11',
    department: 'Computer Science & Information Technology',
    fundingValueFormatted: '₹38,50,000 (SERB Grant)',
    leadCoordinator: 'Dr. Arvind K. Sharma (HOD)',
    description: 'Joint interdisciplinary biomedical engineering collaboration developing explainable multi-modal deep learning models to assist oncologists in identifying rare tissue micro-calcifications.',
    keyDeliverables: [
      'Multi-center clinical histopathology dataset curation (5,000+ anonymized slides)',
      'Explainable AI transformer visualization pipeline for oncological decision support',
      'Joint publication of 3 SCI/Scopus Q1 indexed journal articles'
    ],
    contactPerson: {
      name: 'Dr. Rajesh Narang',
      designation: 'Professor of Computational Oncology, AIIMS New Delhi',
      email: 'rajesh.narang@aiims.edu'
    },
    milestones: [
      { id: 'm1', title: 'Ethical Board Approvals & Data Pipeline Integration', dueDate: '2025-12-31', completed: true },
      { id: 'm2', title: 'Attention-Guided Model Training on Multi-GPU Clusters', dueDate: '2026-12-31', completed: true },
      { id: 'm3', title: 'Clinical Trial Validation at AIIMS Oncology Ward', dueDate: '2027-12-31', completed: false }
    ]
  },
  {
    id: 'collab-02',
    title: 'Siemens Industrial Automation & High-Frequency Telemetry Lab',
    partnerType: 'Industry',
    partnerName: 'Siemens Industrial India Ltd.',
    partnerLogoOrInitials: 'SIEMENS',
    facultyRole: 'Chief Academic Liaison & Project Director',
    status: 'Ongoing',
    duration: '24 Months (Jan 2025 – Dec 2026)',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    mouOrSanctionRef: 'SIEMENS-IND-2025-089',
    department: 'Computer Science & Information Technology',
    fundingValueFormatted: '₹25,00,000 + ₹40L Lab Hardware',
    leadCoordinator: 'Dr. Arvind K. Sharma (HOD)',
    description: 'Institutional partnership establishing a state-of-the-art Industrial IoT & Predictive Telemetry Center of Excellence at MJPRU Bareilly with direct capstone student hiring pipelines.',
    keyDeliverables: [
      'Dedicated Siemens Industrial IoT Simulation Lab established at CSIT Department',
      'Mentoring 15+ student engineers on real-world industrial turbine anomaly models',
      'Direct campus pre-placement interview (PPI) tracks for Siemens R&D teams'
    ],
    contactPerson: {
      name: 'Er. Sandeep Bhasin',
      designation: 'Director of Industrial Digitalization, Siemens Pune',
      email: 'sandeep.bhasin@siemens.com'
    },
    milestones: [
      { id: 'm1', title: 'MoU Signing & Lab Infrastructure Commissioning', dueDate: '2025-04-30', completed: true },
      { id: 'm2', title: 'Cohort 1 Live Industrial Capstone Project Handover', dueDate: '2025-11-30', completed: true },
      { id: 'm3', title: 'Annual Industry-Academia Summit & Student PPO Dispersal', dueDate: '2026-12-15', completed: false }
    ]
  },
  {
    id: 'collab-03',
    title: 'Tata Institute of Fundamental Research (TIFR) Quantum Algorithms Node',
    partnerType: 'Academic',
    partnerName: 'TIFR Mumbai & IISc Bangalore',
    partnerLogoOrInitials: 'TIFR',
    facultyRole: 'Co-Principal Investigator',
    status: 'Ongoing',
    duration: '24 Months (Apr 2026 – Mar 2028)',
    startDate: '2026-04-01',
    endDate: '2028-03-31',
    mouOrSanctionRef: 'TIFR-QCOMM-2026-04',
    department: 'Computer Science & Information Technology',
    fundingValueFormatted: '₹45,00,000 (MeitY R&D)',
    leadCoordinator: 'Dr. Arvind K. Sharma & Prof. A. Sridhar (IISc)',
    description: 'National quantum research collaboration focusing on post-quantum lattice cryptography, Shor-resistant hash structures, and quantum key distribution (QKD) simulator benchmarks.',
    keyDeliverables: [
      'Open-source Rust implementation of Falcon & Dilithium signature algorithms',
      'Quantum-safe distributed ledger consensus architecture for academic credentialing',
      'Two joint IEEE TDSC publications and Ph.D. research co-supervision'
    ],
    contactPerson: {
      name: 'Prof. Debashis Sen',
      designation: 'Dean of Physical Sciences, TIFR Mumbai',
      email: 'debashis.sen@tifr.res.in'
    },
    milestones: [
      { id: 'm1', title: 'Lattice Cryptography Benchmarking Suite Setup', dueDate: '2026-10-31', completed: true },
      { id: 'm2', title: 'Zero-Knowledge Proof Circuit Construction', dueDate: '2027-04-30', completed: false },
      { id: 'm3', title: 'Consortium Testnet Pilot Deployment across Universities', dueDate: '2028-03-31', completed: false }
    ]
  },
  {
    id: 'collab-04',
    title: 'CSIR-NIH National Hydrological River Basin AI Sensor Grid',
    partnerType: 'Government',
    partnerName: 'CSIR-National Institute of Hydrology (NIH)',
    partnerLogoOrInitials: 'CSIR',
    facultyRole: 'Technical Advisor & Co-PI',
    status: 'Completed',
    duration: '18 Months (Jan 2025 – Jul 2026)',
    startDate: '2025-01-15',
    endDate: '2026-07-15',
    mouOrSanctionRef: 'CSIR-NIH-MOU-2024/09',
    department: 'Computer Science & Information Technology',
    fundingValueFormatted: '₹26,00,000 (Jal Shakti)',
    leadCoordinator: 'Dr. Meenakshi Sundaram & Dr. Arvind K. Sharma',
    description: 'Deployment of solar LoRaWAN edge computing sensor nodes along the Ramganga river basin for real-time telemetry, runoff rate prediction, and early flood detection alerts.',
    keyDeliverables: [
      '30 Solar LoRaWAN telemetry nodes operational along Ramganga catchment',
      'Machine learning flood prediction web GIS dashboard handed over to Disaster Management Cell',
      'Technology transfer report accepted by CSIR with distinction'
    ],
    contactPerson: {
      name: 'Dr. Virendra Kumar',
      designation: 'Scientist-G & Head of Hydrological Modeling, NIH Roorkee',
      email: 'vkumar.nih@csir.res.in'
    },
    milestones: [
      { id: 'm1', title: 'Sensor Hardware Design & Field Deployment', dueDate: '2025-06-30', completed: true },
      { id: 'm2', title: 'Monsoon Flood Prediction Benchmark & Telemetry Calibration', dueDate: '2025-11-30', completed: true },
      { id: 'm3', title: 'Final Report Signoff & Technology Handover', dueDate: '2026-07-15', completed: true }
    ]
  }
];

// ==========================================
// 7. ACHIEVEMENTS & CERTIFICATES SEED DATA
// ==========================================
export const initialFacultyAchievements: FacultyAchievementCertificate[] = [
  {
    id: 'achieve-01',
    title: 'National Best Faculty Researcher Award in Artificial Intelligence 2026',
    issuingBody: 'Indian Society for Technical Education (ISTE) & AICTE',
    category: 'Award',
    dateReceived: '2026-03-15',
    credentialId: 'ISTE-NAT-2026-AI-042',
    downloadUrl: 'portal.mjpru.ac.in/certs/iste-best-researcher-2026.pdf',
    isPendingUpload: false,
    description: 'Conferred at the 54th ISTE National Annual Convention for pioneering interdisciplinary contributions in Explainable Medical AI and exceptional sponsored research grant stewardship.',
    skillsOrDomain: ['Artificial Intelligence', 'Explainable AI', 'Institutional Research Leadership'],
    verificationBadge: 'Verified by ISTE National Directorate',
    citationOrScore: 'Rank 1 across 450+ nominations'
  },
  {
    id: 'achieve-02',
    title: 'AWS Certified Solutions Architect – Professional (SAP-C02)',
    issuingBody: 'Amazon Web Services (AWS)',
    category: 'Certification',
    dateReceived: '2026-05-20',
    credentialId: 'AWS-PSA-990421-2026',
    downloadUrl: 'portal.mjpru.ac.in/certs/aws-architect-pro-2026.pdf',
    isPendingUpload: false,
    description: 'Premier cloud architecture certification validating advanced mastery of multi-tier high-availability distributed systems, hybrid cloud topologies, and cost-efficient architectures.',
    skillsOrDomain: ['Distributed Cloud Architecture', 'Kubernetes / ECS', 'High-Availability Systems'],
    verificationBadge: 'AWS Certified Global Registry',
    citationOrScore: 'Validation Score: 920 / 1000'
  },
  {
    id: 'achieve-03',
    title: 'Course Director & Chief Speaker: ATAL FDP on Quantum Resilient Cyber Defense',
    issuingBody: 'AICTE Training & Learning (ATAL) Academy',
    category: 'FDP Contribution',
    dateReceived: '2026-06-28',
    credentialId: 'ATAL-FDP-2026-MJPRU-01',
    downloadUrl: 'portal.mjpru.ac.in/certs/atal-course-director-2026.pdf',
    isPendingUpload: false,
    description: 'Directed a one-week national faculty development program training 85 engineering faculty from 18 states on post-quantum cryptography, Zero-Trust networks, and lattice-based algorithms.',
    skillsOrDomain: ['Post-Quantum Cryptography', 'Pedagogical Leadership', 'Cyber-Physical Systems'],
    verificationBadge: 'AICTE ATAL Official Endorsement',
    citationOrScore: 'Faculty Feedback Rating: 4.96 / 5.0'
  },
  {
    id: 'achieve-04',
    title: 'IEEE Transactions on Dependable & Secure Computing - Outstanding Peer Reviewer',
    issuingBody: 'IEEE Computer Society (USA)',
    category: 'Research Excellence',
    dateReceived: '2026-01-10',
    credentialId: 'IEEE-TDSC-REV-2025-09',
    downloadUrl: 'portal.mjpru.ac.in/certs/ieee-outstanding-reviewer-2025.pdf',
    isPendingUpload: false,
    description: 'Recognized by the IEEE TDSC Editorial Board for delivering rigorous, high-impact peer reviews on cutting-edge zero-knowledge proof protocols and distributed systems security.',
    skillsOrDomain: ['Peer Review', 'Zero-Knowledge Proofs', 'IEEE Transactions Editorial'],
    verificationBadge: 'IEEE Computer Society Recognition',
    citationOrScore: 'Top 2% Reviewer Citation Honor'
  },
  {
    id: 'achieve-05',
    title: 'NVIDIA DLI Certified Instructor: Deep Learning & Autonomous Multi-Agent Swarms',
    issuingBody: 'NVIDIA Deep Learning Institute (DLI)',
    category: 'Certification',
    dateReceived: '2026-08-05',
    credentialId: 'DLI-INST-2026-7781',
    isPendingUpload: true,
    description: 'Certified university educator authorized to deliver official NVIDIA DLI workshops and grant industry-recognized competency credentials in GPU-accelerated deep learning.',
    skillsOrDomain: ['NVIDIA CUDA', 'GPU Acceleration', 'Agentic AI / LLMs'],
    verificationBadge: 'Pending Verification / Certificate Upload',
    citationOrScore: 'DLI Global Educator Track'
  }
];

// ==========================================
// 8. ACADEMIC INTELLIGENCE COMPUTED METRICS
// ==========================================
export const initialAcademicIntelligenceMetrics: AcademicIntelligenceMetrics = {
  totalPublications: 46,
  hIndex: 18,
  i10Index: 29,
  totalCitations: 1480,
  activeGrants: 3,
  grantValueFormatted: '₹1,35,50,000',
  grantValueNumber: 13550000,
  studentsSupervised: 68,
  phdScholarsCount: 7,
  ongoingCollaborations: 4,
  patentsPublished: 3,
  consultancyRevenueFormatted: '₹32,00,000',
  publicationTrend: [
    { year: 2022, count: 6, citations: 185, impactFactorAvg: 3.8 },
    { year: 2023, count: 8, citations: 240, impactFactorAvg: 4.2 },
    { year: 2024, count: 10, citations: 310, impactFactorAvg: 4.6 },
    { year: 2025, count: 11, citations: 380, impactFactorAvg: 5.1 },
    { year: 2026, count: 11, citations: 365, impactFactorAvg: 5.4 }
  ],
  domainDistribution: [
    { domain: 'Medical AI & Healthcare', percentage: 38, count: 17, color: '#10B981' },
    { domain: 'Post-Quantum & Cybersecurity', percentage: 28, count: 13, color: '#6366F1' },
    { domain: 'IoT & Edge Computing', percentage: 20, count: 9, color: '#06B6D4' },
    { domain: 'FinTech & Computer Vision', percentage: 14, count: 7, color: '#F59E0B' }
  ],
  recommendations: [
    {
      id: 'rec-01',
      category: 'Grant Opportunity',
      title: 'DST National Quantum Mission Call 2026-27 is Now Open',
      description: 'Your recent research in lattice cryptography with TIFR matches the thrust areas under Theme 3 (Quantum Communications). High probability of ₹60L+ grant approval.',
      actionLabel: 'Draft Proposal Dossier',
      urgency: 'High',
      metricImpact: '+₹60L Potential Grant Value'
    },
    {
      id: 'rec-02',
      category: 'Citation Impact',
      title: 'Publish Clinical Validation Results in Q1 Oncology Informatics',
      description: 'Your AIIMS collaboration has completed 2 tranches. Fast-tracking a submission to IEEE JBHI or Lancet Digital Health could boost h-index from 18 to 21 by Q2 2027.',
      actionLabel: 'Review Target Journal Metrics',
      urgency: 'Medium',
      metricImpact: '+180 Projected Citations'
    },
    {
      id: 'rec-03',
      category: 'Collaboration Match',
      title: 'Leverage NVIDIA DLI Certification for Regional Student Hackathon',
      description: '85 students in Semester VII require GPU acceleration capstones. Conducting an NVIDIA-endorsed AI bootcamp will elevate NAAC Criterion 3 score.',
      actionLabel: 'Schedule DLI Bootcamp',
      urgency: 'Low',
      metricImpact: '+85 Certified Students'
    }
  ]
};

// ==========================================
// STORAGE HELPERS FOR ALL 4 NEW MODULES
// ==========================================

const APPLICATIONS_STORAGE_KEY = 'ladder_faculty_applications_v1';
const COLLABORATIONS_STORAGE_KEY = 'ladder_faculty_collaborations_v1';
const ACHIEVEMENTS_STORAGE_KEY = 'ladder_faculty_achievements_v1';

// 5. My Applications Storage
export const getStoredFacultyApplications = (): FacultyMyApplication[] => {
  try {
    const data = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load Faculty Applications from localStorage', e);
  }
  return initialFacultyMyApplications;
};

export const saveStoredFacultyApplications = (list: FacultyMyApplication[]) => {
  try {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save Faculty Applications to localStorage', e);
  }
};

// 6. My Collaborations Storage
export const getStoredFacultyCollaborations = (): FacultyMyCollaboration[] => {
  try {
    const data = localStorage.getItem(COLLABORATIONS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load Faculty Collaborations from localStorage', e);
  }
  return initialFacultyMyCollaborations;
};

export const saveStoredFacultyCollaborations = (list: FacultyMyCollaboration[]) => {
  try {
    localStorage.setItem(COLLABORATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save Faculty Collaborations to localStorage', e);
  }
};

// 7. Achievements & Certificates Storage
export const getStoredFacultyAchievements = (): FacultyAchievementCertificate[] => {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load Faculty Achievements from localStorage', e);
  }
  return initialFacultyAchievements;
};

export const saveStoredFacultyAchievements = (list: FacultyAchievementCertificate[]) => {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save Faculty Achievements to localStorage', e);
  }
};

// 8. Dynamic Academic Intelligence Aggregator
export const getAcademicIntelligenceMetrics = (): AcademicIntelligenceMetrics => {
  // Dynamically compute active grant values from research collaborations if available
  const research = getStoredResearchCollaborations();
  const collabs = getStoredFacultyCollaborations();
  const activeResearchGrants = research.filter(r => r.status === 'Active/Ongoing');
  const activeCollabs = collabs.filter(c => c.status === 'Ongoing');
  
  const computedGrantTotal = activeResearchGrants.reduce((acc, curr) => acc + (curr.grantAmount || 0), 0);

  return {
    ...initialAcademicIntelligenceMetrics,
    activeGrants: activeResearchGrants.length || initialAcademicIntelligenceMetrics.activeGrants,
    grantValueNumber: computedGrantTotal > 0 ? computedGrantTotal : initialAcademicIntelligenceMetrics.grantValueNumber,
    grantValueFormatted: computedGrantTotal > 0 
      ? `₹${(computedGrantTotal / 100000).toFixed(2)} Lakhs` 
      : initialAcademicIntelligenceMetrics.grantValueFormatted,
    ongoingCollaborations: activeCollabs.length || initialAcademicIntelligenceMetrics.ongoingCollaborations
  };
};

