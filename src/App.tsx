import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import GraphPage from "./HistoryPage";
import TransactionPage from "./TransactionPage";
import AnalysisPage from "./Analysis"; // ✅ NEW IMPORT
import PurchaseHistoryPage from "./PurchaseHistory"; // Import the new page

const App = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  const headerStyle = {
    backgroundColor: theme === "light" ? "#343a40" : "#212529",
    padding: "10px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const navStyle = {
    display: "flex",
    gap: "20px",
  };

  const themeToggleStyle = {
    background: "transparent",
    border: "2px solid white",
    borderRadius: "20px",
    padding: "5px 10px",
    cursor: "pointer",
    color: "white",
  };

  return (
    <Router>
      <header style={headerStyle}>
        <nav style={navStyle}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
          <Link
            to="/history"
            style={{ color: "white", textDecoration: "none" }}
          >
            Holdings
          </Link>
          <Link
            to="/transactions/AAPL/buy"
            style={{ color: "white", textDecoration: "none" }}
          >
            Transactions
          </Link>
          <Link
            to="/analysis"
            style={{ color: "white", textDecoration: "none" }}
          >
            Analysis
          </Link>
          <Link
            to="/purchase-history"
            style={{ color: "white", textDecoration: "none" }}
          >
            Purchase History
          </Link>
        </nav>

        <button style={themeToggleStyle} onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "🌞"}
        </button>
      </header>

      <div className={theme}>
        <Routes>
          <Route path="/" element={<HomePage theme={theme} />} />
          <Route path="/history" element={<GraphPage theme={theme} />} />
          <Route
            path="/transactions/:symbol/:action"
            element={<TransactionPage theme={theme} />}
          />
          <Route path="/analysis" element={<AnalysisPage theme={theme} />} />
          <Route
            path="/purchase-history"
            element={<PurchaseHistoryPage theme={theme} />}
          />{" "}
          {/* New Route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
