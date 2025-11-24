"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Eye, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog"

export default function DocumentSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [similarityCutoff, setSimilarityCutoff] = useState(23)
  const [maxResults, setMaxResults] = useState(10)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(true)
  const [currentPreviewResult, setCurrentPreviewResult] = useState<SearchResult | null>(null)

  // Get preview PDF URL from selected result
  const previewPdfUrl = currentPreviewResult?.url || "/ml-course/slides/slides00.pdf"

  // Интерфейс для результатов поиска
  interface SearchResult {
    id: string
    title: string
    ingestDate: string
    url?: string
    category?: string
  }

  // ML Course files - loaded from API
  const [mlFiles, setMlFiles] = useState<Array<{id: string, name: string, url: string, category: string}>>([])
  
  // Load ML course files on mount
  useEffect(() => {
    fetch('/api/ai/files')
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setMlFiles(data.files.map((f: any) => ({
            id: f.id,
            name: f.name,
            url: f.url,
            category: f.category
          })))
        }
      })
      .catch(err => console.error('Error loading ML course files:', err))
  }, [])
  
  // Convert ML files to search results format
  const getMockResults = (): SearchResult[] => {
    return mlFiles.slice(0, maxResults).map((file, index) => ({
      id: `${index + 1}/${mlFiles.length}`,
      title: file.name.replace('.pdf', ''),
      ingestDate: new Date().toISOString(),
      url: file.url,
      category: file.category
    }))
  }
  
  const mockResults = getMockResults()

  // Функция поиска
  const handleSearch = () => {
    // Filter ML course files based on search query
    const filtered = mlFiles
      .filter(file => {
        const queryLower = searchQuery.toLowerCase()
        return file.name.toLowerCase().includes(queryLower) || 
               file.category.toLowerCase().includes(queryLower)
      })
      .slice(0, maxResults)
      .map((file, index) => ({
        id: `${index + 1}/${mlFiles.length}`,
        title: file.name.replace('.pdf', ''),
        ingestDate: new Date().toISOString(),
        url: file.url,
        category: file.category
      }))
    
    setSearchResults(filtered.length > 0 ? filtered : mockResults)
    setShowResults(true)
  }

  const handlePreviewOpen = (result: SearchResult) => {
    setCurrentPreviewResult(result)
  }

  const handlePreviewClose = () => {
    setCurrentPreviewResult(null)
  }

  return (
    <div className="h-screen flex flex-col p-4 md:p-6 overflow-hidden bg-gray-100">
      {/* Хедер страницы */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Document Search</h1>
        {/* Navigation buttons removed as per previous steps or assumptions */}
      </div>
      
      {/* Основной контент в двух колонках на больших экранах */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(350px,_1fr)_2fr] gap-6 h-full overflow-hidden">
        {/* Колонка поиска */} 
        <div className="h-full overflow-y-auto pb-4 pr-2">
          {/* Search Card removed border/shadow */}
          <div className="h-full p-4 space-y-6">
            {/* Поле семантического поиска */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Semantic Search</p>
              <Input
                type="text"
                placeholder="Enter search query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Опции семантического поиска */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Similarity cutoff %</span>
                <span className="text-sm font-medium">{similarityCutoff}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">0</span>
                <Slider
                  value={[similarityCutoff]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSimilarityCutoff(value[0])}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500">100</span>
              </div>
            </div>
            
            
            {/* Настройки результатов */}
            <div>
              <p className="text-sm mb-1">Max results:</p>
              <Input
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="w-full"
                min={1}
                max={100}
              />
            </div>
            
            {/* Типы документов */}
            <div>
              <p className="text-sm mb-1">Document types:</p>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="wordDocument" defaultChecked className="rounded" />
                <label htmlFor="wordDocument" className="text-sm">word-document</label>
              </div>
            </div>
            
            <Button 
              onClick={handleSearch}
              className="w-full"
            >
              Search
            </Button>
          </div>
        </div>
        
        {/* Колонка результатов */} 
        <div className="h-full overflow-y-auto pb-4 pr-2">
          {showResults && (
            <div className="h-full p-4">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="p-3 border-b">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-medium break-words flex-1">
                        [{result.id}] {result.title}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 flex-shrink-0" 
                        onClick={() => handlePreviewOpen(result)} >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview Document</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {result.category && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                          {result.category}
                        </span>
                      )}
                      <p className="text-xs text-gray-500">Ingest Date: {result.ingestDate}</p>
                    </div>
                    
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer">Document Info</summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                        <p>ML Course document: {result.title}</p>
                        {result.url && (
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-2 inline-block"
                          >
                            Open PDF →
                          </a>
                        )}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={!!currentPreviewResult} onOpenChange={(isOpen) => !isOpen && handlePreviewClose()}>
        <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b flex flex-row justify-between items-center flex-shrink-0">
            <DialogTitle className="text-base truncate" title={currentPreviewResult?.title}>{currentPreviewResult?.title}</DialogTitle>
            {/* Используем стандартный крестик Dialog, свою кнопку убрали */}
          </DialogHeader>
          <div className="flex-grow overflow-hidden">
            <iframe 
              src={previewPdfUrl} 
              className="w-full h-full border-0" 
              title={`Preview of ${currentPreviewResult?.title}`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 