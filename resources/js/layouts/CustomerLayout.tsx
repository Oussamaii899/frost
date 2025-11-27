"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { CustomerSidebar } from "@/pages/Customer/CustomerSidebar"

interface CustomerLayoutProps {
  children?: React.ReactNode
  currentPage?: string
}



export default function CustomerLayout({ children, currentPage }: CustomerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [nOrders, setNOrders] = useState(0)
  const [nSupport, setNSupport] = useState(0)
  

    useEffect(() => {
    // Fetch sidebar data dynamically
    const fetchSidebarData = async () => {
      try {
        const response = await fetch(route('customer.layout'))
        const data = await response.json()
        console.log(data);
        setNOrders(data.nOrders ?? 0)
        setNSupport(data.nSupport ?? 0)
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error)
      }
    }

    fetchSidebarData()
    const interval = setInterval(fetchSidebarData, 30000)
    return () => clearInterval(interval)
  }, [])




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-frost-purple/5 rounded-full blur-3xl animate-float"></div>
      </div>

      <CustomerSidebar
        currentPath={currentPage}
        isMobile={true}
        nOrders={nOrders}
        nSupport={nSupport}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* Mobile header with hamburger menu */}
        <div className="md:hidden bg-slate-800/50 border-b border-slate-700 px-4 py-3 flex items-center backdrop-blur-md">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          <div className="ml-3 text-sm font-medium text-gray-300">Customer Portal</div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
