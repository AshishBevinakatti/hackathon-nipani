import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  User, 
  ClipboardList, 
  QrCode, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  Hospital, 
  Calendar,
  Stethoscope,
  ChevronRight,
  Download,
  ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Card, Badge } from './UI';
import { User as UserType, Referral, ClinicalRecord } from '../types';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { formatDate, cn } from '../lib/utils';

export const PatientDashboard = ({ user, onLogout }: { user: UserType; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'referrals' | 'qr'>('vault');
  const { data: referrals } = useOfflineSync<Referral>('referrals', []);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);

  const StandoutProfile = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-brand-light rounded-[48px] p-8 md:p-12 mb-10 shadow-xl shadow-brand/5 group"
    >
      {/* Background Heartbeat Line */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 20" className="w-full h-full text-brand">
          <path 
            d="M0 10 L10 10 L15 5 L20 15 L25 10 L40 10 L45 2 L50 18 L55 10 L70 10 L75 5 L80 15 L85 10 L100 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5"
            className="animate-heartbeat"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="relative">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-white group-hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full flex items-center justify-center bg-brand/10 text-brand text-5xl font-bold">
              {user.name[0]}
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <User size={24} />
          </div>
        </div>

        <div className="text-center md:text-left space-y-4">
          <div className="space-y-1">
            <p className="text-brand font-bold text-sm md:text-base tracking-wide uppercase opacity-80">
              Patient Profile
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight">
              {user.name}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-brand/10 flex items-center gap-2 text-sm font-bold text-stone-600">
              <ShieldCheck size={16} className="text-brand" />
              Verified Account
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-brand/10 flex items-center gap-2 text-sm font-bold text-stone-600">
              <Badge variant="success" className="bg-brand/10 text-brand border-none">ID: {user.id}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Activity size={12} /> Health Status: Stable
            </div>
          </div>
        </div>

        <div className="md:ml-auto flex flex-col gap-3">
          <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-stone-400 hover:text-brand transition-colors border border-stone-100">
            <QrCode size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Mock fetching patient's own records
  useEffect(() => {
    const savedRecords = localStorage.getItem(`records_${user.id}`);
    setClinicalRecords(savedRecords ? JSON.parse(savedRecords) : [
      {
        id: '1',
        patient_id: user.id,
        doctor_id: 'd1',
        doctor_name: 'Dr. Rajesh Kumar',
        diagnosis: 'Seasonal Flu',
        symptoms: 'Fever, cough, body ache',
        medicines: 'Paracetamol 500mg, Vitamin C',
        notes: 'Rest for 3 days and drink plenty of fluids.',
        created_at: '2024-02-10T10:00:00Z'
      }
    ]);
  }, [user.id]);

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 md:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <Activity size={18} />
            </div>
            <span className="text-lg md:text-xl font-bold text-stone-900 tracking-tight">Arogya Vault</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs">
                {user.name[0]}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] md:text-xs font-bold text-stone-900">{user.name}</p>
                <p className="text-[8px] md:text-[10px] text-stone-400 uppercase tracking-tighter">ID: {user.id}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onLogout} className="text-stone-400 hover:text-red-600 p-2 h-auto">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-10">
        <StandoutProfile />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10">
          <aside className="hidden lg:block lg:col-span-1 space-y-2">
            {[
              { id: 'vault', icon: ShieldCheck, label: 'Health Records' },
              { id: 'referrals', icon: ClipboardList, label: 'My Referrals' },
              { id: 'qr', icon: QrCode, label: 'My QR Token' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                  activeTab === item.id 
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100" 
                    : "text-stone-500 hover:bg-white hover:text-stone-900"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </aside>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'vault' && (
                <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Medical History</h2>
                    <Button variant="outline" className="w-full md:w-auto"><Download size={18} className="mr-2" /> Export History</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-emerald-50 border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Blood Group</p>
                      <h3 className="text-3xl font-bold text-emerald-900">O+</h3>
                    </Card>
                    <Card className="bg-blue-50 border-blue-100">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Visits</p>
                      <h3 className="text-3xl font-bold text-blue-900">{clinicalRecords.length}</h3>
                    </Card>
                    <Card className="bg-stone-900 text-white border-none">
                      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-2">Next Checkup</p>
                      <h3 className="text-xl font-bold">March 25, 2024</h3>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-stone-900">Recent Consultations</h3>
                    {clinicalRecords.map((record) => (
                      <Card key={record.id} className="group hover:scale-[1.01] transition-all">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                              <Stethoscope size={24} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-stone-900">{record.diagnosis}</h4>
                              <p className="text-sm text-stone-500">{record.doctor_name} • {formatDate(record.created_at!)}</p>
                            </div>
                          </div>
                          <Badge variant="success">Verified</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 p-4 bg-stone-50 rounded-2xl">
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Prescription</p>
                            <p className="text-sm text-stone-700 leading-relaxed">{record.medicines}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Doctor's Advice</p>
                            <p className="text-sm text-stone-600 italic">"{record.notes}"</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'referrals' && (
                <motion.div key="referrals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Active Referrals</h2>
                  <div className="grid gap-6">
                    {referrals.map((r) => (
                      <Card key={r.id} className="relative overflow-hidden">
                        <div className={cn(
                          "absolute top-0 left-0 w-1.5 h-full",
                          r.urgency === 'emergency' ? "bg-red-500" : "bg-emerald-500"
                        )} />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex gap-5">
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                              r.urgency === 'emergency' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                              <Hospital size={28} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-xl font-bold text-stone-900">{r.to_hospital_name}</h4>
                                <Badge variant={r.urgency === 'emergency' ? 'danger' : 'warning'}>{r.urgency}</Badge>
                              </div>
                              <p className="text-stone-500 font-medium">Reason: {r.reason}</p>
                              <p className="text-xs text-stone-400 mt-2">Issued by {r.doctor_name} on {formatDate(r.created_at!)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button variant="outline" className="flex-1 md:flex-none">View Details</Button>
                            <Button className="flex-1 md:flex-none">Get QR Token</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {referrals.length === 0 && (
                      <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-200">
                        <div className="w-16 h-16 bg-stone-50 text-stone-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ClipboardList size={32} />
                        </div>
                        <p className="text-stone-400 font-medium">No referrals issued yet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'qr' && (
                <motion.div key="qr" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto text-center space-y-8 py-10">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-stone-900">Arogya Token</h2>
                    <p className="text-stone-500">Your universal digital health identity.</p>
                  </div>
                  
                  <Card className="p-12 bg-white shadow-2xl border-none relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
                    <div className="bg-stone-50 p-8 rounded-[40px] mb-8 flex items-center justify-center shadow-inner">
                      <QRCodeSVG value={`arogya-patient-${user.id}`} size={220} level="H" includeMargin />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-stone-900">{user.name}</h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                        <ShieldCheck size={12} /> Encrypted & Secure
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-14 text-base"><Download size={20} className="mr-2" /> Save to Phone</Button>
                    <Button variant="outline" className="h-14 text-base">Print Card</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="nav-bulge-container">
          {[
            { id: 'vault', icon: ShieldCheck, label: 'Records' },
            { id: 'referrals', icon: ClipboardList, label: 'Referrals' },
            { id: 'qr', icon: QrCode, label: 'Token' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                activeTab === item.id ? "nav-item-active" : "text-stone-400"
              )}
            >
              <item.icon size={24} />
              {activeTab !== item.id && <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
