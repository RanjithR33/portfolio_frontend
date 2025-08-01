import React, { useState, useEffect } from "react";
import Watchlist from "./Watchlist";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart";
import StockDetails from "./StockDetails";
import NewsSentiment from "./NewsSentiment";
import "./App.css";

type Watchlists = {
  [name: string]: string[];
};

const HomePage: React.FC<{ theme: string }> = ({ theme }) => {
  const [watchlists, setWatchlists] = useState<Watchlists>({
    Default: ["AAPL", "MSFT", "GOOG"],
  });

  const [currentListName, setCurrentListName] = useState("Default");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [chartData, setChartData] = useState<any[]>([]);

  const currentWatchlist = watchlists[currentListName] || [];

  useEffect(() => {
    if (!selectedSymbol) return;

    fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${selectedSymbol}?serietype=line&apikey=p76qI5YAashYVDQdOsjPy9gCqER6pJ4c`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.historical) {
          setChartData(data.historical.slice(0, 30).reverse());
        }
      })
      .catch((err) => {
        console.error("Chart API error:", err);
        setChartData([]);
      });
  }, [selectedSymbol]);

  const addToWatchlist = (symbol: string) => {
    if (!watchlists[currentListName].includes(symbol)) {
      setWatchlists((prev) => ({
        ...prev,
        [currentListName]: [...prev[currentListName], symbol],
      }));
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    const updatedList = watchlists[currentListName].filter((s) => s !== symbol);
    setWatchlists((prev) => ({
      ...prev,
      [currentListName]: updatedList,
    }));

    if (selectedSymbol === symbol && updatedList.length > 0) {
      setSelectedSymbol(updatedList[0]);
    }
  };

  const handleCreateWatchlist = () => {
    const name = prompt("Enter new watchlist name:");
    if (name && !watchlists[name]) {
      setWatchlists((prev) => ({
        ...prev,
        [name]: [],
      }));
      setCurrentListName(name);
    }
  };

  const mockHoldings = [
    { symbol: "AAPL", quantity: 50, avgPrice: 180 },
    { symbol: "TSLA", quantity: 20, avgPrice: 750 },
    { symbol: "AMZN", quantity: 10, avgPrice: 3100 },
    { symbol: "GOOG", quantity: 15, avgPrice: 2700 },
    { symbol: "MSFT", quantity: 25, avgPrice: 295 },
  ];

  const latestPrice = chartData[chartData.length - 1]?.close || 0;
  const invested = 10000;
  const shares = 100;
  const currentValue = latestPrice * shares;
  const profitLoss = currentValue - invested;
  const rateOfReturn = (profitLoss / invested) * 100;

  return (
    <div className={`app ${theme}`}> {/* Add the theme class dynamically */}
      <aside className="sidebar">
        <div style={{ marginBottom: "20px" }}>
          <label>Current Watchlist:</label>
          <select
            value={currentListName}
            onChange={(e) => setCurrentListName(e.target.value)}
            style={{ width: "100%", padding: "6px", marginTop: "5px" }}
          >
            {Object.keys(watchlists).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            style={{
              marginTop: "6px",
              width: "100%",
              padding: "6px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
            onClick={handleCreateWatchlist}
          >
            + New Watchlist
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <SearchBar onAdd={addToWatchlist} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Watchlist
            symbols={currentWatchlist}
            onRemove={removeFromWatchlist}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h4>Select stock for chart:</h4>
          <select
            onChange={(e) => setSelectedSymbol(e.target.value)}
            value={selectedSymbol}
            style={{ width: "100%", padding: "6px", borderRadius: "6px" }}
          >
            <optgroup label="Watchlist">
              {currentWatchlist.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </optgroup>
            <optgroup label="Holdings">
              {mockHoldings.map((h) => (
                <option key={h.symbol} value={h.symbol}>
                  {h.symbol}
                </option>
              ))}
            </optgroup>
          </select>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={() => console.log("Add to Portfolio clicked")}
              style={{
                flex: 1,
                padding: "8px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Add
            </button>

            <button
              onClick={() => console.log("Remove from Portfolio clicked")}
              style={{
                flex: 1,
                padding: "8px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>

        <div>
          <h4>Current Holdings:</h4>
          <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "14px" }}>
            {mockHoldings.map((h) => (
              <li
                key={h.symbol}
                style={{
                  marginBottom: "8px",
                  padding: "6px 8px",
                  backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)", /* Transparent background with slight white tint */
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  backdropFilter: "blur(8px)", /* Glassmorphism blur effect */
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", /* Slight shadow for depth */
                  color: "#fff", /* White text for contrast */
                }}
              >
                <span>
                  <strong>{h.symbol}</strong> ({h.quantity} shares)
                </span>
                <span style={{ color: "#fff" }}>${h.avgPrice}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="main">
        {chartData.length > 0 && (
          <>
            <div className="summary-boxes">
              <div className="box">
                <h4>Current</h4>
                <p>${latestPrice.toFixed(2)}</p>
              </div>
              <div className="box">
                <h4>Invested</h4>
                <p>${invested.toLocaleString()}</p>
              </div>
              <div className="box">
                <h4>P/L</h4>
                <p style={{ color: profitLoss >= 0 ? "green" : "red" }}>
                  ${profitLoss.toFixed(2)}
                </p>
              </div>
              <div className="box">
                <h4>Rate of Return</h4>
                <p style={{ color: rateOfReturn >= 0 ? "green" : "red" }}>
                  {rateOfReturn.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="chart-container">
              <StockChart symbol={selectedSymbol} />
              <div className="stock-details-container">
                <StockDetails symbol={selectedSymbol} />
              </div>
            </div>

            <NewsSentiment symbol={selectedSymbol} />
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
