import React, { useEffect, useState } from "react";

export default function VisitorToursPage() {
  const [tours, setTours] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("🔍 משתמש מחובר:", user);
    setLoggedInUser(user);

    fetch("http://localhost:8000/tours")
      .then((res) => res.json())
      .then((data) => setTours(data))
      .catch((err) => {
        console.error("שגיאה בטעינת סיורים:", err);
        alert("אירעה שגיאה בטעינה.");
      });
  }, []);

  const handleRegister = async (tourId) => {
    console.log("🟢 נלחץ כפתור הרשמה לסיור", tourId);

    if (!loggedInUser || !loggedInUser.email) {
      alert("⚠️ לא נמצא משתמש מחובר. נא להתחבר.");
      return;
    }

    try {
      const url = `http://localhost:8000/tours/${tourId}/register?visitor_email=${loggedInUser.email}`;
      console.log("📡 שולח בקשה ל:", url);

      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "שגיאה בהרשמה");
      alert(data.message);
    } catch (err) {
      console.error("❌ שגיאה בהרשמה לסיור:", err);
      alert("לא ניתן להירשם לסיור.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>סיורים זמינים</h2>
      {tours.length === 0 ? (
        <p>אין סיורים להצגה</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tours.map((tour) => (
            <li key={tour.id} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <strong>{tour.name}</strong>
              <p>{tour.description}</p>
              {tour.tour_date && <p><b>תאריך הסיור:</b> {tour.tour_date}</p>}
              {tour.guide_name && <p><b>מדריך:</b> {tour.guide_name}</p>}
              <p><b>תערוכות:</b> {tour.exhibition_ids}</p>

              <button
                onClick={() => handleRegister(tour.id)}
                style={{
                  padding: "0.4rem 1rem",
                  backgroundColor: "#0077b6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                הירשם
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
