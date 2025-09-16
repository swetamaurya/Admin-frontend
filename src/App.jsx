import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage.jsx";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminOtpVerification from "./pages/admin/AdminOtpVerification";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* Redirect root to admin login */}
        <Route path="/" element={<AdminLogin />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/verify-otp" element={<AdminOtpVerification />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} requiredRole="admin" />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600">Coming soon...</p></div></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
        <Route path="/admin/inventory" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Inventory</h1><p className="text-gray-600">Coming soon...</p></div></AdminLayout>} />
        
        {/* 404 page */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
