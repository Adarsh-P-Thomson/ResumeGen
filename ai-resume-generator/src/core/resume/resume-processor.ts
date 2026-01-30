import { Resume } from '../schemas/resume.schema';
import { HarvardFormatter } from '../formatter/harvard-formatter';
import { ResumeExporter } from '../formatter/resume-exporter';
import { PDFGenerator } from '../formatter/pdf-generator';
import { DOCXGenerator } from '../formatter/docx-generator';

/**
 * Main API for resume processing
 * This will be used by the Next.js app and API routes
 */

export type OutputFormat = 'txt' | 'pdf' | 'docx' | 'html';

export interface ProcessResumeResult {
  success: boolean;
  formattedResume?: string;
  filePath?: string;
  metadata: {
    characterCount: number;
    lineCount: number;
    sectionCount: number;
    format: OutputFormat;
  };
  error?: string;
}

export interface ExportResumeResult {
  success: boolean;
  filePath?: string;
  format?: OutputFormat;
  error?: string;
}

/**
 * Process resume data and return formatted result
 */
export function processResume(
  resumeData: Resume,
  format: OutputFormat = 'txt'
): ProcessResumeResult {
  try {
    const formatted = HarvardFormatter.format(resumeData);
    const lines = formatted.split('\n');
    
    // Count sections (EDUCATION, EXPERIENCE, PROJECTS, SKILLS)
    const sectionCount = (formatted.match(/^[A-Z\s]+$/gm) || []).length;
    
    return {
      success: true,
      formattedResume: formatted,
      metadata: {
        characterCount: formatted.length,
        lineCount: lines.length,
        sectionCount: sectionCount,
        format,
      },
    };
  } catch (error) {
    return {
      success: false,
      metadata: {
        characterCount: 0,
        lineCount: 0,
        sectionCount: 0,
        format,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export resume to file in specified format
 */
export async function exportResume(
  resumeData: Resume,
  format: OutputFormat = 'txt',
  filename?: string
): Promise<ExportResumeResult> {
  try {
    let filePath: string;
    const defaultFilename = filename || `resume-${Date.now()}`;

    switch (format) {
      case 'pdf':
        filePath = await PDFGenerator.generatePDF(
          resumeData,
          filename || `${defaultFilename}.pdf`
        );
        break;

      case 'docx':
        filePath = await DOCXGenerator.generateDOCX(
          resumeData,
          filename || `${defaultFilename}.docx`
        );
        break;

      case 'html':
        filePath = PDFGenerator.saveHTML(resumeData, filename || `${defaultFilename}.html`);
        break;

      case 'txt':
      default:
        filePath = ResumeExporter.exportAsText(resumeData, filename || `${defaultFilename}.txt`);
        break;
    }

    return {
      success: true,
      filePath,
      format,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      format,
    };
  }
}

/**
 * Validate resume data structure
 */
export function validateResumeData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.personal) errors.push('Missing personal information');
  if (!data.personal?.name) errors.push('Missing name');
  if (!data.personal?.email) errors.push('Missing email');
  if (!data.education || data.education.length === 0) {
    errors.push('Missing education section');
  }
  if (!data.experience || data.experience.length === 0) {
    errors.push('Missing experience section');
  }
  if (!data.skills || data.skills.length === 0) {
    errors.push('Missing skills');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
