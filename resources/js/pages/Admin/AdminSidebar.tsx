"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings, LogOut, X, Logs } from "lucide-react"
import { Button } from "@/components/ui/button"


interface AdminSidebarProps {
  currentPath?: string
  isMobile?: boolean
  onClose?: () => void
  nOrders?: number
  nProducts?: number
}

export function AdminSidebar({ currentPath, isMobile = false, onClose, nOrders = 0, nProducts = 0 }: AdminSidebarProps) {

  const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products", notificationCount: nProducts ?? 0 },
  { icon: FolderTree, label: "Categories", href: "/admin/categories" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders", notificationCount: nOrders ?? 0 },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Logs, label: "Logs", href: "/admin/logs" },
  { icon: Settings, label: "Settings", href: "/admin/settings"},
]

  return (
    <aside
      className={cn(
        "flex flex-col backdrop-blur-md h-screen",
        isMobile
          ? "w-64 bg-slate-800 border-r border-slate-700"
          : "w-64 bg-slate-800/50 border-r border-slate-700 fixed top-0 left-0",
      )}
    >
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <img src="/frost-logo.png" alt="Frost Admin Logo" width={90} height={90} className="rounded-lg" />
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors ml-2"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPath === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive
                  ? "bg-gradient-to-r from-cyan-400/20 to-accent/20 text-cyan-400 border border-cyan-400/30"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50",
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "animate-pulse-slow")} />
              <span className="font-medium flex-1">{item.label}</span>
              {item.notificationCount && item.notificationCount > 0 ? (
                <span className="bg-cyan-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center">
                  {item.notificationCount > 99 ? "99+" : item.notificationCount}
                </span>
              ): (null)}
            </a>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-700/50 group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
