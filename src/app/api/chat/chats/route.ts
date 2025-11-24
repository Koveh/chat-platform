import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserBySession } from '@/lib/db/auth';
import { getUserChats } from '@/lib/db/chat-history';
import { getChatName } from '@/lib/db/chat-names';

export async function GET(request: NextRequest) {
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

    const chats = getUserChats(user.id);
    
    // Enhance chats with custom names if available
    const chatsWithNames = chats.map(chat => {
      const customName = getChatName(user.id, chat.chat_id);
      return {
        ...chat,
        name: customName || chat.last_message.substring(0, 50)
      };
    });
    
    return NextResponse.json({ chats: chatsWithNames });
  } catch (error) {
    console.error('Get user chats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

