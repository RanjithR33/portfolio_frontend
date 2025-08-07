import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

// Define Holding type
type Holding = {
  holding_id: number;
  account_name: string;
  ticker_symbol: string;
  asset_name: string;
  quantity: number;
  average_buy_price: number;
  cost_basis: number;
  market_value: number;
  unrealized_pnl: number;
  last_price: number | null;
};
type Props = {
  theme: any;
};

const GraphPage: React.FC<Props> = ({ theme }) => {
  const [portfolioData, setPortfolioData] = useState<Holding[]>([]);
  const portfolioId = "1"; // You can dynamically set the portfolioId here

  // Fetch holdings data when portfolioId changes
  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/portfolio/${portfolioId}/holdings`)
      .then((res) => res.json())
      .then((data) => setPortfolioData(data))
      .catch((err) => console.error("Error fetching detailed holdings:", err));
  }, [portfolioId]);

  // --- Bar Chart Data ---
  const labels = portfolioData.map((item) => item.ticker_symbol);
  const values = portfolioData.map((item) => item.unrealized_pnl);

  const data = {
    labels,
    datasets: [
      {
        label: "Unrealized P&L ($)",
        data: values,
        backgroundColor: values.map((v) =>
          v >= 0 ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)"
        ),
        borderColor: values.map((v) =>
          v >= 0 ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 14,
            weight: "bold" as const,
          },
        },
      },
      title: {
        display: true,
        text: "Unrealized P&L by Stock",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$ ${context.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "P&L ($)",
          font: {
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Ticker",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  // --- Render the chart and table ---
  return (
    <div
      className={theme}
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#f7f7f7" : "#1f1f1f",
        color: "#808080",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 0 12px rgba(0,0,0,0.1)",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Portfolio Overview
        </h2>

        {/* Chart Section */}
        <div style={{ height: "400px", marginBottom: "40px" }}>
          <Bar data={data} options={options} />
        </div>

        {/* Table Section */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1" }}>
              <th style={thStyle}>Ticker</th>
              <th style={thStyle}>Asset Name</th>
              <th style={thStyle}>Avg. Price</th>
              <th style={thStyle}>Market Value</th>
              <th style={thStyle}>Unrealized P&L</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.map((item) => (
              <tr key={item.holding_id}>
                <td style={tdStyle}>{item.ticker_symbol}</td>
                <td style={tdStyle}>{item.asset_name}</td>
                <td style={tdStyle}>$ {item.average_buy_price.toFixed(2)}</td>
                <td style={tdStyle}>$ {item.market_value.toFixed(2)}</td>
                <td
                  style={{
                    ...tdStyle,
                    color: item.unrealized_pnl >= 0 ? "green" : "red",
                  }}
                >
                  $ {item.unrealized_pnl.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Styles ---
const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

export default GraphPage;
