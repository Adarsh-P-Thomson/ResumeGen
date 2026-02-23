# AI Resume Refinement System

## Overview
Professional AI-powered resume refinement system with two distinct pathways, following Harvard Business School resume standards and ATS optimization best practices.

## Architecture

```
User Input (Resume Data + Optional JD)
           ↓
    /api/refine endpoint
           ↓
    Pathway Selection
     ↙          ↘
Pathway 1      Pathway 2
(General)    (JD-Optimized)
     ↓            ↓
  Prompt 1    Prompt 2
     ↓            ↓
   MegaLLM API
     ↓            ↓
  Enhanced     Optimized
  Resume       Resume
```

## Two Refinement Pathways

### Pathway 1: General Enhancement (No Job Description)
**Use Case:** Improve resume quality without targeting a specific job

**Prompt File:** `resume-refinement.prompt.md`

**What It Does:**
- Enhances clarity and professionalism
- Adds quantifiable metrics to bullet points
- Applies Harvard resume guidelines
- Uses strong action verbs
- Improves structure and readability
- Ensures ATS compatibility
- NO keyword stuffing or job-specific optimization

**Example Transformation:**
```
Before: "Worked on backend services"
After:  "Developed and deployed 8 RESTful microservices using Node.js, 
         handling 50K+ daily requests with 99.9% uptime"
```

**When to Use:**
- Creating a baseline professional resume
- Career pivots or general applications
- Portfolio/website resume versions
- Want quality improvements without targeting specific job

---

### Pathway 2: Job Description Optimization
**Use Case:** Optimize resume for a specific job posting

**Prompt File:** `resume-jd-optimization.prompt.md`

**What It Does:**
- **Phase 1:** Analyzes job description to extract:
  - Required technical skills
  - Experience requirements
  - Key responsibilities
  - Soft skills needed
  - High-value ATS keywords
  
- **Phase 2:** Refines resume to:
  - Mirror job description terminology (exact matches)
  - Reorder bullets to prioritize relevant experience
  - Integrate keywords naturally
  - Emphasize matching skills and technologies
  - Quantify with job-relevant metrics
  - Optimize for ATS scanning

**Example Transformation:**
```
Job Description: "Looking for React engineer with performance optimization experience..."

Before: "Built React components for web app"
After:  "Optimized React component rendering using useMemo and React.lazy, 
         reducing bundle size by 40% and improving Time to Interactive 
         from 3.2s to 1.1s"
```

**When to Use:**
- Applying to specific job postings
- Want maximum ATS score for particular role
- Need keyword optimization for online applications
- Tailoring resume for targeted companies

---

## Harvard Resume Guidelines (Applied in Both Pathways)

### Language Rules:
✅ **DO:**
- Specific rather than general
- Active rather than passive
- Articulate rather than flowery
- Fact-based (quantify and qualify)
- Written for quick scanning

❌ **DON'T:**
- Personal pronouns (I, we, my)
- Abbreviations (write out fully)
- Narrative style (use bullets)
- Slang or colloquialisms
- Passive language

