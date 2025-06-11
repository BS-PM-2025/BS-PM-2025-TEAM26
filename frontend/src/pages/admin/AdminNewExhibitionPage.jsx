import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNewExhibitionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/admin/exhibitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("התערוכה נוספה בהצלחה");
      navigate("/admin/exhibitions");
    } else {
      alert("שגיאה בהוספה");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>➕ הוספת תערוכה חדשה</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="כותרת" required /><br />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="תיאור" rows="4" required /><br />
        <input name="image" value={form.image} onChange={handleChange} placeholder="קישור לתמונה" required /><br />
        <button type="submit">צור תערוכה</button>
      </form>
    </div>
  );
}
