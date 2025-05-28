"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, ArrowLeft, Sun, Briefcase, Coffee, Music, Heart, Loader2, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { ModeToggle } from "@/components/mode-toggle"

// Tipos para las prendas y outfits
type Clothing = {
  id: string
  name: string
  category: string
  type: string
  style: string
  color: string
  seasons: string[]
  image_url: string
}

type OutfitPreferences = {
  temperature: number
  weatherCondition: string
  occasion: string
  occasionSubtype: string
  style: string
}

export default function CreateOutfitPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Estado para las preferencias del outfit
  const [preferences, setPreferences] = useState<OutfitPreferences>({
    temperature: 20,
    weatherCondition: "sunny",
    occasion: "casual",
    occasionSubtype: "",
    style: "urban",
  })

  // Estado para las prendas del usuario
  const [clothes, setClothes] = useState<Clothing[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Cargar las prendas del usuario
  useEffect(() => {
    if (user) {
      fetchClothes()
    }
  }, [user])

  const fetchClothes = async () => {
    try {
      setLoading(true)
      setError("")

      console.log("Cargando prendas para usuario:", user?.id)

      const { data, error } = await supabase.from("clothes").select("*").eq("user_id", user?.id)

      if (error) {
        console.error("Error de Supabase:", error)
        throw error
      }

      console.log("Prendas cargadas:", data)
      setClothes(data || [])

      if (!data || data.length === 0) {
        setError("No tienes prendas en tu armario. Añade algunas prendas primero.")
      }
    } catch (error) {
      console.error("Error al cargar las prendas:", error)
      setError("Error al cargar las prendas. Verifica tu conexión.")
      toast({
        title: "Error",
        description: "No se pudieron cargar tus prendas. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para generar un outfit basado en las preferencias
  const generateOutfit = async () => {
    console.log("=== INICIANDO GENERACIÓN DE OUTFIT ===")
    console.log("Prendas disponibles:", clothes.length)
    console.log("Preferencias actuales:", preferences)

    if (clothes.length === 0) {
      toast({
        title: "No hay prendas suficientes",
        description: "Necesitas añadir prendas a tu armario para generar un outfit.",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    setError("")

    try {
      // 1. Filtrar prendas según las preferencias de manera inteligente
      const filteredClothes = smartFilterClothes(clothes, preferences)
      console.log("Prendas después del filtro inteligente:", filteredClothes.length)

      // 2. Verificar si hay suficientes prendas para crear un outfit
      const hasTops = filteredClothes.some((item) => item.category === "top")
      const hasBottoms = filteredClothes.some((item) => item.category === "bottom")

      console.log("Análisis de prendas filtradas:")
      console.log("- Tiene tops:", hasTops)
      console.log("- Tiene bottoms:", hasBottoms)

      if (!hasTops || !hasBottoms) {
        toast({
          title: "No hay prendas suficientes",
          description: `No tienes suficientes prendas ${preferences.style} para crear este tipo de outfit. Intenta con otro estilo.`,
          variant: "destructive",
        })
        setGenerating(false)
        return
      }

      // 3. Seleccionar prendas para el outfit
      const outfit = createOutfitCombination(filteredClothes, preferences)
      console.log("Outfit generado:", outfit)

      if (!outfit.top || !outfit.bottom) {
        throw new Error("No se pudo generar un outfit válido")
      }

      // 4. Guardar el outfit generado en la sesión
      const outfitData = {
        outfit,
        preferences,
        timestamp: new Date().toISOString(),
      }

      console.log("Guardando outfit en sessionStorage:", outfitData)
      sessionStorage.setItem("generatedOutfit", JSON.stringify(outfitData))

      // 5. Mostrar información del outfit generado
      toast({
        title: "¡Outfit generado!",
        description: `Look ${preferences.style} para ${preferences.occasion} creado exitosamente.`,
      })

      // 6. Redirigir a la página de resultados
      console.log("Redirigiendo a /outfit-result")
      router.push("/outfit-result")
    } catch (error) {
      console.error("Error al generar outfit:", error)
      setError("Error al generar el outfit. Inténtalo de nuevo.")
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el outfit. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  // Función para filtrar prendas de manera inteligente
  const smartFilterClothes = (clothes: Clothing[], prefs: OutfitPreferences) => {
    console.log("=== FILTRADO INTELIGENTE DE PRENDAS ===")
    console.log("Estilo solicitado:", prefs.style)
    console.log("Ocasión solicitada:", prefs.occasion)

    // Determinar temporada según temperatura
    let season = ""
    if (prefs.temperature < 10) season = "winter"
    else if (prefs.temperature < 18) season = "autumn"
    else if (prefs.temperature < 25) season = "spring"
    else season = "summer"

    console.log("Temporada calculada:", season)

    // Filtrado específico por estilo solicitado
    let filtered: Clothing[] = []

    if (prefs.style === "sport" || prefs.occasion === "sport") {
      console.log("🏃 Filtrando para estilo DEPORTIVO")
      // Para deportivo: buscar prendas que contengan palabras clave deportivas
      filtered = clothes.filter((item) => {
        const name = item.name.toLowerCase()
        const style = item.style?.toLowerCase() || ""
        const type = item.type?.toLowerCase() || ""

        const isDeportivo =
          style.includes("sport") ||
          style.includes("deportivo") ||
          name.includes("racing") ||
          name.includes("futbol") ||
          name.includes("deporte") ||
          name.includes("training") ||
          name.includes("gym") ||
          type.includes("sport") ||
          type.includes("deportivo")

        if (isDeportivo) {
          console.log(`✅ DEPORTIVO: ${item.name} (${item.style})`)
        }
        return isDeportivo
      })
    } else if (prefs.style === "formal" || prefs.occasion === "formal") {
      console.log("👔 Filtrando para estilo FORMAL")
      // Para formal: buscar prendas elegantes
      filtered = clothes.filter((item) => {
        const name = item.name.toLowerCase()
        const style = item.style?.toLowerCase() || ""
        const type = item.type?.toLowerCase() || ""

        const isFormal =
          style.includes("formal") ||
          style.includes("elegante") ||
          style.includes("classic") ||
          style.includes("clásico") ||
          name.includes("camisa") ||
          name.includes("traje") ||
          name.includes("blazer") ||
          type.includes("formal")

        if (isFormal) {
          console.log(`✅ FORMAL: ${item.name} (${item.style})`)
        }
        return isFormal
      })
    } else {
      console.log("👕 Filtrando para estilo CASUAL/URBANO")
      // Para casual/urbano: buscar prendas casuales (excluyendo las muy deportivas o formales)
      filtered = clothes.filter((item) => {
        const name = item.name.toLowerCase()
        const style = item.style?.toLowerCase() || ""

        // Excluir prendas muy deportivas
        const isVeryDeportivo = name.includes("racing") || name.includes("futbol") || style.includes("sport")

        // Excluir prendas muy formales
        const isVeryFormal = name.includes("traje") || name.includes("blazer")

        const isCasual = !isVeryDeportivo && !isVeryFormal

        if (isCasual) {
          console.log(`✅ CASUAL: ${item.name} (${item.style})`)
        }
        return isCasual
      })
    }

    console.log(`Prendas filtradas por estilo: ${filtered.length}`)

    // Si no hay suficientes prendas del estilo solicitado, usar todas
    if (filtered.length < 2) {
      console.log("⚠️ No hay suficientes prendas del estilo solicitado, usando todas")
      filtered = clothes
    }

    // Filtrar por temporada si es necesario
    if (prefs.temperature < 5 || prefs.temperature > 35) {
      filtered = filtered.filter((item) => {
        if (item.seasons && item.seasons.length > 0) {
          return item.seasons.includes(season)
        }
        return true
      })
    }

    console.log(`Prendas finales después de todos los filtros: ${filtered.length}`)
    return filtered
  }

  // Función para crear una combinación de outfit
  const createOutfitCombination = (availableClothes: Clothing[], prefs: OutfitPreferences) => {
    console.log("=== CREANDO COMBINACIÓN DE OUTFIT ===")
    console.log("Prendas disponibles:", availableClothes.length)

    // Separar prendas por categoría
    const tops = availableClothes.filter((item) => item.category === "top")
    const bottoms = availableClothes.filter((item) => item.category === "bottom")
    const shoes = availableClothes.filter((item) => item.category === "shoes")
    const outerwear = availableClothes.filter((item) => item.category === "outerwear")
    const accessories = availableClothes.filter((item) => item.category === "accessory")

    console.log("Prendas por categoría:")
    console.log(
      "- Tops:",
      tops.map((t) => `${t.name} (${t.style})`),
    )
    console.log(
      "- Bottoms:",
      bottoms.map((b) => `${b.name} (${b.style})`),
    )
    console.log(
      "- Shoes:",
      shoes.map((s) => `${s.name} (${s.style})`),
    )

    // Selección inteligente basada en el estilo
    let selectedTop: Clothing | null = null
    let selectedBottom: Clothing | null = null

    if (prefs.style === "sport" || prefs.occasion === "sport") {
      // Para deportivo: priorizar prendas deportivas
      selectedTop = tops.find((t) => t.name.toLowerCase().includes("racing")) || tops[0] || null
      selectedBottom = bottoms.find((b) => b.name.toLowerCase().includes("racing")) || bottoms[0] || null
    } else {
      // Para otros estilos: selección aleatoria
      selectedTop = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null
      selectedBottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null
    }

    // Seleccionar zapatos si hay disponibles
    const selectedShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null

    // Seleccionar abrigo si la temperatura es baja y hay disponibles
    const selectedOuterwear =
      prefs.temperature < 20 && outerwear.length > 0 ? outerwear[Math.floor(Math.random() * outerwear.length)] : null

    // Seleccionar un accesorio aleatorio si hay disponibles
    const selectedAccessory =
      accessories.length > 0 ? accessories[Math.floor(Math.random() * accessories.length)] : null

    const outfit = {
      top: selectedTop,
      bottom: selectedBottom,
      shoes: selectedShoes,
      outerwear: selectedOuterwear,
      accessory: selectedAccessory,
    }

    console.log("=== OUTFIT FINAL ===")
    console.log("Top:", selectedTop?.name, `(${selectedTop?.style})`)
    console.log("Bottom:", selectedBottom?.name, `(${selectedBottom?.style})`)
    console.log("Shoes:", selectedShoes?.name || "No disponible")

    return outfit
  }

  // Función para manejar cambio de ocasión
  const handleOccasionChange = (value: string) => {
    console.log("Cambiando ocasión a:", value)
    setPreferences({ ...preferences, occasion: value, occasionSubtype: "" })
  }

  // Función para manejar cambio de sub-ocasión
  const handleOccasionSubtypeChange = (subtype: string) => {
    console.log("Cambiando sub-ocasión a:", subtype)
    setPreferences({ ...preferences, occasionSubtype: subtype })
  }

  // Función para manejar cambio de estilo
  const handleStyleChange = (style: string) => {
    console.log("Cambiando estilo a:", style)
    setPreferences({ ...preferences, style })
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

  // Si no hay usuario y no está cargando, no renderizar nada (se redirigirá)
  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center py-4">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver</span>
          </Link>
          <div className="mx-auto flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span>MiArmario</span>
          </div>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Crea tu look perfecto</h1>
            <p className="text-gray-500">Selecciona tus preferencias para generar un look personalizado</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-600 text-sm font-medium">{error}</p>
                <Link href="/upload-item" className="text-red-600 underline text-sm mt-1 inline-block">
                  Añadir prendas al armario
                </Link>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-500" />
              <p>Cargando tu armario...</p>
            </div>
          ) : clothes.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-4">Aún no tienes prendas en tu armario</p>
              <Link href="/upload-item">
                <Button>Añadir tu primera prenda</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8">
              {/* Información del armario */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Tu armario</h3>
                <p className="text-sm text-gray-600">
                  Tienes {clothes.length} prendas disponibles: {clothes.filter((c) => c.category === "top").length}{" "}
                  superiores, {clothes.filter((c) => c.category === "bottom").length} inferiores,{" "}
                  {clothes.filter((c) => c.category === "shoes").length} zapatos
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <strong>Deportivas:</strong>{" "}
                  {
                    clothes.filter(
                      (c) =>
                        c.name.toLowerCase().includes("racing") ||
                        c.style?.toLowerCase().includes("sport") ||
                        c.style?.toLowerCase().includes("deportivo"),
                    ).length
                  }{" "}
                  prendas
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Clima</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-amber-500" />
                        <span>Temperatura: {preferences.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={preferences.weatherCondition}
                          onValueChange={(value) => setPreferences({ ...preferences, weatherCondition: value })}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Condición" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunny">Soleado</SelectItem>
                            <SelectItem value="cloudy">Nublado</SelectItem>
                            <SelectItem value="rainy">Lluvioso</SelectItem>
                            <SelectItem value="snowy">Nevado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Slider
                      value={[preferences.temperature]}
                      max={40}
                      min={0}
                      step={1}
                      onValueChange={(value) => setPreferences({ ...preferences, temperature: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Frío</span>
                      <span>Templado</span>
                      <span>Caluroso</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Ocasión</h2>
                  <Tabs value={preferences.occasion} className="w-full" onValueChange={handleOccasionChange}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="casual">Casual</TabsTrigger>
                      <TabsTrigger value="formal">Formal</TabsTrigger>
                      <TabsTrigger value="sport">Deportivo</TabsTrigger>
                      <TabsTrigger value="party">Fiesta</TabsTrigger>
                    </TabsList>
                    <TabsContent value="casual" className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={preferences.occasionSubtype === "coffee" ? "default" : "outline"}
                          className="flex flex-col h-auto py-3 px-2 gap-2"
                          onClick={() => handleOccasionSubtypeChange("coffee")}
                        >
                          <Coffee className="h-5 w-5" />
                          <span className="text-xs">Café</span>
                        </Button>
                        <Button
                          variant={preferences.occasionSubtype === "concert" ? "default" : "outline"}
                          className="flex flex-col h-auto py-3 px-2 gap-2"
                          onClick={() => handleOccasionSubtypeChange("concert")}
                        >
                          <Music className="h-5 w-5" />
                          <span className="text-xs">Concierto</span>
                        </Button>
                        <Button
                          variant={preferences.occasionSubtype === "date" ? "default" : "outline"}
                          className="flex flex-col h-auto py-3 px-2 gap-2"
                          onClick={() => handleOccasionSubtypeChange("date")}
                        >
                          <Heart className="h-5 w-5" />
                          <span className="text-xs">Cita</span>
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="formal">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={preferences.occasionSubtype === "work" ? "default" : "outline"}
                          className="flex flex-col h-auto py-3 px-2 gap-2"
                          onClick={() => handleOccasionSubtypeChange("work")}
                        >
                          <Briefcase className="h-5 w-5" />
                          <span className="text-xs">Trabajo</span>
                        </Button>
                        <Button
                          variant={preferences.occasionSubtype === "event" ? "default" : "outline"}
                          className="flex flex-col h-auto py-3 px-2 gap-2"
                          onClick={() => handleOccasionSubtypeChange("event")}
                        >
                          <Sparkles className="h-5 w-5" />
                          <span className="text-xs">Evento</span>
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="sport">
                      <p className="text-sm text-gray-500">
                        Perfecto para actividades deportivas y ejercicio. Se priorizarán prendas deportivas como las de
                        Racing.
                      </p>
                    </TabsContent>
                    <TabsContent value="party">
                      <p className="text-sm text-gray-500">Ideal para fiestas y celebraciones</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Estilo</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div
                        className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                          preferences.style === "urban"
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-950 shadow-lg"
                            : "border-border hover:border-muted-foreground hover:shadow-md"
                        }`}
                        onClick={() => handleStyleChange("urban")}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                          <span className="text-2xl">🏙️</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-center text-foreground">Urbano</p>
                    </div>
                    <div className="space-y-2">
                      <div
                        className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                          preferences.style === "casual"
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-950 shadow-lg"
                            : "border-border hover:border-muted-foreground hover:shadow-md"
                        }`}
                        onClick={() => handleStyleChange("casual")}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                          <span className="text-2xl">👕</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-center text-foreground">Casual</p>
                    </div>
                    <div className="space-y-2">
                      <div
                        className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                          preferences.style === "formal"
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-950 shadow-lg"
                            : "border-border hover:border-muted-foreground hover:shadow-md"
                        }`}
                        onClick={() => handleStyleChange("formal")}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                          <span className="text-2xl">👔</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-center text-foreground">Formal</p>
                    </div>
                    <div className="space-y-2">
                      <div
                        className={`aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                          preferences.style === "sport"
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-950 shadow-lg"
                            : "border-border hover:border-muted-foreground hover:shadow-md"
                        }`}
                        onClick={() => handleStyleChange("sport")}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                          <span className="text-2xl">⚽</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-center text-foreground">Deportivo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={generateOutfit}
                  disabled={generating || clothes.length === 0}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar look
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
