import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaArrowLeft, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminApi from '../../services/adminApi';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.sendOtp(email);
      
      if (response.success) {
        setEmailSent(true);
        toast.success('OTP sent to your email');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
              <FaCheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              We've sent a 6-digit OTP to <strong>{email}</strong>
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-white py-6 px-5 shadow-xl rounded-lg">
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  OTP Sent Successfully
                </h3>
                <p className="text-xs text-green-700">
                  Please check your email inbox for the 6-digit OTP code. 
                  Enter this code in the verification page to reset your password.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/verify-otp', { state: { email } })}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Verify OTP
                </button>
                
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  Back to Login
                </button>
                
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  Try Different Email
                </button>
              </div>
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
                    OTP codes expire after 10 minutes for security reasons. 
                    If you need a new code, please request another OTP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <FaShieldAlt className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Enter your email address and we'll send you reset instructions
          </p>
        </div>

        {/* Forgot Password Form */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="appearance-none relative block w-full pl-9 pr-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm"
                  placeholder="admin@example.com"
                />
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
                    Sending Instructions...
                  </div>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </div>

            {/* Back to Login Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                <FaArrowLeft className="h-3 w-3 mr-1" />
                Back to Login
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Enter the email address associated with your admin account
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
                  For security reasons, password reset links are only valid for 1 hour. 
                  Only authorized admin emails can request password resets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
