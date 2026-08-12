export interface ResumeContact {
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github?: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  companyLogo?: string;
}

export interface EducationItem {
  institution: string;
  location: string;
  period: string;
  degree: string;
  gwa?: string;
  honors?: string;
  coursework?: string[];
  highlights?: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  url?: string;
  identifier?: string;
  imageUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'capstone' | 'web' | 'mobile' | 'system';
  technologies: string[];
  role: string;
  hosting?: string;
  description: string[];
  images?: string[];
}

export interface TechSkillCategory {
  category: string;
  skills: { name: string; logoKey?: string }[];
}

export interface ResumeData {
  name: string;
  headline: string;
  punchingStatement: string;
  contact: ResumeContact;
  summary: string;
  skills: {
    itOps: string[];
    webDev: TechSkillCategory[];
    other: string[];
    softSkills: string[];
  };
  experience: WorkExperience[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
}

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  darkBg: string;
  darkCard: string;
  darkText: string;
  darkAccent: string;
  darkSecondary: string;
  darkBorder: string;
  lightBg: string;
  lightCard: string;
  lightText: string;
  lightAccent: string;
  lightSecondary: string;
  lightBorder: string;
  fontFamily: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactSubmitResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  hash?: string;
  savedToFirestore?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
