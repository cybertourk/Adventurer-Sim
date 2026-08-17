import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, Sword, VenetianMask, Shirt, User, Backpack, X,
  Activity, Scroll, MapPin, ShoppingBag, DollarSign, HelpCircle,
  Key, Apple, Beer, Wine, Heart, Trash2, Coins, Sun, Skull, Brain,
  ClipboardList, Clock, Droplets, Tent, Hammer, Zap
} from 'lucide-react';

/* =========================================================================
   PART 1: GAME DATA & CONFIGURATION
========================================================================= */

const SAVE_KEY = 'chaotic_adventurer_v2';
const MAX_STAT = 100;

const ITEM_DB = {
  head: [
    { id: 'none', name: 'Bare', type: 'head', category: 'None', stats: { ac: 0 }, cost: 0, description: 'Wind in your hair.' },
    { id: 'leather_cap', name: 'Bad Hair Day Hider', type: 'head', category: 'Light Helm', stats: { ac: 1 }, cost: 25, description: 'Basic leather cap.' },
    { id: 'iron_helm', name: 'Bucket with Eye Holes', type: 'head', category: 'Heavy Helm', stats: { ac: 3, dex: -1 }, cost: 60, description: 'Heavy protection.' },
    { id: 'wizard_hat', name: 'Pointy Hat of Smartness', type: 'head', category: 'Arcane Focus', stats: { int: 2 }, cost: 80, description: 'Full of stars.' },
  ],
  body: [
    { id: 'tunic', name: 'Breezy Tunic', type: 'body', category: 'Clothing', stats: { ac: 0 }, cost: 0, description: 'Drafty.' },
    { id: 'leather_armor', name: 'Stiff Cow Skin', type: 'body', category: 'Light Armor', stats: { ac: 2 }, cost: 40, description: 'Smells like a tannery.' },
    { id: 'chainmail', name: 'Jingly Shirt', type: 'body', category: 'Medium Armor', stats: { ac: 5, dex: -2 }, cost: 150, description: 'Loud but protective.' },
    { id: 'plate', name: 'Shiny Can Suit', type: 'body', category: 'Heavy Armor', stats: { ac: 8, dex: -4 }, cost: 500, description: 'I am invincible! (Mostly).' },
    { id: 'robe', name: 'Mysterious Robe', type: 'body', category: 'Clothing', stats: { ac: 1, int: 1 }, cost: 30, description: 'Flowing fabric.' },
  ],
  mainHand: [
    { id: 'fist', name: 'These Two Hands', type: 'mainHand', category: 'Unarmed', stats: { str: 0 }, cost: 0, description: 'Always loaded.' },
    { id: 'dagger', name: 'Pointy Stick', type: 'mainHand', category: 'Dagger', stats: { dex: 2, str: 1 }, cost: 15, description: 'Good for cheese and goblins.' },
    { id: 'sword', name: 'Sharp Metal Bar', type: 'mainHand', category: 'Longsword', stats: { str: 2 }, cost: 50, description: 'The classic choice.' },
    { id: 'axe', name: 'The Chopper', type: 'mainHand', category: 'Battleaxe', stats: { str: 3 }, cost: 75, description: 'Solving problems, one swing at a time.' },
    { id: 'staff', name: 'Wizard Twig', type: 'mainHand', category: 'Quarterstaff', stats: { int: 1, str: 1 }, cost: 60, description: 'It is just a stick, right?' },
    { id: 'hammer', name: 'Bonk Stick', type: 'mainHand', category: 'Warhammer', stats: { str: 3 }, cost: 100, description: 'Unlocks smithing.' },
  ],
  offHand: [
    { id: 'none', name: 'Empty', type: 'offHand', category: 'None', stats: { ac: 0 }, cost: 0, description: 'Free hand.' },
    { id: 'wooden_shield', name: 'Plank', type: 'offHand', category: 'Shield', stats: { ac: 1 }, cost: 15, description: 'Splinters included.' },
    { id: 'tower_shield', name: 'Wall', type: 'offHand', category: 'Tower Shield', stats: { ac: 3, dex: -2 }, cost: 60, description: 'Portable cover.' },
    { id: 'orb', name: 'Glowy Ball', type: 'offHand', category: 'Arcane Focus', stats: { int: 3 }, cost: 200, description: 'Ooh, shiny.' },
  ],
  supplies: [
    { id: 'ration', name: 'Mystery Meat Jerky', type: 'food', category: 'Food', cost: 3, description: 'Don\'t ask what animal it was.', effects: { hunger: -30, health: 5 } },
    { id: 'potion', name: 'Red Goop', type: 'potion', category: 'Potion', cost: 25, description: 'Tastes like cherries and pennies.', effects: { health: 50 } },
    { id: 'ale', name: 'Liquid Courage', type: 'drink', category: 'Drink', cost: 5, description: 'Makes everyone prettier.', effects: { thirst: -15, mood: 10, stress: -10 } },
    { id: 'wine', name: 'Fancy Grape Juice', type: 'drink', category: 'Drink', cost: 25, description: 'Pinkies out!', effects: { thirst: -20, mood: 20, stress: -15 } },
    { id: 'water', name: 'Water Skin', type: 'drink', category: 'Drink', cost: 0, description: 'Basic hydration.', effects: { thirst: -40 } },
  ]
};

