"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  ArrowLeft,
  Heart,
  Share2,
  Search,
  TrendingUp,
  Filter,
  Eye,
  Bookmark,
  Instagram,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ModeToggle } from "@/components/mode-toggle"

// Datos de ejemplo de looks trending (con imágenes placeholder simples)
const TRENDING_LOOKS = [
  {
    id: "1",
    title: "Casual Chic Primavera",
    description: "Look perfecto para el día a día con un toque elegante",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["casual", "primavera", "chic", "urbano"],
    likes: 1247,
    views: 8934,
    category: "casual",
    season: "spring",
    style: "urban",
    colors: ["beige", "white", "brown"],
    pieces: ["Blazer beige", "Jeans blancos", "Sneakers", "Bolso marrón"],
    source: "Pinterest",
    trending: true,
  },
  {
    id: "2",
    title: "Elegancia Minimalista",
    description: "Sofisticación en su máxima expresión con líneas limpias",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["formal", "minimalista", "elegante", "oficina"],
    likes: 2156,
    views: 12456,
    category: "formal",
    season: "all",
    style: "minimalist",
    colors: ["black", "white"],
    pieces: ["Blazer negro", "Pantalón blanco", "Zapatos negros", "Reloj plateado"],
    source: "Instagram",
    trending: true,
  },
  {
    id: "3",
    title: "Vibes Deportivo Moderno",
    description: "Comodidad y estilo para tu rutina de ejercicios",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["deportivo", "athleisure", "cómodo", "moderno"],
    likes: 892,
    views: 5643,
    category: "sport",
    season: "summer",
    style: "sport",
    colors: ["gray", "pink", "white"],
    pieces: ["Top deportivo", "Leggings grises", "Sneakers rosas", "Chaqueta blanca"],
    source: "TikTok",
    trending: false,
  },
  {
    id: "4",
    title: "Bohemio Romántico",
    description: "Estilo libre y romántico para ocasiones especiales",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["bohemio", "romántico", "verano", "festival"],
    likes: 1834,
    views: 9876,
    category: "party",
    season: "summer",
    style: "bohemian",
    colors: ["cream", "gold", "brown"],
    pieces: ["Vestido fluido", "Sandalias doradas", "Accesorios bohemios", "Sombrero"],
    source: "Pinterest",
    trending: true,
  },
  {
    id: "5",
    title: "Street Style Urbano",
    description: "La esencia de la moda callejera contemporánea",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["urbano", "street", "oversized", "juvenil"],
    likes: 3421,
    views: 18765,
    category: "casual",
    season: "autumn",
    style: "urban",
    colors: ["black", "gray", "orange"],
    pieces: ["Hoodie oversized", "Jeans baggy", "Sneakers chunky", "Gorra"],
    source: "Instagram",
    trending: true,
  },
  {
    id: "6",
    title: "Vintage Retro Chic",
    description: "Nostalgia de los 90s con un toque moderno",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["vintage", "retro", "90s", "denim"],
    likes: 1567,
    views: 7234,
    category: "casual",
    season: "spring",
    style: "vintage",
    colors: ["blue", "white", "red"],
    pieces: ["Chaqueta denim", "Crop top blanco", "Jeans mom", "Sneakers retro"],
    source: "Pinterest",
    trending: false,
  },
  {
    id: "7",
    title: "Business Casual Moderno",
    description: "Profesional pero relajado para el trabajo híbrido",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["business", "casual", "trabajo", "profesional"],
    likes: 987,
    views: 4532,
    category: "formal",
    season: "all",
    style: "formal",
    colors: ["navy", "white", "beige"],
    pieces: ["Blazer navy", "Camisa blanca", "Pantalón beige", "Mocasines"],
    source: "LinkedIn",
    trending: false,
  },
  {
    id: "8",
    title: "Festival Summer Vibes",
    description: "Perfecto para festivales de música y eventos al aire libre",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["festival", "verano", "colorido", "boho"],
    likes: 2789,
    views: 15432,
    category: "party",
    season: "summer",
    style: "bohemian",
    colors: ["multicolor", "yellow", "pink"],
    pieces: ["Top crop colorido", "Shorts denim", "Botas cowboy", "Accesorios dorados"],
    source: "TikTok",
    trending: true,
  },
]

