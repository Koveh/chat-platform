"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users, FileText, TrendingUp, Clock, Bot } from 'lucide-react'

interface Statistics {
  totalChats: number
  totalMessages: number
  totalUsers: number
  averageMessagesPerChat: number
  mostActiveChat: string
  recentActivity: Array<{
    chatId: string
    lastMessage: string
    timestamp: string
  }>
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 bg-gray-100 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-100 min-h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Statistics</h1>
        <p className="text-gray-600">Overview of your chat platform usage</p>
      </div>

      {stats ? (
        <>
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChats}</div>
                <p className="text-xs text-muted-foreground">Active conversations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
                <p className="text-xs text-muted-foreground">All messages sent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Messages/Chat</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageMessagesPerChat.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Average per conversation</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <Bot className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Chat: {activity.chatId}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {activity.lastMessage}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>

          {/* Most Active Chat */}
          {stats.mostActiveChat && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Most Active Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{stats.mostActiveChat}</p>
                    <p className="text-sm text-gray-600">Most messages exchanged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">No statistics available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

