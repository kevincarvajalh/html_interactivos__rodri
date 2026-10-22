import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft, ArrowRight, Check, Monitor, MousePointerClick, ShieldCheck, Clock, Scale, Heart,
  Flag, Wind, BookOpen, Target, Sparkles, Home, Smartphone, Play, Ruler, Wallet, Calculator, Globe, Gauge, Lock,
} from 'lucide-react'
import Texto from './Texto.jsx'
import Visual from './Visuales.jsx'
import Widget from './Widgets.jsx'
import Quiz from './Quiz.jsx'
import SimuladorMT5 from './SimuladorMT5.jsx'
import SimuladorEscritorio from './SimuladorEscritorio.jsx'
import { DIAS } from '../datos/index.js'
import { armarGuia } from '../datos/guias.js'
import { leer, guardar } from '../almacen.js'
import { PasosBarra, ProgresoSemana, AvisoRiesgo } from './Progreso.jsx'
import './inicio.css'

const ICONOS = { monitor: Monitor, click: MousePointerClick, escudo: ShieldCheck, reloj: Clock, balanza: Scale, corazon: Heart, bandera: Flag, viento: Wind, libro: BookOpen, meta: Target, chispa: Sparkles, regla: Ruler, cartera: Wallet, calculadora: Calculator, globo: Globe, medidor: Gauge }

function Caja({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {children}
    </motion.div>
  )
}

// Lista con check que aparece escalonada
function ListaCheck({ titulo, items }) {
  return (
    <div className="lista-check">
      <h3>{titulo}</h3>
      <ul style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((t, k) => (
          <motion.li key={t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.1 }}>
            <span className="ic"><Check size={14} /></span>{t}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function Intro({ paso, datos, resumen, siguiente }) {
  return (
    <>
      <div className="tarjeta intro">
        <span className="tag">Módulo {datos.n} de 7 · {datos.minutos} min</span>
        <h2>{datos.tema}</h2>
        <p className="objetivo">{paso.objetivo}</p>
        <ListaCheck titulo="Al terminar sabrás" items={paso.aprenderas} />
        <div className="ruta-mini" aria-label="Contenido del módulo">
          {resumen.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
      <button className="btn" onClick={siguiente}>Comenzar <ArrowRight size={18} /></button>
    </>
  )
}

function Leccion({ paso, siguiente, etiqueta }) {
  const Ico = ICONOS[paso.icono] || BookOpen
  return (
    <>
      <div className="tarjeta">
        <div className="icono"><Ico size={28} /></div>
        {etiqueta && <span className="tag">{etiqueta}</span>}
        <h2>{paso.titulo}</h2>
        <Texto>{paso.texto}</Texto>
        {paso.visual && <Visual tipo={paso.visual} />}
        {paso.widget && <Widget tipo={paso.widget} />}
      </div>
      <button className="btn" onClick={siguiente}>Continuar <ArrowRight size={18} /></button>
    </>
  )
}

function Resumen({ paso, datos, siguiente }) {
  const prox = DIAS[datos.n]
  return (
    <>
      <div className="tarjeta">
        <span className="tag">Resumen del módulo</span>
        <h2>Lo que aprendiste hoy</h2>
        <ListaCheck titulo="Ideas clave" items={paso.aprendiste} />
        <div className="calma-box"><Wind size={22} /><div><b>Mente tranquila</b><p>{paso.calma}</p></div></div>
        {prox && <div className="proximo"><Lock size={18} /><span>Próximo módulo: <b>{prox.tema}</b>. Se desbloquea mañana.</span></div>}
      </div>
      <button className="btn" onClick={siguiente}>Continuar <ArrowRight size={18} /></button>
    </>
  )
}

function Practica({ paso, siguiente }) {
  const [disp, setDisp] = useState(() => leer('aha7_disp', window.matchMedia?.('(max-width: 700px)').matches ? 'movil' : 'escritorio'))
  const [modo, setModo] = useState(paso.guia?.length ? 'guia' : 'practica')
  const [listo, setListo] = useState(false)
  const alCompletar = useCallback(() => {
    setListo(true)
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 }, colors: ['#43B649', '#34A773', '#FFFFFF'] })
  }, [])
  const alFinGuia = useCallback(() => setModo('practica'), [])
  const cambiarDisp = (d) => { setDisp(d); guardar('aha7_disp', d); setListo(false) }
  const Sim = disp === 'movil' ? SimuladorMT5 : SimuladorEscritorio
  const tour = armarGuia(disp, paso.guia)
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="tag">{modo === 'guia' ? 'Guía paso a paso' : 'Práctica'}</span>
        <h2>{paso.titulo}</h2>
        <p>{modo === 'guia' ? 'Sigue las indicaciones. Pulsa "Siguiente" cuando estés listo.' : paso.intro}</p>
      </div>
      <div className="selector" role="group" aria-label="Elige tu plataforma">
        <button type="button" className={disp === 'movil' ? 'on' : ''} onClick={() => cambiarDisp('movil')}><Smartphone size={18} /> Celular</button>
        <button type="button" className={disp === 'escritorio' ? 'on' : ''} onClick={() => cambiarDisp('escritorio')}><Monitor size={18} /> Computador</button>
      </div>
      {paso.guia?.length > 0 && (
        <div className="selector" role="group" aria-label="Modo">
          <button type="button" className={modo === 'guia' ? 'on' : ''} onClick={() => { setModo('guia'); setListo(false) }}><Play size={17} /> Ver guía</button>
          <button type="button" className={modo === 'practica' ? 'on' : ''} onClick={() => setModo('practica')}><MousePointerClick size={17} /> Practicar</button>
        </div>
      )}
      <Sim key={`${disp}-${modo}`} objetivos={paso.objetivos} funciones={paso.funciones} modo={modo} tour={tour} onFinGuia={alFinGuia} onCompleto={alCompletar} />
      {listo && paso.aha && (
        <div className="aha" role="status">
          <span className="tag">Momento AHA</span>
          <p>{paso.aha}</p>
        </div>
      )}
      <button className="btn" disabled={!listo && modo !== 'guia'} onClick={siguiente}>{listo || modo === 'guia' ? 'Continuar' : 'Completa los pasos para continuar'} {(listo || modo === 'guia') && <ArrowRight size={18} />}</button>
      {!listo && modo === 'practica' && <button className="suave" style={{ background: 'none', border: 0, textDecoration: 'underline' }} onClick={siguiente}>Saltar práctica</button>}
    </>
  )
}

