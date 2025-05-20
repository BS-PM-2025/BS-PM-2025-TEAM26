import React, { useEffect, useState } from "react";

export default function ManageToursPage() {
  const [tours, setTours] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetch("http://localhost:8000/tours")
      .then((res) => res.json())
      .then((data) => {
        const myTours = data.filter((t) => t.guide_id === loggedInUser?.id);
        setTours(myTours);
      });
  }, []);

  const handleDelete = async (tourId) => {
    if (!window.confirm("האם למחוק את הסיור?")) return;
    try {
      const res = await fetch(`http://localhost:8000/tours/${tourId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "שגיאה");
      alert(data.message);
      setTours((prev) => prev.filter((t) => t.id !== tourId));
    } catch (err) {
      console.error(err);
      alert("מחיקה נכשלה");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>ניהול סיורים</h2>
      {tours.length === 0 ? (
        <p>לא נמצאו סיורים.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tours.map((tour) => (
            <li key={tour.id} style={{
              marginBottom: "1.5rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem"
            }}>
              <strong>{tour.name}</strong>
              <p>{tour.description}</p>
              <p><b>תערוכות:</b> {tour.exhibition_ids}</p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => handleDelete(tour.id)} style={btn("#d62828")}>🗑 מחק</button>
                <button onClick={() => alert("עמוד עריכה בקרוב")} style={btn("#ffc107")}>✏ ערוך</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const btn = (bg) => ({
  padding: "0.4rem 0.8rem",
  backgroundColor: bg,
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
});
