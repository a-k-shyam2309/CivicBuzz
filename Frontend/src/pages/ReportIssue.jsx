import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Bot,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { LocationMapPicker } from '../components/LocationMapPicker';
import { ImageUploader } from '../components/ImageUploader';
import { VoiceRecorder } from '../components/VoiceRecorder';

export const ReportIssue = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [description, setDescription] = useState('');
  const [categoryHint, setCategoryHint] = useState('ROAD');
  const [subCategoryHint, setSubCategoryHint] = useState('POTHOLE');
  const [language, setLanguage] = useState('en');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Evidence state
  const [imageUrl, setImageUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // Location state
  const [locationPayload, setLocationPayload] = useState({
    latitude: 20.2961,
    longitude: 85.8245,
    location_source: 'CURRENT_LOCATION',
    address: 'Bhubaneswar, Odisha',
    ward_name: 'Ward 12',
    ward_id: 12,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdResult, setCreatedResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || description.trim().length < 10) {
      setError('Please provide a detailed description of the civic problem (at least 10 characters).');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        description: description.trim(),
        latitude: locationPayload.latitude,
        longitude: locationPayload.longitude,
        location_source: locationPayload.location_source || 'CURRENT_LOCATION',
        category: categoryHint,
        sub_category: subCategoryHint,
        language,
        is_anonymous: isAnonymous,
        image_url: imageUrl,
        audio_url: audioUrl,
      };

      const result = await complaintService.createComplaint(payload);
      setCreatedResult(result);
    } catch (err) {
      setError(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CATEGORY_MAP = {
    ROAD: {
      label: 'Roads & Potholes',
      subcategories: ['POTHOLE', 'CRACKED_PAVEMENT', 'OPEN_MANHOLE', 'CAVE_IN'],
    },
    SANITATION: {
      label: 'Sanitation & Solid Waste',
      subcategories: ['OVERFLOWING_BIN', 'GARBAGE_DUMP', 'DEAD_ANIMAL', 'OPEN_DEFECATION'],
    },
    LIGHTING: {
      label: 'Streetlighting & Electrical',
      subcategories: ['STREETLIGHT_OUT', 'BROKEN_POLE', 'SPARKING_TRANSFORMER', 'DANGLING_WIRE'],
    },
    DRAINAGE: {
      label: 'Drainage & Water Supply',
      subcategories: ['BLOCKED_DRAIN', 'WATERLOGGING', 'PIPE_BURST', 'DIRTY_WATER'],
    },
    PARKS: {
      label: 'Parks & Public Greenery',
      subcategories: ['FALLEN_TREE', 'BROKEN_BENCH', 'UNMAINTAINED_GARDEN', 'PLAYGROUND_DEFECT'],
    },
    ENCROACHMENT: {
      label: 'Encroachment & Parking',
      subcategories: ['ILLEGAL_VENDOR', 'SIDEWALK_BLOCK', 'ABANDONED_VEHICLE', 'NOISE_NUISANCE'],
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Evidence-Grounded Reporting</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Civic Grievance
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Submit your complaint with photos and exact GPS coordinates. Gemini AI will categorize,
          estimate severity, and route it directly to the responsible department.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Reporting Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Grievance Details & Category */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" /> 1. Issue Description
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Category
              </label>
              <select
                value={categoryHint}
                onChange={(e) => {
                  setCategoryHint(e.target.value);
                  setSubCategoryHint(CATEGORY_MAP[e.target.value]?.subcategories[0] || 'GENERAL');
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subcategory
              </label>
              <select
                value={subCategoryHint}
                onChange={(e) => setSubCategoryHint(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                {CATEGORY_MAP[categoryHint]?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the exact civic defect (e.g. Large 2-foot wide pothole on Janpath road right in front of Ram Mandir square causing traffic slowdown and risk of two-wheeler accidents)..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="anonymous-check"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label htmlFor="anonymous-check" className="text-xs text-slate-600 font-medium cursor-pointer">
              File as Anonymous (Hides your name and contact details from the public feed)
            </label>
          </div>
        </div>

        {/* Section 2: Photo & Voice Evidence */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" /> 2. Upload Evidence
            </span>
          </div>

          <ImageUploader onImageUploaded={(url) => setImageUrl(url)} currentImageUrl={imageUrl} />

          <VoiceRecorder onVoiceRecorded={(url) => setAudioUrl(url)} />
        </div>

        {/* Section 3: Geographic Location & Map Selection */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> 3. Pinpoint Location & Ward
            </span>
          </div>

          <LocationMapPicker
            initialLat={20.2961}
            initialLng={85.8245}
            onLocationSelect={(locData) => setLocationPayload(locData)}
          />
        </div>

        {/* Submission Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isSubmitting ? 'AI Triaging & Submitting Grievance...' : 'Submit Grievance to Municipal Portal'}
        </button>
      </form>

      {/* Success AI Triage Summary Modal */}
      {createdResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black">Grievance Registered Successfully</h3>
              <p className="text-xs text-white/80 mt-1">
                Complaint ID: <strong className="font-mono text-white text-sm">#{createdResult.complaint_id}</strong>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block text-sm flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-600" /> AI Grievance Triage Summary
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-semibold text-slate-800">{createdResult.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Severity</span>
                    <span className="font-semibold text-rose-600">{createdResult.severity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Routed Department</span>
                    <span className="font-semibold text-blue-700">{createdResult.department_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ward Jurisdiction</span>
                    <span className="font-semibold text-slate-800">{createdResult.location?.ward_name}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Citizen Ground Verification Active:</strong> When the department completes repairs,
                  you will be notified to physically inspect and confirm resolution.
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/track?id=${createdResult.complaint_id}`)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Track Complaint Progress</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
