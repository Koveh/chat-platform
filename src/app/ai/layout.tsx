import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI-ассистент | Stock Analytics',
  description: 'Анализ документов с помощью искусственного интеллекта',
};

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 