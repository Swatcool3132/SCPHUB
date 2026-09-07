import fs from 'fs';

const games = [
  {
    id: "slope",
    title: "Slope",
    category: "Arcade",
    description: "The ultimate 3D neon downhill speed test! Roll your sphere down an endless, procedurally generated neon course suspended in virtual space. Dodge red obstacles, navigate vertical loops, and survive as the speed ramps up exponentially.",
    iframeUrl: "https://db.duckmath.org/html/slope/index.html",
    tags: ["3D", "Arcade", "Endless", "Neon", "Speed", "Reflex"],
    color: "from-emerald-500 via-teal-600 to-cyan-900",
    badge: "Top School Classic",
    rating: 5.0,
    icon: "Zap",
    tip: "Keep small, precise adjustments rather than holding down the arrow keys to avoid oversteering off the edge!",
    stats: [
      { label: "Speed", val: "Exponential" },
      { label: "Perspective", val: "3D Follow" },
      { label: "Framerate", val: "60 FPS" }
    ],
    highlightPills: ["Neon Cyber Grid", "Endless Velocity", "Global High Scores"],
    controls: [
      { key: "A / Left Arrow", action: "Steer Left" },
      { key: "D / Right Arrow", action: "Steer Right" },
      { key: "P / Esc", action: "Pause Game" }
    ]
  },
  {
    id: "retro-bowl",
    title: "Retro Bowl",
    category: "Sports",
    description: "The undisputed king of 8-bit football games! Manage your roster, draft future Hall of Famers, maintain locker room morale, call dynamic passing plays, and lead your franchise to gridiron glory in the championship game.",
    iframeUrl: "https://db.duckmath.org/html/retro_bowl/index.html",
    tags: ["Sports", "Football", "Retro", "Management", "8-Bit", "Strategy"],
    color: "from-amber-600 via-orange-700 to-yellow-900",
    badge: "Gridiron Legend",
    rating: 5.0,
    icon: "Trophy",
    tip: "Upgrade your rehab and training facilities early to keep your star players healthy and improve recovery speeds.",
    stats: [
      { label: "Franchise", val: "Full Season" },
      { label: "Art Style", val: "Retro Pixel" },
      { label: "Framerate", val: "60 FPS" }
    ],
    highlightPills: ["Franchise Mode", "Roster Management", "Precision Passing"],
    controls: [
      { key: "Mouse Drag & Release", action: "Aim & Throw Pass" },
      { key: "W / S or Up / Down", action: "Juke / Evade Tacklers" },
      { key: "Spacebar / Tap", action: "Dive for Extra Yardage" }
    ]
  },
  {
    id: "1v1-lol",
    title: "1v1.LOL",
    category: "Action",
    description: "Fast-paced competitive 3D building and shooting simulator! Practice your edit speed, ramp rushes, wall replaces, and shotgun flick aim in intense 1v1 duels, box fights, and battle royale arenas directly in your browser.",
    iframeUrl: "https://db.duckmath.org/html/1v1lol/index.html",
    tags: ["Action", "Shooter", "Building", "Competitive", "3D", "Multiplayer"],
    color: "from-blue-600 via-indigo-700 to-purple-900",
    badge: "Building Shooter",
    rating: 4.9,
    icon: "Crosshair",
    tip: "Always claim high ground before reloading, and practice the wall-ramp combo to block incoming sniper shots.",
    stats: [
      { label: "Game Modes", val: "1v1, Box, BR" },
      { label: "Tick Rate", val: "Smooth 60" },
      { label: "Weapon Arsenal", val: "Shotgun, AR, Sniper" }
    ],
    highlightPills: ["Instant Building", "Box Fight Practice", "Unblocked Matchmaking"],
    controls: [
      { key: "WASD", action: "Movement" },
      { key: "Left Click", action: "Shoot / Place Build" },
      { key: "Right Click", action: "Aim Down Sights" },
      { key: "Z, X, C, V", action: "Wall, Floor, Stairs, Roof" },
      { key: "F / G", action: "Edit Structure" }
    ]
  },
  {
    id: "minecraft",
    title: "Minecraft (Eaglercraft)",
    category: "RPG",
    description: "Full Minecraft running seamlessly in your browser with WebAssembly! Mine resources, craft tools, build monumental fortresses, survive against creepers and skeletons, or jump into creative mode with limitless blocks.",
    iframeUrl: "https://db.duckmath.org/html/minecraft/index.html",
    tags: ["Sandbox", "Survival", "Crafting", "3D", "Multiplayer", "Open World"],
    color: "from-emerald-600 via-green-700 to-stone-900",
    badge: "Full Web Edition",
    rating: 5.0,
    icon: "Pickaxe",
    tip: "Dig down with stairs instead of straight down to avoid lava pits, and keep torches placed along your right wall in mines.",
    stats: [
      { label: "World Size", val: "Infinite" },
      { label: "Modes", val: "Survival & Creative" },
      { label: "Framerate", val: "60 FPS" }
    ],
    highlightPills: ["Infinite Worlds", "Survival & Creative", "Multiplayer Servers"],
    controls: [
      { key: "WASD", action: "Walk & Strafe" },
      { key: "Spacebar", action: "Jump" },
      { key: "Left Click", action: "Mine / Attack" },
      { key: "Right Click", action: "Place Block / Use Item" },
      { key: "E", action: "Open Inventory" },
      { key: "1 - 9", action: "Hotbar Slot Selection" }
    ]
  },
  {
    id: "cookie-clicker",
    title: "Cookie Clicker",
    category: "Idle",
    description: "The timeless incremental clicker masterpiece! Bake cookies by the trillions, hire grandmas, construct automated cookie factories, mine cosmic antimatter condensers, and unlock hundreds of bizarre celestial upgrades.",
    iframeUrl: "https://db.duckmath.org/html/cookie_clicker/index.html",
    tags: ["Idle", "Clicker", "Incremental", "Addictive", "Casual", "Strategy"],
    color: "from-amber-500 via-yellow-600 to-stone-900",
    badge: "Infinite Clicker",
    rating: 4.9,
    icon: "Sparkles",
    tip: "Click golden cookies the second they spawn on screen for massive production multipliers and frenzy bonuses!",
    stats: [
      { label: "Cookie Count", val: "Septillions+" },
      { label: "Upgrades", val: "600+" },
      { label: "Achievements", val: "500+" }
    ],
    highlightPills: ["Ascension Prestige", "Golden Cookie Frenzies", "Grandma Apocalypse"],
    controls: [
      { key: "Left Click", action: "Bake Cookie / Purchase Upgrades" },
      { key: "Ctrl + Click", action: "Bulk Buy x10 Buildings" },
      { key: "Shift + Click", action: "Bulk Buy x100 Buildings" }
    ]
  },
  {
    id: "bitlife",
    title: "BitLife",
    category: "Puzzle",
    description: "Text-based life simulation sandbox where every choice shapes your destiny! Will you graduate from medical school, become an international pop star, inherit billions, start a family, or pursue a daring criminal empire?",
    iframeUrl: "https://db.duckmath.org/html/bitlife/index.html",
    tags: ["Simulation", "RPG", "Choice-Driven", "Humor", "Story", "Casual"],
    color: "from-rose-500 via-pink-600 to-red-900",
    badge: "Life Simulator",
    rating: 4.8,
    icon: "Heart",
    tip: "Study hard and visit the library every year during your childhood to maximize your Smarts stat for top-tier careers!",
    stats: [
      { label: "Lifespans", val: "Unlimited" },
      { label: "Careers", val: "100+ Roles" },
      { label: "Choices", val: "Thousands" }
    ],
    highlightPills: ["Dynamic Career Trees", "Generational Inheritance", "Random Encounters"],
    controls: [
      { key: "Left Click / Tap", action: "Make Life Decisions & Age Up" }
    ]
  },
  {
    id: "moto-x3m",
    title: "Moto X3M",
    category: "Arcade",
    description: "The gold standard of stunt bike trials! Race your dirt bike across 25+ perilous levels filled with massive loop-de-loops, spinning buzzsaws, exploding dynamite barrels, and vertical death drops while landing front flips for time bonuses.",
    iframeUrl: "https://db.duckmath.org/html/motox3m/index.html",
    tags: ["Sports", "Racing", "Bike", "Stunt", "Physics", "Trial"],
    color: "from-yellow-500 via-amber-600 to-orange-800",
    badge: "Stunt Bike Trials",
    rating: 4.9,
    icon: "Flame",
    tip: "Perform backflips and frontflips on every big jump to shave 0.5 seconds off your total stage timer!",
    stats: [
      { label: "Levels", val: "25+ Stages" },
      { label: "Physics", val: "Ragdoll Bike" },
      { label: "Star Ratings", val: "3 Stars Per Level" }
    ],
    highlightPills: ["Loop-de-Loops", "Airborne Flips", "Time-Attack Medals"],
    controls: [
      { key: "W / Up Arrow", action: "Accelerate Throttle" },
      { key: "S / Down Arrow", action: "Brake & Reverse" },
      { key: "A / Left Arrow", action: "Lean Back (Wheelie)" },
      { key: "D / Right Arrow", action: "Lean Forward" }
    ]
  },
  {
    id: "run-3",
    title: "Run 3",
    category: "Arcade",
    description: "Explore the vast galaxy in an endless rotating architectural tunnel! Hop from wall to ceiling, navigate around hazardous collapsing platforms, unlock diverse alien runners with unique gravitational skills, and conquer the cosmos.",
    iframeUrl: "https://db.duckmath.org/html/run3/index.html",
    tags: ["Arcade", "Platformer", "Gravity", "Runner", "Space", "Classic"],
    color: "from-cyan-500 via-blue-600 to-slate-900",
    badge: "Zero-G Runner",
    rating: 4.9,
    icon: "Compass",
    tip: "Running against the side walls rotates the entire tunnel. Use this to turn difficult gaps into solid walkways!",
    stats: [
      { label: "Characters", val: "10+ Aliens" },
      { label: "Modes", val: "Explore & Infinite" },
      { label: "Physics", val: "Dynamic Tunnel Rotation" }
    ],
    highlightPills: ["Rotational Gravity", "Unlockable Aliens", "Massive Galaxy Map"],
    controls: [
      { key: "Left / Right Arrow (A / D)", action: "Steer & Rotate Tunnel" },
      { key: "Space / Up Arrow (W)", action: "Jump Over Chasms" }
    ]
  },
  {
    id: "basket-random",
    title: "Basket Random",
    category: "Sports",
    description: "Two-player ragdoll basketball madness! Hilarious one-button physics where your hoopers bounce, kick, flip, and slam dunk across ever-changing courts, bobble-head outfits, bouncy balls, and slippery icy floors.",
    iframeUrl: "https://db.duckmath.org/html/basket_random/index.html",
    tags: ["Sports", "Basketball", "Physics", "Ragdoll", "2-Player", "Funny"],
    color: "from-orange-500 via-amber-600 to-red-800",
    badge: "Ragdoll Hoops",
    rating: 4.8,
    icon: "Trophy",
    tip: "Time your jump just as the opponent leaps to block their shot and redirect the ball into their own hoop!",
    stats: [
      { label: "Players", val: "1P vs CPU or 2P Local" },
      { label: "First To", val: "5 Points Wins" },
      { label: "Courts", val: "Randomized Themes" }
    ],
    highlightPills: ["One-Key Controls", "Chaotic Ragdolls", "2-Player Co-op"],
    controls: [
      { key: "W (Player 1)", action: "Jump & Swing Arms" },
      { key: "Up Arrow (Player 2)", action: "Jump & Swing Arms" }
    ]
  },
  {
    id: "soccer-random",
    title: "Soccer Random",
    category: "Sports",
    description: "Hilarious ragdoll soccer showdown! Score 5 goals before your rival on snowy pitches, sandy beaches, bouncing volleyball fields, and windy stadiums with bouncy balls and unpredictable physics.",
    iframeUrl: "https://db.duckmath.org/html/soccer_random/index.html",
    tags: ["Sports", "Soccer", "Physics", "Ragdoll", "2-Player", "Arcade"],
    color: "from-lime-500 via-green-600 to-emerald-900",
    badge: "Chaotic Football",
    rating: 4.8,
    icon: "Trophy",
    tip: "Keep one player back to defend the goal line while the striker bounces forward for airborne headers.",
    stats: [
      { label: "Players", val: "1 or 2 Players" },
      { label: "Rounds", val: "First to 5" },
      { label: "Physics", val: "Ragdoll Kick" }
    ],
    highlightPills: ["Bouncing Pitches", "Ragdoll Headers", "Local 2-Player"],
    controls: [
      { key: "W (Player 1)", action: "Jump & Kick" },
      { key: "Up Arrow (Player 2)", action: "Jump & Kick" }
    ]
  },
  {
    id: "volley-random",
    title: "Volley Random",
    category: "Sports",
    description: "Wild ragdoll volleyball where anything can happen! Spike over the net, dive across unpredictable courts, and adapt to heavy iron balls, bouncy balloons, and shifting gravity fields.",
    iframeUrl: "https://db.duckmath.org/html/volley_random/index.html",
    tags: ["Sports", "Volleyball", "Physics", "Ragdoll", "2-Player", "Casual"],
    color: "from-teal-500 via-cyan-600 to-blue-900",
    badge: "Ragdoll Spikes",
    rating: 4.8,
    icon: "Trophy",
    tip: "Time your block jump at the net right when the ball reaches its highest apex for a devastating spike return.",
    stats: [
      { label: "Match Length", val: "First to 5" },
      { label: "Courts", val: "Beach, Gym, Snow" },
      { label: "Ball Types", val: "Classic, Iron, Balloon" }
    ],
    highlightPills: ["One-Button Spikes", "Dynamic Weather", "Local Duel"],
    controls: [
      { key: "W (Player 1)", action: "Jump & Spike" },
      { key: "Up Arrow (Player 2)", action: "Jump & Spike" }
    ]
  },
  {
    id: "boxing-random",
    title: "Boxing Random",
    category: "Sports",
    description: "Step into the squared circle for unpredictable ragdoll boxing! Throw haymakers, dodge headbutts, take advantage of long-arm powerups, and KO your opponent in 5 wild rounds.",
    iframeUrl: "https://db.duckmath.org/html/boxing_random/index.html",
    tags: ["Sports", "Fighting", "Boxing", "Ragdoll", "2-Player", "Action"],
    color: "from-red-600 via-rose-700 to-amber-900",
    badge: "Knockout Brawl",
    rating: 4.8,
    icon: "Zap",
    tip: "Jump forward while punching to land a flying haymaker that instantly knocks the opponent off balance.",
    stats: [
      { label: "Format", val: "5 Round KO" },
      { label: "Rings", val: "Rooftop, Alley, Arena" },
      { label: "Powerups", val: "Rocket Arms, Heavy Gloves" }
    ],
    highlightPills: ["Flying Haymakers", "Ragdoll KOs", "Local 2-Player"],
    controls: [
      { key: "W (Player 1)", action: "Jump & Punch" },
      { key: "Up Arrow (Player 2)", action: "Jump & Punch" }
    ]
  },
  {
    id: "fnaf-1",
    title: "Five Nights at Freddy's (FNAF 1)",
    category: "Horror",
    description: "Welcome to Freddy Fazbear's Pizza! Survive your night shift as the night security guard from 12 AM to 6 AM. Monitor surveillance cameras, conserve limited generator power, and shut security doors before animatronics strike.",
    iframeUrl: "https://db.duckmath.org/html/fnaf/index.html",
    tags: ["Horror", "Survival", "Atmospheric", "Strategy", "Classic", "Mystery"],
    color: "from-stone-700 via-red-900 to-black",
    badge: "Survival Horror",
    rating: 5.0,
    icon: "Ghost",
    tip: "Do not leave door lights on continuously! Tap them briefly to check blind spots and save your battery power.",
    stats: [
      { label: "Shifts", val: "5 Nights + Custom" },
      { label: "Animatronics", val: "Freddy, Bonnie, Chica, Foxy" },
      { label: "Power System", val: "Limited Battery" }
    ],
    highlightPills: ["Security Cam Feeds", "Battery Management", "Jumpscare Thrills"],
    controls: [
      { key: "Mouse Move", action: "Look Around Office" },
      { key: "Hover Bottom Bar", action: "Toggle Camera Monitor" },
      { key: "Click Door / Light Buttons", action: "Close Doors / Flash Lights" }
    ]
  },
  {
    id: "fnaf-2",
    title: "Five Nights at Freddy's 2",
    category: "Horror",
    description: "No doors to protect you! In the grand reopening of Freddy Fazbear's Pizza, survive against both withered and new Toy animatronics using your Freddy Fazbear head disguise and winding the music box.",
    iframeUrl: "https://db.duckmath.org/html/fnaf2/index.html",
    tags: ["Horror", "Survival", "Thriller", "Strategy", "Sequel"],
    color: "from-slate-800 via-purple-950 to-black",
    badge: "Terror Sequel",
    rating: 4.9,
    icon: "Ghost",
    tip: "Keep the music box wound on Cam 11 at all costs to stop the Marionette (Puppet) from escaping!",
    stats: [
      { label: "Cast", val: "11 Animatronics" },
      { label: "Defense", val: "Mask & Flashlight" },
      { label: "Vents", val: "Blind Spot Checks" }
    ],
    highlightPills: ["Freddy Mask Disguise", "Wind-Up Music Box", "Toy Animatronics"],
    controls: [
      { key: "Hover Red Bar", action: "Wear Freddy Mask" },
      { key: "Hover White Bar", action: "Open Camera Monitor" },
      { key: "Ctrl / Click", action: "Flashlight" }
    ]
  },
  {
    id: "fnaf-3",
    title: "Five Nights at Freddy's 3",
    category: "Horror",
    description: "Thirty years after Freddy's closed, Fazbear's Fright: The Horror Attraction opens. Survive against Springtrap by rebooting audio, camera, and ventilation systems before hallucinations overwhelm you.",
    iframeUrl: "https://db.duckmath.org/html/fnaf3/index.html",
    tags: ["Horror", "Atmospheric", "Sci-Fi", "Strategy", "Lore"],
    color: "from-lime-950 via-stone-900 to-black",
    badge: "Springtrap Horror",
    rating: 4.8,
    icon: "Ghost",
    tip: "Use audio lures in adjacent rooms to lure Springtrap away from your security office, and seal vents early!",
    stats: [
      { label: "Antagonist", val: "Springtrap" },
      { label: "Systems", val: "Cam, Audio, Vent" },
      { label: "Endings", val: "Good & Bad Endings" }
    ],
    highlightPills: ["Audio Lure Routing", "Ventilation Seals", "Phantom Jumpscares"],
    controls: [
      { key: "Mouse Click", action: "Play Audio / Toggle Systems" },
      { key: "Left Panel", action: "Maintenance Reboot Screen" }
    ]
  },
  {
    id: "drive-mad",
    title: "Drive Mad",
    category: "Driving",
    description: "The viral physics-based monster truck trial! Navigate 100+ inventive obstacle tracks with giant wheels, expanding chassis, swinging pendulums, collapsing bridges, and bouncy terrain without flipping over.",
    iframeUrl: "https://db.duckmath.org/html/drive_mad/index.html",
    tags: ["Driving", "Physics", "Puzzle", "Trial", "Obstacle", "Fun"],
    color: "from-yellow-500 via-orange-600 to-stone-900",
    badge: "Physics Truck Trial",
    rating: 4.9,
    icon: "Car",
    tip: "Do not hold full throttle on uneven bridges! Feather the gas to prevent your front wheels from pitching backward.",
    stats: [
      { label: "Levels", val: "100+ Stages" },
      { label: "Physics", val: "Chassis Suspension" },
      { label: "Vehicles", val: "Transforming Trucks" }
    ],
    highlightPills: ["Dynamic Chassis", "Inventive Traps", "Precision Throttle"],
    controls: [
      { key: "W / Up Arrow / D", action: "Accelerate Forward" },
      { key: "S / Down Arrow / A", action: "Brake & Reverse" },
      { key: "R / Space", action: "Quick Restart Level" }
    ]
  },
  {
    id: "polytrack",
    title: "PolyTrack",
    category: "Driving",
    description: "High-octane low-poly time-trial racing inspired by TrackMania! Race customizable open-wheel racers across crazy loops, wall-rides, and air ramps, or build and share your own custom tracks.",
    iframeUrl: "https://db.duckmath.org/html/polytrack/index.html",
    tags: ["Driving", "Racing", "Low-Poly", "Track Builder", "Time-Trial", "3D"],
    color: "from-cyan-500 via-blue-600 to-indigo-900",
    badge: "TrackMania Style",
    rating: 5.0,
    icon: "Car",
    tip: "Maintain a clean line on banking curves and avoid unnecessary steering inputs to preserve maximum top speed.",
    stats: [
      { label: "Engine", val: "Custom WebGL" },
      { label: "Editor", val: "Built-In Track Builder" },
      { label: "Ghost Cars", val: "Personal Best Replay" }
    ],
    highlightPills: ["Low-Poly Aesthetics", "High-G Wallrides", "Custom Track Editor"],
    controls: [
      { key: "WASD / Arrow Keys", action: "Drive & Steer" },
      { key: "R", action: "Instant Restart / Reset Run" },
      { key: "Shift", action: "Handbrake Drift" }
    ]
  },
  {
    id: "cluster-rush",
    title: "Cluster Rush",
    category: "Action",
    description: "Adrenaline-fueled first-person parkour! Sprint, jump, and climb across a chaotic highway convoy of runaway semi trucks that swerve, crash, slide, and collide at highway speeds.",
    iframeUrl: "https://db.duckmath.org/html/cluster_rush/index.html",
    tags: ["Action", "Parkour", "3D", "First-Person", "Physics", "Speed"],
    color: "from-red-500 via-orange-600 to-amber-900",
    badge: "First-Person Parkour",
    rating: 4.9,
    icon: "Zap",
    tip: "You can slide down the sides of trucks and wall-climb onto the roofs. Don't touch the asphalt road!",
    stats: [
      { label: "Stages", val: "35 Escalating Levels" },
      { label: "Camera", val: "First-Person 3D" },
      { label: "Speed", val: "Mach Velocity" }
    ],
    highlightPills: ["Highway Convoy", "Wall-Climbing Mechanics", "Adrenaline Jumps"],
    controls: [
      { key: "A / D or Left / Right", action: "Steer Movement" },
      { key: "Spacebar (Hold)", action: "Jump & Wall Climb" },
      { key: "J (Hold)", action: "Climb Truck Side" }
    ]
  },
  {
    id: "stickman-hook",
    title: "Stickman Hook",
    category: "Arcade",
    description: "Swing like Spider-Man through colorful, bouncy obstacle courses! Hook onto grappling pegs, build elastic kinetic momentum, bounce off bumpers, and fly across the finish line in style.",
    iframeUrl: "https://db.duckmath.org/html/stickman_hook/index.html",
    tags: ["Arcade", "Physics", "Stickman", "Grapple", "Casual", "Addictive"],
    color: "from-pink-500 via-rose-600 to-purple-900",
    badge: "Grapple Swing",
    rating: 4.8,
    icon: "Sparkles",
    tip: "Release your grapple right as you reach the bottom-front apex of your swing arc to launch forward at maximum velocity.",
    stats: [
      { label: "Levels", val: "100+ Courses" },
      { label: "Skins", val: "20+ Stick Characters" },
      { label: "Mechanics", val: "Elastic Grapple" }
    ],
    highlightPills: ["Kinetic Momentum", "Springboard Bouncers", "Unlockable Skins"],
    controls: [
      { key: "Left Click / Space (Hold)", action: "Attach Grapple Hook" },
      { key: "Release", action: "Launch Forward" }
    ]
  },
  {
    id: "duck-life",
    title: "Duck Life",
    category: "RPG",
    description: "Train your humble duckling into the world's fastest racing champion! Grind running, swimming, flying, and energy mini-games to boost your duck's stats and win the prestigious championship cup.",
    iframeUrl: "https://db.duckmath.org/html/duck_life/index.html",
    tags: ["RPG", "Training", "Casual", "Classic", "Sports", "Animals"],
    color: "from-yellow-400 via-amber-500 to-orange-800",
    badge: "Classic Training RPG",
    rating: 4.9,
    icon: "Trophy",
    tip: "Feed your duck plenty of super seeds in the shop before major races to keep energy levels topped up!",
    stats: [
      { label: "Stats", val: "Running, Flying, Swimming, Energy" },
      { label: "Customization", val: "Hats, Colors, Accessories" },
      { label: "Leagues", val: "Amateur to World Champion" }
    ],
    highlightPills: ["Stat Grinding Mini-Games", "Duck Customization", "Championship Races"],
    controls: [
      { key: "Arrow Keys / WASD", action: "Dodge Obstacles & Jump" },
      { key: "Mouse", action: "Feed Seeds & Select Menu" }
    ]
  },
  {
    id: "temple-run-2",
    title: "Temple Run 2",
    category: "Arcade",
    description: "Escape the cursed demon monkey in the legendary endless runner! Sprint along precarious cliff edges, zip-lines, mine cart tunnels, and ancient crumbling temple ruins while collecting coins and powerups.",
    iframeUrl: "https://db.duckmath.org/html/temple_run_2/index.html",
    tags: ["Arcade", "Runner", "3D", "Endless", "Action", "Classic"],
    color: "from-amber-600 via-yellow-700 to-stone-950",
    badge: "Endless Runner",
    rating: 4.9,
    icon: "Compass",
    tip: "Upgrade Coin Magnet and Shield duration first in the powerup store to easily build huge score multipliers.",
    stats: [
      { label: "Environments", val: "Temple, Mine, Cliffs" },
      { label: "Powerups", val: "Boost, Magnet, Shield" },
      { label: "Camera", val: "Over-the-Shoulder 3D" }
    ],
    highlightPills: ["Mine Cart Tunnels", "Zip-Line Sliding", "Demon Monkey Pursuit"],
    controls: [
      { key: "Up Arrow / W", action: "Jump Over Gaps & Logs" },
      { key: "Down Arrow / S", action: "Slide Under Fire & Blades" },
      { key: "Left / Right Arrow (A / D)", action: "Turn Corners" },
      { key: "Z / X", action: "Tilt Path for Coins" }
    ]
  },
  {
    id: "tanuki-sunset",
    title: "Tanuki Sunset",
    category: "Arcade",
    description: "Cruising downhill on a skateboard as a stylish raccoon against breathtaking retro synthwave sunsets! Drift around seaside hairpins, dodge beach traffic, collect golden cassette tapes, and vibe to lofi beats.",
    iframeUrl: "https://db.duckmath.org/html/tanuki_sunset/index.html",
    tags: ["Arcade", "Synthwave", "Chill", "Skateboard", "3D", "Music"],
    color: "from-fuchsia-500 via-pink-600 to-purple-950",
    badge: "Chill Synthwave Drift",
    rating: 4.9,
    icon: "Sparkles",
    tip: "Catch cassette tapes on outer corners and pull 180 slide-drifts to fill your Bonus Vibe meter!",
    stats: [
      { label: "Aesthetic", val: "80s Retrowave Sunset" },
      { label: "Audio", val: "Lofi Beats & Synth" },
      { label: "Physics", val: "Longboard Carving" }
    ],
    highlightPills: ["Retrowave Aesthetic", "Longboard Sliding", "Lofi Beats Soundtrack"],
    controls: [
      { key: "A / D or Left / Right", action: "Carve & Steer" },
      { key: "Spacebar / Drift Button", action: "Slide Drift" },
      { key: "W / Up Arrow", action: "Speed Tuck" }
    ]
  },
  {
    id: "doodle-jump",
    title: "Doodle Jump",
    category: "Arcade",
    description: "The timeless vertical platformer! Guide the adorable Doodler upward on a piece of graph paper, leaping from platform to platform while grabbing jetpacks, propeller caps, and blasting alien monsters.",
    iframeUrl: "https://db.duckmath.org/html/doodle_jump/index.html",
    tags: ["Arcade", "Platformer", "Casual", "Endless", "Classic"],
    color: "from-lime-500 via-yellow-600 to-emerald-900",
    badge: "Retro Mobile Classic",
    rating: 4.8,
    icon: "Rocket",
    tip: "Screen wrap is your best friend! Move through the left edge of the screen to pop out on the right side.",
    stats: [
      { label: "Platforms", val: "Static, Moving, Broken, Disappearing" },
      { label: "Powerups", val: "Jetpack, Springs, Propeller" },
      { label: "Visuals", val: "Hand-Drawn Graph Paper" }
    ],
    highlightPills: ["Screen Wrap Traversal", "Jetpack Launches", "Alien Blasting"],
    controls: [
      { key: "Left / Right Arrow (A / D)", action: "Move Left / Right" },
      { key: "Up Arrow / Left Click", action: "Shoot Nose Pellets" }
    ]
  },
  {
    id: "crossy-road",
    title: "Crossy Road",
    category: "Arcade",
    description: "Why did the chicken cross the road? Hop across endless busy highways, raging river log flumes, and speeding train tracks in delightful blocky voxel 3D style!",
    iframeUrl: "https://db.duckmath.org/html/crossy_road/index.html",
    tags: ["Arcade", "Voxel", "Endless", "Casual", "3D", "Classic"],
    color: "from-sky-400 via-blue-500 to-indigo-900",
    badge: "Voxel Hopper",
    rating: 4.9,
    icon: "Sparkles",
    tip: "Don't stay in one spot for too long or the hungry eagle will swoop down and carry you away!",
    stats: [
      { label: "Characters", val: "Dozens of Voxel Heroes" },
      { label: "Obstacles", val: "Cars, Trains, Rivers, Crocodiles" },
      { label: "Style", val: "Isometric Voxel" }
    ],
    highlightPills: ["Speeding Trains", "River Log Crossing", "Eagle Sweep Timer"],
    controls: [
      { key: "Up Arrow / W", action: "Hop Forward" },
      { key: "Down Arrow / S", action: "Hop Backward" },
      { key: "Left / Right (A / D)", action: "Hop Sideways" }
    ]
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird",
    category: "Arcade",
    description: "The notoriously challenging retro tap flyer! Flap your tiny wings, carefully maintain altitude, and weave through pixelated green pipes where a single pixel collision ends the run.",
    iframeUrl: "https://db.duckmath.org/html/flappy_bird/index.html",
    tags: ["Arcade", "Pixel", "Challenging", "Reflex", "Retro"],
    color: "from-emerald-400 via-teal-500 to-cyan-900",
    badge: "Precision Flyer",
    rating: 4.7,
    icon: "Sparkles",
    tip: "Find a gentle tapping rhythm rather than rapid tapping. Watch the bottom pipe clearance for the safest path.",
    stats: [
      { label: "Difficulty", val: "Brutal" },
      { label: "Mechanic", val: "Single-Tap Thrust" },
      { label: "Art Style", val: "16-Bit Pixel Art" }
    ],
    highlightPills: ["Precision Pipe Weaving", "Instant Retry", "Brutal High Scores"],
    controls: [
      { key: "Spacebar / Left Click", action: "Flap Wings & Gain Altitude" }
    ]
  },
  {
    id: "2048",
    title: "2048",
    category: "Puzzle",
    description: "The captivating mathematical tile puzzle! Slide numbered tiles on a 4x4 grid to merge identical numbers—2+2=4, 4+4=8—until you conquer the legendary 2048 tile.",
    iframeUrl: "https://db.duckmath.org/html/2048/index.html",
    tags: ["Puzzle", "Math", "Logic", "Brain", "Strategy", "Classic"],
    color: "from-amber-400 via-orange-500 to-stone-800",
    badge: "Math Puzzle",
    rating: 4.9,
    icon: "Sparkles",
    tip: "Pick one corner (like bottom-right) and keep your highest numbered tile anchored there at all times!",
    stats: [
      { label: "Board", val: "4x4 Grid" },
      { label: "Goal", val: "2048 Tile" },
      { label: "Modes", val: "Endless Play Beyond 2048" }
    ],
    highlightPills: ["Corner Strategy", "Exponential Merges", "Undo Capability"],
    controls: [
      { key: "Arrow Keys / WASD", action: "Slide All Tiles in Direction" }
    ]
  },
  {
    id: "rooftop-snipers",
    title: "Rooftop Snipers",
    category: "Action",
    description: "Two snipers on slippery rooftops with hilarious two-button physics! Jump and shoot to blast your opponent off the skyscrapers while dodging flying beach balls and laser rifles.",
    iframeUrl: "https://db.duckmath.org/html/rooftop_snipers/index.html",
    tags: ["Action", "Shooter", "2-Player", "Ragdoll", "Funny", "Physics"],
    color: "from-violet-500 via-purple-600 to-indigo-950",
    badge: "Rooftop Duel",
    rating: 4.8,
    icon: "Target",
    tip: "Hold the shoot button to elevate your sniper rifle arm. Release at the exact angle to hit your target across the roof.",
    stats: [
      { label: "Players", val: "1P vs AI or 2P Local" },
      { label: "Controls", val: "Two Buttons (Jump & Shoot)" },
      { label: "Win Condition", val: "First to 5 Knocks" }
    ],
    highlightPills: ["Elevating Aim Physics", "Rooftop Knockouts", "Local 2-Player"],
    controls: [
      { key: "W / E (Player 1)", action: "Jump / Shoot" },
      { key: "I / O (Player 2)", action: "Jump / Shoot" }
    ]
  },
  {
    id: "happy-wheels",
    title: "Happy Wheels",
    category: "Arcade",
    description: "The world-famous ragdoll physics obstacle game! Navigate motorized wheelchairs, Segways, and bicycles through community obstacle courses filled with spike pits, harpoons, and wrecking balls.",
    iframeUrl: "https://db.duckmath.org/html/happy_wheels/index.html",
    tags: ["Arcade", "Ragdoll", "Physics", "Humor", "Classic", "Action"],
    color: "from-red-600 via-rose-700 to-stone-900",
    badge: "Ragdoll Classic",
    rating: 4.9,
    icon: "Flame",
    tip: "Lean backward when landing from high drops to prevent your vehicle wheels from snapping on impact!",
    stats: [
      { label: "Characters", val: "Wheelchair Guy, Segway Guy, Irresponsible Dad" },
      { label: "Physics", val: "Total Skeletal Ragdoll" },
      { label: "Stages", val: "Official & Custom Levels" }
    ],
    highlightPills: ["Skeletal Ragdoll Physics", "Motorized Wheelchairs", "Level Editor"],
    controls: [
      { key: "Up / Down Arrow", action: "Accelerate / Reverse" },
      { key: "Left / Right Arrow", action: "Lean Back / Forward" },
      { key: "Spacebar", action: "Primary Action (Jump / Boost)" },
      { key: "Shift / Ctrl", action: "Secondary Actions" },
      { key: "Z", action: "Eject Rider from Vehicle" }
    ]
  },
  {
    id: "smash-karts",
    title: "Smash Karts",
    category: "Driving",
    description: "Fast 3D multiplayer kart battle arena! Drive high-speed go-karts, pick up mystery weapon boxes, and blast other players with homing rockets, machine guns, invincibility stars, and TNT mines.",
    iframeUrl: "https://db.duckmath.org/html/smash_karts/index.html",
    tags: ["Driving", "Multiplayer", "Kart", "Shooter", "3D", "Action"],
    color: "from-blue-500 via-cyan-600 to-indigo-900",
    badge: "Kart Battle Arena",
    rating: 4.9,
    icon: "Car",
    tip: "Drift around sharp corners to charge up speed boosts and aim your homing missiles when the crosshair turns green!",
    stats: [
      { label: "Battle Time", val: "3 Minute Rounds" },
      { label: "Weapons", val: "Rockets, Mines, Spikes, Lasers" },
      { label: "Customization", val: "Hats, Karts, Characters" }
    ],
    highlightPills: ["Homing Rockets", "Powerslide Drifting", "Multiplayer Mayhem"],
    controls: [
      { key: "WASD / Arrow Keys", action: "Steer & Accelerate" },
      { key: "Spacebar", action: "Fire Equipped Weapon" }
    ]
  },
  {
    id: "ovo",
    title: "OvO",
    category: "Arcade",
    description: "Electrifying precision stickman parkour platformer! Chain slides, wall jumps, dives, and ground pounds together in seamless parkour flow to beat community speedrun records.",
    iframeUrl: "https://db.duckmath.org/html/ovo/index.html",
    tags: ["Arcade", "Platformer", "Parkour", "Speedrun", "Precision"],
    color: "from-stone-700 via-zinc-800 to-black",
    badge: "Speedrun Parkour",
    rating: 4.9,
    icon: "Zap",
    tip: "Slide immediately after landing from a jump to conserve all forward momentum and perform extended slide jumps!",
    stats: [
      { label: "Stages", val: "50+ Hardcore Levels" },
      { label: "Mechanics", val: "Dive, Slide, Ground Pound" },
      { label: "Speedrun", val: "Built-In Millisecond Timer" }
    ],
    highlightPills: ["Momentum Slide Jumps", "Wall-Jump Chains", "Speedrun Leaderboards"],
    controls: [
      { key: "Left / Right Arrow (A / D)", action: "Run Left / Right" },
      { key: "Up Arrow / W", action: "Jump / Wall Jump" },
      { key: "Down Arrow / S", action: "Slide / Ground Pound" }
    ]
  },
  {
    id: "ragdoll-archers",
    title: "Ragdoll Archers",
    category: "Action",
    description: "Draw your bow, calculate ballistic arrow trajectories, and battle waves of enemy archers and armored knights with realistic ragdoll damage physics and bow upgrade trees.",
    iframeUrl: "https://db.duckmath.org/html/ragdoll_archers/index.html",
    tags: ["Action", "Archery", "Physics", "Ragdoll", "Upgrades", "Survival"],
    color: "from-red-600 via-amber-700 to-stone-900",
    badge: "Ballistic Archery",
    rating: 4.9,
    icon: "Crosshair",
    tip: "Aim for headshots! One headshot arrow instantly eliminates enemies, regardless of their health bar.",
    stats: [
      { label: "Weapons", val: "Poison, Fire, Bomb, Electric Arrows" },
      { label: "Armor", val: "Helmets, Shields, Cuirass" },
      { label: "Modes", val: "Wave Survival & 2-Player" }
    ],
    highlightPills: ["Ballistic Arc Trajectories", "Headshot Multipliers", "Elemental Arrow Types"],
    controls: [
      { key: "Left Click & Drag", action: "Aim & Draw Bowstring" },
      { key: "Release Click", action: "Shoot Arrow" },
      { key: "Spacebar / Jump", action: "Jump to Evade Arrows" }
    ]
  },
  {
    id: "friday-night-funkin",
    title: "Friday Night Funkin'",
    category: "Arcade",
    description: "The viral rhythm phenomenon! Match arrow keys to catchy beats in melodic rap battles against Daddy Dearest, Skid and Pump, Pico, Mommy Mearest, and Senpai to win Girlfriend's heart.",
    iframeUrl: "https://db.duckmath.org/html/friday_night_funkin/index.html",
    tags: ["Arcade", "Rhythm", "Music", "Rap Battle", "Retro", "Challenging"],
    color: "from-cyan-500 via-pink-600 to-purple-900",
    badge: "Rhythm Phenomenon",
    rating: 5.0,
    icon: "Sparkles",
    tip: "Switch to DFJK control binding in the options menu for faster finger responsiveness during hard-mode songs!",
    stats: [
      { label: "Weeks", val: "7 Official Weeks" },
      { label: "Difficulty", val: "Easy, Normal, Hard" },
      { label: "Soundtrack", val: "Original Chiptune Rap Beats" }
    ],
    highlightPills: ["Original Funk Soundtrack", "Vocal Rap Duels", "DFJK Support"],
    controls: [
      { key: "WASD / Arrow Keys / DFJK", action: "Hit Rhythm Notes" },
      { key: "Enter", action: "Confirm Menu Selection" },
      { key: "Esc", action: "Pause Song" }
    ]
  },
  {
    id: "btd5",
    title: "Bloons Tower Defense 5 (BTD5)",
    category: "Puzzle",
    description: "The legendary tower defense classic! Strategically deploy Dart Monkeys, Super Monkeys, Ninja Monkeys, and Tack Shooters to pop relentless waves of colored, ceramic, and lead Bloons.",
    iframeUrl: "https://db.duckmath.org/html/btd5/index.html",
    tags: ["Strategy", "Tower Defense", "Puzzle", "Monkeys", "Classic"],
    color: "from-emerald-500 via-green-600 to-amber-900",
    badge: "Tower Defense King",
    rating: 5.0,
    icon: "Shield",
    tip: "Place Spike Factories near the exit track as insurance against stray fast-moving Pink Bloons and Camo leads!",
    stats: [
      { label: "Towers", val: "21 Iconic Monkeys" },
      { label: "Tracks", val: "30+ Courses" },
      { label: "Upgrades", val: "Dual Upgrade Paths" }
    ],
    highlightPills: ["Super Monkeys", "Specialty Buildings", "Dual Upgrade Paths"],
    controls: [
      { key: "Mouse Drag & Drop", action: "Place Monkey Towers" },
      { key: "Click Tower", action: "Upgrade & Target Priority" },
      { key: "Spacebar", action: "Start Round / Fast Forward" }
    ]
  },
  {
    id: "eggy-car",
    title: "Eggy Car",
    category: "Driving",
    description: "Drive as far as possible over steep hills and valleys with a fragile egg sitting on top of your car! Collect coins and powerup freezes while delicately managing acceleration to keep the egg from cracking.",
    iframeUrl: "https://db.duckmath.org/html/eggy_car/index.html",
    tags: ["Driving", "Physics", "Casual", "Balance", "Challenge"],
    color: "from-amber-400 via-orange-500 to-red-800",
    badge: "Balance Driving",
    rating: 4.8,
    icon: "Car",
    tip: "Gently tap the brake before driving over the top of steep peaks so your egg does not fly out of the vehicle basket!",
    stats: [
      { label: "Vehicles", val: "Unlockable Eggmobiles" },
      { label: "Powerups", val: "Freeze Time, Magnet" },
      { label: "Physics", val: "Loose Cargo Inertia" }
    ],
    highlightPills: ["Inertial Physics", "Egg Stabilization", "Coin Magnets"],
    controls: [
      { key: "D / Right Arrow", action: "Accelerate Forward" },
      { key: "A / Left Arrow", action: "Brake & Reverse" }
    ]
  },
  {
    id: "drift-boss",
    title: "Drift Boss",
    category: "Driving",
    description: "One-touch 3D drifting on an endless suspended track! Time your drift turns with surgical precision to stay on the floating road without falling into the abyss.",
    iframeUrl: "https://db.duckmath.org/html/drift_boss/index.html",
    tags: ["Driving", "Drift", "One-Button", "Endless", "Arcade"],
    color: "from-indigo-500 via-purple-600 to-pink-900",
    badge: "One-Touch Drift",
    rating: 4.8,
    icon: "Car",
    tip: "Hold to drift right, release to drive straight left. Anticipate sharp 90-degree corners early!",
    stats: [
      { label: "Vehicles", val: "Dozens of Cars & Trucks" },
      { label: "Controls", val: "Single Click / Spacebar" },
      { label: "Track", val: "Floating Skyway" }
    ],
    highlightPills: ["One-Key Drifting", "Daily Spin Rewards", "Unlockable Cars"],
    controls: [
      { key: "Spacebar / Left Click (Hold)", action: "Turn Right" },
      { key: "Release", action: "Turn Left" }
    ]
  },
  {
    id: "vex-8",
    title: "Vex 8",
    category: "Arcade",
    description: "The latest installment in the iconic Vex platformer franchise! Master precision wall-jumps, grappling hooks, hang-gliders, and dodge laser grids and crushing blocks across tough-as-nails Acts.",
    iframeUrl: "https://db.duckmath.org/html/vex_8/index.html",
    tags: ["Arcade", "Platformer", "Stickman", "Hardcore", "Obstacle", "Vex"],
    color: "from-slate-700 via-zinc-800 to-black",
    badge: "Hardcore Platformer",
    rating: 4.9,
    icon: "Zap",
    tip: "Slide into orange trampolines from a full sprint to gain double vertical height and clear dangerous spikes!",
    stats: [
      { label: "Acts", val: "All New Vex Acts" },
      { label: "Difficulty", val: "Hardcore Hard Mode" },
      { label: "Checkpoints", val: "Generous Flagpoles" }
    ],
    highlightPills: ["Glider Wings", "Laser Hazards", "Trophy Achievements"],
    controls: [
      { key: "WASD / Arrow Keys", action: "Run, Jump, Slide, Climb" }
    ]
  },
  {
    id: "super-mario-64",
    title: "Super Mario 64",
    category: "RPG",
    description: "The groundbreaking 3D platforming masterpiece completely ported to HTML5 WebGL! Jump through Princess Peach's castle paintings, collect Power Stars, perform triple jumps and long jumps, and defeat Bowser.",
    iframeUrl: "https://db.duckmath.org/html/super_mario_64/index.html",
    tags: ["3D", "RPG", "Retro", "Nintendo", "Classic", "Adventure"],
    color: "from-red-500 via-blue-600 to-yellow-700",
    badge: "Nintendo 64 Classic",
    rating: 5.0,
    icon: "Trophy",
    tip: "Perform a long jump by crouching (Z) while running forward and instantly pressing Jump (Space)!",
    stats: [
      { label: "Stars", val: "120 Power Stars" },
      { label: "Engine", val: "Full 60 FPS WebGL Port" },
      { label: "Worlds", val: "Bob-omb Battlefield, Whomp's Fortress, etc." }
    ],
    highlightPills: ["Full 3D Castles", "Triple Jump Acrobatics", "60 FPS WebGL Engine"],
    controls: [
      { key: "WASD", action: "Mario Movement" },
      { key: "Spacebar / X", action: "Jump (A Button)" },
      { key: "C", action: "Punch / Dive (B Button)" },
      { key: "Z / Shift", action: "Crouch (Z Trigger)" },
      { key: "Arrow Keys", action: "Rotate C-Camera" }
    ]
  },
  {
    id: "madalin-stunt-cars-2",
    title: "Madalin Stunt Cars 2",
    category: "Driving",
    description: "Open-world 3D supercar stunt playground! Drive hypercars—including the Bugatti Veyron, Lamborghini Aventador, and Ferrari LaFerrari—across giant corkscrews, loopings, and vertical stunt ramps.",
    iframeUrl: "https://db.duckmath.org/html/madalin_stunt_cars_2/index.html",
    tags: ["Driving", "3D", "Stunt", "Supercars", "Open World", "Multiplayer"],
    color: "from-blue-600 via-cyan-700 to-slate-900",
    badge: "Supercar Stunts",
    rating: 4.9,
    icon: "Car",
    tip: "Engage your nitro boost (Shift) at the base of the mega-loop to generate enough g-force to stick to the ceiling!",
    stats: [
      { label: "Supercars", val: "40+ Licensed Models" },
      { label: "Stunt Maps", val: "3 Massive Open Arenas" },
      { label: "Physics", val: "Full Vehicle Damage & Nitro" }
    ],
    highlightPills: ["Mega Stunt Loops", "Hypercar Selection", "Nitrous Overdrive"],
    controls: [
      { key: "WASD / Arrow Keys", action: "Drive & Steer" },
      { key: "Shift", action: "Nitro Boost" },
      { key: "Spacebar", action: "Handbrake Drift" },
      { key: "C", action: "Change Camera View" },
      { key: "R", action: "Reset Car" }
    ]
  },
  {
    id: "snow-rider-3d",
    title: "Snow Rider 3D",
    category: "Action",
    description: "Race your sled down steep snowy mountains at breakneck speeds in full 3D! Dodge giant pine trees, tumbling boulders, snowmen, and dangerous ravines while grabbing gift presents along the slope to unlock 10+ custom high-performance sleighs.",
    iframeUrl: "https://db.duckmath.org/html/snow_rider_3d/index.html",
    tags: ["3D", "Action", "Winter", "Obstacle", "Endless", "Physics"],
    color: "from-sky-500 via-blue-600 to-indigo-800",
    badge: "3D Sledding",
    rating: 4.9,
    icon: "Gamepad2",
    tip: "Collect presents along the slope to unlock faster sleighs in the shop! Time your jumps right before crests for extra airtime.",
    stats: [
      { label: "Sleighs", val: "10+" },
      { label: "Engine", val: "Full 3D" },
      { label: "Framerate", val: "60 FPS" }
    ],
    highlightPills: ["Alpine Slopes", "Unlocked Gifts", "3D Snow Physics"],
    controls: [
      { key: "Up Arrow / W / Space", action: "Jump Over Obstacles & Chasms" },
      { key: "Left Arrow / A", action: "Steer Left & Counter-Drift" },
      { key: "Right Arrow / D", action: "Steer Right & Carve" },
      { key: "Down Arrow / S", action: "Brake / Slow Down for Tight Curves" }
    ]
  },
  {
    id: "golf-orbit",
    title: "Golf Orbit",
    category: "Sports",
    description: "Launch your golf ball into outer space! Time your swing with pinpoint accuracy to hit 100% maximum power, bounce across fields and planets, and upgrade your golfer's strength, club bounce, and rocket thrusters to reach the furthest galaxy.",
    iframeUrl: "https://db.duckmath.org/html/golf_orbit/index.html",
    tags: ["Sports", "Arcade", "Physics", "Upgrade", "Casual", "Space"],
    color: "from-emerald-500 via-teal-600 to-cyan-800",
    badge: "Space Golf",
    rating: 4.8,
    icon: "Trophy",
    tip: "Focus your upgrades on Strength and Bounciness first. When the meter hits the green sweet spot, click to launch!",
    stats: [
      { label: "Max Distance", val: "Orbit" },
      { label: "Physics", val: "Gravitational" },
      { label: "Framerate", val: "60 FPS" }
    ],
    highlightPills: ["Cosmic Trajectory", "Rocket Thrusters", "Full Upgrades"],
    controls: [
      { key: "Left Click / Tap / Space", action: "Time Swing Meter & Launch Ball" },
      { key: "P / Escape", action: "Pause & Access Upgrades" },
      { key: "R", action: "Quick Retry / Take Next Shot" }
    ]
  },
  {
    id: "escape-car",
    title: "Escape Car",
    category: "Driving",
    description: "Outrun the pursuit in an adrenaline-pumping getaway! Drift around hairpins, weave through rush-hour traffic, avoid police roadblocks, spike strips, and armored cruisers while banking cash to upgrade speed, armor, and nitro.",
    iframeUrl: "https://db.duckmath.org/html/escape_car/index.html",
    tags: ["Action", "Driving", "Escape", "Drift", "Arcade", "Police Chase"],
    color: "from-amber-500 via-orange-600 to-rose-800",
    badge: "Police Chase",
    rating: 4.9,
    icon: "Zap",
    tip: "Bait police cruisers into crashing into each other or obstacles for massive bonus cash multipliers!",
    stats: [
      { label: "Pursuit Level", val: "5-Star" },
      { label: "Drift Angle", val: "180°" },
      { label: "Framerate", val: "60 FPS" }
    ],
    highlightPills: ["Police Roadblocks", "Nitro Overdrive", "Getaway Drift"],
    controls: [
      { key: "A / D or Left / Right Arrow", action: "Steer Left / Right & Initiate Drift" },
      { key: "W or Up Arrow", action: "Full Throttle & Nitro Boost" },
      { key: "S or Down Arrow / Space", action: "Emergency Brake & Handbrake 180°" }
    ]
  },
  {
    id: "deadly-descent",
    title: "Deadly Descent",
    category: "Sports",
    description: "Hurtle down razor-sharp cliffs and treacherous alpine ridges at breakneck speeds! Master downhill mountain bike physics, perform airborne flips and tricks, and dodge deadly chasms, tumbling boulders, and steep drops to conquer the ultimate descent.",
    iframeUrl: "https://db.duckmath.org/html/deadly_descent/index.html",
    tags: ["3D", "Downhill", "BMX", "Extreme", "Physics", "Racing"],
    color: "from-rose-500 via-red-600 to-amber-800",
    badge: "Downhill BMX",
    rating: 4.9,
    icon: "Flame",
    tip: "Lean back during steep vertical drops to prevent flipping over the handlebars, and pump your brakes before big blind crests!",
    stats: [
      { label: "Discipline", val: "Downhill" },
      { label: "Terrain", val: "Extreme Peaks" },
      { label: "Framerate", val: "60 FPS" }
    ],
    highlightPills: ["Alpine Ridges", "Trick Flips", "Downhill BMX"],
    controls: [
      { key: "W / Up Arrow", action: "Pedal Forward & Accelerate" },
      { key: "S / Down Arrow", action: "Brake / Slow Descent" },
      { key: "A / D or Left / Right Arrow", action: "Lean Back / Forward & Balance Tricks" },
      { key: "Spacebar", action: "Bunny Hop / Jump Chasms" },
      { key: "R", action: "Quick Restart Run" }
    ]
  },
  {
    id: "baldis-basics",
    title: "Baldi's Basics in Education",
    category: "Horror",
    description: "Enter Baldi's Schoolhouse to collect 7 lost notebooks! Solve math problems on the You Can Think Pad, outrun Baldi as his ruler slaps faster, and avoid Principal of the Thing, Playtime, and Gotta Sweep.",
    iframeUrl: "https://db2.duckmath.org/2026/more/baldis-basics/pre.html",
    tags: ["Horror", "Surreal", "Parody", "Survival", "Indie"],
    color: "from-green-600 via-lime-700 to-stone-900",
    badge: "90s Edutainment Horror",
    rating: 4.9,
    icon: "Ghost",
    tip: "Save your BSODA cans for when Baldi has cornered you in a narrow hallway to push him all the way back!",
    stats: [
      { label: "Objective", val: "Collect 7 Notebooks" },
      { label: "Items", val: "BSODA, Energy Bar, Zesty" },
      { label: "Antagonist", val: "Baldi & Faculty" }
    ],
    highlightPills: ["Schoolhouse Labyrinth", "Impossible Math Problems", "Surreal Horror"],
    controls: [
      { key: "WASD", action: "Walk & Strafe" },
      { key: "Mouse", action: "Look & Turn" },
      { key: "Shift", action: "Run (Consumes Stamina)" },
      { key: "Left Click", action: "Open Doors & Grab Notebooks" },
      { key: "Spacebar", action: "Quick Look Behind" }
    ]
  },
  {
    id: "drift-hunters",
    title: "Drift Hunters",
    category: "Driving",
    description: "The premier 3D browser drift simulator! Choose from 25+ iconic JDM and European drift cars, customize turbos, gear ratios, suspension camber, and offset, and slide through docks, mountain passes, and racetracks.",
    iframeUrl: "https://db2.duckmath.org/2023/unity3/drift-hunters/pre.html",
    tags: ["Driving", "Drift", "Simulator", "Tuning", "3D", "JDM"],
    color: "from-cyan-600 via-blue-700 to-slate-900",
    badge: "Realistic Drift Sim",
    rating: 4.9,
    icon: "Car",
    tip: "Tune your rear tire pressure lower and increase front wheel camber for maximum drift stability and point multipliers.",
    stats: [
      { label: "Cars", val: "26 Tunable Drift Machines" },
      { label: "Tracks", val: "Touge, Docks, Nishuri, City" },
      { label: "Tuning", val: "Full Engine, Turbo, Gearbox, Stance" }
    ],
    highlightPills: ["Deep Stance Tuning", "Continuous Drift Combos", "Touge Mountain Passes"],
    controls: [
      { key: "WASD / Arrow Keys", action: "Steer & Accelerate" },
      { key: "Spacebar", action: "Handbrake Drift" },
      { key: "C", action: "Switch Camera Angle" },
      { key: "Shift / Ctrl", action: "Manual Gear Shift Up / Down" }
    ]
  },
  {
    id: "basketball-legends",
    title: "Basketball Legends",
    category: "Sports",
    description: "Step onto the hardwood with legendary cartoon NBA superstars! Perform devastating slam dunks, block three-pointers, trigger super ability meters, and battle through tournament brackets.",
    iframeUrl: "https://db2.duckmath.org/2002/basketball-legends/index.html",
    tags: ["Sports", "Basketball", "2-Player", "Arcade", "Multiplayer"],
    color: "from-amber-500 via-red-600 to-blue-900",
    badge: "2-Player Hoops",
    rating: 4.9,
    icon: "Trophy",
    tip: "Charge your Super Shot meter by scoring regular baskets, then unleash an unblockable flame dunk from half court!",
    stats: [
      { label: "Modes", val: "Tournament, Quick Match, 2P" },
      { label: "Special Moves", val: "Super Dunks & Steals" },
      { label: "Teams", val: "Legendary NBA Duos" }
    ],
    highlightPills: ["Super Dunk Meter", "2-Player Local Duels", "Tournament Trophy Mode"],
    controls: [
      { key: "WASD / Arrow Keys", action: "Move & Jump" },
      { key: "B / L", action: "Shoot / Steal" },
      { key: "V / K", action: "Super Shot Power" }
    ]
  },
  {
    id: "tap-tap-shots",
    title: "Tap Tap Shots",
    category: "Sports",
    description: "The dangerously addictive basketball dunk challenge! Tap to keep the ball in the air and time your arc to sink swishes through moving hoops before the shot clock buzzer expires.",
    iframeUrl: "https://db2.duckmath.org/2023/q/1/tap-tap-shots/pre.html",
    tags: ["Sports", "Arcade", "Basketball", "Casual", "Skill", "Addictive"],
    color: "from-orange-500 via-amber-600 to-stone-900",
    badge: "Shot Clock Swish",
    rating: 4.8,
    icon: "Trophy",
    tip: "Aim for clean swishes without hitting the rim to activate the on-fire multiplier and double your score!",
    stats: [
      { label: "Controls", val: "One Click / Tap" },
      { label: "Hoops", val: "Dynamic Moving Nets" },
      { label: "Fire Mode", val: "Swish Streak Multiplier" }
    ],
    highlightPills: ["Swish Fire Mode", "Beat The Buzzer", "One-Tap Timing"],
    controls: [
      { key: "Left Click / Space / Tap", action: "Bounce Ball Upward" }
    ]
  },
  {
    id: "we-become-what-we-behold",
    title: "We Become What We Behold",
    category: "Puzzle",
    description: "A profound 5-minute game about news cycles, social contagion, and sensationalism. Take photos of squares and circles with your camera viewfinder to see how the news captures and magnifies behavior.",
    iframeUrl: "https://db2.duckmath.org/2024/more/we-become-what-we-behold/pre.html",
    tags: ["Indie", "Story", "Satire", "Thought-Provoking", "Short"],
    color: "from-stone-700 via-red-800 to-black",
    badge: "Social Satire",
    rating: 4.9,
    icon: "Sparkles",
    tip: "Look for unusual character interactions—hats, lovers, angry outbursts—and snap them to drive the headline story.",
    stats: [
      { label: "Length", val: "5-Minute Narrative" },
      { label: "Mechanic", val: "Camera Viewfinder" },
      { label: "Genre", val: "Interactive Art & Satire" }
    ],
    highlightPills: ["Camera Snap Viewfinder", "Viral Headline Cycle", "Compelling Narrative"],
    controls: [
      { key: "Mouse Move", action: "Aim Camera Viewfinder" },
      { key: "Left Click", action: "Snap Photo for Newsfeed" }
    ]
  },
  {
    id: "sprunki",
    title: "Sprunki Incredibox",
    category: "Arcade",
    description: "The viral musical interactive beatbox simulator! Drag and drop unique quirky musical beatboxers to craft infectious beats, basslines, and melodies—or uncover the eerie horror transformation mode.",
    iframeUrl: "https://db2.duckmath.org/2024/more2/sprunki/pre.html",
    tags: ["Music", "Creativity", "Interactive", "Soundtrack", "Fun", "Viral"],
    color: "from-violet-600 via-fuchsia-700 to-slate-950",
    badge: "Musical Beatboxer",
    rating: 4.9,
    icon: "Sparkles",
    tip: "Experiment with layering the percussion loops first before adding vocals to create balanced, groovy mixes!",
    stats: [
      { label: "Audio", val: "Beats, Bass, Melodies, Voices" },
      { label: "Characters", val: "15+ Sound Avatars" },
      { label: "Modes", val: "Classic & Spooky Phase" }
    ],
    highlightPills: ["Live Multitrack Beatboxing", "Quirky Sound Avatars", "Horror Easter Egg Mode"],
    controls: [
      { key: "Mouse Drag & Drop", action: "Assign Sound Icon to Character" },
      { key: "Click Character", action: "Mute / Solo Audio Track" }
    ]
  },
  {
    id: "bus-subway-runner",
    title: "Subway Bus Runner",
    category: "Arcade",
    description: "3D high-speed urban runner! Dash across train tracks, dodge oncoming buses and commuter trains, ride hoverboards, collect gold coins, and evade the transit police.",
    iframeUrl: "https://db2.duckmath.org/2022/unity/bus-subway-runner/pre.html",
    tags: ["Arcade", "Runner", "3D", "Parkour", "Action"],
    color: "from-blue-500 via-indigo-600 to-slate-900",
    badge: "Subway Parkour",
    rating: 4.8,
    icon: "Zap",
    tip: "Double-tap to summon your hoverboard to gain instant invulnerability against crash collisions!",
    stats: [
      { label: "Obstacles", val: "Moving Trains, Barriers, Buses" },
      { label: "Upgrades", val: "Jetpack, Super Sneakers, Coin Magnet" },
      { label: "Graphics", val: "High-Res 3D Subway" }
    ],
    highlightPills: ["Hoverboard Shield", "Subway Rooftop Surfing", "Jetpack Coin Vault"],
    controls: [
      { key: "Arrow Keys / WASD", action: "Dodge, Jump, Slide" },
      { key: "Spacebar (Double Tap)", action: "Activate Hoverboard" }
    ]
  },
  {
    id: "velocity-rush",
    title: "Velocity Rush",
    category: "Action",
    description: "Fast-paced first-person parkour action game! Run along walls, slide under laser fences, execute grappling-hook swings, and take out guards with pistols and katanas in slick minimalist levels.",
    iframeUrl: "https://db2.duckmath.org/2026/unity/velocity-rush/pre.html",
    tags: ["Action", "Parkour", "3D", "FPS", "Speed"],
    color: "from-cyan-500 via-teal-600 to-slate-900",
    badge: "Parkour FPS",
    rating: 4.9,
    icon: "Crosshair",
    tip: "Jump onto walls at an angle to initiate a wall-run, then jump at the end for an explosive forward momentum boost!",
    stats: [
      { label: "Engine", val: "Unity 3D WebGL" },
      { label: "Style", val: "Minimalist Cyberparkour" },
      { label: "Combat", val: "Parkour Melee & Firearms" }
    ],
    highlightPills: ["Wall Running Physics", "Slow-Mo Sliding", "Minimalist Cyber Arena"],
    controls: [
      { key: "WASD", action: "Sprint & Strafe" },
      { key: "Spacebar", action: "Jump / Wall-Run" },
      { key: "Shift / C", action: "Slide Under Hazards" },
      { key: "Left Click", action: "Attack / Shoot" }
    ]
  },
  {
    id: "pokemon-emerald",
    title: "Pokemon Emerald",
    category: "RPG",
    description: "The legendary Game Boy Advance RPG running completely in browser via WebAssembly! Explore the Hoenn region, capture over 200 Pokemon, defeat Gym Leaders, and thwart Team Magma and Team Aqua.",
    iframeUrl: "https://db2.duckmath.org/2026/em/pokemon-emerald/index.html",
    tags: ["RPG", "Pokemon", "GBA", "Retro", "Adventure", "Classic"],
    color: "from-emerald-500 via-green-600 to-stone-900",
    badge: "GBA Emulation",
    rating: 5.0,
    icon: "Heart",
    tip: "Treecko, Torchic, and Mudkip each provide distinct advantages. Mudkip has great typing for the early Hoenn gyms!",
    stats: [
      { label: "Region", val: "Hoenn" },
      { label: "Pokedex", val: "Gen 3 Pokemon" },
      { label: "Save State", val: "Built-In Browser Memory" }
    ],
    highlightPills: ["Full Hoenn Region", "Rayquaza & Weather Trio", "Turn-Based Battles"],
    controls: [
      { key: "Arrow Keys", action: "D-Pad Movement" },
      { key: "Z / X", action: "A / B Buttons" },
      { key: "Enter", action: "Start Button" },
      { key: "Shift", action: "Select Button" }
    ]
  },
  {
    id: "pokemon-red",
    title: "Pokemon Red",
    category: "RPG",
    description: "Where the worldwide phenomenon began! Journey through the Kanto region, challenge the Elite Four at the Indigo Plateau, and catch all 151 original Pokemon in this classic Game Boy adventure.",
    iframeUrl: "https://db2.duckmath.org/2026/em/pokemon-red/index.html",
    tags: ["RPG", "Pokemon", "Retro", "Game Boy", "Classic"],
    color: "from-red-600 via-rose-700 to-stone-900",
    badge: "Gen 1 Classic",
    rating: 5.0,
    icon: "Heart",
    tip: "Bulbasaur has type advantage against the first two Gym Leaders (Brock and Misty), making early progression smooth!",
    stats: [
      { label: "Region", val: "Kanto" },
      { label: "Pokedex", val: "Original 151" },
      { label: "System", val: "Game Boy Original" }
    ],
    highlightPills: ["Original 151 Pokemon", "Kanto Gym Badges", "Mewtwo Cerulean Cave"],
    controls: [
      { key: "Arrow Keys", action: "Walk & Menu" },
      { key: "Z / X", action: "A / B Action" },
      { key: "Enter / Shift", action: "Start / Select" }
    ]
  },
  {
    id: "elastic-man",
    title: "Elastic Man",
    category: "Casual",
    description: "Amazingly satisfying and hilarious facial physics simulator! Pinch, stretch, pull, and release an elastic face rendered with ultra-realistic water-balloon skin dynamics and tracking eyes.",
    iframeUrl: "https://db2.duckmath.org/2025/more/elastic-man/gm/pre.html",
    tags: ["Casual", "Physics", "Funny", "Relaxing", "Interactive"],
    color: "from-amber-400 via-orange-500 to-rose-800",
    badge: "Satisfying Physics",
    rating: 4.8,
    icon: "Sparkles",
    tip: "Pull the nose or cheek all the way to the screen border and release to see ripple vibrations across the entire skin surface!",
    stats: [
      { label: "Physics Engine", val: "Elastic Mesh Deformation" },
      { label: "Interaction", val: "Full Click & Drag" },
      { label: "Audio", val: "Rubbery Slap SFX" }
    ],
    highlightPills: ["Real-time Skin Deformation", "Eye Tracking Physics", "Instant Stress Relief"],
    controls: [
      { key: "Mouse Click & Drag", action: "Pull & Stretch Face" }
    ]
  },
  {
    id: "backflip-challenge",
    title: "Backflip Challenge",
    category: "Sports",
    description: "Realistic ragdoll gymnastics and cliff jumping! Calculate your takeoff crouch, tuck into tight spins, and time your landing extension to nail perfect stick landings on tiny target pads.",
    iframeUrl: "https://db2.duckmath.org/2026/unity/backflip-challenge/pre.html",
    tags: ["Sports", "Parkour", "Physics", "Acrobatics", "Ragdoll"],
    color: "from-blue-500 via-indigo-600 to-purple-900",
    badge: "Ragdoll Acrobatics",
    rating: 4.8,
    icon: "Trophy",
    tip: "Hold tuck tightly during mid-air flight to spin twice as fast, but release early so your feet are pointing straight down at the ground!",
    stats: [
      { label: "Spots", val: "Rooftops, Gyms, Cliffs" },
      { label: "Tricks", val: "Gainer, Backflip, Layout" },
      { label: "Score", val: "Target Landing Accuracy" }
    ],
    highlightPills: ["Tight Tuck Physics", "Precision Landing Pads", "Ragdoll Crashes"],
    controls: [
      { key: "Left Click / Space (Hold)", action: "Crouch for Jump" },
      { key: "Release & Click Again", action: "Tuck for Rotation" },
      { key: "Release to Land", action: "Extend Legs" }
    ]
  },
  {
    id: "steal-brainrots-multiplayer",
    title: "Steal Brainrots Multiplayer",
    category: "Action",
    description: "Hilarious fast-paced multiplayer heist game! Infiltrate top-secret vaults, dodge security cameras and laser tripwires, steal quirky artifacts, and outrun rival players to the extraction zone.",
    iframeUrl: "https://db2.duckmath.org/2026/unity/steal-brainrots-multiplayer/pre.html",
    tags: ["Action", "Multiplayer", "Humor", "Heist", "3D"],
    color: "from-violet-600 via-purple-700 to-stone-900",
    badge: "Multiplayer Heist",
    rating: 4.9,
    icon: "Zap",
    tip: "Use ventilation ducts to bypass laser gates and sneak up on other players to swipe their collected loot!",
    stats: [
      { label: "Players", val: "Online Real-Time Rooms" },
      { label: "Loot", val: "Vault Relics & Upgrades" },
      { label: "Environment", val: "High-Tech Bank Vault" }
    ],
    highlightPills: ["Laser Tripwires", "Multiplayer Stealth", "Extraction Heist"],
    controls: [
      { key: "WASD", action: "Move & Sneak" },
      { key: "Spacebar", action: "Jump" },
      { key: "E", action: "Steal Relic / Open Vault" },
      { key: "Shift", action: "Sprint" }
    ]
  },
  {
    id: "ducky-clicker",
    title: "Ducky Clicker",
    category: "Idle",
    description: "Quack your way to rubber duck supremacy! Click the giant rubber duck, unlock duck ponds, hire duck scientists, build duck space stations, and discover secret legendary duck forms.",
    iframeUrl: "https://db2.duckmath.org/2026/more/ducky-clicker/pre.html",
    tags: ["Idle", "Clicker", "Casual", "Ducks", "Upgrades"],
    color: "from-yellow-400 via-amber-500 to-stone-900",
    badge: "Quacking Clicker",
    rating: 4.8,
    icon: "Sparkles",
    tip: "Reinvest all your quacks into passive income generators before logging off to wake up to billions of ducks!",
    stats: [
      { label: "Ducks Produced", val: "Trillions+" },
      { label: "Duck Forms", val: "Cosmic, Gold, Pirate, Robo" },
      { label: "Prestige", val: "Golden Feather Rebirth" }
    ],
    highlightPills: ["Golden Feather Prestige", "Rubber Duck Upgrades", "Quacking Sound Effects"],
    controls: [
      { key: "Left Click", action: "Quack / Buy Generators" }
    ]
  },
  {
    id: "stickman-gta-city",
    title: "Stickman GTA City",
    category: "Action",
    description: "Open-world 3D sandbox city action! Commandeer luxury supercars, pilot attack helicopters, complete gang missions, use rocket launchers and machine guns, and cause havoc across the metropolis.",
    iframeUrl: "https://db2.duckmath.org/2024/unity3/stickman-gta-city/pre.html",
    tags: ["Action", "Open World", "Driving", "Shooter", "3D", "Stickman"],
    color: "from-blue-600 via-indigo-700 to-slate-950",
    badge: "Open World City",
    rating: 4.9,
    icon: "Crosshair",
    tip: "Steal an armored swat truck or helicopter at the police helipad to survive 5-star pursuit levels!",
    stats: [
      { label: "Vehicles", val: "Cars, Bikes, Helicopters, Tanks" },
      { label: "Arsenal", val: "Pistol, Shotgun, AK-47, RPG" },
      { label: "World", val: "Full 3D City Sandbox" }
    ],
    highlightPills: ["Helicopter Flight", "Supercar Commandeering", "Open World Sandbox"],
    controls: [
      { key: "WASD", action: "Walk & Steer" },
      { key: "F / Enter", action: "Enter / Exit Vehicle" },
      { key: "Left Click", action: "Fire Weapon" },
      { key: "Right Click", action: "Aim Weapon" },
      { key: "Spacebar", action: "Jump / Handbrake" }
    ]
  },
  {
    id: "highway-traffic",
    title: "Highway Traffic",
    category: "Driving",
    description: "High-speed lane splitting and near-miss thrills! Weave through dense rush hour highway traffic at 200 MPH, narrowly shaving past semis and sedans for near-miss score bonuses.",
    iframeUrl: "https://db2.duckmath.org/2022/unity/highway-traffic/pre.html",
    tags: ["Driving", "Racing", "Highway", "Traffic", "3D", "Reflex"],
    color: "from-amber-500 via-orange-600 to-stone-900",
    badge: "Traffic Weaving",
    rating: 4.9,
    icon: "Car",
    tip: "Drive in the oncoming traffic lane during two-way mode for massive risk-multiplier cash rewards!",
    stats: [
      { label: "Modes", val: "One-Way, Two-Way, Time Attack, Bomb" },
      { label: "Weather", val: "Sunny, Sunset, Rainy Night" },
      { label: "Cars", val: "15 High-Speed Tuners" }
    ],
    highlightPills: ["Near-Miss Combos", "Oncoming Lane Multipliers", "Rainy Night Reflections"],
    controls: [
      { key: "W / Up Arrow", action: "Full Throttle" },
      { key: "S / Down Arrow", action: "Brake" },
      { key: "A / D or Left / Right", action: "Weave Lanes" },
      { key: "Spacebar", action: "Handbrake" }
    ]
  }
];

