import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const { login, switchDemoRole } = useAuth();

  const [authMode, setAuthMode] = useState('PASSWORD'); // 'PASSWORD' or 'OTP'
  const [selectedRole, setSelectedRole] = useState('citizen'); // 'citizen', 'officer', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Aadhaar Modal
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarTxId, setAadhaarTxId] = useState(null);
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarStep, setAadhaarStep] = useState(1);
  const [aadhaarLoading, setAadhaarLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      if (selectedRole === 'admin') {
        navigate('/admin');
      } else if (selectedRole === 'officer') {
        navigate('/department');
      } else {
        navigate('/track');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneOrEmail) {
      setError('Please enter your registered mobile number or email.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.sendOTP(phoneOrEmail, 'LOGIN');
      setOtpSent(true);
      setDemoOtpHint(res.data?.otp_code || '123456');
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authService.verifyOTP(phoneOrEmail, otpCode);
      // Auto-authenticate default demo citizen upon OTP validation
      await switchDemoRole('CITIZEN');
      navigate('/track');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock Aadhaar Verification Flow
  const handleInitiateAadhaar = async () => {
    if (aadhaarNumber.length < 12) {
      setError('Please enter a 12-digit Aadhaar number.');
      return;
    }
    setAadhaarLoading(true);
    setError(null);
    try {
      const res = await authService.initiateAadhaar(aadhaarNumber);
      setAadhaarTxId(res.data?.transaction_id || 'demo_tx');
      setAadhaarStep(2);
    } catch (err) {
      setError(err.message || 'Aadhaar verification service error.');
    } finally {
      setAadhaarLoading(false);
    }
  };

  const handleVerifyAadhaarOtp = async () => {
    setAadhaarLoading(true);
    setError(null);
    try {
      await authService.verifyAadhaar(aadhaarTxId, aadhaarOtp);
      setShowAadhaarModal(false);
      await switchDemoRole('CITIZEN');
      navigate('/track');
    } catch (err) {
      setError(err.message || 'Invalid Aadhaar OTP code.');
    } finally {
      setAadhaarLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white text-center">
          <img
            src="/logo.png"
            alt="CivicBuzz Logo"
            className="w-14 h-14 object-contain mx-auto mb-2 drop-shadow-md"
          />
          <h2 className="text-xl font-extrabold tracking-tight">CivicBuzz Unified Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your citizen or municipal account</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 p-3 gap-1.5 bg-slate-100/70 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedRole('citizen')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'citizen'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('officer')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'officer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            Officer
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Fast Demo 1-Click Login Card */}
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Fast Demo 1-Click Login (Hackathon Evaluation)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={async () => {
                await switchDemoRole('CITIZEN');
                navigate('/track');
              }}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100/80 border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-800 transition-all shadow-2xs"
            >
              Citizen Demo
            </button>
            <button
              type="button"
              onClick={async () => {
                await switchDemoRole('OFFICER');
                navigate('/department');
              }}
              className="py-1.5 px-2 bg-white hover:bg-blue-100/80 border border-blue-300 rounded-lg text-[11px] font-bold text-blue-800 transition-all shadow-2xs"
            >
              Officer Demo
            </button>
            <button
              type="button"
              onClick={async () => {
                await switchDemoRole('ADMIN');
                navigate('/admin');
              }}
              className="py-1.5 px-2 bg-white hover:bg-purple-100/80 border border-purple-300 rounded-lg text-[11px] font-bold text-purple-800 transition-all shadow-2xs"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Main Login Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Toggle: Password vs OTP */}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setAuthMode('PASSWORD')}
              className={`pb-1 border-b-2 transition-all ${
                authMode === 'PASSWORD'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('OTP')}
              className={`pb-1 border-b-2 transition-all ${
                authMode === 'OTP'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              OTP Mobile Login
            </button>
          </div>

          {authMode === 'PASSWORD' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'admin'
                        ? 'admin@civicbuzz.in'
                        : selectedRole === 'officer'
                        ? 'officer@civicbuzz.in'
                        : 'citizen@civicbuzz.in'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {isLoading ? 'Authenticating...' : 'Sign In with Credentials'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={phoneOrEmail}
                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                        placeholder="e.g. +91 9876543210 or user@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    Send 6-Digit OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <span>OTP sent to <strong>{phoneOrEmail}</strong>.</span>
                    {demoOtpHint && (
                      <span className="block mt-1 font-mono text-[11px]">
                        Demo OTP Code: <strong>{demoOtpHint}</strong>
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center text-lg tracking-widest font-mono py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    Verify OTP & Log In
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Aadhaar Verification Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAadhaarModal(true)}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify with Aadhaar (Mock Provider)</span>
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* Aadhaar Verification Modal */}
      {showAadhaarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Aadhaar Identity Verification</span>
              </div>
              <button
                onClick={() => setShowAadhaarModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              CivicBuzz uses privacy-safe Aadhaar verification. Your raw Aadhaar is never stored or
              shared publicly.
            </p>

            {aadhaarStep === 1 ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    12-Digit Aadhaar Number
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="5555 6666 7777"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono text-center tracking-wider focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleInitiateAadhaar}
                  disabled={aadhaarLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  {aadhaarLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Request Aadhaar OTP
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg">
                  Mock OTP sent. For demo, use <strong>123456</strong>.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter 6-Digit Aadhaar OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono text-center tracking-widest text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyAadhaarOtp}
                  disabled={aadhaarLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  {aadhaarLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Verify & Bind Identity
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
