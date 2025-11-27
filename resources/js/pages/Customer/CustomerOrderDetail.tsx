import { CustomerHeader } from "@/pages/Customer/CustomerHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ChevronUp, Download } from "lucide-react"
import CustomerLayout from "@/layouts/CustomerLayout"
import { useState } from "react"



export default function CustomerOrderDetail({ order }: {order?:any}) {
  
  const [showAllItems, setShowAllItems] = useState(false)

  console.log(order)

  const itemsToDisplay = showAllItems ? order.products : order.products.slice(0, 5)
  const hasMoreItems = order.products.length > 5

  return (
    <CustomerLayout>
      <CustomerHeader />
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
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2">
            <Download className="w-4 h-4" />
            Invoice
          </Button>
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
                <CardTitle className="text-white">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <strong>Method:</strong> 
                  </p>
                  <p>
                    <strong>Address:</strong> 
                  </p>
                  <p>
                    <strong>City:</strong> 
                  </p>
                  <p>
                    <strong>Country:</strong> 
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <Badge className={order.status === 'Completed' ? 'mt-1 bg-green-500/20 text-green-500 border-green-500/30 capitalize'
                                  : order.status === 'Processing' ? 'mt-1 bg-cyan-500/20 text-cyan-500 border-cyan-500/30 capitalize': 'mt-1 bg-orange-500/20 text-orange-500 border-orange-500/30 capitalize'
                   }>{order.status}</Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <p className="text-primary font-bold text-xl mt-1">{order.total}</p>
                </div>
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
    </CustomerLayout>
  )
}
