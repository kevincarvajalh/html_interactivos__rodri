// Motor del simulador de práctica (precios inventados, NO dinero real).
// loteMin: volumen mínimo en el broker (divisas y oro 0.1; BTCUSD 0.01)
// valorPip: USD por pip por 1.00 lote · vol: pips por tick · sugPips: distancia del SL/TP sugerido
export const SIMBOLOS = {
  EURUSD: { nombre: 'EURUSD', desc: 'Euro vs US Dollar', pip: 0.0001, dec: 5, base: 1.085, spread: 1.2, contrato: 100000, loteMin: 0.1, valorPip: 10, vol: 4, sugPips: 10, unidad: 'pips' },
  GBPUSD: { nombre: 'GBPUSD', desc: 'Great Britain Pound vs US Dollar', pip: 0.0001, dec: 5, base: 1.27, spread: 1.5, contrato: 100000, loteMin: 0.1, valorPip: 10, vol: 4, sugPips: 10, unidad: 'pips' },
  USDJPY: { nombre: 'USDJPY', desc: 'US Dollar vs Japanese Yen', pip: 0.01, dec: 3, base: 150.2, spread: 1.4, contrato: 100000, usdBase: true, loteMin: 0.1, valorPip: 10, vol: 4, sugPips: 10, unidad: 'pips' },
  XAUUSD: { nombre: 'XAUUSD', desc: 'Gold vs US Dollar', pip: 0.1, dec: 2, base: 2350, spread: 3, contrato: 100, loteMin: 0.1, valorPip: 10, vol: 4, sugPips: 10, unidad: 'pips' },
  US30: { nombre: 'US30', desc: 'Wall Street 30 (índice)', pip: 1, dec: 1, base: 39000, spread: 2, contrato: 1, loteMin: 0.1, valorPip: 1, vol: 8, sugPips: 30, unidad: 'puntos' },
  BTCUSD: { nombre: 'BTCUSD', desc: 'Bitcoin vs US Dollar', pip: 1, dec: 2, base: 65000, spread: 30, contrato: 1, loteMin: 0.01, valorPip: 1, vol: 40, sugPips: 300, unidad: 'dólares' },
}
export const SALDO_INICIAL = 1000
export const APALANCAMIENTO = 100
export const TIPOS_PENDIENTE = {
  buyLimit: 'Buy Limit',
  sellLimit: 'Sell Limit',
  buyStop: 'Buy Stop',
  sellStop: 'Sell Stop',
}

const dentro = (n, d) => Number(n.toFixed(d))

export function mundoInicial() {
  const precios = {}
  const hist = {}
  for (const [id, s] of Object.entries(SIMBOLOS)) {
    let p = s.base
    const h = []
    for (let i = 0; i < 120; i++) {
      p += (Math.random() - 0.5) * s.vol * s.pip + (s.base - p) * 0.02
      h.push(p)
    }
    precios[id] = p
    hist[id] = h
  }
  return { precios, hist, posiciones: [], pendientes: [], balance: SALDO_INICIAL, cerradas: 0, historial: [], eventos: {}, seq: 1, ticks: 120 }
}

export function bidAsk(m, id) {
  const s = SIMBOLOS[id]
  const mid = m.precios[id]
  const mitad = (s.spread * s.pip) / 2
  return { bid: mid - mitad, ask: mid + mitad }
}

export function pnlPos(p, bid, ask) {
  const s = SIMBOLOS[p.sim]
  const dif = p.tipo === 'buy' ? bid - p.entrada : p.entrada - ask
  return (dif / s.pip) * p.lote * s.valorPip
}

export function margenPos(sim, lote, precio) {
  const s = SIMBOLOS[sim]
  const nocional = s.usdBase ? lote * s.contrato : lote * s.contrato * precio
  return nocional / APALANCAMIENTO
}

export function margenUsado(m) {
  return m.posiciones.reduce((t, p) => t + margenPos(p.sim, p.lote, p.entrada), 0)
}

export function flotante(m) {
  return m.posiciones.reduce((t, p) => {
    const { bid, ask } = bidAsk(m, p.sim)
    return t + pnlPos(p, bid, ask) + (p.swap || 0)
  }, 0)
}

function cerrarEn(m, pos, precioSalida) {
  const s = SIMBOLOS[pos.sim]
  const dif = pos.tipo === 'buy' ? precioSalida - pos.entrada : pos.entrada - precioSalida
  const gan = (dif / s.pip) * pos.lote * s.valorPip
  return {
    ...m,
    posiciones: m.posiciones.filter((x) => x.id !== pos.id),
    balance: m.balance + gan,
    cerradas: m.cerradas + 1,
    historial: [{ id: pos.id, sim: pos.sim, tipo: pos.tipo, lote: pos.lote, entrada: pos.entrada, salida: precioSalida, gan, hora: Date.now() }, ...m.historial],
  }
}

