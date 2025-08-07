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

interface Props {
  theme: any;
}

const PurchaseHistoryPage: React.FC<Props> = ({ theme }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Set body background & text color
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#f7f7f7" : "#1f1f1f";
    document.body.style.color = theme === "light" ? "#000" : "#fff";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [theme]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/transactions/account/1"
        );
        if (!response.ok) throw new Error("Failed to fetch transactions.");
        const data = await response.json();
        setTransactions(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  // Styles using theme
  const containerStyle: React.CSSProperties = {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: theme === "light" ? "#000" : "#fff",
    marginBottom: "30px",
    fontSize: "2rem",
    fontWeight: "600",
  };

  const tableStyle: React.CSSProperties = {
    width: "80%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    backgroundColor: theme === "light" ? "#fff" : "#2c3e50",
    color: theme === "light" ? "#000" : "#fff",
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: theme === "light" ? "#34495e" : "#1abc9c",
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
    color: theme === "light" ? "#000" : "#fff",
  };

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
                  color: transaction.total_amount < 0 ? "#E74C3C" : "#27AE60",
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

export default PurchaseHistoryPage;
