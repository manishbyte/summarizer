import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header'; // Main Header component
import MiniHeader from './components/MiniHeader'; // Mini Header component for larger screens
import ContentPage from './components/ContentPage'; // Dynamic content page
import Signup from './components/Signup'; // Signup component
import Login from './components/Login'; // Login component
import UserProfile from './components/UserProfile';

const App = () => {
    return (
        <Router>
            <Layout />
        </Router>
    );
};

const Layout = () => {
    const location = useLocation();

    // Check if current route is Signup or Login
    const isAuthPage = location.pathname === '/signup' || location.pathname === '/login';
    
    return (
        <>
            {/* Conditionally render Header based on the current route */}
            {!isAuthPage && <Header />}

            {!isAuthPage && (
                <div className="hidden md:block">
                    <MiniHeader />
                </div>
            )}


            <div className="p-4">
                <Routes>
                    {/* Route for dynamic content */}
                    <Route path="/content/:value" element={<ContentPage />} />
                    {/* Signup route */}
                    <Route path="/signup" element={<Signup />} />
                    {/* Login route */}
                    <Route path="/login" element={<Login />} />
                    {/* Default route redirects to 'latest-news' */}
                    <Route path="/" element={<Navigate to="/content/latest-news" />} />
                    {/* Catch-all route for invalid paths */}
                    <Route path="*" element={<Navigate to="/content/latest-news" />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
            </div>
        </>
    );
};

export default App;
