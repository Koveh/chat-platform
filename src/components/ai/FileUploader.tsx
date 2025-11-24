import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, File, X, Check } from 'lucide-react';

interface FileUploaderProps {
  onFileUploaded?: (fileId: string, fileName: string) => void;
}

export function FileUploader({ onFileUploaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Обработчик перетаскивания файла
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Обработчик выхода файла за пределы зоны
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Обработчик сброса файла
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Обработчик выбора файла через диалог
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Обработчик загрузки файла
  const handleFileUpload = async (file: File) => {
    // Проверяем тип файла
    if (file.type !== 'application/pdf') {
      toast.error('Поддерживаются только PDF-файлы');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);

      // Имитируем прогресс загрузки
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Отправляем файл на сервер
      const response = await fetch('/api/ai/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка загрузки файла');
      }

      setUploadProgress(100);

      // Получаем данные о загруженном файле
      const data = await response.json();

      // Вызываем колбэк с идентификатором файла
      if (onFileUploaded) {
        onFileUploaded(data.file.id, data.file.name);
      }

      toast.success('Файл успешно загружен');

      // Сбрасываем состояние через 1 секунду
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки файла');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Обработчик клика по кнопке выбора файла
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`p-6 border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center gap-4 py-4">
        {isUploading ? (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {uploadProgress === 100 ? (
                <Check className="w-6 h-6 text-primary" />
              ) : (
                <File className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-2">
                {uploadProgress === 100 ? 'Загрузка завершена' : 'Загрузка файла...'}
              </p>
              <div className="w-full max-w-xs">
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Перетащите PDF-файл сюда</p>
              <p className="text-xs text-muted-foreground mt-1">или нажмите кнопку ниже</p>
            </div>
            <Button onClick={handleButtonClick} size="sm">
              Выбрать файл
            </Button>
          </>
        )}
      </div>
    </Card>
  );
} 