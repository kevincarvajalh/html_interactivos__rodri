import { useState } from 'react'

// Mini formato de contenido:
//   párrafos separados por línea en blanco · "- " = viñeta · **negrita** · {{término|definición}} = glosario (toca para ver)
function Linea({ texto, onGlosario }) {
  const partes = texto.split(/(\*\*(?:[^*]|\*(?!\*))+\*\*|\{\{[^}]+\}\})/g).filter(Boolean)
  return partes.map((p, i) => {
    if (p.startsWith('**')) return <strong key={i}><Linea texto={p.slice(2, -2)} onGlosario={onGlosario} /></strong>
    if (p.startsWith('{{')) {
      const [t, d] = p.slice(2, -2).split('|')
      return <button key={i} type="button" className="glo" onClick={() => onGlosario({ t, d })}>{t}</button>
    }
    return <span key={i}>{p}</span>
  })
}

function Bloque({ bloque }) {
  const [glo, setGlo] = useState(null)
  const alternar = (g) => setGlo((a) => (a && a.t === g.t ? null : g))
  const lineas = bloque.split('\n')
  const esLista = lineas.every((l) => l.startsWith('- '))
  return (
    <>
      {esLista ? (
        <ul>{lineas.map((l, i) => <li key={i}><span><Linea texto={l.slice(2)} onGlosario={alternar} /></span></li>)}</ul>
      ) : (
        <p><Linea texto={bloque} onGlosario={alternar} /></p>
      )}
      {glo && <div className="glo-caja" role="note"><b>{glo.t}:</b> {glo.d}</div>}
    </>
  )
}

export default function Texto({ children }) {
  return <div className="cuerpo-texto">{children.split(/\n\n+/).map((b, i) => <Bloque key={i} bloque={b.trim()} />)}</div>
}
