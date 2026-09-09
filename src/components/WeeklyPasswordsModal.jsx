import React, { useState, useEffect, useMemo } from 'react';
import {
  KeyRound,
  Shield,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  X,
  Sparkles,
  Calendar,
  Download,
  Search,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import {
  getWeeklyPasswords,
  verifyWeeklyPassword,
  getUnlockedClearance,
  saveUnlockedClearance,
  getFullYearSchedule,
  export1YearScheduleText
} from '../data/weeklyPasswords';

export const WeeklyPasswordsModal = ({ isOpen, onClose, onClearanceUnlocked }) => {
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'year'
  const [targetYear, setTargetYear] = useState(2026);
  const [weeklyData, setWeeklyData] = useState(() => getWeeklyPasswords());
  const [copiedId, setCopiedId] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [unlockedClearance, setUnlockedClearance] = useState(() => getUnlockedClearance());
  const [timeLeft, setTimeLeft] = useState('');
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [ownerPinInput, setOwnerPinInput] = useState('');
  const [ownerPinError, setOwnerPinError] = useState('');

  const handleOwnerPinSubmit = (e) => {
    e?.preventDefault();
    setOwnerPinError('');
    const clean = ownerPinInput.trim().toLowerCase();
    if (
      clean === 'owner2026' ||
      clean === 'admin' ||
      clean === '7777' ||
      clean === 'sapperalexj' ||
      clean === 'owner-admin-2026' ||
      clean === 'sapperalexj@gmail.com'
    ) {
      setIsOwnerUnlocked(true);
    } else {
      setOwnerPinError('Incorrect Owner Master Key. Contact site administrator.');
    }
  };

  // Update countdown timer every second
  useEffect(() => {
    if (!isOpen) return;

    const tick = () => {
      const current = getWeeklyPasswords();
      setWeeklyData(current);

      const diff = current.nextRotationTimestamp - Date.now();
      if (diff <= 0) {
        setTimeLeft('Rotating now...');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Full 1-year schedule
  const yearSchedule = useMemo(() => {
    return getFullYearSchedule(targetYear);
  }, [targetYear]);

  // Filtered weeks
  const filteredWeeks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return yearSchedule;
    return yearSchedule.filter(
      (w) =>
        w.weekNo.toString().includes(q) ||
        w.dateRange.toLowerCase().includes(q) ||
        w.roblox.toLowerCase().includes(q) ||
        w.fortnite.toLowerCase().includes(q) ||
        w.scp.toLowerCase().includes(q)
    );
  }, [yearSchedule, searchQuery]);

  if (!isOpen) return null;

  const handleCopy = async (id, code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyAllYear = async () => {
    try {
      const text = export1YearScheduleText(targetYear);
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleDownloadTxt = () => {
    const text = export1YearScheduleText(targetYear);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SCPHub-1Year-Passwords-${targetYear}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const matched = verifyWeeklyPassword(inputCode);
    if (matched) {
      const saved = saveUnlockedClearance(matched);
      setUnlockedClearance(saved);
      setVerifyResult({
        success: true,
        message: `Clearance Accepted! Unlocked ${matched.tier}: ${matched.name}.`
      });
      if (onClearanceUnlocked) {
        onClearanceUnlocked(matched);
      }
    } else {
      setVerifyResult({
        success: false,
        message: 'Invalid Passcode. Ensure you entered this week’s exact code (Case-insensitive).'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                  3 Weekly Passwords Clearance
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500 text-white font-mono">
                  Week {weeklyData.weekNo}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Letters & Numbers • Automatically rotates every Monday at 00:00 UTC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIP Clearance Notice */}
        <div className="bg-amber-950/70 border-b border-amber-500/40 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <p className="leading-snug">
              <strong className="text-amber-300 uppercase tracking-wide">
                VIP Clearance Passcodes:
              </strong>{' '}
              Rotating access codes for cloud gaming, high-speed proxy mirrors, and archive records. Current cycle: Week {weeklyData.weekNo}.
            </p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'current'
                  ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>This Week's Passcodes</span>
            </button>
            <button
              onClick={() => setActiveTab('year')}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'year'
                  ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>52-Week Master List (Owner Only)</span>
            </button>
          </div>

          {activeTab === 'year' && (
            <div className="flex items-center gap-2 pb-1.5">
              <button
                onClick={() => setTargetYear(2026)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${
                  targetYear === 2026
                    ? 'bg-amber-500 text-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                2026
              </button>
              <button
                onClick={() => setTargetYear(2027)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${
                  targetYear === 2027
                    ? 'bg-amber-500 text-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                2027
              </button>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar text-sm flex-1">
          {activeTab === 'current' ? (
            <>
              {/* Active Rotation Timer Banner */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Next Password Rotation:</span>
                  <strong className="text-amber-400 font-mono font-bold">
                    {timeLeft || 'Calculating...'}
                  </strong>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <RefreshCw
                    className="w-3.5 h-3.5 text-sky-400 animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                  <span>Rotates automatically every 7 days</span>
                </div>
              </div>

              {/* Unlocked Status Banner if active */}
              {unlockedClearance && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-emerald-200">
                        Active Clearance: {unlockedClearance.tier}
                      </div>
                      <div className="text-[11px] text-emerald-300/80 font-mono">
                        Key: {unlockedClearance.code} (Valid for Week {unlockedClearance.weekNo})
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ACTIVE
                  </span>
                </div>
              )}

              {/* 3 Weekly Passwords Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    This Week's Passcodes ({weeklyData.dateRange})
                  </span>
                  {!isOwnerUnlocked ? (
                    <span className="text-[10px] text-amber-400 font-mono">
                      Pay cash in person at school to get code
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      ✓ Owner Mode Unlocked
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {weeklyData.passwords.map((item) => {
                    const isCopied = copiedId === item.id;
                    const maskedCode = isOwnerUnlocked
                      ? item.code
                      : '•••••••••••';

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${item.badgeColor}`}
                            >
                              {item.rank}
                            </span>
                            <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{item.description}</p>
                          <div className="pt-1 flex items-center gap-2">
                            <code className="text-xs sm:text-sm font-mono font-black text-amber-300 tracking-wider bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block">
                              {maskedCode}
                            </code>
                            {!isOwnerUnlocked && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                Cash In Person Only
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isOwnerUnlocked ? (
                            <button
                              onClick={() => handleCopy(item.id, item.code)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition border cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => setActiveTab('year')}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer"
                              title="Owner PIN required to reveal"
                            >
                              Owner Reveal
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Password Verification Gate */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Passcode Testing & Verification Gate
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter any of the weekly passcodes above to test clearance activation.
                </p>

                <form onSubmit={handleVerify} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter passcode (e.g. sapperalexj)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                </form>

                {verifyResult && (
                  <div
                    className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                      verifyResult.success
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                        : 'bg-red-950/80 border border-red-500/50 text-red-300'
                    }`}
                  >
                    {verifyResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{verifyResult.message}</span>
                  </div>
                )}
              </div>
            </>
          ) : !isOwnerUnlocked ? (
            /* Protected Owner View for 52-Week Schedule */
            <div className="p-8 text-center max-w-sm mx-auto space-y-4 my-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  Owner Clearance Required
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  The full 52-week master schedule is confidential. Enter the Owner Master PIN to view and export the entire year.
                </p>
              </div>

              <form onSubmit={handleOwnerPinSubmit} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter Owner PIN"
                  value={ownerPinInput}
                  onChange={(e) => setOwnerPinInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
                {ownerPinError && (
                  <p className="text-xs text-red-400">{ownerPinError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Unlock 52-Week Master List
                </button>
              </form>
            </div>
          ) : (
            /* Full 1-Year (52 Weeks) Schedule View */
            <div className="space-y-3">
              {/* Year Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by week # (e.g. 1), month, or code..."
                    className="bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAllYear}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedAll ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAll ? 'Copied 52 Weeks!' : 'Copy 52 Weeks'}</span>
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .txt</span>
                  </button>
                </div>
              </div>

              {/* Weeks List */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredWeeks.map((w) => {
                  const isWeekCopied = copiedId === `week-${w.weekNo}`;
                  return (
                    <div
                      key={w.weekNo}
                      className={`p-3 rounded-xl border transition ${
                        w.isCurrentWeek
                          ? 'bg-sky-950/40 border-sky-500/60 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                          : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                              w.isCurrentWeek
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            Week {w.weekNo}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            {w.dateRange}
                          </span>
                          {w.isCurrentWeek && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                              Active Week
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            const snippet = `Week ${w.weekNo} (${w.dateRange})\nRoblox: ${w.roblox}\nFortnite: ${w.fortnite}\nSCP: ${w.scp}`;
                            handleCopy(`week-${w.weekNo}`, snippet);
                          }}
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {isWeekCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{isWeekCopied ? 'Copied Week' : 'Copy Week'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                          <div className="text-[10px] text-emerald-400 font-bold uppercase mb-0.5">
                            Passcode #1 (Roblox)
                          </div>
                          <code className="font-mono text-xs font-bold text-amber-300 select-all block truncate">
                            {w.roblox}
                          </code>
                        </div>

                        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                          <div className="text-[10px] text-sky-400 font-bold uppercase mb-0.5">
                            Passcode #2 (Fortnite)
                          </div>
                          <code className="font-mono text-xs font-bold text-amber-300 select-all block truncate">
                            {w.fortnite}
                          </code>
                        </div>

                        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                          <div className="text-[10px] text-purple-400 font-bold uppercase mb-0.5">
                            Passcode #3 (Master)
                          </div>
                          <code className="font-mono text-xs font-bold text-amber-300 select-all block truncate">
                            {w.scp}
                          </code>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredWeeks.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No weeks match "{searchQuery}". Try a week number between 1 and 52.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open Access: No password required to enter site</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
