import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * A component that protects routes by checking if the user is authenticated
 * and has the required role before rendering the protected component.
 */
const ProtectedRoute = ({ element, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and has the required role
    const checkAuth = async () => {
      try {
        // Small delay to prevent rapid redirects
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const token = localStorage.getItem('adminToken');
        const userData = JSON.parse(localStorage.getItem('adminUser') || '{}');
        
        console.log('ProtectedRoute Debug:', {
          token: token ? 'Present' : 'Missing',
          userData,
          requiredRole,
          hasRole: userData.role === requiredRole,
          currentPath: window.location.pathname
        });
        
        if (!token || !userData || !userData.email) {
          console.log('No valid authentication found, redirecting to login');
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Check if user has the required role
        if (requiredRole && userData.role !== requiredRole) {
          console.log('Role mismatch:', userData.role, 'vs', requiredRole);
          toast.error(`Access denied. ${requiredRole} privileges required.`);
          setAuthorized(false);
        } else {
          console.log('Authentication successful');
          setAuthorized(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not authorized, redirect to appropriate login page
  if (!authorized) {
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If user is authorized, render the protected component
  return element;
};

export default ProtectedRoute;