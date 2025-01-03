import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminRouter from './routes/AdminRouter';
import OrgRouter from './routes/OrgRouter';
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

const App = () => (
    <Router>
        <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRouter />} />

            {/* Tenant Routes */}
            <Route path="/:org/*" element={<OrgRouter />} />

            <Route path="/403" element={<Forbidden />} />
            <Route path="/404" element={<NotFound />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
);


export default App;
