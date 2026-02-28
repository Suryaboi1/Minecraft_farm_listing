import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FarmDetailPage from './pages/FarmDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/farm/:id" element={<FarmDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
