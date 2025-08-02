import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MapPage from './components/MapPage';
import DirectoryPage from './components/DirectoryPage';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
      }}
    >
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 