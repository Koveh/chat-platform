import db from './sqlite';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export interface DocumentChunk {
  id: number;
  file_id: string;
  chunk_index: number;
  content: string;
  metadata: string;
  created_at: string;
}

export interface Document {
  id: number;
  file_id: string;
  file_name: string;
  file_path: string;
  category: string;
  content: string;
  chunk_count: number;
  created_at: string;
  updated_at: string;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    category TEXT,
    content TEXT,
    chunk_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS document_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES documents(file_id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_documents_file_id ON documents(file_id);
  CREATE INDEX IF NOT EXISTS idx_chunks_file_id ON document_chunks(file_id);
  CREATE INDEX IF NOT EXISTS idx_chunks_file_chunk ON document_chunks(file_id, chunk_index);
`);

export function saveDocument(fileId: string, fileName: string, filePath: string, category: string, content: string): Document {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO documents (file_id, file_name, file_path, category, content, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  
  stmt.run(fileId, fileName, filePath, category, content);
  
  const doc = db.prepare('SELECT * FROM documents WHERE file_id = ?').get(fileId) as Document;
  return doc;
}

export function saveDocumentChunks(fileId: string, chunks: Array<{ content: string; metadata?: any }>): void {
  const deleteStmt = db.prepare('DELETE FROM document_chunks WHERE file_id = ?');
  deleteStmt.run(fileId);
  
  const insertStmt = db.prepare(`
    INSERT INTO document_chunks (file_id, chunk_index, content, metadata)
    VALUES (?, ?, ?, ?)
  `);
  
  chunks.forEach((chunk, index) => {
    insertStmt.run(fileId, index, chunk.content, JSON.stringify(chunk.metadata || {}));
  });
  
  const updateStmt = db.prepare('UPDATE documents SET chunk_count = ? WHERE file_id = ?');
  updateStmt.run(chunks.length, fileId);
}

export function getDocument(fileId: string): Document | null {
  const stmt = db.prepare('SELECT * FROM documents WHERE file_id = ?');
  const doc = stmt.get(fileId) as Document | undefined;
  return doc || null;
}

export function getDocumentChunks(fileId: string, limit?: number): DocumentChunk[] {
  let query = 'SELECT * FROM document_chunks WHERE file_id = ? ORDER BY chunk_index ASC';
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  const stmt = db.prepare(query);
  return stmt.all(fileId) as DocumentChunk[];
}

export function searchDocumentChunks(fileId: string, searchText: string, limit: number = 5): DocumentChunk[] {
  const stmt = db.prepare(`
    SELECT * FROM document_chunks 
    WHERE file_id = ? AND content LIKE ? 
    ORDER BY chunk_index ASC 
    LIMIT ?
  `);
  return stmt.all(fileId, `%${searchText}%`, limit) as DocumentChunk[];
}

export function getAllDocuments(): Document[] {
  const stmt = db.prepare('SELECT * FROM documents ORDER BY created_at DESC');
  return stmt.all() as Document[];
}

export function deleteDocument(fileId: string): void {
  db.prepare('DELETE FROM documents WHERE file_id = ?').run(fileId);
  db.prepare('DELETE FROM document_chunks WHERE file_id = ?').run(fileId);
}

