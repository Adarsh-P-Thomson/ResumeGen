import { exportResume, type OutputFormat } from './resume-processor';
import { Resume } from '../schemas/resume.schema';
import sampleData from './sample-data.json';

/**
 * Test script to generate resumes in all formats
 */

async function testAllFormats() {
  const resume = sampleData as Resume;
  const formats: OutputFormat[] = ['txt', 'html', 'pdf', 'docx'];
  
  console.log('Generating resumes in all formats...\n');
  console.log('='.repeat(80));
  
  for (const format of formats) {
    try {
      console.log(`\nGenerating ${format.toUpperCase()} format...`);
      
      const result = await exportResume(
        resume,
        format,
        `alex-johnson-resume.${format}`
      );
      
      if (result.success) {
        console.log(`✓ Success: ${result.filePath}`);
      } else {
        console.log(`✗ Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\nAll formats generated! Check the output/ directory.');
  console.log('\nGenerated files:');
  console.log('  - output/alex-johnson-resume.txt   (Plain text)');
  console.log('  - output/alex-johnson-resume.html  (HTML preview)');
  console.log('  - output/alex-johnson-resume.pdf   (PDF document)');
  console.log('  - output/alex-johnson-resume.docx  (Word document)');
}

// Run if executed directly
if (require.main === module) {
  testAllFormats()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testAllFormats };
