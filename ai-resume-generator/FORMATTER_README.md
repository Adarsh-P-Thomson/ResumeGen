# Resume Data Parser & Harvard Formatter

## What We Built

This is the **data parsing and formatting core** of the AI Resume Generator. It takes structured resume data (simulating AI-processed input) and formats it into a clean, Harvard-style resume.

---

## Components

### 1. **Resume Schema** ([resume.schema.ts](src/core/schemas/resume.schema.ts))
TypeScript interfaces defining the structure of resume data:
- `Resume` - Complete resume structure
- `Experience` - Work experience entries
- `Education` - Educational background
- `Project` - Personal/professional projects
- Skills array

### 2. **Sample Data** ([sample-data.json](src/core/resume/sample-data.json))
Fake, AI-processed resume data representing what would come after:
- JD analysis
- Content rewriting
- Skill extraction
- Relevance scoring

This simulates the output from the AI processing layer.

### 3. **Harvard Formatter** ([harvard-formatter.ts](src/core/formatter/harvard-formatter.ts))
The core formatting engine that:
- Converts JSON resume data into Harvard format
- Creates clean, ATS-friendly layout
- Handles proper spacing and alignment
- Implements section headers (Education, Experience, Projects, Skills)
- Uses ASCII characters for professional appearance
- Produces deterministic output (same input = same output)

**Key Features:**
- Centered header with name and contact info
- Two-column layout (left-aligned + right-aligned dates)
- Bullet points for achievements
- Section separators
- 100-character line width (standard)

### 4. **Resume Exporter** ([resume-exporter.ts](src/core/formatter/resume-exporter.ts))
Handles output generation:
- Exports formatted resume as `.txt` file
- Creates `output/` directory automatically
- Provides string output for API responses

### 5. **Process Script** ([process-resume.ts](src/core/formatter/process-resume.ts))
Demo/test script that:
- Loads sample data
- Runs formatter
- Displays formatted resume
- Exports to file

---

## How to Use

### Run the Formatter
```bash
npm run test:formatter
```

This will:
1. Load sample resume data
2. Format it using Harvard style
3. Display the formatted resume in terminal
4. Export to `output/alex-johnson-resume.txt`

### Use Programmatically

```typescript
import { HarvardFormatter, ResumeExporter } from './core/formatter';
import { Resume } from './core/schemas/resume.schema';

// Your resume data (from AI processing, DB, etc.)
const resumeData: Resume = { /* ... */ };

// Get formatted string
const formatted = HarvardFormatter.format(resumeData);

// Or export to file
const outputPath = ResumeExporter.exportAsText(resumeData, 'my-resume.txt');
```

---

## Data Flow

```
Resume JSON Data
      ↓
HarvardFormatter.format()
      ↓
Formatted Text String
      ↓
ResumeExporter.exportAsText()
      ↓
output/resume.txt
```

---

## Sample Output Structure

```
                    FULL NAME
    email | phone | location
    linkedin | github | portfolio

EDUCATION
────────────────────────────────
University, Location              Date
Degree in Field GPA: X.XX/4.0
  • Relevant coursework...

EXPERIENCE
────────────────────────────────
Company Name                      Dates
Job Title
  • Achievement with metrics...
  • Achievement with metrics...

PROJECTS
────────────────────────────────
Project Name                      Dates
Technologies: Tech1, Tech2, Tech3
  • Impact-focused bullet...

SKILLS
────────────────────────────────
Category: Skill1, Skill2, Skill3
```

---

## What's Next

This is **Phase 1.1** of the project. The data parsing layer is complete.

**Next Steps:**
1. ✅ Resume data schema (DONE)
2. ✅ Harvard formatter (DONE)
3. ✅ Plain text export (DONE)
4. 🔲 HTML template for PDF generation
5. 🔲 PDF rendering engine
6. 🔲 JD parser
7. 🔲 AI content rewriting integration
8. 🔲 Recruiter message generator

---

## File Structure

```
src/
  core/
    schemas/
      resume.schema.ts        # TypeScript interfaces
    resume/
      sample-data.json        # Fake AI-processed data
    formatter/
      harvard-formatter.ts    # Core formatting logic
      resume-exporter.ts      # File export utility
      process-resume.ts       # Demo/test script
      index.ts               # Module exports
output/
  alex-johnson-resume.txt    # Generated resume file
```

---

## Design Principles

✅ **Deterministic** - Same input always produces same output  
✅ **Content-First** - No visual gimmicks  
✅ **ATS-Friendly** - Plain text, clear structure  
✅ **Recruiter-Grade** - Harvard business school format  
✅ **Modular** - Formatter is independent of data source  

---

## Testing

The sample data includes:
- Quantified achievements (metrics, percentages, money values)
- Action verbs (Architected, Led, Optimized, etc.)
- Technology keywords
- Clean professional formatting
- Role-relevant content

This represents what the AI layer should produce.

---

## Notes

- Currently outputs plain text
- PDF generation will use the same formatter with HTML wrapper
- The formatter is designed to be **format-locked** (no customization)
- All spacing and alignment follow Harvard resume standards
