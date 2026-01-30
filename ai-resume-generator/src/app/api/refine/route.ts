import { NextRequest, NextResponse } from 'next/server';
import { MegallmClient } from '@/ai/client';
import { Resume } from '@/core/schemas/resume.schema';

/**
 * POST /api/refine
 * Refine resume data using AI based on job description
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData, jobDescription } = body;

    // Validate input
    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job description is required for AI refinement' },
        { status: 400 }
      );
    }

    // Initialize AI client
    const aiClient = new MegallmClient();

    // Refine resume data
    console.log('Refining resume with AI...');
    const refinedData = await aiClient.refineResume(resumeData, jobDescription);

    console.log('Resume refined successfully');
    
    return NextResponse.json({
      success: true,
      refinedData,
      message: 'Resume refined successfully using AI',
    });

  } catch (error: any) {
    console.error('AI Refinement Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to refine resume with AI',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
