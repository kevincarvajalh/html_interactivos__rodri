export default {
  n: 2,
  tema: 'Abrir y cerrar operaciones',
  lema: 'El ciclo completo de una operación',
  minutos: 4,
  pasos: [
    {
      tipo: 'intro',
      objetivo: 'Abrir y cerrar una operación con seguridad.',
      aprenderas: ['Qué diferencia hay entre comprar y vender', 'Cómo se abre una operación', 'Cómo se cierra y cuándo se registra el resultado'],
    },
    {
      tipo: 'leccion', icono: 'click', titulo: 'Comprar o vender',
      texto: '- **Comprar (Buy):** si esperas que el precio **suba**.\n- **Vender (Sell):** si esperas que el precio **baje**.\n\nEn el simulador puedes practicar ambas sin riesgo.\n\nEl **volumen** ya viene en el mínimo permitido. Déjalo así por ahora: lo explicamos en el módulo 3.',
    },
    {
      tipo: 'leccion', icono: 'meta', titulo: 'Cerrar una operación',
      texto: 'Toda operación tiene dos momentos: la **apertura** y el **cierre**.\n\nMientras está abierta, el resultado es {{flotante|Varía con el precio y aún no es definitivo.}}. Al **cerrarla**, el resultado se registra en tu saldo.',
    },
    {
      tipo: 'simulador', titulo: 'Abre y cierra una operación',
      intro: 'Completa el ciclo. El resultado no importa: es una práctica.',
      guia: ['abrir', 'cerrar'],
      funciones: { sltp: false, pendientes: false },
      aha: 'Abrir y cerrar son dos acciones sencillas. Una vez que conoces el recorrido, la plataforma resulta intuitiva.',
      objetivos: [
        { id: 'a', evento: 'abrio', foco: 'nueva', texto: 'Abre una operación', pista: { movil: 'En Operaciones toca el + y elige "Vender por" o "Comprar por".', escritorio: 'Pulsa "Nueva orden" y luego "Comprar por mercado" o "Vender por mercado".' } },
        { id: 'b', evento: 'cerro', foco: 'cerrar', texto: 'Ciérrala', pista: { movil: 'En Operaciones toca tu posición → "Cerrar posición" → confirma.', escritorio: 'En Operaciones, pulsa la X al final de la fila.' } },
      ],
    },
    {
      tipo: 'quiz',
      preguntas: [
        { pregunta: 'Esperas que el precio SUBA. ¿Qué eliges?', opciones: ['Vender', 'Comprar'], correcta: 1, explicacion: 'Una compra gana cuando el precio sube.' },
        { pregunta: '¿Cuándo se registra el resultado en tu saldo?', opciones: ['Al abrir', 'Al cerrar la operación'], correcta: 1, explicacion: 'Mientras está abierta el resultado es flotante; al cerrar queda registrado.' },
        { pregunta: '¿Desde dónde cierras una operación?', opciones: ['Desde Operaciones', 'Desde Cotizaciones'], correcta: 0, explicacion: 'Las operaciones abiertas se gestionan desde la sección Operaciones.' },
      ],
    },
    {
      tipo: 'resumen',
      aprendiste: ['Se compra si esperas que el precio suba y se vende si esperas que baje.', 'Las operaciones se abren y se cierran desde Operaciones.', 'El resultado se registra en tu saldo al cerrar.'],
      calma: 'La familiaridad reduce la incertidumbre. Practicar el ciclo completo con el volumen mínimo permite aprender con muy bajo impacto en el saldo.',
    },
    {
      tipo: 'reto', titulo: 'Tarea opcional: repite el ciclo en tu plataforma',
      texto: 'Cuando lo desees, repite en tu MetaTrader lo practicado aquí: abrir una orden con el volumen mínimo y cerrarla. El objetivo es que te familiarices con los botones, a tu ritmo.',
      checklist: [{ t: 'Practiqué abrir una orden', cuenta: true }, { t: 'Practiqué cerrar una orden', cuenta: true }],
    },
  ],
}
