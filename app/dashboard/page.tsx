"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Shirt,
  Sparkles,
  Filter,
  LogOut,
  Trash2,
  MoreVertical,
  Menu,
  TrendingUp,
  Heart,
  Thermometer,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type Clothing = {
  id: string
  name: string
  category: string
  type: string
  style: string
  color: string
  image_url: string
}

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()
  const [clothes, setClothes] = useState<Clothing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Cargar las prendas del usuario
  useEffect(() => {
    if (user) {
      fetchClothes()
    }
  }, [user])

  const fetchClothes = async () => {
    try {
      const { data, error } = await supabase.from("clothes").select("*").eq("user_id", user?.id)

      if (error) {
        throw error
      }

      console.log("Prendas cargadas:", data)
      setClothes(data || [])
    } catch (error) {
      console.error("Error al cargar las prendas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async () => {
    if (!deleteItemId) return

    setIsDeleting(true)
    try {
      // 1. Obtener la información de la prenda
      const itemToDelete = clothes.find((item) => item.id === deleteItemId)
      if (!itemToDelete) throw new Error("Prenda no encontrada")

      // 2. Eliminar la prenda de la base de datos
      const { error: deleteError } = await supabase.from("clothes").delete().eq("id", deleteItemId)

      if (deleteError) throw deleteError

      // 3. Actualizar el estado local
      setClothes((prev) => prev.filter((item) => item.id !== deleteItemId))

      // 4. Intentar eliminar la imagen si existe
      try {
        // Extraer el nombre del archivo de la URL
        const imageUrl = itemToDelete.image_url
        if (imageUrl) {
          // Extraer la ruta del archivo de la URL
          const filePath = imageUrl.split("/").slice(-2).join("/")
          if (filePath) {
            await supabase.storage.from("public-clothes").remove([filePath])
          }
        }
      } catch (imageError) {
        console.error("Error al eliminar la imagen:", imageError)
        // Continuamos aunque falle la eliminación de la imagen
      }
    } catch (error) {
      console.error("Error al eliminar la prenda:", error)
      alert("Error al eliminar la prenda")
    } finally {
      setIsDeleting(false)
      setDeleteItemId(null)
    }
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

  // Si no hay usuario y no está cargando, no renderizar nada (se redirigirá)
  if (!user) {
    return null
  }

  // Obtener el nombre del usuario de los metadatos
  const userName = user.user_metadata?.full_name || "Usuario"

  // Filtrar prendas por categoría
  const getFilteredClothes = (category: string) => {
    if (category === "all") return clothes
    return clothes.filter((item) => item.category === category)
  }

  // Función para obtener el color de fondo basado en el color de la prenda
  const getColorIndicator = (color: string) => {
    const colorMap: { [key: string]: string } = {
      black: "#000000",
      white: "#FFFFFF",
      gray: "#6B7280",
      "light-gray": "#D1D5DB",
      "dark-gray": "#374151",
      red: "#EF4444",
      pink: "#EC4899",
      fuchsia: "#D946EF",
      purple: "#8B5CF6",
      violet: "#7C3AED",
      indigo: "#6366F1",
      blue: "#3B82F6",
      "light-blue": "#0EA5E9",
      navy: "#1E3A8A",
      cyan: "#06B6D4",
      teal: "#14B8A6",
      green: "#22C55E",
      "light-green": "#84CC16",
      "dark-green": "#15803D",
      lime: "#65A30D",
      yellow: "#EAB308",
      amber: "#F59E0B",
      orange: "#F97316",
      "dark-orange": "#EA580C",
      brown: "#A16207",
      beige: "#D2B48C",
      cream: "#FEF3C7",
      gold: "#D4AF37",
      silver: "#C0C0C0",
      multicolor: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
    }

    return colorMap[color] || "#6B7280"
  }

  // Componente para mostrar imagen con fallback
  const ClothingImage = ({ item }: { item: Clothing }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    return (
      <div className="aspect-square relative bg-muted">
        {!imageError ? (
          <>
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
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
          <div className="w-full h-full flex items-center justify-center">
            <Shirt className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {/* Indicador de color */}
        <div className="absolute top-2 right-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{
              background:
                item.color === "multicolor"
                  ? "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)"
                  : getColorIndicator(item.color),
              border: item.color === "white" ? "2px solid #e5e7eb" : "2px solid white",
            }}
            title={`Color: ${item.color}`}
          />
        </div>
      </div>
    )
  }

  // Componente de navegación móvil
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-pink-600 px-4 py-2 rounded-md bg-pink-50 dark:bg-pink-950"
          >
            Mi armario
          </Link>
          <Link
            href="/dashboard/outfits"
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors"
          >
            Mis looks
          </Link>
          <Link
            href="/create-outfit"
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors"
          >
            Crear look
          </Link>
          <Link
            href="/trending"
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </Link>
          <Link
            href="/dashboard/favorites"
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Favoritos
          </Link>
          <Link
            href="/dashboard/weather-outfit"
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Thermometer className="h-4 w-4" />
            Clima
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-6 w-6 text-pink-500" />
              <span className="hidden sm:inline">MiArmario</span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-pink-600">
              Mi armario
            </Link>
            <Link
              href="/dashboard/outfits"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mis looks
            </Link>
            <Link
              href="/create-outfit"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Crear look
            </Link>
            <Link
              href="/trending"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Link>
            <Link
              href="/dashboard/favorites"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Heart className="h-4 w-4" />
              Favoritos
            </Link>
            <Link
              href="/dashboard/weather-outfit"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Thermometer className="h-4 w-4" />
              Clima
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <span className="text-xs font-medium">{userName.charAt(0)}</span>
              </div>
              <span className="text-sm hidden lg:inline-block">{userName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-4 md:py-6">
        <div className="container">
          {/* Nuevas funcionalidades destacadas */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Link href="/trending">
              <Card className="p-4 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950 dark:to-orange-950 border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">🔥 Trending</h3>
                    <p className="text-sm text-muted-foreground">Looks de moda actuales</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/favorites">
              <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">📊 Análisis Personal</h3>
                    <p className="text-sm text-muted-foreground">Tu estilo analizado</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/weather-outfit">
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">🌤️ Outfit Clima</h3>
                    <p className="text-sm text-muted-foreground">Basado en el tiempo</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mi armario</h1>
              <p className="text-muted-foreground">Gestiona tu ropa y crea looks perfectos</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/upload-item" className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto transition-all duration-200 hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Añadir prenda</span>
                  <span className="sm:hidden">Añadir</span>
                </Button>
              </Link>
              <Link href="/create-outfit" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full sm:w-auto transition-all duration-200 hover:scale-105">
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Crear look</span>
                  <span className="sm:hidden">Look</span>
                </Button>
              </Link>
              <Button variant="outline" className="hidden md:flex transition-all duration-200 hover:scale-105">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 w-full md:w-auto">
              <TabsTrigger value="all" className="flex-1 md:flex-none">
                Todas
              </TabsTrigger>
              <TabsTrigger value="top" className="flex-1 md:flex-none">
                Superior
              </TabsTrigger>
              <TabsTrigger value="bottom" className="flex-1 md:flex-none">
                Inferior
              </TabsTrigger>
              <TabsTrigger value="shoes" className="flex-1 md:flex-none">
                Calzado
              </TabsTrigger>
              <TabsTrigger value="accessory" className="flex-1 md:flex-none">
                Accesorios
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="py-12 text-center">Cargando prendas...</div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-6">
                  {clothes.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground mb-4">Aún no tienes prendas en tu armario</p>
                      <Link href="/upload-item">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Añadir tu primera prenda
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                      {getFilteredClothes("all").map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <ClothingImage item={item} />
                          <CardFooter className="p-2 md:p-3 flex justify-between items-center bg-card">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.style}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                  onClick={() => setDeleteItemId(item.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Repetir para otras categorías con el mismo patrón responsive */}
                {["top", "bottom", "shoes", "accessory"].map((category) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    {getFilteredClothes(category).length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-muted-foreground">No tienes prendas en esta categoría</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {getFilteredClothes(category).map((item) => (
                          <Card
                            key={item.id}
                            className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105"
                          >
                            <ClothingImage item={item} />
                            <CardFooter className="p-2 md:p-3 flex justify-between items-center bg-card">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{item.style}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                    onClick={() => setDeleteItemId(item.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>
        </div>
      </main>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La prenda se eliminará permanentemente de tu armario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteItem()
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
