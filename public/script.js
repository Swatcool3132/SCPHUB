/**
 * ====================================================================
 * SCPHub | script.js - Complete Game Engine for Mimo.org
 * SECURE • CONTAIN • PLAY
 * 
 * Works 100% in Mimo.org, CodePen, Replit, or any static HTML host.
 * Features:
 *  - 60+ Verified Unblocked HTML5 Games + Auto-sync with games.json
 *  - Native Offline Canvas Engines (Cyber Snake & 2048)
 *  - Tab Cloaking (Google Docs, Classroom, Drive, Desmos, Canvas LMS)
 *  - Emergency Panic Screen (~ or Esc)
 *  - Real-time Typewriter Banner
 *  - Interactive Stealth Terminal
 *  - Search & Category Filters + LocalStorage Favorites
 * ====================================================================
 */

// --- 1. CORE GAMES DATABASE ---
let GAMES = [
  {
    "id": "slope",
    "title": "Slope",
    "category": "Arcade",
    "desc": "The ultimate 3D neon downhill speed test! Roll your sphere down an endless, procedurally generated neon course...",
    "url": "https://db.duckmath.org/html/slope/index.html",
    "badge": "Top School Classic",
    "tag": "3D"
  },
  {
    "id": "retro-bowl",
    "title": "Retro Bowl",
    "category": "Sports",
    "desc": "The undisputed king of 8-bit football games! Manage your roster, draft future Hall of Famers, maintain locker ...",
    "url": "https://db.duckmath.org/html/retro_bowl/index.html",
    "badge": "Gridiron Legend",
    "tag": "Sports"
  },
  {
    "id": "1v1-lol",
    "title": "1v1.LOL",
    "category": "Action",
    "desc": "Fast-paced competitive 3D building and shooting simulator! Practice your edit speed, ramp rushes, wall replace...",
    "url": "https://db.duckmath.org/html/1v1lol/index.html",
    "badge": "Building Shooter",
    "tag": "Action"
  },
  {
    "id": "cookie-clicker",
    "title": "Cookie Clicker",
    "category": "Idle",
    "desc": "The timeless incremental clicker masterpiece! Bake cookies by the trillions, hire grandmas, construct automate...",
    "url": "https://db.duckmath.org/html/cookie_clicker/index.html",
    "badge": "Infinite Clicker",
    "tag": "Idle"
  },
  {
    "id": "fnaf-1",
    "title": "Five Nights at Freddy's (FNAF 1)",
    "category": "Horror",
    "desc": "Welcome to Freddy Fazbear's Pizza! Survive your night shift as the night security guard from 12 AM to 6 AM. Mo...",
    "url": "https://db.duckmath.org/html/fnaf/index.html",
    "badge": "Survival Horror",
    "tag": "Horror"
  },
  {
    "id": "geometry-dash-scratch",
    "title": "Geometry Dash Scratch",
    "category": "Casual",
    "desc": "Jump into a fast geometry game full of color and action. Guide your shape avoid spikes and time every jump per...",
    "url": "https://db2.duckmath.org/2025/scratch/geometry-dash-scratch/pre.html",
    "badge": "School Unblocked",
    "tag": "Casual"
  },
  {
    "id": "drift-hunters",
    "title": "Drift Hunters",
    "category": "Driving",
    "desc": "The premier 3D browser drift simulator! Choose from 25+ iconic JDM and European drift cars, customize turbos, ...",
    "url": "https://db2.duckmath.org/2023/unity3/drift-hunters/pre.html",
    "badge": "Realistic Drift Sim",
    "tag": "Driving"
  },
  {
    "id": "bitlife",
    "title": "BitLife",
    "category": "Puzzle",
    "desc": "Text-based life simulation sandbox where every choice shapes your destiny! Will you graduate from medical scho...",
    "url": "https://db.duckmath.org/html/bitlife/index.html",
    "badge": "Life Simulator",
    "tag": "Simulation"
  },
  {
    "id": "basket-random",
    "title": "Basket Random",
    "category": "Sports",
    "desc": "Two-player ragdoll basketball madness! Hilarious one-button physics where your hoopers bounce, kick, flip, and...",
    "url": "https://db.duckmath.org/html/basket_random/index.html",
    "badge": "Ragdoll Hoops",
    "tag": "Sports"
  },
  {
    "id": "soccer-random",
    "title": "Soccer Random",
    "category": "Sports",
    "desc": "Hilarious ragdoll soccer showdown! Score 5 goals before your rival on snowy pitches, sandy beaches, bouncing v...",
    "url": "https://db.duckmath.org/html/soccer_random/index.html",
    "badge": "Chaotic Football",
    "tag": "Sports"
  },
  {
    "id": "boxing-random",
    "title": "Boxing Random",
    "category": "Sports",
    "desc": "Step into the squared circle for unpredictable ragdoll boxing! Throw haymakers, dodge headbutts, take advantag...",
    "url": "https://db.duckmath.org/html/boxing_random/index.html",
    "badge": "Knockout Brawl",
    "tag": "Sports"
  },
  {
    "id": "volley-random",
    "title": "Volley Random",
    "category": "Sports",
    "desc": "Wild ragdoll volleyball where anything can happen! Spike over the net, dive across unpredictable courts, and a...",
    "url": "https://db.duckmath.org/html/volley_random/index.html",
    "badge": "Ragdoll Spikes",
    "tag": "Sports"
  },
  {
    "id": "moto-x3m",
    "title": "Moto X3M",
    "category": "Arcade",
    "desc": "The gold standard of stunt bike trials! Race your dirt bike across 25+ perilous levels filled with massive loo...",
    "url": "https://db.duckmath.org/html/motox3m/index.html",
    "badge": "Stunt Bike Trials",
    "tag": "Sports"
  },
  {
    "id": "smash-karts",
    "title": "Smash Karts",
    "category": "Driving",
    "desc": "Fast 3D multiplayer kart battle arena! Drive high-speed go-karts, pick up mystery weapon boxes, and blast othe...",
    "url": "https://db.duckmath.org/html/smash_karts/index.html",
    "badge": "Kart Battle Arena",
    "tag": "Driving"
  },
  {
    "id": "rooftop-snipers",
    "title": "Rooftop Snipers",
    "category": "Action",
    "desc": "Two snipers on slippery rooftops with hilarious two-button physics! Jump and shoot to blast your opponent off ...",
    "url": "https://db.duckmath.org/html/rooftop_snipers/index.html",
    "badge": "Rooftop Duel",
    "tag": "Action"
  },
  {
    "id": "crossy-road",
    "title": "Crossy Road",
    "category": "Arcade",
    "desc": "Why did the chicken cross the road? Hop across endless busy highways, raging river log flumes, and speeding tr...",
    "url": "https://db.duckmath.org/html/crossy_road/index.html",
    "badge": "Voxel Hopper",
    "tag": "Arcade"
  },
  {
    "id": "happy-wheels",
    "title": "Happy Wheels",
    "category": "Arcade",
    "desc": "The world-famous ragdoll physics obstacle game! Navigate motorized wheelchairs, Segways, and bicycles through ...",
    "url": "https://db.duckmath.org/html/happy_wheels/index.html",
    "badge": "Ragdoll Classic",
    "tag": "Arcade"
  },
  {
    "id": "snow-rider-3d",
    "title": "Snow Rider 3D",
    "category": "Action",
    "desc": "Race your sled down steep snowy mountains at breakneck speeds in full 3D! Dodge giant pine trees, tumbling bou...",
    "url": "https://db.duckmath.org/html/snow_rider_3d/index.html",
    "badge": "3D Sledding",
    "tag": "3D"
  },
  {
    "id": "stickman-hook",
    "title": "Stickman Hook",
    "category": "Arcade",
    "desc": "Swing like Spider-Man through colorful, bouncy obstacle courses! Hook onto grappling pegs, build elastic kinet...",
    "url": "https://db.duckmath.org/html/stickman_hook/index.html",
    "badge": "Grapple Swing",
    "tag": "Arcade"
  },
  {
    "id": "eggy-car",
    "title": "Eggy Car",
    "category": "Driving",
    "desc": "Drive as far as possible over steep hills and valleys with a fragile egg sitting on top of your car! Collect c...",
    "url": "https://db.duckmath.org/html/eggy_car/index.html",
    "badge": "Balance Driving",
    "tag": "Driving"
  },
  {
    "id": "doodle-jump",
    "title": "Doodle Jump",
    "category": "Arcade",
    "desc": "The timeless vertical platformer! Guide the adorable Doodler upward on a piece of graph paper, leaping from pl...",
    "url": "https://db.duckmath.org/html/doodle_jump/index.html",
    "badge": "Retro Mobile Classic",
    "tag": "Arcade"
  },
  {
    "id": "minecraft",
    "title": "Minecraft (Eaglercraft)",
    "category": "RPG",
    "desc": "Full Minecraft running seamlessly in your browser with WebAssembly! Mine resources, craft tools, build monumen...",
    "url": "https://db.duckmath.org/html/minecraft/index.html",
    "badge": "Full Web Edition",
    "tag": "Sandbox"
  },
  {
    "id": "run-3",
    "title": "Run 3",
    "category": "Arcade",
    "desc": "Explore the vast galaxy in an endless rotating architectural tunnel! Hop from wall to ceiling, navigate around...",
    "url": "https://db.duckmath.org/html/run3/index.html",
    "badge": "Zero-G Runner",
    "tag": "Arcade"
  },
  {
    "id": "fnaf-2",
    "title": "Five Nights at Freddy's 2",
    "category": "Horror",
    "desc": "No doors to protect you! In the grand reopening of Freddy Fazbear's Pizza, survive against both withered and n...",
    "url": "https://db.duckmath.org/html/fnaf2/index.html",
    "badge": "Terror Sequel",
    "tag": "Horror"
  },
  {
    "id": "fnaf-3",
    "title": "Five Nights at Freddy's 3",
    "category": "Horror",
    "desc": "Thirty years after Freddy's closed, Fazbear's Fright: The Horror Attraction opens. Survive against Springtrap ...",
    "url": "https://db.duckmath.org/html/fnaf3/index.html",
    "badge": "Springtrap Horror",
    "tag": "Horror"
  },
  {
    "id": "drive-mad",
    "title": "Drive Mad",
    "category": "Driving",
    "desc": "The viral physics-based monster truck trial! Navigate 100+ inventive obstacle tracks with giant wheels, expand...",
    "url": "https://db.duckmath.org/html/drive_mad/index.html",
    "badge": "Physics Truck Trial",
    "tag": "Driving"
  },
  {
    "id": "polytrack",
    "title": "PolyTrack",
    "category": "Driving",
    "desc": "High-octane low-poly time-trial racing inspired by TrackMania! Race customizable open-wheel racers across craz...",
    "url": "https://db.duckmath.org/html/polytrack/index.html",
    "badge": "TrackMania Style",
    "tag": "Driving"
  },
  {
    "id": "cluster-rush",
    "title": "Cluster Rush",
    "category": "Action",
    "desc": "Adrenaline-fueled first-person parkour! Sprint, jump, and climb across a chaotic highway convoy of runaway sem...",
    "url": "https://db.duckmath.org/html/cluster_rush/index.html",
    "badge": "First-Person Parkour",
    "tag": "Action"
  },
  {
    "id": "duck-life",
    "title": "Duck Life",
    "category": "RPG",
    "desc": "Train your humble duckling into the world's fastest racing champion! Grind running, swimming, flying, and ener...",
    "url": "https://db.duckmath.org/html/duck_life/index.html",
    "badge": "Classic Training RPG",
    "tag": "RPG"
  },
  {
    "id": "temple-run-2",
    "title": "Temple Run 2",
    "category": "Arcade",
    "desc": "Escape the cursed demon monkey in the legendary endless runner! Sprint along precarious cliff edges, zip-lines...",
    "url": "https://db.duckmath.org/html/temple_run_2/index.html",
    "badge": "Endless Runner",
    "tag": "Arcade"
  },
  {
    "id": "tanuki-sunset",
    "title": "Tanuki Sunset",
    "category": "Arcade",
    "desc": "Cruising downhill on a skateboard as a stylish raccoon against breathtaking retro synthwave sunsets! Drift aro...",
    "url": "https://db.duckmath.org/html/tanuki_sunset/index.html",
    "badge": "Chill Synthwave Drift",
    "tag": "Arcade"
  },
  {
    "id": "flappy-bird",
    "title": "Flappy Bird",
    "category": "Arcade",
    "desc": "The notoriously challenging retro tap flyer! Flap your tiny wings, carefully maintain altitude, and weave thro...",
    "url": "https://db.duckmath.org/html/flappy_bird/index.html",
    "badge": "Precision Flyer",
    "tag": "Arcade"
  },
  {
    "id": "2048",
    "title": "2048",
    "category": "Puzzle",
    "desc": "The captivating mathematical tile puzzle! Slide numbered tiles on a 4x4 grid to merge identical numbers—2+2=4,...",
    "url": "https://db.duckmath.org/html/2048/index.html",
    "badge": "Math Puzzle",
    "tag": "Puzzle"
  },
  {
    "id": "ovo",
    "title": "OvO",
    "category": "Arcade",
    "desc": "Electrifying precision stickman parkour platformer! Chain slides, wall jumps, dives, and ground pounds togethe...",
    "url": "https://db.duckmath.org/html/ovo/index.html",
    "badge": "Speedrun Parkour",
    "tag": "Arcade"
  },
  {
    "id": "ragdoll-archers",
    "title": "Ragdoll Archers",
    "category": "Action",
    "desc": "Draw your bow, calculate ballistic arrow trajectories, and battle waves of enemy archers and armored knights w...",
    "url": "https://db.duckmath.org/html/ragdoll_archers/index.html",
    "badge": "Ballistic Archery",
    "tag": "Action"
  },
  {
    "id": "friday-night-funkin",
    "title": "Friday Night Funkin'",
    "category": "Arcade",
    "desc": "The viral rhythm phenomenon! Match arrow keys to catchy beats in melodic rap battles against Daddy Dearest, Sk...",
    "url": "https://db.duckmath.org/html/friday_night_funkin/index.html",
    "badge": "Rhythm Phenomenon",
    "tag": "Arcade"
  },
  {
    "id": "btd5",
    "title": "Bloons Tower Defense 5 (BTD5)",
    "category": "Puzzle",
    "desc": "The legendary tower defense classic! Strategically deploy Dart Monkeys, Super Monkeys, Ninja Monkeys, and Tack...",
    "url": "https://db.duckmath.org/html/btd5/index.html",
    "badge": "Tower Defense King",
    "tag": "Strategy"
  },
  {
    "id": "drift-boss",
    "title": "Drift Boss",
    "category": "Driving",
    "desc": "One-touch 3D drifting on an endless suspended track! Time your drift turns with surgical precision to stay on ...",
    "url": "https://db.duckmath.org/html/drift_boss/index.html",
    "badge": "One-Touch Drift",
    "tag": "Driving"
  },
  {
    "id": "vex-8",
    "title": "Vex 8",
    "category": "Arcade",
    "desc": "The latest installment in the iconic Vex platformer franchise! Master precision wall-jumps, grappling hooks, h...",
    "url": "https://db.duckmath.org/html/vex_8/index.html",
    "badge": "Hardcore Platformer",
    "tag": "Arcade"
  },
  {
    "id": "super-mario-64",
    "title": "Super Mario 64",
    "category": "RPG",
    "desc": "The groundbreaking 3D platforming masterpiece completely ported to HTML5 WebGL! Jump through Princess Peach's ...",
    "url": "https://db.duckmath.org/html/super_mario_64/index.html",
    "badge": "Nintendo 64 Classic",
    "tag": "3D"
  },
  {
    "id": "madalin-stunt-cars-2",
    "title": "Madalin Stunt Cars 2",
    "category": "Driving",
    "desc": "Open-world 3D supercar stunt playground! Drive hypercars—including the Bugatti Veyron, Lamborghini Aventador, ...",
    "url": "https://db.duckmath.org/html/madalin_stunt_cars_2/index.html",
    "badge": "Supercar Stunts",
    "tag": "Driving"
  },
  {
    "id": "golf-orbit",
    "title": "Golf Orbit",
    "category": "Sports",
    "desc": "Launch your golf ball into outer space! Time your swing with pinpoint accuracy to hit 100% maximum power, boun...",
    "url": "https://db.duckmath.org/html/golf_orbit/index.html",
    "badge": "Space Golf",
    "tag": "Sports"
  },
  {
    "id": "escape-car",
    "title": "Escape Car",
    "category": "Driving",
    "desc": "Outrun the pursuit in an adrenaline-pumping getaway! Drift around hairpins, weave through rush-hour traffic, a...",
    "url": "https://db.duckmath.org/html/escape_car/index.html",
    "badge": "Police Chase",
    "tag": "Action"
  },
  {
    "id": "deadly-descent",
    "title": "Deadly Descent",
    "category": "Sports",
    "desc": "Hurtle down razor-sharp cliffs and treacherous alpine ridges at breakneck speeds! Master downhill mountain bik...",
    "url": "https://db.duckmath.org/html/deadly_descent/index.html",
    "badge": "Downhill BMX",
    "tag": "3D"
  },
  {
    "id": "baldis-basics",
    "title": "Baldi's Basics in Education",
    "category": "Horror",
    "desc": "Enter Baldi's Schoolhouse to collect 7 lost notebooks! Solve math problems on the You Can Think Pad, outrun Ba...",
    "url": "https://db2.duckmath.org/2026/more/baldis-basics/pre.html",
    "badge": "90s Edutainment Horror",
    "tag": "Horror"
  },
  {
    "id": "basketball-legends",
    "title": "Basketball Legends",
    "category": "Sports",
    "desc": "Step onto the hardwood with legendary cartoon NBA superstars! Perform devastating slam dunks, block three-poin...",
    "url": "https://db2.duckmath.org/2002/basketball-legends/index.html",
    "badge": "2-Player Hoops",
    "tag": "Sports"
  },
  {
    "id": "tap-tap-shots",
    "title": "Tap Tap Shots",
    "category": "Sports",
    "desc": "The dangerously addictive basketball dunk challenge! Tap to keep the ball in the air and time your arc to sink...",
    "url": "https://db2.duckmath.org/2023/q/1/tap-tap-shots/pre.html",
    "badge": "Shot Clock Swish",
    "tag": "Sports"
  },
  {
    "id": "we-become-what-we-behold",
    "title": "We Become What We Behold",
    "category": "Puzzle",
    "desc": "A profound 5-minute game about news cycles, social contagion, and sensationalism. Take photos of squares and c...",
    "url": "https://db2.duckmath.org/2024/more/we-become-what-we-behold/pre.html",
    "badge": "Social Satire",
    "tag": "Indie"
  },
  {
    "id": "sprunki",
    "title": "Sprunki Incredibox",
    "category": "Arcade",
    "desc": "The viral musical interactive beatbox simulator! Drag and drop unique quirky musical beatboxers to craft infec...",
    "url": "https://db2.duckmath.org/2024/more2/sprunki/pre.html",
    "badge": "Musical Beatboxer",
    "tag": "Music"
  },
  {
    "id": "bus-subway-runner",
    "title": "Subway Bus Runner",
    "category": "Arcade",
    "desc": "3D high-speed urban runner! Dash across train tracks, dodge oncoming buses and commuter trains, ride hoverboar...",
    "url": "https://db2.duckmath.org/2022/unity/bus-subway-runner/pre.html",
    "badge": "Subway Parkour",
    "tag": "Arcade"
  },
  {
    "id": "velocity-rush",
    "title": "Velocity Rush",
    "category": "Action",
    "desc": "Fast-paced first-person parkour action game! Run along walls, slide under laser fences, execute grappling-hook...",
    "url": "https://db2.duckmath.org/2026/unity/velocity-rush/pre.html",
    "badge": "Parkour FPS",
    "tag": "Action"
  },
  {
    "id": "pokemon-emerald",
    "title": "Pokemon Emerald",
    "category": "RPG",
    "desc": "The legendary Game Boy Advance RPG running completely in browser via WebAssembly! Explore the Hoenn region, ca...",
    "url": "https://db2.duckmath.org/2026/em/pokemon-emerald/index.html",
    "badge": "GBA Emulation",
    "tag": "RPG"
  },
  {
    "id": "pokemon-red",
    "title": "Pokemon Red",
    "category": "RPG",
    "desc": "Where the worldwide phenomenon began! Journey through the Kanto region, challenge the Elite Four at the Indigo...",
    "url": "https://db2.duckmath.org/2026/em/pokemon-red/index.html",
    "badge": "Gen 1 Classic",
    "tag": "RPG"
  },
  {
    "id": "elastic-man",
    "title": "Elastic Man",
    "category": "Casual",
    "desc": "Amazingly satisfying and hilarious facial physics simulator! Pinch, stretch, pull, and release an elastic face...",
    "url": "https://db2.duckmath.org/2025/more/elastic-man/gm/pre.html",
    "badge": "Satisfying Physics",
    "tag": "Casual"
  },
  {
    "id": "backflip-challenge",
    "title": "Backflip Challenge",
    "category": "Sports",
    "desc": "Realistic ragdoll gymnastics and cliff jumping! Calculate your takeoff crouch, tuck into tight spins, and time...",
    "url": "https://db2.duckmath.org/2026/unity/backflip-challenge/pre.html",
    "badge": "Ragdoll Acrobatics",
    "tag": "Sports"
  },
  {
    "id": "steal-brainrots-multiplayer",
    "title": "Steal Brainrots Multiplayer",
    "category": "Action",
    "desc": "Hilarious fast-paced multiplayer heist game! Infiltrate top-secret vaults, dodge security cameras and laser tr...",
    "url": "https://db2.duckmath.org/2026/unity/steal-brainrots-multiplayer/pre.html",
    "badge": "Multiplayer Heist",
    "tag": "Action"
  },
  {
    "id": "ducky-clicker",
    "title": "Ducky Clicker",
    "category": "Idle",
    "desc": "Quack your way to rubber duck supremacy! Click the giant rubber duck, unlock duck ponds, hire duck scientists,...",
    "url": "https://db2.duckmath.org/2026/more/ducky-clicker/pre.html",
    "badge": "Quacking Clicker",
    "tag": "Idle"
  },
  {
    "id": "stickman-gta-city",
    "title": "Stickman GTA City",
    "category": "Action",
    "desc": "Open-world 3D sandbox city action! Commandeer luxury supercars, pilot attack helicopters, complete gang missio...",
    "url": "https://db2.duckmath.org/2024/unity3/stickman-gta-city/pre.html",
    "badge": "Open World City",
    "tag": "Action"
  },
  {
    "id": "highway-traffic",
    "title": "Highway Traffic",
    "category": "Driving",
    "desc": "High-speed lane splitting and near-miss thrills! Weave through dense rush hour highway traffic at 200 MPH, nar...",
    "url": "https://db2.duckmath.org/2022/unity/highway-traffic/pre.html",
    "badge": "Traffic Weaving",
    "tag": "Driving"
  },
  {
    "id": "eagle-craft",
    "title": "Eagle Craft",
    "category": "Adventure",
    "desc": "Eagle Craft is an unblocked HTML5 game playable directly in your browser with no download or setup required....",
    "url": "https://classroomlesson.github.io/basic-ruffle-player/html/minecraft/index.html",
    "badge": "School Unblocked",
    "tag": "Adventure"
  },
  {
    "id": "native-snake",
    "title": "Cyber Snake (100% Offline)",
    "category": "Retro",
    "desc": "Native canvas retro cyber snake. Runs 100% offline with zero network requests!",
    "url": "native:snake",
    "badge": "Native Offline",
    "tag": "Arcade"
  },
  {
    "id": "native-2048",
    "title": "2048 Cyber Grid (100% Offline)",
    "category": "Retro",
    "desc": "Native sliding puzzle. Combine matching power tiles to reach the 2048 core!",
    "url": "native:2048",
    "badge": "Native Offline",
    "tag": "Puzzle"
  }
];

