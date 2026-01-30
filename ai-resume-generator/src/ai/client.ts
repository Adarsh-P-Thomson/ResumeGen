/**
 * Megallm AI Client
 * Handles communication with Megallm API for resume refinement
 */

export interface MegallmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MegallmRequest {
  model?: string;
  messages: MegallmMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface MegallmResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class MegallmClient {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey?: string, apiUrl?: string) {
    this.apiKey = apiKey || process.env.MEGALLM_API_KEY || '';
    this.apiUrl = apiUrl || process.env.MEGALLM_API_URL || 'https://api.megallm.com/v1/chat/completions';

    if (!this.apiKey) {
      throw new Error('MEGALLM_API_KEY is not set in environment variables');
    }
  }

  async chat(messages: MegallmMessage[], options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }): Promise<string> {
    const request: MegallmRequest = {
      model: options?.model || 'gpt-4',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Megallm API error: ${response.status} - ${errorText}`);
      }

      const data: MegallmResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Megallm API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Megallm API Error:', error);
      throw error;
    }
  }

  async refineResume(resumeData: any, jobDescription: string): Promise<any> {
    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. Your task is to refine resume data to match a specific job description while maintaining Harvard formatting standards.

Rules:
1. Keep all factual information (names, dates, companies) unchanged
2. Rewrite bullet points to highlight relevant skills and achievements for the job
3. Use action verbs and quantifiable metrics
4. Optimize for ATS (Applicant Tracking Systems)
5. Maintain professional, concise language
6. Return ONLY valid JSON with the same structure as input
7. Do not add fictional experiences or qualifications`;

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
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    try {
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Failed to parse AI response:', jsonText);
      throw new Error('AI returned invalid JSON format');
    }
  }
}

// Export singleton instance (server-side only)
export const aiClient = typeof window === 'undefined' 
  ? new MegallmClient()
  : null;
