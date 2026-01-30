# AI-Powered Resume Refinement

## Overview
The AI layer uses Megallm API to intelligently refine resume content based on job descriptions, optimizing for ATS systems and relevance.

## Setup

### 1. Environment Variables
Create `.env.local` file in the project root:

```bash
MEGALLM_API_KEY=your_megallm_api_key_here
MEGALLM_API_URL=https://api.megallm.com/v1/chat/completions
```

**Important:** Add your actual Megallm API key to `.env.local` file.

### 2. File Structure
```
src/
├── ai/
│   └── client.ts          # Megallm AI client
├── app/
│   └── api/
│       └── refine/
│           └── route.ts   # AI refinement endpoint
└── components/
    └── ResumeForm.tsx     # UI with AI toggle
```

## How It Works

### User Flow
1. **Fill Resume Data**: Enter education, experience, projects, etc.
2. **Enable AI**: Toggle "AI-Powered Refinement" section
3. **Paste Job Description**: Add the target job posting
4. **Generate**: Click generate - AI refines first, then creates resume

### Technical Flow
```
User Data → AI Refinement → Resume Generation → Download
            (if enabled)
```

### AI Refinement Process
1. **Input**: Raw resume data + Job description
2. **AI Processing**:
   - Analyzes job requirements
   - Rewrites bullet points for relevance
   - Highlights matching skills
   - Optimizes for ATS keywords
   - Maintains factual accuracy
3. **Output**: Refined resume data (same JSON structure)

## API Endpoints

### POST /api/refine
Refine resume data using AI.

**Request:**
```json
{
  "resumeData": {
    "personal": { ... },
    "education": [ ... ],
    "experience": [ ... ],
    "projects": [ ... ],
    "skills": [ ... ]
  },
  "jobDescription": "Job posting text..."
}
```

**Response:**
```json
{
  "success": true,
  "refinedData": { ... },
  "message": "Resume refined successfully using AI"
}
```

**Error Response:**
```json
{
  "error": "Failed to refine resume with AI",
  "details": "Error message"
}
```

## AI Client Usage

### Direct Usage (Server-Side)
```typescript
import { MegallmClient } from '@/ai/client';

const client = new MegallmClient();

// Simple chat
const response = await client.chat([
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Hello!' }
]);

// Resume refinement
const refined = await client.refineResume(resumeData, jobDescription);
```

### Configuration Options
```typescript
const client = new MegallmClient(
  'custom-api-key',        // Optional: defaults to env var
  'https://custom-url.com' // Optional: defaults to env var
);

// Chat with options
await client.chat(messages, {
  model: 'gpt-4',         // Model name
  temperature: 0.7,        // Creativity (0-1)
  max_tokens: 4000         // Response length
});
```

## AI Prompt Engineering

### Current System Prompt
```
You are an expert resume writer and ATS optimization specialist. 
Your task is to refine resume data to match a specific job description 
while maintaining Harvard formatting standards.

Rules:
1. Keep all factual information (names, dates, companies) unchanged
2. Rewrite bullet points to highlight relevant skills and achievements
3. Use action verbs and quantifiable metrics
4. Optimize for ATS (Applicant Tracking Systems)
5. Maintain professional, concise language
6. Return ONLY valid JSON with the same structure as input
7. Do not add fictional experiences or qualifications
```

### Future Enhancement: Agentic Layer
The AI layer is designed to be extended with agentic capabilities:

**Planned Features:**
- Multi-step reasoning (analyze → plan → refine → verify)
- Skill gap analysis
- Achievement quantification suggestions
- Industry-specific optimization
- ATS score prediction
- A/B testing different versions

## UI Components

### AI Toggle Section
Located above "Generate Resume" section:
- **Enable/Disable Toggle**: Activates AI refinement
- **Job Description Input**: Large textarea for job posting
- **Status Indicator**: Shows "Refining with AI..." during processing
- **Pro Tips**: Helper text when disabled

### Generate Button States
- Default: "Generate PDF Resume"
- AI Enabled: "Generate PDF Resume (AI-Optimized)"
- Refining: "🤖 Refining with AI..."
- Generating: "Generating Resume..."

## Error Handling

### Graceful Degradation
If AI refinement fails:
1. Error is logged to console
2. Warning message shown to user
3. **Original data is used** (no blocking failure)
4. Resume generation continues normally

### Common Errors
- **Missing API Key**: Check `.env.local` file
- **Invalid JSON Response**: AI returned non-JSON (logs raw response)
- **Rate Limiting**: Megallm API quota exceeded
- **Network Timeout**: API unreachable

## Testing

### Manual Testing Steps
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Fill in resume data
4. Enable AI refinement
5. Paste sample job description:
   ```
   We are seeking a Senior Software Engineer with 5+ years 
   experience in full-stack development. Must have React, 
   Node.js, and AWS expertise.
   ```
6. Click "Generate PDF Resume (AI-Optimized)"
7. Verify:
   - "Refining with AI..." shows briefly
   - PDF downloads successfully
   - Content is tailored to job description

### Test Without AI
1. Keep AI toggle disabled
2. Generate resume
3. Verify normal flow works

## Security Best Practices

### API Key Protection
- ✅ Store in `.env.local` (gitignored)
- ✅ Never commit to version control
- ✅ Server-side only (not exposed to browser)
- ✅ Use environment variables in production

### Data Privacy
- Resume data sent to Megallm API temporarily
- No data stored by the application
- Review Megallm's privacy policy for their data handling

## Performance Considerations

### Timing
- AI Refinement: 3-10 seconds (depends on data size)
- Resume Generation: 1-2 seconds
- Total: 4-12 seconds for AI-optimized resume

### Optimization Tips
- Cache common job descriptions (future)
- Batch multiple requests (future)
- Use streaming responses (future)

## Troubleshooting

### "MEGALLM_API_KEY is not set"
**Solution:** Create `.env.local` file with valid API key

### "AI returned invalid JSON format"
**Solution:** Check console logs for raw response. May need to adjust prompt or increase max_tokens.

### Resume looks unchanged after AI
**Solution:** Check if job description is relevant. AI may not change content if already well-matched.

### Slow AI responses
**Solution:** Check Megallm API status. Consider reducing max_tokens or using a faster model.

## Next Steps (Agentic Enhancement)

### Phase 1: Current (Simple Refinement)
- ✅ Single AI call
- ✅ Basic optimization
- ✅ Error handling

### Phase 2: Skill Analysis
- Extract job requirements
- Compare with resume skills
- Suggest missing skills to emphasize

### Phase 3: Multi-Agent System
- **Analyzer Agent**: Understands job requirements
- **Writer Agent**: Rewrites bullet points
- **Validator Agent**: Checks factual accuracy
- **ATS Agent**: Optimizes for keyword matching

### Phase 4: Feedback Loop
- Generate multiple versions
- Score each version
- Select best variation
- Learn from user selections

## Resources

- [Megallm API Documentation](https://megallm.com/docs)
- [ATS Optimization Guide](https://example.com/ats-guide)
- [Resume Writing Best Practices](https://example.com/resume-tips)

## Support

For issues or questions:
1. Check console logs for errors
2. Verify `.env.local` configuration
3. Test with simple job descriptions first
4. Review Megallm API status page
