export interface CollegeItem {
  id: string;
  name: string;
  short: string;
  city: string;
  logo: string;
  fallbackLogo?: string;
  domain?: string;
  badgeColor?: string;
  motto?: string;
}

// Crisp inline SVGs representing authentic institutions as rock-solid fallbacks
export const MJPRU_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230F3B82" stroke="%23F7C325" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><path d="M50 22 C36 22 28 32 28 44 C28 60 48 74 50 76 C52 74 72 60 72 44 C72 32 64 22 50 22 Z" fill="%230F3B82"/><circle cx="50" cy="40" r="8" fill="%23F7C325"/><path d="M42 56 L58 56 L50 46 Z" fill="%23FFFFFF"/><text x="50" y="88" font-size="8" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">MJPRU BAREILLY</text></svg>`;

export const BAREILLY_COLLEGE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23C22326" stroke="%23EBB02D" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23FFF6D6"/><path d="M30 48 C30 36 70 36 70 48 L65 72 L35 72 Z" fill="%23C22326"/><polygon points="50,22 42,34 58,34" fill="%23EBB02D"/><circle cx="50" cy="52" r="7" fill="%23EBB02D"/><text x="50" y="68" font-size="6.5" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">ESTD 1837</text><text x="50" y="89" font-size="6.5" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">सर्वेषां श्रेयसे विद्या</text></svg>`;

export const LUCKNOW_UNIV_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230D47A1" stroke="%23FF9800" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><path d="M50 18 L53 30 L65 30 L55 38 L59 50 L50 42 L41 50 L45 38 L35 30 L47 30 Z" fill="%23FF9800"/><path d="M30 52 C30 68 70 68 70 52 C62 62 38 62 30 52 Z" fill="%230D47A1"/><circle cx="50" cy="56" r="5" fill="%23E91E63"/><text x="50" y="74" font-size="6" font-family="sans-serif" font-weight="bold" fill="%230D47A1" text-anchor="middle">LIGHT AND LEARNING</text><text x="50" y="88" font-size="7" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">UNIV OF LUCKNOW</text></svg>`;

export const AKTU_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230E2F56" stroke="%2300BCD4" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><circle cx="50" cy="50" r="18" fill="%2300BCD4" fill-opacity="0.2" stroke="%230E2F56" stroke-width="2"/><circle cx="50" cy="50" r="7" fill="%230E2F56"/><path d="M50 20 L50 80 M20 50 L80 50" stroke="%2300BCD4" stroke-width="1.5" stroke-dasharray="3,3"/><text x="50" y="88" font-size="8" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">AKTU LUCKNOW</text></svg>`;

export const BBAU_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%234A154B" stroke="%23E2A03F" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><path d="M50 24 L68 62 L32 62 Z" fill="%234A154B"/><circle cx="50" cy="45" r="7" fill="%23E2A03F"/><text x="50" y="88" font-size="8" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">BBAU LUCKNOW</text></svg>`;

export const INTEGRAL_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%2313603A" stroke="%23C2A649" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><path d="M50 22 C34 22 34 50 50 64 C66 50 66 22 50 22 Z" fill="%2313603A"/><circle cx="50" cy="40" r="6" fill="%23C2A649"/><text x="50" y="88" font-size="7" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">INTEGRAL UNIV</text></svg>`;

export const AMITY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230F2042" stroke="%23F3A712" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><path d="M34 28 L66 28 L66 52 C66 66 50 74 50 74 C50 74 34 66 34 52 Z" fill="%23F3A712"/><path d="M38 32 L62 32 L62 50 C62 60 50 68 50 68 C50 68 38 60 38 50 Z" fill="%230F2042"/><text x="50" y="52" font-size="12" font-family="sans-serif" font-weight="black" fill="%23F3A712" text-anchor="middle">A</text><text x="50" y="88" font-size="7.5" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">AMITY LUCKNOW</text></svg>`;

export const SRMS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23A81D22" stroke="%2324488A" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><polygon points="50,22 68,36 68,64 50,76 32,64 32,36" fill="%2324488A"/><circle cx="50" cy="49" r="8" fill="%23A81D22"/><text x="50" y="88" font-size="8" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">SRMS BAREILLY</text></svg>`;

