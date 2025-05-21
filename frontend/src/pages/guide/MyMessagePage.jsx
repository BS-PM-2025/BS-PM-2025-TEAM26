import React, { useEffect, useState } from "react";

export default function MyMessagesPage() {
  const [messages, setMessages] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (!loggedInUser?.id) return;

    fetch(`http://localhost:8000/messages?user_id=${loggedInUser.id}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => {
        console.error("שגיאה בטעינת הודעות:", err);
        alert("לא ניתן לטעון הודעות כעת");
      });
  }, [loggedInUser?.id]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📩 ההודעות שלי</h2>
      {messages.length === 0 ? (
        <p>לא נמצאו הודעות</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {messages.map((msg, index) => (
            <li key={index} style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#f9f9f9"
            }}>
              <p><strong>מאת:</strong> {msg.from}</p>
              <p><strong>תוכן:</strong> {msg.content}</p>
              <p style={{ fontSize: "0.85rem", color: "gray" }}>📅 {new Date(msg.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
