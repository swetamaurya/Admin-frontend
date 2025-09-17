// API configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

 
 
export const BASE_URL = 
//     ? 'http://localhost:5001'  // Local development (matches server port)
    'https://backend-ecommerce-admin.onrender.com'
// ); 

// Full API URL (with /api)
export const API_URL = `${BASE_URL}/api`;

// Debug: Log current configuration
console.log('=== CONFIG DEBUG ===');
console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('BASE_URL:', BASE_URL);
console.log('API_URL:', API_URL);

// Razorpay configuration
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890';