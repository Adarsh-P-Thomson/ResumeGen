# Multi-Format Resume Output Documentation

## Overview

The AI Resume Generator now supports **multiple output formats** with user choice:
- **TXT** - Plain text (ATS-friendly)
- **HTML** - Web preview
- **PDF** - Professional document (most common)
- **DOCX** - Microsoft Word format (editable)

---

## ✅ What's New

### 1. **PDF Generation** (Puppeteer)
- Harvard-style layout preserved
- Print-ready formatting
- ATS-compatible (searchable text)
- Standard Letter size (8.5" x 11")
- Professional Times New Roman font

### 2. **DOCX Generation** (docx library)
- Microsoft Word compatible
- Editable format
- Same Harvard layout
- Preserves all sections and formatting

### 3. **HTML Template**
- Clean, semantic markup
- CSS styling for professional appearance
- Can be used for web preview
- Source for PDF generation

### 4. **Multi-Format API**
- Single endpoint handles all formats
- User specifies output format
- Optional file export or in-memory processing

---

## 📂 New Files

### Core Components

1. [html-template.ts](src/core/formatter/html-template.ts)
   - Generates HTML from Resume data
   - Harvard-style CSS included
   - Clean, semantic structure

2. [pdf-generator.ts](src/core/formatter/pdf-generator.ts)
   - Uses Puppeteer for PDF rendering
   - Configurable page size and margins
   - Includes HTML preview/debug functions

3. [docx-generator.ts](src/core/formatter/docx-generator.ts)
   - Uses `docx` library
   - Word-compatible output
   - Same layout as other formats

4. [test-all-formats.ts](src/core/resume/test-all-formats.ts)
   - CLI test for all formats
   - Generates sample resume in all formats

---

## 🚀 Usage

### CLI Testing

```bash
# Generate all formats
npm run test:all-formats

# Output:
# - output/alex-johnson-resume.txt
# - output/alex-johnson-resume.html
# - output/alex-johnson-resume.pdf
# - output/alex-johnson-resume.docx
```

### Programmatic Usage

```typescript
import { exportResume, type OutputFormat } from '@/core';

// Generate PDF
await exportResume(resumeData, 'pdf', 'john-doe-resume.pdf');

// Generate DOCX
await exportResume(resumeData, 'docx', 'john-doe-resume.docx');

// Generate HTML
await exportResume(resumeData, 'html', 'john-doe-resume.html');

// Generate TXT (default)
await exportResume(resumeData, 'txt', 'john-doe-resume.txt');
```

### API Endpoint

#### Request Format

```bash
POST /api/resume
Content-Type: application/json

{
  "resumeData": {
    "personal": { ... },
    "education": [ ... ],
    "experience": [ ... ],
    "projects": [ ... ],
    "skills": [ ... ]
  },
  "format": "pdf",           // "txt" | "pdf" | "docx" | "html"
  "exportFile": true,        // Optional: export to file
  "filename": "resume.pdf"   // Optional: custom filename
}
```

#### Response - Preview Mode (exportFile: false)

```json
{
  "success": true,
  "formattedResume": "...",
  "metadata": {
    "characterCount": 4076,
    "lineCount": 67,
    "sectionCount": 4,
    "format": "txt"
  }
}
```

#### Response - Export Mode (exportFile: true)

For PDF/DOCX:
- Returns binary file as download
- Content-Type: application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document

For TXT/HTML:
```json
{
  "success": true,
  "filePath": "output/resume.txt",
  "format": "txt"
}
```

---

## 📋 Format Comparison

| Format | Use Case | Editable | ATS-Friendly | File Size |
|--------|----------|----------|--------------|-----------|
| **TXT** | Maximum ATS compatibility | ✅ | ✅✅✅ | ~4 KB |
| **HTML** | Web preview, debugging | ✅ | ⚠️ | ~7 KB |
| **PDF** | Professional submission | ❌ | ✅✅ | ~110 KB |
| **DOCX** | Editable resume | ✅ | ✅ | ~9 KB |

### When to Use Each Format

**TXT (Plain Text)**
- Job portals that only accept text
- Maximum ATS compatibility
- Email body content
- Quick previews

**HTML**
- Web portfolio display
- Email signatures with formatting
- Debugging layout issues
- Preview before PDF generation

