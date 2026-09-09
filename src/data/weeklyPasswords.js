// Deterministic Weekly Rotating Clearance Passwords System
// Generates 3 alphanumeric passwords (letters + numbers) that change every Monday at 00:00 UTC.
// Site remains 100% FREE with NO password required to enter or play.

const DIGITS = '23456789';
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

// Generate a deterministic 4-character token guaranteed to mix digits and letters
export function generateAlphanumericToken(year, weekNo, salt) {
  let s1 = (year * 10007 + weekNo * 1337 + salt * 997) % 2147483647;
  let s2 = (s1 * 16807 + 1013904223) % 2147483647;
  let s3 = (s2 * 16807 + 1013904223) % 2147483647;
  let s4 = (s3 * 16807 + 1013904223) % 2147483647;

  const d1 = DIGITS[Math.abs(s1) % DIGITS.length];
  const l1 = LETTERS[Math.abs(s2) % LETTERS.length];
  const d2 = DIGITS[Math.abs(s3) % DIGITS.length];
  const l2 = LETTERS[Math.abs(s4) % LETTERS.length];

  return `${d1}${l1}${d2}${l2}`;
}

export function generateWeeklyCode(prefix, year, weekNo, salt) {
  const token = generateAlphanumericToken(year, weekNo, salt);
  return `${prefix}-W${weekNo}-${token}`;
}

// Calculate ISO week dates
export function getDateRangeForWeek(year, weekNo) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7; // Monday is 1, Sunday is 7
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);
  week1Monday.setUTCHours(0, 0, 0, 0);

  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (weekNo - 1) * 7);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);

  return { monday, sunday };
}

// Active Week Selection (Defaults to Week 1 as requested)
export function getActiveWeekOverride() {
  try {
    const saved = localStorage.getItem('scphub_active_week_override');
    if (saved !== null && !isNaN(parseInt(saved, 10))) {
      const val = parseInt(saved, 10);
      if (val >= 1 && val <= 52) return val;
    }
  } catch {}
  return 1; // Default to Week 1
}

export function setActiveWeekOverride(weekNo) {
  try {
    const num = Math.min(52, Math.max(1, parseInt(weekNo, 10) || 1));
    localStorage.setItem('scphub_active_week_override', String(num));
    return num;
  } catch {
    return 1;
  }
}

export function getWeekDetails(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const year = d.getUTCFullYear();

  // Active week set to Week 1 by default
  const weekNo = getActiveWeekOverride();

  // Compute dates for the active week
  const { monday, sunday } = getDateRangeForWeek(year, weekNo);

  // Next rotation is next Monday 00:00:00 UTC from the week's end
  const nextRotation = new Date(monday);
  nextRotation.setUTCDate(monday.getUTCDate() + 7);

  return {
    year,
    weekNo,
    startDate: monday,
    endDate: sunday,
    nextRotation
  };
}

// Generates the deterministic passwords
export function getWeeklyPasswords(date = new Date()) {
  const { year, weekNo, startDate, endDate, nextRotation } = getWeekDetails(date);

  return {
    year,
    weekNo,
    dateRange: `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`,
    nextRotationTimestamp: nextRotation.getTime(),
    passwords: [
      {
        id: 'pass-sapperalexj',
        rank: 'VIP Passcode',
        name: 'Official Cash Passcode',
        code: 'sapperalexj',
        tier: 'VIP Member Access',
        description: 'Official passcode to unlock all 4,000+ games, web proxy & cloud gaming.',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        colorGradient: 'from-emerald-600 to-teal-800'
      }
    ]
  };
}

// Generates the full 52-week schedule for an entire year
export function getFullYearSchedule(targetYear = 2026) {
  const currentWeekInfo = getWeekDetails();
  const schedule = [];

  for (let w = 1; w <= 52; w++) {
    const { monday, sunday } = getDateRangeForWeek(targetYear, w);
    const roblox = generateWeeklyCode('ROBLOX', targetYear, w, 1);
    const fortnite = generateWeeklyCode('FORTNITE', targetYear, w, 2);
    const scp = generateWeeklyCode('SCP', targetYear, w, 3);

    const isCurrentWeek =
      currentWeekInfo.year === targetYear && currentWeekInfo.weekNo === w;

    schedule.push({
      weekNo: w,
      year: targetYear,
      startDate: monday,
      endDate: sunday,
      dateRange: `${monday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`,
      roblox,
      fortnite,
      scp,
      isCurrentWeek
    });
  }

  return schedule;
}

