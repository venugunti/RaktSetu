import {
  BloodSupplyInventory,
  DonationCenter,
  DonorBadge,
  DonorProfile,
  EmergencyAlert,
  RewardPerk,
  BloodType
} from '../types';

export const BLOOD_COMPATIBILITY: Record<
  BloodType,
  { canGiveTo: BloodType[]; canReceiveFrom: BloodType[]; description: string }
> = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    description: 'Universal Red Blood Cell Donor! In highest demand in emergency rooms worldwide.'
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    description: 'Most common blood type in the population. Vital for surgical suites.'
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    description: 'Rare blood type. Highly valued for oncology and emergency transfusions.'
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    description: 'Second most common blood type. Very frequent demand for platelets.'
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    description: 'Extremely rare (under 2% of population). Critical for specialized matches.'
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    description: 'Key blood type for thalassemia and chronic anemia management.'
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    description: 'Rarest blood type (<1%). Universal donor for plasma!'
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    description: 'Universal Red Blood Cell Recipient! Ideal for platelet and plasma donation.'
  }
};

export const INITIAL_DONOR_PROFILE: DonorProfile = {
  id: 'donor_alex_01',
  fullName: 'Alex Vance',
  email: 'alex.vance@hemonet.org',
  phone: '+1 (555) 234-5678',
  bloodType: 'O-',
  isVerified: true,
  verificationBadgeId: 'VER-HEMO-8849-NY',
  idDocumentType: 'State Medical ID / Real-ID Verified',
  verifiedAt: '2026-06-15',
  lastDonationDate: '2026-07-10',
  cooldownDaysRemaining: 0,
  eligibleDate: '2026-09-04',
  isEligibleNow: true,
  hemoglobinLevel: 14.8,
  weightKg: 74,
  bloodPressure: '118/76',
  pulseBpm: 68,
  biometricEnabled: true,
  biometricType: 'FaceID',
  rewardPoints: 1250,
  tier: 'Gold',
  totalDonations: 6,
  livesSaved: 18,
  currentLocation: {
    lat: 40.7306,
    lng: -73.9352,
    area: 'Metro Central District'
  }
};

export const INITIAL_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert_em_01',
    hospitalName: 'St. Jude Level 1 Trauma Center',
    hospitalAddress: '742 University Ave, Metro District',
    distanceMiles: 1.8,
    bloodTypeNeeded: 'O-',
    unitsNeeded: 4,
    unitsFulfilled: 1,
    urgency: 'CRITICAL',
    patientContext: 'Multiple vehicular collision - acute hemorrhage surgery',
    deadlineHours: 1.5,
    createdAt: '15 mins ago',
    status: 'ACTIVE',
    coordinates: { x: 38, y: 32, lat: 40.7418, lng: -73.9893 },
    donorResponses: [
      {
        donorId: 'donor_sarah_09',
        donorName: 'Sarah Lin',
        bloodType: 'O-',
        status: 'EN_ROUTE',
        etaMinutes: 12
      }
    ]
  },
  {
    id: 'alert_em_02',
    hospitalName: 'Metropolitan Pediatric Center',
    hospitalAddress: '120 Highland Park Way, Northside',
    distanceMiles: 3.4,
    bloodTypeNeeded: 'A-',
    unitsNeeded: 3,
    unitsFulfilled: 2,
    urgency: 'HIGH',
    patientContext: 'Pediatric cardiovascular intensive care unit',
    deadlineHours: 3.2,
    createdAt: '42 mins ago',
    status: 'ACTIVE',
    coordinates: { x: 65, y: 22, lat: 40.7589, lng: -73.9745 },
    donorResponses: [
      {
        donorId: 'donor_david_14',
        donorName: 'David K.',
        bloodType: 'A-',
        status: 'ARRIVED',
        etaMinutes: 0
      },
      {
        donorId: 'donor_rachel_33',
        donorName: 'Rachel Green',
        bloodType: 'A-',
        status: 'DONATING',
        etaMinutes: 0
      }
    ]
  },
  {
    id: 'alert_em_03',
    hospitalName: 'Mercy General Cardiac Institute',
    hospitalAddress: '550 Bay Boulevard, South Harbor',
    distanceMiles: 4.9,
    bloodTypeNeeded: 'B+',
    unitsNeeded: 5,
    unitsFulfilled: 1,
    urgency: 'HIGH',
    patientContext: 'Scheduled emergency bypass grafting surgery prep',
    deadlineHours: 4.8,
    createdAt: '1 hour ago',
    status: 'ACTIVE',
    coordinates: { x: 25, y: 72, lat: 40.7128, lng: -74.006 },
    donorResponses: []
  }
];

