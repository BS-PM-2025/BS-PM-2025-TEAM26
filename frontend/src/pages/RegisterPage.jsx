import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      role: formData.role || "visitor"  // ברירת מחדל למבקר
    };

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData)
      });

      if (!response.ok) {
        throw new Error("הרשמה נכשלה");
      }

      const data = await response.json();
      alert(data.message);

      // ניתוב לפי סוג משתמש
      if (finalFormData.role === "guide") {
        navigate("/guide-dashboard");
      } else {
        navigate("/");
      }

      // איפוס הטופס
      setFormData({ username: "", email: "", password: "", role: "" });

    } catch (error) {
      console.error("שגיאה בהרשמה:", error);
      alert("אירעה שגיאה בהרשמה. נסה שוב מאוחר יותר.");
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "2rem auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>הרשמה</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>שם משתמש</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>אימייל</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>סיסמה</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>סוג משתמש</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">בחר סוג משתמש</option>
            <option value="visitor">מבקר</option>
            <option value="guide">מדריך</option>
            <option value="admin">מנהל</option>
          </select>
        </div>

        <button type="submit" style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#0077b6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem"
        }}>
          צור חשבון
        </button>
      </form>
    </div>
  );
}