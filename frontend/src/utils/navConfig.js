import { FiGrid, FiUsers, FiUserCheck, FiList } from 'react-icons/fi';

export const adminNavItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
  { label: 'Leads', path: '/admin/leads', icon: FiList },
  { label: 'Members', path: '/admin/users', icon: FiUsers }
];

export const memberNavItems = [
  { label: 'Dashboard', path: '/member/dashboard', icon: FiGrid },
  { label: 'My Leads', path: '/member/leads', icon: FiUserCheck }
];