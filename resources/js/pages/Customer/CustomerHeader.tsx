"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CustomerHeader() {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, message: "Order #1234 has been shipped", time: "2 hours ago" },
    { id: 2, message: "Your order #1235 is being prepared", time: "5 hours ago" },
    { id: 3, message: "New discount: 20% off on electronics", time: "1 day ago" },
  ]

  return (
    <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-white">Welcome back</h2>
          <p className="text-sm text-gray-400">Manage your account and orders</p>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-cyan-400 hover:bg-slate-700/50 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
          </Button>

          {showNotifications && (
            <Card className="absolute right-0 mt-2 w-80 bg-slate-800 border-slate-700 shadow-xl">
              <CardContent className="p-0">
                <div className="border-b border-slate-700 px-4 py-3">
                  <h3 className="text-white font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors cursor-pointer"
                      >
                        <p className="text-sm text-gray-300">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">No notifications yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </header>
  )
}
