import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  Activity, 
  User, 
  ClipboardList, 
  QrCode, 
  Plus, 
  Search, 
  ArrowLeft, 
  LogOut, 
  Wifi, 
  WifiOff,
  ChevronRight,
  Camera,
  Stethoscope,
  Pill,
  FileSearch,
  MessageSquare,
  Hospital,
  AlertCircle,
  X,
  Calendar,
  Video,
  BarChart3,
  Settings,
  UserCircle,
  Edit3,
  Save,
  Database,
  Bell,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Button, Card, Input, TextArea, Badge } from './UI';
import { User as UserType, Patient, Referral, ClinicalRecord } from '../types';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { formatDate, generateToken, cn } from '../lib/utils';

export const DoctorDashboard = ({ user, onLogout }: { user: UserType; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'scan' | 'referrals' | 'vault' | 'appointments' | 'teleconsultation' | 'reports' | 'settings' | 'profile'>('overview');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddReferral, setShowAddReferral] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(user);
  
  const { data: patients, addItem: addPatient } = useOfflineSync<Patient>('patients', []);
  const { data: referrals, addItem: addReferral, isOnline } = useOfflineSync<Referral>('referrals', []);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);
  const [scannedPatient, setScannedPatient] = useState<Patient | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScan = (id: string) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      setScannedPatient(patient);
      setScanError(null);
    } else {
      setScanError("Patient not found with ID: " + id);
      setScannedPatient(null);
    }
  };

  const ScanQR = () => {
    useEffect(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          scanner.clear();
          handleScan(decodedText);
        },
        (error) => {
          // silent error
        }
      );

      return () => {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      };
    }, []);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Scan Patient QR</h1>
            <p className="text-stone-500 mt-1">Point your camera at the patient's QR code to access their records.</p>
          </div>
          <Button onClick={() => setActiveTab('overview')} variant="outline" className="rounded-full">
            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-0 overflow-hidden border-none shadow-xl shadow-stone-200/50 flex flex-col items-center justify-center min-h-[400px] bg-stone-900">
            <div id="reader" className="w-full"></div>
            <div className="p-6 text-center text-white/60 text-sm">
              <Camera size={24} className="mx-auto mb-2 opacity-50" />
              Align QR code within the frame
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {scanError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 mb-4"
              >
                <AlertCircle size={18} />
                <p className="text-sm font-medium">{scanError}</p>
                <button onClick={() => setScanError(null)} className="ml-auto text-red-400 hover:text-red-600">
                  <X size={16} />
                </button>
              </motion.div>
            )}

            {scannedPatient ? (
              <motion.div 
                key="scanned-result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="h-full flex flex-col justify-between border-none shadow-xl shadow-emerald-100/50 bg-emerald-50/30">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center text-2xl font-bold">
                        {scannedPatient.name[0]}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-stone-900">{scannedPatient.name}</h3>
                        <p className="text-stone-500">ID: {scannedPatient.id}</p>
                        <Badge variant="success" className="mt-2">Verified Patient</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-stone-100">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Gender</p>
                        <p className="font-bold text-stone-900">{scannedPatient.gender}</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-stone-100">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">DOB</p>
                        <p className="font-bold text-stone-900">{scannedPatient.dob}</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-stone-100">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Blood Group</p>
                        <p className="font-bold text-stone-900">{scannedPatient.blood_group || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-stone-100">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Contact</p>
                        <p className="font-bold text-stone-900">{scannedPatient.contact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex gap-3">
                    <Button 
                      onClick={() => {
                        setSelectedPatient(scannedPatient);
                        setScannedPatient(null);
                      }} 
                      variant="teal" 
                      className="flex-1 rounded-2xl h-14"
                    >
                      Open Health Records <ChevronRight size={18} className="ml-2" />
                    </Button>
                    <Button 
                      onClick={() => setScannedPatient(null)} 
                      variant="outline" 
                      className="rounded-2xl h-14"
                    >
                      Scan Again
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-full flex flex-col items-center justify-center text-center p-10 border-dashed border-2 border-stone-200 bg-stone-50/50">
                <div className="w-20 h-20 bg-stone-100 text-stone-300 rounded-full flex items-center justify-center mb-6">
                  <User size={40} />
                </div>
                <h3 className="text-xl font-bold text-stone-400">Waiting for Scan</h3>
                <p className="text-stone-400 mt-2 max-w-xs">
                  Once a QR code is detected, the patient's basic information will appear here.
                </p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  // Mock fetching records when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      const savedRecords = localStorage.getItem(`records_${selectedPatient.id}`);
      setClinicalRecords(savedRecords ? JSON.parse(savedRecords) : []);
    }
  }, [selectedPatient]);

  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      dob: formData.get('dob') as string,
      gender: formData.get('gender') as string,
      blood_group: formData.get('blood_group') as string,
      contact: formData.get('contact') as string,
      address: formData.get('address') as string,
      created_at: new Date().toISOString(),
    };
    addPatient(newPatient);
    setShowAddPatient(false);
  };

  const handleAddRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const formData = new FormData(e.currentTarget);
    const newRecord: ClinicalRecord = {
      id: Math.random().toString(36).substr(2, 9),
      patient_id: selectedPatient.id,
      doctor_id: user.id,
      doctor_name: user.name,
      symptoms: formData.get('symptoms') as string,
      diagnosis: formData.get('diagnosis') as string,
      medicines: formData.get('medicines') as string,
      tests: formData.get('tests') as string,
      notes: formData.get('notes') as string,
      created_at: new Date().toISOString(),
    };
    const updatedRecords = [newRecord, ...clinicalRecords];
    setClinicalRecords(updatedRecords);
    localStorage.setItem(`records_${selectedPatient.id}`, JSON.stringify(updatedRecords));
    setShowAddRecord(false);
  };

  const handleAddReferral = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const formData = new FormData(e.currentTarget);
    const newReferral: Referral = {
      id: Math.random().toString(36).substr(2, 9),
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.name,
      from_doctor_id: user.id,
      doctor_name: user.name,
      to_hospital_name: formData.get('hospital') as string,
      reason: formData.get('reason') as string,
      urgency: formData.get('urgency') as any,
      doctor_notes: formData.get('notes') as string,
      status: 'pending',
      token: generateToken(),
      created_at: new Date().toISOString(),
    };
    addReferral(newReferral);
    setShowAddReferral(false);
  };

  const ProfileSection = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">My Profile</h1>
          <p className="text-stone-500">Manage your professional information and clinic details.</p>
        </div>
        <Button 
          onClick={() => isEditingProfile ? setIsEditingProfile(false) : setIsEditingProfile(true)}
          variant={isEditingProfile ? "outline" : "teal"}
        >
          {isEditingProfile ? <><X size={18} className="mr-2" /> Cancel</> : <><Edit3 size={18} className="mr-2" /> Edit Profile</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 text-center py-10">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full bg-[#00A693]/10 text-[#00A693] rounded-[40px] flex items-center justify-center text-4xl font-bold border-2 border-[#00A693]/20">
              {profileData.avatar ? <img src={profileData.avatar} className="w-full h-full object-cover rounded-[40px]" /> : profileData.name[0]}
            </div>
            {isEditingProfile && (
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-[#00A693] border border-stone-100">
                <Camera size={20} />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-bold text-stone-900">{profileData.name}</h2>
          <p className="text-[#00A693] font-semibold">{profileData.specialization || 'General Physician'}</p>
          <div className="mt-6 pt-6 border-t border-stone-100 space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Hospital size={16} className="text-stone-400" />
              <span className="text-stone-600">{profileData.clinic_name || 'Primary Health Center'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <UserCircle size={16} className="text-stone-400" />
              <span className="text-stone-600">ID: {profileData.id}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          {isEditingProfile ? (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsEditingProfile(false); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-4">Full Name</label>
                  <Input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-4">Specialization</label>
                  <Input value={profileData.specialization} onChange={e => setProfileData({...profileData, specialization: e.target.value})} placeholder="e.g. Cardiologist" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-4">Phone Number</label>
                  <Input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} placeholder="+91 00000 00000" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-4">Clinic/Hospital Name</label>
                  <Input value={profileData.clinic_name} onChange={e => setProfileData({...profileData, clinic_name: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-4">Professional Bio</label>
                  <TextArea value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} placeholder="Tell us about your experience..." />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>Discard Changes</Button>
                <Button type="submit" variant="teal"><Save size={18} className="mr-2" /> Save Profile</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Professional Bio</h4>
                <p className="text-stone-600 leading-relaxed">
                  {profileData.bio || 'No bio provided yet. Click edit to add your professional background and experience.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Contact Info</h4>
                  <p className="text-stone-900 font-medium">{profileData.phone || 'Not provided'}</p>
                  <p className="text-stone-500 text-sm">{profileData.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Location</h4>
                  <p className="text-stone-900 font-medium">{profileData.clinic_name || 'Primary Health Center'}</p>
                  <p className="text-stone-500 text-sm">Karnataka, India</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );

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
            {profileData.avatar ? (
              <img src={profileData.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand/10 text-brand text-5xl font-bold">
                {profileData.name[0]}
              </div>
            )}
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <Stethoscope size={24} />
          </div>
        </div>

        <div className="text-center md:text-left space-y-4">
          <div className="space-y-1">
            <p className="text-brand font-bold text-sm md:text-base tracking-wide uppercase opacity-80">
              {profileData.specialization || 'General Physician'}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight">
              {profileData.name}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-brand/10 flex items-center gap-2 text-sm font-bold text-stone-600">
              <Hospital size={16} className="text-brand" />
              {profileData.clinic_name || 'Primary Health Center'}
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-brand/10 flex items-center gap-2 text-sm font-bold text-stone-600">
              <Badge variant="success" className="bg-brand/10 text-brand border-none">ID: {profileData.id}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-400">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
              Rating 4.8 • 120+ Consultations
            </p>
          </div>
        </div>

        <div className="md:ml-auto flex flex-col gap-3">
          <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-stone-400 hover:text-brand transition-colors border border-stone-100">
            <Bell size={20} />
          </button>
          <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-stone-400 hover:text-brand transition-colors border border-stone-100">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const PatientProfile = ({ patient, ...props }: { patient: Patient; [key: string]: any }) => (
    <motion.div 
      {...props}
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedPatient(null)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to List
        </button>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddRecord(true)} variant="outline">
            <Plus size={18} className="mr-2" /> Add Clinical Record
          </Button>
          <Button onClick={() => setShowAddReferral(true)} variant="danger">
            <Hospital size={18} className="mr-2" /> Refer Patient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit sticky top-24">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {patient.name[0]}
            </div>
            <h2 className="text-2xl font-bold text-stone-900">{patient.name}</h2>
            <p className="text-stone-500">ID: {patient.id}</p>
          </div>
          <div className="space-y-4 border-t border-stone-100 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">DOB</span>
              <span className="font-semibold">{patient.dob}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Gender</span>
              <span className="font-semibold">{patient.gender}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Blood Group</span>
              <Badge variant="danger">{patient.blood_group || 'N/A'}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Contact</span>
              <span className="font-semibold">{patient.contact}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Recent Vitals</h4>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{t:'10/02', v:72}, {t:'15/02', v:75}, {t:'20/02', v:70}, {t:'25/02', v:82}, {t:'01/03', v:78}]}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Heart Rate (Avg)</p>
              <p className="text-sm font-bold text-emerald-600">75 BPM</p>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-stone-900">Clinical History</h3>
          <div className="space-y-4">
            {clinicalRecords.map((record) => (
              <Card key={record.id} className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-stone-900">{record.diagnosis || 'General Checkup'}</h4>
                    <p className="text-xs text-stone-500">{formatDate(record.created_at!)} • {record.doctor_name}</p>
                  </div>
                  <Badge variant="success">Record</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">Symptoms</p>
                    <p className="text-stone-700">{record.symptoms}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">Medicines</p>
                    <p className="text-stone-700">{record.medicines}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">Doctor Notes</p>
                    <p className="text-stone-600 italic">"{record.notes}"</p>
                  </div>
                </div>
              </Card>
            ))}
            {clinicalRecords.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400">
                No clinical records found for this patient.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-72 bg-white border-r border-stone-200 flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-stone-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#00A693] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#00A693]/20">
              <Activity size={20} />
            </div>
            <span className="text-xl font-bold text-stone-900 tracking-tight">Arogya-Vahini</span>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full p-4 rounded-2xl border transition-all flex items-center gap-3 group",
              activeTab === 'profile' 
                ? "bg-[#00A693]/5 border-[#00A693]/20" 
                : "bg-stone-50 border-stone-100 hover:border-stone-200"
            )}
          >
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#00A693] group-hover:scale-110 transition-transform">
              <UserCircle size={24} />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">Doctor Profile</p>
              <p className="text-sm font-bold text-stone-900 truncate">{profileData.name}</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto scrollbar-hide">
          {[
            { id: 'overview', icon: Activity, label: 'Overview' },
            { id: 'referrals', icon: ClipboardList, label: 'Referrals' },
            { id: 'patients', icon: User, label: 'Patients' },
            { id: 'scan', icon: QrCode, label: 'Scan QR' },
            { id: 'vault', icon: Database, label: 'Health Vault' },
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'teleconsultation', icon: Video, label: 'Teleconsultation' },
            { id: 'reports', icon: BarChart3, label: 'Reports' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setSelectedPatient(null); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === item.id && !selectedPatient
                  ? "bg-[#00A693] text-white shadow-lg shadow-[#00A693]/20" 
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-stone-100">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest mb-4",
            isOnline ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isOnline ? "bg-emerald-500" : "bg-amber-500")} />
            {isOnline ? "System Online" : "Offline Mode"}
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto pb-24 md:pb-10">
        <AnimatePresence mode="wait">
          {selectedPatient ? (
            <PatientProfile key="profile" patient={selectedPatient} />
          ) : activeTab === 'overview' ? (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 md:space-y-10">
              <StandoutProfile />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Clinic Overview</h2>
                  <p className="text-stone-400 font-medium">Real-time status of your medical facility</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <Button onClick={() => setShowAddPatient(true)} variant="outline" className="flex-1 md:flex-none rounded-full">
                    <Plus size={18} className="mr-2" /> New Patient
                  </Button>
                  <Button onClick={() => setActiveTab('scan')} variant="teal" className="flex-1 md:flex-none rounded-full">
                    <QrCode size={18} className="mr-2" /> Scan QR
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Stats - Bento Style */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }} 
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="md:col-span-2"
                  >
                    <Card className="bg-gradient-to-br from-[#00A693] to-[#008d7d] text-white border-none shadow-2xl shadow-[#00A693]/30 relative overflow-hidden p-8 h-80">
                      <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute left-0 bottom-0 w-full h-48 opacity-20">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[{v:30, t:'Mon'},{v:45, t:'Tue'},{v:35, t:'Wed'},{v:60, t:'Thu'},{v:50, t:'Fri'},{v:75, t:'Sat'},{v:65, t:'Sun'}]}>
                            <defs>
                              <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fff" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke="#fff" fill="url(#colorV)" strokeWidth={4} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Patient Growth</p>
                            <h3 className="text-6xl font-bold tracking-tighter">{patients.length}</h3>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-xl text-xs font-bold border border-white/20 mb-2">+18.4%</div>
                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">vs last month</p>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="flex gap-8">
                            <div>
                              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">New Today</p>
                              <p className="text-xl font-bold">12</p>
                            </div>
                            <div>
                              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Recovered</p>
                              <p className="text-xl font-bold">48</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="relative overflow-hidden h-full border-none shadow-xl shadow-stone-200/50 bg-white p-6">
                      <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-50 rounded-full blur-3xl" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Hospital size={24} />
                          </div>
                          <Badge variant="danger" className="animate-pulse">3 Urgent</Badge>
                        </div>
                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Referrals</p>
                        <h3 className="text-4xl font-bold text-stone-900 mb-4">{referrals.filter(r => r.status === 'pending').length}</h3>
                        <div className="mt-auto pt-4 border-t border-stone-50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500 font-medium">Pending Review</span>
                            <span className="text-amber-600 font-bold">85%</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full w-[85%]" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="relative overflow-hidden h-full border-none shadow-xl shadow-stone-200/50 bg-white p-6">
                      <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-50 rounded-full blur-3xl" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Calendar size={24} />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Next Up</p>
                            <p className="text-xs font-bold text-stone-900">2:30 PM</p>
                          </div>
                        </div>
                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Appointments</p>
                        <h3 className="text-4xl font-bold text-stone-900 mb-4">8</h3>
                        <div className="mt-auto">
                          <div className="flex -space-x-2 mb-3">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[8px] font-bold text-stone-400">
                                {i}
                              </div>
                            ))}
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
                              +4
                            </div>
                          </div>
                          <p className="text-[10px] text-stone-400 font-medium italic">"Preparation required for 2 cases"</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {/* Side Stats - Bento Style */}
                <div className="lg:col-span-4 space-y-6">
                  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="relative overflow-hidden border-none shadow-xl shadow-stone-200/50 bg-white p-6">
                      <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-50 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00A693] relative">
                            <Database size={28} />
                            <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
                          </div>
                          <div>
                            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Sync Status</p>
                            <h3 className="text-2xl font-bold text-[#00A693]">Live & Secure</h3>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-end gap-1 h-6">
                              {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((delay, i) => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: [4, 16, 4] }}
                                  transition={{ duration: 1.2, repeat: Infinity, delay: delay }}
                                  className="w-1 bg-[#00A693]/30 rounded-full"
                                />
                              ))}
                            </div>
                            <p className="text-xs text-stone-500 font-medium">Encrypted connection active</p>
                          </div>
                          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                            <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                              <span>Storage Used</span>
                              <span>2.4 / 10 GB</span>
                            </div>
                            <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#00A693] w-[24%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="bg-stone-900 text-white border-none shadow-2xl shadow-stone-900/20 relative overflow-hidden p-6">
                      <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Activity size={64} />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-lg font-bold mb-1">Quick Actions</h4>
                        <p className="text-white/50 text-xs mb-6">Commonly used medical tools</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors flex flex-col items-center gap-2 border border-white/5">
                            <QrCode size={20} className="text-[#00A693]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Scan</span>
                          </button>
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors flex flex-col items-center gap-2 border border-white/5">
                            <Plus size={20} className="text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Add</span>
                          </button>
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors flex flex-col items-center gap-2 border border-white/5">
                            <Video size={20} className="text-purple-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Tele</span>
                          </button>
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors flex flex-col items-center gap-2 border border-white/5">
                            <FileSearch size={20} className="text-amber-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Vault</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-0 overflow-hidden border-none shadow-xl shadow-stone-200/50">
                  <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#00A693]">
                        <User size={18} />
                      </div>
                      <h4 className="font-bold text-stone-900">Recent Patients</h4>
                    </div>
                    <Button variant="ghost" className="text-xs h-8" onClick={() => setActiveTab('patients')}>View All</Button>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {patients.length > 0 ? patients.slice(-5).reverse().map((p) => (
                      <div key={p.id} onClick={() => setSelectedPatient(p)} className="p-4 hover:bg-stone-50 transition-colors flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-600 font-bold group-hover:bg-[#00A693]/10 group-hover:text-[#00A693] transition-colors">
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-stone-900">{p.name}</p>
                            <p className="text-xs text-stone-500">ID: {p.id} • {p.gender}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-stone-300 group-hover:text-[#00A693] group-hover:translate-x-1 transition-all" />
                      </div>
                    )) : (
                      <div className="p-10 text-center text-stone-400 text-sm">No patients registered yet.</div>
                    )}
                  </div>
                </Card>

                <Card className="p-0 overflow-hidden border-none shadow-xl shadow-stone-200/50">
                  <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-amber-500">
                        <Bell size={18} />
                      </div>
                      <h4 className="font-bold text-stone-900">Notifications</h4>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">Emergency Referral</p>
                        <p className="text-xs text-stone-500 mt-1">Patient Arjun Singh needs immediate attention at Specialist Hospital.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Video size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">Teleconsultation in 15m</p>
                        <p className="text-xs text-stone-500 mt-1">Video call scheduled with Dr. Meera for case review.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : activeTab === 'patients' ? (
            <motion.div key="patients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-stone-900">Patient Directory</h1>
                <div className="flex gap-2">
                  <Button onClick={() => setActiveTab('scan')} variant="outline" className="rounded-full">
                    <QrCode size={18} className="mr-2" /> Scan QR
                  </Button>
                  <Button onClick={() => setShowAddPatient(true)} variant="teal" className="rounded-full">
                    <Plus size={18} className="mr-2" /> Add Patient
                  </Button>
                </div>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-xl shadow-stone-200/50">
                <div className="p-4 bg-stone-50/50 border-b border-stone-100">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <Input className="pl-12 bg-white" placeholder="Search by name, ID, or contact..." />
                  </div>
                </div>
                <div className="divide-y divide-stone-100">
                  {patients.length > 0 ? patients.map(p => (
                    <div key={p.id} onClick={() => setSelectedPatient(p)} className="p-6 hover:bg-stone-50 transition-all flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-600 font-bold group-hover:bg-[#00A693] group-hover:text-white transition-all shadow-sm">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-stone-900">{p.name}</p>
                          <p className="text-sm text-stone-500">{p.gender} • {p.dob} • ID: {p.id}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-stone-300 group-hover:text-[#00A693] group-hover:translate-x-1 transition-all" />
                    </div>
                  )) : (
                    <div className="py-20 text-center text-stone-400">No patients found.</div>
                  )}
                </div>
              </Card>
            </motion.div>
          ) : activeTab === 'scan' ? (
            <ScanQR key="scan-tab" />
          ) : activeTab === 'profile' ? (
            <ProfileSection key="profile-tab" />
          ) : (
            <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-20 text-center space-y-6">
              <div className="w-24 h-24 bg-[#00A693]/10 text-[#00A693] rounded-[40px] flex items-center justify-center mx-auto mb-8">
                {activeTab === 'referrals' && <ClipboardList size={48} />}
                {activeTab === 'vault' && <Database size={48} />}
                {activeTab === 'appointments' && <Calendar size={48} />}
                {activeTab === 'teleconsultation' && <Video size={48} />}
                {activeTab === 'reports' && <BarChart3 size={48} />}
                {activeTab === 'settings' && <Settings size={48} />}
                {activeTab === 'scan' && <QrCode size={48} />}
              </div>
              <h1 className="text-4xl font-bold text-stone-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-stone-500 text-lg max-w-lg mx-auto">
                This section is currently being synchronized with the central health network. 
                Please check back in a moment.
              </p>
              <Button variant="outline" onClick={() => setActiveTab('overview')} className="rounded-full px-8">Return to Dashboard</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="nav-bulge-container">
          {[
            { id: 'overview', icon: Activity, label: 'Home' },
            { id: 'patients', icon: User, label: 'Patients' },
            { id: 'scan', icon: QrCode, label: 'Scan' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setSelectedPatient(null); }}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                activeTab === item.id && !selectedPatient ? "nav-item-active" : "text-stone-400"
              )}
            >
              <item.icon size={24} />
              {activeTab !== item.id && <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
          <button onClick={onLogout} className="flex flex-col items-center gap-1 text-stone-400">
            <LogOut size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Exit</span>
          </button>
        </div>
      </nav>

      {/* Modals - Clinical Record */}
      <AnimatePresence>
        {showAddRecord && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl"
            >
              <Card className="shadow-2xl border-none p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                      <Stethoscope size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900">New Clinical Record</h3>
                  </div>
                  <Button variant="ghost" onClick={() => setShowAddRecord(false)} className="p-2 h-auto"><X size={20} /></Button>
                </div>
                <form onSubmit={handleAddRecord} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Symptoms</label>
                      <TextArea name="symptoms" placeholder="Describe symptoms..." required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Diagnosis</label>
                      <Input name="diagnosis" placeholder="Primary diagnosis" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Tests Done</label>
                      <Input name="tests" placeholder="e.g. Blood Test, X-Ray" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Medicines Prescribed</label>
                      <TextArea name="medicines" placeholder="List medicines and dosage..." required />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Doctor Notes</label>
                      <TextArea name="notes" placeholder="Additional observations..." />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" type="button" onClick={() => setShowAddRecord(false)} className="flex-1 h-12">Cancel</Button>
                    <Button type="submit" className="flex-1 h-12">Save Record</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}

        {showAddReferral && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl"
            >
              <Card className="shadow-2xl border-none p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                      <Hospital size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900">Refer Patient</h3>
                  </div>
                  <Button variant="ghost" onClick={() => setShowAddReferral(false)} className="p-2 h-auto"><X size={20} /></Button>
                </div>
                <form onSubmit={handleAddReferral} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Referred Hospital</label>
                      <Input name="hospital" placeholder="e.g. District General Hospital" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Reason for Referral</label>
                      <Input name="reason" placeholder="e.g. Specialized cardiac care needed" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Urgency Level</label>
                      <select name="urgency" className="flex h-11 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Doctor Notes</label>
                      <TextArea name="notes" placeholder="Notes for the specialist..." />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" type="button" onClick={() => setShowAddReferral(false)} className="flex-1 h-12">Cancel</Button>
                    <Button variant="danger" type="submit" className="flex-1 h-12">Confirm Referral</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}

        {showAddPatient && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg"
            >
              <Card className="shadow-2xl border-none p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-stone-900">Register Patient</h3>
                  <Button variant="ghost" onClick={() => setShowAddPatient(false)} className="p-2 h-auto"><X size={20} /></Button>
                </div>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Full Name</label>
                      <Input name="name" placeholder="Patient's name" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">DOB</label>
                      <Input name="dob" type="date" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Gender</label>
                      <select name="gender" className="flex h-11 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Blood Group</label>
                      <Input name="blood_group" placeholder="e.g. O+" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Contact</label>
                      <Input name="contact" placeholder="+91 00000 00000" required />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Address</label>
                      <Input name="address" placeholder="Full address" required />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" type="button" onClick={() => setShowAddPatient(false)} className="flex-1 h-12">Cancel</Button>
                    <Button type="submit" className="flex-1 h-12">Register</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
