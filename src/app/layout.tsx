import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { LayoutWrapper } from "@/components/layout/LayoutWrapper"

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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}