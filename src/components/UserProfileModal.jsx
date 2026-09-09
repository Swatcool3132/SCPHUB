import React, { useState } from 'react';
import {
  Shield,
  User,
  X,
  LogOut,
  Sparkles,
  Gamepad2,
  Trophy,
  Calendar,
  Check,
  Edit2,
  Laptop
} from 'lucide-react';
import { CLEARANCE_LEVELS, AVATAR_OPTIONS, updateUserData } from '../data/auth';
import { ScpLogo } from './ScpLogo';

export const UserProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onSignOut,
  onSwitchAccount,
  onUserUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(currentUser?.avatar?.id || 'shield');
  const [selectedClearance, setSelectedClearance] = useState(currentUser?.clearance?.level || 2);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = () => {
    const selectedAvatar = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId) || currentUser.avatar;
    const selectedClearanceObj = CLEARANCE_LEVELS.find((c) => c.level === selectedClearance) || currentUser.clearance;

    const updated = updateUserData(currentUser.username, (u) => ({
      ...u,
      avatar: selectedAvatar,
      clearance: selectedClearanceObj,
    }));

    if (updated) {
      onUserUpdated(updated);
    }
    setIsEditing(false);
  };

  const formattedJoinDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Active Agent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Card Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ScpLogo className="w-7 h-7" showGlow />
            <span className="text-base font-black tracking-tight text-white uppercase">
              AGENT <span className="text-sky-400">CREDENTIALS</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Agent Identification Badge */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
              <Shield className="w-28 h-28 text-white" />
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {currentUser.avatar?.icon || '🛡️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white truncate tracking-tight">
                    {currentUser.username}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Device Active
                  </span>
                </div>
                <div className="mt-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${currentUser.clearance?.color || 'text-sky-400 border-sky-500/40 bg-sky-950/30'}`}>
                    {currentUser.clearance?.title || 'Clearance Level 2'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Enlisted: {formattedJoinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Persistence Notice */}
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-center gap-2.5">
            <Laptop className="w-4 h-4 shrink-0 text-sky-400" />
            <span>
              <strong>Auto Sign-In Enabled:</strong> When you reopen SCPHub, you are automatically signed in as <strong>{currentUser.username}</strong>.
            </span>
          </div>

          {/* Quick Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Games Launched</div>
                <div className="text-lg font-black text-white">
                  {currentUser.stats?.gamesPlayed || 0}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Snake Record</div>
                <div className="text-lg font-black text-white">
                  {currentUser.stats?.snakeHighScore || 0} pts
                </div>
              </div>
            </div>
          </div>

          {/* Profile Customization Section */}
          {isEditing ? (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Update Agent Badge & Rank
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Avatar options */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Tactical Emblem
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`p-1.5 rounded-lg flex flex-col items-center justify-center border transition cursor-pointer ${
                        selectedAvatarId === av.id
                          ? 'bg-sky-500/25 border-sky-400'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                      title={av.name}
                    >
                      <span className="text-lg">{av.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clearance options */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Security Clearance Level
                </label>
                <div className="space-y-1">
                  {CLEARANCE_LEVELS.map((c) => (
                    <button
                      key={c.level}
                      type="button"
                      onClick={() => setSelectedClearance(c.level)}
                      className={`w-full p-1.5 rounded-lg text-left text-xs font-bold flex items-center justify-between border transition cursor-pointer ${
                        selectedClearance === c.level
                          ? 'bg-slate-800 border-sky-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{c.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${c.color}`}>
                        {c.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Customize Badge & Clearance</span>
            </button>
          )}

          {/* Account Actions */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={onSwitchAccount}
              className="w-full sm:flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>

            {confirmSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 animate-in fade-in"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Confirm Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmSignOut(true)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-900/40 hover:border-rose-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
