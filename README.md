# AI Resume Generator (Harvard Format)

## Overview

This project is an **AI-powered resume generation engine** that creates **Harvard-style, recruiter-grade resumes**, optimized **per Job Description (JD)**.

The system focuses on **content quality, relevance, and ATS compatibility**, not visual design.
It produces deterministic, one-page resumes and professional recruiter outreach messages.

---

## Why This Exists

Most resume builders:

* Prioritize visuals over substance
* Ignore JD-specific optimization
* Produce ATS-unfriendly PDFs
* Encourage template and design obsession

Recruiters, however, prefer:

* Clean Harvard-style resumes
* Role-relevant content
* Quantified achievements
* Clear, concise bullets

This project is built to match **recruiter expectations**, not design trends.

---

## Key Features

* Harvard resume format (locked template)
* One-page, ATS-optimized output
* Job Description–aware content rewriting
* Skill and keyword alignment
* Experience and project prioritization
* Bullet-point rewriting with action verbs
* Deterministic PDF generation
* Plain-text resume export
* Recruiter outreach message generation (LinkedIn / Email)

---

## Input Requirements

### Mandatory

* Personal details
* Education
* Experience
* Projects
* Skills
* Job Description (JD)

### Optional

* GitHub / Portfolio links
* Certifications
* Awards

---

## Output

* **Resume PDF**

  * Harvard format
  * ATS-safe
  * Searchable text
  * One page

* **Plain-text resume**

* **Recruiter message**

  * Professional tone
  * JD-aligned
  * Ready to send

---

## System Architecture (High-Level)

```
User Data + JD
      ↓
JD Parsing & Skill Extraction
      ↓
Relevance Scoring Engine
      ↓
AI Content Rewriting (Controlled)
      ↓
Harvard Formatting Rules
      ↓
HTML → PDF Rendering
```

AI output is **never used directly** — all content passes through rule-based validation.

---

## Design Constraints (Non-Negotiable)

* Single resume format (Harvard only)
* No visual customization
* No icons, colors, charts, or graphics
* No fake or hallucinated experience
* No keyword stuffing
* Same input always produces the same output

---

## Recruiter Message Generator

Generates:

* LinkedIn cold outreach message
* Email outreach text

Rules:

* No emojis
* No hype or sales language
* No begging tone
* Clear value proposition
* Concise and professional

---

## What This Project Is NOT

* ❌ Resume design tool
* ❌ Template marketplace
* ❌ Canva-style editor
* ❌ Fake experience generator
* ❌ Career coaching platform

This is a **resume engine**, not a design product.

---

## Development Phases

### Phase 1 (MVP)

* JD parsing
* Resume rewriting
* Harvard formatting
* PDF export
* Recruiter message generation

### Phase 2

* JD vs resume match score
* ATS keyword analysis
* Multiple resume versions per JD
* Change diff viewer

### Phase 3

* Resume version history
* Cover letter generation
* Recruiter CRM export
* Job portal autofill text

---

## Intended Users

* Job seekers targeting serious roles
* Developers and engineers
* Students and fresh graduates
* Professionals tailoring resumes per role
* Recruiter-focused candidates

---

## Project Philosophy

> Content-first. Recruiter-first. No gimmicks.

---

## License

Open-source.
License to be finalized (MIT / Apache-2.0 recommended).

---

## Contributing

Contributions are welcome **only if they respect the core constraints**:

* Harvard format remains locked
* No visual customization features
* AI remains controlled and deterministic


