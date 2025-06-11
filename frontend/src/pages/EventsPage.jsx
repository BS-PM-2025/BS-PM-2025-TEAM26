import React, { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [lastCount, setLastCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewEvents();
    }, 10000);
    return () => clearInterval(interval);
  }, [events]);

  const parseDate = (dateStr) => dateStr;

  const sortEventsByDate = (array) =>
    array.sort((a, b) => new Date(parseDate(a.date)) - new Date(parseDate(b.date)));

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:8000/events");
    const data = await res.json();
    const sorted = sortEventsByDate(data);
    setEvents(sorted);
    setLastCount(sorted.length);
    filterByMonth(sorted, selectedMonth);
  };

  const checkForNewEvents = async () => {
    const res = await fetch("http://localhost:8000/events");
    const data = await res.json();
    const sorted = sortEventsByDate(data);
    if (sorted.length > lastCount) {
      alert("🎉 נוסף אירוע חדש!");
      setEvents(sorted);
      setLastCount(sorted.length);
      filterByMonth(sorted, selectedMonth);
    }
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    filterByMonth(events, month);
  };

  const filterByMonth = (array, month) => {
    if (month === "all") {
      setFilteredEvents(array);
    } else {
      setFilteredEvents(array.filter(event => {
        const eventMonth = new Date(parseDate(event.date)).getMonth() + 1;
        return eventMonth === parseInt(month);
      }));
    }
  };

  return (
    <div style={{ padding: 0, margin: 0 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>אירועים קרובים במוזיאון</h2>

      {/* סינון לפי חודש */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        >
          <option value="all">כל החודשים</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('he-IL', { month: 'long' })}
            </option>
          ))}
        </select>
        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>{filteredEvents.length} אירועים נמצאו</p>
      </div>

      {filteredEvents.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
          אין אירועים בחודש זה — חזרו לבדוק בהמשך!
        </p>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0',
          margin: '0',
          direction: 'rtl',
          gap: 0
        }}>
          {filteredEvents.map((event) => (
            <div key={event.id} style={{
              flex: 1,
              minWidth: 0,
              borderLeft: '1px solid #ddd',
              padding: '1rem',
              backgroundColor: '#fff',
              textAlign: 'center'
            }}>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <h3 style={{ margin: '1rem 0 0.5rem' }}>{event.title}</h3>
              <p style={{ color: '#0077b6', fontWeight: 'bold' }}>{event.date}</p>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
