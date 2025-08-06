import React, { useState, useEffect } from "react";
import Watchlist from "./Watchlist";
import SearchBar from "./SearchBar";
import StockChart from "./StockChart";
import StockDetails from "./StockDetails";
import NewsSentiment from "./NewsSentiment";
import "./App.css";
import CustomDropdown from "./CustomDropdown";
import { useNavigate, useParams } from "react-router-dom";

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

type Performance = {
  current_holdings_worth: any;
  overall_pl: any;
  overall_pl_percent: any;
  todays_change_amount: any;
  total_initial_investment:any;
};

type ApiResponse = {
  accounts: Array<{ account_type: string; balance: number; id: number; name: string }>;
  detailed_holdings: Array<{
    asset_name: string;
    average_buy_price: number;
    current_price: number;
    market_value: number;
    quantity: number;
    ticker_symbol: string;
    unrealized_pnl: number;
  }>;
  insights: any;
  market_indices: any;
  net_worth: number;
  performance: Performance;
};

// Add this to the top of HomePage.tsx
type Holding = {
  holding_id: number;
  account_name: string;
  ticker_symbol: string;
  asset_name: string;
  quantity: number;
  average_price: number;
  cost_basis: number;
  market_value: number;
  unrealized_pnl: number;
  last_price: number | null;
};

