/**
 * Megallm AI Client using OpenAI SDK
 * Handles communication with Megallm API for resume refinement
 * Using DeepSeek model for optimal reasoning and structured output
 */

import OpenAI from 'openai';

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

  async refineResume(resumeData: any, jobDescription: string): Promise<any> {
    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. Your task is to refine resume data to match a specific job description while maintaining Harvard formatting standards.

Rules:
1. Keep all factual information (names, dates, companies, schools) EXACTLY as provided - DO NOT change them
2. Rewrite bullet points to highlight relevant skills and achievements for the job
3. Use action verbs and quantifiable metrics where possible
4. Optimize for ATS (Applicant Tracking Systems) by including relevant keywords from job description
5. Maintain professional, concise language
6. Return ONLY valid JSON with the EXACT same structure as input
7. Do NOT add fictional experiences, qualifications, or inflate numbers
8. Focus on emphasizing existing relevant experience and skills

Important: Return ONLY the JSON object, no additional text, explanations, or markdown formatting.`;

    const userPrompt = `Job Description:
${jobDescription}

Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Please refine the resume data to better match this job description. Return ONLY the refined JSON data with the same structure.`;

    const messages: MegallmMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await this.chat(messages, {
      temperature: 0.7,
      max_tokens: 4000,
    });

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.trim();
    
    // Remove markdown code blocks (```json ... ``` or ``` ... ```)
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    try {
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Failed to parse AI response:', jsonText.substring(0, 500));
      throw new Error('AI returned invalid JSON format');
    }
  }
}

// Export singleton instance (server-side only)
export const aiClient = typeof window === 'undefined' 
  ? new MegallmClient()
  : null;
