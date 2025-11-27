"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderTree, Plus, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { router } from "@inertiajs/react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"

export default function AdminCategories({categories}: {categories: any[]}) {
  
  const handleDelete = (categoryId: number) => {
    router.delete(route('admin.categories.destroy', categoryId), {
      onSuccess: () => {
        toast.success("Category deleted successfully!")
      },
      onError: () => {
        toast.error("Failed to delete category.")
      },
    })
  }

  return (
    <AdminLayout currentPath="/admin/categories">
      <div className="w-full">
        <AdminHeader />
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-in-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <FolderTree className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
                Categories
              </h1>
              <p className="text-sm text-gray-400 mt-1">Organize your products into categories</p>
            </div>
            <a href="/admin/categories/create">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 px-6 py-2 font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <Card
                key={category.name}
                className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 group animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-white capitalize group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <Badge className="mt-2 bg-primary/20 text-primary border-primary/30 text-xs">
                        {category.products_count} Products
                      </Badge>
                    </div>
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FolderTree className="w-5 sm:w-6 h-5 sm:h-6 text-primary animate-pulse-slow" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <a href={`/admin/categories/${category.slug}`} className="w-full sm:flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-gray-400 hover:text-primary hover:bg-slate-700/50 text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </a>
                    <a href={`/admin/categories/${category.slug}/edit`} className="w-full sm:flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-gray-400 hover:text-primary hover:bg-slate-700/50 text-sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </a>
                    <Dialog key={category.id}>
                      <DialogTrigger className="w-full sm:flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-500 hover:text-red-600 hover:bg-slate-700/50 text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Delete Category</DialogTitle>
                          <DialogDescription className="text-gray-400 mt-2">
                            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <div className="flex justify-end gap-2 w-full">
                            <DialogClose asChild>
                              <Button variant="outline" className="bg-slate-700 text-white hover:bg-slate-600 border-slate-600">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={() => handleDelete(category.id)}
                              className="bg-red-600 text-white hover:bg-red-700 gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
