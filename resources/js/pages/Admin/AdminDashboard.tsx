"use client"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { StatCard } from "./StatCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard({
  stats,
  recentOrders,
  revenueData,
  productData,
  visitData,
}: { stats?: any; recentOrders?: any; revenueData?: any; productData?: any; visitData?: any }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [timeFilter, setTimeFilter] = useState<"7" | "30" | "90">("7")
  const [showAllCities, setShowAllCities] = useState(false)
  const MAX_CITIES_DISPLAY = 5

  // Extract unique countries from visitData
  const countries = useMemo(() => {
    if (!Array.isArray(visitData)) return []
    const uniqueCountries = Array.from(new Set(visitData.map((v: any) => v.country))).filter(Boolean)
    return uniqueCountries as string[]
  }, [visitData])

  // Set default country on first load
  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      setSelectedCountry(countries[0])
    }
  }, [countries, selectedCountry])

  const filteredByCountry = useMemo(() => {
    if (!Array.isArray(visitData) || !selectedCountry) return []

    const now = new Date()
    const daysBack = Number.parseInt(timeFilter)
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    return visitData.filter((v: any) => {
      const visitDate = new Date(v.date)
      return v.country === selectedCountry && visitDate >= cutoffDate
    })
  }, [visitData, selectedCountry, timeFilter])

  // Extract unique cities for selected country
  const citiesData = useMemo(() => {
    const cityMap: Record<string, any[]> = {}
    filteredByCountry.forEach((v: any) => {
      if (!cityMap[v.city]) {
        cityMap[v.city] = []
      }
      cityMap[v.city].push(v)
    })
    return cityMap
  }, [filteredByCountry])

  // Prepare chart data - visits by date and city
  const chartData = useMemo(() => {
    const dateMap: Record<string, Record<string, number>> = {}

    filteredByCountry.forEach((v: any) => {
      const dateStr = new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {}
      }
      const city = v.city || "Unknown"
      dateMap[dateStr][city] = (dateMap[dateStr][city] || 0) + (v.visits || 0)
    })

    return Object.entries(dateMap)
      .sort(([dateA], [dateB]) => {
        const a = new Date(dateA)
        const b = new Date(dateB)
        return a.getTime() - b.getTime()
      })
      .map(([date, cities]) => ({
        date,
        ...cities,
      }))
  }, [filteredByCountry])

  // Get all unique cities for chart legend
  const allCities = useMemo(() => {
    return Array.from(new Set(Object.keys(citiesData)))
  }, [citiesData])

  const citiesDisplay = useMemo(() => {
    return showAllCities ? allCities : allCities.slice(0, MAX_CITIES_DISPLAY)
  }, [allCities, showAllCities])

  const hasMoreCities = allCities.length > MAX_CITIES_DISPLAY

  // Client-side pagination for productData (frontend only)
  const items: any[] = Array.isArray(productData) ? productData : (productData?.data ?? [])
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
  return (
    <AdminLayout currentPath="/admin/dashboard">
      <div className="w-full">
        <AdminHeader />
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {stats.map((stat: any) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Charts Row - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Revenue Overview
                </CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                      labelStyle={{ color: "#e2e8f0" }}
                      cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    />
                    <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
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
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <Package className="w-5 h-5 text-primary" />
                  Stock Tracker
                </CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Current inventory by product
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
                <div className="space-y-3">
                  {paginatedData.map((item: any, index: number) => (
                    <div
                      key={item.id ?? item.product}
                      className="animate-slide-in-left"
                      style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-xs sm:text-sm font-medium text-white truncate">{item.product}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
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
                  <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-slate-700">
                    <span className="text-xs text-gray-400">
                      {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600 hover:border-primary/50 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-400 hover:text-primary" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600 hover:border-primary/50 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400 hover:text-primary" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {Array.isArray(visitData) && visitData.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Visits by City
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs sm:text-sm">
                      Visit analytics by city and date
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white text-sm">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-600">
                        <SelectItem value="7" className="text-white">
                          Last 7D
                        </SelectItem>
                        <SelectItem value="30" className="text-white">
                          Last 30D
                        </SelectItem>
                        <SelectItem value="90" className="text-white">
                          Last 90D
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white text-sm">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-600">
                        {countries.map((country) => (
                          <SelectItem key={country} value={country} className="text-white">
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                      labelStyle={{ color: "#e2e8f0" }}
                      cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    />
                    <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                    {allCities.map((city) => {
                      const colors = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
                      return (
                        <Bar
                          key={city}
                          dataKey={city}
                          fill={colors[allCities.indexOf(city) % colors.length]}
                          name={city}
                        />
                      )
                    })}
                  </BarChart>
                </ResponsiveContainer>

                {allCities.length > 0 && (
                  <div className="mt-4 sm:mt-6 pt-4 border-t border-slate-700">
                    <h3 className="text-xs sm:text-sm font-semibold text-white mb-3">Cities in {selectedCountry}</h3>
                    <div className="space-y-2">
                      {citiesDisplay.map((city) => {
                        const cityTotal = citiesData[city].reduce((sum, v) => sum + (v.visits || 0), 0)
                        return (
                          <div
                            key={city}
                            className="flex items-center justify-between p-2 rounded bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                          >
                            <span className="text-xs sm:text-sm text-gray-300 truncate">{city}</span>
                            <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap ml-2">
                              {cityTotal} visits
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    {hasMoreCities && (
                      <button
                        onClick={() => setShowAllCities(!showAllCities)}
                        className="w-full mt-3 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 rounded transition-colors"
                      >
                        {showAllCities
                          ? `Show Less (${MAX_CITIES_DISPLAY} of ${allCities.length})`
                          : `Show All (${allCities.length} cities)`}
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent Orders - Responsive */}
          <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up" style={{ animationDelay: "0.6s" }}>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Recent Orders
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
              <div className="space-y-3 sm:space-y-4">
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
                        className="p-3 sm:p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:bg-slate-900/80 hover:border-primary/40 transition-all duration-300 animate-slide-in-left"
                        style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm sm:text-base truncate">
                              {order.user?.name ?? "Unknown"}#{order.order_id}
                            </p>
                            <div className="text-xs sm:text-sm text-gray-400 mt-2 space-y-1">
                              {aggregated.length > 0 ? (
                                <>
                                  {productsToShow.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between gap-2">
                                      <span className="truncate">{p.name}</span>
                                      <span className="text-xs text-gray-400 whitespace-nowrap">
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
                                <div className="text-xs sm:text-sm text-gray-400">No products</div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                            <span className="font-medium text-gray-400 text-sm sm:text-base">
                              ${Number(order.total).toFixed(2)}
                            </span>
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
