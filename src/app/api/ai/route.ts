import { NextRequest, NextResponse } from 'next/server';
import { getDocument, getDocumentChunks, searchDocumentChunks } from '@/lib/db/documents';

// Интерфейс для запроса
interface AIRequest {
  query: string;
  fileId?: string;
  context?: string;
  model?: string;
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
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    // Извлекаем параметры запроса
    const { query, fileId, context, model, history = [] } = body as AIRequest;
    
    // Use selected model or fallback to default
    const selectedModel = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    
    // Получаем контекст документа, если указан fileId
    let documentContext = '';
    if (fileId) {
      const doc = getDocument(fileId);
      if (doc) {
        // Search for relevant chunks based on query
        const relevantChunks = searchDocumentChunks(fileId, query, 5);
        
        if (relevantChunks.length > 0) {
          documentContext = `\n\nDocument Context from "${doc.file_name}":\n\n${relevantChunks.map((chunk, i) => `[Chunk ${i + 1}]:\n${chunk.content}`).join('\n\n')}`;
        } else {
          // If no relevant chunks found, use first few chunks
          const chunks = getDocumentChunks(fileId, 3);
          if (chunks.length > 0) {
            documentContext = `\n\nDocument Context from "${doc.file_name}":\n\n${chunks.map((chunk, i) => `[Chunk ${i + 1}]:\n${chunk.content}`).join('\n\n')}`;
          }
        }
      }
    }
    
    // Формируем сообщения для запроса
    const messages = [];
    
    // Добавляем системное сообщение
    const systemMessage = documentContext
      ? `You are a helpful AI assistant. Answer user questions using the provided document context. Use the document content to provide accurate and detailed answers. If the document context doesn't contain relevant information, you can use your general knowledge, but always prioritize the document content. Answer in English language.`
      : 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.';
    
    messages.push({
      role: 'system',
      content: systemMessage,
    });
    
    // Добавляем историю сообщений
    messages.push(
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      }))
    );
    
    // Формируем запрос пользователя с контекстом
    const userQuery = documentContext 
      ? `${query}${documentContext}`
      : query;
    
    // Добавляем запрос пользователя
    messages.push({
      role: 'user',
      content: userQuery,
    });
    
    // Отправляем запрос к OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
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