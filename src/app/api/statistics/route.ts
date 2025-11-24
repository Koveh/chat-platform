import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserBySession } from '@/lib/db/auth';
import { getUserChats, getChatHistory } from '@/lib/db/chat-history';
import db from '@/lib/db/sqlite';

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

    // Get user's chats
    const userChats = getUserChats(user.id);
    
    // Calculate statistics
    let totalMessages = 0;
    let mostActiveChat = '';
    let maxMessages = 0;
    const recentActivity: Array<{
      chatId: string;
      lastMessage: string;
      timestamp: string;
    }> = [];

    for (const chat of userChats) {
      const history = getChatHistory(user.id, chat.chat_id);
      const messageCount = history.length;
      totalMessages += messageCount;

      if (messageCount > maxMessages) {
        maxMessages = messageCount;
        mostActiveChat = chat.chat_id;
      }

      if (history.length > 0) {
        const lastMsg = history[history.length - 1];
        recentActivity.push({
          chatId: chat.chat_id,
          lastMessage: lastMsg.content.substring(0, 100),
          timestamp: lastMsg.timestamp
        });
      }
    }

    // Sort recent activity by timestamp
    recentActivity.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Get total users count
    const totalUsersResult = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const totalUsers = totalUsersResult.count;

    const statistics = {
      totalChats: userChats.length,
      totalMessages,
      totalUsers,
      averageMessagesPerChat: userChats.length > 0 ? totalMessages / userChats.length : 0,
      mostActiveChat: mostActiveChat || 'N/A',
      recentActivity: recentActivity.slice(0, 10) // Last 10 activities
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Get statistics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

