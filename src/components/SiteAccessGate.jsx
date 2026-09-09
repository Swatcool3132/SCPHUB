import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Clock,
  Copy,
  Check,
  GraduationCap,
  DollarSign,
  Settings,
  X,
  Crown,
  ChevronRight,
  School,
  Banknote,
  MapPin,
  AlertTriangle,
  Download,
  Users,
  HelpCircle
} from 'lucide-react';
import {
  getWeeklyPasswords,
  verifyWeeklyPassword,
  getWeekDetails,
  getPaymentConfig,
  savePaymentConfig,
  getFullYearSchedule,
  export1YearScheduleText,
  getActiveWeekOverride,
  setActiveWeekOverride
} from '../data/weeklyPasswords';

export const SiteAccessGate = ({ onUnlock, onApplyCloak }) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(null);
  const [disguiseAsClassroom, setDisguiseAsClassroom] = useState(false);
  const [currentWeekNum, setCurrentWeekNum] = useState(() => getActiveWeekOverride());

  // Cash at school settings state
  const [paymentConfig, setPaymentConfig] = useState(() => getPaymentConfig());
  const [showSchoolRulesModal, setShowSchoolRulesModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState('weekly'); // 'weekly' | 'monthly' | 'lifetime'

  // Secret Owner / Admin Portal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminTab, setAdminTab] = useState('passcodes'); // 'passcodes' | 'settings' | 'schedule'
  const [adminConfigForm, setAdminConfigForm] = useState(() => getPaymentConfig());
  const [adminConfigSaved, setAdminConfigSaved] = useState(false);

  const weeklyData = getWeeklyPasswords();
  const weekInfo = getWeekDetails();

  const handleWeekChange = (newWeek) => {
    setActiveWeekOverride(newWeek);
    setCurrentWeekNum(newWeek);
  };

  // Stealth disguise as Google Classroom
  useEffect(() => {
    if (disguiseAsClassroom) {
      document.title = 'Google.classroom-Home';
      let link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
      }
    }
  }, [disguiseAsClassroom]);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2500);
    } catch {}
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setErrorMsg('');

    if (!inputCode.trim()) {
      setErrorMsg('Please enter the secret passcode you received after paying cash.');
      return;
    }

    const matched = verifyWeeklyPassword(inputCode);
    if (matched) {
      setIsSuccess(true);
      try {
        const payload = {
          unlocked: true,
          weekNo: weekInfo.weekNo,
          year: weekInfo.year,
          unlockedAt: Date.now(),
          codeUsed: matched.code,
          tier: matched.tier || 'VIP Access'
        };
        localStorage.setItem('scphub_site_unlocked', JSON.stringify(payload));
      } catch (err) {
        console.error('Failed to save unlock state:', err);
      }

      setTimeout(() => {
        onUnlock();
      }, 650);
    } else {
      setErrorMsg(`Invalid passcode. Make sure you entered the exact letters and numbers given to you in person.`);
    }
  };

  const handleBypassAsOwner = () => {
    try {
      const payload = {
        unlocked: true,
        weekNo: weekInfo.weekNo,
        year: weekInfo.year,
        unlockedAt: Date.now(),
        codeUsed: 'OWNER-ADMIN-2026',
        tier: 'Site Owner & Administrator'
      };
      localStorage.setItem('scphub_site_unlocked', JSON.stringify(payload));
    } catch {}
    setIsSuccess(true);
    setShowAdminModal(false);
    setTimeout(() => {
      onUnlock();
    }, 400);
  };

  const handleAdminLogin = (e) => {
    e?.preventDefault();
    setAdminError('');
    const clean = adminPinInput.trim().toLowerCase();
    // Accepted admin PINs
    if (
      clean === 'owner2026' ||
      clean === 'admin' ||
      clean === '7777' ||
      clean === 'sapperalexj' ||
      clean === 'owner-admin-2026' ||
      clean === 'sapperalexj@gmail.com'
    ) {
      setIsAdminAuthenticated(true);
    } else {
      setAdminError('Incorrect Owner Master Key / PIN.');
    }
  };

  const handleSaveAdminConfig = (e) => {
    e?.preventDefault();
    savePaymentConfig(adminConfigForm);
    setPaymentConfig(adminConfigForm);
    setAdminConfigSaved(true);
    setTimeout(() => setAdminConfigSaved(false), 2500);
  };

  const handleDownload1YearTxt = () => {
    const text = export1YearScheduleText(weekInfo.year);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `School-Master-Passwords-${weekInfo.year}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Stealth & Cloak Control Strip */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          onClick={() => {
            setDisguiseAsClassroom(!disguiseAsClassroom);
            if (onApplyCloak) {
              onApplyCloak('google-classroom-home');
            }
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition border cursor-pointer ${
            disguiseAsClassroom
              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800'
          }`}
          title="Disguise this tab as Google.classroom-Home"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{disguiseAsClassroom ? 'Cloaked: Google.classroom-Home' : 'Stealth Cloak'}</span>
        </button>
      </div>

      {/* Main Lock Card */}
      <div className="max-w-lg w-full bg-[#0d1322] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3.5 shadow-lg shadow-emerald-500/10">
            {isSuccess ? (
              <Unlock className="w-8 h-8 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-black text-emerald-300 uppercase tracking-widest mb-2">
            <Banknote className="w-3.5 h-3.5" />
            <span>Cash Only Pass Gate</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Site Access Required
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Enter the secret passcode you received to unlock 4,000+ unblocked games, DuckDuckGo web proxy, and cloud gaming.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Passcode Protected Site</span>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Enter Passcode
            </label>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter secret passcode..."
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Case-insensitive. Type the secret passcode you received to enter.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">Passcode Accepted! Entering site...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSuccess}
            className={`w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black shadow-emerald-500/20'
            }`}
          >
            {isSuccess ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>UNLOCKED — ENTERING NOW</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>UNLOCK & ENTER SITE</span>
              </>
            )}
          </button>
        </form>

        {/* CASH ONLY IN PERSON AT SCHOOL SECTION */}
        <div className="mt-6 pt-5 border-t border-slate-800/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
              <Banknote className="w-4 h-4 text-emerald-400" />
              <span>Cash Only In Person At School</span>
            </div>
            <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
              In-Person Only
            </span>
          </div>

          {/* Pricing Tier Cards */}
          <div className="grid grid-cols-3 gap-2 mb-3.5">
            {/* Weekly Cash */}
            <div
              onClick={() => {
                setSelectedTier('weekly');
                setShowSchoolRulesModal(true);
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/70 hover:border-emerald-500/50 transition cursor-pointer text-center group"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Weekly Pass</span>
              <div className="text-base sm:text-lg font-black text-emerald-400 my-0.5">
                {paymentConfig.weeklyPrice} <span className="text-[10px] font-normal text-slate-400">cash</span>
              </div>
              <span className="text-[9px] text-slate-400 block">7-day active code</span>
              <div className="mt-2 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 rounded py-0.5 group-hover:bg-emerald-500/20">
                Get At School →
              </div>
            </div>

            {/* Monthly Cash */}
            <div
              onClick={() => {
                setSelectedTier('monthly');
                setShowSchoolRulesModal(true);
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-sky-500/40 hover:border-sky-400 transition cursor-pointer text-center relative group"
            >
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-sky-500 text-[8px] font-black uppercase text-white px-1.5 py-0.2 rounded-full tracking-wider">
                Popular
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">Monthly Pass</span>
              <div className="text-base sm:text-lg font-black text-sky-400 my-0.5">
                {paymentConfig.monthlyPrice} <span className="text-[10px] font-normal text-slate-400">cash</span>
              </div>
              <span className="text-[9px] text-slate-400 block">30-day VIP pass</span>
              <div className="mt-2 text-[10px] font-bold text-sky-300 bg-sky-500/10 rounded py-0.5 group-hover:bg-sky-500/20">
                Get At School →
              </div>
            </div>

            {/* Lifetime Cash */}
            <div
              onClick={() => {
                setSelectedTier('lifetime');
                setShowSchoolRulesModal(true);
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer text-center relative group"
            >
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-[8px] font-black uppercase text-black px-1.5 py-0.2 rounded-full tracking-wider">
                Best Value
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">Lifetime Pass</span>
              <div className="text-base sm:text-lg font-black text-amber-300 my-0.5">
                {paymentConfig.lifetimePrice} <span className="text-[10px] font-normal text-slate-400">cash</span>
              </div>
              <span className="text-[9px] text-slate-400 block">Permanent VIP</span>
              <div className="mt-2 text-[10px] font-bold text-amber-300 bg-amber-500/10 rounded py-0.5 group-hover:bg-amber-500/20">
                Get At School →
              </div>
            </div>
          </div>

          {/* Quick Steps Box */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300 mb-3">
            <div className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <School className="w-3.5 h-3.5" />
              <span>How to get your passcode:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              1. Bring exact cash to school (<strong>{paymentConfig.weeklyPrice}</strong>, <strong>{paymentConfig.monthlyPrice}</strong>, or <strong>{paymentConfig.lifetimePrice}</strong>).<br />
              2. Find me in person ({paymentConfig.schoolLocation}).<br />
              3. Hand over the cash to receive this week's passcode on paper or in person.<br />
              4. Type it in above to unlock the site!
            </p>
          </div>

          <button
            onClick={() => setShowSchoolRulesModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>View School Meetup Info & Rules</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Footer info & Secret Owner Portal Link */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Codes rotate every Monday</span>
          </span>

          <button
            onClick={() => setShowAdminModal(true)}
            className="text-slate-500 hover:text-amber-400 font-medium flex items-center gap-1 transition cursor-pointer"
            title="Owner Portal - View Passcodes to sell & edit cash pricing"
          >
            <Settings className="w-3 h-3" />
            <span>Owner Portal</span>
          </button>
        </div>
      </div>

      {/* SCHOOL CASH MEETUP MODAL */}
      {showSchoolRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0d1322] border border-emerald-500/40 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-emerald-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                    In-Person Cash At School
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Pay cash in person to get this week's code
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSchoolRulesModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Selected Plan */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Option</span>
                  <span className="text-sm font-black text-white capitalize">
                    {selectedTier} Cash Pass
                  </span>
                </div>
                <div className="text-lg font-black text-emerald-400">
                  {selectedTier === 'weekly'
                    ? paymentConfig.weeklyPrice
                    : selectedTier === 'monthly'
                    ? paymentConfig.monthlyPrice
                    : paymentConfig.lifetimePrice}{' '}
                  <span className="text-xs text-slate-400 font-normal">Cash</span>
                </div>
              </div>

              {/* Where to find me */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase text-[11px] tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Where To Find Me At School</span>
                </div>
                <p className="text-slate-200 text-xs">
                  {paymentConfig.schoolLocation}
                </p>
                <div className="text-[11px] text-slate-400 font-medium">
                  <strong>Contact / Name:</strong> {paymentConfig.sellerName}
                </div>
              </div>

              {/* Rules & Good etiquette */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px] tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Important Rules</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-[11px]">
                  <li>Please bring <strong>exact cash</strong> (bills only, no loose coins if possible).</li>
                  <li><strong>Do not leak or share your code:</strong> If a code gets shared freely with non-paying students, the code will be rotated immediately and you will have to re-verify.</li>
                  <li>Passcodes rotate every <strong>Monday morning</strong>.</li>
                  <li>Once unlocked on your browser, your device stays unlocked for that cycle!</li>
                </ul>
              </div>

              <button
                onClick={() => setShowSchoolRulesModal(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-wider text-xs cursor-pointer"
              >
                Got It — I Will Bring Cash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECRET OWNER / ADMIN PORTAL MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0d1322] border border-amber-500/40 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <span>Site Owner Portal</span>
                    <span className="text-[10px] font-mono bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">
                      ADMIN
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Confidential passcodes management & school cash pricing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If not authenticated as Admin yet */}
            {!isAdminAuthenticated ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Owner Authentication</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter the Owner Master Key or PIN to view this week's passcodes to give out for cash.
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="max-w-xs mx-auto space-y-3">
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter Owner PIN"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-center font-mono text-white focus:border-amber-500 focus:outline-none"
                  />
                  {adminError && (
                    <div className="text-xs text-red-400">{adminError}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Authenticate As Owner
                  </button>
                  <p className="text-[10px] text-slate-500">
                    Tip: Owner key is <code>owner2026</code> or your email <code>sapperalexj@gmail.com</code>
                  </p>
                </form>
              </div>
            ) : (
              /* Authenticated Owner View */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Admin Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => setAdminTab('passcodes')}
                      className={`px-3 py-2 font-bold uppercase tracking-wider border-b-2 cursor-pointer ${
                        adminTab === 'passcodes'
                          ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Active Codes (To Give for Cash)
                    </button>
                    <button
                      onClick={() => setAdminTab('settings')}
                      className={`px-3 py-2 font-bold uppercase tracking-wider border-b-2 cursor-pointer ${
                        adminTab === 'settings'
                          ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Cash Prices & School Info
                    </button>
                    <button
                      onClick={() => setAdminTab('schedule')}
                      className={`px-3 py-2 font-bold uppercase tracking-wider border-b-2 cursor-pointer ${
                        adminTab === 'schedule'
                          ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      52-Week Master List
                    </button>
                  </div>

                  <button
                    onClick={handleBypassAsOwner}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                    title="Enter site without entering a password"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Bypass & Enter</span>
                  </button>
                </div>

                <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
                  {/* TAB 1: PASSCODES TO GIVE OUT FOR CASH */}
                  {adminTab === 'passcodes' && (
                    <div className="space-y-3">
                      {/* Active Week Switcher Bar for Owner */}
                      <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Active School Rotation Week
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-base font-black text-emerald-400">
                              Week {weekInfo.weekNo}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              ({weeklyData.dateRange})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                          <button
                            type="button"
                            disabled={weekInfo.weekNo <= 1}
                            onClick={() => handleWeekChange(weekInfo.weekNo - 1)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-300 cursor-pointer"
                          >
                            ◄ Prev
                          </button>
                          <span className="px-2 py-1 text-xs font-mono font-bold bg-slate-950 border border-slate-800 rounded text-amber-300">
                            Week {weekInfo.weekNo}
                          </span>
                          <button
                            type="button"
                            disabled={weekInfo.weekNo >= 52}
                            onClick={() => handleWeekChange(weekInfo.weekNo + 1)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-300 cursor-pointer"
                          >
                            Next ►
                          </button>
                          {weekInfo.weekNo !== 1 && (
                            <button
                              type="button"
                              onClick={() => handleWeekChange(1)}
                              className="ml-1 px-2 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Reset to W1
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                        <span>
                          <strong>Official Active Passcode:</strong> Keep this secret! Only give this to classmates who hand you cash.
                        </span>
                      </div>

                      <div className="space-y-2">
                        {weeklyData.passwords.map((item) => {
                          const shortToken = item.code.split('-').pop();
                          return (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {item.rank}
                                  </span>
                                  <span className="text-xs font-bold text-white">{item.name}</span>
                                </div>

                                <div className="flex items-center gap-3 mt-1.5">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Passcode to Give Out for Cash:</span>
                                    <code className="text-base sm:text-lg font-mono font-black text-emerald-300 tracking-wider">
                                      {item.code}
                                    </code>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleCopy(item.code, item.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-center"
                              >
                                {copiedText === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === item.id ? 'Copied' : 'Copy Code'}</span>
                              </button>
                            </div>
                          );
                        })}

                        {/* Permanent VIP Master Code */}
                        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div>
                            <span className="text-[10px] text-amber-300 font-bold uppercase block">
                              👑 Permanent Lifetime VIP Pass (Never Expires)
                            </span>
                            <code className="text-sm sm:text-base font-mono font-bold text-amber-200">
                              LIFETIME-VIP-ACCESS
                            </code>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Give this to anyone who buys the Lifetime Cash Pass ({paymentConfig.lifetimePrice}).
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopy('LIFETIME-VIP-ACCESS', 'lifetime-master')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-center"
                          >
                            {copiedText === 'lifetime-master' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedText === 'lifetime-master' ? 'Copied' : 'Copy Lifetime'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CASH PRICING & SCHOOL SETTINGS */}
                  {adminTab === 'settings' && (
                    <form onSubmit={handleSaveAdminConfig} className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            Weekly Cash Price
                          </label>
                          <input
                            type="text"
                            value={adminConfigForm.weeklyPrice}
                            onChange={(e) =>
                              setAdminConfigForm({ ...adminConfigForm, weeklyPrice: e.target.value })
                            }
                            placeholder="$1.00"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-emerald-400 font-bold text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            Monthly Cash Price
                          </label>
                          <input
                            type="text"
                            value={adminConfigForm.monthlyPrice}
                            onChange={(e) =>
                              setAdminConfigForm({ ...adminConfigForm, monthlyPrice: e.target.value })
                            }
                            placeholder="$3.00"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sky-400 font-bold text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            Lifetime Cash Price
                          </label>
                          <input
                            type="text"
                            value={adminConfigForm.lifetimePrice}
                            onChange={(e) =>
                              setAdminConfigForm({ ...adminConfigForm, lifetimePrice: e.target.value })
                            }
                            placeholder="$10.00"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-amber-400 font-bold text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Where to find you at school (shown to classmates)
                        </label>
                        <input
                          type="text"
                          value={adminConfigForm.schoolLocation}
                          onChange={(e) =>
                            setAdminConfigForm({ ...adminConfigForm, schoolLocation: e.target.value })
                          }
                          placeholder="e.g. Hallway by locker 210, cafeteria during lunch, or gym"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Seller Name / Contact Info
                        </label>
                        <input
                          type="text"
                          value={adminConfigForm.sellerName}
                          onChange={(e) =>
                            setAdminConfigForm({ ...adminConfigForm, sellerName: e.target.value })
                          }
                          placeholder="e.g. Find Alex in person"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Notes / Instructions for Classmates
                        </label>
                        <textarea
                          rows={2}
                          value={adminConfigForm.notes}
                          onChange={(e) =>
                            setAdminConfigForm({ ...adminConfigForm, notes: e.target.value })
                          }
                          placeholder="Bring exact cash. No sharing codes or it gets rotated."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white resize-none"
                        />
                      </div>

                      {adminConfigSaved && (
                        <div className="p-2.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                          ✓ Cash prices & school meetup info saved successfully!
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Save School Cash Settings
                      </button>
                    </form>
                  )}

                  {/* TAB 3: 52-WEEK MASTER SCHEDULE (ADMIN ONLY) */}
                  {adminTab === 'schedule' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-bold">
                          Confidential School Year Codes for {weekInfo.year} (All 52 Weeks)
                        </span>
                        <button
                          onClick={handleDownload1YearTxt}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .txt</span>
                        </button>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-1.5 border border-slate-800 rounded-xl p-2 bg-slate-950 font-mono text-[11px]">
                        {getFullYearSchedule(weekInfo.year).map((w) => (
                          <div
                            key={w.weekNo}
                            className={`p-2 rounded flex items-center justify-between ${
                              w.weekNo === weekInfo.weekNo
                                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                                : 'bg-slate-900/60 text-slate-300'
                            }`}
                          >
                            <span className="font-bold">
                              Week {w.weekNo} ({w.dateRange})
                            </span>
                            <div className="flex gap-2">
                              <span className="text-emerald-400">{w.roblox}</span>
                              <span className="text-sky-400">{w.fortnite}</span>
                              <span className="text-amber-400">{w.scp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
