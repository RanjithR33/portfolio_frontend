import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

// --- Portfolio Data ---
const portfolioData = [
  {
    ticker_symbol: "MSFT",
    asset_name: "Microsoft Corp",
    average_price: 457.36,
    market_value: 8385.76,
    unrealized_pnl: 1067.95,
  },
  {
    ticker_symbol: "DIS",
    asset_name: "Disney",
    average_price: 366.93,
    market_value: 2681.57,
    unrealized_pnl: -5758.02,
  },
  {
    ticker_symbol: "XOM",
    asset_name: "Exxon Mobil",
    average_price: 458.38,
    market_value: 5482,
    unrealized_pnl: -17437.15,
  },
  {
    ticker_symbol: "MA",
    asset_name: "Mastercard",
    average_price: 329.86,
    market_value: 10637.91,
    unrealized_pnl: 4370.53,
  },
  {
    ticker_symbol: "ADBE",
    asset_name: "Adobe",
    average_price: 201.22,
    market_value: 15651,
    unrealized_pnl: 6596.09,
  },
];

// --- Bar Chart Data ---
const labels = portfolioData.map((item) => item.ticker_symbol);
const values = portfolioData.map((item) => item.unrealized_pnl);

const data = {
  labels,
  datasets: [
    {
      label: "Unrealized P&L (₹)",
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
        label: (context: any) => `₹ ${context.formattedValue}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: "P&L (₹)",
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

// --- Main Component ---
const GraphPage: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        color: "black",
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
              <tr key={item.ticker_symbol}>
                <td style={tdStyle}>{item.ticker_symbol}</td>
                <td style={tdStyle}>{item.asset_name}</td>
                <td style={tdStyle}>₹ {item.average_price.toFixed(2)}</td>
                <td style={tdStyle}>₹ {item.market_value.toFixed(2)}</td>
                <td
                  style={{
                    ...tdStyle,
                    color: item.unrealized_pnl >= 0 ? "green" : "red",
                  }}
                >
                  ₹ {item.unrealized_pnl.toFixed(2)}
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
