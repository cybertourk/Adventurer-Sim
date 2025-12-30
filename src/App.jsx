import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Sword, VenetianMask, Shirt, User, Backpack, X, Heart, Zap, Sparkles, 
  Utensils, Coins, Hammer, Tent, Scroll, Skull, Activity, Droplets, MapPin, 
  ShoppingBag, DollarSign, Key, Apple, Beer, MessageCircle, Dice5, Anchor, Music, Pickaxe, BookOpen, Gem, Crown
} from 'lucide-react';

// --- Imports ---
// Explicit extensions added to resolve build errors
import { 
  ITEM_DB, LOCATIONS, APPEARANCE_OPTIONS, 
  LABOR_DB, SOCIAL_DB, ADVENTURE_DB, MAINTENANCE_ACTIONS,
  MAX_STAT, SAVE_KEY, AnchorIcon 
} from './data/GameData.jsx';

import CharacterSVG from './components/CharacterSVG.jsx';
import { StatBlock, ActionButton, renderItemStats } from './components/UIComponents.jsx';

export default function App() {
  // --- State ---
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

  const [days, setDays] = useState(1);
  const [location, setLocation] = useState('village_road');
  const [housing, setHousing] = useState('homeless');
  const [rentActive, setRentActive] = useState(false);

  const [activeTab, setActiveTab] = useState('actions');
  const [questCategory, setQuestCategory] = useState('labor'); // 'labor' | 'adventure' | 'social'
  const [activeSlot, setActiveSlot] = useState('head');
  const [isPanelOpen, setIsPanelOpen] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [isDead, setIsDead] = useState(false);
  
  // Daily Quests State
  const [dailyQuests, setDailyQuests] = useState({ 
      adventure: [],
      labor: [],
      social: []
  });

  const [showLocationInfo, setShowLocationInfo] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState('buy'); 
  const [activeStatInfo, setActiveStatInfo] = useState(null); 

  // --- Helpers ---
  const calculateMaxStats = (level) => ({
      health: 10 + (level * 10),
      mood: 100,
      hunger: 100,
      thirst: 100,
      stress: 100
  });

  const addMessage = (text, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9) + Date.now(); 
    setMessages(prev => [...prev.slice(-4), { id, text, type }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);
  };

  const getItemById = (id) => {
      const all = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
      return all.find(i => i.id === id);
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

  // --- Game Logic ---

  const refreshShop = () => {
    const allItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
    const purchasable = allItems.filter(i => i.cost > 0);
    const shuffled = [...purchasable].sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, 6).map(i => i.id);
    setShopStock(selection);
  };

  const refreshDailyQuests = (currentLevel) => {
      const pickRandom = (arr, count) => [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
      
      // Generic function to generate daily list for any DB (Adventure, Labor, Social)
      const getQuestsForCategory = (db, lvl) => {
          let basePool = [];
          let bonusPool = [];
          let selection = [];
          
          if (lvl >= 10) {
              // Cap: All tiers unlocked
              basePool = [...db.tier1, ...db.tier2, ...db.tier3];
              selection = pickRandom(basePool, 3);
              
              // 20% Chance for 4th quest (random tier)
              if (Math.random() < 0.20) {
                  const bonus = pickRandom(basePool, 1)[0];
                  if (bonus && !selection.find(q => q.id === bonus.id)) selection.push(bonus);
              }
          } 
          else if (lvl >= 5) {
              // Mid: Tier 1 & 2 unlocked
              basePool = [...db.tier1, ...db.tier2];
              selection = pickRandom(basePool, 3);
              
              // 20% Chance for Tier 3
              if (Math.random() < 0.20) {
                  const t3 = pickRandom(db.tier3, 1)[0];
                  if (t3) selection.push(t3); 
              }
          } 
          else {
              // Low: Tier 1 unlocked
              basePool = db.tier1;
              selection = pickRandom(basePool, 3);
              
              // 20% Chance for Tier 2
              if (Math.random() < 0.20) {
                  const t2 = pickRandom(db.tier2, 1)[0];
                  if (t2) selection.push(t2);
              }
          }
          return selection;
      };

      setDailyQuests({
          adventure: getQuestsForCategory(ADVENTURE_DB, currentLevel),
          labor: getQuestsForCategory(LABOR_DB, currentLevel),
          social: getQuestsForCategory(SOCIAL_DB, currentLevel)
      });
  };

  const passTime = (daysPassed) => {
      setDays(prev => prev + daysPassed);
      
      if (rentActive && housing === 'inn') {
          const totalRent = daysPassed * LOCATIONS.inn_room.dailyCost;
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
  };

  const performAction = (action) => {
    if (isDead) return;

    // Rent Logic
    if (action.id === 'rent_start') {
        if (resources.gold >= 5) {
            setHousing('inn');
            setRentActive(true);
            setResources(prev => ({ ...prev, gold: prev.gold - 5 }));
            addMessage("Rented room at Rusty Spoon.", 'success');
        } else {
            addMessage("Not enough gold.", 'error');
        }
        return;
    }
    if (action.id === 'rent_stop') {
        setHousing('homeless');
        setRentActive(false);
        addMessage("Checked out of Inn.", 'info');
        return;
    }

    // Requirements
    if (action.req) {
        if (!inventory.includes(action.req)) {
            const reqName = action.req === 'hammer' ? 'Smith Hammer' : action.req;
            addMessage(`Need ${reqName}!`, "error");
            return;
        }
    }

    // Consumables Logic
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
                const maxStats = calculateMaxStats(resources.level);
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
    
    // --- Success Calculation ---
    let isSuccess = true;
    let failChance = 0;
    
    const { ac, str, dex, int, cha } = currentStats;
    const stress = stats.stress;
    
    let baseRisk = action.riskVal || 0.30;
    
    // Risk Formulas
    if (action.type === 'labor') {
        if (action.tier === 1) failChance = baseRisk - (stats.health * 0.001); // Manual labor uses health
        else failChance = baseRisk - (str * 0.01);
    } else if (action.type === 'adventure') {
        failChance = baseRisk - ((str + ac + dex) * 0.01);
    } else if (action.type === 'social') {
        if (action.id.includes('brawl')) failChance = baseRisk - ((str + ac) * 0.01);
        else failChance = baseRisk - (cha * 0.01);
    }

    failChance += (stress * 0.002);
    failChance = Math.max(0.05, Math.min(0.95, failChance));

    if (action.isQuest) {
        if (Math.random() < failChance) isSuccess = false;
    }

    const currentLocId = housing === 'inn' ? 'inn_room' : 'village_road';
    const loc = LOCATIONS[currentLocId];
    const locMod = loc && loc.modifiers && loc.modifiers[action.id] ? loc.modifiers[action.id] : {};

    const getEffect = (stat) => {
        let base = action.effects[stat] || 0;
        let mod = locMod[stat] || 0;
        return base + mod;
    };

    const maxStats = calculateMaxStats(resources.level);

    if (isSuccess) {
        setStats(prev => ({
          health: Math.max(0, Math.min(maxStats.health, prev.health + getEffect('health'))),
          mood: Math.max(0, Math.min(maxStats.mood, prev.mood + getEffect('mood'))),
          hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + getEffect('hunger'))),
          thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + getEffect('thirst'))),
          stress: Math.max(0, Math.min(maxStats.stress, prev.stress + getEffect('stress')))
        }));

        if (action.effects.xp || action.effects.gold) {
          setResources(prev => {
            const newXp = prev.xp + (action.effects.xp || 0);
            const newGold = prev.gold + (action.effects.gold || 0);
            let newLevel = prev.level;
            if (newXp >= prev.level * 100) {
              newLevel++;
              addMessage(`Level Up! You are now level ${newLevel}`, "success");
            }
            return { ...prev, xp: newXp, gold: newGold, level: newLevel };
          });
        }
        
        // Loot Drop
        if (action.type === 'adventure' && Math.random() < 0.15) { 
           const allItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand];
           const findableItems = allItems.filter(i => i.cost > 0);
           if (findableItems.length > 0) {
             const foundItem = findableItems[Math.floor(Math.random() * findableItems.length)];
             setInventory(prev => [...prev, foundItem.id]);
             addMessage(`Loot: Found ${foundItem.name}!`, 'success');
           }
        }
        
        addMessage(action.message || "Success!", "success");

    } else {
        // Failure Logic
        let failMsg = "Action Failed!";
        let damage = 0;
        let stressDmg = 5;
        let moodDmg = 5;

        if (action.type === 'labor') {
            failMsg = "Screwed up the job. No pay.";
            stressDmg = 10;
        } else if (action.type === 'adventure') {
             failMsg = "Defeated! Retreated in shame.";
             damage = action.tier === 3 ? 40 : action.tier === 2 ? 20 : 10;
             stressDmg = 20;
        } else if (action.type === 'social') {
            failMsg = "Awkward silence...";
            if (action.id.includes('flirt')) { failMsg = "Rejected. Ouch."; moodDmg = 30; }
            if (action.id.includes('brawl')) { failMsg = "Got beaten up."; damage = 10; stressDmg = 0; }
            if (action.id.includes('gamble')) { failMsg = "Lost it all!"; stressDmg = 20; }
        }

        setStats(prev => ({ 
            ...prev, 
            health: Math.max(0, prev.health - damage),
            stress: Math.min(100, prev.stress + stressDmg),
            mood: Math.max(0, prev.mood - moodDmg),
            hunger: Math.min(100, prev.hunger + 10),
            thirst: Math.min(100, prev.thirst + 10)
        }));

        addMessage(failMsg, "error");
    }

    if (action.days > 0) {
        refreshShop();
        refreshDailyQuests(resources.level);
    }
  };

  const revive = () => {
    const max = calculateMaxStats(resources.level);
    setStats({ health: max.health, mood: max.mood, hunger: 0, thirst: 0, stress: 0 });
    setIsDead(false);
    setResources(prev => ({ ...prev, xp: Math.max(0, prev.xp - 50) })); 
    setHousing('homeless'); 
    setRentActive(false);
    addMessage("Revived... destitute.", "info");
    refreshDailyQuests(resources.level);
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

  // --- Initial Load ---
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
        
        if (parsed.shopStock && parsed.shopStock.length > 0) setShopStock(parsed.shopStock);
        else refreshShop();

        if (parsed.dailyQuests && parsed.dailyQuests.adventure && parsed.dailyQuests.adventure.length > 0) {
            setDailyQuests(parsed.dailyQuests);
        } else {
            refreshDailyQuests(parsed.resources ? parsed.resources.level : 1);
        }
      } catch (e) {
        refreshShop();
        refreshDailyQuests(1);
      }
    } else {
        refreshShop();
        refreshDailyQuests(1);
    }
  }, []);

  // --- Save Loop ---
  useEffect(() => {
      const maxStats = calculateMaxStats(resources.level);
      if ((stats.health <= 0 || stats.hunger >= maxStats.hunger || stats.thirst >= maxStats.thirst) && !isDead) {
          setIsDead(true);
          addMessage("Your adventurer has perished!", "error");
      }

      if (housing === 'inn' && location === 'village_road') setLocation('inn_room');
      if (housing === 'homeless' && location === 'inn_room') setLocation('village_road');

      const gameState = {
        stats, resources, equipped, appearance, location, inventory, 
        shopStock, days, housing, rentActive, dailyQuests, 
        lastSave: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [stats, resources, equipped, appearance, location, inventory, shopStock, isDead, days, housing, rentActive, dailyQuests]);

  const CurrentSceneBackground = LOCATIONS[location]?.renderBackground || (() => null);
  const currentLocData = LOCATIONS[location];
  const maxStats = calculateMaxStats(resources.level);

  const getActiveQuestActions = () => {
      // Map dynamic lists to ActionButton format
      const formatQuest = (q, type) => ({
          ...q,
          type,
          isQuest: true,
          cost: 0,
          days: type === 'adventure' ? q.tier : (type === 'labor' ? 1 : 0),
          risk: `${Math.floor(q.riskVal * 100)}%`
      });

      return {
        labor: (dailyQuests.labor || []).map(q => formatQuest(q, 'labor')),
        adventure: (dailyQuests.adventure || []).map(q => formatQuest(q, 'adventure')),
        social: (dailyQuests.social || []).map(q => formatQuest(q, 'social'))
      };
  };

  const ACTIVE_QUESTS = getActiveQuestActions();

  // --- Render ---
  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col md:flex-row">
      
      {/* Stat Info Modal */}
      {activeStatInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveStatInfo(null)}>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl max-w-xs w-full text-center" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold text-lg text-white mb-1">{activeStatInfo.toUpperCase()}</h3>
                  <button onClick={() => setActiveStatInfo(null)} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700">Close</button>
              </div>
          </div>
      )}

      {/* Shop Modal */}
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

      {/* Location Info Modal */}
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

      {/* Main Game View */}
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

      {/* Bottom Nav */}
      <div className="fixed bottom-8 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[450px] h-16 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex justify-around items-center z-50">
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

      {/* Side Panel */}
      <div className={`fixed md:relative z-40 transition-transform duration-300 ease-out bg-slate-900 border-slate-700 shadow-2xl md:w-72 md:h-full md:border-l md:translate-y-0 bottom-28 left-4 right-4 rounded-2xl border h-[55vh] ${isPanelOpen ? 'translate-y-0' : 'translate-y-[150%] md:translate-x-full md:hidden'}`}>
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-800/50 rounded-t-2xl md:rounded-none">
             <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                {activeTab === 'actions' && <><Activity size={14}/> Actions</>}
                {activeTab === 'quests' && <><Scroll size={14}/> Quests</>}
                {activeTab === 'equip' && <><Backpack size={14}/> Equipment</>}
                {activeTab === 'appearance' && <><User size={14}/> Appearance</>}
             </div>
             <button onClick={() => setIsPanelOpen(false)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={14} /></button>
          </div>

          <div className="hidden md:flex border-b border-slate-800">
             <button onClick={() => setActiveTab('actions')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'actions' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Actions</button>
             <button onClick={() => setActiveTab('quests')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'quests' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Quests</button>
             <button onClick={() => setActiveTab('equip')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'equip' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Gear</button>
             <button onClick={() => setActiveTab('appearance')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'appearance' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Look</button>
          </div>

          <div className="h-full overflow-y-auto custom-scrollbar p-3 pb-20 md:pb-4">
            
            {activeTab === 'actions' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Location: {housing === 'inn' ? 'Rented Room' : 'Homeless'}</div>
                {housing === 'homeless' && (
                    <button onClick={() => performAction({ id: 'rent_start' })} className="w-full flex items-center justify-between p-3 rounded-lg border border-amber-600/50 bg-amber-900/20 hover:bg-amber-900/40 text-amber-200 mb-2">
                        <div className="flex flex-col text-left"><span className="text-xs font-bold">Rent Room at Inn</span><span className="text-[9px] opacity-70">Auto-pay 5g/day. Better rest.</span></div><span className="text-xs font-mono font-bold">-5g</span>
                    </button>
                )}
                {housing === 'inn' && (
                    <button onClick={() => performAction({ id: 'rent_stop' })} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300 mb-2">
                        <div className="flex flex-col text-left"><span className="text-xs font-bold">Check Out</span><span className="text-[9px] opacity-70">Stop paying rent. Become homeless.</span></div><Key size={14} />
                    </button>
                )}
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Maintenance</div>
                <div className="space-y-2">
                  {MAINTENANCE_ACTIONS.map(action => (
                    <ActionButton key={action.id} {...action} onClick={() => performAction(action)} disabled={isDead} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quests' && (
               <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex gap-2 border-b border-slate-800 pb-2">
                     <button onClick={() => setQuestCategory('labor')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${questCategory === 'labor' ? 'bg-amber-900/30 text-amber-400 border border-amber-700/50' : 'text-slate-500 hover:bg-slate-800'}`}>Labor</button>
                     <button onClick={() => setQuestCategory('adventure')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${questCategory === 'adventure' ? 'bg-red-900/30 text-red-400 border border-red-700/50' : 'text-slate-500 hover:bg-slate-800'}`}>Adventure</button>
                     <button onClick={() => setQuestCategory('social')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${questCategory === 'social' ? 'bg-pink-900/30 text-pink-400 border border-pink-700/50' : 'text-slate-500 hover:bg-slate-800'}`}>Social</button>
                  </div>
                  
                  {ACTIVE_QUESTS[questCategory].map(action => (
                     <ActionButton key={action.id} {...action} onClick={() => performAction(action)} disabled={isDead} />
                  ))}
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
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                    Owned {activeSlot.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  
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
                                          <div className="p-2 rounded-md bg-slate-700 text-slate-400">
                                              {item.type === 'food' ? <Apple size={14} /> : item.type === 'potion' ? <Heart size={14} /> : <Beer size={14} />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <span className="font-bold text-xs">{item.name} <span className="text-slate-500">x{count}</span></span>
                                              <div className="text-[10px] text-slate-500">{item.description}</div>
                                          </div>
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
                                     <div className="flex items-center gap-2">
                                         <span className={`font-bold text-xs truncate ${isEquipped ? 'text-indigo-200' : 'text-slate-300'}`}>{item.name}</span>
                                         {count > 1 && <span className="text-[10px] text-slate-500 font-bold">x{count}</span>}
                                         {isEquipped && <span className="text-[8px] font-bold text-indigo-400 bg-indigo-950/50 px-1 py-0.5 rounded">EQUIPPED</span>}
                                     </div>
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
                      {['male', 'female'].map(g => (
                        <button key={g} onClick={() => setAppearance(p => ({...p, gender: g}))} className={`flex-1 py-1.5 rounded border text-[10px] font-bold uppercase ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skin</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {APPEARANCE_OPTIONS.skinTones.map(t => (
                        <button key={t.id} onClick={() => setAppearance(p => ({...p, skinTone: t.id}))} className={`w-6 h-6 rounded-full border-2 ${appearance.skinTone === t.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: t.color }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hair Style</h3>
                    <div className="flex gap-2">
                      {APPEARANCE_OPTIONS.hairStyles.map(s => (
                          <button key={s.id} onClick={() => setAppearance(p => ({...p, hairStyle: s.id}))} className={`flex-1 py-1 rounded border text-[10px] font-medium ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{s.label}</button>
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
