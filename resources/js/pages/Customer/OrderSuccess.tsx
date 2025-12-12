"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ShoppingBag, ArrowLeft, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderSuccess({ storedData }: any) {
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      if (storedData) {
        setOrderData(storedData)
      }
    } catch (error) {
      console.error("Error loading order data:", error)
    }
    setIsLoading(false)
  }, [])

  const parseJSON = (jsonString: string) => {
    try {
      return typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString
    } catch (e) {
      return {}
    }
  }

  const paymentDetails = storedData || {}
  const paymentSource = parseJSON(paymentDetails.payment_source)?.paypal || {}
  const purchaseUnits = parseJSON(paymentDetails.purchase_units)?.[0] || {}
  const payer = parseJSON(paymentDetails.payer) || {}
  const shipping = purchaseUnits.shipping || {}
  const capture = purchaseUnits.payments?.captures?.[0] || {}

  const paymentStatus = storedData?.status || capture?.status || "COMPLETED"
  const isPending = paymentStatus === "PENDING" || paymentStatus === "APPROVED"
  const isSuccess = paymentStatus === "COMPLETED" || paymentStatus === "CAPTURED"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${isPending ? "from-slate-900 via-amber-900 to-slate-900" : "from-slate-900 via-blue-900 to-slate-900"} relative overflow-hidden`}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 ${isPending ? "bg-amber-500/5" : "bg-primary/5"} rounded-full blur-3xl animate-float-slow`}
        ></div>
        <div
          className={`absolute top-3/4 right-1/4 w-96 h-96 ${isPending ? "bg-orange-500/5" : "bg-accent/5"} rounded-full blur-3xl animate-float-delayed`}
        ></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl animate-float"></div>
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          {/* Status Animation */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${isPending ? "from-amber-500/20 to-orange-500/20" : "from-green-500/20 to-emerald-500/20"} rounded-full animate-pulse`}
              ></div>
              <div
                className={`absolute inset-2 bg-gradient-to-r ${isPending ? "from-amber-500/10 to-orange-500/10" : "from-green-500/10 to-emerald-500/10"} rounded-full animate-pulse`}
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isPending ? (
                  <Clock className="w-20 h-20 text-amber-500 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
                )}
              </div>
            </div>
          </div>

          {/* Status Title */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              {isPending ? "Payment Pending" : "Payment Successful!"}
            </h1>
            <p className="text-lg text-gray-300">
              {isPending
                ? "Your order has been placed. We're waiting for PayPal to confirm the payment."
                : "Thank you for your purchase. Your order has been confirmed."}
            </p>
          </div>

          {/* Pending Payment Notice */}
          {isPending && (
            <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 animate-slide-in-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-medium">Payment Authorization Pending</p>
                    <p className="text-sm text-gray-300 mt-1">
                      PayPal is processing your payment. This usually takes a few minutes. Your order will be confirmed
                      once the payment is authorized.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Details Card */}
          <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Number */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-700">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Number</p>
                  <p className="text-lg font-semibold text-white">{orderData.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Date</p>
                  <p className="text-lg font-semibold text-white">
                    {new Date(orderData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">
                    {capture.amount?.currency_code || "USD"} {capture.amount?.value || orderData.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="text-white font-medium">
                    {paymentSource.email_address ? "PayPal" : "Credit Card"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payment Status</span>
                  <span className={`font-medium ${isPending ? "text-amber-400" : "text-green-400"}`}>
                    {isPending ? "Pending" : "Completed"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {capture.amount?.currency_code || "USD"} {capture.amount?.value || orderData.total}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Email Card */}
          <Card
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 animate-slide-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-medium">Confirmation email sent</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {isPending
                      ? "A confirmation email has been sent. You'll receive another email once your payment is confirmed."
                      : "A detailed invoice and receipt have been sent to your email address."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a
              href="/orders"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-500/90 hover:to-blue-500/90 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              View My Orders
            </a>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-600 text-gray-300 hover:bg-slate-700/50 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </a>
          </div>

          {/* Additional Info */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">
              Need help?{" "}
              <a href="/support" className="text-primary hover:text-primary/80 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