// Optional: If games.json is present in the host (e.g. root or /games.json), auto-expand to 4,000+ games!
async function loadFullGamesDatabase() {
  try {
    const res = await fetch('games.json');
    if (res.ok) {
      const fullList = await res.json();
      if (Array.isArray(fullList) && fullList.length > 50) {
        const mapped = fullList.map(g => ({
          id: g.id,
          title: g.title,
          category: g.category || 'Arcade',
          desc: (g.description || '').slice(0, 110) + (g.description && g.description.length > 110 ? '...' : ''),
          url: g.iframeUrl || g.url,
          badge: g.badge || 'Verified',
          tag: (g.tags && g.tags[0]) || g.category || 'Game'
        })).filter(g => g.url && (g.url.startsWith('http') || g.url.startsWith('native:')));

        // Keep native offline games
        const natives = GAMES.filter(g => g.url && g.url.startsWith('native:'));
        GAMES = [...natives, ...mapped];
        console.log('Expanded vault with ' + GAMES.length + ' games from games.json');
        renderGames(getActiveList());
      }
    }
  } catch (e) {
    // Offline / standalone fallback
  }
}

// --- 2. FAVORITES MANAGEMENT ---
let favorites = JSON.parse(localStorage.getItem('scp_favs') || '[]');

function toggleFavorite(id, e) {
  if (e) e.stopPropagation();
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('scp_favs', JSON.stringify(favorites));
  renderGames(getActiveList());
}

