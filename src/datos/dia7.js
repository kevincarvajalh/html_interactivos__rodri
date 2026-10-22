export default {
  n: 7,
  tema: 'Tu rutina y repaso',
  lema: 'Operar con método',
  minutos: 6,
  pasos: [
    {
      tipo: 'intro',
      objetivo: 'Operar con una rutina clara y consolidar lo aprendido.',
      aprenderas: ['Cómo manejar la tensión al operar', 'Una rutina de 3 pasos', 'Un repaso de todo el recorrido'],
    },
    {
      tipo: 'leccion', icono: 'corazon', titulo: 'La tensión es normal',
      texto: 'Es normal sentir tensión cuando hay dinero en juego: dudas, indecisión o ganas de cerrar demasiado pronto. Son reacciones habituales y se manejan con **método y práctica**.\n\nPrueba una respiración guiada: inhala cuando el círculo crece y exhala cuando se reduce.',
      visual: 'respira',
    },
    {
      tipo: 'leccion', icono: 'meta', titulo: 'Rutina de 3 pasos',
      texto: '- **1. Respira:** tres respiraciones lentas.\n- **2. Define:** instrumento, compra o venta, Stop Loss, Take Profit y volumen.\n- **3. Ejecuta y deja que el plan se cumpla:** abre la operación y deja que el SL o el TP decidan.',
    },
    {
      tipo: 'simulador', titulo: 'Practica tu rutina',
      intro: 'Respira, define y ejecuta. Luego cierra la operación cuando lo decidas.',
      guia: ['abrir', 'sltp', 'cerrar'],
      funciones: { sltp: true, pendientes: true },
      aha: 'Seguir una rutina reduce la incertidumbre. Con método, operar resulta más claro y más tranquilo.',
      objetivos: [
        { id: 'a', evento: 'abrioSLTP', foco: 'sl', texto: 'Abre una operación con SL y TP', pista: { movil: 'Respira, define tu SL y TP (con "Ayuda: sugerir") y toca "Comprar por".', escritorio: 'Respira, define tu SL y TP (con "Ayuda: sugerir") y pulsa "Comprar por mercado".' } },
        { id: 'b', evento: 'cerro', foco: 'cerrar', texto: 'Ciérrala cuando lo decidas', pista: { movil: 'En Operaciones toca tu posición → "Cerrar posición". O espera a que se alcance el SL o el TP.', escritorio: 'En Operaciones pulsa la X de tu fila. O espera a que se alcance el SL o el TP.' } },
      ],
    },
    {
      tipo: 'quiz',
      preguntas: [
        { pregunta: 'Tu operación se cerró en el Stop Loss. ¿Qué significa?', opciones: ['Que el análisis fue incorrecto', 'Que el límite de pérdida funcionó como estaba previsto'], correcta: 1, explicacion: 'Una pérdida acotada es parte normal de operar: el Stop Loss cumplió su función.' },
        { pregunta: 'Una operación salió mal y quieres recuperarte rápido. ¿Qué haces?', opciones: ['Aumento el volumen', 'Mantengo mi plan y mi gestión de riesgo'], correcta: 1, explicacion: 'Aumentar el volumen por impulso es uno de los errores más frecuentes.' },
      ],
    },
    {
      tipo: 'resumen',
      aprendiste: ['Conoces la plataforma, los instrumentos y sus cifras.', 'Sabes abrir, cerrar y proteger una operación con Stop Loss y Take Profit.', 'Cuentas con una rutina para operar con calma.'],
      calma: 'Hace una semana MetaTrader era una plataforma nueva. Hoy conoces su funcionamiento y sus cifras. Es un avance real: sigue a tu ritmo.',
    },
    {
      tipo: 'reto', titulo: 'Tarea opcional: repasa a tu ritmo',
      texto: 'Si lo deseas, repasa en tu MetaTrader lo visto esta semana: ubicar los instrumentos, abrir y cerrar una orden, definir Stop Loss y Take Profit y leer tus cifras. Anotar cómo te sentiste puede ayudarte a ver tu progreso.',
      checklist: ['Repasé lo visto esta semana', 'Anoté cómo me sentí', { t: 'Practiqué abrir una orden', cuenta: true }, { t: 'Practiqué cerrar una orden', cuenta: true }],
    },
  ],
}
