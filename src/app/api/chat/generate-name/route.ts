import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Use gpt-5-nano to generate a short chat name
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: 'Generate a short, descriptive title (3-5 words max) for a chat conversation based on the user\'s first question. Return only the title, nothing else. Make it concise and clear.'
          },
          {
            role: 'user',
            content: question.substring(0, 200) // Limit to first 200 chars
          }
        ],
        max_tokens: 20,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      // Fallback to simple extraction if API fails
      const words = question.split(' ').slice(0, 5).join(' ');
      return NextResponse.json({ name: words.length > 40 ? words.substring(0, 40) + '...' : words });
    }

    const data = await response.json();
    const name = data.choices[0]?.message?.content?.trim() || question.substring(0, 40);
    
    return NextResponse.json({ name });
  } catch (error) {
    console.error('Error generating chat name:', error);
    // Fallback to simple extraction
    try {
      const body = await request.json();
      const questionFallback = body.question || 'New Chat';
      const words = questionFallback.split(' ').slice(0, 5).join(' ');
      return NextResponse.json({ 
        name: words.length > 40 ? words.substring(0, 40) + '...' : words 
      });
    } catch {
      return NextResponse.json({ name: 'New Chat' });
    }
  }
}

