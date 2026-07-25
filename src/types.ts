export type PreloaderPhase = 1 | 2 | 3 | 4 | 5;

export interface WorkProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  badge?: string;
  image: string;
  description: string;
  challenge: string;
  solution: string;
  technologies: string[];
  outcomes: string[];
  featured?: boolean;
}

export interface StudentProject {
  id: string;
  title: string;
  category: 'Featured' | 'Popular' | 'New' | 'Advanced';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  image: string;
  description: string;
  techStack: string[];
  includes: string[];
  specifications: Record<string, string>;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
  iconName: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  shapeType: 'cube' | 'sphere' | 'torus' | 'octahedron' | 'ring' | 'pyramid' | 'cylinder' | 'knot';
}

export interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: string;
  tags: string[];
  bio: string;
  expandedBio?: string;
  keyContributions?: string[];
  specialties?: string[];
  stats?: { label: string; value: string }[];
}

export interface DiscussionFormData {
  projectType: string;
  description: string;
  budgetRange: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  companyOrCollege: string;
}
