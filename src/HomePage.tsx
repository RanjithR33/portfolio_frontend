import React, { useState, useEffect } from "react";
import Watchlist from "./Watchlist";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart";
import StockDetails from "./StockDetails";
import NewsSentiment from "./NewsSentiment";
import "./App.css";
import CustomDropdown from "./CustomDropdown";

// Define types for API responses
type Asset = {
  asset_id: number;
  ticker_symbol: string;
};

type Watchlists = {
  [name: string]: {
    id: number;
    name: string;
    items: Asset[];
  };
};

const HomePage: React.FC<{ theme: string }> = ({ theme }) => {
  const [watchlists, setWatchlists] = useState<Watchlists>({});
  const [currentListName, setCurrentListName] = useState<string>("Default");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");

  const [chartData, setChartData] = useState<any[]>([]);
  const [portfolioId] = useState<number>(1); // Example portfolioId, set this dynamically

  const [newListName, setNewListName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

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

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/v1/watchlists/1`)
      .then((res) => res.json())
      .then((data) => {
        const watchlistMap: Watchlists = {};
        data.forEach((watchlist: any) => {
          watchlistMap[watchlist.name] = {
            id: watchlist.id,
            name: watchlist.name,
            items: watchlist.items || [],
          };
        });
        setWatchlists(watchlistMap);
        if (data.length > 0) setCurrentListName(data[0].name);
      })
      .catch((err) => {
        console.error("Error fetching watchlists:", err);
      });
  }, [portfolioId]);

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
    const currentList = watchlists[currentListName];
    console.log(JSON.stringify({ ticker: symbol }));
    // Prevent duplicates
    if (Array.isArray(currentList?.items) && currentList.items.some(item => item.ticker_symbol === symbol)) {
      return;
    }

    fetch(`http://localhost:5000/api/v1/watchlists/${currentList.id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: symbol }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add item to watchlist");
        return res.json();
      })
      .then((data) => {
        const newAsset: Asset = {
          asset_id: data.asset_id,
          ticker_symbol: symbol,
        };
        setWatchlists((prev) => {
          const updatedItems = [...(prev[currentListName]?.items || []), newAsset];
          return {
            ...prev,
            [currentListName]: {
              ...prev[currentListName],
              items: updatedItems,
            },
          };
        });
      })
      .catch((err) => console.error("Error adding item:", err));
  };

  const removeFromWatchlist = (symbol: string) => {
    const currentList = watchlists[currentListName];
    if (!currentList) return;

    // Find the asset by ticker_symbol
    const assetToRemove = currentList.items.find((item) => item.ticker_symbol === symbol);
    if (!assetToRemove) return;

    const updatedItems = currentList.items.filter(
      (item) => item.asset_id !== assetToRemove.asset_id
    );

    // API call using asset_id
    fetch(
      `http://localhost:5000/api/v1/watchlists/${currentList.id}/items/${symbol}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        setWatchlists((prev) => ({
          ...prev,
          [currentListName]: {
            ...prev[currentListName],
            items: updatedItems,
          },
        }));

        if (selectedSymbol === symbol && updatedItems.length > 0) {
          setSelectedSymbol(updatedItems[0].ticker_symbol);
        }
      })
      .catch((err) => console.error("Error removing item:", err));
  };
  const handleRemoveWatchlist = (name: string) => {
    // Your logic to remove the watchlist
    setWatchlists((prev) => {
      const { [name]: _, ...remainingWatchlists } = prev;
      return remainingWatchlists;
    });
  
    const newCurrentListName = Object.keys(watchlists)[0] || "Default";
    setCurrentListName(newCurrentListName);
  };
  
  
  const handleCreateWatchlist = () => {
    if (newListName.trim() && !watchlists[newListName]) {
      fetch(`http://localhost:5000/api/v1/watchlists/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio_id: portfolioId, name: newListName }),
      })
        .then((res) => res.json())
        .then((newWatchlist) => {
          setWatchlists((prev) => ({
            ...prev,
            [newWatchlist.name]: newWatchlist,
          }));
          setCurrentListName(newWatchlist.name);
          setNewListName("");
          setIsCreating(false);
        })
        .catch((err) => console.error("Error creating watchlist:", err));
    }
  };

  return (
    <div className={`app ${theme}`}>
      <aside className="sidebar">
        <div style={{ marginBottom: "20px" }}>
      <CustomDropdown
          watchlists={watchlists}
          currentListName={currentListName}
          setCurrentListName={setCurrentListName}
          onRemove={handleRemoveWatchlist}
        /></div>

        <div style={{ marginBottom: "20px" }}>
          <SearchBar onAdd={addToWatchlist} />
        </div>

        <Watchlist
          items={watchlists[currentListName]?.items || []}
          onRemove={removeFromWatchlist}
        />

        <div style={{ marginBottom: "20px" }}>
          <h4>Select stock for chart:</h4>
          <select
            onChange={(e) => setSelectedSymbol(e.target.value)}
            value={selectedSymbol}
            style={{ width: "100%", padding: "6px", borderRadius: "6px" }}
          >
            <optgroup label="Watchlist">
              {watchlists[currentListName]?.items?.map((item) => (
                <option key={item.asset_id} value={item.ticker_symbol}>
                  {item.ticker_symbol}
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
