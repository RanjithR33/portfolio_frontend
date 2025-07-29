import React, { useState, useEffect } from "react";
import "./App.css";
import Watchlist from "./Watchlist";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart"; // Make sure this exists
import StockDetails from "./StockDetails";

function App() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("watchlist");
    return saved
      ? JSON.parse(saved)
      : [
          "AAPL",
          "MSFT",
          "GOOG",
          "TSLA",
          "AMZN",
          "NVDA",
          "META",
          "NFLX",
          "INTC",
          "BABA",
        ];
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");

  // Store watchlist in localStorage
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch chart data when selectedSymbol changes
  useEffect(() => {
    if (!selectedSymbol) return;

    fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${selectedSymbol}?serietype=line&apikey=uJCcPpdhlH3MTrn7JwRtHnoSP4XR1MiG`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.historical) {
          setChartData(data.historical.slice(0, 30).reverse()); // last 30 days, newest last
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

  return (
    <div className="app">
      <aside className="sidebar">
        <Watchlist symbols={watchlist} onRemove={removeFromWatchlist} />
        <div style={{ padding: "10px" }}>
          <h4>Select stock for chart:</h4>
          <select
            onChange={(e) => setSelectedSymbol(e.target.value)}
            value={selectedSymbol}
          >
            {watchlist.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="main">
        <SearchBar onAdd={addToWatchlist} />

        {chartData.length > 0 && (
          <div className="chart-container">
            <StockChart historical={chartData} />
            <StockDetails symbol={selectedSymbol} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
