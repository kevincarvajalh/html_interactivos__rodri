# Ruta AHA · 7 módulos (HTML interactivos) — Capitaria

Recorrido educativo para clientes nuevos de **MetaTrader 5**. Cada módulo enseña una sola idea: objetivo → conceptos → práctica guiada en un **simulador de MetaTrader** (versión **celular** y **computador**, con guías paso a paso) → quiz → resumen → tarea opcional.

**Sitio publicado (versión estática):** https://kevincarvajalh.github.io/html_interactivos__rodri/
Vista con todos los módulos desbloqueados: agregar `?preview=1` (por ejemplo `.../dia-2.html?preview=1`).

## Cómo correr el proyecto
Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # http://127.0.0.1:5174  (agrega ?preview=1 para desbloquear todo)
npm run build      # genera dist/ (index.html + dia-1.html … dia-7.html)
```

La app es **multipágina de Vite**: `index.html` (inicio) y `dia-1.html … dia-7.html`. Cada página declara su módulo en `window.__DIA__` y monta el mismo `App`.

## Estructura
```
src/
  main.jsx · App.jsx            arranque, tema claro/oscuro, rutas de pantalla (inicio / módulo / bloqueado / completado)
  progreso.js · almacen.js      desbloqueo por día + persistencia en localStorage (try/catch)
  motor.js                      motor del simulador MT5 (precios ficticios, órdenes, margen, swap, SL/TP, pendientes)
  datos/dia1.js … dia7.js       contenido de cada módulo (textos, quiz, objetivos de práctica, tarea)
  datos/guias.js                contenido de las guías paso a paso (celular y computador)
  componentes/
    DiaPagina.jsx               flujo de un módulo (intro, lección, práctica, quiz, resumen, tarea)
    Inicio.jsx                  inicio: nodos de avance, "Tu lección de hoy", lista de módulos
    SimuladorMT5.jsx            simulador versión CELULAR (+ mt5.css)
    SimuladorEscritorio.jsx     simulador versión COMPUTADOR (+ pc.css)
    GuiaDedo.jsx                guía: aro + flecha + burbuja (+ guia.css)
    Widgets.jsx                 calculadoras: pip, volumen, "mi cuenta en vivo" (+ widgets.css)
    Quiz.jsx · Texto.jsx · Visuales.jsx · Progreso.jsx
docs/                           versión estática ya compilada (la que sirve GitHub Pages)
```

## Reglas de negocio
- **Desbloqueo:** el módulo 1 está libre; el módulo N se abre al completar el N-1 y pasar al menos un día calendario (`src/progreso.js`). El progreso se guarda en el navegador de cada persona.
- **Volumen mínimo por activo:** 0.1 en divisas, oro e índices; 0.01 en BTCUSD (`src/motor.js`).
- **Tareas siempre opcionales**, sin metas visibles de "operar X días". Avisos de riesgo en el pie de cada página.
- Tema blanco por defecto (oscuro opcional). Tipografía Barlow; verde de marca `#43B649`.

> Contenido educativo, no constituye asesoría ni recomendación de inversión. Los precios del simulador son ficticios.
