// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorite exhibitions from local storage
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  const removeFavorite = (id) => {
    // Remove a favorite exhibition from the list and update local storage
    const updated = favorites.filter((ex) => ex.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return <p>לא סימנת תערוכות כשמורות עדיין.</p>; // "You haven't marked any exhibitions as favorites yet."
  }

  return (
    <div>
      <h2>תערוכות שאהבתי</h2> {/* "Exhibitions I Like" */}
      <ul>
        {favorites.map((ex) => (
          <li key={ex.id} style={{ marginBottom: '1rem' }}>
            <img src={ex.image} alt={ex.title} width="200" /><br />
            <strong>{ex.title}</strong><br />
            <Link to={`/exhibitions/${ex.id}`}>לצפייה בפרטים</Link><br /> {/* "View Details" */}
            <button onClick={() => removeFavorite(ex.id)} style={{ marginTop: '0.5rem' }}>הסר תערוכה</button> {/* "Remove Exhibition" */}
          </li>
        ))}
      </ul>

      {/* Add the Sign Up button */}
      <div style={{ marginTop: '2rem' }}>
        <h3>צור חשבון חדש</h3> {/* "Create a new account" */}
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