// --- 3. FILTERING & RENDERING ---
let currentCategory = 'all';
let currentSearchQuery = '';

function getActiveList() {
  let list = GAMES;
  if (currentCategory === 'favs') {
    list = list.filter(g => favorites.includes(g.id));
  } else if (currentCategory !== 'all') {
    list = list.filter(g => (g.category || '').toLowerCase() === currentCategory.toLowerCase());
  }
  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    list = list.filter(g => 
      (g.title && g.title.toLowerCase().includes(q)) || 
      (g.desc && g.desc.toLowerCase().includes(q)) || 
      (g.tag && g.tag.toLowerCase().includes(q)) ||
      (g.category && g.category.toLowerCase().includes(q))
    );
  }
  return list;
}

let visibleGameLimit = 60;
let searchDebounceTimer = null;

function renderGames(list) {
  const container = document.getElementById('games-container');
  const countEl = document.getElementById('vault-count');
  if (!container) return;

  if (countEl) {
    countEl.textContent = 'Verified Vault (' + list.length + ' Games)';
  }

  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #94a3b8; font-size: 0.9rem;">No games found matching criteria. Try another search!</div>';
    return;
  }

  const itemsToShow = list.slice(0, visibleGameLimit);

  itemsToShow.forEach(game => {
    const isFav = favorites.includes(game.id);
    const card = document.createElement('div');
    card.className = 'game-card';
    card.onclick = () => launchGame(game);

    card.innerHTML = 
      '<div class="game-thumb">' +
        '<span class="game-badge">' + (game.badge || 'Game') + '</span>' +
        '<div class="game-fav ' + (isFav ? 'active' : '') + '" onclick="toggleFavorite(\'' + game.id + '\', event)" title="Toggle Favorite">' +
          (isFav ? '★' : '☆') +
        '</div>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
          '<polygon points="5 3 19 12 5 21 5 3"></polygon>' +
        '</svg>' +
      '</div>' +
      '<div class="game-info">' +
        '<div class="game-name">' + (game.title || 'Game') + '</div>' +
        '<div class="game-desc">' + (game.desc || 'Fast-paced unblocked HTML5 web game.') + '</div>' +
        '<div class="game-footer">' +
          '<span class="game-tag">' + (game.tag || game.category || 'Arcade') + '</span>' +
          '<span class="play-action">Launch ▶</span>' +
        '</div>' +
      '</div>';
    container.appendChild(card);
  });

  if (list.length > visibleGameLimit) {
    const moreBtn = document.createElement('div');
    moreBtn.style.gridColumn = '1/-1';
    moreBtn.style.textAlign = 'center';
    moreBtn.style.padding = '1.5rem 0';
    moreBtn.innerHTML = 
      '<button style="padding: 10px 24px; border-radius: 12px; background: #1e293b; border: 1px solid #334155; color: #fff; font-weight: bold; font-size: 0.85rem; cursor: pointer;" onclick="visibleGameLimit += 100; renderGames(getActiveList());">' +
        'Load More Games (' + (list.length - visibleGameLimit) + ' remaining)' +
      '</button>';
    container.appendChild(moreBtn);
  }
}

