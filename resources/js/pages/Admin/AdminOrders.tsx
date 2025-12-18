"use client"

import type React from "react"

import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo } from "react"

const ITEMS_PER_PAGE = 10

export default function AdminOrders({ orders }: { orders?: any[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders || []
    return (orders || []).filter(
      (order) =>
        order.order_id.toString().includes(searchQuery) ||
        (order.user?.name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [orders, searchQuery])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <AdminLayout currentPath="/admin/orders">
      <div className="w-full">
        <AdminHeader />
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-in-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
                Orders
              </h1>
              <p className="text-sm text-gray-400 mt-1">View and manage customer orders</p>
            </div>
          </div>

          <div className="relative animate-slide-in-up">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-primary"
            />
          </div>

          <Card
            className="bg-slate-800/50 border-slate-700 animate-slide-in-up overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="p-4 sm:p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-gray-300 text-sm">Order ID</TableHead>
                    <TableHead className="text-gray-300 text-sm">Customer</TableHead>
                    <TableHead className="text-gray-300 text-sm">Date</TableHead>
                    <TableHead className="text-gray-300 text-sm">Total</TableHead>
                    <TableHead className="text-gray-300 text-sm">Status</TableHead>
                    <TableHead className="text-gray-300 text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow key={order.id} className="border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <TableCell className="text-white font-medium text-sm">#{order.order_id}</TableCell>
                      <TableCell className="text-gray-300 text-sm">{order.user?.name ?? "Unknown"}</TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-primary font-semibold text-sm">${order.total}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === "Completed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                              : order.status === "Pending"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs"
                                : order.status === "Processing"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30 text-xs"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <a href={`/admin/orders/${order.order_id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-primary hover:bg-slate-700/50 text-sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-slate-700">
              <p className="text-sm text-gray-400">
                Showing {paginatedOrders.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
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
