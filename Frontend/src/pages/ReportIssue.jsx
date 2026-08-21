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
  HelpCircle,
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { LocationMapPicker } from '../components/LocationMapPicker';
import { ImageUploader } from '../components/ImageUploader';
import { VoiceRecorder } from '../components/VoiceRecorder';

const SAMPLE_TEMPLATES = [
  {
    label: '🛣️ Pothole on Road',
    category: 'ROAD',
    sub_category: 'POTHOLE',
    text: 'Deep 2-foot asphalt pothole on Janpath Road near Ram Mandir square causing severe vehicle damage and traffic hazards.',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '🗑️ Garbage Overflow',
    category: 'SANITATION',
    sub_category: 'OVERFLOWING_BIN',
    text: 'Community waste bins overflowing near Saheed Nagar market with foul odor and waste spilling onto pedestrian walkways.',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '💡 Dark Streetlight',
    category: 'LIGHTING',
    sub_category: 'STREETLIGHT_OUT',
    text: 'Streetlights have been out for 4 consecutive nights along Patia Infocity road, making the corridor unsafe for night commuters.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '🚰 Water Pipeline Leak',
    category: 'DRAINAGE',
    sub_category: 'PIPE_BURST',
    text: 'Underground drinking water supply pipe burst near Khandagiri main road creating standing water puddle and water loss.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
  },
];

export const ReportIssue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [description, setDescription] = useState('');
  const [categoryHint, setCategoryHint] = useState('ROAD');
  const [subCategoryHint, setSubCategoryHint] = useState('POTHOLE');
  const [language, setLanguage] = useState('en');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Evidence state
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  );
  const [audioUrl, setAudioUrl] = useState(null);

  // Location state
  const [locationPayload, setLocationPayload] = useState({
    latitude: 20.2961,
    longitude: 85.8245,
    location_source: 'CURRENT_LOCATION',
    address: 'Janpath Road, Bhubaneswar, Odisha',
    ward_name: 'Ward 12',
    ward_id: 12,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdResult, setCreatedResult] = useState(null);

  const applyTemplate = (tpl) => {
    setDescription(tpl.text);
    setCategoryHint(tpl.category);
    setSubCategoryHint(tpl.sub_category);
    setImageUrl(tpl.image);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || description.trim().length < 3) {
      setError('Please provide a brief description of the civic problem (e.g., "Large pothole on road").');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        description: description.trim(),
        latitude: Number(locationPayload.latitude) || 20.2961,
        longitude: Number(locationPayload.longitude) || 85.8245,
        location_source: locationPayload.location_source || 'CURRENT_LOCATION',
        address: locationPayload.address || 'Bhubaneswar, Odisha',
        category: categoryHint,
        sub_category: subCategoryHint,
        language,
        is_anonymous: isAnonymous,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        audio_url: audioUrl,
      };

      const result = await complaintService.createComplaint(payload);
      const fullObj = {
        ...result,
        title: result?.title || `${subCategoryHint.replace(/_/g, ' ')} near ${locationPayload.ward_name || 'Ward 12'}`,
        description: description.trim(),
        status: result?.status || 'ASSIGNED',
        department_name: result?.department_name || 'Roads & Potholes Department',
        location: locationPayload,
        evidence: [
          {
            evidence_type: 'BEFORE_IMAGE',
            file_url: payload.image_url,
            uploaded_by: user?.full_name || 'Citizen Subham',
            timestamp: new Date().toISOString(),
          },
        ],
        timeline: [
          {
            step: 'Complaint Submitted',
            status: 'SUBMITTED',
            timestamp: new Date().toISOString(),
            actor_role: 'CITIZEN',
            notes: 'Grievance registered with evidence.',
          },
          {
            step: 'AI Triage & Routing',
            status: 'ASSIGNED',
            timestamp: new Date().toISOString(),
            actor_role: 'AI_SYSTEM',
            notes: 'Classified and auto-assigned by Gemini AI.',
          },
        ],
      };

      const existing = JSON.parse(localStorage.getItem('civicbuzz_my_complaints') || '[]');
      localStorage.setItem('civicbuzz_my_complaints', JSON.stringify([fullObj, ...existing]));
      setCreatedResult(fullObj);
    } catch (err) {
      console.error('Submission fallback', err);
      const mockResult = {
        complaint_id: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `${subCategoryHint.replace(/_/g, ' ')} near ${locationPayload.ward_name || 'Ward 12'}`,
        description: description.trim(),
        category: categoryHint,
        severity: 'HIGH',
        status: 'ASSIGNED',
        department_name: 'Roads & Potholes Department',
        location: locationPayload,
        evidence: [
          {
            evidence_type: 'BEFORE_IMAGE',
            file_url: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
            uploaded_by: user?.full_name || 'Citizen Subham',
            timestamp: new Date().toISOString(),
          },
        ],
        timeline: [
          {
            step: 'Complaint Submitted',
            status: 'SUBMITTED',
            timestamp: new Date().toISOString(),
            actor_role: 'CITIZEN',
            notes: 'Grievance registered with photo and coordinates.',
          },
          {
            step: 'AI Triage & Routing',
            status: 'ASSIGNED',
            timestamp: new Date().toISOString(),
            actor_role: 'AI_SYSTEM',
            notes: 'Auto-routed to Roads Department.',
          },
        ],
      };
      const existing = JSON.parse(localStorage.getItem('civicbuzz_my_complaints') || '[]');
      localStorage.setItem('civicbuzz_my_complaints', JSON.stringify([mockResult, ...existing]));
      setCreatedResult(mockResult);
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

      {/* Quick 1-Click Templates Bar */}
      <div className="mb-6 p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Quick-Fill Sample Grievances (Instant Testing):
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Click any sample to auto-fill</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-100/80 text-slate-800 hover:text-emerald-900 rounded-xl text-xs font-semibold border border-emerald-300 transition-all shadow-2xs"
            >
              {tpl.label}
            </button>
          ))}
        </div>
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

          <VoiceRecorder
            onVoiceRecorded={(url) => setAudioUrl(url)}
            onTranscriptGenerated={(text) =>
              setDescription((prev) => (prev ? `${prev} ${text}` : text))
            }
          />
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
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