const MAINTENANCE_ACTIONS = [
  { id: 'eat', label: 'Eat', icon: 'Apple', cost: 5, days: 0, costType: 'gp', description: 'Noms.', message: 'Ate something crunchy.', effects: { hunger: -30, health: 5 } },
  { id: 'drink', label: 'Drink', icon: 'Droplets', cost: 0, days: 0, costType: 'gp', description: 'Glug glug.', message: 'Refreshing!', effects: { thirst: -40 } },
  { id: 'sleep', label: 'Sleep', icon: 'Tent', cost: 0, days: 1, costType: 'gp', description: 'Nap time. (+Health, -Stress).', message: 'Zzz...', effects: { health: 15, stress: -20, hunger: 10, thirst: 10 } },
  { id: 'train', label: 'Train', icon: 'Activity', cost: 10, days: 1, costType: 'gp', description: 'Hitting things with other things.', message: 'I feel stronger!', effects: { xp: 10, hunger: 20, thirst: 20 } },
  { id: 'repair', label: 'Repair', icon: 'Hammer', cost: 5, days: 0, costType: 'gp', description: 'Fixing the dents.', message: 'Hammering out the dents.', effects: { stress: -10 } },
  { id: 'tavern', label: 'Tavern', icon: 'Beer', cost: 8, days: 0, costType: 'gp', description: 'Socializing... loudly.', message: 'Huzzah!', effects: { mood: 15, stress: -15, hunger: -5, thirst: -10 } },
];

