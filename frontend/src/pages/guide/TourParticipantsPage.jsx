import React, { useEffect, useState } from "react";

export default function TourParticipantsPage() {
  const [tours, setTours] = useState([]);
  const [participantsMap, setParticipantsMap] = useState({});
  const [openTourId, setOpenTourId] = useState(null);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (!loggedInUser?.id) return;

    const fetchData = async () => {
      try {
        // 1. שליפת כל הסיורים
        const res = await fetch("http://localhost:8000/tours");
        const allTours = await res.json();
        const myTours = allTours.filter((t) => t.guide_id === loggedInUser.id);
        setTours(myTours);

        // 2. שליפת כל הנרשמים במקביל
        const results = await Promise.all(
          myTours.map(async (tour) => {
            const res = await fetch('http://localhost:8000/tours/${tour.id}/participants');
            const users = await res.json();
            return { tourId: tour.id, users };
          })
        );

        // 3. מיפוי נרשמים לפי tour.id
        const map = {};
        results.forEach(({ tourId, users }) => {
          map[tourId] = users;
        });
        setParticipantsMap(map);

      } catch (err) {
        console.error("❌ שגיאה כללית:", err);
      }
    };

    fetchData();
  }, [loggedInUser?.id]);

  const toggleTour = (tourId) => {
    setOpenTourId((prev) => (prev === tourId ? null : tourId));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👥 צפייה בנרשמים לסיורים שלך</h2>
      {tours.length === 0 ? (
        <p>לא קיימים סיורים שיצרת.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tours.map((tour) => (
            <li key={tour.id} style={{ marginBottom: "1.5rem", border: "1px solid #ccc", borderRadius: "8px" }}>
              <div
                onClick={() => toggleTour(tour.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#0077b6",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "8px 8px 0 0"
                }}
              >
                <strong>{tour.name}</strong> – {tour.tour_date || "ללא תאריך"}
              </div>

              {openTourId === tour.id && (
                <div style={{ padding: "1rem", backgroundColor: "#f9f9f9", borderTop: "1px solid #ccc" }}>
                  {tour.description && <p><b>תיאור:</b> {tour.description}</p>}
                  <p><b>תערוכות:</b> {tour.exhibition_ids || "—"}</p>
                  <h4>נרשמים:</h4>
                  {participantsMap[tour.id]?.length > 0 ? (
                    <ul>
                      {participantsMap[tour.id].map((user) => (
                        <li key={user.id}>
                          <b>{user.username}</b> ({user.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>📭 עדיין אין נרשמים לסיור זה.</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}