// Guías paso a paso: cada paso señala [data-guia="target"] dentro del simulador.
// tab: pestaña (celular) o pestaña de la caja de herramientas (computador)
// pant: pantalla abierta (orden, menuPos, cerrar, modificar, detalle / menu)
// conPos: agrega una operación de ejemplo (no cuenta como práctica del cliente)
const movil = {
  recorrido: [
    { tab: 'quotes', target: 'lista', texto: 'Esta es la lista de instrumentos con sus precios en tiempo real. Cada fila es un activo que puedes operar.' },
    { tab: 'quotes', target: 'fila1', texto: 'EURUSD es el nombre del instrumento: el euro frente al dólar.' },
    { tab: 'quotes', target: 'bid1', texto: 'Este es el precio de VENTA. Se llama Bid.' },
    { tab: 'quotes', target: 'ask1', texto: 'Y este es el precio de COMPRA. Se llama Ask.' },
    { tab: 'quotes', target: 'nav-chart', texto: 'La barra inferior tiene 5 secciones. Gráfico muestra la evolución del precio.' },
    { tab: 'chart', target: 'grafico', texto: 'Cada vela representa un período de tiempo. Verde: el precio subió. Roja: el precio bajó.' },
    { tab: 'chart', target: 'nav-trade', texto: 'Operaciones es la sección donde gestionas todo lo que tienes abierto.' },
    { tab: 'trade', target: 'resumen', texto: 'Aquí ves tu saldo (Balance) y el resultado de tus operaciones abiertas.' },
    { tab: 'history', target: 'nav-history', texto: 'En Historial se registran las operaciones ya cerradas. Ese es el mapa completo de la plataforma.' },
  ],
  abrir: [
    { tab: 'trade', target: 'mas', texto: 'Para crear una orden, toca el botón más (+).' },
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-vol', texto: 'Volumen es el tamaño de la operación. Para aprender, utiliza el mínimo permitido para el instrumento.' },
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-buy', texto: 'Si esperas que el precio suba, toca "Comprar por". Así se abre la operación.' },
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-sell', texto: 'Si esperas que baje, toca "Vender por". La decisión es tuya.' },
    { tab: 'trade', conPos: true, target: 'pos1', texto: 'La operación aparece en esta lista. El número de la derecha es el resultado actual, que varía con el precio.' },
  ],
  cerrar: [
    { tab: 'trade', conPos: true, target: 'pos1', texto: 'Esta es una operación abierta. Para cerrarla, tócala.' },
    { tab: 'trade', conPos: true, pant: { t: 'menuPos' }, target: 'menu-cerrar', texto: 'Se despliega un menú. Selecciona "Cerrar posición".' },
    { tab: 'trade', conPos: true, pant: { t: 'cerrar' }, target: 'btn-cerrar', texto: 'La plataforma muestra el resultado actual. Confirma con este botón y la operación se cierra.' },
    { tab: 'history', target: 'nav-history', texto: 'Al cerrar, la operación queda registrada en Historial.' },
  ],
  sltp: [
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-sl', texto: 'Stop Loss es tu límite de pérdida. Si el precio llega a ese nivel, la operación se cierra automáticamente.' },
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-tp', texto: 'Take Profit es tu objetivo de ganancia. Al llegar a ese nivel, la operación se cierra automáticamente.' },
    { tab: 'trade', pant: { t: 'orden' }, target: 'ayuda', texto: 'Este botón de Ayuda existe solo en el simulador y completa ambos valores. En tu MetaTrader real los ingresas tú.' },
    { tab: 'trade', conPos: true, target: 'pos1', texto: 'Con la operación abierta, aquí ves tus niveles: S/L es el límite de pérdida y T/P es el objetivo de ganancia.' },
  ],
  riesgo: [
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-vol', texto: 'A mayor volumen, mayor variación del saldo por cada pip. Para aprender, conviene el mínimo.' },
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-margen', texto: 'El margen es la garantía que la plataforma reserva mientras la operación está abierta. Se libera al cerrarla.' },
    { tab: 'trade', target: 'resumen', texto: 'Aquí ves tu saldo y el margen utilizado. Si el margen libre es bajo, no podrás abrir más operaciones.' },
  ],
  pendiente: [
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-tipo', texto: 'Aquí eliges el tipo de orden. "A mercado" se ejecuta de inmediato. Las demás esperan a que el precio llegue al nivel que definas.' },
    { tab: 'trade', pant: { t: 'orden' }, target: 'ord-tipo', texto: 'Limit: esperas un precio más favorable. Stop: esperas a que el precio rompa un nivel. Eliges el tipo, ingresas el precio y la colocas.' },
    { tab: 'quotes', target: 'nav-trade', texto: 'La orden pendiente aparece en Operaciones, en la lista "Órdenes". Puedes eliminarla cuando quieras.' },
  ],
}

