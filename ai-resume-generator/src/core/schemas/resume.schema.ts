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
