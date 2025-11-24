'use client';

import React, { Suspense } from 'react';
import { ChatInterface } from '@/components/ai/chat-interface';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chat');

  return (
    <main className="flex-1 overflow-hidden bg-gray-100 h-full p-4">
      <ChatInterface chatId={chatId || undefined} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="flex-1 overflow-hidden bg-gray-100 h-full p-4">
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}

// export default function Home() {
//   return (
//     <div className="flex min-h-screen">
//       <SidebarNav />
//       <main className="flex-1 px-4 py-2 overflow-hidden">
//         <ChatInterface />
//       </main>
//     </div>
//   )
// }