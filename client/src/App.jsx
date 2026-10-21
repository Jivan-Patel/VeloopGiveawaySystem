import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Giveaway from './pages/Giveaway';
import GiveawayDetail from './pages/GiveawayDetail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Earn from './pages/Earn';
import NotFound from './pages/NotFound';
import './App.css';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/giveaway" replace />} />
              <Route path="/giveaway" element={<Giveaway />} />
              <Route path="/giveaway/:slug" element={<GiveawayDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
