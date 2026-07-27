import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AdminLayout from './components/AdminLayout';
import MemberLayout from './components/MemberLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import LeadManagement from './pages/LeadManagement';
import LeadDetails from './pages/LeadDetails';
import CreateLead from './pages/CreateLead';
import EditLead from './pages/EditLead';
import UserManagement from './pages/UserManagement';
import MemberDashboard from './pages/MemberDashboard';
import MyLeads from './pages/MyLeads';
import ProfilePage from './pages/ProfilePage';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Any logged-in user can access */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin-only branch – wrapped in AdminLayout */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leads" element={<LeadManagement />} />
            <Route path="/admin/leads/create" element={<CreateLead />} />
            <Route path="/admin/leads/:id" element={<LeadDetails />} />
            <Route path="/admin/leads/:id/edit" element={<EditLead />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
        </Route>

        {/* Member-only branch – wrapped in MemberLayout */}
        <Route element={<RoleRoute allowedRoles={['member']} />}>
          <Route element={<MemberLayout />}>
            <Route path="/member/dashboard" element={<MemberDashboard />} />
            <Route path="/member/leads" element={<MyLeads />} />
            <Route path="/member/leads/:id" element={<LeadDetails />} />
          </Route>
        </Route>
      </Route>

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;