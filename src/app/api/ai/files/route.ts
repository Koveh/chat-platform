import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  category: string;
  url: string;
}

// Get all PDF files from the ml-course directory
export function getMLCourseFiles(): FileItem[] {
  const mlCourseDir = path.join(process.cwd(), 'public', 'ml-course');
  const files: FileItem[] = [];
  
  const categories = ['slides', 'exercises', 'solutions', 'exam-prep'];
  
  categories.forEach((category) => {
    const categoryDir = path.join(mlCourseDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      return;
    }
    
    const categoryFiles = fs.readdirSync(categoryDir);
    
    categoryFiles.forEach((file) => {
      if (file.endsWith('.pdf')) {
        const filePath = path.join(categoryDir, file);
        const stats = fs.statSync(filePath);
        
        files.push({
          id: `ml-${category}-${file}`,
          name: file,
          size: stats.size,
          type: 'application/pdf',
          uploadedAt: stats.mtime.toISOString(),
          category: category,
          url: `/ml-course/${category}/${file}`,
        });
      }
    });
  });
  
  // Sort by category, then by name
  return files.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });
}

export async function GET() {
  try {
    const files = getMLCourseFiles();
    
    return NextResponse.json({
      files,
      total: files.length,
    });
  } catch (error) {
    console.error('Error fetching ML course files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

