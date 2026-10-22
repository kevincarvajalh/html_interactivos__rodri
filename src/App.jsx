import { useEffect, useState } from 'react'
import { Moon, Sun, Lock, ArrowRight, Home } from 'lucide-react'
import confetti from 'canvas-confetti'
import { DIAS } from './datos/index.js'
import DiaPagina from './componentes/DiaPagina.jsx'
import Inicio from './componentes/Inicio.jsx'
import { leer, guardar } from './almacen.js'
import { cargar, guardarProgreso, estadoModulo, moduloActual, textoDesbloqueo, hoyISO, esVistaPrevia, enlace } from './progreso.js'
import logoBlanco from './assets/logo-capitaria-blanco.png'
import logoNegro from './assets/logo-capitaria-negro.png'

// Cada página HTML declara su módulo en window.__DIA__ (0 = inicio)
const diaDePagina = () => {
  const n = Number(window.__DIA__ || 0)
  return n >= 1 && n <= 7 ? n : 0
}

function Bloqueado({ dia, estado, prog }) {
  const actual = moduloActual(prog)
  const motivo = estado.motivo === 'dia'
    ? `Podrás acceder ${textoDesbloqueo(estado.desbloqueo)}. Un módulo por día te permite asimilar cada tema con calma.`
    : `Completa primero el módulo ${estado.previo}: ${DIAS[estado.previo - 1].tema}.`
  return (
    <div className="centro">
      <div className="icono"><Lock size={30} /></div>
      <span className="tag">Módulo {dia} · {DIAS[dia - 1].tema}</span>
      <h2>Este módulo aún no está disponible</h2>
      <p>{motivo}</p>
      <div className="btns">
        {actual > 0 && <a className="btn" href={enlace(actual)}>Ir a mi lección de hoy <ArrowRight size={18} /></a>}
        <a className="btn btn-sec" href={enlace(0)}><Home size={16} /> Volver al inicio</a>
      </div>
    </div>
  )
}

function Completado({ dia }) {
  useEffect(() => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#43B649', '#34A773', '#FFFFFF'] })
  }, [])
  const sig = DIAS[dia]
  return (
    <div className="centro" role="status">
      <svg className="check-anim" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="38" /><path d="M26 44 38 56 60 30" /></svg>
      <span className="tag">Módulo {dia} completado</span>
      <h2>{DIAS[dia - 1].tema}</h2>
      {sig ? (
        <p>{esVistaPrevia() ? `Siguiente: módulo ${sig.n}, ${sig.tema}.` : `El módulo ${sig.n}, ${sig.tema}, se desbloqueará mañana. Un módulo por día te permite asimilar cada tema con calma.`}</p>
      ) : (
        <p>Completaste los 7 módulos de la ruta. Puedes repasar cualquiera de ellos cuando quieras.</p>
      )}
      <div className="btns">
        <a className="btn" href={enlace(0)}>Volver al inicio <ArrowRight size={18} /></a>
      </div>
    </div>
  )
}

export default function App() {
  const dia = diaDePagina()
  const [tema, setTema] = useState(() => leer('aha7_tema', 'claro'))
  const [prog, setProg] = useState(cargar)
  const [fin, setFin] = useState(false)

  useEffect(() => { document.documentElement.setAttribute('data-tema', tema); guardar('aha7_tema', tema) }, [tema])

  const terminar = (n, operado) => {
    const sumar = (l, x) => (l.includes(x) ? l : [...l, x])
    const nuevo = {
      completos: sumar(prog.completos, n),
      operados: operado ? sumar(prog.operados, n) : prog.operados,
      fechas: prog.fechas[n] ? prog.fechas : { ...prog.fechas, [n]: hoyISO() }, // se conserva la fecha de la primera vez
    }
    setProg(nuevo); guardarProgreso(nuevo); setFin(true); window.scrollTo(0, 0)
  }

  const estado = dia ? estadoModulo(dia, prog) : null

  return (
    <div className="app">
      <div className="top">
        <div><img className="logo logo-b" alt="Capitaria" src={logoBlanco} /><img className="logo logo-n" alt="Capitaria" src={logoNegro} /></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {esVistaPrevia() && <span className="vista-previa">Vista previa</span>}
          <button className="chip" onClick={() => setTema(tema === 'oscuro' ? 'claro' : 'oscuro')} aria-label="Cambiar tema">
            {tema === 'oscuro' ? <Sun size={14} /> : <Moon size={14} />} {tema === 'oscuro' ? 'Claro' : 'Oscuro'}
          </button>
        </div>
      </div>

      {dia === 0 && <Inicio prog={prog} />}
      {dia > 0 && estado.estado === 'bloqueado' && <Bloqueado dia={dia} estado={estado} prog={prog} />}
      {dia > 0 && estado.estado !== 'bloqueado' && fin && <Completado dia={dia} />}
      {dia > 0 && estado.estado !== 'bloqueado' && !fin && (
        <DiaPagina key={dia} dia={dia} datos={DIAS[dia - 1]} hechos={prog.completos} alTerminar={terminar} alVolver={() => { window.location.href = enlace(0) }} />
      )}
    </div>
  )
}
