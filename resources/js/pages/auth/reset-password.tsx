"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle, Lock } from "lucide-react"
import type { FormEventHandler } from "react"

import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AuthLayout from "@/pages/auth/AuthLayout"

interface ResetPasswordProps {
  token: string
  email: string
}

type ResetPasswordForm = {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation"),
    })
  }

  return (
    <AuthLayout title="Set New Password">
      <Head title="Reset password" />

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-md animate-slide-in-up">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-cyan-400 animate-pulse-slow" />
          </div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Set New Password
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={data.email}
                readOnly
                onChange={(e) => setData("email", e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-gray-400 placeholder:text-gray-500 cursor-not-allowed"
              />
              <InputError message={errors.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={data.password}
                autoFocus
                onChange={(e) => setData("password", e.target.value)}
                placeholder="••••••••"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-primary transition-colors"
              />
              <InputError message={errors.password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                placeholder="••••••••"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-primary transition-colors"
              />
              <InputError message={errors.password_confirmation} />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25 mt-6"
              disabled={processing}
            >
              {processing ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
