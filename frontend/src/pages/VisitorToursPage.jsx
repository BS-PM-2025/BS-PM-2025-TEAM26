import React, { useEffect, useState } from "react";

export default function VisitorToursPage() {
  const [tours, setTours] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [registeredTours, setRegisteredTours] = useState([]); // נרשמים בפועל

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);

    fetch("http://localhost:8000/tours")
      .then((res) => res.json())
      .then((data) => setTours(data))
      .catch((err) => {
        console.error("שגיאה בטעינת סיורים:", err);
        alert("אירעה שגיאה בטעינה.");
      });

    if (user) {
      fetch(`http://localhost:8000/tours`)
        .then(res => res.json())
        .then(allTours => {
          const regPromises = allTours.map(tour =>
            fetch(`http://localhost:8000/tours/${tour.id}/participants`)
              .then(res => res.json())
              .then(users => ({ tourId: tour.id, isRegistered: users.some(u => u.email === user.email) }))
          );

          Promise.all(regPromises).then(results => {
            const ids = results.filter(r => r.isRegistered).map(r => r.tourId);
            setRegisteredTours(ids);
          });
        });
    }
  }, []);

  const handleRegister = async (tourId) => {
    if (!loggedInUser || !loggedInUser.email) {
      alert("⚠️ לא נמצא משתמש מחובר. נא להתחבר.");
      return;
    }

    try {
      const url = `http://localhost:8000/tours/${tourId}/register?visitor_email=${loggedInUser.email}`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "שגיאה בהרשמה");
      alert(data.message);
      setRegisteredTours([...registeredTours, tourId]);
    } catch (err) {
      console.error("❌ שגיאה בהרשמה לסיור:", err);
      alert("לא ניתן להירשם לסיור.");
    }
  };

  const handleFeedbackSubmit = async (tourId) => {
    const content = feedbacks[tourId];
    if (!content) return alert("נא להזין תוכן לפידבק.");

    try {
      const res = await fetch("http://localhost:8000/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: tourId,
          user_id: loggedInUser.id,
          content: content
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "שגיאה בשליחת הפידבק");
      alert(data.message);
      setFeedbacks((prev) => ({ ...prev, [tourId]: "" }));
    } catch (err) {
      console.error("❌ שגיאה בשליחת פידבק:", err);
      alert("שגיאה בשליחת הפידבק.");
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
            <li key={tour.id} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <strong>{tour.name}</strong>
              <p>{tour.description}</p>
              {tour.tour_date && <p><b>תאריך הסיור:</b> {tour.tour_date}</p>}
              {tour.guide_name && <p><b>מדריך:</b> {tour.guide_name}</p>}
              <p><b>תערוכות:</b> {tour.exhibition_ids}</p>

              {registeredTours.includes(tour.id) ? (
  <button
    disabled
    style={{
      padding: "0.4rem 1rem",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "default"
    }}
  >
    ✔ נרשמת
  </button>
) : (
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
)}


              {registeredTours.includes(tour.id) && (
                <div style={{ marginTop: "1rem" }}>
                  <h4>📝 פידבק למדריך</h4>
                  <textarea
                    rows="3"
                    value={feedbacks[tour.id] || ""}
                    onChange={(e) =>
                      setFeedbacks({ ...feedbacks, [tour.id]: e.target.value })
                    }
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
                    placeholder="כתוב כאן את דעתך על הסיור..."
                  />
                  <button
                    onClick={() => handleFeedbackSubmit(tour.id)}
                    style={{
                      marginTop: "0.5rem",
                      backgroundColor: "#00b386",
                      color: "white",
                      border: "none",
                      padding: "0.4rem 1rem",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    שלח פידבק
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
