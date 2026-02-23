/**
 * Megallm AI Client using OpenAI SDK
 * Handles communication with Megallm API for resume refinement
 * Using DeepSeek model for optimal reasoning and structured output
 */

import OpenAI from 'openai';
import { 
  buildSystemMessage, 
  buildResumeRefinementMessage, 
  extractJSON 
} from './promptLoader';

export interface MegallmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class MegallmClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string, baseURL?: string, model?: string) {
    const key = apiKey || process.env.MEGALLM_API_KEY || '';
    const url = baseURL || process.env.MEGALLM_API_URL || 'https://ai.megallm.io/v1';

    if (!key) {
      throw new Error('MEGALLM_API_KEY is not set in environment variables');
    }

    this.client = new OpenAI({
      baseURL: url,
      apiKey: key,
    });

    // Use model from env or parameter, default to deepseek-r1-distill-llama-70b (free tier)
    this.model = model || process.env.NEXT_PUBLIC_MEGALLM_MODEL || 'deepseek-r1-distill-llama-70b';
  }

  async chat(messages: MegallmMessage[], options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || this.model,
        messages: messages as any,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens,
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from Megallm API');
      }

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Megallm API Error:', error);
      throw error;
    }
  }

  /**
   * Filter resume data to exclude sections that don't need refinement
   * Personal info (contact details) doesn't need AI enhancement
   */
  private filterResumeForRefinement(resumeData: any): any {
    const { personal, ...refinableData } = resumeData;
    return refinableData;
  }

  /**
   * Merge refined data back with original personal info
   */
  private mergeWithPersonalInfo(refinedData: any, originalPersonal: any): any {
    return {
      personal: originalPersonal,
      ...refinedData
    };
  }

  /**
   * Refine resume with JD optimization (Pathway 2)
   * Uses job description to optimize resume for specific role
   * Note: Personal info (contact details) is excluded from AI refinement
   */
  async refineResumeWithJD(resumeData: any, jobDescription: string): Promise<any> {
    // Keep personal info separate - it doesn't need AI refinement
    const personalInfo = resumeData.personal;
    const dataToRefine = this.filterResumeForRefinement(resumeData);

    const systemPrompt = buildSystemMessage('resume-jd-optimization');
    const userPrompt = buildResumeRefinementMessage(dataToRefine, jobDescription);

    const messages: MegallmMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    console.log('Refining resume with JD optimization (excluding personal info)...');
    const response = await this.chat(messages, {
      temperature: 0.7,
      max_tokens: 4000,
    });

    const refinedData = extractJSON(response);
    
    // Merge back with original personal info
    return this.mergeWithPersonalInfo(refinedData, personalInfo);
  }

  /**
   * Refine resume without JD (Pathway 1)
   * General enhancement following Harvard guidelines
   * Note: Personal info (contact details) is excluded from AI refinement
   */
  async refineResumeGeneral(resumeData: any): Promise<any> {
    // Keep personal info separate - it doesn't need AI refinement
    const personalInfo = resumeData.personal;
    const dataToRefine = this.filterResumeForRefinement(resumeData);

    const systemPrompt = buildSystemMessage('resume-refinement');
    const userPrompt = buildResumeRefinementMessage(dataToRefine);

    const messages: MegallmMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    console.log('Refining resume with general enhancement (excluding personal info)...');
    const response = await this.chat(messages, {
      temperature: 0.7,
      max_tokens: 4000,
    });

    const refinedData = extractJSON(response);
    
    // Merge back with original personal info
    return this.mergeWithPersonalInfo(refinedData, personalInfo);
  }

  /**
   * Legacy method - Routes to appropriate refinement pathway
   * @deprecated Use refineResumeWithJD or refineResumeGeneral directly
   */
  async refineResume(resumeData: any, jobDescription?: string): Promise<any> {
    if (jobDescription && jobDescription.trim()) {
      return this.refineResumeWithJD(resumeData, jobDescription);
    } else {
      return this.refineResumeGeneral(resumeData);
    }
  }
}

// Export singleton instance (server-side only)
export const aiClient = typeof window === 'undefined' 
  ? new MegallmClient()
  : null;
