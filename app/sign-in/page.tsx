'use client'

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { doCredentialLogin } from "../actions/login"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"

// Wrapper to satisfy Next.js requirement: useSearchParams must be within Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-6">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile/profileinfo";
  const [error, setError] = React.useState<string | null>(null);

  const onSubmitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      // Ensure callbackUrl is passed to the server action
      formData.set("callbackUrl", callbackUrl);
      const response = await doCredentialLogin(formData);
      if (response?.error) {
        setError(response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Welcome back! Please enter your credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitLoginForm} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-9" required />
              </div>
            </div>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account? {" "}
            <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
