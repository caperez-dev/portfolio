import { ResumeData } from '../types';

export const resumeData: ResumeData = {
  name: "Carlos Alfonso B. Perez",
  headline: "Hi, my name is\nCarlos Alfonso Perez.\nI build websites for you.",
  punchingStatement: "Full-stack developer specializing in Web & Mobile Development, building modern applications that people can actually use. Driven to create solutions that solve problems for clients.",  contact: {
    location: "Makati City, Metro Manila, Philippines",
    phone: "+63 9774279909",
    email: "alfonso.cperez08@gmail.com",
    linkedin: "https://linkedin.com/in/carlos-alfonso-perez-393734316",
    github: "https://github.com/caperez-dev"
  },
  summary: "IT professional with a Cum Laude degree in Information Technology and specialized internship experience in enterprise software packaging and deployment. Successfully packaged and deployed 50+ Windows applications using Patch My PC and Intune, while also developing web applications with modern frameworks like React.js and PHP Laravel. A detail-oriented problem-solver with a strong foundation in IT operations, quality assurance, and technical documentation. Ready to contribute, collaborate, and grow.",
  skills: {
    itOps: [
      "Software Packaging and Deployment",
      "PowerShell Scripting",
      "ServiceNow",
      "Patch My PC",
      "IntuneWin",
      "Advanced Installer"
    ],
    webDev: [
      {
        category: "Software Packaging",
        skills: [
          { name: "Software Packaging and Deployment", logoKey: "packaging",  filterCategory: "packaging" },
          { name: "PowerShell Scripting",               logoKey: "powershell", filterCategory: "packaging" },
          { name: "ServiceNow",                         logoKey: "servicenow", filterCategory: "packaging" },
          { name: "Patch My PC",                        logoKey: "patchmypc",  filterCategory: "packaging" },
          { name: "IntuneWin",                          logoKey: "intunewin",  filterCategory: "packaging" },
          { name: "Advanced Installer",                 logoKey: "installer",  filterCategory: "packaging" }
        ]
      },
      {
        category: "Automation",
        skills: [
          { name: "Make", logoKey: "make", filterCategory: "automation" }
        ]
      },
      {
        category: "Programming Languages",
        skills: [
          { name: "PHP",        logoKey: "php",        filterCategory: "backend"  },
          { name: "Java",       logoKey: "java",       filterCategory: "backend"  },
          { name: "JavaScript", logoKey: "javascript", filterCategory: "frontend" },
          { name: "TypeScript", logoKey: "typescript", filterCategory: "frontend" },
          { name: "HTML5",      logoKey: "html5",      filterCategory: "frontend" },
          { name: "CSS3",       logoKey: "css3",       filterCategory: "frontend" }
        ]
      },
      {
        category: "Frameworks & Libraries",
        skills: [
          { name: "React.js",      logoKey: "react",        filterCategory: "frontend" },
          { name: "AngularJS",     logoKey: "angular",      filterCategory: "frontend" },
          { name: "Express.js",    logoKey: "express",      filterCategory: "backend"  },
          { name: "PHP Laravel",   logoKey: "laravel",      filterCategory: "backend"  },
          { name: "Bootstrap",     logoKey: "bootstrap",    filterCategory: "frontend" },
          { name: "MaterializeCSS",logoKey: "materializecss",filterCategory: "frontend" }
        ]
      },
      {
        category: "Databases",
        skills: [
          { name: "MySQL Workbench",   logoKey: "mysql",    filterCategory: "databases" },
          { name: "HeidiSQL",          logoKey: "heidisql", filterCategory: "databases" },
          { name: "Firebase Firestore",logoKey: "firebase", filterCategory: "databases" }
        ]
      },
      {
        category: "Version Control",
        skills: [
          { name: "Git",    logoKey: "git",    filterCategory: "devops" },
          { name: "GitHub", logoKey: "github", filterCategory: "devops" }
        ]
      },
      {
        category: "Methodologies",
        skills: [
          { name: "SDLC",                  logoKey: "sdlc",   filterCategory: "devops" },
          { name: "Agile (Scrum & Kanban)", logoKey: "trello", filterCategory: "devops" }
        ]
      },
      {
        category: "Wireframe & Design",
        skills: [
          { name: "Figma",      logoKey: "figma",      filterCategory: "design" },
          { name: "Canva",      logoKey: "canva",      filterCategory: "design" },
          { name: "Draw.io",    logoKey: "drawio",     filterCategory: "design" },
          { name: "Lucidchart", logoKey: "lucidchart", filterCategory: "design" }
        ]
      }
    ],
    other: [],
    softSkills: []
  },
  experience: [
    {
      title: "IT Governance & Operations Intern",
      company: "Henkel Asia Pacific Services Centre",
      companyLogo: "henkel",
      period: "Feb 2026 - Jun 2026",
      location: "Makati City, Metro Manila, Philippines",
      highlights: [
        "Performed 50 software packaging and deployment of line-of-business (LOB) Windows applications using Patch My PC.",
        "Collaborated with the IT team during daily standup meetings to provide status updates, identify blockers, align priorities for software deployment tasks, troubleshoot issues, resolve deployment problems, and perform testing.",
        "Conducted 60 application testing and validation to ensure successful installation and functionality on the Company Portal.",
        "Developed 15 basic PowerShell scripts to support IntuneWin application packaging and deployment.",
        "Completed foundational training in Advanced Installer and applied knowledge to support application packaging and deployment workflows.",
        "Added Intune notes on 400+ Patch My PC deployments."
      ]
    }
  ],
  education: [
    {
      institution: "University of Santo Tomas (UST)",
      location: "Sampaloc City, Metro Manila, Philippines",
      period: "Aug 2022 - Jun 2026",
      degree: "Bachelor of Science in Information Technology",
      gwa: "1.672",
      honors: "Cum Laude",
      coursework: [
        "Information Management",
        "Software Engineering",
        "Data Structures and Algorithms",
        "Human-Computer Interaction",
        "Computer Security and Information Assurance"
      ]
    },
    {
      institution: "De La Salle - Lipa (DLSL)",
      location: "Lipa City, Province of Batangas",
      period: "Aug 2020 - Aug 2022",
      degree: "Senior High School - Science, Technology, Engineering, and Mathematics (STEM)",
      honors: "Graduated with High Honors"
    }
  ],
  certifications: [
    {
      title: "DevOps Foundations: DevSecOps (2018)",
      issuer: "Henkel (LinkedIn Learning)",
      date: "Apr 16, 2026",
      identifier: "bbd712a31d49ccdfc756c3fa99ef534b8619367f8182e288ee77fb3b628367f2",
      imageUrl: new URL('../assets/certifications/CertificateOfCompletion_DevOps Foundations DevSecOps 2018.png', import.meta.url).href
    },
    {
      title: "General Cybersecurity Awareness Training - English",
      issuer: "Henkel",
      date: "Apr 14, 2026",
      url: "https://henkel.csod.com/ui/training/app/targetUser/3699955/trainingID/8936239d-6a78-44d6-8028-000af4ce0e90?trainingType=Course&action=112&isM6ILT=true&isOCSE=true&isU",
      imageUrl: new URL('../assets/certifications/Carlos Alfonso B. Perez - General Cybersecurity Awareness Training - English.png', import.meta.url).href
    },
    {
      title: "ITIL Process Training: Incident Management & Problem Management",
      issuer: "Henkel",
      date: "Apr 7, 2026"
    },
    {
      title: "Gen AI Foundations",
      issuer: "Henkel",
      date: "Feb 19, 2026"
    },
    {
      title: "PHILNITS Passer (IT Passport Exam)",
      issuer: "ITPEC / PHILNITS",
      date: "Oct 26, 2025",
      url: "https://itpec.org/statsandresults/all-passers-information/Philippines/2025A_IP.pdf",
      identifier: "IP01-0275"
    }
  ],
  projects: [
    {
      id: "quizzle",
      title: "Quizzle: An AI-driven Web App for Personalized Online Learning",
      subtitle: "Web Application",
      category: "web",
      technologies: ["React.js", "Firebase Firestore", "Node.js", "Express.js", "Web Sockets (Socket.io)", "LLaMA 3.3 70B"],
      dateRange: "Jun 2025 – Nov 2025",
      role: "Project Manager, UI/UX Design, Backend Development, System Documentation",
      description: [
        "Managed a 4-member Agile team to plan and build the platform.",
        "Led UI/UX design and created 100+ system diagrams including use-case, activity, and ERD diagrams.",
        "Designed 200+ test cases and assisted with VPS deployment through Hostinger."
      ],
      logo: new URL('../assets/projects/quizzle.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/quizzle2.png', import.meta.url).href,
        new URL('../assets/projects/quizzle1.png', import.meta.url).href
      ]
    },
    {
      id: "paramdam",
      title: "Order Processing System & Attendance Monitoring for Paramdam Café",
      subtitle: "Web Application",
      category: "web",
      technologies: ["HTML", "Bootstrap CSS", "JavaScript", "PHP", "MySQL Database"],
      dateRange: "Feb 2025 – Jun 2025",
      role: "UI/UX Design, Backend Development, System Documentation",
      description: [
        "Executed complete development lifecycle from front-end to back-end.",
        "Designed 10+ system diagrams and executed 50 test cases.",
        "Deployed the live system on Hostinger using HTML, Bootstrap, JavaScript, PHP, and MySQL."
      ],
      logo: new URL('../assets/projects/paramdam.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/paramdam1.png', import.meta.url).href
      ]
    },
    {
      id: "cicselect",
      title: "CICSelect: Secure Online Voting System",
      subtitle: "Web Application",
      category: "web",
      technologies: ["HTML", "Bootstrap", "PHP Laravel Framework", "MySQL Database"],
      dateRange: "Nov 2025 – Dec 2025",
      role: "UI/UX Design, Backend Development, System Documentation",
      description: [
        "Developed a secure online voting platform using PHP Laravel and MySQL.",
        "Implemented user authentication and vote validation logic.",
        "Designed an intuitive UI with Bootstrap and deployed on InfinityFree for testing and demonstration."
      ],
      logo: new URL('../assets/projects/cicselect.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/cicselect1.png', import.meta.url).href,
        new URL('../assets/projects/cicselect2.png', import.meta.url).href
      ]
    },
    {
      id: "summit",
      title: "Summit: To-Do List & Calendar Mobile App",
      subtitle: "Mobile Application",
      category: "mobile",
      technologies: ["Flutter", "Dart", "Firestore Database (Firebase)"],
      dateRange: "Apr 2026 – May 2026",
      role: "UI/UX Design, Backend Development, System Documentation",
      description: [
        "Managed a 3-member team and built an Android mobile application using Flutter and Dart.",
        "Integrated Firestore for real-time data synchronization across devices.",
        "Designed an intuitive UI allowing users to manage tasks and events seamlessly."
      ],
      logo: new URL('../assets/projects/summit.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/summit1.gif', import.meta.url).href,
        new URL('../assets/projects/summit2.png', import.meta.url).href
      ]
    },
    {
      id: "projectmind",
      title: "ProjectMIND: Learning Management System",
      subtitle: "Web Application",
      category: "web",
      technologies: ["ReactJS", "Express.js", "Node.js", "MySQL Database"],
      dateRange: "May 2025 – Jun 2025",
      role: "UI/UX Design, Backend Development",
      description: [
        "Developed a learning management system using ReactJS for front-end and Express.js with Node.js for back-end.",
        "Designed a relational MySQL database to manage users, courses, and enrollments.",
        "Created a responsive interface tailored for Cupang Elementary School students."
      ],
      logo: new URL('../assets/projects/projectmind.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/projectmind1.png', import.meta.url).href
      ]
    },
    {
      id: "pixelpop",
      title: "PixelPop: Inventory Management System",
      subtitle: "Web Application",
      category: "web",
      technologies: ["AngularJS", "ASP.NET Framework", "MySQL Database"],
      dateRange: "Nov 2024 – Dec 2024",
      role: "UI/UX Design, Backend Development",
      description: [
        "Built an inventory management system using AngularJS and ASP.NET Framework.",
        "Designed a MySQL database to track products, stock levels, and transactions.",
        "Implemented CRUD operations to streamline inventory tracking for small businesses."
      ],
      logo: new URL('../assets/projects/pixelpop.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/pixelpop1.jpg', import.meta.url).href
      ]
    },
    {
      id: "elysian",
      title: "Elysian: Resort Reservation System",
      subtitle: "Web Application",
      category: "web",
      technologies: ["PHP", "MySQL Database"],
      dateRange: "May 2024 – Jun 2024",
      role: "Full-Stack Development, UI/UX Design, System Documentation",
      description: [
        "Developed a web-based resort reservation system that streamlines booking operations, enabling users to reserve accommodations, manage schedules, and track availability in real time."
      ],
      logo: new URL('../assets/projects/elysian.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/elysian1.png', import.meta.url).href
      ]
    },
    {
      id: "analist",
      title: "Analist: To-Do List Mobile App",
      subtitle: "Mobile Application",
      category: "mobile",
      technologies: ["Kotlin", "Firebase"],
      dateRange: "Nov 2024 – Dec 2024",
      role: "Mobile Development, UI/UX Design",
      description: [
        "Built an Android to-do list mobile application using Kotlin, integrated Firebase Firestore for real-time task synchronization, and designed an intuitive UI for creating, organizing, and tracking daily tasks."
      ],
      logo: new URL('../assets/projects/analist.png', import.meta.url).href,
      images: [
        new URL('../assets/projects/analist1.png', import.meta.url).href
      ]
    }
  ]
};
