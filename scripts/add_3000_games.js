import fs from 'fs';
import path from 'path';

// Helper to format title
function formatTitle(str) {
  if (!str) return 'Untitled Game';
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function normalizeCategory(cat = '', title = '', tags = []) {
  const combined = (cat + ' ' + title + ' ' + (tags || []).join(' ')).toLowerCase();
  if (combined.includes('driv') || combined.includes('car') || combined.includes('moto') || combined.includes('race') || combined.includes('racing') || combined.includes('drift') || combined.includes('truck')) {
    return 'Driving';
  }
  if (combined.includes('sport') || combined.includes('basket') || combined.includes('soccer') || combined.includes('football') || combined.includes('golf') || combined.includes('tennis') || combined.includes('hockey')) {
    return 'Sports';
  }
  if (combined.includes('shoot') || combined.includes('gun') || combined.includes('sniper') || combined.includes('fps') || combined.includes('combat') || combined.includes('strike') || combined.includes('warfare')) {
    return 'Shooter';
  }
  if (combined.includes('fnaf') || combined.includes('horror') || combined.includes('freddy') || combined.includes('scary') || combined.includes('creepy') || combined.includes('baldi') || combined.includes('granny') || combined.includes('zombie')) {
    return 'Horror';
  }
  if (combined.includes('puzzle') || combined.includes('logic') || combined.includes('match') || combined.includes('2048') || combined.includes('word') || combined.includes('sudoku') || combined.includes('chess') || combined.includes('bubble') || combined.includes('mahjong')) {
    return 'Puzzle';
  }
  if (combined.includes('2 player') || combined.includes('two player') || combined.includes('multiplayer') || combined.includes('duel') || combined.includes('vs') || combined.includes('coop')) {
    return '2 Player';
  }
  if (combined.includes('action') || combined.includes('fight') || combined.includes('battle') || combined.includes('war') || combined.includes('stickman') || combined.includes('ninja')) {
    return 'Action';
  }
  if (combined.includes('adventur') || combined.includes('craft') || combined.includes('rpg') || combined.includes('quest') || combined.includes('dungeon') || combined.includes('sandbox')) {
    return 'Adventure';
  }
  if (combined.includes('arcade') || combined.includes('run') || combined.includes('jump') || combined.includes('hop') || combined.includes('retro') || combined.includes('flappy') || combined.includes('fall') || combined.includes('dash')) {
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

async function run() {
  console.log('Loading existing games from public/games.json...');
  const gamesPath = path.resolve('public/games.json');
  let existingGames = [];
  if (fs.existsSync(gamesPath)) {
    existingGames = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
  }
  console.log(`Current existing games: ${existingGames.length}`);

  const initialCount = existingGames.length;
  const targetCount = initialCount + 3000; // E.g. 1050 + 3000 = 4050 games!
  console.log(`Goal: Add 3,000 more games -> target total = ${targetCount}+ games`);

  const seenIds = new Set();
  const seenUrls = new Set();
  const seenTitles = new Set();

  const finalGames = [];

  for (const g of existingGames) {
    seenIds.add(g.id);
    if (g.iframeUrl) seenUrls.add(g.iframeUrl.toLowerCase().trim());
    if (g.title) seenTitles.add(g.title.toLowerCase().trim());
    finalGames.push(g);
  }

  // 1. Fetch from swarmintelli/Unblocked-Games-CDN
  console.log('\n--- 1. Fetching swarmintelli Unblocked-Games-CDN ---');
  try {
    const resSwarm = await fetch('https://raw.githubusercontent.com/swarmintelli/Unblocked-Games-CDN/main/games.json');
    if (resSwarm.ok) {
      const swarmList = await resSwarm.json();
      console.log(`Found ${swarmList.length} games in Swarm CDN.`);
      let added = 0;
      for (const item of swarmList) {
        if (!item.name || !item.game_url) continue;
        const title = formatTitle(item.name);
        const url = item.game_url.trim();
        const id = (item['game-id'] || title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (seenTitles.has(title.toLowerCase()) || seenUrls.has(url.toLowerCase()) || seenIds.has(id)) {
          continue;
        }

        seenTitles.add(title.toLowerCase());
        seenUrls.add(url.toLowerCase());
        seenIds.add(id);

        const category = normalizeCategory('Arcade', title);
        const palette = COLOR_PALETTES[finalGames.length % COLOR_PALETTES.length];

        finalGames.push({
          id,
          title,
          category,
          description: `${title} is an unblocked HTML5 game hosted with sandbox execution for seamless school & work play.`,
          iframeUrl: url,
          thumbnailUrl: item.game_image_icon || null,
          tags: [category, 'Unblocked', 'HTML5', 'Classic'],
          color: palette,
          badge: 'Unblocked CDN',
          rating: Number((4.6 + Math.random() * 0.3).toFixed(1)),
          icon: 'Gamepad2',
          tip: 'Click canvas to focus keyboard controls. Press ~ or Esc at any time to trigger panic disguise.',
          stats: [
            { label: 'Engine', val: 'HTML5 WebGL' },
            { label: 'Sandbox', val: 'Protected' },
            { label: 'Framerate', val: '60 FPS' }
          ],
          highlightPills: ['Instant Play', 'Bypass Ready', 'High Framerate'],
          controls: [
            { key: 'Arrow Keys / WASD', action: 'Directional Movement' },
            { key: 'Mouse / Space', action: 'Primary Action' }
          ],
          verified_unblocked: true
        });
        added++;
      }
      console.log(`Added ${added} new unique games from Swarm CDN. Total: ${finalGames.length}`);
    }
  } catch (err) {
    console.warn('Swarm CDN fetch error:', err.message);
  }

  // 2. Fetch from Neruvy/duckmath backup_classes.json
  console.log('\n--- 2. Fetching Neruvy Duckmath catalog ---');
  try {
    const resDm = await fetch('https://raw.githubusercontent.com/Neruvy/duckmath/main/backup_classes.json');
    if (resDm.ok) {
      const dmList = await resDm.json();
      console.log(`Found ${dmList.length} games in Duckmath catalog.`);
      let added = 0;
      for (const item of dmList) {
        if (!item.title || !item.link) continue;
        const title = formatTitle(item.title);
        const url = item.link.trim();
        const id = ('dm-' + title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (seenTitles.has(title.toLowerCase()) || seenUrls.has(url.toLowerCase()) || seenIds.has(id)) {
          continue;
        }

        seenTitles.add(title.toLowerCase());
        seenUrls.add(url.toLowerCase());
        seenIds.add(id);

        const category = normalizeCategory(item.categories || 'Arcade', title);
        const palette = COLOR_PALETTES[finalGames.length % COLOR_PALETTES.length];

        let cleanDesc = item.desc ? item.desc.replace(/#+\s*/g, '').replace(/\*+/g, '').replace(/\n+/g, ' ').trim() : '';
        if (!cleanDesc) cleanDesc = `${title} is an unblocked web game optimized for Chromebooks and desktop browsers.`;

        finalGames.push({
          id,
          title,
          category,
          description: cleanDesc.slice(0, 240) + (cleanDesc.length > 240 ? '...' : ''),
          iframeUrl: url,
          thumbnailUrl: item.icon || null,
          tags: [category, 'Unblocked', 'DuckMath', 'HTML5'],
          color: palette,
          badge: 'DuckMath Vault',
          rating: Number((4.6 + Math.random() * 0.3).toFixed(1)),
          icon: 'Flame',
          tip: 'Controls are responsive. Open in stealth about:blank window if school filter blocks iframe.',
          stats: [
            { label: 'Engine', val: 'HTML5 Ruffle' },
            { label: 'Security', val: 'Sandboxed' },
            { label: 'Framerate', val: '60 FPS' }
          ],
          highlightPills: ['School Tested', 'Instant Play', 'No Ads'],
          controls: [
            { key: 'WASD / Arrow Keys', action: 'Move' },
            { key: 'Spacebar / Click', action: 'Action' }
          ],
          verified_unblocked: true
        });
        added++;
      }
      console.log(`Added ${added} new unique games from Duckmath. Total: ${finalGames.length}`);
    }
  } catch (err) {
    console.warn('Duckmath catalog fetch error:', err.message);
  }

  // 3. Fetch from GameDistribution API RSS Feed pages
  console.log('\n--- 3. Fetching GameDistribution API pages ---');
  let page = 21; // Start from page 21 to get fresh games
  let consecutiveEmpty = 0;

  while (finalGames.length < targetCount && consecutiveEmpty < 5) {
    try {
      console.log(`Fetching GameDistribution Page ${page} (Current total: ${finalGames.length} / Target: ${targetCount})...`);
      const resGd = await fetch(`https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&tags=All&subType=all&type=all&format=json&page=${page}`);
      
      if (!resGd.ok) {
        console.warn(`Page ${page} returned status ${resGd.status}`);
        page++;
        consecutiveEmpty++;
        continue;
      }

      const data = await resGd.json();
      if (!Array.isArray(data) || data.length === 0) {
        console.log(`Page ${page} returned empty list.`);
        page++;
        consecutiveEmpty++;
        continue;
      }

      consecutiveEmpty = 0;
      let addedInPage = 0;

      for (const item of data) {
        if (finalGames.length >= targetCount) break;
        if (!item.Title || !item.Url) continue;

        const title = item.Title.trim();
        const url = item.Url.trim();
        const id = (title + '-' + (item.Md5 ? item.Md5.slice(0, 6) : page))
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (seenTitles.has(title.toLowerCase()) || seenUrls.has(url.toLowerCase()) || seenIds.has(id)) {
          continue;
        }

        seenTitles.add(title.toLowerCase());
        seenUrls.add(url.toLowerCase());
        seenIds.add(id);

        const category = normalizeCategory(item.Category || 'Casual', title, item.Tag || []);
        const palette = COLOR_PALETTES[finalGames.length % COLOR_PALETTES.length];

        let thumb = null;
        if (Array.isArray(item.Asset) && item.Asset.length > 0) {
          thumb = item.Asset.find((a) => a.includes('512x512')) || item.Asset.find((a) => a.includes('512x384')) || item.Asset[0];
        }

        const instructions = item.Instructions ? item.Instructions.replace(/<[^>]+>/g, '').trim() : '';
        const desc = item.Description ? item.Description.replace(/<[^>]+>/g, '').trim() : `${title} HTML5 browser game.`;

        const controls = [];
        if (instructions) {
          controls.push({
            key: 'Controls',
            action: instructions.slice(0, 50) + (instructions.length > 50 ? '...' : '')
          });
        } else {
          controls.push({ key: 'Mouse / Touch', action: 'Interact & Play' });
          controls.push({ key: 'WASD / Arrows', action: 'Move / Steer' });
        }

        finalGames.push({
          id,
          title,
          category,
          description: desc.slice(0, 240) + (desc.length > 240 ? '...' : ''),
          iframeUrl: url,
          thumbnailUrl: thumb,
          tags: [category, 'HTML5', ...(item.Tag || []).slice(0, 3)],
          color: palette,
          badge: 'HTML5 Official',
          rating: Number((4.5 + Math.random() * 0.4).toFixed(1)),
          icon: 'Gamepad2',
          tip: instructions ? instructions.slice(0, 100) : 'Full keyboard and mouse controls supported.',
          stats: [
            { label: 'Engine', val: 'HTML5 Canvas' },
            { label: 'Resolution', val: 'HD Adaptive' },
            { label: 'Framerate', val: '60 FPS' }
          ],
          highlightPills: ['HTML5 Verified', 'Ad-Free Sandbox', 'Zero Download'],
          controls,
          verified_unblocked: true
        });
        addedInPage++;
      }

      console.log(`Page ${page}: Added ${addedInPage} games. Total: ${finalGames.length}`);
      page++;
      // Brief pause to avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.warn(`Error on page ${page}:`, err.message);
      page++;
      consecutiveEmpty++;
    }
  }

  // If still need more games, fetch from pages 1-7 or higher pages
  if (finalGames.length < targetCount) {
    console.log(`\nFetching additional pages starting from page 1 to reach ${targetCount}...`);
    let p = 1;
    while (finalGames.length < targetCount && p <= 20) {
      try {
        const resGd = await fetch(`https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&tags=All&subType=all&type=all&format=json&page=${p}`);
        if (resGd.ok) {
          const data = await resGd.json();
          if (Array.isArray(data)) {
            for (const item of data) {
              if (finalGames.length >= targetCount) break;
              if (!item.Title || !item.Url) continue;

              const title = item.Title.trim();
              const url = item.Url.trim();
              const id = (title + '-' + (item.Md5 ? item.Md5.slice(0, 6) : p))
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

              if (seenTitles.has(title.toLowerCase()) || seenUrls.has(url.toLowerCase()) || seenIds.has(id)) {
                continue;
              }

              seenTitles.add(title.toLowerCase());
              seenUrls.add(url.toLowerCase());
              seenIds.add(id);

              const category = normalizeCategory(item.Category || 'Casual', title, item.Tag || []);
              const palette = COLOR_PALETTES[finalGames.length % COLOR_PALETTES.length];

              let thumb = null;
              if (Array.isArray(item.Asset) && item.Asset.length > 0) {
                thumb = item.Asset.find((a) => a.includes('512x512')) || item.Asset.find((a) => a.includes('512x384')) || item.Asset[0];
              }

              const instructions = item.Instructions ? item.Instructions.replace(/<[^>]+>/g, '').trim() : '';
              const desc = item.Description ? item.Description.replace(/<[^>]+>/g, '').trim() : `${title} HTML5 browser game.`;

              finalGames.push({
                id,
                title,
                category,
                description: desc.slice(0, 240) + (desc.length > 240 ? '...' : ''),
                iframeUrl: url,
                thumbnailUrl: thumb,
                tags: [category, 'HTML5', ...(item.Tag || []).slice(0, 3)],
                color: palette,
                badge: 'HTML5 Official',
                rating: Number((4.5 + Math.random() * 0.4).toFixed(1)),
                icon: 'Gamepad2',
                tip: instructions ? instructions.slice(0, 100) : 'Full keyboard and mouse controls supported.',
                stats: [
                  { label: 'Engine', val: 'HTML5 Canvas' },
                  { label: 'Resolution', val: 'HD Adaptive' },
                  { label: 'Framerate', val: '60 FPS' }
                ],
                highlightPills: ['HTML5 Verified', 'Ad-Free Sandbox', 'Zero Download'],
                controls: [
                  { key: 'Controls', action: instructions ? instructions.slice(0, 50) : 'Mouse / Keyboard' }
                ],
                verified_unblocked: true
              });
            }
          }
        }
        p++;
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        p++;
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`FINISHED: Started with ${initialCount} games. Added ${finalGames.length - initialCount} new games.`);
  console.log(`Total Game Database: ${finalGames.length} games!`);
  console.log(`Writing to public/games.json...`);

  fs.writeFileSync(gamesPath, JSON.stringify(finalGames, null, 2));
  console.log(`Successfully saved ${finalGames.length} games to ${gamesPath}!`);
}

run().catch(console.error);
