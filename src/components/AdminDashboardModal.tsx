import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  UserPlus,
  Users,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  RefreshCw,
  Trash2,
  Edit3,
  Filter,
  Grid,
  List,
  Sparkles,
  ChevronDown,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AdminUser } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MOCK_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Prince Tagadiya',
    email: 'prince@creato4.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: '2025-01-15',
    lastActive: 'Just now',
    projectsCount: 25,
    avatar: '/prince_photo.png',
    phone: '+91 98765 43210'
  },
  {
    id: 'usr-2',
    name: 'Nisarg Patel',
    email: 'nisarg@creato4.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: '2025-02-01',
    lastActive: '5 mins ago',
    projectsCount: 18,
    avatar: '/nisarg_photo.png',
    phone: '+91 98765 43211'
  },
  {
    id: 'usr-3',
    name: 'Khushi Belani',
    email: 'khushi@creato4.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: '2025-02-10',
    lastActive: '12 mins ago',
    projectsCount: 15,
    avatar: '/khushi_photo.png',
    phone: '+91 98765 43212'
  },
  {
    id: 'usr-4',
    name: 'Rudra Chauhan',
    email: 'rudra@creato4.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: '2025-01-20',
    lastActive: 'Just now',
    projectsCount: 30,
    avatar: '/rudra_photo.png',
    phone: '+91 98765 43213'
  },
  {
    id: 'usr-5',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@agri-tech.in',
    role: 'Client',
    status: 'Active',
    joinedDate: '2026-03-12',
    lastActive: '1 hour ago',
    projectsCount: 3,
    phone: '+91 91234 56789'
  },
  {
    id: 'usr-6',
    name: 'Ananya Verma',
    email: 'ananya.v@gtu.ac.in',
    role: 'Student Developer',
    status: 'Active',
    joinedDate: '2026-04-05',
    lastActive: 'Yesterday',
    projectsCount: 4,
    phone: '+91 98111 22334'
  },
  {
    id: 'usr-7',
    name: 'Rohan Mehta',
    email: 'rohan.m@smartcity.org',
    role: 'Client',
    status: 'Away',
    joinedDate: '2026-05-18',
    lastActive: '3 days ago',
    projectsCount: 2,
    phone: '+91 97788 99000'
  },
  {
    id: 'usr-8',
    name: 'Kavya Joshi',
    email: 'kavya.j@techstart.io',
    role: 'Student Developer',
    status: 'Suspended',
    joinedDate: '2026-06-01',
    lastActive: '2 weeks ago',
    projectsCount: 1,
    phone: '+91 96655 44332'
  }
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Modal State for Add User
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUser['role']>('Client');
  const [newUserStatus, setNewUserStatus] = useState<AdminUser['status']>('Active');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Subscribe to Firebase Firestore real-time updates
  useEffect(() => {
    if (!isOpen) return;

    try {
      const usersRef = collection(db, 'users');
      const unsubscribe = onSnapshot(
        usersRef,
        (snapshot) => {
          setFirebaseConnected(true);
          setLoadingFirebase(false);
          if (!snapshot.empty) {
            const fetchedUsers: AdminUser[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                name: data.name || 'Unnamed User',
                email: data.email || '',
                role: data.role || 'Client',
                status: data.status || 'Active',
                joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
                lastActive: data.lastActive || 'Recently',
                projectsCount: data.projectsCount ?? 1,
                avatar: data.avatar || undefined,
                phone: data.phone || ''
              };
            });
            setUsers(fetchedUsers);
          } else {
            // Keep local fallback list if database collection hasn't been populated yet
            setUsers(INITIAL_MOCK_USERS);
          }
        },
        (error) => {
          console.warn('Firestore subscription notice (using robust local fallback):', error);
          setFirebaseConnected(false);
          setLoadingFirebase(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase connection exception fallback:', err);
      setLoadingFirebase(false);
    }
  }, [isOpen]);

  // Handlers for Firestore CRUD
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUserObj: Omit<AdminUser, 'id'> = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+91 99000 00000',
      role: newUserRole,
      status: newUserStatus,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      projectsCount: 1
    };

    try {
      if (firebaseConnected) {
        await addDoc(collection(db, 'users'), {
          ...newUserObj,
          createdAt: serverTimestamp()
        });
      } else {
        // Fallback local update
        const localNew: AdminUser = {
          ...newUserObj,
          id: `usr-${Date.now()}`
        };
        setUsers((prev) => [localNew, ...prev]);
      }
    } catch (err) {
      console.error('Error adding user:', err);
      const localNew: AdminUser = {
        ...newUserObj,
        id: `usr-${Date.now()}`
      };
      setUsers((prev) => [localNew, ...prev]);
    }

    // Reset Form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserRole('Client');
    setNewUserStatus('Active');
    setShowAddModal(false);
  };

  const handleUpdateRole = async (userId: string, newRole: AdminUser['role']) => {
    try {
      if (firebaseConnected && !userId.startsWith('usr-')) {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
      }
    } catch (err) {
      console.error('Error updating role in Firebase:', err);
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (editingUser && editingUser.id === userId) {
      setEditingUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: AdminUser['status']) => {
    const nextStatus: AdminUser['status'] =
      currentStatus === 'Active' ? 'Suspended' : 'Active';

    try {
      if (firebaseConnected && !userId.startsWith('usr-')) {
        await updateDoc(doc(db, 'users', userId), { status: nextStatus });
      }
    } catch (err) {
      console.error('Error updating status in Firebase:', err);
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user profile?')) return;

    try {
      if (firebaseConnected && !userId.startsWith('usr-')) {
        await deleteDoc(doc(db, 'users', userId));
      }
    } catch (err) {
      console.error('Error deleting user in Firebase:', err);
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Filtered Users computation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Badge style utilities
  const getRoleBadge = (role: AdminUser['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Lead Engineer':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Client':
        return 'bg-[#C4A35A]/20 text-[#1A3C2F] border-[#C4A35A]/50';
      case 'Student Developer':
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/15 text-emerald-700 border-emerald-300';
      case 'Away':
        return 'bg-amber-500/15 text-amber-700 border-amber-300';
      case 'Suspended':
        return 'bg-rose-500/15 text-rose-700 border-rose-300';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-scrollbar overscroll-contain"
        data-lenis-prevent
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl w-full max-w-6xl p-5 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          data-lenis-prevent
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E8E2D9]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[#C4A35A]" /> ADMIN PORTAL
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#5C6B60] bg-[#F5F0EA] px-2.5 py-0.5 rounded-full border border-[#E8E2D9]">
                  <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {firebaseConnected ? 'Firebase Realtime Connected' : 'Local / Offline Sync'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A3C2F] tracking-tight">
                User Management Directory
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C] shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#C4A35A]" />
                <span>Add User</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#5C6B60] hover:text-[#1A3C2F] hover:bg-[#F5F0EA] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="p-3.5 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A3C2F] text-[#FAF8F5] flex items-center justify-center font-bold shrink-0">
                <Users className="w-5 h-5 text-[#C4A35A]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5C6B60] block">Total Users</span>
                <span className="text-xl font-extrabold text-[#1A3C2F]">{users.length}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-[#FAF8F5] flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5C6B60] block">Active Status</span>
                <span className="text-xl font-extrabold text-[#1A3C2F]">
                  {users.filter((u) => u.status === 'Active').length}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-800 text-[#FAF8F5] flex items-center justify-center font-bold shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5C6B60] block">Admins & Staff</span>
                <span className="text-xl font-extrabold text-[#1A3C2F]">
                  {users.filter((u) => u.role === 'Admin' || u.role === 'Lead Engineer').length}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F0EA] border border-[#E8E2D9] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C4A35A] text-[#1A3C2F] flex items-center justify-center font-bold shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5C6B60] block">Client Accounts</span>
                <span className="text-xl font-extrabold text-[#1A3C2F]">
                  {users.filter((u) => u.role === 'Client').length}
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6B60]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, role, phone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none focus:border-[#1A3C2F] font-medium placeholder-[#5C6B60]/60"
              />
            </div>

            {/* Role Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Admin', 'Lead Engineer', 'Client', 'Student Developer'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    roleFilter === r
                      ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F]'
                      : 'bg-[#F5F0EA] text-[#5C6B60] border-[#E8E2D9] hover:border-[#1A3C2F] hover:text-[#1A3C2F]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#F5F0EA] p-1 rounded-xl border border-[#E8E2D9]">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#1A3C2F] text-[#FAF8F5]' : 'text-[#5C6B60] hover:text-[#1A3C2F]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#1A3C2F] text-[#FAF8F5]' : 'text-[#5C6B60] hover:text-[#1A3C2F]'
                }`}
                title="Grid Cards View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User List Container */}
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 bg-[#F5F0EA] border border-[#E8E2D9] rounded-2xl p-6">
                <Users className="w-12 h-12 text-[#E8E2D9] mx-auto mb-3" />
                <h4 className="text-base font-bold text-[#1A3C2F]">No Users Match Filter Criteria</h4>
                <p className="text-xs text-[#5C6B60] mt-1">Try clearing your search query or selecting another role filter.</p>
              </div>
            ) : viewMode === 'table' ? (
              /* TABLE VIEW */
              <div className="overflow-x-auto rounded-2xl border border-[#E8E2D9] bg-[#FAF8F5]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F5F0EA] border-b border-[#E8E2D9] text-[#1A3C2F] uppercase text-[10px] font-extrabold tracking-wider">
                      <th className="p-3.5 pl-4">User Details</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Contact Phone</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D9]">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#F5F0EA]/60 transition-colors">
                        <td className="p-3.5 pl-4">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-[#E8E2D9]"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#1A3C2F] text-[#FAF8F5] font-bold text-xs flex items-center justify-center">
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-[#1A3C2F] block">{user.name}</span>
                              <span className="text-[11px] text-[#5C6B60] flex items-center gap-1">
                                <Mail className="w-3 h-3 text-[#C4A35A]" /> {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1 transition-transform active:scale-95 cursor-pointer ${getStatusBadge(
                              user.status
                            )}`}
                            title="Click to toggle Active / Suspended status"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {user.status}
                          </button>
                        </td>

                        <td className="p-3.5 font-medium text-[#5C6B60]">
                          {user.phone || 'N/A'}
                        </td>

                        <td className="p-3.5 text-[#5C6B60]">
                          <span className="block font-medium">{user.joinedDate}</span>
                          <span className="text-[10px] text-[#5C6B60]/70">Active {user.lastActive}</span>
                        </td>

                        <td className="p-3.5 text-right pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1.5 rounded-lg text-[#1A3C2F] hover:bg-[#F5F0EA] border border-transparent hover:border-[#E8E2D9] transition-all cursor-pointer"
                              title="Edit User Role"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                              title="Delete User Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* GRID CARDS VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-[#F5F0EA] p-5 rounded-2xl border border-[#E8E2D9] flex flex-col justify-between hover:shadow-md transition-shadow relative"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover border border-[#E8E2D9]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#1A3C2F] text-[#FAF8F5] font-extrabold text-sm flex items-center justify-center">
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-extrabold text-[#1A3C2F] text-sm">{user.name}</h4>
                            <span className="text-xs text-[#5C6B60] block truncate max-w-[170px]">{user.email}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border cursor-pointer ${getStatusBadge(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs border-t border-[#E8E2D9] pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[#5C6B60]">Role:</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5C6B60]">Phone:</span>
                          <span className="font-semibold text-[#1A3C2F]">{user.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5C6B60]">Joined:</span>
                          <span className="font-semibold text-[#1A3C2F]">{user.joinedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E8E2D9] mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-[#5C6B60]">Active {user.lastActive}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-xs font-bold text-[#1A3C2F] border border-[#E8E2D9] hover:bg-[#1A3C2F] hover:text-[#FAF8F5] transition-colors cursor-pointer"
                        >
                          Edit Role
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer status notice */}
          <div className="pt-4 mt-3 border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C6B60]">
            <span>Displaying {filteredUsers.length} of {users.length} users</span>
            <span className="font-medium text-[#1A3C2F]">Creato4 Enterprise Security & User Permissions</span>
          </div>
        </motion.div>

        {/* ── ADD USER SUB-MODAL ── */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4 mb-4">
                  <h3 className="text-lg font-extrabold text-[#1A3C2F] flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#C4A35A]" /> Add New User
                  </h3>
                  <button onClick={() => setShowAddModal(false)} className="text-[#5C6B60] hover:text-[#1A3C2F]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A3C2F] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Vikramaditya Singh"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1A3C2F] block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. vikram@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1A3C2F] block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="e.g. +91 98980 12345"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] focus:outline-none font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#1A3C2F] block mb-1">Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as AdminUser['role'])}
                        className="w-full px-3 py-2 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] font-bold focus:outline-none"
                      >
                        <option value="Client">Client</option>
                        <option value="Student Developer">Student Developer</option>
                        <option value="Lead Engineer">Lead Engineer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1A3C2F] block mb-1">Status</label>
                      <select
                        value={newUserStatus}
                        onChange={(e) => setNewUserStatus(e.target.value as AdminUser['status'])}
                        className="w-full px-3 py-2 rounded-xl bg-[#F5F0EA] border border-[#E8E2D9] text-xs text-[#1A3C2F] font-bold focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Away">Away</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-full text-xs font-bold text-[#5C6B60] hover:bg-[#F5F0EA]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#234B3C]"
                    >
                      Save User
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── EDIT USER ROLE SUB-MODAL ── */}
        <AnimatePresence>
          {editingUser && (
            <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4 mb-4">
                  <h3 className="text-base font-extrabold text-[#1A3C2F]">Update Role</h3>
                  <button onClick={() => setEditingUser(null)} className="text-[#5C6B60] hover:text-[#1A3C2F]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-bold text-[#1A3C2F] block">{editingUser.name}</span>
                  <span className="text-[11px] text-[#5C6B60]">{editingUser.email}</span>
                </div>

                <div className="space-y-2 mb-6">
                  {(['Admin', 'Lead Engineer', 'Client', 'Student Developer'] as AdminUser['role'][]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        handleUpdateRole(editingUser.id, r);
                        setEditingUser(null);
                      }}
                      className={`w-full p-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-colors ${
                        editingUser.role === r
                          ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F]'
                          : 'bg-[#F5F0EA] text-[#1A3C2F] border-[#E8E2D9] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span>{r}</span>
                      {editingUser.role === r && <CheckCircle2 className="w-4 h-4 text-[#C4A35A]" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setEditingUser(null)}
                  className="w-full py-2.5 rounded-full border border-[#E8E2D9] text-xs font-bold text-[#5C6B60] hover:bg-[#F5F0EA]"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
