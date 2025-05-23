from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy import Text, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy import DateTime  # אם לא הוספת
from datetime import datetime
from sqlalchemy import Float

Base = declarative_base()

# יצירת אפליקציה
app = FastAPI()

# הגדרת CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# חיבור למסד PostgreSQL
DATABASE_URL = "postgresql://postgres:yosef@localhost/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# טבלאות במסד נתונים
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="visitor")

class Tour(Base):
    __tablename__ = "tours"
    id = Column(Integer, primary_key=True)
    guide_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    exhibition_ids = Column(String)
    tour_date = Column(String)  # ✅ תאריך סיור

class TourRegistration(Base):
    __tablename__ = "tour_registrations"
    id = Column(Integer, primary_key=True)
    tour_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    tour_id = Column(Integer, ForeignKey("tours.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)  

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True)
    tour_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=True) 
    rating = Column(Float, nullable=True)
 


# יצירת טבלאות במסד אם לא קיימות
Base.metadata.create_all(bind=engine)

# תלויות למסד

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# מודלים ל-API
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "visitor"

class UserLogin(BaseModel):
    email: str
    password: str

class TourCreate(BaseModel):
    guide_id: int
    name: str
    description: Optional[str]
    exhibitions: List[int]
    tour_date: str  # ✅ תאריך סיור

class TourUpdate(BaseModel):
    name: str
    description: Optional[str]
    exhibitions: List[int]
    tour_date: str



class TourSignup(BaseModel):
    tour_id: int
    user_id: int

class Exhibition(BaseModel):
    id: int
    title: str
    description: str
    image: str
    date_start: Optional[str] = None
    date_end: Optional[str] = None
    curator: Optional[str] = None
    assistant_curator: Optional[str] = None
    designer: Optional[str] = None
    location: Optional[str] = None

class MuseumInfo(BaseModel):
    opening_hours: str
    description: str
    services: List[str]

class MessageRequest(BaseModel):
    content: str
    sender_id: int

class FeedbackRequest(BaseModel):
    tour_id: int
    user_id: int
    content: str

class FeedbackCreate(BaseModel):
    tour_id: int
    user_id: int
    content: Optional[str] = None  # ← הפך לאופציונלי
    rating: Optional[float] = None
    
    
    
class Creature(BaseModel):
    id: int
    name: str
    description: str
    image: Optional[str] = None
    exhibition_id: Optional[int] = None

creatures = [
    {
        "id": 1,
        "name": "חתול מצרי",
        "description": "חתול קדוש במצרים העתיקה, סימל הגנה ופריון.",
        "image": "/images/egyptcat.jpg",
        "exhibition_id": 5
    },
    {
        "id": 2,
        "name": "תן אנוביס",
        "description": "אנוביס – אל מצרי קדום בדמות תן, שהיה אחראי על חניטה ועולם המתים.",
        "image": "/images/tenanobes.jpg",
        "exhibition_id": 5
    },
    {
        "id": 3,
        "name": "פרעה והתנין",
        "description": "תנין הנילוס היה סמל לכוח ושליטה. שימש דימוי מקודש במצרים העתיקה.",
        "image": "/images/far3a.jpg",
        "exhibition_id": 5
    },
    {
        "id": 4,
        "name": "עוף החול",
        "description": "עוף מיתולוגי שמת בגלי להבות ונולד מחדש מאפרו – סמל לחיים נצחיים.",
        "image": "/images/aof.jpg",
        "exhibition_id": 5
    }
]




