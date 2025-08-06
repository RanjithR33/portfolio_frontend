import React, { useEffect, useState } from "react";
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

const AnalysisPage = () => {
  const [data, setData] = useState<any>(null);
  const portfolioId = 1; // Replace with dynamic ID if needed

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/portfolio/${portfolioId}/summary`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching analysis data:", err));
  }, [portfolioId]);

  if (!data) return <p>Loading analysis...</p>;

  const topGainersData = {
    labels: data.insights.top_gainers.map((g: any) => g.name),
    datasets: [
      {
        label: "Gains (₹)",
        data: data.insights.top_gainers.map((g: any) => g.change_amount),
        backgroundColor: "#4caf50",
      },
    ],
  };

  const topLosersData = {
    labels: data.insights.top_losers.map((l: any) => l.name),
    datasets: [
      {
        label: "Losses (₹)",
        data: data.insights.top_losers.map((l: any) => Math.abs(l.change_amount)),
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

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📊 Portfolio Analysis</h2>

      {/* Market Indices */}
      <div style={styles.indicesContainer}>
        {data.market_indices.map((index: any) => (
          <div key={index.name} style={styles.indexBox}>
            <p style={styles.indexName}>{index.name}</p>
            <p
              style={{
                ...styles.indexValue,
                color: index.change_percent >= 0 ? "#4caf50" : "#f44336",
              }}
            >
              {(index.change_percent / 100).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        {/* Top Gainers */}
        <div style={styles.chartCard}>
          <h4 style={styles.chartTitle}>🚀 Top Gainers</h4>
          <Bar data={topGainersData} />
        </div>

        {/* Top Losers */}
        <div style={styles.chartCard}>
          <h4 style={styles.chartTitle}>📉 Top Losers</h4>
          <Bar data={topLosersData} />
        </div>
      </div>

      {/* Performance Overview - Centered */}
      <div style={styles.centeredChartContainer}>
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
    gap: "10px",
  },
  chartTitle: {
    margin: "6px 0 0 0",
    fontSize: "16px",
    fontWeight: 600,
    color: "black",
    textAlign: "center" as const,
  },
  centeredChartContainer: {

    justifyContent: "center",
    marginTop: "30px", // Add some space above the centered chart
    marginBottom: "20px",
  },
  // Adjust the chart card inside the centered container to make it visually consistent with others
  centeredChartCard: {
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    height: "400px",
    width: "100%", // Ensure it spans the available width for a balanced layout
    maxWidth: "600px", // Limit max width for large screens
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px",
  },
};

export default AnalysisPage;
