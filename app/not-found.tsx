import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">La página que buscas no existe o ha sido movida.</p>
        <Link href="/dashboard" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
          Ir al Dashboard
        </Link>
      </div>
    </div>
  )
}
