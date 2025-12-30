import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Shield, Sword, VenetianMask, Shirt, RotateCcw, User, Palette, 
  Backpack, X, Heart, Zap, Sparkles, Utensils, Coins, 
  Hammer, Tent, Scroll, Skull, Menu, Activity, Droplets, MapPin, Info, ShoppingBag, DollarSign, HelpCircle, Frown, Clock, Key, Apple, Beer
} from 'lucide-react';

/* -------------------------------------------------------------------------
  THEME: CHAOTIC ADVENTURER SIMULATOR
  
  This game focuses on how absolutely weird, terrible, and chaotic D&D 
  adventurers are. They make poor choices, have messy relationships, 
  get confused, and tend to be violent and disruptive.
  
  Design Pillars:
  1. Consequences: Good stats (Gold/XP) come at the cost of survival stats.
  2. Chaos: Random loot, weird quest flavor text.
  3. Lifestyle: From homelessness to luxury (eventually).
  -------------------------------------------------------------------------
*/

// --- Database of Items ---
const ITEM_DB = {
  head: [
    { id: 'none', name: 'Bare', type: 'head', stats: { ac: 0 }, cost: 0, description: 'Wind in your hair.' },
    { id: 'leather_cap', name: 'Cap', type: 'head', stats: { ac: 1 }, cost: 15, description: 'Basic protection.' },
    { id: 'iron_helm', name: 'Helm', type: 'head', stats: { ac: 3, dex: -1 }, cost: 50, description: 'Heavy protection for the skull.' },
    { id: 'wizard_hat', name: 'Hat', type: 'head', stats: { int: 2 }, cost: 40, description: 'Pointy and full of stars.' },
    { id: 'crown', name: 'Crown', type: 'head', stats: { cha: 3 }, cost: 500, description: 'Fit for a king.' },
  ],
  body: [
    { id: 'tunic', name: 'Tunic', type: 'body', stats: { ac: 0 }, cost: 0, description: 'Simple cloth.' },
    { id: 'leather_armor', name: 'Leather', type: 'body', stats: { ac: 2 }, cost: 45, description: 'Flexible and tough.' },
    { id: 'chainmail', name: 'Chain', type: 'body', stats: { ac: 5, dex: -2 }, cost: 120, description: 'Interlocking metal rings.' },
    { id: 'plate', name: 'Plate', type: 'body', stats: { ac: 8, dex: -4 }, cost: 350, description: 'The ultimate defense.' },
    { id: 'robe', name: 'Robe', type: 'body', stats: { ac: 1, int: 1 }, cost: 30, description: 'Flowing fabric capable of holding enchantments.' },
  ],
  mainHand: [
    { id: 'fist', name: 'Fist', type: 'mainHand', stats: { str: 0 }, cost: 0, description: 'Your bare knuckles.' },
    { id: 'sword', name: 'Sword', type: 'mainHand', stats: { str: 2 }, cost: 25, description: 'A reliable blade.' },
    { id: 'axe', name: 'Axe', type: 'mainHand', stats: { str: 3 }, cost: 40, description: 'Heavy and sharp.' },
    { id: 'staff', name: 'Staff', type: 'mainHand', stats: { int: 1, str: 1 }, cost: 15, description: 'Good for walking and casting.' },
    { id: 'dagger', name: 'Dagger', type: 'mainHand', stats: { dex: 2, str: 1 }, cost: 15, description: 'Quick and deadly.' },
  ],
  offHand: [
    { id: 'none', name: 'Empty', type: 'offHand', stats: { ac: 0 }, cost: 0, description: 'Free hand.' },
    { id: 'wooden_shield', name: 'Shield', type: 'offHand', stats: { ac: 1 }, cost: 15, description: 'Small wooden defense.' },
    { id: 'tower_shield', name: 'Tower', type: 'offHand', stats: { ac: 3, dex: -2 }, cost: 60, description: 'A portable wall.' },
    { id: 'orb', name: 'Orb', type: 'offHand', stats: { int: 3 }, cost: 200, description: 'Glows with mysterious power.' },
  ],
  // NEW CATEGORY: SUPPLIES (Consumables)
  supplies: [
    { id: 'apple', name: 'Apple', type: 'food', cost: 2, description: 'Fresh and crunchy.', effects: { hunger: -15, health: 2 } },
    { id: 'ration', name: 'Dried Ration', type: 'food', cost: 5, description: 'Lasts forever. Tastes like dust.', effects: { hunger: -30, health: 5 } },
    { id: 'feast', name: 'Grand Feast', type: 'food', cost: 25, description: 'A portable banquet.', effects: { hunger: -80, mood: 20, health: 10 } },
    { id: 'water', name: 'Water Skin', type: 'drink', cost: 1, description: 'Basic hydration.', effects: { thirst: -25 } },
    { id: 'ale', name: 'Bottle of Ale', type: 'drink', cost: 8, description: 'Good for the soul, bad for the liver.', effects: { thirst: -15, mood: 10, stress: -10 } },
    { id: 'potion', name: 'Health Potion', type: 'potion', cost: 50, description: 'Magical red liquid.', effects: { health: 50 } },
  ]
};

// --- Locations & Scenes ---
const LOCATIONS = {
  village_road: {
    id: 'village_road',
    name: 'Village Road',
    type: 'homeless',
    description: 'Sleeping in the dirt. It is cold.',
    details: "Living on the road can be hard on the body and mind. Earn some gold to stay at an Inn or save up to buy a home.",
    dailyCost: 0,
    hasFoodService: false, 
    tips: [
      { label: "Health", text: "Recovers only 5 (instead of 15).", type: "bad" },
      { label: "Stress", text: "Reduces by only 5 (instead of 20).", type: "bad" },
      { label: "Mood", text: "Decreases by 10 (because sleeping outside is miserable).", type: "bad" },
      { label: "Food/Drink", text: "Cannot purchase meals instantly. Must use Inventory.", type: "bad" }
    ],
    renderBackground: () => (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900/20" />
        <div className="absolute top-10 left-20 w-1 h-1 bg-white opacity-40 rounded-full" />
        <div className="absolute top-20 left-1/4 w-0.5 h-0.5 bg-white opacity-60 rounded-full" />
        <div className="absolute top-5 right-1/3 w-1 h-1 bg-white opacity-30 rounded-full" />
        <div className="absolute top-10 right-10 w-12 h-12 rounded-full bg-indigo-100/20 blur-xl" />
        <div className="absolute top-12 right-12 w-8 h-8 rounded-full bg-indigo-50/80 shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
        <div className="absolute bottom-[35%] left-0 right-0 h-24 bg-slate-900 opacity-40 [clip-path:polygon(0%_100%,0%_20%,20%_0%,50%_30%,80%_10%,100%_40%,100%_100%)]" />
        <div className="absolute bottom-[35%] left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-60">
            <div className="w-16 h-12 bg-slate-900 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
            <div className="w-10 h-24 bg-slate-900 [clip-path:polygon(10%_100%,10%_10%,0%_10%,10%_0%,90%_0%,100%_10%,90%_10%,90%_100%)]" />
            <div className="w-20 h-16 bg-slate-900 [clip-path:polygon(0%_100%,0%_30%,20%_30%,50%_0%,80%_30%,100%_30%,100%_100%)]" />
            <div className="w-24" />
            <div className="w-14 h-14 bg-slate-900 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
        </div>
        <div className="absolute bottom-[35%] -left-10 w-32 h-24 bg-slate-950 opacity-80 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
        <div className="absolute bottom-[35%] -right-10 w-40 h-28 bg-slate-950 opacity-80 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#3f2e18]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-96 h-[35%] bg-[#5c4026] [clip-path:polygon(20%_0,80%_0,100%_100%,0%_100%)] opacity-80" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#0f172a_100%) opacity-60" />
      </div>
    ),
    modifiers: {
      rest: { health: 5, stress: -5, mood: -10, hunger: 5, thirst: 5 } 
    }
  },
  inn_room: {
    id: 'inn_room',
    name: 'Rusty Spoon Inn',
    type: 'renting',
    description: 'A warm bed and a roof. Costs 5g/day.',
    details: "A modest room. It smells of ale and old wood, but it beats the rain. Room service is available for a fee.",
    dailyCost: 5,
    hasFoodService: true, 
    tips: [
      { label: "Rest", text: "Full recovery benefits.", type: "good" },
      { label: "Cost", text: "5 Gold deducted daily automatically.", type: "bad" },
      { label: "Service", text: "Can order food/drink directly.", type: "good" }
    ],
    renderBackground: () => (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#1a120b]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3f2e18_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-10 left-10 w-24 h-32 bg-[#0f172a] border-4 border-[#3f2e18] rounded-t-full overflow-hidden">
           <div className="absolute top-2 right-4 w-4 h-4 bg-white rounded-full opacity-80 shadow-[0_0_10px_white]" />
           <div className="absolute bottom-0 w-full h-1 bg-black/50" />
           <div className="absolute w-1 h-full left-1/2 bg-[#3f2e18]" />
           <div className="absolute h-1 w-full top-1/2 bg-[#3f2e18]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-[#2a1d10] border-t border-[#3f2e18]" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-red-900/40 rounded-[50%]" />
      </div>
    ),
    modifiers: {
      rest: { health: 15, stress: -20, mood: 5, hunger: 5, thirst: 5 } 
    }
  }
};

