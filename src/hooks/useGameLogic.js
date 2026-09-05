import { useState, useEffect, useMemo } from 'react';
import { 
  SAVE_KEY, MAX_STAT, ITEM_DB, JOB_DB, ADVENTURE_DB, SOCIAL_DB, MAGIC_DB,
  AUTONOMY_EVENTS, QUIRKS, LOCATIONS, COMPANIONS, CURSES,
  EDGY_FIRST_NAMES, EDGY_LAST_NAMES
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

const getTierPenalty = (tier) => {
    if (tier === 1) return 0;
    if (tier === 2) return 15;
    if (tier === 3) return 30;
    if (tier === 4) return 50;
    if (tier === 5) return 75;
    return 0;
};

const getMaxTier = (lvl) => Math.min(5, Math.ceil(lvl / 2));

export const useGameLogic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [characterName, setCharacterName] = useState({ first: '', last: '' });
  const [edgyName, setEdgyName] = useState(null);
  const [attributes, setAttributes] = useState({ str: 10, dex: 10, con: 10, int: 10, cha: 10 });
  const [quirk, setQuirk] = useState(null); 
  const [activeCompanion, setActiveCompanion] = useState(null);
  const [companionVariant, setCompanionVariant] = useState(null);
  const [activeCurse, setActiveCurse] = useState(null);
  const [curseVariant, setCurseVariant] = useState(null);
  const [curseTracker, setCurseTracker] = useState({ fails: 0, jobs: 0, ales: 0, days: 0 });
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
  const [dailyQuests, setDailyQuests] = useState({ labor: [], adventure: [], social: [], magic: [] });
  const [messages, setMessages] = useState([]);
  const [isDead, setIsDead] = useState(false);
  const [dailyLogs, setDailyLogs] = useState([]); 
  const [gameStats, setGameStats] = useState({ deaths: 0, marriages: 0, dungeonFoodEaten: 0 });

  const [stagedAction, setStagedAction] = useState(null);
  const [rollState, setRollState] = useState({ isRolling: false, result: null, isSuccess: false });
  const [reportData, setReportData] = useState(null);

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
    
    Object.keys(total).forEach(k => {
        if (['str','dex','con','int','cha'].includes(k)) total[k] = Math.min(20, total[k]);
    });
    
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

  const addToLog = (logEntry) => setDailyLogs(prev => [{ ...logEntry, id: Date.now() + Math.random() }, ...prev]);

  const refreshShop = () => {
    const purchasable = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand].filter(i => i.cost > 0);
    const selectedEquipment = rollTieredItems(purchasable, 5);
    
    const consumables = ITEM_DB.supplies.filter(i => i.cost > 0 && i.id !== 'shiny_trash');
    const selectedConsumable = consumables[Math.floor(Math.random() * consumables.length)];
    
    const finalShop = [...selectedEquipment, selectedConsumable];

    setShopStock(finalShop.map(i => {
        let displayName = i.name;
        if (i.merchantNames && i.merchantNames.length > 0) displayName = i.merchantNames[Math.floor(Math.random() * i.merchantNames.length)];
        return { instanceId: `shop_${generateId()}`, itemId: i.id, displayName };
    }));
  };

  const generateDailyQuests = (lvl, comp = activeCompanion, cur = activeCurse) => {
    const currentTier = getMaxTier(lvl);
    
    const getPool = (db, tier) => {
       let pool = [];
       for (let i = 1; i <= tier; i++) { 
           if (db[`tier${i}`]) pool = [...pool, ...db[`tier${i}`].map(q => ({...q, questTier: i}))]; 
       }
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
    if (Math.random() < 0.25 && nextTier <= 5) {
       const cat = Math.random();
       if (cat < 0.25 && JOB_DB[`tier${nextTier}`]) quests.labor.push(...selectRandom(JOB_DB[`tier${nextTier}`].map(q => ({...q, questTier: nextTier})), 1));
       else if (cat < 0.50 && ADVENTURE_DB[`tier${nextTier}`]) quests.adventure.push(...selectRandom(ADVENTURE_DB[`tier${nextTier}`].map(q => ({...q, questTier: nextTier})), 1));
       else if (cat < 0.75 && SOCIAL_DB[`tier${nextTier}`]) quests.social.push(...selectRandom(SOCIAL_DB[`tier${nextTier}`].map(q => ({...q, questTier: nextTier})), 1));
       else if (MAGIC_DB[`tier${nextTier}`]) quests.magic.push(...selectRandom(MAGIC_DB[`tier${nextTier}`].map(q => ({...q, questTier: nextTier})), 1));
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
        setCharacterName(parsed.characterName || { first: '', last: '' });
        setEdgyName(parsed.edgyName || null);
        setAttributes(parsed.attributes || { str: 10, dex: 10, con: 10, int: 10, cha: 10 });
        setStats(parsed.stats || { hunger: 0, thirst: 0, health: 20, mood: 100, stress: 0 });
        setResources(parsed.resources || { gold: 50, xp: 0, level: 1 });
        setAppearance(parsed.appearance || { gender: 'male', skinTone: 'fair', hairColor: 'brown', eyeColor: 'brown', hairStyle: 'short' });
        setLocation(parsed.location || 'village_road');
        setHousing(parsed.housing || 'homeless');
        setRentActive(parsed.rentActive || false);
        setDays(parsed.days || 1);
        setDailyLogs(parsed.dailyLogs || []);
        setQuirk(parsed.quirk || null); 
        setActiveCompanion(parsed.activeCompanion || null);
        setActiveCurse(parsed.activeCurse || null);
        setCurseTracker(parsed.curseTracker || { fails: 0, jobs: 0, ales: 0, days: 0 });
        setShitfacedToday(parsed.shitfacedToday || false);
        setGameStats(parsed.gameStats || { deaths: 0, marriages: 0, dungeonFoodEaten: 0 });
        
        let loadedVariant = parsed.companionVariant || null;
        if (parsed.activeCompanion === 'spouse' && !loadedVariant) loadedVariant = `${Math.random() < 0.5 ? 'male' : 'female'}_${Math.floor(Math.random() * 3) + 1}`;
        setCompanionVariant(loadedVariant);

        let loadedCurseVar = parsed.curseVariant || null;
        if (parsed.activeCurse === 'cult_member' && !loadedCurseVar) loadedCurseVar = Math.floor(Math.random() * 2) + 1;
        setCurseVariant(loadedCurseVar);

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
        if (parsed.dailyQuests) setDailyQuests(parsed.dailyQuests); else setDailyQuests(generateDailyQuests(parsed.resources?.level || 1, parsed.activeCompanion, parsed.activeCurse));
        setGameStarted(true);
      } catch (e) { console.error("Failed to load save", e); refreshShop(); setDailyQuests(generateDailyQuests(1)); }
    } else { refreshShop(); setDailyQuests(generateDailyQuests(1)); setGameStarted(false); }
  }, []);

  useEffect(() => {
      if (!gameStarted) return;
      if (housing === 'inn' && location === 'village_road') setLocation('inn_room');
      if (housing === 'homeless' && location === 'inn_room') setLocation('village_road');
      if (housing === 'estate' && location === 'village_road') setLocation('estate');

      localStorage.setItem(SAVE_KEY, JSON.stringify({
        characterName, edgyName, attributes, stats, resources, equipped, appearance, location, inventory, shopStock, days, housing, rentActive, dailyQuests, dailyLogs, quirk, activeCompanion, companionVariant, activeCurse, curseVariant, curseTracker, shitfacedToday, gameStats, lastSave: Date.now()
      }));
  }, [characterName, edgyName, attributes, stats, resources, equipped, appearance, location, inventory, shopStock, isDead, days, housing, rentActive, gameStarted, dailyQuests, dailyLogs, quirk, activeCompanion, companionVariant, activeCurse, curseVariant, curseTracker, shitfacedToday, gameStats]);

  const calculateOdds = (action) => {
      if (!['labor', 'adventure', 'social', 'magic'].includes(action.type)) return null;
      const { str, dex, con, int, cha, ac } = currentStats;
      const stress = stats.stress;
      const tierPenalty = getTierPenalty(action.questTier || 1);
      
      let baseFail = action.type === 'adventure' ? 60 : 40;
      let attrSum = 0;
      
      if (action.type === 'labor') attrSum = str + con;
      else if (action.type === 'adventure') attrSum = str + dex + ac;
      else if (action.type === 'social') attrSum = cha * 2;
      else if (action.type === 'magic') attrSum = int * 2;

      let stressPen = Math.floor(stress * 0.2);
      let compPen = activeCompanion === 'pet_rock' ? 5 : 0;
      let cursePen = (activeCurse === 'butterfingers' && action.type === 'adventure') ? 10 : 0;

      let rawFailChance = (baseFail + tierPenalty) - attrSum + stressPen + compPen + cursePen;
      let clampedFail = Math.max(5, Math.min(95, rawFailChance));
      
      return {
          baseSuccess: 100 - (baseFail + tierPenalty),
          attrBonus: attrSum,
          stressPenalty: -stressPen,
          miscPenalty: -(compPen + cursePen),
          finalSuccessRate: Math.floor(100 - clampedFail)
      };
  };

  const passTime = (daysPassed, skipDecay = false, startingStats = stats, startingInv = inventory, startingGold = resources.gold) => {
      let rentMsg = "No rent paid (Homeless).";
      let changes = [];
      let newStats = { ...startingStats };
      let newGold = startingGold;
      let currentEdgy = edgyName ? { ...edgyName } : null;
      let currentCurse = activeCurse;
      let currentInventory = [...startingInv];
      let incident = null;
      let incidentMsg = "Nothing purely chaotic happened.";
      
      const drankToday = shitfacedToday;
      setShitfacedToday(false);

      if (currentCurse === 'dungeon_dye_job') {
          let nextDays = (curseTracker.days || 0) + daysPassed;
          if (nextDays >= 5) {
              currentCurse = null; setActiveCurse(null); setCurseVariant(null);
              changes.push("Hair returned to normal"); nextDays = 0;
          }
          setCurseTracker(prev => ({ ...prev, days: nextDays }));
      }

      for (let i = 0; i < daysPassed; i++) {
          if (isDead) break;

          if (currentEdgy && currentEdgy.daysLeft > 0) {
              currentEdgy.daysLeft -= 1;
              if (currentEdgy.daysLeft <= 0) { currentEdgy = null; changes.push("Reverted name"); }
          }

          let currentLocId = 'village_road';
          if (rentActive) {
              if (housing === 'inn') currentLocId = 'inn_room';
              if (housing === 'estate') currentLocId = 'estate';
          }

          if (currentLocId === 'inn_room' && currentCurse === 'blacklist') {
              setHousing('homeless'); setRentActive(false); currentLocId = 'village_road';
              newStats.mood = Math.max(0, newStats.mood - 20);
              rentMsg = "Barkeep spotted you and threw you into the dirt.";
              if (i === 0) changes.push("Evicted (Banned)", "-20 Mood"); 
          }

          if (currentLocId !== 'village_road') {
              if (newGold >= LOCATIONS[currentLocId].dailyCost) {
                  newGold -= LOCATIONS[currentLocId].dailyCost;
                  if (i === 0) rentMsg = `Paid rent: -${LOCATIONS[currentLocId].dailyCost * daysPassed}g.`;
              } else {
                  setHousing('homeless'); setRentActive(false); currentLocId = 'village_road';
                  newStats.mood = Math.max(0, newStats.mood - 20);
                  rentMsg = "Evicted! Slept in the dirt.";
                  if (i === 0) changes.push("Evicted", "-20 Mood"); 
              }
          } else {
              rentMsg = "Slept outside. It was cold.";
          }

          const mod = LOCATIONS[currentLocId].modifiers.rest;
          newStats.health = Math.min(maxStats.health, newStats.health + (mod.health || 0));
          newStats.stress = Math.max(0, newStats.stress + (mod.stress || 0));
          newStats.mood = Math.max(0, Math.min(maxStats.mood, newStats.mood + (mod.mood || 0)));
          
          if (!skipDecay) { 
              newStats.hunger += (mod.hunger || 0); 
              newStats.thirst += (mod.thirst || 0); 
          }

          let survivalChanges = [];
          while ((newStats.hunger >= 100 || newStats.thirst >= 100) && currentInventory.length > 0) {
              const viableIdx = currentInventory.findIndex(invItem => {
                  const dbItem = ITEM_DB.supplies.find(s => s.id === invItem.itemId);
                  if (!dbItem || !dbItem.effects) return false;
                  if (newStats.hunger >= 100 && dbItem.effects.hunger < 0) return true;
                  if (newStats.thirst >= 100 && dbItem.effects.thirst < 0) return true;
                  return false;
              });

              if (viableIdx !== -1) {
                  const consumed = currentInventory.splice(viableIdx, 1)[0];
                  const dbItem = ITEM_DB.supplies.find(s => s.id === consumed.itemId);
                  const fx = dbItem.effects;
                  let hungerRec = fx.hunger || 0;
                  if (activeCompanion === 'mimic' && hungerRec < 0) hungerRec = Math.floor(hungerRec * 0.5);
                  
                  newStats.health = Math.min(maxStats.health, newStats.health + (fx.health || 0));
                  newStats.hunger = Math.max(0, newStats.hunger + hungerRec);
                  newStats.thirst = Math.max(0, newStats.thirst + (fx.thirst || 0));
                  newStats.stress = Math.max(0, newStats.stress + (fx.stress || 0));
                  newStats.mood = Math.min(100, newStats.mood + (fx.mood || 0));
                  survivalChanges.push(`Auto-Consumed ${dbItem.name}`);
              } else { break; }
          }
          if (survivalChanges.length > 0) changes.push(...survivalChanges);

          if (newStats.health <= 0 || newStats.hunger >= 100 || newStats.thirst >= 100) {
              setIsDead(true); addMessage("Your adventurer has perished!", "error");
              changes.push("DIED"); break;
          }
          
          if (currentLocId === 'estate' && currentCurse === 'butterfingers') {
              currentCurse = null; setActiveCurse(null); changes.push("Washed off slime in the bath");
          }

          if (activeCompanion === 'spouse') newStats.stress += 15;
          if (activeCompanion === 'groupie') newStats.mood -= 15;
          if (activeCompanion === 'goblin') {
              const stolen = Math.floor(Math.random() * 4) + 1;
              newGold = Math.max(0, newGold - stolen);
              if (i === 0) changes.push(`Goblin Stole ${stolen}g`);
          }
          if (currentCurse === 'cult_member') {
              newStats.mood += 20; newStats.stress -= 20;
              if (newGold >= 10) newGold -= 10;
              else {
                  currentCurse = null; setActiveCurse(null); setCurseVariant(null);
                  newStats.stress += 30; changes.push("Kicked from Cult");
                  setEquipped(prev => ({ ...prev, body: 'inst_tunic' }));
              }
          }
      }

      setInventory(currentInventory);
      if (isDead) return;

      let zone = 'risk';
      if (newStats.mood > 40 && newStats.stress < 60) zone = 'safe';
      if (newStats.mood < 10 || newStats.stress > 90) zone = 'crisis';
      
      let chance = zone === 'safe' ? 0.05 : zone === 'risk' ? 0.30 : 0.70;
      if (quirk && quirk.id === 'iron_liver' && drankToday) chance += (quirk.effects.badDrinkEventChance || 0.20);

      if (Math.random() <= chance) {
          const pool = zone === 'crisis' ? AUTONOMY_EVENTS.major : AUTONOMY_EVENTS.minor;
          let validEvent = false; let attempts = 0;
          while (!validEvent && attempts < 10) {
              incident = pool[Math.floor(Math.random() * pool.length)];
              if (incident.effects.applyCompanion && activeCompanion) { attempts++; continue; }
              if (incident.effects.applyCurse && currentCurse) { attempts++; continue; }
              if (incident.effects.edgyRebrand && currentEdgy) { attempts++; continue; }
              validEvent = true;
          }
      }

      if (incident) {
          incidentMsg = incident.text; 
          const fx = incident.effects;
          
          if (incident.id === 'weird_shit') setGameStats(p => ({ ...p, dungeonFoodEaten: p.dungeonFoodEaten + 1 }));
          if (incident.id === 'spontaneous_marriage') setGameStats(p => ({ ...p, marriages: p.marriages + 1 }));

          if (fx) {
              if (fx.edgyRebrand) {
                  const first = EDGY_FIRST_NAMES[Math.floor(Math.random() * EDGY_FIRST_NAMES.length)];
                  const last = EDGY_LAST_NAMES[Math.floor(Math.random() * EDGY_LAST_NAMES.length)];
                  currentEdgy = { first, last, daysLeft: 4 };
                  incidentMsg = `"Call me ${first} ${last} from now on. It reflects the darkness in my soul."`;
                  changes.push(`Renamed to ${first} ${last}`);
              }

              if (fx.applyCompanion) {
                  setActiveCompanion(fx.applyCompanion);
                  if (fx.applyCompanion === 'spouse') {
                      const isMale = Math.random() < 0.5; const variantNum = Math.floor(Math.random() * 3) + 1;
                      const pron = isMale ? "his" : "her";
                      incidentMsg = `Went to bed drunk and single, woke up hungover and married. Hasn't stopped nagging me to get a job so I can ask ${pron} name again.`;
                      setCompanionVariant(`${isMale ? 'male' : 'female'}_${variantNum}`);
                  } else if (fx.applyCompanion === 'groupie') {
                      incidentMsg = "Woke up to the sound of a horribly out-of-tune lute. A 'fan' is following me everywhere and won't shut up about how great I am.";
                  } else if (fx.applyCompanion === 'goblin') {
                      incidentMsg = "There is a feral goblin living in my backpack. It hissed at me when I tried to touch my own gold purse.";
                  } else if (fx.applyCompanion === 'mimic') {
                      incidentMsg = "I brought home a stray treasure chest because I thought it was cute. It just ate half my breakfast.";
                  } else if (fx.applyCompanion === 'pet_rock') {
                      incidentMsg = "Found a rock. It has a face. It is my best friend now and I will literally die for Rocky.";
                  }
                  changes.push("Gained Companion");
              }
              if (fx.applyCurse) {
                  currentCurse = fx.applyCurse; setActiveCurse(fx.applyCurse);
                  if (fx.applyCurse === 'blacklist') {
                      incidentMsg = "The barkeep threw me out and permanently banned me. Apparently, tables aren't meant to be body-slammed.";
                      if (housing === 'inn') { setHousing('homeless'); setRentActive(false); changes.push("Evicted from Inn"); }
                  } else if (fx.applyCurse === 'cult_member') {
                      incidentMsg = "Some nice people in robes told me all my problems are my own fault, but they can fix them for 10g a day. I feel so enlightened!";
                      setCurseVariant(Math.floor(Math.random() * 2) + 1);
                  } else if (fx.applyCurse === 'identity_crisis') {
                      incidentMsg = "Hit my head really hard. Everything makes sense now. I've been using the wrong gear this whole time!";
                  } else if (fx.applyCurse === 'pacifism') {
                      incidentMsg = "I had a horrible nightmare where a monster asked me why I killed its father. Violence is never the answer.";
                  } else if (fx.applyCurse === 'butterfingers') {
                      incidentMsg = "Woke up covered in unidentifiable dungeon slime. I can't hold my weapon straight and everything smells like rotting kelp.";
                  } else if (fx.applyCurse === 'dungeon_dye_job') {
                      incidentMsg = "Insulted a spellcaster who practiced some kind of hairomancy on me.";
                      setCurseVariant(Math.floor(Math.random() * 4) + 1);
                  } else if (fx.applyCurse === 'girdle') {
                      incidentMsg = "Put on a shiny belt I found. Suddenly my center of gravity is completely different and I can't take the belt off.";
                  }
                  
                  if (fx.applyCurse === 'cult_member') {
                      setInventory(prev => [...prev, { instanceId: 'inst_cultist_robe', itemId: 'cultist_robe', displayName: 'Cultist Robes' }]);
                      setEquipped(prev => ({ ...prev, body: 'inst_cultist_robe', head: 'inst_none' }));
                  }
                  if (['identity_crisis', 'pacifism', 'dungeon_dye_job'].includes(fx.applyCurse)) setCurseTracker({ fails: 0, jobs: 0, ales: 0, days: 0 });
                  changes.push("Gained Curse");
              }
              
              if (fx.destroyRations) { setInventory(prev => prev.filter(i => ITEM_DB.supplies.find(s => s.id === i.itemId)?.type !== 'food')); changes.push("Lost All Food"); }
              if (fx.health) { newStats.health += fx.health; changes.push(`${fx.health > 0 ? '+' : ''}${Math.abs(fx.health)} Health`); }
              if (fx.mood) { newStats.mood += fx.mood; changes.push(`${fx.mood > 0 ? '+' : ''}${Math.abs(fx.mood)} Mood`); }
              if (fx.stress) { newStats.stress += fx.stress; changes.push(`${fx.stress > 0 ? '+' : ''}${Math.abs(fx.stress)} Stress`); }
              if (fx.hunger) { newStats.hunger += fx.hunger; changes.push(`${fx.hunger > 0 ? '+' : ''}${Math.abs(fx.hunger)} Hunger`); }
              if (fx.thirst) { newStats.thirst += fx.thirst; changes.push(`${fx.thirst > 0 ? '+' : ''}${Math.abs(fx.thirst)} Thirst`); }
              if (fx.gold) { newGold = Math.max(0, newGold + fx.gold); changes.push(`${fx.gold > 0 ? '+' : ''}${Math.abs(fx.gold)} Gold`); }
              
              if (fx.housing === 'homeless' && fx.applyCurse !== 'blacklist') { setHousing('homeless'); setRentActive(false); changes.push("Lost Housing"); }
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

      if (quirk && quirk.id === 'shiny_syndrome' && Math.random() < (quirk.effects.junkChance || 0)) { 
          setInventory(prev => [...prev, { instanceId: `loot_${generateId()}`, itemId: 'shiny_trash', displayName: 'Shiny Trash' }]);
          incidentMsg += " Also... found some shiny trash."; changes.push("+Shiny Trash"); 
      }

      setEdgyName(currentEdgy);
      
      const cappedStats = { 
          health: Math.max(0, Math.min(maxStats.health, newStats.health)), 
          mood: Math.max(0, Math.min(maxStats.mood, newStats.mood)), 
          hunger: Math.min(maxStats.hunger, Math.max(0, newStats.hunger)), 
          thirst: Math.min(maxStats.thirst, Math.max(0, newStats.thirst)), 
          stress: Math.max(0, Math.min(maxStats.stress, newStats.stress)) 
      };
      
      setStats(cappedStats);
      setResources(prev => ({ ...prev, gold: newGold }));

      const nextComp = incident && incident.effects?.applyCompanion ? incident.effects.applyCompanion : activeCompanion;
      const nextCur = incident && incident.effects?.applyCurse ? incident.effects.applyCurse : currentCurse;

      addToLog({ 
          type: 'night', 
          day: days, 
          title: 'The Night Phase',
          sleepLoc: housing === 'inn' ? 'Inn' : housing === 'estate' ? 'Estate' : 'Outside', 
          rent: rentMsg, 
          incidentTitle: incident ? incident.title : "Uneventful Night", 
          incidentText: incidentMsg, 
          changesArr: changes,
          endOfDayStats: { ...cappedStats },
          endOfDayCompanion: nextComp,
          endOfDayCurse: nextCur
      });

      setDays(prev => prev + daysPassed); 
      setReportData(days); 
      refreshShop();
      setDailyQuests(generateDailyQuests(resources.level, nextComp, nextCur));
  };

  const performAction = (action) => {
    if (isDead) return;
    if (quirk && quirk.effects.bannedJobs && quirk.effects.bannedJobs.includes(action.id)) { addMessage("I don't get it. Too complicated.", "error"); return; }
    if (activeCurse === 'pacifism' && action.type === 'adventure') { addMessage("I refuse to hurt them! (Pacifism)", "error"); return; }
    if (activeCurse === 'blacklist' && action.id === 'rent_start') { addMessage("You are permanently banned.", "error"); return; }

    if (action.reqLocation && action.reqLocation !== 'any') {
        const currentLoc = housing === 'inn' ? 'inn_room' : housing === 'estate' ? 'estate' : 'village_road';
        if (action.reqLocation !== currentLoc) { addMessage(`Requires Location: ${LOCATIONS[action.reqLocation]?.name || action.reqLocation}`, "error"); return; }
    }

    if (action.id === 'shitfaced') {
        if (shitfacedToday) { addMessage("You can't drink anymore today!", "error"); return; }
        setShitfacedToday(true);
    }

    if (['labor', 'adventure', 'social', 'magic'].includes(action.type)) {
        setStagedAction(action);
        setRollState({ isRolling: false, result: null, isSuccess: false });
    } else {
        executeAction(action, true);
    }
  };

  const executeRoll = () => {
      setRollState({ isRolling: true, result: null, isSuccess: false });
      const odds = calculateOdds(stagedAction);
      const roll = Math.floor(Math.random() * 100) + 1;
      const isSuccess = roll <= odds.finalSuccessRate;
      
      setTimeout(() => {
          setRollState({ isRolling: false, result: roll, isSuccess });
      }, 1200); 
  };

  const finalizeAction = () => {
      const actionToExecute = stagedAction;
      const success = rollState.isSuccess;
      setStagedAction(null);
      setRollState({ isRolling: false, result: null, isSuccess: false });
      executeAction(actionToExecute, success);
  };

  const executeAction = (action, isSuccess) => {
    let newStats = { ...stats };
    let newInv = [...inventory];
    let newGold = resources.gold;
    let newXp = resources.xp;
    let newLevel = resources.level;
    let changes = [];
    let logText = action.message || "Completed action.";
    let lootText = "";

    if (action.id === 'rent_start') {
        if (newGold >= 5) {
            setHousing('inn'); setRentActive(true); newGold -= 5; addMessage("Rented room at Rusty Spoon.", 'success');
            addToLog({ type: 'housing', day: days, title: 'Housing', text: 'Rented a room at the Rusty Spoon.', status: 'Success', changesArr: ['-5 Gold', '+Warm Bed'] });
        } else { addMessage("Not enough gold to rent room.", 'error'); addToLog({ type: 'housing', day: days, title: 'Housing', text: 'Tried to rent a room but was too poor.', status: 'Failed', changesArr: [] }); }
        setResources(prev => ({ ...prev, gold: newGold }));
        return;
    }
    if (action.id === 'rent_stop') {
        setHousing('homeless'); setRentActive(false); addMessage("Checked out of Inn.", 'info');
        addToLog({ type: 'housing', day: days, title: 'Housing', text: 'Checked out of the inn.', status: 'Success', changesArr: ['-Warm Bed'] });
        return;
    }

    let cost = action.cost;
    if (quirk && quirk.id === 'iron_liver' && action.id === 'shitfaced') cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
    if (cost > 0 && action.costType === 'gp') { newGold -= cost; changes.push(`-${cost} Gold`); }

    if (isSuccess) {
        let moodGain = action.effects?.mood || 0; if (quirk && quirk.id === 'drama_queen' && moodGain > 0) moodGain *= (quirk.effects.moodMultiplier || 1);
        const healthGain = action.effects?.health || 0, hungerGain = action.effects?.hunger || 0, thirstGain = action.effects?.thirst || 0, stressGain = action.effects?.stress || 0;

        newStats.health = Math.max(0, Math.min(maxStats.health, newStats.health + healthGain));
        newStats.mood = Math.max(0, Math.min(maxStats.mood, newStats.mood + moodGain));
        newStats.hunger = Math.max(0, Math.min(maxStats.hunger, newStats.hunger + hungerGain));
        newStats.thirst = Math.max(0, Math.min(maxStats.thirst, newStats.thirst + thirstGain));
        newStats.stress = Math.max(0, Math.min(maxStats.stress, newStats.stress + stressGain));

        if(healthGain !== 0) changes.push(`${healthGain > 0 ? '+' : ''}${healthGain} Health`); if(moodGain !== 0) changes.push(`${moodGain > 0 ? '+' : ''}${moodGain} Mood`); if(hungerGain !== 0) changes.push(`${hungerGain > 0 ? '+' : ''}${hungerGain} Hunger`); if(thirstGain !== 0) changes.push(`${thirstGain > 0 ? '+' : ''}${thirstGain} Thirst`); if(stressGain !== 0) changes.push(`${stressGain > 0 ? '+' : ''}${stressGain} Stress`);

        if (action.id === 'shitfaced' && activeCurse === 'butterfingers') { setActiveCurse(null); changes.push("Slime washed off"); }

        if (action.id.startsWith('remove_')) {
            let nextComp = activeCompanion; let nextCur = activeCurse;
            if (activeCompanion && COMPANIONS[activeCompanion].removal?.id === action.id) { setActiveCompanion(null); setCompanionVariant(null); nextComp = null; changes.push("Removed Companion"); }
            if (activeCurse && CURSES[activeCurse].removal?.id === action.id) {
                 if (activeCurse === 'cult_member') setEquipped(prev => ({ ...prev, body: 'inst_tunic' }));
                 setActiveCurse(null); setCurseVariant(null); nextCur = null; changes.push("Removed Curse");
            }
            logText = action.message; setDailyQuests(generateDailyQuests(newLevel, nextComp, nextCur));
        }

        if (action.effects && action.effects.xp) {
          newXp += action.effects.xp; let goldGain = action.effects.gold || 0;
          if (action.type === 'social' && quirk && quirk.id === 'compulsive_looter' && Math.random() < (quirk.effects.socialGoldChance || 0)) { goldGain += 5; addMessage("Swiped some extra coin!", "success"); lootText += " (Bonus 5g)"; changes.push("+5 Gold (Bonus)"); }
          if(goldGain > 0) { newGold += goldGain; changes.push(`+${goldGain} Gold`); }
          changes.push(`+${action.effects.xp} XP`);
          if (newXp >= newLevel * 100) { newLevel++; addMessage(`Level Up! You are now level ${newLevel}`, "success"); lootText += " LEVEL UP!"; changes.push("LEVEL UP"); }
        }
        
        if (action.type === 'adventure') { 
           const r = Math.random(); let foundItem = null;
           const findableItems = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand].filter(i => i.cost > 0);
           const consumables = ITEM_DB.supplies.filter(i => i.cost > 0 && i.id !== 'shiny_trash');

           if (r < 0.05) foundItem = rollTieredItems(findableItems, 1)[0];
           else if (r < 0.20) foundItem = rollTieredItems(findableItems, 1)[0];
           else if (r < 0.45) foundItem = rollTieredItems(findableItems, 1)[0];
           else if (r < 0.65) foundItem = consumables[Math.floor(Math.random() * consumables.length)];

           if (foundItem) {
             let displayName = foundItem.name;
             if (foundItem.merchantNames) displayName = foundItem.merchantNames[Math.floor(Math.random() * foundItem.merchantNames.length)];
             newInv.push({ instanceId: `loot_${generateId()}`, itemId: foundItem.id, displayName });
             addMessage(`Loot: Found ${displayName}!`, 'success'); lootText += ` Found: ${displayName}`; changes.push(`+${displayName}`); 
           }
        }

        if (activeCurse === 'pacifism' && (action.type === 'labor' || action.type === 'social')) {
             setCurseTracker(prev => { const next = { ...prev, jobs: prev.jobs + 1 }; if (next.jobs >= 2) { setActiveCurse(null); addMessage("Pacifism cured by hard work!", "success"); changes.push("Cured Pacifism"); } return next; });
        }
        addMessage(action.message, "success");
    } else {
        logText = "Failed!"; let stressGain = 0;
        if (action.type === 'labor') { logText = "Screwed up the job. No pay."; stressGain = 10; } 
        else if (action.type === 'magic') { logText = "Spell backfired! You smell like sulfur."; stressGain = 15; }
        else if (action.type === 'adventure') { 
            logText = "Defeated! Retreated with wounds."; 
            newStats.health = Math.max(0, newStats.health - 20);
            newStats.stress = Math.min(100, newStats.stress + 20);
            newStats.hunger = Math.min(100, newStats.hunger + 20);
            newStats.thirst = Math.min(100, newStats.thirst + 20);
            changes.push("-20 Health", "+20 Stress", "+20 Hunger", "+20 Thirst"); 
        } 
        else if (action.type === 'social') { 
            logText = "Made a total fool of yourself."; 
            newStats.mood = Math.max(0, newStats.mood - 20); 
            changes.push("-20 Mood"); 
        }
        
        if (quirk && quirk.id === 'drama_queen') stressGain *= (quirk.effects.stressFailureMultiplier || 1);
        if (stressGain > 0) { newStats.stress = Math.min(100, newStats.stress + stressGain); changes.push(`+${stressGain} Stress`); }
        
        if (activeCurse === 'identity_crisis' && (action.type === 'adventure' || action.type === 'magic')) {
             setCurseTracker(prev => { const next = { ...prev, fails: prev.fails + 1 }; if (next.fails >= 3) { setActiveCurse(null); addMessage("Snapped out of identity crisis!", "success"); changes.push("Cured Identity Crisis"); } return next; });
        }
        addMessage(logText, "error"); 
    }

    addToLog({
        type: 'action',
        day: days,
        title: action.label,
        text: logText + lootText,
        status: isSuccess ? 'Success' : 'Failed',
        changesArr: changes
    });

    if (action.days > 0) {
        setResources(prev => ({ ...prev, xp: newXp, level: newLevel })); 
        passTime(action.days, action.type !== 'maintenance' && action.type !== 'housing', newStats, newInv, newGold);
    } else {
        setStats(newStats);
        setInventory(newInv);
        setResources(prev => ({ ...prev, xp: newXp, level: newLevel, gold: newGold }));
    }
  };

  const revive = () => {
    setGameStats(p => ({ ...p, deaths: p.deaths + 1 }));
    setStats({ health: maxStats.health, mood: maxStats.mood, hunger: 0, thirst: 0, stress: 0 }); setIsDead(false); setResources(prev => ({ ...prev, xp: Math.max(0, prev.xp - 50) })); setHousing('homeless'); setRentActive(false); addMessage("Revived... destitute.", "info");
    addToLog({ type: 'action', day: days, title: 'Revived', text: 'I have returned from the dead. Ouch.', status: 'Revived', changesArr: ['-50 XP', '-Housing', '+Life'] });
  };

  const buyItem = (item) => {
    let cost = item.cost; 
    if (quirk && quirk.id === 'iron_liver' && (item.type === 'drink' || item.id === 'courage' || item.id === 'stout')) cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
    if (resources.gold >= cost) { 
        setResources(prev => ({ ...prev, gold: prev.gold - cost })); 
        setInventory(prev => [...prev, { instanceId: `inv_${generateId()}`, itemId: item.id, displayName: item.displayName }]); 
        addMessage(`Purchased ${item.displayName}`, 'success'); 
        addToLog({ type: 'shop', day: days, title: 'Shop', text: `Bought ${item.displayName}.`, status: 'Success', changesArr: [`-${cost} Gold`, `+${item.displayName}`] }); 
    } else { addMessage("Not enough gold!", 'error'); }
  };

  const sellItem = (item) => {
    if (['food', 'drink', 'potion'].includes(item.type)) { addMessage("Cannot sell consumables back.", "error"); return; }
    let sellValue = Math.floor(item.cost / 2); if (item.id === 'shiny_trash') { sellValue = Math.floor(Math.random() * 4) + 1; }
    
    setResources(prev => ({ ...prev, gold: prev.gold + sellValue })); 
    setInventory(prev => prev.filter(i => i.instanceId !== item.instanceId)); 
    addMessage(`Sold ${item.displayName} for ${sellValue}g`, 'success'); 
    addToLog({ type: 'shop', day: days, title: 'Shop', text: `Sold ${item.displayName}.`, status: 'Success', changesArr: [`+${sellValue} Gold`, `-${item.displayName}`] });
  };

  const equipItem = (item) => {
      if (activeCurse === 'cult_member' && (item.type === 'body' || item.type === 'head')) return;
      setEquipped(prev => ({ ...prev, [item.type]: item.instanceId }));
  };

  const consumeItem = (item) => {
      setInventory(prev => prev.filter(i => i.instanceId !== item.instanceId)); 
      const effects = item.effects || {};
      let hungerRec = effects.hunger || 0; let moodRec = effects.mood || 0; let stressRec = effects.stress || 0;
      
      if (activeCompanion === 'mimic' && hungerRec < 0) hungerRec = Math.floor(hungerRec * 0.5);
      if (effects.random_mood_stress) { if (Math.random() < 0.5) moodRec = effects.random_mood_stress; else stressRec = effects.random_mood_stress; }
      if (activeCurse === 'pacifism' && item.type === 'drink') {
          setCurseTracker(prev => { const next = { ...prev, ales: prev.ales + 1 }; if (next.ales >= 3) { setActiveCurse(null); addMessage("Pacifism cured by alcohol!", "success"); } return next; });
      }

      setStats(prev => ({ health: Math.max(0, Math.min(maxStats.health, prev.health + (effects.health || 0))), mood: Math.max(0, Math.min(maxStats.mood, prev.mood + moodRec)), hunger: Math.max(0, Math.min(maxStats.hunger, prev.hunger + hungerRec)), thirst: Math.max(0, Math.min(maxStats.thirst, prev.thirst + (effects.thirst || 0))), stress: Math.max(0, Math.min(maxStats.stress, prev.stress + stressRec)) }));
      addMessage(`Consumed ${item.displayName}`, 'success'); let changes = [];
      if(effects.health) changes.push(`${effects.health > 0 ? '+' : ''}${effects.health} Health`); if(hungerRec !== 0) changes.push(`${Math.abs(hungerRec)} Hunger`); if(effects.thirst) changes.push(`${Math.abs(effects.thirst)} Thirst`); if(moodRec !== 0) changes.push(`${moodRec > 0 ? '+' : ''}${moodRec} Mood`); if(stressRec !== 0) changes.push(`${stressRec > 0 ? '+' : ''}${stressRec} Stress`);
      changes.push(`-${item.displayName}`); 
      addToLog({ type: 'consumable', day: days, title: 'Inventory', text: `Ate/Drank ${item.displayName}.`, status: 'Success', changesArr: changes });
  };

  const updateAppearance = (key, value) => setAppearance(prev => ({ ...prev, [key]: value }));

  const updateAttribute = (attr, delta) => {
      const pointsSpent = Object.values(attributes).reduce((a, b) => a + b, 0) - 50; 
      const maxPts = 10 + Math.floor(resources.level / 2);
      if ((delta > 0 && pointsSpent >= maxPts) || (delta < 0 && attributes[attr] <= 10)) return;
      if (delta > 0 && attributes[attr] >= 20) return;
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
    gameStarted, setGameStarted, creationStep, setCreationStep, characterName, setCharacterName, edgyName, attributes, updateAttribute, stats, setStats, resources, inventory, shopStock, equipped, equipItem,
    appearance, updateAppearance, days, location, housing, rentActive, dailyQuests, messages, isDead, maxStats, currentStats, dailyLogs, setDailyLogs, quirk,
    activeCompanion, companionVariant, activeCurse, curseVariant, shitfacedToday, performAction, revive, buyItem, sellItem, consumeItem, startGame, resetGame, pointsAvailable,
    stagedAction, setStagedAction, rollState, calculateOdds, executeRoll, finalizeAction, reportData, setReportData, passTime, gameStats
  };
};
