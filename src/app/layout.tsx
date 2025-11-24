import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SidebarNav } from "@/components/layout/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Chat Application",
  description: "A chat application with AI assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            <SidebarNav />
            {children}
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}



// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { SidebarNav } from "@/components/layout/Navbar"

// const inter = Inter({ subsets: ["latin", "cyrillic"] });

// export const metadata: Metadata = {
//   title: "Uniqa AI",
//   description: "Uniqa AI helps you to get the most out of your data ",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="ru">
//       <body className={inter.className}>
        
//         {/* <FinancialTicker /> */}
//         {/* <Breadcrumbs /> */}
//         <div className="flex min-h-screen">
//           <SidebarNav />
//           {children}
//         </div>
//         {/* <Footer /> */}
//         {/* <GlobalAIAssistant /> */}
//       </body>
//     </html>
//   );
// }
