"use client"

import type React from "react"

import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Edit, Trash2, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

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

const ITEMS_PER_PAGE = 10

export default function AdminProducts({ products }: { products?: any }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const handleDelete = (productId: number) => {
    toast.success("Product deleted successfully!")
    router.delete(`/admin/products/${productId}`)
  }

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products || []
    return (products || []).filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [products, searchQuery])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <AdminLayout currentPath="/admin/products">
      <div className="w-full">
        <AdminHeader />
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-in-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Package className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
                Products
              </h1>
              <p className="text-sm text-gray-400 mt-1">Manage your product catalog</p>
            </div>
            <a href="/admin/products/create">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 px-6 py-2 font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </a>
          </div>

          <div className="relative animate-slide-in-up">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by product name or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-cyan-500"
            />
          </div>

          <Card
            className="bg-slate-800/50 border-slate-700 animate-slide-in-up overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="p-4 sm:p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-gray-300 text-sm">Product</TableHead>
                    <TableHead className="text-gray-300 text-sm">Category</TableHead>
                    <TableHead className="text-gray-300 text-sm">Price</TableHead>
                    <TableHead className="text-gray-300 text-sm">Stock</TableHead>
                    <TableHead className="text-gray-300 text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow key={product.id} className="border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <TableCell className="text-white font-medium text-sm">{product.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary border-primary/30 capitalize text-xs">
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">{product.price}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.stock > 0
                              ? "bg-success/20 text-green-500 border-success/30 text-xs"
                              : "bg-destructive/20 text-red-500 border-destructive/30 text-xs"
                          }
                        >
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href={`/admin/products/${product.slug}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-primary hover:bg-slate-700/50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </a>
                          <a href={`/admin/products/${product.slug}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-primary hover:bg-slate-700/50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </a>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-destructive hover:bg-slate-700/50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800/50 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Delete Product</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Are you sure you want to delete <span className="font-medium">{product.name}</span>?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="border-destructive text-destructive hover:bg-destructive/10 gap-2 bg-transparent mr-2"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="border-slate-600 text-gray-400 hover:bg-slate-700/50 bg-transparent"
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-slate-700">
              <p className="text-sm text-gray-400">
                Showing {paginatedProducts.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-700 text-gray-400 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm text-gray-300">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-700 text-gray-400 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
