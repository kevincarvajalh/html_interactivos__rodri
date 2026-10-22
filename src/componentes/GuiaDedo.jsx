import { useEffect, useState } from 'react'
import './guia.css'

// Mide dónde está el elemento [data-guia="x"] dentro del contenedor del simulador.
function useRect(raiz, target, clave) {
  const [r, setR] = useState(null)
  useEffect(() => {
    const medir = () => {
      const cont = raiz.current
      const el = cont?.querySelector(`[data-guia="${target}"]`)
      if (!cont || !el) return setR(null)
      const a = cont.getBoundingClientRect()
      const b = el.getBoundingClientRect()
      setR({ x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height, W: a.width, H: a.height })
    }
    setR(null)
    const t1 = setTimeout(medir, 80)
    const t2 = setTimeout(medir, 450)
    window.addEventListener('resize', medir)
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', medir) }
  }, [raiz, target, clave])
  return r
}

function Flecha({ abajo }) {
  return (
    <svg className={`gd-flecha ${abajo ? 'abajo' : ''}`} width="30" height="42" viewBox="0 0 30 42" aria-hidden="true">
      <path d="M15 2 28 19H20V40H10V19H2Z" fill="#43B649" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

// Aro con pulso + flecha + número de paso. Va DENTRO del contenedor del simulador (position: relative).
export function GuiaOverlay({ raiz, paso, clave, numero, onRect }) {
  const r = useRect(raiz, paso.target, clave)
  useEffect(() => { onRect?.(r) }, [r, onRect])
  if (!r) return <div className="gd" aria-hidden="true" />
  const arriba = r.y + r.h + 54 > r.H // si no cabe debajo, la flecha llega desde arriba
  const flechaX = Math.min(Math.max(r.x + r.w / 2 - 15, 4), r.W - 34)
  return (
    <div className="gd" aria-hidden="true">
      <div className="gd-aro" style={{ left: r.x - 5, top: r.y - 5, width: r.w + 10, height: r.h + 10 }}>
        <span className="gd-num">{numero}</span>
      </div>
      <span className="gd-flecha-caja" style={{ left: flechaX, top: arriba ? r.y - 50 : r.y + r.h + 2 }}>
        <Flecha abajo={arriba} />
      </span>
    </div>
  )
}

// Burbuja con la explicación. En el celular flota dentro del marco; en computador va debajo.
export function GuiaBurbuja({ paso, i, total, flotante, abajo, onSig, onAnt, onSaltar, textoFin = 'Ir a la práctica' }) {
  const ultimo = i === total - 1
  return (
    <div className={`gd-burbuja ${flotante ? `flota ${abajo ? 'b' : 'a'}` : ''}`} role="status">
      <div className="gd-cab">
        <span className="gd-badge">{i + 1}</span>
        <span className="gd-paso">Paso {i + 1} de {total}</span>
        <span className="gd-barra"><i style={{ width: `${((i + 1) / total) * 100}%` }} /></span>
      </div>
      <p>{paso.texto}</p>
      <div className="gd-btns">
        {i > 0 && <button type="button" className="gd-sec" onClick={onAnt}>Atrás</button>}
        <button type="button" className="gd-pri" onClick={onSig}>{ultimo ? textoFin : 'Siguiente'}</button>
      </div>
      {!ultimo && <button type="button" className="gd-saltar" onClick={onSaltar}>Saltar guía</button>}
    </div>
  )
}
