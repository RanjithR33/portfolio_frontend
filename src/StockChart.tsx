import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface Props {
  historical?: { date: string; close: number }[];
}

const StockChart: React.FC<Props> = ({ historical }) => {
  if (!historical || historical.length === 0) return null;

  const data = {
    labels: historical.map((item) => item.date).reverse(),
    datasets: [
      {
        label: "Stock Price",
        data: historical.map((item) => item.close).reverse(),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: true },
      y: { display: true },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;
