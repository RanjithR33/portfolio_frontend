import React, { useState, useEffect } from "react";

// StockDetails Component to fetch stock price dynamically
function StockDetails({ symbol, onPriceFetched }: { symbol: string; onPriceFetched: (price: number) => void }) {
  const [quote, setQuote] = useState<any | null>(null);

  useEffect(() => {
    fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=5r0X2y0O08MWTyCtJO0y8S1qo24H4K2D`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setQuote(data[0]);
          // Pass the fetched price to the parent component
          onPriceFetched(data[0].price);
        }
      });
  }, [symbol, onPriceFetched]);

  if (!quote) return <div>Loading stock data...</div>;

  return (
    <div>
      <h4>
        {quote.name} ({symbol})
      </h4>
      <p>💰 Price: ${quote.price.toFixed(2)}</p>
      <p>
        📈 Change: {quote.change.toFixed(2)} (
        {quote.changesPercentage.toFixed(2)}%)
      </p>
      <p>🔼 High: ${quote.dayHigh}</p>
      <p>🔽 Low: ${quote.dayLow}</p>

    </div>
  );
}

// Main TransactionPage Component
function TransactionPage() {
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0); // This will be autofilled from StockDetails
  const [selectedStock, setSelectedStock] = useState<string>("AAPL"); // Default ticker
  const [transactionDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");

  // Function to handle the transaction form submission
  const handleTransaction = () => {
    const transactionData = {
      account_id: 1,
      transaction_type: transactionType.toUpperCase(),
      total_amount: price * quantity,
      transaction_date: transactionDate,
      asset_ticker: selectedStock,
      quantity,
      price_per_unit: price,
      description,
    };

    fetch("http://localhost:5000/api/v1/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Transaction successful!");
        } else if (data.error) {
          alert(`Error: ${data.error}`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an issue processing the transaction.");
      });
  };

  // Function to handle the fetched price from StockDetails
  const handlePriceFetched = (fetchedPrice: number) => {
    setPrice(fetchedPrice);
  };

  // Function to handle quantity change and recalculate amount
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredQuantity = Number(e.target.value);
    setQuantity(enteredQuantity);
  };

  // Calculate the total amount (price * quantity)
  const amount = price * quantity;

  return (
    <div className="transaction-page" style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Transaction Page</h2>

      {/* Stock Ticker Selection */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Stock Ticker:
          <input
            type="text"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value.toUpperCase())}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          />
        </label>
      </div>

      {/* Stock Details (Price) */}
      <StockDetails symbol={selectedStock} onPriceFetched={handlePriceFetched} /> {/* Display stock details */}

      {/* Transaction Type Selection (Buy/Sell) */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Transaction Type:
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as "buy" | "sell")}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
      </div>

      {/* Quantity Input */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          />
        </label>
      </div>

      {/* Amount Calculation */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Amount:
          <input
            type="number"
            value={amount.toFixed(2)}
            disabled
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          />
        </label>
      </div>

      {/* Description Input */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          />
        </label>
      </div>

      {/* Transaction Date (autofilled with today's date) */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Transaction Date:
          <input
            type="date"
            value={transactionDate}
            disabled
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          />
        </label>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleTransaction}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Submit Transaction
      </button>
    </div>
  );
}

export default TransactionPage;
