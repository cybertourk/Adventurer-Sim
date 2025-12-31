/* -------------------------------------------------------------------------
  GAME DATA & CONFIGURATION
  Version: 1.14 (Quirks Added - Re-applied)
------------------------------------------------------------------------- */

export const SAVE_KEY = 'dnd_tamagotchi_v1_12'; 
export const MAX_STAT = 100;

// --- Section 5: Equipment & Economy ---
export const ITEM_DB = {
  head: [
    { id: 'none', name: 'Bare', type: 'head', stats: { ac: 0 }, cost: 0, description: 'Wind in your hair.' },
    { id: 'leather_cap', name: 'Bad Hair Day Hider', type: 'head', stats: { ac: 1 }, cost: 25, description: 'Basic leather cap.' },
    { id: 'iron_helm', name: 'Bucket with Eye Holes', type: 'head', stats: { ac: 3, dex: -1 }, cost: 60, description: 'Heavy protection.' },
    { id: 'wizard_hat', name: 'Pointy Hat of Smartness', type: 'head', stats: { int: 2 }, cost: 80, description: 'Full of stars.' },
  ],
  body: [
    { id: 'tunic', name: 'Breezy Tunic', type: 'body', stats: { ac: 0 }, cost: 0, description: 'Drafty.' },
    { id: 'leather_armor', name: 'Stiff Cow Skin', type: 'body', stats: { ac: 2 }, cost: 40, description: 'Smells like a tannery.' },
    { id: 'chainmail', name: 'Jingly Shirt', type: 'body', stats: { ac: 5, dex: -2 }, cost: 150, description: 'Loud but protective.' },
    { id: 'plate', name: 'Shiny Can Suit', type: 'body', stats: { ac: 8, dex: -4 }, cost: 500, description: 'I am invincible! (Mostly).' },
    // Kept for SVG compatibility, though not in SRD shop list explicitly
    { id: 'robe', name: 'Mysterious Robe', type: 'body', stats: { ac: 1, int: 1 }, cost: 30, description: 'Flowing fabric.' },
  ],
  mainHand: [
    { id: 'fist', name: 'These Two Hands', type: 'mainHand', stats: { str: 0 }, cost: 0, description: 'Always loaded.' },
    { id: 'dagger', name: 'Pointy Stick', type: 'mainHand', stats: { dex: 2, str: 1 }, cost: 15, description: 'Good for cheese and goblins.' },
    { id: 'sword', name: 'Sharp Metal Bar', type: 'mainHand', stats: { str: 2 }, cost: 50, description: 'The classic choice.' },
    { id: 'axe', name: 'The Chopper', type: 'mainHand', stats: { str: 3 }, cost: 75, description: 'Solving problems, one swing at a time.' },
    { id: 'staff', name: 'Wizard Twig', type: 'mainHand', stats: { int: 1, str: 1 }, cost: 60, description: 'It is just a stick, right?' },
    { id: 'hammer', name: 'Bonk Stick', type: 'mainHand', stats: { str: 3 }, cost: 100, description: 'Unlocks smithing.' },
  ],
  offHand: [
    // Kept for SVG compatibility
    { id: 'none', name: 'Empty', type: 'offHand', stats: { ac: 0 }, cost: 0, description: 'Free hand.' },
    { id: 'wooden_shield', name: 'Plank', type: 'offHand', stats: { ac: 1 }, cost: 15, description: 'Splinters included.' },
    { id: 'tower_shield', name: 'Wall', type: 'offHand', stats: { ac: 3, dex: -2 }, cost: 60, description: 'Portable cover.' },
    { id: 'orb', name: 'Glowy Ball', type: 'offHand', stats: { int: 3 }, cost: 200, description: 'Ooh, shiny.' },
  ],
  supplies: [
    { id: 'ration', name: 'Mystery Meat Jerky', type: 'food', cost: 3, description: 'Don\'t ask what animal it was.', effects: { hunger: -30, health: 5 } },
    { id: 'potion', name: 'Red Goop', type: 'potion', cost: 25, description: 'Tastes like cherries and pennies.', effects: { health: 50 } },
    { id: 'ale', name: 'Liquid Courage', type: 'drink', cost: 5, description: 'Makes everyone prettier.', effects: { thirst: -15, mood: 10, stress: -10 } },
    { id: 'wine', name: 'Fancy Grape Juice', type: 'drink', cost: 25, description: 'Pinkies out!', effects: { thirst: -20, mood: 20, stress: -15 } },
    { id: 'water', name: 'Water Skin', type: 'drink', cost: 0, description: 'Basic hydration.', effects: { thirst: -40 } },
  ]
};

