import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// base './' para poder subir la carpeta dist a cualquier ruta del hosting.
// Páginas: index.html (inicio) + dia-1.html ... dia-7.html
const paginas = { index: resolve(import.meta.dirname, 'index.html') }
for (let n = 1; n <= 7; n++) paginas[`dia-${n}`] = resolve(import.meta.dirname, `dia-${n}.html`)

export default defineConfig({ base: './', plugins: [react()], build: { rollupOptions: { input: paginas } } })
