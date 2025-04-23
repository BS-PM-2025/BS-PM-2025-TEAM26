from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Exhibition(BaseModel):
    id: int
    title: str
    description: str
    image: str

class MuseumInfo(BaseModel):
    opening_hours: str
    description: str
    services: List[str]



# -------------------------------
# 🔹 In-memory data
# -------------------------------
exhibitions = [
    Exhibition(id=1, title="אמנות מודרנית", description="תערוכה של יצירות מהמאות ה־20 וה־21.", image="/images/modern-art.jpg"),
    Exhibition(id=2, title="מצרים העתיקה", description="מוצגים ממצרים הקדומה – פסלים, מכתבים וחפצי קבורה.", image="/images/egypt.jpg")
]

museum_info = MuseumInfo(
    opening_hours="ג' | 20:00-16:00,ב' | 16:00-10:00,א' | סגור",
    description="המוזיאון הוקם בשנת 1950 ונחשב לאחד המובילים בתחומו בארץ.",
    services=["בית קפה", "שירותים", "מעלית לנכים", "WiFi", "חנות", "מסעדה"]
)

# -------------------------------
# 🔹 Routes
# -------------------------------

@app.get("/exhibitions", response_model=List[Exhibition])
def get_exhibitions():
    return exhibitions

@app.get("/exhibitions/{ex_id}", response_model=Exhibition)
def get_exhibition(ex_id: int):
    for ex in exhibitions:
        if ex.id == ex_id:
            return ex
    raise HTTPException(status_code=404, detail="Exhibition not found")

@app.get("/search", response_model=List[Exhibition])
def search_exhibitions(q: str):
    return [ex for ex in exhibitions if q.lower() in ex.title.lower()]

@app.get("/info", response_model=MuseumInfo)
def get_museum_info():
    return museum_info
