import React from 'react';
import { Navigate } from 'react-router-dom';
import isTokenExpired from '../utils/isTokenExpired';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || isTokenExpired(token) || !user || !allowedRoles.includes(user.role)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/403" replace />;
    }

    return children;
};

export default ProtectedRoute;