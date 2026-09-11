import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  UserCheck,
  ShieldCheck,
  QrCode,
  Heart,
  Fingerprint,
  Lock,
  Unlock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Activity,
  Weight,
  Thermometer,
  Eye,
  EyeOff,
  Sparkles,
  FileCheck,
  Maximize2
} from 'lucide-react';
import { DonorProfile as DonorProfileType } from '../types';
import { QRCodePassModal } from './QRCodePassModal';

interface DonorProfileProps {
  profile: DonorProfileType;
  onUpdateProfile: (updated: Partial<DonorProfileType>) => void;
  onRequestBiometricVerification: () => void;
  isBiometricLocked: boolean;
  onToggleBiometricLock: () => void;
}

export const DonorProfile: React.FC<DonorProfileProps> = ({
  profile,
  onUpdateProfile,
  onRequestBiometricVerification,
  isBiometricLocked,
  onToggleBiometricLock
}) => {
  const [editingVitals, setEditingVitals] = useState(false);
  const [hemoglobin, setHemoglobin] = useState(profile.hemoglobinLevel);
  const [weight, setWeight] = useState(profile.weightKg);
  const [showSensitiveData, setShowSensitiveData] = useState(!isBiometricLocked);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const payload = `${window.location.origin}/verify?id=${profile.verificationBadgeId}&donor=${encodeURIComponent(
      profile.fullName
    )}&blood=${profile.bloodType}&status=CERTIFIED`;

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [profile]);

  // Check eligibility logic dynamically
  const isHemoEligible = hemoglobin >= 12.5;
  const isWeightEligible = weight >= 50;
  const isFullyEligible = profile.cooldownDaysRemaining === 0 && isHemoEligible && isWeightEligible;

  const handleSaveVitals = () => {
    onUpdateProfile({
      hemoglobinLevel: hemoglobin,
      weightKg: weight,
      isEligibleNow: isFullyEligible
    });
    setEditingVitals(false);
  };

  return (
    <div className="space-y-6">
      {/* Verification Status Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-red-600/20">
              {profile.bloodType}
            </div>
            {profile.isVerified && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white"
                title="Verified Donor Profile"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900">{profile.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified Donor Badge
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Badge Credential ID: {profile.verificationBadgeId}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {profile.idDocumentType} • Verified by Blood Transfusion Council on {profile.verifiedAt}
            </p>
          </div>
        </div>

        {/* Biometric Privacy Controls */}
        <div className="flex items-center gap-2.5 shrink-0 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <button
            id="toggle-biometric-lock-btn"
            onClick={onToggleBiometricLock}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isBiometricLocked
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isBiometricLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Vault Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lock with Biometrics</span>
              </>
            )}
          </button>

          <button
            id="test-biometric-auth-btn"
            onClick={onRequestBiometricVerification}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors"
          >
            <Fingerprint className="w-3.5 h-3.5 text-red-400" />
            <span>Verify FaceID / TouchID</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Digital Pass & Clinical Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Digital Fast-Track Pass Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hospital Fast-Track Pass
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-700">
                Triage Pre-Cleared
              </span>
            </div>

            {/* QR Visual */}
            <div className="p-4 bg-slate-900 rounded-2xl text-center text-white relative group">
              <div className="w-44 h-44 mx-auto bg-white p-2 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Verified Donor QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-36 h-36 text-slate-900" />
                )}
              </div>
              <p className="font-mono text-xs font-bold mt-3 text-slate-200">
                {profile.verificationBadgeId}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                Encrypted with Donor Private Key
              </span>

              <button
                id="enlarge-qr-pass-btn"
                onClick={() => setIsQRModalOpen(true)}
                className="mt-3 w-full py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Enlarge &amp; Download Pass</span>
              </button>
            </div>

            {/* Quick Card Specs */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Blood Phenotype</span>
                <span className="font-bold text-slate-900">{profile.bloodType} Rh-Negative</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Total Lives Saved</span>
                <span className="font-bold text-red-600">{profile.livesSaved} direct recipients</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Biometric Key Standard</span>
                <span className="font-bold text-slate-900">WebAuthn / FIDO2 Level 2</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Present this pass at any accredited emergency room or bloodmobile.
            </span>
          </div>
        </div>

        {/* Clinical Eligibility & Health Vitals (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Clinical Eligibility Engine</h3>
              <p className="text-xs text-slate-500">
                Real-time FDA/AABB medical safety criteria monitoring
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                  isFullyEligible
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isFullyEligible ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Eligible to Donate Today
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Deferred (Recovery Cooldown Active)
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hemoglobin */}
            <div
              className={`p-4 rounded-2xl border ${
                isHemoEligible
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Hemoglobin</span>
                <Activity className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {hemoglobin} <span className="text-xs font-normal text-slate-500">g/dL</span>
              </div>
              <div className="text-[11px] font-semibold mt-1">
                {isHemoEligible ? (
                  <span className="text-emerald-700">✓ Passes (Min 12.5 g/dL)</span>
                ) : (
                  <span className="text-red-700">✕ Low Hemoglobin</span>
                )}
              </div>
            </div>

            {/* Weight */}
            <div
              className={`p-4 rounded-2xl border ${
                isWeightEligible
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Donor Weight</span>
                <Weight className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {weight} <span className="text-xs font-normal text-slate-500">kg</span>
              </div>
              <div className="text-[11px] font-semibold mt-1">
                {isWeightEligible ? (
                  <span className="text-emerald-700">✓ Passes (Min 50 kg)</span>
                ) : (
                  <span className="text-red-700">✕ Below 50 kg requirement</span>
                )}
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Blood Pressure</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {profile.bloodPressure}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                ✓ Normal Resting Range
              </div>
            </div>

            {/* Pulse */}
            <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Pulse Rate</span>
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {profile.pulseBpm} <span className="text-xs font-normal text-slate-500">bpm</span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                ✓ Regular Rhythm (50-100)
              </div>
            </div>
          </div>

          {/* Interactive Vitals Adjuster (Simulate test lab screening updates) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Simulate Lab Screening Update (Interactive Verification)
              </span>
              {!editingVitals ? (
                <button
                  id="edit-vitals-btn"
                  onClick={() => setEditingVitals(true)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Adjust Lab Values
                </button>
              ) : (
                <button
                  id="save-vitals-btn"
                  onClick={handleSaveVitals}
                  className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Save Updates
                </button>
              )}
            </div>

            {editingVitals && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Hemoglobin Level (g/dL): {hemoglobin}
                  </label>
                  <input
                    type="range"
                    min="10.0"
                    max="18.0"
                    step="0.1"
                    value={hemoglobin}
                    onChange={(e) => setHemoglobin(parseFloat(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <span className="text-[10px] text-slate-400">
                    Threshold: &gt;= 12.5 g/dL required for blood donation
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Donor Weight (kg): {weight}
                  </label>
                  <input
                    type="range"
                    min="45"
                    max="110"
                    step="1"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <span className="text-[10px] text-slate-400">
                    Threshold: &gt;= 50 kg (110 lbs) required
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Cooldown Interval Timeline */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3 text-xs text-blue-950">
            <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-blue-900">
                56-Day Whole Blood Donation Cycle
              </div>
              <p className="mt-0.5 text-blue-800 leading-relaxed">
                Last Whole Blood Donation was completed on <strong>{profile.lastDonationDate}</strong>.
                Standard 56-day physiological iron recovery interval elapsed on <strong>{profile.eligibleDate}</strong>. You are currently in active standby for regional emergency requests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Pass Modal */}
      <QRCodePassModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        donorProfile={profile}
      />
    </div>
  );
};
