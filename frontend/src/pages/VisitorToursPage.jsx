import React, { useEffect, useState } from "react";

export default function VisitorToursPage() {
  const [tours, setTours] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetch("http://localhost:8000/tours")
      .then((res) => res.json())
      .then((data) => setTours(data))
      .catch((err) => {
        console.error("שגיאה בטעינת סיורים:", err);
        alert("אירעה שגיאה בטעינה.");
      });
  }, []);

  const handleRegister = async (tourId) => {
    try {
      const res = await fetch(`http://localhost:8000/tours/${tourId}/register?visitor_email=${loggedInUser.email}`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "שגיאה בהרשמה");
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("לא ניתן להירשם לסיור.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>סיורים זמינים</h2>
      {tours.length === 0 ? (
        <p>אין סיורים להצגה</p>
      ) : (
        <ul>
          {tours.map((tour) => (
            <li key={tour.id} style={{ marginBottom: "1.5rem" }}>
              <strong>{tour.name}</strong>
              <p>{tour.description}</p>
              <p><b>תערוכות:</b> {tour.exhibition_ids}</p>
              <button onClick={() => handleRegister(tour.id)}>הירשם</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
