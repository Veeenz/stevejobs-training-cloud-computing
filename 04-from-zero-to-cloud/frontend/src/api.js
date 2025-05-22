const BASE_URL = "http://localhost:3000";

export async function getExpenses(params = {}) {
  const url = new URL(`${BASE_URL}/expenses`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(data) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}

export async function getExpense(id) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`);
  if (!res.ok) throw new Error("Failed to fetch expense");
  return res.json();
}

export async function updateExpense(id, data) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}

export async function getMonthlySummary(year, month) {
  const url = new URL(`${BASE_URL}/summary/month`, window.location.origin);
  url.searchParams.append("year", year);
  url.searchParams.append("month", month);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function getSplitSummary(people) {
  const url = new URL(`${BASE_URL}/summary/split`, window.location.origin);
  url.searchParams.append("people", people);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch split summary");
  return res.json();
}

export async function getTagStats(params = {}) {
  const url = new URL(`${BASE_URL}/summary/stats/tags`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch tag statistics");
  return res.json();
} 