function filterCategory(cat, btn) {
  currentCategory = cat;
  visibleGameLimit = 60;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderGames(getActiveList());
}

function handleSearchInput(val) {
  currentSearchQuery = val.trim();
  visibleGameLimit = 60;
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    renderGames(getActiveList());
  }, 120);
}

// --- 4. MODAL GAME LAUNCHER & CONTROLS ---
let currentGameUrl = '';

function launchGame(game) {
  const modal = document.getElementById('player-modal');
  const title = document.getElementById('player-title');
  const iframe = document.getElementById('game-iframe');
  const nativeContainer = document.getElementById('native-canvas-container');

  if (!modal || !title || !iframe) return;

  title.textContent = 'Vault: ' + game.title;
  currentGameUrl = game.url;

  if (game.url && game.url.startsWith('native:')) {
    iframe.style.display = 'none';
    if (nativeContainer) nativeContainer.style.display = 'flex';
    if (game.url === 'native:snake') {
      initSnakeGame();
    } else if (game.url === 'native:2048') {
      init2048Game();
    }
  } else {
    if (nativeContainer) nativeContainer.style.display = 'none';
    iframe.style.display = 'block';
    iframe.src = game.url;
  }
  modal.classList.add('active');
}

function closePlayer() {
  const modal = document.getElementById('player-modal');
  const iframe = document.getElementById('game-iframe');
  if (iframe) iframe.src = 'about:blank';
  if (modal) modal.classList.remove('active');
  stopNativeGames();
}

