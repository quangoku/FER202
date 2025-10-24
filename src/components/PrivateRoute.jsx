import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const userRole = localStorage.getItem('userRole');

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return userRole ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;