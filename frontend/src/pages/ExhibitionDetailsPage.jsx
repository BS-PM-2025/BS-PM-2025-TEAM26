import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ExhibitionDetailsPage() {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);

  useEffect(() => {
    const fetchExhibition = async () => {
      const res = await fetch(`http://localhost:8000/exhibitions/${id}`);
      const data = await res.json();
      setExhibition(data);
    };
    fetchExhibition();
  }, [id]);

  const handleSave = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.find((ex) => ex.id === exhibition.id)) {
      favorites.push(exhibition);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("התערוכה נשמרה!");
    } else {
      alert("התערוכה כבר שמורה.");
    }
  };

  if (!exhibition) return <p>טוען מידע...</p>;
  if (exhibition.error) return <p>התערוכה לא נמצאה.</p>;

  return (
    <div>
      <h2>{exhibition.title}</h2>
      <img src={exhibition.image} alt={exhibition.title} width="300" />
      <p>{exhibition.description}</p>
      <button onClick={handleSave} style={{ marginTop: '1rem' }}>שמור תערוכה</button>
    </div>
  );
}
