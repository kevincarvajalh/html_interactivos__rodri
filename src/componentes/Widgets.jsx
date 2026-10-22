import { useState } from 'react'
import { Minus, Plus, RotateCcw, Moon } from 'lucide-react'
import { SIMBOLOS, margenPos } from '../motor.js'
import './widgets.css'

const dinero = (n, signo = false) => `${n < 0 ? '−' : signo && n > 0 ? '+' : ''}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const unidadDe = (s, n = 1) => (s.unidad === 'pips' ? (n === 1 ? 'pip' : 'pips') : s.unidad === 'puntos' ? (n === 1 ? 'punto' : 'puntos') : n === 1 ? 'dólar' : 'dólares')

function Pills({ opciones, valor, onChange, etiqueta }) {
  return (
    <div className="wg-pills" role="group" aria-label={etiqueta}>
      {opciones.map(([k, t]) => <button key={k} type="button" className={valor === k ? 'on' : ''} onClick={() => onChange(k)}>{t}</button>)}
    </div>
  )
}

// 1) El pip (o punto): el dígito que se cuenta
export function PipVivo() {
  const [sim, setSim] = useState('EURUSD')
  const [n, setN] = useState(0)
  const s = SIMBOLOS[sim]
  const txt = (s.base + n * s.pip).toFixed(s.dec)
  const punto = txt.indexOf('.')
  const decPip = s.pip < 1 ? Math.round(-Math.log10(s.pip)) : 0
  const idx = decPip > 0 ? punto + decPip : punto - 1
  const resultado = n * s.valorPip * s.loteMin
  return (
    <div className="wg" aria-label="El pip, paso a paso">
      <Pills etiqueta="Activo" valor={sim} onChange={(k) => { setSim(k); setN(0) }}
        opciones={[['EURUSD', 'EURUSD'], ['USDJPY', 'USDJPY'], ['US30', 'US30 (índice)'], ['BTCUSD', 'BTCUSD']]} />
      <div className="wg-precio" aria-live="polite">
        {txt.split('').map((c, i) => <span key={i} className={i === idx ? 'pip' : i > idx && i > punto ? 'resto' : ''}>{c}</span>)}
      </div>
      <p className="wg-p">El dígito resaltado es <b>1 {unidadDe(s)}</b>. {s.unidad === 'puntos' ? 'En los índices el movimiento se mide en puntos.' : s.unidad === 'dólares' ? 'En Bitcoin, 1 pip es 1 dólar.' : 'Es la unidad mínima con la que se mide el movimiento del precio.'}</p>
      <div className="wg-botones">
        <button type="button" onClick={() => setN(n - 1)}><Minus size={16} /> 1 {unidadDe(s)}</button>
        <button type="button" onClick={() => setN(n + 1)}><Plus size={16} /> 1 {unidadDe(s)}</button>
        <button type="button" className="suave-btn" onClick={() => setN(0)} aria-label="Reiniciar"><RotateCcw size={16} /></button>
      </div>
      <div className="wg-linea">
        <span>Variación</span><b>{n > 0 ? '+' : ''}{n} {unidadDe(s, Math.abs(n))}</b>
      </div>
      <div className="wg-linea">
        <span>Con el volumen mínimo ({s.loteMin}), tu saldo variaría</span><b className={resultado > 0 ? 'mas' : ''}>{dinero(resultado, true)}</b>
      </div>
    </div>
  )
}

// 2) El volumen (lote): cuánto pesa cada pip
export function Calculadora() {
  const [sim, setSim] = useState('EURUSD')
  const s = SIMBOLOS[sim]
  const pasos = Math.round(1 / s.loteMin)
  const [k, setK] = useState(1)
  const [mov, setMov] = useState(20)
  const kk = Math.min(k, pasos)
  const lote = Math.round(kk * s.loteMin * 100) / 100
  const rango = s.unidad === 'dólares' ? 1000 : s.unidad === 'puntos' ? 100 : 50
  const paso = s.unidad === 'dólares' ? 10 : 1
  const movEf = Math.max(-rango, Math.min(rango, mov))
  const cambio = movEf * s.valorPip * lote
  const margen = margenPos(sim, lote, s.base)
  return (
    <div className="wg" aria-label="Calculadora de volumen">
      <Pills etiqueta="Activo" valor={sim} onChange={(x) => { setSim(x); setK(1); setMov(SIMBOLOS[x].unidad === 'dólares' ? 200 : 20) }}
        opciones={[['EURUSD', 'EURUSD'], ['USDJPY', 'USDJPY'], ['XAUUSD', 'Oro'], ['US30', 'US30'], ['BTCUSD', 'BTCUSD']]} />
      <label className="wg-campo">
        <span>Volumen (lote): <b>{lote.toFixed(2)}</b> <small>· mínimo {s.loteMin}</small></span>
        <input type="range" min={1} max={pasos} step={1} value={kk} onChange={(e) => setK(Number(e.target.value))} />
      </label>
      <label className="wg-campo">
        <span>El precio se mueve: <b>{movEf > 0 ? '+' : ''}{movEf} {unidadDe(s, Math.abs(movEf))}</b></span>
        <input type="range" min={-rango} max={rango} step={paso} value={movEf} onChange={(e) => setMov(Number(e.target.value))} />
      </label>
      <div className="wg-resultado">
        <span>Tu saldo cambia</span>
        <b className={cambio > 0 ? 'mas' : ''}>{dinero(cambio, true)}</b>
        <small>{movEf} {unidadDe(s, Math.abs(movEf))} × ${s.valorPip} por {unidadDe(s, 1)} × {lote.toFixed(2)} de volumen</small>
      </div>
      <div className="wg-linea"><span>Margen que se aparta (aprox.)</span><b>{dinero(margen)}</b></div>
      <p className="wg-nota">Cifras de ejemplo simplificadas. En tu plataforma pueden variar según el activo y el tipo de cuenta.</p>
    </div>
  )
}

// 3) Mi cuenta en vivo: balance, equidad, margen, margen libre, nivel de margen y swap
const DEFS = {
  balance: ['Balance', 'Tu saldo, sin contar las operaciones abiertas. Solo cambia cuando cierras una operación.', 'Balance = saldo anterior + resultados de las operaciones cerradas'],
  beneficio: ['Beneficio', 'El resultado de tus operaciones abiertas. Varía con cada movimiento del precio.', 'Es la ganancia o pérdida flotante'],
  swap: ['Swap', 'Cargo (o abono) por mantener una operación abierta de un día para otro. Si la cierras el mismo día, no se aplica.', 'Simula el paso de los días para verlo'],
  equidad: ['Equidad', 'El valor de tu cuenta si cerraras todas las operaciones en este momento.', 'Equidad = Balance + Beneficio + Swap'],
  margen: ['Margen', 'La garantía que la plataforma reserva mientras tu operación está abierta. Se libera al cerrarla.', 'A mayor volumen, mayor margen'],
  libre: ['Margen libre', 'Los fondos disponibles para abrir nuevas operaciones.', 'Margen libre = Equidad − Margen'],
  nivel: ['Nivel de margen', 'Indica qué tan holgada está tu cuenta. Mientras más alto, mayor holgura.', 'Nivel de margen = Equidad ÷ Margen × 100'],
}

export function CuentaViva() {
  const [vol, setVol] = useState(0.1)
  const [flot, setFlot] = useState(0)
  const [noches, setNoches] = useState(0)
  const [sel, setSel] = useState('equidad')
  const balance = 1000
  const abierta = vol > 0
  const margen = abierta ? margenPos('EURUSD', vol, SIMBOLOS.EURUSD.base) : 0
  const beneficio = abierta ? flot : 0
  const swap = abierta ? -3.5 * vol * noches : 0
  const equidad = balance + beneficio + swap
  const libre = equidad - margen
  const nivel = margen > 0 ? (equidad / margen) * 100 : null
  const valores = {
    balance: dinero(balance), beneficio: dinero(beneficio, true), swap: dinero(swap, true), equidad: dinero(equidad),
    margen: dinero(margen), libre: dinero(libre), nivel: nivel == null ? '—' : `${nivel.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`,
  }
  const pct = equidad > 0 ? Math.min(100, (margen / equidad) * 100) : 100
  const [titulo, def, formula] = DEFS[sel]
  return (
    <div className="wg" aria-label="Mi cuenta en vivo">
      <Pills etiqueta="Operación abierta" valor={vol} onChange={(v) => { setVol(v); if (v === 0) { setFlot(0); setNoches(0) } }}
        opciones={[[0, 'Ninguna'], [0.1, '0.1'], [0.3, '0.3'], [0.5, '0.5']]} />
      <label className="wg-campo">
        <span>Resultado de la operación: <b>{dinero(beneficio, true)}</b></span>
        <input type="range" min={-150} max={150} step={5} value={beneficio} disabled={!abierta} onChange={(e) => setFlot(Number(e.target.value))} />
      </label>
      <button type="button" className="wg-noche" disabled={!abierta} onClick={() => setNoches(noches + 1)}><Moon size={16} /> Simular un día abierto ({noches})</button>
      <div className="wg-celdas">
        {['balance', 'beneficio', 'swap', 'equidad', 'margen', 'libre', 'nivel'].map((k) => (
          <button key={k} type="button" className={`wg-celda ${sel === k ? 'on' : ''}`} onClick={() => setSel(k)}>
            <span>{DEFS[k][0]}</span><b>{valores[k]}</b>
          </button>
        ))}
      </div>
      <div className="wg-barra" role="img" aria-label="Margen usado y margen libre">
        <i style={{ width: `${pct}%` }} />
        <em><span>Margen</span><span>Libre</span></em>
      </div>
      <div className="wg-def" role="status">
        <b>{titulo}:</b> {def}
        <small>{formula}</small>
      </div>
    </div>
  )
}

const MAPA = { pip: PipVivo, calc: Calculadora, cuenta: CuentaViva }

export default function Widget({ tipo }) {
  const C = MAPA[tipo]
  return C ? <C /> : null
}
