import React, { useEffect, useState } from "react";

export default function VisitorToursPage() {
  const [tours, setTours] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetch("http://localhost:8000/tours")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTours(data);
        } else {
          console.error("פורמט לא תקין מהשרת:", data);
          setTours([]);  // כדי למנוע תקלה
        }
      })
      .catch((err) => {
        console.error("שגיאה בטעינת סיורים:", err);
        alert("לא ניתן לטעון סיורים כרגע.");
      });
  }, []);
  
  const handleRegister = async (tourId) => {
    try {
      const res = await fetch(`http://localhost:8000/tours/${tourId}/register?visitor_email=${loggedInUser.email}`, {
        method: "POST"
      });

      if (!res.ok) throw new Error("שגיאה בהרשמה");
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("שגיאה בהרשמה לסיור.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>סיורים זמינים</h2>

      {tours.length === 0 ? (
        <p>אין סיורים להצגה כרגע.</p>
      ) : (
        <ul>
          {tours.map((tour, index) => (
            <li key={index} style={{ marginBottom: "1.5rem" }}>
              <strong>{tour.name}</strong>
              <p>{tour.description}</p>
              <button onClick={() => handleRegister(tour.id)} style={{
                backgroundColor: "#0077b6",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                הירשם לסיור
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
