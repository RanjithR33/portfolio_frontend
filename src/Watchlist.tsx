import React, { useEffect, useState } from "react";

interface WatchlistProps {
  symbols: string[];
  onRemove: (symbol: string) => void;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changesPercentage: number;
}

const Watchlist: React.FC<WatchlistProps> = ({ symbols, onRemove }) => {
  const [data, setData] = useState<StockData[]>([]);

  useEffect(() => {
    if (symbols.length === 0) return;

    fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbols.join(
        ","
      )}?apikey=uJCcPpdhlH3MTrn7JwRtHnoSP4XR1MiG`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error("Invalid API response:", data);
          setData([]); // Avoid crash
        }
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
        setData([]); // Avoid crash
      });
  }, [symbols]);

  return (
    <div>
      <h3>Your Watchlist</h3>
      <ul className="watchlist">
        {data.map((stock) => (
          <li key={stock.symbol}>
            <strong>{stock.symbol}</strong>
            <span className={stock.change >= 0 ? "green" : "red"}>
              ${stock.price.toFixed(2)} ({stock.change.toFixed(2)} |{" "}
              {stock.changesPercentage.toFixed(2)}%)
            </span>
            <button onClick={() => onRemove(stock.symbol)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
