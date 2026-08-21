import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { locationService } from '../services/locationService';

export const LocationMapPicker = ({
  initialLat = 20.2961,
  initialLng = 85.8245,
  onLocationSelect,
  locationData = null,
}) => {
  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [isLocating, setIsLocating] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedInfo, setResolvedInfo] = useState(locationData);
  const [source, setSource] = useState('DEFAULT');

  // Trigger resolution whenever coordinates change
  const handleCoordChange = async (lat, lng, locSource = 'PINNED_ON_MAP') => {
    setCoords({ lat, lng });
    setSource(locSource);
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
      // Fallback
      if (onLocationSelect) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          location_source: locSource,
          address: 'Bhubaneswar, Odisha',
          ward_name: 'Ward 12',
          ward_id: 12,
          city: 'Bhubaneswar',
          municipality: 'Bhubaneswar Municipal Corporation (BMC)',
          responsible_department: 'ROADS_AND_POTHOLES',
        });
      }
    } finally {
      setIsResolving(false);
    }
  };

  // On mount, resolve initial location
  useEffect(() => {
    if (!resolvedInfo) {
      handleCoordChange(initialLat, initialLng, 'INITIAL');
    }
  }, []);

  // HTML5 Current GPS Location
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        handleCoordChange(latitude, longitude, 'CURRENT_LOCATION');
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error, using municipal center:', error.message);
        handleCoordChange(20.2961, 85.8245, 'CURRENT_LOCATION_FALLBACK');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Popular Bhubaneswar quick-pick wards for demo testing
  const QUICK_LOCATIONS = [
    { name: 'Janpath / Master Canteen (Ward 12)', lat: 20.2961, lng: 85.8245 },
    { name: 'Saheed Nagar (Ward 30)', lat: 20.2912, lng: 85.8456 },
    { name: 'Patia / Infocity (Ward 5)', lat: 20.3542, lng: 85.8174 },
    { name: 'Khandagiri (Ward 24)', lat: 20.2586, lng: 85.7824 },
    { name: 'Old Town / Lingaraj (Ward 58)', lat: 20.2394, lng: 85.8341 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Action Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-800 text-sm">Grievance Location Selection</span>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          {isLocating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          {isLocating ? 'Acquiring GPS...' : 'Use My Current Location'}
        </button>
      </div>

      {/* Interactive Map Canvas Simulator */}
      <div className="relative w-full h-64 bg-slate-100 border-b border-slate-200 flex items-center justify-center overflow-hidden">
        {/* OpenStreetMap / Satellite background pattern */}
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/10 pointer-events-none" />

        {/* Center Target Pin */}
        <div className="relative z-10 flex flex-col items-center animate-bounce">
          <div className="bg-rose-600 text-white p-2.5 rounded-full shadow-xl border-2 border-white">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="mt-1 px-2.5 py-0.5 bg-slate-900/90 text-white text-[11px] font-bold rounded-md shadow">
            Pinned Location
          </span>
        </div>

        {/* Coordinates readout overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}</span>
        </div>
      </div>

      {/* Quick Select Ward Presets */}
      <div className="p-4 border-b border-slate-100">
        <label className="block text-xs font-medium text-slate-500 mb-2">
          Or quickly pick a key municipal zone:
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              type="button"
              onClick={() => handleCoordChange(loc.lat, loc.lng, 'PINNED_PRESET')}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                coords.lat === loc.lat && coords.lng === loc.lng
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resolved Ward & Department Verification Card */}
      <div className="p-4 bg-slate-50/70">
        {isResolving ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Resolving municipal ward, jurisdiction & responsible department...</span>
          </div>
        ) : resolvedInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                Ward & Jurisdiction
              </span>
              <div className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {resolvedInfo.ward_name || `Ward ${resolvedInfo.ward_id || '12'}`}
              </div>
              <p className="text-slate-500 mt-1 truncate">{resolvedInfo.address || 'Bhubaneswar, Odisha'}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                Assigned Department
              </span>
              <div className="font-bold text-blue-700 text-sm mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                {resolvedInfo.responsible_department?.replace(/_/g, ' ') || 'Roads & Potholes'}
              </div>
              <p className="text-slate-500 mt-1">{resolvedInfo.municipality || 'Bhubaneswar Municipal Corp'}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocationMapPicker;
