import puppeteer from 'puppeteer';
import { Resume } from '../schemas/resume.schema';
import { HTMLResumeTemplate } from './html-template';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Generate PDF resume using Puppeteer
 */
export class PDFGenerator {
  private static readonly OUTPUT_DIR = 'output';

  /**
   * Generate PDF from resume data
   */
  static async generatePDF(resume: Resume, filename: string = 'resume.pdf'): Promise<string> {
    const outputPath = join(this.OUTPUT_DIR, filename);

    // Ensure output directory exists
    try {
      mkdirSync(this.OUTPUT_DIR, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Generate HTML
    const html = HTMLResumeTemplate.generate(resume);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF
      await page.pdf({
        path: outputPath,
        format: 'Letter',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.75in',
          bottom: '0.5in',
          left: '0.75in',
        },
      });

      return outputPath;
    } finally {
      await browser.close();
    }
  }

  /**
   * Get HTML preview (useful for debugging)
   */
  static getHTMLPreview(resume: Resume): string {
    return HTMLResumeTemplate.generate(resume);
  }

  /**
   * Save HTML to file (for debugging)
   */
  static saveHTML(resume: Resume, filename: string = 'resume.html'): string {
    const outputPath = join(this.OUTPUT_DIR, filename);
    const html = HTMLResumeTemplate.generate(resume);

    try {
      mkdirSync(this.OUTPUT_DIR, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    writeFileSync(outputPath, html, 'utf-8');
    return outputPath;
  }
}
