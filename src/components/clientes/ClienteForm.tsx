import { type FormEvent, useEffect, useState } from "react";
import type { Cliente } from "../../domain/cliente";

type ClienteFormData = {
  razonSocial: string;
  cuit?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
};

type ClienteFormProps = {
  clienteEditando?: Cliente | null;
  onSubmit: (data: ClienteFormData) => void;
  onCancelEdit?: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export default function ClienteForm({
  clienteEditando,
  onSubmit,
  onCancelEdit,
  onError,
  onSuccess,
}: ClienteFormProps) {
  const [razonSocial, setRazonSocial] = useState("");
  const [cuit, setCuit] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

  const estaEditando = Boolean(clienteEditando);

  useEffect(() => {
    if (!clienteEditando) {
      setRazonSocial("");
      setCuit("");
      setContacto("");
      setTelefono("");
      setEmail("");
      setDireccion("");
      return;
    }

    setRazonSocial(clienteEditando.razonSocial);
    setCuit(clienteEditando.cuit ?? "");
    setContacto(clienteEditando.contacto ?? "");
    setTelefono(clienteEditando.telefono ?? "");
    setEmail(clienteEditando.email ?? "");
    setDireccion(clienteEditando.direccion ?? "");
  }, [clienteEditando]);

  function limpiarFormulario() {
    setRazonSocial("");
    setCuit("");
    setContacto("");
    setTelefono("");
    setEmail("");
    setDireccion("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!razonSocial.trim()) {
      onError("Completá la razón social del cliente.");
      return;
    }

    onSubmit({
      razonSocial,
      cuit,
      contacto,
      telefono,
      email,
      direccion,
    });

    onSuccess(
      estaEditando
        ? "Cliente actualizado correctamente."
        : "Cliente registrado correctamente."
    );

    if (!estaEditando) {
      limpiarFormulario();
    }
  }

  function cancelarEdicion() {
    limpiarFormulario();
    onCancelEdit?.();
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-field full">
        <h2>{estaEditando ? "Editando cliente" : "Registrar cliente"}</h2>
      </div>

      <div className="form-field">
        <label>Razón social</label>
        <input
          value={razonSocial}
          onChange={(e) => setRazonSocial(e.target.value)}
          placeholder="Ej: Empresa ABC SRL"
        />
      </div>

      <div className="form-field">
        <label>CUIT</label>
        <input
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
          placeholder="Ej: 30-12345678-9"
        />
      </div>

      <div className="form-field">
        <label>Contacto</label>
        <input
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div className="form-field">
        <label>Teléfono</label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: 11 5555-5555"
        />
      </div>

      <div className="form-field">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ej: contacto@empresa.com"
        />
      </div>

      <div className="form-field">
        <label>Dirección</label>
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ej: Av. Corrientes 1234"
        />
      </div>

      <button className="primary-button" type="submit">
        {estaEditando ? "Actualizar cliente" : "Registrar cliente"}
      </button>

      {estaEditando && (
        <button
          className="secondary-button"
          type="button"
          onClick={cancelarEdicion}
        >
          Cancelar edición
        </button>
      )}
    </form>
  );
}