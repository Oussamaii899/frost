"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Badge, Package } from "lucide-react"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { router } from "@inertiajs/react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminProductCreate({ categories }: { categories?: any }) {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    originalPrice: "",
    stock: "",
    description: "",
    badge: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post("/admin/products/", {
      name: formData.name,
      category_id: formData.category_id,
      price: formData.price,
      originalPrice: formData.originalPrice,
      stock: formData.stock,
      description: formData.description,
    })
    setFormData({ name: "", category_id: "", price: "", originalPrice: "", stock: "", description: "", badge: "" })
  }

  return (
    <AdminLayout currentPath="/admin/products/create">
      <AdminHeader />
      <div className="p-6 space-y-6 ">
        <div className="animate-slide-in-up">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Create Product
          </h1>
          <p className="text-gray-400 mt-1">Add a new product to your catalog</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="e.g., Nitro Boost"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="-1" selected>Select a category</option>
                    {categories && categories.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    placeholder="$0.00"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge" className="text-white">
                    Badge Status
                  </Label>
                  <Select value={formData.badge} onValueChange={(value) => setFormData({ ...formData, badge: value })}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="not_recommended">Not Recommended</SelectItem>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Original Price</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    placeholder="$0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary min-h-24 resize-none"
                  placeholder="Product description..."
                />
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white">
                  Create Product
                </Button>
                <Button onClick={() => router.visit(route('admin.products.index'))} className="flex-1 w-full bg-slate-700 text-white hover:bg-slate-600">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
