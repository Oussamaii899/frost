"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, ArrowLeft } from "lucide-react"
import { AdminLayout } from "@/layouts/AdminLayout"
import { router } from "@inertiajs/react"
import { AdminHeader } from "./AdminHeader"

type ActivityLog = {
  id: number
  log_name: string
  description: string
  event: string | null
  subject_id: number | null
  subject_type: string | null
  causer_id: number | null
  causer_type: string | null
  properties: any
  created_at: string
  updated_at: string
}

export default function AdminLogDetail({ log }: { log?: ActivityLog }) {
  if (!log) {
    return (
      <AdminLayout currentPath={`/admin/logs/${log?.id}`}>
        <AdminHeader />
        <div className="p-4 sm:p-6">
          <Button variant="outline" onClick={() => router.visit("/admin/logs")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">Log not found</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPath={`/admin/logs/${log.id}`}>
      <AdminHeader />
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-4 animate-slide-in-up">
          <button
            onClick={() => router.visit("/admin/logs")}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400" />
              Log Details
            </h1>
            <p className="text-sm text-gray-400 mt-1">Activity log #{log.id} information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Log Header Card */}
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-white">Log Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Action</p>
                    <p className="text-white font-semibold text-lg">{log.log_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Event</p>
                    <p className="text-white font-semibold text-lg">{log.event || "N/A"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Description</p>
                    <p className="text-white">{log.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject & Causer Information */}
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-white">Subject & Causer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {log.causer_type && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Performed By</p>
                      <p className="text-white font-medium">{log.causer_type}</p>
                      {log.causer_id && <p className="text-gray-400 text-sm">ID: {log.causer_id}</p>}
                    </div>
                  )}
                  {log.subject_type && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Subject Type</p>
                      <p className="text-white font-medium">{log.subject_type}</p>
                      {log.subject_id && <p className="text-gray-400 text-sm">ID: {log.subject_id}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timestamp Card */}
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-white">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Created At</p>
                    <p className="text-white">
                      {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Updated At</p>
                    <p className="text-white">
                      {new Date(log.updated_at).toLocaleDateString()} at {new Date(log.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Details */}
            {log.properties && Object.keys(log.properties).length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="text-white">Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(log.properties).map(([key, value]: [string, any]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-slate-900/50 border border-slate-700 rounded-lg gap-2"
                      >
                        <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-white font-medium text-sm break-all">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="animate-slide-in-up">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="pb-4 border-b border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Log ID</p>
                    <p className="text-white font-mono font-semibold">#{log.id}</p>
                  </div>

                  <div className="pb-4 border-b border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Action Type</p>
                    <p className="text-white font-medium">{log.log_name}</p>
                  </div>

                  {log.causer_type && (
                    <div className="pb-4 border-b border-slate-700">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Performed By</p>
                      <p className="text-white break-all">{log.causer_type}</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/30">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Event</p>
                    <p className="text-white font-semibold">{log.event || "N/A"}</p>
                  </div>

                  <div className="pt-4 space-y-3">
                    {log.subject_type && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                        <p className="text-white font-mono text-sm break-all">{log.subject_type}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Recorded At</p>
                      <p className="text-white text-sm">
                        {new Date(log.created_at).toLocaleDateString()}
                        <br />
                        {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
