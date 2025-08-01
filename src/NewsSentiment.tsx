import React, { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  description: string;
}

const NewsSentiment = ({ symbol }: { symbol: string }) => {
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
          const limited = data.results.slice(0, 5); // ✅ Enforce max 5 items
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

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.1)", // Semi-transparent white background
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        backdropFilter: "blur(8px)", // Glassmorphism blur effect
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
        color: "#fff", // Text color for better contrast
        border: "1px solid rgba(255, 255, 255, 0.2)", // Light border for glass effect
      }}
    >
      <h3 style={{ marginBottom: "12px", color: "#fff" }}>Stock News</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "#db4437" }}>{error}</p>} {/* Error color in red */}

      <ul style={{ listStyle: "disc", paddingLeft: 20 }}>
        {news.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#2196F3", // Link color
              }}
            >
              {item.title}
            </a>
            <div style={{ fontSize: "12px", color: "#ddd" }}>
              {item.source_id} – {new Date(item.pubDate).toLocaleString()}
            </div>
            {item.description && (
              <p style={{ fontSize: "13px", marginTop: 4, color: "#ddd" }}>
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