function Reto({ paso, terminar }) {
  const [marcas, setMarcas] = useState({})
  const items = paso.checklist.map((c) => (typeof c === 'string' ? { t: c } : c))
  // Registro interno silencioso (no se muestra al cliente): si marcó abrir o cerrar en su plataforma
  const operado = items.some((c, i) => c.cuenta && marcas[i])
  return (
    <>
      <div className="tarjeta" style={{ border: '1px solid var(--verde)' }}>
        <div className="icono"><Flag size={28} /></div>
        <span className="tag">Para seguir practicando</span>
        <h2>{paso.titulo}</h2>
        <Texto>{paso.texto}</Texto>
        {items.map((c, i) => (
          <button key={i} type="button" className={`check ${marcas[i] ? 'ok' : ''}`} onClick={() => setMarcas((m) => ({ ...m, [i]: !m[i] }))}>
            <span className="caja">{marcas[i] && <Check size={18} />}</span>{c.t}
          </button>
        ))}
      </div>
      <button className="btn" onClick={() => terminar(operado)}>Finalizar módulo <Check size={18} /></button>
      <p className="suave" style={{ textAlign: 'center' }}>Es opcional: puedes realizarla cuando quieras y marcar lo que hayas hecho.</p>
    </>
  )
}

export default function DiaPagina({ dia, datos, hechos, alTerminar, alVolver }) {
  const [i, setI] = useState(0)
  const pasos = datos.pasos
  const paso = pasos[i]
  const ir = (n) => setI(Math.max(0, Math.min(pasos.length - 1, n)))
  const siguiente = () => ir(i + 1)

  const conceptos = pasos.filter((p) => p.tipo === 'leccion' || p.tipo === 'calma')
  const idxConcepto = conceptos.indexOf(paso)
  const etiqueta = idxConcepto >= 0 ? `Concepto ${idxConcepto + 1} de ${conceptos.length}` : undefined
  const contenido = [
    `${conceptos.length} ${conceptos.length === 1 ? 'concepto' : 'conceptos'}`,
    ...(pasos.some((p) => p.tipo === 'simulador') ? ['1 práctica guiada'] : []),
    ...(pasos.some((p) => p.tipo === 'quiz') ? ['Quiz breve'] : []),
  ]

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="chip" onClick={alVolver}><Home size={14} /> Inicio</button>
          <ProgresoSemana dia={dia} hechos={hechos} />
        </div>
        <PasosBarra total={pasos.length} actual={i} />
        <span className="suave">Módulo {dia} de 7 · {datos.tema} · Paso {i + 1} de {pasos.length}</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <Caja key={i}>
          {paso.tipo === 'intro' && <Intro paso={paso} datos={datos} resumen={contenido} siguiente={siguiente} />}
          {paso.tipo === 'leccion' && <Leccion paso={paso} siguiente={siguiente} etiqueta={etiqueta} />}
          {paso.tipo === 'calma' && <Leccion paso={{ ...paso, icono: paso.icono || 'viento' }} siguiente={siguiente} etiqueta="Mente tranquila" />}
          {paso.tipo === 'simulador' && <Practica paso={paso} siguiente={siguiente} />}
          {paso.tipo === 'quiz' && <Quiz preguntas={paso.preguntas} onTerminar={siguiente} />}
          {paso.tipo === 'resumen' && <Resumen paso={paso} datos={datos} siguiente={siguiente} />}
          {paso.tipo === 'reto' && <Reto paso={paso} terminar={(operado) => alTerminar(dia, operado)} />}
        </Caja>
      </AnimatePresence>

      {i > 0 && (
        <button className="btn btn-sec" style={{ minHeight: 48 }} onClick={() => ir(i - 1)}><ArrowLeft size={16} /> Paso anterior</button>
      )}
      <AvisoRiesgo />
    </>
  )
}
