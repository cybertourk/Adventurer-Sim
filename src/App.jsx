import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Sword, VenetianMask, Shirt, RotateCcw, User, Palette, 
  Backpack, X, Heart, Zap, Sparkles, Utensils, Coins, 
  Hammer, Tent, Scroll, Skull, Menu, Activity, Droplets, MapPin, Info, 
  ShoppingBag, DollarSign, HelpCircle, Frown, Clock, Key, Apple, Beer, Wine, Trash2, Compass, Plus, Minus
} from 'lucide-react';

import CharacterSVG from './CharacterSVG';
import { getBackground } from './Backgrounds';
import { 
  ITEM_DB, 
  MAINTENANCE_ACTIONS, 
  JOB_DB, 
  ADVENTURE_DB, 
  SOCIAL_DB, 
  LOCATIONS, 
  APPEARANCE_OPTIONS, 
  SAVE_KEY, 
  MAX_STAT 
} from './data';

/* -------------------------------------------------------------------------
  THEME: CHAOTIC ADVENTURER SIMULATOR
  Version: 1.26 (Restored Eye Picker)
  -------------------------------------------------------------------------
*/

const ICON_MAP = {
  'Shield': Shield, 'Sword': Sword, 'Scroll': Scroll, 'Hammer': Hammer,
  'Tent': Tent, 'Activity': Activity, 'Utensils': Utensils, 'Droplets': Droplets,
  'Beer': Beer, 'Skull': Skull, 'User': User, 'Coins': Coins,
  'Heart': Heart, 'Zap': Zap, 'DollarSign': DollarSign, 'Compass': Compass
};

// --- Sub Components ---

