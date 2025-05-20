import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('שגיאה בפרטי התחברות');
      }

      const data = await response.json();
      alert(`ברוך הבא ${data.username}!`);

      // שמירה ב-localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(data));


      // ניווט לפי תפקיד
      if (data.role === "guide") {
        navigate("/guide");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error('שגיאת התחברות:', error);
      alert('פרטי התחברות שגויים. נסה שוב.');
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
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>התחברות</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>אימייל</label>
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
          <label style={{ display: "block", marginBottom: "0.5rem" }}>סיסמה</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
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
          התחבר
        </button>
      </form>
    </div>
  );
}
