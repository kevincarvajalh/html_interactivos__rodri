export default {
  n: 4,
  tema: 'Stop Loss y Take Profit',
  lema: 'Define tu riesgo antes de operar',
  minutos: 5,
  pasos: [
    {
      tipo: 'intro',
      objetivo: 'Limitar el riesgo antes de operar.',
      aprenderas: ['Qué es el Stop Loss', 'Qué es el Take Profit', 'Cuánto arriesgar por operación'],
    },
    {
      tipo: 'leccion', icono: 'escudo', titulo: 'Stop Loss y Take Profit',
      texto: '- **Stop Loss (SL):** cierra automáticamente la operación si el precio se mueve en tu contra hasta un nivel definido. Limita la pérdida máxima.\n- **Take Profit (TP):** cierra automáticamente la operación al alcanzar tu objetivo de ganancia.\n\nAmbos se definen en la ventana de nueva orden, antes de abrir la operación.',
      visual: 'niveles',
    },
    {
      tipo: 'leccion', icono: 'balanza', titulo: 'Cuánto arriesgar',
      texto: 'Una pauta habitual es no arriesgar más de **1% a 2%** del saldo en una sola operación.\n\nDe ese modo, una secuencia de operaciones desfavorables no compromete tu capital y puedes seguir aprendiendo.',
      visual: 'riesgo',
    },
    {
      tipo: 'simulador', titulo: 'Opera con Stop Loss y Take Profit',
      intro: 'Abre una operación con ambos niveles y revisa cuánto arriesgas.',
      guia: ['sltp', 'riesgo'],
      funciones: { sltp: true, pendientes: false },
      aha: 'El riesgo máximo queda definido antes de abrir la operación. Eso aporta mucha claridad.',
      objetivos: [
        { id: 'a', evento: 'abrioSLTP', foco: 'sl', texto: 'Abre una operación con Stop Loss y Take Profit', pista: { movil: 'Toca +, usa "Ayuda: sugerir SL y TP" y toca "Comprar por".', escritorio: 'Pulsa "Nueva orden", usa "Ayuda: sugerir" y pulsa "Comprar por mercado".' } },
        { id: 'b', evento: 'riesgoOk', foco: 'sl', texto: 'Mantén el riesgo en 2% o menos', pista: { movil: 'Con "Ayuda: sugerir", el riesgo queda en 1%.', escritorio: 'Con "Ayuda: sugerir", el riesgo queda en 1%.' } },
      ],
    },
    {
      tipo: 'quiz',
      preguntas: [
        { pregunta: '¿Para qué sirve el Stop Loss?', opciones: ['Para garantizar ganancias', 'Para limitar la pérdida máxima', 'Para abrir más operaciones'], correcta: 1, explicacion: 'Define de antemano la pérdida máxima que estás dispuesto a asumir.' },
        { pregunta: '¿Qué hace el Take Profit?', opciones: ['Cierra la operación al alcanzar el objetivo de ganancia', 'Aumenta el volumen'], correcta: 0, explicacion: 'Cierra la operación automáticamente cuando el precio llega al nivel definido.' },
        { pregunta: '¿Qué pauta de riesgo es habitual al aprender?', opciones: ['1% a 2% del saldo', '50% del saldo', 'Todo el saldo'], correcta: 0, explicacion: 'Un riesgo reducido permite resistir una racha desfavorable y seguir aprendiendo.' },
      ],
    },
    {
      tipo: 'resumen',
      aprendiste: ['El Stop Loss limita la pérdida máxima de una operación.', 'El Take Profit cierra la operación al alcanzar tu objetivo.', 'Una pauta habitual es arriesgar entre 1% y 2% del saldo por operación.'],
      calma: 'Gran parte de la ansiedad proviene de la incertidumbre: "¿cuánto puedo perder?". Con un Stop Loss, esa pregunta tiene respuesta antes de operar.',
    },
    {
      tipo: 'reto', titulo: 'Tarea opcional: ubica el Stop Loss y el Take Profit',
      texto: 'Si lo deseas, revisa en tu MetaTrader dónde se ingresan el **Stop Loss** y el **Take Profit** al crear una orden. Puedes practicar con el volumen mínimo del activo y, si prefieres, en una cuenta demo.',
      checklist: ['Ubiqué los campos Stop Loss y Take Profit', { t: 'Practiqué abrir una orden', cuenta: true }, { t: 'Practiqué cerrar una orden', cuenta: true }],
    },
  ],
}
