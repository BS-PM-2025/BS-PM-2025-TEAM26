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

  // ✅ כאן הפונקציה נוספה
  const sortEventsByDate = (eventsArray) => {
    return eventsArray.sort((a, b) => {
      const dateA = new Date(parseDate(a.date));
      const dateB = new Date(parseDate(b.date));
      return dateA - dateB;
    });
  };

  const parseDate = (dateStr) => {
    if (dateStr.includes("-")) {
      return dateStr;
    }
    return dateStr;
  };

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:8000/events");
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("הנתונים שהתקבלו אינם מערך:", data);
      return;
    }

    const sorted = sortEventsByDate(data);
    setEvents(sorted);
    setLastCount(sorted.length);
    filterByMonth(sorted, selectedMonth);
  };

  const checkForNewEvents = async () => {
    const res = await fetch("http://localhost:8000/events");
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("הנתונים שהתקבלו אינם מערך:", data);
      return;
    }

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

  const filterByMonth = (eventsArray, month) => {
    if (month === "all") {
      setFilteredEvents(eventsArray);
    } else {
      setFilteredEvents(eventsArray.filter(event => {
        const eventMonth = new Date(parseDate(event.date)).getMonth() + 1;
        return eventMonth === parseInt(month);
      }));
    }
  };

  return (
    <div>
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
          <option value="1">ינואר</option>
          <option value="2">פברואר</option>
          <option value="3">מרץ</option>
          <option value="4">אפריל</option>
          <option value="5">מאי</option>
          <option value="6">יוני</option>
          <option value="7">יולי</option>
          <option value="8">אוגוסט</option>
          <option value="9">ספטמבר</option>
          <option value="10">אוקטובר</option>
          <option value="11">נובמבר</option>
          <option value="12">דצמבר</option>
        </select>

        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          {filteredEvents.length} אירועים נמצאו
        </p>
      </div>

      {filteredEvents.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
          אין אירועים בחודש זה — חזרו לבדוק בהמשך!
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          padding: '1rem'
        }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                padding: '1rem',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
              <p style={{ fontWeight: 'bold', color: '#0077b6' }}>{event.date}</p>
              <p style={{ marginTop: '1rem' }}>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
