type ComparativoTarifaProps = {
  tarifaReferenciaMercado: number;
  tarifaContratante: number;
  costoEstimado: number;
};

export default function ComparativoTarifa({
  tarifaReferenciaMercado,
  tarifaContratante,
  costoEstimado,
}: ComparativoTarifaProps) {
  const tieneReferencia = tarifaReferenciaMercado > 0;

  const diferenciaMercado =
    tarifaContratante - tarifaReferenciaMercado;

  const rentabilidad = tarifaContratante - costoEstimado;

  const tarifaBaja = tieneReferencia && diferenciaMercado < 0;

  const rentabilidadNegativa = rentabilidad < 0;

  return (
    <div className="tarifa-box">
      <div>
        <span className="card-label">Diferencia vs mercado</span>

        <strong className={tarifaBaja ? "text-danger" : "text-success"}>
          {tieneReferencia
            ? `$${diferenciaMercado.toLocaleString("es-AR")}`
            : "Sin referencia"}
        </strong>
      </div>

      <div>
        <span className="card-label">Rentabilidad estimada</span>

        <strong
          className={rentabilidadNegativa ? "text-danger" : "text-success"}
        >
          ${rentabilidad.toLocaleString("es-AR")}
        </strong>
      </div>
    </div>
  );
}