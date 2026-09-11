import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  FileText,
  Search,
  Plus,
  ArrowUpRight,
  Filter,
  Download,
  RefreshCw,
  QrCode,
  Radio,
  Sliders,
  ShieldCheck,
  Check,
  Trash2,
  Eye,
  Send,
  Zap,
  ChevronRight,
  ArrowLeft,
  Lock,
  LogOut,
  Hospital,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  EmergencyAlert,
  DonationCenter,
  BloodSupplyInventory,
  DonorVerificationCandidate,
  AuditLogEntry,
  BloodType,
  UrgencyLevel
} from '../types';

interface AdminPageProps {
  inventory: BloodSupplyInventory[];
  alerts: EmergencyAlert[];
  centers: DonationCenter[];
  candidates: DonorVerificationCandidate[];
  auditLogs: AuditLogEntry[];
  onUpdateInventory: (updated: BloodSupplyInventory[]) => void;
  onUpdateCenters: (updated: DonationCenter[]) => void;
  onUpdateCandidates: (updated: DonorVerificationCandidate[]) => void;
  onBroadcastAlert: (alert: Omit<EmergencyAlert, 'id' | 'createdAt' | 'unitsFulfilled' | 'status' | 'donorResponses' | 'coordinates'>) => void;
  onSimulateSurge: () => void;
  onFulfillAlert: (alertId: string) => void;
  onOpenQRScanner: () => void;
  onExitToDonor: () => void;
}

type AdminSection = 'overview' | 'verification' | 'inventory' | 'centers' | 'audit';

