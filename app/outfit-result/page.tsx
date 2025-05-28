"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Sun, ShoppingBag, Share2, Heart, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  image_url: string
}

type Outfit = {
  top: Clothing | null
  bottom: Clothing | null
  shoes: Clothing | null
  outerwear: Clothing | null
  accessory: Clothing | null
}

type OutfitPreferences = {
  temperature: number
  weatherCondition: string
  occasion: string
  occasionSubtype: string
  style: string
}

type GeneratedOutfit = {
  outfit: Outfit
  preferences: OutfitPreferences
  timestamp: string
}

export default function OutfitResultPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [generatedOutfit, setGeneratedOutfit] = useState<GeneratedOutfit | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Cargar el outfit generado desde sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOutfit = sessionStorage.getItem("generatedOutfit")
      if (storedOutfit) {
        try {
          const parsedOutfit = JSON.parse(storedOutfit) as GeneratedOutfit
          console.log("Outfit cargado desde sessionStorage:", parsedOutfit)
          setGeneratedOutfit(parsedOutfit)
        } catch (error) {
          console.error("Error al parsear el outfit guardado:", error)
          toast({
            title: "Error",
            description: "No se pudo cargar el outfit generado.",
            variant: "destructive",
          })
          router.push("/create-outfit")
        }
      } else {
        // Si no hay outfit guardado, redirigir a la página de creación
        console.log("No hay outfit en sessionStorage, redirigiendo...")
        router.push("/create-outfit")
      }
      setLoading(false)
    }
  }, [router, toast])

  // Función para determinar el estilo real del outfit basado en las prendas
  const determineActualStyle = (outfit: Outfit): string => {
    const items = [outfit.top, outfit.bottom, outfit.shoes, outfit.outerwear, outfit.accessory].filter(
      (item) => item !== null,
    ) as Clothing[]

    console.log(
      "Determinando estilo real del outfit:",
      items.map((item) => `${item.name} (${item.style})`),
    )

    // Contar estilos
    const styleCount: { [key: string]: number } = {}
    items.forEach((item) => {
      if (item.style) {
        const style = item.style.toLowerCase()
        styleCount[style] = (styleCount[style] || 0) + 1
      }
    })

    console.log("Conteo de estilos:", styleCount)

    // Determinar estilo predominante
    let predominantStyle = "casual" // default
    let maxCount = 0

    for (const [style, count] of Object.entries(styleCount)) {
      if (count > maxCount) {
        maxCount = count
        predominantStyle = style
      }
    }

    console.log("Estilo predominante detectado:", predominantStyle)
    return predominantStyle
  }

  // Función para guardar el outfit en la base de datos
  const saveOutfit = async () => {
    if (!generatedOutfit || !user) return

    setSaving(true)

    try {
      const actualStyle = determineActualStyle(generatedOutfit.outfit)

      // Crear un objeto con los IDs de las prendas
      const outfitData = {
        user_id: user.id,
        name: `Look ${getStyleName(actualStyle)} ${getOccasionName(generatedOutfit.preferences.occasion)}`,
        top_id: generatedOutfit.outfit.top?.id || null,
        bottom_id: generatedOutfit.outfit.bottom?.id || null,
        shoes_id: generatedOutfit.outfit.shoes?.id || null,
        outerwear_id: generatedOutfit.outfit.outerwear?.id || null,
        accessory_id: generatedOutfit.outfit.accessory?.id || null,
        occasion: generatedOutfit.preferences.occasion,
        style: actualStyle, // Usar el estilo real detectado
        temperature: generatedOutfit.preferences.temperature,
        weather_condition: generatedOutfit.preferences.weatherCondition,
        created_at: new Date().toISOString(),
      }

      // Guardar en la tabla outfits
      const { error } = await supabase.from("outfits").insert(outfitData)

      if (error) {
        throw error
      }

      toast({
        title: "Outfit guardado",
        description: "El outfit se ha guardado en tus looks favoritos.",
      })

      setSaved(true)
    } catch (error) {
      console.error("Error al guardar el outfit:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el outfit. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Función para generar otro outfit
  const generateAnotherOutfit = () => {
    console.log("Navegando a crear otro outfit...")
    router.push("/create-outfit")
  }

  // Función para volver al dashboard
  const goBackToDashboard = () => {
    console.log("Navegando al dashboard...")
    router.push("/dashboard")
  }

  // Función para obtener el nombre de la condición climática
  const getWeatherConditionName = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "Soleado"
      case "cloudy":
        return "Nublado"
      case "rainy":
        return "Lluvioso"
      case "snowy":
        return "Nevado"
      default:
        return condition
    }
  }

  // Función para obtener el nombre del estilo
  const getStyleName = (style: string) => {
    switch (style.toLowerCase()) {
      case "urban":
      case "urbano":
        return "Urbano"
      case "casual":
        return "Casual"
      case "formal":
      case "clásico":
      case "classic":
        return "Formal"
      case "sport":
      case "deportivo":
        return "Deportivo"
      default:
        return style.charAt(0).toUpperCase() + style.slice(1)
    }
  }

  // Función para obtener el nombre de la ocasión
  const getOccasionName = (occasion: string) => {
    switch (occasion) {
      case "casual":
        return "Casual"
      case "formal":
        return "Formal"
      case "sport":
        return "Deportivo"
      case "party":
        return "Fiesta"
      default:
        return occasion
    }
  }

  // Componente para mostrar imagen de prenda con fallback
  const ClothingImage = ({ item }: { item: Clothing }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    return (
      <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
        {!imageError && item.image_url ? (
          <>
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Sparkles className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
    )
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Cargando...</span>
      </div>
    )
  }

  // Si no hay usuario o outfit generado, no renderizar nada (se redirigirá)
  if (!user || !generatedOutfit) {
    return null
  }

  // Extraer datos del outfit generado
  const { outfit, preferences } = generatedOutfit

  // Determinar el estilo real del outfit
  const actualStyle = determineActualStyle(outfit)

  // Contar prendas válidas en el outfit
  const validItems = [outfit.top, outfit.bottom, outfit.shoes, outfit.outerwear, outfit.accessory].filter(
    (item) => item !== null,
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center py-4">
          <button
            onClick={goBackToDashboard}
            className="flex items-center gap-2 hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <div className="mx-auto flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span>MiArmario</span>
          </div>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Look {getStyleName(actualStyle)} {getOccasionName(preferences.occasion)}
            </h1>
            <div className="flex gap-2">
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Sun className="h-3 w-3" /> {preferences.temperature}°C
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {getWeatherConditionName(preferences.weatherCondition)}
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {getOccasionName(preferences.occasion)}
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {getStyleName(actualStyle)}
              </span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="aspect-[3/4] relative bg-gray-50 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-4">Tu outfit generado</h3>
                    <div className="grid grid-cols-2 gap-4 max-w-xs">
                      {outfit.top && (
                        <div className="text-center">
                          <ClothingImage item={outfit.top} />
                          <p className="text-xs mt-1 font-medium">{outfit.top.name}</p>
                        </div>
                      )}
                      {outfit.bottom && (
                        <div className="text-center">
                          <ClothingImage item={outfit.bottom} />
                          <p className="text-xs mt-1 font-medium">{outfit.bottom.name}</p>
                        </div>
                      )}
                      {outfit.shoes && (
                        <div className="text-center">
                          <ClothingImage item={outfit.shoes} />
                          <p className="text-xs mt-1 font-medium">{outfit.shoes.name}</p>
                        </div>
                      )}
                      {outfit.outerwear && (
                        <div className="text-center">
                          <ClothingImage item={outfit.outerwear} />
                          <p className="text-xs mt-1 font-medium">{outfit.outerwear.name}</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">{validItems.length} prendas seleccionadas</p>
                  </div>
                </div>
              </div>
              <CardFooter className="p-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={saveOutfit} disabled={saving || saved}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : saved ? (
                    <>
                      <Heart className="mr-2 h-4 w-4 fill-pink-500 text-pink-500" />
                      Guardado
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Guardar
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Tabs defaultValue="items" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="items">Prendas</TabsTrigger>
                  <TabsTrigger value="suggestions">Sugerencias</TabsTrigger>
                </TabsList>
                <TabsContent value="items" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Parte superior */}
                    {outfit.top && (
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <ClothingImage item={outfit.top} />
                        <CardContent className="p-3">
                          <p className="text-sm font-medium text-foreground">{outfit.top.name}</p>
                          <p className="text-xs text-muted-foreground">{outfit.top.type}</p>
                          <p className="text-xs text-muted-foreground">Estilo: {outfit.top.style}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Parte inferior */}
                    {outfit.bottom && (
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <ClothingImage item={outfit.bottom} />
                        <CardContent className="p-3">
                          <p className="text-sm font-medium text-foreground">{outfit.bottom.name}</p>
                          <p className="text-xs text-muted-foreground">{outfit.bottom.type}</p>
                          <p className="text-xs text-muted-foreground">Estilo: {outfit.bottom.style}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Zapatos (si existen) */}
                    {outfit.shoes && (
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <ClothingImage item={outfit.shoes} />
                        <CardContent className="p-3">
                          <p className="text-sm font-medium text-foreground">{outfit.shoes.name}</p>
                          <p className="text-xs text-muted-foreground">{outfit.shoes.type}</p>
                          <p className="text-xs text-muted-foreground">Estilo: {outfit.shoes.style}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Abrigo (si existe) */}
                    {outfit.outerwear && (
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <ClothingImage item={outfit.outerwear} />
                        <CardContent className="p-3">
                          <p className="text-sm font-medium text-foreground">{outfit.outerwear.name}</p>
                          <p className="text-xs text-muted-foreground">{outfit.outerwear.type}</p>
                          <p className="text-xs text-muted-foreground">Estilo: {outfit.outerwear.style}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Accesorio (si existe) */}
                    {outfit.accessory && (
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <ClothingImage item={outfit.accessory} />
                        <CardContent className="p-3">
                          <p className="text-sm font-medium text-foreground">{outfit.accessory.name}</p>
                          <p className="text-xs text-muted-foreground">{outfit.accessory.type}</p>
                          <p className="text-xs text-muted-foreground">Estilo: {outfit.accessory.style}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Mensaje si faltan prendas */}
                  {!outfit.shoes && (
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <p className="text-sm text-yellow-700">
                        💡 Tip: Añade zapatos a tu armario para completar el look
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="suggestions" className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">Complementa tu look con estas prendas</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-2xl">👟</span>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium">Zapatillas</p>
                        <p className="text-xs text-gray-500">Complemento perfecto</p>
                      </CardContent>
                      <CardFooter className="p-3 pt-0">
                        <Button size="sm" className="w-full">
                          <ShoppingBag className="mr-2 h-3 w-3" />
                          Buscar
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <div className="aspect-square relative bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <span className="text-2xl">🧢</span>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium">Gorra</p>
                        <p className="text-xs text-gray-500">Accesorio ideal</p>
                      </CardContent>
                      <CardFooter className="p-3 pt-0">
                        <Button size="sm" className="w-full">
                          <ShoppingBag className="mr-2 h-3 w-3" />
                          Buscar
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Consejos de estilo</h3>
                <ul className="text-sm space-y-2">
                  {outfit.top && outfit.bottom && (
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-pink-500 mt-0.5" />
                      <span>
                        Combina {outfit.top.name} con {outfit.bottom.name} para un look {getStyleName(actualStyle)}{" "}
                        perfecto
                      </span>
                    </li>
                  )}
                  {preferences.temperature < 15 && (
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-pink-500 mt-0.5" />
                      <span>Con {preferences.temperature}°C, considera añadir una chaqueta o abrigo</span>
                    </li>
                  )}
                  {actualStyle === "sport" && (
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-pink-500 mt-0.5" />
                      <span>Perfecto para actividades deportivas y ejercicio</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex justify-center">
                <Button size="lg" className="px-8" onClick={generateAnotherOutfit}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar otro look
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