### Content Rules:
- Start with strong action verbs
- Include quantifiable metrics (%, $, #, time)
- Use CAR structure: Context + Action + Result
- Reverse chronological order
- Consistent formatting

### Top 5 Resume Mistakes (Avoided):
1. ✗ Spelling and grammar errors
2. ✗ Passive language instead of action verbs
3. ✗ Poor organization / hard to skim
4. ✗ Not demonstrating quantifiable results
5. ✗ Missing key information

---

## Technical Implementation

### Files Created:

1. **`/ai/prompts/resume-refinement.prompt.md`**
   - Comprehensive prompt for general enhancement
   - ~150 lines of detailed guidelines
   - Examples and transformations
   - Harvard standards encoded

2. **`/ai/prompts/resume-jd-optimization.prompt.md`**
   - Two-phase optimization prompt
   - JD analysis framework
   - ATS keyword integration strategy
   - Context-aware rewriting examples

3. **`/ai/promptLoader.ts`**
   - Utility to load prompts from markdown files
   - JSON extraction from AI responses
   - Context variable substitution
   - Clean response parsing

4. **`/ai/client.ts`** (Updated)
   - `refineResumeGeneral()` - Pathway 1
   - `refineResumeWithJD()` - Pathway 2
   - `refineResume()` - Legacy router method

5. **`/app/api/refine/route.ts`** (Updated)
   - Automatic pathway selection
   - Logging for debugging
   - Error handling
   - Model selection support

### API Usage:

#### Pathway 1 (General Enhancement):
```typescript
POST /api/refine
{
  "resumeData": { /* Resume object */ },
  "model": "deepseek-r1-distill-llama-70b"  // optional
}
```

#### Pathway 2 (JD Optimization):
```typescript
POST /api/refine
{
  "resumeData": { /* Resume object */ },
  "jobDescription": "Full job posting text...",
  "model": "deepseek-r1-distill-llama-70b"  // optional
}
```

**Response:**
```typescript
{
  "success": true,
  "refinedData": { /* Enhanced resume object */ },
  "pathway": "JD Optimization" | "General Enhancement",
  "message": "Resume refined successfully..."
}
```

---

## Prompt Engineering Highlights

### Key Techniques Used:

1. **Role Definition**
   - "You are an expert resume writer and ATS optimization specialist"
   - Establishes authority and context

2. **Clear Task Structure**
   - Explicit do's and don'ts
   - Phase-based processing (for Pathway 2)
   - Priority ordering

3. **Few-Shot Examples**
   - Before/after transformations
   - Multiple scenarios covered
   - Context-specific examples

4. **Constraint Enforcement**
   - Factual accuracy requirements
   - JSON structure preservation
   - No fabrication rules

5. **Action Verb Library**
   - Categorized by context (leadership, technical, analytical)
   - Mapped to different role types

6. **Quantification Framework**
   - Metrics taxonomy (%, $, #, time, scale)
   - CAR (Context-Action-Result) structure

7. **ATS Optimization Rules**
   - Keyword extraction methodology
   - Natural language integration
   - Density without stuffing

---

## Model Recommendations

**Recommended Model:** `deepseek-r1-distill-llama-70b`
- Best reasoning capabilities
- Strong at following complex instructions
- Free tier available on MegaLLM

**Alternative Models:**
- `mistral-large` - Good for European markets
- `gpt-oss` - Fast and reliable
- `qwen` - Strong multilingual support

**Token Limits:**
- System prompt: ~1,500-2,000 tokens
- Resume data: ~1,000-3,000 tokens
- Max completion: 4,000 tokens
- Total budget: ~8,000 tokens per request

---

## Testing the System

### Test Pathway 1 (General Enhancement):
```bash
curl -X POST http://localhost:3000/api/refine \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "personal": { "name": "John Doe", ... },
      "experience": [...],
      ...
    },
    "model": "deepseek-r1-distill-llama-70b"
  }'
```

### Test Pathway 2 (JD Optimization):
```bash
curl -X POST http://localhost:3000/api/refine \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": { ... },
    "jobDescription": "We are seeking a Senior React Developer...",
    "model": "deepseek-r1-distill-llama-70b"
  }'
```

---

## UI Integration

The form automatically routes to the correct pathway:

```typescript
// In ResumeForm.tsx
if (useAI && jobDescription.trim()) {
  // Pathway 2: JD optimization
  const response = await fetch('/api/refine', {
    method: 'POST',
    body: JSON.stringify({
      resumeData,
      jobDescription: jobDescription.trim(),
      model: aiModel
    })
  });
} else if (useAI) {
  // Pathway 1: General enhancement
  const response = await fetch('/api/refine', {
    method: 'POST',
    body: JSON.stringify({
      resumeData,
      model: aiModel
    })
  });
}
```

---

## Quality Assurance

### Validation Checks:
- ✓ JSON structure preserved
- ✓ No fabricated data
- ✓ Dates unchanged
- ✓ Action verbs at start of bullets
- ✓ Quantification added
- ✓ Harvard guidelines followed
- ✓ Keywords naturally integrated (Pathway 2)

### Error Handling:
- Invalid JSON → Clear error message
- API timeout → Graceful fallback
- Missing data → Validation errors
- Parse failures → Extract attempts

---

## Future Enhancements

Potential improvements:
1. **Batch Processing** - Refine multiple versions simultaneously
2. **A/B Testing** - Generate 2-3 variations for comparison
3. **Diff View** - Show before/after changes with highlighting
4. **Keyword Analysis** - Display matched keywords from JD
5. **ATS Score** - Calculate estimated ATS compatibility score
6. **Industry Templates** - Specific prompts for tech/finance/healthcare
7. **Feedback Loop** - Learn from user selections/edits

---

## Summary

✨ **Two-pathway system provides:**
- General enhancement for baseline quality (Pathway 1)
- Job-specific optimization for targeted applications (Pathway 2)
- Harvard-compliant formatting and language
- ATS optimization built-in
- Professional prompt engineering
- Modular, maintainable architecture

**Both pathways maintain factual integrity while maximizing impact.**