export default function TrendingPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [likedLooks, setLikedLooks] = useState<string[]>([])
  const [savedLooks, setSavedLooks] = useState<string[]>([])

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Filtrar looks según criterios
  const filteredLooks = TRENDING_LOOKS.filter((look) => {
    const matchesSearch =
      look.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      look.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || look.category === selectedCategory
    const matchesStyle = selectedStyle === "all" || look.style === selectedStyle

    return matchesSearch && matchesCategory && matchesStyle
  })

  // Separar looks trending y regulares
  const trendingLooks = filteredLooks.filter((look) => look.trending)
  const regularLooks = filteredLooks.filter((look) => !look.trending)

  const handleLike = (lookId: string) => {
    setLikedLooks((prev) => (prev.includes(lookId) ? prev.filter((id) => id !== lookId) : [...prev, lookId]))
  }

  const handleSave = (lookId: string) => {
    setSavedLooks((prev) => (prev.includes(lookId) ? prev.filter((id) => id !== lookId) : [...prev, lookId]))
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Instagram":
        return <Instagram className="h-3 w-3" />
      case "TikTok":
        return <span className="text-xs font-bold">TT</span>
      case "Pinterest":
        return <span className="text-xs font-bold">P</span>
      default:
        return <ExternalLink className="h-3 w-3" />
    }
  }

  // Función para generar gradiente basado en el estilo
  const getStyleGradient = (style: string, category: string) => {
    switch (style) {
      case "urban":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      case "minimalist":
        return "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      case "sport":
        return "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
      case "bohemian":
        return "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
      case "vintage":
        return "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      case "formal":
        return "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)"
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  }

  // Función para obtener emoji basado en el estilo
  const getStyleEmoji = (style: string, category: string) => {
    switch (style) {
      case "urban":
        return "🏙️"
      case "minimalist":
        return "⚪"
      case "sport":
        return "🏃‍♀️"
      case "bohemian":
        return "🌸"
      case "vintage":
        return "📼"
      case "formal":
        return "👔"
      default:
        return "✨"
    }
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
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-pink-500" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Looks Trending</h1>
            </div>
            <p className="text-muted-foreground">
              Descubre las últimas tendencias de moda inspiradas en Pinterest, Instagram y TikTok
            </p>
          </div>

          {/* Filtros y búsqueda */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar looks, estilos, colores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Tabs de categorías */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="casual">Casual</TabsTrigger>
                <TabsTrigger value="formal">Formal</TabsTrigger>
                <TabsTrigger value="sport">Deportivo</TabsTrigger>
                <TabsTrigger value="party">Fiesta</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Sección Trending */}
          {trendingLooks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">🔥 Trending Ahora</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {trendingLooks.map((look) => (
                  <Link key={look.id} href={`/trending/${look.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer">
                      <div className="relative">
                        {/* Imagen con gradiente y emoji como fallback */}
                        <div
                          className="w-full h-64 md:h-80 flex items-center justify-center text-6xl transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: getStyleGradient(look.style, look.category),
                          }}
                        >
                          {getStyleEmoji(look.style, look.category)}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {getSourceIcon(look.source)}
                            <span className="ml-1">{look.source}</span>
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{look.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{look.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {look.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            <strong>Piezas clave:</strong>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {look.pieces.slice(0, 2).map((piece, index) => (
                              <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                                {piece}
                              </span>
                            ))}
                            {look.pieces.length > 2 && (
                              <span className="text-xs text-muted-foreground">+{look.pieces.length - 2} más</span>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{look.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{look.views.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              handleLike(look.id)
                            }}
                            className={likedLooks.includes(look.id) ? "text-red-500" : ""}
                          >
                            <Heart className={`h-4 w-4 ${likedLooks.includes(look.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              handleSave(look.id)
                            }}
                            className={savedLooks.includes(look.id) ? "text-blue-500" : ""}
                          >
                            <Bookmark className={`h-4 w-4 ${savedLooks.includes(look.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sección Todos los looks */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Todos los Looks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {regularLooks.map((look) => (
                <Link key={look.id} href={`/trending/${look.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="relative">
                      {/* Imagen con gradiente y emoji como fallback */}
                      <div
                        className="w-full h-64 md:h-80 flex items-center justify-center text-6xl transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: getStyleGradient(look.style, look.category),
                        }}
                      >
                        {getStyleEmoji(look.style, look.category)}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {getSourceIcon(look.source)}
                          <span className="ml-1">{look.source}</span>
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{look.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{look.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {look.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <strong>Piezas clave:</strong>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {look.pieces.slice(0, 2).map((piece, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {piece}
                            </span>
                          ))}
                          {look.pieces.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{look.pieces.length - 2} más</span>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{look.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{look.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            handleLike(look.id)
                          }}
                          className={likedLooks.includes(look.id) ? "text-red-500" : ""}
                        >
                          <Heart className={`h-4 w-4 ${likedLooks.includes(look.id) ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            handleSave(look.id)
                          }}
                          className={savedLooks.includes(look.id) ? "text-blue-500" : ""}
                        >
                          <Bookmark className={`h-4 w-4 ${savedLooks.includes(look.id) ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Mensaje si no hay resultados */}
          {filteredLooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No se encontraron looks que coincidan con tu búsqueda</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedStyle("all")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
