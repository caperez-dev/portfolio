import { ResumeData } from '../types';

export const resumeData: ResumeData = {
  name: "Carlos Alfonso B. Perez",
  headline: "Hi, my name is\nCarlos Alfonso Perez.\nI build websites for you.",
  punchingStatement: "Full-stack developer specializing in Web & Mobile Development, building applications tested and validated by real users. Driven to create solutions that solve real problems for clients.",
  contact: {
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
        category: "Programming Languages",
        skills: [
          { name: "PHP",        logoKey: "php",        filterCategory: "backend"  },
          { name: "Java",       logoKey: "java",       filterCategory: "backend"  },
          { name: "JavaScript", logoKey: "javascript", filterCategory: "frontend" },
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
      role: "Project Manager, UI/UX Design, Backend Development, System Documentation",
      description: [
        "Managed a 4-member Agile team to plan and build the platform.",
        "Led UI/UX design and created 100+ system diagrams including use-case, activity, and ERD diagrams.",
        "Designed 200+ test cases and assisted with VPS deployment through Hostinger."
      ],
      images: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "paramdam",
      title: "Order Processing System & Attendance Monitoring for Paramdam Café",
      subtitle: "Web Application",
      category: "web",
      technologies: ["HTML", "Bootstrap CSS", "JavaScript", "PHP", "MySQL Database"],
      role: "UI/UX Design, Backend Development, System Documentation",
      description: [
        "Executed complete development lifecycle from front-end to back-end.",
        "Designed 10+ system diagrams and executed 50 test cases.",
        "Deployed the live system on Hostinger using HTML, Bootstrap, JavaScript, PHP, and MySQL."
      ],
      images: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "cicselect",
      title: "CICSelect: Secure Online Voting System",
      subtitle: "Web Application",
      category: "web",
      technologies: ["HTML", "Bootstrap", "PHP Laravel Framework", "MySQL Database"],
      role: "UI/UX Design, Backend Development, System Documentation",
      description: [
        "Developed a secure online voting platform using PHP Laravel and MySQL.",
        "Implemented user authentication and vote validation logic.",
        "Designed an intuitive UI with Bootstrap and deployed on InfinityFree for testing and demonstration."
      ],
      images: [
        "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "summit",
      title: "Summit: To-Do List & Calendar Mobile App",
      subtitle: "Mobile Application",
      category: "mobile",
      technologies: ["Flutter", "Dart", "Firestore Database (Firebase)"],
      role: "UI/UX Design, Backend Development, System Documentation",
      description: [
        "Managed a 4-member team and built an Android mobile application using Flutter and Dart.",
        "Integrated Firestore for real-time data synchronization across devices.",
        "Designed an intuitive UI allowing users to manage tasks and events seamlessly."
      ],
      images: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "projectmind",
      title: "ProjectMIND: Learning Management System",
      subtitle: "Web Application",
      category: "web",
      technologies: ["ReactJS", "Express.js", "Node.js", "MySQL Database"],
      role: "UI/UX Design, Backend Development",
      description: [
        "Developed a learning management system using ReactJS for front-end and Express.js with Node.js for back-end.",
        "Designed a relational MySQL database to manage users, courses, and enrollments.",
        "Created a responsive interface tailored for Cupang Elementary School students."
      ],
      images: [
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "pixelpop",
      title: "PixelPop: Inventory Management System",
      subtitle: "Web Application",
      category: "web",
      technologies: ["AngularJS", "ASP.NET Framework", "MySQL Database"],
      role: "UI/UX Design, Backend Development",
      description: [
        "Built an inventory management system using AngularJS and ASP.NET Framework.",
        "Designed a MySQL database to track products, stock levels, and transactions.",
        "Implemented CRUD operations to streamline inventory tracking for small businesses."
      ],
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
      ]
    }
  ]
};
