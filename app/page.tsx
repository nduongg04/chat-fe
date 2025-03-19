import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Messenger - Modern Chat Platform",
  description: "A modern messaging platform UI",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Messenger</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Connect with friends and the world around you.</p>
        </div>
        <div className="mt-8 space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/signup">Create New Account</Link>
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

