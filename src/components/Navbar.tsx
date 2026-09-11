import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  MapPin,
  MessageSquare,
  Award,
  UserCheck,
  BarChart3,
  Lock,
  Unlock,
  Building2,
  User,
  HeartHandshake,
  Menu,
  X,
  QrCode,
  Camera,
  ShieldAlert
} from 'lucide-react';
import { BloodType } from '../types';

export type ActiveTab =
  | 'alerts'
  | 'map'
  | 'chat'
  | 'rewards'
  | 'profile'
  | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  persona: 'DONOR' | 'HOSPITAL';
  setPersona: (persona: 'DONOR' | 'HOSPITAL') => void;
  activeAlertCount: number;
  unreadChatCount: number;
  rewardPoints: number;
  userBloodType: BloodType;
  isBiometricLocked: boolean;
  onToggleBiometricLock: () => void;
  onOpenCompatibility: () => void;
  onOpenQRPass: () => void;
  onOpenQRScanner: () => void;
  onNavigateToAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  persona,
  setPersona,
  activeAlertCount,
  unreadChatCount,
  rewardPoints,
  userBloodType,
  isBiometricLocked,
  onToggleBiometricLock,
  onOpenCompatibility,
  onOpenQRPass,
  onOpenQRScanner,
  onNavigateToAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'alerts' as ActiveTab,
      label: 'Emergency Alerts',
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : null,
      badgeColor: 'bg-red-600'
    },
    {
      id: 'map' as ActiveTab,
      label: 'Donation Map',
      icon: MapPin,
      badge: null
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Hospital Chat',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : null,
      badgeColor: 'bg-blue-600'
    },
    {
      id: 'rewards' as ActiveTab,
      label: 'Rewards & Perks',
      icon: Award,
      badge: null
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Verified Profile',
      icon: UserCheck,
      badge: null
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Supply & Demand',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner / Pulse Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-red-400">REAL-TIME BLOOD NETWORK ACTIVE</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-300">
            5 Regional Hospitals Connected in Metro Zone
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Blood Type Compatibility Quick Helper */}
          <button
            id="open-compatibility-quick-btn"
            onClick={onOpenCompatibility}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white underline-offset-2 hover:underline transition-colors"
          >
            <Droplets className="w-3.5 h-3.5 text-red-400" />
            <span>Compatibility Matrix ({userBloodType})</span>
          </button>

          {/* Hospital Staff Portal Access */}
          <button
            id="topbar-goto-admin-btn"
            onClick={onNavigateToAdmin}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-xs transition-colors"
            title="Open Hospital & Blood Bank Administration Portal"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Hospital Admin Portal →</span>
          </button>

          {/* Biometric Lock Status */}
          <button
            id="toggle-biometric-lock-navbar-btn"
            onClick={onToggleBiometricLock}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              isBiometricLocked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
            title="Biometric Privacy Lock"
          >
            {isBiometricLocked ? (
              <>
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-emerald-400" />
                <span>Biometrics Active</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Droplets className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  Blood Donation
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                  Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Instant Hospital-Donor Dispatch
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-red-50 text-red-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full ${
                        item.badgeColor || 'bg-red-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Persona Switcher & Points */}
          <div className="hidden sm:flex items-center gap-3">
            {/* QR Pass / Scanner Button */}
            {persona === 'DONOR' ? (
              <button
                id="navbar-open-qr-pass-btn"
                onClick={onOpenQRPass}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                title="View your verified digital QR fast-pass"
              >
                <QrCode className="w-3.5 h-3.5 text-red-400" />
                <span>QR Fast-Pass</span>
              </button>
            ) : (
              <button
                id="navbar-open-qr-scanner-btn"
                onClick={onOpenQRScanner}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                title="Scan arriving donor QR pass"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Donor QR</span>
              </button>
            )}

            {/* Points pill (in Donor mode) */}
            {persona === 'DONOR' && (
              <div
                id="donor-points-pill"
                onClick={() => setActiveTab('rewards')}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{rewardPoints} pts</span>
              </div>
            )}

            {/* Dedicated Hospital Admin Portal Button */}
            <button
              id="navbar-open-admin-portal-btn"
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs border border-slate-700 group"
              title="Open the dedicated Hospital Administration Command Center"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
              <span>Admin Portal</span>
              <span className="px-1.5 py-0.2 bg-red-500/30 text-red-300 text-[10px] font-black rounded">
                HQ
              </span>
            </button>

            {/* Persona Switch Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                id="switch-persona-donor-btn"
                onClick={() => setPersona('DONOR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  persona === 'DONOR'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-red-600" />
                <span>Donor Mode</span>
                <span className="px-1.5 py-0.2 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                  {userBloodType}
                </span>
              </button>

              <button
                id="switch-persona-hospital-btn"
                onClick={() => {
                  setPersona('HOSPITAL');
                  onNavigateToAdmin();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  persona === 'HOSPITAL'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Hospital / Admin</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Persona:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPersona('DONOR')}
                className={`px-3 py-1 text-xs rounded-lg font-bold ${
                  persona === 'DONOR' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Donor ({userBloodType})
              </button>
              <button
                onClick={() => {
                  setPersona('HOSPITAL');
                  onNavigateToAdmin();
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded-lg font-bold ${
                  persona === 'HOSPITAL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Hospital / Admin
              </button>
            </div>
          </div>

          {/* Mobile Admin Portal Entry */}
          <button
            id="mobile-open-admin-portal-btn"
            onClick={() => {
              onNavigateToAdmin();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Go to Hospital Admin Page</span>
            </div>
            <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-black">HQ</span>
          </button>

          {/* Quick Mobile QR trigger */}
          <div className="mb-3">
            {persona === 'DONOR' ? (
              <button
                id="mobile-open-qr-pass-btn"
                onClick={() => {
                  onOpenQRPass();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-red-400" />
                <span>Open Digital QR Fast-Pass</span>
              </button>
            ) : (
              <button
                id="mobile-open-qr-scanner-btn"
                onClick={() => {
                  onOpenQRScanner();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Donor QR Fast-Pass</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full bg-red-600">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
