import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import HistoryPage from "./HistoryPage";
import TransactionPage from "./TransactionPage"; // <- add this

const App = () => {
  return (
    <Router>
      <header
        style={{ backgroundColor: "#343a40", padding: "10px", color: "white" }}
      >
        <nav style={{ display: "flex", gap: "20px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
          <Link
            to="/history"
            style={{ color: "white", textDecoration: "none" }}
          >
            History
          </Link>
          <Link
            to="/transactions"
            style={{ color: "white", textDecoration: "none" }}
          >
            Transactions
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/transactions" element={<TransactionPage />} />{" "}
        {/* Add this */}
      </Routes>
    </Router>
  );
};

export default App;
