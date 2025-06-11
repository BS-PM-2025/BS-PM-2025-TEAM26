import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionDetailsPage from "./pages/ExhibitionDetailsPage";
import NavigationPage from "./pages/NavigationPage";
import MuseumInfoPage from "./pages/MuseumInfoPage";
import FavoritesPage from "./pages/FavoritesPage";
import EventsPage from "./pages/EventsPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage"; 
import GuideDashboard from "./pages/GuideDashboard";
import GuidePage from "./pages/GuidePage";
import CreateTourPage from "./pages/guide/CreateTourPage";
import VisitorToursPage from "./pages/VisitorToursPage";
import TourParticipantsPage from "./pages/guide/TourParticipantsPage";
import ManageToursPage from "./pages/guide/ManageToursPage";
import EditTourPage from "./pages/guide/EditTourPage";
import MyMessagesPage from "./pages/MyMessagePage";
import CreaturesPage from "./pages/CreaturesPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminExhibitionsPage from "./pages/admin/AdminExhibitionsPage";
import AdminEditExhibitionPage from "./pages/admin/AdminEditExhibitionPage";
import AdminNewExhibitionPage from "./pages/admin/AdminNewExhibitionPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";


export default function App() {
  return (
    <Router>
      <div dir="rtl" style={{ fontFamily: 'Arial, sans-serif', minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar /> {/* תפריט קבוע עליון */}
        
        <div style={{ flex: "1", padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exhibitions" element={<ExhibitionsPage />} />
            <Route path="/exhibitions/:id" element={<ExhibitionDetailsPage />} />
            <Route path="/navigate" element={<NavigationPage />} />
            <Route path="/info" element={<MuseumInfoPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} /> 
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/guide/create-tour" element={<CreateTourPage />} />
            <Route path="/visitor/tours" element={<VisitorToursPage />} />
            <Route path="/guide/tours/:tourId/participants" element={<TourParticipantsPage />} />
            <Route path="/guide/manage-tours" element={<ManageToursPage />} />
            <Route path="/guide/edit-tour/:id" element={<EditTourPage />} />
            <Route path="/guide/tour-participants" element={<TourParticipantsPage />} />
            <Route path="/my-messages" element={<MyMessagesPage />} />
            <Route path="/creatures" element={<CreaturesPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/exhibitions" element={<AdminExhibitionsPage />} />
            <Route path="/admin/exhibitions/edit/:id" element={<AdminEditExhibitionPage />} />
            <Route path="/admin/exhibitions/new" element={<AdminNewExhibitionPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Routes>
        </div>

        <Footer /> {/* תחתית קבועה */}
      </div>
    </Router>
  );
}