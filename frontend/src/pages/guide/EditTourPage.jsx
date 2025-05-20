import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditTourPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exhibitions, setExhibitions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/exhibitions")
      .then(res => res.json())
      .then(setExhibitions);

    fetch("http://localhost:8000/tours")
      .then(res => res.json())
      .then(data => {
        const t = data.find(t => t.id === parseInt(id));
        if (!t) return alert("סיור לא נמצא");
        setTour(t);
        setName(t.name);
        setDescription(t.description || "");
        setSelected(t.exhibition_ids.split(",").map(Number));
      });
  }, [id]);

  const toggleExhibition = (exId) => {
    if (selected.includes(exId))
      setSelected(selected.filter(id => id !== exId));
    else
      setSelected([...selected, exId]);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8000/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, exhibitions: selected })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      alert("הסיור עודכן בהצלחה");
      navigate("/guide/manage-tours");
    } catch (err) {
      console.error(err);
      alert("שגיאה בעדכון הסיור");
    }
  };

  if (!tour) return <p style={{ padding: "2rem" }}>טוען...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>עריכת סיור</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="שם הסיור" style={inputStyle} />
      <br />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="תיאור" style={{ ...inputStyle, height: "100px" }} />
      <br />
      <h4>בחר תערוכות לסיור:</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {exhibitions.map(ex => (
          <li key={ex.id}>
            <label>
              <input type="checkbox" checked={selected.includes(ex.id)} onChange={() => toggleExhibition(ex.id)} />
              {" "}{ex.title}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit} style={btnStyle}>💾 שמור שינויים</button>
    </div>
  );
}

const inputStyle = {
  padding: "0.5rem",
  margin: "0.5rem 0",
  width: "100%",
  maxWidth: "500px"
};

const btnStyle = {
  padding: "0.5rem 1.5rem",
  backgroundColor: "#0077b6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
