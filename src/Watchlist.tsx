import React from "react";

type Item = {
  ticker_symbol: string;
  asset_id: number;
};

type Props = {
  items: Item[];
  onRemove: (symbol: string) => void;
};

const Watchlist: React.FC<Props> = ({ items, onRemove }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Watchlist</h4>
      {items.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#777" }}>
          No stocks in this watchlist.
        </p>
      ) : (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {items.map((item) => (
            <li
              key={item.asset_id} // Use asset_id as unique key
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>{item.ticker_symbol}</span>
              <button
                style={{
                  backgroundColor: "transparent", // Transparent background for "X"
                  color: "#dc3545", // Red color for the "X"
                  border: "none",
                  fontSize: "16px", // Adjust font size
                  cursor: "pointer",
                  padding: "0",
                  marginLeft: "8px", // Space between ticker and "X"
                }}
                onClick={() => onRemove(item.ticker_symbol)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Watchlist;
