"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"
import { router } from "@inertiajs/react"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setIsLoading(true)
    router.post(
      "/accept-cookie",
      {},
      {
        onSuccess: () => {
          localStorage.setItem("cookie-consent", "true")
          setIsVisible(false)
        },
        onError: () => {
          console.error("Error accepting cookies")
        },
        onFinish: () => {
          setIsLoading(false)
        },
      },
    )
    localStorage.setItem("cookie-consent", "true")
  }

  const handleDecline = () => {
    setIsLoading(true)
    router.post(
      "/decline-cookie",
      {},
      {
        onSuccess: () => {
          localStorage.setItem("cookie-consent", "false")
          setIsVisible(false)
        },
        onError: () => {
          console.error("Error declining cookies")
        },
        onFinish: () => {
          setIsLoading(false)
        },
      },
    )
    localStorage.setItem("cookie-consent", "false")
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-center md:justify-end md:items-end">
      <div className="pointer-events-auto w-full md:w-auto md:max-w-md animate-in slide-in-from-bottom-4 duration-300 md:m-4">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden">
          {/* Header with icon */}
          <div className="flex items-start justify-between p-4 md:p-5 border-b border-slate-700/30">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold text-white">Cookie Preferences</h3>
                <p className="text-xs text-gray-400 mt-1">
                  We use cookies to enhance your experience and analyze site usage.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
              aria-label="Close cookie consent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 p-4 md:p-5">
            <button
              onClick={handleDecline}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-200 text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Accept All"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
