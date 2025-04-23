
import React, { useEffect, useState } from "react";

export default function MuseumInfoPage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const res = await fetch("http://localhost:8000/info");
      const data = await res.json();
      setInfo(data);
    };
    fetchInfo();
  }, []);

  if (!info) return <p>טוען מידע על המוזיאון...</p>;

  return (
    <div>
      <h2>על המוזיאון</h2>
      <p><strong>שעות פתיחה:</strong> {info.opening_hours}</p>
      <p><strong>מידע:</strong> {info.description}</p>
      <p><strong>שירותים:</strong></p>
      <ul>
        {info.services.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
