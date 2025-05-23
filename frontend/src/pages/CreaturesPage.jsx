import React, { useEffect, useState } from "react";

export default function CreaturesPage() {
  const [creatures, setCreatures] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/creatures")
      .then(res => res.json())
      .then(data => setCreatures(data))
      .catch(err => console.error("שגיאה בטעינת יצורים:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>🐾 יצורים מהתערוכות</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "2rem",
        marginTop: "2rem"
      }}>
        {creatures.map((c) => (
          <div key={c.id} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "100%",
            minHeight: "450px", // ⬅ Ensures symmetry in card height
            padding: "1rem",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <img
  src={c.image}
  alt={c.name}
  style={{
    width: "100%",
    height: "220px",
    objectFit: "contain",  // ← shows the whole image without cropping
    borderRadius: "8px",
    marginBottom: "1rem",
    backgroundColor: "#f4f4f4"  // optional: fills space around image nicely
  }}
/>

            <div style={{ flexGrow: 1 }}>
              <h3 style={{ marginBottom: "0.5rem", minHeight: "3em" }}>{c.name}</h3>
              <p style={{ minHeight: "4em", margin: 0 }}>{c.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
