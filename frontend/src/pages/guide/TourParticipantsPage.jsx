import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TourParticipantsPage() {
  const { tourId } = useParams();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/tours/${tourId}/participants`)
      .then((res) => res.json())
      .then((data) => setParticipants(data))
      .catch((err) => {
        console.error("שגיאה בטעינת נרשמים:", err);
        alert("לא ניתן לטעון את רשימת הנרשמים.");
      });
  }, [tourId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>רשימת נרשמים לסיור מספר {tourId}</h2>
      {participants.length === 0 ? (
        <p>אין נרשמים עדיין.</p>
      ) : (
        <ul>
          {participants.map((user) => (
            <li key={user.id}>
              {user.username} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