function aplicarNiveles(m) {
  let n = m
  for (const p of m.posiciones) {
    const { bid, ask } = bidAsk(n, p.sim)
    const ref = p.tipo === 'buy' ? bid : ask
    const tocaSL = p.sl != null && (p.tipo === 'buy' ? ref <= p.sl : ref >= p.sl)
    const tocaTP = p.tp != null && (p.tipo === 'buy' ? ref >= p.tp : ref <= p.tp)
    if (tocaSL || tocaTP) {
      n = cerrarEn(n, p, tocaSL ? p.sl : p.tp)
      n = { ...n, eventos: { ...n.eventos, cerroAuto: true } }
    }
  }
  for (const o of m.pendientes) {
    const { bid, ask } = bidAsk(n, o.sim)
    const activa =
      (o.tipo === 'buyLimit' && ask <= o.precio) ||
      (o.tipo === 'sellLimit' && bid >= o.precio) ||
      (o.tipo === 'buyStop' && ask >= o.precio) ||
      (o.tipo === 'sellStop' && bid <= o.precio)
    if (activa) {
      const pos = { id: o.id, sim: o.sim, tipo: o.tipo.startsWith('buy') ? 'buy' : 'sell', lote: o.lote, entrada: o.precio, sl: o.sl, tp: o.tp }
      n = {
        ...n,
        pendientes: n.pendientes.filter((x) => x.id !== o.id),
        posiciones: [...n.posiciones, pos],
        eventos: { ...n.eventos, pendienteActiva: true },
      }
    }
  }
  return n
}

export function paso(m) {
  const precios = {}
  const hist = {}
  for (const [id, s] of Object.entries(SIMBOLOS)) {
    const prev = m.precios[id]
    const nuevo = prev + (Math.random() - 0.5) * s.vol * s.pip + (s.base - prev) * 0.01
    precios[id] = nuevo
    hist[id] = [...m.hist[id].slice(-119), nuevo]
  }
  return aplicarNiveles({ ...m, precios, hist, ticks: m.ticks + 1 })
}

// Distancia mínima aceptada para SL/TP/precio (pips)
const MIN_PIPS = 3