function toggleFullscreen() {
  const iframe = document.getElementById('game-iframe');
  const canvas = document.getElementById('gameCanvas');
  const target = (iframe && iframe.style.display !== 'none') ? iframe : canvas;
  if (!target) return;

  if (!document.fullscreenElement) {
    target.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function openCurrentInBlank() {
  if (!currentGameUrl || currentGameUrl.startsWith('native:')) return;
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Please allow popups to open this game in stealth about:blank mode.');
    return;
  }
  const doc = win.document;
  doc.title = document.title || 'Google Docs';
  const iframe = doc.createElement('iframe');
  iframe.src = currentGameUrl;
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  doc.body.style.margin = '0';
  doc.body.appendChild(iframe);
}

function openAboutBlank() {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Please allow popups to launch stealth tab.');
    return;
  }
  const doc = win.document;
  doc.title = 'Google Docs';
  const link = doc.createElement('link');
  link.rel = 'icon';
  link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
  doc.head.appendChild(link);
  const iframe = doc.createElement('iframe');
  iframe.src = window.location.href;
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  doc.body.style.margin = '0';
  doc.body.appendChild(iframe);
}

// --- 5. TAB CLOAKING & EMERGENCY PANIC ---
function openCloakModal() {
  const modal = document.getElementById('cloak-modal');
  if (modal) modal.classList.add('active');
}

function closeCloakModal() {
  const modal = document.getElementById('cloak-modal');
  if (modal) modal.classList.remove('active');
}

