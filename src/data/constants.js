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
    { id: 'ration', name: 'Dungeon Ration', type: 'food', category: 'Food', cost: 8, description: 'Hard, tasteless survival biscuit.', effects: { hunger: -40, health: 10, stress: -5 } },
    { id: 'hardtack', name: 'Hardtack & Cheese', type: 'food', category: 'Food', cost: 12, description: 'Might crack a tooth.', effects: { hunger: -50, health: 15 } },
    { id: 'courage', name: 'Bottled Courage', type: 'drink', category: 'Drink', cost: 15, description: 'Smells like bad decisions.', effects: { thirst: -30, mood: 15, stress: -10 } },
    { id: 'mushroom', name: 'Suspicious Mushroom', type: 'food', category: 'Food', cost: 5, description: 'It pulses slightly when you touch it.', effects: { hunger: -20, random_mood_stress: 20 } },
    { id: 'spring_water', name: 'Vial of Spring Water', type: 'drink', category: 'Drink', cost: 10, description: 'Actually clean.', effects: { thirst: -50, health: 10 } },
    { id: 'stout', name: 'Dwarven Stout', type: 'drink', category: 'Drink', cost: 20, description: 'Thick as stew.', effects: { thirst: -40, stress: -20, mood: 15 } },
    { id: 'shiny_trash', name: 'Shiny Trash', type: 'loot', category: 'Junk', cost: 0, description: 'It glitters! You refuse to throw it away, but a merchant might buy it.', effects: {} }
  ]
};

export const MAINTENANCE_ACTIONS = [
  { id: 'scrounge', label: 'Scrounge for Scraps', icon: 'Utensils', cost: 0, days: 0, costType: 'gp', type: 'maintenance', description: 'Desperate times. (-15 Hunger, +5 Stress, -2 HP)', reqLocation: 'any', effects: { hunger: -15, stress: 5, health: -2 } },
  { id: 'drink_puddle', label: 'Drink Puddle Water', icon: 'Droplets', cost: 0, days: 0, costType: 'gp', type: 'maintenance', description: 'Muddy. (-20 Thirst, +5 Stress, -5 Mood)', reqLocation: 'any', effects: { thirst: -20, stress: 5, mood: -5 } },
  { id: 'scream', label: 'Scream into the Void', icon: 'Activity', cost: 0, days: 0, costType: 'gp', type: 'maintenance', description: 'Therapeutic. (+10 Mood, -5 Stress, +10 Thirst)', reqLocation: 'any', effects: { mood: 10, stress: -5, thirst: 10 } },
  { id: 'shadowbox', label: 'Shadowboxing (Train)', icon: 'Hammer', cost: 0, days: 1, costType: 'gp', type: 'maintenance', description: 'Basic workout. (+5 XP, +15 Hunger/Thirst)', reqLocation: 'any', effects: { xp: 5, hunger: 15, thirst: 15 } },

  { id: 'eat_slop', label: 'Order Tavern Slop', icon: 'Utensils', cost: 3, days: 0, costType: 'gp', type: 'maintenance', description: 'Questionable meat. (-30 Hunger)', reqLocation: 'inn_room', effects: { hunger: -30 } },
  { id: 'drink_tap', label: 'Order Tap Water', icon: 'Droplets', cost: 0, days: 0, costType: 'gp', type: 'maintenance', description: 'Cleanish. (-40 Thirst)', reqLocation: 'inn_room', effects: { thirst: -40 } },
  { id: 'drink_ale', label: 'Order Cheap Ale', icon: 'Beer', cost: 5, days: 0, costType: 'gp', type: 'maintenance', description: 'Glug glug. (-15 Thirst, -5 Stress)', reqLocation: 'inn_room', effects: { thirst: -15, stress: -5 } },
  { id: 'repair', label: 'Repair Gear', icon: 'Hammer', cost: 5, days: 0, costType: 'gp', type: 'maintenance', description: 'Fixing dents. (-10 Stress)', reqLocation: 'inn_room', effects: { stress: -10 } },
  { id: 'shitfaced', label: 'Get Shitfaced', icon: 'Beer', cost: 8, days: 0, costType: 'gp', type: 'maintenance', description: 'Limit 1/day. (+15 Mood, -15 Stress)', reqLocation: 'inn_room', effects: { mood: 15, stress: -15, hunger: -5, thirst: -10 } },
  { id: 'basic_train', label: 'Basic Training', icon: 'Shield', cost: 30, days: 1, costType: 'gp', type: 'maintenance', description: 'Hitting dummies. (+10 XP)', reqLocation: 'inn_room', effects: { xp: 10, hunger: 20, thirst: 20 } },

  { id: 'eat_feast', label: 'Order Gourmet Feast', icon: 'Utensils', cost: 40, days: 0, costType: 'gp', type: 'maintenance', description: 'Luxurious. (-100 Hunger, +50 HP)', reqLocation: 'estate', effects: { hunger: -100, health: 50, mood: 10, stress: -20 } },
  { id: 'drink_wine', label: 'Order Elven Vintage', icon: 'Beer', cost: 50, days: 0, costType: 'gp', type: 'maintenance', description: 'Exquisite. (-100 Thirst, +40 Mood)', reqLocation: 'estate', effects: { thirst: -100, mood: 40, stress: -40 } },
  { id: 'polish', label: 'Mastercraft Polish', icon: 'Hammer', cost: 20, days: 0, costType: 'gp', type: 'maintenance', description: 'So shiny. (-25 Stress)', reqLocation: 'estate', effects: { stress: -25 } },
  { id: 'hire_bard', label: 'Hire a Bard', icon: 'User', cost: 40, days: 0, costType: 'gp', type: 'maintenance', description: 'Limit 1/day. (+30 Mood, -40 Stress)', reqLocation: 'estate', effects: { mood: 30, stress: -40 } },
  { id: 'elite_train', label: 'Elite Tutor (Train)', icon: 'Shield', cost: 150, days: 1, costType: 'gp', type: 'maintenance', description: 'Masterclass. (+60 XP)', reqLocation: 'estate', effects: { xp: 60, hunger: 20, thirst: 20 } },

  { id: 'sleep', label: 'Sleep', icon: 'Tent', cost: 0, days: 1, costType: 'gp', type: 'maintenance', description: 'End the day.', reqLocation: 'any', effects: {} },
];

