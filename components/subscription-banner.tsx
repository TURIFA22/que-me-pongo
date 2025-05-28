"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Sparkles, Clock, Zap } from "lucide-react"
import { SubscriptionManager, type UserSubscription } from "@/lib/subscription"
import { useAuth } from "@/context/auth-context"

export function SubscriptionBanner() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      const sub = await SubscriptionManager.getUserSubscription(user!.id)
      setSubscription(sub)
    } catch (error) {
      console.error("Error al cargar suscripción:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !subscription) {
    return null
  }

  const timeLeft = SubscriptionManager.getTimeUntilEarlyAccessExpires(subscription)

  // Banner para Early Access
  if (subscription.tier === "early_access" && !timeLeft.expired) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-full">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  🚀 Early Access Unlimited
                  <Badge variant="secondary" className="bg-purple-500 text-white">
                    GRATIS
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground">
                  ¡Disfruta de TODO ilimitado por {timeLeft.days} días y {timeLeft.hours} horas más!
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{subscription.total_looks_generated}</div>
              <div className="text-xs text-muted-foreground">looks creados</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Tiempo restante de Early Access</span>
              <span>
                {timeLeft.days}d {timeLeft.hours}h
              </span>
            </div>
            <Progress value={((60 - timeLeft.days) / 60) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Banner para Free (después del early access)
  if (subscription.tier === "free") {
    const dailyProgress = (subscription.daily_looks_used / 3) * 100
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Plan Gratuito</h3>
                <p className="text-sm text-muted-foreground">{3 - subscription.daily_looks_used} looks restantes hoy</p>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Crown className="mr-2 h-4 w-4" />
              Hazte Premium
            </Button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Uso diario</span>
              <span>{subscription.daily_looks_used}/3 looks</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
          </div>
          {subscription.daily_looks_used >= 3 && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Límite alcanzado. Renueva en {24 - new Date().getHours()} horas o hazte Premium.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Banner para Premium
  if (subscription.tier === "premium") {
    return (
      <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  👑 MiArmario Premium
                  <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    ACTIVO
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground">¡Disfruta de todas las funciones premium!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-xs text-muted-foreground">ilimitado</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
