"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  Eye,
  TrendingUp,
  Instagram,
  ExternalLink,
  ShoppingBag,
  Palette,
  Calendar,
  Tag,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ModeToggle } from "@/components/mode-toggle"
import { useToast } from "@/components/ui/use-toast"
import { ShopTheLook } from "@/components/shop-the-look"

// Datos completos de todos los looks (debe coincidir con la página principal)
const TRENDING_LOOKS = [
  {
    id: "1",
    title: "Casual Chic Primavera",
    description:
      "Look perfecto para el día a día con un toque elegante. Combina comodidad y sofisticación para cualquier ocasión casual.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["casual", "primavera", "chic", "urbano"],
    likes: 1247,
    views: 8934,
    category: "casual",
    season: "spring",
    style: "urban",
    colors: ["beige", "white", "brown"],
    pieces: [
      { name: "Blazer beige", description: "Blazer estructurado en tono neutro", price: "$89" },
      { name: "Jeans blancos", description: "Jeans de corte recto en blanco", price: "$65" },
      { name: "Sneakers", description: "Zapatillas blancas minimalistas", price: "$120" },
      { name: "Bolso marrón", description: "Bolso de cuero en tono cognac", price: "$150" },
    ],
    source: "Pinterest",
    trending: true,
    tutorial: [
      "Comienza con unos jeans blancos como base",
      "Añade un blazer beige para estructura",
      "Completa con sneakers para comodidad",
      "Finaliza con un bolso en tono marrón para contraste",
    ],
  },
  {
    id: "2",
    title: "Elegancia Minimalista",
    description: "Sofisticación en su máxima expresión con líneas limpias y colores neutros.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["formal", "minimalista", "elegante", "oficina"],
    likes: 2156,
    views: 12456,
    category: "formal",
    season: "all",
    style: "minimalist",
    colors: ["black", "white"],
    pieces: [
      { name: "Blazer negro", description: "Blazer entallado de corte perfecto", price: "$150" },
      { name: "Pantalón blanco", description: "Pantalón de vestir en blanco", price: "$85" },
      { name: "Zapatos negros", description: "Zapatos de tacón bajo elegantes", price: "$180" },
      { name: "Reloj plateado", description: "Reloj minimalista de acero", price: "$200" },
    ],
    source: "Instagram",
    trending: true,
    tutorial: [
      "Base con pantalón blanco de corte recto",
      "Añade blazer negro para contraste",
      "Zapatos negros para equilibrio",
      "Accesorio minimalista como toque final",
    ],
  },
  {
    id: "3",
    title: "Vibes Deportivo Moderno",
    description: "Comodidad y estilo para tu rutina de ejercicios. Perfecto para el gym o actividades al aire libre.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["deportivo", "athleisure", "cómodo", "moderno"],
    likes: 892,
    views: 5643,
    category: "sport",
    season: "summer",
    style: "sport",
    colors: ["gray", "pink", "white"],
    pieces: [
      { name: "Top deportivo", description: "Top de entrenamiento transpirable", price: "$45" },
      { name: "Leggings grises", description: "Leggings de alto rendimiento", price: "$75" },
      { name: "Sneakers rosas", description: "Zapatillas deportivas con amortiguación", price: "$140" },
      { name: "Chaqueta blanca", description: "Chaqueta ligera para después del ejercicio", price: "$95" },
    ],
    source: "TikTok",
    trending: false,
    tutorial: [
      "Comienza con leggings grises de calidad",
      "Añade un top deportivo que combine",
      "Completa con sneakers cómodas",
      "Lleva una chaqueta ligera para después",
    ],
  },
  {
    id: "4",
    title: "Bohemio Romántico",
    description: "Estilo libre y romántico para ocasiones especiales. Perfecto para festivales y citas al aire libre.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["bohemio", "romántico", "verano", "festival"],
    likes: 1834,
    views: 9876,
    category: "party",
    season: "summer",
    style: "bohemian",
    colors: ["cream", "gold", "brown"],
    pieces: [
      { name: "Vestido fluido", description: "Vestido largo con estampado floral", price: "$120" },
      { name: "Sandalias doradas", description: "Sandalias planas con detalles dorados", price: "$85" },
      { name: "Accesorios bohemios", description: "Collar y pulseras artesanales", price: "$45" },
      { name: "Sombrero", description: "Sombrero de ala ancha en paja", price: "$60" },
    ],
    source: "Pinterest",
    trending: true,
    tutorial: [
      "Base con un vestido fluido y cómodo",
      "Añade sandalias doradas para elegancia",
      "Completa con accesorios bohemios",
      "Finaliza con un sombrero para protección solar",
    ],
  },
  {
    id: "5",
    title: "Street Style Urbano",
    description: "La esencia de la moda callejera contemporánea. Perfecto para expresar tu personalidad única.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["urbano", "street", "oversized", "juvenil"],
    likes: 3421,
    views: 18765,
    category: "casual",
    season: "autumn",
    style: "urban",
    colors: ["black", "gray", "orange"],
    pieces: [
      { name: "Hoodie oversized", description: "Sudadera con capucha en talla grande", price: "$95" },
      { name: "Jeans baggy", description: "Jeans de corte holgado vintage", price: "$110" },
      { name: "Sneakers chunky", description: "Zapatillas voluminosas retro", price: "$160" },
      { name: "Gorra", description: "Gorra snapback con logo", price: "$35" },
    ],
    source: "Instagram",
    trending: true,
    tutorial: [
      "Comienza con jeans baggy como base",
      "Añade un hoodie oversized para comodidad",
      "Completa con sneakers chunky llamativas",
      "Finaliza con una gorra para el toque urbano",
    ],
  },
  {
    id: "6",
    title: "Vintage Retro Chic",
    description: "Nostalgia de los 90s con un toque moderno. Revive la moda de una década icónica.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["vintage", "retro", "90s", "denim"],
    likes: 1567,
    views: 7234,
    category: "casual",
    season: "spring",
    style: "vintage",
    colors: ["blue", "white", "red"],
    pieces: [
      { name: "Chaqueta denim", description: "Chaqueta vaquera vintage oversized", price: "$85" },
      { name: "Crop top blanco", description: "Top corto básico de algodón", price: "$25" },
      { name: "Jeans mom", description: "Jeans de tiro alto estilo mom", price: "$75" },
      { name: "Sneakers retro", description: "Zapatillas estilo años 90", price: "$130" },
    ],
    source: "Pinterest",
    trending: false,
    tutorial: [
      "Base con jeans mom de tiro alto",
      "Añade un crop top básico",
      "Completa con chaqueta denim oversized",
      "Finaliza con sneakers retro auténticas",
    ],
  },
  {
    id: "7",
    title: "Business Casual Moderno",
    description: "Profesional pero relajado para el trabajo híbrido. Perfecto para la oficina moderna.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["business", "casual", "trabajo", "profesional"],
    likes: 987,
    views: 4532,
    category: "formal",
    season: "all",
    style: "formal",
    colors: ["navy", "white", "beige"],
    pieces: [
      { name: "Blazer navy", description: "Blazer azul marino entallado", price: "$140" },
      { name: "Camisa blanca", description: "Camisa blanca de algodón premium", price: "$65" },
      { name: "Pantalón beige", description: "Pantalón chino en tono neutro", price: "$80" },
      { name: "Mocasines", description: "Mocasines de cuero marrón", price: "$120" },
    ],
    source: "LinkedIn",
    trending: false,
    tutorial: [
      "Base con pantalón chino beige",
      "Añade camisa blanca bien planchada",
      "Completa con blazer navy estructurado",
      "Finaliza con mocasines de cuero",
    ],
  },
  {
    id: "8",
    title: "Festival Summer Vibes",
    description:
      "Perfecto para festivales de música y eventos al aire libre. Comodidad y estilo para bailar todo el día.",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["festival", "verano", "colorido", "boho"],
    likes: 2789,
    views: 15432,
    category: "party",
    season: "summer",
    style: "bohemian",
    colors: ["multicolor", "yellow", "pink"],
    pieces: [
      { name: "Top crop colorido", description: "Top corto con estampado vibrante", price: "$55" },
      { name: "Shorts denim", description: "Shorts vaqueros de tiro alto", price: "$65" },
      { name: "Botas cowboy", description: "Botas estilo western en ante", price: "$180" },
      { name: "Accesorios dorados", description: "Collar y pulseras llamativas", price: "$40" },
    ],
    source: "TikTok",
    trending: true,
    tutorial: [
      "Base con shorts denim cómodos",
      "Añade top crop colorido y vibrante",
      "Completa con botas cowboy auténticas",
      "Finaliza con accesorios dorados llamativos",
    ],
  },
]

