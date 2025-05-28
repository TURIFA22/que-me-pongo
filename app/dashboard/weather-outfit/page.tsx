"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  Thermometer,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ModeToggle } from "@/components/mode-toggle"
import { useToast } from "@/components/ui/use-toast"

type WeatherData = {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  uvIndex: number
  forecast: {
    day: string
    temp: number
    condition: string
    icon: string
  }[]
}

type WeatherOutfitSuggestion = {
  id: string
  title: string
  description: string
  style: string
  pieces: string[]
  reasoning: string
  comfort_score: number
  weather_match: number
}

export default function WeatherOutfitPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [location, setLocation] = useState("Madrid, España")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [outfitSuggestions, setOutfitSuggestions] = useState<WeatherOutfitSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchWeatherAndSuggestions()
    }
  }, [user])

  const fetchWeatherAndSuggestions = async () => {
    setLoading(true)
    try {
      // Simular datos del clima (en producción usarías una API real como OpenWeatherMap)
      const mockWeatherData: WeatherData = {
        location: location,
        temperature: 18,
        condition: "partly_cloudy",
        humidity: 65,
        windSpeed: 12,
        uvIndex: 4,
        forecast: [
          { day: "Hoy", temp: 18, condition: "partly_cloudy", icon: "⛅" },
          { day: "Mañana", temp: 22, condition: "sunny", icon: "☀️" },
          { day: "Pasado", temp: 16, condition: "rainy", icon: "🌧️" },
          { day: "Jueves", temp: 20, condition: "cloudy", icon: "☁️" },
          { day: "Viernes", temp: 24, condition: "sunny", icon: "☀️" },
        ],
      }

      // Generar sugerencias de outfit basadas en el clima
      const suggestions: WeatherOutfitSuggestion[] = [
        {
          id: "1",
          title: "Look Perfecto para Hoy",
          description: "Ideal para 18°C con nubes parciales",
          style: "casual",
          pieces: ["Jeans", "Camiseta manga larga", "Chaqueta ligera", "Sneakers"],
          reasoning: "La temperatura moderada permite capas ligeras. La chaqueta te protegerá si refresca.",
          comfort_score: 95,
          weather_match: 98,
        },
        {
          id: "2",
          title: "Alternativa Urbana",
          description: "Estilo urbano adaptado al clima",
          style: "urban",
          pieces: ["Pantalón cargo", "Hoodie ligero", "Bomber jacket", "Botas urbanas"],
          reasoning: "El hoodie te dará comodidad y la bomber jacket es perfecta para el viento ligero.",
          comfort_score: 88,
          weather_match: 92,
        },
        {
          id: "3",
          title: "Opción Formal-Casual",
          description: "Para ocasiones semi-formales",
          style: "formal",
          pieces: ["Chinos", "Camisa", "Blazer ligero", "Mocasines"],
          reasoning: "El blazer ligero es ideal para la temperatura actual y te permite adaptarte a cambios.",
          comfort_score: 85,
          weather_match: 90,
        },
      ]

      setWeatherData(mockWeatherData)
      setOutfitSuggestions(suggestions)
      setLastUpdated(new Date())

      toast({
        title: "Clima actualizado",
        description: `Sugerencias generadas para ${location}`,
      })
    } catch (error) {
      console.error("Error al obtener datos del clima:", error)
      toast({
        title: "Error",
        description: "No se pudo obtener la información del clima",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "partly_cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-600" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getWeatherDescription = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "Soleado"
      case "partly_cloudy":
        return "Parcialmente nublado"
      case "cloudy":
        return "Nublado"
      case "rainy":
        return "Lluvioso"
      default:
        return "Despejado"
    }
  }

  const getStyleGradient = (style: string) => {
    switch (style) {
      case "casual":
        return "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      case "urban":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      case "formal":
        return "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)"
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  }

  const getStyleEmoji = (style: string) => {
    switch (style) {
      case "casual":
        return "👕"
      case "urban":
        return "🏙️"
      case "formal":
        return "👔"
      default:
        return "✨"
    }
  }

  const generateOutfitFromSuggestion = (suggestion: WeatherOutfitSuggestion) => {
    // Guardar la sugerencia como base para generar outfit
    const outfitData = {
      weatherSuggestion: suggestion,
      preferences: {
        temperature: weatherData?.temperature || 20,
        weatherCondition: weatherData?.condition || "sunny",
        occasion: "casual",
        occasionSubtype: "",
        style: suggestion.style,
      },
      isWeatherBased: true,
      timestamp: new Date().toISOString(),
    }

    sessionStorage.setItem("weatherOutfit", JSON.stringify(outfitData))

    toast({
      title: "Generando outfit",
      description: `Creando look basado en "${suggestion.title}"`,
    })

    router.push("/create-outfit?mode=weather")
  }

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

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

      <main className="flex-1 py-4 md:py-6">
        <div className="container max-w-6xl">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Outfit según el Clima</h1>
            </div>
            <p className="text-muted-foreground">
              Sugerencias de outfit personalizadas basadas en el clima actual y pronóstico
            </p>
          </div>

          {/* Búsqueda de ubicación */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar ubicación..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={fetchWeatherAndSuggestions} disabled={loading}>
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Actualizado: {lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {weatherData && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Panel del clima actual */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {weatherData.location}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      {getWeatherIcon(weatherData.condition)}
                      <div className="text-3xl font-bold mt-2">{weatherData.temperature}°C</div>
                      <div className="text-muted-foreground">{getWeatherDescription(weatherData.condition)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>Humedad: {weatherData.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <span>Viento: {weatherData.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span>UV: {weatherData.uvIndex}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-purple-500" />
                        <span>Visibilidad: Buena</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pronóstico */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Pronóstico 5 días
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weatherData.forecast.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{day.icon}</span>
                            <div>
                              <div className="font-medium">{day.day}</div>
                              <div className="text-sm text-muted-foreground">
                                {getWeatherDescription(day.condition)}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-semibold">{day.temp}°C</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sugerencias de outfit */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Sugerencias de Outfit</h2>
                <div className="space-y-4">
                  {outfitSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="flex">
                        <div
                          className="w-24 flex items-center justify-center text-3xl"
                          style={{ background: getStyleGradient(suggestion.style) }}
                        >
                          {getStyleEmoji(suggestion.style)}
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                              <p className="text-muted-foreground text-sm">{suggestion.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                Comodidad {suggestion.comfort_score}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Clima {suggestion.weather_match}%
                              </Badge>
                            </div>
                          </div>

                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-1">Prendas sugeridas:</h4>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.pieces.map((piece, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {piece}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                          </div>

                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="capitalize">
                              {suggestion.style}
                            </Badge>
                            <Button size="sm" onClick={() => generateOutfitFromSuggestion(suggestion)}>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generar con mi ropa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
