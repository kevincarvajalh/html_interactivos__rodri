export function PasosBarra({ total, actual }) {
  return (
    <div className="pasos" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={actual + 1}>
      {Array.from({ length: total }, (_, i) => <span key={i} className={i <= actual ? 'on' : ''} />)}
    </div>
  )
}

export function ProgresoSemana({ dia, hechos = [] }) {
  return (
    <div className="semana" aria-label={`Día ${dia} de 7`}>
      {[1, 2, 3, 4, 5, 6, 7].map((n) => <span key={n} className={`punto ${hechos.includes(n) ? 'ok' : ''} ${n === dia ? 'hoy' : ''}`} />)}
    </div>
  )
}

export function AvisoRiesgo() {
  return (
    <p className="pie">
      Contenido educativo, no constituye asesoría ni recomendación de inversión. Operar con instrumentos apalancados implica riesgo de pérdida de capital.
      Los precios del simulador son inventados y no representan dinero real. Practica con el volumen mínimo de tu activo o en cuenta demo.
    </p>
  )
}
