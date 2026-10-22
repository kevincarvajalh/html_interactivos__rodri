export default {
  n: 6,
  tema: 'Órdenes pendientes',
  lema: 'Programa tu entrada con anticipación',
  minutos: 5,
  pasos: [
    {
      tipo: 'intro',
      objetivo: 'Programar una orden para que se active sola.',
      aprenderas: ['Qué es una orden pendiente', 'Qué diferencia hay entre Limit y Stop', 'Cómo programar y eliminar una orden'],
    },
    {
      tipo: 'leccion', icono: 'reloj', titulo: 'Qué es una orden pendiente',
      texto: 'Una {{orden pendiente|Es una orden programada que se activa automáticamente cuando el precio alcanza el nivel que definiste.}} se ejecuta de forma automática cuando el precio llega al nivel que elegiste.\n\nTe permite definir tu entrada con calma, sin necesidad de observar la pantalla de forma permanente.',
    },
    {
      tipo: 'leccion', icono: 'libro', titulo: 'Limit y Stop',
      texto: '- **Buy Limit:** compra a un precio inferior al actual, anticipando un retroceso.\n- **Sell Limit:** venta a un precio superior al actual.\n- **Buy Stop:** compra si el precio rompe un nivel al alza.\n- **Sell Stop:** venta si el precio rompe un nivel a la baja.',
      visual: 'pendientes',
    },
    {
      tipo: 'simulador', titulo: 'Programa una orden pendiente',
      intro: 'Elige el tipo de orden e ingresa el precio de activación.',
      guia: ['pendiente'],
      funciones: { sltp: true, pendientes: true },
      aha: 'La orden quedó programada sin necesidad de vigilar el mercado. La plataforma la ejecuta por ti.',
      objetivos: [
        { id: 'a', evento: 'pendiente', foco: 'nueva', texto: 'Programa una orden pendiente', pista: { movil: 'Toca +, cambia el tipo a Buy Limit y toca "Colocar orden".', escritorio: 'Pulsa "Nueva orden", cambia el tipo a Buy Limit y pulsa "Colocar".' } },
      ],
    },
    {
      tipo: 'quiz',
      preguntas: [
        { pregunta: 'Quieres comprar si el precio baja hasta un nivel más económico. ¿Qué orden usas?', opciones: ['Buy Limit', 'Buy Stop', 'Sell Limit'], correcta: 0, explicacion: 'Buy Limit compra a un precio inferior al actual.' },
        { pregunta: 'Si el precio no llega al nivel definido, ¿qué ocurre?', opciones: ['Se ejecuta de todos modos', 'Permanece pendiente hasta que se active o se elimine'], correcta: 1, explicacion: 'No se ejecuta hasta que el precio alcance el nivel.' },
      ],
    },
    {
      tipo: 'resumen',
      aprendiste: ['Una orden pendiente se activa cuando el precio llega al nivel definido.', 'Limit busca un precio más favorable; Stop espera una ruptura.', 'Puedes eliminarla mientras no se haya activado.'],
      calma: 'Definir la entrada con anticipación permite decidir con calma y evita reaccionar bajo presión. La plataforma ejecuta el plan por ti.',
    },
    {
      tipo: 'reto', titulo: 'Tarea opcional: ubica las órdenes pendientes',
      texto: 'Si quieres seguir explorando, revisa en tu MetaTrader dónde se selecciona el tipo de orden (a mercado, Limit o Stop) y cómo se programa. Puedes dejarla activa o eliminarla cuando lo desees.',
      checklist: ['Ubiqué dónde elegir el tipo de orden', 'Programé una orden pendiente de práctica', { t: 'Practiqué abrir una orden', cuenta: true }, { t: 'Practiqué cerrar una orden', cuenta: true }],
    },
  ],
}
