/**
 * Prompt Loader Utility
 * Loads and manages AI prompts from markdown files
 */

import fs from 'fs';
import path from 'path';

export type PromptType = 
  | 'resume-refinement'           // Resume refinement without JD
  | 'resume-jd-optimization';     // Resume optimization with JD

/**
 * Load a prompt from the prompts directory
 */
export function loadPrompt(promptType: PromptType): string {
  const promptsDir = path.join(process.cwd(), 'src', 'ai', 'prompts');
  const promptFile = `${promptType}.prompt.md`;
  const promptPath = path.join(promptsDir, promptFile);

  try {
    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    
    // Remove any markdown code blocks if present
    const cleaned = promptContent
      .replace(/^```prompt\s*/gm, '')
      .replace(/^```json\s*/gm, '')
      .replace(/^```\s*$/gm, '')
      .trim();
    
    return cleaned;
  } catch (error) {
    console.error(`Failed to load prompt "${promptType}":`, error);
    throw new Error(`Prompt file not found: ${promptFile}`);
  }
}

/**
 * Build system message with prompt
 */
export function buildSystemMessage(promptType: PromptType, context?: Record<string, any>): string {
  let prompt = loadPrompt(promptType);
  
  // Replace any context variables if provided
  if (context) {
    for (const [key, value] of Object.entries(context)) {
      const placeholder = `{{${key}}}`;
      if (prompt.includes(placeholder)) {
        prompt = prompt.replace(new RegExp(placeholder, 'g'), String(value));
      }
    }
  }
  
  return prompt;
}

/**
 * Build user message for resume refinement
 */
export function buildResumeRefinementMessage(
  resumeData: any,
  jobDescription?: string
): string {
  if (jobDescription && jobDescription.trim()) {
    return `## Job Description:\n\n${jobDescription.trim()}\n\n## Current Resume Data:\n\n${JSON.stringify(resumeData, null, 2)}\n\nPlease optimize the resume data to match this job description. Return ONLY the refined JSON data with the same structure.`;
  } else {
    return `## Current Resume Data:\n\n${JSON.stringify(resumeData, null, 2)}\n\nPlease refine and enhance this resume data following all guidelines above. Return ONLY the refined JSON data with the same structure.`;
  }
}

/**
 * Extract JSON from AI response (handles markdown code blocks)
 */
export function extractJSON(response: string): any {
  let jsonText = response.trim();
  
  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  }
  
  // Try to find JSON object if response has extra text
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonText = jsonMatch[0];
  }
  
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', jsonText.substring(0, 500));
    throw new Error('AI returned invalid JSON format. Please try again.');
  }
}
