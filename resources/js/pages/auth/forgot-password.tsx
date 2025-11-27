"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle, MailCheck } from "lucide-react"
import type { FormEventHandler } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AuthLayout from "@/pages/auth/AuthLayout"

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
    email: "",
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("password.email"))
  }

  return (
    <AuthLayout title="Reset Password">
      <Head title="Forgot password" />

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-md animate-slide-in-up">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-2">
            <MailCheck className="w-8 h-8 text-cyan-400 animate-pulse-slow" />
          </div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Enter your email to receive a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="off"
                value={data.email}
                autoFocus
                onChange={(e) => setData("email", e.target.value)}
                placeholder="email@example.com"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-primary transition-colors"
              />
              <InputError message={errors.email} />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25"
              disabled={processing}
            >
              {processing ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Remember your password?{" "}
            <TextLink href={route("login")} className="text-primary hover:text-accent transition-colors">
              Log in
            </TextLink>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