// Exports the full 52-week schedule as a clean text format
export function export1YearScheduleText(targetYear = 2026) {
  const schedule = getFullYearSchedule(targetYear);
  let text = `=========================================================================\n`;
  text += `SCPHUB 1-YEAR (52 WEEKS) ROTATING PASSWORDS SCHEDULE FOR ${targetYear}\n`;
  text += `* NOTE: Site is 100% FREE with NO password required to enter or play. *\n`;
  text += `* Passwords change automatically every Monday at 00:00 UTC.          *\n`;
  text += `=========================================================================\n\n`;

  schedule.forEach((w) => {
    const mark = w.isCurrentWeek ? ' [CURRENT ACTIVE WEEK]' : '';
    text += `WEEK ${w.weekNo} (${w.dateRange})${mark}\n`;
    text += `  • Passcode #1 (Roblox):   ${w.roblox}\n`;
    text += `  • Passcode #2 (Fortnite): ${w.fortnite}\n`;
    text += `  • Passcode #3 (Master):   ${w.scp}\n\n`;
  });

  return text;
}

// Normalizes user input for easy validation (accepts full code, case-insensitive, or stripped)
export function verifyWeeklyPassword(inputCode, date = new Date()) {
  if (!inputCode) return null;
  const rawClean = inputCode.trim().toLowerCase();
  const clean = inputCode.trim().toUpperCase().replace(/[\s]/g, '');

  // Requested official password: sapperalexj
  if (
    rawClean === 'sapperalexj' ||
    rawClean === 'sapperalexj@gmail.com' ||
    clean === 'SAPPERALEXJ'
  ) {
    return {
      id: 'pass-sapperalexj',
      rank: 'VIP Access Pass',
      name: 'Official Passcode',
      code: 'sapperalexj',
      tier: 'VIP Access Member',
      description: 'Official access unlocked with passcode sapperalexj.'
    };
  }

  // Master & Lifetime VIP Bypass Codes (Permanent)
  const MASTER_CODES = [
    {
      id: 'lifetime-vip',
      rank: 'VIP Lifetime Pass',
      name: 'Lifetime All-Access Pass',
      code: 'LIFETIME-VIP-ACCESS',
      tier: 'Lifetime VIP Member',
      description: 'Permanent all-access bypass token for VIP paying members.'
    },
    {
      id: 'owner-admin',
      rank: 'Owner Clearance',
      name: 'Site Owner & Administrator Key',
      code: 'OWNER-ADMIN-2026',
      tier: 'Site Owner / Root Admin',
      description: 'Master owner key with permanent access across all systems.'
    },
    {
      id: 'vip-pass',
      rank: 'VIP Monthly Pass',
      name: 'Monthly VIP Member Pass',
      code: 'VIP-PREMIUM-PASS',
      tier: 'Monthly VIP Member',
      description: 'All-access 30-day VIP pass.'
    }
  ];

  for (const master of MASTER_CODES) {
    const cleanM = master.code.toUpperCase().replace(/[\s-]/g, '');
    const cleanIn = clean.replace(/-/g, '');
    if (cleanIn === cleanM || clean === master.code || clean.includes(cleanM)) {
      return master;
    }
  }

  const { passwords } = getWeeklyPasswords(date);

  for (const p of passwords) {
    const cleanP = p.code.toUpperCase().replace(/[\s]/g, '');
    const cleanNoHyphen = cleanP.replace(/-/g, '');
    const cleanTokenOnly = p.code.split('-').pop();

    if (
      clean === cleanP ||
      clean === cleanNoHyphen ||
      clean === cleanTokenOnly ||
      cleanP.includes(clean)
    ) {
      return p;
    }
  }
  return null;
}

// Cash in person at school configuration (Customizable by Owner)
const DEFAULT_PAYMENT_CONFIG = {
  paymentMethod: 'cash_in_person',
  weeklyPrice: '$1.00',
  monthlyPrice: '$3.00',
  lifetimePrice: '$10.00',
  currency: 'USD',
  schoolLocation: 'At school (hallways, cafeteria at lunch, or between classes)',
  sellerName: 'Find me in person at school',
  notes: 'Hand over exact cash in person at school to receive this week\'s secret passcode on paper or by text/whisper.'
};

export function getPaymentConfig() {
  try {
    const raw = localStorage.getItem('scphub_payment_config');
    if (!raw) return DEFAULT_PAYMENT_CONFIG;
    return { ...DEFAULT_PAYMENT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export function savePaymentConfig(config) {
  try {
    localStorage.setItem('scphub_payment_config', JSON.stringify(config));
    return config;
  } catch (err) {
    console.error('Failed to save payment config:', err);
    return config;
  }
}

// Get saved unlocked status from local storage
export function getUnlockedClearance() {
  try {
    const raw = localStorage.getItem('ub_weekly_clearance');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const { weekNo, year } = getWeekDetails();
    if (parsed.weekNo === weekNo && parsed.year === year) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// Save unlocked clearance
export function saveUnlockedClearance(passObj) {
  try {
    const { weekNo, year } = getWeekDetails();
    const payload = {
      unlockedAt: Date.now(),
      weekNo,
      year,
      passId: passObj.id,
      passName: passObj.name,
      tier: passObj.tier,
      code: passObj.code
    };
    localStorage.setItem('ub_weekly_clearance', JSON.stringify(payload));
    return payload;
  } catch {
    return null;
  }
}
