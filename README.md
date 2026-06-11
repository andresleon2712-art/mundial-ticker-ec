# 🏆 Ticker Mundial 2026 — El Colombiano

Ticker de una línea con scroll infinito para el home de elcolombiano.com.
Muestra partidos en vivo, resultados y próximos partidos del Mundial 2026.

---

## ⚙️ Configuración inicial (10 minutos)

### 1. Crear el repositorio en GitHub
- Ve a github.com con tu cuenta `andresleon2712-art`
- Crea un nuevo repositorio llamado: `mundial-ticker-ec`
- Márcalo como **público** (necesario para GitHub Pages)
- Sube todos los archivos de esta carpeta

### 2. Obtener la API key de football-data.org
- Ve a https://www.football-data.org/client/register
- Regístrate con tu correo personal
- Copia el **API token** que aparece en tu dashboard

### 3. Guardar la API key como secret en GitHub
- En tu repo → **Settings** → **Secrets and variables** → **Actions**
- Clic en **New repository secret**
- Nombre: `FOOTBALL_API_KEY`
- Valor: pega tu token de football-data.org
- Guardar

### 4. Activar GitHub Pages
- En tu repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` / carpeta: `/public`
- Guardar

Tras unos segundos, el ticker estará disponible en:
`https://andresleon2712-art.github.io/mundial-ticker-ec/ticker.html`

Y los datos en:
`https://andresleon2712-art.github.io/mundial-ticker-ec/data.json`

### 5. Activar el workflow de Actions
- Ve a la pestaña **Actions** del repo
- Acepta activar los workflows si te lo pide
- El cron corre automáticamente cada minuto

---

## 🖥️ Embeber en El Colombiano

Pega este código donde quieras el ticker (idealmente justo debajo del navbar):

```html
<iframe
  src="https://andresleon2712-art.github.io/mundial-ticker-ec/ticker.html"
  width="100%"
  height="44"
  frameborder="0"
  scrolling="no"
  style="display:block; border:none; overflow:hidden;"
></iframe>
```

---

## 📁 Estructura del proyecto

```
mundial-ticker-ec/
├── .github/
│   └── workflows/
│       └── update-data.yml   ← cron job de GitHub Actions
├── public/
│   ├── ticker.html           ← el ticker embebible
│   └── data.json             ← datos generados automáticamente
├── fetch-data.js             ← script que llama a football-data.org
└── README.md
```

---

## 🎨 Personalización

En `ticker.html` puedes ajustar:
- `speed` (línea ~180): velocidad del scroll en px/segundo. Más alto = más rápido
- `CHANNELS_COLOMBIA`: canales donde se ve cada partido
- `REFRESH_MS`: cada cuánto refresca los datos (default: 60 segundos)
- Colores en el `<style>`: `#D20A11` es el rojo de El Colombiano

---

## ⚠️ Límites del plan gratuito

- football-data.org free tier: **10 llamadas/minuto**
- El cron de GitHub Actions corre 1 llamada cada minuto = sin problema
- Durante el Mundial (Jun 11 – Jul 19): el cron corre 24/7 automáticamente
