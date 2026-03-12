/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Heart,
  Globe,
  Lock,
  FileText,
  Smartphone,
  QrCode,
  Hospital
} from 'lucide-react';
import { cn } from './lib/utils';
import { User as UserType } from './types';
import { Button, Card, Input } from './components/UI';
import { DoctorDashboard } from './components/DoctorFlow';
import { PatientDashboard } from './components/PatientFlow';

// --- Landing Page ---

const LandingPage = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen bg-[#F8FBFB] font-sans overflow-hidden">
    <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto relative z-10">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-[#00A693] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#00A693]/20">
          <Activity size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-stone-900">Arogya-Vahini</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-500">
        <a href="#" className="hover:text-[#00A693] transition-colors">Technology</a>
        <a href="#" className="hover:text-[#00A693] transition-colors">Network</a>
        <Button onClick={onLogin} variant="teal" className="px-6 rounded-full">Portal Login</Button>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto px-6 pt-12 pb-32 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[#00A693]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl -z-10" />

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <Globe size={12} /> Empowering Rural Healthcare
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-stone-900 mb-6 tracking-tight">
            Universal <br />
            <span className="text-[#00A693]">Referral</span> <br />
            Health Vault
          </h1>
          <p className="text-lg text-stone-500 mb-10 max-w-lg leading-relaxed">
            A secure, token-based ecosystem connecting village clinics to specialist hospitals across India. 
            Your health, digitized and portable.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {[
              { icon: FileText, title: "View Your Health Records", desc: "Access all your medical data in one place." },
              { icon: Smartphone, title: "Carry History Digitally", desc: "No more paper files, everything on your phone." },
              { icon: QrCode, title: "Show QR to Doctors", desc: "Instant access for doctors with a simple scan." },
              { icon: Hospital, title: "Get Referred Easily", desc: "Seamless transfer to specialist hospitals." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#00A693] flex-shrink-0">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-stone-400 leading-tight">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onLogin} variant="teal" className="h-16 px-10 text-lg rounded-[24px]">
              Access My Health Vault <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button variant="outline" className="h-16 px-10 text-lg rounded-[24px] border-stone-200">
              Show My QR Token
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl relative">
            <img 
              src="https://picsum.photos/seed/rural-clinic/1000/1250" 
              alt="Healthcare in Rural India" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00A693]/20 to-transparent" />
            
            {/* Heartbeat Line Overlay */}
            <div className="absolute bottom-20 left-0 right-0 h-20 opacity-30 pointer-events-none">
              <svg viewBox="0 0 100 20" className="w-full h-full text-white">
                <path 
                  d="M0 10 L10 10 L15 5 L20 15 L25 10 L40 10 L45 2 L50 18 L55 10 L70 10 L75 5 L80 15 L85 10 L100 10" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5"
                  className="animate-heartbeat"
                />
              </svg>
            </div>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-red-500 animate-float">
            <Heart size={32} fill="currentColor" />
          </div>
          <div className="absolute bottom-10 -left-10 w-20 h-20 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-[#00A693] animate-float-delayed">
            <ShieldCheck size={40} />
          </div>
        </motion.div>
      </div>
    </main>
  </div>
);

// --- Auth Page ---

const AuthPage = ({ onAuth }: { onAuth: (user: UserType) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'doctor' | 'patient'>('doctor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({
      id: role === 'doctor' ? 'DOC-7722' : 'PAT-8833',
      name: role === 'doctor' ? 'Dr. Rajesh Kumar' : 'Arjun Singh',
      email: 'test@example.com',
      role: role,
      hospital_id: role === 'doctor' ? 'H1' : undefined
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#047C9E15,transparent_70%)] opacity-50" />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-brand/5 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-soft-pink/30 rounded-full blur-3xl"
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 md:p-10 shadow-2xl shadow-brand/10 border-none rounded-[48px] bg-white/90 backdrop-blur-xl">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-brand rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-brand/30 relative overflow-hidden group">
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <Activity size={32} className="md:w-10 md:h-10 relative z-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2 tracking-tight">Portal Access</h2>
            <p className="text-stone-400 text-sm font-medium">Secure login for healthcare professionals and patients.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex bg-grey-bg p-1.5 rounded-[24px] mb-8">
            <button 
              onClick={() => setRole('doctor')}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-[20px] transition-all duration-300",
                role === 'doctor' ? "bg-white text-brand shadow-sm" : "text-stone-400 hover:text-stone-600"
              )}
            >
              Doctor
            </button>
            <button 
              onClick={() => setRole('patient')}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-[20px] transition-all duration-300",
                role === 'patient' ? "bg-white text-brand shadow-sm" : "text-stone-400 hover:text-stone-600"
              )}
            >
              Patient
            </button>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-4">Email Address</label>
              <Input type="email" placeholder="name@arogya.gov.in" required className="bg-grey-bg/50 border-transparent focus:bg-white transition-all" />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-4">Password</label>
              <Input type="password" placeholder="••••••••" required className="bg-grey-bg/50 border-transparent focus:bg-white transition-all" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full h-16 text-lg rounded-[24px] mt-4 bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-stone-400 font-medium">
              {isLogin ? "New to the platform?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand font-bold hover:underline"
              >
                {isLogin ? "Register Now" : "Login"}
              </button>
            </p>
          </motion.div>
        </Card>
        
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center gap-6 text-stone-400">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <Lock size={12} /> SSL Secure
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={12} /> Govt. Verified
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [user, setUser] = useState<UserType | null>(null);

  const handleAuth = (userData: UserType) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-[#fdfdfb] selection:bg-emerald-100 selection:text-emerald-900">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <LandingPage onLogin={() => setView('auth')} />
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.5 }}>
            <AuthPage onAuth={handleAuth} />
          </motion.div>
        )}

        {view === 'dashboard' && user && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {user.role === 'doctor' ? (
              <DoctorDashboard user={user} onLogout={handleLogout} />
            ) : (
              <PatientDashboard user={user} onLogout={handleLogout} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