export const INITIAL_DONATION_CENTERS: DonationCenter[] = [
  {
    id: 'center_01',
    name: 'St. Jude Level 1 Trauma Blood Bank',
    type: 'Hospital Trauma Center',
    address: '742 University Ave, Metro District',
    distanceMiles: 1.8,
    coordinates: { x: 38, y: 32, lat: 40.7418, lng: -73.9893 },
    phone: '(555) 902-1100',
    hours: '24/7 Emergency Transfusion Unit',
    isOpenNow: true,
    walkInsWelcome: true,
    criticalNeeds: ['O-', 'O+', 'A-'],
    currentStockLevels: {
      'O-': 'CRITICAL',
      'O+': 'LOW',
      'A-': 'CRITICAL',
      'A+': 'OPTIMAL',
      'B-': 'LOW',
      'B+': 'OPTIMAL',
      'AB-': 'OPTIMAL',
      'AB+': 'SURPLUS'
    },
    availableSlotsToday: 14
  },
  {
    id: 'center_02',
    name: 'Metro Red Cross Regional Donation Hub',
    type: 'Regional Blood Bank',
    address: '304 Columbus Circle, Suite 400',
    distanceMiles: 2.3,
    coordinates: { x: 52, y: 44, lat: 40.7681, lng: -73.9819 },
    phone: '(555) 883-4242',
    hours: '7:00 AM – 8:00 PM Daily',
    isOpenNow: true,
    walkInsWelcome: true,
    criticalNeeds: ['O-', 'B-'],
    currentStockLevels: {
      'O-': 'LOW',
      'O+': 'OPTIMAL',
      'A-': 'OPTIMAL',
      'A+': 'SURPLUS',
      'B-': 'CRITICAL',
      'B+': 'OPTIMAL',
      'AB-': 'LOW',
      'AB+': 'OPTIMAL'
    },
    availableSlotsToday: 26
  },
  {
    id: 'center_03',
    name: 'Downtown Community Mobile Bloodmobile',
    type: 'Mobile Bloodmobile',
    address: 'City Hall Plaza, South Concourse',
    distanceMiles: 0.9,
    coordinates: { x: 44, y: 58, lat: 40.7128, lng: -74.006 },
    phone: '(555) 330-9988',
    hours: '8:30 AM – 5:30 PM (Today only)',
    isOpenNow: true,
    walkInsWelcome: true,
    criticalNeeds: ['O-', 'O+'],
    currentStockLevels: {
      'O-': 'CRITICAL',
      'O+': 'LOW',
      'A-': 'OPTIMAL',
      'A+': 'OPTIMAL',
      'B-': 'OPTIMAL',
      'B+': 'LOW',
      'AB-': 'OPTIMAL',
      'AB+': 'OPTIMAL'
    },
    availableSlotsToday: 8
  },
  {
    id: 'center_04',
    name: 'Metropolitan Pediatric Center Blood Ward',
    type: 'Hospital Trauma Center',
    address: '120 Highland Park Way, Northside',
    distanceMiles: 3.4,
    coordinates: { x: 65, y: 22, lat: 40.7589, lng: -73.9745 },
    phone: '(555) 441-2020',
    hours: '6:00 AM – 10:00 PM',
    isOpenNow: true,
    walkInsWelcome: false,
    criticalNeeds: ['A-', 'O-'],
    currentStockLevels: {
      'O-': 'LOW',
      'O+': 'OPTIMAL',
      'A-': 'CRITICAL',
      'A+': 'OPTIMAL',
      'B-': 'OPTIMAL',
      'B+': 'OPTIMAL',
      'AB-': 'SURPLUS',
      'AB+': 'SURPLUS'
    },
    availableSlotsToday: 18
  },
  {
    id: 'center_05',
    name: 'Mercy General Blood Bank & Apheresis Clinic',
    type: 'Hospital Trauma Center',
    address: '550 Bay Boulevard, South Harbor',
    distanceMiles: 4.9,
    coordinates: { x: 25, y: 72, lat: 40.7128, lng: -74.006 },
    phone: '(555) 777-5151',
    hours: '24/7 Operations',
    isOpenNow: true,
    walkInsWelcome: true,
    criticalNeeds: ['B+', 'O-'],
    currentStockLevels: {
      'O-': 'LOW',
      'O+': 'LOW',
      'A-': 'OPTIMAL',
      'A+': 'OPTIMAL',
      'B-': 'LOW',
      'B+': 'CRITICAL',
      'AB-': 'OPTIMAL',
      'AB+': 'OPTIMAL'
    },
    availableSlotsToday: 21
  }
];

