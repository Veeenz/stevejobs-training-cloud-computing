import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import Summary from "./pages/Summary";
import SplitSummary from "./pages/SplitSummary";
import TagStats from "./pages/TagStats";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        {/* Modern navigation bar with glass effect */}
        <div className="sticky top-0 z-30">
          <nav className="navbar bg-base-100 bg-opacity-90 backdrop-blur-lg shadow-md px-4">
            <div className="container mx-auto">
              {/* Logo and title */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-content">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold tracking-tight">Divisore di Spese</span>
                </div>
              </div>
              {/* Mobile menu button */}
              <div className="dropdown dropdown-end lg:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link to="/expenses">Spese</Link></li>
                  <li><Link to="/add">Aggiungi</Link></li>
                  <li><Link to="/summary">Riepilogo</Link></li>
                  <li><Link to="/split">Divisione</Link></li>
                  <li><Link to="/stats">Statistiche</Link></li>
                </ul>
              </div>
              {/* Desktop menu */}
              <div className="hidden lg:flex gap-1">
                <Link to="/expenses" className="btn btn-ghost btn-sm rounded-full">Spese</Link>
                <Link to="/add" className="btn btn-ghost btn-sm rounded-full">Aggiungi</Link>
                <Link to="/summary" className="btn btn-ghost btn-sm rounded-full">Riepilogo</Link>
                <Link to="/split" className="btn btn-ghost btn-sm rounded-full">Divisione</Link>
                <Link to="/stats" className="btn btn-ghost btn-sm rounded-full">Statistiche</Link>
              </div>
            </div>
          </nav>
        </div>
        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/expenses" replace />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/edit/:id" element={<AddExpense />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/split" element={<SplitSummary />} />
            <Route path="/stats" element={<TagStats />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
