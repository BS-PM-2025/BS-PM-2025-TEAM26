import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ExhibitionsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      const url = query
        ? `http://localhost:8000/search?q=${encodeURIComponent(query)}`
        : "http://localhost:8000/exhibitions";
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    };
    fetchExhibitions();
  }, [query]);

  const formatDateRange = (start, end) => {
    if (!start) return "";
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (!end) return startStr;
    const endDate = new Date(end);
    const endStr = endDate.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>רשימת תערוכות</h2>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="חפש תערוכה..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "50%",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          padding: "1rem",
        }}
      >
        {results.map((ex) => (
          <div
            key={ex.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              minHeight: "480px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <img
              src={ex.image}
              alt={ex.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />
            <div style={{ padding: "1rem", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ marginBottom: "1rem" }}>{ex.title}</h3>
                <p style={{ minHeight: "50px" }}>{ex.description}</p>
                <p>
                  <strong>תאריכים:</strong>{" "}
                  {formatDateRange(ex.date_start, ex.date_end)}
                </p>
              </div>

              <Link
                to={`/exhibitions/${ex.id}`}
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#0077b6",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
              >
                לצפייה בפרטים
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
