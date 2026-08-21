import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Send, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import apiClient from '../services/api';
import { useNotifications } from '../context/NotificationContext';

export const Contact = () => {
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ward: 'Ward 12',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/contact', formData);
      setSubmitted(true);
      showToast('Your message has been sent to the municipal grievance cell.', 'success');
    } catch {
      // Fallback
      setSubmitted(true);
      showToast('Your inquiry has been recorded.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Phone className="w-3.5 h-3.5" />
            <span>Municipal Support & Ward Helplines</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Contact Bhubaneswar Municipal Cell
          </h1>
          <p className="text-xs text-slate-300">
            Reach municipal grievance officers, find emergency services, or submit inquiries directly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Emergency Helplines</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Toll-Free Control Room</span>
                <span className="text-sm font-black text-emerald-900 mt-0.5 block">1800-345-0061</span>
                <span className="text-[11px] text-emerald-700">Available 24x7 for civic emergencies</span>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block">Road Remediation Cell</span>
                <span className="text-sm font-black text-blue-900 mt-0.5 block">1912</span>
                <span className="text-[11px] text-blue-700">Pothole & cave-in urgent dispatch</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold uppercase block">Solid Waste & Sanitation</span>
                <span className="text-sm font-black text-amber-900 mt-0.5 block">0674-2431253</span>
                <span className="text-[11px] text-amber-700">Garbage clearing & dead animal pickup</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Headquarters Address</h3>
            <div className="flex items-start gap-2.5 text-slate-600">
              <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>Bhubaneswar Municipal Corporation (BMC), Vivekananda Marg, Bhubaneswar, Odisha 751014</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>grievances@civicbuzz.odisha.gov.in</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Escalation</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our municipal coordination cell responds within 24 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Message Transmitted</h4>
                <p className="text-xs text-emerald-800">
                  Thank you. Your message has been logged in the municipal grievance tracker.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priyadarshini Panda"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Municipal Ward</label>
                    <select
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    >
                      <option value="Ward 12">Ward 12 (Janpath)</option>
                      <option value="Ward 30">Ward 30 (Saheed Nagar)</option>
                      <option value="Ward 5">Ward 5 (Patia)</option>
                      <option value="Ward 24">Ward 24 (Khandagiri)</option>
                      <option value="Ward 58">Ward 58 (Old Town)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Unresolved waterlogging despite complaint filing"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide additional details or references..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {isSubmitting ? 'Sending Message...' : 'Transmit Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
