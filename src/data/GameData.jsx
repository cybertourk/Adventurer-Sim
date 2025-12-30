import React from 'react';
import { 
  Shield, Sword, VenetianMask, Shirt, User, Backpack, X, Heart, Zap, Sparkles, 
  Utensils, Coins, Hammer, Tent, Scroll, Skull, Activity, Droplets, MapPin, 
  Info, ShoppingBag, DollarSign, Frown, Clock, Key, Apple, Beer, Anvil, 
  MessageCircle, Music, Dice5, Pickaxe, Crown, Gem, BookOpen
} from 'lucide-react';

// --- Constants ---
export const MAX_STAT = 100;
export const SAVE_KEY = 'dnd_tamagotchi_v14_failures'; 

// --- Custom Icons ---
export const AnchorIcon = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"/>
    <line x1="12" y1="22" x2="12" y2="8"/>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>
);

// --- Database of Items ---
export const ITEM_DB = {
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
    { id: 'hammer', name: 'Smith Hammer', type: 'mainHand', stats: { str: 1 }, cost: 25, description: 'Required for Smithing.' },
  ],
  offHand: [
    { id: 'none', name: 'Empty', type: 'offHand', stats: { ac: 0 }, cost: 0, description: 'Free hand.' },
    { id: 'wooden_shield', name: 'Shield', type: 'offHand', stats: { ac: 1 }, cost: 15, description: 'Small wooden defense.' },
    { id: 'tower_shield', name: 'Tower', type: 'offHand', stats: { ac: 3, dex: -2 }, cost: 60, description: 'A portable wall.' },
    { id: 'orb', name: 'Orb', type: 'offHand', stats: { int: 3 }, cost: 200, description: 'Glows with mysterious power.' },
  ],
  supplies: [
    { id: 'apple', name: 'Apple', type: 'food', cost: 2, description: 'Fresh and crunchy.', effects: { hunger: -15, health: 2 } },
    { id: 'ration', name: 'Dried Ration', type: 'food', cost: 5, description: 'Lasts forever. Tastes like dust.', effects: { hunger: -30, health: 5 } },
    { id: 'feast', name: 'Grand Feast', type: 'food', cost: 25, description: 'A portable banquet.', effects: { hunger: -80, mood: 20, health: 10 } },
    { id: 'water', name: 'Water Skin', type: 'drink', cost: 1, description: 'Basic hydration.', effects: { thirst: -25 } },
    { id: 'ale', name: 'Bottle of Ale', type: 'drink', cost: 8, description: 'Good for the soul, bad for the liver.', effects: { thirst: -15, mood: 10, stress: -10 } },
    { id: 'potion', name: 'Health Potion', type: 'potion', cost: 50, description: 'Magical red liquid.', effects: { health: 50 } },
  ]
};

