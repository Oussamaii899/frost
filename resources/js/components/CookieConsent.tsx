"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = async () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
    
  await fetch("/accept-cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // VERY IMPORTANT
  });
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md animate-in slide-in-from-bottom-4 duration-300">
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
            onClick={handleDecline}
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
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-200 text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