export const INVERTIS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23053D2A" stroke="%23F2AA00" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><path d="M50 25 L65 45 L35 45 Z" fill="%23F2AA00"/><path d="M35 50 L65 50 L50 70 Z" fill="%23053D2A"/><text x="50" y="88" font-size="7.5" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">INVERTIS BAREILLY</text></svg>`;

export const UNIS: CollegeItem[] = [
  {
    id: "mjpru",
    name: "Mahatma Jyotiba Phule Rohilkhand University, Bareilly",
    short: "MJPRU",
    city: "Bareilly",
    logo: "/mnt/data/wa_image_2162708565596178327_1",
    fallbackLogo: MJPRU_SVG,
    domain: "mjpru.ac.in",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    motto: "Tamaso Ma Jyotirgamaya"
  },
  {
    id: "bcb",
    name: "Bareilly College, Bareilly",
    short: "Bareilly College",
    city: "Bareilly",
    logo: "/mnt/data/wa_image_2162708565596178327_2",
    fallbackLogo: BAREILLY_COLLEGE_SVG,
    domain: "bareillycollege.org",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    motto: "सर्वेषां श्रेयसे विद्या"
  },
  {
    id: "uol",
    name: "University of Lucknow",
    short: "UoL",
    city: "Lucknow",
    logo: "/mnt/data/wa_image_2162708565596178327_0",
    fallbackLogo: LUCKNOW_UNIV_SVG,
    domain: "lkouniv.ac.in",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    motto: "LIGHT AND LEARNING"
  },
  {
    id: "aktu",
    name: "AKTU, Lucknow",
    short: "AKTU",
    city: "Lucknow",
    logo: "https://aktu.ac.in/logo.png",
    fallbackLogo: AKTU_SVG,
    domain: "aktu.ac.in",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    motto: "Excellence in Technical Education"
  },
  {
    id: "bbau",
    name: "BBAU, Lucknow",
    short: "BBAU",
    city: "Lucknow",
    logo: "https://bbau.ac.in/logo.png",
    fallbackLogo: BBAU_SVG,
    domain: "bbau.ac.in",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    motto: "Knowledge, Vision & Action"
  },
  {
    id: "integral",
    name: "Integral University, Lucknow",
    short: "Integral",
    city: "Lucknow",
    logo: "https://iul.ac.in/logo.png",
    fallbackLogo: INTEGRAL_SVG,
    domain: "iul.ac.in",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    motto: "Inspiring Excellence"
  },
  {
    id: "srms",
    name: "SRMS Bareilly",
    short: "SRMS",
    city: "Bareilly",
    logo: "https://srms.ac.in/logo.png",
    fallbackLogo: SRMS_SVG,
    domain: "srms.ac.in",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    motto: "Shri Ram Murti Smarak Trust"
  },
  {
    id: "amity",
    name: "Amity Lucknow",
    short: "Amity",
    city: "Lucknow",
    logo: "https://amity.edu/logo.png",
    fallbackLogo: AMITY_SVG,
    domain: "amity.edu",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    motto: "Where Talents Meet Ambition"
  }
];

export const COLLEGES_DATA: CollegeItem[] = UNIS;

export const DEPARTMENTS = [
  "Computer Science & IT",
  "CSE",
  "AI & ML",
  "Data Science",
  "ECE",
  "EE",
  "ME",
  "Civil",
  "MBA",
  "BBA",
  "BCA",
  "MCA",
  "Biotech",
  "Commerce"
];

export const DEPARTMENTS_DATA = DEPARTMENTS.map(d => ({
  name: d,
  code: d.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase(),
  icon: d.includes('Computer') || d.includes('CSE') || d.includes('BCA') || d.includes('MCA') ? '💻' :
        d.includes('AI') ? '🤖' :
        d.includes('Data') ? '📊' :
        d.includes('MBA') || d.includes('BBA') || d.includes('Commerce') ? '📈' :
        d.includes('Bio') ? '🧬' : '⚡'
}));

export const MENTOR_COMPANIES_DATA = [
  "TCS - 5 Yrs",
  "Infosys - 8 Yrs",
  "Google - 3 Yrs",
  "Microsoft - 6 Yrs",
  "Wipro - 4 Yrs",
  "Amazon - 4 Yrs",
  "Oracle - 7 Yrs",
  "Accenture - 5 Yrs",
  "Cognizant - 6 Yrs",
  "HCL Tech - 5 Yrs"
];

export const MENTOR_EXPERTISE_TAGS = [
  "Full Stack",
  "AI/ML",
  "Cloud & DevOps",
  "System Design",
  "PostgreSQL & DB",
  "Microservices",
  "Data Engineering",
  "Cybersecurity",
  "Mobile Apps",
  "Web3 & Blockchain"
];

export const COLLEGES_LIST = COLLEGES_DATA;