export const JOB_DB = {
  tier1: [
    { id: 'job_field', label: 'Field Hand', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Pulling Weeds.', message: 'Farmer Maggot yells a lot.', effects: { gold: 8, xp: 5, hunger: 10, thirst: 10, stress: 5, mood: -5 } },
    { id: 'job_rats', label: 'Rat Catcher', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Poking Squeaky Things.', message: 'They bite back sometimes.', effects: { gold: 12, xp: 8, hunger: 10, thirst: 10, stress: 10, health: -2 } },
    { id: 'job_sweep', label: 'Sweeping Taverns', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Cleaning Up Puke.', message: 'Smells awful.', effects: { gold: 6, xp: 6, hunger: 5, thirst: 5, stress: 5, mood: -2 } },
    { id: 'job_manure', label: 'Shoveling Manure', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Building Character.', message: 'It got in my boots.', effects: { gold: 10, xp: 5, hunger: 15, thirst: 15, stress: 10, mood: -10 } },
    { id: 'job_wood', label: 'Chopping Wood', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Swinging an Axe.', message: 'Got a splinter.', effects: { gold: 15, xp: 10, hunger: 20, thirst: 20, stress: 15, health: -5 } },
    { id: 'job_ditch', label: 'Digging Ditches', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'A Literal Hole.', message: 'My back hurts.', effects: { gold: 10, xp: 12, hunger: 15, thirst: 15, stress: 10, health: -5 } }
  ],
  tier2: [
    { id: 'job_dock', label: 'Dock Work', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Lifting Heavy Boxes.', message: 'Don\'t drop it!', effects: { gold: 25, xp: 15, hunger: 20, thirst: 20, stress: 15, health: -5 } },
    { id: 'job_mason', label: 'Masonry Assist', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Hauling Stones.', message: 'Heavy labor.', effects: { gold: 30, xp: 20, hunger: 25, thirst: 25, stress: 20, health: -10 } },
    { id: 'job_smith', label: 'Blacksmith Bellows', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Sweating Profusely.', message: 'It is so hot.', effects: { gold: 20, xp: 25, hunger: 30, thirst: 30, stress: 15, health: -5 } },
    { id: 'job_load', label: 'Caravan Loader', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Packing Wagons.', message: 'Almost tipped over.', effects: { gold: 22, xp: 18, hunger: 15, thirst: 15, stress: 10, mood: -5 } },
    { id: 'job_grave', label: 'Gravedigger', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Night Shift Shoveling.', message: 'Spooky work.', effects: { gold: 35, xp: 15, hunger: 20, thirst: 20, stress: 25, mood: -15 } },
    { id: 'job_log', label: 'Logging', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Yelling Timber.', message: 'Watch out below.', effects: { gold: 28, xp: 22, hunger: 25, thirst: 25, stress: 20, health: -10 } }
  ],
  tier3: [
    { id: 'job_siege', label: 'Siege Engineer', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Moving Catapults.', message: 'Fire in the hole!', effects: { gold: 50, xp: 40, hunger: 30, thirst: 30, stress: 30, health: -15 } },
    { id: 'job_quarry', label: 'Quarry Worker', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Breaking Big Rocks.', message: 'Smash smash smash.', effects: { gold: 60, xp: 35, hunger: 40, thirst: 40, stress: 25, health: -20 } },
    { id: 'job_ogre', label: 'Ogre Dummy', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Practice Target.', message: 'Everything hurts.', effects: { gold: 80, xp: 50, hunger: 20, thirst: 20, stress: 40, health: -40 } },
    { id: 'job_castle', label: 'Castle Construction', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Laying Granite.', message: 'Don\'t look down.', effects: { gold: 55, xp: 45, hunger: 35, thirst: 35, stress: 20, health: -10 } },
    { id: 'job_smelt', label: 'Smelter', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Melting Ore.', message: 'Searing heat.', effects: { gold: 70, xp: 30, hunger: 50, thirst: 50, stress: 35, health: -15 } },
    { id: 'job_mine', label: 'Mine Clearing', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Digging the Deep Dark.', message: 'Hard to breathe.', effects: { gold: 45, xp: 60, hunger: 30, thirst: 30, stress: 40, health: -25 } }
  ],
  tier4: [
    { id: 'job_scale', label: 'Scale Polisher', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Scrubbing Dragons.', message: 'Mind the teeth.', effects: { gold: 120, xp: 90, hunger: 40, thirst: 40, stress: 50, health: -25 } },
    { id: 'job_troll', label: 'Troll Bridge Maint.', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Dodging Tolls.', message: 'Repaired the planks.', effects: { gold: 100, xp: 110, hunger: 45, thirst: 45, stress: 45, health: -30 } },
    { id: 'job_core', label: 'Deep Core Mining', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Sweating Lava.', message: 'Found some gems.', effects: { gold: 150, xp: 80, hunger: 60, thirst: 60, stress: 60, health: -20 } },
    { id: 'job_pedi', label: 'Giant\'s Pedicurist', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Gross but Lucrative.', message: 'Used a pickaxe on a toenail.', effects: { gold: 200, xp: 70, hunger: 30, thirst: 30, stress: 80, health: -40, mood: -30 } },
    { id: 'job_golem', label: 'Golem Assembly', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Heavy Lifting.', message: 'Bolted the arm on.', effects: { gold: 130, xp: 120, hunger: 50, thirst: 50, stress: 40, health: -15 } },
    { id: 'job_ash', label: 'Ash Sweeper', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Cleaning Volcanos.', message: 'Cough cough.', effects: { gold: 110, xp: 100, hunger: 70, thirst: 70, stress: 50, health: -35 } }
  ],
  tier5: [
    { id: 'job_rift', label: 'Abyssal Rift Sealer', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Pushing Demons Back.', message: 'Slammed the door on hell.', effects: { gold: 300, xp: 250, hunger: 80, thirst: 80, stress: 70, health: -50 } },
    { id: 'job_tooth', label: 'Titan Tooth Extract', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Pulling God-Teeth.', message: 'Tied it to a dragon and pulled.', effects: { gold: 400, xp: 200, hunger: 50, thirst: 50, stress: 90, health: -70 } },
    { id: 'job_meteor', label: 'Meteor Forging', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Hammering Stars.', message: 'Forged a star core.', effects: { gold: 350, xp: 280, hunger: 90, thirst: 90, stress: 60, health: -40 } },
    { id: 'job_atlas', label: 'Atlas\'s Stand-In', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Holding the Sky.', message: 'Legs are shaking.', effects: { gold: 250, xp: 400, hunger: 100, thirst: 100, stress: 80, health: -80 } },
    { id: 'job_void', label: 'Void Sweeper', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Vacuuming Nothing.', message: 'It stares back.', effects: { gold: 500, xp: 300, hunger: 60, thirst: 60, stress: 100, health: -30, mood: -50 } },
    { id: 'job_star', label: 'Star Core Mining', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'It\'s Very Hot.', message: 'Mined pure plasma.', effects: { gold: 450, xp: 350, hunger: 100, thirst: 100, stress: 90, health: -60 } }
  ]
};

export const ADVENTURE_DB = {
  tier1: [
    { id: 'adv_rats', label: 'Giant Rats', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Rats of Unusual Size.', message: 'Why are they so big?!', effects: { gold: 15, xp: 20, hunger: 30, thirst: 30, stress: 20, health: -10 } },
    { id: 'adv_goblin', label: 'Goblin Scouts', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Knee-high Menaces.', message: 'Punted a goblin.', effects: { gold: 20, xp: 25, hunger: 35, thirst: 35, stress: 25, health: -15 } },
    { id: 'adv_slime', label: 'Slime Infestation', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Jiggly Acid Cubes.', message: 'Now my boots are melting.', effects: { gold: 10, xp: 30, hunger: 20, thirst: 20, stress: 30, health: -5 } },
    { id: 'adv_dogs', label: 'Feral Dogs', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Bad Doggos.', message: 'They took my lunch.', effects: { gold: 18, xp: 15, hunger: 25, thirst: 25, stress: 15, health: -12 } },
    { id: 'adv_drunk', label: 'Drunken Militia', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Tavern Brawl Targets.', message: 'Threw a chair.', effects: { gold: 25, xp: 10, hunger: 20, thirst: 20, stress: 20, health: -20 } },
    { id: 'adv_bees', label: 'Angry Swarm', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Very Big Bees.', message: 'So many stingers.', effects: { gold: 5, xp: 35, hunger: 40, thirst: 40, stress: 40, health: -5 } }
  ],
  tier2: [
    { id: 'adv_bandits', label: 'Bandits', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Muggers in Masks.', message: 'Hey, that is MY gold!', effects: { gold: 50, xp: 60, hunger: 40, thirst: 40, stress: 30, health: -25 } },
    { id: 'adv_undead', label: 'Undead Thralls', icon: 'Skull', cost: 0, days: 2, type: 'adventure', description: 'Walking Skeletons.', message: 'Bones shattered.', effects: { gold: 40, xp: 50, hunger: 30, thirst: 30, stress: 40, health: -20 } },
    { id: 'adv_orc', label: 'Orc Raiding Party', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Green and Mean.', message: 'Barely survived that charge.', effects: { gold: 65, xp: 75, hunger: 50, thirst: 50, stress: 35, health: -35 } },
    { id: 'adv_harpy', label: 'Harpy Nest', icon: 'Skull', cost: 0, days: 2, type: 'adventure', description: 'Screeching Bird-Ladies.', message: 'My ears are ringing.', effects: { gold: 45, xp: 55, hunger: 35, thirst: 35, stress: 45, health: -15 } },
    { id: 'adv_cult', label: 'Cultist Cell', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Robed Weirdos.', message: 'Stopped a dark ritual.', effects: { gold: 55, xp: 80, hunger: 45, thirst: 45, stress: 50, health: -20 } },
    { id: 'adv_troll', label: 'Cave Troll', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Regenerating Problem.', message: 'Used a lot of fire.', effects: { gold: 80, xp: 100, hunger: 60, thirst: 60, stress: 40, health: -50 } }
  ],
  tier3: [
    { id: 'adv_lich', label: 'Lich Tomb', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'The Bone Zone.', message: 'Bad vibes in here.', effects: { gold: 200, xp: 250, hunger: 70, thirst: 70, stress: 60, health: -50 } },
    { id: 'adv_vamp', label: 'Vampire Lord', icon: 'Skull', cost: 0, days: 4, type: 'adventure', description: 'Dracula\'s Cousin.', message: 'Garlic actually worked.', effects: { gold: 180, xp: 220, hunger: 60, thirst: 60, stress: 70, health: -45 } },
    { id: 'adv_mino', label: 'Minotaur Maze', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'Bring Some String.', message: 'Got lost, but won.', effects: { gold: 150, xp: 200, hunger: 80, thirst: 80, stress: 50, health: -60 } },
    { id: 'adv_war', label: 'Warlock Tower', icon: 'Skull', cost: 0, days: 4, type: 'adventure', description: 'Magical Traps Everywhere.', message: 'Dodged the lasers.', effects: { gold: 160, xp: 280, hunger: 50, thirst: 50, stress: 80, health: -40 } },
    { id: 'adv_wyrm', label: 'Dragon Wyrmling', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'A Very Angry Baby.', message: 'Almost got roasted.', effects: { gold: 250, xp: 300, hunger: 90, thirst: 90, stress: 60, health: -70 } },
    { id: 'adv_ghost', label: 'Ghost Ship', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'Nautical Nightmares.', message: 'Fought off phantoms.', effects: { gold: 190, xp: 260, hunger: 65, thirst: 65, stress: 90, health: -30 } }
  ],
  tier4: [
    { id: 'adv_beholder', label: 'Beholder Lair', icon: 'Skull', cost: 0, days: 7, type: 'adventure', description: 'Floating Eye Stalks.', message: 'Dodged the death rays.', effects: { gold: 400, xp: 500, hunger: 90, thirst: 90, stress: 90, health: -70 } },
    { id: 'adv_demon', label: 'Arch-Demon', icon: 'Skull', cost: 0, days: 6, type: 'adventure', description: 'Straight from Hell.', message: 'Banished it back.', effects: { gold: 450, xp: 600, hunger: 80, thirst: 80, stress: 100, health: -80 } },
    { id: 'adv_illithid', label: 'Illithid Colony', icon: 'Skull', cost: 0, days: 7, type: 'adventure', description: 'Mind-Flaying Fun.', message: 'My brain hurts.', effects: { gold: 350, xp: 700, hunger: 70, thirst: 70, stress: 100, health: -60 } },
    { id: 'adv_knight', label: 'Death Knight', icon: 'Skull', cost: 0, days: 6, type: 'adventure', description: 'Edge-Lord on a Horse.', message: 'Broke his dark blade.', effects: { gold: 380, xp: 550, hunger: 85, thirst: 85, stress: 80, health: -90 } },
    { id: 'adv_kraken', label: 'Kraken Attack', icon: 'Skull', cost: 0, days: 7, type: 'adventure', description: 'Calamari Defense.', message: 'Chopped off a tentacle.', effects: { gold: 500, xp: 450, hunger: 100, thirst: 100, stress: 70, health: -85 } },
    { id: 'adv_elder', label: 'Elder Elemental', icon: 'Skull', cost: 0, days: 7, type: 'adventure', description: 'Angry Nature.', message: 'Calmed the storm.', effects: { gold: 420, xp: 650, hunger: 95, thirst: 95, stress: 85, health: -75 } }
  ],
  tier5: [
    { id: 'adv_dragon', label: 'Ancient Red Dragon', icon: 'Skull', cost: 0, days: 10, type: 'adventure', description: 'Absolute Fire Hazard.', message: 'Slayed the great wyrm.', effects: { gold: 1000, xp: 1200, hunger: 100, thirst: 100, stress: 100, health: -150 } },
    { id: 'adv_abyss', label: 'Abyssal Lord', icon: 'Skull', cost: 0, days: 10, type: 'adventure', description: 'The Big Boss.', message: 'Saved the realm.', effects: { gold: 1200, xp: 1500, hunger: 100, thirst: 100, stress: 100, health: -140 } },
    { id: 'adv_tarrasque', label: 'Tarrasque', icon: 'Skull', cost: 0, days: 10, type: 'adventure', description: 'Godzilla\'s Cousin.', message: 'Put it back to sleep.', effects: { gold: 800, xp: 1000, hunger: 100, thirst: 100, stress: 100, health: -200 } },
    { id: 'adv_lichking', label: 'Lich King', icon: 'Skull', cost: 0, days: 10, type: 'adventure', description: 'The Final Bone Zone.', message: 'Shattered the phylactery.', effects: { gold: 1100, xp: 1800, hunger: 100, thirst: 100, stress: 100, health: -120 } },
    { id: 'adv_god', label: 'God\'s Avatar', icon: 'Skull', cost: 0, days: 10, type: 'adventure', description: 'Fighting Religion.', message: 'Punched a deity.', effects: { gold: 1500, xp: 2000, hunger: 100, thirst: 100, stress: 100, health: -160 } },
    { id: 'adv_eater', label: 'The World Eater', icon: 'Skull', cost: 0, days: 10, type: 'adventure', description: 'Apocalypse Cancelled.', message: 'Not today, end of days.', effects: { gold: 2000, xp: 2500, hunger: 100, thirst: 100, stress: 100, health: -180 } }
  ]
};

export const SOCIAL_DB = {
  tier1: [
    { id: 'soc_gossip', label: 'Gossip', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Talking Smack.', message: 'Did you hear about the miller\'s wife?', effects: { xp: 10, mood: 10, hunger: 5, thirst: 5 } },
    { id: 'soc_beg', label: 'Begging', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Spare a Copper?', message: 'Please? Pretty please?', effects: { gold: 5, hunger: 10, thirst: 10, stress: 10, mood: -5 } },
    { id: 'soc_perf', label: 'Street Performing', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Juggling Badly.', message: 'They threw a copper.', effects: { gold: 8, xp: 5, hunger: 15, thirst: 15, mood: 5 } },
    { id: 'soc_haggle', label: 'Haggling Practice', icon: 'User', cost: 5, days: 1, type: 'social', description: 'Arguing over Cabbages.', message: 'MY CABBAGES!', effects: { xp: 20, hunger: 5, thirst: 5, stress: 5 } },
    { id: 'soc_flyer', label: 'Handing out Flyers', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Annoying Pedestrians.', message: 'Take one, please.', effects: { gold: 10, hunger: 20, thirst: 20, stress: 10, mood: -10 } },
    { id: 'soc_intimidate', label: 'Intimidate a Child', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Stealing Candy.', message: 'Easy mark.', effects: { gold: 2, xp: 15, hunger: 5, thirst: 5, mood: -20 } }
  ],
  tier2: [
    { id: 'soc_bribe', label: 'Bribe Guard', icon: 'User', cost: 20, days: 1, type: 'social', description: 'Greasing Palms.', message: 'Look the other way, pal.', effects: { xp: 30, stress: -10 } },
    { id: 'soc_taunt', label: 'Taunt Rival', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Starting Drama.', message: 'Your mother was a hamster!', effects: { xp: 15, stress: 15, mood: 20 } },
    { id: 'soc_union', label: 'Union Organizing', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Agitating Laborers.', message: 'Strike! Strike!', effects: { gold: 20, xp: 40, hunger: 20, thirst: 20, stress: 25, mood: -10 } },
    { id: 'soc_fraud', label: 'Petty Fraud', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Fake Charity Drive.', message: 'It is for the orphans.', effects: { gold: 40, xp: 10, hunger: 10, thirst: 10, stress: 30, mood: -15 } },
    { id: 'soc_fortune', label: 'Fake Fortune Teller', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Making up Futures.', message: 'I see a tall dark stranger.', effects: { gold: 30, xp: 25, hunger: 15, thirst: 15, stress: 15 } },
    { id: 'soc_mayor', label: 'Local Politics', icon: 'User', cost: 10, days: 1, type: 'social', description: 'Running for Mayor.', message: 'Vote for me.', effects: { xp: 50, hunger: 10, thirst: 10, stress: 40, mood: -20 } }
  ],
  tier3: [
    { id: 'soc_blackmail', label: 'Blackmail Noble', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Extortion 101.', message: 'I know what you did.', effects: { gold: 100, xp: 50, hunger: 20, thirst: 20, stress: 60 } },
    { id: 'soc_envoy', label: 'Diplomatic Envoy', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Fancy Negotiation.', message: 'Peace in our time.', effects: { gold: 50, xp: 100, hunger: 15, thirst: 15, stress: 40, mood: 15 } },
    { id: 'soc_cult', label: 'Cult Infiltration', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Pretending to care.', message: 'Praise the dark lord, etc.', effects: { gold: 80, xp: 80, hunger: 25, thirst: 25, stress: 80, mood: -25 } },
    { id: 'soc_smear', label: 'Smear Campaign', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Ruining Reputations.', message: 'He eats kittens!', effects: { gold: 60, xp: 60, hunger: 20, thirst: 20, stress: 50, mood: -30 } },
    { id: 'soc_speech', label: 'Inspiring Speech', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Hyping the Crowd.', message: 'For glory!', effects: { xp: 120, hunger: 30, thirst: 30, stress: 20, mood: 30 } },
    { id: 'soc_con', label: 'Conning a Merchant', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Selling Fake Relics.', message: 'It belonged to a saint.', effects: { gold: 120, xp: 30, hunger: 15, thirst: 15, stress: 50, mood: -10 } }
  ],
  tier4: [
    { id: 'soc_jester', label: 'Royal Court Jester', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Entertaining the King.', message: 'Dance monkey, dance.', effects: { gold: 150, xp: 100, hunger: 30, thirst: 30, stress: 70, mood: -40 } },
    { id: 'soc_rebel', label: 'Inciting Rebellion', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Overthrowing Government.', message: 'Burn it down!', effects: { gold: 100, xp: 200, hunger: 40, thirst: 40, stress: 80, mood: 20 } },
    { id: 'soc_seduce', label: 'Seducing a Dragon', icon: 'User', cost: 0, days: 1, type: 'social', description: 'The Bard Classic.', message: 'Hey good lookin.', effects: { xp: 300, hunger: 50, thirst: 50, stress: 90, mood: 50 } },
    { id: 'soc_pact', label: 'Demonic Pact', icon: 'User', cost: 50, days: 1, type: 'social', description: 'Selling Someone\'s Soul.', message: 'Sign on the dotted line.', effects: { xp: 250, hunger: 10, thirst: 10, stress: 100, mood: -50 } },
    { id: 'soc_rig', label: 'Rigging an Election', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Stuffing Ballots.', message: 'Democracy in action.', effects: { gold: 200, xp: 150, hunger: 20, thirst: 20, stress: 60, mood: -30 } },
    { id: 'soc_frame', label: 'Frame a Duke', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Planting Evidence.', message: 'It was him!', effects: { gold: 250, xp: 120, hunger: 25, thirst: 25, stress: 80, mood: -40 } }
  ],
  tier5: [
    { id: 'soc_bribegod', label: 'Bribing a God', icon: 'User', cost: 500, days: 1, type: 'social', description: 'Buying Divine Favor.', message: 'Take the gold, almighty.', effects: { xp: 500, hunger: 10, thirst: 10, stress: -50 } },
    { id: 'soc_treaty', label: 'Interplanar Treaty', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Stopping Cosmic War.', message: 'Signed with angel blood.', effects: { gold: 300, xp: 600, hunger: 30, thirst: 30, stress: 80, mood: 40 } },
    { id: 'soc_usurp', label: 'Usurping a Throne', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Taking the Crown.', message: 'Look at me, I am the King now.', effects: { gold: 800, xp: 400, hunger: 50, thirst: 50, stress: 100, mood: -50 } },
    { id: 'soc_godhood', label: 'Declaring Godhood', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Cult of Personality.', message: 'Worship me!', effects: { xp: 1000, hunger: 80, thirst: 80, stress: 100, mood: 100 } },
    { id: 'soc_sphinx', label: 'Gaslighting a Sphinx', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Solving Riddles with Lies.', message: 'No, YOU are wrong.', effects: { gold: 500, xp: 500, hunger: 20, thirst: 20, stress: 100 } },
    { id: 'soc_country', label: 'Buying a Country', icon: 'User', cost: 1000, days: 1, type: 'social', description: 'Extreme Real Estate.', message: 'Mine now.', effects: { xp: 800, hunger: 10, thirst: 10, stress: 50, mood: 50 } }
  ]
};

export const MAGIC_DB = {
  tier1: [
    { id: 'mag_scribe', label: 'Scribe Scroll', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Copying words of power.', message: 'My hand cramps.', effects: { gold: 15, xp: 10, hunger: 5, thirst: 5, stress: 15 } },
    { id: 'mag_weed', label: 'Identify Weed', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Magic Botany.', message: 'Yep, that is grass.', effects: { gold: 10, xp: 15, hunger: 10, thirst: 10, stress: 10 } },
    { id: 'mag_illus', label: 'Minor Illusions', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Parlor Tricks.', message: 'A coin behind the ear.', effects: { gold: 12, xp: 12, hunger: 10, thirst: 10, stress: 15, mood: 5 } },
    { id: 'mag_spark', label: 'Sparking Campfires', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Being a Human Lighter.', message: 'Fwoosh.', effects: { gold: 8, xp: 8, hunger: 5, thirst: 5, stress: 5 } },
    { id: 'mag_sort', label: 'Sorting Potions', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Don\'t Mix the Red Ones.', message: 'Very tedious.', effects: { gold: 20, xp: 5, hunger: 15, thirst: 15, stress: 20 } },
    { id: 'mag_vial', label: 'Cleaning Vials', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Washing Beakers.', message: 'Smells funny.', effects: { gold: 5, xp: 20, hunger: 10, thirst: 10, stress: 10, mood: -5 } }
  ],
  tier2: [
    { id: 'mag_alchemist', label: 'Alchemist Aid', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Mixing volatile liquids.', message: 'Lost an eyebrow.', effects: { gold: 30, xp: 25, hunger: 10, thirst: 10, stress: 20, health: -5 } },
    { id: 'mag_enchant', label: 'Enchanting Daggers', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Making Things Glow.', message: 'It sparkles now.', effects: { gold: 40, xp: 20, hunger: 15, thirst: 15, stress: 30, health: -10 } },
    { id: 'mag_hex', label: 'Breaking Hexes', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Basic Dispel.', message: 'Curse lifted.', effects: { gold: 25, xp: 40, hunger: 15, thirst: 15, stress: 40, mood: -5 } },
    { id: 'mag_fam', label: 'Summon Familiar', icon: 'Zap', cost: 10, days: 1, type: 'magic', description: 'Binding a Magic Pet.', message: 'Hello, little toad.', effects: { xp: 50, hunger: 20, thirst: 20, stress: 25, mood: 10 } },
    { id: 'mag_brew', label: 'Brewing Antidotes', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Tasting Poisons.', message: 'Spicy.', effects: { gold: 35, xp: 30, hunger: 10, thirst: 10, stress: 25, health: -5 } },
    { id: 'mag_rune', label: 'Translating Runes', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Reading Old Rocks.', message: 'Just a grocery list.', effects: { gold: 20, xp: 45, hunger: 5, thirst: 5, stress: 35, mood: -10 } }
  ],
  tier3: [
    { id: 'mag_scry', label: 'Scrying for Nobles', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Spying via Crystal Ball.', message: 'I see all.', effects: { gold: 80, xp: 60, hunger: 15, thirst: 15, stress: 50 } },
    { id: 'mag_weather', label: 'Weather Control', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Making it Rain.', message: 'Lightning struck close.', effects: { gold: 60, xp: 80, hunger: 30, thirst: 30, stress: 60, health: -15 } },
    { id: 'mag_golem', label: 'Golem Programming', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Writing Arcane Logic.', message: 'IF ENEMY THEN PUNCH.', effects: { gold: 100, xp: 50, hunger: 20, thirst: 20, stress: 40, health: -10 } },
    { id: 'mag_bind', label: 'Binding Elementals', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Tying Fire to a Rock.', message: 'Hot hands.', effects: { gold: 70, xp: 90, hunger: 25, thirst: 25, stress: 70, health: -20 } },
    { id: 'mag_curse', label: 'Curse Removal', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Healing the Damned.', message: 'Demons be gone.', effects: { gold: 50, xp: 110, hunger: 20, thirst: 20, stress: 80, mood: -15 } },
    { id: 'mag_ley', label: 'Leyline Tapping', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Siphoning the Earth.', message: 'Raw power.', effects: { gold: 120, xp: 40, hunger: 40, thirst: 40, stress: 50, health: -25 } }
  ],
  tier4: [
    { id: 'mag_phyl', label: 'Phylactery Hacking', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Breaking Lich Servers.', message: 'Bypassed the firewall.', effects: { gold: 200, xp: 150, hunger: 20, thirst: 20, stress: 90, health: -30 } },
    { id: 'mag_time', label: 'Time Experiments', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Messing with Clocks.', message: 'Did I do this yesterday?', effects: { gold: 150, xp: 200, hunger: 40, thirst: 40, stress: 80, health: -40 } },
    { id: 'mag_tele', label: 'Mass Teleportation', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Moving Small Armies.', message: 'Mind the gap.', effects: { gold: 180, xp: 180, hunger: 30, thirst: 30, stress: 70, health: -20 } },
    { id: 'mag_war', label: 'Counter-Curse War', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Magical Artillery.', message: 'Shields holding.', effects: { gold: 220, xp: 140, hunger: 25, thirst: 25, stress: 100, health: -35 } },
    { id: 'mag_chimera', label: 'Creating Chimeras', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Splicing DNA.', message: 'It has three heads.', effects: { gold: 250, xp: 120, hunger: 50, thirst: 50, stress: 60, health: -25 } },
    { id: 'mag_arch', label: 'Arch-Mage Tutoring', icon: 'Zap', cost: 100, days: 1, type: 'magic', description: 'Extreme Private Lessons.', message: 'My brain is full.', effects: { xp: 400, hunger: 10, thirst: 10, stress: 50, mood: -10 } }
  ],
  tier5: [
    { id: 'mag_rend', label: 'Rending Reality', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Tearing Space-Time.', message: 'I see everything.', effects: { gold: 500, xp: 500, hunger: 50, thirst: 50, stress: 100, health: -80 } },
    { id: 'mag_pocket', label: 'Pocket Dimension', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Creating Infinite Storage.', message: 'A room of my own.', effects: { gold: 400, xp: 600, hunger: 40, thirst: 40, stress: 90, health: -60 } },
    { id: 'mag_ascend', label: 'Ascending to Lichdom', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Embracing the Bone Zone.', message: 'Flesh is weak.', effects: { xp: 1000, hunger: 100, thirst: 100, stress: 100, health: -100 } },
    { id: 'mag_res', label: 'Resurrecting a God', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Defibrillating Deities.', message: 'CLEAR!', effects: { gold: 800, xp: 800, hunger: 60, thirst: 60, stress: 100, health: -90 } },
    { id: 'mag_rewrite', label: 'Rewriting History', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Save-Scumming Reality.', message: 'Let\'s try that again.', effects: { gold: 1000, xp: 500, hunger: 30, thirst: 30, stress: 100, health: -70 } },
    { id: 'mag_void', label: 'Summoning the Void', icon: 'Zap', cost: 0, days: 1, type: 'magic', description: 'Staring into the Abyss.', message: 'It stared back.', effects: { gold: 1500, xp: 1000, hunger: 100, thirst: 100, stress: 100, health: -150 } }
  ]
};

export const AUTONOMY_EVENTS = {
  minor: [
    { id: 'weird_shit', title: 'Ate Some Weird Dungeon Shit', text: '"Found unidentifiable jerky on the tavern floor and ate it."', effects: { health: -5, thirst: 20 } },
    { id: 'slept_armor', title: 'Slept in Full Armor', text: '"Who has time to unbuckle all these straps?"', effects: { stress: 10, mood: -5 } },
    { id: 'snake_oil', title: 'Snake Oil Sucker', text: '"Blew 10 Gold on a premium health potion that is literally dyed tap water."', effects: { gold: -10, mood: -10 } },
    { id: 'stress_eat', title: 'Feral Stress Eating', text: '"I ate everything. All of it. I have no regrets."', effects: { hunger: -100, destroyRations: true } },
    { id: 'pissed_wizard', title: 'Pissed Off a Wizard', text: '"Insulted a spellcaster who turned my hair neon pink."', effects: { mood: -10, stress: 10, applyCurse: 'dungeon_dye_job' } },
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
  { id: 'meathead', name: 'Meathead', desc: '+2 STR, -2 INT. Cannot perform Magic jobs because reading hurts.', effects: { stats: { str: 2, int: -2 }, bannedJobs: ['mag_scribe', 'mag_weed', 'mag_illus', 'mag_spark', 'mag_sort', 'mag_vial', 'mag_alchemist', 'mag_enchant', 'mag_hex', 'mag_fam', 'mag_brew', 'mag_rune', 'mag_scry', 'mag_weather', 'mag_golem', 'mag_bind', 'mag_curse', 'mag_ley', 'mag_phyl', 'mag_time', 'mag_tele', 'mag_war', 'mag_chimera', 'mag_arch', 'mag_rend', 'mag_pocket', 'mag_ascend', 'mag_res', 'mag_rewrite', 'mag_void'] } },
  { id: 'drama_queen', name: 'Drama Queen', desc: 'Double Mood gain from actions. Double Stress from failures.', effects: { moodMultiplier: 2, stressFailureMultiplier: 2 } },
  { id: 'iron_liver', name: 'Iron Liver', desc: 'Ale/Wine costs 50% less. Higher chance of a negative autonomy event when drinking.', effects: { drinkCostMultiplier: 0.5, badDrinkEventChance: 0.2 } },
  { id: 'shiny_syndrome', name: 'Shiny Syndrome', desc: '20% chance each morning to find random "Shiny Trash". Junk clutters inventory but sells for 1d4 Gold.', effects: { junkChance: 0.2 } }
];

export const COMPANIONS = {
  spouse: { id: 'spouse', name: 'Spontaneous Spouse', desc: 'Constantly nags. +15 Stress each morning.', effects: { morningStress: 15 }, removal: { id: 'remove_spouse', label: 'File for Annulment', cost: 50, days: 0, costType: 'gp', type: 'social', message: 'Signed the papers. Finally free.', effects: {} } },
  groupie: { id: 'groupie', name: 'Annoying Groupie', desc: 'Follows them everywhere and won\'t shut up. -15 Mood each morning.', effects: { morningMood: -15 }, removal: { id: 'remove_groupie', label: 'Crush Their Dreams', cost: 0, days: 0, costType: 'gp', type: 'social', message: 'Told them to shut up.', effects: {} } },
  goblin: { id: 'goblin', name: 'Feral Goblin', desc: 'Sneaks into the coin purse. Steals 1d4 Gold each morning.', effects: { morningTheft: true }, removal: { id: 'remove_goblin', label: 'Enroll in Trade School', cost: 25, days: 0, costType: 'gp', type: 'social', message: 'Sent the goblin to learn plumbing.', effects: {} } },
  mimic: { id: 'mimic', name: 'Adopted Mimic', desc: 'Intercepts 50% of the Hunger recovery from any food consumed.', effects: { foodLeech: 0.5 }, removal: { id: 'remove_mimic', label: 'Pawn on Gullible Merchant', cost: 10, days: 0, costType: 'gp', type: 'social', message: 'No refunds!', effects: {} } },
  pet_rock: { id: 'pet_rock', name: '"Lucky" Pet Rock', desc: 'Adds a permanent +5% Fail Chance to all Labor and Adventure rolls.', effects: { failPenalty: 0.05 }, removal: { id: 'remove_rock', label: 'Throw in River', cost: 0, days: 0, costType: 'gp', type: 'magic', message: 'Goodbye, Rocky.', effects: {} } }
};

export const CURSES = {
  blacklist: { id: 'blacklist', name: 'The Blacklist', desc: 'Banned from renting Inn Room.', effects: { lockInn: true }, removal: { id: 'remove_blacklist', label: 'Bribe the Barkeep', cost: 15, days: 0, costType: 'gp', type: 'social', message: 'Bribed my way back inside.', effects: {} } },
  cult_member: { id: 'cult_member', name: 'Cult Member', desc: '+20 Mood, -20 Stress every morning. Forces Cult Robes. Mandatory -10g daily donation.', effects: { morningMood: 20, morningStress: -20, forceEquip: 'cultist_robe', dailyDonation: 10 }, removal: { id: 'remove_cult', label: 'Deprogramming', cost: 30, days: 0, costType: 'gp', type: 'magic', message: 'I can think for myself again!', effects: {} } },
  identity_crisis: { id: 'identity_crisis', name: 'Identity Crisis', desc: 'Unequips all gear. Cannot equip items.', effects: { unequipAll: true, forceClass: true }, removal: { autoRemoveFails: 3 } },
  pacifism: { id: 'pacifism', name: 'Sudden Pacifism', desc: 'Banned from Combat Adventures.', effects: { lockAdventures: true }, removal: { autoRemoveTasks: 2 } },
  butterfingers: { id: 'butterfingers', name: 'Butterfingers', desc: '+10% Fail Chance on Adventures due to slime.', effects: { combatFailPenalty: 0.1 }, removal: { sleepEstate: true, getShitfaced: true } },
  dungeon_dye_job: { id: 'dungeon_dye_job', name: 'Dungeon Dye Job', desc: 'Hair changes to a neon color or terrible style. Removal: Natural 5 days, or "Visit the Barber".', effects: { visualOverride: 'neon_hair' }, removal: { id: 'remove_dye', label: 'Visit the Barber', cost: 10, days: 0, costType: 'gp', type: 'social', message: 'Fixed my hair.', effects: {} } },
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
