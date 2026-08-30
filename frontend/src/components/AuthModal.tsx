import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  Users, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  School
} from 'lucide-react';
import { UserRole } from '../types';
import { COLLEGES_LIST } from '../data/colleges';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: UserRole; email: string }) => void;
  initialMode?: 'login' | 'register' | 'switchRole';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'switchRole'>(initialMode);
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState(COLLEGES_LIST[0].name);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickRoleSwitch = (selectedRole: UserRole, demoName: string, demoEmail: string) => {
    localStorage.setItem('role', selectedRole);
    localStorage.setItem('userName', demoName);
    onLoginSuccess({
      name: demoName,
      role: selectedRole,
      email: demoEmail
    });
    onClose();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const bodyPayload = mode === 'register' 
        ? { name, email, password, role, extraInfo: { college, course: 'CSIT', batch: '2025-29' } }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      let data: any = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.error || `Authentication failed with status ${res.status}`);
      }

      if (data.token) {
        localStorage.setItem('skillbridge_token', data.token);
      }
      const loggedUser = data.user || { name: name || 'Student User', role };
      localStorage.setItem('role', loggedUser.role);
      localStorage.setItem('userName', loggedUser.name);

      onLoginSuccess({
        name: loggedUser.name,
        role: loggedUser.role as UserRole,
        email: loggedUser.email || email
      });
      onClose();
    } catch (err: any) {
      const errMsg = err.message || 'Authentication failed. Please check your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegisterWithEmail = () => {
    setMode('register');
    setError('');
    if (!name && email) {
      const derivedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      setName(derivedName);
    }
  };

  const handleSwitchToLoginWithEmail = () => {
    setMode('login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-[#0A0F2E] border border-[#1E2964] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 z-10 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#0E1538] hover:bg-[#18214D] text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-black text-lg mb-3">
            SB
          </div>
          <h2 className="text-xl font-extrabold text-white">SkillBridge AI Portal</h2>
          <p className="text-xs text-slate-400 mt-1">SIH26044 · Academia-Industry Career OS</p>
        </div>

        {/* 1-Click Role Switcher Presets */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#0E1538] border border-[#1E2964]">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Instant Demo Switcher</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickRoleSwitch('student', 'Adarsh Pratap Singh', 'adarsh@mjpru.ac.in')}
              className="p-2.5 rounded-lg bg-[#141C48] hover:bg-[#1C2660] border border-[#232F6E] hover:border-[#7C5CFC] text-left transition-all group"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400 mb-1" />
              <p className="text-[11px] font-bold text-white leading-tight">Student</p>
              <p className="text-[9px] text-slate-400">CSIT 2025-29</p>
            </button>

            <button
              onClick={() => handleQuickRoleSwitch('mentor', 'Amit Verma', 'amit.verma@tcs.com')}
              className="p-2.5 rounded-lg bg-[#141C48] hover:bg-[#1C2660] border border-[#232F6E] hover:border-[#7C5CFC] text-left transition-all group"
            >
              <Users className="w-4 h-4 text-emerald-400 mb-1" />
              <p className="text-[11px] font-bold text-white leading-tight">Industry Mentor</p>
              <p className="text-[9px] text-slate-400">TCS Architect</p>
            </button>

            <button
              onClick={() => handleQuickRoleSwitch('hod', 'Dr. Arvind K. Sharma', 'hod.csit@mjpru.ac.in')}
              className="p-2.5 rounded-lg bg-[#141C48] hover:bg-[#1C2660] border border-[#232F6E] hover:border-[#7C5CFC] text-left transition-all group"
            >
              <Building2 className="w-4 h-4 text-amber-400 mb-1" />
              <p className="text-[11px] font-bold text-white leading-tight">HOD / Faculty</p>
              <p className="text-[9px] text-slate-400">MJPRU CSIT</p>
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-[#18214D] mb-5">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
              mode === 'login'
                ? 'border-[#7C5CFC] text-[#C4B5FD]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
              mode === 'register'
                ? 'border-[#7C5CFC] text-[#C4B5FD]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Database Status indicator */}
        <div className="mb-4 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0E1538] border border-[#1E2964] text-[10.5px]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Database Ledger Active
          </span>
          <span className="text-slate-400">
            {mode === 'login' ? 'Demo pass: password123' : 'Saves directly to DB'}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adarsh Pratap Singh"
                  className="w-full bg-[#0E1538] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Account Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'mentor', 'hod'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all ${
                    role === r
                      ? 'bg-[#7C5CFC]/20 border-[#7C5CFC] text-white'
                      : 'bg-[#0E1538] border-[#1E2964] text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'student' ? 'Student' : r === 'mentor' ? 'Mentor' : 'HOD / Faculty'}
                </button>
              ))}
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">University / College</label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-[#0E1538] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none appearance-none"
                >
                  {COLLEGES_LIST.map((col) => (
                    <option key={col.id} value={col.name} className="bg-[#090E2B]">
                      {col.name} ({col.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.ac.in"
                className="w-full bg-[#0E1538] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0E1538] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
          >
            <span>{loading ? 'Authenticating...' : mode === 'register' ? 'Register & Enter Workspace' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
