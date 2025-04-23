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

  return (
    <div>
      <h2>רשימת תערוכות</h2>
      <input
        type="text"
        placeholder="חפש תערוכה..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem' }}
      />
      <ul>
        {results.map((ex) => (
          <li key={ex.id} style={{ marginBottom: '1rem' }}>
            <img src={ex.image} alt={ex.title} width="200" /><br />
            <strong>{ex.title}</strong><br />
            <Link to={`/exhibitions/${ex.id}`}>לצפייה בפרטים</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