export const AdminPage: React.FC<AdminPageProps> = ({
  inventory,
  alerts,
  centers,
  candidates,
  auditLogs,
  onUpdateInventory,
  onUpdateCenters,
  onUpdateCandidates,
  onBroadcastAlert,
  onSimulateSurge,
  onFulfillAlert,
  onOpenQRScanner,
  onExitToDonor
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<DonorVerificationCandidate | null>(null);

  // Broadcast Alert Form modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    hospitalName: 'St. Jude Emergency Trauma Center',
    hospitalAddress: '550 1st Avenue, Manhattan, NY',
    bloodTypeNeeded: 'O-' as BloodType,
    unitsNeeded: 4,
    urgency: 'CRITICAL' as UrgencyLevel,
    patientContext: 'Multiple vehicular collision trauma victims requiring emergent transfusion',
    deadlineHours: 1.5,
    distanceMiles: 1.4
  });

  // Stock edit modal
  const [stockEditTarget, setStockEditTarget] = useState<BloodSupplyInventory | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  // Audit filter
  const [auditFilter, setAuditFilter] = useState<string>('ALL');

  // Metrics
  const totalUnits = inventory.reduce((acc, curr) => acc + curr.unitsInStock, 0);
  const criticalTypes = inventory.filter((i) => i.status === 'CRITICAL');
  const pendingCandidates = candidates.filter((c) => c.status === 'PENDING');
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');

  // Candidate action handlers
  const handleApproveCandidate = (id: string) => {
    const updated = candidates.map((c) =>
      c.id === id ? { ...c, status: 'APPROVED' as const } : c
    );
    onUpdateCandidates(updated);
    if (selectedCandidate?.id === id) {
      setSelectedCandidate({ ...selectedCandidate, status: 'APPROVED' });
    }
  };

  const handleRejectCandidate = (id: string) => {
    const updated = candidates.map((c) =>
      c.id === id ? { ...c, status: 'REJECTED' as const } : c
    );
    onUpdateCandidates(updated);
    if (selectedCandidate?.id === id) {
      setSelectedCandidate({ ...selectedCandidate, status: 'REJECTED' });
    }
  };

  // Center toggle open
  const handleToggleCenterStatus = (centerId: string) => {
    const updated = centers.map((c) =>
      c.id === centerId ? { ...c, isOpenNow: !c.isOpenNow } : c
    );
    onUpdateCenters(updated);
  };

  // Inventory adjustment
  const handleSaveStock = () => {
    if (!stockEditTarget) return;
    const updated = inventory.map((item) => {
      if (item.bloodType === stockEditTarget.bloodType) {
        const status =
          newStockValue < 30 ? 'CRITICAL' : newStockValue < 60 ? 'LOW' : 'HEALTHY';
        return {
          ...item,
          unitsInStock: newStockValue,
          status: status
        };
      }
      return item;
    });
    onUpdateInventory(updated);
    setStockEditTarget(null);
  };

  // Broadcast Alert submit
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcastAlert(broadcastForm);
    setIsBroadcastModalOpen(false);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(
    (c) =>
      c.fullName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.bloodType.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.idDocumentNumber.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'ALL') return true;
    return log.severity === auditFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* 1. DEDICATED TOP HOSPITAL COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        {/* System telemetry bar */}
        <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              METRO ZONE TRAUMA GRID: ONLINE
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline text-slate-400">
              Secure Channel: TLS 1.3 • AABB Protocol #NY-891
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-medium">
              Station: <strong className="text-white">St. Jude Trauma Bay #1</strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-amber-400 font-bold">Level 4 Clearance</span>
          </div>
        </div>

        {/* Primary Admin Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & Clinical Command Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-white shadow-lg shadow-red-600/30 ring-1 ring-white/20">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-base tracking-tight">
                    HemoNet Command OS
                  </span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black rounded-md uppercase">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Regional Blood Bank &amp; Emergency Hospital Administration
                </p>
              </div>
            </div>

            {/* Quick Actions & Exit to Donor Link */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="admin-page-broadcast-btn"
                onClick={() => setIsBroadcastModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all active:scale-95"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Broadcast Emergency</span>
              </button>

              <button
                id="admin-page-scan-qr-btn"
                onClick={onOpenQRScanner}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Donor QR</span>
              </button>

              {/* Staff Member Chip */}
              <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-xs">
                  ER
                </div>
                <div className="text-left text-[11px]">
                  <div className="font-extrabold text-white leading-tight">Dr. Evelyn Reed</div>
                  <div className="text-slate-400 text-[10px]">Trauma Chief</div>
                </div>
              </div>

              {/* PROMINENT RETURN TO DONOR PAGE BUTTON */}
              <button
                id="exit-to-donor-page-btn"
                onClick={onExitToDonor}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold shadow-md transition-all active:scale-95 group"
                title="Switch back to the Donor Application view"
              >
                <ArrowLeft className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Exit to Donor App</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Section Tabs Bar */}
        <div className="bg-slate-900 border-t border-slate-800/90 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Command Overview', icon: Activity, count: null },
              { id: 'verification', label: 'Donor Verification Queue', icon: ShieldCheck, count: pendingCandidates.length },
              { id: 'inventory', label: 'Blood Inventory & Barometer', icon: Droplet, count: criticalTypes.length },
              { id: 'centers', label: 'Centers & Fleet Fleets', icon: Building2, count: centers.length },
              { id: 'audit', label: 'Immutable Audit Logs', icon: FileText, count: null }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-page-tab-${tab.id}`}
                  onClick={() => setActiveSection(tab.id as AdminSection)}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. ADMIN MAIN CONTENT VIEW */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metric Flash Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold">Total Reserve Units</div>
            <div className="text-3xl font-black text-white flex items-center gap-2 mt-1">
              <Droplet className="w-6 h-6 text-red-500 fill-red-500" />
              <span>{totalUnits}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Central Blood Bank Reserve</div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold">Critical Deficit Types</div>
            <div className="text-3xl font-black text-amber-400 flex items-center gap-2 mt-1">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <span>{criticalTypes.length}</span>
            </div>
            <div className="text-[11px] text-amber-300/80 mt-1 font-bold">
              {criticalTypes.map((c) => c.bloodType).join(', ') || 'No Critical Shortages'}
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold">Pending Accreditations</div>
            <div className="text-3xl font-black text-blue-400 flex items-center gap-2 mt-1">
              <Users className="w-6 h-6 text-blue-400" />
              <span>{pendingCandidates.length}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Donors Awaiting Review</div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold">Active Hospital Alerts</div>
            <div className="text-3xl font-black text-rose-400 flex items-center gap-2 mt-1">
              <Radio className="w-6 h-6 text-rose-400" />
              <span>{activeAlerts.length}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Transmitting in Metro Grid</div>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  Regional Casualty &amp; Trauma Ops
                </span>
                <h2 className="text-xl font-black text-white">
                  High-Priority Emergency Broadcast Center
                </h2>
                <p className="text-slate-300 text-xs max-w-2xl">
                  Initiate real-time geo-targeted sirens to qualified donors within 5 miles of incoming trauma casualty events.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Transmit Code Red</span>
                </button>
                <button
                  onClick={onSimulateSurge}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Simulate Highway Surge</span>
                </button>
                <button
                  onClick={onOpenQRScanner}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Triage Bed Scanner</span>
                </button>
              </div>
            </div>

            {/* Active Emergency Broadcasts List */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-400" />
                    <span>Active Hospital Casualty Broadcasts</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live dispatches transmitting to compatible registered donors
                  </p>
                </div>

                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                  {activeAlerts.length} Active Feeds
                </span>
              </div>

              {activeAlerts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs">
                  No active hospital emergency broadcasts currently transmitting.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 bg-slate-950/80 hover:bg-slate-950 rounded-2xl border border-slate-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-xs rounded-md">
                            {alert.bloodTypeNeeded}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              alert.urgency === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {alert.urgency}
                          </span>
                          <span className="text-xs font-extrabold text-white">
                            {alert.hospitalName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {alert.patientContext} • Need:{' '}
                          <strong className="text-white">
                            {alert.unitsFulfilled}/{alert.unitsNeeded} units
                          </strong>{' '}
                          • Window: {alert.deadlineHours}h remaining
                        </p>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{alert.donorResponses.length} registered donors dispatched</span>
                          <span>•</span>
                          <span>{alert.distanceMiles} miles from center</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          id={`admin-fulfill-alert-${alert.id}`}
                          onClick={() => onFulfillAlert(alert.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                        >
                          Mark Fulfilled
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2-Column Split: Stock Quick Glance & Verification Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventory Barometer */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-red-500" />
                      <span>Blood Supply Levels</span>
                    </h3>
                    <button
                      onClick={() => setActiveSection('inventory')}
                      className="text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      Inspect All Phenotypes &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {inventory.map((item) => (
                      <div
                        key={item.bloodType}
                        onClick={() => {
                          setStockEditTarget(item);
                          setNewStockValue(item.unitsInStock);
                        }}
                        className={`p-3 rounded-xl border text-center cursor-pointer hover:border-slate-500 transition-all ${
                          item.status === 'CRITICAL'
                            ? 'bg-red-950/40 border-red-800/60 text-red-300'
                            : item.status === 'LOW'
                            ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="font-black text-sm">{item.bloodType}</div>
                        <div className="text-xl font-black text-white mt-1">{item.unitsInStock}</div>
                        <div className="text-[10px] font-bold uppercase tracking-tight opacity-80">
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Click box to adjust unit reserves</span>
                  <span className="font-bold text-red-400">{criticalTypes.length} shortages</span>
                </div>
              </div>

              {/* Pending Verification Applicants */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Pending Clinical Accreditations</span>
                    </h3>
                    <button
                      onClick={() => setActiveSection('verification')}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      Manage Queue ({pendingCandidates.length}) &rarr;
                    </button>
                  </div>

                  {pendingCandidates.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-2xl text-xs">
                      All donor credentials verified!
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {pendingCandidates.slice(0, 3).map((cand) => (
                        <div
                          key={cand.id}
                          className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-extrabold text-white flex items-center gap-1.5">
                              <span>{cand.fullName}</span>
                              <span className="px-1.5 py-0.2 bg-red-600/30 text-red-300 font-bold rounded border border-red-500/30">
                                {cand.bloodType}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {cand.idDocumentType} • Hgb: {cand.hemoglobinLevel} g/dL
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveCandidate(cand.id)}
                              className="p-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded-lg border border-emerald-500/40"
                              title="Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRejectCandidate(cand.id)}
                              className="p-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 rounded-lg border border-rose-500/40"
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
                  <span>Certified under AABB Standards</span>
                  <span className="font-semibold text-slate-300">Registry Total: 1,482</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DONOR VERIFICATION QUEUE */}
        {activeSection === 'verification' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span>Clinical Donor Verification &amp; Badge Certification</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Audit identity proofs, hemoglobin lab tests, and clinical clearance forms
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="admin-page-candidate-search"
                    type="text"
                    placeholder="Search by name, blood, or document ID..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600 font-medium"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Candidate</th>
                      <th className="py-3 px-4">Blood Group</th>
                      <th className="py-3 px-4">Document Proof</th>
                      <th className="py-3 px-4">Hemoglobin</th>
                      <th className="py-3 px-4">Screening</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCandidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-white">{cand.fullName}</div>
                          <div className="text-[11px] text-slate-400">{cand.email} • {cand.phone}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-red-600 text-white font-black rounded-md">
                            {cand.bloodType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200">{cand.idDocumentType}</div>
                          <div className="font-mono text-[10px] text-slate-400">{cand.idDocumentNumber}</div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold">
                          <span
                            className={
                              cand.hemoglobinLevel >= 12.5 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'
                            }
                          >
                            {cand.hemoglobinLevel} g/dL
                          </span>
                          <span className="text-[10px] text-slate-500 block">Min: 12.5</span>
                        </td>

                        <td className="py-3.5 px-4">
                          {cand.medicalScreeningPassed ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Passed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" /> Flagged
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                              cand.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : cand.status === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {cand.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`admin-view-candidate-${cand.id}`}
                              onClick={() => setSelectedCandidate(cand)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                              title="Inspect Application Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {cand.status !== 'APPROVED' && (
                              <button
                                id={`admin-approve-candidate-${cand.id}`}
                                onClick={() => handleApproveCandidate(cand.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                              >
                                Approve
                              </button>
                            )}

                            {cand.status !== 'REJECTED' && (
                              <button
                                id={`admin-reject-candidate-${cand.id}`}
                                onClick={() => handleRejectCandidate(cand.id)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dossier Modal */}
            {selectedCandidate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                <div className="bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Donor Application Dossier
                      </span>
                      <h4 className="text-base font-black text-white">{selectedCandidate.fullName}</h4>
                    </div>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Blood Group</span>
                        <span className="text-sm font-black text-red-500">{selectedCandidate.bloodType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Submission Date</span>
                        <span className="font-semibold text-white">{selectedCandidate.submittedAt}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">ID Document</span>
                        <span className="font-semibold text-white">
                          {selectedCandidate.idDocumentType} ({selectedCandidate.idDocumentNumber})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Hemoglobin &amp; Weight</span>
                        <span className="font-semibold text-white">
                          {selectedCandidate.hemoglobinLevel} g/dL • {selectedCandidate.weightKg} kg
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1">
                        Clinical Assessor Notes
                      </span>
                      <p className="p-3 bg-amber-950/40 text-amber-200 rounded-xl border border-amber-800/50 leading-relaxed">
                        {selectedCandidate.notes || 'No adverse medical history recorded.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRejectCandidate(selectedCandidate.id)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                    >
                      Deny Verification
                    </button>
                    <button
                      onClick={() => handleApproveCandidate(selectedCandidate.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                    >
                      Issue Certified Badge
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: INVENTORY & STOCK BAROMETER */}
        {activeSection === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-red-500" />
                    <span>Regional Blood Reserve &amp; Hourly Burn-Rate Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live inventory counts, safety buffer thresholds, and burn-rate calculation per hour
                  </p>
                </div>

                <button
                  onClick={onSimulateSurge}
                  className="px-3.5 py-2 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold rounded-xl border border-amber-500/40 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Simulate Mass Casualty Demand Surge</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.map((item) => (
                  <div
                    key={item.bloodType}
                    className={`p-5 rounded-2xl border transition-all ${
                      item.status === 'CRITICAL'
                        ? 'bg-red-950/40 border-red-800/80 shadow-md'
                        : item.status === 'LOW'
                        ? 'bg-amber-950/40 border-amber-800/80'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                          {item.bloodType}
                        </div>
                        <div>
                          <span className="font-extrabold text-white text-sm">
                            Type {item.bloodType}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase block tracking-wider ${
                              item.status === 'CRITICAL'
                                ? 'text-red-400'
                                : item.status === 'LOW'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {item.status} RESERVE
                          </span>
                        </div>
                      </div>

                      <button
                        id={`admin-edit-stock-${item.bloodType}`}
                        onClick={() => {
                          setStockEditTarget(item);
                          setNewStockValue(item.unitsInStock);
                        }}
                        className="p-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300"
                        title="Adjust Units"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-3xl font-black text-white">
                        {item.unitsInStock}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Target: {item.safeCapacity} units
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          item.status === 'CRITICAL'
                            ? 'bg-red-500'
                            : item.status === 'LOW'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{
                          width: `${Math.min(100, (item.unitsInStock / item.safeCapacity) * 100)}%`
                        }}
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                      <span>Burn Rate: ~{item.demandRatePerHour} u/hr</span>
                      <span>
                        Remaining:{' '}
                        <strong className="text-white">
                          {Math.round(item.unitsInStock / (item.demandRatePerHour || 1))} hrs
                        </strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Edit Stock Dialog */}
            {stockEditTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                <div className="bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h4 className="text-base font-black text-white">
                      Adjust Stock: Type {stockEditTarget.bloodType}
                    </h4>
                    <button
                      onClick={() => setStockEditTarget(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Current Units in Stock
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setNewStockValue((prev) => Math.max(0, prev - 5))}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-white"
                        >
                          -5
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={newStockValue}
                          onChange={(e) => setNewStockValue(parseInt(e.target.value) || 0)}
                          className="flex-1 py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl font-black text-white focus:outline-none focus:border-red-500"
                        />
                        <button
                          onClick={() => setNewStockValue((prev) => prev + 5)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-white"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Changes will instantly propagate to the emergency triage engine and blood deficit alert broadcasts.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setStockEditTarget(null)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      id="admin-save-stock-adjustment-btn"
                      onClick={handleSaveStock}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                    >
                      Save Units
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: DONATION CENTERS & FLEET */}
        {activeSection === 'centers' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <span>Regional Donation Centers &amp; Mobile Bloodmobiles</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control active hours, walk-in reception state, and daily appointment quotas
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-400">
                  {centers.filter((c) => c.isOpenNow).length} of {centers.length} facilities open now
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {centers.map((center) => (
                  <div
                    key={center.id}
                    className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                          {center.type}
                        </span>
                        <h4 className="text-base font-black text-white mt-0.5">
                          {center.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {center.address} • {center.distanceMiles} miles away
                        </p>
                      </div>

                      <button
                        id={`admin-toggle-center-${center.id}`}
                        onClick={() => handleToggleCenterStatus(center.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight transition-colors ${
                          center.isOpenNow
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {center.isOpenNow ? 'Open' : 'Closed'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Hours</span>
                        <span className="font-semibold text-slate-200">{center.hours}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Slots Available Today</span>
                        <span className="font-semibold text-slate-200">{center.availableSlotsToday} appointments</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-medium">Critical Needs:</span>
                        <div className="flex gap-1">
                          {center.criticalNeeds.map((type) => (
                            <span
                              key={type}
                              className="px-1.5 py-0.2 bg-red-600/30 text-red-300 font-extrabold rounded text-[10px] border border-red-500/30"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        Walk-ins: {center.walkInsWelcome ? 'Accepted' : 'Appt Only'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: SECURITY & AUDIT LOGS */}
        {activeSection === 'audit' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span>Immutable System Audit &amp; Event Trail</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cryptographically hashed event logging of dispatches, QR fast-pass admissions, and stock transfers
                  </p>
                </div>

                {/* Severity Filter */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl text-xs font-bold border border-slate-800">
                  {['ALL', 'CRITICAL', 'WARNING', 'SUCCESS', 'INFO'].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setAuditFilter(sev)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        auditFilter === sev
                          ? 'bg-slate-800 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs List */}
              <div className="space-y-2.5">
                {filteredAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-950/80 hover:bg-slate-950 rounded-2xl border border-slate-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            log.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : log.severity === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : log.severity === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {log.severity}
                        </span>
                        <span className="font-mono font-bold text-white">{log.action}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{log.timestamp}</span>
                      </div>

                      <p className="text-slate-300 font-medium">{log.details}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 shrink-0">
                      <div className="font-semibold text-slate-200">{log.actor}</div>
                      <div className="font-mono text-[10px] text-slate-500">{log.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. DEDICATED ADMIN FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span className="font-bold text-slate-300">
              HemoNet Regional Command System
            </span>
            <span>• FDA 21 CFR Part 606 &amp; AABB Certified</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onExitToDonor}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
            >
              <span>← Return to Donor Portal</span>
            </button>
            <span className="text-slate-700">|</span>
            <span>Session: Dr. Evelyn Reed (ID: STJ-9942)</span>
          </div>
        </div>
      </footer>

      {/* Broadcast Emergency Alert Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-6 text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    Broadcast Regional Emergency Need
                  </h3>
                  <p className="text-xs text-slate-400">
                    Transmits high-priority alerts to matching nearby donors
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Hospital / Emergency Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={broadcastForm.hospitalName}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, hospitalName: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Blood Phenotype Needed
                  </label>
                  <select
                    value={broadcastForm.bloodTypeNeeded}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        bloodTypeNeeded: e.target.value as BloodType
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-black text-red-400"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((t) => (
                      <option key={t} value={t}>
                        Type {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Units Urgently Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={broadcastForm.unitsNeeded}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        unitsNeeded: parseInt(e.target.value) || 1
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-bold text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Clinical Urgency Level
                  </label>
                  <select
                    value={broadcastForm.urgency}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        urgency: e.target.value as UrgencyLevel
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-bold text-white"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate Trauma)</option>
                    <option value="HIGH">HIGH (Surgery Standby)</option>
                    <option value="MODERATE">MODERATE (Reserve Deficit)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Deadline (Hours Remaining)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    required
                    value={broadcastForm.deadlineHours}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        deadlineHours: parseFloat(e.target.value) || 1
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-bold text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Clinical &amp; Patient Context
                </label>
                <textarea
                  rows={2}
                  required
                  value={broadcastForm.patientContext}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, patientContext: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-600"
                  placeholder="e.g., Major cardiovascular surgery; pediatric trauma bay emergency"
                />
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="admin-confirm-broadcast-emergency-btn"
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
