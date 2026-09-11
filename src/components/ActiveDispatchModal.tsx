import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Heart,
  Award,
  ArrowRight
} from 'lucide-react';
import { EmergencyAlert, DonorProfile } from '../types';

interface ActiveDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: EmergencyAlert;
  donorProfile: DonorProfile;
  onCompleteDonation: () => void;
}

export const ActiveDispatchModal: React.FC<ActiveDispatchModalProps> = ({
  isOpen,
  onClose,
  alert,
  donorProfile,
  onCompleteDonation
}) => {
  const [dispatchStep, setDispatchStep] = useState<'EN_ROUTE' | 'ARRIVED' | 'DONATING' | 'COMPLETED'>('EN_ROUTE');
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const payload = `${window.location.origin}/hospital-triage?badge=${donorProfile.verificationBadgeId}&alert=${alert.id}&donor=${encodeURIComponent(donorProfile.fullName)}&blood=${donorProfile.bloodType}&status=FAST_TRACK`;

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [alert, donorProfile]);

  if (!isOpen) return null;

  return (
    <div
      id="active-dispatch-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        id="active-dispatch-modal-card"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-slate-800 relative max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Emergency Dispatch Active
              </h3>
              <p className="text-xs text-slate-500">
                Hospital Trauma Desk Notified
              </p>
            </div>
          </div>
          <button
            id="close-dispatch-modal-btn"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-4 gap-1.5 mb-6 text-center">
          {[
            { id: 'EN_ROUTE', label: '1. En Route' },
            { id: 'ARRIVED', label: '2. Check-In' },
            { id: 'DONATING', label: '3. Phlebotomy' },
            { id: 'COMPLETED', label: '4. Done' }
          ].map((s, idx) => {
            const steps = ['EN_ROUTE', 'ARRIVED', 'DONATING', 'COMPLETED'];
            const currentIndex = steps.indexOf(dispatchStep);
            const thisIndex = steps.indexOf(s.id);
            const isDone = thisIndex <= currentIndex;
            return (
              <div
                key={s.id}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all ${
                  isDone
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s.label}
              </div>
            );
          })}
        </div>

        {/* Destination Information */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Emergency Recipient Facility
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-0.5">
                {alert.hospitalName}
              </h4>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{alert.hospitalAddress}</span>
              </p>
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-700 font-extrabold text-sm rounded-lg">
              {alert.bloodTypeNeeded}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Est. Transit: ~14 mins</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified VIP Fast-Track</span>
            </div>
          </div>
        </div>

        {/* Dynamic Step Content */}
        {dispatchStep === 'EN_ROUTE' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Navigation className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5 font-bold">Directions &amp; Gate Access:</strong>
                Follow University Ave to Emergency Entrance Gate B. Proceed directly to 2nd Floor Blood Bank. Security has your digital token.
              </div>
            </div>

            <button
              id="confirm-arrival-btn"
              onClick={() => setDispatchStep('ARRIVED')}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all"
            >
              <span>I Have Arrived at the Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {dispatchStep === 'ARRIVED' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-600 mb-2 font-medium">
                Show this Verified Fast-Pass QR Code to the Triage Nurse:
              </p>

              {/* Digital QR / Pass Card */}
              <div className="inline-block p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-36 h-36 mx-auto bg-white p-1 rounded-lg flex items-center justify-center text-slate-900 border border-slate-200 overflow-hidden shadow-inner">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Triage Barcode Pass"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-28 h-28" />
                  )}
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-slate-800">
                  {donorProfile.verificationBadgeId}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified {donorProfile.bloodType} Donor</span>
                </div>
              </div>
            </div>

            <button
              id="start-donation-btn"
              onClick={() => setDispatchStep('DONATING')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all"
            >
              <span>Checked-In: Begin Phlebotomy Procedure</span>
              <Heart className="w-4 h-4 fill-white" />
            </button>
          </div>
        )}

        {dispatchStep === 'DONATING' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 fill-red-600 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Donation in Progress</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                A standard whole blood donation takes approximately 8–10 minutes. Relax and stay hydrated!
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 max-w-xs mx-auto">
              <div>Batch ID: #BLOOD-TX-{Date.now().toString().slice(-6)}</div>
              <div>Component: Whole Blood (450 mL)</div>
            </div>

            <button
              id="finalize-donation-btn"
              onClick={() => {
                setDispatchStep('COMPLETED');
                onCompleteDonation();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Donation &amp; Collect Rewards</span>
            </button>
          </div>
        )}

        {dispatchStep === 'COMPLETED' && (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-10 h-10" />
            </div>
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                Heroic Contribution Logged!
              </span>
              <h4 className="font-extrabold text-slate-900 text-2xl mt-2">
                Thank You, {donorProfile.fullName}!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1">
                Your unit of {donorProfile.bloodType} blood is now being cross-matched for the emergency trauma patient.
              </p>
            </div>

            {/* Rewards awarded breakdown */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-left max-w-sm mx-auto">
              <div className="font-bold text-xs text-amber-900 uppercase tracking-wider mb-2">
                Rewards Credited to Your Account:
              </div>
              <div className="flex items-center justify-between text-sm py-1 border-b border-amber-200/50">
                <span className="text-slate-700">Emergency Dispatch Bonus</span>
                <span className="font-bold text-amber-700">+350 pts</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1 border-b border-amber-200/50">
                <span className="text-slate-700">Lives Saved Impact</span>
                <span className="font-bold text-red-600">+3 Lives</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1">
                <span className="text-slate-700">Next Eligible Date</span>
                <span className="font-bold text-slate-900">56-day Recovery</span>
              </div>
            </div>

            <button
              id="finish-dispatch-dialog-btn"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
