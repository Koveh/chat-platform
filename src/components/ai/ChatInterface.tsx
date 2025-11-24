'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Bot, Loader2, Trash2, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedFileId?: string;
  selectedFileName?: string;
  chatId?: string;
}

export function ChatInterface({ selectedFileId, selectedFileName, chatId: propChatId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [isNewChat, setIsNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = propChatId || (selectedFileId ? `chat_${selectedFileId}` : 'default');

  // Check if this is a new chat
  useEffect(() => {
    if (propChatId && propChatId.startsWith('chat_') && propChatId !== 'chat_default' && !propChatId.includes('ml-')) {
      setIsNewChat(true);
    } else {
      setIsNewChat(false);
    }
  }, [propChatId]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await fetch(`/api/chat/history?chatId=${chatId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.history && data.history.length > 0) {
            const loadedMessages = data.history.map((msg: any) => ({
              id: msg.id.toString(),
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(loadedMessages);
          } else {
            const systemMessage: Message = {
              id: 'system-1',
              role: 'system',
              content: 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.',
              timestamp: new Date()
            };
            setMessages([systemMessage]);
          }
        } else {
          const systemMessage: Message = {
            id: 'system-1',
            role: 'system',
            content: 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.',
            timestamp: new Date()
          };
          setMessages([systemMessage]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        const systemMessage: Message = {
          id: 'system-1',
          role: 'system',
          content: 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.',
          timestamp: new Date()
        };
        setMessages([systemMessage]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [chatId]);

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
      
      // Save user message to database
      try {
        await fetch('/api/chat/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId,
            role: 'user',
            content: userContent
          })
        });
      } catch (error) {
        console.error('Error saving user message:', error);
      }

      setInput('');
      setIsLoading(true);

      try {
        // Ensure document is ingested if file is selected
        if (selectedFileId) {
          try {
            const ingestResponse = await fetch('/api/documents/ingest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileId: selectedFileId,
                filePath: selectedFileName ? `/ml-course/${selectedFileId.replace('ml-', '').replace(/-/g, '/')}` : undefined,
                fileName: selectedFileName || selectedFileId,
                category: selectedFileId.split('-')[1] || 'unknown',
              }),
            });
            // Ignore errors - document might already be ingested
          } catch (error) {
            console.error('Error ingesting document:', error);
          }
        }

        // Формируем сообщения для API
        const apiMessages = messages
          .filter(msg => msg.role !== 'system' || messages.indexOf(msg) === 0)
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
            query: input, // Use original input, not userContent with context
            fileId: selectedFileId,
            model: selectedModel,
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

        // Save assistant message to database
        try {
          await fetch('/api/chat/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId,
              role: 'assistant',
              content: data.answer
            })
          });
        } catch (error) {
          console.error('Error saving assistant message:', error);
        }

        // If this is a new chat and it's the first user message, generate a name
        if (isNewChat && messages.filter(m => m.role === 'user').length === 0) {
          try {
            const nameResponse = await fetch('/api/chat/generate-name', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: input })
            });
            if (nameResponse.ok) {
              const nameData = await nameResponse.json();
              // Save chat name to database
              await fetch('/api/chat/set-name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chatId,
                  name: nameData.name
                })
              });
            }
          } catch (error) {
            console.error('Error generating chat name:', error);
          }
        }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      const response = await fetch(`/api/chat/history?chatId=${chatId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const systemMessage: Message = {
          id: 'system-' + Date.now(),
          role: 'system',
          content: 'You are a helpful AI assistant. Answer user questions clearly and concisely. Answer in English language.',
          timestamp: new Date()
        };
        setMessages([systemMessage]);
        toast.success('Chat history cleared');
      } else {
        toast.error('Failed to clear chat history');
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('Failed to clear chat history');
    }
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
        <h2 className="text-xl font-bold">Chat with AI Assistant</h2>
        <div className="flex items-center gap-3">
          {/* Model Selection */}
          <div className="flex items-center gap-2">
            <label htmlFor="model-select" className="text-sm text-gray-600 font-medium">
              Model:
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-5-mini">gpt-5-mini</option>
              <option value="gpt-5-nano">gpt-5-nano</option>
              <option value="gpt-5">gpt-5</option>
            </select>
          </div>
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
      </div>
      {selectedFileName && (
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Context: {selectedFileName}
        </p>
      )}

      {/* Область сообщений */}
      <Card className="flex-1 overflow-y-auto p-4 mb-2 max-h-[500px]">
        {isLoadingHistory ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <Loader2 className="w-8 h-8 mb-4 text-primary animate-spin" />
            <p className="text-sm">Loading chat history...</p>
          </div>
        ) : messages.length <= 1 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <Bot className="w-12 h-12 mb-4 text-primary/50" />
            <h3 className="text-lg font-medium mb-2">Start a conversation with the AI assistant</h3>
            <p className="text-sm max-w-md">
              Ask a question and the assistant will help you.
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
                        ? 'bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-br-none'
                        : 'bg-gray-100 rounded-2xl rounded-bl-none'
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
                <div className="bg-gray-100 rounded-2xl rounded-bl-none p-3 flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 text-gray-600 animate-spin" />
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
          className="flex-1 resize-none bg-white border border-gray-300 focus-visible:ring-1 focus-visible:ring-blue-500"
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