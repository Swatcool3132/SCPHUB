/**
 * SCPHub Client-Side Authentication Engine
 * 100% Google-free, persistent local authentication.
 * Stores credentials securely on device in localStorage so users stay
 * signed in automatically whenever they reopen the site from this device.
 */

const USERS_STORAGE_KEY = 'scphub_users_db_v1';
const ACTIVE_SESSION_KEY = 'scphub_active_session_v1';

export const CLEARANCE_LEVELS = [
  { level: 1, title: 'Level 1: Cadet', badge: 'Cadet', color: 'text-slate-400 border-slate-600 bg-slate-800/60' },
  { level: 2, title: 'Level 2: Field Operative', badge: 'Operative', color: 'text-sky-400 border-sky-500/50 bg-sky-950/40' },
  { level: 3, title: 'Level 3: Mobile Task Force (MTF)', badge: 'MTF Lead', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40' },
  { level: 4, title: 'Level 4: Site Director', badge: 'Director', color: 'text-amber-400 border-amber-500/50 bg-amber-950/40' },
  { level: 5, title: 'Level 5: O5 Overseer Council', badge: 'O5 Council', color: 'text-rose-400 border-rose-500/50 bg-rose-950/40' },
];

export const AVATAR_OPTIONS = [
  { id: 'shield', icon: '🛡️', name: 'Tactical Shield', bg: 'from-sky-600 to-blue-800' },
  { id: 'wolf', icon: '🐺', name: 'Shadow Wolf', bg: 'from-slate-700 to-slate-900' },
  { id: 'skull', icon: '💀', name: 'Cyber Skull', bg: 'from-zinc-800 to-black' },
  { id: 'lightning', icon: '⚡', name: 'Cyber Surge', bg: 'from-amber-500 to-yellow-700' },
  { id: 'hawk', icon: '🦅', name: 'Falcon Recon', bg: 'from-emerald-600 to-teal-800' },
  { id: 'target', icon: '🎯', name: 'Deadshot', bg: 'from-rose-600 to-red-900' },
  { id: 'eye', icon: '👁️', name: 'Overseer Eye', bg: 'from-purple-600 to-indigo-900' },
  { id: 'gamepad', icon: '🎮', name: 'Retro Gamer', bg: 'from-cyan-500 to-blue-700' },
  { id: 'flame', icon: '🔥', name: 'Phoenix Fire', bg: 'from-orange-500 to-rose-700' },
  { id: 'robot', icon: '🤖', name: 'Android Drone', bg: 'from-teal-600 to-slate-800' },
];

// Simple one-way / obf hash for client-side password matching on this device
function hashPassword(password) {
  let hash = 0;
  const str = `scp_salt_${password}_safe_hash`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `pwd_h_${Math.abs(hash).toString(36)}`;
}

/**
 * Get all registered accounts saved on this device
 */
export function getSavedUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse saved users:', err);
    return [];
  }
}

/**
 * Save user database to localStorage
 */
function saveUsersDatabase(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users database:', err);
  }
}

/**
 * Check if a session already exists from this device
 * Returns the full active user profile or null
 */
export function getActiveSession() {
  try {
    const sessionData = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!sessionData) return null;

    const parsed = JSON.parse(sessionData);
    if (!parsed || !parsed.username) return null;

    // Verify user exists in the local database
    const users = getSavedUsers();
    const matched = users.find(
      (u) => u.username.toLowerCase() === parsed.username.toLowerCase()
    );

    if (matched) {
      // Update last active
      matched.lastActiveAt = new Date().toISOString();
      saveUsersDatabase(users);
      return sanitizeUser(matched);
    }
    return null;
  } catch (err) {
    console.error('Failed to get active session:', err);
    return null;
  }
}

/**
 * Sanitize user object to avoid exposing password hash to UI components
 */
function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * Register a new user on this device
 */
export function registerAccount({ username, password, clearanceLevel = 2, avatarId = 'shield', rememberDevice = true }) {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('Username / Agent Codename is required.');
  }
  if (cleanUsername.length < 3) {
    throw new Error('Codename must be at least 3 characters.');
  }
  if (!password || password.length < 3) {
    throw new Error('Password / PIN must be at least 3 characters.');
  }

  const users = getSavedUsers();
  const existing = users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (existing) {
    throw new Error(`Agent Codename "${cleanUsername}" already exists. Please sign in instead.`);
  }

  const selectedAvatar = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
  const selectedClearance = CLEARANCE_LEVELS.find((c) => c.level === clearanceLevel) || CLEARANCE_LEVELS[1];

  const newUser = {
    id: `agent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    username: cleanUsername,
    passwordHash: hashPassword(password),
    avatar: selectedAvatar,
    clearance: selectedClearance,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    stats: {
      gamesPlayed: 0,
      playTimeMinutes: 0,
      snakeHighScore: 0,
      game2048HighScore: 0,
      customGamesCount: 0,
    },
    favorites: [],
    recents: [],
    rememberDevice: Boolean(rememberDevice),
  };

  users.push(newUser);
  saveUsersDatabase(users);

  if (rememberDevice) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ username: cleanUsername, signedInAt: Date.now() }));
  }

  return sanitizeUser(newUser);
}

/**
 * Sign in with existing credentials on this device
 */
export function loginAccount({ username, password, rememberDevice = true }) {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('Please enter your Agent Codename / Username.');
  }
  if (!password) {
    throw new Error('Please enter your Password or PIN.');
  }

  const users = getSavedUsers();
  const matched = users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());

  if (!matched) {
    throw new Error(`No account found for "${cleanUsername}". Would you like to create one?`);
  }

  const testHash = hashPassword(password);
  if (matched.passwordHash !== testHash) {
    throw new Error('Incorrect Password or PIN. Please try again.');
  }

  matched.lastActiveAt = new Date().toISOString();
  matched.rememberDevice = Boolean(rememberDevice);
  saveUsersDatabase(users);

  if (rememberDevice) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ username: cleanUsername, signedInAt: Date.now() }));
  } else {
    // If not remembering device, still hold in sessionStorage or active memory
    sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ username: cleanUsername, signedInAt: Date.now() }));
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }

  return sanitizeUser(matched);
}

/**
 * Sign out - Clears persistent session so next visit requires sign in,
 * while preserving their account and data on this device
 */
export function logoutAccount() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
  sessionStorage.removeItem(ACTIVE_SESSION_KEY);
}

/**
 * Update user's profile or stats
 */
export function updateUserData(username, updateFn) {
  try {
    const users = getSavedUsers();
    const idx = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
    if (idx !== -1) {
      const updated = updateFn(users[idx]);
      users[idx] = updated;
      saveUsersDatabase(users);
      return sanitizeUser(updated);
    }
  } catch (err) {
    console.error('Error updating user data:', err);
  }
  return null;
}

/**
 * Record a game play event for the active user
 */
export function recordUserGamePlayed(username, game) {
  if (!username) return;
  updateUserData(username, (user) => {
    const stats = user.stats || { gamesPlayed: 0 };
    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;

    // Update user recents
    const recents = user.recents || [];
    const filtered = recents.filter((id) => id !== game.id);
    filtered.unshift(game.id);

    return {
      ...user,
      stats,
      recents: filtered.slice(0, 20),
    };
  });
}
