"use client"

import type React from "react"

import { useState } from "react"
import { AdminHeader } from "@/pages/Admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { AdminLayout } from "@/layouts/AdminLayout"
import { toast, Toaster } from "sonner"
import { router } from "@inertiajs/react"

export default function AdminCategoryCreate() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    status: "active",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAutoSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    setFormData((prev) => ({
      ...prev,
      slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    router.post(route('admin.categories.store'), formData, {
      onStart: () => setIsLoading(true),
      onFinish: () => setIsLoading(false),
      onSuccess: () => {
        toast.success("Category created successfully!")
      },
      onError: () => {
        toast.error("Failed to create category.")
      },
    })
  }

  return (
    <AdminLayout>
      <AdminHeader />
        <Toaster position="top-right" richColors />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 animate-slide-in-up">
          <a href="/admin/categories" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Category</h1>
            <p className="text-gray-400 mt-1">Create a new category for your products</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-white">Category Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-gray-300 text-sm font-medium">Category Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Electronics"
                      className="w-full mt-2 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium">Slug</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="e.g., electronics"
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      />
                      <Button
                        type="button"
                        onClick={handleAutoSlug}
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:bg-slate-700/50 bg-transparent"
                      >
                        Auto
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Add a description for this category..."
                      className="w-full mt-2 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors min-h-24 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium">Icon (e.g., ShoppingCart, Zap)</label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      placeholder="e.g., ShoppingCart"
                      className="w-full mt-2 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25"
                    >
                      <Plus className="w-4 h-4" />
                      {isLoading ? "Creating..." : "Create Category"}
                    </Button>
                    <a href="/admin/categories">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:bg-slate-700/50 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-right sticky top-24">
              <CardHeader>
                <CardTitle className="text-white text-base">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-400">
                <div>
                  <p className="font-medium text-gray-300 mb-1">Slug</p>
                  <p>URL-friendly version of the category name. Use lowercase and hyphens.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-300 mb-1">Icon</p>
                  <p>Use Lucide React icon names like: ShoppingCart, Zap, Heart, etc.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-300 mb-1">Status</p>
                  <p>Inactive categories won't be visible to customers.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
