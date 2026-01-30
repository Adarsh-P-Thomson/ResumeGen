import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { HarvardFormatter } from './harvard-formatter';
import { Resume } from '../schemas/resume.schema';

/**
 * Export formatted resume to file
 */
export class ResumeExporter {
  private static readonly OUTPUT_DIR = 'output';
  
  /**
   * Export resume as plain text file
   */
  static exportAsText(resume: Resume, filename: string = 'resume.txt'): string {
    const formatted = HarvardFormatter.format(resume);
    const outputPath = join(this.OUTPUT_DIR, filename);
    
    // Ensure output directory exists
    try {
      mkdirSync(this.OUTPUT_DIR, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
    
    // Write file
    writeFileSync(outputPath, formatted, 'utf-8');
    
    return outputPath;
  }
  
  /**
   * Get formatted resume as string (for API responses, etc.)
   */
  static getFormattedString(resume: Resume): string {
    return HarvardFormatter.format(resume);
  }
}
