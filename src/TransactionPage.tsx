import React, { useState, useEffect } from "react";

// StockDetails Component remains unchanged
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

function TransactionPage() {
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT" | "STOP_LOSS">("MARKET");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [selectedStock, setSelectedStock] = useState<string>("AAPL");
  const [transactionDate] = useState<string>(new Date().toISOString().split("T")[0]);
  // const [description, setDescription] = useState<string>("");

  const handleTransaction = () => {
    const transactionData = {
      account_id: 1,
      ticker: selectedStock,
      transaction_type: transactionType.toUpperCase(),
      order_type: orderType,
      quantity: quantity
    };

    fetch("http://localhost:5000/api/v1/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      console.log("Transaction Data:", transactionData);
  };

  const handlePriceFetched = (fetchedPrice: number) => {
    setPrice(fetchedPrice);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredQuantity = Number(e.target.value);
    setQuantity(enteredQuantity);
  };

  const amount = price * quantity;

  return (
    <div className="transaction-page" style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Transaction Page</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Stock Ticker:
          <input
            type="text"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value.toUpperCase())}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", marginBottom: "10px" }}
          />
        </label>
      </div>

      <StockDetails symbol={selectedStock} onPriceFetched={handlePriceFetched} />

      <div style={{ marginBottom: "20px" }}>
        <label>
          Transaction Type:
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as "buy" | "sell")}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", marginBottom: "10px" }}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Order Type:
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as "MARKET" | "LIMIT" | "STOP_LOSS")}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", marginBottom: "10px" }}
          >
            <option value="MARKET">Market</option>
            <option value="LIMIT">Limit</option>
            <option value="STOP_LOSS">Stop Loss</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", marginBottom: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Amount:
          <input
            type="number"
            value={amount.toFixed(2)}
            disabled
            style={{ width: "100%", padding: "8px", borderRadius: "6px", marginBottom: "10px" }}
          />
        </label>
      </div>

  

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
