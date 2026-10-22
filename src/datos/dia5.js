export default {
  n: 5,
  tema: 'Los números de tu cuenta',
  lema: 'Balance, equidad y margen explicados',
  minutos: 6,
  pasos: [
    {
      tipo: 'intro',
      objetivo: 'Leer con claridad las cifras de tu cuenta.',
      aprenderas: ['Qué son el balance y la equidad', 'Qué son el margen, el margen libre y el nivel de margen', 'Qué es el swap'],
    },
    {
      tipo: 'leccion', icono: 'cartera', titulo: 'Balance y equidad',
      texto: '- **Balance:** tu saldo, sin contar las operaciones abiertas.\n- **Equidad:** el valor de tu cuenta si cerraras todo en este momento.\n\nLa equidad es el balance más el resultado flotante de las operaciones abiertas. Sin operaciones abiertas, ambos coinciden.\n\nExperimenta con la cuenta y selecciona cada cifra para ver su significado.',
      widget: 'cuenta',
    },
    {
      tipo: 'leccion', icono: 'balanza', titulo: 'Margen y margen libre',
      texto: '- **Margen:** garantía que la plataforma reserva mientras una operación está abierta.\n- **Margen libre:** fondos disponibles para abrir nuevas operaciones.\n- **Nivel de margen:** relación entre la equidad y el margen; indica qué tan holgada está la cuenta.\n\nEl {{apalancamiento|Permite operar un volumen mayor al capital disponible. Por eso la plataforma reserva un margen como garantía.}} permite operar posiciones mayores que tu capital, y por eso se reserva un margen. A mayor volumen, mayor margen.',
    },
    {
      tipo: 'leccion', icono: 'reloj', titulo: 'El swap',
      texto: 'El **{{swap|Es un cargo o abono por mantener una operación abierta más allá de la hora de cierre diario. Puede ser negativo o positivo.}}** es un cargo (o a veces un abono) por mantener una operación abierta de un día para otro.\n\nSi abres y cierras el mismo día, no se aplica swap. Lo verás en la columna **Swap** de la tabla de operaciones.',
    },
    {
      tipo: 'simulador', titulo: 'Observa las cifras en la plataforma',
      intro: 'Abre una operación, observa cómo cambian las cifras y ciérrala.',
      guia: ['numeros'],
      funciones: { sltp: false, pendientes: false },
      aha: 'Al cerrar la operación, el balance se actualizó. Cada cifra de la plataforma tiene un origen claro.',
      objetivos: [
        { id: 'a', evento: 'abrio', foco: 'nueva', texto: 'Abre una operación y observa sus cifras', pista: { movil: 'En Operaciones toca el + y elige "Comprar por". Luego observa Equidad y Margen.', escritorio: 'Pulsa "Nueva orden" y "Comprar por mercado". Luego observa Equidad y Margen en la parte inferior.' } },
        { id: 'b', evento: 'cerro', foco: 'cerrar', texto: 'Ciérrala y observa cómo cambia el balance', pista: { movil: 'En Operaciones toca tu posición → "Cerrar posición".', escritorio: 'En Operaciones pulsa la X de tu fila.' } },
      ],
    },
    {
      tipo: 'quiz',
      preguntas: [
        { pregunta: 'Una operación abierta va ganando. ¿Qué cifra cambia primero?', opciones: ['Balance', 'Equidad'], correcta: 1, explicacion: 'La equidad incluye el resultado flotante; el balance cambia al cerrar.' },
        { pregunta: '¿Qué es el margen?', opciones: ['Una garantía que reserva la plataforma', 'Una comisión por operar'], correcta: 0, explicacion: 'Se reserva mientras la operación está abierta y se libera al cerrar.' },
        { pregunta: '¿Cuándo se aplica el swap?', opciones: ['Al mantener la operación abierta de un día para otro', 'Siempre, apenas abro'], correcta: 0, explicacion: 'El swap se aplica al pasar el cierre diario con la operación abierta.' },
      ],
    },
    {
      tipo: 'resumen',
      aprendiste: ['Balance es tu saldo; equidad es tu saldo más el resultado de lo abierto.', 'El margen es la garantía reservada; el margen libre, lo disponible.', 'El swap se aplica al mantener una operación abierta de un día para otro.'],
      calma: 'Ante una cifra que no reconozcas, pregúntate si corresponde a tu saldo o a la garantía reservada. No necesitas memorizarlas: basta con saber dónde consultarlas.',
    },
    {
      tipo: 'reto', titulo: 'Tarea opcional: ubica tus cifras',
      texto: 'Si lo deseas, revisa en tu MetaTrader tu balance, equidad, margen y margen libre, y busca la columna Swap. El objetivo es que las reconozcas.',
      checklist: ['Ubiqué mi balance y mi equidad', 'Ubiqué el margen y el margen libre', 'Ubiqué la columna Swap', { t: 'Practiqué abrir una orden', cuenta: true }, { t: 'Practiqué cerrar una orden', cuenta: true }],
    },
  ],
}
