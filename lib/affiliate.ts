export type AffiliateStore = {
  id: string
  name: string
  logo: string
  commission_rate: number
  api_available: boolean
  base_url: string
  affiliate_id: string
  categories: string[]
  shipping_info: string
  return_policy: string
}

export type ProductMatch = {
  id: string
  store_id: string
  name: string
  price: number
  original_price?: number
  image_url: string
  product_url: string
  affiliate_url: string
  similarity_score: number
  available_sizes: string[]
  colors: string[]
  rating: number
  reviews_count: number
}

export type ShoppingSession = {
  id: string
  user_id: string
  look_id?: string
  trending_look_id?: string
  products_clicked: string[]
  products_purchased: string[]
  total_commission: number
  created_at: string
}

export const AFFILIATE_STORES: AffiliateStore[] = [
  {
    id: "zara",
    name: "Zara",
    logo: "/stores/zara-logo.png",
    commission_rate: 8,
    api_available: true,
    base_url: "https://www.zara.com",
    affiliate_id: "miarmario_zara",
    categories: ["casual", "formal", "urban", "minimalist"],
    shipping_info: "Envío gratis desde €30",
    return_policy: "30 días para devoluciones",
  },
  {
    id: "hm",
    name: "H&M",
    logo: "/stores/hm-logo.png",
    commission_rate: 6,
    api_available: true,
    base_url: "https://www2.hm.com",
    affiliate_id: "miarmario_hm",
    categories: ["casual", "sport", "urban", "bohemian"],
    shipping_info: "Envío gratis desde €20",
    return_policy: "60 días para devoluciones",
  },
  {
    id: "shein",
    name: "SHEIN",
    logo: "/stores/shein-logo.png",
    commission_rate: 12,
    api_available: true,
    base_url: "https://es.shein.com",
    affiliate_id: "miarmario_shein",
    categories: ["casual", "party", "bohemian", "vintage"],
    shipping_info: "Envío gratis desde €15",
    return_policy: "45 días para devoluciones",
  },
  {
    id: "amazon",
    name: "Amazon Fashion",
    logo: "/stores/amazon-logo.png",
    commission_rate: 5,
    api_available: true,
    base_url: "https://www.amazon.es",
    affiliate_id: "miarmario-21",
    categories: ["casual", "sport", "formal", "accessories"],
    shipping_info: "Envío gratis con Prime",
    return_policy: "30 días para devoluciones",
  },
  {
    id: "asos",
    name: "ASOS",
    logo: "/stores/asos-logo.png",
    commission_rate: 8,
    api_available: true,
    base_url: "https://www.asos.com",
    affiliate_id: "miarmario_asos",
    categories: ["urban", "party", "vintage", "minimalist"],
    shipping_info: "Envío gratis desde €25",
    return_policy: "28 días para devoluciones",
  },
]

