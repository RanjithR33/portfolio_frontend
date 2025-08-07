import React, { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  description: string;
}

interface Props {
  symbol: string;
  theme: any;
}

const NewsSentiment: React.FC<Props> = ({ symbol, theme }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "pub_a370ba3baefe47dfb6e03144b10a90a3"; // Replace with your key

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${symbol}&language=en&category=business`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.results)) {
          const limited = data.results.slice(0, 5); // Limit to 5 items
          setNews(limited);
        } else {
          setNews([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError("Could not fetch news.");
      })
      .finally(() => setLoading(false));
  }, [symbol]);

  // Theme-based styling
  const isLight = theme === "light";

  const containerStyle: React.CSSProperties = {
    background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
    color: isLight ? "#000" : "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    backdropFilter: isLight ? undefined : "blur(8px)",
    boxShadow: isLight
      ? "0 4px 12px rgba(0, 0, 0, 0.05)"
      : "0 4px 20px rgba(0, 0, 0, 0.2)",
    border: isLight ? "1px solid #ddd" : "1px solid rgba(255, 255, 255, 0.2)",
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: "12px",
    color: isLight ? "#333" : "#fff",
  };

  const linkStyle: React.CSSProperties = {
    fontWeight: "bold",
    textDecoration: "none",
    color: isLight ? "#1976d2" : "#64b5f6",
  };

  const metaStyle: React.CSSProperties = {
    fontSize: "12px",
    color: isLight ? "#666" : "#ccc",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "13px",
    marginTop: 4,
    color: isLight ? "#444" : "#ccc",
  };

  const errorStyle: React.CSSProperties = {
    color: "#db4437",
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>📢 Stock News</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <ul style={{ listStyle: "disc", paddingLeft: 20 }}>
        {news.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={linkStyle}
            >
              {item.title}
            </a>
            <div style={metaStyle}>
              {item.source_id} – {new Date(item.pubDate).toLocaleString()}
            </div>
            {item.description && (
              <p style={descriptionStyle}>
                {item.description.slice(0, 120)}...
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSentiment;
