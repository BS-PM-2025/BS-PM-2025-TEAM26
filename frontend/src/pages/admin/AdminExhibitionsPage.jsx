import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/exhibitions")
      .then((res) => res.json())
      .then((data) => setExhibitions(data))
      .catch(() => setError("שגיאה בטעינת התערוכות"));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק תערוכה זו?")) return;

    try {
      const res = await fetch('http://localhost:8000/admin/exhibitions/${id}', {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);
      setExhibitions(exhibitions.filter((ex) => ex.id !== id));
    } catch {
      alert("שגיאה במחיקת התערוכה");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🖼 ניהול תערוכות</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {exhibitions.map((ex) => (
          <li key={ex.id} style={{
            border: "1px solid #ccc",
            padding: "1rem",
            margin: "1rem 0",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <h3>{ex.title}</h3>
            <p>{ex.description}</p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1rem"
            }}>
              <button
                onClick={() => handleDelete(ex.id)}
                style={{
                  background: "red",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                🗑 מחק
              </button>

              <Link
                to={'/admin/exhibitions/edit/${ex.id}'}
                style={{
                  background: "green",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  display: "inline-block"
                }}
              >
                ✏ ערוך
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}