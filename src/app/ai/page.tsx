'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileUploader } from '@/components/ai/FileUploader';
import { FileList } from '@/components/ai/FileList';
import { ChatInterface } from '@/components/ai/ChatInterface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AIPage() {
  const searchParams = useSearchParams();
  const fileParam = searchParams.get('file');
  
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  
  // Эффект для загрузки файла из параметра URL
  useEffect(() => {
    if (fileParam) {
      // Извлекаем имя файла из URL
      const fileName = fileParam.split('/').pop() || 'document.pdf';
      
      // Устанавливаем имя файла (ID файла будет установлен после загрузки)
      setSelectedFileName(fileName);
    }
  }, [fileParam]);
  
  // Обработчик выбора файла
  const handleFileSelect = (fileId: string, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
  };
  
  // Обработчик загрузки файла
  const handleFileUploaded = (fileId: string, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold mb-2">AI Assistant for Document Analysis</h1>
      <p className="text-muted-foreground mb-8">
        Upload a PDF file and ask questions about its content
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Левая колонка: Загрузка и список файлов */}
        <div className="space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <FileUploader onFileUploaded={handleFileUploaded} />
            </TabsContent>
            
            <TabsContent value="files">
              <FileList 
                onFileSelect={handleFileSelect} 
                selectedFileId={selectedFileId} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Правая колонка: Чат с AI */}
        <div className="md:col-span-2">
          <ChatInterface 
            selectedFileId={selectedFileId} 
            selectedFileName={selectedFileName} 
          />
        </div>
      </div>
    </div>
  );
} 