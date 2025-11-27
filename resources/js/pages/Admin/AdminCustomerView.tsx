"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowLeft, ShoppingBag, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { useState } from "react"
import { router } from "@inertiajs/react"

export default function AdminCustomerView({ customer }: { customer: any }) {
  const [status, setStatus] = useState(customer.status)
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [orderPage, setOrderPage] = useState(0)

  const ORDERS_PER_PAGE = 3
  const orders = customer.orders || []
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE)
  const paginatedOrders = orders.slice(orderPage * ORDERS_PER_PAGE, (orderPage + 1) * ORDERS_PER_PAGE)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    router.put(route("admin.customers.update", customer.id), {
      status: newStatus,
    })
  }

  const handleSendEmail = () => {
    if (!email || !subject || !message) {
      alert("Please fill in all fields")
      return
    }
    console.log(`Email sent to: ${email}`)
    alert("Email sent successfully!")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  console.log(customer)
  return (
    <AdminLayout currentPath={`/admin/customers/${customer.name}`}>
      <AdminHeader />
      <div className="p-4 md:p-6 space-y-6 max-w-7xl ">
        <div className="flex items-center gap-4 animate-slide-in-up">
          <a href="/admin/customers" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-7 h-7 md:w-8 h-8 text-cyan-400" />
              Customer Details
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-1">View customer information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Info Section */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-base md:text-lg text-white truncate">{customer.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-sm md:text-base text-white font-medium truncate">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-400 mb-1">Status</p>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full px-2 md:px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded text-xs md:text-sm hover:border-cyan-400 transition-colors focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 z-10"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-400 mb-1">Joined</p>
                    <p className="text-sm md:text-base text-white font-medium">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-400 mb-1">Total Orders</p>
                    <p className="text-sm md:text-base text-white font-medium">{customer.orders_count}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs md:text-sm text-gray-400 mb-2">Total Spent</p>
                  <p className="text-xl md:text-2xl font-bold text-cyan-400">${customer.orders_sum_total ?? 0}</p>
                </div>

                <div>
                  <p className="text-xs md:text-sm text-gray-400 mb-2">Customer Since</p>
                  <p className="text-sm md:text-base text-gray-300">
                    {new Date(customer.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <a href="/admin/customers" className="flex-1">
                    <Button className="w-full bg-slate-700 text-white hover:bg-slate-600">Back</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-base md:text-lg text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                {orders && orders.length > 0 ? (
                  <>
                    <div className="space-y-3 md:space-y-4">
                      {paginatedOrders.map((order: any) => (
                        <div key={order.id} className="border-b border-slate-700 pb-3 md:pb-4 last:border-b-0">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm md:text-base truncate">
                                <a href={`/admin/orders/${order.order_id}`}>Order #{order.order_id}</a>
                              </p>
                              <p className="text-xs md:text-sm text-gray-400">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                order.status === "Completed"
                                  ? "bg-green-500/20 text-green-500 border-green-500/30 whitespace-nowrap text-xs"
                                  : order.status === "Pending"
                                    ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 whitespace-nowrap text-xs"
                                    : "bg-red-500/20 text-red-500 border-red-500/30 whitespace-nowrap text-xs"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-end gap-2">
                            <div className="text-xs md:text-sm text-gray-400">
                              <p>{order.items_count || 1} item(s)</p>
                            </div>
                            <p className="text-base md:text-lg font-bold text-cyan-400">${order.total}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-700 mt-3 md:mt-4">
                        <span className="text-xs text-gray-400">
                          Page {orderPage + 1} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setOrderPage(Math.max(0, orderPage - 1))}
                            disabled={orderPage === 0}
                            size="sm"
                            className="bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setOrderPage(Math.min(totalPages - 1, orderPage + 1))}
                            disabled={orderPage === totalPages - 1}
                            size="sm"
                            className="bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">No orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Send Email Section */}
        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-base md:text-lg text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              Send Email to Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs md:text-sm text-gray-400 mb-2 block">Recipient Email</label>
              <input
                type="email"
                value={email || customer.email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Customer email"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded text-xs md:text-sm placeholder-gray-500 hover:border-cyan-400 transition-colors focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs md:text-sm text-gray-400 mb-2 block">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded text-xs md:text-sm placeholder-gray-500 hover:border-cyan-400 transition-colors focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs md:text-sm text-gray-400 mb-2 block">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={5}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded text-xs md:text-sm placeholder-gray-500 hover:border-cyan-400 transition-colors focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
              />
            </div>

            <Button
              onClick={handleSendEmail}
              className="w-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            >
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
