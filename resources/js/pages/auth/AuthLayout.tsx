"use client"

import type React from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-frost-purple/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Content area - centered */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">{children}</div>

      <footer className="relative z-10 backdrop-blur-md bg-slate-900/40 border-t border-slate-700/50 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <img src="/frost.png" className="h-8" alt="Frost Logo" />
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-cyan-400 gap-2 transition-colors hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </footer>
    </div>
  )
}
