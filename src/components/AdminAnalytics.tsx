import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  Radio,
  Building2,
  Users,
  Droplet,
  CheckCircle2,
  Zap,
  Activity,
  Sparkles
} from 'lucide-react';
import { BloodSupplyInventory, EmergencyAlert, BloodType, UrgencyLevel } from '../types';

interface AdminAnalyticsProps {
  inventory: BloodSupplyInventory[];
  alerts: EmergencyAlert[];
  onBroadcastAlert: (newAlert: Omit<EmergencyAlert, 'id' | 'createdAt' | 'unitsFulfilled' | 'status' | 'donorResponses' | 'coordinates'>) => void;
  onSimulateSurge: () => void;
  onFulfillAlert: (alertId: string) => void;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  inventory,
  alerts,
  onBroadcastAlert,
  onSimulateSurge,
  onFulfillAlert
}) => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState('St. Jude Level 1 Trauma Center');
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType>('O-');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(4);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [clinicalContext, setClinicalContext] = useState('Emergency vascular aortic repair surgery');
  const [deadlineHours, setDeadlineHours] = useState<number>(2);

  // High-level rollups
  const totalUnits = inventory.reduce((acc, curr) => acc + curr.unitsInStock, 0);
  const criticalCount = inventory.filter((i) => i.status === 'CRITICAL').length;
  const lowCount = inventory.filter((i) => i.status === 'LOW').length;

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcastAlert({
      hospitalName: selectedHospital,
      hospitalAddress: '742 University Ave, Metro District',
      distanceMiles: 1.8,
      bloodTypeNeeded: selectedBloodType,
      unitsNeeded: Number(unitsNeeded),
      urgency: urgency,
      patientContext: clinicalContext,
      deadlineHours: Number(deadlineHours)
    });
    setShowBroadcastModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Simulation Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-600" />
              Regional Blood Command
            </span>
            <span className="text-xs text-slate-500 font-mono">Live Sync</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Real-Time Blood Supply &amp; Demand Engine
          </h2>
          <p className="text-xs text-slate-600">
            Monitor inventory deficits, predict supply exhaustion, and broadcast emergency calls to donors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Simulate Surge Button */}
          <button
            id="simulate-surge-btn"
            onClick={onSimulateSurge}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Simulate Multi-Trauma Surge</span>
          </button>

          {/* Broadcast New Alert Button */}
          <button
            id="open-broadcast-modal-btn"
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/25 flex items-center gap-1.5 transition-all"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Emergency Alert</span>
          </button>
        </div>
      </div>

      {/* High Level KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Regional Inventory</span>
            <Droplet className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalUnits} units</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">+14 units</span> today
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Critical Deficit Blood Groups</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-600">{criticalCount} Types</div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            O- and A- under 24hr reserve
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Emergency Dispatches</span>
            <Radio className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{alerts.length} Alerts</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {alerts.reduce((acc, a) => acc + a.donorResponses.length, 0)} donors en route
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Avg Response to Dispatch</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">18.4 min</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            -4.2 min faster than goal
          </div>
        </div>
      </div>

      {/* Blood Inventory Barometer by Blood Type */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Blood Supply Reserves by Phenotype (Safe Capacity vs Real-Time Level)
            </h3>
            <p className="text-xs text-slate-500">
              Dynamic reserve threshold calculated against regional trauma burn rates
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-red-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Critical (&lt;25%)
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Low (&lt;50%)
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventory.map((item) => {
            const percentage = Math.round((item.unitsInStock / item.safeCapacity) * 100);
            const hoursRemaining = (item.unitsInStock / item.demandRatePerHour).toFixed(1);

            return (
              <div
                key={item.bloodType}
                id={`inventory-card-${item.bloodType.replace('+', 'pos').replace('-', 'neg')}`}
                className={`p-4 rounded-2xl border transition-all ${
                  item.status === 'CRITICAL'
                    ? 'bg-red-50/60 border-red-300 ring-1 ring-red-400/30'
                    : item.status === 'LOW'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-extrabold text-sm">
                      {item.bloodType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === 'CRITICAL'
                          ? 'bg-red-200 text-red-900'
                          : item.status === 'LOW'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    {item.demandRatePerHour} u/hr
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">
                      {item.unitsInStock}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      {' '}
                      / {item.safeCapacity} units
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'CRITICAL'
                        ? 'bg-red-600'
                        : item.status === 'LOW'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Supply Duration:</span>
                  <span
                    className={`font-bold ${
                      parseFloat(hoursRemaining) < 12
                        ? 'text-red-600'
                        : 'text-slate-700'
                    }`}
                  >
                    ~{hoursRemaining} hrs left
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hospital Emergency Alert Queue Manager */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Active Hospital Emergency Requests</h3>
            <p className="text-xs text-slate-500">
              Live broadcast dispatches targeting verified donors within radius
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">
            {alerts.length} Active Broadcasts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Hospital Facility</th>
                <th className="p-3">Type</th>
                <th className="p-3">Urgency</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Donors En Route</th>
                <th className="p-3">Clinical Context</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    {alert.hospitalName}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-extrabold text-xs">
                      {alert.bloodTypeNeeded}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.urgency === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.urgency}
                    </span>
                  </td>
                  <td className="p-3 font-bold">
                    <span className="text-red-600">{alert.unitsFulfilled}</span> / {alert.unitsNeeded} units
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-emerald-700">
                      {alert.donorResponses.length} verified donor(s)
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">
                    {alert.patientContext}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      id={`fulfill-alert-btn-${alert.id}`}
                      onClick={() => onFulfillAlert(alert.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                    >
                      Mark Met
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Emergency Alert Modal */}
      {showBroadcastModal && (
        <div
          id="broadcast-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-slate-800 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 text-red-600">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Broadcast Hospital Emergency Alert
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instantly notifies verified donors matching requested phenotype
                  </p>
                </div>
              </div>
              <button
                id="close-broadcast-modal-btn"
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Requesting Hospital Facility
                </label>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value="St. Jude Level 1 Trauma Center">
                    St. Jude Level 1 Trauma Center
                  </option>
                  <option value="Metropolitan Pediatric Center">
                    Metropolitan Pediatric Center
                  </option>
                  <option value="Mercy General Cardiac Institute">
                    Mercy General Cardiac Institute
                  </option>
                  <option value="Downtown Emergency Pavilion">
                    Downtown Emergency Pavilion
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Blood Type Needed
                  </label>
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value as BloodType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-extrabold"
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
                    Units Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-red-600"
                  >
                    <option value="CRITICAL">CODE RED (Immediate &lt; 1 hr)</option>
                    <option value="HIGH">HIGH (&lt; 4 hrs)</option>
                    <option value="MODERATE">MODERATE (&lt; 12 hrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Required Within (Hours)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={deadlineHours}
                    onChange={(e) => setDeadlineHours(parseFloat(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Clinical Context &amp; Patient Reason
                </label>
                <textarea
                  rows={2}
                  value={clinicalContext}
                  onChange={(e) => setClinicalContext(e.target.value)}
                  placeholder="e.g. Acute maternal hemorrhage in surgical labor suite"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-[11px] leading-relaxed">
                <strong>Broadcast Rule:</strong> This alert will trigger push notifications to all verified, eligible {selectedBloodType} donors located within 10 miles of {selectedHospital}.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="submit-broadcast-alert-btn"
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20"
                >
                  Fire Emergency Alert Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
