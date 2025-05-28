"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import Link from "next/link"

const outfitsData = [
  {
    id: "outfit_1",
    name: "Look Casual Urbano",
    date: "2024-01-15",
    pieces: 4,
    style: "Casual",
    occasion: "Diario",
    likes: 23,
    status: "Favorito",
  },
  {
    id: "outfit_2",
    name: "Elegante Nocturno",
    date: "2024-01-14",
    pieces: 5,
    style: "Formal",
    occasion: "Cena",
    likes: 45,
    status: "Trending",
  },
  {
    id: "outfit_3",
    name: "Deportivo Cómodo",
    date: "2024-01-13",
    pieces: 3,
    style: "Sport",
    occasion: "Gym",
    likes: 12,
    status: "Reciente",
  },
  {
    id: "outfit_4",
    name: "Boho Chic",
    date: "2024-01-12",
    pieces: 6,
    style: "Boho",
    occasion: "Festival",
    likes: 67,
    status: "Popular",
  },
  {
    id: "outfit_5",
    name: "Minimalista Clean",
    date: "2024-01-11",
    pieces: 3,
    style: "Minimal",
    occasion: "Trabajo",
    likes: 34,
    status: "Favorito",
  },
  {
    id: "outfit_6",
    name: "Vintage Retro",
    date: "2024-01-10",
    pieces: 5,
    style: "Vintage",
    occasion: "Casual",
    likes: 28,
    status: "Reciente",
  },
  {
    id: "outfit_7",
    name: "Street Style",
    date: "2024-01-09",
    pieces: 4,
    style: "Urban",
    occasion: "Salida",
    likes: 56,
    status: "Trending",
  },
  {
    id: "outfit_8",
    name: "Romántico Suave",
    date: "2024-01-08",
    pieces: 4,
    style: "Romantic",
    occasion: "Cita",
    likes: 89,
    status: "Popular",
  },
]

export default function OutfitsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Outfits</h2>
          <p className="text-muted-foreground">Here&apos;s a list of your outfits</p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date > new Date() || date < new Date("2023-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <ModeToggle />
          <Link href="/create-outfit">
            <Button className="transition-all duration-200 hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> Crear nuevo look
            </Button>
          </Link>
        </div>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-foreground">Total Outfits</CardTitle>
            <CardDescription>Total number of outfits created in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">31</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-foreground">Total Views</CardTitle>
            <CardDescription>Total views across all outfits.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+2350</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-foreground">New Likes</CardTitle>
            <CardDescription>New likes this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+12,234</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-foreground">Looks Favoritos</CardTitle>
            <CardDescription>Outfits marcados como favoritos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <div className="rounded-md border">
        <table className="w-full">
          <caption className="mt-4 text-sm text-muted-foreground">Lista de tus outfits recientes.</caption>
          <thead>
            <tr className="border-b">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre del Look</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Piezas</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estilo</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Likes</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Estado</th>
            </tr>
          </thead>
          <tbody>
            {outfitsData.map((outfit) => (
              <tr key={outfit.id} className="border-b transition-colors hover:bg-muted/50 cursor-pointer">
                <td className="p-4 align-middle font-medium">{outfit.name}</td>
                <td className="p-4 align-middle text-muted-foreground">{outfit.date}</td>
                <td className="p-4 align-middle">{outfit.pieces} piezas</td>
                <td className="p-4 align-middle">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {outfit.style}
                  </span>
                </td>
                <td className="p-4 align-middle">❤️ {outfit.likes}</td>
                <td className="p-4 align-middle text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      outfit.status === "Favorito"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : outfit.status === "Trending"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : outfit.status === "Popular"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {outfit.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
