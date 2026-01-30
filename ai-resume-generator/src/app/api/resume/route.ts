import { NextResponse } from "next/server";
import { 
  processResume, 
  validateResumeData, 
  exportResume,
  type Resume,
  type OutputFormat 
} from "@/core";
import { readFileSync } from 'fs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeData, format = 'txt', exportFile = false } = body;
    
    // Validate resume data
    const validation = validateResumeData(resumeData);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: "Invalid resume data", 
          details: validation.errors 
        },
        { status: 400 }
      );
    }
    
    // Validate format
    const validFormats: OutputFormat[] = ['txt', 'pdf', 'docx', 'html'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { 
          error: "Invalid format",
          details: `Format must be one of: ${validFormats.join(', ')}`
        },
        { status: 400 }
      );
    }
    
    // If user wants to export to file
    if (exportFile) {
      const exportResult = await exportResume(
        resumeData as Resume, 
        format as OutputFormat,
        body.filename
      );
      
      if (!exportResult.success) {
        return NextResponse.json(
          { error: exportResult.error },
          { status: 500 }
        );
      }
      
      // For PDF and DOCX, return file as download
      if (format === 'pdf' || format === 'docx') {
        const fileBuffer = readFileSync(exportResult.filePath!);
        const contentType = format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${body.filename || 'resume.' + format}"`,
          },
        });
      }
      
      // For text/html, return the file path and content
      return NextResponse.json({
        success: true,
        filePath: exportResult.filePath,
        format: exportResult.format,
      });
    }
    
    // Process resume (for preview/display)
    const result = processResume(resumeData as Resume, format as OutputFormat);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    // Return formatted resume
    return NextResponse.json({
      success: true,
      formattedResume: result.formattedResume,
      metadata: result.metadata,
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
