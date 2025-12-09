"use client"

import type React from "react"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo } from "react"
import { router } from "@inertiajs/react"
import { AdminHeader } from "./AdminHeader"
import { Tab } from "@headlessui/react"

const ITEMS_PER_PAGE = 10

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

export default function AdminLogs({ logs, users }: { logs?: ActivityLog[], users?: any }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const allLogs = logs || []

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return allLogs
    return allLogs.filter(
      (log) =>
        log.log_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.causer_type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
    )
  }, [searchQuery, allLogs])

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const getSeverityFromLog = (log: ActivityLog): string => {
    const name = log.log_name.toLowerCase()
    if (name.includes("delete") || name.includes("error") || name.includes("failed")) return "error"
    if (name.includes("update") || name.includes("warning")) return "warning"
    return "info"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "warning":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "info":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <AdminLayout currentPath="/admin/logs">
      <div className="w-full">
        <AdminHeader />
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-in-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Activity className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400" />
                Activity Logs
              </h1>
              <p className="text-sm text-gray-400 mt-1">View system and user activity logs</p>
            </div>
          </div>

          <div className="relative animate-slide-in-up">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by action, user, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-cyan-500"
            />
          </div>

          <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up overflow-hidden">
            <div className="p-4 sm:p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-gray-300 text-sm">Action</TableHead>
                    <TableHead className="text-gray-300 text-sm">Description</TableHead>
                    <TableHead className="text-gray-300 text-sm">Type</TableHead>
                    <TableHead className="text-gray-300 text-sm">event</TableHead>
                    <TableHead className="text-gray-300 text-sm">Time</TableHead>
                    <TableHead className="text-gray-300 text-sm">User</TableHead>
                    <TableHead className="text-gray-300 text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="text-white font-medium text-sm">{log.log_name}</TableCell>
                        <TableCell className="text-gray-300 text-sm max-w-xs truncate">{log.description}</TableCell>
                        <TableCell className="text-gray-300 text-sm">{log.subject_type || "System"}</TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs text-white border ${log.event === "created" ? "bg-green-500/20" : log.event === "updated" ? "bg-blue-500/20" : log.event === "deleted" ? "bg-red-500/20" : "bg-gray-500/20"}`}
                          >
                            {
                                log.event === "created" ? "Creat" : log.event === "updated" ? "Update" : log.event === "deleted" ? "Delete" : log.event === 'mail_sent' ? 'Mail' : log.event
                            }
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          {new Date(log.created_at).toLocaleDateString()}{" "}
                          {new Date(log.created_at).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">{users.find((user: any) => user.id === log.causer_id)?.name}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(`/admin/logs/${log.id}`)}
                            className="text-gray-400 hover:text-cyan-400 hover:bg-slate-700/50 text-sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        No logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-slate-700">
              <p className="text-sm text-gray-400">
                Showing {paginatedLogs.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-700 text-gray-400 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm text-gray-300">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-700 text-gray-400 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
