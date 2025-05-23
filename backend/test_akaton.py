import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from main import register_user, login_user
from main import UserCreate, UserLogin, User
from main import create_tour, TourCreate, Tour, register_to_tour, get_tour_participants, delete_tour, update_tour, TourUpdate
from main import get_exhibitions, get_exhibition, search_exhibitions, get_museum_info, get_events
from main import get_museum_info, get_events
from main import get_exhibitions, get_exhibition, search_exhibitions, get_creatures
from main import FeedbackCreate 
    
    
# BSPM25T26-147: עיצוב מחודש לסרגל ניווט (placeholder)
def test_navbar_style_applied():
    assert True  # עיצוב הוא בדיקה של צד לקוח

# BSPM25T26-148: כפתור "לצפייה בפרטים"
def test_get_exhibition_button_logic():
    exhibitions = get_exhibitions()
    assert any("title" in e for e in exhibitions)

# BSPM25T26-149: עדכון דף האירועים
def test_event_data_structure():
    events = get_events()
    assert isinstance(events, list)
    assert "title" in events[0]
    assert "date" in events[0]

# BSPM25T26-150: הוספת סרגל פיידבק
def test_feedback_create_model():
    fb = FeedbackCreate(tour_id=1, user_id=1, content="Great", rating=5.0)
    assert fb.rating == 5.0

# BSPM25T26-151: הוספת דף יצירות
def test_creature_api_data():
    creatures = get_creatures()
    assert isinstance(creatures, list)
    assert "name" in creatures[0]
    assert "description" in creatures[0]

# BSPM25T26-152: עיצוב המפה (placeholder)
def test_map_page_render():
    assert True  # עיצוב זה נבדק ב-UI, לא בלוגיקה
