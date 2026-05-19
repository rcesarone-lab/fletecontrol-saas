import ClienteForm from "../components/clientes/ClienteForm";
import ClientesTable from "../components/clientes/ClientesTable";
import { useClientes } from "../hooks/useClientes";

export default function Clientes() {
  const { clientes, agregarCliente, eliminarCliente } = useClientes();

  return (
    <>
      <h1 className="page-title">Clientes</h1>

      <p className="page-description">
        Registro de empresas solicitantes, datos fiscales y contactos operativos.
      </p>

      <section className="grid grid-4">
        <article className="card">
          <div className="card-label">Total clientes</div>
          <div className="card-value">{clientes.length}</div>
          <div className="card-note">Empresas registradas</div>
        </article>

        <article className="card">
          <div className="card-label">Con CUIT</div>
          <div className="card-value">
            {clientes.filter((cliente) => cliente.cuit?.trim()).length}
          </div>
          <div className="card-note">Listos para facturación</div>
        </article>

        <article className="card">
          <div className="card-label">Con email</div>
          <div className="card-value">
            {clientes.filter((cliente) => cliente.email?.trim()).length}
          </div>
          <div className="card-note">Contacto digital</div>
        </article>

        <article className="card">
          <div className="card-label">Pendientes datos</div>
          <div className="card-value">
            {
              clientes.filter(
                (cliente) => !cliente.cuit?.trim() || !cliente.email?.trim()
              ).length
            }
          </div>
          <div className="card-note">Requieren completar ficha</div>
        </article>
      </section>

      <div style={{ marginTop: 18 }}>
        <ClienteForm onSubmit={agregarCliente} />
      </div>

      <div style={{ marginTop: 18 }}>
        <ClientesTable clientes={clientes} onDelete={eliminarCliente} />
      </div>
    </>
  );
}