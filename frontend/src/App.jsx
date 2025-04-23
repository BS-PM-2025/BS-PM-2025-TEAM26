import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionDetailsPage from "./pages/ExhibitionDetailsPage";
import NavigationPage from "./pages/NavigationPage";
import MuseumInfoPage from "./pages/MuseumInfoPage";
import FavoritesPage from "./pages/FavoritesPage";



export default function App() {
  return (
    <Router>
      <div dir="rtl" style={{ fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
      <nav style={{ marginBottom: '1rem' }}>
      <Link to="/">דף הבית</Link> | <Link to="/exhibitions">תערוכות</Link> | <Link to="/navigate">ניווט</Link> | <Link to="/info">על המוזיאון</Link> | <Link to="/favorites">שמורים</Link>
      </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          <Route path="/exhibitions/:id" element={<ExhibitionDetailsPage />} />
          <Route path="/navigate" element={<NavigationPage />} />
          <Route path="/info" element={<MuseumInfoPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </Router>
  );
}
