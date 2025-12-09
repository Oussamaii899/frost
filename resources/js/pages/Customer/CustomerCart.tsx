"use client"

import { useState, useEffect, useMemo } from "react"
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getIcon } from "../Admin/icon-map"
import { usePayPalScript } from "@/hooks/usePayPalScript"
import { toast, Toaster } from "sonner"
import { router } from "@inertiajs/react"

interface CartItem {
  id: string
  name: string
  price: number
  amount: number
  category?: Array<string>
  slug: string
}

export default function CartPage({ products }: { products?: any }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [Total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [showPaymentView, setShowPaymentView] = useState(false)

  const availabelProducts = products.filter((product: any) => product.stock > 0)
  useEffect(() => {
    try {
      const cartSlugs = JSON.parse(localStorage.getItem("cart") || "[]")
      if (Array.isArray(cartSlugs) && availabelProducts.length > 0) {
        const filteredProducts = availabelProducts.filter((product: any) => cartSlugs.includes(product.slug))
        setCartItems(
          filteredProducts.map((product: any) => ({
            ...product,
            amount: 1,
          })),
        )
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
    setIsLoading(false)
  }, [products])

  useEffect(() => {
    const cartSlugs = cartItems.map((item) => item.slug)
    localStorage.setItem("cart", JSON.stringify(cartSlugs))
  }, [cartItems])

  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.amount, 0), [cartItems])
  const tax = useMemo(() => subtotal * 0.1, [subtotal])
  const total = useMemo(() => subtotal , [subtotal])

  const totalPages = Math.ceil(cartItems.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedItems = cartItems.slice(startIdx, startIdx + itemsPerPage)

  const updateAmount = (slug: string, amount: number) => {
    if (amount <= 0) {
      removeItem(slug)
      return
    }
    setCartItems(cartItems.map((item) => (item.slug === slug ? { ...item, amount } : item)))
  }

  const removeItem = (slug: string) => {
    setCartItems(cartItems.filter((item) => item.slug !== slug))
    if (paginatedItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const paypalLoaded = usePayPalScript("AbdQZ6taSn-9G1daVMouYz9k_98y0UTX1R3N_hLSNs4nGtQB3Ps9wVZoJdGHeC2-qTJWFcCAnyTQ5exY")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isPaymentReady, setIsPaymentReady] = useState(false)

  useEffect(() => {
    if (!orderId || !paypalLoaded || !isPaymentReady) return

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
            body: JSON.stringify({ order_id: orderId }),
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
            .then((res) => {
              localStorage.removeItem("cart")
              router.get(route("order.success", res.storedData))
            })
        },

        onCancel: () => {
          fetch("/order/cancel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
            },
            body: JSON.stringify({ order_id: orderId }),
          })
        },
      })
      .render("#paypal-button-container")
  }, [orderId, paypalLoaded, isPaymentReady])

  async function proceedToCheckout() {
    try {
      const cartPayload = cartItems.map((item) => ({
        slug: item.slug,
        amount: item.amount,
      }))

      const res = await fetch("/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
        },
        body: JSON.stringify({ cart: cartPayload }),
      })

      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      setOrderId(data.order_id)
      setShowPaymentView(true)
      setPaymentMethod("paypal")
      setIsPaymentReady(true)
    } catch (err) {
      console.error(err)
    }
  }

  const closePaymentView = () => {
    setShowPaymentView(false)
    setPaymentMethod(null)
    setIsPaymentReady(false)
    router.post("/order/cancel", {
      order_id: orderId,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <ShoppingCart className="w-12 h-12 text-primary animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <Toaster position="top-right" />
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl animate-float"></div>
      </div>

      <main className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <a
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Shopping</span>
            </a>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary" />
              Shopping Cart
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {cartItems.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-12 pb-12 text-center">
                <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Start shopping to add items to your cart</p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-500/90 text-white rounded-lg font-medium transition-colors"
                >
                  Continue Shopping
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {paginatedItems.map((item, index) => {
                  const Icon = getIcon(item.category.icon)

                  return (
                    <Card
                      key={item.slug}
                      className="bg-slate-800/50 border-slate-700 hover:border-primary/40 transition-all duration-300 animate-slide-in-left"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="w-full sm:w-24 h-24 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-lg flex items-center justify-center">
                              {Icon ? (
                                <Icon className="w-12 h-12 text-primary" />
                              ) : (
                                <div className="w-12 h-12 bg-primary/30 rounded" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                            <p className="text-primary font-bold text-xl mt-2">${item.price.toFixed(2)}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2">
                              <button
                                onClick={() => updateAmount(item.slug, item.amount - 1)}
                                className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                                aria-label="Decrease amount"
                              >
                                <Minus className="w-4 h-4 text-gray-400" />
                              </button>
                              <span className="w-8 text-center text-white font-medium">{item.amount}</span>
                              <button
                                onClick={() => updateAmount(item.slug, item.amount + 1)}
                                className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                                aria-label="Increase amount"
                              >
                                <Plus className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.slug)}
                              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <span className="text-xs sm:text-sm text-gray-400">
                      Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, cartItems.length)} of {cartItems.length}{" "}
                      items
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </button>
                      <span className="text-xs text-gray-400 flex items-center px-2">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card
                  className="bg-slate-800/50 border-slate-700 sticky top-24 animate-slide-in-right"
                  style={{ animationDelay: "0.2s" }}
                >
                  <CardHeader>
                    <CardTitle className="text-white">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-white font-semibold text-lg">Total</span>
                      <span className="text-primary font-bold text-2xl">${total.toFixed(2)}</span>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={proceedToCheckout}
                      className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-500/90 hover:to-blue-500/90 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to Checkout
                    </button>

                    {/* Continue Shopping */}
                    <a
                      href="/"
                      className="block w-full text-center py-2 border border-slate-700 text-gray-300 hover:bg-slate-700/50 rounded-lg transition-colors font-medium"
                    >
                      Continue Shopping
                    </a>

                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

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
                <p className="text-gray-400 mb-4">Total Amount</p>
                <p className="text-3xl font-bold text-primary">${total.toFixed(2)}</p>
              </div>

              {/* PayPal Button Container */}
              <div id="paypal-button-container" className="mt-6"></div>
              
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
