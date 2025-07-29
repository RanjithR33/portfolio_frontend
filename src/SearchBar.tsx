import React, { useState } from "react";

interface Props {
  onAdd: (symbol: string) => void;
}

const SearchBar: React.FC<Props> = ({ onAdd }) => {
  const [symbol, setSymbol] = useState("");

  const handleAdd = () => {
    if (symbol.trim()) {
      onAdd(symbol.toUpperCase());
      setSymbol("");
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter stock symbol (e.g., AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default SearchBar;
