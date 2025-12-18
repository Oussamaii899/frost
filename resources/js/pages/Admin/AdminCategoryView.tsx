import { AdminHeader } from "@/pages/Admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit2, Eye, Trash2 } from "lucide-react"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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


export default function AdminCategoryView({ category, totalProducts, totalRevenue }: { category: any, totalProducts: number, totalRevenue: number }) {

  console.log(category);
  console.log(totalRevenue);

  const handleDeleteProduct = (productId: number) => {
    router.delete(`/admin/products/${productId}`)
  }
  return (
    <AdminLayout>
      <AdminHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between animate-slide-in-up">
          <div className="flex items-center gap-4">
            <a href="/admin/categories" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </a>
            <div>
              <h1 className="text-3xl font-bold text-white">{category.name}</h1>
              <p className="text-gray-400 mt-1">Category Details</p>
            </div>
          </div>
          <a href={`/admin/categories/${category.slug}/edit`}>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white gap-2 px-6 py-2 font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25">
              <Edit2 className="w-4 h-4" />
              Edit Category
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-white">Category Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Slug</p>
                  <p className="text-white mt-1 font-medium">{category.slug}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Icon</p>
                  <p className="text-white mt-1 font-medium">{category.icon}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white mt-1">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-white">Category Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <Badge
                    className={
                      category.is_active
                        ? "bg-success/20 text-success border-success/30 text-xs"
                        : "bg-destructive/20 text-destructive border-destructive/30 text-xs"
                    }
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Products</p>
                  <p className="text-white mt-1 font-bold text-xl">{totalProducts}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-primary font-bold text-xl mt-1">${totalRevenue}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-white">Products in this Category</CardTitle>
              </CardHeader>
              <CardContent>
                {category.products && category.products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800/50">
                          <TableHead className="text-gray-300 text-sm">Product Name</TableHead>
                          <TableHead className="text-gray-300 text-sm">Price</TableHead>
                          <TableHead className="text-gray-300 text-sm">Revenue</TableHead>
                          <TableHead className="text-gray-300 text-sm text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.products.map((product: any) => (
                          <TableRow
                            key={product.id}
                            className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                          >
                            <TableCell className="text-white font-medium text-sm">{product.name}</TableCell>

                            <TableCell className="text-gray-300 text-sm">${product.price || "0.00"}</TableCell>
                            <TableCell className="text-primary font-semibold text-sm">
                              ${product.total_revenue || "0.00"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a href={`/admin/products/${product.slug}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-primary hover:bg-slate-700/50"
                                    title="View Product"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </a>
                                <a href={`/admin/products/${product.slug}/edit`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-primary hover:bg-slate-700/50"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                </a>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-destructive hover:bg-slate-700/50"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Are you sure?</DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will permanently delete the product.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            router.delete(`/admin/products/${product.id}`)
                                          }}
                                        >
                                          Delete
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
                ) : (
                  <p className="text-gray-400 text-center py-4">No products found in this category.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
