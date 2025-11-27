"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CustomerLayout from "@/layouts/CustomerLayout"
import { ShoppingBag, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { CustomerHeader } from "./CustomerHeader"


export default function CustomerOrders({ orders }:{orders?:any}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase())      
        const matchesStatus = statusFilter === "All" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])


  console.log(orders)
  console.log(filteredOrders)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(start, start + itemsPerPage)
  }, [filteredOrders, currentPage])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  return (
    <CustomerLayout>
      <CustomerHeader />
      <div className="p-6 space-y-6">
        <div className="animate-slide-in-up">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400 mt-1">View and track all your orders</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by order ID  ..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border-0 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Completed", "Processing", "Pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === status
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                        : "bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-3">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <a
                    key={order.id}
                    href={`/orders/${order.order_id}`}
                    className="block p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                          Order #{order.order_id}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Placed on {new Date(order.created_at).toLocaleDateString()} • {order.products.length}{" "}
                          {order.products.length > 1 ? "items" : "item"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-semibold">{order.total}</p>
                        <span
                          className={`inline-block text-xs font-medium px-3 py-1 rounded-full mt-2 ${
                            order.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "Processing"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No orders found</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages} • Showing {paginatedOrders.length} of {filteredOrders.length}{" "}
                  orders
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}
