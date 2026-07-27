import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { memberNavItems } from '../utils/navConfig';

const MemberLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar navItems={memberNavItems} />
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

export default MemberLayout;