# דאטה זמני
exhibitions = [
  {
    "id": 1,
    "title": "יובל אביטל: ״אלמה מאטר״",
    "description": "מיצב סאונד חזותי המשלב קולות נשים, שירי עם וצלילי טבע, בהשראת זיכרון ושורשים תרבותיים.",
    "date_start": "2024-12-17",
    "date_end": "2025-06-14",
    "curator": "טליה עמאר",
    "assistant_curator": "איתמר ברנשטיין",
    "designer": "יסמין טמס",
    "location": "הביתן לאמנות ישראלית ע״ש אילה זקס אברמוב",
    "image": "/images/fe-Alma-Mater.jpg"
  },
  {
    "id": 2,
    "title": "חלומות צלולים",
    "description": "תערוכה רב־תחומית החוגגת מאה שנים לסוריאליזם ושישים שנה למוזיאון ישראל.",
    "date_start": "2024-12-17",
    "date_end": "2025-10-18",
    "curator": "עדינה קמיאן",
    "assistant_curator": "שרה בן-שושן",
    "designer": "שירלי יהלומי",
    "location": "הבניין לאמנות מודרנית ולעכשווית ע\"ש נתן קמינגס",
    "image": "/images/fe-dreams.jpg"
  },
  {
    "id": 3,
    "title": "גסטון צבי איצקוביץ: שדה",
    "description": "בעקבות אירועי 7 באוקטובר, מציב גסטון צבי איצקוביץ את מצלמתו בשדה בו התרחשו הזוועות.",
    "date_start": "2024-09-29",
    "date_end": "2025-06-07",
    "curator": "תמרה אברמוביץ', גלעד רייך",
    "designer": "רעות עירון",
    "location": "ביתן פלבסקי לעיצוב",
    "image": "/images/fe-october7-event.jpg"
  },
  {
    "id": 4,
    "title": "בסימן טוב",
    "description": "תערוכה החוגגת 60 שנה למוזיאון ישראל באמצעות תצוגה עשירה של חפצי אמנות יהודית.",
    "date_start": "2025-04-10",
    "curator": "רחל צרפתי",
    "assistant_curator": "שלי מיידלר פרידמן",
    "designer": "k1p3 Architects: קארינה טולמן, פיליפ טומאנק ורונאל פינס",
    "location": "אולם בלה והרי וקסנר",
    "image": "/images/fe-vimple.jpg"
  },
  {
    "id": 5,
    "title": "ממלכת החיות של פרעה",
    "description": "הצצה לעולם בעלי־החיים במצרים העתיקה דרך תבליטים, פסלים וחפצי אמנות.",
    "date_start": "2025-04-07",
    "curator": "ניר אור לב",
    "assistant_curator": "יעל דובדבני",
    "content_accessibility": "ברית לביא",
    "designer": "איל רוזן",
    "location": "אולם דוידסון לתערוכות מתחלפות",
    "image": "/images/fe-cat.jpg"
  },
  {
    "id": 6,
    "title": "המובטחת",
    "description": "מבחר כרזות ישראליות המציגות את ההתפתחות בין אידיאלים לחלום הישראלי.",
    "date_start": "2025-03-10",
    "date_end": "2025-10-18",
    "curator": "רמי טריף",
    "assistant_curator": "נטלי פסלב שטרן",
    "designer": "מיכל אלדור, יסמין טמס",
    "location": "הביתן לעיצוב",
    "image": "/images/fe-as-promised.jpg"
  },
  {
    "id": 7,
    "title": "השראה ממעל",
    "description": "אמנות השראה וכוחות עליונים, מציורי נביאים ומלאכים ועד יצירות עכשוויות.",
    "date_start": "2025-02-06",
    "date_end": "2025-12-31",
    "curator": "שלומית שטיינברג",
    "location": "הגלריה ע\"ש דלה ופרד וורמס",
    "image": "/images/fe-divine.jpg"
  },
  {
    "id": 8,
    "title": "דרך ההדפס",
    "description": "קשר היסטורי בין בית טיכו לסדנת ההדפס בירושלים.",
    "date_start": "2024-11-22",
    "curator": "תמנע זליגמן, רונית שורק",
    "assistant_curator": "ריסה פוקס",
    "collaboration": "אריק קילמניק ומירב המבורגר",
    "location": "בית טיכו - רחוב הרב אגן 10, ירושלים",
    "image": "/images/fe-print.jpg"
  },
  {
    "id": 9,
    "title": "מועד לזיכרון",
    "description": "תערוכה לציון אירועי 7 באוקטובר ותקווה לשחרור החטופים.",
    "date_start": "2024-09-01",
    "curator": "שרון וייזר-פרגוסון, מיקי יואלסון, ג'ויה פרוג'ה",
    "location": "האגף לאמנות ותרבות יהודית",
    "image": "/images/fe-moed.jpg"
  }
]
museum_info = MuseumInfo(
    opening_hours="""א' | סגור
ב' | 10:00–16:00
ג' | 16:00–20:00
ד' | סגור
ה' | 10:00–16:00
ו' | 10:00–14:00
שבת | 10:00–16:00""",
    description="""מוזיאון ישראל בירושלים...""",
    services=["בית קפה", "מסעדה", "חנות מוזיאון", "שירותים נגישים"]
)


