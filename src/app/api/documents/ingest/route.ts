import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { saveDocument, saveDocumentChunks, getDocument } from '@/lib/db/documents';

export async function POST(request: NextRequest) {
  try {
    const { fileId, filePath, fileName, category } = await request.json();

    if (!fileId || !filePath) {
      return NextResponse.json(
        { error: 'fileId and filePath are required' },
        { status: 400 }
      );
    }

    // Check if document already ingested
    const existingDoc = getDocument(fileId);
    if (existingDoc) {
      return NextResponse.json({
        success: true,
        message: 'Document already ingested',
        document: existingDoc
      });
    }

    // Resolve file path
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read and parse PDF
    const fileBuffer = fs.readFileSync(fullPath);
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The PDF might be image-based or corrupted.' },
        { status: 400 }
      );
    }

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);
    
    // Save document and chunks
    const document = saveDocument(
      fileId,
      fileName || path.basename(filePath),
      filePath,
      category || 'unknown',
      text.substring(0, 10000) // Store first 10k chars in main table
    );

    const chunkData = chunks.map((chunk, index) => ({
      content: chunk.pageContent,
      metadata: {
        ...chunk.metadata,
        pageNumber: pdfData.numpages > 0 ? Math.floor(index / (chunks.length / pdfData.numpages)) + 1 : null,
      }
    }));

    saveDocumentChunks(fileId, chunkData);

    return NextResponse.json({
      success: true,
      message: 'Document ingested successfully',
      document: {
        ...document,
        totalChunks: chunks.length,
        totalPages: pdfData.numpages,
        textLength: text.length
      }
    });
  } catch (error) {
    console.error('Error ingesting document:', error);
    return NextResponse.json(
      { error: 'Failed to ingest document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (fileId) {
      const doc = getDocument(fileId);
      if (!doc) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ document: doc });
    }

    const { getAllDocuments } = await import('@/lib/db/documents');
    const documents = getAllDocuments();
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

