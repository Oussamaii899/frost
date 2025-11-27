"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { router } from "@inertiajs/react"


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminOrderDetail({ order }: { order: any }) {
  const [editStatus, setEditStatus] = useState(order.status)
    console.log(order);
  const statusOptions = ["Pending", "Processing", "Completed", "Cancelled"]

  const updateProductAmount = (productId: any, newAmount: number) => {
    // Send update to server (will detach if amount <= 0)
    router.put(route('admin.orders.products.update', [order.id, productId]), {
      amount: newAmount,
    })
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.put(route('admin.orders.updateStatus', order.id), {
      status: editStatus,
    })
    console.log(editStatus);
  }
  return (
    <AdminLayout    currentPath={`/admin/orders/${order.order_id}`}>
      <AdminHeader />
      <div className="p-6 space-y-6 max-w-2xl">
        <div className="flex items-center gap-4 animate-slide-in-up">
          <a href="/admin/orders" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-cyan-400" />
              Order #{order.order_id}
            </h1>
            <p className="text-gray-400 mt-1">View and manage order details</p>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                    {statusOptions.filter(status => status !== order.status).map((status) => (
                        <option key={status} value={status} className="bg-slate-900 text-white">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(order.products) && order.products.length > 0 ? (
                (() => {
                  // Aggregate duplicate products by id (sum amounts)
                  const map: Record<string, any> = {};
                  (order.products as any[]).forEach((item: any) => {
                    const id = String(item.id);
                    const amount = Number(item.pivot?.amount ?? item.amount ?? 1);
                    const price = item.pivot?.price ?? item.price ?? 0;
                    if (!map[id]) {
                      map[id] = { ...item, amount, price };
                    } else {
                      map[id].amount = Number(map[id].amount) + amount;
                    }
                  });

                  const aggregated = Object.values(map);

                  return aggregated.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
{/*                           <Button size="sm" variant="ghost" onClick={() => updateProductAmount(item.id, Math.max(0, Number(item.amount) - 1))}>-</Button>*/}
                          <span>amount: {item.amount}</span>
{/*                           <Button size="sm" variant="ghost" onClick={() => updateProductAmount(item.id, item.amount + 1)}>+</Button> */}
                        </div>
                      </div>
                      <p className="text-cyan-400 font-semibold">${Number(item.price).toFixed(2)}</p>
                      {/* <Dialog>
                        <DialogTrigger asChild className="ml-4">
                          <Button variant="ghost" className="text-red-400 hover:text-red-500 hover:bg-red-900/50 gap-2">
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800/50 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Confirm Removal</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Are you sure you want to remove this product from the order? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button className="bg-gray-700 text-white hover:bg-gray-600">Cancel</Button>
                            </DialogClose>
                            <Button
                              onClick={() => router.delete(route('admin.orders.products.destroy', [order.id, item.id]))}
                              className="bg-destructive text-white hover:bg-destructive/90 gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog> */}
                    </div>
                  ));
                })()
              ) : (
                <div className="text-sm text-gray-400">No products</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2">
            <Edit className="w-4 h-4" />
            Save Changes
          </Button>
          
{/*           <Dialog>
            <DialogTrigger asChild className="flex-1">
                <Button className="w-full bg-destructive text-white hover:bg-red-600 gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Order
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800/50 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
                <DialogDescription className="text-gray-400">
                    Are you sure you want to delete this order? This action cannot be undone.
                    </DialogDescription>    
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="bg-gray-700 text-white hover:bg-gray-600">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={() => router.delete(route('admin.orders.destroy', order.id))}
                        className="bg-destructive text-white hover:bg-destructive/90 gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
    </AdminLayout>
  )
}
