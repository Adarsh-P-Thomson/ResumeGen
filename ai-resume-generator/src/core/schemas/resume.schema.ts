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
  publications?: Publication[];
  patents?: Patent[];
  certifications?: Certification[];
  awards?: Award[];
  volunteer?: Volunteer[];
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

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  date: string;
  doi?: string;
  link?: string;
}

export interface Patent {
  title: string;
  patentNumber: string;
  date: string;
  status: string;
  inventors?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Volunteer {
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  bullets?: string[];
}