const JOB_DB = {
  tier1: [
    { id: 'job_field', label: 'Field Hand', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Pulling Weeds.', message: 'Farmer Maggot yells a lot.', effects: { gold: 8, xp: 5, hunger: 10, thirst: 10, stress: 5, mood: -5 } },
    { id: 'job_muck', label: 'Stable Muck', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Shoveling Poop.', message: 'It smells like success.', effects: { gold: 10, xp: 5, hunger: 10, thirst: 10, stress: 10, mood: -10 } },
    { id: 'job_wood', label: 'Wood Chop', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Hitting Trees.', message: 'Like fighting, but the enemy does not move.', effects: { gold: 9, xp: 5, hunger: 15, thirst: 10, stress: 5 } },
  ],
  tier2: [
    { id: 'job_guard', label: 'Guard Duty', icon: 'Shield', cost: 0, days: 1, type: 'labor', description: 'Standing Around Menacingly.', message: 'Trying not to fall asleep.', effects: { gold: 15, xp: 10, hunger: 10, thirst: 10, stress: 5 } },
    { id: 'job_dock', label: 'Dock Work', icon: 'Scroll', cost: 0, days: 1, type: 'labor', description: 'Lifting Heavy Boxes.', message: 'My back hurts.', effects: { gold: 25, xp: 15, hunger: 20, thirst: 20, stress: 15, health: -5 } },
  ]
};

const ADVENTURE_DB = {
  tier1: [
    { id: 'adv_rats', label: 'Giant Rats', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Rats of Unusual Size.', message: 'Why are they so big?!', effects: { gold: 15, xp: 20, hunger: 30, thirst: 30, stress: 20, health: -10 } },
    { id: 'adv_spiders', label: 'Giant Spiders', icon: 'Skull', cost: 0, days: 1, type: 'adventure', description: 'Too Many Legs.', message: 'Nope. Nope. Nope.', effects: { gold: 20, xp: 25, hunger: 30, thirst: 30, stress: 30, health: -15, mood: -10 } },
  ],
  tier2: [
    { id: 'adv_goblins', label: 'Goblins', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Green Ankle Biters.', message: 'They travel in packs.', effects: { gold: 40, xp: 50, hunger: 40, thirst: 40, stress: 30, health: -20 } },
    { id: 'adv_bandits', label: 'Bandits', icon: 'Skull', cost: 0, days: 3, type: 'adventure', description: 'Muggers in Masks.', message: 'Hey, that is MY gold!', effects: { gold: 50, xp: 60, hunger: 40, thirst: 40, stress: 30, health: -25 } },
  ],
  tier3: [
    { id: 'adv_dragon', label: 'Young Dragon', icon: 'Skull', cost: 0, days: 5, type: 'adventure', description: 'Spicy Lizard.', message: 'Everything is on fire.', effects: { gold: 300, xp: 350, hunger: 80, thirst: 80, stress: 70, health: -60 } },
  ]
};

const SOCIAL_DB = {
  tier1: [
    { id: 'soc_gossip', label: 'Gossip', icon: 'User', cost: 0, days: 1, type: 'social', description: 'Talking Smack.', message: 'Did you hear about the miller\'s wife?', effects: { xp: 10, mood: 10, hunger: 5, thirst: 5 } },
    { id: 'soc_beg', label: 'Begging', icon: 'Coins', cost: 0, days: 1, type: 'social', description: 'Spare a Copper?', message: 'Please? Pretty please?', effects: { gold: 5, mood: -5, hunger: 10, thirst: 10, stress: 10 } },
    { id: 'soc_flirt', label: 'Flirt', icon: 'Heart', cost: 0, days: 1, type: 'social', description: 'Hey Good Lookin\'.', message: 'How you doin?', effects: { mood: 20, stress: -5, xp: 5, hunger: 5, thirst: 5 } },
  ],
  tier2: [
    { id: 'soc_gamble', label: 'Gamble', icon: 'DollarSign', cost: 10, days: 1, type: 'social', description: 'Rolling the Bones.', message: 'Daddy needs a new pair of boots!', effects: { xp: 10, mood: 10, stress: 10 } },
  ]
};

const AUTONOMY_EVENTS = {
  minor: [
    { id: 'hungover', title: 'Hungover', text: '"My head is exploding... the light, it burns!"', effects: { health: -5, thirst: 20 } },
    { id: 'overslept', title: 'Overslept', text: '"Just five more minutes... or hours. Who counts?"', effects: { hunger: 10, thirst: 10 } },
    { id: 'impulse_buy', title: 'Impulse Buy', text: '"I bought a rock that looks like a duck! It was 10 gold. Worth it."', effects: { gold: -10, mood: 10 } },
  ],
  major: [
    { id: 'gambling_debt', title: 'Gambling Debt', text: '"I bet my pants... and lost. I am not a smart man."', effects: { equipmentLoss: true } },
    { id: 'bar_fight', title: 'Bar Fight', text: '"He looked at me funny! So I hit him with a chair."', effects: { health: -30, gold: -20 } },
    { id: 'walk_shame', title: 'The Walk of Shame', text: '"I woke up in a haystack three towns over. Don\'t ask."', effects: { housing: 'homeless' } },
  ]
};

const QUIRKS = [
  { id: 'sticky_fingers', name: 'Sticky Fingers', desc: '10% chance to find Gold on Social interactions.', effects: { socialGoldChance: 0.1 } },
  { id: 'meathead', name: 'Meathead', desc: '+2 STR, -2 INT.', effects: { stats: { str: 2, int: -2 } } },
  { id: 'drama_queen', name: 'Drama Queen', desc: 'Double Mood gain from Flirt/Tavern. Double Stress from failures.', effects: { moodMultiplier: 2, stressFailureMultiplier: 2 } },
  { id: 'lightweight', name: 'Lightweight', desc: 'Ale/Wine cost 50% less.', effects: { drinkCostMultiplier: 0.5 } },
];

const LOCATIONS = {
  village_road: {
    id: 'village_road', name: 'Village Road', type: 'homeless', dailyCost: 0, hasFoodService: false,
    modifiers: { rest: { health: 5, stress: -5, mood: -10, hunger: 5, thirst: 5 } }
  },
  inn_room: {
    id: 'inn_room', name: 'Rusty Spoon Inn', type: 'renting', dailyCost: 5, hasFoodService: true,
    modifiers: { rest: { health: 15, stress: -20, mood: 5, hunger: 5, thirst: 5 } }
  },
  estate: {
    id: 'estate', name: 'Estate', type: 'owned', dailyCost: 50, hasFoodService: true,
    modifiers: { rest: { health: 30, stress: -40, mood: 20, hunger: 0, thirst: 0 } }
  }
};

const APPEARANCE_OPTIONS = {
  skinTones: [
    { id: 'pale', label: 'Pale', color: '#f3e5dc', shadow: '#e0c8b8' },
    { id: 'fair', label: 'Fair', color: '#eecfa1', shadow: '#dcb386' },
    { id: 'tan', label: 'Tan', color: '#d4a373', shadow: '#b07d4e' },
    { id: 'dark', label: 'Dark', color: '#8d5524', shadow: '#6e3b12' },
  ],
  hairColors: [
    { id: 'black', color: '#09090b' }, { id: 'brown', color: '#3f2307' }, { id: 'blonde', color: '#ca8a04' },
    { id: 'red', color: '#7f1d1d' }, { id: 'white', color: '#f3f4f6' },
  ],
  eyeColors: [
    { id: 'blue', color: '#3b82f6' }, { id: 'green', color: '#22c55e' }, { id: 'brown', color: '#451a03' },
  ],
  hairStyles: [
    { id: 'bald', label: 'Bald' }, { id: 'short', label: 'Short' }, { id: 'long', label: 'Long' },
  ]
};

const ICON_MAP = {
  'Shield': Shield, 'Sword': Sword, 'Scroll': Scroll, 'Activity': Activity, 'Apple': Apple,
  'Beer': Beer, 'User': User, 'Coins': Coins, 'Heart': Heart, 'DollarSign': DollarSign,
  'Droplets': Droplets, 'Tent': Tent, 'Hammer': Hammer, 'Zap': Zap
};

/* =========================================================================
   PART 2: GAME LOGIC HOOK
========================================================================= */

const useGameLogic = () => {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Save load failed", e); }
    }
    return {
      gameStarted: false,
      creationStep: 1,
      attributes: { str: 10, dex: 10, con: 10, int: 10, cha: 10 },
      quirk: null,
      stats: { hunger: 0, thirst: 0, health: 20, mood: 100, stress: 0 },
      resources: { gold: 50, xp: 0, level: 1 },
      inventory: ['none', 'tunic', 'fist'],
      shopStock: [],
      equipped: { head: 'none', body: 'tunic', mainHand: 'fist', offHand: 'none' },
      appearance: { gender: 'male', skinTone: 'fair', hairColor: 'brown', eyeColor: 'brown', hairStyle: 'short' },
      days: 1,
      location: 'village_road',
      housing: 'homeless',
      rentActive: false,
      maxTier: 1,
      dailyQuests: { labor: [], adventure: [], social: [] },
      dailyLogs: [],
      isDead: false
    };
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const maxStats = useMemo(() => ({
    health: 10 + (gameState.resources.level * 10) + (gameState.attributes.con * 2),
    mood: 100, hunger: 100, thirst: 100, stress: 100
  }), [gameState.resources.level, gameState.attributes.con]);

  const currentStats = useMemo(() => {
    let total = { ...gameState.attributes, ac: 10 };
    Object.keys(gameState.equipped).forEach(slot => {
      const itemId = gameState.equipped[slot];
      const item = ITEM_DB[slot].find(i => i.id === itemId);
      if (item?.stats) Object.entries(item.stats).forEach(([stat, val]) => { total[stat] = (total[stat] || 0) + val; });
    });
    if (gameState.quirk?.effects?.stats) {
      Object.entries(gameState.quirk.effects.stats).forEach(([stat, val]) => { total[stat] = (total[stat] || 0) + val; });
    }
    return total;
  }, [gameState.equipped, gameState.attributes, gameState.quirk]);

  const addMessage = (text, type = 'info') => {
    const id = Date.now() + Math.random();
    setMessages(prev => [...prev.slice(-3), { id, text, type }]);
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 3000);
  };

  const updateState = (updates) => setGameState(prev => ({ ...prev, ...updates }));

  const refreshShop = () => {
    const allItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
    const purchasable = allItems.filter(i => i.cost > 0);
    const shuffled = [...purchasable].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6).map(i => i.id);
  };

  const generateDailyQuests = (tier) => {
    const getPool = (db) => Object.keys(db).filter(k => k.replace('tier', '') <= tier).flatMap(k => db[k]);
    const select = (pool, count) => [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
    return {
      labor: select(getPool(JOB_DB), 3),
      adventure: select(getPool(ADVENTURE_DB), 3),
      social: select(getPool(SOCIAL_DB), 3)
    };
  };

  const passTime = (daysPassed) => {
    let rentMsg = "Slept outside.";
    let stateUpdates = { days: gameState.days + daysPassed };
    let newGold = gameState.resources.gold;
    let newHousing = gameState.housing;
    let newRentActive = gameState.rentActive;
    
    const mod = LOCATIONS[gameState.rentActive ? (gameState.housing === 'inn' ? 'inn_room' : 'estate') : 'village_road'].modifiers.rest;
    
    if (gameState.rentActive) {
      const rentCost = LOCATIONS[gameState.housing === 'inn' ? 'inn_room' : 'estate'].dailyCost * daysPassed;
      if (newGold >= rentCost) {
        newGold -= rentCost;
        rentMsg = `Paid rent: -${rentCost}g.`;
      } else {
        newHousing = 'homeless';
        newRentActive = false;
        rentMsg = "Evicted! Couldn't pay rent.";
        addMessage("Evicted!", 'error');
      }
    }
    
    const zone = gameState.stats.mood < 20 || gameState.stats.stress > 80 ? 'crisis' : 'safe';
    let incident = null;
    if (zone === 'crisis' && Math.random() < 0.4) {
      incident = AUTONOMY_EVENTS.major[Math.floor(Math.random() * AUTONOMY_EVENTS.major.length)];
      if(incident.effects.gold) newGold = Math.max(0, newGold + incident.effects.gold);
      if(incident.effects.housing) { newHousing = 'homeless'; newRentActive = false; }
    }
    
    const logEntry = {
      id: Date.now(),
      type: 'morning',
      day: gameState.days,
      sleepLoc: newHousing === 'inn' ? 'Warm Inn' : 'Outside',
      rent: rentMsg,
      incidentText: incident ? incident.text : "A quiet, uneventful night.",
      status: `Restored Health & Mood.`
    };
    
    updateState({
      ...stateUpdates,
      resources: { ...gameState.resources, gold: newGold },
      housing: newHousing,
      rentActive: newRentActive,
      stats: {
        health: Math.min(maxStats.health, gameState.stats.health + (mod.health || 0) + (incident?.effects?.health || 0)),
        stress: Math.max(0, gameState.stats.stress + (mod.stress || 0) + (incident?.effects?.stress || 0)),
        mood: Math.max(0, gameState.stats.mood + (mod.mood || 0) + (incident?.effects?.mood || 0)),
        hunger: Math.min(maxStats.hunger, gameState.stats.hunger + (mod.hunger || 0)),
        thirst: Math.min(maxStats.thirst, gameState.stats.thirst + (mod.thirst || 0))
      },
      shopStock: refreshShop(),
      dailyQuests: generateDailyQuests(gameState.maxTier),
      dailyLogs: [logEntry, ...gameState.dailyLogs]
    });
  };

  const performAction = (action) => {
    if (gameState.isDead) return;
    
    if (action.id === 'rent_start') {
      if (gameState.resources.gold >= 5) {
        updateState({ housing: 'inn', rentActive: true, resources: { ...gameState.resources, gold: gameState.resources.gold - 5 } });
        addMessage("Rented room at Rusty Spoon.", 'success');
      } else addMessage("Not enough gold.", 'error');
      return;
    }
    if (action.id === 'rent_stop') {
      updateState({ housing: 'homeless', rentActive: false });
      addMessage("Checked out.", 'info');
      return;
    }
    
    let cost = action.cost;
    if (gameState.resources.gold < cost) {
      addMessage("Not enough gold!", "error");
      return;
    }
    
    let newResources = { ...gameState.resources, gold: gameState.resources.gold - cost };
    let newStats = { ...gameState.stats };
    let isSuccess = true;
    let failChance = Math.max(0.05, Math.min(0.95, 0.4 - (currentStats.str * 0.01) + (newStats.stress * 0.002)));
    
    if (['labor', 'adventure', 'social'].includes(action.type) && Math.random() < failChance) isSuccess = false;
    
    let logText = isSuccess ? (action.message || "Completed action.") : "Failed miserably.";
    
    if (isSuccess) {
      if (action.effects) {
        if(action.effects.health) newStats.health = Math.max(0, Math.min(maxStats.health, newStats.health + action.effects.health));
        if(action.effects.mood) newStats.mood = Math.max(0, Math.min(maxStats.mood, newStats.mood + action.effects.mood));
        if(action.effects.hunger) newStats.hunger = Math.max(0, Math.min(maxStats.hunger, newStats.hunger + action.effects.hunger));
        if(action.effects.thirst) newStats.thirst = Math.max(0, Math.min(maxStats.thirst, newStats.thirst + action.effects.thirst));
        if(action.effects.stress) newStats.stress = Math.max(0, Math.min(maxStats.stress, newStats.stress + action.effects.stress));
        
        if (action.effects.gold) newResources.gold += action.effects.gold;
        if (action.effects.xp) {
          newResources.xp += action.effects.xp;
          if (newResources.xp >= newResources.level * 100) {
            newResources.level++;
            addMessage(`Level Up! Level ${newResources.level}`, "success");
          }
        }
      }
      addMessage("Action successful.", "success");
    } else {
      newStats.stress = Math.min(100, newStats.stress + 15);
      if (action.type === 'adventure') newStats.health = Math.max(0, newStats.health - 20);
      addMessage("Action failed!", "error");
    }
    
    const isDead = newStats.health <= 0 || newStats.hunger >= 100 || newStats.thirst >= 100;
    if (isDead) addMessage("You have perished.", "error");
    
    updateState({
      resources: newResources,
      stats: newStats,
      isDead,
      dailyLogs: [{ id: Date.now(), type: 'action', day: gameState.days, title: action.label, text: logText, status: isSuccess ? 'Success' : 'Failed' }, ...gameState.dailyLogs]
    });
    
    if (action.days > 0) passTime(action.days);
  };

  const startGame = () => {
    updateState({
      gameStarted: true,
      stats: { ...gameState.stats, health: maxStats.health },
      quirk: QUIRKS[Math.floor(Math.random() * QUIRKS.length)],
      dailyQuests: generateDailyQuests(1),
      shopStock: refreshShop()
    });
  };

  return {
    ...gameState, maxStats, currentStats, messages,
    updateState, performAction, startGame, addMessage
  };
};

/* =========================================================================
   PART 3: UI COMPONENTS
========================================================================= */

const StatBlock = ({ label, value, max, alert, inverted, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl border backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 ${alert ? 'border-red-500/50 bg-red-950/40 shadow-red-900/20' : inverted ? 'border-amber-500/30 bg-amber-950/30 shadow-amber-900/10' : 'border-indigo-500/30 bg-slate-900/60 shadow-indigo-900/10 hover:border-indigo-400'}`}
  >
    <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${alert ? 'text-red-400' : inverted ? 'text-amber-400' : 'text-indigo-300'}`}>{label}</span>
    <span className={`text-sm md:text-lg font-bold font-mono ${alert ? 'text-red-300' : 'text-slate-100'}`}>
      {Math.floor(value)}{max && <span className="text-[10px] text-slate-500">/{max}</span>}
    </span>
  </button>
);

const ActionButton = ({ icon: IconName, label, days, cost, costType = 'gp', onClick, disabled, description }) => {
  const Icon = ICON_MAP[IconName] || HelpCircle;
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`flex items-center gap-3 p-3 w-full rounded-xl border text-left transition-all duration-300 relative overflow-hidden group backdrop-blur-sm ${disabled ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800/60 border-indigo-500/30 text-slate-200 hover:bg-indigo-900/40 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'}`}
    >
      <div className={`p-2 rounded-lg ${disabled ? 'bg-slate-800' : 'bg-slate-900 shadow-inner group-hover:text-indigo-300 transition-colors'}`}>
        <Icon size={18} />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm tracking-wide">{label}</span>
          {days > 0 && <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono"><Clock size={10}/>{days}d</span>}
        </div>
        <span className="text-xs text-slate-500 mt-0.5">{description}</span>
      </div>
      {cost > 0 && (
        <div className={`text-xs font-mono px-2 py-1 rounded-md shadow-inner ${disabled ? 'bg-slate-800 text-slate-600' : 'bg-amber-950/50 text-amber-400 border border-amber-500/20'}`}>
          -{cost}{costType}
        </div>
      )}
    </button>
  );
};

const CharacterSVG = ({ equipped, appearance, isAlive }) => {
  const skin = APPEARANCE_OPTIONS.skinTones.find(t => t.id === appearance.skinTone) || APPEARANCE_OPTIONS.skinTones[1];
  const hair = APPEARANCE_OPTIONS.hairColors.find(c => c.id === appearance.hairColor)?.color || '#3f2307';

  return (
    <svg viewBox="0 0 300 450" className={`w-full h-full drop-shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-1000 ${isAlive ? '' : 'grayscale opacity-50 blur-[2px]'}`}>
      <defs>
        <radialGradient id="skin-gradient" cx="0.4" cy="0.4" r="0.8">
          <stop offset="0%" stopColor={skin.color} />
          <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="50%" stopColor="#e4e4e7" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>
      </defs>

      {/* Body Base */}
      <path d="M130 200 L 130 390 L 145 390 L 145 200 Z" fill={skin.shadow} />
      <path d="M170 200 L 170 390 L 155 390 L 155 200 Z" fill={skin.shadow} />
      <path d="M110 90 L 100 200 L 120 200 Z" fill={skin.shadow} />
      <path d="M190 90 L 200 200 L 180 200 Z" fill={skin.shadow} />
      <path d="M135 90 Q 150 200 165 90 Z" fill="url(#skin-gradient)" />
      
      {/* Dynamic Armor */}
      {equipped.body === 'tunic' && <path d="M120 85 L 180 85 L 170 210 L 130 210 Z" fill="#3f3f46" />}
      {equipped.body === 'leather_armor' && <path d="M120 85 L 180 85 L 175 220 L 125 220 Z" fill="#5f370e" stroke="#3f2307" strokeWidth="2"/>}
      {equipped.body === 'plate' && <path d="M115 80 L 185 80 L 180 220 L 120 220 Z" fill="url(#metal)" stroke="#18181b" strokeWidth="3"/>}

      {/* Head & Hair */}
      <ellipse cx="150" cy="60" rx="20" ry="25" fill="url(#skin-gradient)" />
      {appearance.hairStyle !== 'bald' && <path d="M130 50 Q 150 20 170 50 L 165 70 L 135 70 Z" fill={hair} />}
      
      {/* Dynamic Helm */}
      {equipped.head === 'leather_cap' && <path d="M125 45 Q 150 10 175 45 Z" fill="#5f370e" />}
      {equipped.head === 'iron_helm' && <path d="M125 35 L 175 35 L 175 80 L 125 80 Z" fill="url(#metal)" />}

      {/* Dynamic Weapons */}
      {equipped.mainHand === 'sword' && <path d="M 205 190 L 210 100 L 195 100 Z" fill="url(#metal)" transform="rotate(20 200 200)"/>}
      {equipped.mainHand === 'axe' && <path d="M 200 210 L 200 100 M 200 120 L 220 100 L 220 140 Z" stroke="#3f2307" strokeWidth="4" fill="url(#metal)" transform="rotate(10 200 200)"/>}
      
      {equipped.offHand === 'wooden_shield' && <circle cx="95" cy="180" r="25" fill="#5f370e" stroke="#3f2307" strokeWidth="4"/>}
      {equipped.offHand === 'orb' && <circle cx="95" cy="160" r="15" fill="#6366f1" opacity="0.8" className="animate-pulse"/>}
    </svg>
  );
};

/* =========================================================================
   PART 4: MAIN APPLICATION COMPONENT
========================================================================= */

export default function App() {
  const game = useGameLogic();
  const [activeTab, setActiveTab] = useState('actions');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // -- Creation Screen Rendering --
  if (!game.gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-indigo-500/30">
        <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[85vh]">
          
          <div className="w-full md:w-5/12 bg-slate-950/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
            <div className="absolute top-0 w-full h-32 bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <h1 className="text-3xl font-black mb-8 bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent uppercase tracking-tighter drop-shadow-lg">
              ForgingFate
            </h1>
            <div className="w-56 h-80 relative z-10">
              <CharacterSVG equipped={game.equipped} appearance={game.appearance} isAlive={true} />
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col relative">
            <div className="flex gap-6 mb-8 border-b border-slate-800">
              <button onClick={() => game.updateState({creationStep: 1})} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${game.creationStep === 1 ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>1. Appearance</button>
              <button onClick={() => game.updateState({creationStep: 2})} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${game.creationStep === 2 ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>2. Attributes</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {game.creationStep === 1 && Object.entries(APPEARANCE_OPTIONS).map(([key, options]) => (
                <div key={key}>
                  <h3 className="text-xs font-bold text-indigo-300/50 uppercase tracking-widest mb-3">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {options.map(opt => (
                      <button 
                        key={opt.id} onClick={() => game.updateState({appearance: {...game.appearance, [key.replace('s', '')]: opt.id}})}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold tracking-wide transition-all ${game.appearance[key.replace('s', '')] === opt.id ? 'bg-indigo-600/20 border-indigo-400 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                        style={opt.color ? { backgroundColor: opt.color, color: opt.id==='white'?'black':'white' } : {}}
                      >
                        {opt.label || opt.id}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {game.creationStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex justify-between items-center">
                    <span className="text-sm font-bold text-indigo-200 tracking-wider">Points Available</span>
                    <span className="text-2xl font-mono text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                      {10 - (Object.values(game.attributes).reduce((a,b)=>a+b,0) - 50)}
                    </span>
                  </div>
                  {Object.keys(game.attributes).map(attr => (
                    <div key={attr} className="flex justify-between items-center p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-indigo-500/30 transition-colors">
                      <span className="font-bold uppercase tracking-widest text-slate-300">{attr}</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => game.updateState({attributes: {...game.attributes, [attr]: Math.max(10, game.attributes[attr]-1)}})} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center">-</button>
                        <span className="w-6 text-center font-mono text-lg font-bold">{game.attributes[attr]}</span>
                        <button onClick={() => game.updateState({attributes: {...game.attributes, [attr]: game.attributes[attr]+1}})} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-end">
              <button onClick={game.startGame} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-105 active:scale-95">
                Begin Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -- Main Game UI Rendering --
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black pointer-events-none" />
      <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-black via-slate-950/80 to-transparent z-0 pointer-events-none" />

      {/* Top HUD */}
      <header className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-start z-40">
        <div className="flex gap-4 md:gap-8 bg-slate-900/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700/50 shadow-xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-300/70 font-bold uppercase tracking-widest">Gold</span>
            <span className="text-lg md:text-2xl font-mono text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">{game.resources.gold}</span>
          </div>
          <div className="w-px bg-slate-700/50" />
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-300/70 font-bold uppercase tracking-widest">Day</span>
            <span className="text-lg md:text-2xl font-mono text-slate-100">{game.days}</span>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem(SAVE_KEY); window.location.reload(); }} className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 hover:bg-red-900 hover:text-white transition-all backdrop-blur-md">
          <Trash2 size={18} />
        </button>
      </header>

      {/* Toast Messages */}
      <div className="absolute top-24 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {game.messages.map(m => (
          <div key={m.id} className={`px-4 py-2 rounded-lg shadow-2xl text-xs font-bold tracking-wide border backdrop-blur-md animate-in slide-in-from-right fade-in duration-300 ${m.type === 'error' ? 'bg-red-950/80 border-red-500/50 text-red-200' : 'bg-indigo-900/80 border-indigo-500/50 text-indigo-100'}`}>
            {m.text}
          </div>
        ))}
      </div>

      {/* Main Stage (Character & Stats) */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex items-center justify-between px-4 z-10 pt-16">
        
        {/* Left Stats */}
        <div className="flex flex-col gap-3 md:gap-4 z-20">
          <StatBlock label="AC" value={game.currentStats.ac} />
          <StatBlock label="STR" value={game.currentStats.str} />
          <StatBlock label="DEX" value={game.currentStats.dex} />
          <StatBlock label="CON" value={game.currentStats.con} />
          <StatBlock label="INT" value={game.currentStats.int} />
        </div>

        {/* Character Avatar */}
        <div className="flex-1 h-[50vh] md:h-[60vh] relative flex flex-col justify-center items-center">
          {game.quirk && (
            <div className="absolute top-0 flex items-center gap-2 px-3 py-1.5 bg-indigo-950/60 border border-indigo-500/30 rounded-full text-xs text-indigo-200 font-bold backdrop-blur-md shadow-xl">
              <Brain size={14} className="text-indigo-400" /> {game.quirk.name}
            </div>
          )}
          <CharacterSVG equipped={game.equipped} appearance={game.appearance} isAlive={!game.isDead} />
          
          {game.isDead && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl z-50">
              <div className="text-center p-8 bg-slate-900 border border-red-900/50 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                <Skull className="w-16 h-16 text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <h2 className="text-2xl font-bold text-red-400 mb-2 tracking-widest uppercase">Perished</h2>
                <button onClick={() => game.updateState({stats: {...game.stats, health: game.maxStats.health}, isDead: false})} className="mt-6 px-6 py-3 bg-red-950 hover:bg-red-900 text-red-200 font-bold uppercase tracking-wider rounded-xl border border-red-800 transition-all">
                  Revive (-50 XP)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Stats */}
        <div className="flex flex-col gap-3 md:gap-4 z-20">
          <StatBlock label="HP" value={game.stats.health} max={game.maxStats.health} alert={game.stats.health < 10} />
          <StatBlock label="Mood" value={game.stats.mood} max={100} alert={game.stats.mood < 30} />
          <StatBlock label="Hunger" value={game.stats.hunger} max={100} alert={game.stats.hunger > 80} inverted />
          <StatBlock label="Thirst" value={game.stats.thirst} max={100} alert={game.stats.thirst > 80} inverted />
          <StatBlock label="Stress" value={game.stats.stress} max={100} alert={game.stats.stress > 80} inverted />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] h-20 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-around items-center z-50 px-2">
         {[
           { id: 'actions', icon: Activity, label: 'Actions' },
           { id: 'quests', icon: Scroll, label: 'Quests' },
           { id: 'equip', icon: Backpack, label: 'Gear' },
           { id: 'reports', icon: ClipboardList, label: 'Logs' }
         ].map(tab => (
           <button 
             key={tab.id} onClick={() => { setActiveTab(tab.id); setIsPanelOpen(true); }}
             className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-20 transition-all ${activeTab === tab.id && isPanelOpen ? 'text-indigo-300 bg-indigo-950/50 shadow-inner' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
           >
             <tab.icon size={22} className={activeTab === tab.id && isPanelOpen ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''} />
             <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
           </button>
         ))}
      </nav>

      {/* Action Drawer Panel */}
      <div className={`fixed z-40 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] w-full md:w-[450px] md:h-[calc(100vh-2rem)] md:top-4 md:right-4 md:bottom-auto bottom-0 rounded-t-3xl md:rounded-3xl flex flex-col ${isPanelOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-[120%]'}`} style={!isPanelOpen ? { height: '60vh'} : { height: '60vh' }}>
        
        {/* Panel Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-2">
            {activeTab === 'actions' && <Activity size={16}/>}
            {activeTab === 'quests' && <Scroll size={16}/>}
            {activeTab === 'equip' && <Backpack size={16}/>}
            {activeTab === 'reports' && <ClipboardList size={16}/>}
            {activeTab}
          </h2>
          <button onClick={() => setIsPanelOpen(false)} className="p-2 bg-slate-800/50 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Panel Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar pb-32 md:pb-6">
          
          {/* ACTIONS TAB */}
          {activeTab === 'actions' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 block">Housing Status</span>
                {game.housing === 'homeless' ? (
                  <button onClick={() => game.performAction({ id: 'rent_start' })} className="w-full flex items-center justify-between p-4 rounded-xl border border-amber-600/30 bg-amber-950/20 hover:bg-amber-900/40 text-amber-200 transition-colors">
                    <div className="flex flex-col text-left"><span className="text-sm font-bold">Rent Inn Room</span><span className="text-[10px] opacity-70 mt-0.5">5g/day. Safe rest.</span></div>
                    <span className="text-xs font-mono font-bold bg-amber-950/50 px-2 py-1 rounded">-5g</span>
                  </button>
                ) : (
                  <button onClick={() => game.performAction({ id: 'rent_stop' })} className="w-full flex items-center justify-between p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/50 text-indigo-200 transition-colors">
                    <div className="flex flex-col text-left"><span className="text-sm font-bold">Check Out</span><span className="text-[10px] opacity-70 mt-0.5">Stop paying rent.</span></div>
                    <Key size={16} className="opacity-70"/>
                  </button>
                )}
              </div>
              <div className="h-px bg-slate-800 w-full" />
              <div className="space-y-2">
                {MAINTENANCE_ACTIONS.map(action => <ActionButton key={action.id} {...action} onClick={() => game.performAction(action)} disabled={game.isDead} />)}
              </div>
            </div>
          )}

          {/* QUESTS TAB */}
          {activeTab === 'quests' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block pl-2">Daily Labor</span>
                {game.dailyQuests.labor.map(action => <ActionButton key={action.id} {...action} onClick={() => game.performAction(action)} disabled={game.isDead} />)}
              </div>
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block pl-2">Adventures</span>
                {game.dailyQuests.adventure.map(action => <ActionButton key={action.id} {...action} onClick={() => game.performAction(action)} disabled={game.isDead} />)}
              </div>
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block pl-2">Socializing</span>
                {game.dailyQuests.social.map(action => <ActionButton key={action.id} {...action} onClick={() => game.performAction(action)} disabled={game.isDead} />)}
              </div>
            </div>
          )}

          {/* EQUIPMENT TAB */}
          {activeTab === 'equip' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {['head', 'body', 'mainHand', 'offHand'].map(slot => (
                 <div key={slot} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-3">{slot.replace('Hand', ' Hand')}</span>
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-indigo-200 tracking-wide">
                        {ITEM_DB[slot].find(i => i.id === game.equipped[slot])?.name || 'Empty'}
                     </span>
                     <span className="text-[10px] font-bold text-indigo-500 bg-indigo-950/50 px-2 py-1 rounded border border-indigo-900/50">EQUIPPED</span>
                   </div>
                 </div>
               ))}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {game.dailyLogs.length === 0 ? (
                <div className="text-center p-8 text-slate-500 text-sm font-medium italic border border-dashed border-slate-800 rounded-2xl">The pages are blank. Go do something.</div>
              ) : game.dailyLogs.map(log => (
                <div key={log.id} className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
                  {log.type === 'morning' ? (
                    <>
                      <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
                         <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2"><Sun size={12} /> Day {log.day} Dawn</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-slate-300 italic font-serif border-l-2 border-slate-700 pl-3">"{log.incidentText}"</p>
                        <div className="text-xs text-slate-500 flex justify-between pt-2 border-t border-slate-800/50">
                          <span>{log.sleepLoc}</span><span>{log.rent}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                           <span className={log.status === 'Success' ? 'text-emerald-400' : 'text-red-400'}>●</span> {log.title}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Day {log.day}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{log.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
