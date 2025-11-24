import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getMLCourseFiles } from '@/app/api/ai/files/route';

export async function POST(request: NextRequest) {
  try {
    const files = getMLCourseFiles();
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/documents/ingest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: file.id,
            filePath: file.url,
            fileName: file.name,
            category: file.category,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          results.push({ file: file.name, status: 'success', ...data });
        } else {
          errors.push({ file: file.name, status: 'error', error: data.error });
        }
      } catch (error) {
        errors.push({ 
          file: file.name, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: files.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    console.error('Error ingesting all documents:', error);
    return NextResponse.json(
      { error: 'Failed to ingest documents', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

