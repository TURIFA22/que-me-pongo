const CACHE_NAME = "miarmario-v1.0.0"
const STATIC_CACHE_NAME = "miarmario-static-v1.0.0"
const DYNAMIC_CACHE_NAME = "miarmario-dynamic-v1.0.0"

// Archivos para cachear inmediatamente
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/trending",
  "/create-outfit",
  "/upload-item",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Agregar más assets estáticos según necesites
]

// URLs que siempre deben ir a la red
const NETWORK_ONLY = ["/api/", "/auth/", "/_next/webpack-hmr"]

// URLs que pueden funcionar offline con cache
const CACHE_FIRST = ["/icons/", "/images/", "/_next/static/", "/placeholder.svg"]

// Instalar Service Worker
self.addEventListener("install", (event) => {
  console.log("SW: Instalando...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("SW: Cacheando assets estáticos")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("SW: Instalación completa")
        return self.skipWaiting()
      }),
  )
})

// Activar Service Worker
self.addEventListener("activate", (event) => {
  console.log("SW: Activando...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log("SW: Eliminando cache antiguo:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("SW: Activación completa")
        return self.clients.claim()
      }),
  )
})

// Interceptar requests
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo manejar requests HTTP/HTTPS
  if (!url.protocol.startsWith("http")) {
    return
  }

  // Network only para ciertas URLs
  if (NETWORK_ONLY.some((pattern) => url.pathname.startsWith(pattern))) {
    event.respondWith(fetch(request))
    return
  }

  // Cache first para assets estáticos
  if (CACHE_FIRST.some((pattern) => url.pathname.startsWith(pattern))) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      }),
    )
    return
  }

  // Estrategia Network First para páginas
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la respuesta es exitosa, cachearla
        if (response.status === 200 && request.method === "GET") {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Si falla la red, intentar desde cache
        return caches.match(request).then((response) => {
          if (response) {
            return response
          }

          // Si es una página y no está en cache, mostrar página offline
          if (request.mode === "navigate") {
            return (
              caches.match("/offline.html") ||
              new Response("Offline - Por favor verifica tu conexión", {
                status: 503,
                statusText: "Service Unavailable",
              })
            )
          }

          // Para otros recursos, devolver error
          return new Response("Recurso no disponible offline", {
            status: 503,
            statusText: "Service Unavailable",
          })
        })
      }),
  )
})

// Manejar notificaciones push
self.addEventListener("push", (event) => {
  console.log("SW: Push recibido")

  const options = {
    body: event.data ? event.data.text() : "Nueva notificación de MiArmario",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Ver en la app",
        icon: "/icons/action-explore.png",
      },
      {
        action: "close",
        title: "Cerrar",
        icon: "/icons/action-close.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("MiArmario", options))
})

// Manejar clicks en notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("SW: Click en notificación")

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/trending"))
  } else if (event.action === "close") {
    // Solo cerrar la notificación
  } else {
    // Click en el cuerpo de la notificación
    event.waitUntil(clients.openWindow("/dashboard"))
  }
})

// Sincronización en background
self.addEventListener("sync", (event) => {
  console.log("SW: Background sync")

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Aquí puedes sincronizar datos cuando vuelva la conexión
      console.log("Sincronizando datos..."),
    )
  }
})

// Manejar actualizaciones de la app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
