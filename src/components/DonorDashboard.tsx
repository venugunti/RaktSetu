import React, { useState } from 'react';
import {
  Heart,
  Droplet,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  Activity,
  Users
} from 'lucide-react';
import { EmergencyAlert, DonorProfile, DonationCenter, BloodType } from '../types';
import { EmergencyAlertBanner } from './EmergencyAlertBanner';
import { BLOOD_COMPATIBILITY } from '../data/mockData';

interface DonorDashboardProps {
  profile: DonorProfile;
  alerts: EmergencyAlert[];
  centers: DonationCenter[];
  onRespondAlert: (alertId: string) => void;
  onViewAlertDetails: (alert: EmergencyAlert) => void;
  onNavigateTab: (tab: 'alerts' | 'map' | 'chat' | 'rewards' | 'profile' | 'analytics') => void;
  onOpenCompatibility: () => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  profile,
  alerts,
  centers,
  onRespondAlert,
  onViewAlertDetails,
  onNavigateTab,
  onOpenCompatibility
}) => {
  const [filterOnlyCompatible, setFilterOnlyCompatible] = useState(true);

  // Filter alerts based on compatibility
  const userCompatibility = BLOOD_COMPATIBILITY[profile.bloodType];
  const compatibleAlerts = alerts.filter(
    (a) =>
      a.bloodTypeNeeded === profile.bloodType ||
      userCompatibility.canGiveTo.includes(a.bloodTypeNeeded)
  );

  const displayedAlerts = filterOnlyCompatible ? compatibleAlerts : alerts;

  const nearestCenter = centers[0];

  return (
    <div className="space-y-8">
      {/* Donor Personal Summary Hero */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-red-600/15 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold flex items-center gap-1.5 border border-white/25">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Verified Donor • {profile.verificationBadgeId}
              </span>
              <span className="text-xs text-white/80 font-medium">
                Last donation: {profile.lastDonationDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome back, {profile.fullName}
            </h1>
            <p className="text-white/90 text-sm max-w-xl leading-relaxed">
              As an <strong>{profile.bloodType} Universal Donor</strong>, your red blood cells can be transfused into any human in emergency trauma. You have saved <strong>{profile.livesSaved} lives</strong> to date.
            </p>
          </div>

          {/* Blood Type & Eligibility Badge */}
          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex flex-col items-center justify-center font-black text-2xl shadow-md">
              <span>{profile.bloodType}</span>
              <span className="text-[9px] font-bold tracking-tight text-slate-600">RH NEG</span>
            </div>

            <div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Status
              </div>
              <div className="text-base font-extrabold flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Eligible to Donate
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Iron: {profile.hemoglobinLevel} g/dL • Weight: {profile.weightKg} kg
              </div>
            </div>
          </div>
        </div>

        {/* Quick Dashboard Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/20">
          <div className="bg-black/15 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 font-semibold">Life Points</div>
            <div className="text-2xl font-black text-amber-300 flex items-center gap-1 mt-0.5">
              <Award className="w-5 h-5 text-amber-300" />
              <span>{profile.rewardPoints}</span>
            </div>
            <div className="text-[10px] text-white/70 mt-1">Gold Sentinel Tier</div>
          </div>

          <div className="bg-black/15 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 font-semibold">Lives Saved</div>
            <div className="text-2xl font-black text-white flex items-center gap-1 mt-0.5">
              <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
              <span>{profile.livesSaved}</span>
            </div>
            <div className="text-[10px] text-white/70 mt-1">Across 6 donations</div>
          </div>

          <div className="bg-black/15 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 font-semibold">Active Alerts</div>
            <div className="text-2xl font-black text-red-200 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
              <span>{alerts.length}</span>
            </div>
            <div className="text-[10px] text-white/70 mt-1">
              {compatibleAlerts.length} matching your type
            </div>
          </div>

          <div className="bg-black/15 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 font-semibold">Nearest Bank</div>
            <div className="text-2xl font-black text-white flex items-center gap-1 mt-0.5">
              <MapPin className="w-5 h-5 text-white" />
              <span>{nearestCenter.distanceMiles} m</span>
            </div>
            <div className="text-[10px] text-white/70 mt-1">Walk-ins welcomed</div>
          </div>
        </div>
      </div>

      {/* Emergency Alerts Feed Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <h2 className="text-xl font-bold text-slate-900">
              Live Regional Emergency Alerts
            </h2>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 font-extrabold text-xs rounded-full">
              {displayedAlerts.length} Broadcasts
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="filter-compatible-alerts-toggle"
              onClick={() => setFilterOnlyCompatible(!filterOnlyCompatible)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterOnlyCompatible
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filterOnlyCompatible ? `Only Compatible (${profile.bloodType})` : 'Show All Types'}
            </button>
            <button
              id="open-matrix-from-feed-btn"
              onClick={onOpenCompatibility}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
            >
              Check Compatibility
            </button>
          </div>
        </div>

        {displayedAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-base">No Critical Shortages at this Moment</h4>
            <p className="text-xs text-slate-500 mt-1">
              Regional reserves are stabilized. Thank you for staying on standby!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAlerts.map((alert) => (
              <EmergencyAlertBanner
                key={alert.id}
                alert={alert}
                userBloodType={profile.bloodType}
                isUserEligible={profile.isEligibleNow}
                onRespond={onRespondAlert}
                onViewDetails={onViewAlertDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Two-Column Hub: Nearby Centers & Rewards Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nearby Center Highlight */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Nearest Donation Center
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {nearestCenter.distanceMiles} miles away
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-lg">
              {nearestCenter.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {nearestCenter.address} • {nearestCenter.hours}
            </p>

            <div className="mt-4 p-3 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between text-xs">
              <div className="font-medium text-red-900">
                Critical Need: <strong className="font-bold">{profile.bloodType} Whole Blood</strong>
              </div>
              <span className="px-2 py-0.5 bg-red-600 text-white font-bold rounded-md text-[10px]">
                Walk-ins Open
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              id="dashboard-explore-map-btn"
              onClick={() => onNavigateTab('map')}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="dashboard-chat-hospital-btn"
              onClick={() => onNavigateTab('chat')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Chat With Staff
            </button>
          </div>
        </div>

        {/* Rewards & Milestone Perk Teaser */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl border border-amber-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Rewards Progression
              </span>
              <span className="text-xs font-bold text-amber-900">
                {profile.rewardPoints} pts Available
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-lg">
              Unlock Platinum Champion Tier
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              You are only <strong>{2000 - profile.rewardPoints} points</strong> away from unlocking VIP fast-track donation passes and free diagnostic health panels.
            </p>

            <div className="mt-4 p-3 bg-white/80 rounded-2xl border border-amber-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Gold Sentinel</span>
                <span className="text-amber-700 font-bold">62% to Platinum</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 w-[62%]" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">
              Next badge: Gallon Club (2 donations left)
            </span>
            <button
              id="dashboard-view-perks-btn"
              onClick={() => onNavigateTab('rewards')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Redeem Perks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
