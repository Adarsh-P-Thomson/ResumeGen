# API Usage Examples

## Endpoint

```
POST /api/resume
```

---

## Example 1: Get Plain Text Preview

```bash
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "personal": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1 (555) 123-4567",
        "location": "New York, NY",
        "links": ["linkedin.com/in/johndoe", "github.com/johndoe"]
      },
      "education": [{
        "institution": "MIT",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "graduationDate": "May 2020",
        "gpa": "3.9/4.0"
      }],
      "experience": [{
        "company": "Tech Company",
        "role": "Software Engineer",
        "startDate": "June 2020",
        "endDate": "Present",
        "bullets": [
          "Built scalable microservices serving 1M+ users",
          "Reduced API latency by 60% through optimization"
        ]
      }],
      "skills": [
        "Languages: Python, JavaScript, TypeScript",
        "Frameworks: React, Node.js, Django"
      ]
    },
    "format": "txt"
  }'
```

**Response:**
```json
{
  "success": true,
  "formattedResume": "                    JOHN DOE\n...",
  "metadata": {
    "characterCount": 1234,
    "lineCount": 45,
    "sectionCount": 4,
    "format": "txt"
  }
}
```

---

## Example 2: Generate and Download PDF

```bash
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": { /* same as above */ },
    "format": "pdf",
    "exportFile": true,
    "filename": "john-doe-resume.pdf"
  }' \
  --output john-doe-resume.pdf
```

**Response:** Binary PDF file download

---

## Example 3: Generate DOCX (Word Document)

```bash
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": { /* same as above */ },
    "format": "docx",
    "exportFile": true,
    "filename": "john-doe-resume.docx"
  }' \
  --output john-doe-resume.docx
```

**Response:** Binary DOCX file download

---

## Example 4: Generate HTML Preview

```bash
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": { /* same as above */ },
    "format": "html",
    "exportFile": true,
    "filename": "john-doe-resume.html"
  }'
```

**Response:**
```json
{
  "success": true,
  "filePath": "output/john-doe-resume.html",
  "format": "html"
}
```

---

## JavaScript/TypeScript Client Example

```typescript
async function generateResume(resumeData: any, format: 'txt' | 'pdf' | 'docx' | 'html') {
  const response = await fetch('/api/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resumeData,
      format,
      exportFile: true,
      filename: `resume.${format}`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  // For PDF/DOCX, download the file
  if (format === 'pdf' || format === 'docx') {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } else {
    // For TXT/HTML, get the file path
    const result = await response.json();
    console.log('File saved to:', result.filePath);
  }
}

// Usage
const resumeData = {
  personal: { /* ... */ },
  education: [ /* ... */ ],
  experience: [ /* ... */ ],
  skills: [ /* ... */ ],
};

// Generate PDF
await generateResume(resumeData, 'pdf');

// Generate DOCX
await generateResume(resumeData, 'docx');
```

---

## React Component Example

```tsx
'use client';

import { useState } from 'react';
import type { Resume } from '@/core';

export default function ResumeGenerator() {
  const [format, setFormat] = useState<'txt' | 'pdf' | 'docx' | 'html'>('pdf');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const resumeData: Resume = {
    // ... your resume data
  };

  const generateResume = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          format,
          exportFile: format === 'pdf' || format === 'docx',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      if (format === 'pdf' || format === 'docx') {
        // Download file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume.${format}`;
        a.click();
      } else {
        // Show preview
        const result = await response.json();
        setPreview(result.formattedResume);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Resume Generator</h1>
      
      <div>
        <label>Format:</label>
        <select value={format} onChange={(e) => setFormat(e.target.value as any)}>
          <option value="txt">Plain Text</option>
          <option value="html">HTML</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word Document</option>
        </select>
      </div>

      <button onClick={generateResume} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Resume'}
      </button>

      {preview && (
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {preview}
        </pre>
      )}
    </div>
  );
}
```

---

## Error Handling

```typescript
try {
  const response = await fetch('/api/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData, format: 'pdf' }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    console.error('Details:', error.details);
    return;
  }

  // Success
  const result = await response.json();
  console.log('Resume generated:', result);
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Validation Errors

If resume data is invalid:

```json
{
  "error": "Invalid resume data",
  "details": [
    "Missing personal information",
    "Missing name",
    "Missing email",
    "Missing education section"
  ]
}
```

---

## Format Validation Error

If invalid format specified:

```json
{
  "error": "Invalid format",
  "details": "Format must be one of: txt, pdf, docx, html"
}
```
