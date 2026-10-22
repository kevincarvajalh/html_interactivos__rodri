import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpDown, CandlestickChart, History, MessageSquare, Menu, Plus, Minus, X, ChevronLeft, Check, MousePointerClick,
} from 'lucide-react'
import {
  SIMBOLOS, TIPOS_PENDIENTE, mundoInicial, paso, bidAsk, pnlPos, flotante, margenUsado, margenPos, nivelMargen,
  enviarOrden, cerrarManual, cancelarPendiente, modificar, riesgoUSD, velas, posicionDemo,
} from '../motor.js'
import { GuiaOverlay, GuiaBurbuja } from './GuiaDedo.jsx'
import './mt5.css'

const dec = (n, d) => n.toFixed(d)
const gan = (n) => `${n < 0 ? '-' : ''}${Math.abs(n).toFixed(2)}`
const hora = (f = new Date()) => f.toTimeString().slice(0, 8)

// Precio al estilo MT5: dígitos grandes y el último en superíndice
function Precio({ v, d, clase }) {
  const s = v.toFixed(d)
  const k = d >= 3 ? 3 : d === 2 ? 2 : 1
  return (
    <span className={clase}>
      <span className="c">{s.slice(0, -k)}</span>
      <span className="g">{d >= 3 ? s.slice(-3, -1) : s.slice(-k)}</span>
      {d >= 3 && <sup>{s.slice(-1)}</sup>}
    </span>
  )
}

