import { STORAGE_KEYS } from "./storage";
import { registrarEventoAuditoria } from "./auditoriaService";

export type BackupFleteControl = {
  version: string;
  fechaExportacion: string;
  datos: Record<string, unknown>;
};

export function exportarBackup(): BackupFleteControl {
  const datos: Record<string, unknown> = {};

  Object.values(STORAGE_KEYS).forEach((key) => {
    const raw = localStorage.getItem(key);
    datos[key] = raw ? JSON.parse(raw) : null;
  });

  return {
    version: "1.0.0",
    fechaExportacion: new Date().toISOString(),
    datos,
  };
}

export function descargarBackup() {
  const backup = exportarBackup();

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `fletecontrol-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  link.click();

  registrarEventoAuditoria({
    tipo: "BACKUP_EXPORTADO",
    descripcion: "Backup exportado correctamente",
    entidad: "BACKUP",
  });

  URL.revokeObjectURL(url);
}

export function importarBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const backup = JSON.parse(String(reader.result)) as BackupFleteControl;

        if (!backup.datos) {
          reject(new Error("El archivo no tiene estructura válida."));
          return;
        }

        Object.entries(backup.datos).forEach(([key, value]) => {
          if (value === null) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });

        registrarEventoAuditoria({
          tipo: "BACKUP_IMPORTADO",
          descripcion: "Backup importado correctamente",
          entidad: "BACKUP",
        });

        resolve();
      } catch {
        reject(new Error("No se pudo importar el archivo."));
      }
    };

    reader.onerror = () => {
      reject(new Error("No se pudo leer el archivo."));
    };

    reader.readAsText(file);
  });
}