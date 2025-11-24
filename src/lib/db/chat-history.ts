/**
 * Chat history functions using SQLite.
 */
import db from './sqlite';

export interface ChatMessage {
  id: number;
  user_id: number;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export function saveMessage(userId: number, chatId: string, role: 'user' | 'assistant' | 'system', content: string): ChatMessage {
  const stmt = db.prepare('INSERT INTO chat_history (user_id, chat_id, role, content) VALUES (?, ?, ?, ?)');
  const result = stmt.run(userId, chatId, role, content);
  
  return {
    id: result.lastInsertRowid as number,
    user_id: userId,
    chat_id: chatId,
    role,
    content,
    timestamp: new Date().toISOString()
  };
}

export function getChatHistory(userId: number, chatId: string): ChatMessage[] {
  const stmt = db.prepare(`
    SELECT * FROM chat_history 
    WHERE user_id = ? AND chat_id = ? 
    ORDER BY timestamp ASC
  `);
  
  return stmt.all(userId, chatId) as ChatMessage[];
}

export function getUserChats(userId: number): Array<{ chat_id: string; last_message: string; last_timestamp: string }> {
  const stmt = db.prepare(`
    SELECT 
      chat_id,
      content as last_message,
      timestamp as last_timestamp
    FROM chat_history
    WHERE user_id = ?
    AND id IN (
      SELECT MAX(id) 
      FROM chat_history 
      WHERE user_id = ? 
      GROUP BY chat_id
    )
    ORDER BY timestamp DESC
  `);
  
  return stmt.all(userId, userId) as Array<{ chat_id: string; last_message: string; last_timestamp: string }>;
}

export function deleteChat(userId: number, chatId: string): void {
  db.prepare('DELETE FROM chat_history WHERE user_id = ? AND chat_id = ?').run(userId, chatId);
}

