// Persistencia ligera: siempre en try/catch (localStorage puede no estar disponible)
export function leer(clave, defecto) {
  try {
    const v = localStorage.getItem(clave)
    return v ? JSON.parse(v) : defecto
  } catch {
    return defecto
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* sin almacenamiento: la página sigue funcionando */
  }
}
