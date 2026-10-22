import { motion } from 'framer-motion'
import { Check, Lock, ChevronRight, Clock, ArrowRight, Layers, PartyPopper } from 'lucide-react'
import { DIAS } from '../datos/index.js'
import { estadoModulo, moduloActual, textoDesbloqueo, enlace } from '../progreso.js'
import './inicio.css'

const lista = { oculto: {}, visible: { transition: { staggerChildren: 0.06 } } }
const item = { oculto: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

function Nodos({ prog, actual }) {
  return (
    <div className="nodos" role="img" aria-label={`${prog.completos.length} de 7 módulos completados`}>
      {DIAS.map((d, i) => {
        const hecho = prog.completos.includes(d.n)
        return (
          <div key={d.n} className="nodos-par">
            <span className={`nodo ${hecho ? 'ok' : d.n === actual ? 'hoy' : ''}`}>{hecho ? <Check size={14} /> : d.n}</span>
            {i < DIAS.length - 1 && <span className={`nodos-linea ${hecho ? 'ok' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}

function Hoy({ prog, actual }) {
  if (actual) {
    const d = DIAS[actual - 1]
    const intro = d.pasos.find((p) => p.tipo === 'intro')
    return (
      <motion.div className="leccion-hoy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <span className="tag">Tu lección de hoy</span>
        <h2>Módulo {d.n}: {d.tema}</h2>
        <p>{intro?.objetivo || d.lema}</p>
        <div className="hoy-meta"><span><Clock size={15} /> {d.minutos} min</span><span><Layers size={15} /> {d.pasos.length} pasos</span></div>
        {intro && (
          <ul className="hoy-lista">
            {intro.aprenderas.map((a) => <li key={a}><Check size={16} />{a}</li>)}
          </ul>
        )}
        <motion.a className="btn" href={enlace(d.n)} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
          {prog.completos.includes(d.n) ? 'Repasar módulo' : 'Comenzar lección'} <ArrowRight size={18} />
        </motion.a>
      </motion.div>
    )
  }
  if (prog.completos.length === DIAS.length) {
    return (
      <div className="leccion-hoy">
        <span className="tag">Ruta completada</span>
        <h2><PartyPopper size={24} style={{ verticalAlign: -4 }} /> Completaste los 7 módulos</h2>
        <p>Puedes repasar cualquier módulo cuando quieras.</p>
      </div>
    )
  }
  const sig = DIAS.find((d) => estadoModulo(d.n, prog).estado === 'bloqueado')
  const e = sig ? estadoModulo(sig.n, prog) : null
  return (
    <div className="leccion-hoy bloqueada">
      <span className="tag">Tu próxima lección</span>
      <h2><Lock size={22} style={{ verticalAlign: -3 }} /> Módulo {sig?.n}: {sig?.tema}</h2>
      <p>{e?.desbloqueo ? `Se desbloquea ${textoDesbloqueo(e.desbloqueo)}.` : 'Completa el módulo anterior para desbloquearlo.'} Un módulo por día te permite asimilar cada tema con calma.</p>
    </div>
  )
}

export default function Inicio({ prog }) {
  const actual = moduloActual(prog)
  return (
    <>
      <div className="hero">
        <span className="tag">Ruta AHA · 7 módulos</span>
        <h1>Aprende a operar practicando.</h1>
        <p>Un módulo por día. Cada uno se desbloquea al completar el anterior, para que avances sin saturarte.</p>
        <Nodos prog={prog} actual={actual} />
        <b className="hero-cuenta">{prog.completos.length} de 7 módulos completados</b>
      </div>

      <Hoy prog={prog} actual={actual} />

      <h3 className="sub">Todos los módulos</h3>
      <motion.div className="mods" variants={lista} initial="oculto" animate="visible">
        {DIAS.map((d) => {
          const e = estadoModulo(d.n, prog)
          const hecho = e.estado === 'completo'
          const bloq = e.estado === 'bloqueado'
          const cuerpo = (
            <>
              <span className="mod-num">{hecho ? <Check size={20} /> : bloq ? <Lock size={18} /> : d.n}</span>
              <span className="mod-txt">
                <span className="t">{d.tema}</span>
                <span className="suave">
                  {bloq
                    ? e.motivo === 'dia' ? `Se desbloquea ${textoDesbloqueo(e.desbloqueo)}` : `Completa el módulo ${e.previo}`
                    : `${d.minutos} min · ${d.lema}`}
                </span>
              </span>
              {!bloq && <ChevronRight size={20} color="var(--verde)" />}
            </>
          )
          return (
            <motion.div key={d.n} variants={item}>
              {bloq ? (
                <div className="mod bloq" aria-disabled="true">{cuerpo}</div>
              ) : (
                <a href={enlace(d.n)} className={`mod ${hecho ? 'hecho' : ''} ${d.n === actual ? 'actual' : ''}`}>{cuerpo}</a>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </>
  )
}
