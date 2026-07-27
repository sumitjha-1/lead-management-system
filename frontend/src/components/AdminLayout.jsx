import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { adminNavItems } from '../utils/navConfig';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar navItems={adminNavItems} />
      <div className="ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;