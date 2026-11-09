import { useEffect, useState } from "react";
import "./App.css";

function money(value) {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function App() {
  const [types, setTypes] = useState([{ value: "all", label: "Todos" }]);
  const [type, setType] = useState("all");
  const [maxPremium, setMaxPremium] = useState("");
  const [policies, setPolicies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/policies/types")
      .then((r) => r.json())
      .then(setTypes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (maxPremium) params.set("maxPremium", maxPremium);
    setLoading(true);
    setError(null);
    fetch(`/api/policies?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("No se pudieron cargar las pólizas");
        return r.json();
      })
      .then(setPolicies)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, maxPremium]);

  return (
    <div className="app">
      <header className="header">
        <h1>Selector de Póliza</h1>
        <p>Compara y elige la póliza que mejor se adapta a ti.</p>
      </header>

      <section className="filters">
        <label>
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Prima máxima (USD/mes)
          <input
            type="number"
            min="0"
            placeholder="Sin límite"
            value={maxPremium}
            onChange={(e) => setMaxPremium(e.target.value)}
          />
        </label>
      </section>

      {loading && <p className="status">Cargando pólizas…</p>}
      {error && <p className="status error">{error}</p>}

      <section className="grid">
        {policies.map((p) => (
          <article
            key={p.id}
            className={`card ${selected?.id === p.id ? "selected" : ""}`}
            onClick={() => setSelected(p)}
          >
            <h2>{p.name}</h2>
            <span className="badge">{p.type}</span>
            <p className="insurer">{p.insurer}</p>
            <p className="coverage">{p.coverage}</p>
            <div className="meta">
              <strong>{money(p.premium)}</strong>
              <span>/mes</span>
            </div>
            <div className="meta small">
              Deducible: {money(p.deductible)} · ⭐ {p.rating}
            </div>
          </article>
        ))}
        {!loading && !error && policies.length === 0 && (
          <p className="status">No hay pólizas que coincidan con los filtros.</p>
        )}
      </section>

      {selected && (
        <section className="detail">
          <h2>Detalle: {selected.name}</h2>
          <p>{selected.coverage}</p>
          <p>
            Aseguradora: <strong>{selected.insurer}</strong>
          </p>
          <p>
            Prima mensual: <strong>{money(selected.premium)}</strong>
          </p>
          <p>
            Deducible: <strong>{money(selected.deductible)}</strong>
          </p>
          <p>
            Calificación: <strong>{selected.rating}/5</strong>
          </p>
          <button onClick={() => setSelected(null)}>Cerrar</button>
        </section>
      )}
    </div>
  );
}