export default function TrendingDetailPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [shopModalOpen, setShopModalOpen] = useState(false)

  // Buscar el look por ID
  const look = TRENDING_LOOKS.find((l) => l.id === params.id)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Función para generar gradiente basado en el estilo
  const getStyleGradient = (style: string) => {
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
  const getStyleEmoji = (style: string) => {
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

  if (!look) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Look no encontrado</h1>
          <p className="text-muted-foreground mb-4">El look que buscas no existe o ha sido eliminado.</p>
          <Link href="/trending">
            <Button>Volver a Trending</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleLike = () => {
    setLiked(!liked)
    toast({
      title: liked ? "Like removido" : "¡Te gusta este look!",
      description: liked ? "Removido de tus favoritos" : "Añadido a tus favoritos",
    })
  }

  const handleSave = () => {
    setSaved(!saved)
    toast({
      title: saved ? "Look no guardado" : "¡Look guardado!",
      description: saved ? "Removido de guardados" : "Guardado en tu colección",
    })
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Instagram":
        return <Instagram className="h-4 w-4" />
      case "TikTok":
        return <span className="text-sm font-bold">TT</span>
      case "Pinterest":
        return <span className="text-sm font-bold">P</span>
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const handleRecreateOutfit = () => {
    // Guardar el look trending como referencia para recrear
    const recreateData = {
      referenceLook: look,
      preferences: {
        temperature: 20, // temperatura por defecto
        weatherCondition: "sunny",
        occasion: look.category,
        occasionSubtype: "",
        style: look.style,
      },
      isRecreating: true,
      timestamp: new Date().toISOString(),
    }

    console.log("Guardando datos para recrear:", recreateData)
    sessionStorage.setItem("recreateOutfit", JSON.stringify(recreateData))

    toast({
      title: "¡Recreando look!",
      description: `Generando un outfit ${look.style} similar con tu armario`,
    })

    // Redirigir a la página de creación con modo recrear
    router.push("/create-outfit?mode=recreate")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center py-4">
          <Link href="/trending" className="flex items-center gap-2 hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver a Trending</span>
          </Link>
          <div className="mx-auto flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span>MiArmario</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 py-4 md:py-8">
        <div className="container max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Imagen principal */}
            <div className="space-y-4">
              <div className="relative">
                {/* Imagen con gradiente y emoji como fallback */}
                <div
                  className="w-full h-96 md:h-[600px] rounded-lg shadow-lg flex items-center justify-center text-8xl"
                  style={{
                    background: getStyleGradient(look.style),
                  }}
                >
                  {getStyleEmoji(look.style)}
                </div>
                {look.trending && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getSourceIcon(look.source)}
                    <span>{look.source}</span>
                  </Badge>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                  <Button variant="outline" size="sm" onClick={handleLike} className={liked ? "text-red-500" : ""}>
                    <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                    {liked ? "Liked" : "Like"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave} className={saved ? "text-blue-500" : ""}>
                    <Bookmark className={`h-4 w-4 mr-2 ${saved ? "fill-current" : ""}`} />
                    {saved ? "Guardado" : "Guardar"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </div>

            {/* Información del look */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{look.title}</h1>
                <p className="text-muted-foreground text-lg">{look.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {look.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Información del estilo */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Detalles del Look
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Categoría:</span>
                      <p className="font-medium capitalize">{look.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Estilo:</span>
                      <p className="font-medium capitalize">{look.style}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temporada:</span>
                      <p className="font-medium capitalize flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {look.season === "all" ? "Todo el año" : look.season}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Colores:</span>
                      <div className="flex gap-1 mt-1">
                        {look.colors.map((color) => (
                          <div
                            key={color}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor:
                                color === "multicolor"
                                  ? "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)"
                                  : color === "white"
                                    ? "#FFFFFF"
                                    : color === "black"
                                      ? "#000000"
                                      : color,
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Piezas del look */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Piezas del Look
                  </h3>
                  <div className="space-y-3">
                    {look.pieces.map((piece, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{piece.name}</p>
                          <p className="text-sm text-muted-foreground">{piece.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{piece.price}</p>
                          <Button size="sm" variant="outline" className="mt-1">
                            Buscar similar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tutorial */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Cómo recrear este look</h3>
                  <ol className="space-y-2">
                    {look.tutorial.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button size="lg" onClick={handleRecreateOutfit}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Recrear con mi armario
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShopModalOpen(true)}
                  className="bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 border-green-200"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop the Look
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Shop the Look */}
      <ShopTheLook
        lookId={look.id}
        lookTitle={look.title}
        lookPieces={look.pieces.map((p) => p.name)}
        lookStyle={look.style}
        lookCategory={look.category}
        isOpen={shopModalOpen}
        onOpenChange={setShopModalOpen}
      />
    </div>
  )
}
