import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserBySession } from '@/lib/db/auth';
import { seedMockChatHistory } from '@/lib/db/seed-mock-chat';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = getUserBySession(sessionToken);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    seedMockChatHistory(user.id);
    
    return NextResponse.json({ success: true, message: 'Mock chat history seeded' });
  } catch (error) {
    console.error('Seed mock chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

