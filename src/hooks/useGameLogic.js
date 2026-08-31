import { useState, useEffect, useMemo } from 'react';
import { 
  SAVE_KEY, MAX_STAT, ITEM_DB, JOB_DB, ADVENTURE_DB, SOCIAL_DB, MAGIC_DB,
  AUTONOMY_EVENTS, QUIRKS, LOCATIONS, COMPANIONS, CURSES
} from '../data/constants';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now();

const rollTieredItems = (pool, count) => {
    const groups = {};
    pool.forEach(item => {
        const base = item.baseType || item.id;
        if (!groups[base]) groups[base] = [];
        groups[base].push(item);
    });
    const baseKeys = Object.keys(groups).sort(() => 0.5 - Math.random()).slice(0, count);
    return baseKeys.map(base => groups[base][Math.floor(Math.random() * groups[base].length)]);
};

export const useGameLogic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [attributes, setAttributes] = useState({ str: 10, dex: 10, con: 10, int: 10, cha: 10 });
  const [quirk, setQuirk] = useState(null); 
  const [activeCompanion, setActiveCompanion] = useState(null);
  const [activeCurse, setActiveCurse] = useState(null);
  const [curseTracker, setCurseTracker] = useState({ fails: 0, jobs: 0, ales: 0 });
  const [shitfacedToday, setShitfacedToday] = useState(false);
  const [stats, setStats] = useState({ hunger: 0, thirst: 0, health: 20, mood: 100, stress: 0 });
  const [resources, setResources] = useState({ gold: 50, xp: 0, level: 1 });
  const [inventory, setInventory] = useState([
    { instanceId: 'inst_none', itemId: 'none', displayName: 'Bare' },
    { instanceId: 'inst_tunic', itemId: 'tunic', displayName: 'Breezy Tunic' },
    { instanceId: 'inst_fist', itemId: 'fist', displayName: 'These Two Hands' }
  ]); 
  const [shopStock, setShopStock] = useState([]); 
  const [equipped, setEquipped] = useState({ head: 'inst_none', body: 'inst_tunic', mainHand: 'inst_fist', offHand: 'inst_none' });
  const [appearance, setAppearance] = useState({ gender: 'male', skinTone: 'fair', hairColor: 'brown', eyeColor: 'brown', hairStyle: 'short' });
  const [days, setDays] = useState(1);
  const [location, setLocation] = useState('village_road'); 
  const [housing, setHousing] = useState('homeless'); 
  const [rentActive, setRentActive] = useState(false); 
  const [maxTier, setMaxTier] = useState(1); 
  const [dailyQuests, setDailyQuests] = useState({ labor: [], adventure: [], social: [], magic: [] });
  const [messages, setMessages] = useState([]);
  const [isDead, setIsDead] = useState(false);
  const [dailyLogs, setDailyLogs] = useState([]); 

  const calculateMaxStats = (level, con) => ({ health: 10 + (level * 10) + (con * 2), mood: MAX_STAT, hunger: MAX_STAT, thirst: MAX_STAT, stress: MAX_STAT });
  const getModifier = (val) => Math.floor((val - 10) / 2);

  const currentStats = useMemo(() => {
    let total = { ...attributes }; 
    let armorBonus = 0;
    Object.keys(equipped).forEach(slot => {
      const instanceId = equipped[slot];
      if (!instanceId) return;
      const invItem = inventory.find(i => i.instanceId === instanceId);
      const itemId = invItem ? invItem.itemId : null;
      if (itemId) {
        const item = ITEM_DB[slot]?.find(i => i.id === itemId);
        if (item && item.stats) {
          Object.entries(item.stats).forEach(([stat, val]) => {
            if (stat === 'ac') armorBonus += val;
            else if (total[stat] !== undefined) total[stat] += val; else total[stat] = val;
          });
        }
      }
    });
    if (quirk && quirk.effects && quirk.effects.stats) {
        Object.entries(quirk.effects.stats).forEach(([stat, val]) => { if (total[stat] !== undefined) total[stat] += val; });
    }
    total.ac = 10 + getModifier(total.dex) + armorBonus;
    return total;
  }, [equipped, attributes, quirk, inventory]);

  const maxStats = useMemo(() => calculateMaxStats(resources.level, attributes.con), [resources.level, attributes.con]);
  const pointsAvailable = 10 + Math.floor(resources.level / 2) - (Object.values(attributes).reduce((a, b) => a + b, 0) - 50);

  const addMessage = (text, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9) + Date.now(); 
    setMessages(prev => [...prev.slice(-4), { id, text, type }]);
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 3000);
  };

  const addToLog = (logEntry) => setDailyLogs(prev => [{ ...logEntry, id: Date.now() }, ...prev]);

  const refreshShop = () => {
    const purchasable = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies].filter(i => i.cost > 0);
    const selected = rollTieredItems(purchasable, 6);
    setShopStock(selected.map(i => {
        let displayName = i.name;
        if (i.merchantNames && i.merchantNames.length > 0) displayName = i.merchantNames[Math.floor(Math.random() * i.merchantNames.length)];
        return { instanceId: `shop_${generateId()}`, itemId: i.id, displayName };
    }));
  };

  const generateDailyQuests = (currentTier, comp = activeCompanion, cur = activeCurse) => {
    const getPool = (db, tier) => {
       let pool = [];
       for (let i = 1; i <= tier; i++) { if (db[`tier${i}`]) pool = [...pool, ...db[`tier${i}`]]; }
       return pool;
    };
    const selectRandom = (pool, count) => {
       if (!pool || pool.length === 0) return [];
       return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    let quests = {
        labor: selectRandom(getPool(JOB_DB, currentTier), 3),
        adventure: selectRandom(getPool(ADVENTURE_DB, currentTier), 3),
        social: selectRandom(getPool(SOCIAL_DB, currentTier), 3),
        magic: selectRandom(getPool(MAGIC_DB, currentTier), 3)
    };

    const nextTier = currentTier + 1;
    if (Math.random() < 0.20 && nextTier <= 3) {
       const cat = Math.random();
       if (cat < 0.25 && JOB_DB[`tier${nextTier}`]) quests.labor.push(...selectRandom(JOB_DB[`tier${nextTier}`], 1));
       else if (cat < 0.50 && ADVENTURE_DB[`tier${nextTier}`]) quests.adventure.push(...selectRandom(ADVENTURE_DB[`tier${nextTier}`], 1));
       else if (cat < 0.75 && SOCIAL_DB[`tier${nextTier}`]) quests.social.push(...selectRandom(SOCIAL_DB[`tier${nextTier}`], 1));
       else if (MAGIC_DB[`tier${nextTier}`]) quests.magic.push(...selectRandom(MAGIC_DB[`tier${nextTier}`], 1));
    }

    if (comp && COMPANIONS[comp]?.removal?.type) quests[COMPANIONS[comp].removal.type].push(COMPANIONS[comp].removal);
    if (cur && CURSES[cur]?.removal?.type) quests[CURSES[cur].removal.type].push(CURSES[cur].removal);

    return quests;
  };

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAttributes(parsed.attributes || { str: 10, dex: 10, con: 10, int: 10, cha: 10 });
        setStats(parsed.stats || { hunger: 0, thirst: 0, health: 20, mood: 100, stress: 0 });
        setResources(parsed.resources || { gold: 50, xp: 0, level: 1 });
        setAppearance(parsed.appearance || { gender: 'male', skinTone: 'fair', hairColor: 'brown', eyeColor: 'brown', hairStyle: 'short' });
        setLocation(parsed.location || 'village_road');
        setHousing(parsed.housing || 'homeless');
        setRentActive(parsed.rentActive || false);
        setDays(parsed.days || 1);
        setMaxTier(parsed.maxTier || 1);
        setDailyLogs(parsed.dailyLogs || []);
        setQuirk(parsed.quirk || null); 
        setActiveCompanion(parsed.activeCompanion || null);
        setActiveCurse(parsed.activeCurse || null);
        setCurseTracker(parsed.curseTracker || { fails: 0, jobs: 0, ales: 0 });
        setShitfacedToday(parsed.shitfacedToday || false);

        let loadedInv = parsed.inventory || [];
        if (loadedInv.length > 0 && typeof loadedInv[0] === 'string') {
            loadedInv = loadedInv.map(id => ({ instanceId: ['none', 'tunic', 'fist'].includes(id) ? `inst_${id}` : `inst_${generateId()}`, itemId: id, displayName: id }));
        }
        if (loadedInv.length === 0) loadedInv = [{ instanceId: 'inst_none', itemId: 'none', displayName: 'Bare' }, { instanceId: 'inst_tunic', itemId: 'tunic', displayName: 'Breezy Tunic' }, { instanceId: 'inst_fist', itemId: 'fist', displayName: 'These Two Hands' }];
        setInventory(loadedInv);

        let loadedEq = parsed.equipped || { head: 'inst_none', body: 'inst_tunic', mainHand: 'inst_fist', offHand: 'inst_none' };
        setEquipped(loadedEq);

        let loadedShop = parsed.shopStock || [];
        setShopStock(loadedShop);

        if (!parsed.shopStock || parsed.shopStock.length === 0) refreshShop();
        if (parsed.dailyQuests) setDailyQuests(parsed.dailyQuests); else setDailyQuests(generateDailyQuests(parsed.maxTier || 1, parsed.activeCompanion, parsed.activeCurse));
        setGameStarted(true);
      } catch (e) { console.error("Failed to load save", e); refreshShop(); setDailyQuests(generateDailyQuests(1)); }
    } else { refreshShop(); setDailyQuests(generateDailyQuests(1)); setGameStarted(false); }
  }, []);

  useEffect(() => {
      if (!gameStarted) return;
      if ((stats.health <= 0 || stats.hunger >= maxStats.hunger || stats.thirst >= maxStats.thirst) && !isDead) {
          setIsDead(true); addMessage("Your adventurer has perished!", "error");
      }
      if (housing === 'inn' && location === 'village_road') setLocation('inn_room');
      if (housing === 'homeless' && location === 'inn_room') setLocation('village_road');
      if (housing === 'estate' && location === 'village_road') setLocation('estate');

      localStorage.setItem(SAVE_KEY, JSON.stringify({
        attributes, stats, resources, equipped, appearance, location, inventory, shopStock, days, housing, rentActive, maxTier, dailyQuests, dailyLogs, quirk, activeCompanion, activeCurse, curseTracker, shitfacedToday, lastSave: Date.now()
      }));
  }, [attributes, stats, resources, equipped, appearance, location, inventory, shopStock, isDead, days, housing, rentActive, gameStarted, maxTier, dailyQuests, dailyLogs, quirk, activeCompanion, activeCurse, curseTracker, shitfacedToday]);

  const passTime = (daysPassed, skipDecay = false) => {
      let rentMsg = "No rent paid (Homeless).";
      let changes = [];
      let newStats = { ...stats };
      let newGold = resources.gold;
      
      setShitfacedToday(false);

      for (let i = 0; i < daysPassed; i++) {
          if (rentActive) {
              const locId = housing === 'inn' ? 'inn_room' : housing === 'estate' ? 'estate' : null;
              if (locId && LOCATIONS[locId]) {
                 if (newGold >= LOCATIONS[locId].dailyCost) {
                      newGold -= LOCATIONS[locId].dailyCost;
                      if (i === 0) rentMsg = `Paid rent: -${LOCATIONS[locId].dailyCost * daysPassed}g.`;
                      const mod = LOCATIONS[locId].modifiers.rest;
                      newStats.health = Math.min(maxStats.health, newStats.health + (mod.health || 0));
                      newStats.stress = Math.max(0, newStats.stress + (mod.stress || 0));
                      newStats.mood = Math.min(maxStats.mood, newStats.mood + (mod.mood || 0));
                      if (!skipDecay && locId === 'inn_room') { newStats.hunger += 5; newStats.thirst += 5; }
                      if (locId === 'estate') { 
                          newStats.hunger = 0; newStats.thirst = 0; 
                          if (activeCurse === 'butterfingers') {
                              setActiveCurse(null);
                              changes.push("Washed off slime in the bath");
                          }
                      }
                 } else {
                      setHousing('homeless'); setRentActive(false);
                      newStats.mood = Math.max(0, newStats.mood - 20);
                      rentMsg = "Evicted! Slept in the dirt.";
                      if (i === 0) changes.push("Evicted", "-20 Mood"); 
                 }
              }
          } else {
              const mod = LOCATIONS.village_road.modifiers.rest;
              newStats.health = Math.min(maxStats.health, newStats.health + (mod.health || 0));
              newStats.stress = Math.max(0, newStats.stress + (mod.stress || 0));
              newStats.mood = Math.max(0, newStats.mood + (mod.mood || 0));
              if (!skipDecay) { newStats.hunger += 15; newStats.thirst += 15; }
              rentMsg = "Slept outside. It was cold.";
          }

          if (activeCompanion === 'spouse') newStats.stress += 15;
          if (activeCompanion === 'groupie') newStats.mood -= 15;
          if (activeCompanion === 'goblin') newGold = Math.max(0, newGold - (Math.floor(Math.random() * 4) + 1));
          if (activeCurse === 'cult_member') {
              newStats.mood += 20; newStats.stress -= 20;
              if (newGold >= 10) newGold -= 10;
              else {
                  setActiveCurse(null); newStats.stress += 30; changes.push("Kicked from Cult");
                  setEquipped(prev => ({ ...prev, body: 'inst_tunic' }));
              }
          }
      }

      setStats({ health: Math.max(0, Math.min(maxStats.health, newStats.health)), mood: Math.max(0, Math.min(maxStats.mood, newStats.mood)), hunger: Math.min(maxStats.hunger, newStats.hunger), thirst: Math.min(maxStats.thirst, newStats.thirst), stress: Math.max(0, Math.min(maxStats.stress, newStats.stress)) });
      setResources(prev => ({ ...prev, gold: newGold }));

      let zone = 'risk';
      if (newStats.mood > 40 && newStats.stress < 60) zone = 'safe';
      if (newStats.mood < 10 || newStats.stress > 90) zone = 'crisis';
      
      let incident = null; let chance = zone === 'safe' ? 0.05 : zone === 'risk' ? 0.30 : 0.70;
      
      if (Math.random() <= chance) {
          const pool = zone === 'crisis' ? AUTONOMY_EVENTS.major : AUTONOMY_EVENTS.minor;
          let validEvent = false; let attempts = 0;
          while (!validEvent && attempts < 10) {
              incident = pool[Math.floor(Math.random() * pool.length)];
              if (incident.effects.applyCompanion && activeCompanion) { attempts++; continue; }
              if (incident.effects.applyCurse && activeCurse) { attempts++; continue; }
              validEvent = true;
          }
      }

      let incidentMsg = "Nothing purely chaotic happened.";
      if (incident) {
          incidentMsg = incident.text; 
          const fx = incident.effects;
          if (fx) {
              if (fx.applyCompanion) setActiveCompanion(fx.applyCompanion);
              if (fx.applyCurse) {
                  setActiveCurse(fx.applyCurse);
                  if (fx.applyCurse === 'cult_member') {
                      setInventory(prev => [...prev, { instanceId: 'inst_cultist_robe', itemId: 'cultist_robe', displayName: 'Cultist Robes' }]);
                      setEquipped(prev => ({ ...prev, body: 'inst_cultist_robe' }));
                  }
                  if (fx.applyCurse === 'identity_crisis' || fx.applyCurse === 'pacifism') setCurseTracker({ fails: 0, jobs: 0, ales: 0 });
              }
              if (fx.destroyRations) setInventory(prev => prev.filter(i => ITEM_DB.supplies.find(s => s.id === i.itemId)?.type !== 'food'));
              if (fx.health) changes.push(`${fx.health > 0 ? '+' : ''}${fx.health} Health`); 
              if (fx.gold) { setResources(prev => ({ ...prev, gold: Math.max(0, prev.gold + fx.gold) })); changes.push(`${fx.gold > 0 ? '+' : ''}${fx.gold} Gold`); }
              if (fx.housing === 'homeless') { setHousing('homeless'); setRentActive(false); changes.push("Lost Housing"); }
              if (fx.confiscateRandom) {
                  const slots = ['head', 'body', 'mainHand', 'offHand'];
                  const randomSlot = slots[Math.floor(Math.random() * slots.length)];
                  const instanceId = equipped[randomSlot];
                  if (instanceId && !['inst_none', 'inst_fist', 'inst_tunic'].includes(instanceId) && instanceId !== 'inst_cultist_robe') {
                      const invItem = inventory.find(i => i.instanceId === instanceId);
                      if (invItem) {
                          setEquipped(prev => ({ ...prev, [randomSlot]: randomSlot === 'mainHand' ? 'inst_fist' : randomSlot === 'body' ? 'inst_tunic' : 'inst_none' }));
                          setInventory(prev => prev.filter(i => i.instanceId !== instanceId));
                          incidentMsg += ` (Lost ${invItem.displayName})`; changes.push(`-${invItem.displayName}`);
                      }
                  }
              }
          }
          addMessage("Something happened last night...", "warning");
      }

      if (quirk && quirk.id === 'shiny_syndrome' && Math.random() < (quirk.effects.junkChance || 0)) { incidentMsg += " Also... found some shiny trash."; changes.push("+Shiny Trash"); }

      addToLog({ type: 'morning', day: days, sleepLoc: housing === 'inn' ? 'Inn' : housing === 'estate' ? 'Estate' : 'Outside', rent: rentMsg, incidentTitle: incident ? incident.title : "Uneventful Night", incidentText: incidentMsg, status: changes.length > 0 ? `Changes: ${changes.join(", ")}` : "No significant changes." });
      setDays(prev => prev + daysPassed); refreshShop();
      const nextComp = incident && incident.effects.applyCompanion ? incident.effects.applyCompanion : activeCompanion;
      const nextCur = incident && incident.effects.applyCurse ? incident.effects.applyCurse : activeCurse;
      const newQuests = generateDailyQuests(maxTier, nextComp, nextCur);
      setDailyQuests(newQuests);
  };

  const performAction = (action) => {
    if (isDead) return;
    if (quirk && quirk.effects.bannedJobs && quirk.effects.bannedJobs.includes(action.id)) { addMessage("I don't get it. Too complicated.", "error"); return; }
    if (activeCurse === 'pacifism' && action.type === 'adventure') { addMessage("I refuse to hurt them! (Pacifism)", "error"); return; }
    if (activeCurse === 'blacklist' && action.id === 'rent_start') { addMessage("You are permanently banned.", "error"); return; }

    if (action.id === 'shitfaced') {
        if (shitfacedToday) { addMessage("You can't drink anymore today!", "error"); return; }
        setShitfacedToday(true);
    }

    let changes = [];

    if (action.id === 'rent_start') {
        if (resources.gold >= 5) {
            setHousing('inn'); setRentActive(true); setResources(prev => ({ ...prev, gold: prev.gold - 5 })); addMessage("Rented room at Rusty Spoon.", 'success');
            addToLog({ type: 'action', day: days, title: 'Housing', text: 'Rented a room at the Rusty Spoon.', status: 'Success', changes: 'Changes: -5 Gold, +Warm Bed' });
        } else { addMessage("Not enough gold to rent room.", 'error'); addToLog({ type: 'action', day: days, title: 'Housing', text: 'Tried to rent a room but was too poor.', status: 'Failed' }); }
        return;
    }
    if (action.id === 'rent_stop') {
        setHousing('homeless'); setRentActive(false); addMessage("Checked out of Inn.", 'info');
        addToLog({ type: 'action', day: days, title: 'Housing', text: 'Checked out of the inn.', status: 'Info', changes: 'Changes: -Warm Bed' });
        return;
    }

    if (action.id === 'eat' || action.id.startsWith('drink_')) {
        const itemType = action.id === 'eat' ? 'food' : 'drink';
        const targetId = action.id === 'eat' ? 'ration' : action.id.replace('drink_', '');
        if (targetId === 'water') {
            if (housing === 'homeless') { addMessage("No clean water here.", "error"); return; }
            setStats(prev => ({ ...prev, thirst: Math.max(0, prev.thirst - 40) })); addMessage("Drank water.", "success"); return;
        }

        const ownedSupplies = inventory.filter(invItem => invItem.itemId === targetId);
        if (ownedSupplies.length > 0) {
            const itemToConsumeInv = ownedSupplies[0];
            const itemToConsumeDb = ITEM_DB.supplies.find(i => i.id === itemToConsumeInv.itemId);
            setInventory(prev => prev.filter(i => i.instanceId !== itemToConsumeInv.instanceId));
            
            let effects = itemToConsumeDb.effects || {};
            let hungerRec = effects.hunger || 0;
            if (activeCompanion === 'mimic' && hungerRec < 0) hungerRec = Math.floor(hungerRec * 0.5);

            setStats(prev => ({ health: Math.max(0, Math.min(maxStats.health, prev.health + (effects.health || 0))), mood: Math.max(0, Math.min(maxStats.mood, prev.mood + (effects.mood || 0))), hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + hungerRec)), thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + (effects.thirst || 0))), stress: Math.max(0, Math.min(maxStats.stress, prev.stress + (effects.stress || 0))) }));
            
            if (activeCurse === 'pacifism' && itemType === 'drink') {
                setCurseTracker(prev => {
                    const next = { ...prev, ales: prev.ales + 1 };
                    if (next.ales >= 3) { setActiveCurse(null); addMessage("Pacifism cured by alcohol!", "success"); }
                    return next;
                });
            }

            addMessage(`Consumed ${itemToConsumeDb.name}`, 'success');
            changes.push(`-${itemToConsumeDb.name}`); addToLog({ type: 'action', day: days, title: 'Consumable', text: `Consumed ${itemToConsumeDb.name}.`, status: 'Success', changes: `Changes: ${changes.join(", ")}` });
            return; 
        }
        addMessage("Don't have any left. Check shop!", 'error'); return; 
    }

    if (action.id.startsWith('remove_')) {
        if (action.cost > 0 && resources.gold < action.cost) { addMessage("Not enough gold!", "error"); return; }
        if (action.cost > 0) setResources(prev => ({ ...prev, gold: prev.gold - action.cost }));
        
        let removed = false;
        if (activeCompanion && COMPANIONS[activeCompanion].removal?.id === action.id) { setActiveCompanion(null); removed = true; }
        if (activeCurse && CURSES[activeCurse].removal?.id === action.id) {
             if (activeCurse === 'cult_member') setEquipped(prev => ({ ...prev, body: 'inst_tunic' }));
             setActiveCurse(null); removed = true;
        }
        if (removed) {
             addMessage(action.message, "success");
             setDailyQuests(generateDailyQuests(maxTier, activeCompanion && COMPANIONS[activeCompanion].removal?.id === action.id ? null : activeCompanion, activeCurse && CURSES[activeCurse].removal?.id === action.id ? null : activeCurse));
        }
        return;
    }

    let cost = action.cost;
    if (quirk && quirk.id === 'iron_liver' && action.id === 'shitfaced') cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
    if (action.costType === 'gp' && resources.gold < cost) { addMessage("Not enough gold!", "error"); return; }

    if (cost > 0 && action.costType === 'gp') { setResources(prev => ({ ...prev, gold: prev.gold - cost })); changes.push(`-${cost} Gold`); }
    if (action.days > 0) passTime(action.days, action.type !== 'maintenance' && action.type !== 'housing');
    
    let isSuccess = true; let failChance = 0;
    const { str, dex, con, int, cha } = currentStats; const ac = currentStats.ac; const stress = stats.stress;
    
    if (action.type === 'labor') failChance = 40 - (str + con) + (stress * 0.2);
    else if (action.type === 'adventure') failChance = 60 - (str + dex + ac) + (stress * 0.2);
    else if (action.type === 'social') failChance = 40 - (cha * 2) + (stress * 0.2);
    else if (action.type === 'magic') failChance = 40 - (int * 2) + (stress * 0.2);

    failChance = failChance / 100;
    if (activeCompanion === 'pet_rock') failChance += 0.05;
    if (activeCurse === 'butterfingers' && action.type === 'adventure') failChance += 0.10;
    
    failChance = Math.max(0.05, Math.min(0.95, failChance));
    if (['labor', 'adventure', 'social', 'magic'].includes(action.type)) { if (Math.random() < failChance) isSuccess = false; }

    const locMod = LOCATIONS[housing === 'inn' ? 'inn_room' : housing === 'estate' ? 'estate' : 'village_road']?.modifiers?.[action.id] || {};
    const getEffect = (stat) => (action.effects[stat] || 0) + (locMod[stat] || 0);

    if (isSuccess) {
        let moodGain = getEffect('mood'); if (quirk && quirk.id === 'drama_queen' && moodGain > 0) moodGain *= (quirk.effects.moodMultiplier || 1);
        const healthGain = getEffect('health'), hungerGain = getEffect('hunger'), thirstGain = getEffect('thirst'), stressGain = getEffect('stress');

        setStats(prev => ({ health: Math.max(0, Math.min(maxStats.health, prev.health + healthGain)), mood: Math.max(0, Math.min(maxStats.mood, prev.mood + moodGain)), hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + hungerGain)), thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + thirstGain)), stress: Math.max(0, Math.min(maxStats.stress, prev.stress + stressGain)) }));
        if(healthGain !== 0) changes.push(`${healthGain > 0 ? '+' : ''}${healthGain} Health`); if(moodGain !== 0) changes.push(`${moodGain > 0 ? '+' : ''}${moodGain} Mood`); if(hungerGain !== 0) changes.push(`${hungerGain > 0 ? '+' : ''}${hungerGain} Hunger`); if(thirstGain !== 0) changes.push(`${thirstGain > 0 ? '+' : ''}${thirstGain} Thirst`); if(stressGain !== 0) changes.push(`${stressGain > 0 ? '+' : ''}${stressGain} Stress`);

        if (action.id === 'shitfaced' && activeCurse === 'butterfingers') {
            setActiveCurse(null);
            changes.push("Slime washed off");
        }

        let logText = action.message || "Completed action."; let lootText = "";
        if (action.effects.xp) {
          const newXp = resources.xp + action.effects.xp; let goldGain = action.effects.gold || 0;
          if (action.type === 'social' && quirk && quirk.id === 'compulsive_looter' && Math.random() < (quirk.effects.socialGoldChance || 0)) { goldGain += 5; addMessage("Swiped some extra coin!", "success"); lootText += " (Bonus 5g)"; changes.push("+5 Gold (Bonus)"); }
          if(goldGain > 0) changes.push(`+${goldGain} Gold`); changes.push(`+${action.effects.xp} XP`);
          setResources(prev => {
            const currentXp = prev.xp + action.effects.xp; let currentGold = prev.gold + goldGain; let currentLevel = prev.level;
            if (currentXp >= prev.level * 100) { currentLevel++; addMessage(`Level Up! You are now level ${currentLevel}`, "success"); }
            return { ...prev, xp: currentXp, gold: currentGold, level: currentLevel };
          });
          if (newXp >= resources.level * 100) { lootText += " LEVEL UP!"; changes.push("LEVEL UP"); }
        }
        
        if (action.type === 'adventure' && Math.random() < 0.15) { 
           const findableItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand].filter(i => i.cost > 0);
           if (findableItems.length > 0) {
             const foundItem = rollTieredItems(findableItems, 1)[0];
             let displayName = foundItem.name;
             if (foundItem.merchantNames) displayName = foundItem.merchantNames[Math.floor(Math.random() * foundItem.merchantNames.length)];
             setInventory(prev => [...prev, { instanceId: `loot_${generateId()}`, itemId: foundItem.id, displayName }]);
             addMessage(`Loot: Found ${displayName}!`, 'success'); lootText += ` Found: ${displayName}`; changes.push(`+${displayName}`); 
           }
        }

        if (activeCurse === 'pacifism' && (action.type === 'labor' || action.type === 'social')) {
             setCurseTracker(prev => { const next = { ...prev, jobs: prev.jobs + 1 }; if (next.jobs >= 2) { setActiveCurse(null); addMessage("Pacifism cured by hard work!", "success"); } return next; });
        }

        addToLog({ type: 'action', day: days, title: action.label, text: logText + lootText, status: 'Success', changes: changes.length > 0 ? `Changes: ${changes.join(", ")}` : "" });
    } else {
        let failMsg = "Failed!"; let stressGain = 0;
        if (action.type === 'labor') { failMsg = "Screwed up the job. No pay."; stressGain = 10; } 
        else if (action.type === 'magic') { failMsg = "Spell backfired! You smell like sulfur."; stressGain = 15; }
        else if (action.type === 'adventure') { failMsg = "Defeated! Retreated with wounds."; setStats(prev => ({ ...prev, health: Math.max(0, prev.health - 20), stress: Math.min(100, prev.stress + 20), hunger: Math.min(100, prev.hunger + 20), thirst: Math.min(100, prev.thirst + 20) })); changes.push("-20 Health", "+20 Stress", "+20 Hunger", "+20 Thirst"); } 
        else if (action.type === 'social') { failMsg = "Made a total fool of yourself."; setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20) })); changes.push("-20 Mood"); }
        if (quirk && quirk.id === 'drama_queen') stressGain *= (quirk.effects.stressFailureMultiplier || 1);
        if (stressGain > 0) { setStats(prev => ({ ...prev, stress: Math.min(100, prev.stress + stressGain) })); changes.push(`+${stressGain} Stress`); }
        
        if (activeCurse === 'identity_crisis' && (action.type === 'adventure' || action.type === 'magic')) {
             setCurseTracker(prev => { const next = { ...prev, fails: prev.fails + 1 }; if (next.fails >= 3) { setActiveCurse(null); addMessage("Snapped out of identity crisis!", "success"); } return next; });
        }

        addMessage(failMsg, "error"); addToLog({ type: 'action', day: days, title: action.label, text: failMsg, status: 'Failed', changes: changes.length > 0 ? `Changes: ${changes.join(", ")}` : "" });
    }
    if (action.days > 0) refreshShop(); addMessage(action.message, "success");
  };

  const revive = () => {
    setStats({ health: maxStats.health, mood: maxStats.mood, hunger: 0, thirst: 0, stress: 0 }); setIsDead(false); setResources(prev => ({ ...prev, xp: Math.max(0, prev.xp - 50) })); setHousing('homeless'); setRentActive(false); addMessage("Revived... destitute.", "info");
    addToLog({ type: 'action', day: days, title: 'Revived', text: 'I have returned from the dead. Ouch.', status: 'Revived', changes: 'Changes: -50 XP, -Housing, +Life' });
  };

  const buyItem = (item) => {
    let cost = item.cost; 
    if (quirk && quirk.id === 'iron_liver' && (item.type === 'drink' || item.id === 'ale' || item.id === 'wine')) cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
    if (resources.gold >= cost) { 
        setResources(prev => ({ ...prev, gold: prev.gold - cost })); 
        setInventory(prev => [...prev, { instanceId: `inv_${generateId()}`, itemId: item.id, displayName: item.displayName }]); 
        addMessage(`Purchased ${item.displayName}`, 'success'); 
        addToLog({ type: 'action', day: days, title: 'Shop', text: `Bought ${item.displayName}.`, status: 'Success', changes: `Changes: -${cost} Gold, +${item.displayName}` }); 
    } else { 
        addMessage("Not enough gold!", 'error'); 
    }
  };

  const sellItem = (item) => {
    const sellValue = Math.floor(item.cost / 2); 
    setResources(prev => ({ ...prev, gold: prev.gold + sellValue })); 
    setInventory(prev => prev.filter(i => i.instanceId !== item.instanceId)); 
    addMessage(`Sold ${item.displayName} for ${sellValue}g`, 'success'); 
    addToLog({ type: 'action', day: days, title: 'Shop', text: `Sold ${item.displayName}.`, status: 'Success', changes: `Changes: +${sellValue} Gold, -${item.displayName}` });
  };

  const equipItem = (item) => {
      if (activeCurse === 'cult_member' && item.type === 'body') return;
      setEquipped(prev => ({ ...prev, [item.type]: item.instanceId }));
  };

  const consumeItem = (item) => {
      setInventory(prev => prev.filter(i => i.instanceId !== item.instanceId)); 
      const effects = item.effects || {};
      let hungerRec = effects.hunger || 0;
      if (activeCompanion === 'mimic' && hungerRec < 0) hungerRec = Math.floor(hungerRec * 0.5);

      setStats(prev => ({ health: Math.max(0, Math.min(maxStats.health, prev.health + (effects.health || 0))), mood: Math.max(0, Math.min(maxStats.mood, prev.mood + (effects.mood || 0))), hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + hungerRec)), thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + (effects.thirst || 0))), stress: Math.max(0, Math.min(maxStats.stress, prev.stress + (effects.stress || 0))) }));
      addMessage(`Consumed ${item.displayName}`, 'success'); let changes = [];
      if(effects.health) changes.push(`${effects.health > 0 ? '+' : ''}${effects.health} Health`); if(effects.hunger) changes.push(`${effects.hunger > 0 ? '+' : ''}${effects.hunger} Hunger`); if(effects.thirst) changes.push(`${effects.thirst > 0 ? '+' : ''}${effects.thirst} Thirst`); if(effects.mood) changes.push(`${effects.mood > 0 ? '+' : ''}${effects.mood} Mood`); if(effects.stress) changes.push(`${effects.stress > 0 ? '+' : ''}${effects.stress} Stress`);
      changes.push(`-${item.displayName}`); addToLog({ type: 'action', day: days, title: 'Inventory', text: `Ate/Drank ${item.displayName}.`, status: 'Success', changes: `Changes: ${changes.join(", ")}` });
  };

  const updateAppearance = (key, value) => {
      setAppearance(prev => ({ ...prev, [key]: value }));
  };

  const updateAttribute = (attr, delta) => {
      const pointsSpent = Object.values(attributes).reduce((a, b) => a + b, 0) - 50; 
      const maxPts = 10 + Math.floor(resources.level / 2);
      if ((delta > 0 && pointsSpent >= maxPts) || (delta < 0 && attributes[attr] <= 10)) return;
      setAttributes(prev => ({ ...prev, [attr]: prev[attr] + delta }));
  };

  const startGame = () => {
      const newMax = calculateMaxStats(1, attributes.con); setStats(prev => ({ ...prev, health: newMax.health }));
      const randomQuirk = QUIRKS[Math.floor(Math.random() * QUIRKS.length)]; setQuirk(randomQuirk);
      setGameStarted(true); setDailyQuests(generateDailyQuests(1)); 
      setTimeout(() => { alert(`You were born with a trait: ${randomQuirk.name}\n${randomQuirk.desc}`); }, 500);
  };

  const resetGame = () => { if (confirm("Reset game?")) { localStorage.removeItem(SAVE_KEY); window.location.reload(); } };

  return {
    gameStarted, setGameStarted, creationStep, setCreationStep, attributes, updateAttribute, stats, setStats, resources, inventory, shopStock, equipped, equipItem,
    appearance, updateAppearance, days, location, housing, rentActive, dailyQuests, messages, isDead, maxStats, currentStats, dailyLogs, setDailyLogs, quirk,
    activeCompanion, activeCurse, shitfacedToday, performAction, revive, buyItem, sellItem, consumeItem, startGame, resetGame, pointsAvailable
  };
};
