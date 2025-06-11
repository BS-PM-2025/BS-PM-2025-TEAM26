import React, { useState, useEffect } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/admin/messages")
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("שגיאה בטעינת הודעות", err));

    fetch("http://localhost:8000/users")
      .then(res => res.json())
      .then(data => {
        console.log("📦 משתמשים:", data);
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("פורמט לא תקין מהשרת:", data);
          setUsers([]);
        }
      })
      .catch(err => console.error("שגיאה בטעינת משתמשים", err));
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const senderId = 1; // נניח שהמנהל הוא ID 1

    try {
      const res = await fetch("http://localhost:8000/admin/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: senderId, recipient_id: recipientId, content }),
      });

      const data = await res.json();
      setStatus(data.message || "ההודעה נשלחה");
      setContent("");
      setRecipientId("");
    } catch {
      setStatus("שגיאה בשליחת ההודעה");
    }
  };

  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.username : "משתמש לא ידוע";
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>📨 הודעות</h2>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {messages.map((msg) => (
          <li key={msg.id} style={{
            backgroundColor: "#f1f1f1",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <p><strong>מאת:</strong> {msg.sender || getUserName(msg.sender_id)}</p>
            <p><strong>אל:</strong> {msg.receiver || getUserName(msg.recipient_id)}</p>

            <p style={{ marginTop: "0.5rem" }}>{msg.content}</p>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "2rem 0" }} />
      <h3>✏ שליחת הודעה חדשה</h3>

      <form onSubmit={handleSendMessage}>
        <div style={{ marginBottom: "1rem" }}>
          <label>בחר נמען:</label><br />
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">--בחר--</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>תוכן ההודעה:</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: "100%", height: "100px", padding: "0.5rem" }}
          />
        </div>

        <button type="submit" style={{
          backgroundColor: "#0077b6",
          color: "white",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          שלח
        </button>
      </form>

      {status && (
        <p style={{ marginTop: "1rem", color: "green" }}>{status}</p>
      )}
    </div>
  );
}