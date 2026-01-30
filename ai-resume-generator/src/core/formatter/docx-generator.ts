import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  UnderlineType,
  convertInchesToTwip,
} from 'docx';
import { Resume, Experience, Education, Project } from '../schemas/resume.schema';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Packer } from 'docx';

/**
 * Generate DOCX (Word) resume
 */
export class DOCXGenerator {
  private static readonly OUTPUT_DIR = 'output';

  /**
   * Generate DOCX from resume data
   */
  static async generateDOCX(resume: Resume, filename: string = 'resume.docx'): Promise<string> {
    const outputPath = join(this.OUTPUT_DIR, filename);

    // Ensure output directory exists
    try {
      mkdirSync(this.OUTPUT_DIR, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.5),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.5),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children: [
            // Header
            ...this.createHeader(resume.personal),
            ...this.createSpacing(1),

            // Education
            ...this.createSectionHeader('EDUCATION'),
            ...this.createEducationSection(resume.education),
            ...this.createSpacing(1),

            // Experience
            ...this.createSectionHeader('EXPERIENCE'),
            ...this.createExperienceSection(resume.experience),
            ...this.createSpacing(1),

            // Projects (if any)
            ...(resume.projects && resume.projects.length > 0
              ? [
                  ...this.createSectionHeader('PROJECTS'),
                  ...this.createProjectsSection(resume.projects),
                  ...this.createSpacing(1),
                ]
              : []),

            // Publications (if any)
            ...(resume.publications && resume.publications.length > 0
              ? [
                  ...this.createSectionHeader('PUBLICATIONS'),
                  ...this.createPublicationsSection(resume.publications),
                  ...this.createSpacing(1),
                ]
              : []),

            // Patents (if any)
            ...(resume.patents && resume.patents.length > 0
              ? [
                  ...this.createSectionHeader('PATENTS'),
                  ...this.createPatentsSection(resume.patents),
                  ...this.createSpacing(1),
                ]
              : []),

            // Certifications (if any)
            ...(resume.certifications && resume.certifications.length > 0
              ? [
                  ...this.createSectionHeader('CERTIFICATIONS'),
                  ...this.createCertificationsSection(resume.certifications),
                  ...this.createSpacing(1),
                ]
              : []),

            // Awards (if any)
            ...(resume.awards && resume.awards.length > 0
              ? [
                  ...this.createSectionHeader('AWARDS & HONORS'),
                  ...this.createAwardsSection(resume.awards),
                  ...this.createSpacing(1),
                ]
              : []),

            // Volunteer (if any)
            ...(resume.volunteer && resume.volunteer.length > 0
              ? [
                  ...this.createSectionHeader('VOLUNTEER EXPERIENCE'),
                  ...this.createVolunteerSection(resume.volunteer),
                  ...this.createSpacing(1),
                ]
              : []),

            // Skills
            ...this.createSectionHeader('SKILLS'),
            ...this.createSkillsSection(resume.skills),
          ],
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Write to file
    writeFileSync(outputPath, buffer);

    return outputPath;
  }