export const INITIAL_REWARD_PERKS: RewardPerk[] = [
  {
    id: 'perk_01',
    title: 'Comprehensive Health & Lipid Panel Voucher',
    description: 'Full cholesterol, lipid panel, and ferritin checkup provided free through partner diagnostic labs.',
    category: 'HEALTH',
    pointsCost: 400,
    isRedeemed: false,
    partner: 'Quest Diagnostics & Metro Labs',
    iconName: 'Activity'
  },
  {
    id: 'perk_02',
    title: 'Transit MetroCard / Transit Pass (5-Day Unlimited)',
    description: 'Subsidized travel pass for donors traveling to and from regional donation centers.',
    category: 'TRANSPORT',
    pointsCost: 350,
    isRedeemed: false,
    partner: 'Regional Transit Authority',
    iconName: 'Bus'
  },
  {
    id: 'perk_03',
    title: 'Artisan Recovery Coffee & Fuel Voucher',
    description: '$15 digital card redeemable for fresh organic beverages and nutritious baked recovery goods.',
    category: 'FOOD',
    pointsCost: 200,
    isRedeemed: true,
    code: 'HEMO-BREW-8891',
    partner: 'Local Roasters Guild',
    iconName: 'Coffee'
  },
  {
    id: 'perk_04',
    title: 'Priority Emergency Response VIP Badge',
    description: 'VIP queue skip at all city donation centers for rapid walk-in donations with no appointment wait.',
    category: 'COMMUNITY',
    pointsCost: 750,
    isRedeemed: false,
    partner: 'State Blood Alliance',
    iconName: 'Zap'
  },
  {
    id: 'perk_05',
    title: 'Pharmacy Wellness Discount Card (30% Off)',
    description: 'Savings on vitamins, supplements, and first aid supplies across 120 partner pharmacies.',
    category: 'WELLNESS',
    pointsCost: 300,
    isRedeemed: false,
    partner: 'Alliance Pharmacy Network',
    iconName: 'ShieldCheck'
  },
  {
    id: 'perk_06',
    title: 'Certified Hero Certificate & Challenge Coin',
    description: 'Official framed commendation letter from the City Health Commissioner + collectible lapel pin.',
    category: 'COMMUNITY',
    pointsCost: 1000,
    isRedeemed: false,
    partner: 'Department of Public Health',
    iconName: 'Award'
  }
];

export const INITIAL_DONOR_BADGES: DonorBadge[] = [
  {
    id: 'badge_01',
    title: 'First Life Saved',
    description: 'Completed first verified whole blood donation.',
    earned: true,
    earnedDate: '2025-08-12',
    iconName: 'Droplet',
    rarity: 'Common'
  },
  {
    id: 'badge_02',
    title: 'Universal Lifesaver (O-)',
    description: 'Donated universal red blood cells that can save any recipient.',
    earned: true,
    earnedDate: '2025-11-04',
    iconName: 'Globe',
    rarity: 'Rare'
  },
  {
    id: 'badge_03',
    title: 'Rapid Responder (<30 Min)',
    description: 'Answered a Code Red emergency hospital alert and dispatched in under 30 minutes.',
    earned: true,
    earnedDate: '2026-03-21',
    iconName: 'Flame',
    rarity: 'Epic'
  },
  {
    id: 'badge_04',
    title: 'Gallon Club Milestone',
    description: 'Contributed 8+ units of life-saving blood components.',
    earned: false,
    iconName: 'Trophy',
    rarity: 'Legendary'
  },
  {
    id: 'badge_05',
    title: 'Holiday Guardian',
    description: 'Donated during peak winter or summer critical shortage weeks.',
    earned: true,
    earnedDate: '2025-12-28',
    iconName: 'HeartHandshake',
    rarity: 'Rare'
  },
  {
    id: 'badge_06',
    title: 'Triple Shield',
    description: 'Completed 3 consecutive scheduled donations with zero deferrals.',
    earned: true,
    earnedDate: '2026-07-10',
    iconName: 'ShieldCheck',
    rarity: 'Epic'
  }
];

