import type React from "react"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"
import { SessionProvider } from "@/components/session-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { authOptions } from "@/lib/auth"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "3Dモデリング課題管理システム",
  description: "専門学校における3Dモデリング課題の提出・管理を効率化するシステム",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
