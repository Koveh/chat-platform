"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"

// Компонент-контейнер для страницы
function PageContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-7xl mx-auto px-1 sm:px-2 md:px-4 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
}

export default function DocumentDeepDivePage() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [activeDocument, setActiveDocument] = useState("") 
  const tokensConsumed = "856/128000" // Это будет динамическое значение

  // Предустановленные вопросы для выбора
  const preparedQuestions = [
    "what is the main concept in this document?",
    "explain the main metrics mentioned in the document",
    "what are the limitations of the described process?",
    "what are the conclusions that can be drawn based on the data?",
    "how are different parts of the document related?"
  ]

  // Обработка отправки запроса
  const handleSubmitQuestion = async () => {
    if (!question.trim()) return
    
    setIsLoading(true)
    setShowAnswer(false)
    
    // Имитация запроса к API
    setTimeout(() => {
      setIsLoading(false)
      setShowAnswer(true)
    }, 1500)
  }

  // Выбор предустановленного вопроса
  const handleSelectQuestion = (q: string) => {
    setQuestion(q)
  }

  return (
    <PageContainer>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Deep Dive</h1>
        </div>
        
        <div className="space-y-6">
          {/* Кнопка для очистки выделения */}
          <div>
            <Button variant="outline" size="sm">
              Clear Selection
            </Button>
          </div>
          
          {/* Опции отладки */}
          <Card className="shadow-sm">
            <CardHeader className="py-3">
              <CardTitle>
                <button className="flex w-full justify-between items-center text-left">
                  DEBUG OPTIONS
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transform rotate-180 h-4 w-4"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </CardTitle>
            </CardHeader>
          </Card>
          
          {/* Активный документ и фрагменты */}
          <Card className="shadow-sm">
            <CardHeader className="py-3">
              <CardTitle>
                <button className="flex w-full justify-between items-center text-left">
                  Active Document and Chunks
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transform rotate-180 h-4 w-4"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </CardTitle>
            </CardHeader>
          </Card>
          
          {/* Счетчик токенов */}
          <div className="text-sm text-gray-500">
            Tokens consumed by documents: {tokensConsumed}
          </div>
          
          {/* Форма запроса */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Pick a prepared question to ask:</label>
              <div className="relative">
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10"
                  onChange={(e) => handleSelectQuestion(e.target.value)}
                  value="Pick one"
                >
                  <option disabled>Pick one</option>
                  {preparedQuestions.map((q, i) => (
                    <option key={i} value={q}>{q}</option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Or input your own question</label>
              <Textarea 
                placeholder="Tell me a story about camels"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            
            <Button 
              onClick={handleSubmitQuestion} 
              disabled={!question.trim() || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Ask My Own Question
                </>
              )}
            </Button>
          </div>
          
          {/* Результат ответа */}
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-700 p-4 border-l-4 border-red-500 bg-red-50"
            >
              <p>
                I'm afraid your request to tell you a story about camels cannot be fulfilled given the data provided. 
                The content currently available includes technical information and documentation related to specific 
                product and accounting frameworks used by msg life central europe gmbh.
              </p>
              <p className="mt-4">
                If you have other specific requests related to the information present in these documents, I'd be happy to help!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageContainer>
  )
} 