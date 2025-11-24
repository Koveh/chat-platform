'use client';

import React from 'react';
import { SidebarNav } from '@/components/layout/Navbar';
import { ChatInterface } from '@/components/ai/chat-interface';


export default function Home() {
  return (
    // <div className="flex h-screen overflow-hidden">
      // <SidebarNav />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    // </div>
  )
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