// --- QUEST DATABASES ---
export const LABOR_DB = {
  tier1: [ // Unskilled (Level 1+)
    { id: 'labor_t1_field', tier: 1, label: 'Field Hand', icon: Apple, riskVal: 0.05, description: 'Pick crops all day.', message: 'Back-breaking work.', effects: { gold: 8, hunger: 25, thirst: 25, stress: 5, health: 2 } },
    { id: 'labor_t1_muck', tier: 1, label: 'Stable Muck', icon: Frown, riskVal: 0.10, description: 'Shovel manure.', message: 'Smell never leaves.', effects: { gold: 10, hunger: 20, thirst: 20, stress: 10, mood: -10 } },
    { id: 'labor_t1_wood', tier: 1, label: 'Wood Chopping', icon: Anvil, riskVal: 0.05, description: 'Fuel for fires.', message: 'Splinters everywhere.', effects: { gold: 9, hunger: 30, thirst: 20, stress: -5, health: 1 } },
    { id: 'labor_t1_rats', tier: 1, label: 'Rat Catcher', icon: Skull, riskVal: 0.15, description: 'City sanitation.', message: 'Bit by a rat.', effects: { gold: 12, hunger: 15, thirst: 15, stress: 5, health: -5 } },
    { id: 'labor_t1_runner', tier: 1, label: 'Message Runner', icon: Activity, riskVal: 0.05, description: 'Run across town.', message: 'Legs burning.', effects: { gold: 8, hunger: 35, thirst: 35, stress: 0, xp: 2 } },
  ],
  tier2: [ // Skilled (Level 5+)
    { id: 'labor_t2_guard', tier: 2, label: 'Guard Duty', icon: Shield, riskVal: 0.10, description: 'Watch the gate.', message: 'Shift ended.', effects: { gold: 15, xp: 5, hunger: 10, thirst: 10, stress: 5, mood: -5 } },
    { id: 'labor_t2_dock', tier: 2, label: 'Dock Work', icon: AnchorIcon, riskVal: 0.15, description: 'Load heavy crates.', message: 'Muscles aching.', effects: { gold: 25, xp: 10, hunger: 35, thirst: 35, stress: 10 } },
    { id: 'labor_t2_smith', tier: 2, label: 'Smithing', icon: Anvil, riskVal: 0.20, description: 'Forge weapons. (Req: Hammer)', message: 'Hot steel shaped.', effects: { gold: 45, xp: 15, hunger: 25, thirst: 35, stress: 5 }, req: 'hammer' },
    { id: 'labor_t2_scribe', tier: 2, label: 'Scribe Work', icon: BookOpen, riskVal: 0.05, description: 'Copy boring scrolls.', message: 'Ink stains.', effects: { gold: 20, xp: 15, hunger: 10, thirst: 10, stress: 20, mood: -10 } },
    { id: 'labor_t2_cook', tier: 2, label: 'Inn Cook', icon: Utensils, riskVal: 0.10, description: 'Manage the stew.', message: 'Fed the masses.', effects: { gold: 18, xp: 5, hunger: -20, thirst: 10, stress: 15 } },
  ],
  tier3: [ // Expert (Level 10+)
    { id: 'labor_t3_mine', tier: 3, label: 'Deep Mining', icon: Pickaxe, riskVal: 0.25, description: 'Dark, dangerous, lucrative.', message: 'Struck a vein!', effects: { gold: 60, xp: 20, hunger: 40, thirst: 40, stress: 20, health: -5 } },
    { id: 'labor_t3_bodyguard', tier: 3, label: 'Noble Bodyguard', icon: Shield, riskVal: 0.30, description: 'Protect the VIP.', message: 'Assassins thwarted.', effects: { gold: 80, xp: 30, hunger: 20, thirst: 20, stress: 30 } },
    { id: 'labor_t3_enchant', tier: 3, label: 'Enchanting', icon: Zap, riskVal: 0.20, description: 'Bind magic to steel.', message: 'Item glows.', effects: { gold: 100, xp: 50, hunger: 30, thirst: 30, stress: 40 } },
    { id: 'labor_t3_beast', tier: 3, label: 'Beast Tamer', icon: Frown, riskVal: 0.40, description: 'Train a Griffin.', message: 'Did not get eaten.', effects: { gold: 90, xp: 40, hunger: 40, thirst: 40, stress: 20, health: -10 } },
    { id: 'labor_t3_master', tier: 3, label: 'Master Smith', icon: Hammer, riskVal: 0.25, description: 'Forge King\'s armor.', message: 'Masterpiece created.', effects: { gold: 150, xp: 60, hunger: 30, thirst: 40, stress: 10 }, req: 'hammer' },
  ]
};

