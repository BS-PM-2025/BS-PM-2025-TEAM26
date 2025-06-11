import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminEditExhibitionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/exhibitions/${id}')
      .then((res) => res.json())
      .then(setExhibition)
      .catch(() => setError("שגיאה בטעינת פרטי התערוכה"));
  }, [id]);

  const handleChange = (e) => {
    setExhibition({ ...exhibition, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/admin/exhibitions/${id}', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exhibition),
    });

    if (response.ok) {
      alert("התערוכה עודכנה בהצלחה");
      navigate("/admin/exhibitions");
    } else {
      alert("שגיאה בעדכון");
    }
  };

  if (error) return <p>{error}</p>;
  if (!exhibition) return <p>טוען...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>✏ עריכת תערוכה</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={exhibition.title} onChange={handleChange} placeholder="כותרת" required /><br />
        <textarea name="description" value={exhibition.description} onChange={handleChange} placeholder="תיאור" rows="4" required /><br />
        <input name="image" value={exhibition.image} onChange={handleChange} placeholder="קישור לתמונה" required /><br />
        <button type="submit">שמור שינויים</button>
      </form>
    </div>
  );
}   