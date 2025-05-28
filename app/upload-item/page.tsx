"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Loader2, Sparkles, Camera, Palette } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { ModeToggle } from "@/components/mode-toggle"

// Paleta de colores expandida
const COLORS = [
  { name: "Negro", value: "black", hex: "#000000" },
  { name: "Blanco", value: "white", hex: "#FFFFFF" },
  { name: "Gris", value: "gray", hex: "#6B7280" },
  { name: "Gris claro", value: "light-gray", hex: "#D1D5DB" },
  { name: "Gris oscuro", value: "dark-gray", hex: "#374151" },
  { name: "Rojo", value: "red", hex: "#EF4444" },
  { name: "Rosa", value: "pink", hex: "#EC4899" },
  { name: "Fucsia", value: "fuchsia", hex: "#D946EF" },
  { name: "Púrpura", value: "purple", hex: "#8B5CF6" },
  { name: "Violeta", value: "violet", hex: "#7C3AED" },
  { name: "Índigo", value: "indigo", hex: "#6366F1" },
  { name: "Azul", value: "blue", hex: "#3B82F6" },
  { name: "Azul claro", value: "light-blue", hex: "#0EA5E9" },
  { name: "Azul marino", value: "navy", hex: "#1E3A8A" },
  { name: "Cian", value: "cyan", hex: "#06B6D4" },
  { name: "Turquesa", value: "teal", hex: "#14B8A6" },
  { name: "Verde", value: "green", hex: "#22C55E" },
  { name: "Verde claro", value: "light-green", hex: "#84CC16" },
  { name: "Verde oscuro", value: "dark-green", hex: "#15803D" },
  { name: "Lima", value: "lime", hex: "#65A30D" },
  { name: "Amarillo", value: "yellow", hex: "#EAB308" },
  { name: "Ámbar", value: "amber", hex: "#F59E0B" },
  { name: "Naranja", value: "orange", hex: "#F97316" },
  { name: "Naranja oscuro", value: "dark-orange", hex: "#EA580C" },
  { name: "Marrón", value: "brown", hex: "#A16207" },
  { name: "Beige", value: "beige", hex: "#D2B48C" },
  { name: "Crema", value: "cream", hex: "#FEF3C7" },
  { name: "Dorado", value: "gold", hex: "#D4AF37" },
  { name: "Plateado", value: "silver", hex: "#C0C0C0" },
  { name: "Multicolor", value: "multicolor", hex: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)" },
]

export default function UploadItemPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "",
    style: "",
    color: "",
    seasons: [] as string[],
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Redirigir si no hay usuario autenticado
  if (!authLoading && !user) {
    router.push("/login")
    return null
  }

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSeasonToggle = (season: string) => {
    setFormData((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season) ? prev.seasons.filter((s) => s !== season) : [...prev.seasons, season],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona una imagen",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.category || !formData.type || !formData.style || !formData.color) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // 1. Subir imagen a Supabase Storage
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("public-clothes")
        .upload(fileName, selectedFile)

      if (uploadError) {
        throw uploadError
      }

      // 2. Obtener URL pública de la imagen
      const { data: urlData } = supabase.storage.from("public-clothes").getPublicUrl(fileName)

      // 3. Guardar información de la prenda en la base de datos
      const { error: insertError } = await supabase.from("clothes").insert({
        user_id: user?.id,
        name: formData.name,
        category: formData.category,
        type: formData.type,
        style: formData.style,
        color: formData.color,
        seasons: formData.seasons,
        image_url: urlData.publicUrl,
      })

      if (insertError) {
        throw insertError
      }

      toast({
        title: "¡Prenda añadida!",
        description: "La prenda se ha guardado correctamente en tu armario.",
      })

      // Redirigir al dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error al subir la prenda:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la prenda. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center py-4">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al armario</span>
          </Link>
          <div className="mx-auto flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span>MiArmario</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 py-4 md:py-8">
        <div className="container max-w-2xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Añadir nueva prenda</h1>
            <p className="text-muted-foreground">Sube una foto y describe tu prenda para añadirla a tu armario</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección de imagen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Foto de la prenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 md:p-8 hover:border-muted-foreground transition-colors">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full h-48 md:h-64 object-cover rounded-lg shadow-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                        }}
                      >
                        Cambiar imagen
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm font-medium">Haz clic para subir una imagen</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG hasta 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button type="button" asChild>
                          <span>Seleccionar archivo</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la prenda *</Label>
                    <Input
                      id="name"
                      placeholder="ej. Camiseta básica blanca"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="transition-all duration-200 focus:scale-[1.02]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Parte superior</SelectItem>
                        <SelectItem value="bottom">Parte inferior</SelectItem>
                        <SelectItem value="shoes">Calzado</SelectItem>
                        <SelectItem value="outerwear">Abrigos</SelectItem>
                        <SelectItem value="accessory">Accesorios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Input
                      id="type"
                      placeholder="ej. Camiseta, Pantalón, Zapatillas"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="transition-all duration-200 focus:scale-[1.02]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Estilo *</Label>
                    <Select
                      value={formData.style}
                      onValueChange={(value) => setFormData({ ...formData, style: value })}
                    >
                      <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                        <SelectValue placeholder="Selecciona estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="sport">Deportivo</SelectItem>
                        <SelectItem value="urban">Urbano</SelectItem>
                        <SelectItem value="elegant">Elegante</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="bohemian">Bohemio</SelectItem>
                        <SelectItem value="minimalist">Minimalista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selector de color mejorado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color principal *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`group relative aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                        formData.color === color.value
                          ? "border-pink-500 ring-2 ring-pink-200 scale-105"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      title={color.name}
                    >
                      <div
                        className="w-full h-full rounded-md"
                        style={{
                          background:
                            color.value === "multicolor"
                              ? "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)"
                              : color.hex,
                          border: color.value === "white" ? "1px solid #e5e7eb" : "none",
                        }}
                      />
                      {formData.color === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full shadow-md border border-gray-300" />
                        </div>
                      )}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {color.name}
                      </div>
                    </button>
                  ))}
                </div>
                {formData.color && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Color seleccionado:</span>{" "}
                      {COLORS.find((c) => c.value === formData.color)?.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Temporadas */}
            <Card>
              <CardHeader>
                <CardTitle>Temporadas apropiadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "spring", label: "Primavera", emoji: "🌸" },
                    { value: "summer", label: "Verano", emoji: "☀️" },
                    { value: "autumn", label: "Otoño", emoji: "🍂" },
                    { value: "winter", label: "Invierno", emoji: "❄️" },
                  ].map((season) => (
                    <button
                      key={season.value}
                      type="button"
                      onClick={() => handleSeasonToggle(season.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        formData.seasons.includes(season.value)
                          ? "border-pink-500 bg-pink-50 dark:bg-pink-950"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{season.emoji}</div>
                        <div className="text-sm font-medium">{season.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botón de envío */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading} className="transition-all duration-200 hover:scale-105">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Guardar prenda
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