const HomePage: React.FC<{ theme: string }> = ({ theme }) => {
  const [watchlists, setWatchlists] = useState<Watchlists>({});
  const [currentListName, setCurrentListName] = useState<string>("Default");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [portfolioId] = useState<number>(1); // Example portfolioId, set this dynamically

  const [newListName, setNewListName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // const latestPrice = chartData[chartData.length - 1]?.close || 0;
  // const invested = 10000;
  // const shares = 100;
  // const currentValue = latestPrice * shares;
  // const profitLoss = currentValue - invested;
  // const rateOfReturn = (profitLoss / invested) * 100;
  const [holdings, setHoldings] = useState<Holding[]>([]);
  

  const [portfolioworth ,Setworth] = useState<number>(1);

  const [portfolioPL ,SetPL] = useState<number>(1);
  
  const [portfolioPLpercent ,SetPLpercent] = useState<number>(1);
  
  const [portfolioInvestment ,SetInvestment] = useState<number>(1);
  // const [performanceData, setPerformanceData] = useState<Performance | null>(null);


  const navigate = useNavigate();
  const { symbol, action } = useParams();  // Capture symbol and action from the URL

  useEffect(() => {
    if (symbol) {
      setSelectedSymbol(symbol); // Update selectedSymbol based on URL
    }
  }, [symbol]);  // Run when symbol changes in the URL

  const handleAddClick = () => {
    navigate(`/transactions/${selectedSymbol}/buy`);  // Use selectedSymbol here
  };

  const handleRemoveClick = () => {
    navigate(`/transactions/${selectedSymbol}/sell`);  // Use selectedSymbol here
  };
  // Fetch API data when the component mounts
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/portfolio/${portfolioId}/summary`);
        const data: ApiResponse = await response.json();

        // Extract only the relevant performance data from the API response
        console.log("API Response:", data.performance);
        Setworth(data.performance.current_holdings_worth);
        SetPL(data.performance.overall_pl);
        SetPLpercent(data.performance.overall_pl_percent);
        SetInvestment(data.performance.total_initial_investment);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
      }
    };

    fetchPortfolioData();
  }, [portfolioId]);
  
  // Extract performance data
  // const { current_holdings_worth, overall_pl, total_initial_investment } = performanceData;

  // Calculate Rate of Return




  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/portfolio/${portfolioId}/holdings-value`)
      .then(res => res.json())
      .then(value => {
        // Optionally display total holdings value elsewhere
      })
      .catch(err => console.error("Error fetching total value:", err));
  
    fetch(`http://localhost:5000/api/v1/portfolio/${portfolioId}/holdings`)
      .then(res => res.json())
      .then((data) => setHoldings(data))
      .catch(err => console.error("Error fetching detailed holdings:", err));
  }, [portfolioId]);
  
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
  // useEffect(() => {
  //   fetch(`http://127.0.0.1:5000/api/v1//portfolio/{portfolio_id}/summary`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const watchlistMap: Watchlists = {};
  //       data.forEach((watchlist: any) => {
  //         watchlistMap[watchlist.name] = {
  //           id: watchlist.id,
  //           name: watchlist.name,
  //           items: watchlist.items || [],
  //         };
  //       });
  //       setWatchlists(watchlistMap);
  //       if (data.length > 0) setCurrentListName(data[0].name);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching watchlists:", err);
  //     });
  // }, [portfolioId]);

  useEffect(() => {
    if (!selectedSymbol) return;

    fetch(
        //  `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=p76qI5YAashYVDQdOsjPy9gCqER6pJ4c`
        `https://financialmodelingprep.com/api/v3/historical-price-full/${selectedSymbol}?serietype=line&apikey=PLBb4Vn8eW8bLQ3MvtZeutZQo3Tbg7un`
      // `https://financialmodelingprep.com/api/v3/historical-price-full/${selectedSymbol}?serietype=line&apikey=V71VMgepxb3RZYEOoxKVLnRD00hXXyLj`
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
      setErrorMessage("This stock is already in your watchlist.");
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
        setErrorMessage(null); // Reset error message if the operation is successful
      })
      .catch((err) => {
        console.error("Error adding item:", err);
        setErrorMessage("Failed to add item to the watchlist. Please try again.");
      });
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
        
{/* New Watchlist Button and Input */}
<div style={{ marginBottom: "20px" }}>
  <input
    type="text"
    placeholder="Enter new watchlist name"
    value={newListName}
    onChange={(e) => setNewListName(e.target.value)}
    style={{
      width: "95%",
      padding: "8px",
      marginBottom: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    }}
  />
  <button
    onClick={handleCreateWatchlist}
    style={{
      width: "100%",
      padding: "8px",
      backgroundColor: "#28a745", // Green button
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Create New Watchlist
  </button>
</div>

<div style={{ marginBottom: "20px" }}>
  <SearchBar onAdd={addToWatchlist} />

  {/* Show error message if there's one */}
  {errorMessage && (
    <div
      style={{
        color: "#fff", // White text
        fontSize: "14px", // Normal font size
        fontWeight: "500", // Medium font weight
        backgroundColor: "#d32f2f", // Red background
        padding: "12px 16px", // Sufficient padding for better spacing
        borderRadius: "4px", // Slight rounded corners
        marginTop: "8px", // Space between search bar and error message
      }}
    >
      {errorMessage}
    </div>
  )}
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
            {Array.from(
  new Set(holdings.map((h) => h.ticker_symbol))
).map((symbol) => (
  <option key={symbol} value={symbol}>
    {symbol}
  </option>
))}

</optgroup>


          </select>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
      <button
        onClick={() => handleAddClick()}  // Replace "AAPL" with your symbol
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
        BUY
      </button>

      <button
        onClick={() => handleRemoveClick()}  // Replace "AAPL" with your symbol
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
        SELL
      </button>
    </div>
        </div>
       
 
        {/* <div>
  <h4>Current Holdings:</h4>
  <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "14px" }}>
    {holdings.map((h) => (
      <li
        key={h.holding_id}
        style={{
          marginBottom: "8px",
          padding: "6px 8px",
          backgroundColor:
            theme === "light"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.2)",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          color: "#fff",
        }}
      >
        <span>
          <strong>{h.ticker_symbol}</strong> ({h.quantity} @ ${h.average_price.toFixed(2)})
        </span>
        <span style={{ color: h.unrealized_pnl >= 0 ? "#0f0" : "#f00" }}>
          ${h.market_value.toFixed(2)} ({h.unrealized_pnl >= 0 ? "+" : ""}${h.unrealized_pnl.toFixed(2)})
        </span>
      </li>
    ))}
  </ul>
</div> */}

      </aside>

      <main className="main">
      <div className="summary-boxes">
    <div className="box">
      <h4>Current</h4>
      <p>
        ${portfolioworth}      </p>
    </div>

    <div className="box">
      <h4>Invested</h4>
      <p>
        ${portfolioInvestment}
      </p>
    </div>

    <div className="box">
      <h4>P/L</h4>
      <p style={{ color: portfolioPL >= 0 ? "green" : "red" }}>
        ${portfolioPL.toFixed(2)}
      </p>
    </div>

    <div className="box">
      <h4>Rate of Return</h4>
      <p style={{ color: portfolioPLpercent >= 0 ? "green" : "red" }}>
        {portfolioPLpercent.toFixed(2)}%
      </p>
    </div>
  </div>
        {chartData.length > 0 && (
          <>
            
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
