// Estructura de cada módulo: intro (objetivo) → conceptos (leccion) → práctica (simulador) → quiz → resumen → tarea opcional (reto)
// Formato de texto: párrafos con línea en blanco · "- " viñeta · **negrita** · {{término|definición}}
// Simulador: guia = secuencias de guias.js · pista puede ser texto o { movil, escritorio } · aha = tarjeta "Momento AHA"
// widget: pip | calc | cuenta (calculadoras interactivas de Widgets.jsx)
export default {
  n: 1,
  tema: 'Conoce tu plataforma',
  lema: 'Instrumentos, precios y secciones de MetaTrader',
  minutos: 5,
  pasos: [
    {
      tipo: 'intro',
      objetivo: 'Reconocer la plataforma y los precios que muestra.',
      aprenderas: ['Qué instrumentos puedes operar', 'Qué son el precio de compra (Ask) y el de venta (Bid)', 'Dónde está cada sección de MetaTrader'],
    },
    {
      tipo: 'leccion', icono: 'globo', titulo: 'Qué puedes operar',
      texto: 'MetaTrader 5 es la plataforma desde la que visualizas los precios del mercado y envías tus órdenes.\n\nCada instrumento tiene un nombre (símbolo):\n\n- **Divisas** (EURUSD, GBPUSD, USDJPY): un par de monedas.\n- **Oro** (XAUUSD): el metal precioso frente al dólar.\n- **Índices** (US30): resumen del desempeño de un grupo de empresas. El US30 agrupa a 30 grandes compañías de Estados Unidos.\n- **Criptomonedas** (BTCUSD): Bitcoin frente al dólar.',
    },
    {
      tipo: 'leccion', icono: 'libro', titulo: 'Precio de compra y precio de venta',
      texto: 'Cada instrumento muestra dos precios:\n\n- **{{Bid|Es el precio al que puedes vender.}}:** precio de venta.\n- **{{Ask|Es el precio al que puedes comprar.}}:** precio de compra.\n\nLa diferencia entre ambos se llama {{spread|Es el costo de entrada de la operación. Por eso, al abrir, verás un resultado levemente negativo. Es normal.}}.',
    },
    {
      tipo: 'simulador', titulo: 'Explora la plataforma',
      intro: 'Sigue las indicaciones para recorrer cada sección.',
      guia: ['recorrido'],
      funciones: { sltp: false, pendientes: false },
      aha: 'Abrir una operación requiere dos pasos: elegir el instrumento y confirmar. Es más simple de lo que parece.',
      objetivos: [
        { id: 'a', evento: 'cambioSimbolo', foco: 'simbolos', texto: 'Selecciona un instrumento de la lista', pista: { movil: 'En Cotizaciones, toca un instrumento, por ejemplo GBPUSD.', escritorio: 'En Observación de mercado, haz clic en otro instrumento, por ejemplo GBPUSD.' } },
        { id: 'b', evento: 'abrioForm', foco: 'nueva', texto: 'Abre la ventana de nueva orden', pista: { movil: 'Elige "Nueva orden" en el menú del instrumento, o toca el + en Operaciones.', escritorio: 'Pulsa el botón "Nueva orden" de la barra superior.' } },
        { id: 'c', evento: 'abrio', foco: 'enviar', texto: 'Abre una operación', pista: { movil: 'Deja el volumen como viene y toca "Comprar por".', escritorio: 'Deja el volumen como viene y pulsa "Comprar por mercado".' } },
      ],
    },
    {
      tipo: 'quiz',
      preguntas: [
        { pregunta: '¿Qué precio utilizas cuando quieres COMPRAR?', opciones: ['Bid', 'Ask', 'El promedio'], correcta: 1, explicacion: 'El Ask es el precio de compra.' },
        { pregunta: '¿Qué es el US30?', opciones: ['Una moneda', 'Un índice que resume a un grupo de empresas', 'Un banco'], correcta: 1, explicacion: 'Un índice es un indicador que representa el desempeño de un conjunto de empresas.' },
      ],
    },
    {
      tipo: 'resumen',
      aprendiste: ['Puedes operar divisas, oro, índices y Bitcoin.', 'El Ask es el precio de compra y el Bid el de venta.', 'Ya conoces las secciones principales de la plataforma.'],
      calma: 'Es natural sentir cautela al usar una plataforma nueva. La confianza se construye con práctica: puedes repetir el simulador cuantas veces quieras.',
    },
    {
      tipo: 'reto', titulo: 'Tarea opcional: conoce tu MetaTrader',
      texto: 'Si lo deseas, abre tu MetaTrader y recorre sus secciones: **Cotizaciones** (en computador, Observación de mercado), Gráfico y Operaciones. Cuando te sientas cómodo, puedes practicar la apertura y el cierre de una orden, preferiblemente en una cuenta demo.',
      checklist: ['Ubiqué las Cotizaciones', 'Recorrí las secciones de mi MetaTrader', { t: 'Practiqué abrir una orden', cuenta: true }, { t: 'Practiqué cerrar una orden', cuenta: true }],
    },
  ],
}
