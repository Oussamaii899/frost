
import type React from "react"

import { AdminHeader } from "@/pages/Admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AdminLayout } from "@/layouts/AdminLayout"
import { router } from "@inertiajs/react"
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


const ArrowLeft = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
)

export default function AdminProductEdit({categories, product}: {categories?: any, product?: any}) {
  const [formData, setFormData] = useState({
      name: product.name,
      category_id: product.category_id ? String(product.category_id) : "",
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      description: product.description,
    })  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Product updated:", formData);    
    toast.success("Product updated successfully!")
    router.put(route('admin.products.update', product.id), {
      name: formData.name,
      category_id: Number(formData.category_id),
      price: formData.price,
      originalPrice: formData.originalPrice,
      stock: formData.stock,
      description: formData.description,
    })
    
  }

  const handleDelete = () => {
      toast.success("Product deleted successfully!")
      router.delete(`/admin/products/${product.id}`)
  }

  return (
    <AdminLayout currentPath="/admin/products/edit">
      <AdminHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between animate-slide-in-up">
          <div className="flex items-center gap-4">
            <a href="/admin/products" className="text-gray-400 hover:text-white transition-colors">
               <ArrowLeft />
            </a>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Product</h1>
              <p className="text-gray-400 mt-1">Update product information</p>
            </div>
          </div>
{/*           <Button
            onClick={handleDelete}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 gap-2 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
            Delete Product
          </Button> */}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10 gap-2 bg-transparent"
              >
                 <Trash2 className="w-4 h-4" />
                 Delete Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800/50 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Are you sure you want to delete this product? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-gray-400 hover:bg-slate-700/50 bg-transparent mr-2"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleDelete}
                  className="bg-destructive text-white hover:bg-destructive/90 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-white">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Category *
                  </Label>
                  <Select required value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue placeholder={categories && categories.find((category: any) => String(category.id) === formData.category_id)?.name} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {categories && categories.map((category: any) => (
                        <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="text-white">
                    Original Price *  
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-white">
                  Stock Quantity *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <a href="/admin/products">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-600 text-gray-400 hover:bg-slate-700/50 bg-transparent"
                  >
                    Cancel
                  </Button>
                </a>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 px-6 py-2 font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25"
                >
                  <Save className="w-4 h-4" />
                 Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  )
}
