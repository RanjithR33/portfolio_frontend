import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import HistoryPage from "./HistoryPage";
import TransactionPage from "./TransactionPage"; // <- add this

const App = () => {
  // Track theme state: "light" or "dark"
  const [theme, setTheme] = useState("light");

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Define styles for light and dark themes
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
          <Link to="/history" style={{ color: "white", textDecoration: "none" }}>
            History
          </Link>
          <Link to="/transactions" style={{ color: "white", textDecoration: "none" }}>
            Transactions
          </Link>
        </nav>

        {/* Theme toggle button */}
        <button style={themeToggleStyle} onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "🌞"} {/* Emoji for light and dark themes */}
        </button>
      </header>

      <div className={theme}> {/* Dynamically apply theme class here */}
        <Routes>
          <Route path="/" element={<HomePage theme={theme} />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
