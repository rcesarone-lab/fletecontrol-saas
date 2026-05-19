type KpiCardProps = {
  label: string;
  value: string | number;
  note: string;
};

export default function KpiCard({ label, value, note }: KpiCardProps) {
  return (
    <article className="card">
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      <div className="card-note">{note}</div>
    </article>
  );
}