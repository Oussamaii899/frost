"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { CustomerSidebar } from "@/pages/Customer/CustomerSidebar"
import { usePage } from "@inertiajs/react"

interface CustomerLayoutProps {
  children?: React.ReactNode
  currentPage?: string
}



export default function CustomerLayout({ children, currentPage }: CustomerLayoutProps) {
  const [nOrders, setNOrders] = useState(0)
  const [nSupport, setNSupport] = useState(0)
  const { props } = usePage()
  const themeColor = props.color as string

  useEffect(() => {
    if (themeColor) {
      document.documentElement.style.setProperty('--primary', themeColor)
      document.documentElement.style.setProperty('--ring', themeColor)
      document.documentElement.style.setProperty('--sidebar-primary', themeColor)
      document.documentElement.style.setProperty('--sidebar-ring', themeColor)
    }

    const backgroundColor = props.background_color as string
    if (backgroundColor) {
      document.documentElement.style.setProperty('--background', backgroundColor);
    }
  }, [themeColor, props.background_color])


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

  const [sidebarOpen, setSidebarOpen] = useState(false)



  return (
    <div className="min-h-screen bg-background relative overflow-hidden" style={{ transition: 'background-color 0.3s ease' }}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Deep mesh gradient base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(30,41,59,1),transparent_40%)]"></div>

        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
      </div>

      {/* DESKTOP SIDEBAR — always visible */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen z-30">
        <CustomerSidebar
          currentPath={currentPage}
          isMobile={false}
          nOrders={nOrders}
          nSupport={nSupport}
          isOpen={true}
        />
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed md:hidden top-0 left-0 h-screen z-50 transform transition-transform duration-300 
         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <CustomerSidebar
          currentPath={currentPage}
          isMobile={true}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          nOrders={nOrders}
          nSupport={nSupport}
        />
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

        {/* Content */}
        <div className="flex-1 overflow-x-auto">{children}</div>
      </main>
    </div>
  )
}
