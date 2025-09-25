import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter, FaSort, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaCreditCard, FaPaypal, FaMoneyBillWave, FaUser, FaCalendar, FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminApi from '../../services/adminApi';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [pagination, setPagination] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchTerm, filterStatus, filterMethod]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPayments(
        currentPage, 
        paymentsPerPage, 
        filterStatus === 'All' ? 'all' : filterStatus, 
        filterMethod === 'All' ? 'all' : filterMethod, 
        searchTerm
      );
      
      setPayments(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalPayments(response.pagination?.totalPayments || 0);
      setPagination({
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < (response.pagination?.totalPages || 1)
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (value.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
      setIsSearching(false);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
      setCurrentPage(1);
  };

  const handleMethodFilterChange = (e) => {
    setFilterMethod(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (paymentId) => {
    toast.info(`Viewing payment details: ${paymentId}`);
  };

  const handleRefundPayment = async (paymentId) => {
    if (window.confirm(`Are you sure you want to refund payment ${paymentId}?`)) {
      try {
        await adminApi.refundPayment(paymentId);
        toast.success(`Payment ${paymentId} refunded successfully!`);
        fetchPayments();
    } catch (error) {
        console.error('Error refunding payment:', error);
        toast.error('Failed to refund payment');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card': return <FaCreditCard className="h-4 w-4" />;
      case 'PayPal': return <FaPaypal className="h-4 w-4" />;
      case 'Cash on Delivery': return <FaMoneyBillWave className="h-4 w-4" />;
      default: return <FaCreditCard className="h-4 w-4" />;
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Management</h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Total Payments: {totalPayments}
        </div>
      </div>


      {/* Search Bar - Responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by Payment ID, Order ID, Customer, or Transaction ID..."
            value={localSearchTerm}
            onChange={handleSearch}
            className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        {localSearchTerm && (
          <div className="mt-2 text-xs sm:text-sm text-gray-500">
            Searching for: "{localSearchTerm}"
          </div>
        )}
      </div>

      {/* Filters - Responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative">
            <select
              className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={filterStatus}
              onChange={handleStatusFilterChange}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          </div>

          <div className="relative">
            <select
              className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={filterMethod}
              onChange={handleMethodFilterChange}
            >
              <option value="All">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
            <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>

      {/* Payments Table - Desktop View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.paymentId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Order: {payment.order?.orderId || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.user?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.gateway || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{payment.amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(payment._id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View Details"
                    >
                      <FaEye className="inline-block h-4 w-4" />
                    </button>
                    {payment.status === 'Completed' && (
                      <button
                        onClick={() => handleRefundPayment(payment._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Refund Payment"
                      >
                        <FaTrash className="inline-block h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {payments.map((payment) => (
          <div key={payment._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {payment.paymentId}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Order: {payment.order?.orderId || 'N/A'} • ₹{payment.amount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(payment._id)}
                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                    title="View Details"
                  >
                    <FaEye className="w-3 h-3" />
                  </button>
                  {payment.status === 'Completed' && (
                    <button
                      onClick={() => handleRefundPayment(payment._id)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                      title="Refund Payment"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-900">{payment.user?.name || 'N/A'}</span>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <FaDollarSign className="w-3 h-3" />
                  <span>{payment.paymentMethod}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <FaCalendar className="w-3 h-3" />
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                </div>
                
                {payment.gateway && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <FaCreditCard className="w-3 h-3" />
                    <span>Gateway: {payment.gateway}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Responsive */}
      <div className="bg-white px-3 sm:px-4 py-3 border-t border-gray-200">
        {/* Mobile Pagination */}
        <div className="flex flex-col space-y-3 sm:hidden">
          {/* Mobile Info */}
          <div className="text-center">
            <p className="text-xs text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalPayments)}
              </span>{' '}
              of <span className="font-medium">{totalPayments}</span> results
            </p>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <FaChevronLeft className="w-3 h-3 mr-1" />
              Previous
            </button>
            
            {/* Current Page Indicator */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Page</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {currentPage}
              </span>
              <span className="text-xs text-gray-500">of {totalPages}</span>
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              Next
              <FaChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          {/* Mobile Page Numbers (if total pages <= 5) */}
          {totalPages <= 5 && totalPages > 1 && (
            <div className="flex justify-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Desktop Pagination */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 5, totalPayments)}
              </span>{' '}
              of <span className="font-medium">{totalPayments}</span> results
            </p>
          </div>
          <div>
            {totalPages > 1 ? (
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="h-5 w-5" />
                </button>
              </nav>
            ) : (
              <div className="text-sm text-gray-500">
                Page 1 of 1
              </div>
            )}
          </div>
        </div>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No payments found</p>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;