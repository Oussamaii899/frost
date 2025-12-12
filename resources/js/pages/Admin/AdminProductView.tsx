"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { AdminLayout } from "@/layouts/AdminLayout"
import { useState } from "react"
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
import { router } from "@inertiajs/react"
import { toast } from "sonner"
import { StockForm } from "@/components/StockForm"
import { StockDisplayItem } from "@/components/StockDisplayItem"
import { AdminHeader } from "./AdminHeader"

const INITIAL_DISPLAY = 5

export default function AdminProductView({ product }: { product: any }) {
  const [isAddStockOpen, setIsAddStockOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteStockId, setDeleteStockId] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  console.log(product)
  const handleAddStock = async (stocks: any[]) => {
    setIsLoading(true)
    try {
      // Call backend StockAdd function
      console.log(stocks)
      router.post(`/admin/products/${product.id}/stock/`, { stocks })
      toast.success("Stock added successfully!")
      setIsAddStockOpen(false)
    } catch (error) {
      toast.error("Failed to add stock")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStock = (stockId: number) => {
    router.delete(route('stock.remove', {product: product.id, stock: stockId}), {
      onSuccess: () => {
        toast.success("Stock deleted successfully!")
        setDeleteStockId(null)
      },
      onError: () => {
        toast.error("Failed to delete stock")
      },
    })
  }

  const stocks = product.stocks || []
  const displayedStocks = isExpanded ? stocks : stocks.slice(0, INITIAL_DISPLAY)
  const hasMoreStocks = stocks.length > INITIAL_DISPLAY

  return (
    <AdminLayout currentPath={`/admin/products/${product.slug}`}>
      <AdminHeader />
      <div className="p-6 space-y-6 max-w-4xl">
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

        <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-white">Stocks</CardTitle>
            <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 h-9 px-3">
                  <Plus className="w-4 h-4" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800/50 border-slate-700 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Stock</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add one or more stock items to this product
                  </DialogDescription>
                </DialogHeader>
                <StockForm onSubmit={handleAddStock} isLoading={isLoading} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {stocks && stocks.length > 0 ? (
              <div className="space-y-3">
                {displayedStocks.map((stock: any) => (
                  <div key={stock.id} className="p-3 bg-slate-900/30 border border-slate-700 rounded space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <StockDisplayItem data={typeof stock.data === "string" ? JSON.parse(stock.data) : stock.data} />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setDeleteStockId(stock.id)}
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800/50 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Delete Stock</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Are you sure you want to delete this stock? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                className="border-slate-600 text-gray-400 hover:bg-slate-700/50 bg-transparent"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={() => deleteStockId && handleDeleteStock(deleteStockId)}
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(stock.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No stocks added yet</p>
            )}
          </CardContent>

          {hasMoreStocks && (
            <div className="flex items-center justify-center p-4 sm:p-6 border-t border-slate-700">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                {isExpanded ? "Show Less" : `Show More (${stocks.length - INITIAL_DISPLAY} more)`}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
