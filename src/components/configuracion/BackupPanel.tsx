import { ChangeEvent, useRef, useState } from "react";
import ConfirmModal from "../ui/ConfirmModal";
import Toast from "../ui/Toast";
import { descargarBackup, importarBackup } from "../../services/backupService";
import { useToast } from "../../hooks/useToast";

export default function BackupPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [archivoPendiente, setArchivoPendiente] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { message, type, showToast, clearToast } = useToast();

  function handleExportar() {
    descargarBackup();
    showToast("Backup exportado correctamente.", "success");
  }

  function handleSeleccionArchivo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setArchivoPendiente(file);
    setModalOpen(true);
    event.target.value = "";
  }

  async function confirmarImportacion() {
    if (!archivoPendiente) return;

    try {
      await importarBackup(archivoPendiente);
      showToast(
        "Backup importado correctamente. Recargá la página para ver los datos.",
        "success"
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error al importar backup.",
        "error"
      );
    } finally {
      setArchivoPendiente(null);
      setModalOpen(false);
    }
  }

  function cancelarImportacion() {
    setArchivoPendiente(null);
    setModalOpen(false);
  }

  return (
    <>
      <section className="card">
        <h2>Backup y restauración</h2>

        <p className="page-description">
          Exporta o importa todos los datos locales del sistema: envíos,
          clientes, vehículo, ayudantes, ingresos, facturas y configuración.
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
            onChange={handleSeleccionArchivo}
          />
        </div>
      </section>

      <Toast message={message} type={type} onClose={clearToast} />

      <ConfirmModal
        open={modalOpen}
        title="Importar backup"
        message="Esta acción reemplazará los datos actuales guardados en este navegador. ¿Deseás continuar?"
        confirmText="Importar"
        cancelText="Cancelar"
        onConfirm={confirmarImportacion}
        onCancel={cancelarImportacion}
      />
    </>
  );
}