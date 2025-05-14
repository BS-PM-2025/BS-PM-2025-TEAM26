import React, { useEffect, useState } from "react";

export default function CreateTourPage() {
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/exhibitions")
      .then((res) => res.json())
      .then((data) => setExhibitions(data))
      .catch((err) => {
        console.error("שגיאה בטעינת תערוכות:", err);
        alert("לא ניתן לטעון תערוכות כרגע.");
      });
  }, []);

  const handleAddToTour = (exhibition) => {
    if (!selectedExhibitions.find((ex) => ex.id === exhibition.id)) {
      setSelectedExhibitions([...selectedExhibitions, exhibition]);
    }
  };

  const handleRemoveFromTour = (id) => {
    setSelectedExhibitions(selectedExhibitions.filter((ex) => ex.id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>צור סיור מותאם אישית</h2>
      <p>בחר תערוכות לסיור שלך:</p>

      {exhibitions.length === 0 ? (
        <p>טוען תערוכות...</p>
      ) : (
        <ul>
          {exhibitions.map((ex) => (
            <li key={ex.id} style={{ marginBottom: "1rem" }}>
              <strong>{ex.title}</strong> - {ex.location}
              <button
                onClick={() => handleAddToTour(ex)}
                style={{
                  marginRight: "1rem",
                  marginLeft: "1rem",
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#0077b6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                הוסף לסיור
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h3>התערוכות שנבחרו לסיור:</h3>
      {selectedExhibitions.length === 0 ? (
        <p>לא נבחרו תערוכות.</p>
      ) : (
        <ul>
          {selectedExhibitions.map((ex) => (
            <li key={ex.id} style={{ marginBottom: "0.5rem" }}>
              {ex.title}{" "}
              <button
                onClick={() => handleRemoveFromTour(ex.id)}
                style={{
                  marginRight: "0.5rem",
                  padding: "0.2rem 0.5rem",
                  backgroundColor: "#d62828",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                הסר
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
