# AI Resume Generator

Professional Harvard-style resume generator with AI-powered optimization for job descriptions.

## Features

### 🎨 Core Features
- **Harvard Format**: Clean, ATS-friendly, one-page resume
- **Multi-Format Export**: TXT, HTML, PDF, DOCX
- **Dynamic Sections**: Education, Experience, Projects, Skills
- **Optional Sections**: Publications, Patents, Certifications, Awards, Volunteer Work

### 🤖 AI-Powered Refinement
- **Job Description Matching**: Optimize resume for specific job postings
- **ATS Optimization**: Automatic keyword matching and relevance scoring
- **Smart Rewriting**: AI rewrites bullet points while maintaining factual accuracy
- **Megallm Integration**: Powered by Megallm API for intelligent content refinement

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` file in the project root:

```bash
MEGALLM_API_KEY=your_megallm_api_key_here
MEGALLM_API_URL=https://api.megallm.com/v1/chat/completions
```

**Important:** Replace `your_megallm_api_key_here` with your actual Megallm API key.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the resume generator.

## Usage

### Basic Resume Generation
1. Fill in personal information
2. Add education entries
3. Add work experience with bullet points
4. Add projects (optional)
5. Add skills (one per line)
6. Select output format (TXT, HTML, PDF, DOCX)
7. Click "Generate Resume"

### AI-Optimized Resume
1. Fill in your resume data (as above)
2. **Enable AI Refinement** toggle
3. Paste the target job description
4. Select output format
5. Click "Generate Resume (AI-Optimized)"
6. AI will refine your content to match the job, then generate resume

## Project Structure

```
src/
├── ai/
│   └── client.ts              # Megallm AI client
├── app/
│   ├── api/
│   │   ├── resume/route.ts    # Resume generation endpoint
│   │   └── refine/route.ts    # AI refinement endpoint
│   └── page.tsx               # Landing page
├── components/
│   └── ResumeForm.tsx         # Main form component
├── core/
│   ├── schemas/
│   │   └── resume.schema.ts   # TypeScript types
│   ├── formatter/
│   │   ├── harvard-formatter.ts   # Text formatter
│   │   ├── html-template.ts       # HTML generator
│   │   ├── pdf-generator.ts       # PDF generator
│   │   └── docx-generator.ts      # Word generator
│   └── resume/
│       └── resume-processor.ts    # Core logic
└── types/
    └── index.ts               # Type exports
```

## Documentation

- **[AI Refinement Guide](./AI_REFINEMENT_GUIDE.md)** - Complete AI layer documentation
- **[Full Stack Guide](./FULL_STACK_GUIDE.md)** - Architecture and implementation
- **[Quick Start](./QUICK_START.md)** - Getting started quickly
- **[Multi-Format Guide](./MULTI_FORMAT_GUIDE.md)** - Output format details

## API Endpoints

### POST /api/resume
Generate resume in specified format.

**Request:**
```json
{
  "resumeData": { /* Resume object */ },
  "format": "pdf",
  "exportFile": true
}
```

### POST /api/refine
Refine resume using AI based on job description.

**Request:**
```json
{
  "resumeData": { /* Resume object */ },
  "jobDescription": "Job posting text..."
}
```

## Scripts

```bash
# Development
npm run dev                  # Start dev server

# Build
npm run build               # Production build
npm start                   # Start production server

# Testing
npm run test:formatter      # Test Harvard formatter
npm run test:all-formats    # Test all output formats

# Linting
npm run lint               # Run ESLint
```

## Technologies

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **AI**: Megallm API
- **PDF**: Puppeteer 24.36.1
- **DOCX**: docx 9.5.1

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MEGALLM_API_KEY` | Megallm API key for AI refinement | Yes (for AI features) |
| `MEGALLM_API_URL` | Megallm API endpoint URL | No (has default) |

## Features in Detail

### Optional Resume Sections
Toggle on/off as needed:
- 📚 **Publications**: Research papers, articles
- 💡 **Patents**: Patent applications and grants
- 🎓 **Certifications**: Professional certifications
- 🏆 **Awards**: Achievements and honors
- 🤝 **Volunteer**: Community service work

### AI Refinement Process
1. **Analysis**: AI analyzes job requirements
2. **Matching**: Identifies relevant experience and skills
3. **Rewriting**: Rewrites bullet points for maximum impact
4. **Optimization**: Adds ATS-friendly keywords
5. **Validation**: Ensures factual accuracy maintained

### Output Formats

- **TXT**: Plain text, easy to copy-paste
- **HTML**: Web preview with styling
- **PDF**: Print-ready document (Letter size)
- **DOCX**: Microsoft Word format for editing

## Error Handling

The application includes graceful error handling:
- If AI refinement fails, original data is used
- Validation errors are displayed clearly
- Network errors are caught and reported

## Contributing

This is a private project. For feature requests or bug reports, please contact the maintainer.

## License

Private - All Rights Reserved

## Support

For issues or questions:
1. Check the documentation files
2. Review console logs for errors
3. Verify environment configuration
4. Test with sample data first
