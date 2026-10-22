import { leer, guardar } from './almacen.js'

// Reglas de desbloqueo:
//  · El módulo 1 está disponible desde el inicio.
//  · El módulo N se desbloquea cuando el N-1 está completo Y ya pasó al menos un día calendario desde esa fecha.
//  · Con ?preview en la URL (uso interno del equipo) todos los módulos quedan disponibles.
const CLAVE = 'aha7_progreso'

const iso = (f) => `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`
export const hoyISO = () => iso(new Date())
export const sumarDia = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return iso(new Date(y, m - 1, d + 1))
}
export const esVistaPrevia = () => new URLSearchParams(window.location.search).has('preview')

export function cargar() {
  const p = leer(CLAVE, {})
  return { completos: p.completos || [], operados: p.operados || [], fechas: p.fechas || {} }
}
export const guardarProgreso = (p) => guardar(CLAVE, p)

export function estadoModulo(n, prog, hoy = hoyISO()) {
  if (prog.completos.includes(n)) return { estado: 'completo' }
  if (esVistaPrevia() || n === 1) return { estado: 'disponible' }
  if (!prog.completos.includes(n - 1)) return { estado: 'bloqueado', motivo: 'previo', previo: n - 1 }
  const f = prog.fechas[n - 1]
  if (f && f >= hoy) return { estado: 'bloqueado', motivo: 'dia', desbloqueo: sumarDia(f) }
  return { estado: 'disponible' }
}

// Primer módulo disponible y aún no completado (0 si no hay)
export function moduloActual(prog, total = 7) {
  for (let n = 1; n <= total; n++) {
    const e = estadoModulo(n, prog).estado
    if (e === 'disponible') return n
  }
  return 0
}

export function textoDesbloqueo(isoFecha, hoy = hoyISO()) {
  if (isoFecha === sumarDia(hoy)) return 'mañana'
  const [, m, d] = isoFecha.split('-')
  return `el ${d}/${m}`
}

// Enlaces entre páginas (conservan ?preview)
export const enlace = (n) => `${n ? `./dia-${n}.html` : './index.html'}${esVistaPrevia() ? '?preview=1' : ''}`
