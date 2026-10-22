import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import {
  SIMBOLOS, TIPOS_PENDIENTE, mundoInicial, paso, bidAsk, pnlPos, flotante, margenUsado, margenPos, nivelMargen,
  enviarOrden, cerrarManual, cancelarPendiente, modificar, riesgoUSD, posicionDemo,
} from '../motor.js'
import { Grafico } from './SimuladorMT5.jsx'
import { GuiaOverlay, GuiaBurbuja } from './GuiaDedo.jsx'
import './mt5.css'
import './pc.css'

const AN = 700
const AL = 520
const dec = (n, d) => n.toFixed(d)
const dinero = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')
const hora = (f = new Date()) => `${f.getFullYear()}.${String(f.getMonth() + 1).padStart(2, '0')}.${String(f.getDate()).padStart(2, '0')} ${f.toTimeString().slice(0, 8)}`
const pistaDe = (p) => (typeof p === 'string' ? p : p.escritorio || p.movil)

function DialogoOrden({ m, simIni, foco, error, onCerrar, onEnviar, fn }) {
  const [sim, setSim] = useState(simIni)
  const s = SIMBOLOS[sim]
  const { bid, ask } = bidAsk(m, sim)
  const [tipo, setTipo] = useState('mercado')
  const [lote, setLote] = useState(String(s.loteMin))
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [precio, setPrecio] = useState('')
  const pendiente = tipo !== 'mercado'
  const lado = pendiente ? (tipo.startsWith('buy') ? 'buy' : 'sell') : 'buy'
  const base = pendiente ? Number(precio) || (lado === 'buy' ? ask : bid) : ask
  const loteN = Number(String(lote).replace(',', '.'))
  const cambiarSim = (id) => { setSim(id); setLote(String(SIMBOLOS[id].loteMin)); setSl(''); setTp(''); setPrecio(''); setTipo('mercado') }
  const mover = (k) => setLote(dec(Math.max(s.loteMin, Math.round(((loteN || 0) + k) * 100) / 100), 2))
  const sugerir = () => {
    const d = (lado === 'buy' ? 1 : -1) * s.sugPips * s.pip
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
  const datos = { sim, tipo, lote, precio, sl, tp }
  return (
    <div className="pc-fondo" onClick={onCerrar}>
      <div className="pc-dialogo" onClick={(e) => e.stopPropagation()} data-guia="pc-dialogo">
        <div className="t"><span>Orden — {s.nombre}, {s.desc}</span><button className="pc-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <div className="cu">
          <span>Símbolo:</span>
          <select value={sim} onChange={(e) => cambiarSim(e.target.value)}>{Object.values(SIMBOLOS).map((x) => <option key={x.nombre} value={x.nombre}>{x.nombre}, {x.desc}</option>)}</select>
          <span>Volumen:</span>
          <div className="pc-vol" data-guia="pc-vol"><input inputMode="decimal" value={lote} onChange={(e) => setLote(e.target.value)} /><button onClick={() => mover(-s.loteMin)}>▼</button><button onClick={() => mover(s.loteMin)}>▲</button></div>
          {fn.sltp && (
            <>
              <span>Stop Loss:</span><input data-guia="pc-sl" inputMode="decimal" placeholder="0.00000" value={sl} onChange={(e) => setSl(e.target.value)} />
              <span>Take Profit:</span><input data-guia="pc-tp" inputMode="decimal" placeholder="0.00000" value={tp} onChange={(e) => setTp(e.target.value)} />
            </>
          )}
          <span>Comentario:</span><input placeholder="(opcional)" />
          <span>Tipo:</span>
          <select data-guia="pc-tipo" value={tipo} onChange={(e) => cambiarTipo(e.target.value)} disabled={!fn.pendientes}>
            <option value="mercado">Ejecución a mercado</option>
            {Object.entries(TIPOS_PENDIENTE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          {pendiente && (<><span>Precio:</span><input inputMode="decimal" value={precio} onChange={(e) => setPrecio(e.target.value)} /></>)}
        </div>
        {fn.sltp && <div className="pc-ayuda"><button data-guia="pc-ayuda" className={foco === 'sl' ? 'm5-foco' : ''} onClick={sugerir}>Ayuda: sugerir Stop Loss y Take Profit</button></div>}
        {riesgo != null && <div className="pc-aviso" data-guia="pc-riesgo">Si toca el Stop Loss perderías aprox. <b>${riesgo.toFixed(2)}</b> ({((riesgo / m.balance) * 100).toFixed(1)}% de tu saldo).</div>}
        <div className="pc-aviso" data-guia="pc-margen">Margen necesario: <b>${margenPos(sim, loteN > 0 ? loteN : s.loteMin, base).toFixed(2)}</b></div>
        {error && <div className="pc-aviso err" role="alert">{error}</div>}
        <div className="pc-precios">
          {pendiente ? (
            <button className={`o ${foco === 'enviar' ? 'm5-foco' : ''}`} data-guia="pc-colocar" onClick={() => onEnviar(datos, lado)}>Colocar</button>
          ) : (
            <>
              <button className="s" data-guia="pc-sell" onClick={() => onEnviar(datos, 'sell')}>Vender por mercado<b>{dec(bid, s.dec)}</b></button>
              <button className={`b ${foco === 'enviar' ? 'm5-foco' : ''}`} data-guia="pc-buy" onClick={() => onEnviar(datos, 'buy')}>Comprar por mercado<b>{dec(ask, s.dec)}</b></button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DialogoModificar({ pos, error, onCerrar, onGuardar }) {
  const s = SIMBOLOS[pos.sim]
  const [sl, setSl] = useState(pos.sl != null ? dec(pos.sl, s.dec) : '')
  const [tp, setTp] = useState(pos.tp != null ? dec(pos.tp, s.dec) : '')
  return (
    <div className="pc-fondo" onClick={onCerrar}>
      <div className="pc-dialogo" onClick={(e) => e.stopPropagation()}>
        <div className="t"><span>Modificar orden #{pos.id} — {s.nombre}</span><button className="pc-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <div className="cu">
          <span>Stop Loss:</span><input data-guia="pc-msl" inputMode="decimal" value={sl} onChange={(e) => setSl(e.target.value)} />
          <span>Take Profit:</span><input data-guia="pc-mtp" inputMode="decimal" value={tp} onChange={(e) => setTp(e.target.value)} />
        </div>
        {error && <div className="pc-aviso err" role="alert">{error}</div>}
        <div className="pc-precios"><button className="o" data-guia="pc-mok" onClick={() => onGuardar(pos.id, sl, tp)}>Modificar</button></div>
      </div>
    </div>
  )
}

export default function SimuladorEscritorio({ objetivos = [], funciones = {}, simboloInicial = 'EURUSD', onCompleto, modo = 'practica', tour = [], onFinGuia }) {
  const ref = useRef(null)
  if (ref.current === null) ref.current = mundoInicial()
  const [m, setM] = useState(ref.current)
  const [sim, setSim] = useState(simboloInicial)
  const [termS, setTermS] = useState('operaciones')
  const [pantS, setPantS] = useState(null) // 'orden' | { t:'modificar', id } | { t:'menu', id }
  const [error, setError] = useState('')
  const [locales, setLocales] = useState({})
  const avisado = useRef(false)
  const cont = useRef(null)
  const [esc, setEsc] = useState(1)
  const [gi, setGi] = useState(0)
  const [rectG, setRectG] = useState(null)

  const enGuia = modo === 'guia' && tour.length > 0
  const pasoG = enGuia ? tour[gi] : null
  const term = pasoG ? pasoG.tab || 'operaciones' : termS
  const pant = pasoG
    ? (pasoG.pant ? { t: pasoG.pant.t, id: pasoG.pant.t === 'orden' ? undefined : m.posiciones[0]?.id } : null)
    : pantS
  const fn = enGuia ? { sltp: true, pendientes: true } : funciones

  useLayoutEffect(() => {
    const f = () => setEsc(Math.min(1, (cont.current?.clientWidth || AN) / AN))
    f()
    const ro = new ResizeObserver(f)
    ro.observe(cont.current)
    return () => ro.disconnect()
  }, [])
  useEffect(() => {
    const t = setInterval(() => { ref.current = paso(ref.current); setM(ref.current) }, 800)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (pasoG?.conPos && ref.current.posiciones.length === 0) { ref.current = posicionDemo(ref.current); setM(ref.current) }
  }, [pasoG])

  const marcar = (k) => setLocales((l) => ({ ...l, [k]: true }))
  const hechos = (o) => !!(m.eventos[o.evento] || locales[o.evento])
  const faltan = objetivos.filter((o) => !hechos(o))
  const siguiente = faltan[0]
  const completo = faltan.length === 0
  useEffect(() => {
    if (completo && !avisado.current && !enGuia) { avisado.current = true; onCompleto?.() }
  }, [completo, onCompleto, enGuia])

  const foco = enGuia ? undefined : siguiente?.foco
  const F = (c) => (c ? 'm5-foco' : '')
  const aplicar = (n) => { ref.current = n; setM(n) }
  const abrirOrden = () => { setError(''); setPantS('orden'); marcar('abrioForm') }
  const elegir = (id) => { setSim(id); marcar('cambioSimbolo') }
  const enviar = (d, lado) => {
    const r = enviarOrden(ref.current, { ...d, lado })
    if (r.error) return setError(r.error)
    setError(''); setPantS(null); setTermS('operaciones'); aplicar(r.m)
  }
  const guardarMod = (id, sl, tp) => {
    const r = modificar(ref.current, id, sl, tp)
    if (r.error) return setError(r.error)
    setError(''); setPantS(null); aplicar(r.m)
  }

  const flot = flotante(m)
  const usado = margenUsado(m)
  const equidad = m.balance + flot
  const posSel = pant?.id != null ? m.posiciones.find((p) => p.id === pant.id) : null
  const bs = bidAsk(m, sim)
  const s = SIMBOLOS[sim]

  return (
    <div className="m5-wrap">
      {!enGuia && (
        <div className="m5-guia">
          <MousePointerClick size={20} style={{ flex: 'none', marginTop: 2 }} />
          <span>{completo ? 'Práctica completada. Cuando quieras, puedes repetirla en tu MetaTrader.' : pistaDe(siguiente.pista)}</span>
        </div>
      )}
      <span className="m5-etq">Simulador de práctica · Computador</span>

      <div className="pc-cont" ref={cont} style={{ height: AL * esc }}>
        <div className="pc" style={{ transform: `scale(${esc})`, transformOrigin: 'top left' }} onClick={() => pantS?.t === 'menu' && setPantS(null)}>
          <div className="pc-titulo"><i /> 5001234: Capitaria-Demo - Cuenta de práctica — MetaTrader 5</div>
          <div className="pc-menu">{['Archivo', 'Ver', 'Insertar', 'Gráficos', 'Herramientas', 'Ventana', 'Ayuda'].map((t) => <span key={t}>{t}</span>)}</div>
          <div className="pc-barra">
            <button className={`pc-btn fuerte ${F(foco === 'nueva')}`} data-guia="pc-nueva" onClick={abrirOrden}>＋ Nueva orden</button>
            <button className="pc-btn">Trading algorítmico</button>
            <span className="pc-sep" />
            <div className="pc-tf">{['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'].map((t, i) => <span key={t} className={i === 1 ? 'on' : ''}>{t}</span>)}</div>
          </div>

          <div className="pc-medio">
            <div className="pc-obs" data-guia="pc-obs">
              <div className="pc-cab">Observación de mercado: {hora(new Date()).slice(11)}</div>
              <div className={`pc-scroll ${F(foco === 'simbolos')}`}>
                <table className="pc-tabla" data-guia="pc-lista">
                  <thead><tr><th>Símbolo</th><th>Bid</th><th>Ask</th></tr></thead>
                  <tbody>
                    {Object.entries(SIMBOLOS).map(([id, x], idx) => {
                      const b = bidAsk(m, id)
                      return (
                        <tr key={id} className={`fila ${id === sim ? 'sel' : ''}`} onClick={() => elegir(id)} onDoubleClick={() => { elegir(id); abrirOrden() }}>
                          <td data-guia={idx === 0 ? 'pc-fila1' : undefined}>◆ {x.nombre}</td>
                          <td className="rj" data-guia={idx === 0 ? 'pc-bid1' : undefined}>{dec(b.bid, x.dec)}</td>
                          <td className="az" data-guia={idx === 0 ? 'pc-ask1' : undefined}>{dec(b.ask, x.dec)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pc-grafico" data-guia="pc-grafico">
              <span className="tit">{s.nombre}, M5 &nbsp; {dec(bs.bid, s.dec)} &nbsp; {dec(bs.ask, s.dec)}</span>
              <Grafico m={m} sim={sim} W={500} H={226} max={34} />
            </div>
          </div>

          <div className="pc-term" data-guia="pc-term">
            <div className="pc-tabs">
              <button data-guia="pc-tab-op" className={`${term === 'operaciones' ? 'on' : ''} ${F(foco === 'operaciones')}`} onClick={() => setTermS('operaciones')}>Operaciones</button>
              <button data-guia="pc-tab-hist" className={term === 'historial' ? 'on' : ''} onClick={() => setTermS('historial')}>Historial</button>
            </div>
            <div className="pc-scroll">
              {term === 'operaciones' ? (
                <table className="pc-tabla">
                  <thead><tr><th>Símbolo</th><th>Ticket</th><th>Hora</th><th>Tipo</th><th data-guia="pc-th-vol">Volumen</th><th data-guia="pc-th-ent">Precio</th><th data-guia="pc-th-sl">S/L</th><th data-guia="pc-th-tp">T/P</th><th data-guia="pc-th-act">Precio</th><th data-guia="pc-th-swap">Swap</th><th data-guia="pc-th-benef">Beneficio</th><th /></tr></thead>
                  <tbody>
                    {m.posiciones.map((p, i) => {
                      const b = bidAsk(m, p.sim)
                      const g = pnlPos(p, b.bid, b.ask)
                      const x = SIMBOLOS[p.sim]
                      return (
                        <tr key={p.id} className="fila" style={{ position: 'relative' }} data-guia={i === 0 ? 'pc-fila-pos' : undefined}
                          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setPantS({ t: 'menu', id: p.id }) }}
                          onDoubleClick={() => { setError(''); setPantS({ t: 'modificar', id: p.id }) }}>
                          <td>{x.nombre}</td><td>{p.id}</td><td>{hora().slice(5)}</td>
                          <td className={p.tipo === 'buy' ? 'az' : 'rj'}>{p.tipo}</td><td>{dec(p.lote, 2)}</td><td>{dec(p.entrada, x.dec)}</td>
                          <td>{p.sl != null ? dec(p.sl, x.dec) : ''}</td><td>{p.tp != null ? dec(p.tp, x.dec) : ''}</td>
                          <td>{dec(p.tipo === 'buy' ? b.bid : b.ask, x.dec)}</td>
                          <td>{dinero(p.swap || 0)}</td>
                          <td className={g >= 0 ? 'az' : 'rj'} data-guia={i === 0 ? 'pc-benef' : undefined}><b>{dinero(g)}</b></td>
                          <td style={{ position: 'relative' }}>
                            <button className={`pc-x ${F(foco === 'cerrar' && i === 0)}`} data-guia={i === 0 ? 'pc-x1' : undefined} aria-label="Cerrar orden" onClick={(e) => { e.stopPropagation(); aplicar(cerrarManual(ref.current, p.id)) }}>✕</button>
                            {pant?.t === 'menu' && pant.id === p.id && (
                              <div className="pc-menuctx" style={{ left: -190, top: 20 }} data-guia="pc-menu" onClick={(e) => e.stopPropagation()}>
                                <button data-guia="pc-menu-cerrar" onClick={() => { aplicar(cerrarManual(ref.current, p.id)); setPantS(null) }}>Cerrar orden #{p.id}</button>
                                <button data-guia="pc-menu-mod" onClick={() => { setError(''); setPantS({ t: 'modificar', id: p.id }) }}>Modificar o eliminar orden</button>
                                <button onClick={() => { setPantS(null); abrirOrden() }}>Nueva orden</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {m.pendientes.map((o) => {
                      const b = bidAsk(m, o.sim)
                      const x = SIMBOLOS[o.sim]
                      return (
                        <tr key={o.id}>
                          <td>{x.nombre}</td><td>{o.id}</td><td>{hora().slice(5)}</td><td className={o.tipo.startsWith('buy') ? 'az' : 'rj'}>{TIPOS_PENDIENTE[o.tipo].toLowerCase()}</td>
                          <td>{dec(o.lote, 2)}</td><td>{dec(o.precio, x.dec)}</td><td>{o.sl != null ? dec(o.sl, x.dec) : ''}</td><td>{o.tp != null ? dec(o.tp, x.dec) : ''}</td>
                          <td>{dec(o.tipo.startsWith('buy') ? b.ask : b.bid, x.dec)}</td><td /><td />
                          <td><button className="pc-x" aria-label="Eliminar orden" onClick={() => aplicar(cancelarPendiente(ref.current, o.id))}>✕</button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="pc-tabla">
                  <thead><tr><th>Símbolo</th><th>Ticket</th><th>Tipo</th><th>Volumen</th><th>Precio entrada</th><th>Precio salida</th><th>Beneficio</th></tr></thead>
                  <tbody>
                    {m.historial.map((h) => {
                      const x = SIMBOLOS[h.sim]
                      return <tr key={h.id}><td>{x.nombre}</td><td>{h.id}</td><td>{h.tipo}</td><td>{dec(h.lote, 2)}</td><td>{dec(h.entrada, x.dec)}</td><td>{dec(h.salida, x.dec)}</td><td className={h.gan >= 0 ? 'az' : 'rj'}><b>{dinero(h.gan)}</b></td></tr>
                    })}
                  </tbody>
                </table>
              )}
              {term === 'operaciones' && m.posiciones.length === 0 && m.pendientes.length === 0 && <div className="pc-vacio">No hay operaciones abiertas. Usa el botón "Nueva orden".</div>}
              {term === 'historial' && m.historial.length === 0 && <div className="pc-vacio">Aquí verás las operaciones que cierres.</div>}
            </div>
            <div className="pc-saldo" data-guia="pc-saldo">
              <span data-guia="pc-balance">Balance: {dinero(m.balance)} USD</span><span data-guia="pc-equidad">Equidad: {dinero(equidad)}</span><span data-guia="pc-margen-v">Margen: {dinero(usado)}</span><span data-guia="pc-libre">Margen libre: {dinero(equidad - usado)}</span>{nivelMargen(m) != null && <span data-guia="pc-nivel">Nivel de margen: {dinero(nivelMargen(m))}%</span>}
            </div>
          </div>
          <div className="pc-pie"><span>Para ayuda, pulsa F1</span><span>Simulador · precios inventados</span></div>

          {pant === 'orden' || pant?.t === 'orden' ? (
            <DialogoOrden m={m} simIni={sim} foco={foco} error={error} fn={fn} onCerrar={() => setPantS(null)} onEnviar={enviar} />
          ) : null}
          {pant?.t === 'modificar' && posSel && <DialogoModificar pos={posSel} error={error} onCerrar={() => setPantS(null)} onGuardar={guardarMod} />}
        </div>
        {enGuia && pasoG && <GuiaOverlay raiz={cont} paso={pasoG} numero={gi + 1} clave={`${gi}-${pasoG.tab}-${pasoG.pant?.t}-${esc}`} onRect={setRectG} />}
      </div>

      {enGuia && pasoG && (
        <GuiaBurbuja
          paso={pasoG} i={gi} total={tour.length} flotante={false} abajo={!!rectG}
          onSig={() => (gi < tour.length - 1 ? setGi(gi + 1) : onFinGuia?.())}
          onAnt={() => setGi(Math.max(0, gi - 1))} onSaltar={() => onFinGuia?.()}
        />
      )}

      {!enGuia && (
        <div className="objetivos">
          {objetivos.map((o) => (
            <div key={o.id} className={`obj ${hechos(o) ? 'ok' : ''}`}>
              <span className="caja">{hechos(o) && '✓'}</span>{o.texto}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