  /**
   * Create header section
   */
  private static createHeader(personal: Resume['personal']): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Name
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: personal.name.toUpperCase(),
            bold: true,
            size: 28,
          }),
        ],
      })
    );

    // Contact info
    const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactParts.join(' | '),
            size: 20,
          }),
        ],
      })
    );

    // Links
    if (personal.links && personal.links.length > 0) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: personal.links.join(' | '),
              size: 20,
            }),
          ],
        })
      );
    }

    return paragraphs;
  }

  /**
   * Create section header
   */
  private static createSectionHeader(title: string): Paragraph[] {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 24,
          }),
        ],
        spacing: {
          before: 200,
          after: 100,
        },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: 'single',
            size: 6,
          },
        },
      }),
    ];
  }

  /**
   * Create education section
   */
  private static createEducationSection(education: Education[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    education.forEach((edu, index) => {
      // Institution and date
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.institution}${edu.location ? `, ${edu.location}` : ''}`,
              bold: true,
            }),
            new TextRun({
              text: '\t' + edu.graduationDate,
              bold: true,
            }),
          ],
          tabStops: [
            {
              type: 'right',
              position: 9000,
            },
          ],
        })
      );

      // Degree info
      const degreeInfo = [edu.degree];
      if (edu.field) degreeInfo.push(`in ${edu.field}`);
      if (edu.gpa) degreeInfo.push(`• GPA: ${edu.gpa}`);

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: degreeInfo.join(' '),
            }),
          ],
        })
      );

      // Bullets
      if (edu.bullets && edu.bullets.length > 0) {
        edu.bullets.forEach((bullet) => {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `  • ${bullet}`,
                }),
              ],
            })
          );
        });
      }

      // Spacing between entries
      if (index < education.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });

    return paragraphs;
  }

  /**
   * Create experience section
   */
  private static createExperienceSection(experience: Experience[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    experience.forEach((exp, index) => {
      // Company and dates
      const dateRange = exp.endDate ? `${exp.startDate} – ${exp.endDate}` : `${exp.startDate} – Present`;

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.company,
              bold: true,
            }),
            new TextRun({
              text: '\t' + dateRange,
              bold: true,
            }),
          ],
          tabStops: [
            {
              type: 'right',
              position: 9000,
            },
          ],
        })
      );

      // Role
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.role,
            }),
          ],
        })
      );

      // Bullets
      exp.bullets.forEach((bullet) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  • ${bullet}`,
              }),
            ],
          })
        );
      });

      // Spacing between entries
      if (index < experience.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });

    return paragraphs;
  }

  /**
   * Create projects section
   */
  private static createProjectsSection(projects: Project[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    projects.forEach((proj, index) => {
      // Project name and dates
      if (proj.startDate) {
        const dateRange = proj.endDate ? `${proj.startDate} – ${proj.endDate}` : `${proj.startDate} – Present`;

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.name,
                bold: true,
              }),
              new TextRun({
                text: '\t' + dateRange,
                bold: true,
              }),
            ],
            tabStops: [
              {
                type: 'right',
                position: 9000,
              },
            ],
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.name,
                bold: true,
              }),
            ],
          })
        );
      }

      // Technologies
      if (proj.technologies && proj.technologies.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Technologies: ${proj.technologies.join(', ')}`,
                italics: true,
                size: 20,
              }),
            ],
          })
        );
      }

      // Bullets
      proj.bullets.forEach((bullet) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  • ${bullet}`,
              }),
            ],
          })
        );
      });

      // Links
      if (proj.links && proj.links.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  Links: ${proj.links.join(', ')}`,
                size: 20,
              }),
            ],
          })
        );
      }

      // Spacing between entries
      if (index < projects.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });

    return paragraphs;
  }

  /**
   * Create skills section
   */
  private static createSkillsSection(skills: string[]): Paragraph[] {
    return skills.map(
      (skill) =>
        new Paragraph({
          children: [
            new TextRun({
              text: skill,
            }),
          ],
        })
    );
  }

  /**
   * Create publications section
   */
  private static createPublicationsSection(publications: Resume['publications']): Paragraph[] {
    if (!publications) return [];
    
    const paragraphs: Paragraph[] = [];
    
    publications.forEach((pub, index) => {
      // Citation line
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${pub.authors} "${pub.title}," ${pub.venue}, ${pub.date}.`,
            }),
          ],
        })
      );
      
      // DOI
      if (pub.doi) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  DOI: ${pub.doi}`,
                size: 20,
              }),
            ],
          })
        );
      }
      
      // Link
      if (pub.link) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  Link: ${pub.link}`,
                size: 20,
              }),
            ],
          })
        );
      }
      
      if (index < publications.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });
    
    return paragraphs;
  }

  /**
   * Create patents section
   */
  private static createPatentsSection(patents: Resume['patents']): Paragraph[] {
    if (!patents) return [];
    
    const paragraphs: Paragraph[] = [];
    
    patents.forEach((patent, index) => {
      // Title and number
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: patent.title,
              bold: true,
            }),
            new TextRun({
              text: ` | ${patent.patentNumber} | ${patent.status}`,
            }),
          ],
        })
      );
      
      // Date
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `  Filed/Granted: ${patent.date}`,
              size: 20,
            }),
          ],
        })
      );
      
      // Inventors
      if (patent.inventors) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  Inventors: ${patent.inventors}`,
                size: 20,
              }),
            ],
          })
        );
      }
      
      if (index < patents.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });
    
    return paragraphs;
  }

  /**
   * Create certifications section
   */
  private static createCertificationsSection(certifications: Resume['certifications']): Paragraph[] {
    if (!certifications) return [];
    
    const paragraphs: Paragraph[] = [];
    
    certifications.forEach((cert, index) => {
      // Name and issuer
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${cert.name} - ${cert.issuer}`,
              bold: true,
            }),
            new TextRun({
              text: ` | ${cert.date}`,
            }),
          ],
        })
      );
      
      // Expiry
      if (cert.expiryDate) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  Expires: ${cert.expiryDate}`,
                size: 20,
              }),
            ],
          })
        );
      }
      
      // Credential ID
      if (cert.credentialId) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  Credential ID: ${cert.credentialId}`,
                size: 20,
              }),
            ],
          })
        );
      }
      
      // Link
      if (cert.link) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  Verify: ${cert.link}`,
                size: 20,
              }),
            ],
          })
        );
      }
      
      if (index < certifications.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });
    
    return paragraphs;
  }

  /**
   * Create awards section
   */
  private static createAwardsSection(awards: Resume['awards']): Paragraph[] {
    if (!awards) return [];
    
    const paragraphs: Paragraph[] = [];
    
    awards.forEach((award, index) => {
      // Title and issuer
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${award.title} - ${award.issuer}`,
              bold: true,
            }),
            new TextRun({
              text: ` | ${award.date}`,
            }),
          ],
        })
      );
      
      // Description
      if (award.description) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  ${award.description}`,
              }),
            ],
          })
        );
      }
      
      if (index < awards.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });
    
    return paragraphs;
  }

  /**
   * Create volunteer section
   */
  private static createVolunteerSection(volunteer: Resume['volunteer']): Paragraph[] {
    if (!volunteer) return [];
    
    const paragraphs: Paragraph[] = [];
    
    volunteer.forEach((vol, index) => {
      // Organization and role
      const dateRange = vol.endDate ? `${vol.startDate} – ${vol.endDate}` : vol.startDate;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${vol.organization} | ${vol.role}`,
              bold: true,
            }),
            new TextRun({
              text: ` | ${dateRange}`,
            }),
          ],
        })
      );
      
      // Bullets
      if (vol.bullets && vol.bullets.length > 0) {
        vol.bullets.forEach((bullet) => {
          if (bullet.trim()) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `  • ${bullet.trim()}`,
                  }),
                ],
              })
            );
          }
        });
      }
      
      if (index < volunteer.length - 1) {
        paragraphs.push(...this.createSpacing(1));
      }
    });
    
    return paragraphs;
  }

  /**
   * Create spacing
   */
  private static createSpacing(lines: number): Paragraph[] {
    return Array(lines)
      .fill(null)
      .map(() => new Paragraph({ children: [] }));
  }
}