const escritorio = {
  recorrido: [
    { target: 'pc-obs', texto: 'Esta ventana se llama Observación de mercado: muestra los instrumentos con sus precios en tiempo real.' },
    { target: 'pc-fila1', texto: 'EURUSD es el nombre del instrumento: el euro frente al dólar.' },
    { target: 'pc-bid1', texto: 'Este es el precio de VENTA. Se llama Bid.' },
    { target: 'pc-ask1', texto: 'Y este es el precio de COMPRA. Se llama Ask.' },
    { target: 'pc-grafico', texto: 'Aquí está el gráfico. Cada vela representa un período de tiempo. Verde: el precio subió. Roja: el precio bajó.' },
    { tab: 'operaciones', target: 'pc-term', texto: 'Abajo está la Caja de herramientas. En la pestaña Operaciones ves lo que tienes abierto.' },
    { tab: 'operaciones', target: 'pc-saldo', texto: 'Esta franja muestra tu Balance (saldo), tu Equidad y tu Margen.' },
    { tab: 'historial', target: 'pc-tab-hist', texto: 'En Historial se registran las operaciones ya cerradas. Ese es el mapa completo de la plataforma.' },
  ],
  abrir: [
    { target: 'pc-nueva', texto: 'Para crear una orden, pulsa "Nueva orden".' },
    { pant: { t: 'orden' }, target: 'pc-vol', texto: 'Volumen es el tamaño de la operación. Para aprender, utiliza el mínimo permitido para el instrumento.' },
    { pant: { t: 'orden' }, target: 'pc-buy', texto: 'Si esperas que el precio suba, pulsa "Comprar por mercado". Así se abre la operación.' },
    { pant: { t: 'orden' }, target: 'pc-sell', texto: 'Si esperas que baje, pulsa "Vender por mercado". La decisión es tuya.' },
    { tab: 'operaciones', conPos: true, target: 'pc-fila-pos', texto: 'La operación aparece en la pestaña Operaciones de la Caja de herramientas.' },
  ],
  cerrar: [
    { tab: 'operaciones', conPos: true, target: 'pc-benef', texto: 'Esta es una operación abierta. La columna Beneficio muestra el resultado actual.' },
    { tab: 'operaciones', conPos: true, target: 'pc-x1', texto: 'Para cerrarla, pulsa la X al final de la fila.' },
    { tab: 'operaciones', conPos: true, pant: { t: 'menu' }, target: 'pc-menu-cerrar', texto: 'También puedes hacer clic derecho sobre la fila y elegir "Cerrar orden".' },
    { tab: 'historial', target: 'pc-tab-hist', texto: 'Al cerrar, la operación queda registrada en Historial.' },
  ],
  sltp: [
    { pant: { t: 'orden' }, target: 'pc-sl', texto: 'Stop Loss es tu límite de pérdida. Si el precio llega a ese nivel, la operación se cierra automáticamente.' },
    { pant: { t: 'orden' }, target: 'pc-tp', texto: 'Take Profit es tu objetivo de ganancia. Al llegar a ese nivel, la operación se cierra automáticamente.' },
    { pant: { t: 'orden' }, target: 'pc-ayuda', texto: 'Este botón de Ayuda existe solo en el simulador y completa ambos valores. En tu MetaTrader real los ingresas tú.' },
    { tab: 'operaciones', conPos: true, target: 'pc-fila-pos', texto: 'Con la operación abierta, las columnas S/L y T/P muestran tu límite de pérdida y tu objetivo de ganancia.' },
  ],
  riesgo: [
    { pant: { t: 'orden' }, target: 'pc-vol', texto: 'A mayor volumen, mayor variación del saldo por cada pip. Para aprender, conviene el mínimo.' },
    { pant: { t: 'orden' }, target: 'pc-margen', texto: 'El margen es la garantía que la plataforma reserva mientras la operación está abierta. Se libera al cerrarla.' },
    { tab: 'operaciones', target: 'pc-saldo', texto: 'Aquí ves tu saldo y tu margen libre. Si el margen libre es bajo, no podrás abrir más operaciones.' },
  ],
  pendiente: [
    { pant: { t: 'orden' }, target: 'pc-tipo', texto: 'Aquí eliges el tipo de orden. "A mercado" se ejecuta de inmediato. Las demás esperan a que el precio llegue al nivel que definas.' },
    { pant: { t: 'orden' }, target: 'pc-tipo', texto: 'Limit: esperas un precio más favorable. Stop: esperas a que el precio rompa un nivel. Eliges el tipo, ingresas el precio y la colocas.' },
    { tab: 'operaciones', target: 'pc-term', texto: 'La orden pendiente aparece en la lista de Operaciones. Puedes eliminarla con la X cuando quieras.' },
  ],
}

