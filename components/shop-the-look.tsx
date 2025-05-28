"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ShoppingBag,
  ExternalLink,
  Star,
  Heart,
  Share2,
  Filter,
  SortAsc,
  Truck,
  RotateCcw,
  TrendingUp,
} from "lucide-react"
import { AffiliateManager, type ProductMatch, AFFILIATE_STORES } from "@/lib/affiliate"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface ShopTheLookProps {
  lookId?: string
  lookTitle: string
  lookPieces: string[]
  lookStyle: string
  lookCategory: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ShopTheLook({
  lookId,
  lookTitle,
  lookPieces,
  lookStyle,
  lookCategory,
  isOpen,
  onOpenChange,
}: ShopTheLookProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<ProductMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStore, setSelectedStore] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"relevance" | "price_low" | "price_high" | "rating">("relevance")
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    if (isOpen) {
      searchProducts()
    }
  }, [isOpen, lookStyle, lookCategory])

  const searchProducts = async () => {
    setLoading(true)
    try {
      // Buscar productos para cada pieza del look
      const allProducts: ProductMatch[] = []

      for (const piece of lookPieces) {
        const pieceProducts = await AffiliateManager.searchProducts(piece, lookCategory, lookStyle)
        allProducts.push(...pieceProducts)
      }

      // Eliminar duplicados y ordenar por relevancia
      const uniqueProducts = allProducts.filter(
        (product, index, self) => index === self.findIndex((p) => p.id === product.id),
      )

      setProducts(uniqueProducts)
    } catch (error) {
      console.error("Error al buscar productos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = async (product: ProductMatch) => {
    if (!user) return

    try {
      // Trackear el click para analytics
      await AffiliateManager.trackClick(product.id, user.id, sessionId)

      // Abrir enlace de afiliado en nueva pestaña
      window.open(product.affiliate_url, "_blank", "noopener,noreferrer")

      toast({
        title: "¡Producto abierto! 🛍️",
        description: `Abriendo ${product.name} en ${getStoreName(product.store_id)}`,
      })
    } catch (error) {
      console.error("Error al abrir producto:", error)
    }
  }

  const getStoreName = (storeId: string) => {
    return AFFILIATE_STORES.find((store) => store.id === storeId)?.name || "Tienda"
  }

  const getStoreLogo = (storeId: string) => {
    const store = AFFILIATE_STORES.find((store) => store.id === storeId)
    return store?.logo || "/placeholder.svg?height=40&width=80&text=Store"
  }

  const filteredAndSortedProducts = products
    .filter((product) => selectedStore === "all" || product.store_id === selectedStore)
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price
        case "price_high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "relevance":
        default:
          return b.similarity_score - a.similarity_score
      }
    })

  const totalEstimatedCommission = filteredAndSortedProducts.reduce(
    (sum, product) => sum + AffiliateManager.calculateCommission(product.price, product.store_id),
    0,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-6 w-6 text-pink-500" />
            Shop the Look: {lookTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Información del look */}
          <Card className="mb-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">🎯 Piezas del look:</h3>
                  <div className="flex flex-wrap gap-2">
                    {lookPieces.map((piece, index) => (
                      <Badge key={index} variant="outline" className="bg-white/50">
                        {piece}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Comisión estimada</div>
                  <div className="text-lg font-bold text-green-600">€{totalEstimatedCommission.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtros y ordenación */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">Todas las tiendas</option>
                {AFFILIATE_STORES.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="relevance">Más relevante</option>
                <option value="price_low">Precio: menor a mayor</option>
                <option value="price_high">Precio: mayor a menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>

          {/* Lista de productos */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p>Buscando productos similares...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90">
                        <img
                          src={getStoreLogo(product.store_id) || "/placeholder.svg"}
                          alt={getStoreName(product.store_id)}
                          className="h-4 w-auto"
                        />
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-green-500 text-white">
                        {product.similarity_score}% match
                      </Badge>
                    </div>
                    {product.original_price && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="destructive">
                          -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-lg font-bold">€{product.price}</div>
                      {product.original_price && (
                        <div className="text-sm text-muted-foreground line-through">€{product.original_price}</div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: color === "white" ? "#FFFFFF" : color === "black" ? "#000000" : color,
                          }}
                          title={color}
                        />
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        onClick={() => handleProductClick(product)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver en {getStoreName(product.store_id)}
                      </Button>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Info de la tienda */}
                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Truck className="h-3 w-3" />
                        <span>{AFFILIATE_STORES.find((s) => s.id === product.store_id)?.shipping_info}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" />
                        <span>{AFFILIATE_STORES.find((s) => s.id === product.store_id)?.return_policy}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredAndSortedProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">Intenta cambiar los filtros o buscar en todas las tiendas</p>
              <Button onClick={searchProducts}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Buscar de nuevo
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
