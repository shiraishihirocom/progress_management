"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LoginButton() {
  return (
    <Button 
      className="w-full" 
      onClick={() => signIn("google", { 
        callbackUrl: `${window.location.origin}/dashboard`,
        redirect: true
      })}
    >
      Googleでログイン
    </Button>
  )
} 