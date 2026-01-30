import { Resume, Experience, Education, Project } from '../schemas/resume.schema';

/**
 * Harvard Resume Formatter
 * Converts structured resume data into Harvard-style formatted text
 * 
 * Rules:
 * - Clean, professional layout
 * - No visual embellishments
 * - ATS-friendly structure
 * - One page target
 */

export class HarvardFormatter {
  private static readonly LINE_LENGTH = 100;
  
  /**
   * Format complete resume
   */
  static format(resume: Resume): string {
    const sections: string[] = [];
    
    // Header
    sections.push(this.formatHeader(resume.personal));
    sections.push('');
    
    // Education
    sections.push(this.formatEducationSection(resume.education));
    sections.push('');
    
    // Experience
    sections.push(this.formatExperienceSection(resume.experience));
    sections.push('');
    
    // Projects (if any)
    if (resume.projects && resume.projects.length > 0) {
      sections.push(this.formatProjectsSection(resume.projects));
      sections.push('');
    }
    
    // Publications (if any)
    if (resume.publications && resume.publications.length > 0) {
      sections.push(this.formatPublicationsSection(resume.publications));
      sections.push('');
    }
    
    // Patents (if any)
    if (resume.patents && resume.patents.length > 0) {
      sections.push(this.formatPatentsSection(resume.patents));
      sections.push('');
    }
    
    // Certifications (if any)
    if (resume.certifications && resume.certifications.length > 0) {
      sections.push(this.formatCertificationsSection(resume.certifications));
      sections.push('');
    }
    
    // Awards (if any)
    if (resume.awards && resume.awards.length > 0) {
      sections.push(this.formatAwardsSection(resume.awards));
      sections.push('');
    }
    
    // Volunteer (if any)
    if (resume.volunteer && resume.volunteer.length > 0) {
      sections.push(this.formatVolunteerSection(resume.volunteer));
      sections.push('');
    }
    
    // Skills
    sections.push(this.formatSkillsSection(resume.skills));
    
    return sections.join('\n');
  }
  
  /**
   * Format header with personal information
   */
  private static formatHeader(personal: Resume['personal']): string {
    const lines: string[] = [];
    
    // Name (centered, bold conceptually)
    lines.push(this.center(personal.name.toUpperCase()));
    
    // Contact info (centered)
    const contactParts: string[] = [];
    if (personal.email) contactParts.push(personal.email);
    if (personal.phone) contactParts.push(personal.phone);
    if (personal.location) contactParts.push(personal.location);
    
    lines.push(this.center(contactParts.join(' | ')));
    
    // Links (centered)
    if (personal.links && personal.links.length > 0) {
      lines.push(this.center(personal.links.join(' | ')));
    }
    
    return lines.join('\n');
  }
  
