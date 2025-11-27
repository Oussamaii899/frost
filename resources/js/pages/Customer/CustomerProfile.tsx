"use client"

import type React from "react"

import { useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, X, Save, RefreshCcw, Upload } from "lucide-react"
import { toast, Toaster } from "sonner"
import CustomerLayout from "@/layouts/CustomerLayout"
import { router } from "@inertiajs/react"

type ProfileUser = {
  id?: number
  name?: string
  email?: string
  phone?: string | null
  address?: string | null
  avatar?: string | null
  banner?: string | null
  createdAt?: string
}

type ProfileFormState = {
  name: string
  email: string
  phone: string
  address: string
  avatar: File | null
  banner: File | null
}

interface CustomerProfileProps {
  user?: ProfileUser
}

export default function CustomerProfile({ user: providedUser }: CustomerProfileProps) {
  const user =
    providedUser ?? ({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State 12345",
      avatar: "/user-avatar.jpg",
      banner: "/user-banner.jpg",
      createdAt: new Date().toISOString(),
    } as ProfileUser)

  const [isEditing, setIsEditing] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [data, setData] = useState<ProfileFormState>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    avatar: null,
    banner: null,
  })

  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar ?? "")
  const [bannerPreview, setBannerPreview] = useState<string>(user?.banner ?? "")

  const initials = useMemo(() => {
    if (!data.name) return "U"
    return data.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }, [data.name])

  const handleFieldChange =
    (field: Exclude<keyof ProfileFormState, "avatar" | "banner">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "avatar" | "banner") => {
    const file = e.target.files?.[0]
    if (!file) return

    if (field === "banner") {
      setIsUploadingBanner(true)
      setTimeout(() => setIsUploadingBanner(false), 800)
    } else {
      setIsUploadingAvatar(true)
      setTimeout(() => setIsUploadingAvatar(false), 800)
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (field === "avatar") {
        setAvatarPreview(event.target?.result as string)
      } else {
        setBannerPreview(event.target?.result as string)
      }
    }
    reader.readAsDataURL(file)
    setData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("_method", "put")
    formData.append("name", data.name ?? "")
    formData.append("email", data.email ?? "")
    formData.append("phone", data.phone ?? "")
    formData.append("address", data.address ?? "")
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar)
    }
    if (data.banner instanceof File) {
      formData.append("banner", data.banner)
    }

    console.log(formData);
    console.log(data);
    console.log(data.avatar);
    console.log(data.banner);
    router.post(route('customer.profile.update'), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Profile updated successfully")
        setIsEditing(false)
      },
      onError: () => {
        toast.error("Profile failed to update")
      },
    })
  }

  const handleReset = () => {
    setData({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      avatar: null,
      banner: null,
    })
    setAvatarPreview(user?.avatar ?? "")
    setBannerPreview(user?.banner ?? "")
    setIsEditing(false)
  }

  const bannerStyle = bannerPreview
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.92) 100%), url(${bannerPreview})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundImage: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.25))" }

  return (
    <CustomerLayout currentPage="/profile">
      <div className="p-4 md:p-8 space-y-6">
        <Toaster position="top-right" richColors />

        {!isEditing ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-400 mt-2">Manage your account and personal information</p>
            </div>

            <Card className="bg-slate-800/30 backdrop-blur-xl py-0 border border-white/10 overflow-hidden">
              <div className="h-40 md:h-48 w-full relative top-0" style={bannerStyle}>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/60"></div>
              </div>

              <CardContent className="relative px-4 md:px-8 pb-8 -mt-12 md:-mt-17">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-slate-800 shadow-2xl ring-2 ring-cyan-500/30 flex-shrink-0">
                    <AvatarImage src={avatarPreview || undefined} alt={data.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-2xl md:text-3xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 w-full">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{data.name}</h2>
                    <p className="text-cyan-400 text-sm md:text-base mb-3">
                      @{data.name?.toLowerCase().replace(/\s+/g, "_") || "user"}
                    </p>
                    <div className="flex flex-col gap-2 text-xs md:text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        {data.email}
                      </span>
                      {user?.createdAt && (
                        <span className="text-xs">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-white flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-400 mb-2 block">Full Name</label>
                    <div className="bg-slate-900/40 border border-slate-700/50 rounded px-3 py-2 text-sm md:text-base text-white">
                      {data.name || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-400 mb-2 block flex items-center gap-2">
                      <Phone className="w-3 h-3 md:w-4 md:h-4 text-cyan-400 flex-shrink-0" />
                      Phone Number
                    </label>
                    <div className="bg-slate-900/40 border border-slate-700/50 rounded px-3 py-2 text-sm md:text-base text-white">
                      {data.phone || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-400 mb-2 block flex items-center gap-2">
                      <Mail className="w-3 h-3 md:w-4 md:h-4 text-cyan-400 flex-shrink-0" />
                      Email Address
                    </label>
                    <div className="bg-slate-900/40 border border-slate-700/50 rounded px-3 py-2 text-sm md:text-base text-white">
                      {data.email}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-400 mb-2 block flex items-center gap-2">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-cyan-400 flex-shrink-0" />
                      Address
                    </label>
                    <div className="bg-slate-900/40 border border-slate-700/50 rounded px-3 py-2 text-sm md:text-base text-white">
                      {data.address || "Not provided"}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-1/4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-5 md:py-6 rounded text-sm md:text-base"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-0">
            <Card className="bg-slate-800/95 backdrop-blur-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded shadow-2xl">
              <CardHeader className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-white/10 flex flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg md:text-xl text-white">Edit Profile</CardTitle>
                  <p className="text-xs text-gray-400 mt-1">Update your personal information</p>
                </div>
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-4 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-semibold text-gray-300">Banner</label>
                    <div
                      className="h-24 md:h-32 w-full rounded cursor-pointer group relative overflow-hidden transition-transform hover:scale-[1.02]"
                      style={bannerStyle}
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        {isUploadingBanner ? (
                          <div className="text-white flex flex-col items-center gap-2">
                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs">Uploading...</span>
                          </div>
                        ) : (
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs md:text-sm font-medium">
                            <Upload className="w-4 h-4 md:w-5 md:h-5" />
                            Change Banner
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-semibold text-gray-300">Avatar</label>
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-slate-800 ring-2 ring-cyan-500/30">
                          <AvatarImage src={avatarPreview || undefined} alt={data.name || "User"} />
                          <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-2xl md:text-4xl font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-full transition-colors flex items-center justify-center">
                          {isUploadingAvatar ? (
                            <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Upload className="w-5 h-5 md:w-6 md:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs md:text-sm text-gray-300 font-semibold" htmlFor="name">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={handleFieldChange("name")}
                        className="bg-slate-900/50 border-slate-700/50 text-white text-sm md:text-base mt-1"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <Label className="text-xs md:text-sm text-gray-300 font-semibold" htmlFor="phone">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={data.phone}
                        onChange={handleFieldChange("phone")}
                        className="bg-slate-900/50 border-slate-700/50 text-white text-sm md:text-base mt-1"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label className="text-xs md:text-sm text-gray-300 font-semibold" htmlFor="email">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={handleFieldChange("email")}
                        className="bg-slate-900/50 border-slate-700/50 text-white text-sm md:text-base mt-1"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <Label className="text-xs md:text-sm text-gray-300 font-semibold" htmlFor="address">
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        value={data.address}
                        onChange={handleFieldChange("address")}
                        className="bg-slate-900/50 border-slate-700/50 text-white text-sm md:text-base mt-1 resize-none"
                        placeholder="Street, City, State, ZIP"
                        rows={3}
                      />
                    </div>
                  </div>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "avatar")}
                    className="hidden"
                  />
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "banner")}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm md:text-base font-semibold py-5 md:py-6"
                    >
                      <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 border border-slate-700 text-gray-300 hover:bg-slate-700/50 text-sm md:text-base font-semibold py-5 md:py-6"
                    >
                      <RefreshCcw className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

