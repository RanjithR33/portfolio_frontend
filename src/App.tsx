import React, { useState, useEffect } from "react";
import "./App.css";
import Watchlist from "./Watchlist";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart";
import StockDetails from "./StockDetails";
import NewsSentiment from "./NewsSentiment";

function App() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : ["AAPL", "MSFT", "GOOG", "TSLA", "AMZN"];
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");

  const mockHoldings = [
    { symbol: "AAPL", quantity: 50, avgPrice: 180 },
    { symbol: "TSLA", quantity: 20, avgPrice: 750 },
    { symbol: "AMZN", quantity: 10, avgPrice: 3100 },
    { symbol: "GOOG", quantity: 15, avgPrice: 2700 },
    { symbol: "MSFT", quantity: 25, avgPrice: 295 },
    { symbol: "NFLX", quantity: 12, avgPrice: 550 },
    { symbol: "META", quantity: 30, avgPrice: 330 },
    { symbol: "NVDA", quantity: 18, avgPrice: 620 },
    { symbol: "ADBE", quantity: 14, avgPrice: 480 },
    { symbol: "ORCL", quantity: 22, avgPrice: 90 },
  ];

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (!selectedSymbol) return;

    fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${selectedSymbol}?serietype=line&apikey=uJCcPpdhlH3MTrn7JwRtHnoSP4XR1MiG`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.historical) {
          setChartData(data.historical.slice(0, 30).reverse());
        }
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
        setChartData([]);
      });
  }, [selectedSymbol]);

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((item) => item !== symbol));
    if (selectedSymbol === symbol && watchlist.length > 1) {
      setSelectedSymbol(watchlist.find((s) => s !== symbol) || "AAPL");
    }
  };

  const latestPrice = chartData[chartData.length - 1]?.close || 0;
  const invested = 10000;
  const shares = 100;
  const currentValue = latestPrice * shares;
  const profitLoss = currentValue - invested;
  const rateOfReturn = (profitLoss / invested) * 100;

  return (
    <div className="app">
      <aside className="sidebar">
        <SearchBar onAdd={addToWatchlist} />
        <Watchlist symbols={watchlist} onRemove={removeFromWatchlist} />

        <div style={{ padding: "10px" }}>
          <h4>Select stock for chart:</h4>
          <select
            onChange={(e) => setSelectedSymbol(e.target.value)}
            value={selectedSymbol}
            style={{
              width: "100%",
              padding: "6px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <optgroup label="Watchlist">
              {watchlist.map((symbol) => (
                <option key={`watchlist-${symbol}`} value={symbol}>
                  {symbol}
                </option>
              ))}
            </optgroup>

            <optgroup label="Holdings">
              {mockHoldings.map((h) => (
                <option key={`holding-${h.symbol}`} value={h.symbol}>
                  {h.symbol}
                </option>
              ))}
            </optgroup>
          </select>

          <div style={{ display: "flex", gap: "8px" }}>
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

          <div style={{ marginTop: "16px" }}>
            <h4>Current Holdings:</h4>
            <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "14px" }}>
              {mockHoldings.map((h) => (
                <li
                  key={h.symbol}
                  style={{
                    marginBottom: "8px",
                    padding: "6px 8px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <strong>{h.symbol}</strong> ({h.quantity} shares)
                  </span>
                  <span style={{ color: "#666" }}>${h.avgPrice}</span>
                </li>
              ))}
            </ul>
          </div>
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
              <StockChart historical={chartData} />
              <div className="stock-details-container">
                <StockDetails symbol={selectedSymbol} />
              </div>
            </div>

            {/* New Section: News + Sentiment */}
            <NewsSentiment symbol={selectedSymbol} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