function applyCloak(title, iconUrl) {
  document.title = title;
  let favicon = document.getElementById('tab-favicon');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.id = 'tab-favicon';
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = iconUrl;
  closeCloakModal();
}

function triggerPanic() {
  applyCloak('Classes - Google Classroom', 'https://ssl.gstatic.com/classroom/favicon.png');
  const panicEl = document.getElementById('panic-screen');
  if (panicEl) panicEl.style.display = 'block';
  const iframe = document.getElementById('game-iframe');
  if (iframe) iframe.src = 'about:blank';
}

function exitPanic() {
  const panicEl = document.getElementById('panic-screen');
  if (panicEl) panicEl.style.display = 'none';
}

window.addEventListener('keydown', (e) => {
  if (e.key === '~' || e.key === 'Escape') {
    triggerPanic();
  }
});

// --- 6. WEB SEARCH ENGINE ---
let currentEngine = 'ddg';

function setEngine(engine, btn) {
  currentEngine = engine;
  document.querySelectorAll('.engine-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function executeWebSearch() {
  const input = document.getElementById('search-box');
  if (!input) return;
  const q = input.value.trim();
  if (!q) return;

  if (q.startsWith('http://') || q.startsWith('https://')) {
    launchGame({ title: q, url: q, badge: 'Direct Web', tag: 'Web' });
    return;
  }

  // 1. If matching games exist in active list, launch top match immediately!
  const matching = getActiveList();
  if (matching.length > 0) {
    launchGame(matching[0]);
    return;
  }

  // 2. Otherwise launch safe embeddable search inside modal
  const engines = {
    ddg: 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q),
    google: 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q),
    bing: 'https://www.bing.com/search?q=' + encodeURIComponent(q),
    yt: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q),
    wiki: 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(q)
  };
  const searchUrl = engines[currentEngine] || engines.ddg;
  launchGame({
    title: 'Search: ' + q,
    url: searchUrl,
    badge: 'Web Search',
    tag: 'Proxy'
  });
}

// --- 7. TYPEWRITER ANIMATION (SECURE • CONTAIN • PROTECT) ---
const TYPEWRITER_PHRASE = 'SECURE • CONTAIN • PROTECT';
let twIdx = 0;
let twDeleting = false;

function runTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  if (!twDeleting) {
    el.textContent = TYPEWRITER_PHRASE.slice(0, twIdx + 1);
    twIdx++;
    if (twIdx === TYPEWRITER_PHRASE.length) {
      twDeleting = true;
      setTimeout(runTypewriter, 3500);
      return;
    }
  } else {
    el.textContent = TYPEWRITER_PHRASE.slice(0, twIdx - 1);
    twIdx--;
    if (twIdx === 0) {
      twDeleting = false;
      setTimeout(runTypewriter, 600);
      return;
    }
  }
  setTimeout(runTypewriter, twDeleting ? 35 : 95);
}

// --- 8. TERMINAL SYSTEM ---
function switchView(view) {
  const tabArcade = document.getElementById('tab-arcade');
  const tabTerm = document.getElementById('tab-terminal');
  const viewArcade = document.getElementById('arcade-view');
  const viewTerm = document.getElementById('terminal-view');

  if (tabArcade) tabArcade.classList.toggle('active', view === 'arcade');
  if (tabTerm) tabTerm.classList.toggle('active', view === 'terminal');
  if (viewArcade) viewArcade.style.display = view === 'arcade' ? 'block' : 'none';
  if (viewTerm) viewTerm.style.display = view === 'terminal' ? 'flex' : 'none';

  if (view === 'terminal') {
    const input = document.getElementById('term-input');
    if (input) input.focus();
  }
}

