import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PWAProvider } from "@/components/pwa-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MiArmario - Tu Asistente de Moda Personal",
  description: "Organiza tu ropa, crea outfits perfectos y descubre las últimas tendencias con inteligencia artificial",
  keywords: ["moda", "armario", "outfit", "ropa", "estilo", "tendencias", "AI", "fashion"],
  authors: [{ name: "MiArmario Team" }],
  creator: "MiArmario",
  publisher: "MiArmario",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://miarmario.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MiArmario - Tu Asistente de Moda Personal",
    description:
      "Organiza tu ropa, crea outfits perfectos y descubre las últimas tendencias con inteligencia artificial",
    url: "https://miarmario.app",
    siteName: "MiArmario",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MiArmario - Tu Asistente de Moda Personal",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MiArmario - Tu Asistente de Moda Personal",
    description:
      "Organiza tu ropa, crea outfits perfectos y descubre las últimas tendencias con inteligencia artificial",
    images: ["/og-image.png"],
    creator: "@miarmario",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MiArmario",
  },
  applicationName: "MiArmario",
  referrer: "origin-when-cross-origin",
  category: "lifestyle",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ec4899" },
    { media: "(prefers-color-scheme: dark)", color: "#ec4899" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MiArmario" />
        <meta name="application-name" content="MiArmario" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <PWAProvider>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                {children}
              </div>
              <Toaster />
            </PWAProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
