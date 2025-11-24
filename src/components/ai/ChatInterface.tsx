import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Bot, Loader2, Trash2, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getCookie, setCookie } from 'cookies-next';

// Интерфейс для сообщения
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedFileId?: string;
  selectedFileName?: string;
}

export function ChatInterface({ selectedFileId, selectedFileName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Загружаем историю сообщений из куки при первой загрузке
  useEffect(() => {
    const chatId = selectedFileId ? `chat_${selectedFileId}` : 'chat_default';
    const chatHistory = getCookie(chatId);
    
    if (chatHistory) {
      try {
        const parsedHistory = JSON.parse(chatHistory as string);
        setMessages(parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Ошибка при загрузке истории чата:', error);
      }
    } else {
      // Добавляем системное сообщение при первой загрузке
      const systemMessage: Message = {
        id: 'system-1',
        role: 'system',
        content: 'You are a financial assistant. Answer user questions about finances, stocks, and investments. Answer in English language.',
        timestamp: new Date()
      };
      setMessages([systemMessage]);
    }
  }, [selectedFileId]);
  
  // Сохраняем историю сообщений в куки при изменении
  useEffect(() => {
    if (messages.length > 0) {
      const chatId = selectedFileId ? `chat_${selectedFileId}` : 'chat_default';
      setCookie(chatId, JSON.stringify(messages), {
        maxAge: 60 * 60 * 24 * 7 // 7 дней
      });
    }
  }, [messages, selectedFileId]);

  // Прокручиваем чат вниз при добавлении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Функция для прокрутки чата вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Функция для отправки сообщения
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Создаем новое сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Добавляем контекст к сообщению пользователя, если выбран файл
    let userContent = input;
    if (selectedFileName) {
      userContent = `Context: I'm reading the file "${selectedFileName}"${selectedFileId ? ` (ID: ${selectedFileId})` : ''}.\n\nMy question: ${input}`;
      userMessage.content = userContent;
    }

    // Добавляем сообщение пользователя в чат
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Формируем сообщения для API
      const apiMessages = messages
        .filter(msg => msg.role !== 'system' || messages.indexOf(msg) === 0) // Оставляем только первое системное сообщение
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Добавляем сообщение пользователя
      apiMessages.push({
        role: 'user',
        content: userContent
      });

      // Отправляем запрос к API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userContent,
          history: apiMessages.filter(msg => msg.role !== 'system')
        }),
      });

      if (!response.ok) {
        throw new Error('Error processing request');
      }

      const data = await response.json();

      // Создаем новое сообщение от ассистента
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };

      // Добавляем сообщение ассистента в чат
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  // Очистка истории чата
  const clearChat = () => {
    // Создаем новое системное сообщение
    const systemMessage: Message = {
      id: 'system-' + Date.now(),
      role: 'system',
      content: 'You are a financial assistant. Answer user questions about finances, stocks, and investments. Answer in English language.',
      timestamp: new Date()
    };
    
    // Устанавливаем только системное сообщение
    setMessages([systemMessage]);
    
    // Уведомляем пользователя
    toast.success('Chat history cleared');
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок чата */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Chat with Financial Assistant</h2>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      {selectedFileName && (
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Context: {selectedFileName}
        </p>
      )}

      {/* Область сообщений */}
      <Card className="flex-1 overflow-y-auto p-4 mb-2 max-h-[500px]">
        {messages.length <= 1 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <Bot className="w-12 h-12 mb-4 text-primary/50" />
            <h3 className="text-lg font-medium mb-2">Start a conversation with the financial assistant</h3>
            <p className="text-sm max-w-md">
              Ask a question about financial data, stock analysis, or investments.
              {selectedFileName && ` The assistant will use context from "${selectedFileName}" file.`}
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
                  <span className="text-sm">Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card>

      {/* Поле ввода */}
      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your question..."
          className="flex-1 resize-none bg-muted/50 border-0 focus-visible:ring-1"
          rows={3}
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="h-12 w-12 rounded-full p-0"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CornerDownLeft className="w-5 h-5 font-bold" />
          )}
        </Button>
      </div>
    </div>
  );
} 