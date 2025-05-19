import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((ex) => ex.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return <p>לא סימנת תערוכות כשמורות עדיין.</p>;
  }

  return (
    <div>
      <h2>תערוכות שאהבתי</h2>
      <ul>
        {favorites.map((ex) => (
          <li key={ex.id} style={{ marginBottom: '1rem' }}>
            <img src={ex.image} alt={ex.title} width="200" /><br />
            <strong>{ex.title}</strong><br />
            <Link to={`/exhibitions/${ex.id}`}>לצפייה בפרטים</Link><br />
            <button onClick={() => removeFavorite(ex.id)} style={{ marginTop: '0.5rem' }}>הסר תערוכה</button>
          </li>
        ))}
      </ul>
    </div>
  );
}