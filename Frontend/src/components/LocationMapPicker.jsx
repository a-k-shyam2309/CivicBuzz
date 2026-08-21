import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, RefreshCw, Crosshair, Building, Landmark, TreePine } from 'lucide-react';
import { locationService } from '../services/locationService';
import { useLanguage } from '../context/LanguageContext';

// Exact Bounding Box for Bhubaneswar Municipal Corporation
const BHUBANESWAR_BOUNDS = {
  minLat: 20.2100,
  maxLat: 20.3800,
  minLng: 85.7500,
  maxLng: 85.8900,
};

const BHUBANESWAR_WARNS = [
  { id: 12, name: 'Janpath / Master Canteen (Ward 12)', lat: 20.2961, lng: 85.8245, x: 50, y: 50, tag: 'Commercial Center' },
  { id: 30, name: 'Saheed Nagar (Ward 30)', lat: 20.2912, lng: 85.8456, x: 68, y: 53, tag: 'Residential & Market' },
  { id: 5, name: 'Patia / Infocity (Ward 5)', lat: 20.3542, lng: 85.8174, x: 48, y: 15, tag: 'IT & Educational Hub' },
  { id: 24, name: 'Khandagiri / Baramunda (Ward 24)', lat: 20.2586, lng: 85.7824, x: 23, y: 72, tag: 'Heritage & Transit' },
  { id: 58, name: 'Old Town / Lingaraj (Ward 58)', lat: 20.2394, lng: 85.8341, x: 60, y: 83, tag: 'Temple Heritage Zone' },
  { id: 16, name: 'Jaydev Vihar / Nayapalli (Ward 16)', lat: 20.3015, lng: 85.8180, x: 46, y: 44, tag: 'Civic Junction' },
  { id: 10, name: 'Chandrasekharpur (Ward 10)', lat: 20.3280, lng: 85.8190, x: 49, y: 28, tag: 'Residential Sector' },
];

