import React from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle, ShieldAlert, Heart, ArrowRight } from 'lucide-react';
import { EmergencyAlert, BloodType } from '../types';
import { BLOOD_COMPATIBILITY } from '../data/mockData';

interface EmergencyAlertBannerProps {
  alert: EmergencyAlert;
  userBloodType: BloodType;
  isUserEligible: boolean;
  onRespond: (alertId: string) => void;
  onViewDetails: (alert: EmergencyAlert) => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  alert,
  userBloodType,
  isUserEligible,
  onRespond,
  onViewDetails
}) => {
  const isExactMatch = alert.bloodTypeNeeded === userBloodType;
  const userCompatibility = BLOOD_COMPATIBILITY[userBloodType];
  const isCompatible = isExactMatch || userCompatibility.canGiveTo.includes(alert.bloodTypeNeeded);

  const hasUserResponded = alert.donorResponses.some(
    (d) => d.donorName.includes('Alex') || d.donorId === 'donor_alex_01'
  );

  const isCritical = alert.urgency === 'CRITICAL';

  return (
    <div
      id={`emergency-alert-card-${alert.id}`}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-md ${
        isCritical
          ? 'bg-gradient-to-r from-red-50 via-rose-50 to-white border-red-300 ring-1 ring-red-400/30'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Top urgency strip */}
      <div
        className={`px-4 py-2 flex items-center justify-between text-xs font-bold ${
          isCritical
            ? 'bg-red-600 text-white'
            : 'bg-amber-600 text-white'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>
            {isCritical ? 'CODE RED: IMMEDIATE EMERGENCY BROADCAST' : 'URGENT BLOOD DEFICIT ALERT'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Needed within {alert.deadlineHours} hrs</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-extrabold text-sm tracking-wide">
                Type Needed: {alert.bloodTypeNeeded}
              </span>

              {/* Compatibility Match Tag */}
              {isCompatible && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {isExactMatch ? 'Exact Blood Match!' : 'You Are Compatible!'}
                </span>
              )}

              <span className="text-xs text-slate-500 font-medium">
                Issued {alert.createdAt}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
              {alert.hospitalName}
            </h3>

            <p className="text-sm text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>{alert.hospitalAddress}</span>
              <span className="font-semibold text-slate-900">({alert.distanceMiles} miles away)</span>
            </p>

            <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-xs text-red-900">
              <span className="font-semibold">Clinical Priority: </span>
              <span>{alert.patientContext}</span>
            </div>
          </div>

          {/* Units Progress Counter */}
          <div className="sm:text-right shrink-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
            <div className="text-xs text-slate-700 font-medium mb-1">Fulfillment Target</div>
            <div className="text-2xl font-black text-slate-900">
              <span className="text-red-600">{alert.unitsFulfilled}</span>
              <span className="text-slate-400 font-normal"> / {alert.unitsNeeded} units</span>
            </div>
            {/* Progress bar */}
            <div className="w-32 sm:w-36 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden sm:ml-auto">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (alert.unitsFulfilled / alert.unitsNeeded) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>
              {alert.donorResponses.length > 0
                ? `${alert.donorResponses.length} verified donor(s) currently en route`
                : 'Awaiting first verified donor response'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`view-alert-details-${alert.id}`}
              onClick={() => onViewDetails(alert)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Center Info
            </button>

            {hasUserResponded ? (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20">
                <CheckCircle className="w-4 h-4" />
                <span>You Responded (En Route)</span>
              </div>
            ) : (
              <button
                id={`respond-to-alert-${alert.id}`}
                onClick={() => onRespond(alert.id)}
                disabled={!isUserEligible && !isCompatible}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                  !isUserEligible
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                    : isCompatible
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25 active:scale-95'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>
                  {!isUserEligible
                    ? 'Ineligible (Cooldown Active)'
                    : isCompatible
                    ? 'I Can Donate Now (Dispatch)'
                    : 'Dispatch Offer'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
