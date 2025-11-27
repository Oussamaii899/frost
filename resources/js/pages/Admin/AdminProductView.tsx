"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ArrowLeft } from "lucide-react"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"


export default function AdminProductView({ product }: { product: any }) {
  return (
    <AdminLayout currentPath={`/admin/products/${product.slug}`}>
      <AdminHeader />
      <div className="p-6 space-y-6 max-w-2xl">
        <div className="flex items-center gap-4 animate-slide-in-up">
          <a href="/admin/products" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-cyan-400" />
              Product Details
            </h1>
            <p className="text-gray-400 mt-1">View product information</p>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Category</p>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{product.category.name}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Stock Status</p>
                <Badge
                  className={
                    product.stock > 0
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }
                >
                  {product.stock}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Price</p>
              <p className="text-2xl font-bold text-cyan-400">{product.price}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Description</p>
              <p className="text-gray-300">{product.description}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <a href={`/admin/products/${product.slug}/edit`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  Edit Product
                </Button>
              </a>
              <a href="/admin/products" className="flex-1">
                <Button className="w-full bg-slate-700 text-white hover:bg-slate-600">Back</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
