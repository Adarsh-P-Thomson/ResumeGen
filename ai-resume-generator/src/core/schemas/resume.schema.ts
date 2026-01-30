export interface Resume {
  personal: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    links?: string[];
  };
  education: Education[];
  experience: Experience[];
  projects?: Project[];
  skills: string[];
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  graduationDate: string;
  gpa?: string;
  location?: string;
  bullets?: string[];
}

export interface Project {
  name: string;
  description?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  bullets: string[];
  links?: string[];
}
