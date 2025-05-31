"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Datos de ejemplo para el export estático
const sampleClothes = [
  {
    id: 1,
    name: "Remera Básica",
    description: "Remera blanca básica",
    image_url: "/placeholder.svg?height=200&width=200&text=Remera",
    category: "tops",
  },
  {
    id: 2,
    name: "Jeans",
    description: "Jeans azul clásico",
    image_url: "/placeholder.svg?height=200&width=200&text=Jeans",
    category: "bottoms",
  },
  {
    id: 3,
    name: "Zapatillas",
    description: "Zapatillas deportivas",
    image_url: "/placeholder.svg?height=200&width=200&text=Zapatillas",
    category: "shoes",
  },
]

export default function CreateOutfit() {
  const router = useRouter()
  const [clothes, setClothes] = useState<any[]>([])
  const [selectedClothes, setSelectedClothes] = useState<any[]>([])

  useEffect(() => {
    // Para el export estático, usamos datos de ejemplo
    setClothes(sampleClothes)
  }, [])

  const toggleClothSelection = (cloth: any) => {
    setSelectedClothes((prevSelectedClothes) => {
      if (prevSelectedClothes.find((c) => c.id === cloth.id)) {
        return prevSelectedClothes.filter((c) => c.id !== cloth.id)
      } else {
        return [...prevSelectedClothes, cloth]
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Outfit</h1>
      {clothes.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {clothes.map((cloth) => (
            <div
              key={cloth.id}
              className={`border p-2 rounded-md cursor-pointer transition-colors ${
                selectedClothes.find((c) => c.id === cloth.id) ? "bg-green-100 border-green-500" : "hover:bg-gray-50"
              }`}
              onClick={() => toggleClothSelection(cloth)}
            >
              <img
                src={cloth.image_url || "/placeholder.svg"}
                alt={cloth.name}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-semibold">{cloth.name}</h2>
              <p className="text-gray-600">{cloth.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando prendas...</p>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Outfit Seleccionado</h2>
      <div className="flex flex-wrap gap-4">
        {selectedClothes.map((cloth) => (
          <div key={cloth.id} className="text-center">
            <img
              src={cloth.image_url || "/placeholder.svg"}
              alt={cloth.name}
              className="w-32 h-32 object-cover rounded-md"
            />
            <p className="text-sm mt-2">{cloth.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
