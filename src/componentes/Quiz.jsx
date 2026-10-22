import { useState } from 'react'

// Una pregunta a la vez. Sin "incorrecto": el feedback invita a intentar de nuevo.
export default function Quiz({ preguntas, onTerminar }) {
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [intento, setIntento] = useState(false)
  const q = preguntas[i]
  const acertada = elegida === q.correcta

  const elegir = (k) => {
    if (acertada) return
    setElegida(k)
    setIntento(k !== q.correcta)
  }
  const seguir = () => {
    if (i + 1 < preguntas.length) { setI(i + 1); setElegida(null); setIntento(false) } else onTerminar()
  }

  return (
    <>
      <div className="tarjeta">
        <span className="tag">Pregunta {i + 1} de {preguntas.length}</span>
        <h2>{q.pregunta}</h2>
        {q.opciones.map((o, k) => (
          <button key={k} type="button" className={`opcion ${acertada && k === q.correcta ? 'bien' : ''} ${elegida === k && !acertada ? 'mal' : ''}`} onClick={() => elegir(k)}>{o}</button>
        ))}
        {acertada && <div className="nota" role="status">✓ {q.explicacion}</div>}
        {intento && <div className="nota" role="status">Esa no es la respuesta correcta. Revisa e inténtalo de nuevo.</div>}
      </div>
      <button type="button" className="btn" disabled={!acertada} onClick={seguir}>
        {i + 1 < preguntas.length ? 'Siguiente pregunta' : 'Continuar'}
      </button>
    </>
  )
}
