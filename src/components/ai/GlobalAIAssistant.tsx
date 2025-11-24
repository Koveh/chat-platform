"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, User, Loader2, Sparkles, AtomIcon, X, Trash2, CornerDownLeft } from 'lucide-react';
import { Stock } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface GlobalAIAssistantProps {
  stock?: Stock;
}

export function GlobalAIAssistant({ stock: propStock }: GlobalAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [stock, setStock] = useState<Stock | null>(propStock || null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  
  // Определяем, находимся ли мы на странице акции
  const isStockPage = pathname?.startsWith('/stock/');
  
  // Инициализация чата
  useEffect(() => {
    // Загрузка истории сообщений из localStorage
    const localStorageKey = isStockPage ? `chat_${pathname}` : 'chat_global';
    const savedChat = getCookie(localStorageKey);
    
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat as string);
        setMessages(parsedChat);
      } catch (e) {
        console.error('Failed to load chat history:', e);
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, [pathname, isStockPage]);

  // Инициализация чата с новым системным сообщением
  const initializeChat = () => {
    const systemMessage: Message = {
      id: 'system-1',
      role: 'system',
      content: 'You are a financial assistant. Answer user questions about finances, stocks, and investments. Answer in English language.',
      timestamp: new Date()
    };
    setMessages([systemMessage]);
  };
  
  // Сохраняем историю сообщений в куки
  useEffect(() => {
    if (messages.length > 0) {
      const localStorageKey = isStockPage ? `chat_${pathname}` : 'chat_global';
      setCookie(localStorageKey, JSON.stringify(messages), {
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }
  }, [messages, isStockPage, pathname]);
  
  // Слушаем событие изменения акции
  useEffect(() => {
    // Обработчик события изменения акции
    const handleStockChange = (event: CustomEvent<Stock>) => {
      setStock(event.detail);
    };
    
    // Пытаемся получить данные о акции из sessionStorage при загрузке
    const storedStock = sessionStorage.getItem('currentStock');
    if (storedStock && isStockPage) {
      try {
        const parsedStock = JSON.parse(storedStock);
        setStock(parsedStock);
      } catch (error) {
        console.error('Ошибка при парсинге данных о акции:', error);
      }
    }
    
    // Добавляем слушатель события
    window.addEventListener('stockChanged', handleStockChange as EventListener);
    
    // Удаляем слушатель при размонтировании
    return () => {
      window.removeEventListener('stockChanged', handleStockChange as EventListener);
    };
  }, [isStockPage]);
  
  // Обновляем stock, если propStock изменился
  useEffect(() => {
    if (propStock) {
      setStock(propStock);
    }
  }, [propStock]);
  
  // Прокрутка чата вниз при добавлении новых сообщений
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

    // Добавляем информацию о текущей акции к сообщению пользователя, если мы на странице акции
    let userContent = input;
    if (isStockPage && stock) {
      userContent = `Context: I'm viewing information about ${stock.name} (${stock.symbol}). ${stock.description}\n\nMy question: ${input}`;
    }
    
    // Обновляем сообщение пользователя
    userMessage.content = userContent;

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
      
      // Создаем сообщение об ошибке
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Not available at the moment',
        timestamp: new Date(),
      };
      
      // Добавляем сообщение об ошибке в чат
      setMessages((prev) => [...prev, errorMessage]);
      
      // Показываем уведомление об ошибке
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

  // Обработчик нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Примеры быстрых вопросов в зависимости от контекста
  const getQuickQuestions = () => {
    if (isStockPage && stock) {
      return [
        `What are the growth prospects for ${stock.symbol}?`,
        `Explain key risks for investing in ${stock.symbol}`,
        `Compare ${stock.symbol} with competitors in the ${stock.sector || 'this sector'}`,
        `Should I buy ${stock.symbol} stock now?`
      ];
    } else {
      return [
        'How to evaluate fair stock value?',
        'What is P/E ratio and how to interpret it?',
        'Which ETFs are good for long-term investments?',
        'How to diversify an investment portfolio?'
      ];
    }
  };

  // Автоматическое изменение высоты текстового поля
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  }, []);

  // Получаем текст приветствия в зависимости от контекста
  const getWelcomeText = () => {
    if (isStockPage && stock) {
      return `Ask a question about ${stock.symbol} stock`;
    } else {
      return 'Ask a question about finance and investments';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Плавающие кнопки */}
      <div className="flex gap-2 mb-2 justify-end">
        {messages.length > 1 && (
          <motion.button
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-red-500/90 text-white"
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
        <motion.button
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-primary/90 to-primary text-primary-foreground"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Окно чата */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-[350px] sm:w-[400px] md:w-[450px] h-[500px] overflow-hidden shadow-xl flex flex-col bg-background/80 backdrop-blur-sm border-0">
              <CardContent 
                className="p-4 flex-grow overflow-y-auto custom-scrollbar"
                ref={chatContainerRef}
              >
                {messages.length <= 1 ? (
                  <div className="text-center space-y-6 h-full flex flex-col justify-center">
                    <div>
                      <Sparkles className="w-14 h-14 mx-auto mb-3 text-primary opacity-60" />
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        {getWelcomeText()}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 max-w-lg mx-auto">
                      {getQuickQuestions().map((question, index) => (
                        <Button 
                          key={index} 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs justify-start text-left h-auto py-2 hover:bg-primary/5"
                          onClick={() => {
                            setInput(question);
                            if (textareaRef.current) {
                              textareaRef.current.focus();
                              adjustTextareaHeight();
                            }
                          }}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
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
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-3 space-y-2">
                <div className="flex items-end gap-2 w-full">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      adjustTextareaHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your question..."
                    className="flex-1 min-h-[48px] max-h-[120px] resize-none bg-muted/50 border-0 focus-visible:ring-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-12 w-12 rounded-full shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CornerDownLeft className="w-5 h-5 font-bold" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 