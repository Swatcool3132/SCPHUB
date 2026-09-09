import React, { useState, useEffect } from 'react';
import {
  Shield,
  KeyRound,
  User,
  Check,
  X,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Laptop,
  CheckCircle2,
  Lock
} from 'lucide-react';
import {
  CLEARANCE_LEVELS,
  AVATAR_OPTIONS,
  registerAccount,
  loginAccount,
  getSavedUsers
} from '../data/auth';
import { ScpLogo } from './ScpLogo';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState('signin'); // 'signin' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState('shield');
  const [selectedClearance, setSelectedClearance] = useState(2);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      const users = getSavedUsers();
      setSavedUsers(users);
      if (users.length === 0) {
        setTab('register');
      } else {
        setTab('signin');
        if (!username && users.length > 0) {
          setUsername(users[0].username);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    try {
      const user = loginAccount({ username, password, rememberDevice });
      setSuccessMsg(`Welcome back, ${user.username}! Auto-login enabled.`);
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in.');
    }
  };

  const handleRegister = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    try {
      const user = registerAccount({
        username,
        password,
        clearanceLevel: selectedClearance,
        avatarId: selectedAvatarId,
        rememberDevice
      });
      setSuccessMsg(`Account created for ${user.username}! Signed in.`);
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Graphic / Brand */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ScpLogo className="w-8 h-8" showGlow />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white uppercase">
                  SCPHUB <span className="text-sky-400">ID</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Laptop className="w-2.5 h-2.5" />
                  Local Account
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Agent Credentials & Secure Vault Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'signin'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error / Success Feedback Banner */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {tab === 'signin' ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Saved Accounts Quick Select */}
              {savedUsers.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Saved Accounts:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {savedUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setUsername(u.username);
                          setErrorMsg('');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                          username.toLowerCase() === u.username.toLowerCase()
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/60'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <span>{u.avatar?.icon || '🛡️'}</span>
                        <span>{u.username}</span>
                        <span className="text-[10px] text-slate-500">({u.clearance?.badge})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Agent Codename / Username
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Agent-Viper, Alex, Phantom"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              {/* Password / PIN Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Passcode / PIN
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your security passcode"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Auto Sign In Checkbox */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <input
                  type="checkbox"
                  id="remember-device-signin"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="remember-device-signin" className="text-xs text-slate-300 cursor-pointer select-none">
                  <span className="font-bold text-white block">Remember Me (Auto-Login)</span>
                  <span className="text-[11px] text-slate-400">
                    Stay logged in automatically whenever you return to SCPHub.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Codename */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Choose Agent Codename / Username
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Shadow-9, Alex, CyberGhost"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              {/* Password / PIN */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Choose Passcode / PIN
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password or 4+ digit PIN"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Tactical Emblem
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center border transition cursor-pointer ${
                        selectedAvatarId === av.id
                          ? 'bg-sky-500/25 border-sky-400 ring-2 ring-sky-500/40'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                      title={av.name}
                    >
                      <span className="text-xl">{av.icon}</span>
                      <span className="text-[9px] text-slate-400 truncate max-w-full mt-0.5">
                        {av.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Clearance Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Security Clearance Level
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {CLEARANCE_LEVELS.map((c) => (
                    <button
                      key={c.level}
                      type="button"
                      onClick={() => setSelectedClearance(c.level)}
                      className={`p-2 rounded-lg text-left text-xs font-bold flex items-center justify-between border transition cursor-pointer ${
                        selectedClearance === c.level
                          ? 'bg-slate-800 border-sky-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{c.title}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${c.color}`}>
                        {c.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <input
                  type="checkbox"
                  id="remember-device-reg"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="remember-device-reg" className="text-xs text-slate-300 cursor-pointer select-none">
                  <span className="font-bold text-white block">Remember Me (Auto-Login)</span>
                  <span className="text-[11px] text-slate-400">
                    Automatically loads this profile whenever you return to SCPHub.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Account & Sign In</span>
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              🔒 Stored securely in your browser storage. Fast, private, and offline-ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
