"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  ArrowLeft,
  Heart,
  TrendingUp,
  BarChart3,
  Palette,
  Calendar,
  Target,
  Award,
  Eye,
  Share2,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ModeToggle } from "@/components/mode-toggle"
import { useToast } from "@/components/ui/use-toast"

type FavoriteOutfit = {
  id: string
  name: string
  style: string
  occasion: string
  created_at: string
  likes_count: number
  views_count: number
  is_trending_recreation: boolean
  reference_look_title?: string
}

type StyleAnalysis = {
  favoriteStyle: string
  styleDistribution: { [key: string]: number }
  favoriteColors: string[]
  occasionPreferences: { [key: string]: number }
  seasonalTrends: { [key: string]: number }
  personalityProfile: string
}

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [favorites, setFavorites] = useState<FavoriteOutfit[]>([])
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchFavorites()
      generateStyleAnalysis()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      // Simular datos de favoritos (en producción vendría de Supabase)
      const mockFavorites: FavoriteOutfit[] = [
        {
          id: "1",
          name: "Look Urbano Casual",
          style: "urban",
          occasion: "casual",
          created_at: "2024-01-15",
          likes_count: 23,
          views_count: 156,
          is_trending_recreation: false,
        },
        {
          id: "2",
          name: "Recreación: Street Style Urbano",
          style: "urban",
          occasion: "casual",
          created_at: "2024-01-20",
          likes_count: 45,
          views_count: 289,
          is_trending_recreation: true,
          reference_look_title: "Street Style Urbano",
        },
        {
          id: "3",
          name: "Look Deportivo Moderno",
          style: "sport",
          occasion: "sport",
          created_at: "2024-01-18",
          likes_count: 12,
          views_count: 98,
          is_trending_recreation: false,
        },
        {
          id: "4",
          name: "Elegancia Minimalista",
          style: "minimalist",
          occasion: "formal",
          created_at: "2024-01-22",
          likes_count: 67,
          views_count: 234,
          is_trending_recreation: false,
        },
      ]

      setFavorites(mockFavorites)
    } catch (error) {
      console.error("Error al cargar favoritos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar tus looks favoritos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateStyleAnalysis = async () => {
    try {
      // Análisis inteligente basado en los outfits del usuario
      const analysis: StyleAnalysis = {
        favoriteStyle: "urban",
        styleDistribution: {
          urban: 45,
          casual: 25,
          sport: 20,
          formal: 10,
        },
        favoriteColors: ["black", "white", "gray", "blue"],
        occasionPreferences: {
          casual: 60,
          sport: 25,
          formal: 15,
        },
        seasonalTrends: {
          spring: 30,
          summer: 25,
          autumn: 25,
          winter: 20,
        },
        personalityProfile: "Urbano Moderno",
      }

      setStyleAnalysis(analysis)
    } catch (error) {
      console.error("Error al generar análisis:", error)
    }
  }

  const getStyleGradient = (style: string) => {
    switch (style) {
      case "urban":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      case "minimalist":
        return "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      case "sport":
        return "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
      case "casual":
        return "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  }

  const getStyleEmoji = (style: string) => {
    switch (style) {
      case "urban":
        return "🏙️"
      case "minimalist":
        return "⚪"
      case "sport":
        return "🏃‍♀️"
      case "casual":
        return "👕"
      default:
        return "✨"
    }
  }

  const getPersonalityInsights = (profile: string) => {
    switch (profile) {
      case "Urbano Moderno":
        return {
          description: "Te gusta la moda contemporánea y versátil",
          traits: ["Práctico", "Moderno", "Versátil", "Urbano"],
          recommendations: [
            "Experimenta con accesorios statement",
            "Prueba layering con diferentes texturas",
            "Incorpora más colores neutros premium",
          ],
        }
      default:
        return {
          description: "Estilo único en desarrollo",
          traits: ["Creativo", "Experimental"],
          recommendations: ["Sigue explorando diferentes estilos"],
        }
    }
  }

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

  if (!user) {
    return null
  }

  const personalityInsights = styleAnalysis ? getPersonalityInsights(styleAnalysis.personalityProfile) : null

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
        <div className="container max-w-7xl">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mis Favoritos</h1>
            </div>
            <p className="text-muted-foreground">Tus looks favoritos y análisis personalizado de tu estilo</p>
          </div>

          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Análisis de Estilo
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Insights Personales
              </TabsTrigger>
            </TabsList>

            {/* Tab de Favoritos */}
            <TabsContent value="favorites" className="space-y-6">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tienes looks favoritos aún</h3>
                  <p className="text-muted-foreground mb-4">Crea outfits y márcalos como favoritos para verlos aquí</p>
                  <Link href="/create-outfit">
                    <Button>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Crear mi primer look
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {favorites.map((outfit) => (
                    <Card
                      key={outfit.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="relative">
                        <div
                          className="w-full h-48 flex items-center justify-center text-4xl"
                          style={{ background: getStyleGradient(outfit.style) }}
                        >
                          {getStyleEmoji(outfit.style)}
                        </div>
                        {outfit.is_trending_recreation && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="bg-purple-500 text-white">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Recreación
                            </Badge>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-white/90">
                            <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
                            {outfit.likes_count}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{outfit.name}</h3>
                        {outfit.is_trending_recreation && outfit.reference_look_title && (
                          <p className="text-xs text-purple-600 mb-2">Inspirado en: {outfit.reference_look_title}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {outfit.style}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {outfit.occasion}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{outfit.views_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(outfit.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab de Análisis */}
            <TabsContent value="analysis" className="space-y-6">
              {styleAnalysis && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Distribución de Estilos */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Estilos Favoritos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(styleAnalysis.styleDistribution).map(([style, percentage]) => (
                        <div key={style} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{style}</span>
                            <span>{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Ocasiones Preferidas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Ocasiones Preferidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(styleAnalysis.occasionPreferences).map(([occasion, percentage]) => (
                        <div key={occasion} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{occasion}</span>
                            <span>{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Colores Favoritos */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Paleta de Colores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-2">
                        {styleAnalysis.favoriteColors.map((color, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="w-12 h-12 rounded-full border-2 border-gray-300 mx-auto mb-1"
                              style={{
                                backgroundColor: color === "white" ? "#FFFFFF" : color === "black" ? "#000000" : color,
                              }}
                            />
                            <span className="text-xs capitalize">{color}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Tab de Insights */}
            <TabsContent value="insights" className="space-y-6">
              {personalityInsights && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Perfil de Personalidad */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Tu Perfil de Estilo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg">
                        <div className="text-4xl mb-2">🎨</div>
                        <h3 className="text-xl font-bold mb-2">{styleAnalysis?.personalityProfile}</h3>
                        <p className="text-muted-foreground">{personalityInsights.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Características principales:</h4>
                        <div className="flex flex-wrap gap-2">
                          {personalityInsights.traits.map((trait, index) => (
                            <Badge key={index} variant="secondary">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recomendaciones */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Recomendaciones Personalizadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {personalityInsights.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                            <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estadísticas */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Estadísticas de Uso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-pink-500">{favorites.length}</div>
                          <div className="text-sm text-muted-foreground">Looks Favoritos</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-blue-500">
                            {favorites.reduce((sum, outfit) => sum + outfit.likes_count, 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Likes</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-green-500">
                            {favorites.filter((outfit) => outfit.is_trending_recreation).length}
                          </div>
                          <div className="text-sm text-muted-foreground">Recreaciones</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-purple-500">
                            {Math.round(
                              favorites.reduce((sum, outfit) => sum + outfit.views_count, 0) / favorites.length || 0,
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">Promedio Vistas</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
