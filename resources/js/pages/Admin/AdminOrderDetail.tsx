
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Edit, ChevronDown, ChevronUp, Download } from "lucide-react"
import { useState } from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Badge } from "@/components/ui/badge"
import { router } from "@inertiajs/react"

export default function AdminOrderDetail({ order }: { order: any }) {
  const [editStatus, setEditStatus] = useState(order.status)
  const [showMoreItems, setShowMoreItems] = useState(false)
  console.log(order)
  const statusOptions = ["Pending", "Processing", "Completed", "Cancelled"]

  const updateProductAmount = (productId: any, newAmount: number) => {
    // Send update to server (will detach if amount <= 0)
    router.put(route("admin.orders.products.update", [order.id, productId]), {
      amount: newAmount,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.put(route("admin.orders.updateStatus", order.id), {
      status: editStatus,
    })
    console.log(editStatus)
  }

  const aggregatedItems = (() => {
    if (!Array.isArray(order.products) || order.products.length === 0) return []
    const map: Record<string, any> = {}
    ;(order.products as any[]).forEach((item: any) => {
      const id = String(item.id)
      const amount = Number(item.pivot?.amount ?? item.amount ?? 1)
      const price = item.pivot?.price ?? item.price ?? 0
      if (!map[id]) {
        map[id] = { ...item, amount, price }
      } else {
        map[id].amount = Number(map[id].amount) + amount
      }
    })
    return Object.values(map)
  })()

  const displayedItems = showMoreItems ? aggregatedItems : aggregatedItems.slice(0, 5)
  const hasMoreItems = aggregatedItems.length > 5

  const handleInvoice = () => {
    router.get(route("admin.orders.invoice", order.id))
  }

  const paymentDetails = order.payment_logs || {}

  const parseJSON = (jsonString: string) => {
    try {
      return typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString
    } catch (e) {
      return {}
    }
  }

  const paymentSource = parseJSON(paymentDetails.payment_source)?.paypal || {}
  const purchaseUnits = parseJSON(paymentDetails.purchase_units)?.[0] || {}
  const payer = parseJSON(paymentDetails.payer) || {}
  const shipping = purchaseUnits.shipping || {}
  const capture = purchaseUnits.payments?.captures?.[0] || {}

  return (
    <AdminLayout currentPath={`/admin/orders/${order.order_id}`}>
      <AdminHeader />
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex max-sm:flex-col items-center justify-between gap-4 animate-slide-in-up">
          <div className="flex items-center gap-4">
            <a href="/admin/orders" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </a>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400" />
                Order #{order.order_id}
              </h1>
              <p className="text-sm text-gray-400 mt-1">View and manage order details</p>
            </div>
          </div>
          <a href={route("admin.orders.invoice", order.order_id)} target="_blank" rel="noreferrer">
            <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white ">
              <Download className="w-4 h-4" />
              <span>Invoice</span>
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Order Information and Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Information Card */}
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-white">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Customer</p>
                    <p className="text-white font-semibold">{order.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Date</p>
                    <p className="text-white font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-cyan-400">${order.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={order.status} className="bg-slate-900 text-white">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </option>
                      {statusOptions
                        .filter((status) => status !== order.status)
                        .map((status) => (
                          <option key={status} value={status} className="bg-slate-900 text-white">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 py-2 font-semibold"
                >
                  <Edit className="w-4 h-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-white">Order Items ({aggregatedItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aggregatedItems.length > 0 ? (
                    <>
                      {displayedItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-slate-900/50 border border-slate-700 rounded-lg gap-3 sm:gap-0"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.name}</p>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              <span>amount: {item.amount}</span>
                            </div>
                          </div>
                          <p className="text-cyan-400 font-semibold">${Number(item.price).toFixed(2)}</p>
                        </div>
                      ))}

                      {hasMoreItems && (
                        <Button
                          onClick={() => setShowMoreItems(!showMoreItems)}
                          variant="ghost"
                          className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/50 gap-2"
                        >
                          {showMoreItems ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show More ({aggregatedItems.length - 5} items)
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">No products</div>
                  )}
                </div>
              </CardContent>
            </Card>
            {order.status === "Completed" && (
              <Card
                className="bg-slate-800/50 border-slate-700 animate-slide-in-left"
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader>
                  <CardTitle className="text-white">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Payment Status</p>
                      <Badge className="mt-2 bg-green-500/20 text-green-500 border-green-500/30 capitalize">
                        {capture.status || "Completed"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Payment ID</p>
                      <p className="text-white text-sm font-mono mt-2 break-all">{paymentDetails.payment_id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Capture ID</p>
                      <p className="text-white text-sm font-mono mt-2 break-all">{capture.id || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Payment Method</p>
                      <p className="text-white text-sm mt-2 capitalize">
                        {paymentSource.email_address ? "PayPal" : "Card"}
                      </p>
                    </div>
                  </div>

                  {payer.name && (
                    <>
                      <div className="border-t border-slate-700 pt-4">
                        <p className="text-gray-400 text-sm mb-3">Payer Information</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-gray-400 text-sm">Name</p>
                            <p className="text-white text-sm">
                              {payer.name?.given_name} {payer.name?.surname}
                            </p>
                          </div>
                          <div className="flex max-md:flex-col justify-between">
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white text-sm">{payer.email_address}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-400 text-sm">Country</p>
                            <p className="text-white text-sm">{payer.address?.country_code}</p>
                          </div>
                          {payer.phone?.phone_number && (
                            <div className="flex justify-between">
                              <p className="text-gray-400 text-sm">Phone</p>
                              <p className="text-white text-sm">{payer.phone.phone_number.national_number}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {shipping.address && (
                    <>
                      <div className="border-t border-slate-700 pt-4">
                        <p className="text-gray-400 text-sm mb-3">Shipping Address</p>
                        <div className="space-y-2">
                          <p className="text-white text-sm">{shipping.name?.full_name}</p>
                          <p className="text-white text-sm">{shipping.address?.address_line_1}</p>
                          {shipping.address?.address_line_2 && (
                            <p className="text-white text-sm">{shipping.address.address_line_2}</p>
                          )}
                          <p className="text-white text-sm">
                            {shipping.address?.admin_area_2}, {shipping.address?.postal_code}
                          </p>
                          <p className="text-white text-sm">{shipping.address?.country_code}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="border-t border-slate-700 pt-4">
                    <p className="text-gray-400 text-sm mb-3">Transaction Info</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-gray-400 text-sm">Created</p>
                        <p className="text-white text-sm">{new Date(paymentDetails.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-400 text-sm">Updated</p>
                        <p className="text-white text-sm">{new Date(paymentDetails.updated_at).toLocaleString()}</p>
                      </div>
                      {capture.amount && (
                        <div className="flex justify-between">
                          <p className="text-gray-400 text-sm">Amount</p>
                          <p className="text-white text-sm">
                            {capture.amount.currency_code} {capture.amount.value}
                          </p>
                        </div>
                      )}
                      {capture.create_time && (
                        <div className="flex justify-between">
                          <p className="text-gray-400 text-sm">Capture Time</p>
                          <p className="text-white text-sm">{new Date(capture.create_time).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Payment Information */}
          <div className="animate-slide-in-up">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Total</p>
                    <p className="text-2xl font-bold text-cyan-400">${order.total}</p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payment Status</p>
                      <span
                        className={
                          paymentDetails.status && order.is_paid
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400 " + "inline-block px-3 py-1  text-sm rounded-full"
                        }
                      >
                        {paymentDetails.status && order.is_paid ? "Paid" : "Unpaid"}
                      </span>
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
