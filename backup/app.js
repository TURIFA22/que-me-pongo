// PWA Installation
let deferredPrompt

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault()
  deferredPrompt = e
  showInstallBanner()
})

function showInstallBanner() {
  document.getElementById("installBanner").classList.remove("hidden")
}

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("PWA installed")
      }
      deferredPrompt = null
      dismissInstall()
    })
  }
}

function dismissInstall() {
  document.getElementById("installBanner").classList.add("hidden")
}

// Navigation
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })

  // Remove active class from all nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected page
  document.getElementById(pageId).classList.add("active")

  // Add active class to clicked nav button
  document.querySelector(`[data-page="${pageId}"]`).classList.add("active")

  // Load page content
  if (pageId === "trending") {
    loadTrendingLooks()
  } else if (pageId === "outfits") {
    loadUserOutfits()
  }
}

// Event listeners for navigation
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const pageId = this.getAttribute("data-page")
      showPage(pageId)
    })
  })

  // Load initial content
  loadTrendingLooks()
  loadUserOutfits()

  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
  }
})

// Trending Looks Data
const trendingLooks = [
  {
    id: 1,
    title: "Look Casual Urbano",
    style: "Urban",
    likes: 234,
    views: 1200,
    emoji: "👕",
  },
  {
    id: 2,
    title: "Elegante Nocturno",
    style: "Formal",
    likes: 189,
    views: 890,
    emoji: "👗",
  },
  {
    id: 3,
    title: "Deportivo Cómodo",
    style: "Sport",
    likes: 156,
    views: 670,
    emoji: "👟",
  },
  {
    id: 4,
    title: "Boho Chic",
    style: "Boho",
    likes: 298,
    views: 1450,
    emoji: "🌸",
  },
  {
    id: 5,
    title: "Minimalista Clean",
    style: "Minimal",
    likes: 167,
    views: 780,
    emoji: "🤍",
  },
  {
    id: 6,
    title: "Street Style",
    style: "Urban",
    likes: 203,
    views: 920,
    emoji: "🧢",
  },
]

function loadTrendingLooks() {
  const grid = document.getElementById("trendingGrid")
  grid.innerHTML = ""

  trendingLooks.forEach((look) => {
    const card = document.createElement("div")
    card.className = "trending-card"
    card.innerHTML = `
            <div class="trending-image">${look.emoji}</div>
            <div class="trending-content">
                <div class="trending-title">${look.title}</div>
                <div class="trending-stats">
                    <span>❤️ ${look.likes}</span>
                    <span>👁️ ${look.views}</span>
                    <span>🏷️ ${look.style}</span>
                </div>
                <button class="shop-btn" onclick="shopLook(${look.id})">
                    🛍️ Shop the Look
                </button>
            </div>
        `
    grid.appendChild(card)
  })
}

// User Outfits Data
const userOutfits = [
  {
    id: 1,
    name: "Mi Look Favorito",
    date: "2024-01-15",
    style: "Casual",
    emoji: "💙",
  },
  {
    id: 2,
    name: "Outfit de Trabajo",
    date: "2024-01-14",
    style: "Formal",
    emoji: "💼",
  },
  {
    id: 3,
    name: "Look de Fin de Semana",
    date: "2024-01-13",
    style: "Casual",
    emoji: "🌟",
  },
  {
    id: 4,
    name: "Outfit de Fiesta",
    date: "2024-01-12",
    style: "Party",
    emoji: "✨",
  },
]

function loadUserOutfits() {
  const grid = document.getElementById("outfitsGrid")
  grid.innerHTML = ""

  userOutfits.forEach((outfit) => {
    const card = document.createElement("div")
    card.className = "outfit-card"
    card.innerHTML = `
            <div class="outfit-image">${outfit.emoji}</div>
            <div class="outfit-info">
                <h3>${outfit.name}</h3>
                <p>Estilo: ${outfit.style}</p>
                <p>Fecha: ${outfit.date}</p>
            </div>
        `
    grid.appendChild(card)
  })
}

