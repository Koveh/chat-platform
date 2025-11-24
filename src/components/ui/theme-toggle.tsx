"use client"

import * as React from "react"
import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // Теперь просто отображаем иконку без переключения темы
  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-default"
      title="Light theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] text-amber-400" />
      <span className="sr-only">Light theme</span>
    </Button>
  )
} 