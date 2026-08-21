import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Building2,
  KeyRound,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const Register = () => {
  const navigate = useNavigate();
  const { register, switchDemoRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState('CITIZEN'); // CITIZEN, OFFICER, ADMIN
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    department_code: 'ROADS_AND_POTHOLES',
  });

  // Aadhaar Verification State
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarTxId, setAadhaarTxId] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarStep, setAadhaarStep] = useState(1); // 1: Input, 2: OTP Sent, 3: Verified
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [maskedAadhaar, setMaskedAadhaar] = useState('');
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [aadhaarError, setAadhaarError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format Aadhaar with spaces: "1234 5678 9012"
  const handleAadhaarInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarNumber(raw);
    setAadhaarError(null);
  };

  // Step 1: Initiate Aadhaar OTP
  const handleSendAadhaarOtp = async () => {
    if (aadhaarNumber.length < 12) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setAadhaarLoading(true);
    setAadhaarError(null);
    try {
      const res = await authService.initiateAadhaar(aadhaarNumber);
      setAadhaarTxId(res.data?.transaction_id || 'demo_tx_123');
      setAadhaarStep(2);
    } catch (err) {
      // Fallback for hackathon demo mode
      setAadhaarTxId('demo_tx_123');
      setAadhaarStep(2);
    } finally {
      setAadhaarLoading(false);
    }
  };

  // Step 2: Verify Aadhaar OTP (Mock OTP is 123456)
  const handleVerifyAadhaarOtp = async () => {
    if (!aadhaarOtp || aadhaarOtp.trim().length < 4) {
      setAadhaarError('Please enter the 6-digit Aadhaar OTP (use demo OTP: 123456).');
      return;
    }
    setAadhaarLoading(true);
    setAadhaarError(null);
    try {
      const res = await authService.verifyAadhaar(aadhaarNumber, aadhaarOtp.trim(), aadhaarTxId);
      const masked = res.data?.aadhaar_masked || `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
      setMaskedAadhaar(masked);
      setIsAadhaarVerified(true);
      setAadhaarStep(3);
    } catch (err) {
      // If 123456 was entered, accept as mock verified
      if (aadhaarOtp.trim() === '123456' || aadhaarOtp.trim() === '000000') {
        const masked = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
        setMaskedAadhaar(masked);
        setIsAadhaarVerified(true);
        setAadhaarStep(3);
      } else {
        setAadhaarError(err.message || 'Invalid Aadhaar OTP code. (Demo OTP: 123456)');
      }
    } finally {
      setAadhaarLoading(false);
    }
  };

  // Final Registration Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const payload = {
      ...formData,
      role: selectedRole,
      is_aadhaar_verified: isAadhaarVerified,
      aadhaar_number: aadhaarNumber || null,
      aadhaar_masked: maskedAadhaar || (aadhaarNumber ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : null),
    };

    try {
      await register(payload);
      if (selectedRole === 'ADMIN') {
        navigate('/admin');
      } else if (selectedRole === 'OFFICER') {
        navigate('/department');
      } else {
        navigate('/track');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white text-center">
          <img
            src="/logo.png"
            alt="CivicBuzz Logo"
            className="w-14 h-14 object-contain mx-auto mb-2 drop-shadow-md"
          />
          <h2 className="text-xl font-extrabold tracking-tight">Create CivicBuzz Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Evidence-Grounded Civic Triage & Citizen Verification Platform
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 p-3 gap-1.5 bg-slate-100/70 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedRole('CITIZEN')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'CITIZEN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Citizen
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('OFFICER')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'OFFICER'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Officer
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('ADMIN')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Municipal Admin
          </button>
        </div>

        {/* Fast Demo 1-Click Switch Bar for Evaluation */}
        <div className="p-3 bg-emerald-50/70 border-b border-emerald-100">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Instant Demo Access (Hackathon Testing)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={async () => {
                await switchDemoRole('CITIZEN');
                navigate('/track');
              }}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-800 transition-all text-center shadow-2xs"
            >
              Citizen Demo
            </button>
            <button
              type="button"
              onClick={async () => {
                await switchDemoRole('OFFICER');
                navigate('/department');
              }}
              className="py-1.5 px-2 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg text-[11px] font-bold text-blue-800 transition-all text-center shadow-2xs"
            >
              Officer Demo
            </button>
            <button
              type="button"
              onClick={async () => {
                await switchDemoRole('ADMIN');
                navigate('/admin');
              }}
              className="py-1.5 px-2 bg-white hover:bg-purple-100 border border-purple-300 rounded-lg text-[11px] font-bold text-purple-800 transition-all text-center shadow-2xs"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {selectedRole === 'OFFICER'
                  ? 'Officer Full Name & Designation'
                  : selectedRole === 'ADMIN'
                  ? 'Administrator Full Name'
                  : 'Full Name (as on Aadhaar)'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Subham Samal"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Department Selection for Officers */}
            {selectedRole === 'OFFICER' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Department</label>
                <select
                  value={formData.department_code}
                  onChange={(e) => setFormData({ ...formData, department_code: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="ROADS_AND_POTHOLES">Roads & Potholes Remediation</option>
                  <option value="SOLID_WASTE_MANAGEMENT">Sanitation & Solid Waste Management</option>
                  <option value="STREETLIGHTING">Public Lighting & Electricals</option>
                  <option value="WATER_AND_DRAINAGE">Stormwater Drainage & Water Supply</option>
                  <option value="HORTICULTURE_AND_PARKS">Parks & Urban Greenery</option>
                </select>
              </div>
            )}

            {/* ========================================================================= */}
            {/* AADHAAR AUTHENTICATION & VERIFICATION SYSTEM */}
            {/* ========================================================================= */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    Aadhaar Identity Verification (Mock UIDAI)
                  </span>
                </div>
                {isAadhaarVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                    Pending OTP
                  </span>
                )}
              </div>

              {aadhaarError && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{aadhaarError}</span>
                </div>
              )}

              {aadhaarStep === 1 && !isAadhaarVerified && (
                <div className="space-y-2">
                  <label className="block text-[11px] text-slate-600">
                    Enter 12-Digit Aadhaar Number for instant authentication:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={12}
                      value={aadhaarNumber}
                      onChange={handleAadhaarInputChange}
                      placeholder="e.g. 1234 5678 9012"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendAadhaarOtp}
                      disabled={aadhaarLoading || aadhaarNumber.length < 12}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-1 text-[11px] transition-all"
                    >
                      {aadhaarLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                      Send OTP
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Demo Mode: Enter any 12-digit number (e.g. 123456789012).
                  </span>
                </div>
              )}

              {aadhaarStep === 2 && !isAadhaarVerified && (
                <div className="space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      OTP sent to registered mobile for <strong>XXXX-XXXX-{aadhaarNumber.slice(-4)}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAadhaarStep(1)}
                      className="text-emerald-700 hover:underline font-bold text-[10px]"
                    >
                      Change Number
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={aadhaarOtp}
                      onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP (123456)"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-xl font-mono text-center font-bold tracking-widest text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyAadhaarOtp}
                      disabled={aadhaarLoading || aadhaarOtp.length < 4}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-1 text-[11px] transition-all"
                    >
                      {aadhaarLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                      Verify OTP
                    </button>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-[10px] text-blue-800">
                    💡 <strong>Hackathon Demo Note:</strong> Use OTP <code>123456</code> to verify instantly.
                  </div>
                </div>
              )}

              {isAadhaarVerified && (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Aadhaar Identity Authenticated: <strong>{maskedAadhaar}</strong>. Account will have 1-Vote
                    participatory budgeting privileges!
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                selectedRole === 'ADMIN'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : selectedRole === 'OFFICER'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {isLoading
                ? 'Creating Account...'
                : selectedRole === 'ADMIN'
                ? 'Register as Municipal Administrator'
                : selectedRole === 'OFFICER'
                ? 'Register as Department Officer'
                : 'Complete Citizen Registration'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Sign in to Unified Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
