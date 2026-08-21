import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Bell,
  User,
  LogOut,
  Layers,
  FileText,
  Vote,
  Briefcase,
  AlertCircle,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, switchDemoRole, isAdmin, isOfficer } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report Issue', path: '/report-issue' },
    { name: 'Track Grievances', path: '/track' },
    { name: 'Public Feed', path: '/public-issues' },
    { name: 'Projects & Budget', path: '/budgeting' },
    { name: 'Tenders', path: '/tenders' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="CivicBuzz Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                CIVIC<span className="text-emerald-600">BUZZ</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wider uppercase">
                Grievance & Budget Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Role Portals */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/admin')
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                Admin Portal
              </Link>
            )}

            {(isOfficer || isAdmin) && (
              <Link
                to="/department"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/department')
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                Dept Portal
              </Link>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Role: {user?.role || 'CITIZEN'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block">
                    Demo Fast Role Switch
                  </span>
                  <button
                    onClick={async () => {
                      await switchDemoRole('CITIZEN');
                      setDemoMenuOpen(false);
                      navigate('/track');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    👤 Switch to Citizen (Public View)
                  </button>
                  <button
                    onClick={async () => {
                      await switchDemoRole('OFFICER');
                      setDemoMenuOpen(false);
                      navigate('/department');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                  >
                    👷 Switch to Officer (Dept Portal)
                  </button>
                  <button
                    onClick={async () => {
                      await switchDemoRole('ADMIN');
                      setDemoMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition-colors"
                  >
                    🏛️ Switch to Municipal Admin
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 relative transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="font-bold text-sm text-slate-800">Notifications</span>
                      <span className="text-xs text-slate-400">{notifications.length} alerts</span>
                    </div>
                    <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">
                          No new notifications.
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.notification_id}
                            onClick={() => {
                              markAsRead(n.notification_id);
                              if (n.complaint_id) {
                                navigate(`/track?id=${n.complaint_id}`);
                                setNotifOpen(false);
                              }
                            }}
                            className={`p-3 rounded-xl cursor-pointer text-xs transition-all ${
                              n.is_read
                                ? 'bg-slate-50 text-slate-600'
                                : 'bg-emerald-50/80 text-emerald-950 border border-emerald-200 font-medium'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">{n.title}</span>
                              <span className="text-[10px] text-slate-400">
                                {n.created_at ? new Date(n.created_at).toLocaleTimeString() : ''}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1 text-[11px]">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Menu or Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block text-left pr-1">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                    <div className="p-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {user?.full_name}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {user?.email}
                      </span>
                      {user?.is_aadhaar_verified && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Aadhaar Verified
                        </span>
                      )}
                    </div>
                    <Link
                      to="/track"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Grievance Reports
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-purple-800 bg-purple-50"
            >
              Admin Dashboard
            </Link>
          )}
          {isOfficer && (
            <Link
              to="/department"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-blue-800 bg-blue-50"
            >
              Department Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
