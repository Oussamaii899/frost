"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { AdminSidebar } from "@/pages/Admin/AdminSidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [nOrders, setNOrders] = useState(0)
  const [nProducts, setNProducts] = useState(0)

  useEffect(() => {
    // Fetch sidebar data dynamically
    const fetchSidebarData = async () => {
      try {
        const response = await fetch(route('admin.layout'))
        const data = await response.json()
        console.log(data);
        setNOrders(data.nOrders ?? 0)
        setNProducts(data.nProducts ?? 0)
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error)
      }
    }

    fetchSidebarData()
    const interval = setInterval(fetchSidebarData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-frost-purple/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Desktop sidebar - always visible */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen z-30">
        <AdminSidebar currentPath={currentPath} isMobile={false} nOrders={nOrders} nProducts={nProducts} />
      </div>

      {/* Mobile overlay - only when sidebar is open */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar - slides in from left */}
      <div
        className={`fixed md:hidden top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <AdminSidebar currentPath={currentPath} isMobile={true} onClose={() => setSidebarOpen(false)} nOrders={nOrders} nProducts={nProducts} />
      </div>

      {/* Main content */}
      <main className="md:ml-64 flex flex-col min-h-screen relative z-10">
        {/* Mobile header with toggle button */}
        <div className="md:hidden bg-slate-800/50 border-b border-slate-700 p-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center">
            <img src="/frost-logo.png" alt="Frost Admin Logo" width={72} height={72} className="rounded-lg" />
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
