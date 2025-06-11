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
    <div style={{ margin: "0.5rem 1rem" }}>
      <nav style={{
        backgroundColor: "#0077b6",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
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
          <li><Link to="/" style={linkStyle}>בית</Link></li>
          <li><Link to="/exhibitions" style={linkStyle}>תערוכות</Link></li>
          <li><Link to="/navigate" style={linkStyle}>ניווט</Link></li>
          <li><Link to="/events" style={linkStyle}>אירועים</Link></li>
          <li><Link to="/info" style={linkStyle}>על המוזיאון</Link></li>

          {role === "visitor" && (
            <>
              <li><Link to="/favorites" style={linkStyle}>שמורים</Link></li>
              <li><Link to="/visitor/tours" style={linkStyle}>סיורים</Link></li>
              <li><Link to="/my-messages" style={linkStyle}>ההודעות שלי</Link></li>
              <li><Link to="/creatures" style={linkStyle}>היצורים</Link></li>
            </>
          )}

          {role === "guide" && (
            <li><Link to="/guide-dashboard" style={linkStyle}>לוח מדריך</Link></li>
          )}

          {role === "admin" && (
            <li><Link to="/admin/dashboard" style={linkStyle}>ניהול</Link></li>
          )}

          {!loggedInUser ? (
            <>
              <li><Link to="/register" style={linkStyle}>הרשמה</Link></li>
              <li><Link to="/login" style={linkStyle}>כניסה</Link></li>
            </>
          ) : (
            <>
              <li style={{ color: role === "admin" ? "orange" : "yellow", fontWeight: "bold" }}>
                שלום, {loggedInUser.username} {role === "admin" && "(מנהל)"}
              </li>
              <li>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                  התנתקות
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};

const logoutButtonStyle = {
  backgroundColor: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "0.3rem 0.7rem",
  borderRadius: "6px",
  cursor: "pointer"
};