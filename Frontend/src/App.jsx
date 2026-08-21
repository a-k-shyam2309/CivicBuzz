import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatbotModal } from './components/ChatbotModal';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ReportIssue } from './pages/ReportIssue';
import { TrackComplaint } from './pages/TrackComplaint';
import { PublicIssues } from './pages/PublicIssues';
import { ProjectsBudget } from './pages/ProjectsBudget';
import { Tenders } from './pages/Tenders';
import { AdminDashboard } from './pages/AdminDashboard';
import { DepartmentDashboard } from './pages/DepartmentDashboard';
import { Contact } from './pages/Contact';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/report-issue" element={<ReportIssue />} />
                <Route path="/track" element={<TrackComplaint />} />
                <Route path="/public-issues" element={<PublicIssues />} />
                <Route path="/budgeting" element={<ProjectsBudget />} />
                <Route path="/tenders" element={<Tenders />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department"
                  element={
                    <ProtectedRoute requiredRole={['OFFICER', 'DEPARTMENT_HEAD', 'ADMIN', 'SUPER_ADMIN']}>
                      <DepartmentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <ChatbotModal />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </LanguageProvider>
  );
}

export default App;
