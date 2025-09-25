import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  // AdminLayout no longer needs to check authentication
  // ProtectedRoute handles authentication before rendering this component
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
