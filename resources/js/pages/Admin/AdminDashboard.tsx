"use client"

import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { StatCard } from "./StatCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AdminDashboard({stats, recentOrders, revenueData, productData }: {stats?: any, recentOrders?: any, revenueData?: any, productData?: any}) {
  
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  // Client-side pagination for productData (frontend only)
  const items: any[] = Array.isArray(productData) ? productData : productData?.data ?? []
  const perPage = 5
  const [currentPage, setCurrentPage] = useState<number>(1)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(items.length / perPage)), [items.length])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage
    return items.slice(start, start + perPage)
  }, [items, currentPage])

  useEffect(() => {
    if (totalPages <= 1) return 
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        return prev === totalPages ? 1 : prev + 1
      })
    }, 10000) 

    return () => clearInterval(interval)
  }, [totalPages])
  console.log(revenueData);
  console.log(recentOrders);
  console.log(stats);
  


  return (
    <AdminLayout currentPath="/admin/dashboard">
      <div className="w-full">
        <AdminHeader />
        <div className="p-4 sm:p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat: any) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left" style={{ animationDelay: "0.5s" }}>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Revenue Overview
                </CardTitle>
                <CardDescription className="text-gray-400">Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend wrapperStyle={{ color: "#94a3b8" }} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ fill: "#0ea5e9" }}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>


            <Card
              className="bg-slate-800/50 border-slate-700 animate-slide-in-right"
              style={{ animationDelay: "0.5s" }}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Stock Tracker
                </CardTitle>
                <CardDescription className="text-gray-400">Current inventory by product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paginatedData.map((item: any, index: number) => (
                    <div
                      key={item.id ?? item.product}
                      className="animate-slide-in-left"
                      style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{item.product}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.status === "In Stock"
                              ? "bg-green-500/20 text-green-500"
                              : item.status === "Low Stock"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.status === "In Stock"
                              ? "bg-gradient-to-r from-green-500 to-gree-500/50"
                              : item.status === "Low Stock"
                                ? "bg-gradient-to-r from-orange-500 to-orange-500/60"
                                : "bg-gradient-to-r from-destructive to-destructive/60"
                          }`}
                          style={{
                            width: `${Math.min((item.stock / 450) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
                    <span className="text-xs text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
          {/* Recent Orders */}
          <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Recent Orders
              </CardTitle>
              <CardDescription className="text-gray-400">Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders &&
                  recentOrders.map((order: any, index: number) => {
                    const aggregated = (() => {
                      const map: Record<string, any> = {}
                      ;((order.products as any[]) || []).forEach((p: any) => {
                        const id = String(p.id)
                        const amount = Number(p.pivot?.amount ?? p.amount ?? 1)
                        const price = p.pivot?.price ?? p.price ?? 0
                        if (!map[id]) {
                          map[id] = { ...p, amount, price }
                        } else {
                          map[id].amount = Number(map[id].amount) + amount
                        }
                      })
                      return Object.values(map)
                    })()

                    const isExpanded = expandedOrderId === order.id
                    const productsToShow = isExpanded ? aggregated : aggregated.slice(0, 3)
                    const hasMoreProducts = aggregated.length > 3

                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-primary/50 transition-all duration-300 animate-slide-in-left"
                        style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-white">
                              {order.user?.name ?? "Unknown"}#{order.order_id}
                            </p>
                            <div className="text-sm text-gray-400 mt-2 space-y-1">
                              {aggregated.length > 0 ? (
                                <>
                                  {productsToShow.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between">
                                      <span>{p.name}</span>
                                      <span className="text-xs text-gray-400">
                                        {p.amount} × ${Number(p.price).toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                  {hasMoreProducts && (
                                    <button
                                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                      className="text-primary text-xs font-medium mt-2 hover:text-primary/80 transition-colors"
                                    >
                                      {isExpanded ? "Show Less" : `Show All (${aggregated.length} items)`}
                                    </button>
                                  )}
                                </>
                              ) : (
                                <div className="text-sm text-gray-400">No products</div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-medium text-gray-400">${Number(order.total).toFixed(2)}</span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === "Completed"
                                  ? "bg-success/20 text-success border border-success/30"
                                  : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
