import { type ChangeEvent, useRef, useState } from "react";
import { descargarBackup, importarBackup } from "../../services/backupService";

export default function BackupPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mensaje, setMensaje] = useState("");

  function handleExportar() {
    descargarBackup();
    setMensaje("Backup exportado correctamente.");
  }

  async function handleImportar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const confirmado = window.confirm(
      "Importar un backup reemplazará los datos actuales del navegador. ¿Deseás continuar?"
    );

    if (!confirmado) return;

    try {
      await importarBackup(file);
      setMensaje("Backup importado correctamente. Recargá la página para ver los datos.");
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error al importar backup.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <section className="card">
      <h2>Backup y restauración</h2>

      <p className="page-description">
        Exporta o importa todos los datos locales del sistema: envíos, clientes,
        vehículo, ayudantes, ingresos, facturas y configuración.
      </p>

      <div className="backup-actions">
        <button className="primary-button" onClick={handleExportar}>
          Exportar backup
        </button>

        <button
          className="secondary-button"
          onClick={() => inputRef.current?.click()}
        >
          Importar backup
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={handleImportar}
        />
      </div>

      {mensaje && <div className="status-message">{mensaje}</div>}
    </section>
  );
}