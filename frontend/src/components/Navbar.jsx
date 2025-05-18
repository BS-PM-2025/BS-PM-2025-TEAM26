import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const role = loggedInUser?.role;

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    alert("התנתקת בהצלחה");
    navigate("/login");
  };

  return (
    <nav style={{
      backgroundColor: "#0077b6",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
    }}>
      {/* לוגו */}
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        מוזיאון ישראל
      </div>

      {/* קישורים */}
      <ul style={{
        listStyle: "none",
        display: "flex",
        gap: "1.5rem",
        margin: 0,
        padding: 0,
        alignItems: "center"
      }}>
        <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>בית</Link></li>
        <li><Link to="/exhibitions" style={{ color: "white", textDecoration: "none" }}>תערוכות</Link></li>
        <li><Link to="/navigate" style={{ color: "white", textDecoration: "none" }}>ניווט</Link></li>
        <li><Link to="/events" style={{ color: "white", textDecoration: "none" }}>אירועים</Link></li>
        <li><Link to="/info" style={{ color: "white", textDecoration: "none" }}>על המוזיאון</Link></li>

        {/* למבקר */}
        {role === "visitor" && (
          <>
            <li><Link to="/favorites" style={{ color: "white", textDecoration: "none" }}>שמורים</Link></li>
            <li><Link to="/visitor/tours" style={{ color: "white", textDecoration: "none" }}>סיורים</Link></li>
          </>
        )}

        {/* למדריך */}
        {role === "guide" && (
          <li><Link to="/guide-dashboard" style={{ color: "white", textDecoration: "none" }}>לוח מדריך</Link></li>
        )}

        {!loggedInUser ? (
          <>
            <li><Link to="/register" style={{ color: "white", textDecoration: "none" }}>הרשמה</Link></li>
            <li><Link to="/login" style={{ color: "white", textDecoration: "none" }}>כניסה</Link></li>
          </>
        ) : (
          <>
            <li style={{ color: "yellow", fontWeight: "bold" }}>
              שלום, {loggedInUser.username}
            </li>
            <li>
              <button onClick={handleLogout} style={{
                backgroundColor: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "0.3rem 0.7rem",
                borderRadius: "5px",
                cursor: "pointer"
              }}>
                התנתקות
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
