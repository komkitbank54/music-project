// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainPage from './MainPage';
import AdminPage from './AdminPage';
import Navbar from './components/navbar';
import SongDetail from './SongDetail'; // If you have individual song pages
import { ModalProvider,useModal } from './context/ModalContext';
import Login from './components/login'; // Adjust based on your component
import Register from './components/register'; // Adjust based on your component


// Import CSS
import "./css/button.css";
import "./css/input.css";
import "./css/menu.css";
import "./css/popular-song.css";
import "./css/section.css";
import "./css/statushover.css";
import "./css/tab.css";
import "./css/table.css";
import "./css/tooltip.css";
import "./css/musicbar.css";

// Import fonts
import "./fonts/fonts.css";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => {
    const { showLoginModal, setShowLoginModal, showRegisterModal, setShowRegisterModal } = useModal();
  return (
    <>
      <Navbar />
        {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
        {showRegisterModal && <Register onClose={() => setShowRegisterModal(false)} />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/user" element={<ProtectedRoute role="user"><MainPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
        <Route path="/song/:songId" element={<SongDetail />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
    <AuthProvider>
        <ModalProvider>
        <AppRoutes />
        </ModalProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;
