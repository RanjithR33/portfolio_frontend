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

  const API_KEY = "pub_c6693b24a8b548abb1d3eecae01eaec2"; // Replace with your key

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
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
      }}
    >
      <h3 style={{ marginBottom: "12px" }}>Stock News</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "disc", paddingLeft: 20 }}>
        {news.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: "bold", textDecoration: "none" }}
            >
              {item.title}
            </a>
            <div style={{ fontSize: "12px", color: "#555" }}>
              {item.source_id} – {new Date(item.pubDate).toLocaleString()}
            </div>
            {item.description && (
              <p style={{ fontSize: "13px", marginTop: 4 }}>
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
