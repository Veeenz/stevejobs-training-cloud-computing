module.exports = function splitHelper(expenses, people) {
  // Initialize balances
  const balances = {};
  people.forEach(p => { balances[p] = 0; });

  expenses.forEach(exp => {
    if (!exp.paidBy || !Array.isArray(exp.splitTo) || exp.splitTo.length === 0) return;
    const amountPerPerson = exp.amount / exp.splitTo.length;
    exp.splitTo.forEach(person => {
      if (person !== exp.paidBy && balances.hasOwnProperty(person)) {
        balances[person] -= amountPerPerson;
      }
    });
    if (balances.hasOwnProperty(exp.paidBy)) {
      balances[exp.paidBy] += exp.amount - amountPerPerson * (exp.splitTo.length - 1);
    }
  });

  return balances;
}; 