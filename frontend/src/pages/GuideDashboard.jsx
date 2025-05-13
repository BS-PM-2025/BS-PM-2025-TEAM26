import React from "react";
import { Link } from "react-router-dom";

export default function GuideDashboardPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>ברוך הבא, מדריך!</h2>
      <p>כאן תוכל לנהל את הסיורים שלך ולבצע פעולות ייחודיות.</p>

      <div style={{ marginTop: "2rem" }}>
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
      </div>
    </div>
  );
}