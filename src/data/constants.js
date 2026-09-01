export const SAVE_KEY = 'dnd_tamagotchi_v3'; 
export const MAX_STAT = 100;

export const EDGY_FIRST_NAMES = [
  'Bitter', 'Grim', 'Bleak', 'Sullen', 'Morbid', 'Vile', 
  'Jagged', 'Sharp', 'Brutal', 'Fierce', 'Blunt', 'Savage', 
  'Erratic', 'Frenetic', 'Wild', 'Rogue', 'Frantic', 'Volatile', 
  'Vague', 'Clandestine', 'Stealthy', 'Murky', 'Veiled', 'Obscure'
];

export const EDGY_LAST_NAMES = [
  'Thorn', 'Shroud', 'Frost', 'Grave', 'Crypt', 'Rot', 
  'Blade', 'Edge', 'Lash', 'Talon', 'Force', 'Scar', 
  'Pulse', 'Sparks', 'Hazard', 'Wave', 'Pace', 'Fuse', 
  'Phantom', 'Shadow', 'Prowl', 'Depths', 'Ghost', 'Trace'
];

export const ITEM_DB = {
  head: [
    { id: 'none', name: 'Bare', type: 'head', category: 'None', baseType: 'none', stats: { ac: 0 }, cost: 0, description: 'Wind in your hair.' },
    { id: 'leather_cap', name: 'Leather Cap', type: 'head', category: 'Light Helm', baseType: 'leather_cap', stats: { ac: 1 }, cost: 25, merchantNames: ["Assassin's Skullcap", "Helmet of the \"Silent Night\""] },
    { id: 'iron_helm', name: 'Iron Helm', type: 'head', category: 'Heavy Helm', baseType: 'iron_helm', stats: { ac: 3, dex: -1 }, cost: 60, merchantNames: ["Visor of the Undefeated (Has a Dent)", "Crown of the Iron Vanguard"] },
    { id: 'wizard_hat', name: 'Wizard Hat', type: 'head', category: 'Arcane Focus', baseType: 'hat_blue', stats: { int: 2 }, cost: 80, merchantNames: ["Crown of the Astral Plane", "The \"Mind-Expander\" Cone"] },
  ],
  body: [
    { id: 'tunic', name: 'Breezy Tunic', type: 'body', category: 'Clothing', baseType: 'tunic', stats: { ac: 0 }, cost: 0, description: 'Drafty.' },
    { id: 'cultist_robe', name: 'Cultist Robes', type: 'body', category: 'Clothing', baseType: 'robe_black', stats: { ac: 1, int: 1 }, cost: 0, description: 'Smells like squid and bad decisions. Cursed.' },
    { id: 'robe', name: 'Mysterious Robe', type: 'body', category: 'Clothing', baseType: 'robe_blue', stats: { ac: 1, int: 1 }, cost: 30, merchantNames: ["Silk-Spun \"Arcane\" Bullshit", "Cultist's Bloodstained Shroud"] },
    { id: 'leather_armor', name: 'Leather Armor', type: 'body', category: 'Light Armor', baseType: 'leather_armor', stats: { ac: 2 }, cost: 40, merchantNames: ["Faux Dragonhide Jerkin", "Shadow-Stalker's Harness (Squeaky)"] },
    { id: 'chainmail', name: 'Chainmail', type: 'body', category: 'Medium Armor', baseType: 'chainmail', stats: { ac: 6, dex: -1 }, cost: 150, merchantNames: ["Faux Mithril-Plated Links", "Crusader's Hauberk (Pre-Ruined)"] },
    { id: 'plate', name: 'Plate Armor', type: 'body', category: 'Heavy Armor', baseType: 'plate', stats: { ac: 10, dex: -2 }, cost: 500, merchantNames: ["Aegis of the Forgotten Emperor", "The \"I Swear to God It's Dragon-Proof\" Cuirass"] },
  ],
  mainHand: [
    { id: 'fist', name: 'These Two Hands', type: 'mainHand', category: 'Unarmed', baseType: 'fist', stats: { str: 0 }, cost: 0, description: 'Always loaded.' },
    { id: 'dagger', name: 'Dagger', type: 'mainHand', category: 'Dagger', baseType: 'weapon_dagger', stats: { dex: 2, str: 1 }, cost: 15, merchantNames: ["The \"Stab That Bastard\" Special", "The Back-Alley Gut-Opener"] },
    { id: 'sword', name: 'Sword', type: 'mainHand', category: 'Longsword', baseType: 'weapon_sword', stats: { str: 2 }, cost: 50, merchantNames: ["Blade of the Fallen King (Replica)", "Destiny's Edge"] },
    { id: 'staff', name: 'Staff', type: 'mainHand', category: 'Quarterstaff', baseType: 'weapon_staff', stats: { int: 1, str: 1 }, cost: 60, merchantNames: ["Stick I Found Outside", "The \"Point This End at the Bad Guy\" Rod"] },
    { id: 'axe', name: 'Axe', type: 'mainHand', category: 'Battleaxe', baseType: 'weapon_axe', stats: { str: 3 }, cost: 75, merchantNames: ["Executioner's Right Hand", "Troll-Splitter"] },
    { id: 'hammer', name: 'Hammer', type: 'mainHand', category: 'Warhammer', baseType: 'weapon_hammer', stats: { str: 3 }, cost: 100, merchantNames: ["Skull-Crusher of the Ancients", "Dwarven \"Negotiator\" Mallet"] },
  ],
  offHand: [
    { id: 'none', name: 'Empty', type: 'offHand', category: 'None', baseType: 'none', stats: { ac: 0 }, cost: 0, description: 'Free hand.' },
    { id: 'wooden_shield', name: 'Wooden Shield', type: 'offHand', category: 'Shield', baseType: 'shield_wooden', stats: { ac: 1 }, cost: 15, merchantNames: ["Splintering Ward of the Ancients", "The \"Impenetrable\" Barn Door"] },
    { id: 'tower_shield', name: 'Tower Shield', type: 'offHand', category: 'Tower Shield', baseType: 'shield_tower', stats: { ac: 3, dex: -2 }, cost: 60, merchantNames: ["The Immovable Object", "Phalanx Wall (Slightly Flammable)"] },
    { id: 'book', name: 'Spellbook', type: 'offHand', category: 'Arcane Focus', baseType: 'offhand_book', stats: { int: 3 }, cost: 200, merchantNames: ["Tome of Infinite Cosmos (Missing Pages)", "The \"Soul-Trapper\" Grimoire (Just a Diary)"] },
  ],
  supplies: [
    { id: 'ration', name: 'Mystery Meat Jerky', type: 'food', category: 'Food', cost: 3, description: 'Don\'t ask what animal it was.', effects: { hunger: -30, health: 5 } },
    { id: 'ale', name: 'Liquid Courage', type: 'drink', category: 'Drink', cost: 5, description: 'Makes everyone prettier.', effects: { thirst: -15, mood: 10, stress: -10 } },
    { id: 'wine', name: 'Fancy Grape Juice', type: 'drink', category: 'Drink', cost: 25, description: 'Pinkies out!', effects: { thirst: -20, mood: 20, stress: -15 } },
    { id: 'water', name: 'Water', type: 'drink', category: 'Drink', cost: 0, description: 'Basic hydration. Only available at Inn or Estate.', effects: { thirst: -40 } },
    { id: 'shiny_trash', name: 'Shiny Trash', type: 'loot', category: 'Junk', cost: 0, description: 'It glitters! You refuse to throw it away, but a merchant might buy it.', effects: {} }
  ]
};