function numero(v) {
  if (v === '' || v == null) return null
  const n = Number(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : NaN
}

export function riesgoUSD(sim, entrada, sl, lote) {
  const s = SIMBOLOS[sim]
  return (Math.abs(entrada - sl) / s.pip) * lote * s.valorPip
}

// Valida y abre una operación a mercado o deja una orden pendiente.
// d = { sim, lado:'buy'|'sell', tipo:'mercado'|'buyLimit'..., lote, precio, sl, tp }
export function enviarOrden(m, d) {
  const s = SIMBOLOS[d.sim]
  const lote = numero(d.lote)
  const min = s.loteMin
  if (!lote || Number.isNaN(lote)) return { error: 'Escribe el volumen con números, por ejemplo ' + min + '.' }
  if (lote < min - 1e-9) return { error: 'En ' + s.nombre + ' el volumen mínimo es ' + min + '. Aumenta el volumen hasta el mínimo.' }
  if (lote > 1) return { error: 'Para practicar, el volumen máximo es 1.00.' }
  const sl = numero(d.sl)
  const tp = numero(d.tp)
  if (Number.isNaN(sl) || Number.isNaN(tp)) return { error: 'Escribe solo números en Stop Loss y Take Profit.' }
  const { bid, ask } = bidAsk(m, d.sim)
  const pendiente = d.tipo !== 'mercado'
  const lado = pendiente ? (d.tipo.startsWith('buy') ? 'buy' : 'sell') : d.lado
  let entrada
  if (pendiente) {
    entrada = numero(d.precio)
    if (entrada == null || Number.isNaN(entrada)) return { error: 'Escribe el precio al que quieres que se active.' }
    const ok =
      (d.tipo === 'buyLimit' && entrada <= ask - MIN_PIPS * s.pip) ||
      (d.tipo === 'sellLimit' && entrada >= bid + MIN_PIPS * s.pip) ||
      (d.tipo === 'buyStop' && entrada >= ask + MIN_PIPS * s.pip) ||
      (d.tipo === 'sellStop' && entrada <= bid - MIN_PIPS * s.pip)
    if (!ok) {
      const regla = {
        buyLimit: 'Buy Limit va DEBAJO del precio actual.',
        sellLimit: 'Sell Limit va ENCIMA del precio actual.',
        buyStop: 'Buy Stop va ENCIMA del precio actual.',
        sellStop: 'Sell Stop va DEBAJO del precio actual.',
      }[d.tipo]
      return { error: `${regla} Déjalo al menos ${MIN_PIPS} pips alejado.` }
    }
  } else {
    entrada = lado === 'buy' ? ask : bid
  }
  const minimo = MIN_PIPS * s.pip
  if (sl != null) {
    if (lado === 'buy' ? sl > entrada - minimo : sl < entrada + minimo)
      return { error: lado === 'buy' ? 'En una compra, el Stop Loss va DEBAJO del precio de entrada.' : 'En una venta, el Stop Loss va ENCIMA del precio de entrada.' }
  }
  if (tp != null) {
    if (lado === 'buy' ? tp < entrada + minimo : tp > entrada - minimo)
      return { error: lado === 'buy' ? 'En una compra, el Take Profit va ENCIMA del precio de entrada.' : 'En una venta, el Take Profit va DEBAJO del precio de entrada.' }
  }
  const id = m.seq
  const evento = { ...m.eventos }
  const nivel = { sl: sl ?? null, tp: tp ?? null }
  if (nivel.sl != null && nivel.tp != null) evento.abrioSLTP = true
  if (nivel.sl != null && (riesgoUSD(d.sim, entrada, nivel.sl, lote) / m.balance) * 100 <= 2) evento.riesgoOk = true
  if (pendiente) {
    evento.pendiente = true
    return {
      m: { ...m, seq: id + 1, eventos: evento, pendientes: [...m.pendientes, { id, sim: d.sim, tipo: d.tipo, lote, precio: entrada, ...nivel }] },
    }
  }
  const libre = m.balance + flotante(m) - margenUsado(m)
  if (margenPos(d.sim, lote, entrada) > libre) return { error: 'No tienes margen suficiente para ese volumen. Baja el volumen al mínimo (' + min + ').' }
  evento.abrio = true
  evento['abrio_' + d.sim] = true
  if (Math.abs(lote - min) < 1e-9) evento.abrioMinimo = true
  return {
    m: { ...m, seq: id + 1, eventos: evento, posiciones: [...m.posiciones, { id, sim: d.sim, tipo: lado, lote, entrada: dentro(entrada, s.dec), ...nivel }] },
  }
}

export function cerrarManual(m, id) {
  const pos = m.posiciones.find((p) => p.id === id)
  if (!pos) return m
  const { bid, ask } = bidAsk(m, pos.sim)
  const n = cerrarEn(m, pos, pos.tipo === 'buy' ? bid : ask)
  return { ...n, eventos: { ...n.eventos, cerro: true } }
}

export function modificar(m, id, slV, tpV) {
  const p = m.posiciones.find((x) => x.id === id)
  if (!p) return { error: 'No encontramos esa operación.' }
  const s = SIMBOLOS[p.sim]
  const sl = numero(slV)
  const tp = numero(tpV)
  if (Number.isNaN(sl) || Number.isNaN(tp)) return { error: 'Escribe solo números en Stop Loss y Take Profit.' }
  const { bid, ask } = bidAsk(m, p.sim)
  const ref = p.tipo === 'buy' ? bid : ask
  const min = MIN_PIPS * s.pip
  if (sl != null && (p.tipo === 'buy' ? sl > ref - min : sl < ref + min))
    return { error: p.tipo === 'buy' ? 'En una compra, el Stop Loss va DEBAJO del precio actual.' : 'En una venta, el Stop Loss va ENCIMA del precio actual.' }
  if (tp != null && (p.tipo === 'buy' ? tp < ref + min : tp > ref - min))
    return { error: p.tipo === 'buy' ? 'En una compra, el Take Profit va ENCIMA del precio actual.' : 'En una venta, el Take Profit va DEBAJO del precio actual.' }
  const evento = { ...m.eventos, modifico: true }
  if (sl != null && tp != null) evento.abrioSLTP = true
  return { m: { ...m, eventos: evento, posiciones: m.posiciones.map((x) => (x.id === id ? { ...x, sl, tp } : x)) } }
}

export function cancelarPendiente(m, id) {
  return { ...m, pendientes: m.pendientes.filter((o) => o.id !== id) }
}

// Agrupa ticks en velas alineadas al contador global (las velas no "saltan" al avanzar el tiempo).
export function velas(hist, ticks, agrupar = 3, max = 30) {
  const inicio = (((agrupar - ((ticks - hist.length) % agrupar)) % agrupar) + agrupar) % agrupar
  const v = []
  for (let i = inicio; i < hist.length; i += agrupar) {
    const g = hist.slice(i, i + agrupar)
    v.push({ o: g[0], c: g[g.length - 1], h: Math.max(...g), l: Math.min(...g) })
  }
  return v.slice(-max)
}

// Posición de ejemplo para las guías (no cuenta como práctica del cliente)
export function posicionDemo(m, sim = 'EURUSD') {
  const s = SIMBOLOS[sim]
  const { ask } = bidAsk(m, sim)
  const d = s.sugPips * s.pip
  const pos = { id: m.seq, sim, tipo: 'buy', lote: s.loteMin, entrada: Number(ask.toFixed(s.dec)), sl: Number((ask - d).toFixed(s.dec)), tp: Number((ask + 2 * d).toFixed(s.dec)), swap: Number((-3.5 * s.loteMin).toFixed(2)) }
  return { ...m, seq: m.seq + 1, posiciones: [...m.posiciones, pos] }
}

// Nivel de margen (%) = equidad / margen usado · MetaTrader lo muestra cuando hay operaciones abiertas
export function nivelMargen(m) {
  const usado = margenUsado(m)
  return usado > 0 ? ((m.balance + flotante(m)) / usado) * 100 : null
}
