import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Droplets,
  Calendar,
  Sparkles,
  Copy,
  Printer
} from 'lucide-react';
import { DonorProfile } from '../types';

interface QRCodePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorProfile: DonorProfile;
}

export type QRPassType = 'TRIAGE_FASTPASS' | 'APPOINTMENT_TOKEN' | 'EMERGENCY_ICE';

export const QRCodePassModal: React.FC<QRCodePassModalProps> = ({
  isOpen,
  onClose,
  donorProfile
}) => {
  const [passType, setPassType] = useState<QRPassType>('TRIAGE_FASTPASS');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate payload string based on selected pass type
  const getPayload = (type: QRPassType) => {
    const baseUrl = window.location.origin;
    if (type === 'TRIAGE_FASTPASS') {
      return `${baseUrl}/verify?id=${donorProfile.verificationBadgeId}&donor=${encodeURIComponent(
        donorProfile.fullName
      )}&blood=${donorProfile.bloodType}&status=CERTIFIED&ts=${Date.now()}`;
    }
    if (type === 'APPOINTMENT_TOKEN') {
      return JSON.stringify({
        token: donorProfile.verificationBadgeId,
        type: 'APPOINTMENT_WALKIN',
        bloodGroup: donorProfile.bloodType,
        hemoglobin: donorProfile.hemoglobinLevel,
        cleared: donorProfile.isEligibleNow
      });
    }
    return `ICE-MEDICAL: Donor=${donorProfile.fullName}, Blood=${donorProfile.bloodType}, Phone=${donorProfile.phone}, Verified=${donorProfile.verificationBadgeId}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const payload = getPayload(passType);
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
  }, [isOpen, passType, donorProfile]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `HemoNet-QR-Pass-${donorProfile.verificationBadgeId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPayload(passType));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="qr-code-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        id="qr-code-modal-card"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 text-slate-800 relative max-h-[92vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Verified Digital QR Fast-Pass
              </h3>
              <p className="text-xs text-slate-500">
                Instantly scannable by hospital reception &amp; triage
              </p>
            </div>
          </div>
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Pass Type Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-4 text-xs font-bold">
          {[
            { id: 'TRIAGE_FASTPASS', label: 'Triage Fast-Pass' },
            { id: 'APPOINTMENT_TOKEN', label: 'Check-In Token' },
            { id: 'EMERGENCY_ICE', label: 'Medical ICE' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`qr-tab-${tab.id}`}
              onClick={() => setPassType(tab.id as QRPassType)}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                passType === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scannable Pass Graphic Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-5 text-center shadow-md relative overflow-hidden">
          {/* Subtle Top Band */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>AABB Accredited</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-red-400" />
              <span className="font-extrabold text-white text-sm">{donorProfile.bloodType}</span>
            </div>
          </div>

          {/* Actual Scannable QR Code Canvas / Image */}
          <div className="inline-block p-3 bg-white rounded-2xl shadow-inner mx-auto mb-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scannable Donor QR Code"
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                Generating secure QR code...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-black tracking-tight text-white">
              {donorProfile.fullName}
            </h4>
            <div className="font-mono text-xs text-amber-300 font-bold">
              ID: {donorProfile.verificationBadgeId}
            </div>
            <p className="text-[11px] text-slate-300 pt-1">
              Universal Red Blood Cell Donor • Hemoglobin {donorProfile.hemoglobinLevel} g/dL
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button
            id="download-qr-code-btn"
            onClick={handleDownload}
            className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Save Image / Pass</span>
          </button>

          <button
            id="copy-qr-payload-btn"
            onClick={handleCopyLink}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied Token!' : 'Copy Verification Link'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 text-center mt-4">
          Hospital triage nurses can scan this barcode using any optical medical terminal or mobile smartphone scanner.
        </p>
      </div>
    </div>
  );
};
