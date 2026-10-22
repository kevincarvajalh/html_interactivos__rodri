export default {
  n: 3,
  tema: 'Pips, puntos y volumen',
  lema: 'Las unidades que miden tu resultado',
  minutos: 6,
  pasos: [
    {
      tipo: 'intro',
      objetivo: 'Medir el movimiento del precio y entender el volumen.',
      aprenderas: ['Qué es un pip y qué es un punto', 'Qué es el volumen (lote) y cuál es el mínimo', 'Cómo calcular cuánto varía tu saldo'],
    },
    {
      tipo: 'leccion', icono: 'regla', titulo: 'El pip: la unidad de medida',
      texto: 'El **{{pip|Es la unidad mínima con la que se mide el movimiento del precio. En EURUSD corresponde al cuarto decimal.}}** es la unidad con la que se mide cuánto se mueve un precio. Usa los botones y observa el dígito destacado.\n\nEn los **índices** (como el US30) la unidad es el **punto**: si pasa de 39 000 a 39 050, se movió 50 puntos. En **Bitcoin**, cada dólar de variación equivale a 1 pip.',
      widget: 'pip',
    },
    {
      tipo: 'leccion', icono: 'calculadora', titulo: 'El volumen: cuánto vale cada pip',
      texto: 'El **volumen**, también llamado **lote**, es el tamaño de la operación y determina **cuánto vale cada pip**.\n\n**pips × valor del pip × volumen = variación de tu saldo**\n\nPara aprender, usa el **volumen mínimo**:\n\n- Divisas, oro e índices: **0.1**.\n- Bitcoin (BTCUSD): **0.01**.',
      widget: 'calc',
    },
    {
      tipo: 'simulador', titulo: 'Opera un índice',
      intro: 'Un índice se opera igual que una divisa. Abre una operación en US30.',
      guia: ['abrir'],
      funciones: { sltp: false, pendientes: false },
      aha: 'Un índice se opera igual que una divisa: mismo procedimiento. La plataforma funciona de forma consistente para todos los activos.',
      objetivos: [
        { id: 'a', evento: 'abrio_US30', foco: 'simbolos', texto: 'Abre una operación en US30', pista: { movil: 'En Cotizaciones toca US30 → "Nueva orden" → "Comprar por".', escritorio: 'En Observación de mercado haz clic en US30, pulsa "Nueva orden" y luego "Comprar por mercado".' } },
      ],
    },
    {
      tipo: 'quiz',
      preguntas: [
        { pregunta: 'EURUSD sube de 1.0850 a 1.0860. ¿Cuántos pips se movió?', opciones: ['1 pip', '10 pips', '100 pips'], correcta: 1, explicacion: 'Entre 1.0850 y 1.0860 hay 10 unidades del cuarto decimal: 10 pips.' },
        { pregunta: 'El US30 sube de 39 000 a 39 100. ¿Cuántos puntos se movió?', opciones: ['10 puntos', '100 puntos', '1 000 puntos'], correcta: 1, explicacion: 'En los índices se miden puntos: 100.' },
        { pregunta: 'Con el volumen mínimo, ¿la variación de tu saldo es mayor o menor que con un volumen alto?', opciones: ['Menor', 'Mayor'], correcta: 0, explicacion: 'A menor volumen, menor variación por cada pip. Es lo recomendable para aprender.' },
      ],
    },
    {
      tipo: 'resumen',
      aprendiste: ['El pip mide el movimiento del precio; en los índices, el punto.', 'El volumen define cuánto vale cada pip.', 'El mínimo es 0.1 en divisas, oro e índices, y 0.01 en Bitcoin.'],
      calma: 'Cada número de MetaTrader tiene una explicación concreta. Al comprenderlos, la plataforma deja de ser un terreno desconocido.',
    },
    {
      tipo: 'reto', titulo: 'Tarea opcional: ubica estos conceptos en tu plataforma',
      texto: 'Si lo deseas, abre tu MetaTrader e identifica cómo se ve el pip en un precio y cuál es el volumen mínimo de un activo. Cuando te sientas cómodo, puedes practicar una orden con ese volumen.',
      checklist: ['Identifiqué el volumen mínimo de un activo', 'Identifiqué el pip en un precio', { t: 'Practiqué abrir una orden', cuenta: true }, { t: 'Practiqué cerrar una orden', cuenta: true }],
    },
  ],
}
