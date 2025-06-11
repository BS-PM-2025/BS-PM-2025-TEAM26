import React, { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("פורמט נתונים לא תקין", data);
        }
      })
      .catch(err => console.error("שגיאה בטעינת משתמשים:", err));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      setStatus(data.message);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error("שגיאה בעדכון תפקיד:", err);
      setStatus("שגיאה בעדכון תפקיד");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המשתמש?")) return;

    try {
      const res = await fetch(`http://localhost:8000/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      setStatus(data.message);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error("שגיאה במחיקת משתמש:", err);
      setStatus("שגיאה במחיקה");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <h2>🔧 ניהול משתמשים</h2>

      {users.length === 0 ? (
        <p>לא נמצאו משתמשים</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#0d6efd", color: "white" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>שם משתמש</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>אימייל</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>תפקיד</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>שינוי תפקיד</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>🗑️ מחיקה</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ backgroundColor: "#f8f9fa" }}>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.username}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.email}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.role}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="visitor">Visitor</option>
                    <option value="guide">Guide</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd", textAlign: "center" }}>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {status && <p style={{ color: "green", marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}
