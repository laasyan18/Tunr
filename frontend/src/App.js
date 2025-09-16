// App.js - Complete routing with authentication
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import TunrNavigation from './components/TunrNavigation';
import ProtectedRoute from './components/ProtectedRoute';

// Import all your components
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import PreferencesPage from './components/PreferencesPage';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import MovieDetailPage from './components/MovieDetailPage';
import MusicPage from './components/MusicPage'

const AppContent = () => {
  const location = useLocation();
  
  // Show navigation only on protected pages
  const protectedPaths = ['/home', '/search', '/preferences', '/welcome'];
  const showNavbar = protectedPaths.includes(location.pathname) || location.pathname.startsWith('/movie/');
  
  // Check if user is authenticated for navbar display
  const isAuthenticated = localStorage.getItem('userToken') || localStorage.getItem('isLoggedIn');

  return (
    <>
      {/* Show navigation only on protected pages and when authenticated */}
      {showNavbar && isAuthenticated && <TunrNavigation />}
      
      <Routes>
        {/* PUBLIC ROUTES - Accessible without login */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* PROTECTED ROUTES - Require authentication */}
        <Route 
          path="/preferences" 
          element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/welcome" 
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movie/:id" 
          element={
            <ProtectedRoute>
              <MovieDetailPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/music" 
          element={
            <ProtectedRoute>
              <MusicPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;
