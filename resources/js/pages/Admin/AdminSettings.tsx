"use client"

import { AdminHeader } from "./AdminHeader"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SettingsIcon, Save } from "lucide-react"
import { toast, Toaster } from "sonner"
import { useState } from "react"
import { router } from "@inertiajs/react"

export default function AdminSettings({settings}: {settings: any}) {
  const [formData, setFormData] = useState(
    settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, any>)
  )


  console.log(formData);
  console.log(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.put(route('admin.settings.update'), formData, {
      onSuccess: () => {
        toast.success("Settings updated successfully!")
      },
      onError: () => {
        toast.error("Failed to update settings.")
      },
    })
  } 

  return (
    <AdminLayout currentPath="/admin/settings">
      <div className="w-full">
        <Toaster position="top-right" richColors />
        <AdminHeader />
        <div className="p-4 sm:p-6 space-y-6">
          <div className="animate-slide-in-up">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <SettingsIcon className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
              Settings
            </h1>
            <p className="text-sm text-gray-400 mt-1">Manage your application settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="text-white text-lg">Site Settings</CardTitle>
                <CardDescription className="text-gray-400 text-sm">General site configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-white text-sm">
                    Site Name
                  </Label>
                  <Input
                    id="siteName"
                    value={formData.site_name ?? ''}
                    onChange={(e)=>{setFormData({...formData, site_name: e.target.value})}}
                    className="bg-slate-900/50 border-slate-600 text-white text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-white text-sm">
                    Site Description
                  </Label>
                  <Input
                    id="siteDescription"
                    value={formData.site_description ?? ''}
                    onChange={(e)=>{setFormData({...formData, site_description: e.target.value})}}
                    className="bg-slate-900/50 border-slate-600 text-white text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discordLink" className="text-white text-sm">
                    Discord Invite Link
                  </Label>
                  <Input
                    id="discordLink"
                    value={formData.discord_link ?? ''}
                    onChange={(e)=>{setFormData({...formData, discord_link: e.target.value})}}
                    className="bg-slate-900/50 border-slate-600 text-white text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700 animate-slide-in-right"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="text-white text-lg">Features</CardTitle>
                <CardDescription className="text-gray-400 text-sm">Enable or disable features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">Developer Badge</p>
                    <p className="text-xs text-gray-400">Show developer credit in footer</p>
                  </div>
                  <Switch checked={formData.developer_badge === '1'} onCheckedChange={(checked) => setFormData({...formData, developer_badge: checked ? '1' : '0'})} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">Maintenance Mode</p>
                    <p className="text-xs text-gray-400">Temporarily disable the site</p>
                  </div>
                  <Switch checked={formData.maintenance_mode === '1'} onCheckedChange={(checked) => setFormData({...formData, maintenance_mode: checked ? '1' : '0'})} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">Email Notifications</p>
                    <p className="text-xs text-gray-400">Send order confirmation emails</p>
                  </div>
                  <Switch checked={formData.email_notifications === '1'} onCheckedChange={(checked) => setFormData({...formData, email_notifications: checked ? '1' : '0'})} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-white text-lg">Payment Settings</CardTitle>
                <CardDescription className="text-gray-400 text-sm">Configure payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white text-sm">
                    Default Currency
                  </Label>
                  <Input
                    id="currency"
                    value={formData.default_currency ?? ''}
                    onChange={(e)=>{setFormData({...formData, default_currency: e.target.value})}}
                    className="bg-slate-900/50 border-slate-600 text-white text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate" className="text-white text-sm">
                    Tax Rate (%)
                  </Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={formData.tax_rate ?? ''}
                    onChange={(e)=>{setFormData({...formData, tax_rate: e.target.value})}}
                    className="bg-slate-900/50 border-slate-600 text-white text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700 animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="text-white text-lg">SEO Settings</CardTitle>
                <CardDescription className="text-gray-400 text-sm">Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className="text-white text-sm">
                    Meta Title
                  </Label>
                  <Input
                    id="metaTitle"
                    value={formData.Meta_title ?? ''}
                    onChange={(e)=>{setFormData({...formData, Meta_title: e.target.value})}}
                    className="bg-slate-900/50 border-slate-600 text-white text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="text-white text-sm">
                    Meta Description
                  </Label>
                  <Input
                    id="metaDescription"
                    value={formData.Meta_description ?? ''}
                    onChange={(e)=>{setFormData({...formData, Meta_description: e.target.value})}}
                    className="bg-slate-900/50 border-slate-600 text-white text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2 px-6 py-2 font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
