import React, { useState } from 'react';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Droplets,
  ShieldCheck,
  Clock,
  ArrowRight,
  ScanLine
} from 'lucide-react';
import { DonorProfile } from '../types';

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorProfile: DonorProfile;
  onAdmitDonor: (donorName: string, bloodType: string) => void;
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({
  isOpen,
  onClose,
  donorProfile,
  onAdmitDonor
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    id: string;
    fullName: string;
    bloodType: string;
    hemoglobin: number;
    status: string;
    verifiedAt: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        id: donorProfile.verificationBadgeId,
        fullName: donorProfile.fullName,
        bloodType: donorProfile.bloodType,
        hemoglobin: donorProfile.hemoglobinLevel,
        status: 'CERTIFIED_VERIFIED',
        verifiedAt: new Date().toLocaleTimeString()
      });
    }, 1200);
  };

  const handleConfirmAdmission = () => {
    if (scanResult) {
      onAdmitDonor(scanResult.fullName, scanResult.bloodType);
      onClose();
    }
  };

  return (
    <div
      id="qr-scanner-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        id="qr-scanner-modal-card"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 text-slate-800 relative max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Hospital QR Fast-Pass Scanner
              </h3>
              <p className="text-xs text-slate-500">
                Admit arriving donors &amp; check serology records
              </p>
            </div>
          </div>
          <button
            id="close-qr-scanner-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center p-6 text-center text-white mb-5 shadow-inner">
          {/* Scanning frame guides */}
          <div className="w-48 h-48 border-2 border-dashed border-red-400/70 rounded-2xl relative flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-red-500 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-red-500 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-lg" />

            {isScanning ? (
              <div className="w-full h-1 bg-red-500 shadow-md shadow-red-500 animate-pulse" />
            ) : scanResult ? (
              <div className="flex flex-col items-center text-emerald-400 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12" />
                <span className="text-xs font-bold mt-1">Barcode Decoded</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 px-4">
                Align donor smartphone QR pass inside viewfinder
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-slate-300 font-medium">
            {isScanning
              ? 'Decoding optical cryptographic payload...'
              : scanResult
              ? 'Matching donor records in Regional Registry'
              : 'Camera Ready • Autofocus Active'}
          </div>
        </div>

        {/* Action button to test scan */}
        {!scanResult ? (
          <button
            id="simulate-scan-qr-btn"
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ScanLine className="w-4 h-4" />
            <span>{isScanning ? 'Scanning...' : 'Scan Donor QR Pass'}</span>
          </button>
        ) : (
          /* Verification Result Box */
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-700">
                    Verified Donor Found
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {scanResult.fullName}
                  </h4>
                  <div className="font-mono text-[11px] text-slate-600">
                    {scanResult.id}
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-red-600 text-white font-black text-sm rounded-lg">
                  {scanResult.bloodType}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-500 block">Hemoglobin:</span>
                  <span className="font-bold">{scanResult.hemoglobin} g/dL (Pass)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Medical Clearance:</span>
                  <span className="font-bold text-emerald-700">All Clear</span>
                </div>
              </div>
            </div>

            <button
              id="confirm-admission-btn"
              onClick={handleConfirmAdmission}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Admit Donor to Phlebotomy Bed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