export function Grafico({ m, sim, W = 340, H = 400, max = 30 }) {
  const s = SIMBOLOS[sim]
  const { bid, ask } = bidAsk(m, sim)
  const vs = velas(m.hist[sim], m.ticks, 3, max)
  const niveles = [
    ...m.posiciones.filter((p) => p.sim === sim).flatMap((p) => [
      { y: p.entrada, t: `#${p.id} ${p.tipo} ${p.lote}`, c: '#52606d' },
      p.sl != null && { y: p.sl, t: `sl #${p.id}`, c: '#d83a34' },
      p.tp != null && { y: p.tp, t: `tp #${p.id}`, c: '#1e9e55' },
    ]),
    ...m.pendientes.filter((o) => o.sim === sim).map((o) => ({ y: o.precio, t: `#${o.id} ${TIPOS_PENDIENTE[o.tipo].toLowerCase()}`, c: '#1c6fd1' })),
  ].filter(Boolean)
  const todos = [...vs.flatMap((v) => [v.h, v.l]), ...niveles.map((n) => n.y), bid, ask]
  let mn = Math.min(...todos)
  let mx = Math.max(...todos)
  const hueco = (mx - mn || s.pip * 10) * 0.1
  mn -= hueco
  mx += hueco
  const EJE = 58
  const Y = (v) => 6 + ((mx - v) / (mx - mn)) * (H - 12)
  const ancho = (W - EJE) / vs.length
  const grilla = [0.2, 0.4, 0.6, 0.8].map((k) => mn + (mx - mn) * k)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Gráfico de ${s.nombre}`}>
      {grilla.map((g, i) => (
        <g key={i}>
          <line x1="0" x2={W - EJE} y1={Y(g)} y2={Y(g)} stroke="#eceff2" />
          <text x={W - EJE + 4} y={Y(g) + 3} style={{ fill: '#6b7681', fontSize: 9 }}>{dec(g, s.dec)}</text>
        </g>
      ))}
      {vs.map((v, i) => {
        const x = i * ancho + ancho / 2
        const sube = v.c >= v.o
        const col = sube ? '#1e9e55' : '#d83a34'
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={Y(v.h)} y2={Y(v.l)} stroke={col} strokeWidth="1" />
            <rect x={x - ancho * 0.32} width={ancho * 0.64} y={Math.min(Y(v.o), Y(v.c))} height={Math.max(1.2, Math.abs(Y(v.o) - Y(v.c)))} fill={col} />
          </g>
        )
      })}
      <line x1="0" x2={W - EJE} y1={Y(ask)} y2={Y(ask)} stroke="#1c6fd1" strokeDasharray="2 3" strokeWidth="0.8" />
      <rect x={W - EJE} y={Y(ask) - 7} width={EJE} height="14" fill="#1c6fd1" />
      <text x={W - EJE + 3} y={Y(ask) + 3} style={{ fill: '#fff', fontSize: 9 }}>{dec(ask, s.dec)}</text>
      <line x1="0" x2={W - EJE} y1={Y(bid)} y2={Y(bid)} stroke="#d83a34" strokeDasharray="2 3" strokeWidth="0.8" />
      <rect x={W - EJE} y={Y(bid) - 7} width={EJE} height="14" fill="#d83a34" />
      <text x={W - EJE + 3} y={Y(bid) + 3} style={{ fill: '#fff', fontSize: 9 }}>{dec(bid, s.dec)}</text>
      {niveles.map((n, i) => (
        <g key={i}>
          <line x1="0" x2={W - EJE} y1={Y(n.y)} y2={Y(n.y)} stroke={n.c} strokeDasharray="5 3" strokeWidth="1" />
          <text x="4" y={Y(n.y) - 3} style={{ fill: n.c, fontSize: 9, fontWeight: 700 }}>{n.t}</text>
        </g>
      ))}
    </svg>
  )
}

function PantallaOrden({ m, sim, funciones, foco, error, lado0, onAtras, onEnviar }) {
  const s = SIMBOLOS[sim]
  const { bid, ask } = bidAsk(m, sim)
  const [tipo, setTipo] = useState('mercado')
  const [lote, setLote] = useState(String(s.loteMin))
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [precio, setPrecio] = useState('')
  const pendiente = tipo !== 'mercado'
  const ladoRef = pendiente ? (tipo.startsWith('buy') ? 'buy' : 'sell') : lado0
  const base = pendiente ? Number(precio) || (ladoRef === 'buy' ? ask : bid) : ladoRef === 'buy' ? ask : bid
  const loteN = Number(String(lote).replace(',', '.'))

  const paso01 = (k) => setLote(dec(Math.max(s.loteMin, Math.round(((loteN || 0) + k) * 100) / 100), 2))
  const sugerir = () => {
    const d = (ladoRef === 'buy' ? 1 : -1) * s.sugPips * s.pip
    setSl(dec(base - d, s.dec))
    setTp(dec(base + d * 2, s.dec))
  }
  const cambiarTipo = (t) => {
    setTipo(t)
    if (t !== 'mercado') {
      const k = { buyLimit: -1, sellLimit: 1, buyStop: 1, sellStop: -1 }[t]
      setPrecio(dec((t.startsWith('buy') ? ask : bid) + k * s.sugPips * 0.8 * s.pip, s.dec))
    }
  }
  const slN = Number(String(sl).replace(',', '.'))
  const riesgo = sl !== '' && !Number.isNaN(slN) && loteN > 0 ? riesgoUSD(sim, base, slN, loteN) : null
  const margen = loteN > 0 ? margenPos(sim, loteN, base) : 0
  const datos = { sim, tipo, lote, precio, sl, tp }

  return (
    <div className="m5-pant">
      <div className="m5-bar">
        <button className="m5-ico" onClick={onAtras} aria-label="Volver"><ChevronLeft size={22} /></button>
        <h4>{s.nombre}<small>{s.desc}</small></h4>
      </div>
      <div className="m5-cuerpo">
        {funciones.pendientes && (
          <div className="m5-campo" data-guia="ord-tipo">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => cambiarTipo(e.target.value)}>
              <option value="mercado">Ejecución a mercado</option>
              {Object.entries(TIPOS_PENDIENTE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        )}
        {pendiente && (
          <div className="m5-campo">
            <label>Precio</label>
            <input inputMode="decimal" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>
        )}
        <div className="m5-campo" data-guia="ord-vol">
          <label>Volumen</label>
          <div className="m5-vol">
            <button onClick={() => paso01(-s.loteMin)} aria-label="Menos"><Minus size={18} /></button>
            <input inputMode="decimal" value={lote} onChange={(e) => setLote(e.target.value)} />
            <button onClick={() => paso01(s.loteMin)} aria-label="Más"><Plus size={18} /></button>
          </div>
        </div>
        {funciones.sltp && (
          <>
            <div className="m5-campo" data-guia="ord-sl"><label>Stop Loss</label><input inputMode="decimal" placeholder="No establecido" value={sl} onChange={(e) => setSl(e.target.value)} /></div>
            <div className="m5-campo" data-guia="ord-tp"><label>Take Profit</label><input inputMode="decimal" placeholder="No establecido" value={tp} onChange={(e) => setTp(e.target.value)} /></div>
            <div className="m5-ayuda">
              <button data-guia="ayuda" className={`m5-chip ${foco === 'sl' ? 'm5-foco' : ''}`} onClick={sugerir}>Ayuda: sugerir SL y TP</button>
            </div>
            {riesgo != null && <div className="m5-nota" data-guia="ord-riesgo">Si toca el Stop Loss perderías aprox. <b>${riesgo.toFixed(2)}</b> ({((riesgo / m.balance) * 100).toFixed(1)}% de tu saldo).</div>}
          </>
        )}
        <div className="m5-nota" data-guia="ord-margen">Margen necesario: <b>${margen.toFixed(2)}</b></div>
        {error && <div className="m5-nota err" role="alert">{error}</div>}
      </div>
      <div className="m5-bs">
        {pendiente ? (
          <button data-guia="ord-colocar" className={`o ${foco === 'enviar' ? 'm5-foco' : ''}`} onClick={() => onEnviar(datos, ladoRef)}>Colocar orden</button>
        ) : (
          <>
            <button data-guia="ord-sell" className="s" onClick={() => onEnviar(datos, 'sell')}>Vender por<small>{dec(bid, s.dec)}</small></button>
            <button data-guia="ord-buy" className={`b ${foco === 'enviar' ? 'm5-foco' : ''}`} onClick={() => onEnviar(datos, 'buy')}>Comprar por<small>{dec(ask, s.dec)}</small></button>
          </>
        )}
      </div>
    </div>
  )
}

function PantallaModificar({ m, pos, error, onAtras, onGuardar }) {
  const s = SIMBOLOS[pos.sim]
  const [sl, setSl] = useState(pos.sl != null ? dec(pos.sl, s.dec) : '')
  const [tp, setTp] = useState(pos.tp != null ? dec(pos.tp, s.dec) : '')
  return (
    <div className="m5-pant">
      <div className="m5-bar">
        <button className="m5-ico" onClick={onAtras} aria-label="Volver"><ChevronLeft size={22} /></button>
        <h4>Modificar #{pos.id}<small>{s.nombre}, {pos.tipo} {pos.lote}</small></h4>
      </div>
      <div className="m5-cuerpo">
        <div className="m5-campo" data-guia="mod-sl"><label>Stop Loss</label><input inputMode="decimal" placeholder="No establecido" value={sl} onChange={(e) => setSl(e.target.value)} /></div>
        <div className="m5-campo" data-guia="mod-tp"><label>Take Profit</label><input inputMode="decimal" placeholder="No establecido" value={tp} onChange={(e) => setTp(e.target.value)} /></div>
        {error && <div className="m5-nota err" role="alert">{error}</div>}
      </div>
      <div className="m5-bs"><button data-guia="mod-ok" className="o" onClick={() => onGuardar(pos.id, sl, tp)}>Modificar</button></div>
    </div>
  )
}

const pistaDe = (p) => (typeof p === 'string' ? p : p.movil || p.escritorio)

export default function SimuladorMT5({ objetivos = [], funciones = {}, simboloInicial = 'EURUSD', onCompleto, modo = 'practica', tour = [], onFinGuia }) {
  const ref = useRef(null)
  if (ref.current === null) ref.current = mundoInicial()
  const [m, setM] = useState(ref.current)
  const [sim, setSim] = useState(simboloInicial)
  const [tabS, setTabS] = useState('quotes')
  const [pantS, setPantS] = useState(null) // { t:'orden'|'menuSim'|'menuPos'|'cerrar'|'modificar'|'menuOrd', id?, lado? }
  const [error, setError] = useState('')
  const [locales, setLocales] = useState({})
  const avisado = useRef(false)
  const marcoRef = useRef(null)
  const enGuia = modo === 'guia' && tour.length > 0
  const [gi, setGi] = useState(0)
  const [rectG, setRectG] = useState(null)
  const pasoG = enGuia ? tour[gi] : null
  const tab = pasoG ? pasoG.tab || 'quotes' : tabS
  const pant = pasoG
    ? (pasoG.pant ? { ...pasoG.pant, id: pasoG.pant.t === 'orden' ? undefined : m.posiciones[0]?.id } : null)
    : pantS
  const fn = enGuia ? { sltp: true, pendientes: true } : funciones

  useEffect(() => {
    if (pasoG?.conPos && ref.current.posiciones.length === 0) { ref.current = posicionDemo(ref.current); setM(ref.current) }
  }, [pasoG])

  useEffect(() => {
    const t = setInterval(() => { ref.current = paso(ref.current); setM(ref.current) }, 800)
    return () => clearInterval(t)
  }, [])

  const marcar = (k) => setLocales((l) => ({ ...l, [k]: true }))
  const hechos = (o) => !!(m.eventos[o.evento] || locales[o.evento])
  const faltan = objetivos.filter((o) => !hechos(o))
  const siguiente = faltan[0]
  const completo = faltan.length === 0
  useEffect(() => {
    if (completo && !avisado.current && !enGuia) { avisado.current = true; onCompleto?.() }
  }, [completo, onCompleto, enGuia])

  const aplicar = (n) => { ref.current = n; setM(n) }
  const foco = enGuia ? undefined : siguiente?.foco
  const F = (cond) => (cond ? 'm5-foco' : '')
  const enPos = m.posiciones.length > 0
  // qué elemento resaltar según el paso guiado
  const focoTab = {
    quotes: foco === 'simbolos' && tab !== 'quotes',
    trade: (['operaciones', 'cerrar'].includes(foco) && tab !== 'trade') || (foco === 'nueva' && !['trade', 'chart'].includes(tab)),
  }
  const focoMas = foco === 'nueva' && ['trade', 'chart'].includes(tab) && !pant

  const abrirOrden = (lado = 'buy') => { setError(''); setPantS({ t: 'orden', lado }); marcar('abrioForm') }
  const elegirSim = (id) => { setSim(id); marcar('cambioSimbolo') }
  const enviar = (d, lado) => {
    const r = enviarOrden(ref.current, { ...d, lado })
    if (r.error) return setError(r.error)
    setError(''); setPantS(null); setTabS('trade'); aplicar(r.m)
  }
  const guardarMod = (id, sl, tp) => {
    const r = modificar(ref.current, id, sl, tp)
    if (r.error) return setError(r.error)
    setError(''); setPantS(null); aplicar(r.m)
  }

  const flot = flotante(m)
  const usado = margenUsado(m)
  const equidad = m.balance + flot
  const libre = equidad - usado
  const nivel = nivelMargen(m)
  const posSel = pant?.id != null ? m.posiciones.find((p) => p.id === pant.id) : null
  const ordSel = pant?.t === 'menuOrd' ? m.pendientes.find((o) => o.id === pant.id) : null
  const s = SIMBOLOS[sim]
  const bs = bidAsk(m, sim)

  const titulo = { quotes: 'Cotizaciones', chart: s.nombre, trade: 'Operaciones', history: 'Historial', msgs: 'Mensajes' }[tab]

  return (
    <div className="m5-wrap">
      {!enGuia && (
        <div className="m5-guia">
          <MousePointerClick size={20} style={{ flex: 'none', marginTop: 2 }} />
          <span>{completo ? 'Práctica completada. Cuando quieras, puedes repetirla en tu MetaTrader.' : pistaDe(siguiente.pista)}</span>
        </div>
      )}
      <span className="m5-etq">Simulador de práctica</span>

      <div className="m5" ref={marcoRef}>
        <div className="m5-bar">
          <button className="m5-ico" aria-label="Menú"><Menu size={22} /></button>
          <h4>{titulo}<small>{tab === 'chart' ? s.desc : 'Capitaria-Demo · cuenta de práctica'}</small></h4>
          {(tab === 'trade' || tab === 'chart') && (
            <button data-guia="mas" className={`m5-ico ${F(focoMas)}`} aria-label="Nueva orden" onClick={() => abrirOrden()}><Plus size={22} /></button>
          )}
        </div>

        <div className="m5-cuerpo">
          {tab === 'quotes' && (
            <div data-guia="lista" className={F(foco === 'simbolos' && tab === 'quotes')}>
              {Object.entries(SIMBOLOS).map(([id, x], idx) => {
                const b = bidAsk(m, id)
                const h = m.hist[id]
                const sube = h[h.length - 1] >= h[h.length - 2]
                const cl = sube ? 'u' : 'd'
                return (
                  <button key={id} data-guia={idx === 0 ? 'fila1' : undefined} className="m5-fila" onClick={() => { elegirSim(id); setPantS({ t: 'menuSim', id }) }}>
                    <span className="m5-sym"><b>{x.nombre}</b><small>{Math.round(x.spread * 10)} · {hora()}</small></span>
                    <span className="m5-px">
                      <span className="p" data-guia={idx === 0 ? 'bid1' : undefined}><Precio v={b.bid} d={x.dec} clase={cl} /><i>Mín {dec(Math.min(...h) - x.spread * x.pip, x.dec)}</i></span>
                      <span className="p" data-guia={idx === 0 ? 'ask1' : undefined}><Precio v={b.ask} d={x.dec} clase={cl} /><i>Máx {dec(Math.max(...h) + x.spread * x.pip, x.dec)}</i></span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {tab === 'chart' && (
            <>
              <div className="m5-tf">
                {Object.keys(SIMBOLOS).map((id) => <button key={id} className={id === sim ? 'on' : ''} onClick={() => elegirSim(id)}>{SIMBOLOS[id].nombre}</button>)}
                <span style={{ width: 8, flex: 'none' }} />
                {['M1', 'M5', 'M15', 'H1', 'H4', 'D1'].map((t, i) => <button key={t} className={i === 1 ? 'on' : ''}>{t}</button>)}
              </div>
              <div className="m5-graf" data-guia="grafico">
                <Grafico m={m} sim={sim} />
                <div className="m5-q" data-guia="q">
                  <button className="s" onClick={() => abrirOrden('sell')}><b>SELL</b>{dec(bs.bid, s.dec)}</button>
                  <span className="v">0.01</span>
                  <button className="b" onClick={() => abrirOrden('buy')}><b>BUY</b>{dec(bs.ask, s.dec)}</button>
                </div>
              </div>
            </>
          )}

          {tab === 'trade' && (
            <>
              <div className="m5-res" data-guia="resumen">
                <div data-guia="m-benef" className={`gr ${flot < 0 ? 'n' : ''}`}>{gan(flot)} USD</div>
                <div className="m5-kv" data-guia="m-balance"><span>Balance:</span><b>{m.balance.toFixed(2)}</b></div>
                <div className="m5-kv" data-guia="m-equidad"><span>Equidad:</span><b>{equidad.toFixed(2)}</b></div>
                <div className="m5-kv" data-guia="m-margen"><span>Margen:</span><b>{usado.toFixed(2)}</b></div>
                <div className="m5-kv" data-guia="m-libre"><span>Margen libre:</span><b>{libre.toFixed(2)}</b></div>
                {nivel != null && <div className="m5-kv" data-guia="m-nivel"><span>Nivel de margen:</span><b>{nivel.toFixed(2)}%</b></div>}
              </div>
              <div className="m5-sec"><span>Posiciones</span></div>
              {!enPos && <div className="m5-vacio">No tienes posiciones abiertas.<br />Toca + para abrir una.</div>}
              {m.posiciones.map((p, i) => {
                const b = bidAsk(m, p.sim)
                const g = pnlPos(p, b.bid, b.ask)
                const x = SIMBOLOS[p.sim]
                return (
                  <button key={p.id} data-guia={i === 0 ? 'pos1' : undefined} className={`m5-pos ${F(foco === 'cerrar' && i === 0)}`} onClick={() => setPantS({ t: 'menuPos', id: p.id })}>
                    <div className="l1" data-guia={i === 0 ? 'pos-l1' : undefined}><b>{x.nombre},<span className={p.tipo}>{p.tipo} {p.lote}</span></b><span className={`gan ${g >= 0 ? 'u' : 'd'}`}>{gan(g)}</span></div>
                    <div className="l2" data-guia={i === 0 ? 'pos-precios' : undefined}><span>{dec(p.entrada, x.dec)} → {dec(p.tipo === 'buy' ? b.bid : b.ask, x.dec)}</span><span>#{p.id}</span></div>
                    {(p.sl != null || p.tp != null) && (
                      <div className="l2" data-guia={i === 0 ? 'pos-sltp' : undefined}><span>S/L: {p.sl != null ? dec(p.sl, x.dec) : '-'}</span><span>T/P: {p.tp != null ? dec(p.tp, x.dec) : '-'}</span></div>
                    )}
                  </button>
                )
              })}
              {m.pendientes.length > 0 && <div className="m5-sec"><span>Órdenes</span></div>}
              {m.pendientes.map((o) => {
                const b = bidAsk(m, o.sim)
                const x = SIMBOLOS[o.sim]
                return (
                  <button key={o.id} className="m5-pos" onClick={() => setPantS({ t: 'menuOrd', id: o.id })}>
                    <div className="l1"><b>{x.nombre},<span className={o.tipo.startsWith('buy') ? 'buy' : 'sell'}>{TIPOS_PENDIENTE[o.tipo].toLowerCase()} {o.lote}</span></b></div>
                    <div className="l2"><span>{dec(o.precio, x.dec)} → {dec(o.tipo.startsWith('buy') ? b.ask : b.bid, x.dec)}</span><span>#{o.id}</span></div>
                  </button>
                )
              })}
            </>
          )}

          {tab === 'history' && (
            <>
              <div className="m5-res">
                <div className={`gr ${m.historial.reduce((t, h) => t + h.gan, 0) < 0 ? 'n' : ''}`}>{gan(m.historial.reduce((t, h) => t + h.gan, 0))} USD</div>
                <div className="m5-kv"><span>Operaciones cerradas:</span><b>{m.historial.length}</b></div>
              </div>
              {m.historial.length === 0 && <div className="m5-vacio">Aquí verás las operaciones que cierres.</div>}
              {m.historial.map((h) => {
                const x = SIMBOLOS[h.sim]
                return (
                  <div key={h.id} className="m5-pos">
                    <div className="l1"><b>{x.nombre},<span className={h.tipo}>{h.tipo} {h.lote}</span></b><span className={`gan ${h.gan >= 0 ? 'u' : 'd'}`}>{gan(h.gan)}</span></div>
                    <div className="l2"><span>{dec(h.entrada, x.dec)} → {dec(h.salida, x.dec)}</span><span>{hora(new Date(h.hora))}</span></div>
                  </div>
                )
              })}
            </>
          )}

          {tab === 'msgs' && <div className="m5-vacio">No tienes mensajes nuevos.</div>}
        </div>

        <nav className="m5-nav">
          {[['quotes', 'Cotizaciones', ArrowUpDown], ['chart', 'Gráfico', CandlestickChart], ['trade', 'Operaciones', ArrowUpDown], ['history', 'Historial', History], ['msgs', 'Mensajes', MessageSquare]].map(([k, n, Ico]) => (
            <button key={k} data-guia={`nav-${k}`} className={`${tab === k ? 'on' : ''} ${F(focoTab[k])}`} onClick={() => setTabS(k)}>
              {k === 'trade' ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 18 9 12l4 3 7-9" /><path d="M15 6h5v5" /></svg> : <Ico size={22} />}
              {n}
            </button>
          ))}
        </nav>

        {pant?.t === 'orden' && (
          <PantallaOrden m={m} sim={sim} funciones={fn} foco={foco} error={error} lado0={pant.lado} onAtras={() => setPantS(null)} onEnviar={enviar} />
        )}
        {pant?.t === 'modificar' && posSel && (
          <PantallaModificar m={m} pos={posSel} error={error} onAtras={() => setPantS(null)} onGuardar={guardarMod} />
        )}
        {pant?.t === 'detalle' && posSel && (() => {
          const b = bidAsk(m, posSel.sim)
          const x = SIMBOLOS[posSel.sim]
          const g = pnlPos(posSel, b.bid, b.ask)
          const filas = [
            ['Ticket', `#${posSel.id}`, 'det-ticket'], ['Tipo', posSel.tipo, 'det-tipo'], ['Volumen', dec(posSel.lote, 2), 'det-vol'],
            ['Precio de apertura', dec(posSel.entrada, x.dec), 'det-ent'], ['Precio actual', dec(posSel.tipo === 'buy' ? b.bid : b.ask, x.dec), 'det-act'],
            ['Stop Loss', posSel.sl != null ? dec(posSel.sl, x.dec) : '—', 'det-sl'], ['Take Profit', posSel.tp != null ? dec(posSel.tp, x.dec) : '—', 'det-tp'],
            ['Swap', gan(posSel.swap || 0), 'det-swap'], ['Beneficio', gan(g), 'det-benef'],
          ]
          return (
            <div className="m5-pant">
              <div className="m5-bar">
                <button className="m5-ico" onClick={() => setPantS(null)} aria-label="Volver"><ChevronLeft size={22} /></button>
                <h4>Detalles<small>{x.nombre}, {posSel.tipo} {posSel.lote}</small></h4>
              </div>
              <div className="m5-cuerpo">{filas.map(([k, v, id]) => <div key={id} data-guia={id} className="m5-kv det"><span>{k}</span><b>{v}</b></div>)}</div>
            </div>
          )
        })()}
        {pant?.t === 'cerrar' && posSel && (() => {
          const b = bidAsk(m, posSel.sim)
          const g = pnlPos(posSel, b.bid, b.ask)
          return (
            <div className="m5-pant">
              <div className="m5-bar">
                <button className="m5-ico" onClick={() => setPantS(null)} aria-label="Volver"><ChevronLeft size={22} /></button>
                <h4>Cerrar posición<small>#{posSel.id} · {SIMBOLOS[posSel.sim].nombre}, {posSel.tipo} {posSel.lote}</small></h4>
              </div>
              <div className="m5-conf">
                <p style={{ color: '#8e8e93' }}>Resultado si cierras ahora</p>
                <div data-guia="res-cerrar" className={`gr ${g >= 0 ? 'u' : 'd'}`}>{gan(g)} USD</div>
                <button data-guia="btn-cerrar" className={`btn-cierra ${F(foco === 'cerrar')}`} onClick={() => { aplicar(cerrarManual(ref.current, posSel.id)); setPantS(null) }}>
                  Cerrar posición #{posSel.id}
                </button>
              </div>
            </div>
          )
        })()}

        {pant && ['menuSim', 'menuPos', 'menuOrd'].includes(pant.t) && (
          <div className="m5-hoja" onClick={() => setPantS(null)}>
            <div className="m5-menu" onClick={(e) => e.stopPropagation()}>
              {pant.t === 'menuSim' && (
                <>
                  <h5>{SIMBOLOS[pant.id].nombre}<small>{SIMBOLOS[pant.id].desc}</small></h5>
                  <button data-guia="menu-nueva" onClick={() => abrirOrden()}>Nueva orden</button>
                  <button onClick={() => { setTabS('chart'); setPantS(null) }}>Gráfico</button>
                </>
              )}
              {pant.t === 'menuPos' && posSel && (
                <>
                  <h5>{SIMBOLOS[posSel.sim].nombre}, {posSel.tipo} {posSel.lote}<small>#{posSel.id}</small></h5>
                  <button data-guia="menu-det" onClick={() => setPantS({ t: 'detalle', id: posSel.id })}>Detalles</button>
                  <button data-guia="menu-cerrar" className={F(foco === 'cerrar')} onClick={() => setPantS({ t: 'cerrar', id: posSel.id })}>Cerrar posición</button>
                  <button data-guia="menu-mod" onClick={() => { setError(''); setPantS({ t: 'modificar', id: posSel.id }) }}>Modificar posición</button>
                  <button onClick={() => { setSim(posSel.sim); setTabS('chart'); setPantS(null) }}>Gráfico</button>
                </>
              )}
              {pant.t === 'menuOrd' && ordSel && (
                <>
                  <h5>{SIMBOLOS[ordSel.sim].nombre}, {TIPOS_PENDIENTE[ordSel.tipo].toLowerCase()}<small>#{ordSel.id}</small></h5>
                  <button onClick={() => { aplicar(cancelarPendiente(ref.current, ordSel.id)); setPantS(null) }}>Eliminar orden</button>
                </>
              )}
            </div>
          </div>
        )}
        {enGuia && pasoG && (
          <>
            <GuiaOverlay raiz={marcoRef} paso={pasoG} numero={gi + 1} clave={`${gi}-${pasoG.tab}-${pasoG.pant?.t}`} onRect={setRectG} />
            <GuiaBurbuja
              paso={pasoG} i={gi} total={tour.length} flotante abajo={!!rectG && rectG.y + rectG.h / 2 < rectG.H / 2}
              onSig={() => (gi < tour.length - 1 ? setGi(gi + 1) : onFinGuia?.())}
              onAnt={() => setGi(Math.max(0, gi - 1))} onSaltar={() => onFinGuia?.()}
            />
          </>
        )}
      </div>

      {!enGuia && <div className="objetivos">
        {objetivos.map((o) => (
          <div key={o.id} className={`obj ${hechos(o) ? 'ok' : ''}`}>
            <span className="caja">{hechos(o) && <Check size={14} />}</span>{o.texto}
          </div>
        ))}
      </div>}
    </div>
  )
}
