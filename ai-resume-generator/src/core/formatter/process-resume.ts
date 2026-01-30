import { HarvardFormatter } from './harvard-formatter';
import { ResumeExporter } from './resume-exporter';
import { Resume } from '../schemas/resume.schema';
import sampleData from '../resume/sample-data.json';

/**
 * Demo script to test the Harvard formatter
 * Processes sample resume data and outputs formatted text
 */

export function processResumeData(): string {
  // Cast the imported JSON to Resume type
  const resume = sampleData as Resume;
  
  // Format using Harvard formatter
  const formattedResume = HarvardFormatter.format(resume);
  
  return formattedResume;
}

export function exportSampleResume(): string {
  const resume = sampleData as Resume;
  const outputPath = ResumeExporter.exportAsText(resume, 'alex-johnson-resume.txt');
  return outputPath;
}

// If running directly (for testing)
if (require.main === module) {
  console.log('Processing sample resume data...\n');
  console.log('='.repeat(100));
  console.log(processResumeData());
  console.log('='.repeat(100));
  console.log('\nResume formatted successfully!');
  
  // Export to file
  const outputPath = exportSampleResume();
  console.log(`\nResume exported to: ${outputPath}`);
}