const StatBlock = ({ label, value, max, alert, inverted, onClick, subValue }) => (
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
        {subValue !== undefined && <span className="text-[8px] text-indigo-400 font-mono">+{subValue}</span>}
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
      {Icon ? <Icon size={18} /> : <HelpCircle size={18} />}
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
           let isGood = false;
           if (['health', 'mood', 'xp', 'gold'].includes(key)) isGood = val > 0;
           else if (['hunger', 'thirst', 'stress'].includes(key)) isGood = val < 0;
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
  const [gameStarted, setGameStarted] = useState(false);
  const [creationStep, setCreationStep] = useState(1); // 1 = Visuals, 2 = Stats

  const [attributes, setAttributes] = useState({
    str: 0, dex: 0, con: 0, int: 0, cha: 0
  });

  const [stats, setStats] = useState({
    hunger: 0, thirst: 0, health: 20, mood: 100, stress: 0   
  });

  const [resources, setResources] = useState({
    gold: 50, xp: 0, level: 1
  });

  const [inventory, setInventory] = useState(['none', 'tunic', 'fist']); 
  const [shopStock, setShopStock] = useState([]); 

  const [equipped, setEquipped] = useState({
    head: 'none', body: 'tunic', mainHand: 'fist', offHand: 'none'
  });
  
  const [appearance, setAppearance] = useState({
    gender: 'male', skinTone: 'fair', hairColor: 'brown', eyeColor: 'brown', hairStyle: 'short'
  });

  const [days, setDays] = useState(1);
  const [location, setLocation] = useState('village_road'); 
  const [housing, setHousing] = useState('homeless'); 
  const [rentActive, setRentActive] = useState(false); 
  const [maxTier, setMaxTier] = useState(1); 
  const [dailyQuests, setDailyQuests] = useState({
    labor: [],
    adventure: [],
    social: []
  });

  const [activeTab, setActiveTab] = useState('actions');
  const [questTab, setQuestTab] = useState('labor'); // Sub-tab for quests
  const [activeSlot, setActiveSlot] = useState('head');
  const [isPanelOpen, setIsPanelOpen] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [isDead, setIsDead] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState('buy'); 
  const [activeStatInfo, setActiveStatInfo] = useState(null); 

  // --- Derived Stats & Math ---

  const calculateMaxStats = (level, con) => {
      // Formula: Health = 10 + (Level * 10) + (CON * 2)
      return {
          health: 10 + (level * 10) + (con * 2), 
          mood: 100,
          hunger: 100,
          thirst: 100,
          stress: 100
      };
  };

  const currentStats = useMemo(() => {
    // Base Attributes + Equipment Bonuses
    let total = { ...attributes, ac: 10 }; // Base AC is 10
    
    // Add Equipment
    Object.keys(equipped).forEach(slot => {
      const itemId = equipped[slot];
      const item = ITEM_DB[slot].find(i => i.id === itemId);
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([stat, val]) => {
          if (total[stat] !== undefined) total[stat] += val;
          else total[stat] = val; // Initialize if explicit stat like 'ac'
        });
      }
    });
    return total;
  }, [equipped, attributes]);

  const maxStats = useMemo(() => calculateMaxStats(resources.level, attributes.con), [resources.level, attributes.con]);

  // --- Initialization ---

  const refreshShop = () => {
    const allItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
    const purchasable = allItems.filter(i => i.cost > 0);
    const shuffled = [...purchasable].sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, 6).map(i => i.id);
    setShopStock(selection);
  };

  const generateDailyQuests = (currentTier) => {
    const getPool = (db, tier) => {
       let pool = [];
       // Collect all quests from tier 1 up to currentTier
       for (let i = 1; i <= tier; i++) {
         if (db[`tier${i}`]) pool = [...pool, ...db[`tier${i}`]];
       }
       return pool;
    };

    const selectRandom = (pool, count) => {
       if (!pool || pool.length === 0) return [];
       const shuffled = [...pool].sort(() => 0.5 - Math.random());
       return shuffled.slice(0, count);
    };

    // Base quests: 3 from current unlocked tier (and below)
    let laborQuests = selectRandom(getPool(JOB_DB, currentTier), 3);
    let adventureQuests = selectRandom(getPool(ADVENTURE_DB, currentTier), 3);
    let socialQuests = selectRandom(getPool(SOCIAL_DB, currentTier), 3);

    // 20% Chance for ONE bonus quest from Next Tier for THIS DAY ONLY
    const nextTier = currentTier + 1;
    // Check if next tier exists in DB before trying to add
    // Assuming max tier 3 for now based on data.js structure
    if (Math.random() < 0.20 && nextTier <= 3) {
       // Randomly pick which category gets the bonus quest
       const categoryRoll = Math.random();
       // Only add if the tier exists in the DB
       if (categoryRoll < 0.33 && JOB_DB[`tier${nextTier}`]) {
          const bonus = selectRandom(JOB_DB[`tier${nextTier}`], 1);
          laborQuests = [...laborQuests, ...bonus];
       } else if (categoryRoll < 0.66 && ADVENTURE_DB[`tier${nextTier}`]) {
          const bonus = selectRandom(ADVENTURE_DB[`tier${nextTier}`], 1);
          adventureQuests = [...adventureQuests, ...bonus];
       } else if (SOCIAL_DB[`tier${nextTier}`]) {
          const bonus = selectRandom(SOCIAL_DB[`tier${nextTier}`], 1);
          socialQuests = [...socialQuests, ...bonus];
       }
    }

    return {
      labor: laborQuests,
      adventure: adventureQuests,
      social: socialQuests
    };
  };

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAttributes(parsed.attributes || { str: 0, dex: 0, con: 0, int: 0, cha: 0 });
        setStats(parsed.stats || { hunger: 0, thirst: 0, health: 20, mood: 100, stress: 0 });
        setResources(parsed.resources || { gold: 50, xp: 0, level: 1 });
        setEquipped(parsed.equipped || { head: 'none', body: 'tunic', mainHand: 'fist', offHand: 'none' });
        setAppearance(parsed.appearance || { gender: 'male', skinTone: 'fair', hairColor: 'brown', eyeColor: 'brown', hairStyle: 'short' });
        setLocation(parsed.location || 'village_road');
        setHousing(parsed.housing || 'homeless');
        setRentActive(parsed.rentActive || false);
        setDays(parsed.days || 1);
        setInventory(parsed.inventory || ['none', 'tunic', 'fist']);
        setMaxTier(parsed.maxTier || 1);
        
        if (parsed.shopStock && parsed.shopStock.length > 0) {
            setShopStock(parsed.shopStock);
        } else {
            refreshShop();
        }

        if (parsed.dailyQuests) {
           setDailyQuests(parsed.dailyQuests);
        } else {
           setDailyQuests(generateDailyQuests(parsed.maxTier || 1));
        }
        
        // If we loaded data, game is started
        setGameStarted(true);

      } catch (e) {
        console.error("Failed to load save", e);
        refreshShop();
        setDailyQuests(generateDailyQuests(1));
      }
    } else {
        refreshShop();
        setDailyQuests(generateDailyQuests(1));
        setGameStarted(false); // Trigger creation screen
    }
  }, []);

  useEffect(() => {
      if (!gameStarted) return; // Don't save during creation

      if ((stats.health <= 0 || stats.hunger >= maxStats.hunger || stats.thirst >= maxStats.thirst) && !isDead) {
          setIsDead(true);
          addMessage("Your adventurer has perished!", "error");
      }
      if (housing === 'inn' && location === 'village_road') setLocation('inn_room');
      if (housing === 'homeless' && location === 'inn_room') setLocation('village_road');
      if (housing === 'estate' && location === 'village_road') setLocation('estate');

      const gameState = {
        attributes, stats, resources, equipped, appearance, location, inventory, shopStock, days, housing, rentActive, maxTier, dailyQuests, lastSave: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [attributes, stats, resources, equipped, appearance, location, inventory, shopStock, isDead, days, housing, rentActive, gameStarted, maxTier, dailyQuests]);

  // --- Logic Helpers ---

  const addMessage = (text, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9) + Date.now(); 
    setMessages(prev => [...prev.slice(-4), { id, text, type }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);
  };

  const passTime = (daysPassed) => {
      setDays(prev => prev + daysPassed);
      
      // Rent Logic
      if (rentActive) {
          const locId = housing === 'inn' ? 'inn_room' : housing === 'estate' ? 'estate' : null;
          if (locId && LOCATIONS[locId]) {
             const totalRent = daysPassed * LOCATIONS[locId].dailyCost;
             if (resources.gold >= totalRent) {
                  setResources(prev => ({ ...prev, gold: prev.gold - totalRent }));
                  addMessage(`Paid rent: -${totalRent}g`, 'info');
             } else {
                  setHousing('homeless');
                  setRentActive(false);
                  setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20) })); 
                  addMessage("Evicted! Couldn't pay rent.", 'error');
             }
          }
      }

      // Daily Reset Logic (Shop & Quests)
      refreshShop();
      
      // Generate new set of quests (includes the 20% chance for a bonus quest internally)
      const newQuests = generateDailyQuests(maxTier);
      
      // Check if bonus triggered for notification (more than 3 quests in any category)
      const hasBonus = newQuests.labor.length > 3 || newQuests.adventure.length > 3 || newQuests.social.length > 3;
      if (hasBonus) {
          addMessage("A rare opportunity appeared! (Higher Tier Quest)", 'success');
      }

      setDailyQuests(newQuests);
  };

  const performAction = (action) => {
    if (isDead) return;

    if (action.id === 'rent_start') {
        if (resources.gold >= 5) {
            setHousing('inn');
            setRentActive(true);
            setResources(prev => ({ ...prev, gold: prev.gold - 5 })); 
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

    if (action.id === 'eat' || action.id === 'drink') {
        const itemType = action.id === 'eat' ? 'food' : 'drink';
        const ownedSupplies = ITEM_DB.supplies.filter(i => i.type === itemType && inventory.includes(i.id));
        
        if (ownedSupplies.length > 0) {
            const itemToConsume = ownedSupplies[0];
            const idx = inventory.indexOf(itemToConsume.id);
            if (idx > -1) {
                const newInv = [...inventory];
                newInv.splice(idx, 1);
                setInventory(newInv);
                const effects = itemToConsume.effects || {};
                setStats(prev => ({
                  health: Math.max(0, Math.min(maxStats.health, prev.health + (effects.health || 0))),
                  mood: Math.max(0, Math.min(maxStats.mood, prev.mood + (effects.mood || 0))),
                  hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + (effects.hunger || 0))),
                  thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + (effects.thirst || 0))),
                  stress: Math.max(0, Math.min(maxStats.stress, prev.stress + (effects.stress || 0)))
                }));
                addMessage(`Consumed ${itemToConsume.name}`, 'success');
                return; 
            }
        }
        const currentLoc = LOCATIONS[location]; 
        if (!currentLoc.hasFoodService) {
            addMessage("No food/drink here. Check shop!", 'error');
            return;
        }
    }

    if (action.costType === 'gp' && resources.gold < action.cost) {
      addMessage("Not enough gold!", "error");
      return;
    }

    if (action.cost > 0 && action.costType === 'gp') {
      setResources(prev => ({ ...prev, gold: prev.gold - action.cost }));
    }

    if (action.days > 0) {
        passTime(action.days);
    }
    
    let isSuccess = true;
    let failChance = 0;
    
    // Stats for Risk Calculation (SRD v1.12)
    const ac = currentStats.ac;
    const str = currentStats.str;
    const dex = currentStats.dex;
    const int = currentStats.int; // Currently used for potential future magic, but good to have
    const con = currentStats.con;
    const cha = currentStats.cha;
    const stress = stats.stress;
    
    // Updated Formulas based on Phase 3
    if (action.type === 'labor') {
        // Labor uses STR + CON
        failChance = 0.20 - ((str + con) * 0.01) + (stress * 0.002);
    }
    else if (action.type === 'adventure') {
        // Adventure uses STR + DEX + AC
        failChance = 0.40 - ((str + dex + ac) * 0.01) + (stress * 0.002);
    }
    else if (action.type === 'social') {
        // Social uses CHA (heavily weighted)
        failChance = 0.20 - (cha * 0.02) + (stress * 0.002);
    }

    failChance = Math.max(0.05, Math.min(0.95, failChance));
    
    if (action.type === 'labor' || action.type === 'adventure' || action.type === 'social') {
        if (Math.random() < failChance) isSuccess = false;
    }

    const currentLocId = housing === 'inn' ? 'inn_room' : housing === 'estate' ? 'estate' : 'village_road';
    const loc = LOCATIONS[currentLocId];
    const locMod = loc && loc.modifiers && loc.modifiers[action.id] ? loc.modifiers[action.id] : {};

    const getEffect = (stat) => {
        let base = action.effects[stat] || 0;
        let mod = locMod[stat] || 0;
        return base + mod;
    };

    if (isSuccess) {
        setStats(prev => ({
          health: Math.max(0, Math.min(maxStats.health, prev.health + getEffect('health'))),
          mood: Math.max(0, Math.min(maxStats.mood, prev.mood + getEffect('mood'))),
          hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + getEffect('hunger'))),
          thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + getEffect('thirst'))),
          stress: Math.max(0, Math.min(maxStats.stress, prev.stress + getEffect('stress')))
        }));

        if (action.effects.xp) {
          setResources(prev => {
            const newXp = prev.xp + action.effects.xp;
            const newGold = prev.gold + (action.effects.gold || 0);
            let newLevel = prev.level;
            // XP Formula: Next Level = Current Level * 100
            if (newXp >= prev.level * 100) {
              newLevel++;
              addMessage(`Level Up! You are now level ${newLevel}`, "success");
            }
            return { ...prev, xp: newXp, gold: newGold, level: newLevel };
          });
        }
        
        if (action.type === 'adventure' && Math.random() < 0.15) { 
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
        let failMsg = "Failed!";
        if (action.type === 'labor') {
            failMsg = "Screwed up the job. No pay.";
            setStats(prev => ({ ...prev, stress: Math.min(100, prev.stress + 10) }));
        } 
        else if (action.type === 'adventure') {
            failMsg = "Defeated! Retreated with wounds.";
            setStats(prev => ({ 
                ...prev, 
                health: Math.max(0, prev.health - 20),
                stress: Math.min(100, prev.stress + 20),
                hunger: Math.min(100, prev.hunger + 20), 
                thirst: Math.min(100, prev.thirst + 20)
            }));
        } 
        else if (action.type === 'social') {
            failMsg = "Made a total fool of yourself.";
            setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20) }));
        }
        addMessage(failMsg, "error");
        if (action.days > 0) refreshShop();
        return; 
    }

    if (action.days > 0) refreshShop();
    addMessage(action.message, "success");
  };

  const revive = () => {
    setStats({ health: maxStats.health, mood: maxStats.mood, hunger: 0, thirst: 0, stress: 0 });
    setIsDead(false);
    setResources(prev => ({ ...prev, xp: Math.max(0, prev.xp - 50) })); 
    setHousing('homeless'); 
    setRentActive(false);
    addMessage("Revived... destitute.", "info");
  };

  const buyItem = (item) => {
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

  const consumeItem = (item) => {
      const idx = inventory.indexOf(item.id);
      if (idx > -1) {
          const newInv = [...inventory];
          newInv.splice(idx, 1);
          setInventory(newInv);
          const effects = item.effects || {};
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

  const togglePanel = (tab) => {
    if (isPanelOpen && activeTab === tab) setIsPanelOpen(false);
    else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

  const updateAppearance = (key, value) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  const getItemById = (id) => {
      const all = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
      return all.find(i => i.id === id);
  };

  const CurrentSceneBackground = getBackground(location);
  const currentLocData = LOCATIONS[location] || LOCATIONS['village_road'];

  // Updated to match SRD v1.12 Descriptions
  const getStatInfo = (key) => {
      switch(key) {
          case 'health': return { title: 'Health', desc: 'If this reaches 0, you die.', good: 'High' };
          case 'mood': return { title: 'Mood', desc: 'Mental state. Low mood triggers rebellion.', good: 'High' };
          case 'hunger': return { title: 'Hunger', desc: 'If this reaches max, you starve.', good: 'Low' };
          case 'thirst': return { title: 'Thirst', desc: 'If this reaches max, you dehydrate.', good: 'Low' };
          case 'stress': return { title: 'Stress', desc: 'Mental strain. High stress triggers breakdown.', good: 'Low' };
          case 'ac': return { title: 'AC', desc: 'Armor Class. Dodge/Deflect attacks.', good: 'High' };
          case 'str': return { title: 'STR', desc: 'Strength. Reduces Risk for Labor and Adventure (Melee).', good: 'High' };
          case 'dex': return { title: 'DEX', desc: 'Dexterity. Reduces Risk for Adventure (Dodge/Traps).', good: 'High' };
          case 'con': return { title: 'CON', desc: 'Constitution. Increases Health. Reduces Risk for Labor.', good: 'High' };
          case 'int': return { title: 'INT', desc: 'Intelligence. Reduces Risk for Magic Jobs.', good: 'High' };
          case 'cha': return { title: 'CHA', desc: 'Charisma. Reduces Risk for Socialize actions.', good: 'High' };
          default: return { title: key.toUpperCase(), desc: 'Attribute' };
      }
  };

  const resetGame = () => {
    if (confirm("Are you sure you want to reset everything? This cannot be undone.")) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  // --- Character Creation Handlers ---
  const pointsSpent = Object.values(attributes).reduce((a, b) => a + b, 0);
  const pointsAvailable = 5 - pointsSpent;

  const updateAttribute = (attr, delta) => {
      if (delta > 0 && pointsAvailable <= 0) return;
      if (delta < 0 && attributes[attr] <= 0) return;
      setAttributes(prev => ({ ...prev, [attr]: prev[attr] + delta }));
  };

  const startGame = () => {
      // Recalculate health based on new CON
      const newMax = calculateMaxStats(1, attributes.con);
      setStats(prev => ({ ...prev, health: newMax.health }));
      setGameStarted(true);
      setDailyQuests(generateDailyQuests(1)); // Generate initial quests
  };

  // --- VIEW: Character Creation ---
  if (!gameStarted) {
      return (
        <div className="h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[85vh]">
                
                {/* Left: Preview */}
                <div className="w-full md:w-1/3 bg-slate-950/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
                    <h2 className="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-widest">New Adventurer</h2>
                    <div className="w-48 h-72">
                        <CharacterSVG equipped={equipped} appearance={appearance} isAlive={true} />
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex gap-4 mb-6 border-b border-slate-800">
                        <button onClick={() => setCreationStep(1)} className={`pb-2 text-sm font-bold uppercase tracking-wider ${creationStep === 1 ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500'}`}>1. Appearance</button>
                        <button onClick={() => setCreationStep(2)} className={`pb-2 text-sm font-bold uppercase tracking-wider ${creationStep === 2 ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500'}`}>2. Attributes</button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {creationStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Gender</h3>
                                    <div className="flex gap-2">
                                        {['male', 'female'].map(g => (
                                            <button key={g} onClick={() => updateAppearance('gender', g)} className={`flex-1 py-2 rounded border text-xs font-bold uppercase ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{g}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Skin Tone</h3>
                                    <div className="flex gap-2">
                                        {APPEARANCE_OPTIONS.skinTones.map(t => (
                                            <button key={t.id} onClick={() => updateAppearance('skinTone', t.id)} className={`w-8 h-8 rounded-full border-2 ${appearance.skinTone === t.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: t.color }} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Eye Color</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {APPEARANCE_OPTIONS.eyeColors.map(c => (
                                            <button key={c.id} onClick={() => updateAppearance('eyeColor', c.id)} className={`w-6 h-6 rounded-full border-2 ${appearance.eyeColor === c.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.color }} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Hair Style</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {APPEARANCE_OPTIONS.hairStyles.map(s => (
                                            <button key={s.id} onClick={() => updateAppearance('hairStyle', s.id)} className={`py-2 rounded border text-xs font-bold ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{s.label}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Hair Color</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {APPEARANCE_OPTIONS.hairColors.map(c => (
                                            <button key={c.id} onClick={() => updateAppearance('hairColor', c.id)} className={`w-6 h-6 rounded border-2 ${appearance.hairColor === c.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.color }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {creationStep === 2 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg mb-4">
                                    <span className="text-sm font-bold text-slate-300">Points Available</span>
                                    <span className={`text-xl font-mono font-bold ${pointsAvailable > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>{pointsAvailable}</span>
                                </div>
                                {Object.keys(attributes).map(attr => (
                                    <div key={attr} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white uppercase">{attr}</span>
                                            <span className="text-[10px] text-slate-500">{getStatInfo(attr).desc.split('.')[1]}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateAttribute(attr, -1)} className="p-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300"><Minus size={14} /></button>
                                            <span className="w-4 text-center font-mono font-bold text-white">{attributes[attr]}</span>
                                            <button onClick={() => updateAttribute(attr, 1)} className="p-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300" disabled={pointsAvailable <= 0}><Plus size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                        {creationStep === 1 ? (
                            <button onClick={() => setCreationStep(2)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">Next: Attributes</button>
                        ) : (
                            <button onClick={startGame} disabled={pointsAvailable > 0} className={`px-6 py-3 font-bold rounded-lg transition-colors ${pointsAvailable > 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>Start Adventure</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: Main Game ---
  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col md:flex-row">
      {/* ... [Modals] ... */}
      {activeStatInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveStatInfo(null)}>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl max-w-xs w-full text-center" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold text-lg text-white mb-1">{getStatInfo(activeStatInfo).title}</h3>
                  <p className="text-sm text-slate-400">{getStatInfo(activeStatInfo).desc}</p>
                  <button onClick={() => setActiveStatInfo(null)} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700">Close</button>
              </div>
          </div>
      )}

      {showShop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in" onClick={() => setShowShop(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col h-[70vh]" onClick={e => e.stopPropagation()}>
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
                                <button onClick={() => buyItem(item)} disabled={!canAfford} className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold ${canAfford ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
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
                                <button onClick={() => sellItem(item)} className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowLocationInfo(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowLocationInfo(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-900/30 rounded-full text-indigo-400"><MapPin size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentLocData?.name}</h3>
                <span className="text-xs font-mono text-indigo-400 uppercase">{currentLocData?.type}</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">{currentLocData?.details}</p>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Effects & Modifiers</h4>
              {currentLocData?.tips && currentLocData.tips.map((tip, idx) => (
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
          
          <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex justify-between items-start z-50">
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
               <button onClick={resetGame} className="p-1.5 md:p-2 bg-red-900/80 rounded-md hover:bg-red-700 text-white transition-colors border border-red-500 shadow-lg" title="Reset Save">
                  <Trash2 size={14} className="md:w-4 md:h-4" />
               </button>
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
                 {/* Updated to use currentStats which includes Base + Gear */}
                 <StatBlock label="AC" value={currentStats.ac} onClick={() => setActiveStatInfo('ac')} />
                 <StatBlock label="STR" value={currentStats.str} subValue={currentStats.str - attributes.str > 0 ? currentStats.str - attributes.str : undefined} onClick={() => setActiveStatInfo('str')} />
                 <StatBlock label="DEX" value={currentStats.dex} subValue={currentStats.dex - attributes.dex > 0 ? currentStats.dex - attributes.dex : undefined} onClick={() => setActiveStatInfo('dex')} />
                 <StatBlock label="CON" value={currentStats.con} subValue={currentStats.con - attributes.con > 0 ? currentStats.con - attributes.con : undefined} onClick={() => setActiveStatInfo('con')} />
                 <StatBlock label="INT" value={currentStats.int} subValue={currentStats.int - attributes.int > 0 ? currentStats.int - attributes.int : undefined} onClick={() => setActiveStatInfo('int')} />
                 <StatBlock label="CHA" value={currentStats.cha} subValue={currentStats.cha - attributes.cha > 0 ? currentStats.cha - attributes.cha : undefined} onClick={() => setActiveStatInfo('cha')} />
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
            <Activity size={20} />
            <span className="text-[10px] font-bold">Actions</span>
         </button>
         <button onClick={() => togglePanel('quests')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'quests' && isPanelOpen ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Scroll size={20} />
            <span className="text-[10px] font-bold">Quests</span>
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

      <div className={`fixed md:relative z-40 transition-transform duration-300 ease-out bg-slate-900 border-slate-700 shadow-2xl md:w-72 md:h-full md:border-l md:translate-y-0 bottom-28 left-4 right-4 rounded-2xl border h-[55vh] ${isPanelOpen ? 'translate-y-0' : 'translate-y-[150%] md:translate-x-full md:hidden'}`}>
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-800/50 rounded-t-2xl md:rounded-none">
             <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                {activeTab === 'actions' && <><Activity size={14}/> Actions</>}
                {activeTab === 'quests' && <><Scroll size={14}/> Quests</>}
                {activeTab === 'equip' && <><Backpack size={14}/> Equipment</>}
                {activeTab === 'appearance' && <><User size={14}/> Appearance</>}
             </div>
             <button onClick={() => setIsPanelOpen(false)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 hover:text-white">
               <X size={14} />
             </button>
          </div>
          <div className="hidden md:flex border-b border-slate-800">
             <button onClick={() => setActiveTab('actions')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'actions' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Actions</button>
             <button onClick={() => setActiveTab('quests')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'quests' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Quests</button>
             <button onClick={() => setActiveTab('equip')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'equip' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Gear</button>
             <button onClick={() => setActiveTab('appearance')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'appearance' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Look</button>
          </div>

          <div className="h-full overflow-y-auto custom-scrollbar p-3 pb-20 md:pb-4">
            {activeTab === 'actions' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Location: {housing === 'inn' ? 'Rented Room' : housing === 'estate' ? 'Estate' : 'Homeless'}</div>
                {housing === 'homeless' && (
                    <button onClick={() => performAction({ id: 'rent_start' })} className="w-full flex items-center justify-between p-3 rounded-lg border border-amber-600/50 bg-amber-900/20 hover:bg-amber-900/40 text-amber-200">
                        <div className="flex flex-col text-left"><span className="text-xs font-bold">Rent Room at Inn</span><span className="text-[9px] opacity-70">Auto-pay 5g/day. Better rest.</span></div>
                        <span className="text-xs font-mono font-bold">-5g</span>
                    </button>
                )}
                {(housing === 'inn' || housing === 'estate') && (
                    <button onClick={() => performAction({ id: 'rent_stop' })} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300">
                        <div className="flex flex-col text-left"><span className="text-xs font-bold">Check Out</span><span className="text-[9px] opacity-70">Stop paying rent. Become homeless.</span></div>
                        <Key size={14} />
                    </button>
                )}
                <div className="h-px bg-slate-800 my-2" />
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Maintenance</div>
                {MAINTENANCE_ACTIONS.map(action => (
                  <ActionButton 
                    key={action.id} 
                    {...action} 
                    icon={ICON_MAP[action.icon] || HelpCircle} 
                    onClick={() => performAction(action)} 
                    disabled={isDead} 
                  />
                ))}
              </div>
            )}

            {activeTab === 'quests' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <div className="flex gap-2 mb-4 p-1 bg-slate-800 rounded-lg">
                   {['labor', 'adventure', 'social'].map(qt => (
                      <button key={qt} onClick={() => setQuestTab(qt)} className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors ${questTab === qt ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                        {qt}
                      </button>
                   ))}
                </div>
                
                {questTab === 'labor' && (
                   <div className="space-y-2">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Available Jobs</div>
                      {dailyQuests.labor.length > 0 ? dailyQuests.labor.map(action => (
                        <ActionButton key={action.id} {...action} icon={ICON_MAP[action.icon] || HelpCircle} onClick={() => performAction(action)} disabled={isDead} />
                      )) : <div className="text-xs text-slate-500 italic p-2">No jobs available today.</div>}
                   </div>
                )}
                
                {questTab === 'adventure' && (
                   <div className="space-y-2">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Available Adventures</div>
                      {dailyQuests.adventure.length > 0 ? dailyQuests.adventure.map(action => (
                        <ActionButton key={action.id} {...action} icon={ICON_MAP[action.icon] || HelpCircle} onClick={() => performAction(action)} disabled={isDead} />
                      )) : <div className="text-xs text-slate-500 italic p-2">No adventures available today.</div>}
                   </div>
                )}
                
                {questTab === 'social' && (
                   <div className="space-y-2">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Social Opportunities</div>
                      {dailyQuests.social.length > 0 ? dailyQuests.social.map(action => (
                        <ActionButton key={action.id} {...action} icon={ICON_MAP[action.icon] || HelpCircle} onClick={() => performAction(action)} disabled={isDead} />
                      )) : <div className="text-xs text-slate-500 italic p-2">No one wants to talk to you.</div>}
                   </div>
                )}
              </div>
            )}

            {activeTab === 'equip' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="flex gap-1 mb-4 p-1 bg-slate-800 rounded-lg overflow-x-auto">
                    {['head', 'body', 'mainHand', 'offHand', 'supplies'].map(slot => (
                       <button key={slot} onClick={() => setActiveSlot(slot)} className={`flex-1 min-w-[60px] py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors ${activeSlot === slot ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                         {slot.replace('Hand', '').replace('supplies', 'Supplies')}
                       </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Owned {activeSlot.replace(/([A-Z])/g, ' $1').trim()}</div>
                  {activeSlot === 'supplies' ? (
                      <div>
                          {ITEM_DB.supplies.filter(item => inventory.includes(item.id)).length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-500 italic border border-dashed border-slate-700 rounded">No supplies. Buy food/drink at the Shop!</div>
                          ) : (
                              [...new Set(inventory.filter(id => ITEM_DB.supplies.find(s => s.id === id)))].map(itemId => {
                                  const item = getItemById(itemId);
                                  const count = inventory.filter(id => id === itemId).length;
                                  return (
                                      <div key={item.id} className="flex items-center gap-2 p-2 w-full rounded-lg border text-left transition-all relative overflow-hidden bg-slate-800 border-slate-700 mb-2">
                                          <div className="p-2 rounded-md bg-slate-700 text-slate-400">{item.type === 'food' ? <Apple size={14} /> : item.type === 'potion' ? <Heart size={14} /> : item.type === 'drink' ? <Wine size={14} /> : <Beer size={14} />}</div>
                                          <div className="flex-1 min-w-0"><span className="font-bold text-xs">{item.name} <span className="text-slate-500">x{count}</span></span><div className="text-[10px] text-slate-500">{item.description}</div></div>
                                          <button onClick={() => consumeItem(item)} className="px-2 py-1 rounded border border-slate-600 bg-slate-700 text-slate-300 text-[10px] font-bold hover:bg-emerald-900 hover:border-emerald-500 hover:text-emerald-100 transition-colors">Use</button>
                                      </div>
                                  );
                              })
                          )}
                      </div>
                  ) : (
                      ITEM_DB[activeSlot].filter(item => inventory.includes(item.id)).length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500 italic border border-dashed border-slate-700 rounded">No items owned in this slot. Visit the Shop to buy gear!</div>
                      ) : (
                          [...new Set(inventory.filter(id => ITEM_DB[activeSlot].find(i => i.id === id)))].map((itemId) => {
                            const item = getItemById(itemId);
                            const isEquipped = equipped[activeSlot] === itemId;
                            const count = inventory.filter(id => id === itemId).length;
                            return (
                              <div key={itemId} className={`flex items-center gap-2 p-2 w-full rounded-lg border text-left transition-all relative overflow-hidden ${isEquipped ? 'bg-indigo-900/30 border-indigo-500 shadow-sm ring-1 ring-indigo-500/30' : 'bg-slate-800 border-slate-700'}`}>
                                 <div className={`p-2 rounded-md ${isEquipped ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                    {activeSlot === 'head' && <VenetianMask size={14} />}
                                    {activeSlot === 'body' && <Shirt size={14} />}
                                    {activeSlot === 'mainHand' && <Sword size={14} />}
                                    {activeSlot === 'offHand' && <Shield size={14} />}
                                 </div>
                                 <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2"><span className={`font-bold text-xs truncate ${isEquipped ? 'text-indigo-200' : 'text-slate-300'}`}>{item.name}</span>{count > 1 && <span className="text-[10px] text-slate-500 font-bold">x{count}</span>}{isEquipped && <span className="text-[8px] font-bold text-indigo-400 bg-indigo-950/50 px-1 py-0.5 rounded">EQUIPPED</span>}</div>
                                    <span className="text-[10px] text-slate-500 truncate">{item.description}</span>
                                 </div>
                                 {!isEquipped && (<button onClick={() => equipItem(item)} className="px-2 py-1 rounded border border-slate-600 bg-slate-700 text-slate-300 text-[10px] font-bold hover:bg-slate-600 hover:text-white transition-colors">Equip</button>)}
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
                      {['male', 'female'].map(g => (<button key={g} onClick={() => updateAppearance('gender', g)} className={`flex-1 py-1.5 rounded border text-[10px] font-bold uppercase ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{g}</button>))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skin</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {APPEARANCE_OPTIONS.skinTones.map(t => (<button key={t.id} onClick={() => updateAppearance('skinTone', t.id)} className={`w-6 h-6 rounded-full border-2 ${appearance.skinTone === t.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: t.color }} />))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hair Style</h3>
                    <div className="flex gap-2">
                      {APPEARANCE_OPTIONS.hairStyles.map(s => (<button key={s.id} onClick={() => updateAppearance('hairStyle', s.id)} className={`flex-1 py-1 rounded border text-[10px] font-medium ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{s.label}</button>))}
                    </div>
                  </div>
               </div>
            )}
          </div>
      </div>
    </div>
  );
}