events = [
    {
        "id": 1,
        "title": "פתיחת תערוכת 'חלומות צלולים'",
        "date": "2025-01-01",
        "description": "אירוע פתיחה חגיגי.",
          "image": "/images/fe-dreams.jpg"
    },
    {
        "id": 2,
        "title": "סדנת הדפס לילדים",
        "date": "2025-01-15",
        "description": "סדנת יצירה חווייתית.",
        "image": "/images/fe-print.jpg"
    },
    {
        "id": 3,
        "title": "סיור מודרך בתערוכת 'שדה'",
        "date": "2025-02-10",
        "description": "סיור עם האוצרות בעקבות 'שדה'.",
        "image": "/images/fe-october7-event.jpg"
    }
]


@app.get("/creatures", response_model=List[Creature])
def get_creatures():
    return creatures

# ראוטים
@app.get("/exhibitions", response_model=List[Exhibition])
def get_exhibitions():
    return exhibitions

@app.get("/exhibitions/{ex_id}", response_model=Exhibition)
def get_exhibition(ex_id: int):
    for ex in exhibitions:
        if ex["id"] == ex_id:
            return ex
    raise HTTPException(status_code=404, detail="Exhibition not found")

@app.get("/search", response_model=List[Exhibition])
def search_exhibitions(q: str):
    return [ex for ex in exhibitions if q.lower() in ex["title"].lower()]
@app.get("/events")
def get_events():
    return events


@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="האימייל כבר קיים במערכת")
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "נרשמת בהצלחה!", "role": new_user.role}

@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    found = db.query(User).filter_by(email=user.email, password=user.password).first()
    if not found:
        raise HTTPException(status_code=400, detail="אימייל או סיסמה שגויים")
    return {
        "id": found.id,
        "username": found.username,
        "email": found.email,  # ← זו השורה החשובה!
        "role": found.role
    }

@app.post("/tours")
def create_tour(tour: TourCreate, db: Session = Depends(get_db)):
    new_tour = Tour(
        guide_id=tour.guide_id,
        name=tour.name,
        description=tour.description,
        exhibition_ids=",".join(map(str, tour.exhibitions)),
        tour_date=tour.tour_date  # ✅ הוספה
    )
    db.add(new_tour)
    db.commit()
    db.refresh(new_tour)
    return {"message": f"הסיור '{tour.name}' נוצר בהצלחה!", "id": new_tour.id}



@app.post("/tours/{tour_id}/register")
def register_to_tour(tour_id: int, visitor_email: str, db: Session = Depends(get_db)):
    print(f"📥 ניסיון רישום לסיור: tour_id={tour_id}, visitor_email={visitor_email}")

    user = db.query(User).filter_by(email=visitor_email).first()
    if not user:
        print("❌ המשתמש לא נמצא במסד")
    elif user.role != "visitor":
        print(f"⚠️ המשתמש נמצא אבל התפקיד שלו הוא {user.role}, לא visitor")

    if not user or user.role != "visitor":
        raise HTTPException(status_code=400, detail="משתמש לא קיים או לא מבקר")

    registration = TourRegistration(tour_id=tour_id, user_id=user.id)
    db.add(registration)
    db.commit()

    print(f"✅ המשתמש {user.email} נרשם לסיור {tour_id}")
    return {"message": f"המשתמש {user.username} נרשם לסיור {tour_id}"}


