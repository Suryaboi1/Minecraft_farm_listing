import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import FarmDetailPage from './pages/FarmDetailPage';
import LoveCalculator from './pages/LoveCalculator';
import IshitaDiary from './pages/IshitaDiary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/minecraft-lister" element={<HomePage />} />
        <Route path="/minecraft-lister/farm/:id" element={<FarmDetailPage />} />
        <Route path="/love-calculator" element={<LoveCalculator />} />
        <Route path="/ishita-diary" element={<IshitaDiary />} />
      </Routes>
    </Router>
  );
}

export default App;
