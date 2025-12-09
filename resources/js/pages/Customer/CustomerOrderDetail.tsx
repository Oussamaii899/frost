"use client"

import { CustomerHeader } from "@/pages/Customer/CustomerHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ChevronUp, Download, X, Trash2 } from "lucide-react"
import CustomerLayout from "@/layouts/CustomerLayout"
import { useState, useEffect } from "react"
import { usePayPalScript } from "@/hooks/usePayPalScript"
import { Toaster, toast } from "sonner"
import { router } from "@inertiajs/react"

export default function CustomerOrderDetail({ order }: { order?: any }) {
  const [showAllItems, setShowAllItems] = useState(false)
  const [showPaymentView, setShowPaymentView] = useState(false)
  const [isPaymentReady, setIsPaymentReady] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  console.log(order)

  const itemsToDisplay = showAllItems ? order.products : order.products.slice(0, 5)
  const hasMoreItems = order.products.length > 5

  const paypalLoaded = usePayPalScript(
    "AbdQZ6taSn-9G1daVMouYz9k_98y0UTX1R3N_hLSNs4nGtQB3Ps9wVZoJdGHeC2-qTJWFcCAnyTQ5exY",
  )

  useEffect(() => {
    if (!paypalLoaded || !showPaymentView || !isPaymentReady) return

    if (!(window as any).paypal) return
    ;(window as any).paypal
      .Buttons({
        createOrder: () => {
          return fetch("/paypal/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
            },
            body: JSON.stringify({ order_id: order.order_id }),
          })
            .then((res) => res.json())
            .then((data) => data.id)
        },

        onApprove: (data: any) => {
          return fetch("/paypal/capture", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
            },
            body: JSON.stringify({ paypal_order_id: data.orderID }),
          })
            .then((res) => res.json())
            .then(() => {
              toast.success("Payment successful!")
              setShowPaymentView(false)
              window.location.reload()
            })
        },

        onCancel: () => {
          toast.error("Payment cancelled")
          fetch("/order/cancel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
            },
            body: JSON.stringify({ order_id: order.order_id }),
          })
        },
      })
      .render("#paypal-button-container")
  }, [paypalLoaded, showPaymentView, isPaymentReady, order.order_id])

  const handleContinuePayment = () => {
    setShowPaymentView(true)
    setIsPaymentReady(true)
  }

  const handleCancelOrder = async () => {

    setIsCancelling(true)
    try {
      const response = await fetch("/order/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
        },
        body: JSON.stringify({ order_id: order.order_id }),
      })

      if (response.ok) {
        toast.success("Order cancelled successfully")
        window.location.reload()
      } else {
        toast.error("Failed to cancel order")
      }
    } catch (error) {
      toast.error("Error cancelling order")
    } finally {
      setIsCancelling(false)
    }
  }

  const closePaymentView = () => {
    setShowPaymentView(false)
    setIsPaymentReady(false)
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


  console.log("paymentDetails"+paymentDetails)
  console.log("paymentSource"+ paymentSource)
  console.log("purchaseUnits"+purchaseUnits)
  console.log("payer"+payer)
  console.log("shipping"+shipping)
  console.log("capture"+capture)

  return (
    <CustomerLayout>
      <CustomerHeader />
      <Toaster position="top-right" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between animate-slide-in-up">
          <div className="flex items-center gap-4">
            <a href="/orders" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </a>
            <div>
              <h1 className="text-3xl font-bold text-white">Order #{order.order_id}</h1>
              <p className="text-gray-400 mt-1">Order details and tracking</p>
            </div>
          </div>
          {
            order.status === "Completed" && (
            <a href={route('customer.order.invoice',order.order_id)}>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2">
              <Download className="w-4 h-4" />
              Invoice
            </Button>
            </a>
            )
          }
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-white">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itemsToDisplay.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-slate-700 last:border-0"
                    >
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">Quantity: {item.pivot.amount}</p>
                      </div>
                      <p className="text-primary font-semibold">{item.pivot.price}</p>
                    </div>
                  ))}

                  {hasMoreItems && (
                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/50 gap-2"
                      onClick={() => setShowAllItems(!showAllItems)}
                    >
                      {showAllItems ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show Less ({order.products.length - 5} hidden)
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show All ({order.products.length} items)
                        </>
                      )}
                    </Button>
                  )}

                  <div className="flex justify-between items-center pt-4 border-slate-700">
                    <p className="text-white font-bold text-lg">Total</p>
                    <p className="text-primary font-bold text-xl">{order.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="text-white">Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-300">
                  {order.status === "Completed" ? (
                    <div>
                      <p className="text-green-400 font-medium mb-2">✓ Order Complete</p>
                      <p className="text-sm">Your payment has been processed successfully.</p>
                    </div>
                  ) : order.status === "Pending" ? (
                    <div className="space-y-3">
                      <p className="text-orange-400 font-medium">Payment Pending</p>
                      <p className="text-sm text-gray-400">
                        Complete your payment to finalize this order and view full details.
                      </p>
                      <Button
                        onClick={handleContinuePayment}
                        className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
                      >
                        Continue Payment
                      </Button>
                    </div>
                  ):(
                    <div>
                      <p className="text-red-400 font-medium mb-2">✗ Order Cancelled</p>
                      <p className="text-sm">Your payment has been cancelled.</p>
                    </div>
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
                          <div className="flex justify-between">
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white text-sm">{payer.email_address}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-400 text-sm">Country</p>
                            <p className="text-white text-sm">{payer.address?.country_code}</p>
                          </div>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <Badge
                    className={
                      order.status === "Completed"
                        ? "mt-1 bg-green-500/20 text-green-500 border-green-500/30 capitalize"
                        : order.status === "Processing"
                          ? "mt-1 bg-cyan-500/20 text-cyan-500 border-cyan-500/30 capitalize"
                          :order.status === "Pending" ?"mt-1 bg-orange-500/20 text-orange-500 border-orange-500/30 capitalize":
                          "mt-1 bg-red-500/20 text-red-500 border-red-500/30 capitalize"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <p className="text-primary font-bold text-xl mt-1">{order.total}</p>
                </div>

                {order.status !== "Completed" && order.status !== "Cancelled" && (
                  <Button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    variant="destructive"
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700 animate-slide-in-right"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-slate-700 text-white hover:bg-slate-600">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showPaymentView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-md mx-4 animate-in zoom-in-50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-white text-xl">Complete Payment</CardTitle>
              <button
                onClick={closePaymentView}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-400 mb-4">Order #{order.order_id}</p>
                <p className="text-3xl font-bold text-primary">${order.total}</p>
              </div>

              {/* PayPal Button Container */}
              <div id="paypal-button-container" className="mt-6"></div>
            </CardContent>
          </Card>
        </div>
      )}
    </CustomerLayout>
  )
}