export const INITIAL_INVENTORY: BloodSupplyInventory[] = [
  {
    bloodType: 'O-',
    unitsInStock: 28,
    safeCapacity: 120,
    demandRatePerHour: 4.2,
    status: 'CRITICAL',
    compatibleRecipients: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    compatibleDonors: ['O-']
  },
  {
    bloodType: 'O+',
    unitsInStock: 84,
    safeCapacity: 180,
    demandRatePerHour: 5.6,
    status: 'LOW',
    compatibleRecipients: ['O+', 'A+', 'B+', 'AB+'],
    compatibleDonors: ['O+', 'O-']
  },
  {
    bloodType: 'A-',
    unitsInStock: 22,
    safeCapacity: 75,
    demandRatePerHour: 2.1,
    status: 'CRITICAL',
    compatibleRecipients: ['A-', 'A+', 'AB-', 'AB+'],
    compatibleDonors: ['A-', 'O-']
  },
  {
    bloodType: 'A+',
    unitsInStock: 142,
    safeCapacity: 160,
    demandRatePerHour: 4.8,
    status: 'HEALTHY',
    compatibleRecipients: ['A+', 'AB+'],
    compatibleDonors: ['A+', 'A-', 'O+', 'O-']
  },
  {
    bloodType: 'B-',
    unitsInStock: 18,
    safeCapacity: 50,
    demandRatePerHour: 1.4,
    status: 'LOW',
    compatibleRecipients: ['B-', 'B+', 'AB-', 'AB+'],
    compatibleDonors: ['B-', 'O-']
  },
  {
    bloodType: 'B+',
    unitsInStock: 68,
    safeCapacity: 110,
    demandRatePerHour: 2.9,
    status: 'HEALTHY',
    compatibleRecipients: ['B+', 'AB+'],
    compatibleDonors: ['B+', 'B-', 'O+', 'O-']
  },
  {
    bloodType: 'AB-',
    unitsInStock: 14,
    safeCapacity: 35,
    demandRatePerHour: 0.8,
    status: 'LOW',
    compatibleRecipients: ['AB-', 'AB+'],
    compatibleDonors: ['AB-', 'A-', 'B-', 'O-']
  },
  {
    bloodType: 'AB+',
    unitsInStock: 52,
    safeCapacity: 60,
    demandRatePerHour: 1.1,
    status: 'HEALTHY',
    compatibleRecipients: ['AB+'],
    compatibleDonors: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg_01',
    senderId: 'hospital_coord_01',
    senderName: 'Nurse Sharon (Trauma Coordinator)',
    senderRole: 'HOSPITAL_STAFF' as const,
    hospitalName: 'St. Jude Trauma Center',
    text: 'Hello Alex, thank you for responding to our Code Red O- alert! Our surgical team has your donor clearance on standby.',
    timestamp: '14 mins ago',
    isEncrypted: true
  },
  {
    id: 'msg_02',
    senderId: 'donor_alex_01',
    senderName: 'Alex Vance (You)',
    senderRole: 'DONOR' as const,
    text: 'I am on my way via University Ave. ETA is approximately 15 minutes. Hydrated and ready.',
    timestamp: '11 mins ago',
    isEncrypted: true
  },
  {
    id: 'msg_03',
    senderId: 'hospital_coord_01',
    senderName: 'Nurse Sharon (Trauma Coordinator)',
    senderRole: 'HOSPITAL_STAFF' as const,
    hospitalName: 'St. Jude Trauma Center',
    text: 'Excellent. Please enter through Emergency Entrance Gate B. Security has your digital verified badge pre-cleared.',
    timestamp: '8 mins ago',
    isEncrypted: true,
    attachmentType: 'DISPATCH_PASS' as const,
    attachmentTitle: 'Express Trauma Bay Pass #TB-884'
  }
];

