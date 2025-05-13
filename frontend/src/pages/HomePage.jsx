import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      {/* באנר עליון */}
      <div style={{
        backgroundImage: 'url("/images/about6.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
      }}>
        <h1>ברוכים הבאים למוזיאון ישראל</h1>
        <Link to="/exhibitions" style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0077b6',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          גלו את התערוכות
        </Link>
      </div>

      {/* אזור תערוכות בולטות */}
      <div style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>תערוכות מומלצות</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              image: "/images/fe-Alma-Mater.jpg",
              title: "יובל אביטל: אלמה מאטר",
              description: "מיצב סאונד חזותי המשלב קולות טבע וזהות."
            },
            {
              image: "/images/fe-dreams.jpg",
              title: "חלומות צלולים",
              description: "חקר התודעה והחלום באמנות עכשווית וסוריאליסטית."
            },
            {
              image: "/images/fe-october7-event.jpg",
              title: "גסטון צבי איצקוביץ: שדה",
              description: "עדות שקטה לזיכרון טראומטי ולנוף הישראלי."
            }
          ].map((exhibit, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <img
                src={exhibit.image}
                alt={exhibit.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              />
              <div style={{ padding: '1rem' }}>
                <h3>{exhibit.title}</h3>
                <p>{exhibit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* אזור אירוע קרוב */}
      <div style={{
        backgroundColor: '#caf0f8',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2>אירוע קרוב במוזיאון</h2>
        <p>סיור מודרך מיוחד בתערוכת "חלומות צלולים" ב-15 בינואר 2025</p>
        <Link to="/events" style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0077b6',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: 'bold'
        }}>
          לצפייה בכל האירועים
        </Link>
      </div>

      {/* ניווט במוזיאון */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>תכנן את הביקור שלך</h2>
        <Link to="/navigate" style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0096c7',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          ניווט במוזיאון
        </Link>
      </div>

      {/* אודות */}
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f1f1f1' }}>
        <h2>על המוזיאון</h2>
        <p>מוזיאון ישראל בירושלים הוא מהחשובים במוסדות התרבות והאמנות בארץ ובעולם.</p>
        <Link to="/info" style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#023e8a',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: 'bold'
        }}>
          קרא עוד
        </Link>
      </div>
    </div>
  );
}

