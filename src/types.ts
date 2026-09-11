export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE';

export type DonationType = 'Whole Blood' | 'Platelets' | 'Plasma' | 'Double Red Cells';

export interface EmergencyAlert {
  id: string;
  hospitalName: string;
  hospitalAddress: string;
  distanceMiles: number;
  bloodTypeNeeded: BloodType;
  unitsNeeded: number;
  unitsFulfilled: number;
  urgency: UrgencyLevel;
  patientContext: string; // e.g., 'Emergency Trauma Surgery'
  deadlineHours: number; // e.g. 2 hours remaining
  createdAt: string;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED';
  coordinates: { x: number; y: number; lat: number; lng: number };
  donorResponses: {
    donorId: string;
    donorName: string;
    bloodType: BloodType;
    status: 'RESPONDED' | 'EN_ROUTE' | 'ARRIVED' | 'DONATING' | 'COMPLETED';
    etaMinutes: number;
  }[];
}

export interface DonorProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  isVerified: boolean;
  verificationBadgeId: string;
  idDocumentType: string;
  verifiedAt: string;
  lastDonationDate: string; // YYYY-MM-DD
  cooldownDaysRemaining: number;
  eligibleDate: string;
  isEligibleNow: boolean;
  hemoglobinLevel: number; // e.g. 14.5 g/dL (min 12.5)
  weightKg: number;
  bloodPressure: string;
  pulseBpm: number;
  biometricEnabled: boolean;
  biometricType: 'FaceID' | 'TouchID' | 'Passkey';
  rewardPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Hero';
  totalDonations: number;
  livesSaved: number;
  currentLocation: { lat: number; lng: number; area: string };
}

export interface DonationCenter {
  id: string;
  name: string;
  type: 'Hospital Trauma Center' | 'Regional Blood Bank' | 'Mobile Bloodmobile';
  address: string;
  distanceMiles: number;
  coordinates: { x: number; y: number; lat: number; lng: number }; // normalized x,y (0-100%) for canvas/SVG map
  phone: string;
  hours: string;
  isOpenNow: boolean;
  walkInsWelcome: boolean;
  criticalNeeds: BloodType[];
  currentStockLevels: Record<BloodType, 'CRITICAL' | 'LOW' | 'OPTIMAL' | 'SURPLUS'>;
  availableSlotsToday: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'DONOR' | 'HOSPITAL_STAFF' | 'SYSTEM';
  hospitalName?: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  attachmentType?: 'LAB_REPORT' | 'DISPATCH_PASS' | 'LOCATION';
  attachmentTitle?: string;
}

export interface RewardPerk {
  id: string;
  title: string;
  description: string;
  category: 'HEALTH' | 'WELLNESS' | 'TRANSPORT' | 'FOOD' | 'COMMUNITY';
  pointsCost: number;
  isRedeemed: boolean;
  partner: string;
  iconName: string;
  code?: string;
}

export interface DonorBadge {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  iconName: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface BloodSupplyInventory {
  bloodType: BloodType;
  unitsInStock: number;
  safeCapacity: number;
  demandRatePerHour: number;
  status: 'CRITICAL' | 'LOW' | 'HEALTHY' | 'SURPLUS';
  compatibleRecipients: BloodType[];
  compatibleDonors: BloodType[];
}

export interface DonorVerificationCandidate {
  id: string;
  fullName: string;
  bloodType: BloodType;
  email: string;
  phone: string;
  submittedAt: string;
  idDocumentType: 'Passport' | 'Driver License' | 'National ID';
  idDocumentNumber: string;
  hemoglobinLevel: number;
  weightKg: number;
  medicalScreeningPassed: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: 'ADMIN' | 'TRAUMA_COORDINATOR' | 'PHLEBOTOMIST' | 'SYSTEM';
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
}