export const SOCIAL_DB = {
  tier1: [ // Local / Low Stakes
    { id: 'soc_t1_gossip', tier: 1, label: 'Gossip', icon: MessageCircle, riskVal: 0.10, description: 'Listen for rumors.', message: 'Heard juicy secrets.', effects: { xp: 8, mood: 5, stress: -5 } },
    { id: 'soc_t1_beg', tier: 1, label: 'Begging', icon: Coins, riskVal: 0.05, description: 'Spare a coin?', message: 'Pity coins.', effects: { gold: 3, mood: -10, xp: 2 } },
    { id: 'soc_t1_flirt', tier: 1, label: 'Flirt', icon: Heart, riskVal: 0.40, description: 'Woo a local.', message: 'They winked back!', effects: { mood: 40, xp: 15, stress: -10 } },
    { id: 'soc_t1_brawl', tier: 1, label: 'Tavern Brawl', icon: User, riskVal: 0.30, description: 'Fight for dominance.', message: 'Knocked them out!', effects: { xp: 25, stress: -30, health: -10 } },
    { id: 'soc_t1_drink', tier: 1, label: 'Drinking Contest', icon: Beer, riskVal: 0.20, description: 'Chug chug chug!', message: 'Iron liver.', effects: { mood: 20, thirst: -50, health: -5, stress: -10 } },
  ],
  tier2: [ // City / Mid Stakes
    { id: 'soc_t2_busk', tier: 2, label: 'Busking', icon: Music, riskVal: 0.20, description: 'Play for coin.', message: 'Crowd loved it!', effects: { gold: 10, xp: 10, mood: 15 } },
    { id: 'soc_t2_gamble', tier: 2, label: 'High Stakes', icon: Dice5, riskVal: 0.60, description: 'Roll the dice.', message: 'Jackpot!', effects: { gold: 100, stress: 20, mood: 10 } },
    { id: 'soc_t2_bribe', tier: 2, label: 'Bribe Official', icon: DollarSign, riskVal: 0.30, description: 'Grease palms.', message: 'Access granted.', effects: { gold: -20, xp: 40, stress: -20 } },
    { id: 'soc_t2_party', tier: 2, label: 'Merchant Party', icon: Gem, riskVal: 0.15, description: 'Network with rich.', message: 'Made connections.', effects: { xp: 30, mood: 10, hunger: -40, thirst: -40 } },
    { id: 'soc_t2_duel', tier: 2, label: 'Honor Duel', icon: Sword, riskVal: 0.50, description: 'First blood.', message: 'Honor satisfied.', effects: { xp: 50, mood: 20, health: -15, stress: 10 } },
  ],
  tier3: [ // Royal / High Stakes
    { id: 'soc_t3_court', tier: 3, label: 'Court Intrigue', icon: Crown, riskVal: 0.40, description: 'Whisper in court.', message: 'Rival discredited.', effects: { xp: 100, gold: 50, stress: 30 } },
    { id: 'soc_t3_romance', tier: 3, label: 'Seduce Noble', icon: Heart, riskVal: 0.60, description: 'Dangerous affair.', message: 'A night to remember.', effects: { mood: 100, gold: 100, stress: 20 } },
    { id: 'soc_t3_blackmail', tier: 3, label: 'Blackmail', icon: Scroll, riskVal: 0.30, description: 'Extort the Mayor.', message: 'Paid for silence.', effects: { gold: 200, stress: 40, xp: 50 } },
    { id: 'soc_t3_riot', tier: 3, label: 'Incite Riot', icon: Anvil, riskVal: 0.50, description: 'Power to the people!', message: 'Chaos reigns.', effects: { xp: 150, stress: -50, gold: 50, health: -10 } },
    { id: 'soc_t3_audience', tier: 3, label: 'Royal Audience', icon: Crown, riskVal: 0.20, description: 'Petition the King.', message: 'Knighthood granted.', effects: { xp: 200, mood: 50, gold: 500 } },
  ]
};