// --- Section 2: Maintenance Actions ---
export const MAINTENANCE_ACTIONS = [
  { 
    id: 'eat', label: 'Eat', icon: 'Utensils', cost: 5, days: 0, costType: 'gp', 
    description: 'Noms.', message: 'Ate something crunchy.',
    effects: { hunger: -30, health: 5 } 
  },
  { 
    id: 'drink', label: 'Drink', icon: 'Droplets', cost: 0, days: 0, costType: 'gp', 
    description: 'Glug glug.', message: 'Refreshing!',
    effects: { thirst: -40 } 
  },
  { 
    id: 'sleep', label: 'Sleep', icon: 'Tent', cost: 0, days: 1, costType: 'gp', 
    description: 'Nap time. (+Health, -Stress).', message: 'Zzz...',
    effects: { health: 15, stress: -20, hunger: 10, thirst: 10 } 
  },
  { 
    id: 'train', label: 'Train', icon: 'Activity', cost: 10, days: 1, costType: 'gp', 
    description: 'Hitting things with other things.', message: 'I feel stronger!',
    effects: { xp: 10, hunger: 20, thirst: 20 } 
  },
  { 
    id: 'repair', label: 'Repair', icon: 'Hammer', cost: 5, days: 0, costType: 'gp', 
    description: 'Fixing the dents.', message: 'Hammering out the dents.',
    effects: { stress: -10 } 
  },
  { 
    id: 'tavern', label: 'Tavern', icon: 'Beer', cost: 8, days: 0, costType: 'gp', 
    description: 'Socializing... loudly.', message: 'Huzzah!',
    effects: { mood: 15, stress: -15, hunger: -5, thirst: -10 } 
  },
];

// --- Section 3: Quests (Databases) ---

