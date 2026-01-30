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