function handleTerminalCommand() {
  const input = document.getElementById('term-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const cmd = input.value.trim();
  if (!cmd) return;

  const userLine = document.createElement('div');
  userLine.innerHTML = '<span style="color:#f59e0b; font-weight:bold;">operator@scp:~$</span> ' + escapeHtml(cmd);
  output.appendChild(userLine);
  input.value = '';

  const lower = cmd.toLowerCase();
  let response = '';

  if (lower === 'help') {
    response = 'Available Commands:\n' +
      '  • help          : Displays this command manual\n' +
      '  • games         : Lists all available games in the vault\n' +
      '  • play [name]   : Directly launches a game (e.g. \'play slope\')\n' +
      '  • random        : Launches a random unblocked game from the vault\n' +
      '  • search [q]    : Executes web search via DuckDuckGo\n' +
      '  • cloak [type]  : Disguise tab (docs, classroom, drive, canvas, desmos, reset)\n' +
      '  • panic         : Instantly triggers emergency biology disguise\n' +
      '  • pop           : Clones window into about:blank stealth window\n' +
      '  • count         : Displays total verified games in database\n' +
      '  • clear         : Clears the terminal output screen\n' +
      '  • time          : Displays SCP Foundation containment sync time';
  } else if (lower === 'games') {
    response = GAMES.map(g => '• ' + g.title + ' [' + (g.category || 'Arcade') + ']').join('\n');
  } else if (lower === 'count') {
    response = 'Current Vault Registry: ' + GAMES.length + ' verified games active.';
  } else if (lower === 'random') {
    const randGame = GAMES[Math.floor(Math.random() * GAMES.length)];
    launchGame(randGame);
    response = 'Randomly launching [' + randGame.title + ']...';
  } else if (lower.startsWith('play ')) {
    const target = lower.replace('play ', '').trim();
    const found = GAMES.find(g => (g.title && g.title.toLowerCase().includes(target)) || (g.id && g.id.toLowerCase().includes(target)));
    if (found) {
      launchGame(found);
      response = 'Launching containment protocol [' + found.title + ']...';
    } else {
      response = "Game '" + target + "' not found. Type 'games' for full index.";
    }
  } else if (lower.startsWith('search ')) {
    const q = cmd.slice(7).trim();
    window.open('https://duckduckgo.com/?q=' + encodeURIComponent(q), '_blank');
    response = "Searching DuckDuckGo for '" + q + "'...";
  } else if (lower.startsWith('cloak ')) {
    const type = lower.replace('cloak ', '').trim();
    if (type === 'docs') applyCloak('Google Docs', 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico');
    else if (type === 'classroom') applyCloak('Classes - Google Classroom', 'https://ssl.gstatic.com/classroom/favicon.png');
    else if (type === 'drive') applyCloak('My Drive - Google Drive', 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png');
    else if (type === 'canvas') applyCloak('Dashboard - Canvas LMS', 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico');
    else if (type === 'desmos') applyCloak('Desmos | Graphing Calculator', 'https://www.desmos.com/favicon.ico');
    else if (type === 'reset') applyCloak('SCPHub | Secure Contain Play', 'data:image/svg+xml,...');
    response = "Cloak profile applied for '" + type + "'.";
  } else if (lower === 'panic') {
    triggerPanic();
    response = 'Emergency Panic protocol activated.';
  } else if (lower === 'pop') {
    openAboutBlank();
    response = 'Stealth pop window spawned in about:blank.';
  } else if (lower === 'clear' || lower === 'cls') {
    output.innerHTML = '';
    return;
  } else if (lower === 'time') {
    response = 'Current Containment Universal Time: ' + new Date().toUTCString();
  } else {
    response = "Unknown command '" + cmd + "'. Type 'help' for manual.";
  }

  const resLine = document.createElement('div');
  resLine.style.whiteSpace = 'pre-wrap';
  resLine.style.color = '#38bdf8';
  resLine.textContent = response;
  output.appendChild(resLine);
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

// --- 9. NATIVE OFFLINE ENGINES (SNAKE & 2048) ---
let nativeInterval = null;

function stopNativeGames() {
  if (nativeInterval) clearInterval(nativeInterval);
  window.onkeydown = null;
  window.addEventListener('keydown', (e) => {
    if (e.key === '~' || e.key === 'Escape') triggerPanic();
  });
}

function initSnakeGame() {
  stopNativeGames();
  const instr = document.getElementById('native-instructions');
  if (instr) instr.textContent = 'Arrow Keys or WASD: Navigate snake. Collect glowing red cyber-orbs!';
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 400;

  let snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
  let dx = 20, dy = 0;
  let score = 0;
  let highScore = localStorage.getItem('scp_snake_high') || 0;
  let food = { x: 240, y: 240 };

  const scoreEl = document.getElementById('native-score');
  const highEl = document.getElementById('native-high');
  if (scoreEl) scoreEl.textContent = score;
  if (highEl) highEl.textContent = highScore;

  function spawnFood() {
    food.x = Math.floor(Math.random() * 20) * 20;
    food.y = Math.floor(Math.random() * 20) * 20;
  }

  window.onkeydown = (e) => {
    if (['ArrowUp', 'KeyW'].includes(e.code) && dy === 0) { dx = 0; dy = -20; }
    if (['ArrowDown', 'KeyS'].includes(e.code) && dy === 0) { dx = 0; dy = 20; }
    if (['ArrowLeft', 'KeyA'].includes(e.code) && dx === 0) { dx = -20; dy = 0; }
    if (['ArrowRight', 'KeyD'].includes(e.code) && dx === 0) { dx = 20; dy = 0; }
    if (e.key === '~' || e.key === 'Escape') triggerPanic();
  };

  nativeInterval = setInterval(() => {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
      initSnakeGame();
      return;
    }
    for (let s of snake) {
      if (head.x === s.x && head.y === s.y) {
        initSnakeGame();
        return;
      }
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      if (scoreEl) scoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('scp_snake_high', highScore);
        if (highEl) highEl.textContent = highScore;
      }
      spawnFood();
    } else {
      snake.pop();
    }

    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, 0, 400, 400);

    // Food
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 8;
    ctx.fillRect(food.x, food.y, 18, 18);

    // Snake Body
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#38bdf8' : '#0284c7';
      ctx.fillRect(seg.x, seg.y, 18, 18);
    });
    ctx.shadowBlur = 0;
  }, 100);
}

function init2048Game() {
  stopNativeGames();
  const instr = document.getElementById('native-instructions');
  if (instr) instr.textContent = 'Arrow Keys or WASD: Slide tiles. Merge matching numbers to reach 2048!';
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 400;

  let grid = Array(4).fill(0).map(() => Array(4).fill(0));
  let score = 0;
  let highScore = localStorage.getItem('scp_2048_high') || 0;

  const scoreEl = document.getElementById('native-score');
  const highEl = document.getElementById('native-high');
  if (scoreEl) scoreEl.textContent = score;
  if (highEl) highEl.textContent = highScore;

  function addTile() {
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function draw2048() {
    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, 0, 400, 400);

    const colors = {
      2: '#1e293b', 4: '#334155', 8: '#0284c7', 16: '#0ea5e9',
      32: '#38bdf8', 64: '#f59e0b', 128: '#d97706', 256: '#b45309',
      512: '#10b981', 1024: '#059669', 2048: '#f43f5e'
    };

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = grid[r][c];
        const x = 15 + c * 95;
        const y = 15 + r * 95;
        ctx.fillStyle = colors[val] || (val > 2048 ? '#ec4899' : '#142036');
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, 80, 80, 8);
        } else {
          ctx.rect(x, y, 80, 80);
        }
        ctx.fill();

        if (val > 0) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, x + 40, y + 42);
        }
      }
    }
  }

  function slide(row) {
    let arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  function move(dir) {
    let changed = false;
    if (dir === 'left') {
      for (let r = 0; r < 4; r++) {
        const n = slide(grid[r]);
        if (n.join() !== grid[r].join()) changed = true;
        grid[r] = n;
      }
    } else if (dir === 'right') {
      for (let r = 0; r < 4; r++) {
        const n = slide(grid[r].slice().reverse()).reverse();
        if (n.join() !== grid[r].join()) changed = true;
        grid[r] = n;
      }
    } else if (dir === 'up') {
      for (let c = 0; c < 4; c++) {
        let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        let n = slide(col);
        for (let r = 0; r < 4; r++) {
          if (grid[r][c] !== n[r]) changed = true;
          grid[r][c] = n[r];
        }
      }
    } else if (dir === 'down') {
      for (let c = 0; c < 4; c++) {
        let col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
        let n = slide(col);
        for (let r = 0; r < 4; r++) {
          if (grid[3 - r][c] !== n[r]) changed = true;
          grid[3 - r][c] = n[r];
        }
      }
    }

    if (changed) {
      addTile();
      if (scoreEl) scoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('scp_2048_high', highScore);
        if (highEl) highEl.textContent = highScore;
      }
      draw2048();
    }
  }

  addTile();
  addTile();
  draw2048();

  window.onkeydown = (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) move('left');
    if (['ArrowRight', 'KeyD'].includes(e.code)) move('right');
    if (['ArrowUp', 'KeyW'].includes(e.code)) move('up');
    if (['ArrowDown', 'KeyS'].includes(e.code)) move('down');
    if (e.key === '~' || e.key === 'Escape') triggerPanic();
  };
}

