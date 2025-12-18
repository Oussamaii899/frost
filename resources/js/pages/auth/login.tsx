"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle, LogIn, Mail, Lock, ArrowRight } from "lucide-react"
import type { FormEventHandler } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AuthLayout from "@/pages/auth/AuthLayout"

type LoginForm = {
  email: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: "",
    password: "",
    remember: false,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("login"), {
      onFinish: () => reset("password"),
    })
  }

  return (
    <AuthLayout title="Log In">
      <Head title="Log in" />

      <Card className="w-full max-w-md bg-slate-900/60 border-white/10 backdrop-blur-xl shadow-2xl animate-slide-in-up overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

        <CardHeader className="space-y-3 text-center pb-2 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl flex items-center justify-center mb-2 ring-1 ring-white/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <LogIn className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 pt-6">
          {status && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
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
                    autoFocus
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="name@example.com"
                    className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                  />
                </div>
                <InputError message={errors.email} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Password
                  </Label>
                  {canResetPassword && (
                    <TextLink
                      href={route("password.request")}
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Forgot Password?
                    </TextLink>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 h-12 bg-slate-950/50 border-slate-800 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                  />
                </div>
                <InputError message={errors.password} />
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-950/30 p-3 rounded-lg border border-white/5">
              <Checkbox
                id="remember"
                name="remember"
                checked={data.remember}
                onCheckedChange={(checked) => setData("remember", checked as boolean)}
                className="border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="remember" className="text-gray-300 cursor-pointer text-sm select-none flex-1">
                Keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-white font-bold text-base rounded-xl group transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-[1.02]"
              disabled={processing}
            >
              {processing ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <TextLink href={route("register")} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Create Account
              </TextLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
