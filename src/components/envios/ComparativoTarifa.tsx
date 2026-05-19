type ComparativoTarifaProps = {
  tarifaGremial: number;
  tarifaContratante: number;
  costoEstimado: number;
};

export default function ComparativoTarifa({
  tarifaGremial,
  tarifaContratante,
  costoEstimado,
}: ComparativoTarifaProps) {
  const diferenciaGremio = tarifaContratante - tarifaGremial;
  const rentabilidad = tarifaContratante - costoEstimado;

  const tarifaBaja = diferenciaGremio < 0;
  const rentabilidadNegativa = rentabilidad < 0;

  return (
    <div className="tarifa-box">
      <div>
        <span className="card-label">Diferencia vs gremio</span>
        <strong className={tarifaBaja ? "text-danger" : "text-success"}>
          ${diferenciaGremio.toLocaleString("es-AR")}
        </strong>
      </div>

      <div>
        <span className="card-label">Rentabilidad estimada</span>
        <strong className={rentabilidadNegativa ? "text-danger" : "text-success"}>
          ${rentabilidad.toLocaleString("es-AR")}
        </strong>
      </div>
    </div>
  );
}
