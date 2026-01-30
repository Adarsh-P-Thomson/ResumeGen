# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Server
```bash
cd ai-resume-generator
npm run dev
```

### Step 2: Open Your Browser
Visit: **http://localhost:3000**

### Step 3: Create Your Resume
Fill out the form and click "Generate Resume"!

---

## 📋 What You'll See

### Main Page Layout
```
┌─────────────────────────────────────────────────────┐
│  AI Resume Generator                    PDF DOCX TXT│
│  Harvard-style, recruiter-grade resumes in seconds  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  💡 Tips for a Great Resume                         │
│  • Use action verbs (Led, Built, Optimized)         │
│  • Include metrics (40% faster, $1M revenue)        │
│  • Keep it to 1 page                                │
│  • Tailor content to the job description            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  📝 Personal Information                            │
│  Name: [____________]  Email: [_______________]     │
│  Phone: [___________]  Location: [____________]     │
│  Links:                                             │
│  [_________________________________________]        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🎓 Education                        [+ Add Education]│
│  Institution: [_____________________________]        │
│  Degree: [_____________] Field: [__________]         │
│  Date: [__________] GPA: [______]                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  💼 Experience                     [+ Add Experience]│
│  Company: [_____________________________]            │
│  Role: [____________________]                        │
│  Dates: [___________] to [__________]                │
│  Achievements:                                       │
│  [____________________________________________]       │
│  [____________________________________________]       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🚀 Projects                          [+ Add Project]│
│  Project Name: [_____________________________]       │
│  Technologies: [____________________________]        │
│  Impact: [____________________________________]       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🛠️ Skills                                           │
│  [____________________________________________]       │
│  Languages: JavaScript, Python, TypeScript           │
│  Frameworks: React, Next.js, Django                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  📄 Generate Resume                                  │
│  Format: [TXT] [HTML] [PDF] [DOCX]                  │
│                                                      │
│  [     Generate PDF Resume     ]                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Sample Data to Test

### Personal Information
```
Name: Alex Johnson
Email: alex.johnson@email.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA
Links:
linkedin.com/in/alexjohnson
github.com/alexjohnson
```

### Education
```
Institution: Stanford University
Degree: Bachelor of Science
Field: Computer Science
Date: May 2022
GPA: 3.85/4.0
Location: Stanford, CA
```

### Experience
```
Company: TechCorp Inc.
Role: Senior Software Engineer
Start: June 2023
End: Present
Achievements:
Architected microservices infrastructure serving 2M+ users, reducing latency by 40%
Led team of 5 engineers to deliver payment system handling $10M+ monthly transactions
Optimized database queries improving API response time from 800ms to 120ms
```

### Projects
```
Name: AI Code Review Assistant
Technologies: Python, OpenAI API, FastAPI, Docker
Start: Jan 2024
End: Present
Impact:
Built automated code review tool analyzing 500+ pull requests with 85% accuracy
Deployed on AWS ECS processing reviews for 50+ developers across 3 teams
Reduced average PR review time from 4 hours to 30 minutes
```

### Skills
```
Languages: JavaScript, TypeScript, Python, Java, Go, SQL
Frontend: React, Next.js, Vue.js, HTML/CSS, Tailwind
Backend: Node.js, Express, FastAPI, Django, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis, MySQL
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, GitHub Actions
Tools: Git, Jest, Pytest, Linux, Agile/Scrum
```

---

## 🎨 Output Formats

### TXT (Plain Text)
- **Use Case**: Maximum ATS compatibility
- **Output**: Shows preview in browser
- **Best For**: Job portals, email body

### HTML (Web Preview)
- **Use Case**: Web portfolios, debugging
- **Output**: Can save and open in browser
- **Best For**: Personal website, quick preview

### PDF (Recommended) ⭐
- **Use Case**: Professional submissions
- **Output**: Auto-downloads PDF file
- **Best For**: Email to recruiters, LinkedIn uploads

### DOCX (Word Document)
- **Use Case**: Editable format
- **Output**: Auto-downloads .docx file
- **Best For**: When recruiter wants editable version

---

## ⚡ Quick Actions

### Generate PDF Resume
1. Fill out form
2. Select "PDF" format
3. Click "Generate PDF Resume"
4. File downloads automatically

### Preview Text Resume
1. Fill out form
2. Select "TXT" format
3. Click "Generate TXT Resume"
4. Preview appears below button

### Generate Word Document
1. Fill out form
2. Select "DOCX" format
3. Click "Generate DOCX Resume"
4. File downloads automatically

---

## 💡 Tips While Using

### Form Tips
- **Required fields** marked with (*)
- Use **Enter** for new lines in text areas
- **Comma-separate** technologies and links
- Click **+ Add** buttons for multiple entries
- Click **Remove** to delete unwanted entries

### Content Tips
- Start bullets with action verbs
- Include numbers and percentages
- Be specific about technologies used
- Quantify team sizes and user counts
- Use "Present" for current positions

### Format Tips
- **PDF** is most professional
- **DOCX** if you need to edit later
- **TXT** for maximum compatibility
- **HTML** for web use or debugging

---

## 🎓 Harvard Format Preview

Your generated resume will look like this:

```
                    ALEX JOHNSON
       alex.johnson@email.com | +1 (555) 123-4567 | San Francisco, CA
          linkedin.com/in/alexjohnson | github.com/alexjohnson

