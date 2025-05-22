import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createExpense, getExpense, updateExpense } from "../api";
import ExpenseForm from "../components/ExpenseForm";

export default function AddExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      getExpense(id)
        .then(setInitial)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      if (id) {
        await updateExpense(id, data);
      } else {
        await createExpense(data);
      }
      navigate("/expenses");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="flex justify-center"><span className="loading loading-spinner"></span></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  if (id && !initial) return null;

  return (
    <div className="max-w-xl mx-auto">
      <ExpenseForm initial={initial || {}} onSubmit={handleSubmit} />
    </div>
  );
} 