export const ADVENTURE_DB = {
  tier1: [ // Level 1-2
    { id: 'adv_t1_rats', tier: 1, label: 'Rat Cellar', icon: Scroll, riskVal: 0.30, description: 'Squeaking madness.', message: 'Pests exterminated.', effects: { gold: 20, xp: 20, hunger: 20, thirst: 20, stress: 10 } },
    { id: 'adv_t1_spiders', tier: 1, label: 'Giant Spiders', icon: Scroll, riskVal: 0.35, description: 'Webs everywhere.', message: 'Burned the webs.', effects: { gold: 25, xp: 25, hunger: 25, thirst: 20, stress: 15 } },
    { id: 'adv_t1_slime', tier: 1, label: 'Sewer Slime', icon: Droplets, riskVal: 0.25, description: 'It ate my boot.', message: 'Scraped it off.', effects: { gold: 15, xp: 20, hunger: 20, thirst: 25, stress: 10 } },
    { id: 'adv_t1_delivery', tier: 1, label: 'Woods Delivery', icon: MapPin, riskVal: 0.20, description: 'Run through dark woods.', message: 'Package delivered.', effects: { gold: 30, xp: 15, hunger: 30, thirst: 30, stress: 5 } },
    { id: 'adv_t1_herbs', tier: 1, label: 'Herb Gathering', icon: Apple, riskVal: 0.15, description: 'Find rare roots.', message: 'Bag full of roots.', effects: { gold: 35, xp: 15, hunger: 15, thirst: 15, stress: -5 } },
  ],
  tier2: [ // Level 3-5
    { id: 'adv_t2_goblins', tier: 2, label: 'Goblin Camp', icon: Sword, riskVal: 0.50, description: 'Annoying green menace.', message: 'Camp cleared.', effects: { gold: 50, xp: 60, hunger: 40, thirst: 40, stress: 25 } },
    { id: 'adv_t2_bandits', tier: 2, label: 'Bandit Ambush', icon: Sword, riskVal: 0.55, description: 'Stand and deliver!', message: 'Justice served.', effects: { gold: 70, xp: 50, hunger: 30, thirst: 30, stress: 30 } },
    { id: 'adv_t2_crypt', tier: 2, label: 'Restless Dead', icon: Skull, riskVal: 0.50, description: 'Bones are rattling.', message: 'Back to the grave.', effects: { gold: 40, xp: 70, hunger: 40, thirst: 40, stress: 40 } },
    { id: 'adv_t2_wolf', tier: 2, label: 'Dire Wolf', icon: Heart, riskVal: 0.60, description: 'Huge and hungry.', message: 'New fur coat.', effects: { gold: 60, xp: 60, hunger: 50, thirst: 30, stress: 20 } },
    { id: 'adv_t2_escort', tier: 2, label: 'Caravan Escort', icon: Shield, riskVal: 0.45, description: 'Protect the wagon.', message: 'Safe arrival.', effects: { gold: 80, xp: 40, hunger: 30, thirst: 30, stress: 20 } },
  ],
  tier3: [ // Level 6+
    { id: 'adv_t3_cult', tier: 3, label: 'Dark Ritual', icon: Skull, riskVal: 0.75, description: 'Stop the summoning.', message: 'World saved... for now.', effects: { gold: 150, xp: 150, hunger: 60, thirst: 60, stress: 50 } },
    { id: 'adv_t3_dragon', tier: 3, label: 'Young Dragon', icon: Zap, riskVal: 0.85, description: 'Fire and scales.', message: 'Slew the beast!', effects: { gold: 300, xp: 200, hunger: 80, thirst: 80, stress: 60 } },
    { id: 'adv_t3_lich', tier: 3, label: 'Lich Tomb', icon: Skull, riskVal: 0.80, description: 'Magical death.', message: 'Phylactery smashed.', effects: { gold: 200, xp: 180, hunger: 50, thirst: 50, stress: 70 } },
    { id: 'adv_t3_golem', tier: 3, label: 'Rogue Golem', icon: Hammer, riskVal: 0.70, description: 'Unstoppable stone.', message: 'Crumbled to dust.', effects: { gold: 120, xp: 140, hunger: 90, thirst: 90, stress: 30 } },
    { id: 'adv_t3_warlord', tier: 3, label: 'Orc Warlord', icon: Sword, riskVal: 0.75, description: 'Leader of the horde.', message: 'Warlord defeated.', effects: { gold: 180, xp: 160, hunger: 70, thirst: 70, stress: 40 } },
  ]
};

// --- Locations & Scenes ---
export const LOCATIONS = {
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

// --- Action Definitions ---
export const MAINTENANCE_ACTIONS = [
  { id: 'eat', label: 'Eat', icon: Utensils, cost: 5, days: 0, costType: 'gp', description: 'Uses inventory or buys meal.', message: 'Yum! Dried meat.', effects: { hunger: -30, health: 5 } },
  { id: 'drink', label: 'Drink', icon: Droplets, cost: 0, days: 0, costType: 'gp', description: 'Uses inventory or finds water.', message: 'Refreshing!', effects: { thirst: -40 } },
  { id: 'rest', label: 'Sleep', icon: Tent, cost: 0, days: 1, costType: 'gp', description: 'Recover health. 1 Day.', message: 'Zzz...', effects: { health: 15, stress: -20, hunger: 10, thirst: 10 } },
  { id: 'train', label: 'Train', icon: Activity, cost: 10, days: 1, costType: 'gp', description: 'Safe XP gain. Costs 10g.', message: 'Training montage!', effects: { xp: 10, hunger: 20, thirst: 20 } },
  { id: 'repair', label: 'Repair Gear', icon: Hammer, cost: 5, days: 0, costType: 'gp', description: 'Therapeutic maintenance.', message: 'Gear shines like new.', effects: { stress: -10 } },
  { id: 'tavern', label: 'Tavern Ale', icon: Sparkles, cost: 8, days: 0, costType: 'gp', description: 'Improves mood.', message: 'Huzzah!', effects: { mood: 15, stress: -15, hunger: -5, thirst: -10 } },
];
