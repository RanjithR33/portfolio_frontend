import React, { useEffect, useRef } from "react";

interface Props {
  symbol: string; // Example: "AAPL", "TSLA", "RELIANCE"
}

const StockChart: React.FC<Props> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).TradingView) {
        new (window as any).TradingView.widget({
          container_id: `tv-chart-${symbol}`,
          symbol: `NASDAQ:${symbol}`, // or NSE:RELIANCE
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: false,
          allow_symbol_change: true,
          width: "100%",
          height: "500",
        });
      }
    };
    containerRef.current?.appendChild(script);
  }, [symbol]);

  return (
    <div
      id={`tv-chart-${symbol}`}
      ref={containerRef}
      style={{ height: "500px", width: "100%", marginTop: "20px" }}
    />
  );
};

export default StockChart;
