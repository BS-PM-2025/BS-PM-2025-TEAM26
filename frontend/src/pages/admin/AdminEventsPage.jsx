import React, { useState, useEffect } from "react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", image: "" });
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/admin/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("שגיאה בטעינת אירועים", err));
  }, []);

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? 'http://localhost:8000/admin/events/${editId}'
      : "http://localhost:8000/admin/events";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    const data = await res.json();
    setStatus(data.message);
    setNewEvent({ title: "", date: "", description: "", image: "" });
    setEditId(null);

    const updated = await fetch("http://localhost:8000/admin/events").then(res => res.json());
    setEvents(updated);
  };

  const handleEdit = (event) => {
    setNewEvent({ ...event });
    setEditId(event.id);
  };

  const handleDelete = async (id) => {
    await fetch('http://localhost:8000/admin/events/${id}, { method: "DELETE" }');
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h2>🗓 ניהול אירועים</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="title"
          placeholder="כותרת"
          value={newEvent.title}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <input
          name="date"
          type="date"
          value={newEvent.date}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <input
          name="image"
          placeholder="קישור לתמונה"
          value={newEvent.image}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          name="description"
          placeholder="תיאור"
          value={newEvent.description}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.75rem", backgroundColor: "#0077b6", color: "white", border: "none" }}>
          {editId ? "עדכן אירוע" : "הוסף אירוע"}
        </button>
      </form>

      {status && <p style={{ color: "green" }}>{status}</p>}

      <ul style={{ padding: 0, listStyle: "none" }}>
        {events.map((event) => (
          <li key={event.id} style={{ background: "#f1f1f1", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
            <h4>{event.title} ({event.date})</h4>
            <p>{event.description}</p>
            {event.image && <img src={event.image} alt={event.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />}
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={() => handleEdit(event)} style={{ marginRight: "0.5rem" }}>ערוך</button>
              <button onClick={() => handleDelete(event.id)} style={{ backgroundColor: "red", color: "white" }}>מחק</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}