"use client"

// the icons under the answer - copy, like, dislike, share, etc.

import { Copy, Heart, HeartOff, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface IconsUnderAnswerProps {
  messageContent: string
}

export const IconsUnderAnswer = ({ messageContent }: IconsUnderAnswerProps) => {
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile on client side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard API not available in this context (requires HTTPS or localhost).")
      return
    }
    try {
      await navigator.clipboard.writeText(messageContent)
      toast.success("Message copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy message: ", err)
      toast.error("Failed to copy message.")
    }
  }

  const handleLike = () => {
    // TODO: Implement actual like functionality
    toast.success("Liked (not implemented)")
  }

  const handleDislike = () => {
    // TODO: Implement actual dislike functionality
    toast.error("Disliked (not implemented)")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chat Message",
          text: messageContent,
        })
        // No toast on successful share, as the browser UI handles it
      } catch (err) {
        // Handle errors (e.g., user cancelled share)
        if ((err as Error).name !== 'AbortError') {
          console.error("Failed to share message: ", err)
          toast.error("Failed to share message.")
        }
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      if (!navigator.clipboard) {
        toast.error("Sharing and Clipboard API not available in this context (requires HTTPS or localhost).")
        return
      }
      try {
        await navigator.clipboard.writeText(messageContent)
        toast.info("Sharing not supported, message copied instead!")
      } catch (err) {
        console.error("Failed to copy message for sharing fallback: ", err)
        toast.error("Sharing not supported and failed to copy message.")
      }
    }
  }

  const iconActions = [
    { name: "Copy", icon: Copy, action: handleCopy },
    { name: "Like", icon: Heart, action: handleLike },
    { name: "Dislike", icon: HeartOff, action: handleDislike },
    { name: "Share", icon: Share, action: handleShare },
  ]

  return (
    <TooltipProvider delayDuration={100}>
      <div 
        className={cn(
          "flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-md shadow-md border border-gray-200",
          isMobile ? "p-0.5" : "p-1"
        )}
      >
        {iconActions.map((item) => {
          const IconComponent = item.icon
          return (
            <Tooltip key={item.name} disableHoverableContent={isMobile}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-gray-500 hover:text-gray-900 hover:bg-gray-100", 
                    isMobile ? "h-6 w-6 p-0.5" : "h-7 w-7"
                  )}
                  onClick={item.action}
                >
                  <IconComponent className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
                  <span className="sr-only">{item.name}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className={isMobile ? "hidden" : ""}>
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}