  /**
   * Format education section
   */
  private static formatEducationSection(education: Education[]): string {
    const lines: string[] = [];
    lines.push(this.sectionHeader('EDUCATION'));
    lines.push(this.separator());
    
    education.forEach((edu, index) => {
      // Institution and date on same line
      const header = this.twoColumnLine(
        `${edu.institution}${edu.location ? `, ${edu.location}` : ''}`,
        edu.graduationDate
      );
      lines.push(header);
      
      // Degree info
      const degreeInfo: string[] = [edu.degree];
      if (edu.field) degreeInfo.push(`in ${edu.field}`);
      if (edu.gpa) degreeInfo.push(`GPA: ${edu.gpa}`);
      
      lines.push(degreeInfo.join(' '));
      
      // Bullets if any
      if (edu.bullets && edu.bullets.length > 0) {
        edu.bullets.forEach(bullet => {
          lines.push(`  • ${bullet}`);
        });
      }
      
      // Add space between education entries
      if (index < education.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format experience section
   */
  private static formatExperienceSection(experience: Experience[]): string {
    const lines: string[] = [];
    lines.push(this.sectionHeader('EXPERIENCE'));
    lines.push(this.separator());
    
    experience.forEach((exp, index) => {
      // Company and dates
      const dateRange = exp.endDate ? `${exp.startDate} – ${exp.endDate}` : `${exp.startDate} – Present`;
      lines.push(this.twoColumnLine(exp.company, dateRange));
      
      // Role
      lines.push(exp.role);
      
      // Bullets
      exp.bullets.forEach(bullet => {
        lines.push(`  • ${bullet}`);
      });
      
      // Add space between experience entries
      if (index < experience.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format projects section
   */
  private static formatProjectsSection(projects: Project[]): string {
    const lines: string[] = [];
    lines.push(this.sectionHeader('PROJECTS'));
    lines.push(this.separator());
    
    projects.forEach((project, index) => {
      // Project name and dates (if available)
      if (project.startDate) {
        const dateRange = project.endDate 
          ? `${project.startDate} – ${project.endDate}` 
          : `${project.startDate} – Present`;
        lines.push(this.twoColumnLine(project.name, dateRange));
      } else {
        lines.push(project.name);
      }
      
      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        lines.push(`Technologies: ${project.technologies.join(', ')}`);
      }
      
      // Bullets
      project.bullets.forEach(bullet => {
        lines.push(`  • ${bullet}`);
      });
      
      // Links
      if (project.links && project.links.length > 0) {
        lines.push(`  Links: ${project.links.join(', ')}`);
      }
      
      // Add space between project entries
      if (index < projects.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format skills section
   */
  private static formatSkillsSection(skills: string[]): string {
    const lines: string[] = [];
    lines.push(this.sectionHeader('SKILLS'));
    lines.push(this.separator());
    
    skills.forEach(skill => {
      lines.push(skill);
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format publications section
   */
  private static formatPublicationsSection(publications: Resume['publications']): string {
    if (!publications) return '';
    
    const lines: string[] = [];
    lines.push(this.sectionHeader('PUBLICATIONS'));
    lines.push(this.separator());
    
    publications.forEach((pub, index) => {
      // Authors, "Title," Venue, Date.
      const authorsPart = pub.authors;
      const titlePart = `"${pub.title},"`;
      const venuePart = pub.venue;
      const datePart = pub.date;
      
      lines.push(`${authorsPart} ${titlePart} ${venuePart}, ${datePart}.`);
      
      // Optional DOI
      if (pub.doi) {
        lines.push(`  DOI: ${pub.doi}`);
      }
      
      // Optional link
      if (pub.link) {
        lines.push(`  Link: ${pub.link}`);
      }
      
      if (index < publications.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format patents section
   */
  private static formatPatentsSection(patents: Resume['patents']): string {
    if (!patents) return '';
    
    const lines: string[] = [];
    lines.push(this.sectionHeader('PATENTS'));
    lines.push(this.separator());
    
    patents.forEach((patent, index) => {
      // Patent Title | Patent Number | Status
      lines.push(this.twoColumnLine(patent.title, `${patent.patentNumber} | ${patent.status}`));
      lines.push(`  Filed/Granted: ${patent.date}`);
      
      if (patent.inventors) {
        lines.push(`  Inventors: ${patent.inventors}`);
      }
      
      if (index < patents.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format certifications section
   */
  private static formatCertificationsSection(certifications: Resume['certifications']): string {
    if (!certifications) return '';
    
    const lines: string[] = [];
    lines.push(this.sectionHeader('CERTIFICATIONS'));
    lines.push(this.separator());
    
    certifications.forEach((cert, index) => {
      // Certification Name | Issuer
      lines.push(this.twoColumnLine(`${cert.name} - ${cert.issuer}`, cert.date));
      
      if (cert.expiryDate) {
        lines.push(`  Expires: ${cert.expiryDate}`);
      }
      
      if (cert.credentialId) {
        lines.push(`  Credential ID: ${cert.credentialId}`);
      }
      
      if (cert.link) {
        lines.push(`  Verify: ${cert.link}`);
      }
      
      if (index < certifications.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format awards section
   */
  private static formatAwardsSection(awards: Resume['awards']): string {
    if (!awards) return '';
    
    const lines: string[] = [];
    lines.push(this.sectionHeader('AWARDS & HONORS'));
    lines.push(this.separator());
    
    awards.forEach((award, index) => {
      // Award Title | Issuer | Date
      lines.push(this.twoColumnLine(`${award.title} - ${award.issuer}`, award.date));
      
      if (award.description) {
        lines.push(`  ${award.description}`);
      }
      
      if (index < awards.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Format volunteer section
   */
  private static formatVolunteerSection(volunteer: Resume['volunteer']): string {
    if (!volunteer) return '';
    
    const lines: string[] = [];
    lines.push(this.sectionHeader('VOLUNTEER EXPERIENCE'));
    lines.push(this.separator());
    
    volunteer.forEach((vol, index) => {
      // Organization | Role | Dates
      const dateRange = vol.endDate ? `${vol.startDate} – ${vol.endDate}` : vol.startDate;
      lines.push(this.twoColumnLine(`${vol.organization} | ${vol.role}`, dateRange));
      
      // Bullets
      if (vol.bullets && vol.bullets.length > 0) {
        vol.bullets.forEach(bullet => {
          if (bullet.trim()) {
            lines.push(`  • ${bullet.trim()}`);
          }
        });
      }
      
      if (index < volunteer.length - 1) {
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Helper: Create section header
   */
  private static sectionHeader(title: string): string {
    return title;
  }
  
  /**
   * Helper: Create separator line
   */
  private static separator(): string {
    return '─'.repeat(this.LINE_LENGTH);
  }
  
  /**
   * Helper: Center text
   */
  private static center(text: string): string {
    const padding = Math.max(0, Math.floor((this.LINE_LENGTH - text.length) / 2));
    return ' '.repeat(padding) + text;
  }
  
  /**
   * Helper: Create two-column line (left-aligned and right-aligned)
   */
  private static twoColumnLine(left: string, right: string): string {
    const spacing = Math.max(2, this.LINE_LENGTH - left.length - right.length);
    return left + ' '.repeat(spacing) + right;
  }
}
