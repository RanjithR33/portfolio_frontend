import React, { useState, useEffect } from "react";

interface Transaction {
  asset_ticker: string;
  description: string;
  id: number;
  price_per_unit: number;
  quantity: number;
  total_amount: number;
  transaction_date: string;
  transaction_type: string;
}

const PurchaseHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch transaction data
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/transactions/account/1`);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Empty dependency array to run only once when component mounts

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Purchase History</h1>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th>Asset</th>
            <th>Description</th>
            <th>Price Per Unit</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Transaction Date</th>
            <th>Transaction Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} style={transactionRowStyle}>
              <td>{transaction.asset_ticker}</td>
              <td>{transaction.description}</td>
              <td>${transaction.price_per_unit}</td>
              <td>{transaction.quantity}</td>
              <td
                style={{
                  color: transaction.total_amount < 0 ? "#E74C3C" : "#27AE60", // red for buys, green for sells
                  fontWeight: "bold",
                }}
              >
                ${Math.abs(transaction.total_amount).toFixed(2)}
              </td>
              <td>{transaction.transaction_date}</td>
              <td>{transaction.transaction_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "white",
  marginBottom: "30px",
  fontSize: "2rem",
  fontWeight: "600",
};

const tableStyle: React.CSSProperties = {
  width: "80%",
  borderCollapse: "collapse",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  backgroundColor: "#fff",
};

const theadStyle: React.CSSProperties = {
  backgroundColor: "#34495e",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textTransform: "uppercase",
};

const transactionRowStyle: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  textAlign: "center",
  fontSize: "14px",
  padding: "12px",
  transition: "background-color 0.3s",
  color: "black",
};

export default PurchaseHistoryPage;