export const MAINTENANCE_ACTIONS = [
  { id: 'eat', label: 'Eat (Ration)', icon: 'Utensils', cost: 3, days: 0, costType: 'gp', type: 'maintenance', description: 'Noms. (-30 Hunger, +5 HP)', message: 'Ate something crunchy.', effects: { hunger: -30, health: 5 } },
  { id: 'drink_ale', label: 'Drink (Ale)', icon: 'Beer', cost: 5, days: 0, costType: 'gp', type: 'maintenance', description: 'Glug glug. (-15 Thirst, +10 Mood)', message: 'Refreshing!', effects: { thirst: -15, mood: 10, stress: -10 } },
  { id: 'drink_wine', label: 'Drink (Wine)', icon: 'Beer', cost: 25, days: 0, costType: 'gp', type: 'maintenance', description: 'Fancy glug. (-20 Thirst, +20 Mood)', message: 'Tastes expensive.', effects: { thirst: -20, mood: 20, stress: -15 } },
  { id: 'drink_water', label: 'Drink (Water)', icon: 'Droplets', cost: 0, days: 0, costType: 'gp', type: 'maintenance', description: 'Hydration. (-40 Thirst)', message: 'Crisp.', effects: { thirst: -40 } },
  { id: 'repair', label: 'Repair Gear', icon: 'Hammer', cost: 5, days: 0, costType: 'gp', type: 'maintenance', description: 'Fixing the dents. (-10 Stress)', message: 'Hammering out the dents.', effects: { stress: -10 } },
  { id: 'shitfaced', label: 'Get Shitfaced', icon: 'Beer', cost: 8, days: 0, costType: 'gp', type: 'maintenance', description: 'Limit 1/day. (+15 Mood, -15 Stress)', message: 'Huzzah!', effects: { mood: 15, stress: -15, hunger: -5, thirst: -10 } },
  { id: 'train', label: 'Train', icon: 'Activity', cost: 30, days: 1, costType: 'gp', type: 'maintenance', description: 'Hitting things. (+10 XP)', message: 'I feel stronger!', effects: { xp: 10, hunger: 20, thirst: 20 } },
  { id: 'sleep', label: 'Sleep', icon: 'Tent', cost: 0, days: 1, costType: 'gp', type: 'maintenance', description: 'End the day.', message: 'Zzz...', effects: {} },
];

