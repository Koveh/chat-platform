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

  // Функция для удаления файла
  const deleteFile = async (fileId: string) => {
    try {
      setIsDeleting(fileId);
      const response = await fetch(`/api/ai/upload?fileId=${fileId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка удаления файла');
      }
      
      // Обновляем список файлов
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      toast.success('Файл успешно удален');
      
      // Если был выбран удаленный файл, сбрасываем выбор
      if (selectedFileId === fileId) {
        onFileSelect('', '');
      }
    } catch (error) {
      console.error('Ошибка удаления файла:', error);
      toast.error('Не удалось удалить файл');
    } finally {
      setIsDeleting(null);
    }
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Загруженные файлы</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchFiles}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {files.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          {isLoading ? 'Загрузка...' : 'Нет загруженных файлов'}
        </Card>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteFile(file.id)}
                disabled={isDeleting === file.id}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className={`w-4 h-4 ${isDeleting === file.id ? 'animate-spin' : ''}`} />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 