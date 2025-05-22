import { useState } from "react";
import { getSplitSummary } from "../api";

export default function SplitSummary() {
  const [people, setPeople] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await getSplitSummary(people);
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="flex gap-2 mb-4" onSubmit={handleSubmit}>
        <input className="input input-bordered flex-1" value={people} onChange={e => setPeople(e.target.value)} placeholder="Persone (separate da virgola)" required />
        <button className="btn btn-primary" type="submit">Mostra</button>
      </form>
      {loading ? (
        <div className="flex justify-center"><span className="loading loading-spinner"></span></div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : result && (
        <div className="card bg-base-100 shadow p-4">
          <h2 className="text-lg font-bold mb-2">Bilanci Divisi</h2>
          <ul>
            {Object.entries(result).map(([person, balance]) => (
              <li key={person} className="flex justify-between">
                <span>{person}</span>
                <span className="font-mono">{balance}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 