"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Smartphone, Zap } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Verificar si ya está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInWebAppChrome = window.matchMedia("(display-mode: standalone)").matches

      setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome)
    }

    checkIfInstalled()

    // Escuchar evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Mostrar prompt después de 30 segundos si no está instalado
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true)
        }
      }, 30000)
    }

    // Escuchar cuando se instala la app
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)

      // Mostrar notificación de éxito
      if ("serviceWorker" in navigator && "Notification" in window) {
        new Notification("¡MiArmario instalado! 🎉", {
          body: "Ya puedes usar la app desde tu pantalla de inicio",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
        })
      }
    }

    // Estado de conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Registrar service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registrado:", registration)
        })
        .catch((error) => {
          console.log("SW falló:", error)
        })
    }

    // Event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("Usuario aceptó la instalación")
    } else {
      console.log("Usuario rechazó la instalación")
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
    // No mostrar de nuevo por 7 días
    localStorage.setItem("installPromptDismissed", Date.now().toString())
  }

  return (
    <>
      {children}

      {/* Banner de instalación */}
      {showInstallPrompt && deferredPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
          <Card className="border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-500 rounded-full flex-shrink-0">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">📱 ¡Instala MiArmario!</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Accede más rápido y recibe notificaciones de nuevos looks trending
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleInstallClick} className="flex-1">
                      <Download className="mr-1 h-3 w-3" />
                      Instalar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={dismissInstallPrompt}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Indicador de estado offline */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center py-2 text-sm">
          📡 Sin conexión - Algunas funciones pueden estar limitadas
        </div>
      )}

      {/* Indicador de app instalada */}
      {isInstalled && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
            <Zap className="h-3 w-3" />
            App Mode
          </div>
        </div>
      )}
    </>
  )
}
