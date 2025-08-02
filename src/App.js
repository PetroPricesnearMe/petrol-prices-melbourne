import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MapPage from './components/MapPage';
import DirectoryPage from './components/DirectoryPage';
import RoadsideAssistancePage from './components/RoadsideAssistancePage';
import TrafficPage from './components/TrafficPage';
import AccountPage from './components/AccountPage';
import CarWashesPage from './components/CarWashesPage';
import TruckStopsPage from './components/TruckStopsPage';
import ServiceStationsPage from './components/ServiceStationsPage';
import NewsPage from './components/NewsPage';
import StationBrandsPage from './components/StationBrandsPage';
import SignInPage from './components/SignInPage';
import BecomeMemberPage from './components/BecomeMemberPage';
import RealTimeUpdates from './components/RealTimeUpdates';

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
          <Route path="/roadside-assistance" element={<RoadsideAssistancePage />} />
          <Route path="/traffic" element={<TrafficPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/car-washes" element={<CarWashesPage />} />
          <Route path="/truck-stops" element={<TruckStopsPage />} />
          <Route path="/service-stations" element={<ServiceStationsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/station-brands" element={<StationBrandsPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/become-member" element={<BecomeMemberPage />} />
          <Route path="/real-time" element={<RealTimeUpdates />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 