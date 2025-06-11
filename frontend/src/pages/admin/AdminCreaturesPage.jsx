import React, { useState, useEffect } from "react";

export default function AdminCreaturesPage() {
  const [creatures, setCreatures] = useState([]);
  const [newCreature, setNewCreature] = useState({
    name: "",
    description: "",
    image: "",
    exhibition_id: ""
  });

  useEffect(() => {
    fetch("http://localhost:8000/creatures")
      .then(res => res.json())
      .then(setCreatures)
      .catch(err => console.error("שגיאה בטעינת יצורים", err));
  }, []);

  const handleChange = (e) => {
    setNewCreature({ ...newCreature, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    fetch("http://localhost:8000/admin/creatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCreature)
    })
      .then(res => res.json())
      .then(() => window.location.reload())
      .catch(err => console.error("שגיאה ביצירת יצור", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/admin/creatures/${id}`, { method: "DELETE" })
      .then(() => setCreatures(creatures.filter(c => c.id !== id)))
      .catch(err => console.error("שגיאה במחיקה", err));
  };

  const handleEdit = (id, updated) => {
    fetch(`http://localhost:8000/admin/creatures/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
      .then(() => setCreatures(creatures.map(c => (c.id === id ? updated : c))))
      .catch(err => console.error("שגיאה בעדכון", err));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🦎 ניהול יצורים</h2>

      <h3>➕ יצור חדש</h3>
      <input name="name" placeholder="שם" onChange={handleChange} /><br />
      <input name="description" placeholder="תיאור" onChange={handleChange} /><br />
      <input name="image" placeholder="קישור לתמונה" onChange={handleChange} /><br />
      <input name="exhibition_id" placeholder="ID של תערוכה" onChange={handleChange} /><br />
      <button onClick={handleCreate}>הוסף</button>

      <hr />
      <h3>📋 רשימת יצורים</h3>
      {creatures.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <input
            defaultValue={c.name}
            onBlur={(e) => handleEdit(c.id, { ...c, name: e.target.value })}
          />
          <br />
          <textarea
            defaultValue={c.description}
            onBlur={(e) => handleEdit(c.id, { ...c, description: e.target.value })}
          />
          <br />
          <input
            defaultValue={c.image}
            onBlur={(e) => handleEdit(c.id, { ...c, image: e.target.value })}
          />
          <br />
          <input
            defaultValue={c.exhibition_id}
            onBlur={(e) => handleEdit(c.id, { ...c, exhibition_id: parseInt(e.target.value) })}
          />
          <br />
          <button onClick={() => handleDelete(c.id)}>🗑️ מחק</button>
        </div>
      ))}
    </div>
  );
}
