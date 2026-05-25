import { STORAGE_KEYS } from "./storage";
import { registrarEventoAuditoria } from "./auditoriaService";
import { validarBackupFleteControl } from "./backupValidationService";

export type BackupEnvironment =
  | "demo"
  | "produccion"
  | "testing";

export type BackupFleteControl = {
  version: string;
  environment: BackupEnvironment;

  fechaExportacion: string;

  metadata: {
    sistema: string;
    generadoPor: string;
    totalClaves: number;
  };

  datos: Record<string, unknown>;
};

export function exportarBackup(
  environment: BackupEnvironment = "produccion"
): BackupFleteControl {
  const datos: Record<string, unknown> = {};

  Object.values(STORAGE_KEYS).forEach((key) => {
    const raw = localStorage.getItem(key);

    datos[key] = raw ? JSON.parse(raw) : null;
  });

  return {
    version: "2.0.0",

    environment,

    fechaExportacion: new Date().toISOString(),

    metadata: {
      sistema: "FleteControl-SaaS",
      generadoPor: "CRamirez",
      totalClaves: Object.keys(datos).length,
    },

    datos,
  };
}

export function descargarBackup(
  environment: BackupEnvironment = "produccion"
) {
  const backup = exportarBackup(environment);

  const fecha = new Date().toISOString().slice(0, 10);

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    environment === "demo"
      ? `fletecontrol-demo-${fecha}.json`
      : `fletecontrol-backup-${fecha}.json`;

  link.click();

  registrarEventoAuditoria({
    tipo: "BACKUP_EXPORTADO",
    descripcion: `Backup ${environment} exportado correctamente`,
    entidad: "BACKUP",
  });

  URL.revokeObjectURL(url);
}

export function importarBackup(
  file: File
): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const backup = JSON.parse(
          String(reader.result)
        ) as BackupFleteControl;

        if (!backup.datos) {
          reject(
            new Error(
              "El archivo no tiene estructura válida."
            )
          );

          return;
        }

        const validacion = validarBackupFleteControl(backup.datos);

        if (!validacion.valido) {
          reject(
            new Error(
              `Backup inválido. ${validacion.errores.slice(0, 5).join(" | ")}`
            )
          );
          return;
        }

        Object.entries(backup.datos).forEach(
          ([key, value]) => {
            if (value === null) {
              localStorage.removeItem(key);
            } else {
              localStorage.setItem(
                key,
                JSON.stringify(value)
              );
            }
          }
        );

        registrarEventoAuditoria({
          tipo: "BACKUP_IMPORTADO",
          descripcion: `Backup importado correctamente (${backup.environment})`,
          entidad: "BACKUP",
        });

        resolve();
      } catch {
        reject(
          new Error(
            "No se pudo importar el archivo."
          )
        );
      }
    };

    reader.onerror = () => {
      reject(
        new Error(
          "No se pudo leer el archivo."
        )
      );
    };

    reader.readAsText(file);
  });
}