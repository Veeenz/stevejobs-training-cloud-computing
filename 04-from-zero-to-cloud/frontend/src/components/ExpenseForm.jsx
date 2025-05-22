import { useState } from "react";

export default function ExpenseForm({ initial = {}, onSubmit }) {
  // Format today's date as YYYY-MM-DD for the date input
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    description: initial.description || "",
    amount: initial.amount || "",
    tags: initial.tags?.join(", ") || "",
    date: initial.date ? initial.date.slice(0, 10) : today,
    type: initial.type || "expense",
    paidBy: initial.paidBy || "Io",
    splitTo: initial.splitTo?.join(", ") || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = {
        ...form,
        amount: parseFloat(form.amount),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        splitTo: form.splitTo.split(",").map((t) => t.trim()).filter(Boolean),
      };
      await onSubmit(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <form 
      className="card bg-base-100 shadow-xl rounded-2xl p-8 max-w-md mx-auto mt-4 border border-base-300 expense-form"
      onSubmit={handleSubmit}
    >
      {/* Header with icon */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {form.type === "expense" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            )}
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center">
          {initial.id ? "Modifica Spesa" : "Aggiungi Nuova Spesa"}
        </h2>
      </div>
      
      {/* Description field */}
      <div className="form-control w-full mb-5">
        <label className="label">
          <span className="label-text font-medium text-base">Descrizione</span>
        </label>
        <input 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          placeholder="Per cosa è stata questa spesa?" 
          className="input input-bordered w-full focus:input-primary transition-all" 
          required 
        />
      </div>
      
      {/* Amount and Date fields */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium text-base">Importo</span>
          </label>
          <label className="input input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <input 
              name="amount" 
              value={form.amount} 
              onChange={handleChange} 
              placeholder="0.00" 
              type="number" 
              step="0.01" 
              className="grow" 
              required 
            />
          </label>
        </div>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium text-base">Data</span>
          </label>
          <label className="input input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input 
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              type="date" 
              className="grow"
              required 
            />
          </label>
        </div>
      </div>
      
      {/* Type selector */}
      <div className="form-control w-full mb-5">
        <label className="label">
          <span className="label-text font-medium text-base">Tipo</span>
        </label>
        <div className="flex gap-4 mt-1">
          <label className="flex-1">
            <input 
              type="radio" 
              name="type" 
              value="expense" 
              className="peer hidden" 
              checked={form.type === "expense"} 
              onChange={handleChange}
            />
            <div className="flex flex-col items-center gap-1 p-3 rounded-xl border border-base-300 cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>Spesa</span>
            </div>
          </label>
          <label className="flex-1">
            <input 
              type="radio" 
              name="type" 
              value="income" 
              className="peer hidden" 
              checked={form.type === "income"} 
              onChange={handleChange}
            />
            <div className="flex flex-col items-center gap-1 p-3 rounded-xl border border-base-300 cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>Entrata</span>
            </div>
          </label>
        </div>
      </div>
      
      {/* Paid By field */}
      <div className="form-control w-full mb-5">
        <label className="label">
          <span className="label-text font-medium text-base">Pagato Da</span>
        </label>
        <label className="input input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <input 
            name="paidBy" 
            value={form.paidBy} 
            onChange={handleChange} 
            placeholder="Chi ha pagato per questo?" 
            className="grow" 
            required 
          />
        </label>
      </div>
      
      {/* Split With field */}
      <div className="form-control w-full mb-5">
        <label className="label">
          <span className="label-text font-medium text-base">Diviso Con</span>
          <span className="label-text-alt">Nomi separati da virgola</span>
        </label>
        <label className="input input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <input 
            name="splitTo" 
            value={form.splitTo} 
            onChange={handleChange} 
            placeholder="Alice, Bob, Charlie" 
            className="grow" 
          />
        </label>
      </div>
      
      {/* Tags field */}
      <div className="form-control w-full mb-5">
        <label className="label">
          <span className="label-text font-medium text-base">Tags</span>
          <span className="label-text-alt">Separati da virgola</span>
        </label>
        <label className="input input-bordered flex items-center gap-2 focus-within:input-primary transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <input 
            name="tags" 
            value={form.tags} 
            onChange={handleChange} 
            placeholder="cibo, bollette, intrattenimento" 
            className="grow" 
          />
        </label>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-error mb-5 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Submit button */}
      <div className="flex justify-center mt-6">
        <button 
          className="btn btn-primary w-full rounded-full" 
          type="submit" 
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Salva Spesa"}
        </button>
      </div>
    </form>
  );
}