import React from "react";
import { Link } from "react-router-dom";

export default function GuideDashboardPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>ברוך הבא, מדריך!</h2>
      <p>כאן תוכל לנהל את הסיורים שלך ולבצע פעולות ייחודיות.</p>

      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        <Link
          to="/guide/create-tour"
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#0077b6",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "1.1rem"
          }}
        >
          צור סיור מותאם אישית
        </Link>

        <Link
          to="/guide/audio-upload"
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#00b386",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "1.1rem"
          }}
        >
          הוסף הסבר קולי לתערוכה
        </Link>

        <Link
          to="/guide/tour-list"
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#ff8800",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "1.1rem"
          }}
        >
          צפייה בסיורים קיימים
        </Link>
      </div>
    </div>
  );
}