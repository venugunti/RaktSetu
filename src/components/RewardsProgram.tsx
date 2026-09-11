import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Gift,
  Heart,
  Droplets,
  Star,
  CheckCircle2,
  Lock,
  Download,
  Flame,
  Globe,
  Sparkles,
  Zap,
  Coffee,
  Activity,
  Bus,
  ShieldCheck
} from 'lucide-react';
import { DonorBadge, DonorProfile, RewardPerk } from '../types';

interface RewardsProgramProps {
  donorProfile: DonorProfile;
  badges: DonorBadge[];
  perks: RewardPerk[];
  onRedeemPerk: (perkId: string, cost: number) => void;
}

export const RewardsProgram: React.FC<RewardsProgramProps> = ({
  donorProfile,
  badges,
  perks,
  onRedeemPerk
}) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'HEALTH' | 'TRANSPORT' | 'WELLNESS' | 'COMMUNITY'>('ALL');

  // Tier calculations
  const nextTierPoints = 2000;
  const currentTierPoints = 1000;
  const pointsProgress = Math.min(
    100,
    Math.max(0, ((donorProfile.rewardPoints - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100)
  );

  const filteredPerks = perks.filter((p) => {
    if (filterCategory === 'ALL') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="space-y-8">
      {/* Top Hero Banner / Tier Status */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                {donorProfile.tier} Sentinel Tier
              </span>
              <span className="text-xs text-slate-300">
                Member since Aug 2025
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Life Points &amp; Donor Rewards
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mt-1 leading-relaxed">
              Every drop makes an immediate clinical impact. Earn points through scheduled donations, rapid emergency responses, and milestone consistency.
            </p>
          </div>

          {/* Points Counter Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center shrink-0 min-w-[200px]">
            <div className="text-xs uppercase font-bold text-amber-300 tracking-wider">
              Available Balance
            </div>
            <div className="text-4xl font-extrabold text-white mt-1 flex items-center justify-center gap-1">
              <Award className="w-7 h-7 text-amber-400" />
              <span>{donorProfile.rewardPoints}</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Lifetime: {(donorProfile.totalDonations * 300) + 700} pts earned
            </div>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-amber-300">Current: Gold Sentinel ({donorProfile.rewardPoints} pts)</span>
            <span className="text-slate-300">Next: Platinum Champion (2,000 pts)</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${pointsProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
            <span>{nextTierPoints - donorProfile.rewardPoints} points remaining to Platinum tier</span>
            <span>+15% Bonus on emergency alerts at Platinum</span>
          </div>
        </div>

        {/* Quick Impact Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-red-400">{donorProfile.totalDonations}</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Verified Donations</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-emerald-400">{donorProfile.livesSaved}</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Direct Lives Saved</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-amber-400">2,700 mL</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Whole Blood Contributed</div>
          </div>
        </div>
      </div>

      {/* Official Certificate Commendation Action */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-amber-950 text-base">
              Official Lifesaver Commendation Certificate
            </h4>
            <p className="text-xs text-amber-800">
              State Certified Verification of your 6 blood donations and 18 lives saved.
            </p>
          </div>
        </div>

        <button
          id="view-certificate-btn"
          onClick={() => setShowCertificateModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>View Commendation Pass</span>
        </button>
      </div>

      {/* Earned Badges Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Milestone Badges</h3>
            <p className="text-xs text-slate-500">Achievements honoring your consistency and bravery</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
            {badges.filter((b) => b.earned).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              id={`badge-card-${badge.id}`}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                badge.earned
                  ? 'bg-white border-slate-200 shadow-xs hover:border-amber-400'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  badge.earned
                    ? badge.rarity === 'Legendary'
                      ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-300'
                      : badge.rarity === 'Epic'
                      ? 'bg-purple-100 text-purple-600 ring-2 ring-purple-300'
                      : 'bg-red-100 text-red-600'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {badge.earned ? (
                  badge.iconName === 'Droplet' ? (
                    <Droplets className="w-6 h-6" />
                  ) : badge.iconName === 'Globe' ? (
                    <Globe className="w-6 h-6" />
                  ) : badge.iconName === 'Flame' ? (
                    <Flame className="w-6 h-6" />
                  ) : badge.iconName === 'Trophy' ? (
                    <Trophy className="w-6 h-6" />
                  ) : badge.iconName === 'ShieldCheck' ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : (
                    <Star className="w-6 h-6" />
                  )
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>

              <div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    badge.rarity === 'Legendary'
                      ? 'bg-amber-100 text-amber-800'
                      : badge.rarity === 'Epic'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {badge.rarity}
                </span>
                <h5 className="font-bold text-xs text-slate-900 mt-1">{badge.title}</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">
                  {badge.description}
                </p>
              </div>

              <div className="mt-3 text-[10px] font-semibold">
                {badge.earned ? (
                  <span className="text-emerald-600 flex items-center gap-0.5 justify-center">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-slate-400">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog & Perk Redemption */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Redeem Life Points</h3>
            <p className="text-xs text-slate-500">
              Wellness perks, health screenings, and community partner privileges
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'HEALTH', 'TRANSPORT', 'FOOD', 'WELLNESS'].map((cat) => (
              <button
                key={cat}
                id={`perk-cat-${cat}`}
                onClick={() => setFilterCategory(cat as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPerks.map((perk) => {
            const canAfford = donorProfile.rewardPoints >= perk.pointsCost;

            return (
              <div
                key={perk.id}
                id={`reward-perk-card-${perk.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {perk.partner}
                    </span>
                    <span className="font-extrabold text-sm text-amber-600 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {perk.pointsCost} pts
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2.5">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {perk.isRedeemed ? (
                    <div className="w-full text-center py-2 px-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                      <div>Redeemed • Code: {perk.code || 'HEMO-PASS-99'}</div>
                    </div>
                  ) : (
                    <button
                      id={`redeem-perk-btn-${perk.id}`}
                      onClick={() => onRedeemPerk(perk.id, perk.pointsCost)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95 shadow-xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{canAfford ? 'Redeem Voucher' : `Need ${perk.pointsCost - donorProfile.rewardPoints} more pts`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && (
        <div
          id="certificate-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-xl bg-white rounded-3xl p-8 border-4 border-amber-400/60 shadow-2xl text-slate-800 relative">
            <button
              id="close-certificate-modal-btn"
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-amber-200/70 pb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto ring-4 ring-amber-300">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700">
                Department of Health &amp; Emergency Transfusion Services
              </span>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                Certificate of Life-Saving Distinction
              </h3>
              <p className="text-xs text-slate-500">
                Credential ID: {donorProfile.verificationBadgeId}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="py-6 text-center space-y-3">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                This commendation is officially conferred upon
              </p>
              <h4 className="text-3xl font-extrabold text-slate-900">
                {donorProfile.fullName}
              </h4>
              <div className="inline-block px-3 py-1 bg-red-100 text-red-700 font-extrabold text-sm rounded-full">
                Universal Blood Group {donorProfile.bloodType}
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                In recognition of consistent, voluntary dedication to community welfare. Having successfully completed <strong>{donorProfile.totalDonations} verified blood donations</strong>, directly preserving and saving <strong>{donorProfile.livesSaved} human lives</strong> across metropolitan trauma centers.
              </p>
            </div>

            {/* Certificate Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="text-left">
                <div className="font-bold text-slate-800">Dr. Helena Vance, MD</div>
                <div className="text-[10px]">Medical Director of Transfusion Medicine</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="print-certificate-btn"
                  onClick={() => alert('Certificate saved to digital health pass!')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Pass</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
