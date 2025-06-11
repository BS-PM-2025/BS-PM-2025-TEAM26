import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("response.ok:", response.ok);
      console.log("data:", data);
  
      if (response.ok && data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setErrorMsg(data.detail || "שגיאה בהתחברות");
      }
    } catch (error) {
      console.error("שגיאה בבקשת התחברות:", error);
      setErrorMsg("שגיאה בהתחברות לשרת");
    }
  };
  

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>התחברות מנהל</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#2c3e50",
            color: "white",
            border: "none",
          }}
        >
          התחבר
        </button>
        {errorMsg && (
          <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}