// --- 10. LOCAL AUTHENTICATION ENGINE ---
const AUTH_USERS_KEY = 'scphub_users_db_v1';
const AUTH_SESSION_KEY = 'scphub_active_session_v1';

function getSavedUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch (e) {}
}

function getActiveUser() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const users = getSavedUsers();
    const found = users.find(u => u.username && parsed.username && u.username.toLowerCase() === parsed.username.toLowerCase());
    return found || parsed;
  } catch (e) {
    return null;
  }
}

function setActiveUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  } catch (e) {}
  updateAuthUI();
}

function updateAuthUI() {
  const user = getActiveUser();
  const btnLabel = document.getElementById('mimo-auth-btn-label') || document.getElementById('auth-btn-label');
  const btn = document.getElementById('mimo-auth-btn') || document.getElementById('auth-btn');
  if (!btnLabel && !btn) return;

  if (user) {
    if (btnLabel) btnLabel.textContent = user.username + ' (' + (user.clearanceBadge || 'Lvl 2') + ')';
    if (btn) {
      btn.style.borderColor = 'var(--cyan)';
      btn.style.color = 'var(--cyan)';
    }
  } else {
    if (btnLabel) btnLabel.textContent = 'Sign In';
    if (btn) {
      btn.style.borderColor = '';
      btn.style.color = '';
    }
  }
}

function handleMimoAuthClick() {
  const user = getActiveUser();
  if (user) {
    openProfileModal();
  } else {
    openAuthModal();
  }
}

function openAuthModal() {
  closeProfileModal();
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('active');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
}

function openProfileModal() {
  closeAuthModal();
  const user = getActiveUser();
  if (!user) {
    openAuthModal();
    return;
  }
  const codenameEl = document.getElementById('profile-codename');
  const clearanceEl = document.getElementById('profile-clearance');
  const gamesCountEl = document.getElementById('profile-games-count');
  const highScoreEl = document.getElementById('profile-high-score');

  if (codenameEl) codenameEl.textContent = 'AGENT ' + user.username.toUpperCase();
  if (clearanceEl) clearanceEl.textContent = 'Clearance: ' + (user.clearanceBadge || 'Level 2: Field Operative');
  if (gamesCountEl) gamesCountEl.textContent = user.gamesPlayed || 0;
  if (highScoreEl) {
    highScoreEl.textContent = localStorage.getItem('scp_2048_high') || '0';
  }

  const modal = document.getElementById('profile-modal');
  if (modal) modal.classList.add('active');
}

function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (modal) modal.classList.remove('active');
}

function switchAuthTab(tab) {
  const tabSignIn = document.getElementById('mimo-tab-signin');
  const tabRegister = document.getElementById('mimo-tab-register');
  const formSignIn = document.getElementById('mimo-form-signin');
  const formRegister = document.getElementById('mimo-form-register');

  if (tab === 'signin') {
    if (tabSignIn) tabSignIn.classList.add('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (formSignIn) formSignIn.style.display = 'block';
    if (formRegister) formRegister.style.display = 'none';
  } else {
    if (tabSignIn) tabSignIn.classList.remove('active');
    if (tabRegister) tabRegister.classList.add('active');
    if (formSignIn) formSignIn.style.display = 'none';
    if (formRegister) formRegister.style.display = 'block';
  }
}

function submitMimoSignIn() {
  const userIn = document.getElementById('mimo-signin-user');
  const passIn = document.getElementById('mimo-signin-pass');
  const remember = document.getElementById('mimo-signin-remember') ? document.getElementById('mimo-signin-remember').checked : true;

  const username = (userIn?.value || '').trim();
  const password = (passIn?.value || '').trim();

  if (!username || !password) {
    alert('Please enter both codename and passcode.');
    return;
  }

  const users = getSavedUsers();
  const found = users.find(u => u.username && u.username.toLowerCase() === username.toLowerCase());
  if (!found) {
    alert('Agent not found. Switch to Create Account to register!');
    return;
  }

  if (found.password !== password) {
    alert('Access Denied: Incorrect passcode.');
    return;
  }

  found.lastLogin = new Date().toISOString();
  saveUsers(users);

  if (remember) {
    setActiveUser(found);
  }
  closeAuthModal();
}

function submitMimoRegister() {
  const userIn = document.getElementById('mimo-reg-user');
  const passIn = document.getElementById('mimo-reg-pass');
  const levelIn = document.getElementById('mimo-reg-level');
  const remember = document.getElementById('mimo-reg-remember') ? document.getElementById('mimo-reg-remember').checked : true;

  const username = (userIn?.value || '').trim();
  const password = (passIn?.value || '').trim();
  const level = levelIn?.value || '2';

  if (!username || username.length < 2) {
    alert('Codename must be at least 2 characters.');
    return;
  }
  if (!password || password.length < 3) {
    alert('Passcode must be at least 3 characters or PIN digits.');
    return;
  }

  const users = getSavedUsers();
  if (users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase())) {
    alert('Agent codename already registered! Use Sign In or pick another.');
    return;
  }

  const names = {
    '1': 'Level 1: Cadet',
    '2': 'Level 2: Field Operative',
    '3': 'Level 3: MTF Specialist',
    '4': 'Level 4: Site Director',
    '5': 'Level 5: O5 Council'
  };

  const newUser = {
    id: 'agent_' + Date.now(),
    username,
    password,
    clearanceLevel: level,
    clearanceBadge: names[level] || 'Level 2',
    gamesPlayed: 0,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  if (remember) {
    setActiveUser(newUser);
  }
  closeAuthModal();
}

function submitMimoSignOut() {
  setActiveUser(null);
  closeProfileModal();
}

function switchMimoAccount() {
  closeProfileModal();
  openAuthModal();
}

// --- 11. INITIALIZATION BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
  renderGames(GAMES);
  runTypewriter();
  loadFullGamesDatabase();
  updateAuthUI();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderGames(GAMES);
  runTypewriter();
  loadFullGamesDatabase();
  updateAuthUI();
}
