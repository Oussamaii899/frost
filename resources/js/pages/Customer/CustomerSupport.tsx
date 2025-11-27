"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Mail, MessageSquare } from "lucide-react"
import { CustomerHeader } from "./CustomerHeader"
import CustomerLayout from "@/layouts/CustomerLayout"

export default function CustomerSupport() {
  const [formData, setFormData] = useState({ subject: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Support ticket submitted:", formData)
    setFormData({ subject: "", message: "" })
  }

  return (
    <CustomerLayout>
      <CustomerHeader />
      <div className="p-6 space-y-6 max-w-2xl">
        <div className="animate-slide-in-up">
          <h1 className="text-3xl font-bold text-white">Support</h1>
          <p className="text-gray-400 mt-1">Contact us for help and support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Email Support</h3>
                <p className="text-gray-400 text-sm mt-2">support@frostmarket.com</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Live Chat</h3>
                <p className="text-gray-400 text-sm mt-2">Monday - Friday, 9AM - 5PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              Submit a Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  placeholder="What can we help with?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 min-h-32 resize-none"
                  placeholder="Tell us more about your issue..."
                  required
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}
