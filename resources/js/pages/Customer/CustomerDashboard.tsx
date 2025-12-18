import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Package, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import CustomerLayout from "@/layouts/CustomerLayout"
import { CustomerHeader } from "./CustomerHeader"


export default function CustomerDashboard({ recentOrders, stats }: { recentOrders?: any, stats?: any }) {
  const dashboardStats = [
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-primary" },
    { title: "Active Orders", value: stats.activeOrders, icon: Package, color: "text-blue-400" },
    { title: "Pending", value: stats.pendingOrders, icon: Clock, color: "text-orange-400" },
  ]
  console.log(recentOrders);
  console.log(stats);
  return (
    <CustomerLayout>
      <CustomerHeader />
      <div className="p-6 space-y-6">
        <div className="animate-slide-in-up">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your account activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card
              key={stat.title}
              className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 group animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                      {stat.value}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Orders</CardTitle>
            <a href="/orders">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-slate-700/50">
                View All
              </Button>
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <a
                  key={order.id}
                  href={`/orders/${order.order_id}`}
                  className="flex justify-between items-center py-3 border-b border-slate-700 last:border-0 hover:bg-slate-700/30 -mx-6 px-6 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">Order #{order.order_id}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.created_at).toLocaleDateString()} • {order.products.length} {order.products.length > 1 ? 'items' : 'item'}
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-primary font-semibold">{order.total}</p>
                    <p
                      className={`text-sm ${order.status === "Completed"
                        ? "text-green-400"
                        : order.status === "Processing"
                          ? "text-blue-400"
                          : "text-orange-400"
                        }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/">
              <Button className="w-full bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white">
                Browse Products
              </Button>
            </a>
            <a href="/orders">
              <Button className="w-full bg-slate-700 text-white hover:bg-slate-600">Track Orders</Button>
            </a>
            <a href="/support">
              <Button className="w-full bg-slate-700 text-white hover:bg-slate-600">Contact Support</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}
