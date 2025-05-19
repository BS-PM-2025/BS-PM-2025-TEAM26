import React from "react";
import { Link } from "react-router-dom";

export default function GuideDashboardPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>ברוך הבא, מדריך!</h2>
      <p>כאן תוכל לנהל את הסיורים שלך ולבצע פעולות ייחודיות.</p>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap"
        }}
      >
        <Link
          to="/guide/create-tour"
          style={buttonStyle("#0077b6")}
        >
          ➕ צור סיור מותאם אישית
        </Link>

        <Link
          to="/guide/audio-upload"
          style={buttonStyle("#00b386")}
        >
          🎧 הוסף הסבר קולי לתערוכה
        </Link>

        <Link
          to="/guide/tour-list"
          style={buttonStyle("#ff8800")}
        >
          📋 צפייה בסיורים קיימים
        </Link>
      </div>
    </div>
  );
}

const buttonStyle = (bgColor) => ({
  padding: "1rem 2rem",
  backgroundColor: bgColor,
  color: "white",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "1.1rem",
  minWidth: "220px",
  display: "inline-block"
});