export const INITIAL_VERIFICATION_CANDIDATES = [
  {
    id: 'cand_01',
    fullName: 'Elena Rostova',
    bloodType: 'O-' as const,
    email: 'elena.rostova@med.org',
    phone: '(555) 349-8812',
    submittedAt: 'Today, 08:24 AM',
    idDocumentType: 'Passport' as const,
    idDocumentNumber: 'P-94821034',
    hemoglobinLevel: 13.8,
    weightKg: 62,
    medicalScreeningPassed: true,
    status: 'PENDING' as const,
    notes: 'Universal donor candidate with clean medical questionnaire and normal blood pressure.'
  },
  {
    id: 'cand_02',
    fullName: 'Marcus Sterling',
    bloodType: 'A+' as const,
    email: 'm.sterling@domain.com',
    phone: '(555) 782-9901',
    submittedAt: 'Yesterday, 04:15 PM',
    idDocumentType: 'Driver License' as const,
    idDocumentNumber: 'DL-55291-NY',
    hemoglobinLevel: 15.2,
    weightKg: 78,
    medicalScreeningPassed: true,
    status: 'APPROVED' as const,
    notes: 'Prior donor in California registry. Transferred accreditation valid.'
  },
  {
    id: 'cand_03',
    fullName: 'David K. O’Connor',
    bloodType: 'B-' as const,
    email: 'doconnor@corp.net',
    phone: '(555) 671-0023',
    submittedAt: 'Yesterday, 02:40 PM',
    idDocumentType: 'National ID' as const,
    idDocumentNumber: 'NID-883019',
    hemoglobinLevel: 11.9,
    weightKg: 54,
    medicalScreeningPassed: false,
    status: 'REJECTED' as const,
    notes: 'Hemoglobin at 11.9 g/dL is below mandatory clinical floor (12.5 g/dL). Advised iron intake.'
  },
  {
    id: 'cand_04',
    fullName: 'Amina Mansoor',
    bloodType: 'AB-' as const,
    email: 'amina.m@biotech.io',
    phone: '(555) 412-7788',
    submittedAt: 'Today, 09:10 AM',
    idDocumentType: 'Driver License' as const,
    idDocumentNumber: 'DL-90412-CA',
    hemoglobinLevel: 14.1,
    weightKg: 65,
    medicalScreeningPassed: true,
    status: 'PENDING' as const,
    notes: 'Rare AB- phenotype donor. High priority verification.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log_01',
    timestamp: '10 mins ago',
    actor: 'Dr. Evelyn Reed (Command Chief)',
    role: 'ADMIN' as const,
    action: 'EMERGENCY_BROADCAST',
    details: 'Triggered Code Red Alert: 4 units O- needed at St. Jude Trauma Bay #1',
    severity: 'CRITICAL' as const
  },
  {
    id: 'log_02',
    timestamp: '18 mins ago',
    actor: 'Nurse Sharon (Trauma Coordinator)',
    role: 'TRAUMA_COORDINATOR' as const,
    action: 'TRIAGE_FASTPASS_SCAN',
    details: 'Scanned QR token for donor Alex Vance (ID: BD-9482-VN). Admitted to Bed 3',
    severity: 'SUCCESS' as const
  },
  {
    id: 'log_03',
    timestamp: '42 mins ago',
    actor: 'Automated Bio-telemetry Engine',
    role: 'SYSTEM' as const,
    action: 'INVENTORY_BURN_ALERT',
    details: 'Regional O- reserve dropped below safe 48-hour threshold (28 units remaining)',
    severity: 'WARNING' as const
  },
  {
    id: 'log_04',
    timestamp: '1 hr ago',
    actor: 'Dr. Evelyn Reed (Command Chief)',
    role: 'ADMIN' as const,
    action: 'DONOR_ACCREDITATION',
    details: 'Approved verified credential badge for Marcus Sterling (A+)',
    severity: 'INFO' as const
  },
  {
    id: 'log_05',
    timestamp: '2 hrs ago',
    actor: 'St. Jude Blood Bank Staff',
    role: 'PHLEBOTOMIST' as const,
    action: 'STOCK_RESTOCKED',
    details: 'Received +8 units of verified B+ whole blood from Mobile Bloodmobile Drive',
    severity: 'SUCCESS' as const
  }
];