// Generate Outfit
function generateOutfit() {
  const occasion = document.getElementById("occasion").value
  const style = document.getElementById("style").value

  const outfits = {
    casual: {
      minimalist: { emoji: "👕", desc: "Camiseta blanca + jeans + sneakers" },
      urban: { emoji: "🧥", desc: "Hoodie + joggers + zapatillas urbanas" },
      boho: { emoji: "🌻", desc: "Blusa fluida + pantalón palazzo + sandalias" },
      classic: { emoji: "👔", desc: "Camisa + chinos + mocasines" },
    },
    formal: {
      minimalist: { emoji: "🖤", desc: "Traje negro + camisa blanca + zapatos oxford" },
      urban: { emoji: "💼", desc: "Blazer + jeans oscuros + botines" },
      boho: { emoji: "🌙", desc: "Vestido midi + kimono + tacones bajos" },
      classic: { emoji: "👗", desc: "Vestido clásico + blazer + tacones" },
    },
    sport: {
      minimalist: { emoji: "🏃", desc: "Top deportivo + leggings + running shoes" },
      urban: { emoji: "🏀", desc: "Jersey + shorts + sneakers altos" },
      boho: { emoji: "🧘", desc: "Top crop + yoga pants + zapatillas" },
      classic: { emoji: "⚽", desc: "Polo deportivo + shorts + tenis blancos" },
    },
    party: {
      minimalist: { emoji: "✨", desc: "Vestido negro + tacones + clutch" },
      urban: { emoji: "🎉", desc: "Crop top + falda + botas + chaqueta" },
      boho: { emoji: "🌟", desc: "Vestido largo + sandalias + accesorios" },
      classic: { emoji: "💎", desc: "Vestido elegante + tacones + joyería" },
    },
  }

  const outfit = outfits[occasion][style]
  const resultDiv = document.getElementById("generatedOutfit")

  resultDiv.innerHTML = `
        <h3>¡Tu Outfit Perfecto! ✨</h3>
        <div style="font-size: 4rem; margin: 1rem 0;">${outfit.emoji}</div>
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">${outfit.desc}</p>
        <button class="action-btn" onclick="saveOutfit('${outfit.desc}', '${style}')">
            💾 Guardar Outfit
        </button>
    `
}

// Weather Outfit
function showWeatherOutfit() {
  const weather = ["☀️ Soleado", "🌧️ Lluvioso", "❄️ Frío", "🌤️ Nublado"][Math.floor(Math.random() * 4)]
  const outfits = {
    "☀️ Soleado": "👕 Camiseta + shorts + gafas de sol",
    "🌧️ Lluvioso": "🧥 Impermeable + botas + paraguas",
    "❄️ Frío": "🧣 Abrigo + bufanda + botas",
    "🌤️ Nublado": "👔 Camisa + pantalón + chaqueta ligera",
  }

  alert(`Clima: ${weather}\nOutfit recomendado: ${outfits[weather]}`)
}

// Style Analysis
function showStyleAnalysis() {
  const styles = ["Minimalista", "Urbano", "Boho", "Clásico"]
  const dominant = styles[Math.floor(Math.random() * styles.length)]

  alert(
    `📊 Tu estilo dominante es: ${dominant}\n\n✨ Recomendación: Experimenta más con colores vibrantes para diversificar tu guardarropa.`,
  )
}

// Shop Look
function shopLook(lookId) {
  const look = trendingLooks.find((l) => l.id === lookId)
  alert(`🛍️ Comprando "${look.title}"\n\n¡Pronto podrás comprar este look completo en nuestras tiendas afiliadas!`)
}

// Save Outfit
function saveOutfit(description, style) {
  const newOutfit = {
    id: userOutfits.length + 1,
    name: `Outfit ${style}`,
    date: new Date().toISOString().split("T")[0],
    style: style,
    emoji: ["💙", "💚", "💜", "🧡", "💛"][Math.floor(Math.random() * 5)],
  }

  userOutfits.push(newOutfit)
  alert("✅ ¡Outfit guardado exitosamente!")

  if (document.getElementById("outfits").classList.contains("active")) {
    loadUserOutfits()
  }
}
