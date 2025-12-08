import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { PWAProvider } from "@/components/pwa-provider"

export const metadata: Metadata = {
  title: "Connectrix - University Club Management",
  description: "Streamline and digitize student club activities",
  generator: 'v0.dev',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Connectrix',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Connectrix" />
      </head>
      <body className="font-sans">
        <ErrorBoundary>
          <AuthProvider>
            <SidebarProvider>
              <PWAProvider>
                {children}
                <Toaster />
              </PWAProvider>
            </SidebarProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