@app.get("/tours/{tour_id}/participants")
def get_tour_participants(tour_id: int, db: Session = Depends(get_db)):
    regs = db.query(TourRegistration).filter_by(tour_id=tour_id).all()
    users = db.query(User).filter(User.id.in_([r.user_id for r in regs])).all()
    return [{"id": u.id, "username": u.username, "email": u.email} for u in users]

@app.get("/info", response_model=MuseumInfo)
def get_museum_info():
    return museum_info

@app.get("/tours")
def get_all_tours(db: Session = Depends(get_db)):
    tours = db.query(Tour).all()

    # שלוף את כל המדריכים הרלוונטיים
    guide_ids = [t.guide_id for t in tours]
    guides = db.query(User).filter(User.id.in_(guide_ids)).all()
    guide_map = {g.id: g.username for g in guides}

    return [
        {
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "exhibition_ids": t.exhibition_ids,
            "tour_date": t.tour_date,
            "guide_id": t.guide_id,
            "guide_name": guide_map.get(t.guide_id, "מדריך לא ידוע")  # ✅ חדש
        }
        for t in tours
    ]


@app.delete("/tours/{tour_id}")
def delete_tour(tour_id: int, db: Session = Depends(get_db)):
    tour = db.query(Tour).filter_by(id=tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="סיור לא נמצא")

    # מחיקת כל ההרשמות הקשורות לסיור
    db.query(TourRegistration).filter_by(tour_id=tour_id).delete()

    # מחיקת הסיור עצמו
    db.delete(tour)
    db.commit()
    return {"message": f"הסיור {tour.name} נמחק בהצלחה"}


@app.put("/tours/{tour_id}")
def update_tour(tour_id: int, updated: TourUpdate, db: Session = Depends(get_db)):
    tour = db.query(Tour).filter_by(id=tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="סיור לא נמצא")

    tour.name = updated.name
    tour.description = updated.description
    tour.exhibition_ids = ",".join(map(str, updated.exhibitions or []))
    tour.tour_date = updated.tour_date  # ✅ הוספה
    db.commit()
    return {"message": "הסיור עודכן בהצלחה"}


@app.post("/tours/{tour_id}/send-message")
def send_message_to_tour(tour_id: int, msg: MessageRequest, db: Session = Depends(get_db)):
    registrations = db.query(TourRegistration).filter_by(tour_id=tour_id).all()
    if not registrations:
        raise HTTPException(status_code=404, detail="אין נרשמים לסיור")

    for reg in registrations:
        db.add(Message(
            tour_id=tour_id,
            sender_id=msg.sender_id,
            recipient_id=reg.user_id,
            content=msg.content
        ))
    db.commit()
    return {"message": f"ההודעה נשלחה ל-{len(registrations)} נרשמים"}


@app.get("/messages")
def get_messages(user_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter_by(recipient_id=user_id).order_by(Message.timestamp.desc()).all()
    return [
        {
            "from": db.query(User).filter_by(id=m.sender_id).first().username,
            "content": m.content,
            "timestamp": m.timestamp
        }
        for m in messages
    ]


@app.get("/tours/{tour_id}/feedbacks")
def get_feedbacks(tour_id: int, db: Session = Depends(get_db)):
    feedbacks = db.query(Feedback).filter_by(tour_id=tour_id).all()
    users = db.query(User).all()
    user_map = {u.id: u.username for u in users}
    return [
        {
            "user": user_map.get(f.user_id, "לא ידוע"),
            "content": f.content,
             "rating": f.rating
        }
        for f in feedbacks
    ]


@app.post("/feedbacks")
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    # בדיקה אם המשתמש באמת רשום לסיור
    registration = db.query(TourRegistration).filter_by(
        tour_id=feedback.tour_id,
        user_id=feedback.user_id
    ).first()

    if not registration:
        raise HTTPException(status_code=403, detail="משתמש לא רשום לסיור זה")

    new_feedback = Feedback(
    tour_id=feedback.tour_id,
    user_id=feedback.user_id,
    content=feedback.content or "",  # ← מונע null
    rating=feedback.rating
)
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return {"message": "פידבק נשלח בהצלחה!"}
