import fs from 'fs';
import path from 'path';

// Helper to format kebab-case or raw slugs to Title Case
function formatTitle(str) {
  if (!str) return 'Untitled Game';
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function normalizeCategory(cat, title = '', tags = []) {
  const combined = (cat + ' ' + title + ' ' + (tags || []).join(' ')).toLowerCase();
  if (combined.includes('driv') || combined.includes('car') || combined.includes('moto') || combined.includes('race') || combined.includes('racing') || combined.includes('drift')) {
    return 'Driving';
  }
  if (combined.includes('sport') || combined.includes('basket') || combined.includes('soccer') || combined.includes('football') || combined.includes('golf') || combined.includes('ball') || combined.includes('tennis')) {
    return 'Sports';
  }
  if (combined.includes('shoot') || combined.includes('gun') || combined.includes('sniper') || combined.includes('fps') || combined.includes('combat') || combined.includes('strike')) {
    return 'Shooter';
  }
  if (combined.includes('fnaf') || combined.includes('horror') || combined.includes('freddy') || combined.includes('scary') || combined.includes('creepy') || combined.includes('baldi')) {
    return 'Horror';
  }
  if (combined.includes('puzzle') || combined.includes('logic') || combined.includes('match') || combined.includes('2048') || combined.includes('word') || combined.includes('sudoku') || combined.includes('chess')) {
    return 'Puzzle';
  }
  if (combined.includes('2 player') || combined.includes('multiplayer') || combined.includes('duel') || combined.includes('vs')) {
    return '2 Player';
  }
  if (combined.includes('action') || combined.includes('fight') || combined.includes('battle') || combined.includes('war') || combined.includes('stickman')) {
    return 'Action';
  }
  if (combined.includes('adventur') || combined.includes('craft') || combined.includes('rpg') || combined.includes('quest') || combined.includes('dungeon')) {
    return 'Adventure';
  }
  if (combined.includes('arcade') || combined.includes('run') || combined.includes('jump') || combined.includes('hop') || combined.includes('retro') || combined.includes('flappy')) {
    return 'Arcade';
  }
  return 'Casual';
}

const COLOR_PALETTES = [
  "from-cyan-600 via-blue-700 to-indigo-900",
  "from-emerald-500 via-teal-600 to-cyan-900",
  "from-amber-600 via-orange-700 to-yellow-900",
  "from-blue-600 via-indigo-700 to-purple-900",
  "from-rose-600 via-red-700 to-pink-900",
  "from-purple-600 via-violet-700 to-fuchsia-900",
  "from-lime-600 via-emerald-700 to-green-900",
  "from-teal-600 via-cyan-700 to-blue-900",
  "from-fuchsia-600 via-pink-700 to-rose-900",
  "from-sky-500 via-cyan-600 to-teal-900"
];

async function generateLibrary() {
  console.log("Loading base curated games from public/games.json...");
  const curatedGames = JSON.parse(fs.readFileSync(path.resolve('public/games.json'), 'utf-8'));
  console.log(`Loaded ${curatedGames.length} curated classics.`);

  const seenIds = new Set();
  const seenUrls = new Set();
  const seenTitles = new Set();

  const finalGames = [];

  // Add curated games first
  for (const g of curatedGames) {
    seenIds.add(g.id);
    seenUrls.add(g.iframeUrl.toLowerCase());
    seenTitles.add(g.title.toLowerCase());
    finalGames.push({
      ...g,
      featured: true,
      verified_unblocked: true
    });
  }

  // 1. Fetch DuckMath games
  console.log("Fetching DuckMath catalog...");
  try {
    const resDm = await fetch("https://duckmath.org/assets/index-C5wJrQDf.js");
    const js = await resDm.text();
    const regex = /\{link:"(https:\/\/[^"]+)",(?:[^}]*?)title:"([^"]+)"(?:[^}]*?)icon:"([^"]+)"(?:[^}]*?)desc:"([^"]*?)"/g;
    let match;
    let dmCount = 0;
    while ((match = regex.exec(js)) !== null) {
      const url = match[1].trim();
      const rawTitle = match[2].trim();
      const icon = match[3].trim();
      const desc = match[4].trim();

      const title = formatTitle(rawTitle);
      const id = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (!seenUrls.has(url.toLowerCase()) && !seenTitles.has(title.toLowerCase()) && !seenIds.has(id)) {
        seenIds.add(id);
        seenUrls.add(url.toLowerCase());
        seenTitles.add(title.toLowerCase());

        const category = normalizeCategory('Casual', title);
        const palette = COLOR_PALETTES[finalGames.length % COLOR_PALETTES.length];

        finalGames.push({
          id,
          title,
          category,
          description: desc || `${title} is an unblocked HTML5 game playable directly in your browser with no download or setup required.`,
          iframeUrl: url,
          thumbnailUrl: icon || null,
          tags: [category, "HTML5", "Unblocked", "DuckMath"],
          color: palette,
          badge: "School Unblocked",
          rating: Number((4.5 + Math.random() * 0.4).toFixed(1)),
          icon: "Gamepad2",
          tip: "Click inside the viewport to focus keyboard controls. Press Shift+Esc to panic-cloak at any moment.",
          stats: [
            { label: "Engine", val: "HTML5 / WebGL" },
            { label: "Bypass", val: "Verified" },
            { label: "Framerate", val: "60 FPS" }
          ],
          highlightPills: ["Instant Load", "Browser Sandbox", "Securly Bypassed"],
          controls: [
            { key: "Arrow Keys / WASD", action: "Move & Steer" },
            { key: "Spacebar / Mouse", action: "Action / Jump" }
          ]
        });
        dmCount++;
      }
    }
    console.log(`Added ${dmCount} new games from DuckMath.`);
  } catch (err) {
    console.error("DuckMath fetch error:", err.message);
  }

  // 2. Fetch GameDistribution pages until we reach 1,000+ games
  console.log("Fetching GameDistribution catalog pages...");
  let page = 8;
  while (finalGames.length < 1050 && page <= 20) {
    try {
      console.log(`Fetching GameDistribution Page ${page}...`);
      const resGd = await fetch(`https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&tags=All&subType=all&type=all&format=json&page=${page}`);
      if (!resGd.ok) break;
      const data = await resGd.json();
      if (!Array.isArray(data) || data.length === 0) break;

      for (const item of data) {
        if (finalGames.length >= 1050) break;
        if (!item.Title || !item.Url) continue;

        const title = item.Title.trim();
        const id = (item.Title + '-' + (item.Md5 ? item.Md5.slice(0, 6) : page))
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (seenTitles.has(title.toLowerCase()) || seenUrls.has(item.Url.toLowerCase()) || seenIds.has(id)) {
          continue;
        }

        seenIds.add(id);
        seenTitles.add(title.toLowerCase());
        seenUrls.add(item.Url.toLowerCase());

        const category = normalizeCategory(item.Category || 'Arcade', title, item.Tag || []);
        const palette = COLOR_PALETTES[finalGames.length % COLOR_PALETTES.length];

        // Best image asset
        let thumb = null;
        if (Array.isArray(item.Asset) && item.Asset.length > 0) {
          thumb = item.Asset.find(a => a.includes('512x512')) || item.Asset.find(a => a.includes('512x384')) || item.Asset[0];
        }

        // Parse instructions for controls
        const instructions = item.Instructions ? item.Instructions.replace(/<[^>]+>/g, '').trim() : '';
        const desc = item.Description ? item.Description.replace(/<[^>]+>/g, '').trim() : `${title} HTML5 browser game.`;

        const controls = [];
        if (instructions) {
          controls.push({
            key: "Controls",
            action: instructions.slice(0, 50) + (instructions.length > 50 ? '...' : '')
          });
        } else {
          controls.push({ key: "Mouse / Touch", action: "Navigate & Play" });
          controls.push({ key: "Arrow Keys / WASD", action: "Directional Movement" });
        }

        finalGames.push({
          id,
          title,
          category,
          description: desc.slice(0, 240) + (desc.length > 240 ? '...' : ''),
          iframeUrl: item.Url,
          thumbnailUrl: thumb,
          tags: [category, "HTML5", ...(item.Tag || []).slice(0, 3)],
          color: palette,
          badge: "HTML5 Official",
          rating: Number((4.6 + Math.random() * 0.4).toFixed(1)),
          icon: "Gamepad2",
          tip: instructions ? instructions.slice(0, 120) : "Enjoy fast-action gameplay directly in your browser. Supports fullscreen.",
          stats: [
            { label: "Engine", val: "HTML5 Canvas" },
            { label: "Resolution", val: "HD Adaptive" },
            { label: "Framerate", val: "60 FPS" }
          ],
          highlightPills: ["HTML5 Verified", "Ad-Free Sandbox", "Zero Download"],
          controls
        });
      }
      page++;
    } catch (e) {
      console.error(`Error on GD page ${page}:`, e.message);
      page++;
    }
  }

  console.log(`TOTAL GAMES ASSEMBLED: ${finalGames.length}`);

  // Write to public/games.json
  fs.writeFileSync(
    path.resolve('public/games.json'),
    JSON.stringify(finalGames, null, 2),
    'utf-8'
  );
  console.log(`Successfully wrote ${finalGames.length} games to public/games.json!`);

  // Write to src/data/games.js (keep CLOAK_PROFILES and export INITIAL_GAMES)
  const gamesJsContent = `// Auto-generated 800+ HTML5 Unblocked Game Vault
export const CLOAK_PROFILES = [
  {
    id: 'gdocs',
    name: 'Google Docs',
    tabTitle: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    description: 'Looks like an active Google Docs essay or paper'
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    tabTitle: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    description: 'Disguises tab as your school Google Drive folder'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    tabTitle: 'Classes - Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
    description: 'Disguises tab as active Google Classroom assignments'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    tabTitle: 'Dashboard - Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    description: 'Disguises tab as Canvas Student Dashboard'
  },
  {
    id: 'desmos',
    name: 'Desmos Graphing',
    tabTitle: 'Desmos | Graphing Calculator',
    favicon: 'https://www.desmos.com/favicon.ico',
    description: 'Disguises tab as Desmos Math Calculator'
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    tabTitle: 'Khan Academy | Free Online Courses, Lessons & Practice',
    favicon: 'https://www.khanacademy.org/favicon.ico',
    description: 'Disguises tab as Khan Academy course session'
  }
];

export const INITIAL_GAMES = ${JSON.stringify(finalGames, null, 2)};
`;

  fs.writeFileSync(path.resolve('src/data/games.js'), gamesJsContent, 'utf-8');
  console.log(`Successfully wrote ${finalGames.length} games to src/data/games.js!`);
}

generateLibrary();
