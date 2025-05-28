// Configuración para distribución en tiendas
export const APP_CONFIG = {
  // Información básica
  name: "StyleMate - Tu Asistente de Moda Personal",
  shortName: "StyleMate",
  version: "1.0.0",
  buildNumber: "1",

  // Descripción para tiendas
  description: {
    short: "Tu stylist personal con IA. Organiza tu armario y crea outfits perfectos.",
    long: `StyleMate es tu asistente personal de moda con inteligencia artificial. 

🎯 CARACTERÍSTICAS PRINCIPALES:
• Organiza tu armario digital con fotos
• Crea outfits perfectos con IA
• Descubre looks trending de moda
• Outfits personalizados según el clima
• Análisis de tu estilo personal
• Compra piezas similares de tus looks favoritos
• Funciona offline

👗 PERFECTO PARA:
• Personas que aman la moda
• Quienes quieren optimizar su armario
• Buscan inspiración diaria para vestirse
• Quieren ahorrar tiempo eligiendo outfits
• Desean descubrir su estilo personal

🚀 TECNOLOGÍA IA:
• Reconocimiento inteligente de prendas
• Combinaciones automáticas por estilo
• Recomendaciones personalizadas
• Análisis de tendencias

¡Descarga StyleMate y transforma tu forma de vestir!`,

    keywords: [
      "moda",
      "ropa",
      "outfit",
      "armario",
      "estilo",
      "fashion",
      "stylist",
      "inteligencia artificial",
      "IA",
      "tendencias",
      "looks",
      "combinaciones",
      "vestir",
      "personal",
      "digital",
    ],
  },

  // Información del desarrollador
  developer: {
    name: "Tu Nombre", // ← CAMBIAR POR TU NOMBRE
    email: "tu-email@gmail.com", // ← CAMBIAR POR TU EMAIL
    website: "https://stylemate.app", // ← TU DOMINIO
    privacyPolicy: "https://stylemate.app/privacy",
    termsOfService: "https://stylemate.app/terms",
  },

  // Configuración para Google Play
  googlePlay: {
    packageName: "com.stylemate.app", // ← CAMBIAR POR TU DOMINIO
    category: "LIFESTYLE",
    contentRating: "Everyone",
    targetSdk: 34,
    minSdk: 24,
  },

  // Configuración para App Store
  appStore: {
    bundleId: "com.stylemate.app", // ← MISMO QUE GOOGLE PLAY
    category: "Lifestyle",
    subcategory: "Fashion",
    contentRating: "4+",
    targetOS: "15.0",
  },

  // URLs importantes
  urls: {
    production: "https://stylemate.app", // ← TU DOMINIO FINAL
    staging: "https://stylemate-staging.vercel.app",
    support: "https://stylemate.app/support",
    feedback: "mailto:feedback@stylemate.app",
  },
}

// Función para generar metadata dinámica
export function generateStoreMetadata(platform: "googleplay" | "appstore") {
  const base = {
    name: APP_CONFIG.name,
    description: APP_CONFIG.description.long,
    version: APP_CONFIG.version,
    developer: APP_CONFIG.developer.name,
  }

  if (platform === "googleplay") {
    return {
      ...base,
      packageName: APP_CONFIG.googlePlay.packageName,
      category: APP_CONFIG.googlePlay.category,
      contentRating: APP_CONFIG.googlePlay.contentRating,
    }
  }

  return {
    ...base,
    bundleId: APP_CONFIG.appStore.bundleId,
    category: APP_CONFIG.appStore.category,
    contentRating: APP_CONFIG.appStore.contentRating,
  }
}
