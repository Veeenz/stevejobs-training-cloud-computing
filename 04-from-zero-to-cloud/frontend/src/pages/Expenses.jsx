import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../api";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ tag: "", from: "", to: "", type: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getExpenses(filters);
      setExpenses(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminare questa spesa?")) return;
    await deleteExpense(id);
    fetchExpenses();
  };

  // Format date in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  // Format amount with currency
  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);

    return type === "expense" 
      ? <span className="text-error">{formattedAmount}</span> 
      : <span className="text-success">{formattedAmount}</span>;
  };

  // Format tags as badges
  const formatTags = (tags) => {
    if (!tags || !tags.length) return null;
    
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <div key={index} className="badge badge-sm badge-outline">{tag}</div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header with add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Le Tue Spese</h1>
        <button 
          className="btn btn-primary btn-sm gap-2 mt-2 sm:mt-0" 
          onClick={() => navigate('/add')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Aggiungi Spesa
        </button>
      </div>

      {/* Filter card */}
      <div className="card bg-base-100 shadow-md mb-6 overflow-visible">
        <div className="card-body p-4">
          <h2 className="card-title text-lg mb-2">Filtri</h2>
          <form className="flex flex-wrap gap-3" onSubmit={handleFilter}>
            <div className="form-control">
              <label className="input input-sm input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <input
                  name="tag"
                  value={filters.tag}
                  onChange={handleFilterChange}
                  placeholder="Tag"
                  className="grow"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-sm input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  type="date"
                  placeholder="Da"
                  className="grow"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-sm input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  type="date"
                  placeholder="A"
                  className="grow"
                />
              </label>
            </div>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="select select-sm select-bordered"
            >
              <option value="">Tutti</option>
              <option value="expense">Spesa</option>
              <option value="income">Entrata</option>
            </select>
            
            <button className="btn btn-primary btn-sm" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filtra
            </button>
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
      ) : expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3 opacity-30">💸</div>
          <h3 className="text-xl font-bold mb-2">Nessuna spesa trovata</h3>
          <p className="text-base-content/70 mb-4">Inizia aggiungendo la tua prima spesa!</p>
          <button 
            className="btn btn-primary btn-sm gap-2" 
            onClick={() => navigate('/add')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Aggiungi Spesa
          </button>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-base-200/60">
                <tr>
                  <th>Descrizione</th>
                  <th>Importo</th>
                  <th>Tags</th>
                  <th>Data</th>
                  <th>Pagato Da</th>
                  <th>Diviso Con</th>
                  <th className="text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover">
                    <td className="font-medium">{exp.description}</td>
                    <td className="font-mono">{formatAmount(exp.amount, exp.type)}</td>
                    <td>{formatTags(exp.tags)}</td>
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.paidBy}</td>
                    <td>
                      {exp.splitTo?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {exp.splitTo.map((person, idx) => (
                            <span key={idx} className="badge badge-sm badge-outline badge-neutral">{person}</span>
                          ))}
                        </div>
                      ) : null}
                    </td>
                    <td className="flex gap-2 justify-end">
                      <button 
                        className="btn btn-xs btn-outline btn-circle" 
                        onClick={() => navigate(`/edit/${exp._id}`)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        className="btn btn-xs btn-error btn-circle" 
                        onClick={() => handleDelete(exp._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 