**PDF (Recommended for Most Cases)**
- Email attachments
- Professional submissions
- Company career portals
- LinkedIn document uploads
- Print-ready format

**DOCX (Word Document)**
- When recruiter wants editable format
- Internal company submissions
- Templates for multiple versions
- Further customization needed

---

## 🎨 Harvard Format Consistency

All formats maintain the same Harvard-style layout:

```
                    NAME (CENTERED, BOLD)
              Contact Info (centered)
              Links (centered)

SECTION HEADER (Bold, Uppercase, Underlined)
Company/Institution                        Dates
Role/Degree
  • Achievement bullet with metrics
  • Another achievement with impact
```

### Layout Specifications

**Common Across All Formats:**
- Font: Times New Roman (or equivalent serif)
- Font Size: 11pt body, 12pt headers, 16pt name
- Margins: 0.75" sides, 0.5" top/bottom
- Line Spacing: 1.3-1.4
- Section Spacing: Consistent gaps
- Bullet Style: Simple bullets (•)

---

## 🔧 Technical Details

### PDF Generation Pipeline

```
Resume Data (JSON)
      ↓
HTMLResumeTemplate.generate()
      ↓
HTML String with CSS
      ↓
Puppeteer Browser
      ↓
PDF File (Letter size)
```

**Puppeteer Configuration:**
- Headless mode
- No sandbox (for deployment)
- Network idle wait
- Print background enabled

### DOCX Generation Pipeline

```
Resume Data (JSON)
      ↓
DOCXGenerator.generateDOCX()
      ↓
Document object (docx library)
      ↓
Sections, Paragraphs, TextRuns
      ↓
Binary Buffer
      ↓
DOCX File
```

**DOCX Features Used:**
- Tab stops for two-column layout
- Bold/italic text runs
- Border for section headers
- Proper spacing controls

---

## 📦 Dependencies

```json
{
  "puppeteer": "^24.36.1",  // PDF generation
  "docx": "^9.5.1"          // DOCX generation
}
```

---

## 🧪 Testing

### Test Individual Format

```typescript
import { exportResume } from '@/core';
import sampleData from './sample-data.json';

const result = await exportResume(sampleData, 'pdf', 'test.pdf');
console.log(result.filePath); // output/test.pdf
```

### Test All Formats

```bash
npm run test:all-formats
```

**Output:**
```
Generating TXT format...
✓ Success: output\alex-johnson-resume.txt

Generating HTML format...
✓ Success: output\alex-johnson-resume.html

Generating PDF format...
✓ Success: output\alex-johnson-resume.pdf

Generating DOCX format...
✓ Success: output\alex-johnson-resume.docx
```

---

## 🚨 Error Handling

All format generators include proper error handling:

```typescript
try {
  const result = await exportResume(data, 'pdf');
  if (result.success) {
    console.log(`Saved to: ${result.filePath}`);
  } else {
    console.error(`Error: ${result.error}`);
  }
} catch (error) {
  console.error('Fatal error:', error);
}
```

---

## 🔐 API Security Considerations

1. **File Size Limits**: Consider adding max file size checks
2. **Rate Limiting**: Implement rate limiting for PDF generation
3. **Filename Validation**: Sanitize user-provided filenames
4. **Temporary File Cleanup**: Clean up generated files periodically

---

## 🎯 Example: Full API Usage

```typescript
// Client-side request
const response = await fetch('/api/resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resumeData: {
      personal: {
        name: "John Doe",
        email: "john@example.com",
        // ... rest of data
      },
      // ... education, experience, etc.
    },
    format: 'pdf',
    exportFile: true,
    filename: 'john-doe-resume.pdf'
  })
});

// For PDF/DOCX, response is a file blob
if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'john-doe-resume.pdf';
  a.click();
}
```

---

## 📝 Summary

✅ **4 output formats supported**  
✅ **Harvard format preserved across all**  
✅ **API endpoint with format selection**  
✅ **File export or in-memory processing**  
✅ **Professional, ATS-friendly output**  
✅ **Comprehensive error handling**  
✅ **Full TypeScript support**  

---

## 🔜 Future Enhancements

- [ ] LaTeX format for academic resumes
- [ ] JSON export for data portability
- [ ] Markdown format for GitHub profiles
- [ ] Custom CSS themes (while maintaining Harvard base)
- [ ] Batch processing for multiple resumes
- [ ] Resume version comparison