export const JOB_DB = {
  tier1: [
    { id: 'job_field', label: 'Field Hand', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Pulling Weeds.', message: 'Farmer Maggot yells a lot.', effects: { gold: 8, xp: 5, hunger: 10, thirst: 10, stress: 5, mood: -5 } },
    { id: 'job_muck', label: 'Stable Muck', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Shoveling Poop.', message: 'It smells like success. And manure.', effects: { gold: 10, xp: 5, hunger: 10, thirst: 10, stress: 10, mood: -10 } },
    { id: 'job_wood', label: 'Wood Chop', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Hitting Trees.', message: 'Like fighting, but the enemy does not move.', effects: { gold: 9, xp: 5, hunger: 15, thirst: 10, stress: 5 } },
    { id: 'job_rats', label: 'Rat Catcher', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Poking Squeaky Things.', message: 'They bite back sometimes.', effects: { gold: 12, xp: 8, hunger: 10, thirst: 10, stress: 10, health: -2 } },
    { id: 'job_run', label: 'Runner', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Running Errands.', message: 'Cardio is hard.', effects: { gold: 8, xp: 5, hunger: 15, thirst: 20, stress: 5 } },
  ],
  tier2: [
    { id: 'job_guard', label: 'Guard Duty', icon: 'Shield', cost: 0, days: 1, type: 'labor', description: 'Standing Around Menacingly.', message: 'Trying not to fall asleep.', effects: { gold: 15, xp: 10, hunger: 10, thirst: 10, stress: 5 } },
    { id: 'job_dock', label: 'Dock Work', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Lifting Heavy Boxes.', message: 'My back hurts.', effects: { gold: 25, xp: 15, hunger: 20, thirst: 20, stress: 15, health: -5 } },
    { id: 'job_smith', label: 'Smithing', icon: 'Hammer', cost: 0, days: 1, type: 'labor', description: 'Hitting Hot Metal.', message: 'Sparks are pretty.', effects: { gold: 45, xp: 20, hunger: 20, thirst: 30, stress: 10 } },
  ]
};

export const ADVENTURE_DB = {
  tier1: [
    { id: 'adv_rats', label: 'Giant Rats', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Rats of Unusual Size.', message: 'Why are they so big?!', effects: { gold: 15, xp: 20, hunger: 30, thirst: 30, stress: 20, health: -10 } },
    { id: 'adv_spiders', label: 'Giant Spiders', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Too Many Legs.', message: 'Nope. Nope. Nope.', effects: { gold: 20, xp: 25, hunger: 30, thirst: 30, stress: 30, health: -15, mood: -10 } },
  ],
  tier2: [
    { id: 'adv_goblins', label: 'Goblins', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Green Ankle Biters.', message: 'They travel in packs.', effects: { gold: 40, xp: 50, hunger: 40, thirst: 40, stress: 30, health: -20 } },
    { id: 'adv_bandits', label: 'Bandits', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Muggers in Masks.', message: 'Hey, that is MY gold!', effects: { gold: 50, xp: 60, hunger: 40, thirst: 40, stress: 30, health: -25 } },
  ],
  tier3: [
    { id: 'adv_cult', label: 'Cultist Leader', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'Weird Robe Guy.', message: 'He keeps screaming about squids.', effects: { gold: 120, xp: 150, hunger: 60, thirst: 60, stress: 50, health: -30 } },
    { id: 'adv_undead', label: 'Undead Knight', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'Spooky Scary Skeleton.', message: 'He refuses to stay down.', effects: { gold: 150, xp: 200, hunger: 60, thirst: 60, stress: 50, health: -40 } },
    { id: 'adv_lich', label: 'Lich Tomb', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'The Bone Zone.', message: 'Bad vibes in here.', effects: { gold: 200, xp: 250, hunger: 70, thirst: 70, stress: 60, health: -50 } },
    { id: 'adv_dragon', label: 'Young Dragon', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'Spicy Lizard.', message: 'Everything is on fire.', effects: { gold: 300, xp: 350, hunger: 80, thirst: 80, stress: 70, health: -60 } },
  ]
};

export const SOCIAL_DB = {
  tier1: [
    { id: 'soc_gossip', label: 'Gossip', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Talking Smack.', message: 'Did you hear about the miller\'s wife?', effects: { xp: 10, mood: 10, hunger: 5, thirst: 5 } },
    { id: 'soc_beg', label: 'Begging', icon: 'Coins', cost: 0, days: 1, type: 'social', description: 'Spare a Copper?', message: 'Please? Pretty please?', effects: { gold: 5, mood: -5, hunger: 10, thirst: 10, stress: 10 } },
    { id: 'soc_flirt', label: 'Flirt', icon: 'Heart', cost: 0, days: 1, type: 'social', description: 'Hey Good Lookin\'.', message: 'How you doin?', effects: { mood: 20, stress: -5, xp: 5, hunger: 5, thirst: 5 } },
    { id: 'soc_brawl', label: 'Brawl', icon: 'Zap', cost: 0, days: 1, type: 'social', description: 'Punching Contest.', message: 'Face-to-fist style.', effects: { xp: 15, health: -5, stress: -10, hunger: 10, thirst: 10 } },
  ],
  tier2: [
    { id: 'soc_gamble', label: 'Gamble', icon: 'DollarSign', cost: 10, days: 1, type: 'social', description: 'Rolling the Bones.', message: 'Daddy needs a new pair of boots!', effects: { xp: 10, mood: 10, stress: 10 } }, 
    { id: 'soc_bribe', label: 'Bribe Guard', icon: 'Coins', cost: 20, days: 1, type: 'social', description: 'Greasing Palms.', message: 'Look the other way, pal.', effects: { xp: 30, stress: -10 } },
  ]
};

// --- Section 7: Autonomy Events ---
export const AUTONOMY_EVENTS = {
  minor: [
    { id: 'hungover', title: 'Hungover', text: '"My head is exploding... the light, it burns!"', effects: { health: -5, thirst: 20 } },
    { id: 'overslept', title: 'Overslept', text: '"Just five more minutes... or hours. Who counts?"', effects: { hunger: 10, thirst: 10 } }, // Logic will handle 'skip turn' mostly by just wasting resources
    { id: 'impulse_buy', title: 'Impulse Buy', text: '"I bought a rock that looks like a duck! It was 10 gold. Worth it."', effects: { gold: -10, mood: 10 } },
    { id: 'bad_romance', title: 'Bad Romance', text: '"I tried to wink at someone and got a drink thrown in my face."', effects: { mood: -10, stress: 10 } },
    { id: 'stress_eating', title: 'Stress Eating', text: '"I ate everything. All of it. I have no regrets. Okay, some regrets."', effects: { hunger: -100 } }, // Logic will need to clear food inventory
  ],
  major: [
    { id: 'gambling_debt', title: 'Gambling Debt', text: '"I bet my pants... and lost. I am not a smart man."', effects: { equipmentLoss: true } }, // Logic handles item loss
    { id: 'bar_fight', title: 'Bar Fight', text: '"He looked at me funny! So I hit him with a chair."', effects: { health: -30, gold: -20 } },
    { id: 'walk_shame', title: 'The Walk of Shame', text: '"I woke up in a haystack three towns over. Don\'t ask."', effects: { housing: 'homeless' } },
    { id: 'paranoid', title: 'Paranoid Episode', text: '"The innkeeper is a mimic! I\'m sleeping in a tree!"', effects: { housing: 'homeless', stress: 20 } },
    { id: 'charity', title: 'Charity Case', text: '"I gave it all away! I am a golden god of generosity!"', effects: { gold: -9999 } }, // Sets to 0
  ]
};

// --- Section 9: Traits & Quirks ---
export const QUIRKS = [
  { 
    id: 'sticky_fingers', 
    name: 'Sticky Fingers', 
    desc: '10% chance to find Gold on Social interactions. Banned from Guard jobs.', 
    effects: { socialGoldChance: 0.1, bannedJobs: ['job_guard'] }
  },
  { 
    id: 'meathead', 
    name: 'Meathead', 
    desc: '+2 STR, -2 INT. Cannot perform Magic jobs.', 
    effects: { stats: { str: 2, int: -2 }, bannedJobs: ['job_scribe'] } // 'job_scribe' placeholder for magic/smart jobs
  },
  { 
    id: 'drama_queen', 
    name: 'Drama Queen', 
    desc: 'Double Mood gain from Flirt/Tavern. Double Stress from failures.', 
    effects: { moodMultiplier: 2, stressFailureMultiplier: 2 }
  },
  { 
    id: 'lightweight', 
    name: 'Lightweight', 
    desc: 'Ale/Wine cost 50% less. Higher hangover chance.', 
    effects: { drinkCostMultiplier: 0.5, hangoverChance: 0.5 }
  },
  { 
    id: 'kleptomaniac', 
    name: 'Kleptomaniac', 
    desc: 'Randomly finds "Junk" items. Junk fills inventory.', 
    effects: { junkChance: 0.2 }
  }
];

// --- Section 4: Locations ---
export const LOCATIONS = {
  village_road: {
    id: 'village_road',
    name: 'Village Road',
    type: 'homeless',
    description: 'A Nice Patch of Dirt. (0g)',
    details: "Nature is my blanket. Living on the road is hard on the body and mind.",
    dailyCost: 0,
    hasFoodService: false, 
    tips: [
      { label: "Health", text: "Recovers only 5 (instead of 15).", type: "bad" },
      { label: "Stress", text: "Reduces by only 5 (instead of 20).", type: "bad" },
      { label: "Mood", text: "Decreases by 10.", type: "bad" }
    ],
    modifiers: {
      rest: { health: 5, stress: -5, mood: -10, hunger: 5, thirst: 5 } 
    }
  },
  inn_room: {
    id: 'inn_room',
    name: 'Rusty Spoon Inn',
    type: 'renting',
    description: 'Lumpy Mattress. (5g/day)',
    details: "Beats the dirt. A warm bed and a roof.",
    dailyCost: 5,
    hasFoodService: true, 
    tips: [
      { label: "Rest", text: "Full recovery benefits.", type: "good" },
      { label: "Cost", text: "5 Gold deducted daily automatically.", type: "bad" }
    ],
    modifiers: {
      rest: { health: 15, stress: -20, mood: 5, hunger: 5, thirst: 5 } 
    }
  },
  estate: {
    id: 'estate',
    name: 'Estate',
    type: 'owned',
    description: 'Fancy House. (50g/day)',
    details: "I am basically a noble now. Luxury living.",
    dailyCost: 50,
    hasFoodService: true,
    tips: [
      { label: "Rest", text: "Maximum recovery benefits.", type: "good" },
      { label: "Cost", text: "50 Gold deducted daily.", type: "bad" }
    ],
    modifiers: {
      rest: { health: 30, stress: -40, mood: 20, hunger: 0, thirst: 0 }
    }
  }
};

// --- Appearance Options ---
export const APPEARANCE_OPTIONS = {
  skinTones: [
    { id: 'pale', label: 'Pale', color: '#f3e5dc', shadow: '#e0c8b8' },
    { id: 'fair', label: 'Fair', color: '#eecfa1', shadow: '#dcb386' },
    { id: 'tan', label: 'Tan', color: '#d4a373', shadow: '#b07d4e' },
    { id: 'dark', label: 'Dark', color: '#8d5524', shadow: '#6e3b12' },
    { id: 'deep', label: 'Deep', color: '#3b2219', shadow: '#2a1810' },
  ],
  hairColors: [
    { id: 'black', label: 'Black', color: '#09090b' },
    { id: 'brown', label: 'Brown', color: '#3f2307' },
    { id: 'blonde', label: 'Blonde', color: '#ca8a04' },
    { id: 'red', label: 'Red', color: '#7f1d1d' },
    { id: 'grey', label: 'Grey', color: '#9ca3af' },
    { id: 'white', label: 'White', color: '#f3f4f6' },
  ],
  eyeColors: [
    { id: 'blue', label: 'Blue', color: '#3b82f6' },
    { id: 'green', label: 'Green', color: '#22c55e' },
    { id: 'brown', label: 'Brown', color: '#451a03' },
    { id: 'hazel', label: 'Hazel', color: '#854d0e' },
    { id: 'red', label: 'Red', color: '#ef4444' },
  ],
  hairStyles: [
    { id: 'bald', label: 'Bald' },
    { id: 'short', label: 'Short' },
    { id: 'long', label: 'Long' },
  ]
};
