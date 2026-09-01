import { FdpProgram, ConsultancyProject } from '../types';

export const initialFdpPrograms: FdpProgram[] = [
  {
    id: 'fdp-101',
    title: 'Generative AI, Large Language Models & Agentic Workflows in Production',
    type: 'AI & Emerging Tech',
    mode: 'Hybrid',
    duration: '1 Week (30 Hours)',
    startDate: '2026-10-12',
    endDate: '2026-10-17',
    datesFormatted: 'Oct 12 – Oct 17, 2026',
    resourcePerson: {
      name: 'Dr. Sanjay Rawat',
      designation: 'Principal AI Scientist & Research Fellow',
      organization: 'Intel Labs India (Ph.D. IISc Bangalore)',
      bio: 'Leading researcher in generative foundation models, agentic reasoning loops, and hardware-accelerated inferencing.'
    },
    organizingBody: 'AICTE Training and Learning (ATAL) Academy & MJPRU',
    status: 'Open for Registration',
    totalSeats: 60,
    registeredSeats: 48,
    description: 'A comprehensive, hands-on faculty development initiative focused on modern transformer architectures, RAG pipeline construction, fine-tuning open weights models (Llama-3, Gemma-2), and integrating autonomous agentic workflows into university undergraduate and postgraduate syllabi.',
    learningOutcomes: [
      'Architecting production-ready RAG pipelines with vector databases',
      'Implementing multi-agent task execution loops with LangGraph and CrewAI',
      'Deploying lightweight quantised LLMs on edge workstations and university labs',
      'Formulating rigorous ethical boundaries and anti-jailbreak safety layers'
    ],
    targetAudience: 'Faculty members, Post-Docs, and Research Supervisors in CSE, IT, AI & Data Science',
    prerequisites: 'Working familiarity with Python, PyTorch fundamentals, and Neural Networks',
    venueOrPlatform: 'Seminar Hall 2 (CSIT Block) & Hybrid Microsoft Teams Stream',
    certificateAvailable: false,
    isRegistered: false
  },
  {
    id: 'fdp-102',
    title: 'Cloud-Native Microservices, Kubernetes Orchestration & DevOps Security',
    type: 'Cloud & DevOps',
    mode: 'Online',
    duration: '5 Days (25 Hours)',
    startDate: '2026-11-03',
    endDate: '2026-11-07',
    datesFormatted: 'Nov 03 – Nov 07, 2026',
    resourcePerson: {
      name: 'Ms. Ananya Deshmukh',
      designation: 'Staff Site Reliability & Cloud Architect',
      organization: 'Google Cloud Platform (Former Red Hat Principal)',
      bio: 'Cloud infrastructure veteran with 14+ years architecting zero-trust microservice meshes and Kubernetes orchestration.'
    },
    organizingBody: 'NASSCOM FutureSkills Prime & Ministry of Electronics & IT (MeitY)',
    status: 'Upcoming',
    totalSeats: 60,
    registeredSeats: 25,
    description: 'Designed for engineering educators to bridge the industry-academia gap in scalable backend infrastructure. Covers containerization best practices, Kubernetes custom resource controllers, CI/CD automated gates, and enterprise security compliance.',
    learningOutcomes: [
      'Mastering multi-stage Docker builds and minimal vulnerability images',
      'Configuring Kubernetes Ingress controllers, Helm charts, and service meshes',
      'Establishing GitOps automation with ArgoCD and GitHub Actions',
      'Designing course curriculum projects with cloud free-tier sandbox boundaries'
    ],
    targetAudience: 'Faculty and Technical Instructors in Computer Science, Information Technology, and Software Engineering',
    prerequisites: 'Basic Linux shell commands and Web architecture knowledge',
    venueOrPlatform: 'Virtual Lab via Google Meet & Cloud Sandbox',
    certificateAvailable: false,
    isRegistered: true
  },
  {
    id: 'fdp-103',
    title: 'Quantum Computing Fundamentals & Qiskit Algorithmic Simulation',
    type: 'Research Methodology & Deep Tech',
    mode: 'Offline',
    duration: '2 Weeks (60 Hours)',
    startDate: '2026-07-15',
    endDate: '2026-07-27',
    datesFormatted: 'Jul 15 – Jul 27, 2026',
    resourcePerson: {
      name: 'Prof. Vikramaditya Sen',
      designation: 'Senior Quantum Research Fellow',
      organization: 'IBM Quantum & IIT Madras',
      bio: 'Pioneer in quantum circuit synthesis, Shor & Grover error reduction, and quantum cryptography protocols.'
    },
    organizingBody: 'IEEE Computer Society & Department of Science and Technology (DST)',
    status: 'Completed',
    totalSeats: 50,
    registeredSeats: 50,
    description: 'An advanced residential immersion into quantum state vectors, superposition, entanglement, and quantum logic gates. Educators designed, simulated, and executed quantum algorithms on IBM Quantum Cloud superconducting chips.',
    learningOutcomes: [
      'Formulating quantum state transformations and Bloch sphere geometry',
      'Programming quantum logic circuits in IBM Qiskit and simulator backends',
      'Benchmarking Quantum Key Distribution (QKD) and post-quantum cryptographic primitives',
      'Drafting funded research proposals for DST and SERB grant calls'
    ],
    targetAudience: 'Senior Faculty, HODs, and Sponsored Research Investigators',
    prerequisites: 'Linear Algebra, Complex Numbers, and Basic Quantum Mechanics',
    venueOrPlatform: 'Advanced Computing Lab 1, MJPRU Campus',
    certificateAvailable: true,
    certificateDetails: {
      certificateId: 'FDP-MJPRU-QC-2026-089',
      issueDate: '2026-07-28',
      recipientName: 'Dr. Arvind K. Sharma',
      recipientDesignation: 'Head of Department, CSIT',
      grade: 'Distinction (A+)',
      accreditation: 'IEEE Computer Society & DST (Govt. of India)'
    },
    isRegistered: true
  },
  {
    id: 'fdp-104',
    title: 'Outcome-Based Pedagogical Engineering & NEP 2020 Experiential Learning',
    type: 'Pedagogy & Accreditation',
    mode: 'Online',
    duration: '3 Days (18 Hours)',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    datesFormatted: 'Aug 10 – Aug 12, 2026',
    resourcePerson: {
      name: 'Dr. Shalini Mukherjee',
      designation: 'Senior Academic Accreditation Assessor',
      organization: 'National Board of Accreditation (NBA)',
      bio: 'National expert in NBA Tier-1 outcome-based education metrics, Bloom taxonomy cognitive mapping, and multidisciplinary NEP 2020 framework.'
    },
    organizingBody: 'National Board of Accreditation (NBA) & MJPRU IQAC',
    status: 'Completed',
    totalSeats: 75,
    registeredSeats: 75,
    description: 'Focuses on mapping Course Outcomes (COs) to Program Outcomes (POs) and Program Specific Outcomes (PSOs), formulating authentic rubric evaluations, and executing industry-aligned capstone assessments.',
    learningOutcomes: [
      'Mathematical computation of direct and indirect CO-PO attainment levels',
      'Designing experiential capstone rubrics aligned with NAAC Criteria 1 & 2',
      'Integrating active learning flipped-classroom models for high student engagement',
      'Continuous quality improvement (CQI) documentation workflows for NBA visits'
    ],
    targetAudience: 'All Department Heads, Program Coordinators, and Academic Audit Committee Members',
    prerequisites: 'None',
    venueOrPlatform: 'MJPRU IQAC Virtual Conference Platform',
    certificateAvailable: true,
    certificateDetails: {
      certificateId: 'FDP-NBA-NEP-2026-142',
      issueDate: '2026-08-13',
      recipientName: 'Dr. Arvind K. Sharma',
      recipientDesignation: 'Head of Department, CSIT',
      grade: 'Exemplary',
      accreditation: 'National Board of Accreditation & IQAC'
    },
    isRegistered: true
  }
];

