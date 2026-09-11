import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Navbar
} from './components/Navbar';
import { DonorDashboard } from './components/DonorDashboard';
import { MapView } from './components/MapView';
import { SecureChat } from './components/SecureChat';
import { RewardsProgram } from './components/RewardsProgram';
import { DonorProfile } from './components/DonorProfile';
import { AdminAnalytics } from './components/AdminAnalytics';
import { AdminPage } from './components/AdminPage';
import { BiometricModal } from './components/BiometricModal';
import { CompatibilityModal } from './components/CompatibilityModal';
import { ActiveDispatchModal } from './components/ActiveDispatchModal';
import { QRCodePassModal } from './components/QRCodePassModal';
import { QRCodeScannerModal } from './components/QRCodeScannerModal';
import {
  INITIAL_DONOR_PROFILE,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_DONATION_CENTERS,
  INITIAL_REWARD_PERKS,
  INITIAL_DONOR_BADGES,
  INITIAL_INVENTORY,
  INITIAL_CHAT_MESSAGES,
  INITIAL_VERIFICATION_CANDIDATES,
  INITIAL_AUDIT_LOGS
} from './data/mockData';
import {
  EmergencyAlert,
  DonationCenter,
  DonorProfile as DonorProfileType,
  BloodSupplyInventory,
  ChatMessage,
  RewardPerk,
  DonorBadge,
  BloodType,
  DonorVerificationCandidate,
  AuditLogEntry
} from './types';
import {
  AlertTriangle,
  Heart,
  Droplets,
  Radio,
  CheckCircle2,
  Lock,
  Zap,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation & Dedicated Pages
  const [currentPage, setCurrentPage] = useState<'donor' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) return 'admin';
    }
    return 'donor';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('alerts');
  const [persona, setPersona] = useState<'DONOR' | 'HOSPITAL'>('DONOR');

  // Sync hash routing for dedicated admin page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) {
        setCurrentPage('admin');
        setPersona('HOSPITAL');
      } else {
        setCurrentPage('donor');
        setPersona('DONOR');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page: 'donor' | 'admin') => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page === 'admin' ? '#admin' : '#donor';
    }
    if (page === 'admin') {
      setPersona('HOSPITAL');
    } else {
      setPersona('DONOR');
    }
  };

  // Application Data States (persisted to localStorage where applicable)
  const [donorProfile, setDonorProfile] = useState<DonorProfileType>(() => {
    const saved = localStorage.getItem('hemo_donor_profile');
    return saved ? JSON.parse(saved) : INITIAL_DONOR_PROFILE;
  });

  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => {
    const saved = localStorage.getItem('hemo_emergency_alerts');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_ALERTS;
  });

  const [centers, setCenters] = useState<DonationCenter[]>(() => {
    const saved = localStorage.getItem('hemo_donation_centers');
    return saved ? JSON.parse(saved) : INITIAL_DONATION_CENTERS;
  });

  const [perks, setPerks] = useState<RewardPerk[]>(() => {
    const saved = localStorage.getItem('hemo_reward_perks');
    return saved ? JSON.parse(saved) : INITIAL_REWARD_PERKS;
  });

  const [badges, setBadges] = useState<DonorBadge[]>(INITIAL_DONOR_BADGES);

  const [inventory, setInventory] = useState<BloodSupplyInventory[]>(() => {
    const saved = localStorage.getItem('hemo_blood_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('hemo_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [candidates, setCandidates] = useState<DonorVerificationCandidate[]>(() => {
    const saved = localStorage.getItem('hemo_candidates');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATION_CANDIDATES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('hemo_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Modal States
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [biometricModalOpen, setBiometricModalOpen] = useState(false);
  const [biometricReason, setBiometricReason] = useState('Authorize donor dispatch with biometric credentials.');
  const [biometricCallback, setBiometricCallback] = useState<(() => void) | null>(null);

  const [compatibilityModalOpen, setCompatibilityModalOpen] = useState(false);
  const [activeDispatchAlert, setActiveDispatchAlert] = useState<EmergencyAlert | null>(null);
  const [qrPassModalOpen, setQrPassModalOpen] = useState(false);
  const [qrScannerModalOpen, setQrScannerModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'alert' | 'success' | 'info' } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('hemo_donor_profile', JSON.stringify(donorProfile));
  }, [donorProfile]);

  useEffect(() => {
    localStorage.setItem('hemo_emergency_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('hemo_blood_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('hemo_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('hemo_reward_perks', JSON.stringify(perks));
  }, [perks]);

  useEffect(() => {
    localStorage.setItem('hemo_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('hemo_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => setToastNotification(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Biometric helper trigger
  const requestBiometricAction = (reason: string, onSuccess: () => void) => {
    if (donorProfile.biometricEnabled) {
      setBiometricReason(reason);
      setBiometricCallback(() => onSuccess);
      setBiometricModalOpen(true);
    } else {
      onSuccess();
    }
  };

  // Donor responds to emergency alert
  const handleRespondAlert = (alertId: string) => {
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    requestBiometricAction(
      `Biometric authorization required to dispatch emergency unit of ${donorProfile.bloodType} blood to ${targetAlert.hospitalName}.`,
      () => {
        // Update alert responses
        setAlerts((prev) =>
          prev.map((a) => {
            if (a.id === alertId) {
              const alreadyIn = a.donorResponses.some((d) => d.donorId === donorProfile.id);
              if (alreadyIn) return a;
              return {
                ...a,
                donorResponses: [
                  ...a.donorResponses,
                  {
                    donorId: donorProfile.id,
                    donorName: donorProfile.fullName,
                    bloodType: donorProfile.bloodType,
                    status: 'EN_ROUTE',
                    etaMinutes: 14
                  }
                ]
              };
            }
            return a;
          })
        );

        setActiveDispatchAlert(targetAlert);
        setToastNotification({
          message: `Emergency dispatch confirmed for ${targetAlert.hospitalName}! Priority triage pass active.`,
          type: 'success'
        });
      }
    );
  };

  // Dispatch to Center from Map
  const handleDispatchToCenter = (center: DonationCenter) => {
    // Find matching alert or generate temporary dispatch
    const existingAlert = alerts.find((a) => a.hospitalName === center.name);
    if (existingAlert) {
      handleRespondAlert(existingAlert.id);
    } else {
      const tempAlert: EmergencyAlert = {
        id: `walkin_${center.id}_${Date.now()}`,
        hospitalName: center.name,
        hospitalAddress: center.address,
        distanceMiles: center.distanceMiles,
        bloodTypeNeeded: donorProfile.bloodType,
        unitsNeeded: 2,
        unitsFulfilled: 0,
        urgency: 'HIGH',
        patientContext: 'Priority Walk-in Standby Reservation',
        deadlineHours: 3,
        createdAt: 'Just now',
        status: 'ACTIVE',
        coordinates: center.coordinates,
        donorResponses: [
          {
            donorId: donorProfile.id,
            donorName: donorProfile.fullName,
            bloodType: donorProfile.bloodType,
            status: 'EN_ROUTE',
            etaMinutes: 15
          }
        ]
      };
      setAlerts((prev) => [tempAlert, ...prev]);
      setActiveDispatchAlert(tempAlert);
    }
  };

  // Complete a donation
  const handleCompleteDonation = () => {
    // Update Donor Profile stats
    setDonorProfile((prev) => ({
      ...prev,
      rewardPoints: prev.rewardPoints + 350,
      livesSaved: prev.livesSaved + 3,
      totalDonations: prev.totalDonations + 1,
      lastDonationDate: new Date().toISOString().split('T')[0]
    }));

    // Update Blood inventory (+1 unit to donor blood type)
    setInventory((prev) =>
      prev.map((item) => {
        if (item.bloodType === donorProfile.bloodType) {
          const updatedStock = item.unitsInStock + 1;
          const status =
            updatedStock < 30 ? 'CRITICAL' : updatedStock < 60 ? 'LOW' : 'HEALTHY';
          return {
            ...item,
            unitsInStock: updatedStock,
            status: status
          };
        }
        return item;
      })
    );

    // If there is an active alert, increment fulfilled count
    if (activeDispatchAlert) {
      setAlerts((prev) =>
        prev.map((a) => {
          if (a.id === activeDispatchAlert.id) {
            return {
              ...a,
              unitsFulfilled: Math.min(a.unitsNeeded, a.unitsFulfilled + 1),
              status: a.unitsFulfilled + 1 >= a.unitsNeeded ? 'FULFILLED' : 'ACTIVE'
            };
          }
          return a;
        })
      );
    }

    setToastNotification({
      message: 'Donation verified! +350 Life Points credited & 3 lives saved!',
      type: 'success'
    });
  };

  // Broadcast Alert from Admin
  const handleBroadcastAlert = (
    newAlertData: Omit<
      EmergencyAlert,
      'id' | 'createdAt' | 'unitsFulfilled' | 'status' | 'donorResponses' | 'coordinates'
    >
  ) => {
    const newAlert: EmergencyAlert = {
      ...newAlertData,
      id: `alert_broadcast_${Date.now()}`,
      createdAt: 'Just now',
      unitsFulfilled: 0,
      status: 'ACTIVE',
      donorResponses: [],
      coordinates: { x: 42, y: 38, lat: 40.7418, lng: -73.9893 }
    };

    setAlerts((prev) => [newAlert, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: 'Just now',
        actor: 'Dr. Evelyn Reed (Command Chief)',
        role: 'ADMIN',
        action: 'EMERGENCY_BROADCAST',
        details: `Broadcasted emergency need: ${newAlert.unitsNeeded} units of ${newAlert.bloodTypeNeeded} at ${newAlert.hospitalName}`,
        severity: 'CRITICAL'
      },
      ...prev
    ]);

    setToastNotification({
      message: `Emergency Alert Broadcast: ${newAlert.unitsNeeded} units of ${newAlert.bloodTypeNeeded} needed at ${newAlert.hospitalName}!`,
      type: 'alert'
    });
  };

  // Simulate Multi-Trauma Surge
  const handleSimulateSurge = () => {
    // Drop critical O- and O+ stock
    setInventory((prev) =>
      prev.map((item) => {
        if (item.bloodType === 'O-') {
          return { ...item, unitsInStock: Math.max(8, item.unitsInStock - 15), status: 'CRITICAL' };
        }
        if (item.bloodType === 'O+') {
          return { ...item, unitsInStock: Math.max(35, item.unitsInStock - 25), status: 'LOW' };
        }
        return item;
      })
    );

    // Create immediate Code Red surge alert
    const surgeAlert: EmergencyAlert = {
      id: `surge_trauma_${Date.now()}`,
      hospitalName: 'Downtown Emergency Trauma Pavilion',
      hospitalAddress: '990 Broadway, City Center',
      distanceMiles: 1.2,
      bloodTypeNeeded: 'O-',
      unitsNeeded: 6,
      unitsFulfilled: 0,
      urgency: 'CRITICAL',
      patientContext: 'Multi-casualty highway transit collision (4 critical hemorrhagic shock victims)',
      deadlineHours: 1.0,
      createdAt: 'Just now',
      status: 'ACTIVE',
      coordinates: { x: 48, y: 52, lat: 40.7306, lng: -73.99 },
      donorResponses: []
    };

    setAlerts((prev) => [surgeAlert, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: 'Just now',
        actor: 'Automated Bio-telemetry Engine',
        role: 'SYSTEM',
        action: 'TRAUMA_SURGE_SIMULATION',
        details: 'Multi-casualty highway transit collision surge initiated (6 units O- requested)',
        severity: 'WARNING'
      },
      ...prev
    ]);

    setToastNotification({
      message: '🚨 MULTI-TRAUMA SURGE INITIATED: 6 units O- urgently requested at Downtown Trauma Pavilion!',
      type: 'alert'
    });
  };

  // Admin mark alert fulfilled
  const handleFulfillAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'FULFILLED', unitsFulfilled: a.unitsNeeded } : a))
    );

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: 'Just now',
        actor: 'Dr. Evelyn Reed (Command Chief)',
        role: 'ADMIN',
        action: 'ALERT_FULFILLED',
        details: `Marked emergency request #${alertId.slice(-6)} as completely fulfilled.`,
        severity: 'SUCCESS'
      },
      ...prev
    ]);

    setToastNotification({
      message: 'Emergency request marked as fulfilled.',
      type: 'info'
    });
  };

  // Send Chat Message
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: donorProfile.id,
      senderName: `${donorProfile.fullName} (You)`,
      senderRole: 'DONOR',
      text: text,
      timestamp: 'Just now',
      isEncrypted: true
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated reply from Hospital Coordinator
    setTimeout(() => {
      const coordinatorReplies = [
        `Thank you ${donorProfile.fullName}! Our phlebotomy desk has your verified ${donorProfile.bloodType} profile loaded. We are ready for you.`,
        `Received! Please remember to drink 16oz of water before your appointment. Entrance Gate B has zero wait time.`,
        `Your verified token is accepted in our fast-track triage system. Thank you for your rapid response!`
      ];
      const randomReply =
        coordinatorReplies[Math.floor(Math.random() * coordinatorReplies.length)];

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_reply_${Date.now()}`,
          senderId: 'hospital_coord_01',
          senderName: 'Nurse Sharon (Trauma Coordinator)',
          senderRole: 'HOSPITAL_STAFF',
          hospitalName: 'St. Jude Trauma Center',
          text: randomReply,
          timestamp: 'Just now',
          isEncrypted: true
        }
      ]);
    }, 1200);
  };

  // Redeem Perk
  const handleRedeemPerk = (perkId: string, cost: number) => {
    if (donorProfile.rewardPoints < cost) return;

    setDonorProfile((prev) => ({
      ...prev,
      rewardPoints: prev.rewardPoints - cost
    }));

    setPerks((prev) =>
      prev.map((p) =>
        p.id === perkId
          ? { ...p, isRedeemed: true, code: `HEMO-PERK-${Math.floor(1000 + Math.random() * 9000)}` }
          : p
      )
    );

    setToastNotification({
      message: 'Perk redeemed! Digital voucher code saved to your wallet.',
      type: 'success'
    });
  };

  // DEDICATED FULL-PAGE ADMIN COMMAND CENTER VIEW
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 font-sans antialiased">
        <AdminPage
          inventory={inventory}
          alerts={alerts}
          centers={centers}
          candidates={candidates}
          auditLogs={auditLogs}
          onUpdateInventory={setInventory}
          onUpdateCenters={setCenters}
          onUpdateCandidates={setCandidates}
          onBroadcastAlert={handleBroadcastAlert}
          onSimulateSurge={handleSimulateSurge}
          onFulfillAlert={handleFulfillAlert}
          onOpenQRScanner={() => setQrScannerModalOpen(true)}
          onExitToDonor={() => navigateToPage('donor')}
        />

        {/* Floating Real-time Toast Notifications */}
        {toastNotification && (
          <div
            id="toast-notification-banner"
            className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
              toastNotification.type === 'alert'
                ? 'bg-red-600 text-white border-red-500'
                : toastNotification.type === 'success'
                ? 'bg-emerald-700 text-white border-emerald-600'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toastNotification.type === 'alert' ? (
              <AlertTriangle className="w-6 h-6 animate-bounce shrink-0" />
            ) : toastNotification.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
            ) : (
              <Info className="w-6 h-6 text-blue-300 shrink-0" />
            )}
            <p className="text-xs font-bold leading-snug flex-1">
              {toastNotification.message}
            </p>
            <button
              onClick={() => setToastNotification(null)}
              className="text-white/80 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hospital QR Fast-Pass Scanner Modal */}
        <QRCodeScannerModal
          isOpen={qrScannerModalOpen}
          onClose={() => setQrScannerModalOpen(false)}
          donorProfile={donorProfile}
          onAdmitDonor={(donorName, bloodType) => {
            setAuditLogs((prev) => [
              {
                id: `log_${Date.now()}`,
                timestamp: 'Just now',
                actor: 'Nurse Sharon (Trauma Coordinator)',
                role: 'TRAUMA_COORDINATOR',
                action: 'TRIAGE_FASTPASS_SCAN',
                details: `Admitted verified donor ${donorName} (${bloodType}) into Phlebotomy Bay #2`,
                severity: 'SUCCESS'
              },
              ...prev
            ]);
            setToastNotification({
              message: `Triage Success: Donor ${donorName} (${bloodType}) admitted to Phlebotomy Bay #2. Fast-track logged!`,
              type: 'success'
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        persona={persona}
        setPersona={(newPersona) => {
          setPersona(newPersona);
          if (newPersona === 'HOSPITAL') {
            navigateToPage('admin');
          }
        }}
        activeAlertCount={alerts.filter((a) => a.status === 'ACTIVE').length}
        unreadChatCount={0}
        rewardPoints={donorProfile.rewardPoints}
        userBloodType={donorProfile.bloodType}
        isBiometricLocked={isBiometricLocked}
        onToggleBiometricLock={() => {
          if (!isBiometricLocked) {
            setIsBiometricLocked(true);
            setToastNotification({
              message: 'Biometric privacy vault engaged. Health vitals locked.',
              type: 'info'
            });
          } else {
            requestBiometricAction('Unlock biometric privacy vault with TouchID or FaceID.', () => {
              setIsBiometricLocked(false);
            });
          }
        }}
        onOpenCompatibility={() => setCompatibilityModalOpen(true)}
        onOpenQRPass={() => setQrPassModalOpen(true)}
        onOpenQRScanner={() => setQrScannerModalOpen(true)}
        onNavigateToAdmin={() => navigateToPage('admin')}
      />

      {/* Floating Real-time Toast Notifications */}
      {toastNotification && (
        <div
          id="toast-notification-banner"
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
            toastNotification.type === 'alert'
              ? 'bg-red-600 text-white border-red-500'
              : toastNotification.type === 'success'
              ? 'bg-emerald-700 text-white border-emerald-600'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          {toastNotification.type === 'alert' ? (
            <AlertTriangle className="w-6 h-6 animate-bounce shrink-0" />
          ) : toastNotification.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
          ) : (
            <Info className="w-6 h-6 text-blue-300 shrink-0" />
          )}
          <p className="text-xs font-bold leading-snug flex-1">
            {toastNotification.message}
          </p>
          <button
            onClick={() => setToastNotification(null)}
            className="text-white/80 hover:text-white p-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Donor Mode View */}
        {activeTab === 'alerts' && (
          <DonorDashboard
            profile={donorProfile}
            alerts={alerts.filter((a) => a.status === 'ACTIVE')}
            centers={centers}
            onRespondAlert={handleRespondAlert}
            onViewAlertDetails={(alert) => {
              const matchedCenter = centers.find((c) => c.name === alert.hospitalName) || centers[0];
              setActiveTab('map');
            }}
            onNavigateTab={setActiveTab}
            onOpenCompatibility={() => setCompatibilityModalOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            centers={centers}
            userBloodType={donorProfile.bloodType}
            isUserEligible={donorProfile.isEligibleNow}
            onSelectCenter={(c) => {}}
            onDispatchToCenter={handleDispatchToCenter}
          />
        )}

        {activeTab === 'chat' && (
          <SecureChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            donorProfile={donorProfile}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsProgram
            donorProfile={donorProfile}
            badges={badges}
            perks={perks}
            onRedeemPerk={handleRedeemPerk}
          />
        )}

        {activeTab === 'profile' && (
          <DonorProfile
            profile={donorProfile}
            onUpdateProfile={(updated) =>
              setDonorProfile((prev) => ({ ...prev, ...updated }))
            }
            onRequestBiometricVerification={() => {
              requestBiometricAction('Biometric sensor test confirmation.', () => {
                setToastNotification({
                  message: 'Biometric passkey verified successfully!',
                  type: 'success'
                });
              });
            }}
            isBiometricLocked={isBiometricLocked}
            onToggleBiometricLock={() => {
              if (isBiometricLocked) {
                requestBiometricAction('Unlock privacy vault.', () => setIsBiometricLocked(false));
              } else {
                setIsBiometricLocked(true);
              }
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalytics
            inventory={inventory}
            alerts={alerts.filter((a) => a.status === 'ACTIVE')}
            onBroadcastAlert={handleBroadcastAlert}
            onSimulateSurge={handleSimulateSurge}
            onFulfillAlert={handleFulfillAlert}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-red-600 fill-red-600" />
            <span className="font-bold text-slate-800">
              Blood Donation &amp; Emergency Network
            </span>
            <span>• HIPAA &amp; AABB Compliant</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Universal Donor Matching Engine</span>
            <span>•</span>
            <span>FIDO2 WebAuthn Protected</span>
            <span>•</span>
            <button
              onClick={() => setCompatibilityModalOpen(true)}
              className="text-red-600 font-semibold hover:underline"
            >
              Compatibility Guide
            </button>
            <span>•</span>
            <button
              id="footer-open-admin-page-btn"
              onClick={() => navigateToPage('admin')}
              className="text-slate-700 hover:text-red-600 font-bold hover:underline transition-colors flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5 text-red-600" />
              <span>Hospital Admin Page →</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Biometric Verification Modal */}
      <BiometricModal
        isOpen={biometricModalOpen}
        onClose={() => setBiometricModalOpen(false)}
        onSuccess={() => {
          setBiometricModalOpen(false);
          if (biometricCallback) {
            biometricCallback();
            setBiometricCallback(null);
          }
        }}
        reason={biometricReason}
      />

      {/* Blood Compatibility Guide Modal */}
      <CompatibilityModal
        isOpen={compatibilityModalOpen}
        onClose={() => setCompatibilityModalOpen(false)}
        userBloodType={donorProfile.bloodType}
      />

      {/* Verified Digital QR Fast-Pass Modal */}
      <QRCodePassModal
        isOpen={qrPassModalOpen}
        onClose={() => setQrPassModalOpen(false)}
        donorProfile={donorProfile}
      />

      {/* Hospital QR Fast-Pass Scanner Modal */}
      <QRCodeScannerModal
        isOpen={qrScannerModalOpen}
        onClose={() => setQrScannerModalOpen(false)}
        donorProfile={donorProfile}
        onAdmitDonor={(donorName, bloodType) => {
          setAuditLogs((prev) => [
            {
              id: `log_${Date.now()}`,
              timestamp: 'Just now',
              actor: 'Nurse Sharon (Trauma Coordinator)',
              role: 'TRAUMA_COORDINATOR',
              action: 'TRIAGE_FASTPASS_SCAN',
              details: `Admitted verified donor ${donorName} (${bloodType}) into Phlebotomy Bay #2`,
              severity: 'SUCCESS'
            },
            ...prev
          ]);
          setToastNotification({
            message: `Triage Success: Donor ${donorName} (${bloodType}) admitted to Phlebotomy Bay #2. Fast-track logged!`,
            type: 'success'
          });
        }}
      />

      {/* Active Dispatch & Fast-Pass Modal */}
      {activeDispatchAlert && (
        <ActiveDispatchModal
          isOpen={true}
          onClose={() => setActiveDispatchAlert(null)}
          alert={activeDispatchAlert}
          donorProfile={donorProfile}
          onCompleteDonation={handleCompleteDonation}
        />
      )}
    </div>
  );
}
