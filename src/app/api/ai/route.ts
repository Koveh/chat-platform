import { NextRequest, NextResponse } from 'next/server';

// Интерфейс для запроса
interface AIRequest {
  query: string;
  fileId?: string;
  context?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

// Обработчик POST-запроса
export async function POST(req: NextRequest) {
  try {
    // Получаем данные запроса
    const body = await req.json();
    
    // Проверяем наличие обязательных полей
    if (!body.query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Получаем API ключ OpenAI из переменных окружения
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    // Извлекаем параметры запроса
    const { query, fileId, context, history = [] } = body as AIRequest;
    
    // Формируем сообщения для запроса
    const messages = [];
    
    // Добавляем системное сообщение
    messages.push({
      role: 'system',
      content: 'You are a financial assistant. Answer user questions using the provided context if available. If the context is insufficient, use your knowledge. Answer in English language.',
    });
    
    // Добавляем историю сообщений
    messages.push(
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      }))
    );
    
    // Добавляем запрос пользователя
    messages.push({
      role: 'user',
      content: query,
    });
    
    // Отправляем запрос к OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages,
        stream: false
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API ответил с ошибкой: ${response.statusText}`);
    }
    
    // Получаем ответ
    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    // Возвращаем ответ
    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error('Error processing AI request:', error);
    
    // Возвращаем ошибку
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
} 