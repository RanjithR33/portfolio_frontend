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
        const exchanges = [ "NYSE","NASDAQ", "AMEX"];
        let exchangeIndex = 0;
    
        const tryNextExchange = () => {
          const exchange = exchanges[exchangeIndex];
          const widget = new (window as any).TradingView.widget({
            container_id: `tv-chart-${symbol}`,
            symbol: `${symbol}`,
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
            autosize: true,
            // Fallback detection using `onReady`
            overrides: {},
            studies_overrides: {},
            // This will trigger when chart loads or fails
            // If chart failed (likely invalid symbol), try next
            container: document.getElementById(`tv-chart-${symbol}`),
            onChartReady: function () {
              const iframe = document.querySelector(`#tv-chart-${symbol} iframe`);
              if (!iframe) {
                exchangeIndex++;
                if (exchangeIndex < exchanges.length) {
                  tryNextExchange();
                }
              }
            }
          });
        };
    
        tryNextExchange();
      }
    };
    containerRef.current?.appendChild(script);
    
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