export const initialConsultancies: ConsultancyProject[] = [
  {
    id: 'cons-201',
    projectTitle: 'Automated SCADA Telemetry & Anomaly Detection Pipeline',
    clientOrganization: 'Bharat Petroleum Corporation Ltd. (BPCL)',
    domain: 'Industrial IoT & Anomaly Detection',
    facultyLead: 'Dr. Arvind K. Sharma (PI)',
    coInvestigators: ['Dr. Meenakshi Sundaram (Co-PI)', 'Er. Vikas Rastogi'],
    duration: '6 Months (May 2026 – Oct 2026)',
    startDate: '2026-05-01',
    endDate: '2026-10-31',
    engagementType: 'Industrial R&D & Software Delivery',
    status: 'Ongoing',
    consultancyValue: 850000,
    consultancyValueFormatted: '₹8,50,000',
    description: 'Architecting and deploying real-time sensor telemetry anomaly detection algorithms using deep autoencoders and edge inferencing across refinery pipeline monitoring nodes to prevent catastrophic pressure surges and equipment downtime.',
    deliverables: [
      'Edge IoT telemetry parsing firmware for MODBUS and OPC-UA protocols',
      'High-throughput Kafka ingestion cluster with sub-50ms latency guarantees',
      'Online variational autoencoder model with 99.2% anomaly precision',
      'Executive telemetry dashboard with automated SMS and email escalation',
      'Comprehensive deployment, calibration, and maintenance operational manual'
    ],
    milestones: [
      { id: 'm1', title: 'System Architecture & Telemetry Data Ingestion Benchmark', dueDate: '2026-06-15', completed: true, valueShare: '₹2,50,000' },
      { id: 'm2', title: 'Deep Autoencoder Model Training & Edge Device Optimization', dueDate: '2026-08-30', completed: true, valueShare: '₹3,50,000' },
      { id: 'm3', title: 'Plant-Wide Live Trial, Stress Testing & Final Signoff', dueDate: '2026-10-31', completed: false, valueShare: '₹2,50,000' }
    ],
    contractRefNumber: 'BPCL/R&D/CONS-2026/044'
  },
  {
    id: 'cons-202',
    projectTitle: 'High-Availability Multi-Cloud Infrastructure & Cyber Resilience Architecture',
    clientOrganization: 'Schneider Electric India',
    domain: 'Cloud Architecture & Cyber Resilience',
    facultyLead: 'Dr. Arvind K. Sharma (PI)',
    coInvestigators: ['Prof. R. K. Gupta', 'Dr. Alok Verma'],
    duration: '4 Months (Jul 2026 – Nov 2026)',
    startDate: '2026-07-01',
    endDate: '2026-11-30',
    engagementType: 'Architecture Audit & Advisory',
    status: 'Ongoing',
    consultancyValue: 1420000,
    consultancyValueFormatted: '₹14,20,000',
    description: 'Comprehensive cybersecurity audit, zero-trust network segmentation, automated multi-region active-active disaster recovery failovers, and ISO 27001 / IEC 62443 compliance gap analysis for Schneider Electric’s smart energy grid SaaS platform.',
    deliverables: [
      'Multi-cloud Kubernetes disaster recovery automation blueprints (AWS & Azure)',
      'Zero-Trust micro-segmentation and IAM least-privilege matrix',
      'Simulated chaos engineering resilience validation report',
      'Executive compliance report for IEC 62443 industrial control system security'
    ],
    milestones: [
      { id: 'm1', title: 'Current Infrastructure Vulnerability & Threat Vector Assessment', dueDate: '2026-08-15', completed: true, valueShare: '₹4,50,000' },
      { id: 'm2', title: 'Active-Active Multi-Cloud Failover Implementation & Drills', dueDate: '2026-10-15', completed: false, valueShare: '₹5,50,000' },
      { id: 'm3', title: 'Final Security Governance Framework & Staff Training', dueDate: '2026-11-30', completed: false, valueShare: '₹4,20,000' }
    ],
    contractRefNumber: 'SEI/CONS/2026/G-882'
  },
  {
    id: 'cons-203',
    projectTitle: 'Smart Grid Peak Load Forecasting Using Ensemble Temporal Models',
    clientOrganization: 'Uttar Pradesh Power Corporation Ltd. (UPPCL)',
    domain: 'Energy Analytics & Machine Learning',
    facultyLead: 'Dr. Arvind K. Sharma (PI)',
    coInvestigators: ['Dr. S. K. Maurya (Co-PI)'],
    duration: '8 Months (Jan 2026 – Aug 2026)',
    startDate: '2026-01-10',
    endDate: '2026-08-25',
    engagementType: 'Turnkey Solution Development',
    status: 'Completed',
    consultancyValue: 1180000,
    consultancyValueFormatted: '₹11,80,000',
    description: 'Designed and deployed sub-station level 24-hour and 7-day electrical demand forecasting using temporal fusion transformers and gradient boosted trees, factoring in weather telemetry and regional industrial shifts to reduce grid deviation settlement penalties.',
    deliverables: [
      'Temporal Fusion Transformer predictive engine tailored for northern grid load dynamics',
      'Integration with SCADA real-time telemetry feeders across 14 district substations',
      'Reported 18.4% reduction in Deviation Settlement Mechanism (DSM) overdraw penalties',
      'Complete IP transfer, source code repositories, and operators training manual'
    ],
    milestones: [
      { id: 'm1', title: 'Historical Load Data Cleansing & Feature Engineering', dueDate: '2026-03-01', completed: true, valueShare: '₹3,00,000' },
      { id: 'm2', title: 'Ensemble Model Deployment & SCADA API Integration', dueDate: '2026-05-30', completed: true, valueShare: '₹5,00,000' },
      { id: 'm3', title: 'Performance Validation, Penalty Reduction Audit & Final Handover', dueDate: '2026-08-25', completed: true, valueShare: '₹3,80,000' }
    ],
    contractRefNumber: 'UPPCL/TECH-CONS/2026/119'
  },
  {
    id: 'cons-204',
    projectTitle: 'Autonomous Drone Fleet Telemetry & Swarm Collision Avoidance Simulation',
    clientOrganization: 'Garuda Aerospace Pvt. Ltd.',
    domain: 'Autonomous Robotics & Embedded Systems',
    facultyLead: 'Dr. Arvind K. Sharma (PI)',
    coInvestigators: ['Dr. Preeti Verma', 'Dr. Meenakshi Sundaram'],
    duration: '5 Months (Oct 2026 – Feb 2027)',
    startDate: '2026-10-01',
    endDate: '2027-02-28',
    engagementType: 'Industrial Research & Development Proposal',
    status: 'Proposal Stage',
    consultancyValue: 650000,
    consultancyValueFormatted: '₹6,50,000',
    description: 'Formal industrial consultancy proposal for designing decentralized peer-to-peer mesh radio protocols and 3D potential field obstacle avoidance algorithms for autonomous agricultural drone swarms operating without continuous GPS connectivity.',
    deliverables: [
      'Decentralized swarm coordination algorithm in Gazebo and ROS2 environments',
      'Hardware-in-the-loop (HIL) testbench with ESP32 mesh nodes',
      'Patent draft and technology licensing terms for Garuda Aerospace commercial lineup'
    ],
    milestones: [
      { id: 'm1', title: 'Proposal Evaluation & Client Legal Review', dueDate: '2026-10-15', completed: false, valueShare: '₹1,50,000' },
      { id: 'm2', title: 'ROS2 Simulation & Distributed Pathfinding Benchmark', dueDate: '2026-12-15', completed: false, valueShare: '₹3,00,000' },
      { id: 'm3', title: 'Physical Drone Telemetry Field Trials & Handover', dueDate: '2027-02-28', completed: false, valueShare: '₹2,00,000' }
    ],
    contractRefNumber: 'GARUDA/PROP/2026/012'
  }
];

// LocalStorage helpers for persistence
const FDP_STORAGE_KEY = 'ladder_fdp_programs_v1';
const CONSULTANCY_STORAGE_KEY = 'ladder_consultancy_projects_v1';

export const getStoredFdpPrograms = (): FdpProgram[] => {
  try {
    const data = localStorage.getItem(FDP_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load FDP programs from localStorage', e);
  }
  return initialFdpPrograms;
};

export const saveStoredFdpPrograms = (programs: FdpProgram[]) => {
  try {
    localStorage.setItem(FDP_STORAGE_KEY, JSON.stringify(programs));
  } catch (e) {
    console.error('Failed to save FDP programs to localStorage', e);
  }
};

export const getStoredConsultancies = (): ConsultancyProject[] => {
  try {
    const data = localStorage.getItem(CONSULTANCY_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load Consultancies from localStorage', e);
  }
  return initialConsultancies;
};

export const saveStoredConsultancies = (consultancies: ConsultancyProject[]) => {
  try {
    localStorage.setItem(CONSULTANCY_STORAGE_KEY, JSON.stringify(consultancies));
  } catch (e) {
    console.error('Failed to save Consultancies to localStorage', e);
  }
};
