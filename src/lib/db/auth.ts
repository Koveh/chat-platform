/**
 * Authentication functions using SQLite.
 */
import db from './sqlite';
import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';

export interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string;
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const passwordHash = await hash(password, 10);
  
  const stmt = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
  const result = stmt.run(email, passwordHash, name || null);
  
  return {
    id: result.lastInsertRowid as number,
    email,
    name: name || null,
    created_at: new Date().toISOString()
  };
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  
  if (!user) {
    return null;
  }
  
  const isValid = await compare(password, user.password_hash);
  if (!isValid) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at
  };
}

export function createSession(userId: number, expiresInDays: number = 365): Session {
  const sessionToken = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  
  const stmt = db.prepare('INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)');
  const result = stmt.run(userId, sessionToken, expiresAt.toISOString());
  
  return {
    id: result.lastInsertRowid as number,
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt.toISOString()
  };
}

export function getSession(sessionToken: string): Session | null {
  const session = db.prepare(`
    SELECT * FROM sessions 
    WHERE session_token = ? AND expires_at > datetime('now')
  `).get(sessionToken) as any;
  
  if (!session) {
    return null;
  }
  
  return {
    id: session.id,
    user_id: session.user_id,
    session_token: session.session_token,
    expires_at: session.expires_at
  };
}

export function getUserBySession(sessionToken: string): User | null {
  const session = getSession(sessionToken);
  if (!session) {
    return null;
  }
  
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(session.user_id) as any;
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at
  };
}

export function deleteSession(sessionToken: string): void {
  db.prepare('DELETE FROM sessions WHERE session_token = ?').run(sessionToken);
}

export function getUserById(userId: number): User | null {
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(userId) as any;
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at
  };
}

