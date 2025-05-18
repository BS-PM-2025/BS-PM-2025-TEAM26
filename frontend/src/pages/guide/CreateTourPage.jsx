import React, { useEffect, useState } from "react";

export default function CreateTourPage() {
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);
  const [activeExhibition, setActiveExhibition] = useState(null); // לתצוגת פרטים

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

  const handleShowDetails = (exhibition) => {
    setActiveExhibition(exhibition);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>צור סיור מותאם אישית</h2>
      <p>בחר תערוכות לסיור שלך:</p>

      {exhibitions.length === 0 ? (
        <p>טוען תערוכות...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {exhibitions.map((ex) => (
            <li key={ex.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <span
                onClick={() => handleShowDetails(ex)}
                style={{ cursor: "pointer", color: "#0077b6", fontWeight: "bold", textDecoration: "underline" }}
              >
                {ex.title}
              </span>{" "}
              - {ex.location}
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

      {/* תצוגת פרטים נוספים */}
      {activeExhibition && (
        <div style={{ marginTop: "3rem", padding: "1.5rem", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h3>{activeExhibition.title}</h3>
          <p><strong>תיאור:</strong> {activeExhibition.description}</p>
          <p><strong>מיקום:</strong> {activeExhibition.location}</p>
          {activeExhibition.curator && <p><strong>אוצר:</strong> {activeExhibition.curator}</p>}
          {activeExhibition.date_start && (
            <p>
              <strong>תאריכים:</strong> {activeExhibition.date_start} - {activeExhibition.date_end || "—"}
            </p>
          )}
          <img
            src={activeExhibition.image}
            alt={activeExhibition.title}
            style={{ maxWidth: "100%", marginTop: "1rem", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
}
