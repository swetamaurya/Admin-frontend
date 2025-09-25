import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminApi from '../../services/adminApi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Small delay to prevent rapid redirects
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const token = localStorage.getItem('adminToken');
        const userDataStr = localStorage.getItem('adminUser');
        
        console.log('Login Check - Token:', token ? 'Present' : 'Missing');
        console.log('Login Check - UserData:', userDataStr);
        
        // Clear any corrupted data first
        if (!token || !userDataStr) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          console.log('Cleared corrupted auth data');
          return;
        }
        
        let userData;
        try {
          userData = JSON.parse(userDataStr);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          return;
        }
        
        // Only redirect if we have valid data
        if (token && userData && userData.role === 'admin' && userData.email) {
          console.log('User already logged in, redirecting to dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else {
          console.log('No valid authentication found, staying on login page');
          // Clear invalid data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any corrupted data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Debug log to check if component is rendering
  console.log('AdminLogin component rendered');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('=== ADMIN LOGIN DEBUG ===');
      console.log('Email:', formData.email);
      
      const data = await adminApi.login(formData);
      console.log('Response Data:', data);
      console.log('=== END DEBUG ===');

      if (data.success) {
        toast.success('Welcome back, Admin!');
        
        // Debug: Check localStorage
        console.log('Admin token stored:', localStorage.getItem('adminToken'));
        console.log('Admin user stored:', localStorage.getItem('adminUser'));
        
        // Small delay to ensure localStorage is set
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 100);
      } else {
        console.error('Login failed:', data);
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(`Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('All data cleared! Please try logging in again.');
    console.log('All authentication data cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <FaShieldAlt className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Access the admin panel with your credentials
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-6 px-5 shadow-xl rounded-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-9 pr-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-9 pr-9 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-20">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In to Admin Panel'
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>

            {/* Clear Data Button - For debugging */}
            <div className="text-center">
              <button
                type="button"
                onClick={clearAllData}
                className="text-xs text-red-600 hover:text-red-800 transition-colors duration-200 underline"
              >
                Clear All Data (Debug)
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              This is a secure admin area. Only authorized personnel should access this page.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaShieldAlt className="h-4 w-4 text-blue-400" />
            </div>
            <div className="ml-2">
              <h3 className="text-xs font-medium text-blue-800">
                Security Notice
              </h3>
              <div className="mt-1 text-xs text-blue-700">
                <p>
                  This admin login is separate from the main site. Your admin session will not affect your regular user account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
