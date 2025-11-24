"use client"

import * as React from "react"
import {
  Search,
  FileText,
  HelpCircle,
  FilePlus,
  RefreshCw,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  User,
  LogOut,
  ChartBar,
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useRef } from "react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

// Mock history data
const historyItems = [
  { id: 1, title: "Document search: IT Security", date: "2025-04-01" },
  { id: 2, title: "Database restoration guide", date: "2025-03-28" },
  { id: 3, title: "API Documentation", date: "2025-03-25" },
  { id: 4, title: "User management procedures", date: "2025-03-20" },
  { id: 5, title: "System backup protocols", date: "2025-03-15" },
]

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [width, setWidth] = React.useState(256) // Default width in pixels
  const [isResizing, setIsResizing] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [navVisible, setNavVisible] = React.useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const minWidth = 200
  const maxWidth = 500
  const collapsedWidth = 64

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileScreen = window.innerWidth < 768
      setIsMobile(isMobileScreen)
      
      // Auto collapse on mobile
      if (isMobileScreen && !navVisible) {
        setCollapsed(true)
      }
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [navVisible])

  // Handle clicks outside the sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && navVisible && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setNavVisible(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, navVisible])

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    document.addEventListener("mousemove", handleResize)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  // Handle resize
  const handleResize = React.useCallback(
    (e: MouseEvent) => {
      if (isResizing && !collapsed) {
        const newWidth = e.clientX
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth)
        }
      }
    },
    [isResizing, collapsed],
  )

  // Handle resize end
  const handleResizeEnd = React.useCallback(() => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleResize)
    document.removeEventListener("mouseup", handleResizeEnd)
  }, [handleResize])

  // Clean up event listeners
  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResize)
      document.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [handleResize, handleResizeEnd])

  // Toggle navbar for mobile
  const toggleNavbar = () => {
    setNavVisible(!navVisible)
    setCollapsed(false)
  }

  return (
    <TooltipProvider>
      {/* Mobile toggle button - outside of navbar */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 h-8 w-8 bg-white shadow-md rounded-md"
          onClick={toggleNavbar}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      )}

      <div
        ref={sidebarRef}
        className={cn(
          "h-screen bg-gray-100 flex flex-col transition-all duration-300 relative",
          isResizing ? "transition-none select-none" : "transition-width",
          collapsed ? "w-16" : "",
          isMobile && "fixed top-0 left-0 z-40",
          isMobile && !navVisible && "transform -translate-x-full",
          className,
        )}
        style={{ width: collapsed ? `${collapsedWidth}px` : `${width}px` }}
        {...props}
      >
        {/* Top header with buttons */}
        <div className="flex items-center justify-between p-2">
          <div className={cn("flex gap-1", collapsed && "w-full justify-center")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New item</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>New item</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white" onClick={() => setCollapsed(!collapsed)}>
                  {collapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  <span className="sr-only">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="space-y-6">
              <div>
                {!collapsed && <h3 className="text-xs font-medium uppercase text-gray-500 mb-2">Search</h3>}
                <nav className="space-y-1">
                  <NavItem href="/search" icon={<Search className="h-4 w-4" />} collapsed={collapsed}>
                    Document Search
                  </NavItem>
                  <NavItem href="/deep-dive" icon={<FileText className="h-4 w-4" />} collapsed={collapsed}>
                    Document Deep Dive (0)
                  </NavItem>
                  <NavItem href="/help" icon={<HelpCircle className="h-4 w-4" />} collapsed={collapsed}>
                    Help
                  </NavItem>
                </nav>
              </div>

              <div>
                {!collapsed && (
                  <h3 className="text-xs font-medium uppercase text-gray-500 mb-2">Database Operations</h3>
                )}
                <nav className="space-y-1">
                  <NavItem href="#" icon={<FilePlus className="h-4 w-4" />} collapsed={collapsed}>
                    Database Add Files
                  </NavItem>
                  <NavItem href="#" icon={<RefreshCw className="h-4 w-4" />} collapsed={collapsed}>
                    Database Restoration
                  </NavItem>
                  <NavItem href="#" icon={<Settings className="h-4 w-4" />} collapsed={collapsed}>
                    Database Management
                  </NavItem>
                </nav>
              </div>

              {/* History section */}
              <div>
                {!collapsed && <h3 className="text-xs font-medium uppercase text-gray-500 mb-2">History</h3>}
                <nav className="space-y-1">
                  {historyItems.map((item) => (
                    <NavItem
                      key={item.id}
                      href="#"
                      icon={null}
                      collapsed={collapsed}
                      className={collapsed ? "" : "flex-col items-start gap-0"}
                    >
                      {collapsed ? (
                        `History ${item.id}`
                      ) : (
                        <>
                          <span className="line-clamp-1 w-full">{item.title}</span>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </>
                      )}
                    </NavItem>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* the bottom of the sidebar */}
        <div className="flex items-center justify-between p-2 mb-5 ml-3">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  {!collapsed && <span className="text-sm text-gray-700 font-medium">Daniil Kovekh</span>}
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-3 bg-gray-50 backdrop-blur-sm">
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" className="justify-start gap-2 px-2">
                    <ChartBar className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Statistics</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start gap-2 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4 text-red-600" />
                    Log out
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Resize handle - transparent */}
        {!collapsed && !isMobile && (
          <div className="absolute top-0 right-0 w-1 h-full cursor-ew-resize" onMouseDown={handleResizeStart} />
        )}
      </div>
    </TooltipProvider>
  )
}

interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  icon?: React.ReactNode | null
  children: React.ReactNode
  collapsed?: boolean
}

function NavItem({ href, icon, children, collapsed, className, ...props }: NavItemProps) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            className={cn(
              "flex justify-center items-center rounded-md p-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors",
              className,
            )}
            {...props}
          >
            {icon}
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{typeof children === "string" ? children : "Menu item"}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors",
        className,
      )}
      {...props}
    >
      {icon}
      {typeof children === "string" ? <span>{children}</span> : children}
    </a>
  )
}