// Las cifras de la plataforma (usa una operación de ejemplo con swap)
movil.numeros = [
  { tab: 'trade', conPos: true, target: 'm-benef', texto: 'Esta cifra grande es el resultado conjunto de todas tus operaciones abiertas.' },
  { tab: 'trade', conPos: true, target: 'm-balance', texto: 'Balance: tu saldo. Solo cambia cuando cierras una operación.' },
  { tab: 'trade', conPos: true, target: 'm-equidad', texto: 'Equidad: el valor de tu cuenta si cerraras todo ahora. Es el Balance más el resultado de las operaciones abiertas.' },
  { tab: 'trade', conPos: true, target: 'm-margen', texto: 'Margen: la garantía que la plataforma reserva mientras tu operación está abierta. Se libera al cerrar.' },
  { tab: 'trade', conPos: true, target: 'm-libre', texto: 'Margen libre: los fondos que te quedan disponibles para abrir nuevas operaciones. Es la Equidad menos el Margen.' },
  { tab: 'trade', conPos: true, target: 'm-nivel', texto: 'Nivel de margen: indica qué tan holgada está tu cuenta. Mientras más alto, mayor holgura.' },
  { tab: 'trade', conPos: true, target: 'pos-l1', texto: 'Esta línea indica el instrumento, si compraste (buy) o vendiste (sell), y el volumen.' },
  { tab: 'trade', conPos: true, target: 'pos-precios', texto: 'El primer precio es el de entrada. Después de la flecha, el precio actual.' },
  { tab: 'trade', conPos: true, target: 'pos-sltp', texto: 'S/L es tu límite de pérdida y T/P es tu objetivo de ganancia.' },
  { tab: 'trade', conPos: true, pant: { t: 'detalle' }, target: 'det-swap', texto: 'Swap: cargo (o abono) por mantener la operación abierta de un día para otro. Si la cierras el mismo día, no se aplica.' },
  { tab: 'trade', conPos: true, pant: { t: 'detalle' }, target: 'det-benef', texto: 'Beneficio: el resultado de esta operación en particular.' },
]
escritorio.numeros = [
  { tab: 'operaciones', conPos: true, target: 'pc-balance', texto: 'Balance: tu saldo. Solo cambia cuando cierras una operación.' },
  { tab: 'operaciones', conPos: true, target: 'pc-equidad', texto: 'Equidad: el valor de tu cuenta si cerraras todo ahora. Es el Balance más el resultado de las operaciones abiertas.' },
  { tab: 'operaciones', conPos: true, target: 'pc-margen-v', texto: 'Margen: la garantía que la plataforma reserva mientras tu operación está abierta. Se libera al cerrar.' },
  { tab: 'operaciones', conPos: true, target: 'pc-libre', texto: 'Margen libre: los fondos que te quedan disponibles para abrir nuevas operaciones. Es la Equidad menos el Margen.' },
  { tab: 'operaciones', conPos: true, target: 'pc-nivel', texto: 'Nivel de margen: indica qué tan holgada está tu cuenta. Mientras más alto, mayor holgura.' },
  { tab: 'operaciones', conPos: true, target: 'pc-th-vol', texto: 'Volumen: el tamaño de tu operación, también llamado lote.' },
  { tab: 'operaciones', conPos: true, target: 'pc-th-ent', texto: 'Este primer Precio es el precio de entrada.' },
  { tab: 'operaciones', conPos: true, target: 'pc-th-act', texto: 'Este segundo Precio es el precio actual.' },
  { tab: 'operaciones', conPos: true, target: 'pc-th-sl', texto: 'S/L es tu límite de pérdida y T/P es tu objetivo de ganancia.' },
  { tab: 'operaciones', conPos: true, target: 'pc-th-swap', texto: 'Swap: cargo (o abono) por mantener la operación abierta de un día para otro. Si la cierras el mismo día, no se aplica.' },
  { tab: 'operaciones', conPos: true, target: 'pc-th-benef', texto: 'Beneficio: el resultado de esta operación en particular.' },
]

export const GUIAS = { movil, escritorio }

// Une varias guías (p. ej. ['abrir', 'cerrar']) en una sola secuencia
export const armarGuia = (disp, nombres = []) => nombres.flatMap((n) => GUIAS[disp][n] || [])
