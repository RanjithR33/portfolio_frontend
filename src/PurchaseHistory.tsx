import React from "react";

const PurchaseHistoryPage: React.FC = () => {
  // Hardcoded transactions data
  const transactions = [
    {
      asset_ticker: "JNJ",
      description: "Market buy of JNJ",
      id: 10,
      price_per_unit: 150.7583,
      quantity: 8,
      total_amount: -1206.07,
      transaction_date: "2025-04-27",
      transaction_type: "BUY",
    },
    {
      asset_ticker: "XOM",
      description: "Market buy of XOM",
      id: 8,
      price_per_unit: 378.1721,
      quantity: 5,
      total_amount: -1890.86,
      transaction_date: "2025-02-24",
      transaction_type: "BUY",
    },
    {
      asset_ticker: "VZ",
      description: "Market buy of VZ",
      id: 4,
      price_per_unit: 170.8494,
      quantity: 15,
      total_amount: -2562.74,
      transaction_date: "2025-02-17",
      transaction_type: "BUY",
    },
    {
      asset_ticker: "ADBE",
      description: "Market buy of ADBE",
      id: 6,
      price_per_unit: 203.2007,
      quantity: 15,
      total_amount: -3048.01,
      transaction_date: "2024-11-07",
      transaction_type: "BUY",
    },
    {
      asset_ticker: "LOW",
      description: "Market buy of LOW",
      id: 5,
      price_per_unit: 91.5803,
      quantity: 22,
      total_amount: -2014.77,
      transaction_date: "2024-10-09",
      transaction_type: "BUY",
    },
    // More transactions...
  ];

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
              <td>${transaction.price_per_unit.toFixed(2)}</td>
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
  color:"black"
};

const tableRowHoverStyle: React.CSSProperties = {
  backgroundColor: "#ecf0f1",
};

// You can add a hover effect to the rows if you want:
const transactionRowStyleHover = {
  ...transactionRowStyle,
  "&:hover": {
    backgroundColor: "#ecf0f1",
  },
};

export default PurchaseHistoryPage;
