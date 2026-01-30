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
        
        @page {
            size: Letter;
            margin: 0.5in 0.75in;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.25;
            color: #000;
            background: white;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 14px;
        }
        
        .name {
            font-size: 15pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .contact-info {
            font-size: 10pt;
            margin-bottom: 2px;
        }
        
        .links {
            font-size: 10pt;
        }
        
        .section {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        
        .section-header {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 4px;
            border-bottom: 1px solid #000;
            padding-bottom: 1px;
            page-break-after: avoid;
        }
        
        .entry {
            margin-bottom: 8px;
            page-break-inside: avoid;
        }
        
        .entry-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 1px;
            font-size: 11pt;
        }
        
        .entry-title {
            margin-bottom: 2px;
            font-size: 11pt;
        }
        
        .bullets {
            margin-left: 18px;
            margin-top: 2px;
            padding-left: 0;
        }
        
        .bullets li {
            margin-bottom: 2px;
            line-height: 1.2;
            font-size: 11pt;
        }
        
        .tech-stack {
            font-style: italic;
            margin-bottom: 2px;
            font-size: 10pt;
        }
        
        .project-links {
            font-size: 9pt;
            margin-top: 2px;
            margin-left: 18px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            .section {
                page-break-inside: avoid;
            }
            .entry {
                page-break-inside: avoid;
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
    
    ${resume.publications && resume.publications.length > 0 ? this.generatePublicationsSection(resume) : ''}
    
    ${resume.patents && resume.patents.length > 0 ? this.generatePatentsSection(resume) : ''}
    
    ${resume.certifications && resume.certifications.length > 0 ? this.generateCertificationsSection(resume) : ''}
    
    ${resume.awards && resume.awards.length > 0 ? this.generateAwardsSection(resume) : ''}
    
    ${resume.volunteer && resume.volunteer.length > 0 ? this.generateVolunteerSection(resume) : ''}
    
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

  private static generatePublicationsSection(resume: Resume): string {
    if (!resume.publications) return '';
    
    return `
    <div class="section">
        <div class="section-header">Publications</div>
        ${resume.publications
          .map(
            (pub) => `
        <div class="entry">
            <div style="margin-bottom: 2px;">
                ${pub.authors} "${pub.title}," <em>${pub.venue}</em>, ${pub.date}.
            </div>
            ${pub.doi ? `<div style="font-size: 10pt; margin-left: 10px;">DOI: ${pub.doi}</div>` : ''}
            ${pub.link ? `<div style="font-size: 10pt; margin-left: 10px;">Link: ${pub.link}</div>` : ''}
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }

  private static generatePatentsSection(resume: Resume): string {
    if (!resume.patents) return '';
    
    return `
    <div class="section">
        <div class="section-header">Patents</div>
        ${resume.patents
          .map(
            (patent) => `
        <div class="entry">
            <div class="entry-header">
                <span>${patent.title}</span>
                <span>${patent.patentNumber} | ${patent.status}</span>
            </div>
            <div style="margin-left: 10px; font-size: 10pt;">Filed/Granted: ${patent.date}</div>
            ${patent.inventors ? `<div style="margin-left: 10px; font-size: 10pt;">Inventors: ${patent.inventors}</div>` : ''}
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }

  private static generateCertificationsSection(resume: Resume): string {
    if (!resume.certifications) return '';
    
    return `
    <div class="section">
        <div class="section-header">Certifications</div>
        ${resume.certifications
          .map(
            (cert) => `
        <div class="entry">
            <div class="entry-header">
                <span>${cert.name} - ${cert.issuer}</span>
                <span>${cert.date}</span>
            </div>
            ${cert.expiryDate ? `<div style="margin-left: 10px; font-size: 10pt;">Expires: ${cert.expiryDate}</div>` : ''}
            ${cert.credentialId ? `<div style="margin-left: 10px; font-size: 10pt;">Credential ID: ${cert.credentialId}</div>` : ''}
            ${cert.link ? `<div style="margin-left: 10px; font-size: 10pt;">Verify: ${cert.link}</div>` : ''}
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }

  private static generateAwardsSection(resume: Resume): string {
    if (!resume.awards) return '';
    
    return `
    <div class="section">
        <div class="section-header">Awards & Honors</div>
        ${resume.awards
          .map(
            (award) => `
        <div class="entry">
            <div class="entry-header">
                <span>${award.title} - ${award.issuer}</span>
                <span>${award.date}</span>
            </div>
            ${award.description ? `<div style="margin-left: 10px;">${award.description}</div>` : ''}
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }

  private static generateVolunteerSection(resume: Resume): string {
    if (!resume.volunteer) return '';
    
    return `
    <div class="section">
        <div class="section-header">Volunteer Experience</div>
        ${resume.volunteer
          .map(
            (vol) => `
        <div class="entry">
            <div class="entry-header">
                <span>${vol.organization} | ${vol.role}</span>
                <span>${vol.startDate}${vol.endDate ? ` – ${vol.endDate}` : ''}</span>
            </div>
            ${
              vol.bullets && vol.bullets.length > 0
                ? `<ul class="bullets">
                ${vol.bullets.map((bullet) => (bullet.trim() ? `<li>${bullet.trim()}</li>` : '')).join('\n                ')}
            </ul>`
                : ''
            }
        </div>
        `
          )
          .join('')}
    </div>
    `;
  }
}
