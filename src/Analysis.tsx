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

interface Props {
  theme: any;
}

const AnalysisPage: React.FC<Props> = ({ theme }) => {
  const [data, setData] = useState<any>(null);
  const portfolioId = 1; // Replace with dynamic ID if needed

  useEffect(() => {
    // Theme background update
    document.body.style.backgroundColor =
      theme === "light" ? "#f7f7f7" : "#1f1f1f";
    document.body.style.color = theme === "light" ? "#000" : "#fff";

    return () => {
      // Reset on unmount
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [theme]);

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
        label: "Gains ($)",
        data: data.insights.top_gainers.map((g: any) => g.change_amount),
        backgroundColor: "#4caf50",
      },
    ],
  };

  const topLosersData = {
    labels: data.insights.top_losers.map((l: any) => l.name),
    datasets: [
      {
        label: "Losses ($)",
        data: data.insights.top_losers.map((l: any) =>
          Math.abs(l.change_amount)
        ),
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
        label: "Amount ($)",
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

  // Chart options with theme-aware colors for better visibility in dark mode
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === "light" ? "#000" : "#fff", // Legend text color
        },
      },
      title: {
        display: false,
        color: theme === "light" ? "#000" : "#fff", // Title color if needed
      },
      tooltip: {
        bodyColor: theme === "light" ? "#000" : "#fff",
        titleColor: theme === "light" ? "#000" : "#fff",
        backgroundColor: theme === "light" ? "#fff" : "#333",
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === "light" ? "#000" : "#fff", // X axis labels
        },
        grid: {
          color: theme === "light" ? "#ddd" : "#444", // X axis grid lines
        },
      },
      y: {
        ticks: {
          color: theme === "light" ? "#000" : "#fff", // Y axis labels
        },
        grid: {
          color: theme === "light" ? "#ddd" : "#444", // Y axis grid lines
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <h2
        style={{ ...styles.header, color: theme === "light" ? "#000" : "#fff" }}
      >
        📊 Portfolio Analysis
      </h2>

      {/* Market Indices */}
      <div style={styles.indicesContainer}>
        {data.market_indices.map((index: any) => (
          <div
            key={index.name}
            style={{
              ...styles.indexBox,
              background: theme === "light" ? "#fff" : "#2e2e2e",
            }}
          >
            <p
              style={{
                ...styles.indexName,
                color: theme === "light" ? "#333" : "#ccc",
              }}
            >
              {index.name}
            </p>
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
        <div
          style={{
            ...styles.chartCard,
            background: theme === "light" ? "#fff" : "#2e2e2e",
          }}
        >
          <h4
            style={{
              ...styles.chartTitle,
              color: theme === "light" ? "#000" : "#fff",
            }}
          >
            🚀 Top Gainers
          </h4>
          <Bar data={topGainersData} options={chartOptions} />
        </div>

        {/* Top Losers */}
        <div
          style={{
            ...styles.chartCard,
            background: theme === "light" ? "#fff" : "#2e2e2e",
          }}
        >
          <h4
            style={{
              ...styles.chartTitle,
              color: theme === "light" ? "#000" : "#fff",
            }}
          >
            📉 Top Losers
          </h4>
          <Bar data={topLosersData} options={chartOptions} />
        </div>
      </div>

      {/* Performance Overview */}
      <div style={styles.centeredChartContainer}>
        <div
          style={{
            ...styles.centeredChartCard,
            background: theme === "light" ? "#fff" : "#2e2e2e",
          }}
        >
          <h4
            style={{
              ...styles.chartTitle,
              color: theme === "light" ? "#000" : "#fff",
            }}
          >
            📈 Performance Overview
          </h4>
          <Bar data={performanceData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: "border-box" as const,
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
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px 16px",
    width: "140px",
    textAlign: "center" as const,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  indexName: {
    fontSize: "14px",
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
    marginBottom: "30px",
  },
  chartCard: {
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px",
    height: "400px",
    overflow: "hidden",
    flexGrow: 1,
  },
  chartTitle: {
    margin: "6px 0 0 0",
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "center" as const,
  },
  centeredChartContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    marginBottom: "20px",
    width: "100%",
    overflow: "hidden",
    flexWrap: "wrap" as const,
    justifyItems: "center",
  },
  centeredChartCard: {
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    height: "500px",
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px",
    overflow: "hidden",
    flexGrow: 1,
  },
};

export default AnalysisPage;
