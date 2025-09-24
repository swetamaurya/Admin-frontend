// Simple API client for admin panel

// Environment-based API URL configuration
const getApiBaseUrl = () => {
  // Check if we're in production
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    // Production URLs - Use hosted backend URL
    return import.meta.env.VITE_API_URL || 'https://backend-ecommerce-admin.onrender.com/api';
  } else {
    // Development URLs
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging for API configuration
console.log('=== API CONFIGURATION DEBUG ===');
console.log('Environment:', {
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  NODE_ENV: import.meta.env.NODE_ENV
});
console.log('Environment Variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL
});
console.log('Final API Configuration:', {
  API_BASE_URL: API_BASE_URL,
  IsProduction: import.meta.env.PROD
});
console.log('=== END API CONFIGURATION ===');

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    return { data: await response.json() };
  },
  post: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(data)
    });
    return { data: await response.json() };
  },
  put: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(data)
    });
    return { data: await response.json() };
  },
  delete: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    return { data: await response.json() };
  }
};

// Cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Helper function to get cached data
const getCachedData = (key) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const adminApi = {
  // Authentication - simplified for admin only
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
      }
      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error('Admin login failed');
    }
  },

  // Create admin (first time setup)
  createAdmin: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('adminToken', 'admin-token');
        localStorage.setItem('adminUser', JSON.stringify(data.data));
      }
      return data;
    } catch (error) {
      console.error('Create admin error:', error);
      throw new Error('Create admin failed');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Forgot password request failed');
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Password reset failed');
    }
  },

  // Send OTP
  sendOtp: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error('Failed to send OTP');
    }
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error('Failed to verify OTP');
    }
  },

  // Verify OTP and reset password
  verifyOtpAndResetPassword: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify-otp-reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Verify OTP and reset password error:', error);
      throw new Error('Failed to reset password');
    }
  },

  // Product Management
  getProducts: async (page = 1, limit = 10, search = '') => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin authentication required. Please login again.');
      }
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await api.get(`/products/getAll?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  uploadImage: async (imageData, filename) => {
    try {
      const response = await api.post('/upload/image', {
        imageData,
        filename
      });
      return response.data;
    } catch (error) {
      console.error('Upload image error:', error);
      throw new Error('Failed to upload image');
    }
  },

  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin authentication required. Please login again.');
      }
      
      console.log('Sending product data to API:', productData);
      console.log('Using token:', token.substring(0, 20) + '...');
      
      const response = await api.post('/products/create', productData);
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to create product');
      } else {
        throw new Error('Network error or server unavailable');
      }
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/update/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw new Error('Failed to update product');
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/delete/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw new Error('Failed to delete product');
    }
  },

          // Admin stats
          getAdminStats: async () => {
            try {
              const response = await api.get('/admin/stats');
              return response.data;
            } catch (error) {
              console.error('Get admin stats error:', error);
              throw error;
            }
          },

          // Dashboard statistics (counts only)
          getDashboardStats: async () => {
            try {
              const response = await api.get('/dashboard');
              return response.data;
            } catch (error) {
              console.error('Get dashboard stats error:', error);
              throw error;
            }
          },

          // Get all users
          getUsers: async (page = 1, limit = 10, search = '') => {
            try {
              const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search && { search })
              });

              const response = await api.get(`/admin/users?${queryParams}`);
              return response.data;
            } catch (error) {
              console.error('Get users error:', error);
              throw error;
            }
          },

          // Update user status (block/unblock)
          updateUserStatus: async (userId) => {
            try {
              const response = await api.put(`/admin/users/${userId}/block`);
              return response.data;
            } catch (error) {
              console.error('Update user status error:', error);
              throw error;
            }
          },

          // Get all orders
          getOrders: async (page = 1, limit = 10, status = 'all', search = '') => {
            try {
              const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(status !== 'all' && { status }),
                ...(search && { search })
              });

              const response = await api.get(`/orders/getAll?${queryParams}`);
              return response.data;
            } catch (error) {
              console.error('Get orders error:', error);
              throw error;
            }
          },

          // Get all orders (alias for consistency)
          getAllOrders: async (page = 1, limit = 10, status = 'all', search = '') => {
            try {
              const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(status !== 'all' && { status }),
                ...(search && { search })
              });

              const response = await api.get(`/orders/getAll?${queryParams}`);
              return response.data;
            } catch (error) {
              console.error('Get orders error:', error);
              throw error;
            }
          },

          // Update order status
          updateOrderStatus: async (orderId, updateData) => {
            try {
              const response = await api.put(`/orders/${orderId}/status`, updateData);
              return response.data;
            } catch (error) {
              console.error('Update order status error:', error);
              throw error;
            }
          },

          // Delete order
          deleteOrder: async (orderId) => {
            try {
              const response = await api.delete(`/orders/${orderId}`);
              return response.data;
            } catch (error) {
              console.error('Delete order error:', error);
              throw error;
            }
          },

          // Get all payments
          getPayments: async (page = 1, limit = 10, status = 'all', method = 'all', search = '') => {
            try {
              const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(status !== 'all' && { status }),
                ...(method !== 'all' && { method }),
                ...(search && { search })
              });

              const response = await api.get(`/payments/getAll?${queryParams}`);
              return response.data;
            } catch (error) {
              console.error('Get payments error:', error);
              throw error;
            }
          },

          // Update payment status
          updatePaymentStatus: async (paymentId, status) => {
            try {
              const response = await api.put(`/payments/${paymentId}/status`, { status });
              return response.data;
            } catch (error) {
              console.error('Update payment status error:', error);
              throw error;
            }
          },

          // Refund payment
          refundPayment: async (paymentId, refundAmount, reason) => {
            try {
              const response = await api.post(`/payments/${paymentId}/refund`, { refundAmount, reason });
              return response.data;
            } catch (error) {
              console.error('Refund payment error:', error);
              throw error;
            }
          }
};

export default adminApi;