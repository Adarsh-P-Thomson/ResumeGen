# AI Resume Generator – IDEA.md

## 1. Problem Statement

Most resume builders focus on **design, templates, and visuals**, not on **job relevance, recruiter expectations, or ATS behavior**.
This results in resumes that look good but fail to convert.

Recruiters prefer **Harvard-style, content-first resumes** that are:

* Clean
* One-page
* Role-specific
* Metric-driven
* ATS-friendly

Job seekers struggle to:

* Rewrite resumes per Job Description (JD)
* Align keywords without stuffing
* Maintain consistency and credibility
* Write effective recruiter outreach messages

---

## 2. Solution Overview

Build an **AI-powered resume generation system** that:

* Accepts structured user data + Job Description
* Rewrites and optimizes content **per JD**
* Enforces **Harvard Resume format (locked template)**
* Exports a **deterministic, ATS-safe PDF**
* Generates a **ready-to-send recruiter message**

The system prioritizes **content quality, relevance, and trustworthiness** over visual customization.

---

## 3. Core Principles (Non-Negotiable)

* **Single resume format**: Harvard only
* **One page** output
* **No design customization**
* **No fake or hallucinated experience**
* **AI output is always rule-validated**
* **Same input → same output**
* **Recruiter-first, not user-ego-first**

---

## 4. High-Level Architecture

```
User Input
  ├── Personal Details
  ├── Education
  ├── Experience
  ├── Projects
  ├── Skills
  └── Job Description
        ↓
JD Parsing & Analysis Layer
        ↓
Relevance & Skill Matching Engine
        ↓
AI Content Rewriting Engine
        ↓
Harvard Resume Formatter (Rules-Based)
        ↓
PDF Generation Engine
        ↓
Final Outputs
  ├── Resume PDF
  ├── Plain Text Resume
  └── Recruiter Outreach Message
```

---

## 5. JD Parsing & Intelligence Layer

Responsibilities:

* Extract role title, seniority, domain
* Identify required vs optional skills
* Extract ATS keywords
* Detect tooling, frameworks, methodologies
* Understand role expectations implicitly

Outputs structured data (no free text).

---

## 6. Resume Optimization Engine

AI is used **only for controlled rewriting**, never freeform generation.

Capabilities:

* Rewrite experience bullets aligned to JD
* Prioritize relevant experience/projects
* Remove or down-rank irrelevant content
* Enforce action verbs and clarity
* Add measurable impact **only when data exists**
* Maintain tense and chronology consistency

Constraints:

* No exaggeration
* No assumptions
* No buzzwords without evidence

---

## 7. Harvard Resume Formatting Rules

Hard-coded rules enforced post-AI:

* Single column
* Black & white
* Serif / professional font
* Fixed section order
* Tight margins
* Bullet-based experience
* No icons, charts, images, colors
* ATS-readable text only

AI **cannot modify layout**.

---

## 8. PDF Generation Layer

Requirements:

* Text-based (not image-based)
* Selectable and searchable text
* ATS-compatible
* Standard page size (A4 / Letter)
* Deterministic rendering

Pipeline:

```
Structured Resume Data → HTML → PDF
```

---

## 9. Recruiter Message Generator

Purpose:
Generate short, professional outreach text aligned to:

* Job Description
* Resume highlights
* Company context

Outputs:

* LinkedIn cold message
* Email outreach text

Rules:

* No emojis
* No hype language
* No begging tone
* Clear value proposition
* Professional brevity

---

## 10. AI Safety & Control Layer

* Prompt chaining with strict roles
* Post-processing validators
* Length checks on bullets
* Keyword stuffing prevention
* Grammar and tense enforcement
* Factual consistency checks

LLM output is **never used directly**.

---

## 11. What This System Is NOT

* ❌ Resume design tool
* ❌ Template marketplace
* ❌ Fake experience generator
* ❌ Canva-style editor
* ❌ Career coaching platform

This is a **resume engine**, not a design product.

---

## 12. Phase-wise Development Plan

### Phase 1 (MVP)

* JD parsing
* Resume content rewriting
* Harvard formatting
* PDF export
* Recruiter message generation

### Phase 2

* JD vs Resume match scoring
* ATS keyword analysis
* Multiple resume versions per JD
* Change diff viewer

### Phase 3

* Resume version history
* Cover letter generation
* Recruiter CRM exports
* Job portal autofill text

---

## 13. Intended Outcome

Produce resumes that:

* Pass ATS filters
* Read well to recruiters
* Are credible and concise
* Increase interview callbacks
* Require minimal manual editing

---

## 14. One-Line Product Definition

> A JD-aware AI resume engine that produces recruiter-grade Harvard resumes and professional outreach messages — strictly content-first, no gimmicks.

---

### Usage Note for AI Assistants

This file is the **authoritative context**.
Any generated code, prompts, or features must:

* Respect all constraints listed above
* Never introduce design customization
* Preserve deterministic output behavior
* Prioritize recruiter expectations over user preference

