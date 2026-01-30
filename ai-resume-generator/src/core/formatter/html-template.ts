import { Resume } from '../schemas/resume.schema';

/**
 * Generate HTML template for Harvard-style resume
 * Used for PDF generation
 */
export class HTMLResumeTemplate {
  static generate(resume: Resume): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.personal.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            background: white;
            padding: 0.75in 0.75in;
            max-width: 8.5in;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .name {
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .contact-info {
            font-size: 10pt;
            margin-bottom: 3px;
        }
        
        .links {
            font-size: 10pt;
        }
        
        .section {
            margin-bottom: 18px;
        }
        
        .section-header {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }
        
        .entry {
            margin-bottom: 12px;
        }
        
        .entry-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .entry-title {
            margin-bottom: 3px;
        }
        
        .bullets {
            margin-left: 20px;
            margin-top: 3px;
        }
        
        .bullets li {
            margin-bottom: 3px;
            line-height: 1.3;
        }
        
        .tech-stack {
            font-style: italic;
            margin-bottom: 3px;
            font-size: 10pt;
        }
        
        .project-links {
            font-size: 10pt;
            margin-top: 3px;
            margin-left: 20px;
        }
        
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${resume.personal.name}</div>
        <div class="contact-info">
            ${[resume.personal.email, resume.personal.phone, resume.personal.location]
              .filter(Boolean)
              .join(' | ')}
        </div>
        ${
          resume.personal.links && resume.personal.links.length > 0
            ? `<div class="links">${resume.personal.links.join(' | ')}</div>`
            : ''
        }
    </div>
    
    ${this.generateEducationSection(resume)}
    
    ${this.generateExperienceSection(resume)}
    
    ${resume.projects && resume.projects.length > 0 ? this.generateProjectsSection(resume) : ''}
    
    ${this.generateSkillsSection(resume)}
</body>
</html>
    `.trim();
  }

  private static generateEducationSection(resume: Resume): string {
    return `
    <div class="section">
        <div class="section-header">Education</div>
        ${resume.education
          .map(
            (edu) => `
        <div class="entry">
            <div class="entry-header">
                <span>${edu.institution}${edu.location ? `, ${edu.location}` : ''}</span>
                <span>${edu.graduationDate}</span>
            </div>
            <div class="entry-title">
                ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
            </div>
            ${
              edu.bullets && edu.bullets.length > 0
                ? `
            <ul class="bullets">
                ${edu.bullets.map((bullet) => `<li>${bullet}</li>`).join('\n                ')}
            </ul>
            `
                : ''
            }
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }

  private static generateExperienceSection(resume: Resume): string {
    return `
    <div class="section">
        <div class="section-header">Experience</div>
        ${resume.experience
          .map(
            (exp) => `
        <div class="entry">
            <div class="entry-header">
                <span>${exp.company}</span>
                <span>${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ' – Present'}</span>
            </div>
            <div class="entry-title">${exp.role}</div>
            <ul class="bullets">
                ${exp.bullets.map((bullet) => `<li>${bullet}</li>`).join('\n                ')}
            </ul>
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }

  private static generateProjectsSection(resume: Resume): string {
    if (!resume.projects || resume.projects.length === 0) return '';

    return `
    <div class="section">
        <div class="section-header">Projects</div>
        ${resume.projects
          .map(
            (proj) => `
        <div class="entry">
            <div class="entry-header">
                <span>${proj.name}</span>
                ${
                  proj.startDate
                    ? `<span>${proj.startDate}${proj.endDate ? ` – ${proj.endDate}` : ' – Present'}</span>`
                    : ''
                }
            </div>
            ${
              proj.technologies && proj.technologies.length > 0
                ? `<div class="tech-stack">Technologies: ${proj.technologies.join(', ')}</div>`
                : ''
            }
            <ul class="bullets">
                ${proj.bullets.map((bullet) => `<li>${bullet}</li>`).join('\n                ')}
            </ul>
            ${
              proj.links && proj.links.length > 0
                ? `<div class="project-links">Links: ${proj.links.join(', ')}</div>`
                : ''
            }
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }

  private static generateSkillsSection(resume: Resume): string {
    return `
    <div class="section">
        <div class="section-header">Skills</div>
        ${resume.skills.map((skill) => `<div style="margin-bottom: 3px;">${skill}</div>`).join('\n        ')}
    </div>
    `;
  }
}
