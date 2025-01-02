import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminRouter from './routes/AdminRouter';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('token')
    );

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div>
                <Routes>

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<AdminRouter />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