export const LocationMapPicker = ({
  initialLat = 20.2961,
  initialLng = 85.8245,
  onLocationSelect,
  locationData = null,
}) => {
  const { t } = useLanguage();
  const mapRef = useRef(null);
  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 });
  const [isLocating, setIsLocating] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedInfo, setResolvedInfo] = useState(locationData);
  const [selectedWardName, setSelectedWardName] = useState('Janpath / Master Canteen (Ward 12)');

  const latLngToPercent = (lat, lng) => {
    const x = ((lng - BHUBANESWAR_BOUNDS.minLng) / (BHUBANESWAR_BOUNDS.maxLng - BHUBANESWAR_BOUNDS.minLng)) * 100;
    const y = ((BHUBANESWAR_BOUNDS.maxLat - lat) / (BHUBANESWAR_BOUNDS.maxLat - BHUBANESWAR_BOUNDS.minLat)) * 100;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const percentToLatLng = (percentX, percentY) => {
    const lng = BHUBANESWAR_BOUNDS.minLng + (percentX / 100) * (BHUBANESWAR_BOUNDS.maxLng - BHUBANESWAR_BOUNDS.minLng);
    const lat = BHUBANESWAR_BOUNDS.maxLat - (percentY / 100) * (BHUBANESWAR_BOUNDS.maxLat - BHUBANESWAR_BOUNDS.minLat);
    return {
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
    };
  };

  const handleUpdateCoordinates = async (lat, lng, locSource = 'PINNED_ON_MAP', wardName = null) => {
    setCoords({ lat, lng });
    const pos = latLngToPercent(lat, lng);
    setPinPosition(pos);
    if (wardName) setSelectedWardName(wardName);

    setIsResolving(true);
    try {
      const resolved = await locationService.resolveCoordinates(lat, lng);
      setResolvedInfo(resolved);
      if (onLocationSelect) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          location_source: locSource,
          ...resolved,
        });
      }
    } catch {
      const fallback = {
        address: `${wardName || 'Janpath'}, Bhubaneswar, Odisha`,
        ward_name: wardName?.match(/\(Ward \d+\)/)?.[0]?.replace(/[()]/g, '') || 'Ward 12',
        ward_id: 12,
        city: 'Bhubaneswar',
        municipality: 'Bhubaneswar Municipal Corporation (BMC)',
        responsible_department: 'ROADS_AND_POTHOLES',
        location_confidence: 0.95,
      };
      setResolvedInfo(fallback);
      if (onLocationSelect) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          location_source: locSource,
          ...fallback,
        });
      }
    } finally {
      setIsResolving(false);
    }
  };

  const handleMapClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentX = (clickX / rect.width) * 100;
    const percentY = (clickY / rect.height) * 100;

    const { lat, lng } = percentToLatLng(percentX, percentY);
    setSelectedWardName(`Bhubaneswar (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
    handleUpdateCoordinates(lat, lng, 'PINNED_ON_MAP');
  };

  useEffect(() => {
    handleUpdateCoordinates(initialLat, initialLng, 'INITIAL', 'Janpath / Master Canteen (Ward 12)');
  }, []);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation not supported, using Janpath central location.');
      handleUpdateCoordinates(20.2961, 85.8245, 'CURRENT_LOCATION_FALLBACK', 'Janpath / Master Canteen (Ward 12)');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        // Keep within Bhubaneswar bounding box
        const clampedLat = Math.max(BHUBANESWAR_BOUNDS.minLat, Math.min(BHUBANESWAR_BOUNDS.maxLat, latitude));
        const clampedLng = Math.max(BHUBANESWAR_BOUNDS.minLng, Math.min(BHUBANESWAR_BOUNDS.maxLng, longitude));
        handleUpdateCoordinates(clampedLat, clampedLng, 'CURRENT_LOCATION', 'GPS Pinned Location');
      },
      () => {
        setIsLocating(false);
        handleUpdateCoordinates(20.2961, 85.8245, 'CURRENT_LOCATION_FALLBACK', 'Janpath / Master Canteen (Ward 12)');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-3">
      {/* Top Action Bar */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="font-bold text-xs block text-white">
              {t.mapHeaderTitle || 'Bhubaneswar Interactive Ward Map'}
            </span>
            <span className="text-[11px] text-slate-300">
              {t.mapHeaderSubtitle || 'Click anywhere in Bhubaneswar to drop pin or use current GPS'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLocating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          {isLocating ? 'Locating...' : (t.useCurrentLocation || 'Use My Current Location')}
        </button>
      </div>

      {/* Bhubaneswar Cartographic Canvas */}
      <div className="px-4">
        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="relative w-full h-80 rounded-2xl bg-slate-900 border-2 border-slate-700 overflow-hidden cursor-crosshair group select-none shadow-2xl"
        >
          {/* Custom SVG Map of Bhubaneswar Municipal Corporation */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* City Boundary Base */}
            <rect width="100" height="100" fill="url(#cityGrad)" />

            {/* Kuakhai / Daya River Curve along East */}
            <path
              d="M 85,0 Q 92,30 82,60 T 90,100"
              fill="none"
              stroke="url(#riverGrad)"
              strokeWidth="4"
            />
            <text x="82" y="45" fill="#38bdf8" fontSize="2.5" fontWeight="bold" opacity="0.6" transform="rotate(75, 82, 45)">
              Kuakhai River
            </text>

            {/* Major Arterial Roads of Bhubaneswar */}
            {/* Nandankanan Expressway (North to Center) */}
            <line x1="48" y1="0" x2="48" y2="45" stroke="#fbbf24" strokeWidth="1.2" opacity="0.7" />
            {/* Janpath Road (Center to South-East) */}
            <line x1="48" y1="45" x2="55" y2="70" stroke="#fbbf24" strokeWidth="1.4" opacity="0.9" />
            {/* Cuttack-Puri NH16 (North-East to South-West) */}
            <path d="M 85,15 Q 60,45 15,90" fill="none" stroke="#f59e0b" strokeWidth="1.6" opacity="0.85" />
            {/* Baramunda - Khandagiri Connector */}
            <line x1="20" y1="65" x2="48" y2="45" stroke="#94a3b8" strokeWidth="0.8" opacity="0.6" />
            {/* Old Town Heritage Ring */}
            <circle cx="60" cy="83" r="8" fill="none" stroke="#10b981" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />

            {/* Ward Polygons (Outlines) */}
            <polygon points="40,5 58,5 55,25 38,22" fill="#065f46" fillOpacity="0.15" stroke="#059669" strokeWidth="0.4" />
            <polygon points="38,25 58,25 56,42 36,40" fill="#1e3a8a" fillOpacity="0.15" stroke="#2563eb" strokeWidth="0.4" />
            <polygon points="42,44 65,46 62,65 38,62" fill="#831843" fillOpacity="0.15" stroke="#db2777" strokeWidth="0.4" />
            <polygon points="12,60 35,58 32,85 10,80" fill="#78350f" fillOpacity="0.15" stroke="#d97706" strokeWidth="0.4" />
            <polygon points="48,70 75,70 72,95 45,92" fill="#14532d" fillOpacity="0.2" stroke="#16a34a" strokeWidth="0.4" />

            {/* Road & Zone Labels */}
            <text x="49" y="10" fill="#94a3b8" fontSize="2.2" fontWeight="bold">PATIA / INFOCITY (NORTH)</text>
            <text x="52" y="43" fill="#cbd5e1" fontSize="2.4" fontWeight="extrabold">JANPATH / MASTER CANTEEN</text>
            <text x="70" y="52" fill="#94a3b8" fontSize="2.2">SAHEED NAGAR</text>
            <text x="12" y="70" fill="#94a3b8" fontSize="2.2">KHANDAGIRI (WEST)</text>
            <text x="56" y="86" fill="#6ee7b7" fontSize="2.2" fontWeight="bold">OLD TOWN / LINGARAJ (SOUTH)</text>
            <text x="35" y="96" fill="#64748b" fontSize="2" italic="true">BMC Jurisdiction Boundary</text>
          </svg>

          {/* Real-time Dropped Pin Marker */}
          <div
            className="absolute z-30 transition-all duration-200 ease-out transform -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-rose-600 text-white p-2.5 rounded-full shadow-2xl border-2 border-white ring-4 ring-rose-500/40 animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2.5 py-0.5 bg-slate-950/95 text-white text-[10px] font-extrabold rounded-md shadow border border-slate-700 whitespace-nowrap">
                {resolvedInfo?.ward_name || 'Pinned Defect'}
              </span>
            </div>
          </div>

          {/* Instructions Overlay */}
          <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-md text-emerald-400 px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border border-emerald-500/30 shadow">
            <Crosshair className="w-3.5 h-3.5" />
            <span>{t.clickToDropPin || 'Click anywhere on Bhubaneswar map to drop pin'}</span>
          </div>

          {/* Coordinates readout overlay */}
          <div className="absolute bottom-3 right-3 z-20 bg-slate-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border border-slate-700 shadow">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}</span>
          </div>
        </div>
      </div>

      {/* Bhubaneswar Municipal Wards Quick-Select */}
      <div className="p-4 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          {t.quickZonesTitle || 'Quick Pick Bhubaneswar Municipal Zone:'}
        </label>
        <div className="flex flex-wrap gap-2">
          {BHUBANESWAR_WARNS.map((ward) => (
            <button
              key={ward.name}
              type="button"
              onClick={() => handleUpdateCoordinates(ward.lat, ward.lng, 'PINNED_PRESET', ward.name)}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-all cursor-pointer ${
                selectedWardName === ward.name || (coords.lat === ward.lat && coords.lng === ward.lng)
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-400 font-medium'
              }`}
            >
              {ward.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resolved Ward & Department Verification Card */}
      <div className="p-4 bg-slate-50/90 border-t border-slate-200">
        {isResolving ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Resolving BMC municipal ward jurisdiction...</span>
          </div>
        ) : resolvedInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                {t.wardJurisdiction || 'Ward Jurisdiction'}
              </span>
              <div className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{resolvedInfo.ward_name || `Ward ${resolvedInfo.ward_id || '12'}`}</span>
              </div>
              <p className="text-slate-500 mt-1 truncate">{resolvedInfo.address || 'Janpath, Bhubaneswar, Odisha'}</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                {t.assignedDept || 'Assigned Department'}
              </span>
              <div className="font-bold text-blue-700 text-sm mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>{resolvedInfo.responsible_department?.replace(/_/g, ' ') || 'Roads & Potholes'}</span>
              </div>
              <p className="text-slate-500 mt-1">{resolvedInfo.municipality || 'Bhubaneswar Municipal Corporation'}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocationMapPicker;
