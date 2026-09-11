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
  ChevronRight
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

interface AdminPortalProps {
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
}

type AdminSection = 'overview' | 'verification' | 'inventory' | 'centers' | 'audit';

export const AdminPortal: React.FC<AdminPortalProps> = ({
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
  onOpenQRScanner
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Hospital &amp; Blood Bank Command Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">
                FDA &amp; AABB Certified Regional Registry #NY-891
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Emergency Blood Operations &amp; Donor Triage
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time regional blood distribution, emergency casualty broadcast engine, clinical donor accreditation verification, and triage fast-pass admissions.
            </p>
          </div>

          {/* Quick Header Operations */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="admin-launch-broadcast-btn"
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Broadcast Emergency Need</span>
            </button>

            <button
              id="admin-scan-donor-qr-btn"
              onClick={onOpenQRScanner}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Arriving Donor QR</span>
            </button>

            <button
              id="admin-simulate-surge-btn"
              onClick={onSimulateSurge}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/20 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              title="Simulate severe mass casualty incident"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Simulate Trauma Surge</span>
            </button>
          </div>
        </div>

        {/* Operational Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Total Reserve Units</div>
            <div className="text-2xl font-black text-white flex items-center gap-1.5 mt-0.5">
              <Droplet className="w-5 h-5 text-red-500 fill-red-500" />
              <span>{totalUnits}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Across all 8 phenotypes</div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Critical Deficit Types</div>
            <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>{criticalTypes.length}</span>
            </div>
            <div className="text-[10px] text-amber-300/80 mt-1">
              {criticalTypes.map((c) => c.bloodType).join(', ') || 'None critical'}
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Pending Accreditations</div>
            <div className="text-2xl font-black text-blue-400 flex items-center gap-1.5 mt-0.5">
              <Users className="w-5 h-5 text-blue-400" />
              <span>{pendingCandidates.length}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Donors awaiting review</div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Active Broadcasts</div>
            <div className="text-2xl font-black text-rose-400 flex items-center gap-1.5 mt-0.5">
              <Radio className="w-5 h-5 text-rose-400" />
              <span>{activeAlerts.length}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Regional hospital dispatches</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 gap-1 overflow-x-auto shadow-xs">
        {[
          { id: 'overview', label: 'Command Overview', icon: Activity, count: null },
          { id: 'verification', label: 'Donor Verification Queue', icon: ShieldCheck, count: pendingCandidates.length },
          { id: 'inventory', label: 'Inventory & Stock Barometer', icon: Droplet, count: criticalTypes.length },
          { id: 'centers', label: 'Donation Centers & Fleets', icon: Building2, count: centers.length },
          { id: 'audit', label: 'Security & Audit Logs', icon: FileText, count: null }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveSection(tab.id as AdminSection)}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Active Emergency Alerts Queue */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-600" />
                  <span>Active Emergency Hospital Broadcasts</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Regional alerts currently transmitting to local compatible donors
                </p>
              </div>
              <button
                id="overview-new-broadcast-btn"
                onClick={() => setIsBroadcastModalOpen(true)}
                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold rounded-xl border border-red-200 transition-colors"
              >
                + New Alert
              </button>
            </div>

            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                No active hospital emergencies currently broadcasting.
              </div>
            ) : (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-xs rounded-md">
                          {alert.bloodTypeNeeded}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            alert.urgency === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {alert.urgency}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {alert.hospitalName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {alert.patientContext} • Need:{' '}
                        <strong>
                          {alert.unitsFulfilled}/{alert.unitsNeeded} units
                        </strong>{' '}
                        • Deadline: {alert.deadlineHours}h
                      </p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{alert.donorResponses.length} donors responded</span>
                        <span>•</span>
                        <span>{alert.distanceMiles} miles away</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`fulfill-alert-${alert.id}`}
                        onClick={() => onFulfillAlert(alert.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Mark Fulfilled
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Split: Inventory Summary & Pending Verification preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Snapshot */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-red-600" />
                    <span>Blood Supply Levels</span>
                  </h3>
                  <button
                    onClick={() => setActiveSection('inventory')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Manage All &rarr;
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
                      className={`p-3 rounded-xl border text-center cursor-pointer hover:shadow-md transition-all ${
                        item.status === 'CRITICAL'
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : item.status === 'LOW'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="font-black text-sm">{item.bloodType}</div>
                      <div className="text-xl font-extrabold mt-1">{item.unitsInStock}</div>
                      <div className="text-[10px] font-bold opacity-80 uppercase tracking-tight">
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Click any unit box to quick-edit stock</span>
                <span className="font-bold text-red-600">{criticalTypes.length} shortages</span>
              </div>
            </div>

            {/* Donor Accreditations Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Pending Donor Accreditations</span>
                  </h3>
                  <button
                    onClick={() => setActiveSection('verification')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    View Queue ({pendingCandidates.length}) &rarr;
                  </button>
                </div>

                {pendingCandidates.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs">
                    All donor credential applications processed!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {pendingCandidates.slice(0, 3).map((cand) => (
                      <div
                        key={cand.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>{cand.fullName}</span>
                            <span className="px-1.5 py-0.2 bg-red-100 text-red-700 font-bold rounded">
                              {cand.bloodType}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {cand.idDocumentType} • Hgb: {cand.hemoglobinLevel} g/dL
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleApproveCandidate(cand.id)}
                            className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg"
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRejectCandidate(cand.id)}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg"
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

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Certified under AABB Standards</span>
                <span className="font-semibold text-slate-700">Total in Registry: 1,482</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DONOR VERIFICATION QUEUE */}
      {activeSection === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Clinical Donor Verification &amp; Badge Certification</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review submitted government identity proofs, hemoglobin lab slips, and medical screening forms
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-candidate-search"
                  type="text"
                  placeholder="Search by name, blood, or document ID..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
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
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{cand.fullName}</div>
                        <div className="text-[11px] text-slate-500">{cand.email} • {cand.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-black rounded-md">
                          {cand.bloodType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{cand.idDocumentType}</div>
                        <div className="font-mono text-[10px] text-slate-500">{cand.idDocumentNumber}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold">
                        <span
                          className={
                            cand.hemoglobinLevel >= 12.5 ? 'text-emerald-700' : 'text-red-600 font-bold'
                          }
                        >
                          {cand.hemoglobinLevel} g/dL
                        </span>
                        <span className="text-[10px] text-slate-400 block">Min: 12.5</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {cand.medicalScreeningPassed ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Passed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" /> Flagged
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                            cand.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cand.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {cand.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`view-candidate-${cand.id}`}
                            onClick={() => setSelectedCandidate(cand)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {cand.status !== 'APPROVED' && (
                            <button
                              id={`approve-candidate-${cand.id}`}
                              onClick={() => handleApproveCandidate(cand.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                            >
                              Approve
                            </button>
                          )}

                          {cand.status !== 'REJECTED' && (
                            <button
                              id={`reject-candidate-${cand.id}`}
                              onClick={() => handleRejectCandidate(cand.id)}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors"
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

          {/* Detailed Candidate Inspection Modal */}
          {selectedCandidate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Donor Application File
                    </span>
                    <h4 className="text-base font-black text-slate-900">{selectedCandidate.fullName}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-slate-700">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Blood Group</span>
                      <span className="text-sm font-black text-red-600">{selectedCandidate.bloodType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Submission Date</span>
                      <span className="font-semibold">{selectedCandidate.submittedAt}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">ID Document</span>
                      <span className="font-semibold">{selectedCandidate.idDocumentType} ({selectedCandidate.idDocumentNumber})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Hemoglobin &amp; Weight</span>
                      <span className="font-semibold">{selectedCandidate.hemoglobinLevel} g/dL • {selectedCandidate.weightKg} kg</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1">
                      Clinical Assessor Notes
                    </span>
                    <p className="p-3 bg-amber-50 text-amber-950 rounded-xl border border-amber-200/60 leading-relaxed">
                      {selectedCandidate.notes || 'No adverse medical history recorded.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleRejectCandidate(selectedCandidate.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Deny Verification
                  </button>
                  <button
                    onClick={() => handleApproveCandidate(selectedCandidate.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-600" />
                  <span>Central Blood Reserve &amp; Burn-Rate Management</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Update inventory counts, adjust safe capacities, and inspect transfusion burn-rates per hour
                </p>
              </div>

              <button
                onClick={onSimulateSurge}
                className="px-3.5 py-2 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Simulate Emergency Demand Surge</span>
              </button>
            </div>

            {/* Inventory Grid with quick adjustment */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.map((item) => (
                <div
                  key={item.bloodType}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.status === 'CRITICAL'
                      ? 'bg-red-50/60 border-red-200 shadow-xs'
                      : item.status === 'LOW'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                        {item.bloodType}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm">
                          Type {item.bloodType}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase block tracking-wider ${
                            item.status === 'CRITICAL'
                              ? 'text-red-700'
                              : item.status === 'LOW'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {item.status} RESERVE
                        </span>
                      </div>
                    </div>

                    <button
                      id={`edit-stock-${item.bloodType}`}
                      onClick={() => {
                        setStockEditTarget(item);
                        setNewStockValue(item.unitsInStock);
                      }}
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700"
                      title="Adjust Units"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-3xl font-black text-slate-900">
                      {item.unitsInStock}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Target: {item.safeCapacity} units
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        item.status === 'CRITICAL'
                          ? 'bg-red-600'
                          : item.status === 'LOW'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (item.unitsInStock / item.safeCapacity) * 100)}%`
                      }}
                    />
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600 flex justify-between">
                    <span>Burn Rate: ~{item.demandRatePerHour} u/hr</span>
                    <span>
                      Est:{' '}
                      <strong className="text-slate-900">
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h4 className="text-base font-black text-slate-900">
                    Adjust Stock: {stockEditTarget.bloodType}
                  </h4>
                  <button
                    onClick={() => setStockEditTarget(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Current Units in Stock
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setNewStockValue((prev) => Math.max(0, prev - 5))}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
                      >
                        -5
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={newStockValue}
                        onChange={(e) => setNewStockValue(parseInt(e.target.value) || 0)}
                        className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-black focus:outline-none"
                      />
                      <button
                        onClick={() => setNewStockValue((prev) => prev + 5)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
                      >
                        +5
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Changes will immediately update triage thresholds and emergency broadcast alerts across the network.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setStockEditTarget(null)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-stock-adjustment-btn"
                    onClick={handleSaveStock}
                    className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl"
                  >
                    Save Stock
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>Regional Donation Centers &amp; Mobile Bloodmobiles</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage facility operating hours, walk-in admission status, and daily appointment quotas
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                {centers.filter((c) => c.isOpenNow).length} of {centers.length} facilities active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {centers.map((center) => (
                <div
                  key={center.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                        {center.type}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-0.5">
                        {center.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {center.address} • {center.distanceMiles} miles away
                      </p>
                    </div>

                    <button
                      id={`toggle-center-status-${center.id}`}
                      onClick={() => handleToggleCenterStatus(center.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight transition-colors ${
                        center.isOpenNow
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {center.isOpenNow ? 'Open' : 'Closed'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/70">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Hours</span>
                      <span className="font-semibold text-slate-800">{center.hours}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Slots Available Today</span>
                      <span className="font-semibold text-slate-800">{center.availableSlotsToday} appointments</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">Critical Types:</span>
                      <div className="flex gap-1">
                        {center.criticalNeeds.map((type) => (
                          <span
                            key={type}
                            className="px-1.5 py-0.2 bg-red-100 text-red-700 font-extrabold rounded text-[10px]"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500">
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-700" />
                  <span>Immutable System Audit &amp; Event Trail</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographically hashed logging of emergency broadcasts, triage QR scans, and inventory transfers
                </p>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {['ALL', 'CRITICAL', 'WARNING', 'SUCCESS', 'INFO'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setAuditFilter(sev)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      auditFilter === sev
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
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
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          log.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : log.severity === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.severity}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{log.action}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>

                    <p className="text-slate-700 font-medium">{log.details}</p>
                  </div>

                  <div className="text-right text-[11px] text-slate-500 shrink-0">
                    <div className="font-semibold text-slate-800">{log.actor}</div>
                    <div className="font-mono text-[10px] text-slate-400">{log.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Emergency Alert Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Broadcast Regional Emergency Need
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transmits high-priority alerts to matching nearby donors
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hospital / Emergency Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={broadcastForm.hospitalName}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, hospitalName: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-red-600"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate Trauma)</option>
                    <option value="HIGH">HIGH (Surgery Standby)</option>
                    <option value="MODERATE">MODERATE (Reserve Deficit)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Clinical &amp; Patient Context
                </label>
                <textarea
                  rows={2}
                  required
                  value={broadcastForm.patientContext}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, patientContext: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                  placeholder="e.g., Major cardiovascular surgery; pediatric trauma bay emergency"
                />
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="confirm-broadcast-emergency-btn"
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-1.5"
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