// --- Appearance Options ---
const APPEARANCE_OPTIONS = {
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

// --- CONSTANTS ---
const MAX_STAT = 100;
const SAVE_KEY = 'dnd_tamagotchi_v14_failures'; 

// --- SVG Components (The Visuals) ---

const CharacterSVG = ({ equipped, appearance, isAlive }) => {
  const { gender, skinTone, hairColor, eyeColor, hairStyle } = appearance;
  
  const skin = APPEARANCE_OPTIONS.skinTones.find(t => t.id === skinTone) || APPEARANCE_OPTIONS.skinTones[1];
  const hair = APPEARANCE_OPTIONS.hairColors.find(c => c.id === hairColor)?.color || '#3f2307';
  const eyes = APPEARANCE_OPTIONS.eyeColors.find(c => c.id === eyeColor)?.color || '#451a03';

  const wearingHat = ['leather_cap', 'wizard_hat', 'iron_helm'].includes(equipped.head);
  const wearingFullHelm = equipped.head === 'iron_helm';

  const getZoneStyles = () => {
    const styles = {
      head: { fill: 'url(#skin-gradient)', filter: 'none', stroke: skin.shadow },
      torso: { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' }, 
      legs: { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }, 
      pelvis: { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }, 
      arms: { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' }, 
      boots: { fill: '#18181b', stroke: '#000000' } 
    };

    switch (equipped.body) {
      case 'tunic':
        styles.torso = { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' };
        styles.legs = { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' };
        styles.pelvis = { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }; 
        styles.arms = { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' };
        styles.boots = { fill: '#18181b', stroke: '#000000' };
        break;
      case 'leather_armor':
        styles.torso = { fill: '#5f370e', filter: 'url(#leather-noise)', stroke: '#3f2307' };
        styles.legs = { fill: '#3f2307', filter: 'url(#leather-noise)', stroke: '#271c19' };
        styles.pelvis = { fill: '#3f2307', filter: 'url(#leather-noise)', stroke: '#271c19' }; 
        styles.arms = { fill: '#5f370e', filter: 'url(#leather-noise)', stroke: '#3f2307' }; 
        styles.boots = { fill: '#271c19', stroke: '#000000' };
        break;
      case 'chainmail':
        const chainStyle = { fill: 'url(#chain-pattern)', filter: 'none', stroke: '#3f3f46' };
        styles.torso = chainStyle;
        styles.pelvis = chainStyle;
        styles.arms = chainStyle;
        styles.legs = { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' };
        styles.boots = { fill: '#18181b', stroke: '#000000' };
        break;
      case 'plate':
        const plateStyle = { fill: 'url(#metal-sheen)', filter: 'none', stroke: '#27272a' };
        styles.torso = plateStyle;
        styles.legs = plateStyle;
        styles.pelvis = plateStyle;
        styles.arms = plateStyle;
        styles.boots = { fill: 'url(#metal-sheen)', stroke: '#27272a' };
        break;
      case 'robe':
        const robeStyle = { fill: '#312e81', filter: 'url(#fabric-noise)', stroke: '#1e1b4b' };
        styles.torso = robeStyle;
        styles.legs = robeStyle;
        styles.pelvis = robeStyle;
        styles.arms = robeStyle; 
        styles.boots = { fill: '#1e1b4b', stroke: '#000000' }; 
        break;
      default:
        break;
    }

    switch (equipped.head) {
      case 'iron_helm':
        styles.head = { fill: 'url(#metal-sheen)', filter: 'none', stroke: '#27272a' };
        break;
      default: 
        break;
    }

    return styles;
  };

  const s = getZoneStyles();

  // --- Gender Specific Paths ---
  let torsoPath;
  if (gender === 'female') {
    torsoPath = `M142 80 Q 142 88 135 90 Q 115 92 112 105 Q 108 115 115 160 L 132 200 L 168 200 L 185 160 Q 192 115 188 105 Q 185 92 165 90 Q 158 88 158 80 Z`;
  } else {
    torsoPath = `M142 80 Q 142 88 135 90 Q 115 92 110 105 Q 105 115 112 160 L 130 200 L 170 200 L 188 160 Q 195 115 190 105 Q 185 92 165 90 Q 158 88 158 80 Z`;
  }

  let pelvisPath;
  if (gender === 'female') {
    pelvisPath = `M132 200 L 168 200 L 150 225 Z`; 
  } else {
    pelvisPath = `M130 200 L 170 200 L 150 225 Z`;
  }

  let headPath;
  if (gender === 'female') {
    headPath = `M 132 60 C 132 35 168 35 168 60 C 168 75 150 85 150 85 C 150 85 132 75 132 60 Z`; 
  } else {
    headPath = null;
  }

  return (
    <svg viewBox="0 0 300 450" className={`w-full h-full transition-all duration-1000 ${isAlive ? '' : 'grayscale opacity-50'}`}>
      <defs>
        <filter id="leather-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.2 0" in="noise" result="softNoise"/>
          <feComposite operator="in" in="softNoise" in2="SourceGraphic" result="composite"/>
          <feBlend mode="multiply" in="composite" in2="SourceGraphic"/>
        </filter>

        <filter id="fabric-noise">
           <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" result="noise" />
           <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.15 0" in="noise" result="softNoise"/>
           <feComposite operator="in" in="softNoise" in2="SourceGraphic" result="composite"/>
           <feBlend mode="multiply" in="composite" in2="SourceGraphic"/>
        </filter>

        <linearGradient id="metal-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="30%" stopColor="#e4e4e7" />
          <stop offset="60%" stopColor="#71717a" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>

        <radialGradient id="skin-gradient" cx="0.4" cy="0.4" r="0.8">
           <stop offset="0%" stopColor={skin.color} />
           <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>

        <pattern id="chain-pattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
           <rect width="6" height="6" fill="#52525b" />
           <circle cx="3" cy="3" r="2" fill="#71717a" />
        </pattern>
        
        <linearGradient id="gold-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#713f12" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>

      {/* --- ZONES --- */}

      <g id="legs" filter={s.legs.filter}>
        {equipped.body === 'robe' ? (
          <path d={`M125 210 L 110 390 Q 150 405 190 390 L 175 210 Z`}
                fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
        ) : (
          <g>
            <path d={`M${gender === 'female' ? 128 : 130} 200 Q 120 250 125 300 L 128 390 L 145 390 L 148 300 Q 150 250 ${gender === 'female' ? 148 : 148} 300 L 150 210 Z`} 
                  fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
            <path d={`M${gender === 'female' ? 172 : 170} 200 Q 180 250 175 300 L 172 390 L 155 390 L 152 300 Q 150 250 ${gender === 'female' ? 152 : 152} 300 L 150 210 Z`} 
                  fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
            
             {s.boots && s.boots.fill !== 'none' && (
               <g>
                 <path d="M125 300 L 128 390 L 145 390 L 148 300 Q 136 310 125 300" fill={s.boots.fill} stroke={s.boots.stroke} strokeWidth="1.5" />
                 <path d="M175 300 L 172 390 L 155 390 L 152 300 Q 164 310 175 300" fill={s.boots.fill} stroke={s.boots.stroke} strokeWidth="1.5" />
                 
                 {equipped.body === 'plate' && (
                    <g stroke="#27272a" strokeWidth="1" fill="none">
                        <path d="M126 330 L 147 330" />
                        <path d="M127 360 L 146 360" />
                        <path d="M153 330 L 174 330" />
                        <path d="M154 360 L 173 360" />
                    </g>
                 )}
               </g>
             )}

             <path d="M128 375 Q 136.5 370 145 375" 
                   stroke="#000000" 
                   strokeWidth="1.5" fill="none" opacity="0.6" />
             <path d="M155 375 Q 163.5 370 172 375" 
                   stroke="#000000" 
                   strokeWidth="1.5" fill="none" opacity="0.6" />

             {equipped.body === 'plate' && (
               <g>
                 <circle cx="137" cy="300" r="10" fill="url(#metal-sheen)" stroke="#27272a" />
                 <circle cx="163" cy="300" r="10" fill="url(#metal-sheen)" stroke="#27272a" />
               </g>
             )}
          </g>
        )}
      </g>

      <g id="pelvis" filter={s.pelvis.filter}>
         {equipped.body !== 'robe' && (
            <path d={pelvisPath} fill={s.pelvis.fill} stroke={s.pelvis.stroke} strokeWidth="1.5" />
         )}
      </g>

      <g id="torso" filter={s.torso.filter}>
        <path d={torsoPath} fill={s.torso.fill} stroke={s.torso.stroke} strokeWidth="1.5" />
        
        {gender === 'female' && equipped.body !== 'plate' && (
           <path d="M 128 115 Q 140 125 150 115 Q 160 125 172 115"
                 stroke={s.torso.stroke} strokeWidth="1" fill="none" opacity="0.6" />
        )}

        {(equipped.body === 'tunic' || equipped.body === 'leather_armor') && (
           <path d="M150 95 L 150 200" stroke={s.torso.stroke} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
        )}
        {equipped.body === 'plate' && (
            <path d="M115 140 Q 150 160 185 140" stroke="#27272a" strokeWidth="1.5" fill="none" />
        )}
      </g>
      
      <g id="arms" filter={s.arms.filter}>
        <path d="M110 105 Q 105 110 108 125 Q 110 145 100 190 L 95 210 L 110 210 L 120 190 Q 125 150 120 105 Z" 
              fill={s.arms.fill} stroke={s.arms.stroke} strokeWidth="1.5" />
        
        <path d="M190 105 Q 195 110 192 125 Q 190 145 200 190 L 205 210 L 190 210 L 180 190 Q 175 150 180 105 Z" 
              fill={s.arms.fill} stroke={s.arms.stroke} strokeWidth="1.5" />
        
        {equipped.body === 'plate' && (
           <g>
             <path d="M100 75 Q 85 85 90 115 L 120 105 Z" fill="url(#metal-sheen)" stroke="#27272a" />
             <path d="M200 75 Q 215 85 210 115 L 180 105 Z" fill="url(#metal-sheen)" stroke="#27272a" />
           </g>
        )}
      </g>

      <g id="hands">
         <circle cx="102" cy="215" r="8" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1"/>
         <circle cx="198" cy="215" r="8" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1"/>
      </g>

      <g id="head">
        {!wearingFullHelm && (
          <g>
             <ellipse cx="133" cy="60" rx="4" ry="7" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1" transform="rotate(-10, 133, 60)" />
             <ellipse cx="167" cy="60" rx="4" ry="7" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1" transform="rotate(10, 167, 60)" />
          </g>
        )}

        {headPath ? (
           <path d={headPath} fill={s.head.fill} stroke={s.head.stroke} strokeWidth="1.5" />
        ) : (
           <ellipse cx="150" cy="60" rx="18" ry="22" fill={s.head.fill} stroke={s.head.stroke} strokeWidth="1.5" />
        )}

        {!wearingFullHelm && (
           <g id="face-features">
             <path d="M138 54 Q 143 51 147 54" stroke="#3f2307" strokeWidth="1.5" fill="none" opacity="0.8" />
             <path d="M153 54 Q 157 51 162 54" stroke="#3f2307" strokeWidth="1.5" fill="none" opacity="0.8" />

             <circle cx="143" cy="60" r="2" fill={isAlive ? eyes : '#000'} />
             <circle cx="157" cy="60" r="2" fill={isAlive ? eyes : '#000'} />
             {isAlive && (
              <>
               <circle cx="143.5" cy="59.5" r="0.5" fill="#fff" opacity="0.6" />
               <circle cx="157.5" cy="59.5" r="0.5" fill="#fff" opacity="0.6" />
              </>
             )}
             
             {gender === 'female' && (
                <g stroke={hair} strokeWidth="1">
                   <path d="M141 58 L 139 56" />
                   <path d="M159 58 L 161 56" />
                </g>
             )}

             {isAlive ? (
               <path d="M150 60 L 149 68 L 152 70" fill="none" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
             ) : (
               <path d="M150 60 L 149 68 L 152 70" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
             )}

             {isAlive ? (
               <path d="M145 76 Q 150 79 155 76" stroke={skin.shadow} strokeWidth="1.5" fill="none" strokeLinecap="round" />
             ) : (
               <path d="M145 79 Q 150 76 155 79" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" />
             )}
             
             {!wearingHat && hairStyle !== 'bald' && (
                <>
                  {hairStyle === 'short' && (
                      <path d="M150 35 Q 170 35 168 57 L 168 67 L 162 52 Q 150 42 138 52 L 132 67 L 132 57 Q 130 35 150 35" fill={hair} />
                  )}
                  {hairStyle !== 'long' && (
                     <path d="M150 35 Q 170 35 168 57 L 168 67 L 162 52 Q 150 42 138 52 L 132 67 L 132 57 Q 130 35 150 35" fill={hair} />
                  )}
                </>
             )}

             {hairStyle === 'long' && (
                <g>
                   <path d="M130 50 L 125 90 L 140 90 L 135 50" fill={hair} />
                   <path d="M170 50 L 175 90 L 160 90 L 165 50" fill={hair} />
                   
                   {!wearingHat && (
                      <path d="M150 35 Q 175 35 170 65 L 175 90 L 160 90 L 160 55 Q 150 45 140 55 L 140 90 L 125 90 L 130 65 Q 125 35 150 35" fill={hair} />
                   )}
                </g>
             )}

             {equipped.head === 'leather_cap' && (
                <path d="M120 53 Q 150 0 180 53 L 180 58 L 120 58 Z" fill="#5f370e" stroke="#3f2307" />
             )}
             
             {equipped.head === 'wizard_hat' && (
                <g transform="translate(150, 45)"> 
                   <ellipse cx="0" cy="0" rx="35" ry="8" fill="#312e81" stroke="#1e1b4b" />
                   <path d="M-18 0 L -2 -70 L 2 -70 L 18 0 Z" fill="#312e81" stroke="#1e1b4b" />
                </g>
             )}
             
             {equipped.head === 'crown' && (
                <path d="M134 47 L 140 35 L 150 49 L 160 35 L 166 47 Q 150 52 134 47" 
                      fill="none" stroke="url(#gold-sheen)" strokeWidth="2" strokeLinejoin="round" />
             )}
           </g>
        )}
        
        {wearingFullHelm && (
           <g>
             <path d="M129 35 Q 150 27 171 35 L 173 79 Q 150 87 127 79 L 129 35" 
                   fill="url(#metal-sheen)" stroke="#27272a" strokeWidth="1.5" />
             <path d="M129 52 L 171 52" stroke="#18181b" strokeWidth="2" />
             <line x1="150" y1="35" x2="150" y2="82" stroke="#18181b" strokeWidth="1" opacity="0.3" />
           </g>
        )}
      </g>

      <g id="main-hand" transform="translate(205, 200) rotate(45)">
        {equipped.mainHand === 'sword' && (
          <g transform="scale(1.75) translate(0, 5)">
            <line x1="0" y1="10" x2="0" y2="-10" stroke="#3f2307" strokeWidth="2" /> 
            <circle cx="0" cy="12" r="3" fill="#52525b" stroke="#27272a" strokeWidth="0.5"/>
            <rect x="-10" y="-14" width="20" height="4" fill="#52525b" stroke="#27272a" rx="1" strokeWidth="0.5"/>
            <path d="M-4 -14 L 4 -14 L 3 -80 L 0 -90 L -3 -80 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="0.5"/>
            <line x1="0" y1="-14" x2="0" y2="-80" stroke="#52525b" strokeWidth="0.5" opacity="0.5" />
          </g>
        )}
        {equipped.mainHand === 'axe' && (
           <g>
             <rect x="-3" y="-15" width="6" height="120" fill="#3f2307" rx="1" transform="translate(0, -40)" /> 
             <g transform="translate(0, -70)">
                <rect x="-6" y="-15" width="12" height="30" fill="#52525b" />
                <path d="M 6 -15 L 25 -15 Q 35 0 25 15 L 6 15 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="1.5" />
                <path d="M -6 -15 L -25 -15 Q -35 0 -25 15 L -6 15 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="1.5" />
             </g>
           </g>
        )}
        {equipped.mainHand === 'staff' && (
            <g>
              <rect x="-3" y="-60" width="6" height="150" fill="#3f2307" rx="2" />
              <circle cx="0" cy="-60" r="10" fill="url(#skin-gradient)" />
              <circle cx="0" cy="-60" r="6" fill="#10b981" className="animate-pulse" />
            </g>
        )}
         {equipped.mainHand === 'dagger' && (
           <g transform="scale(1.5)">
             <line x1="0" y1="8" x2="0" y2="-8" stroke="#3f2307" strokeWidth="2" />
             <circle cx="0" cy="10" r="2" fill="#52525b" />
             <rect x="-6" y="-10" width="12" height="2" fill="#52525b" />
             <path d="M-3 -10 L 3 -10 L 0 -40 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="0.5"/>
           </g>
        )}
      </g>

      <g id="off-hand" transform="translate(95, 200) rotate(10)">
         {equipped.offHand === 'wooden_shield' && (
            <g transform="translate(-20, -20)">
               <circle cx="20" cy="20" r="25" fill="#5f370e" stroke="#3f2307" strokeWidth="3" filter="url(#leather-noise)"/>
               <circle cx="20" cy="20" r="5" fill="#52525b" />
            </g>
         )}
         {equipped.offHand === 'tower_shield' && (
            <g transform="translate(-20, -40)">
               <path d="M0 0 L 40 0 L 40 80 L 20 90 L 0 80 Z" fill="url(#metal-sheen)" stroke="#27272a" strokeWidth="3" />
            </g>
         )}
         {equipped.offHand === 'orb' && (
           <g transform="translate(0, -10)">
            <circle cx="0" cy="0" r="24" fill="#6366f1" fillOpacity="0.8" stroke="#4338ca" strokeWidth="2" />
            <circle cx="0" cy="0" r="16" fill="none" stroke="#c7d2fe" strokeWidth="1" className="animate-spin-slow" strokeDasharray="4 4"/>
           </g>
         )}
      </g>
    </svg>
  );
};


// --- Sub Components ---

const StatBlock = ({ label, value, max, alert, inverted, onClick }) => (
    <button 
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-slate-800/60 rounded-lg border backdrop-blur-sm shadow-sm transition-all hover:scale-105 active:scale-95
        ${alert ? 'border-red-500/50 bg-red-900/10' : inverted ? 'border-amber-500/50 bg-amber-900/10' : 'border-slate-700/50 hover:border-slate-500'}
      `}
    >
        <span className={`text-[7px] md:text-[9px] font-bold uppercase tracking-tighter ${alert ? 'text-red-400' : inverted ? 'text-amber-400' : 'text-slate-500'}`}>{label}</span>
        <span className={`text-[10px] md:text-sm font-bold font-mono ${alert ? 'text-red-400' : inverted ? 'text-amber-200' : 'text-slate-200'}`}>
          {Math.floor(value)}{max !== undefined && <span className="text-[8px] md:text-[10px] text-slate-500">/{max}</span>}
        </span>
    </button>
);

const ActionButton = ({ icon: Icon, label, days, cost, costType = 'gp', onClick, disabled, description }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-3 p-3 w-full rounded-lg border text-left transition-all relative overflow-hidden group
      ${disabled 
        ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed opacity-70' 
        : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-indigo-900/30 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10'}
    `}
  >
    <div className={`p-2 rounded-md ${disabled ? 'bg-slate-700' : 'bg-slate-900 group-hover:text-indigo-400'}`}>
      <Icon size={18} />
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <span className="font-bold text-xs truncate">{label}</span>
        {days > 0 && <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Clock size={10}/> {days}d</span>}
      </div>
      <span className="text-[10px] text-slate-500 truncate">{description}</span>
    </div>
    {cost > 0 && (
      <div className={`text-[10px] font-mono px-2 py-1 rounded ${disabled ? 'bg-slate-700' : 'bg-black/40'} ${costType === 'gp' ? 'text-amber-400' : 'text-cyan-400'}`}>
        -{cost}{costType}
      </div>
    )}
  </button>
);

// Helper to render stats line
const renderItemStats = (item) => {
  if (item.stats) {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(item.stats).map(([key, val]) => (
          <span key={key} className={`text-[9px] px-1 rounded ${val > 0 ? 'bg-slate-700 text-emerald-400' : 'bg-slate-700 text-red-400'}`}>
            {key.toUpperCase()} {val > 0 ? '+' : ''}{val}
          </span>
        ))}
      </div>
    );
  }
  if (item.effects) {
     return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(item.effects).map(([key, val]) => {
           // Color logic:
           // Health/Mood: + is good (emerald), - is bad (red)
           // Hunger/Thirst/Stress: - is good (emerald), + is bad (red)
           let isGood = false;
           if (['health', 'mood'].includes(key)) {
               isGood = val > 0;
           } else if (['hunger', 'thirst', 'stress'].includes(key)) {
               isGood = val < 0;
           }
           return (
              <span key={key} className={`text-[9px] px-1 rounded ${isGood ? 'bg-slate-700 text-emerald-400' : 'bg-slate-700 text-red-400'}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)} {val > 0 ? '+' : ''}{val}
              </span>
           );
        })}
      </div>
    );
  }
  return null;
};

// --- Main App Component ---

export default function App() {
  // --- Game State ---
  // Stats Logic:
  // Health: High=Good (Starts Max)
  // Mood: High=Good (Starts Max)
  // Hunger: Low=Good (Starts 0)
  // Thirst: Low=Good (Starts 0)
  // Stress: Low=Good (Starts 0)
  const [stats, setStats] = useState({
    hunger: 0,    
    thirst: 0,   
    health: 20, 
    mood: 100,
    stress: 0   
  });

  const [resources, setResources] = useState({
    gold: 50,
    xp: 0,
    level: 1
  });

  const [inventory, setInventory] = useState(['none', 'tunic', 'fist']); 
  const [shopStock, setShopStock] = useState([]); 

  const [equipped, setEquipped] = useState({
    head: 'none',
    body: 'tunic',
    mainHand: 'fist',
    offHand: 'none'
  });
  
  const [appearance, setAppearance] = useState({
    gender: 'male',
    skinTone: 'fair',
    hairColor: 'brown',
    eyeColor: 'brown',
    hairStyle: 'short'
  });

  // Time & Location
  const [days, setDays] = useState(1);
  const [location, setLocation] = useState('village_road'); // Current visual location
  const [housing, setHousing] = useState('homeless'); // 'homeless' | 'inn' (Status tracking)
  const [rentActive, setRentActive] = useState(false); // If true, auto-deducts when days pass

  const [activeTab, setActiveTab] = useState('actions');
  const [activeSlot, setActiveSlot] = useState('head');
  const [isPanelOpen, setIsPanelOpen] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [isDead, setIsDead] = useState(false);
  
  // Modals
  const [showLocationInfo, setShowLocationInfo] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState('buy'); 
  const [activeStatInfo, setActiveStatInfo] = useState(null); 

  // --- Helpers for Stats ---
  const calculateMaxStats = (level) => {
      // Health scales with level: 10 base + 10 per level (Level 1 = 20)
      return {
          health: 10 + (level * 10),
          mood: 100,
          hunger: 100,
          thirst: 100,
          stress: 100
      };
  };

  // --- Logic: Refresh Shop Stock ---
  const refreshShop = () => {
    const allItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
    const purchasable = allItems.filter(i => i.cost > 0);
    const shuffled = [...purchasable].sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, 6).map(i => i.id);
    setShopStock(selection);
  };

  // --- Persistence & Initialization ---
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(parsed.stats || { hunger: 0, thirst: 0, health: 20, mood: 100, stress: 0 });
        setResources(parsed.resources || { gold: 50, xp: 0, level: 1 });
        setEquipped(parsed.equipped || { head: 'none', body: 'tunic', mainHand: 'fist', offHand: 'none' });
        setAppearance(parsed.appearance || { gender: 'male', skinTone: 'fair', hairColor: 'brown', eyeColor: 'brown', hairStyle: 'short' });
        setLocation(parsed.location || 'village_road');
        setHousing(parsed.housing || 'homeless');
        setRentActive(parsed.rentActive || false);
        setDays(parsed.days || 1);
        setInventory(parsed.inventory || ['none', 'tunic', 'fist']);
        
        if (parsed.shopStock && parsed.shopStock.length > 0) {
            setShopStock(parsed.shopStock);
        } else {
            refreshShop();
        }

      } catch (e) {
        console.error("Failed to load save", e);
        refreshShop();
      }
    } else {
        refreshShop();
    }
  }, []);

  // --- Reactive State Listener ---
  useEffect(() => {
      // Death Check (Health 0 or Hunger/Thirst 100)
      const maxStats = calculateMaxStats(resources.level);
      if ((stats.health <= 0 || stats.hunger >= maxStats.hunger || stats.thirst >= maxStats.thirst) && !isDead) {
          setIsDead(true);
          addMessage("Your adventurer has perished!", "error");
      }

      // Sync visual location with housing status if in 'resting' spots
      // (This is simple logic; if we add dungeons later, we check if !dungeon)
      if (housing === 'inn' && location === 'village_road') setLocation('inn_room');
      if (housing === 'homeless' && location === 'inn_room') setLocation('village_road');

      const gameState = {
        stats,
        resources,
        equipped,
        appearance,
        location,
        inventory,
        shopStock,
        days,
        housing,
        rentActive,
        lastSave: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));

  }, [stats, resources, equipped, appearance, location, inventory, shopStock, isDead, days, housing, rentActive]);

  // --- Actions & Time System ---

  const addMessage = (text, type = 'info') => {
    // Unique ID for each message to prevent key collision
    const id = Math.random().toString(36).substr(2, 9) + Date.now(); 
    setMessages(prev => [...prev.slice(-4), { id, text, type }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);
  };

  const passTime = (daysPassed) => {
      setDays(prev => prev + daysPassed);
      
      // Rent Logic
      if (rentActive && housing === 'inn') {
          const totalRent = daysPassed * LOCATIONS.inn_room.dailyCost;
          if (resources.gold >= totalRent) {
              setResources(prev => ({ ...prev, gold: prev.gold - totalRent }));
              addMessage(`Paid rent: -${totalRent}g`, 'info');
          } else {
              // Eviction
              setHousing('homeless');
              setRentActive(false);
              setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20) })); // Penalty
              addMessage("Evicted! Couldn't pay rent.", 'error');
          }
      }
  };

  const performAction = (action) => {
    if (isDead) return;

    // Check Action Type Logic (Rent toggles)
    if (action.id === 'rent_start') {
        if (resources.gold >= 5) {
            setHousing('inn');
            setRentActive(true);
            setResources(prev => ({ ...prev, gold: prev.gold - 5 })); // Pay first day immediately
            addMessage("Rented room at Rusty Spoon.", 'success');
        } else {
            addMessage("Not enough gold to rent room.", 'error');
        }
        return;
    }
    
    if (action.id === 'rent_stop') {
        setHousing('homeless');
        setRentActive(false);
        addMessage("Checked out of Inn.", 'info');
        return;
    }

    // Special logic for Eat/Drink actions: prioritize inventory
    if (action.id === 'eat' || action.id === 'drink') {
        // Find best owned item
        const itemType = action.id === 'eat' ? 'food' : 'drink';
        // Get all items in inventory that match type
        const ownedSupplies = ITEM_DB.supplies.filter(i => i.type === itemType && inventory.includes(i.id));
        
        if (ownedSupplies.length > 0) {
            // Consume first available (could implement logic to choose best, but first is fine for now)
            const itemToConsume = ownedSupplies[0];
            
            // Remove 1 from inventory
            // Inventory is array of IDs. We need to remove just one instance of this ID.
            const idx = inventory.indexOf(itemToConsume.id);
            if (idx > -1) {
                const newInv = [...inventory];
                newInv.splice(idx, 1);
                setInventory(newInv);
                
                // Apply effects of the ITEM, not the generic action
                const effects = itemToConsume.effects || {};
                const maxStats = calculateMaxStats(resources.level);
                setStats(prev => ({
                  health: Math.max(0, Math.min(maxStats.health, prev.health + (effects.health || 0))),
                  mood: Math.max(0, Math.min(maxStats.mood, prev.mood + (effects.mood || 0))),
                  hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + (effects.hunger || 0))),
                  thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + (effects.thirst || 0))),
                  stress: Math.max(0, Math.min(maxStats.stress, prev.stress + (effects.stress || 0)))
                }));
                
                addMessage(`Consumed ${itemToConsume.name}`, 'success');
                return; // Done
            }
        }
        
        // If we get here, no inventory. Check if we can buy instant
        const currentLoc = LOCATIONS[location]; // Use visual location or logical housing? Visual is fine for "where am I"
        if (!currentLoc.hasFoodService) {
            addMessage("No food/drink here. Check shop!", 'error');
            return;
        }
        
        // Fallthrough to generic buy action if location permits
    }

    if (action.costType === 'gp' && resources.gold < action.cost) {
      addMessage("Not enough gold!", "error");
      return;
    }

    // Apply Gold Cost
    if (action.cost > 0 && action.costType === 'gp') {
      setResources(prev => ({ ...prev, gold: prev.gold - action.cost }));
    }

    // Apply Time Cost
    if (action.days > 0) {
        passTime(action.days);
    }
    
    // Quest Failure Logic (Moved BEFORE applying rewards)
    let isSuccess = true;
    let failChance = 0;
    
    // Calculate Stats for Check
    const ac = currentStats.ac;
    const str = currentStats.str;
    const dex = currentStats.dex;
    const int = currentStats.int;
    const cha = currentStats.cha;
    const stress = stats.stress;
    
    // FORMULA: Base Risk - (Stat Modifiers) + (Stress * 0.2%)
    // Base Risks: Guard (30%), Adventure (60%), Roleplay (40%)
    if (action.id === 'quest_guard') {
        failChance = 0.30 - ((str + ac) * 0.01) + (stress * 0.002);
    }
    if (action.id === 'quest_roleplay') {
        failChance = 0.40 - ((cha + int) * 0.01) + (stress * 0.002);
    }
    if (action.id === 'quest_adventure') {
        failChance = 0.60 - ((str + dex + ac) * 0.01) + (stress * 0.002);
    }
    
    // Clamp chance (always 5% chance of fail/success minimum)
    failChance = Math.max(0.05, Math.min(0.95, failChance));
    
    if (action.id && action.id.startsWith('quest_')) {
        if (Math.random() < failChance) {
            isSuccess = false;
        }
    }

    // Calculate Effects based on Location Modifiers
    const currentLocId = housing === 'inn' ? 'inn_room' : 'village_road'; // Logic for modifiers uses housing status mostly
    const loc = LOCATIONS[currentLocId];
    const locMod = loc && loc.modifiers && loc.modifiers[action.id] ? loc.modifiers[action.id] : {};

    const getEffect = (stat) => {
        let base = action.effects[stat] || 0;
        let mod = locMod[stat] || 0;
        return base + mod;
    };

    const maxStats = calculateMaxStats(resources.level);

    if (isSuccess) {
        // Apply STANDARD Effects (Rewards + Costs)
        setStats(prev => ({
          health: Math.max(0, Math.min(maxStats.health, prev.health + getEffect('health'))),
          mood: Math.max(0, Math.min(maxStats.mood, prev.mood + getEffect('mood'))),
          hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + getEffect('hunger'))),
          thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + getEffect('thirst'))),
          stress: Math.max(0, Math.min(maxStats.stress, prev.stress + getEffect('stress')))
        }));

        // XP / Gold Rewards
        if (action.effects.xp) {
          setResources(prev => {
            const newXp = prev.xp + action.effects.xp;
            const newGold = prev.gold + (action.effects.gold || 0);
            let newLevel = prev.level;
            if (newXp >= prev.level * 100) {
              newLevel++;
              addMessage(`Level Up! You are now level ${newLevel}`, "success");
            }
            return { ...prev, xp: newXp, gold: newGold, level: newLevel };
          });
        }
        
        // Loot Drop (Only on Adventure Success)
        if (action.id === 'quest_adventure' && Math.random() < 0.15) { 
           const allItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand];
           const findableItems = allItems.filter(i => i.cost > 0);
           if (findableItems.length > 0) {
             const foundItem = findableItems[Math.floor(Math.random() * findableItems.length)];
             const alreadyOwned = inventory.includes(foundItem.id);
             if (alreadyOwned) {
                 addMessage(`Loot: Duplicate ${foundItem.name}`, 'info');
             } else {
                 setInventory(prev => [...prev, foundItem.id]);
                 addMessage(`Loot: Found ${foundItem.name}!`, 'success');
             }
           }
        }
    } else {
        // FAILURE PENALTIES
        let failMsg = "Quest Failed!";
        
        if (action.id === 'quest_guard') {
            failMsg = "Caught sleeping on duty! No pay.";
            setStats(prev => ({ ...prev, stress: Math.min(100, prev.stress + 10) }));
        } 
        else if (action.id === 'quest_adventure') {
            failMsg = "Defeated by monsters! Heavy damage taken.";
            setStats(prev => ({ 
                ...prev, 
                health: Math.max(0, prev.health - 20),
                stress: Math.min(100, prev.stress + 20),
                hunger: Math.min(100, prev.hunger + 20), // Still get hungry/thirsty on failure
                thirst: Math.min(100, prev.thirst + 20)
            }));
        } 
        else if (action.id === 'quest_roleplay') {
            failMsg = "Made a fool of yourself. Awkward.";
            setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20) }));
        }

        addMessage(failMsg, "error");
        
        // Refresh shop even on failure if time passed
        if (action.days > 0) {
            refreshShop();
        }
        
        return; // Exit early, skipping success message
    }

    // Dynamic Shop Refresh
    if (action.days > 0) {
        refreshShop();
    }

    // Flavor Text Logic (Success Only)
    let msg = action.message;
    if (action.id === 'quest_adventure') {
        const subthemes = ["Cleared a goblin den.", "Slew a giant rat.", "Raided a cultist cellar.", "Escorted a merchant wagon."];
        msg = subthemes[Math.floor(Math.random() * subthemes.length)];
    } else if (action.id === 'quest_roleplay') {
        const subthemes = ["Flirted with the barmaid.", "Started a tavern brawl.", "Listened to old man's tales.", "Gambled with locals."];
        msg = subthemes[Math.floor(Math.random() * subthemes.length)];
    }

    addMessage(msg, "success");
  };

  const revive = () => {
    const max = calculateMaxStats(resources.level);
    setStats({ health: max.health, mood: max.mood, hunger: 0, thirst: 0, stress: 0 });
    setIsDead(false);
    setResources(prev => ({ ...prev, xp: Math.max(0, prev.xp - 50) })); 
    setHousing('homeless'); // Lose house on death
    setRentActive(false);
    addMessage("Revived... destitute.", "info");
  };

  // --- SHOP & INVENTORY ACTIONS ---
  const buyItem = (item) => {
    // UPDATED: Allow duplicates for everything
    if (resources.gold >= item.cost) {
      setResources(prev => ({ ...prev, gold: prev.gold - item.cost }));
      setInventory(prev => [...prev, item.id]);
      addMessage(`Purchased ${item.name}`, 'success');
    } else {
      addMessage("Not enough gold!", 'error');
    }
  };

  const sellItem = (item) => {
    const sellValue = Math.floor(item.cost / 2);
    setResources(prev => ({ ...prev, gold: prev.gold + sellValue }));
    // Remove ONE instance of item
    const idx = inventory.indexOf(item.id);
    if (idx > -1) {
        const newInv = [...inventory];
        newInv.splice(idx, 1);
        setInventory(newInv);
    }
    addMessage(`Sold ${item.name} for ${sellValue}g`, 'success');
  };

  const equipItem = (item) => {
    setEquipped(prev => ({ ...prev, [activeSlot]: item.id }));
  };

  // Consumable from Gear Tab
  const consumeItem = (item) => {
      const idx = inventory.indexOf(item.id);
      if (idx > -1) {
          const newInv = [...inventory];
          newInv.splice(idx, 1);
          setInventory(newInv);
          
          const effects = item.effects || {};
          const maxStats = calculateMaxStats(resources.level);
          setStats(prev => ({
            health: Math.max(0, Math.min(maxStats.health, prev.health + (effects.health || 0))),
            mood: Math.max(0, Math.min(maxStats.mood, prev.mood + (effects.mood || 0))),
            hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + (effects.hunger || 0))),
            thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + (effects.thirst || 0))),
            stress: Math.max(0, Math.min(maxStats.stress, prev.stress + (effects.stress || 0)))
          }));
          addMessage(`Consumed ${item.name}`, 'success');
      }
  };

  // --- ACTIONS DEFINITIONS ---
  const ACTIONS = [
    // Survival
    { 
      id: 'eat', label: 'Eat', icon: Utensils, cost: 5, days: 0, costType: 'gp', 
      description: 'Uses inventory or buys meal.', message: 'Yum! Dried meat.',
      effects: { hunger: -30, health: 5 } 
    },
    { 
      id: 'drink', label: 'Drink', icon: Droplets, cost: 0, days: 0, costType: 'gp', 
      description: 'Uses inventory or finds water.', message: 'Refreshing!',
      effects: { thirst: -40 } 
    },
    { 
      id: 'rest', label: 'Sleep (Rest)', icon: Tent, cost: 0, days: 1, costType: 'gp', 
      description: 'Recover health & reduce stress. Takes 1 Day.', message: 'Zzz...',
      effects: { health: 15, stress: -20, hunger: 10, thirst: 10 } 
    },
    
    // Social / Maintenance
    { 
      id: 'tavern', label: 'Tavern Ale', icon: Sparkles, cost: 8, days: 0, costType: 'gp', 
      description: 'Improves mood.', message: 'Huzzah!',
      effects: { mood: 15, stress: -15, hunger: -5, thirst: -10 } 
    },
    
    // Quests (New Types)
    { 
      id: 'quest_guard', label: 'Guard Duty', icon: Shield, cost: 0, days: 1, costType: 'gp', 
      description: 'Low risk, boring work.', message: 'Watched a gate all day.',
      effects: { gold: 15, xp: 5, hunger: 10, thirst: 10, stress: 5, mood: -5 } 
    },
    { 
      id: 'quest_adventure', label: 'Adventure', icon: Scroll, cost: 0, days: 3, costType: 'gp', 
      description: 'High risk, high reward. 3 Days.', message: 'Returned from the wilds.',
      effects: { gold: 50, xp: 50, hunger: 40, thirst: 40, stress: 30, health: -15, mood: 5 } 
    },
    { 
      id: 'quest_roleplay', label: 'Role Play', icon: User, cost: 0, days: 1, costType: 'gp', 
      description: 'Socializing for XP.', message: 'Talked to locals.',
      effects: { xp: 30, mood: 10, hunger: 5, thirst: 5 } 
    },
  ];

  // --- Helpers ---

  const togglePanel = (tab) => {
    if (isPanelOpen && activeTab === tab) {
      setIsPanelOpen(false);
    } else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

  const toggleSlot = (slot) => {
     setActiveTab('equip');
     setActiveSlot(slot);
     setIsPanelOpen(true);
  };

  const updateAppearance = (key, value) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  const currentStats = useMemo(() => {
    let base = { ac: 10, str: 10, dex: 10, int: 10, cha: 10 };
    Object.keys(equipped).forEach(slot => {
      const itemId = equipped[slot];
      const item = ITEM_DB[slot].find(i => i.id === itemId);
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([stat, val]) => {
          base[stat] += val;
        });
      }
    });
    return base;
  }, [equipped]);

  const getItemById = (id) => {
      const all = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
      return all.find(i => i.id === id);
  };

  const CurrentSceneBackground = LOCATIONS[location]?.renderBackground || (() => null);
  const currentLocData = LOCATIONS[location];
  const maxStats = calculateMaxStats(resources.level);

  const getStatInfo = (key) => {
      switch(key) {
          case 'health': return { title: 'Health', desc: 'If this reaches 0, you die.', good: 'High' };
          case 'mood': return { title: 'Mood', desc: 'Mental state. Low mood affects performance.', good: 'High' };
          case 'hunger': return { title: 'Hunger', desc: 'If this reaches max, you starve.', good: 'Low' };
          case 'thirst': return { title: 'Thirst', desc: 'If this reaches max, you dehydrate.', good: 'Low' };
          case 'stress': return { title: 'Stress', desc: 'Mental strain. High stress causes panic.', good: 'Low' };
          case 'ac': return { title: 'Armor Class', desc: 'Defense against physical attacks.', good: 'High' };
          case 'str': return { title: 'Strength', desc: 'Physical power and athletics.', good: 'High' };
          case 'dex': return { title: 'Dexterity', desc: 'Agility, reflexes, and balance.', good: 'High' };
          case 'int': return { title: 'Intelligence', desc: 'Mental acuity and knowledge.', good: 'High' };
          case 'cha': return { title: 'Charisma', desc: 'Force of personality and charm.', good: 'High' };
          default: return null;
      }
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col md:flex-row">
      
      {activeStatInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveStatInfo(null)}>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl max-w-xs w-full text-center" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold text-lg text-white mb-1">{getStatInfo(activeStatInfo).title}</h3>
                  {getStatInfo(activeStatInfo).good && (
                    <div className={`text-xs font-bold uppercase mb-3 ${getStatInfo(activeStatInfo).good === 'Low' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        Goal: Keep {getStatInfo(activeStatInfo).good}
                    </div>
                  )}
                  <p className="text-sm text-slate-400">{getStatInfo(activeStatInfo).desc}</p>
                  <button onClick={() => setActiveStatInfo(null)} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700">Close</button>
              </div>
          </div>
      )}

      {showShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col h-[70vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="text-amber-400" />
                    <h2 className="text-lg font-bold">Village Merchant</h2>
                </div>
                <button onClick={() => setShowShop(false)}><X className="text-slate-500 hover:text-white" /></button>
            </div>
            
            <div className="flex p-2 bg-slate-800/50 gap-2">
                <button onClick={() => setShopTab('buy')} className={`flex-1 py-2 rounded text-sm font-bold ${shopTab === 'buy' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>Buy</button>
                <button onClick={() => setShopTab('sell')} className={`flex-1 py-2 rounded text-sm font-bold ${shopTab === 'sell' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>Sell</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {shopTab === 'buy' && shopStock.map(id => {
                    const item = getItemById(id);
                    if (!item) return null;
                    const canAfford = resources.gold >= item.cost;
                    const isOwned = inventory.includes(item.id) && item.type !== 'food' && item.type !== 'drink' && item.type !== 'potion';

                    return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                            <div>
                                <div className="font-bold text-sm">{item.name}</div>
                                <div className="text-xs text-slate-500">{item.type}</div>
                                {renderItemStats(item)}
                            </div>
                            {isOwned ? (
                                <span className="text-xs font-bold text-slate-500 px-3 py-1 bg-slate-900 rounded">Owned</span>
                            ) : (
                                <button 
                                    onClick={() => buyItem(item)}
                                    disabled={!canAfford}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold ${canAfford ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                >
                                    {item.cost} <Coins size={12}/>
                                </button>
                            )}
                        </div>
                    );
                })}

                {shopTab === 'sell' && inventory.map((id, index) => {
                    const item = getItemById(id);
                    if (!item || item.cost === 0) return null; 
                    const isEquipped = Object.values(equipped).includes(item.id);
                    const sellPrice = Math.floor(item.cost / 2);

                    return (
                        <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                            <div>
                                <div className="font-bold text-sm">{item.name}</div>
                                <div className="text-xs text-slate-500">{item.type}</div>
                                {renderItemStats(item)}
                            </div>
                            {isEquipped ? (
                                <span className="text-xs text-indigo-400 font-bold px-2">Equipped</span>
                            ) : (
                                <button 
                                    onClick={() => sellItem(item)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50"
                                >
                                    +{sellPrice} <DollarSign size={12}/>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Your Gold:</span>
                <span className="text-amber-400 flex items-center gap-1">{resources.gold} <Coins size={14}/></span>
            </div>
          </div>
        </div>
      )}

      {showLocationInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowLocationInfo(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-900/30 rounded-full text-indigo-400"><MapPin size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentLocData.name}</h3>
                <span className="text-xs font-mono text-indigo-400 uppercase">{currentLocData.type}</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">{currentLocData.details}</p>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Effects & Modifiers</h4>
              {currentLocData.tips && currentLocData.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-none ${tip.type === 'bad' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-200 block">{tip.label}</span>
                    <span className="text-xs text-slate-400 block">{tip.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
          <CurrentSceneBackground />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50 pointer-events-none" />
          
          <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex justify-between items-start z-20">
             <div className="flex gap-4">
                <div className="flex flex-col">
                   <span className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase">Gold</span>
                   <span className="text-sm md:text-xl font-mono text-amber-400 flex items-center gap-1"><Coins size={12}/> {resources.gold}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase">Level</span>
                   <span className="text-sm md:text-xl font-mono text-indigo-400">{resources.level}</span>
                </div>
                <div className="flex flex-col w-20 md:w-24">
                   <span className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase">Day</span>
                   <span className="text-sm md:text-xl font-mono text-indigo-200">{days}</span>
                </div>
             </div>
             
             <div className="flex gap-2">
               <button onClick={() => setShowShop(true)} className="p-1.5 md:p-2 bg-amber-600/90 rounded-md hover:bg-amber-500 text-white transition-colors border border-amber-400 shadow-lg shadow-amber-500/20">
                  <ShoppingBag size={14} className="md:w-4 md:h-4" />
               </button>
               <button onClick={() => setShowLocationInfo(true)} className="p-1.5 md:p-2 bg-indigo-600/90 rounded-md hover:bg-indigo-500 text-white transition-colors border border-indigo-400 shadow-lg shadow-indigo-500/20">
                  <MapPin size={14} className="md:w-4 md:h-4" />
               </button>
             </div>
          </div>

          <div className="absolute top-16 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
            {messages.map(m => (
              <div key={m.id} className={`px-3 py-1.5 rounded-lg shadow-xl text-xs font-medium animate-in slide-in-from-right fade-in duration-300 ${m.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-indigo-600/90 text-white'}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex w-full h-full max-h-[65vh] items-center justify-between px-2 md:px-8 mt-10 md:mt-0 z-10">
             <div className="flex flex-col gap-3 md:gap-4 z-10 w-12 md:w-16">
                 <StatBlock label="AC" value={currentStats.ac} onClick={() => setActiveStatInfo('ac')} />
                 <StatBlock label="STR" value={currentStats.str} onClick={() => setActiveStatInfo('str')} />
                 <StatBlock label="DEX" value={currentStats.dex} onClick={() => setActiveStatInfo('dex')} />
                 <StatBlock label="INT" value={currentStats.int} onClick={() => setActiveStatInfo('int')} />
                 <StatBlock label="CHA" value={currentStats.cha} onClick={() => setActiveStatInfo('cha')} />
             </div>

             <div className="flex-1 h-full max-w-md relative mx-auto">
               <CharacterSVG equipped={equipped} appearance={appearance} isAlive={!isDead} />
               
               {isDead && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                   <div className="text-center p-6 bg-slate-900 border border-red-900 rounded-xl shadow-2xl">
                     <Skull className="w-12 h-12 text-red-600 mx-auto mb-2" />
                     <h2 className="text-xl font-bold text-red-500 mb-1">DECEASED</h2>
                     <p className="text-slate-400 text-sm mb-4">Your adventurer perished.</p>
                     <button onClick={revive} className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 rounded-md border border-red-700 transition-colors">
                       Revive (Lose XP)
                     </button>
                   </div>
                 </div>
               )}
             </div>

             <div className="flex flex-col gap-3 md:gap-4 z-10 w-12 md:w-16 items-center">
                 <StatBlock label="Health" value={stats.health} max={maxStats.health} alert={stats.health < (maxStats.health * 0.3)} onClick={() => setActiveStatInfo('health')} />
                 <StatBlock label="Mood" value={stats.mood} max={maxStats.mood} alert={stats.mood < 30} onClick={() => setActiveStatInfo('mood')} />
                 <StatBlock label="Hunger" value={stats.hunger} max={maxStats.hunger} alert={stats.hunger > 80} inverted={true} onClick={() => setActiveStatInfo('hunger')} />
                 <StatBlock label="Thirst" value={stats.thirst} max={maxStats.thirst} alert={stats.thirst > 80} inverted={true} onClick={() => setActiveStatInfo('thirst')} />
                 <StatBlock label="Stress" value={stats.stress} max={maxStats.stress} alert={stats.stress > 80} inverted={true} onClick={() => setActiveStatInfo('stress')} />
             </div>
          </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-96 h-16 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex justify-around items-center z-50">
         <button onClick={() => togglePanel('actions')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'actions' && isPanelOpen ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Scroll size={20} />
            <span className="text-[10px] font-bold">Actions</span>
         </button>
         <button onClick={() => togglePanel('equip')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'equip' && isPanelOpen ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Backpack size={20} />
            <span className="text-[10px] font-bold">Gear</span>
         </button>
         <button onClick={() => togglePanel('appearance')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'appearance' && isPanelOpen ? 'text-indigo-400' : 'text-slate-500'}`}>
            <User size={20} />
            <span className="text-[10px] font-bold">Look</span>
         </button>
      </div>

      <div 
        className={`
          fixed md:relative z-40 transition-transform duration-300 ease-out bg-slate-900 border-slate-700 shadow-2xl
          md:w-72 md:h-full md:border-l md:translate-y-0
          bottom-28 left-4 right-4 rounded-2xl border h-[55vh]
          ${isPanelOpen ? 'translate-y-0' : 'translate-y-[150%] md:translate-x-full md:hidden'}
        `}
      >
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-800/50 rounded-t-2xl md:rounded-none">
             <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                {activeTab === 'actions' && <><Scroll size={14}/> Actions</>}
                {activeTab === 'equip' && <><Backpack size={14}/> Equipment</>}
                {activeTab === 'appearance' && <><User size={14}/> Appearance</>}
             </div>
             <button onClick={() => setIsPanelOpen(false)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 hover:text-white">
               <X size={14} />
             </button>
          </div>

          <div className="hidden md:flex border-b border-slate-800">
             <button onClick={() => setActiveTab('actions')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'actions' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Actions</button>
             <button onClick={() => setActiveTab('equip')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'equip' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Gear</button>
             <button onClick={() => setActiveTab('appearance')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'appearance' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Look</button>
          </div>

          <div className="h-full overflow-y-auto custom-scrollbar p-3 pb-20 md:pb-4">
            
            {activeTab === 'actions' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Location: {housing === 'inn' ? 'Rented Room' : 'Homeless'}</div>
                
                {/* RENT BUTTONS */}
                {housing === 'homeless' && (
                    <button 
                        onClick={() => performAction({ id: 'rent_start' })}
                        className="w-full flex items-center justify-between p-3 rounded-lg border border-amber-600/50 bg-amber-900/20 hover:bg-amber-900/40 text-amber-200"
                    >
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold">Rent Room at Inn</span>
                            <span className="text-[9px] opacity-70">Auto-pay 5g/day. Better rest.</span>
                        </div>
                        <span className="text-xs font-mono font-bold">-5g</span>
                    </button>
                )}
                {housing === 'inn' && (
                    <button 
                        onClick={() => performAction({ id: 'rent_stop' })}
                        className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold">Check Out</span>
                            <span className="text-[9px] opacity-70">Stop paying rent. Become homeless.</span>
                        </div>
                        <Key size={14} />
                    </button>
                )}

                <div className="h-px bg-slate-800 my-2" />

                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Care & Adventure</div>
                {ACTIONS.map(action => (
                  <ActionButton 
                    key={action.id}
                    {...action}
                    onClick={() => performAction(action)}
                    disabled={isDead}
                  />
                ))}
              </div>
            )}

            {activeTab === 'equip' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="flex gap-1 mb-4 p-1 bg-slate-800 rounded-lg overflow-x-auto">
                    {['head', 'body', 'mainHand', 'offHand', 'supplies'].map(slot => (
                       <button 
                         key={slot}
                         onClick={() => setActiveSlot(slot)}
                         className={`flex-1 min-w-[60px] py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors ${activeSlot === slot ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                       >
                         {slot.replace('Hand', '').replace('supplies', 'Supplies')}
                       </button>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                    Owned {activeSlot.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  
                  {/* Supplies Special Rendering */}
                  {activeSlot === 'supplies' ? (
                      <div>
                          {ITEM_DB.supplies.filter(item => inventory.includes(item.id)).length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-500 italic border border-dashed border-slate-700 rounded">
                                  No supplies. Buy food/drink at the Shop!
                              </div>
                          ) : (
                              // Group supplies by count
                              [...new Set(inventory.filter(id => ITEM_DB.supplies.find(s => s.id === id)))].map(itemId => {
                                  const item = getItemById(itemId);
                                  const count = inventory.filter(id => id === itemId).length;
                                  return (
                                      <div key={item.id} className="flex items-center gap-2 p-2 w-full rounded-lg border text-left transition-all relative overflow-hidden bg-slate-800 border-slate-700 mb-2">
                                          <div className="p-2 rounded-md bg-slate-700 text-slate-400">
                                              {item.type === 'food' ? <Apple size={14} /> : item.type === 'potion' ? <Heart size={14} /> : <Beer size={14} />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <span className="font-bold text-xs">{item.name} <span className="text-slate-500">x{count}</span></span>
                                              <div className="text-[10px] text-slate-500">{item.description}</div>
                                          </div>
                                          <button 
                                              onClick={() => consumeItem(item)}
                                              className="px-2 py-1 rounded border border-slate-600 bg-slate-700 text-slate-300 text-[10px] font-bold hover:bg-emerald-900 hover:border-emerald-500 hover:text-emerald-100 transition-colors"
                                          >
                                              Use
                                          </button>
                                      </div>
                                  );
                              })
                          )}
                      </div>
                  ) : (
                      // Equipment Rendering
                      ITEM_DB[activeSlot].filter(item => inventory.includes(item.id)).length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500 italic border border-dashed border-slate-700 rounded">
                              No items owned in this slot. Visit the Shop to buy gear!
                          </div>
                      ) : (
                          // Group stacked equipment
                          [...new Set(inventory.filter(id => ITEM_DB[activeSlot].find(i => i.id === id)))].map((itemId) => {
                            const item = getItemById(itemId);
                            // Only check first instance for equipped status? No, check if currently equipped ID matches this item ID
                            const isEquipped = equipped[activeSlot] === itemId;
                            const count = inventory.filter(id => id === itemId).length;
                            
                            return (
                              <div
                                key={itemId}
                                className={`
                                  flex items-center gap-2 p-2 w-full rounded-lg border text-left transition-all relative overflow-hidden
                                  ${isEquipped 
                                    ? 'bg-indigo-900/30 border-indigo-500 shadow-sm ring-1 ring-indigo-500/30' 
                                    : 'bg-slate-800 border-slate-700'}
                                `}
                              >
                                 <div className={`p-2 rounded-md ${isEquipped ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                    {activeSlot === 'head' && <VenetianMask size={14} />}
                                    {activeSlot === 'body' && <Shirt size={14} />}
                                    {activeSlot === 'mainHand' && <Sword size={14} />}
                                    {activeSlot === 'offHand' && <Shield size={14} />}
                                 </div>
                                 <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-xs truncate ${isEquipped ? 'text-indigo-200' : 'text-slate-300'}`}>{item.name}</span>
                                        {count > 1 && <span className="text-[10px] text-slate-500 font-bold">x{count}</span>}
                                        {isEquipped && <span className="text-[8px] font-bold text-indigo-400 bg-indigo-950/50 px-1 py-0.5 rounded">EQUIPPED</span>}
                                    </div>
                                    <span className="text-[10px] text-slate-500 truncate">{item.description}</span>
                                 </div>
                                 
                                 {!isEquipped && (
                                    <button 
                                        onClick={() => equipItem(item)}
                                        className="px-2 py-1 rounded border border-slate-600 bg-slate-700 text-slate-300 text-[10px] font-bold hover:bg-slate-600 hover:text-white transition-colors"
                                    >
                                        Equip
                                    </button>
                                 )}
                              </div>
                            );
                          })
                      )
                  )}
              </div>
            )}

            {activeTab === 'appearance' && (
               <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gender</h3>
                    <div className="flex gap-2">
                      {['male', 'female'].map(g => (
                        <button key={g} onClick={() => updateAppearance('gender', g)}
                          className={`flex-1 py-1.5 rounded border text-[10px] font-bold uppercase ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skin</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {APPEARANCE_OPTIONS.skinTones.map(t => (
                        <button key={t.id} onClick={() => updateAppearance('skinTone', t.id)}
                          className={`w-6 h-6 rounded-full border-2 ${appearance.skinTone === t.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: t.color }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hair Style</h3>
                    <div className="flex gap-2">
                      {APPEARANCE_OPTIONS.hairStyles.map(s => (
                         <button key={s.id} onClick={() => updateAppearance('hairStyle', s.id)}
                          className={`flex-1 py-1 rounded border text-[10px] font-medium ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
            )}
          </div>
      </div>
    </div>
  );
}
