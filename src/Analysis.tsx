import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const data = {
  accounts: [
    {
      account_type: "CASH",
      balance: 6791.87,
      id: 1,
      name: "Primary Cash Account",
    },
    {
      account_type: "INVESTMENT",
      balance: 51499.08,
      id: 2,
      name: "Main Brokerage Account",
    },
    {
      account_type: "RETIREMENT",
      balance: 0,
      id: 3,
      name: "Roth IRA",
    },
  ],
  net_worth: 58290.95,
  performance: {
    current_holdings_worth: 51499.08,
    overall_pl: -42851.26,
    overall_pl_percent: -45.42,
    todays_change_amount: -1257.75,
    total_initial_investment: 94350.34,
  },
  insights: {
    top_gainers: [
      { name: "Johnson & Johnson", change_amount: 103.6 },
      { name: "PepsiCo, Inc.", change_amount: 31.28 },
      { name: "CVS Health Corporation", change_amount: 14.06 },
      { name: "AT&T Inc.", change_amount: 6.46 },
      { name: "Verizon Communications Inc.", change_amount: 5.76 },
    ],
    top_losers: [
      { name: "UnitedHealth Group", change_amount: -778.14 },
      { name: "Amazon.com, Inc.", change_amount: -271.04 },
      { name: "JPMorgan Chase & Co.", change_amount: -206.1 },
      { name: "Microsoft Corp", change_amount: -103.29 },
      { name: "Alphabet Inc.", change_amount: -38.78 },
    ],
  },
  market_indices: [
    { name: "S&P 500", change_percent: 147.37 },
    { name: "Dow Jones", change_percent: 134.22 },
    { name: "Nasdaq", change_percent: 195.37 },
    { name: "Russell 2000", change_percent: 210.09 },
  ],
};

const netWorthPie = {
  labels: data.accounts.filter((a) => a.balance > 0).map((a) => a.name),
  datasets: [
    {
      label: "Account Balance",
      data: data.accounts.filter((a) => a.balance > 0).map((a) => a.balance),
      backgroundColor: ["#ff9800", "#9c27b0", "#03a9f4"],
      borderWidth: 1,
      borderColor: "#fff",
    },
  ],
};

const topGainersData = {
  labels: data.insights.top_gainers.map((g) => g.name),
  datasets: [
    {
      label: "Gains (₹)",
      data: data.insights.top_gainers.map((g) => g.change_amount),
      backgroundColor: "#4caf50",
    },
  ],
};

const topLosersData = {
  labels: data.insights.top_losers.map((l) => l.name),
  datasets: [
    {
      label: "Losses (₹)",
      data: data.insights.top_losers.map((l) => Math.abs(l.change_amount)),
      backgroundColor: "#f44336",
    },
  ],
};

const performanceData = {
  labels: [
    "Total Initial Investment",
    "Current Holdings Worth",
    "Overall P&L",
    "Today's Change",
  ],
  datasets: [
    {
      label: "Amount (₹)",
      data: [
        data.performance.total_initial_investment,
        data.performance.current_holdings_worth,
        data.performance.overall_pl,
        data.performance.todays_change_amount,
      ],
      backgroundColor: ["#1976d2", "#4caf50", "#f44336", "#ff9800"],
    },
  ],
};

const AnalysisPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📊 Portfolio Analysis</h2>

      {/* Market Indices */}
      <div style={styles.indicesContainer}>
        {data.market_indices.map((index) => (
          <div key={index.name} style={styles.indexBox}>
            <p style={styles.indexName}>{index.name}</p>
            <p
              style={{
                ...styles.indexValue,
                color: index.change_percent >= 0 ? "#4caf50" : "#f44336",
              }}
            >
              {index.change_percent.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h4 style={styles.chartTitle}>💰 Net Worth Allocation</h4>
          <div style={styles.smallPieWrapper}>
            <Pie data={netWorthPie} />
          </div>
        </div>

        <div style={styles.chartCard}>
          <h4 style={styles.chartTitle}>🚀 Top Gainers</h4>
          <Bar data={topGainersData} />
        </div>

        <div style={styles.chartCard}>
          <h4 style={styles.chartTitle}>📉 Top Losers</h4>
          <Bar data={topLosersData} />
        </div>

        <div style={styles.chartCard}>
          <h4 style={styles.chartTitle}>📈 Performance Overview</h4>
          <Bar data={performanceData} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "20px",
    fontSize: "24px",
  },
  indicesContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap" as const,
    gap: "16px",
    marginBottom: "30px",
  },
  indexBox: {
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px 16px",
    width: "140px",
    textAlign: "center" as const,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  indexName: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "6px",
    fontWeight: 600,
  },
  indexValue: {
    fontSize: "18px",
    fontWeight: 700,
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  chartCard: {
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    height: "400px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px", // 📏 Reduce spacing between elements
  },
  chartTitle: {
    margin: "6px 0 0 0", // 📏 Tighter spacing
    fontSize: "16px",
    fontWeight: 600,
    color: "black",
    textAlign: "center" as const,
  },
  smallPieWrapper: {
    width: "280px", // 📏 Slightly smaller
    height: "280px",
  },
};

export default AnalysisPage;
