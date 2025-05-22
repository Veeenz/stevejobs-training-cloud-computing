import { useState } from "react";
import { getMonthlySummary } from "../api";

export default function Summary() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await getMonthlySummary(year, month);
      setSummary(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  // Format a number as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  // Get month name for display
  const getMonthName = (monthNumber) => {
    const monthNames = [
      "Gennaio", "Febbraio", "Marzo", "Aprile", 
      "Maggio", "Giugno", "Luglio", "Agosto", 
      "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];
    return monthNames[monthNumber - 1];
  };

  // Calculate total from summary
  const calculateTotal = (summary) => {
    if (!summary || !summary.length) return 0;
    return summary.reduce((total, item) => total + item.total, 0);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Riepilogo Mensile</h1>
        <p className="text-base-content/70">Visualizza un riepilogo delle tue spese per mese</p>
      </div>

      {/* Date selector card */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body p-5">
          <h2 className="card-title text-lg mb-3">Seleziona Periodo</h2>
          <form className="flex flex-wrap gap-3" onSubmit={handleSubmit}>
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Anno</span>
              </label>
              <label className="input input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input 
                  type="number" 
                  className="grow" 
                  value={year} 
                  onChange={e => setYear(e.target.value)} 
                  min="2000" 
                  max="2100" 
                  required 
                />
              </label>
            </div>

            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Mese</span>
              </label>
              <select 
                className="select select-bordered focus:select-primary transition-all" 
                value={month} 
                onChange={e => setMonth(parseInt(e.target.value))} 
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{getMonthName(m)}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control w-full flex-initial mt-auto">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Genera Riepilogo"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading and error states */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Caricamento in corso...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      ) : summary && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">{getMonthName(month)} {year}</h2>
              <div className="badge badge-lg badge-primary p-3">
                Totale: {formatCurrency(calculateTotal(summary))}
              </div>
            </div>
            
            <div className="divider"></div>
            
            {/* Summary list */}
            <div className="space-y-3">
              {summary.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-3 opacity-30">📊</div>
                  <h3 className="text-lg font-bold mb-1">Nessuna spesa trovata</h3>
                  <p className="text-base-content/70">Non ci sono spese registrate in questo periodo</p>
                </div>
              ) : (
                summary.map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="font-medium">{item._id || "Senza tag"}</span>
                    </div>
                    <span className="font-mono font-bold text-primary">{formatCurrency(item.total)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 