"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingBag, HelpCircle, LogOut, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomerSidebarProps {
  currentPath?: string
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
  nOrders?: number
  nSupport?: number
}

export function CustomerSidebar({
  currentPath,
  isMobile = false,
  isOpen = false,
  onClose,
  nOrders = 0,
  nSupport = 0,
}: CustomerSidebarProps) {
  const handleMenuClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: ShoppingBag, label: "Orders", href: "/orders", notificationCount: nOrders ?? 0 },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: HelpCircle, label: "Support", href: "/support", notificationCount: nSupport ?? 0 },
  ]

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={cn(
          "fixed md:static top-0 left-0 z-50 h-screen w-64 min-h-screen bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-r border-slate-700 flex flex-col backdrop-blur-md transition-transform duration-300 md:translate-x-0",
          isMobile && !isOpen && "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-slate-700 space-y-1 flex items-center justify-between">
          <div className="flex items-center pb-1 gap-3 flex-1">
            <img
              src="/frost-logo.png"
              alt="Frost Logo"
              width={90}
              height={90}
              className="rounded-lg object-cover"
            />

          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={handleMenuClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group text-sm font-medium",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                    : "text-gray-400 hover:text-white hover:bg-slate-700/50",
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0")} />
                <span className="flex-1">{item.label}</span>
                {item.notificationCount && item.notificationCount > 0 && (
                  <span className="bg-cyan-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {item.notificationCount > 99 ? "99+" : item.notificationCount}
                  </span>
                )}
              </a>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-700/50 group text-sm"
            onClick={handleMenuClick}
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}
