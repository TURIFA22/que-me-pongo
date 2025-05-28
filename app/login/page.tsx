"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from 'lucide-react'
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const { error, success } = await signIn(email, password)
      
      if (success) {
        router.push("/dashboard")
      } else {
        setError(error?.message || "Credenciales incorrectas")
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-6 w-6 text-pink-500" />
              <span>MiArmario</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Inicia sesión en tu cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="font-medium text-pink-600 hover:text-pink-500">
              Regístrate
            </Link>
          </p>
        </div>
        <div className="mt-8 mx-auto w-full max-w-sm">
          <div className="bg-white px-6 py-8 shadow-md rounded-lg">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-pink-600 hover:text-pink-500">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}