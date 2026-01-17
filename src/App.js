import React, { useState } from 'react';
import './App.css'; // Make sure to import the CSS file
import { 
  FaPhoneAlt, FaWhatsapp, FaFacebookF, FaTwitter, FaGooglePlusG, FaLinkedinIn, 
  FaUser, FaPlaneDeparture, FaPlaneArrival, FaExchangeAlt, FaCalendarAlt 
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import TopHeader from './includes/header'; 
import Navbar from './includes/topbar';
import HeroSection from './pages/home';
// --- Components ---

function App() {
  return (
    <div className="app">
      <TopHeader />
      <Navbar />
      <HeroSection />
    </div>
  );
}

export default App;