import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "2rem", background: "#e0f7fa" }}>
      <h2 style={{ textAlign: "center" }}>✅ ברוך הבא למערכת ניהול המוזיאון</h2>

      <div style={{
        marginTop: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}>
        <Link to="/admin/exhibitions" style={btnStyle}>📋 ניהול תערוכות</Link>
        <Link to="/admin/exhibitions/new" style={btnStyle}>➕ הוספת תערוכה חדשה</Link>
        <Link to="/admin/users" style={btnStyle}>👥 ניהול משתמשים</Link>
        <Link to="/admin/messages" style={btnStyle}>📬 ניהול הודעות</Link>
        <Link to="/admin/events" style={btnStyle}>🗓 ניהול אירועים</Link>

      </div>
    </div>
  );
}

const btnStyle = {
  padding: "1rem 2rem",
  backgroundColor: "#0077b6",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "1.2rem",
  fontWeight: "bold"
};