fs.writeFileSync('./public/games.json', JSON.stringify(games, null, 2), 'utf8');

const cloakProfiles = [
  {
    id: "none",
    name: "Standard (SCPHub)",
    title: "SCPHub - Unblocked Games",
    iconUrl: "/scp-logo.svg"
  },
  {
    id: "classroom",
    name: "Google Classroom",
    title: "Classes - Google Classroom",
    iconUrl: "https://ssl.gstatic.com/classroom/favicon.png"
  },
  {
    id: "docs",
    name: "Google Docs",
    title: "Google Docs",
    iconUrl: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico"
  },
  {
    id: "drive",
    name: "Google Drive",
    title: "My Drive - Google Drive",
    iconUrl: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"
  },
  {
    id: "canvas",
    name: "Canvas LMS",
    title: "Dashboard - Canvas",
    iconUrl: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico"
  },
  {
    id: "wikipedia",
    name: "Wikipedia",
    title: "Wikipedia, the free encyclopedia",
    iconUrl: "https://en.wikipedia.org/static/favicon/wikipedia.ico"
  }
];

const gamesJsContent = `export const INITIAL_GAMES = ${JSON.stringify(games, null, 2)};\n\nexport const CLOAK_PROFILES = ${JSON.stringify(cloakProfiles, null, 2)};\n`;

fs.writeFileSync('./src/data/games.js', gamesJsContent, 'utf8');

console.log(`WROTE ${games.length} GAMES TO BOTH FILES.`);
