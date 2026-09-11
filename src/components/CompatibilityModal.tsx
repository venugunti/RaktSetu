import React, { useState } from 'react';
import { BloodType } from '../types';
import { BLOOD_COMPATIBILITY } from '../data/mockData';
import { Check, X, Info, Heart, ArrowRight, Shield } from 'lucide-react';

interface CompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBloodType: BloodType;
}

const ALL_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CompatibilityModal: React.FC<CompatibilityModalProps> = ({
  isOpen,
  onClose,
  userBloodType
}) => {
  const [selectedType, setSelectedType] = useState<BloodType>(userBloodType);

  if (!isOpen) return null;

  const info = BLOOD_COMPATIBILITY[selectedType];

  return (
    <div
      id="compatibility-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        id="compatibility-modal-card"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-slate-800 relative max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-red-700">
              <Heart className="w-5 h-5 fill-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Blood Compatibility Matrix</h3>
              <p className="text-xs text-slate-600">Know your life-saving matching potential</p>
            </div>
          </div>
          <button
            id="close-compatibility-modal-btn"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Blood Type Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Select Blood Group to Inspect:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {ALL_TYPES.map((bt) => {
              const isSelected = selectedType === bt;
              const isUser = userBloodType === bt;
              return (
                <button
                  key={bt}
                  id={`select-compat-type-${bt.replace('+', 'pos').replace('-', 'neg')}`}
                  onClick={() => setSelectedType(bt)}
                  className={`py-2 px-1 rounded-xl text-center font-bold text-sm transition-all relative ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/25 ring-2 ring-red-600 ring-offset-1'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {bt}
                  {isUser && (
                    <span className="block text-[10px] font-normal leading-tight opacity-90">
                      (You)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Type Highlighting Card */}
        <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="px-3 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xl">
              {selectedType}
            </div>
            <div>
              <h4 className="font-bold text-red-950 text-base">
                {selectedType === 'O-'
                  ? 'Universal Red Blood Cell Donor'
                  : selectedType === 'AB+'
                  ? 'Universal Red Blood Cell Recipient'
                  : `Blood Group ${selectedType}`}
              </h4>
              <p className="text-sm text-red-900 mt-1 leading-relaxed">
                {info.description}
              </p>
            </div>
          </div>
        </div>

        {/* Recipient & Donor Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Can give red cells to */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-4 h-4 text-emerald-600" />
              <h5 className="font-semibold text-slate-900 text-sm">
                Can Give Red Cells To ({info.canGiveTo.length} types):
              </h5>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TYPES.map((bt) => {
                const canGive = info.canGiveTo.includes(bt);
                return (
                  <span
                    key={bt}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      canGive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200/70 text-slate-400 opacity-60'
                    }`}
                  >
                    {canGive ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3" />}
                    {bt}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Can receive red cells from */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-600" />
              <h5 className="font-semibold text-slate-900 text-sm">
                Can Receive Red Cells From ({info.canReceiveFrom.length} types):
              </h5>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TYPES.map((bt) => {
                const canReceive = info.canReceiveFrom.includes(bt);
                return (
                  <span
                    key={bt}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      canReceive
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-slate-200/70 text-slate-400 opacity-60'
                    }`}
                  >
                    {canReceive ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3" />}
                    {bt}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Informational Tip */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Note for Plasma Donors:</strong> Plasma compatibility is the reverse of red blood cells. AB+ is the universal plasma donor, while O- is the universal plasma recipient.
          </p>
        </div>
      </div>
    </div>
  );
};
