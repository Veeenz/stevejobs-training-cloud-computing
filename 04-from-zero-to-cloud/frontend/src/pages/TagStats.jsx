import { useState } from "react";
import { getTagStats } from "../api";

export default function TagStats() {
  const [period, setPeriod] = useState("all"); // all, month, year
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Build params based on selected period
      const params = {};
      if (period === "month") {
        params.year = year;
        params.month = month;
      } else if (period === "year") {
        params.year = year;
      }
      
      const data = await getTagStats(params);
      setStats(data);
    } catch (e) {
      setError(e.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Statistiche Spese per Tag</h1>
      
      <form className="card bg-base-100 shadow-lg p-6 mb-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Periodo di Tempo</span>
            </label>
            <select 
              className="select select-bordered w-full" 
              value={period} 
              onChange={e => setPeriod(e.target.value)}
            >
              <option value="all">Tutto il Tempo</option>
              <option value="year">Annuale</option>
              <option value="month">Mensile</option>
            </select>
          </div>
        </div>
        
        {(period === "year" || period === "month") && (
          <div className="mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Anno</span>
              </label>
              <input 
                type="number" 
                className="input input-bordered" 
                value={year} 
                onChange={e => setYear(e.target.value)} 
                min="2000" 
                max="2100" 
                required 
              />
            </div>
          </div>
        )}
        
        {period === "month" && (
          <div className="mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mese</span>
              </label>
              <input 
                type="number" 
                className="input input-bordered" 
                value={month} 
                onChange={e => setMonth(e.target.value)} 
                min="1" 
                max="12" 
                required 
              />
            </div>
          </div>
        )}
        
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : "Genera Statistiche"}
        </button>
      </form>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}
      
      {stats && (
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Statistiche per Tag</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Data table */}
            <div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Tag</th>
                      <th>Importo Totale</th>
                      <th>Conteggio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((item) => (
                      <tr key={item.tag}>
                        <td>{item.tag}</td>
                        <td className="font-mono text-right">€{item.totalAmount.toFixed(2)}</td>
                        <td className="text-center">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Right column: Tag distribution visualization */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Distribuzione Spese</h3>
              {stats.map((item) => {
                // Calculate percentage of total for the progress bar
                const totalSum = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);
                const percentage = totalSum > 0 ? (item.totalAmount / totalSum) * 100 : 0;
                
                return (
                  <div key={`viz-${item.tag}`} className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span>{item.tag}</span>
                      <span className="font-mono">€{item.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}