export class AffiliateManager {
  static async searchProducts(query: string, category: string, style: string): Promise<ProductMatch[]> {
    try {
      // Simular búsqueda de productos (en producción usarías APIs reales)
      const mockProducts: ProductMatch[] = [
        {
          id: "zara_001",
          store_id: "zara",
          name: "Blazer Estructurado Beige",
          price: 49.95,
          original_price: 69.95,
          image_url: "/placeholder.svg?height=300&width=200&text=Blazer+Beige",
          product_url: "https://www.zara.com/es/blazer-estructurado-p12345.html",
          affiliate_url: "https://www.zara.com/es/blazer-estructurado-p12345.html?ref=miarmario_zara",
          similarity_score: 95,
          available_sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["beige", "black", "navy"],
          rating: 4.5,
          reviews_count: 234,
        },
        {
          id: "hm_002",
          store_id: "hm",
          name: "Jeans Mom Fit Blancos",
          price: 29.99,
          image_url: "/placeholder.svg?height=300&width=200&text=Jeans+Blancos",
          product_url: "https://www2.hm.com/es_es/productpage.0123456789.html",
          affiliate_url: "https://www2.hm.com/es_es/productpage.0123456789.html?ref=miarmario_hm",
          similarity_score: 88,
          available_sizes: ["34", "36", "38", "40", "42"],
          colors: ["white", "light-blue", "black"],
          rating: 4.2,
          reviews_count: 156,
        },
        {
          id: "shein_003",
          store_id: "shein",
          name: "Sneakers Minimalistas Blancas",
          price: 24.99,
          original_price: 39.99,
          image_url: "/placeholder.svg?height=300&width=200&text=Sneakers+Blancas",
          product_url: "https://es.shein.com/sneakers-minimalistas-p-123456.html",
          affiliate_url: "https://es.shein.com/sneakers-minimalistas-p-123456.html?ref=miarmario_shein",
          similarity_score: 92,
          available_sizes: ["36", "37", "38", "39", "40", "41"],
          colors: ["white", "black", "gray"],
          rating: 4.0,
          reviews_count: 89,
        },
        {
          id: "amazon_004",
          store_id: "amazon",
          name: "Bolso Crossbody Marrón",
          price: 35.99,
          image_url: "/placeholder.svg?height=300&width=200&text=Bolso+Marrón",
          product_url: "https://www.amazon.es/dp/B08EXAMPLE",
          affiliate_url: "https://www.amazon.es/dp/B08EXAMPLE?tag=miarmario-21",
          similarity_score: 85,
          available_sizes: ["Único"],
          colors: ["brown", "black", "tan"],
          rating: 4.3,
          reviews_count: 312,
        },
      ]

      // Filtrar por estilo y categoría
      return mockProducts.filter((product) => {
        const store = AFFILIATE_STORES.find((s) => s.id === product.store_id)
        return store?.categories.includes(style) || store?.categories.includes(category)
      })
    } catch (error) {
      console.error("Error al buscar productos:", error)
      return []
    }
  }

  static async trackClick(productId: string, userId: string, sessionId: string): Promise<void> {
    try {
      // Trackear click para analytics y comisiones
      console.log(`Tracking click: ${productId} by user ${userId}`)

      // En producción, guardarías esto en Supabase
      const clickData = {
        user_id: userId,
        product_id: productId,
        session_id: sessionId,
        clicked_at: new Date().toISOString(),
        event_type: "product_click",
      }

      // await supabase.from('affiliate_events').insert(clickData)
    } catch (error) {
      console.error("Error al trackear click:", error)
    }
  }

  static async trackPurchase(productId: string, userId: string, amount: number): Promise<void> {
    try {
      const product = await this.getProductById(productId)
      if (!product) return

      const store = AFFILIATE_STORES.find((s) => s.id === product.store_id)
      if (!store) return

      const commission = (amount * store.commission_rate) / 100

      console.log(`Purchase tracked: ${productId}, Commission: €${commission.toFixed(2)}`)

      // En producción, guardarías esto en Supabase
      const purchaseData = {
        user_id: userId,
        product_id: productId,
        store_id: store.id,
        amount: amount,
        commission: commission,
        purchased_at: new Date().toISOString(),
        event_type: "purchase",
      }

      // await supabase.from('affiliate_events').insert(purchaseData)
    } catch (error) {
      console.error("Error al trackear compra:", error)
    }
  }

  static async getProductById(productId: string): Promise<ProductMatch | null> {
    // Simular obtener producto por ID
    const allProducts = await this.searchProducts("", "", "")
    return allProducts.find((p) => p.id === productId) || null
  }

  static generateAffiliateUrl(baseUrl: string, storeId: string): string {
    const store = AFFILIATE_STORES.find((s) => s.id === storeId)
    if (!store) return baseUrl

    // Generar URL de afiliado según la tienda
    switch (storeId) {
      case "amazon":
        return `${baseUrl}?tag=${store.affiliate_id}`
      case "zara":
      case "hm":
      case "shein":
      case "asos":
        return `${baseUrl}?ref=${store.affiliate_id}`
      default:
        return baseUrl
    }
  }

  static calculateCommission(price: number, storeId: string): number {
    const store = AFFILIATE_STORES.find((s) => s.id === storeId)
    if (!store) return 0
    return (price * store.commission_rate) / 100
  }
}
