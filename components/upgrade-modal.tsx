"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, Sparkles, TrendingUp, BarChart3, Zap, Check, X, Clock, Heart, Thermometer } from "lucide-react"
import type { UserSubscription } from "@/lib/subscription"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: UserSubscription | null
  trigger?: "daily_limit" | "feature_locked" | "early_access_ending"
}

export function UpgradeModal({ open, onOpenChange, subscription, trigger }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")

  const getModalContent = () => {
    switch (trigger) {
      case "daily_limit":
        return {
          title: "¡Has alcanzado tu límite diario! 🎯",
          description: "Has usado todos tus looks gratuitos de hoy. Hazte Premium para looks ilimitados.",
          highlight: "daily_limit",
        }
      case "early_access_ending":
        return {
          title: "🚀 Tu Early Access está terminando",
          description: `¡Has creado ${subscription?.total_looks_generated || 0} looks increíbles! Continúa con Premium.`,
          highlight: "early_access",
        }
      case "feature_locked":
        return {
          title: "🔒 Función Premium",
          description: "Esta función está disponible solo para usuarios Premium.",
          highlight: "features",
        }
      default:
        return {
          title: "👑 Desbloquea todo el potencial",
          description: "Lleva tu estilo al siguiente nivel con MiArmario Premium.",
          highlight: "general",
        }
    }
  }

  const content = getModalContent()

  const features = [
    { icon: Zap, text: "Looks ilimitados por día", free: false, premium: true },
    { icon: TrendingUp, text: "Recreaciones trending ilimitadas", free: false, premium: true },
    { icon: BarChart3, text: "Análisis de estilo completo", free: false, premium: true },
    { icon: Sparkles, text: "AI Stylist personal", free: false, premium: true },
    { icon: Thermometer, text: "Outfits clima premium", free: false, premium: true },
    { icon: Heart, text: "Favoritos y estadísticas avanzadas", free: false, premium: true },
    { icon: Clock, text: "Planificador semanal", free: false, premium: true },
  ]

  const handleUpgrade = async (plan: "monthly" | "yearly") => {
    // Aquí implementarías la integración con Stripe/PayPal
    console.log(`Upgrading to ${plan} plan`)
    // Por ahora, solo cerramos el modal
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{content.title}</DialogTitle>
          <DialogDescription className="text-center text-lg">{content.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          {/* Estadísticas del usuario */}
          {subscription && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-center">📊 Tu actividad en MiArmario</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{subscription.total_looks_generated}</div>
                    <div className="text-sm text-muted-foreground">Looks creados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-600">{subscription.total_recreations}</div>
                    <div className="text-sm text-muted-foreground">Recreaciones</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor((Date.now() - new Date(subscription.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-muted-foreground">Días usando la app</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparación de planes */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Plan Gratuito */}
            <Card className="relative">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">Plan Gratuito</h3>
                  <div className="text-3xl font-bold mt-2">$0</div>
                  <div className="text-sm text-muted-foreground">Siempre gratis</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">3 looks por día</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Hasta 50 prendas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Trending básico</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">AI Stylist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Análisis completo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Premium */}
            <Card className="relative border-2 border-gradient-to-r from-pink-500 to-purple-500">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1">
                  👑 RECOMENDADO
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">MiArmario Premium</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="text-3xl font-bold">$4.99</div>
                    <div className="text-sm text-muted-foreground">/mes</div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">¡50% OFF primer mes!</div>
                </div>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500" />
                      <feature.icon className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  onClick={() => handleUpgrade("monthly")}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Hazte Premium - $2.49 primer mes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Testimonios/Beneficios */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
            <CardContent className="p-4">
              <h3 className="font-semibold text-center mb-3">💎 ¿Por qué elegir Premium?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm font-medium">Sin límites</div>
                  <div className="text-xs text-muted-foreground">Crea todos los looks que quieras</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="text-sm font-medium">AI Personal</div>
                  <div className="text-xs text-muted-foreground">Consejos de moda personalizados</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Análisis Pro</div>
                  <div className="text-xs text-muted-foreground">Conoce tu estilo a fondo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