EDUCATION
────────────────────────────────────────────────────────
Stanford University, Stanford, CA                 May 2022
Bachelor of Science in Computer Science GPA: 3.85/4.0

EXPERIENCE
────────────────────────────────────────────────────────
TechCorp Inc.                          June 2023 – Present
Senior Software Engineer
  • Architected microservices serving 2M+ users, reducing latency by 40%
  • Led team of 5 engineers to deliver $10M+ payment system

PROJECTS
────────────────────────────────────────────────────────
AI Code Review Assistant               Jan 2024 – Present
Technologies: Python, OpenAI API, FastAPI, Docker
  • Built automated tool analyzing 500+ pull requests with 85% accuracy

SKILLS
────────────────────────────────────────────────────────
Languages: JavaScript, TypeScript, Python, Java, Go, SQL
Frontend: React, Next.js, Vue.js, HTML/CSS, Tailwind
Backend: Node.js, Express, FastAPI, Django, GraphQL
```

---

## 🏆 Success Indicators

### Form is Working When:
- ✅ All sections are visible
- ✅ Add/Remove buttons function
- ✅ Text inputs are responsive
- ✅ Format buttons are selectable

### Generation is Working When:
- ✅ "Generating Resume..." appears
- ✅ PDF/DOCX downloads automatically
- ✅ TXT/HTML shows preview
- ✅ No error messages appear

### Output is Correct When:
- ✅ All your data appears in the resume
- ✅ Formatting is clean and professional
- ✅ Dates and names are aligned properly
- ✅ Bullets are properly formatted

---

## 🚨 Common Issues & Solutions

### Issue: Button doesn't work
**Solution**: Make sure all required fields (*) are filled

### Issue: PDF not downloading
**Solution**: Check browser's download permissions

### Issue: Preview looks wrong
**Solution**: Check for proper line breaks in text areas

### Issue: Missing sections
**Solution**: Ensure data is entered in all required fields

---

## 📞 Need Help?

Check these documents:
- [FULL_STACK_GUIDE.md](FULL_STACK_GUIDE.md) - Complete documentation
- [MULTI_FORMAT_GUIDE.md](MULTI_FORMAT_GUIDE.md) - Format details
- [API_EXAMPLES.md](API_EXAMPLES.md) - API usage

---

**Ready to create your perfect resume! 🎉**

Visit: http://localhost:3000
