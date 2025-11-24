import db from './sqlite';

export interface ChatName {
  chat_id: string;
  user_id: number;
  name: string;
  created_at: string;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS chat_names (
    chat_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_chat_names_user ON chat_names(user_id);
`);

export function saveChatName(userId: number, chatId: string, name: string): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO chat_names (chat_id, user_id, name, created_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);
  stmt.run(chatId, userId, name);
}

export function getChatName(userId: number, chatId: string): string | null {
  const stmt = db.prepare('SELECT name FROM chat_names WHERE user_id = ? AND chat_id = ?');
  const result = stmt.get(userId, chatId) as { name: string } | undefined;
  return result?.name || null;
}

