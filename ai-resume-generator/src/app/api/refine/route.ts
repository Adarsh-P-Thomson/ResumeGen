import { NextRequest, NextResponse } from 'next/server';
import { MegallmClient } from '@/ai/client';
import { Resume } from '@/core/schemas/resume.schema';

/**
 * POST /api/refine
 * Refine resume data using AI
 * 
 * Two pathways:
 * 1. General Enhancement: Refine resume without JD (improve clarity, metrics, Harvard standards)
 * 2. JD Optimization: Refine resume based on job description (ATS optimization + keyword matching)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData, jobDescription, model } = body;

    // Validate input
    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    // Initialize AI client with selected model
    const aiClient = new MegallmClient(
      process.env.MEGALLM_API_KEY,
      process.env.MEGALLM_API_URL,
      model || process.env.MEGALLM_MODEL || 'deepseek-r1-distill-llama-70b'
    );

    let refinedData: any;
    let pathway: string;

    // Determine which refinement pathway to use
    if (jobDescription && jobDescription.trim().length > 0) {
      // PATHWAY 2: JD-based optimization
      pathway = 'JD Optimization';
      console.log(`[AI Refinement] Using Pathway 2: JD-based optimization with model: ${model || 'default'}`);
      refinedData = await aiClient.refineResumeWithJD(resumeData, jobDescription.trim());
    } else {
      // PATHWAY 1: General enhancement
      pathway = 'General Enhancement';
      console.log(`[AI Refinement] Using Pathway 1: General enhancement with model: ${model || 'default'}`);
      refinedData = await aiClient.refineResumeGeneral(resumeData);
    }

    console.log(`[AI Refinement] Resume refined successfully using ${pathway}`);
    
    return NextResponse.json({
      success: true,
      refinedData,
      pathway,
      message: `Resume refined successfully using AI (${pathway})`,
    });

  } catch (error: any) {
    console.error('[AI Refinement] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to refine resume with AI',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
