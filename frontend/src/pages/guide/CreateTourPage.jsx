import React, { useEffect, useState } from "react";

export default function CreateTourPage() {
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);
  const [activeExhibition, setActiveExhibition] = useState(null);
  const [tourDate, setTourDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/exhibitions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExhibitions(data);
        } else {
          console.error("קיבלתי פורמט לא צפוי", data);
        }
      })
      .catch((err) => {
        console.error("שגיאה בטעינת תערוכות:", err);
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

  const handleSaveTour = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return alert("יש להתחבר לפני שמירת הסיור");

    const name = prompt("הזן שם לסיור:");
    const description = prompt("תיאור הסיור (לא חובה):");
    const tour_date = prompt("הזן תאריך לסיור (למשל 2025-06-10):");

    if (!name || !tour_date) {
      alert("שם ותאריך סיור נדרשים");
      return;
    }

    const tourData = {
      guide_id: loggedInUser.id,
      name,
      description,
      tour_date,
      exhibitions: selectedExhibitions.map((ex) => ex.id)
    };

    try {
      const res = await fetch("http://localhost:8000/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tourData)
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("שגיאה בשמירת הסיור");
      console.error(err);
    }
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
              </span>{" "}- {ex.location}
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

      {selectedExhibitions.length > 0 && (
        <button
          onClick={handleSaveTour}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 2rem",
            backgroundColor: "#0077b6",
            color: "white",
            fontSize: "1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          שמור סיור
        </button>
      )}

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