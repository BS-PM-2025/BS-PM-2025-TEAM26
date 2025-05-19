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

  const formatDateRange = (start, end) => {
    if (!start) return "";
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    if (!end) {
      return startStr;
    }
    const endDate = new Date(end);
    const endStr = endDate.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    return `${startStr} - ${endStr}`;
  };

  if (!exhibition) return <p>טוען מידע...</p>;
  if (exhibition.error) return <p>התערוכה לא נמצאה.</p>;

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>{exhibition.title}</h2>
      <img src={exhibition.image} alt={exhibition.title} width="300" />
      <p>{exhibition.description}</p>
      {(exhibition.date_start || exhibition.date_end) && (
        <p><strong>תאריכים:</strong> {formatDateRange(exhibition.date_start, exhibition.date_end)}</p>
      )}
      {exhibition.location && <p><strong>מיקום:</strong> {exhibition.location}</p>}
      {exhibition.curator && <p><strong>אוצרת:</strong> {exhibition.curator}</p>}
      {exhibition.assistant_curator && <p><strong>עוזר/ת אוצר:</strong> {exhibition.assistant_curator}</p>}
      {exhibition.designer && <p><strong>מעצבת:</strong> {exhibition.designer}</p>}

      <button onClick={handleSave} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0077b6', color: 'white', border: 'none', borderRadius: '6px' }}>
        שמור תערוכה
      </button>
    </div>
  );
}
