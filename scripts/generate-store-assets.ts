// Script para generar assets para las tiendas
export const STORE_ASSETS = {
  // Iconos requeridos para Google Play
  googlePlayIcons: [
    { size: 48, name: "ic_launcher_48.png" },
    { size: 72, name: "ic_launcher_72.png" },
    { size: 96, name: "ic_launcher_96.png" },
    { size: 144, name: "ic_launcher_144.png" },
    { size: 192, name: "ic_launcher_192.png" },
    { size: 512, name: "ic_launcher_512.png" },
  ],

  // Screenshots para Google Play (requeridos)
  googlePlayScreenshots: [
    {
      name: "screenshot_1_dashboard.png",
      size: "1080x1920",
      description: "Dashboard principal - Tu armario digital organizado",
    },
    {
      name: "screenshot_2_create.png",
      size: "1080x1920",
      description: "Crear outfits - IA que combina tu ropa perfectamente",
    },
    {
      name: "screenshot_3_trending.png",
      size: "1080x1920",
      description: "Looks trending - Descubre las últimas tendencias",
    },
    {
      name: "screenshot_4_weather.png",
      size: "1080x1920",
      description: "Outfits por clima - Vístete perfecto según el tiempo",
    },
    {
      name: "screenshot_5_shopping.png",
      size: "1080x1920",
      description: "Shop the Look - Compra piezas de tus looks favoritos",
    },
  ],

  // Feature graphic para Google Play
  featureGraphic: {
    name: "feature_graphic.png",
    size: "1024x500",
    description: "Gráfico principal para la tienda",
  },

  // Iconos para App Store
  appStoreIcons: [
    { size: 20, name: "icon_20.png", scale: [1, 2, 3] },
    { size: 29, name: "icon_29.png", scale: [1, 2, 3] },
    { size: 40, name: "icon_40.png", scale: [1, 2, 3] },
    { size: 60, name: "icon_60.png", scale: [2, 3] },
    { size: 76, name: "icon_76.png", scale: [1, 2] },
    { size: 83.5, name: "icon_83.5.png", scale: [2] },
    { size: 1024, name: "icon_1024.png", scale: [1] },
  ],

  // Screenshots para App Store
  appStoreScreenshots: [
    {
      device: "iPhone 6.7",
      size: "1290x2796",
      count: 3,
    },
    {
      device: "iPhone 6.5",
      size: "1242x2688",
      count: 3,
    },
    {
      device: "iPad Pro 12.9",
      size: "2048x2732",
      count: 2,
    },
  ],
}

// Definición de la interfaz para la configuración de la aplicación
interface AppConfig {
  name: string
  description: {
    short: string
    long: string
  }
}

// Declaración de la variable APP_CONFIG
const APP_CONFIG: AppConfig = {
  name: "Mi App", // Reemplaza con el nombre real de tu app
  description: {
    short: "Una breve descripción de la app.", // Reemplaza con la descripción corta real
    long: "Una descripción más detallada de la app y sus características.", // Reemplaza con la descripción larga real
  },
}

// Función para validar assets
export function validateStoreAssets() {
  const errors: string[] = []

  // Validar manifest
  if (!APP_CONFIG.name || APP_CONFIG.name.length > 50) {
    errors.push("Nombre de app debe tener menos de 50 caracteres")
  }

  if (!APP_CONFIG.description.short || APP_CONFIG.description.short.length > 80) {
    errors.push("Descripción corta debe tener menos de 80 caracteres")
  }

  if (!APP_CONFIG.description.long || APP_CONFIG.description.long.length > 4000) {
    errors.push("Descripción larga debe tener menos de 4000 caracteres")
  }

  return errors
}
