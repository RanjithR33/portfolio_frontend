// src/StockDetails.tsx
import React, { useEffect, useState } from "react";
import "./StockDetails.css";

interface StockDetailsProps {
  symbol: string;
}

interface Quote {
  price: number;
  changesPercentage: number;
  change: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  name: string;
}

function StockDetails({ symbol }: StockDetailsProps) {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetch(
      // `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=uJCcPpdhlH3MTrn7JwRtHnoSP4XR1MiG`
      //  `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=p76qI5YAashYVDQdOsjPy9gCqER6pJ4c`
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=uJCcPpdhlH3MTrn7JwRtHnoSP4XR1MiG`
      //  `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=V71VMgepxb3RZYEOoxKVLnRD00hXXyLj`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setQuote(data[0]);
        }
      });
  }, [symbol]);

  if (!quote) return <div className="stock-details">Loading...</div>;

  return (
    <div>
      <h4>
        {quote.name} ({symbol})
      </h4>
      <p>💰 Price: ${quote.price.toFixed(2)}</p>
      <p>
        📈 Change: {quote.change.toFixed(2)} (
        {quote.changesPercentage.toFixed(2)}%)
      </p>
      <p>🔼 High: ${quote.dayHigh}</p>
      <p>🔽 Low: ${quote.dayLow}</p>
      <p>📤 Open: ${quote.open}</p>
      <p>📥 Previous Close: ${quote.previousClose}</p>
      <p>📊 Volume: {quote.volume.toLocaleString()}</p>
      <p>🏦 Market Cap: ${Math.round(quote.marketCap / 1e9)}B</p>
    </div>
  );
}

export default StockDetails;
