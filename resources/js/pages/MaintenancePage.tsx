"use client"

import { MessageCircle } from "lucide-react"

export default function MaintenancePage({ discordUrl, sitename }: { discordUrl?: string, sitename?: string }) {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex flex-col relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center gap-8 flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Hero section */}
        <div className="text-center space-y-4 mb-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src="frost.png" className="w-20 h-20 text-cyan-400 " style={{ animationDuration: "3s" }} />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">We'll Be Right Back</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            {sitename} is temporarily undergoing maintenance to improve your experience.
          </p>
        </div>

        {/* Glassmorphism card */}
        <div className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-4">
                <img src="frost-logo.png" className=" text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Scheduled Maintenance</h2>
            <p className="text-blue-100 text-lg">
              We're working hard behind the scenes to bring you enhanced features and improved performance.
            </p>
            <div className="inline-block">
              <p className="text-cyan-400 font-semibold text-xl">Expected back online soon</p>
            </div>
          </div>

          {/* Loading animation */}
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>

        {/* Discord button */}
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-900 font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          Join our Discord for updates
        </a>
      </div>

      {/* Footer */}
      <footer className="w-screen -ml-[calc(100vw-100%)] bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-t border-white/10 mt-auto">
        <div className="w-full px-4 py-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <img src="frost.png" className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold">{sitename}</span>
            </div>
            <p>© 2025 {sitename}. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <img src="frost.png" className="w-4 h-4 text-cyan-400" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
