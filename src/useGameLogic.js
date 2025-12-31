import { useState, useEffect, useMemo } from 'react';
import { 
  ITEM_DB, 
  JOB_DB, 
  ADVENTURE_DB, 
  SOCIAL_DB, 
  LOCATIONS, 
  AUTONOMY_EVENTS,
  QUIRKS,
  SAVE_KEY 
} from './data';

/* -------------------------------------------------------------------------
   HOOK: useGameLogic
   Contains all state management and game mechanics.
   ------------------------------------------------------------------------- */

export const useGameLogic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [creationStep, setCreationStep] = useState(1);

  const [attributes, setAttributes] = useState({
    str: 10, dex: 10, con: 10, int: 10, cha: 10
  });

  const [quirk, setQuirk] = useState(null); 

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

  const [messages, setMessages] = useState([]);
  const [isDead, setIsDead] = useState(false);
  const [dailyLogs, setDailyLogs] = useState([]); 

  // --- Derived Stats ---

  const calculateMaxStats = (level, con) => {
      return {
          health: 10 + (level * 10) + (con * 2), 
          mood: 100,
          hunger: 100,
          thirst: 100,
          stress: 100
      };
  };

  const currentStats = useMemo(() => {
    let total = { ...attributes, ac: 10 }; 
    
    Object.keys(equipped).forEach(slot => {
      const itemId = equipped[slot];
      const item = ITEM_DB[slot].find(i => i.id === itemId);
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([stat, val]) => {
          if (total[stat] !== undefined) total[stat] += val;
          else total[stat] = val;
        });
      }
    });

    if (quirk && quirk.effects && quirk.effects.stats) {
        Object.entries(quirk.effects.stats).forEach(([stat, val]) => {
            if (total[stat] !== undefined) total[stat] += val;
        });
    }

    return total;
  }, [equipped, attributes, quirk]);

  const maxStats = useMemo(() => calculateMaxStats(resources.level, attributes.con), [resources.level, attributes.con]);

  // --- Helpers ---

  const addMessage = (text, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9) + Date.now(); 
    setMessages(prev => [...prev.slice(-4), { id, text, type }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);
  };

  const addToLog = (logEntry) => {
      setDailyLogs(prev => [{ ...logEntry, id: Date.now() }, ...prev]);
  };

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

    let laborQuests = selectRandom(getPool(JOB_DB, currentTier), 3);
    let adventureQuests = selectRandom(getPool(ADVENTURE_DB, currentTier), 3);
    let socialQuests = selectRandom(getPool(SOCIAL_DB, currentTier), 3);

    const nextTier = currentTier + 1;
    if (Math.random() < 0.20 && nextTier <= 3) {
       const categoryRoll = Math.random();
       if (categoryRoll < 0.33 && JOB_DB[`tier${nextTier}`]) {
          laborQuests = [...laborQuests, ...selectRandom(JOB_DB[`tier${nextTier}`], 1)];
       } else if (categoryRoll < 0.66 && ADVENTURE_DB[`tier${nextTier}`]) {
          adventureQuests = [...adventureQuests, ...selectRandom(ADVENTURE_DB[`tier${nextTier}`], 1)];
       } else if (SOCIAL_DB[`tier${nextTier}`]) {
          socialQuests = [...socialQuests, ...selectRandom(SOCIAL_DB[`tier${nextTier}`], 1)];
       }
    }

    return { labor: laborQuests, adventure: adventureQuests, social: socialQuests };
  };

  // --- Autonomy System ---

  const checkAutonomy = (currentMood, currentStress) => {
      if (currentMood > 40 && currentStress < 60) return 'safe';
      if (currentMood < 10 || currentStress > 90) return 'crisis';
      return 'risk';
  };

  const runAutonomyEvent = (zone) => {
      let event = null;
      let chance = 0;
      
      if (zone === 'safe') chance = 0.05;
      if (zone === 'risk') chance = 0.30;
      if (zone === 'crisis') chance = 0.70;

      if (Math.random() > chance) return null;

      const pool = zone === 'crisis' ? AUTONOMY_EVENTS.major : AUTONOMY_EVENTS.minor;
      event = pool[Math.floor(Math.random() * pool.length)];

      return event;
  };

  // --- Effects ---

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAttributes(parsed.attributes || { str: 10, dex: 10, con: 10, int: 10, cha: 10 });
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
        setDailyLogs(parsed.dailyLogs || []);
        setQuirk(parsed.quirk || null); 
        
        if (parsed.shopStock && parsed.shopStock.length > 0) setShopStock(parsed.shopStock);
        else refreshShop();

        if (parsed.dailyQuests) setDailyQuests(parsed.dailyQuests);
        else setDailyQuests(generateDailyQuests(parsed.maxTier || 1));
        
        setGameStarted(true);
      } catch (e) {
        console.error("Failed to load save", e);
        refreshShop();
        setDailyQuests(generateDailyQuests(1));
      }
    } else {
        refreshShop();
        setDailyQuests(generateDailyQuests(1));
        setGameStarted(false);
    }
  }, []);

  useEffect(() => {
      if (!gameStarted) return;

      if ((stats.health <= 0 || stats.hunger >= maxStats.hunger || stats.thirst >= maxStats.thirst) && !isDead) {
          setIsDead(true);
          addMessage("Your adventurer has perished!", "error");
      }
      if (housing === 'inn' && location === 'village_road') setLocation('inn_room');
      if (housing === 'homeless' && location === 'inn_room') setLocation('village_road');
      if (housing === 'estate' && location === 'village_road') setLocation('estate');

      const gameState = {
        attributes, stats, resources, equipped, appearance, location, inventory, shopStock, days, housing, rentActive, maxTier, dailyQuests, dailyLogs, quirk, lastSave: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [attributes, stats, resources, equipped, appearance, location, inventory, shopStock, isDead, days, housing, rentActive, gameStarted, maxTier, dailyQuests, dailyLogs, quirk]);

  // --- Actions ---

  const passTime = (daysPassed) => {
      let rentMsg = "No rent paid (Homeless).";
      let housingEffect = { health: 0, stress: 0 };
      let gained = [];
      let lost = [];
      
      if (rentActive) {
          const locId = housing === 'inn' ? 'inn_room' : housing === 'estate' ? 'estate' : null;
          if (locId && LOCATIONS[locId]) {
             const totalRent = daysPassed * LOCATIONS[locId].dailyCost;
             if (resources.gold >= totalRent) {
                  setResources(prev => ({ ...prev, gold: prev.gold - totalRent }));
                  rentMsg = `Paid rent: -${totalRent}g at ${LOCATIONS[locId].name}.`;
                  lost.push(`${totalRent} Gold (Rent)`);
                  
                  if (LOCATIONS[locId].modifiers && LOCATIONS[locId].modifiers.rest) {
                      const mod = LOCATIONS[locId].modifiers.rest;
                      setStats(prev => ({
                          ...prev,
                          health: Math.min(maxStats.health, prev.health + (mod.health || 0)),
                          stress: Math.max(0, prev.stress + (mod.stress || 0)),
                          mood: Math.min(maxStats.mood, prev.mood + (mod.mood || 0))
                      }));
                      housingEffect = mod;
                  }
             } else {
                  setHousing('homeless');
                  setRentActive(false);
                  setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20) })); 
                  rentMsg = "Evicted! Couldn't pay rent. Slept in the dirt.";
                  lost.push("Housing (Evicted)");
                  addMessage("Evicted!", 'error');
             }
          }
      } else {
          const mod = LOCATIONS.village_road.modifiers.rest;
          setStats(prev => ({
              ...prev,
              health: Math.min(maxStats.health, prev.health + (mod.health || 0)),
              stress: Math.max(0, prev.stress + (mod.stress || 0)),
              mood: Math.max(0, prev.mood + (mod.mood || 0))
          }));
          housingEffect = mod;
          rentMsg = "Slept outside. It was cold.";
      }

      const zone = checkAutonomy(stats.mood, stats.stress);
      const incident = runAutonomyEvent(zone);
      let incidentMsg = "Nothing purely chaotic happened.";
      
      if (incident) {
          incidentMsg = incident.text; 
          
          const fx = incident.effects;
          if (fx) {
              setStats(prev => ({
                  health: Math.max(0, Math.min(maxStats.health, prev.health + (fx.health || 0))),
                  mood: Math.max(0, Math.min(maxStats.mood, prev.mood + (fx.mood || 0))),
                  hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + (fx.hunger || 0))),
                  thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + (fx.thirst || 0))),
                  stress: Math.max(0, Math.min(maxStats.stress, prev.stress + (fx.stress || 0)))
              }));

              if (fx.gold) {
                  setResources(prev => ({ ...prev, gold: Math.max(0, prev.gold + fx.gold) }));
                  if(fx.gold > 0) gained.push(`${fx.gold} Gold`);
                  if(fx.gold < 0) lost.push(`${Math.abs(fx.gold)} Gold`);
              }
              
              if (fx.housing === 'homeless') {
                  setHousing('homeless');
                  setRentActive(false);
                  lost.push("Housing");
              }

              if (fx.equipmentLoss) {
                  const slots = ['head', 'body', 'mainHand', 'offHand'];
                  const randomSlot = slots[Math.floor(Math.random() * slots.length)];
                  const itemId = equipped[randomSlot];
                  if (itemId !== 'none' && itemId !== 'fist' && itemId !== 'tunic') {
                      setEquipped(prev => ({ ...prev, [randomSlot]: 'none' })); 
                      incidentMsg += ` (Lost ${itemId})`;
                      lost.push(itemId);
                  }
              }
          }
          addMessage("Something happened last night...", "warning");
      }

      if (quirk && quirk.id === 'kleptomaniac' && Math.random() < (quirk.effects.junkChance || 0)) {
          incidentMsg += " Also... found some shiny trash.";
          gained.push("Shiny Trash");
      }

      addToLog({
          type: 'morning',
          day: days,
          sleepLoc: housing === 'inn' ? 'Inn' : housing === 'estate' ? 'Estate' : 'Outside',
          rent: rentMsg,
          incidentTitle: incident ? incident.title : "Uneventful Night",
          incidentText: incidentMsg,
          status: `Health ${housingEffect.health > 0 ? '+' : ''}${housingEffect.health}, Stress ${housingEffect.stress}, Mood ${housingEffect.mood}`,
          gained: gained.join(", "),
          lost: lost.join(", ")
      });
      
      setDays(prev => prev + daysPassed);
      
      refreshShop();
      const newQuests = generateDailyQuests(maxTier);
      const hasBonus = newQuests.labor.length > 3 || newQuests.adventure.length > 3 || newQuests.social.length > 3;
      if (hasBonus) addMessage("A rare opportunity appeared! (Higher Tier Quest)", 'success');
      setDailyQuests(newQuests);
  };

  const performAction = (action) => {
    if (isDead) return;

    if (quirk && quirk.effects.bannedJobs && quirk.effects.bannedJobs.includes(action.id)) {
        addMessage("I don't get it. Too complicated.", "error");
        return;
    }

    // Capture gained/lost for detailed logging
    let gained = [];
    let lost = [];

    if (action.id === 'rent_start') {
        if (resources.gold >= 5) {
            setHousing('inn');
            setRentActive(true);
            setResources(prev => ({ ...prev, gold: prev.gold - 5 })); 
            addMessage("Rented room at Rusty Spoon.", 'success');
            addToLog({ type: 'action', day: days, title: 'Housing', text: 'Rented a room at the Rusty Spoon.', status: 'Success', lost: '5 Gold', gained: 'Warm Bed' });
        } else {
            addMessage("Not enough gold to rent room.", 'error');
            addToLog({ type: 'action', day: days, title: 'Housing', text: 'Tried to rent a room but was too poor.', status: 'Failed' });
        }
        return;
    }
    
    if (action.id === 'rent_stop') {
        setHousing('homeless');
        setRentActive(false);
        addMessage("Checked out of Inn.", 'info');
        addToLog({ type: 'action', day: days, title: 'Housing', text: 'Checked out of the inn.', status: 'Info', lost: 'Warm Bed' });
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
                
                // Detailed Breakdown
                let gainStr = [];
                if(effects.health) gainStr.push(`${effects.health > 0 ? '+' : ''}${effects.health} Health`);
                if(effects.hunger) gainStr.push(`${effects.hunger} Hunger`);
                if(effects.thirst) gainStr.push(`${effects.thirst} Thirst`);
                if(effects.mood) gainStr.push(`${effects.mood} Mood`);
                if(effects.stress) gainStr.push(`${effects.stress} Stress`);

                addToLog({ type: 'action', day: days, title: 'Consumable', text: `Consumed ${itemToConsume.name}.`, status: 'Success', lost: itemToConsume.name, gained: gainStr.join(", ") });
                return; 
            }
        }
        const currentLoc = LOCATIONS[location]; 
        if (!currentLoc.hasFoodService) {
            addMessage("No food/drink here. Check shop!", 'error');
            return;
        }
    }

    let cost = action.cost;
    if (quirk && quirk.id === 'lightweight' && (action.id === 'tavern' || action.id === 'drink')) {
        cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
    }

    if (action.costType === 'gp' && resources.gold < cost) {
      addMessage("Not enough gold!", "error");
      addToLog({ type: 'action', day: days, title: action.label, text: "Not enough gold to perform action.", status: 'Failed' });
      return;
    }

    if (cost > 0 && action.costType === 'gp') {
      setResources(prev => ({ ...prev, gold: prev.gold - cost }));
      lost.push(`${cost} Gold`);
    }

    if (action.days > 0) {
        passTime(action.days);
    }
    
    let isSuccess = true;
    let failChance = 0;
    
    const ac = currentStats.ac;
    const str = currentStats.str;
    const dex = currentStats.dex;
    const con = currentStats.con;
    const cha = currentStats.cha;
    const stress = stats.stress;
    
    if (action.type === 'labor') {
        failChance = 0.40 - ((str + con) * 0.01) + (stress * 0.002);
    }
    else if (action.type === 'adventure') {
        failChance = 0.60 - ((str + dex + ac) * 0.01) + (stress * 0.002);
    }
    else if (action.type === 'social') {
        failChance = 0.40 - (cha * 0.02) + (stress * 0.002);
    }

    failChance = Math.max(0.05, Math.min(0.95, failChance));
    
    if (['labor', 'adventure', 'social'].includes(action.type)) {
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
        let moodGain = getEffect('mood');
        if (quirk && quirk.id === 'drama_queen' && moodGain > 0) {
            moodGain *= (quirk.effects.moodMultiplier || 1);
        }

        const healthGain = getEffect('health');
        const hungerGain = getEffect('hunger');
        const thirstGain = getEffect('thirst');
        const stressGain = getEffect('stress');

        setStats(prev => ({
          health: Math.max(0, Math.min(maxStats.health, prev.health + healthGain)),
          mood: Math.max(0, Math.min(maxStats.mood, prev.mood + moodGain)),
          hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + hungerGain)),
          thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + thirstGain)),
          stress: Math.max(0, Math.min(maxStats.stress, prev.stress + stressGain))
        }));

        if(healthGain !== 0) gained.push(`${healthGain > 0 ? '+' : ''}${healthGain} Health`);
        if(moodGain !== 0) gained.push(`${moodGain > 0 ? '+' : ''}${moodGain} Mood`);
        if(hungerGain !== 0) gained.push(`${hungerGain} Hunger`);
        if(thirstGain !== 0) gained.push(`${thirstGain} Thirst`);
        if(stressGain !== 0) gained.push(`${stressGain} Stress`);

        let logText = action.message || "Completed action.";
        let lootText = "";

        if (action.effects.xp) {
          setResources(prev => {
            const newXp = prev.xp + action.effects.xp;
            let goldGain = action.effects.gold || 0;

            if (action.type === 'social' && quirk && quirk.id === 'sticky_fingers') {
                if (Math.random() < (quirk.effects.socialGoldChance || 0)) {
                    goldGain += 5;
                    addMessage("Swiped some extra coin!", "success");
                    lootText += " (Bonus 5g)";
                    gained.push("5 Gold (Bonus)");
                }
            }

            if(goldGain > 0) gained.push(`${goldGain} Gold`);
            gained.push(`${action.effects.xp} XP`);

            const newGold = prev.gold + goldGain;
            let newLevel = prev.level;
            if (newXp >= prev.level * 100) {
              newLevel++;
              addMessage(`Level Up! You are now level ${newLevel}`, "success");
              lootText += " LEVEL UP!";
              gained.push("Level Up");
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
                 lootText += ` Found: ${foundItem.name}`;
                 gained.push(foundItem.name);
             }
           }
        }

        addToLog({ 
            type: 'action', 
            day: days, 
            title: action.label, 
            text: logText + lootText, 
            status: 'Success',
            gained: gained.join(", "),
            lost: lost.join(", ")
        });

    } else {
        let failMsg = "Failed!";
        let stressGain = 0;

        if (action.type === 'labor') {
            failMsg = "Screwed up the job. No pay.";
            stressGain = 10;
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
            lost.push("20 Health");
            gained.push("20 Stress", "20 Hunger", "20 Thirst");
        } 
        else if (action.type === 'social') {
            failMsg = "Made a total fool of yourself.";
            setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20) }));
            lost.push("20 Mood");
        }

        if (quirk && quirk.id === 'drama_queen') {
            stressGain *= (quirk.effects.stressFailureMultiplier || 1);
        }
        
        if (stressGain > 0) {
            setStats(prev => ({ ...prev, stress: Math.min(100, prev.stress + stressGain) }));
            gained.push(`${stressGain} Stress`);
        }

        addMessage(failMsg, "error");
        addToLog({ 
            type: 'action', 
            day: days, 
            title: action.label, 
            text: failMsg, 
            status: 'Failed',
            gained: gained.join(", "),
            lost: lost.join(", ")
        });

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
    addToLog({ 
        type: 'action', 
        day: days, 
        title: 'Revived', 
        text: 'I have returned from the dead. Ouch.', 
        status: 'Revived',
        lost: '50 XP, Housing',
        gained: 'Life'
    });
  };

  const buyItem = (item) => {
    let cost = item.cost;
    if (quirk && quirk.id === 'lightweight' && (item.type === 'drink' || item.id === 'ale' || item.id === 'wine')) {
        cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
    }

    if (resources.gold >= cost) {
      setResources(prev => ({ ...prev, gold: prev.gold - cost }));
      setInventory(prev => [...prev, item.id]);
      addMessage(`Purchased ${item.name}`, 'success');
      addToLog({ 
          type: 'action', 
          day: days, 
          title: 'Shop', 
          text: `Bought ${item.name}.`, 
          status: 'Success',
          lost: `${cost} Gold`,
          gained: item.name
      });
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
    addToLog({ 
        type: 'action', 
        day: days, 
        title: 'Shop', 
        text: `Sold ${item.name}.`, 
        status: 'Success',
        lost: item.name,
        gained: `${sellValue} Gold`
    });
  };

  const equipItem = (item) => {
    setEquipped(prev => ({ ...prev, [item.type]: item.id }));
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
          
          let gainStr = [];
          if(effects.health) gainStr.push(`${effects.health > 0 ? '+' : ''}${effects.health} Health`);
          if(effects.hunger) gainStr.push(`${effects.hunger} Hunger`);
          if(effects.thirst) gainStr.push(`${effects.thirst} Thirst`);
          if(effects.mood) gainStr.push(`${effects.mood} Mood`);
          if(effects.stress) gainStr.push(`${effects.stress} Stress`);

          addToLog({ 
              type: 'action', 
              day: days, 
              title: 'Inventory', 
              text: `Ate/Drank ${item.name}.`, 
              status: 'Success',
              lost: item.name,
              gained: gainStr.join(", ")
          });
      }
  };

  const updateAppearance = (key, value) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  const updateAttribute = (attr, delta) => {
      const baseStatTotal = 50; 
      const pointsSpent = Object.values(attributes).reduce((a, b) => a + b, 0) - baseStatTotal;
      const pointsAvailable = 10 - pointsSpent;

      if (delta > 0 && pointsAvailable <= 0) return;
      if (delta < 0 && attributes[attr] <= 10) return;
      setAttributes(prev => ({ ...prev, [attr]: prev[attr] + delta }));
  };

  const startGame = () => {
      const newMax = calculateMaxStats(1, attributes.con);
      setStats(prev => ({ ...prev, health: newMax.health }));
      
      const randomQuirk = QUIRKS[Math.floor(Math.random() * QUIRKS.length)];
      setQuirk(randomQuirk);
      
      setGameStarted(true);
      setDailyQuests(generateDailyQuests(1)); 
      
      setTimeout(() => {
          alert(`You were born with a trait: ${randomQuirk.name}\n${randomQuirk.desc}`);
      }, 500);
  };

  const resetGame = () => {
    if (confirm("Reset game?")) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  return {
    gameStarted, setGameStarted,
    creationStep, setCreationStep,
    attributes, updateAttribute,
    stats, setStats,
    resources,
    inventory,
    shopStock,
    equipped, equipItem,
    appearance, updateAppearance,
    days,
    location,
    housing,
    rentActive,
    dailyQuests,
    messages,
    isDead,
    maxStats,
    currentStats,
    dailyLogs, setDailyLogs, 
    quirk,
    performAction,
    revive,
    buyItem,
    sellItem,
    consumeItem,
    startGame,
    resetGame,
    pointsAvailable: 10 - (Object.values(attributes).reduce((a, b) => a + b, 0) - 50)
  };
};
