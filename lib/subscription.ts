import { supabase } from "./supabase"

export type SubscriptionTier = "early_access" | "free" | "premium"

export type UserSubscription = {
  id: string
  user_id: string
  tier: SubscriptionTier
  created_at: string
  early_access_expires_at: string | null
  daily_looks_used: number
  last_reset_date: string
  total_looks_generated: number
  total_recreations: number
  is_grandfathered: boolean
}

export const SUBSCRIPTION_LIMITS = {
  early_access: {
    daily_looks: -1, // Ilimitado
    max_clothes: -1, // Ilimitado
    trending_access: true,
    ai_stylist: true,
    analytics: true,
    recreations: -1, // Ilimitado
  },
  free: {
    daily_looks: 3,
    max_clothes: 50,
    trending_access: true,
    ai_stylist: false,
    analytics: false,
    recreations: 1,
  },
  premium: {
    daily_looks: -1, // Ilimitado
    max_clothes: -1, // Ilimitado
    trending_access: true,
    ai_stylist: true,
    analytics: true,
    recreations: -1, // Ilimitado
  },
}

export class SubscriptionManager {
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase.from("user_subscriptions").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (!data) {
        // Crear suscripción inicial para nuevo usuario
        return await this.createInitialSubscription(userId)
      }

      return data
    } catch (error) {
      console.error("Error al obtener suscripción:", error)
      return null
    }
  }

  static async createInitialSubscription(userId: string): Promise<UserSubscription> {
    const now = new Date()
    const earlyAccessExpiry = new Date()
    earlyAccessExpiry.setMonth(earlyAccessExpiry.getMonth() + 2) // 2 meses de early access

    const subscription: Partial<UserSubscription> = {
      user_id: userId,
      tier: "early_access",
      early_access_expires_at: earlyAccessExpiry.toISOString(),
      daily_looks_used: 0,
      last_reset_date: now.toISOString().split("T")[0],
      total_looks_generated: 0,
      total_recreations: 0,
      is_grandfathered: false,
    }

    const { data, error } = await supabase.from("user_subscriptions").insert(subscription).select().single()

    if (error) {
      throw error
    }

    return data
  }

  static async checkAndUpdateTier(subscription: UserSubscription): Promise<UserSubscription> {
    const now = new Date()
    const earlyAccessExpiry = subscription.early_access_expires_at
      ? new Date(subscription.early_access_expires_at)
      : null

    // Si el early access ha expirado, cambiar a free
    if (
      subscription.tier === "early_access" &&
      earlyAccessExpiry &&
      now > earlyAccessExpiry &&
      !subscription.is_grandfathered
    ) {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({ tier: "free" })
        .eq("id", subscription.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    }

    return subscription
  }

  static async canGenerateOutfit(subscription: UserSubscription): Promise<{
    canGenerate: boolean
    reason?: string
    upgradeMessage?: string
  }> {
    const updatedSubscription = await this.checkAndUpdateTier(subscription)
    const limits = SUBSCRIPTION_LIMITS[updatedSubscription.tier]

    // Resetear contador diario si es necesario
    const today = new Date().toISOString().split("T")[0]
    if (updatedSubscription.last_reset_date !== today) {
      await supabase
        .from("user_subscriptions")
        .update({
          daily_looks_used: 0,
          last_reset_date: today,
        })
        .eq("id", updatedSubscription.id)

      updatedSubscription.daily_looks_used = 0
    }

    // Verificar límites
    if (limits.daily_looks !== -1 && updatedSubscription.daily_looks_used >= limits.daily_looks) {
      const remainingHours = 24 - new Date().getHours()
      return {
        canGenerate: false,
        reason: "daily_limit",
        upgradeMessage: `Has alcanzado tu límite de ${limits.daily_looks} looks diarios. Renueva en ${remainingHours}h o hazte Premium para looks ilimitados.`,
      }
    }

    return { canGenerate: true }
  }

  static async incrementLookUsage(subscription: UserSubscription): Promise<void> {
    await supabase
      .from("user_subscriptions")
      .update({
        daily_looks_used: subscription.daily_looks_used + 1,
        total_looks_generated: subscription.total_looks_generated + 1,
      })
      .eq("id", subscription.id)
  }

  static async incrementRecreationUsage(subscription: UserSubscription): Promise<void> {
    await supabase
      .from("user_subscriptions")
      .update({
        total_recreations: subscription.total_recreations + 1,
      })
      .eq("id", subscription.id)
  }

  static getTimeUntilEarlyAccessExpires(subscription: UserSubscription): {
    days: number
    hours: number
    expired: boolean
  } {
    if (!subscription.early_access_expires_at) {
      return { days: 0, hours: 0, expired: true }
    }

    const now = new Date()
    const expiry = new Date(subscription.early_access_expires_at)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, expired: true }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return { days, hours, expired: false }
  }
}
