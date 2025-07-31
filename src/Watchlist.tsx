import React from "react";

type Props = {
  symbols: string[];
  onRemove: (symbol: string) => void;
};

const Watchlist: React.FC<Props> = ({ symbols, onRemove }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Watchlist</h4>
      {symbols.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#777" }}>
          No stocks in this watchlist.
        </p>
      ) : (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {symbols.map((symbol) => (
            <li
              key={symbol}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>{symbol}</span>
              <button
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
                onClick={() => onRemove(symbol)}
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
