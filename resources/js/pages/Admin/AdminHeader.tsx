import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

const Bell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22c1.1046 0 2-.8954 2-2H10c0 1.1046.8954 2 2 2zm6-6v-5a6 6 0 10-12 0v5l-2 2H20l-2-2z" />
  </svg>
)

export function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications])

  const notifications = [
    { id: 1, message: "New order received #1234", time: "5 minutes ago" },
    { id: 2, message: "Product inventory low", time: "1 hour ago" },
    { id: 3, message: "New customer registered", time: "3 hours ago" },
  ]

  return (
    <header className="h-20 border-b border-slate-700 bg-slate-800/30 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
        <p className="text-sm text-gray-400">Manage your store</p>
      </div>

      <div className="flex items-center gap-3" ref={dropdownRef}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-400 hover:text-white hover:bg-slate-700/50"
          >
            <Bell />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl animate-fade-in overflow-hidden">
              <div className="p-3 border-b border-slate-700">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 border-b border-slate-700 hover:bg-slate-700/30 transition-colors cursor-pointer"
                  >
                    <p className="text-white text-sm">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <a href="#" className="text-primary text-sm hover:underline">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
