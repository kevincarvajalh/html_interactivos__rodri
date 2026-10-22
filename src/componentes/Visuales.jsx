import { useEffect, useState } from 'react'

function Niveles() {
  return (
    <svg viewBox="0 0 320 180" className="svg" role="img" aria-label="Take Profit arriba, entrada al medio, Stop Loss abajo">
      <line x1="10" x2="310" y1="30" y2="30" className="v" strokeWidth="2.5" /><text x="14" y="22">TAKE PROFIT · objetivo de ganancia</text>
      <line x1="10" x2="310" y1="90" y2="90" className="g" strokeWidth="1.5" /><text x="14" y="82">ENTRADA · precio de apertura</text>
      <line x1="10" x2="310" y1="150" y2="150" className="g" strokeWidth="1.5" strokeDasharray="5 4" /><text x="14" y="142">STOP LOSS · límite de pérdida</text>
      <polyline points="30,130 80,108 120,118 180,70 250,46" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--txt)' }} />
    </svg>
  )
}

function Pendientes() {
  const f = [[28, 'SELL LIMIT · venta a un precio superior'], [68, 'BUY STOP · compra si rompe al alza'], [150, 'BUY LIMIT · compra a un precio inferior'], [190, 'SELL STOP · venta si rompe a la baja']]
  return (
    <svg viewBox="0 0 320 210" className="svg" role="img" aria-label="Órdenes pendientes respecto al precio actual">
      {f.map(([y, t]) => <g key={y}><line x1="10" x2="310" y1={y} y2={y} className="g" strokeDasharray="5 4" strokeWidth="1.5" /><text x="14" y={y - 7}>{t}</text></g>)}
      <line x1="10" x2="310" y1="109" y2="109" className="v" strokeWidth="2.5" /><text x="14" y="101" style={{ fill: 'var(--verde)', fontWeight: 700 }}>PRECIO ACTUAL</text>
    </svg>
  )
}

function Riesgo() {
  return (
    <svg viewBox="0 0 320 110" className="svg" role="img" aria-label="Tu capital y el 1 por ciento de riesgo">
      <text x="10" y="20">Tu capital: 100%</text>
      <rect x="10" y="30" width="300" height="28" rx="8" fill="var(--linea)" />
      <rect x="10" y="30" width="9" height="28" rx="4" fill="var(--verde)" />
      <text x="26" y="48" style={{ fill: 'var(--txt)', fontWeight: 700 }}>1% = riesgo máximo por operación</text>
      <text x="10" y="90">Con 1 000 USD, el riesgo máximo por operación es de 10 USD</text>
    </svg>
  )
}

function Respira() {
  const [fase, setFase] = useState(0)
  useEffect(() => { const t = setInterval(() => setFase((f) => (f + 1) % 2), 4000); return () => clearInterval(t) }, [])
  return (
    <div className="respira">
      <div className="circulo" style={{ transform: fase === 0 ? 'scale(1.35)' : 'scale(0.85)' }}>
        {fase === 0 ? 'Inhala' : 'Exhala'}
      </div>
    </div>
  )
}

const MAPA = { niveles: Niveles, pendientes: Pendientes, riesgo: Riesgo, respira: Respira }

export default function Visual({ tipo }) {
  const C = MAPA[tipo]
  return C ? <C /> : null
}
