import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { File, Trash2, RefreshCw } from 'lucide-react';

// Интерфейс для файла
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  category?: string;
  url?: string;
}

interface FileListProps {
  onFileSelect: (fileId: string, fileName: string) => void;
  selectedFileId?: string;
}

export function FileList({ onFileSelect, selectedFileId }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Загружаем список файлов при монтировании компонента
  useEffect(() => {
    fetchFiles();
  }, []);

  // Функция для загрузки списка файлов
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ai/files');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки списка файлов');
      }
      
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Ошибка загрузки списка файлов:', error);
      toast.error('Не удалось загрузить список файлов');
    } finally {
      setIsLoading(false);
    }
  };

  // Note: ML course files are read-only, deletion is disabled
  const deleteFile = async (fileId: string) => {
    toast.info('ML course files are read-only');
  };

  // Функция для форматирования размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Функция для форматирования даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Функция для выбора файла
  const handleFileSelect = (fileId: string, fileName: string) => {
    onFileSelect(fileId, fileName);
  };

  // Group files by category
  const filesByCategory = files.reduce((acc, file) => {
    const category = (file as any).category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  const categoryLabels: Record<string, string> = {
    slides: 'Slides',
    exercises: 'Exercises',
    solutions: 'Solutions',
    'exam-prep': 'Exam Prep',
    other: 'Other',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">ML Course Files</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchFiles}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {files.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          {isLoading ? 'Loading...' : 'No files available'}
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(filesByCategory).map(([category, categoryFiles]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase">
                {categoryLabels[category] || category}
              </h4>
              <div className="space-y-2">
                {categoryFiles.map((file) => (
                  <Card
                    key={file.id}
                    className={`p-4 flex items-center justify-between transition-colors ${
                      selectedFileId === file.id ? 'bg-primary/5 border-primary/50' : ''
                    }`}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center flex-1 justify-start p-0 h-auto"
                      onClick={() => handleFileSelect(file.id, file.name)}
                    >
                      <File className="w-5 h-5 mr-3 text-primary" />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                      </div>
                    </Button>
                    <a
                      href={file.url || `/ml-course/${category}/${file.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 ml-2 p-1"
                      onClick={(e) => e.stopPropagation()}
                      title="Open in new tab"
                    >
                      <File className="w-4 h-4" />
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 