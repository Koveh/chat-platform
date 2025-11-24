import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserBySession } from '@/lib/db/auth';
import { saveChatName } from '@/lib/db/chat-names';

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

    const { chatId, name } = await request.json();

    if (!chatId || !name) {
      return NextResponse.json(
        { error: 'chatId and name are required' },
        { status: 400 }
      );
    }

    saveChatName(user.id, chatId, name);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set chat name error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

