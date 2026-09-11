import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  CheckCircle,
  AlertTriangle,
  Building,
  Truck,
  Filter,
  Search,
  Crosshair,
  Sparkles,
  Heart,
  ChevronRight
} from 'lucide-react';
import { DonationCenter, BloodType } from '../types';

interface MapViewProps {
  centers: DonationCenter[];
  userBloodType: BloodType;
  isUserEligible: boolean;
  onSelectCenter: (center: DonationCenter) => void;
  onDispatchToCenter: (center: DonationCenter) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  centers,
  userBloodType,
  isUserEligible,
  onSelectCenter,
  onDispatchToCenter
}) => {
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter>(centers[0]);
  const [filterType, setFilterType] = useState<'ALL' | 'URGENT_FOR_ME' | 'OPEN_NOW' | 'MOBILE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Location based notification logic
  const nearestUrgentCenter = centers.find(
    (c) => c.criticalNeeds.includes(userBloodType) || c.currentStockLevels[userBloodType] === 'CRITICAL'
  );

  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'URGENT_FOR_ME') {
      return (
        center.criticalNeeds.includes(userBloodType) ||
        center.currentStockLevels[userBloodType] === 'CRITICAL' ||
        center.currentStockLevels[userBloodType] === 'LOW'
      );
    }
    if (filterType === 'OPEN_NOW') return center.isOpenNow;
    if (filterType === 'MOBILE') return center.type === 'Mobile Bloodmobile';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Location-Based Notification Alert */}
      {nearestUrgentCenter && isUserEligible && (
        <div
          id="location-based-notification-banner"
          className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-4 rounded-2xl shadow-lg shadow-red-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs shrink-0">
              <Navigation className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white text-red-700 px-2 py-0.5 rounded-md">
                  Proximity Alert
                </span>
                <span className="text-xs text-white/90">
                  {nearestUrgentCenter.distanceMiles} miles away
                </span>
              </div>
              <p className="text-sm font-bold mt-0.5">
                {nearestUrgentCenter.name} has a critical shortage of {userBloodType}!
              </p>
              <p className="text-xs text-white/80">
                You are currently eligible to donate. Walk-ins welcomed immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="proximity-dispatch-btn"
              onClick={() => onDispatchToCenter(nearestUrgentCenter)}
              className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 text-xs font-extrabold rounded-xl shadow-sm transition-all"
            >
              Direct Dispatch
            </button>
            <button
              id="proximity-focus-btn"
              onClick={() => setSelectedCenter(nearestUrgentCenter)}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              View on Map
            </button>
          </div>
        </div>
      )}

      {/* Main Map & Center Directory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Vector Map Canvas (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Map Header Controls */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-slate-900">
                Live Geolocation Radar (Metro Area)
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-200" />
                <span>You</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-red-200" />
                <span>Trauma Center</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                <span>Bloodmobile</span>
              </div>
            </div>
          </div>

          {/* Interactive Graphic SVG Map Canvas */}
          <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-100 overflow-hidden select-none">
            {/* SVG Background Grid, Rivers, Parks */}
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* City Blocks Base */}
              <defs>
                <pattern
                  id="cityGrid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#f8fafc" />
              <rect width="100%" height="100%" fill="url(#cityGrid)" opacity="0.7" />

              {/* Waterway / River graphic */}
              <path
                d="M 15 0 C 20 30, 10 60, 30 100 L 45 100 C 25 60, 35 30, 28 0 Z"
                fill="#e0f2fe"
                stroke="#bae6fd"
                strokeWidth="0.6"
              />

              {/* Central City Park */}
              <rect
                x="48"
                y="18"
                width="22"
                height="18"
                rx="2"
                fill="#dcfce7"
                stroke="#bbf7d0"
                strokeWidth="0.5"
              />
              <text x="59" y="28" fill="#166534" fontSize="2.5" fontWeight="600" textAnchor="middle">
                Central Park
              </text>

              {/* Major Avenues / Roads */}
              <line x1="0" y1="35" x2="100" y2="35" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="0" y1="65" x2="100" y2="65" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="40" y1="0" x2="40" y2="100" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="75" y1="0" x2="75" y2="100" stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Highway arc */}
              <path
                d="M 0 85 Q 50 75 100 80"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2,1"
              />
            </svg>

            {/* User Location Radar Pin (Center of map around 50%, 50%) */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-50" />
                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
                  You
                </div>
              </div>
            </div>

            {/* Donation Center Pins */}
            {centers.map((center) => {
              const isSelected = selectedCenter.id === center.id;
              const hasUrgentNeed = center.criticalNeeds.includes(userBloodType);
              const isMobile = center.type === 'Mobile Bloodmobile';

              return (
                <button
                  key={center.id}
                  id={`map-pin-${center.id}`}
                  onClick={() => setSelectedCenter(center)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-200 group ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                  style={{
                    left: `${center.coordinates.x}%`,
                    top: `${center.coordinates.y}%`
                  }}
                  title={center.name}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pulsing halo if urgent for user */}
                    {hasUrgentNeed && (
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-60" />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transition-all ${
                        isMobile
                          ? 'bg-amber-500 shadow-amber-500/30'
                          : isSelected
                          ? 'bg-red-700 ring-4 ring-red-300 shadow-red-700/40'
                          : 'bg-red-600 shadow-red-600/30'
                      }`}
                    >
                      {isMobile ? (
                        <Truck className="w-4 h-4" />
                      ) : (
                        <Building className="w-4 h-4" />
                      )}
                    </div>

                    {/* Pin Label Tooltip */}
                    <div
                      className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-sm transition-opacity ${
                        isSelected
                          ? 'bg-slate-900 text-white opacity-100'
                          : 'bg-white/90 text-slate-800 opacity-80 group-hover:opacity-100 border border-slate-200'
                      }`}
                    >
                      {center.name.split(' ')[0]} ({center.distanceMiles}m)
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer status */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Radius: 5.0 Miles from your location</span>
            <span className="font-medium text-slate-700">
              Showing {filteredCenters.length} active sites
            </span>
          </div>
        </div>

        {/* Right Details & Search Panel (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="search-centers-input"
                type="text"
                placeholder="Search centers, hospitals, avenues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: 'All Centers' },
                { id: 'URGENT_FOR_ME', label: `Urgent for ${userBloodType}` },
                { id: 'OPEN_NOW', label: 'Open Now' },
                { id: 'MOBILE', label: 'Bloodmobiles' }
              ].map((f) => (
                <button
                  key={f.id}
                  id={`filter-btn-${f.id}`}
                  onClick={() => setFilterType(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    filterType === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Center Highlight Card */}
          {selectedCenter && (
            <div
              id="selected-center-card"
              className="bg-white rounded-2xl border border-red-200 shadow-md p-5 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                    {selectedCenter.type}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1">
                    {selectedCenter.name}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{selectedCenter.address}</span>
                    <span className="font-bold text-slate-800">
                      • {selectedCenter.distanceMiles} miles
                    </span>
                  </p>
                </div>
              </div>

              {/* Hours & Contact */}
              <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCenter.hours}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCenter.phone}</span>
                </div>
              </div>

              {/* Real-time Blood Stock Inventory Status */}
              <div className="mb-4">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Real-time Blood Supply Status:
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(Object.keys(selectedCenter.currentStockLevels) as BloodType[]).map((bt) => {
                    const status = selectedCenter.currentStockLevels[bt];
                    const isUserType = bt === userBloodType;
                    return (
                      <div
                        key={bt}
                        className={`p-1.5 rounded-lg text-center border text-[11px] font-bold ${
                          isUserType
                            ? 'ring-2 ring-red-500 ring-offset-1'
                            : ''
                        } ${
                          status === 'CRITICAL'
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : status === 'LOW'
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        }`}
                      >
                        <div className="text-xs">{bt}</div>
                        <div className="text-[9px] font-semibold opacity-90">{status}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  id="dispatch-walk-in-btn"
                  onClick={() => onDispatchToCenter(selectedCenter)}
                  disabled={!isUserEligible}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                    !isUserEligible
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-95'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>
                    {!isUserEligible ? 'Cooldown Active' : 'Dispatch / Walk-In Now'}
                  </span>
                </button>

                <button
                  id="schedule-slot-btn"
                  onClick={() => {
                    alert(`Appointment request sent to ${selectedCenter.name} for tomorrow 10:00 AM!`);
                  }}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Schedule Slot
                </button>
              </div>
            </div>
          )}

          {/* List of other nearby centers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Nearby Sites ({filteredCenters.length})
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredCenters.map((c) => (
                <div
                  key={c.id}
                  id={`center-item-${c.id}`}
                  onClick={() => setSelectedCenter(c)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedCenter.id === c.id
                      ? 'bg-red-50/60 border-red-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {c.distanceMiles} miles • {c.isOpenNow ? 'Open Now' : 'Closed'}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
