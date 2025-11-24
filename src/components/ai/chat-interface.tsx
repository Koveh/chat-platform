"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Send, Sparkles, Loader2, Trash2, CornerDownLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { getCookie, setCookie } from "cookies-next"
import { motion, AnimatePresence } from "framer-motion"
import { IconsUnderAnswer } from "@/components/layout/icons-under-answer"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Message interface
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
}

// Function to generate stable IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 10)
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Initialize chat only on client after first render
  useEffect(() => {
    if (isInitialized) return

    const chatId = "simple_chat"
    const chatHistory = getCookie(chatId)

    if (chatHistory) {
      try {
        const parsedHistory = JSON.parse(chatHistory as string)
        setMessages(parsedHistory)
      } catch (error) {
        console.error("Error loading chat history:", error)
        initializeSystemMessage()
      }
    } else {
      initializeSystemMessage()
    }

    setIsInitialized(true)
  }, [])

  // Function to initialize system message
  const initializeSystemMessage = () => {
    const systemMessage: Message = {
      id: "system-1",
      role: "system",
      content:
        "You are an office assistant. Answer questions about finances, stocks and investments. Answer in the given language.",
      timestamp: new Date().toISOString(),
    }
    setMessages([systemMessage])
  }

  // Save message history to cookies when changed
  useEffect(() => {
    if (messages.length > 0 && isInitialized) {
      try {
        const chatId = "simple_chat"
        setCookie(chatId, JSON.stringify(messages), {
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      } catch (error) {
        console.error("Error saving chat history:", error)
      }
    }
  }, [messages, isInitialized])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Send message function
  const sendMessage = async () => {
    if (!input.trim()) return

    // Create new user message
    const userMessage: Message = {
      id: `user-${generateId()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare message history for API
      const history = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }))

      // Send request to API
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          history: history,
        }),
      })

      if (!response.ok) {
        throw new Error("Error processing request")
      }

      // Get JSON response
      const data = await response.json()

      // Create new assistant message
      const assistantMessage: Message = {
        id: `assistant-${generateId()}`,
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toISOString(),
      }

      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to get AI response")
    } finally {
      setIsLoading(false)
    }
  }

  // Clear chat history
  const clearChat = () => {
    // Create new system message
    const systemMessage: Message = {
      id: `system-${generateId()}`,
      role: "system",
      content:
        "You are a financial assistant. Answer questions about finances, stocks and investments. Answer in the given language.",
      timestamp: new Date().toISOString(),
    }

    // Set only system message
    setMessages([systemMessage])

    // Notify user
    toast.success("Chat history cleared")
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Show empty container until initialized on client
  if (!isInitialized) {
    return <div className="flex flex-col h-full"></div>
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Chat header */}
      <div className="py-4 px-10 flex justify-between items-center">
        <h2 className="text-xl font-bold">New theme</h2>
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

      {/* Messages area - only this should scroll */}
      <div className="flex-1 overflow-y-auto px-10 relative" ref={chatContainerRef}>
        <div className="max-w-4xl mx-auto py-6">
          {messages.length <= 1 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground min-h-[400px]">
              <Sparkles className="w-12 h-12 mb-4 text-primary/50" />
              <h3 className="text-lg font-medium mb-2">Start a conversation with the assistant</h3>
              <p className="text-sm max-w-md">Ask about finances, documents, etc.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages
                  .filter((message) => message.role !== "system")
                  .map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start relative group"}`}
                    >
                      <div
                        className={`max-w-[85%] ${message.role === "user"
                            ? "bg-gray-100 text-gray-900 text-sm rounded-2xl rounded-br-none"
                            : "bg-[#005aa9]/10 backdrop-blur-sm text-sm rounded-2xl rounded-bl-none text-[#005aa9]"
                          } p-3`}
                      >
                        <div className="overflow-hidden">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                      {message.role === "assistant" && (
                        <div 
                          className={cn(
                            "absolute left-3 bottom-0 transition-opacity duration-200 z-10 pointer-events-none group-hover:pointer-events-auto",
                            isMobile ? "opacity-100 translate-y-full mt-0.5" : "opacity-0 group-hover:opacity-100 translate-y-full mt-1"
                          )}
                        >
                          <IconsUnderAnswer messageContent={message.content} />
                        </div>
                      )}
                    </motion.div>
                  ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#005aa9]/10 backdrop-blur-sm rounded-2xl rounded-bl-none p-3 flex items-center text-[#005aa9]">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="text-sm">Analyzing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Gradient overlay for messages at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Input field - fixed at bottom */}
      <div className="sticky bottom-0 bg-white py-4 px-10 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 resize-none min-h-[60px]"
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading} className="h-[60px] w-[60px]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex items-center">
            <CornerDownLeft className="w-3 h-3 mr-1" />
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  )
}

