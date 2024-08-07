import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
const ProtectedRoute = ({ element }) => {
	const location = useLocation();
	console.log(location.pathname)
	const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
	if (!isAuthenticated) {
		if (location.pathname === '/login') {
			return <Login />
		}
		return <Navigate to="/login" />;
	} else {
		if (location.pathname === '/login') {
			return <Navigate to="/" />;
		}	
	}
	return element;
};

export default ProtectedRoute;