export const JOB_DB = {
  tier1: [
    { id: 'job_field', label: 'Field Hand', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Pulling Weeds.', message: 'Farmer Maggot yells a lot.', effects: { gold: 8, xp: 5, hunger: 10, thirst: 10, stress: 5, mood: -5 } },
    { id: 'job_rats', label: 'Rat Catcher', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Poking Squeaky Things.', message: 'They bite back sometimes.', effects: { gold: 12, xp: 8, hunger: 10, thirst: 10, stress: 10, health: -2 } },
  ],
  tier2: [
    { id: 'job_dock', label: 'Dock Work', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Lifting Heavy Boxes.', message: 'My back hurts.', effects: { gold: 25, xp: 15, hunger: 20, thirst: 20, stress: 15, health: -5 } },
  ]
};

export const MAGIC_DB = {
  tier1: [
    { id: 'mag_scribe', label: 'Scribe Scroll', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Copying words of power.', message: 'My hand cramps.', effects: { gold: 15, xp: 10, hunger: 5, thirst: 5, stress: 15 } },
  ],
  tier2: [
    { id: 'mag_alchemist', label: 'Alchemist Aid', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Mixing volatile liquids.', message: 'Lost an eyebrow.', effects: { gold: 30, xp: 25, hunger: 10, thirst: 10, stress: 20, health: -5 } }
  ]
};

export const ADVENTURE_DB = {
  tier1: [
    { id: 'adv_rats', label: 'Giant Rats', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Rats of Unusual Size.', message: 'Why are they so big?!', effects: { gold: 15, xp: 20, hunger: 30, thirst: 30, stress: 20, health: -10 } },
  ],
  tier2: [
    { id: 'adv_bandits', label: 'Bandits', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Muggers in Masks.', message: 'Hey, that is MY gold!', effects: { gold: 50, xp: 60, hunger: 40, thirst: 40, stress: 30, health: -25 } },
  ],
  tier3: [
    { id: 'adv_lich', label: 'Lich Tomb', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'The Bone Zone.', message: 'Bad vibes in here.', effects: { gold: 200, xp: 250, hunger: 70, thirst: 70, stress: 60, health: -50 } },
  ]
};

export const SOCIAL_DB = {
  tier1: [
    { id: 'soc_gossip', label: 'Gossip', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Talking Smack.', message: 'Did you hear about the miller\'s wife?', effects: { xp: 10, mood: 10, hunger: 5, thirst: 5 } },
    { id: 'soc_beg', label: 'Begging', icon: 'Coins', cost: 0, days: 1, type: 'social', description: 'Spare a Copper?', message: 'Please? Pretty please?', effects: { gold: 5, mood: -5, hunger: 10, thirst: 10, stress: 10 } },
  ],
  tier2: [
    { id: 'soc_bribe', label: 'Bribe Guard', icon: 'Coins', cost: 20, days: 1, type: 'social', description: 'Greasing Palms.', message: 'Look the other way, pal.', effects: { xp: 30, stress: -10 } },
  ]
};

export const AUTONOMY_EVENTS = {
  minor: [
    { id: 'weird_shit', title: 'Ate Some Weird Dungeon Shit', text: '"Found unidentifiable jerky on the tavern floor and ate it."', effects: { health: -5, thirst: 20 } },
    { id: 'slept_armor', title: 'Slept in Full Armor', text: '"Who has time to unbuckle all these straps?"', effects: { stress: 10, mood: -5 } },
    { id: 'snake_oil', title: 'Snake Oil Sucker', text: '"Bought a premium health potion that is literally dyed tap water."', effects: { gold: -10, mood: -10 } },
    { id: 'stress_eat', title: 'Feral Stress Eating', text: '"I ate everything. All of it. I have no regrets."', effects: { hunger: -100, destroyRations: true } },
    { id: 'pissed_wizard', title: 'Pissed Off a Wizard', text: '"Insulted a spellcaster who practiced some kind of hairomancy on me."', effects: { mood: -10, stress: 10, applyCurse: 'dungeon_dye_job' } },
    { id: 'pet_rock', title: 'Adopted a Rock', text: '"He is my best friend and his name is Rocky."', effects: { applyCompanion: 'pet_rock' } },
    { id: 'edgy_rebrand', title: 'Edgy Rebrand', text: '"Call me Bloodhawk from now on."', effects: { mood: -5, edgyRebrand: true } },
    { id: 'slime', title: 'Covered in Slime', text: '"Why is everything so sticky?!"', effects: { applyCurse: 'butterfingers' } },
    { id: 'magic_beans', title: 'The "Magic" Beans', text: '"Bought a handful of completely mundane beans from a shady merchant."', effects: { gold: -5 } },
    { id: 'screaming', title: 'Practice Screaming', text: '"Decided 3 AM was the perfect time to practice my battle cry."', effects: { mood: -5, stress: 10 } },
  ],
  major: [
    { id: 'arrested', title: 'Arrested for Unhinged Shit', text: '"Caught doing something psychotic. Guards took my stuff."', effects: { gold: -20, confiscateRandom: true } },
    { id: 'pottery', title: 'Smashing Pottery', text: '"HYAAAH!"', effects: { housing: 'homeless', applyCurse: 'blacklist' } },
    { id: 'table_brawl', title: 'Drunken Brawl With a Table', text: '"Picked a fight with a support beam and lost badly."', effects: { health: -30, gold: -20, housing: 'homeless', applyCurse: 'blacklist' } },
    { id: 'paranoid_mimic', title: 'Paranoid Mimic Episode', text: '"Hallucinated the bedframe was a mimic and stabbed the shit out of it."', effects: { housing: 'homeless', stress: 20 } },
    { id: 'spontaneous_marriage', title: 'Spontaneous Marriage', text: '"What happens in the tavern... ends in a legally binding contract."', effects: { applyCompanion: 'spouse' } },
    { id: 'adopt_mimic', title: 'Adopted a Mimic', text: '"It followed me home. Can I keep it?"', effects: { applyCompanion: 'mimic' } },
    { id: 'groupie', title: 'Annoying Groupie Encounter', text: '"They will not stop talking about how great I am."', effects: { applyCompanion: 'groupie' } },
    { id: 'feral_goblin', title: 'Feral Goblin Encounter', text: '"Found a goblin. It lives in my backpack now."', effects: { applyCompanion: 'goblin' } },
    { id: 'cult', title: 'Joined a Cult', text: '"They are free of the burden of thinking for themselves."', effects: { applyCurse: 'cult_member' } },
    { id: 'shiny_belt', title: 'Found a Shiny Belt', text: '"I put it on and... oh. Oh my."', effects: { applyCurse: 'girdle' } },
    { id: 'bumped_head', title: 'Bumped Their Head', text: '"Who am I? What am I doing with my life?"', effects: { applyCurse: 'identity_crisis' } },
    { id: 'nightmare', title: 'Traumatizing Nightmare', text: '"The monsters... they have families too!"', effects: { applyCurse: 'pacifism' } },
  ]
};

export const QUIRKS = [
  { id: 'compulsive_looter', name: 'Compulsive Looter', desc: '10% chance to find +5g on Social interactions. Banned from Guard jobs.', effects: { socialGoldChance: 0.1, bannedJobs: ['job_guard'] } },
  { id: 'meathead', name: 'Meathead', desc: '+2 STR, -2 INT. Cannot perform Magic jobs.', effects: { stats: { str: 2, int: -2 }, bannedJobs: ['mag_scribe', 'mag_alchemist'] } },
  { id: 'drama_queen', name: 'Drama Queen', desc: 'Double Mood gain from Flirt/Tavern. Double Stress from failures.', effects: { moodMultiplier: 2, stressFailureMultiplier: 2 } },
  { id: 'iron_liver', name: 'Iron Liver', desc: 'Ale/Wine costs 50% less. Higher hangover/bad event chance when drinking.', effects: { drinkCostMultiplier: 0.5, badDrinkEventChance: 0.2 } },
  { id: 'shiny_syndrome', name: 'Shiny Syndrome', desc: '20% chance each morning to find random "Junk". Junk clutters inventory but sells for 1d4 Gold.', effects: { junkChance: 0.2 } }
];

export const COMPANIONS = {
  spouse: { id: 'spouse', name: 'Spontaneous Spouse', desc: 'Constantly nags. +15 Stress each morning.', effects: { morningStress: 15 }, removal: { id: 'remove_spouse', label: 'File for Annulment', cost: 50, days: 0, costType: 'gp', type: 'social', message: 'Signed the papers. Finally free.', effects: {} } },
  groupie: { id: 'groupie', name: 'Annoying Groupie', desc: 'Follows them everywhere and won\'t shut up about them. -15 Mood each morning.', effects: { morningMood: -15 }, removal: { id: 'remove_groupie', label: 'Crush Their Fucking Dreams', cost: 0, days: 0, costType: 'gp', type: 'social', message: 'Told them to shut up.', effects: {} } },
  goblin: { id: 'goblin', name: 'Feral Goblin', desc: 'Sneaks into the coin purse. Steals 1d4 Gold each morning.', effects: { morningTheft: true }, removal: { id: 'remove_goblin', label: 'Enroll in Trade School', cost: 25, days: 0, costType: 'gp', type: 'social', message: 'Sent the goblin to learn plumbing.', effects: {} } },
  mimic: { id: 'mimic', name: 'Adopted Mimic', desc: 'Intercepts 50% of the Hunger recovery from any food consumed.', effects: { foodLeech: 0.5 }, removal: { id: 'remove_mimic', label: 'Pawn on Gullible Merchant', cost: 10, days: 0, costType: 'gp', type: 'social', message: 'No refunds!', effects: {} } },
  pet_rock: { id: 'pet_rock', name: '"Lucky" Pet Rock', desc: 'Adds a permanent +5% Fail Chance to all Labor and Adventure rolls.', effects: { failPenalty: 0.05 }, removal: { id: 'remove_rock', label: 'Throw in River', cost: 0, days: 0, costType: 'gp', type: 'magic', message: 'Goodbye, Rocky.', effects: {} } }
};

export const CURSES = {
  blacklist: { id: 'blacklist', name: 'The Blacklist', desc: 'Banned from the Inn. Inn Room option is locked.', effects: { lockInn: true }, removal: { id: 'remove_blacklist', label: 'Bribe the Barkeep', cost: 15, days: 0, costType: 'gp', type: 'social', message: 'Bribed my way back inside.', effects: {} } },
  cult_member: { id: 'cult_member', name: 'Cult Member', desc: '+20 Mood, -20 Stress every morning. Forces Cultist Robes. Mandatory 10g daily donation.', effects: { morningMood: 20, morningStress: -20, forceEquip: 'cultist_robe', dailyDonation: 10 }, removal: { id: 'remove_cult', label: 'Deprogramming', cost: 30, days: 0, costType: 'gp', type: 'magic', message: 'I can think for myself again!', effects: {} } },
  identity_crisis: { id: 'identity_crisis', name: 'Identity Crisis', desc: 'Unequips all gear. Refuses to equip anything outside their new delusion.', effects: { unequipAll: true, forceClass: true }, removal: { autoRemoveFails: 3 } },
  pacifism: { id: 'pacifism', name: 'Sudden Pacifism', desc: 'Refuses to take Combat Adventures.', effects: { lockAdventures: true }, removal: { autoRemoveTasks: 2 } },
  butterfingers: { id: 'butterfingers', name: 'Butterfingers', desc: '+10% Fail Chance on all Combat Adventures due to slime.', effects: { combatFailPenalty: 0.1 }, removal: { sleepEstate: true, getShitfaced: true } },
  dungeon_dye_job: { id: 'dungeon_dye_job', name: 'Dungeon Dye Job', desc: 'Hair changes to a neon color or terrible style. Removal: Natural 5 days, or "Visit the Barber" Free Action (10g).', effects: { visualOverride: 'neon_hair' }, removal: { id: 'remove_dye', label: 'Visit the Barber', cost: 10, days: 0, costType: 'gp', type: 'social', message: 'Fixed my hair.', effects: {} } },
  girdle: { id: 'girdle', name: 'Girdle of Opposite Gender', desc: 'The sprite dynamically swaps genders.', effects: { visualOverride: 'swap_gender' }, removal: { id: 'remove_girdle', label: 'Remove Curse (Temple)', cost: 50, days: 0, costType: 'gp', type: 'magic', message: 'The curse is broken.', effects: {} } }
};

export const LOCATIONS = {
  village_road: {
    id: 'village_road', name: 'Village Road', type: 'homeless', description: 'A Nice Patch of Dirt. (0g)',
    details: "Nature is my blanket. Living on the road is hard on the body and mind.", dailyCost: 0, hasFoodService: false, 
    modifiers: { rest: { health: 5, stress: -5, mood: -10, hunger: 15, thirst: 15 } }
  },
  inn_room: {
    id: 'inn_room', name: 'Rusty Spoon Inn', type: 'renting', description: 'Lumpy Mattress. (5g/day)',
    details: "Beats the dirt. A warm bed and a roof.", dailyCost: 5, hasFoodService: true, 
    modifiers: { rest: { health: 15, stress: -10, mood: 0, hunger: 5, thirst: 5 } }
  },
  estate: {
    id: 'estate', name: 'Estate', type: 'owned', description: 'Fancy House. (50g/day)',
    details: "I am basically a noble now. Luxury living.", dailyCost: 50, hasFoodService: true,
    modifiers: { rest: { health: 30, stress: -40, mood: 20, hunger: -100, thirst: -100 } }
  }
};

export const APPEARANCE_OPTIONS = {
  skinTones: [
    { id: 'pale', label: 'Pale', color: '#f3e5dc', shadow: '#e0c8b8' }, { id: 'fair', label: 'Fair', color: '#eecfa1', shadow: '#dcb386' },
    { id: 'tan', label: 'Tan', color: '#d4a373', shadow: '#b07d4e' }, { id: 'dark', label: 'Dark', color: '#8d5524', shadow: '#6e3b12' },
    { id: 'deep', label: 'Deep', color: '#3b2219', shadow: '#2a1810' },
  ],
  hairColors: [
    { id: 'black', label: 'Black', color: '#09090b' }, { id: 'brown', label: 'Brown', color: '#3f2307' },
    { id: 'blonde', label: 'Blonde', color: '#ca8a04' }, { id: 'red', label: 'Red', color: '#7f1d1d' },
    { id: 'grey', label: 'Grey', color: '#9ca3af' }, { id: 'white', label: 'White', color: '#f3f4f6' },
  ],
  eyeColors: [
    { id: 'blue', label: 'Blue', color: '#3b82f6' }, { id: 'green', label: 'Green', color: '#22c55e' },
    { id: 'brown', label: 'Brown', color: '#451a03' }, { id: 'hazel', label: 'Hazel', color: '#854d0e' },
    { id: 'red', label: 'Red', color: '#ef4444' },
  ],
  hairStyles: [
    { id: 'bald', label: 'Bald' }, { id: 'short', label: 'Short' }, { id: 'long', label: 'Long' },
  ]
};
