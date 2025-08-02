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
              key={item.asset_id} // use asset_id as unique key
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
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
                onClick={() => onRemove(item.ticker_symbol)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Watchlist;
