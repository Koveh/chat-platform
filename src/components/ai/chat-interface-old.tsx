'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Sparkles, Loader2, Trash2, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getCookie, setCookie } from 'cookies-next';

// Интерфейс для сообщения
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string; // Изменено на string для предотвращения проблем с сериализацией
}

// Функция для генерации стабильных ID, не зависящих от времени
const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Инициализируем чат только на клиенте после первого рендера
  useEffect(() => {
    if (isInitialized) return; // Предотвращаем повторную инициализацию
    
    const chatId = 'simple_chat';
    const chatHistory = getCookie(chatId);
    
    if (chatHistory) {
      try {
        const parsedHistory = JSON.parse(chatHistory as string);
        setMessages(parsedHistory);
      } catch (error) {
        console.error('Ошибка при загрузке истории чата:', error);
        initializeSystemMessage();
      }
    } else {
      initializeSystemMessage();
    }
    
    setIsInitialized(true);
  }, []);
  
  // Функция для инициализации системного сообщения
  const initializeSystemMessage = () => {
    const systemMessage: Message = {
      id: 'system-1',
      role: 'system',
      content: 'You are an office ssistant. Answer questions about finances, stocks and investments. Answer in the given language.',
      timestamp: new Date().toISOString(),
    };
    setMessages([systemMessage]);
  };
  
  // Сохраняем историю сообщений в куки при изменении
  useEffect(() => {
    if (messages.length > 0 && isInitialized) {
      try {
        const chatId = 'simple_chat';
        setCookie(chatId, JSON.stringify(messages), {
          maxAge: 60 * 60 * 24 * 7 // 7 дней
        });
      } catch (error) {
        console.error('Ошибка при сохранении истории чата:', error);
      }
    }
  }, [messages, isInitialized]);

  // Функция для отправки сообщения
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Создаем новое сообщение пользователя
    const userMessage: Message = {
      id: `user-${generateId()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    // Добавляем сообщение пользователя в чат
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Подготовка истории сообщений для API
      const history = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

      // Отправляем запрос к API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          history: history
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обработке запроса');
      }

      // Получаем JSON ответ
      const data = await response.json();
      
      // Создаем новое сообщение от ассистента
      const assistantMessage: Message = {
        id: `assistant-${generateId()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
      };

      // Добавляем сообщение ассистента в чат
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      toast.error('Не удалось получить ответ от AI');
    } finally {
      setIsLoading(false);
    }
  };

  // Очистка истории чата
  const clearChat = () => {
    // Создаем новое системное сообщение
    const systemMessage: Message = {
      id: `system-${generateId()}`,
      role: 'system',
      content: 'You are a financial assistant. Answer questions about finances, stocks and investments. Answer in the given language.',
      timestamp: new Date().toISOString(),
    };
    
    // Устанавливаем только системное сообщение
    setMessages([systemMessage]);
    
    // Уведомляем пользователя
    toast.success('История чата очищена');
  };

  // Обработчик нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Показываем пустой контейнер до инициализации на клиенте
  if (!isInitialized) {
    return <div className="flex flex-col h-full"></div>;
  }

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 240px)' }}>
      {/* Заголовок чата */}
      <div className="mb-4 flex justify-between items-center blur-sm">
        <h2 className="text-xl font-bold">New theme</h2>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Очистить историю"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 mb-2 max-h-[500px]" ref={chatContainerRef}>
        {messages.length <= 1 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <Sparkles className="w-12 h-12 mb-4 text-primary/50" />
            <h3 className="text-lg font-medium mb-2">Start a conversation with the financial assistant</h3>
            <p className="text-sm max-w-md">
              Ask about finances, documents, etc.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages
              .filter(message => message.role !== 'system')
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-none'
                        : 'bg-muted/50 backdrop-blur-sm rounded-2xl rounded-bl-none'
                    } p-3`}
                  >
                    <div className="overflow-hidden">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/50 rounded-2xl rounded-bl-none p-3 flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 text-primary animate-spin" />
                  <span className="text-sm">Анализирую...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Поле ввода - фиксированное внизу */}
      <div className="mt-auto">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Задайте вопрос..."
            className="flex-1 resize-none min-h-[60px]"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground flex items-center">
          <CornerDownLeft className="w-3 h-3 mr-1" />
          <span>Нажмите Enter для отправки, Shift+Enter для новой строки</span>
        </div>
      </div>
    </div>
  );
} 