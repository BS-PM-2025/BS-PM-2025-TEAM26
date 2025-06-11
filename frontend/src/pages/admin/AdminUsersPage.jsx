import React, { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setFiltered(data);
      })
      .catch(() => setError("שגיאה בטעינת המשתמשים"));
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const results = users.filter(u =>
      u.username.toLowerCase().includes(lowerSearch) ||
      u.email.toLowerCase().includes(lowerSearch)
    );
    setFiltered(results);
  }, [searchTerm, users]);

  const handleDelete = async (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) return;

    try {
      const res = await fetch(`http://localhost:8000/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      setFiltered(updated);
    } catch {
      alert("שגיאה במחיקה");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👥 ניהול משתמשים</h2>

      <input
        type="text"
        placeholder="חפש לפי שם או מייל"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((u) => (
          <li key={u.id} style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "10px",
            background: "#f9f9f9"
          }}>
            <p><strong>שם:</strong> {u.username}</p>
            <p><strong>אימייל:</strong> {u.email}</p>
            <p><strong>תפקיד:</strong> {u.role}</p>
            <button
              onClick={() => handleDelete(u.id)}
              style={{
                background: "red",
                color: "white",
                padding: "0.4rem 1rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer"
              }}
            >
              🗑️ מחק
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
