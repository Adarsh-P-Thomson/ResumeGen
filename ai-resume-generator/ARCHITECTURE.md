# System Architecture - Data Parser & Formatter

## Current Implementation (Phase 1.1)

```
┌─────────────────────────────────────────────────────────────┐
│                     INPUT LAYER                             │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Resume Data (JSON)                                │   │
│  │  - Personal Info                                    │   │
│  │  - Education                                        │   │
│  │  - Experience                                       │   │
│  │  - Projects                                         │   │
│  │  - Skills                                           │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  VALIDATION LAYER                           │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  validateResumeData()                              │   │
│  │  - Check required fields                            │   │
│  │  - Validate structure                               │   │
│  │  - Return errors if invalid                         │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  FORMATTING LAYER                           │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  HarvardFormatter                                   │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ formatHeader()                               │ │   │
│  │  │ - Center name                                 │ │   │
│  │  │ - Contact info layout                         │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ formatEducationSection()                     │ │   │
│  │  │ - Two-column layout (institution | date)     │ │   │
│  │  │ - Degree info with GPA                        │ │   │
│  │  │ - Bullets for coursework                      │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ formatExperienceSection()                    │ │   │
│  │  │ - Company name + dates                        │ │   │
│  │  │ - Role title                                  │ │   │
│  │  │ - Achievement bullets                         │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ formatProjectsSection()                      │ │   │
│  │  │ - Project name + dates                        │ │   │
│  │  │ - Technologies list                           │ │   │
│  │  │ - Impact bullets                              │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ formatSkillsSection()                        │ │   │
│  │  │ - Categorized skills                          │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    OUTPUT LAYER                             │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────┐   │
│  │  Plain Text         │    │  File Export            │   │
│  │  (for API)          │    │  (.txt file)            │   │
│  └─────────────────────┘    └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. Sample Data (JSON)
   ↓
2. processResume(data)
   ↓
3. validateResumeData(data) → { valid: true/false, errors: [] }
   ↓
4. HarvardFormatter.format(data) → Formatted Text String
   ↓
5a. Return to API (Next.js response)
5b. ResumeExporter.exportAsText() → Save to output/filename.txt
```

## API Endpoint Flow

```
POST /api/resume
   ↓
┌──────────────────────────────────────┐
│ 1. Parse JSON body                   │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 2. Validate resume data              │
│    - Check required fields           │
│    - Return 400 if invalid           │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 3. Process with Harvard formatter    │
│    - Format sections                 │
│    - Apply layout rules              │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 4. Return JSON response              │
│    {                                 │
│      success: true,                  │
│      formattedResume: "...",         │
│      metadata: {                     │
│        characterCount: 2500,         │
│        lineCount: 45,                │
│        sectionCount: 4               │
│      }                               │
│    }                                 │
└──────────────────────────────────────┘
```

## Module Structure

```
src/core/
│
├── index.ts                    # Main exports
│   ├── Export all schemas
│   ├── Export HarvardFormatter
│   ├── Export ResumeExporter
│   └── Export resume-processor functions
│
├── schemas/
│   └── resume.schema.ts        # TypeScript interfaces
│       ├── Resume
│       ├── Experience
│       ├── Education
│       └── Project
│
├── resume/
│   ├── sample-data.json        # Test data
│   └── resume-processor.ts     # Main API
│       ├── processResume()
│       ├── exportResume()
│       └── validateResumeData()
│
└── formatter/
    ├── index.ts                # Module exports
    ├── harvard-formatter.ts    # Formatting engine
    ├── resume-exporter.ts      # File I/O
    └── process-resume.ts       # CLI test script
```

## Harvard Format Rules

```
┌─────────────────────────────────────────────────┐
│              NAME (CENTERED, CAPS)              │
│     email | phone | location (centered)         │
│     links (centered)                            │
└─────────────────────────────────────────────────┘

SECTION HEADER
────────────────────────────────────────────────────
Institution/Company, Location          Date Range
Degree/Title with details
  • Bullet point 1 (quantified)
  • Bullet point 2 (action verb + impact)
  • Bullet point 3 (metrics)

Next Entry...
```

## Type Safety Flow

```
JSON Input
   ↓
as Resume (type assertion)
   ↓
TypeScript validates at compile time:
  - personal: { name: string, email: string, ... }
  - education: Education[]
  - experience: Experience[]
  - projects?: Project[]
  - skills: string[]
   ↓
HarvardFormatter expects Resume type
   ↓
Output: string (formatted text)
```

## Testing Commands

```bash
# Test formatter (CLI)
npm run test:formatter

# Build and check types
npm run build

# Start dev server
npm run dev

# Test API endpoint
curl -X POST http://localhost:3000/api/resume \
  -H "Content-Type: application/json" \
  -d @src/core/resume/sample-data.json
```

## What's Working ✅

- ✅ Type-safe schema definition
- ✅ Sample resume data (realistic, quantified)
- ✅ Harvard formatter (all sections)
- ✅ Plain text export
- ✅ File system output
- ✅ Validation logic
- ✅ Next.js API endpoint
- ✅ Error handling
- ✅ CLI test script

## What's Next 🔲

- 🔲 HTML template for PDF
- 🔲 PDF generation (Puppeteer/Playwright)
- 🔲 Job Description parser
- 🔲 AI content rewriter
- 🔲 Skill matching algorithm
- 🔲 Recruiter message generator
