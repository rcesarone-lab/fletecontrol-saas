import { useEffect, useState } from "react";
import { getResumenFinanciero } from "../services/reportesService";

type ResumenFinanciero = ReturnType<typeof getResumenFinanciero>;

export function useDashboard() {
  const [resumen, setResumen] = useState<ResumenFinanciero>(
    getResumenFinanciero()
  );

  useEffect(() => {
    setResumen(getResumenFinanciero());
  }, []);

  return {
    resumen,
  };
}