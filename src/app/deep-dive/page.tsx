"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface File {
  id: string
  name: string
  url: string
  category: string
}

export default function DocumentDeepDivePage() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [loadingFiles, setLoadingFiles] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/ai/files')
        if (response.ok) {
          const data = await response.json()
          setFiles(data.files || [])
        }
      } catch (error) {
        console.error('Error fetching files:', error)
        toast.error('Failed to load files')
      } finally {
        setLoadingFiles(false)
      }
    }
    fetchFiles()
  }, [])

  const preparedQuestions = [
    "What is the main concept in this document?",
    "Explain the main metrics mentioned in the document",
    "What are the limitations of the described process?",
    "What are the conclusions that can be drawn based on the data?",
    "How are different parts of the document related?"
  ]

  const handleSelectQuestion = (q: string) => {
    setQuestion(q)
  }

  const handleClearSelection = () => {
    setSelectedFile(null)
    setQuestion("")
    setAnswer("")
  }

  const handleSubmitQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question')
      return
    }

    if (!selectedFile) {
      toast.error('Please select a document first')
      return
    }
    
    setIsLoading(true)
    setAnswer("")
    
    try {
      // Ensure document is ingested first
      const ingestResponse = await fetch('/api/documents/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: selectedFile.id,
          filePath: selectedFile.url,
          fileName: selectedFile.name,
          category: selectedFile.category,
        }),
      });

      if (!ingestResponse.ok) {
        const ingestData = await ingestResponse.json();
        // If it's not a "already ingested" error, show it
        if (!ingestData.message?.includes('already ingested')) {
          toast.error(`Failed to process document: ${ingestData.error || 'Unknown error'}`);
          setIsLoading(false);
          return;
        }
      }

      // Now ask the question with the ingested document
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: question,
          fileId: selectedFile.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      console.error('Error submitting question:', error)
      toast.error('Failed to get AI response')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-100 min-h-full">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Deep Dive</h1>
          {selectedFile && (
            <Button variant="outline" size="sm" onClick={handleClearSelection}>
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Document Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Document</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFiles ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading documents...</span>
                </div>
              ) : (
                <select
                  value={selectedFile?.id || ""}
                  onChange={(e) => {
                    const file = files.find(f => f.id === e.target.value)
                    setSelectedFile(file || null)
                    setAnswer("")
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a document to analyze</option>
                  {files.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.name} ({file.category})
                    </option>
                  ))}
                </select>
              )}
              {selectedFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Selected: {selectedFile.name}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Category: {selectedFile.category}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Question Form */}
          {selectedFile && (
            <Card>
              <CardHeader>
                <CardTitle>Ask Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pick a prepared question to ask:
                  </label>
                  <select
                    onChange={(e) => handleSelectQuestion(e.target.value)}
                    value={question}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Pick one</option>
                    {preparedQuestions.map((q, i) => (
                      <option key={i} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Or input your own question:
                  </label>
                  <Textarea 
                    placeholder="Enter your question about the document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button 
                  onClick={handleSubmitQuestion} 
                  disabled={!question.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Document...
                    </>
                  ) : (
                    "Ask Question"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Answer Display */}
          {answer && (
            <Card>
              <CardHeader>
                <CardTitle>Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{answer}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {!selectedFile && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Please select a document to start analyzing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 