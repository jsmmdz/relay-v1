# RELAY — Personas Ayudando Personas

Frontend de RELAY: intercambio de favores para comunidades cerradas.
Estética Y2K líquida (blobs de gel, caritas infladas, botones píldora) con
tipografía **Unbounded** + **Inter**.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Stack

- **Vite + React** (front-only, sin backend)
- **React Router** — 6 vistas: Home, Marketplace, Misión, Pedir favor, En progreso, Impacto
- **Framer Motion** — animaciones de entrada, hover y fases
- **localStorage** — los favores publicados/aceptados persisten entre sesiones

## Estructura

```
src/
  context/RelayContext.jsx   estado global de favores (publicar, aceptar, fases, chat)
  data/seed.js               favores semilla y constantes
  components/                Navbar, Smiley (mascota), LiquidBlob, FavorBubble, PhaseBar
  pages/                     Home, Marketplace, FavorDetail, PedirFavor, EnProgreso, Impacto
  styles/global.css          paleta, píldoras, blobs, prefers-reduced-motion
```

## Notas de comportamiento

- **Pedir favor**: valida categoría + descripción; "Generar con IA" (simulado) solo
  redacta la idea que el usuario escribió, nunca inventa datos.
- **Marketplace**: filtros por distancia/dificultad/duración, búsqueda libre y
  propiedades; estados vacíos con CTA para limpiar filtros o pedir el primer favor.
- **En progreso**: fases Aceptado → Coordinando → En curso → Finalizado, chat privado
  simulado, reprogramar/cancelar/completar (cancelar devuelve el favor al Marketplace).
- **Impacto**: métricas base simuladas + actividad real de la sesión.
- En **Impacto** hay un botón discreto "↺ Reiniciar demo" que restaura los datos semilla.
- Las animaciones respetan `prefers-reduced-motion`.
