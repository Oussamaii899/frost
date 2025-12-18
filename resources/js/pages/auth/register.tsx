"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle, UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react"
import type { FormEventHandler } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import AuthLayout from "@/pages/auth/AuthLayout"

type RegisterForm = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    })
  }

  return (
    <AuthLayout title="Create Account">
      <Head title="Register" />

      <Card className="w-full max-w-md bg-slate-900/60 border-white/10 backdrop-blur-xl shadow-2xl animate-slide-in-up overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

        <CardHeader className="space-y-3 text-center pb-2 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl flex items-center justify-center mb-2 ring-1 ring-white/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <UserPlus className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Join us to verify your access
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 pt-6">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 text-xs font-semibold uppercase tracking-wider ml-1">
                Full Name
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  disabled={processing}
                  placeholder="John Doe"
                  className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                />
              </div>
              <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-xs font-semibold uppercase tracking-wider ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  disabled={processing}
                  placeholder="name@example.com"
                  className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                />
              </div>
              <InputError message={errors.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-xs font-semibold uppercase tracking-wider ml-1">
                Password
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  disabled={processing}
                  placeholder="Create a password"
                  className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                />
              </div>
              <InputError message={errors.password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-gray-300 text-xs font-semibold uppercase tracking-wider ml-1">
                Confirm Password
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  disabled={processing}
                  placeholder="Confirm your password"
                  className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                />
              </div>
              <InputError message={errors.password_confirmation} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-white font-bold text-base rounded-xl group transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-[1.02]"
              disabled={processing}
            >
              {processing ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <TextLink href={route("login")} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Log in
              </TextLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
