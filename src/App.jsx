import React, { useState, useEffect, useRef } from 'react';
import { Clock, HelpCircle, Minus, Plus, Sun, X, Shield, Hammer, Scroll, Zap, Heart, User, Coins, DollarSign, Activity, Tent, Droplets, Beer, Skull, Utensils, Backpack, Store, List } from 'lucide-react';
import { ITEM_DB, MAINTENANCE_ACTIONS, LOCATIONS, APPEARANCE_OPTIONS } from './data/constants';
import { useGameLogic } from './hooks/useGameLogic';

const IconMap = { Clock, HelpCircle, Minus, Plus, Sun, X, Shield, Hammer, Scroll, Zap, Heart, User, Coins, DollarSign, Activity, Tent, Droplets, Beer, Skull, Utensils, Backpack, Store, List };

const renderEffectsList = (effects) => {
    if (!effects) return null;
    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(effects).map(([key, val]) => {
                if (val === 0) return null;
                let isGood = ['health', 'mood', 'xp', 'gold', 'ac', 'str', 'dex', 'con', 'int', 'cha'].includes(key) ? val > 0 : val < 0;
                let label = key.charAt(0).toUpperCase() + key.slice(1);
                if (key === 'xp') label = 'XP'; if (key === 'ac') label = 'AC'; if (['str', 'dex', 'con', 'int', 'cha'].includes(key)) label = key.toUpperCase();
                return (
                    <span key={key} className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isGood ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                        {label} {val > 0 ? '+' : ''}{val}
                    </span>
                );
            })}
        </div>
    );
};

const StatBlock = ({ label, value, max, alert, inverted, onClick, subValue }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-[42px] h-[42px] md:w-[60px] md:h-[60px] bg-zinc-900/90 rounded-xl md:rounded-2xl border backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 ${alert ? 'border-red-500/50 bg-red-950/80' : inverted ? 'border-amber-500/50 bg-amber-950/80' : 'border-zinc-700/80 hover:border-zinc-500'}`}>
        <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${alert ? 'text-red-400' : inverted ? 'text-amber-500' : 'text-zinc-400'}`}>{label}</span>
        <span className={`text-xs md:text-base font-bold font-mono ${alert ? 'text-red-400' : inverted ? 'text-amber-300' : 'text-zinc-200'}`}>{Math.floor(value)}{max !== undefined && <span className="text-[8px] md:text-[10px] text-zinc-500">/{max}</span>}</span>
        {subValue !== undefined && <span className="text-[8px] md:text-[9px] text-indigo-400 font-mono">+{subValue}</span>}
    </button>
);

const AttributeBlock = ({ label, value, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-[42px] h-[42px] md:w-[60px] md:h-[60px] bg-zinc-900/90 rounded-xl md:rounded-2xl border border-indigo-900/50 hover:border-indigo-500 shadow-sm transition-all hover:scale-105 active:scale-95">
        <span className="text-[8px] md:text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs md:text-base font-bold font-mono text-indigo-100">{value}</span>
    </button>
);

const ActionButton = ({ icon: IconName, label, days, cost, costType = 'gp', onClick, disabled, description, effects }) => {
  const Icon = IconMap[IconName] || HelpCircle;
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center gap-3 p-3 w-full rounded-lg border text-left transition-all relative overflow-hidden group ${disabled ? 'bg-zinc-900/80 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-70' : 'bg-zinc-800/90 border-zinc-600 text-zinc-200 hover:bg-indigo-950/50 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
      <div className={`p-2 rounded-md ${disabled ? 'bg-zinc-800' : 'bg-zinc-950 group-hover:text-indigo-400'}`}><Icon size={18} /></div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5"><span className="font-bold text-xs truncate">{label}</span>{days > 0 && <span className="text-[9px] text-zinc-400 flex items-center gap-0.5"><Clock size={10}/> {days}d</span>}</div>
        <span className="text-[10px] text-zinc-500 truncate leading-tight">{description}</span>{effects && renderEffectsList(effects)}
      </div>
      {cost > 0 && <div className={`text-[10px] font-mono px-2 py-1 rounded ml-2 ${disabled ? 'bg-zinc-800' : 'bg-black/60'} ${costType === 'gp' ? 'text-amber-500' : 'text-cyan-500'}`}>-{cost}{costType}</div>}
    </button>
  );
};

const renderItemStats = (item) => renderEffectsList(item.stats || item.effects);

const ResponsiveBackground = ({ locationId }) => {
    const baseUrl = import.meta.env.BASE_URL;
    let bgImage = `${baseUrl}bg_village.png`;
    
    if (locationId === 'inn_room') bgImage = `${baseUrl}bg_inn.png`;
    else if (locationId === 'estate') bgImage = `${baseUrl}bg_estate.png`;

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#09090b]">
            <div 
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `url('${bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated'
                }}
            />
            <div className="absolute inset-0 bg-zinc-950/20" />
        </div>
    );
};

const CharacterCanvas = ({ equipped, appearance, isAlive }) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL; 
    
    const sources = {
      base_male_pale: `${baseUrl}base_male_pale.png`,
      base_male_fair: `${baseUrl}base_male_fair.png`,
      base_male_tan: `${baseUrl}base_male_tan.png`,
      base_male_dark: `${baseUrl}base_male_dark.png`,
      base_male_deep: `${baseUrl}base_male_deep.png`,
      base_female_pale: `${baseUrl}base_female_pale.png`,
      base_female_fair: `${baseUrl}base_female_fair.png`,
      base_female_tan: `${baseUrl}base_female_tan.png`,
      base_female_dark: `${baseUrl}base_female_dark.png`,
      base_female_deep: `${baseUrl}base_female_deep.png`,
      eyes_male_blue: `${baseUrl}eyes_male_blue.png`,
      eyes_male_brown: `${baseUrl}eyes_male_brown.png`,
      eyes_male_green: `${baseUrl}eyes_male_green.png`,
      eyes_male_hazel: `${baseUrl}eyes_male_hazel.png`,
      eyes_male_red: `${baseUrl}eyes_male_red.png`,
      eyes_female_blue: `${baseUrl}eyes_female_blue.png`,
      eyes_female_brown: `${baseUrl}eyes_female_brown.png`,
      eyes_female_green: `${baseUrl}eyes_female_green.png`,
      eyes_female_hazel: `${baseUrl}eyes_female_hazel.png`,
      eyes_female_red: `${baseUrl}eyes_female_red.png`,
      hair_long_male_black: `${baseUrl}hair_long_black.png`,
      hair_long_male_blonde: `${baseUrl}hair_long_blonde.png`,
      hair_long_male_brown: `${baseUrl}hair_long_brown.png`,
      hair_long_male_grey: `${baseUrl}hair_long_grey.png`,
      hair_long_male_red: `${baseUrl}hair_long_red.png`,
      hair_long_male_white: `${baseUrl}hair_long_white.png`,
      hair_short_male_black: `${baseUrl}hair_short_black.png`,
      hair_short_male_blonde: `${baseUrl}hair_short_blonde.png`,
      hair_short_male_brown: `${baseUrl}hair_short_brown.png`,
      hair_short_male_grey: `${baseUrl}hair_short_grey.png`,
      hair_short_male_red: `${baseUrl}hair_short_red.png`,
      hair_short_male_white: `${baseUrl}hair_short_white.png`,
      hair_long_female_black: `${baseUrl}hair_long_female_black.png`,
      hair_long_female_blonde: `${baseUrl}hair_long_female_blonde.png`,
      hair_long_female_brown: `${baseUrl}hair_long_female_brown.png`,
      hair_long_female_grey: `${baseUrl}hair_long_female_grey.png`,
      hair_long_female_red: `${baseUrl}hair_long_female_red.png`,
      hair_long_female_white: `${baseUrl}hair_long_female_white.png`,
      hair_short_female_black: `${baseUrl}hair_short_female_black.png`,
      hair_short_female_blonde: `${baseUrl}hair_short_female_blonde.png`,
      hair_short_female_brown: `${baseUrl}hair_short_female_brown.png`,
      hair_short_female_grey: `${baseUrl}hair_short_female_grey.png`,
      hair_short_female_red: `${baseUrl}hair_short_female_red.png`,
      hair_short_female_white: `${baseUrl}hair_short_female_white.png`,
      armor_leather_armor_male: `${baseUrl}armor_leather_male.png`,
      armor_leather_armor_female: `${baseUrl}armor_leather_female.png`,
      armor_chainmail_male: `${baseUrl}armor_chain_male.png`,
      armor_chainmail_female: `${baseUrl}armor_chain_female.png`,
      armor_plate_male: `${baseUrl}armor_plate_male.png`,
      armor_plate_female: `${baseUrl}armor_plate_female.png`,
      robe_blue_male: `${baseUrl}robe_blue_male.png`,
      robe_blue_female: `${baseUrl}robe_blue_female.png`,
      robe_red_male: `${baseUrl}robe_red_male.png`,
      robe_red_female: `${baseUrl}robe_red_female.png`,
      robe_green_male: `${baseUrl}robe_green_male.png`,
      robe_green_female: `${baseUrl}robe_green_female.png`,
      robe_yellow_male: `${baseUrl}robe_yellow_male.png`,
      robe_yellow_female: `${baseUrl}robe_yellow_female.png`,
      robe_black_male: `${baseUrl}robe_black_male.png`,
      robe_black_female: `${baseUrl}robe_black_female.png`,
      hat_male_yellow: `${baseUrl}hat_male_yellow.png`,
      hat_female_yellow: `${baseUrl}hat_female_yellow.png`,
      iron_helm_male: `${baseUrl}iron_helm_male.png`,
      iron_helm_female: `${baseUrl}iron_helm_female.png`,
      leather_cap_male: `${baseUrl}leather_cap_male.png`,
      leather_cap_female: `${baseUrl}leather_cap_female.png`,
      belt_hip_base: `${baseUrl}belt_hip.png`,
      belt_back_base: `${baseUrl}belt_back.png`,
      belt_hip_chain_mail: `${baseUrl}belt_hip_chain_mail.png`,
      belt_back_chain_mail: `${baseUrl}belt_back_chain_mail.png`,
      belt_hip_leather: `${baseUrl}belt_hip_leather.png`,
      belt_back_leather: `${baseUrl}belt_back_leather.png`,
      belt_hip_plate: `${baseUrl}belt_hip_plate.png`,
      belt_back_plate: `${baseUrl}belt_back_plate.png`,
      belt_hip_robe1: `${baseUrl}belt_hip_robe1.png`,
      belt_back_robe1: `${baseUrl}belt_back_robe1.png`,
      belt_hip_robe2: `${baseUrl}belt_hip_robe2.png`,
      belt_back_robe2: `${baseUrl}belt_back_robe2.png`,

      // Weapons & Shields
      weapon_dagger: `${baseUrl}weapon_dagger.png`,
      weapon_sword: `${baseUrl}weapon_sword.png`,
      weapon_hammer: `${baseUrl}weapon_warhammer.png`,
      weapon_axe: `${baseUrl}weapon_battleaxe.png`,
      weapon_staff: `${baseUrl}weapon_staff.png`,
      shield_wooden: `${baseUrl}offhand_shield.png`,
      shield_tower: `${baseUrl}offhand_tower_shield.png`,
      offhand_book: `${baseUrl}offhand_book.png`
    };

    let loadedCount = 0;
    const totalImages = Object.keys(sources).length;

    Object.entries(sources).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesRef.current[key] = img;
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isAlive) ctx.filter = 'grayscale(100%) opacity(50%)';
      else ctx.filter = 'none';

      const hipWeapons = ['dagger', 'book'];
      const backWeapons = ['sword', 'hammer', 'axe', 'staff'];
      
      const hasHipItem = hipWeapons.includes(equipped.mainHand) || hipWeapons.includes(equipped.offHand);
      const hasBackItem = backWeapons.includes(equipped.mainHand) || backWeapons.includes(equipped.offHand);

      let beltSuffix = 'base';
      if (equipped.body === 'leather_armor') beltSuffix = 'leather';
      else if (equipped.body === 'chainmail') beltSuffix = 'chain_mail';
      else if (equipped.body === 'plate') beltSuffix = 'plate';
      else if (equipped.body && equipped.body.startsWith('robe')) beltSuffix = 'robe1';

      let armorBaseStr = 'base';
      if (equipped.body === 'leather_armor') armorBaseStr = 'armor_leather';
      else if (equipped.body === 'chainmail') armorBaseStr = 'armor_chain';
      else if (equipped.body === 'plate') armorBaseStr = 'armor_plate';
      else if (equipped.body && equipped.body.startsWith('robe')) {
          const color = equipped.body.includes('_') ? equipped.body.split('_')[1] : 'blue';
          armorBaseStr = `robe_${color}`;
      }

      const drawLayer = (key) => {
          const img = imagesRef.current[key];
          if (img) {
              const scale = canvas.height / img.height;
              const drawWidth = img.width * scale;
              const drawX = (canvas.width - drawWidth) / 2;
              ctx.drawImage(img, drawX, 0, drawWidth, canvas.height);
          }
      };

      // 0. Draw Back Weapons (Behind body)
      if (backWeapons.includes(equipped.mainHand)) drawLayer(`weapon_${equipped.mainHand}`);
      if (backWeapons.includes(equipped.offHand)) drawLayer(`weapon_${equipped.offHand}`);

      // 1. Draw Base Body Layer
      const baseKey = `base_${appearance.gender}_${appearance.skinTone}`;
      if (imagesRef.current[baseKey]) drawLayer(baseKey);
      else drawLayer(appearance.gender === 'female' ? 'base_female_pale' : 'base_male_pale');

      // 2. Draw Eye Layer
      drawLayer(`eyes_${appearance.gender}_${appearance.eyeColor}`);

      // 3. Draw Equipment Layers (Armor/Robes)
      if (equipped.body && equipped.body !== 'tunic' && equipped.body !== 'none') {
          let armorKey = `armor_${equipped.body}_${appearance.gender}`;
          if (equipped.body.startsWith('robe')) armorKey = `${armorBaseStr}_${appearance.gender}`;
          drawLayer(armorKey);
      }

      // 4. Draw Hair Layer
      const wearingFullHelm = equipped.head === 'iron_helm';
      if (appearance.hairStyle !== 'bald' && !wearingFullHelm) {
          drawLayer(`hair_${appearance.hairStyle}_${appearance.gender}_${appearance.hairColor}`);
      }

      // 5. Draw Belts
      if (hasBackItem) {
          drawLayer(`belt_back_${beltSuffix}`);
      }
      if (hasHipItem) {
          drawLayer(`belt_hip_${beltSuffix}`);
      }

      // 6. Draw Hip Weapons
      if (hipWeapons.includes(equipped.mainHand) && equipped.mainHand !== 'book') {
          drawLayer(`weapon_${equipped.mainHand}`);
      }
      if (hipWeapons.includes(equipped.offHand) && equipped.offHand !== 'book') {
          drawLayer(`weapon_${equipped.offHand}`);
      }

      // 7. Draw Left Arm Shield/Book Layer
      if (equipped.offHand && equipped.offHand !== 'none') {
          if (equipped.offHand.includes('shield')) {
              drawLayer(`shield_${equipped.offHand.split('_')[0]}`);
          } else if (equipped.offHand === 'book') {
              drawLayer('offhand_book');
          }
      }

      // 8. Draw Headgear Layer
      if (equipped.head && equipped.head !== 'none') {
          if (equipped.head === 'wizard_hat') drawLayer(`hat_${appearance.gender}_yellow`);
          else drawLayer(`${equipped.head}_${appearance.gender}`);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [equipped, appearance, isAlive, imagesLoaded]);

  return (
    <canvas 
        ref={canvasRef} 
        width={400} 
        height={600} 
        className="w-full h-full object-contain" 
        style={{ filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.8))' }} 
    />
  );
};

const MorningReport = ({ log, onClose }) => {
  if (!log) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-amber-900/40 to-zinc-900 p-6 border-b border-zinc-800 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-full text-amber-400 border border-amber-500/30"><Sun size={28} /></div>
            <div><h2 className="text-xl font-bold text-white tracking-wide">Day {log.day}</h2><div className="text-xs text-amber-200/60 font-mono uppercase tracking-widest">Morning Report</div></div>
        </div>
        <div className="p-6 space-y-6">
            <div className="relative">
                <div className="absolute -left-2 -top-2 text-4xl text-zinc-700 font-serif">“</div>
                <p className="text-lg text-zinc-200 italic font-serif leading-relaxed px-4">{log.incidentText}</p>
                <div className="absolute -right-2 -bottom-4 text-4xl text-zinc-700 font-serif">”</div>
            </div>
            <div className="h-px bg-zinc-800 w-full" />
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Last Night's Sleep</span>
                    <span className="text-sm text-zinc-300 font-medium flex items-center gap-2">{log.sleepLoc}</span>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Expenses</span>
                    <span className="text-sm text-amber-400 font-medium">{log.rent.includes('Paid') ? log.rent.split(':')[1] : '0g'}</span>
                </div>
            </div>
            <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20 text-center">
                <span className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">Current Mood</span>
                <span className="text-xs text-indigo-200">{log.status}</span>
            </div>
        </div>
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/30 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">Start Day</button>
        </div>
      </div>
    </div>
  );
};

const CreationScreen = ({ creationStep, setCreationStep, appearance, updateAppearance, equipped, attributes, updateAttribute, pointsAvailable, getStatInfo, startGame }) => {
  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden h-[85vh]">
            <div className="w-full md:w-1/3 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 relative">
                <h2 className="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-widest drop-shadow-md">New Adventurer</h2>
                <div className="w-48 h-72"><CharacterCanvas equipped={equipped} appearance={appearance} isAlive={true} /></div>
            </div>
            <div className="flex-1 p-6 flex flex-col bg-zinc-900/50">
                <div className="flex gap-4 mb-6 border-b border-zinc-800">
                    <button onClick={() => setCreationStep(1)} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${creationStep === 1 ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}>1. Appearance</button>
                    <button onClick={() => setCreationStep(2)} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${creationStep === 2 ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}>2. Attributes</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {creationStep === 1 && (
                        <>
                            <div><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Gender</h3>
                                <div className="flex gap-2">{['male', 'female'].map(g => (<button key={g} onClick={() => updateAppearance('gender', g)} className={`flex-1 py-2.5 rounded-lg border text-xs font-bold uppercase transition-all ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>{g}</button>))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Skin Tone</h3>
                                <div className="flex gap-3">{APPEARANCE_OPTIONS.skinTones.map(t => (<button key={t.id} onClick={() => updateAppearance('skinTone', t.id)} className={`w-8 h-8 rounded-full border-2 transition-transform ${appearance.skinTone === t.id ? 'border-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'border-zinc-700 hover:scale-110'}`} style={{ backgroundColor: t.color }} />))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Eye Color</h3>
                                <div className="flex gap-3 flex-wrap">{APPEARANCE_OPTIONS.eyeColors.map(c => (<button key={c.id} onClick={() => updateAppearance('eyeColor', c.id)} className={`w-6 h-6 rounded-full border-2 transition-transform ${appearance.eyeColor === c.id ? 'border-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'border-zinc-700 hover:scale-110'}`} style={{ backgroundColor: c.color }} />))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Hair Style</h3>
                                <div className="grid grid-cols-3 gap-2">{APPEARANCE_OPTIONS.hairStyles.map(s => (<button key={s.id} onClick={() => updateAppearance('hairStyle', s.id)} className={`py-2 rounded-lg border text-xs font-bold transition-all ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>{s.label}</button>))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Hair Color</h3>
                                <div className="flex gap-3 flex-wrap">{APPEARANCE_OPTIONS.hairColors.map(c => (<button key={c.id} onClick={() => updateAppearance('hairColor', c.id)} className={`w-7 h-7 rounded border-2 transition-transform ${appearance.hairColor === c.id ? 'border-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'border-zinc-700 hover:scale-110'}`} style={{ backgroundColor: c.color }} />))}</div>
                            </div>
                        </>
                    )}
                    {creationStep === 2 && (
                        <>
                            <div className="flex justify-between items-center bg-zinc-800/80 border border-zinc-700 p-4 rounded-xl mb-4 shadow-inner">
                                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Points Available</span>
                                <span className={`text-2xl font-mono font-bold ${pointsAvailable > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-zinc-500'}`}>{pointsAvailable}</span>
                            </div>
                            {Object.keys(attributes).map(attr => (
                                <div key={attr} className="flex items-center justify-between p-3 bg-zinc-800/40 rounded-lg border border-zinc-700/50 hover:bg-zinc-800/60 transition-colors">
                                    <div className="flex flex-col"><span className="text-sm font-bold text-indigo-200 uppercase tracking-wider">{attr}</span><span className="text-[10px] text-zinc-400">{getStatInfo(attr).desc}</span></div>
                                    <div className="flex items-center gap-3 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                                        <button onClick={() => updateAttribute(attr, -1)} className="p-1.5 bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-300 transition-colors"><Minus size={14} /></button>
                                        <span className="w-6 text-center font-mono font-bold text-white text-lg">{attributes[attr]}</span>
                                        <button onClick={() => updateAttribute(attr, 1)} className="p-1.5 bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-300 transition-colors" disabled={pointsAvailable <= 0}><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
                    {creationStep === 1 ? ( <button onClick={() => setCreationStep(2)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">Next: Attributes</button> ) : ( <button onClick={startGame} disabled={pointsAvailable > 0} className={`px-8 py-3 font-bold tracking-wider uppercase text-sm rounded-xl transition-all ${pointsAvailable > 0 ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_20px_rgba(52,211,153,0.5)]'}`}>Start Adventure</button> )}
                </div>
            </div>
        </div>
    </div>
  );
};

const App = () => {
  const {
    gameStarted, setGameStarted, creationStep, setCreationStep, attributes, updateAttribute,
    stats, setStats, resources, inventory, shopStock, equipped, equipItem,
    appearance, updateAppearance, days, location, housing, rentActive, dailyQuests, messages,
    isDead, maxStats, currentStats, dailyLogs, setDailyLogs, quirk, performAction, revive,
    buyItem, sellItem, consumeItem, startGame, resetGame, pointsAvailable
  } = useGameLogic();

  const [openPanel, setOpenPanel] = useState(null);
  const [showMorningReport, setShowMorningReport] = useState(false);
  const [activeDetailModal, setActiveDetailModal] = useState(null);

  useEffect(() => {
    if (dailyLogs.length > 0 && dailyLogs[0].type === 'morning' && dailyLogs[0].day === days) {
        setShowMorningReport(true);
    }
  }, [days, dailyLogs]);

  const getStatInfo = (attr) => {
    const info = {
      str: { name: 'Strength', desc: 'Increases melee damage and success in labor jobs.' },
      dex: { name: 'Dexterity', desc: 'Increases evasion and success in physical adventures.' },
      con: { name: 'Constitution', desc: 'Increases max health and resistance to fatigue.' },
      int: { name: 'Intelligence', desc: 'Increases success in magical tasks and some events.' },
      cha: { name: 'Charisma', desc: 'Increases success in social interactions and haggling.' },
      ac:  { name: 'Armor Class', desc: 'Total defense rating provided by equipment.' }
    };
    return info[attr] || { name: attr, desc: '' };
  };

  const getAttributeTotal = (attrKey) => {
      let total = attributes ? (attributes[attrKey] || 0) : 0;
      if (quirk && quirk.effects?.stats?.[attrKey]) total += quirk.effects.stats[attrKey];
      Object.values(equipped).forEach(itemId => {
           const item = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand].find(i => i.id === itemId);
           if (item?.stats?.[attrKey]) total += item.stats[attrKey];
      });
      return total;
  };

  const getModalDetails = (statKey) => {
      let isAttribute = ['str', 'dex', 'con', 'int', 'cha', 'ac'].includes(statKey);
      let isMeter = ['health', 'hunger', 'thirst', 'mood', 'stress'].includes(statKey);

      let details = { title: '', description: '', base: 0, modifiers: [], total: 0 };

      if (isAttribute) {
          details.title = getStatInfo(statKey).name;
          details.description = getStatInfo(statKey).desc;
          details.base = attributes[statKey] || 0;
          details.total = attributes[statKey] || 0;
          
          if (quirk && quirk.effects?.stats && quirk.effects.stats[statKey]) {
              const val = quirk.effects.stats[statKey];
              details.modifiers.push({ source: `Trait: ${quirk.name}`, value: val });
              details.total += val;
          }

          Object.entries(equipped).forEach(([slot, itemId]) => {
              if (itemId !== 'none' && itemId !== 'fist' && itemId !== 'tunic') {
                  let item = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand].find(i => i.id === itemId);
                  if (item && item.stats && item.stats[statKey]) {
                      details.modifiers.push({ source: item.name, value: item.stats[statKey] });
                      details.total += item.stats[statKey];
                  }
              }
          });
      } else if (isMeter) {
          const meterInfo = {
              health: { name: 'Health', desc: 'Your life force. If it drops to 0, your adventure ends abruptly.' },
              hunger: { name: 'Hunger', desc: 'How starved you are. High hunger passively damages health and raises stress.' },
              thirst: { name: 'Thirst', desc: 'Your hydration level. High thirst rapidly increases fatigue and stress.' },
              mood: { name: 'Mood', desc: 'Your current mental well-being. A high mood vastly improves social interactions.' },
              stress: { name: 'Stress', desc: 'Mental pressure from the daily grind. High stress leads to negative autonomy events.' }
          };
          details.title = meterInfo[statKey].name;
          details.description = meterInfo[statKey].desc;
          details.base = stats[statKey];
          details.total = stats[statKey];
          details.max = maxStats[statKey];
      } else if (statKey === 'quirk') {
           details.title = quirk.name;
           details.description = quirk.desc;
           details.isQuirk = true;
      }

      return details;
  };

  if (!gameStarted) {
    return (
      <CreationScreen 
        creationStep={creationStep} setCreationStep={setCreationStep} appearance={appearance} updateAppearance={updateAppearance} 
        equipped={equipped} attributes={attributes} updateAttribute={updateAttribute} pointsAvailable={pointsAvailable} 
        getStatInfo={getStatInfo} startGame={startGame} 
      />
    );
  }

  const metersContent = (
    <>
         <StatBlock label="HP" value={stats.health} max={maxStats.health} alert={stats.health < maxStats.health * 0.3} onClick={() => setActiveDetailModal('health')} />
         <StatBlock label="Hunger" value={stats.hunger} max={maxStats.hunger} alert={stats.hunger > 70} inverted onClick={() => setActiveDetailModal('hunger')} />
         <StatBlock label="Thirst" value={stats.thirst} max={maxStats.thirst} alert={stats.thirst > 70} inverted onClick={() => setActiveDetailModal('thirst')} />
         <StatBlock label="Mood" value={stats.mood} max={maxStats.mood} alert={stats.mood < 30} onClick={() => setActiveDetailModal('mood')} />
         <StatBlock label="Stress" value={stats.stress} max={maxStats.stress} alert={stats.stress > 70} inverted onClick={() => setActiveDetailModal('stress')} />
         {quirk ? (
             <button onClick={() => setActiveDetailModal('quirk')} className="flex flex-col items-center justify-center w-[42px] h-[42px] md:w-[60px] md:h-[60px] bg-indigo-950/80 rounded-xl md:rounded-2xl border border-indigo-500/40 hover:border-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 px-1">
                 <span className="text-[7px] md:text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Trait</span>
                 <span className="text-[8px] md:text-[10px] font-bold text-indigo-100 leading-tight text-center w-full truncate">{quirk.name}</span>
             </button>
         ) : (
             <div className="w-[42px] h-[42px] md:w-[60px] md:h-[60px] opacity-0" />
         )}
    </>
  );

  const attributesContent = (
    <>
         {['str', 'dex', 'con', 'int', 'cha', 'ac'].map(attr => (
             <AttributeBlock key={attr} label={attr} value={getAttributeTotal(attr)} onClick={() => setActiveDetailModal(attr)} />
         ))}
    </>
  );

  const visibleInventory = inventory.filter(id => id !== 'none' && id !== 'fist' && id !== 'tunic');
  const modalDetails = activeDetailModal ? getModalDetails(activeDetailModal) : null;

  return (
    <div className="relative w-full h-screen overflow-hidden text-zinc-200 font-sans select-none selection:bg-indigo-500/30">
      
      {/* Dynamic Background Layer */}
      <ResponsiveBackground locationId={location} />
      
      {/* Modals & Overlays */}
      {showMorningReport && dailyLogs[0] && ( <MorningReport log={dailyLogs[0]} onClose={() => setShowMorningReport(false)} /> )}

      {activeDetailModal && modalDetails && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveDetailModal(null)}>
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-indigo-400 uppercase tracking-widest">{modalDetails.title}</h3>
                      <button onClick={() => setActiveDetailModal(null)} className="text-zinc-500 hover:text-zinc-300 transition-colors"><X size={18}/></button>
                  </div>
                  <div className="p-5 space-y-4">
                      <p className="text-sm text-zinc-300 leading-relaxed italic">{modalDetails.description}</p>
                      
                      {!modalDetails.isQuirk && (
                          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 space-y-3">
                              <div className="flex justify-between items-center text-sm font-bold text-zinc-400">
                                  <span>Base Value:</span>
                                  <span className="font-mono text-zinc-200">{modalDetails.base}{modalDetails.max ? ` / ${modalDetails.max}` : ''}</span>
                              </div>
                              
                              {modalDetails.modifiers?.map((mod, i) => (
                                  <div key={i} className="flex justify-between items-center text-xs text-zinc-400">
                                      <span>{mod.source}</span>
                                      <span className={`font-mono font-bold ${mod.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                          {mod.value > 0 ? '+' : ''}{mod.value}
                                      </span>
                                  </div>
                              ))}
                              
                              {modalDetails.modifiers?.length > 0 && (
                                  <div className="pt-3 mt-3 border-t border-zinc-700/50 flex justify-between items-center text-sm font-bold text-zinc-200">
                                      <span>Current Total:</span>
                                      <span className="font-mono text-indigo-400">{modalDetails.total}</span>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Messages Toast */}
      <div className="absolute top-[140px] md:top-[120px] left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-auto w-full max-w-sm px-4">
        {messages.map(m => (
          <div key={m.id} className={`p-3 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.5)] text-sm font-bold text-center animate-in slide-in-from-top-4 fade-in backdrop-blur-md border ${
            m.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-100' :
            m.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100' :
            m.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-100' :
            'bg-indigo-950/90 border-indigo-500/50 text-indigo-100'
          }`}>
            {m.text}
          </div>
        ))}
      </div>

      {/* Top HUD Layer */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2 md:p-4 pointer-events-none flex flex-col gap-2">
        <header className="pointer-events-auto bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/60 rounded-2xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-2 md:gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 md:gap-5">
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Time</span>
                    <span className="text-lg md:text-xl font-bold text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">Day {days}</span>
                </div>
                <div className="w-px h-6 md:h-8 bg-zinc-700/60 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Location</span>
                    <span className="text-xs md:text-sm font-bold text-zinc-200">{LOCATIONS[location]?.name}</span>
                </div>
                <div className="w-px h-6 md:h-8 bg-zinc-700/60 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Housing</span>
                    <span className={`text-xs md:text-sm font-bold ${housing === 'homeless' ? 'text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]' : 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]'}`}>
                        {housing === 'inn' ? 'Inn Room' : housing === 'estate' ? 'Estate' : 'Homeless'}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6 bg-zinc-950/70 px-3 py-1.5 md:py-2 rounded-xl border border-zinc-800/80 shadow-inner">
                <div className="flex items-center gap-2">
                    <div className="p-1 md:p-1.5 bg-amber-500/20 rounded-lg text-amber-400 border border-amber-500/30"><Coins size={14} className="md:w-4 md:h-4" /></div>
                    <span className="text-base md:text-lg font-mono font-bold text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]">{resources.gold}g</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-1 md:p-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 border border-cyan-500/30"><Activity size={14} className="md:w-4 md:h-4" /></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-bold text-cyan-400">Lv {resources.level}</span>
                        <span className="text-[8px] md:text-[9px] text-cyan-200/50 font-mono">{resources.xp}/{resources.level*100}</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Meters & Attributes (Mobile Only) */}
        <div className="md:hidden pointer-events-auto flex flex-col items-center gap-2 max-w-fit mx-auto mt-1">
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-2xl py-1.5 px-2 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex justify-center gap-1.5">
                {metersContent}
            </div>
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-2xl py-1.5 px-2 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex justify-center gap-1.5">
                {attributesContent}
            </div>
        </div>
      </div>

      {/* Meters & Attributes (Desktop Only - Left Side) */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-6 z-20 pointer-events-auto items-start gap-4">
          {/* Column 1: Core Meters & Trait */}
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-3xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex flex-col gap-3">
              {metersContent}
          </div>

          {/* Column 2: Attributes & AC */}
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-3xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex flex-col gap-3">
              {attributesContent}
          </div>
      </div>

      {/* Main Character Layer */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-end pt-[160px] pb-[100px] md:pt-[100px] md:pb-[40px] pointer-events-none">
          {isDead && (
             <div className="absolute inset-0 bg-red-950/90 z-40 flex flex-col items-center justify-center backdrop-blur-md pointer-events-auto">
                <Skull size={72} className="text-red-500 mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
                <h2 className="text-5xl font-black text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest uppercase">You Died.</h2>
                <div className="text-red-300/70 mb-8 font-mono text-sm">Your adventure has come to an end.</div>
                <button onClick={revive} className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-105 active:scale-95 border border-red-500 uppercase tracking-wider">Revive (Cost: 50 XP)</button>
             </div>
          )}
          
          <div className="w-full h-full flex items-end justify-center transition-all duration-500">
             <div className="w-auto h-full max-h-[600px] aspect-[2/3] max-w-[95vw]">
                <CharacterCanvas equipped={equipped} appearance={appearance} isAlive={!isDead} />
             </div>
          </div>
      </div>

      {/* Navigation Layer (Mobile: Bottom, Desktop: Right) */}
      <div className="absolute bottom-6 md:bottom-auto md:top-1/2 left-1/2 md:left-auto md:right-6 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-20 pointer-events-auto">
          <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-row md:flex-col gap-2">
              {[
                { id: 'actions', icon: Tent, label: 'Actions' },
                { id: 'inventory', icon: Backpack, label: 'Bag' },
                { id: 'shop', icon: Store, label: 'Shop' },
                { id: 'log', icon: List, label: 'Log' }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = openPanel === tab.id;
                return (
                  <button 
                      key={tab.id} 
                      onClick={() => setOpenPanel(isActive ? null : tab.id)} 
                      className={`flex flex-col items-center justify-center w-16 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl transition-all ${
                          isActive 
                              ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-400 scale-105' 
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent'
                      }`}
                  >
                      <Icon size={isActive ? 24 : 20} className="mb-1" />
                      <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">{tab.label}</span>
                  </button>
                );
              })}
          </div>
      </div>

      {/* Full Screen Overlay Modals */}
      {openPanel && (
          <div className="absolute inset-0 z-30 pointer-events-none flex justify-center items-end sm:items-center p-2 sm:p-6 pb-28 sm:pb-6">
              
              <div className="absolute inset-0 bg-zinc-950/70 pointer-events-auto backdrop-blur-md transition-opacity" onClick={() => setOpenPanel(null)} />
              
              <div className="pointer-events-auto relative bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-3xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
                 
                 <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-700/80 bg-zinc-950/60 shadow-sm">
                     <h2 className="font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-3 text-lg drop-shadow-[0_0_5px_rgba(99,102,241,0.4)]">
                        {openPanel === 'actions' && <Tent size={20}/>}
                        {openPanel === 'inventory' && <Backpack size={20}/>}
                        {openPanel === 'shop' && <Store size={20}/>}
                        {openPanel === 'log' && <List size={20}/>}
                        {openPanel}
                     </h2>
                     <button onClick={() => setOpenPanel(null)} className="p-2 bg-zinc-800 rounded-full hover:bg-red-900/80 hover:text-red-400 transition-colors border border-zinc-700 shadow-sm">
                         <X size={16} strokeWidth={3} />
                     </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-zinc-950/30">
                     
                     {/* --- ACTIONS PANEL --- */}
                     {openPanel === 'actions' && (
                        <>
                           <div>
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1">Maintenance</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {MAINTENANCE_ACTIONS.map(action => (
                                    <ActionButton key={action.id} {...action} onClick={() => performAction(action)} disabled={isDead || (action.cost > 0 && resources.gold < action.cost)} />
                                 ))}
                                 {housing === 'homeless' ? (
                                    <ActionButton id="rent_start" label="Rent Inn Room" icon="Tent" cost={5} description="Lumpy bed, but safe." onClick={() => performAction({ id: 'rent_start', label: 'Rent Inn Room', cost: 5, days: 0, costType: 'gp', type: 'housing' })} disabled={isDead || resources.gold < 5} />
                                 ) : (
                                    <ActionButton id="rent_stop" label="Checkout of Inn" icon="X" cost={0} description="Back to the dirt." onClick={() => performAction({ id: 'rent_stop', label: 'Checkout of Inn', cost: 0, days: 0, costType: 'gp', type: 'housing' })} disabled={isDead} />
                                 )}
                              </div>
                           </div>
                           
                           {dailyQuests.labor.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1"><Hammer size={14} className="text-amber-500"/> Labor (STR/CON)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.labor.map(q => <ActionButton key={q.id} {...q} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests.adventure.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1"><Shield size={14} className="text-indigo-400"/> Adventure (STR/DEX/AC)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.adventure.map(q => <ActionButton key={q.id} {...q} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests.social.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1"><User size={14} className="text-emerald-400"/> Social (CHA)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.social.map(q => <ActionButton key={q.id} {...q} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}
                        </>
                     )}

                     {/* --- INVENTORY PANEL --- */}
                     {openPanel === 'inventory' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Equipped</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(equipped).map(([slot, itemId]) => {
                                        const item = ITEM_DB[slot]?.find(i => i.id === itemId);
                                        const isDefault = itemId === 'none' || itemId === 'fist' || itemId === 'tunic';
                                        return (
                                            <div key={slot} className="bg-zinc-900/80 border border-zinc-700/60 rounded-xl p-3 flex flex-col items-center justify-between text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden h-full min-h-[90px]">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                                                <div className="flex flex-col items-center z-10 w-full">
                                                    <span className="text-[9px] text-indigo-400 uppercase font-bold tracking-widest mb-1">{slot}</span>
                                                    <span className="text-sm font-bold text-zinc-200">{item ? item.name : 'None'}</span>
                                                    <div className="mt-1">{item && renderItemStats(item)}</div>
                                                </div>
                                                {!isDefault && (
                                                    <button 
                                                        onClick={() => equipItem({ id: slot === 'mainHand' ? 'fist' : 'none', type: slot, category: 'Equipment' })} 
                                                        className="mt-3 z-10 w-full py-1.5 text-[9px] font-bold uppercase tracking-widest bg-zinc-950/60 text-zinc-400 border border-zinc-700/50 rounded-lg hover:bg-red-950/80 hover:text-red-400 hover:border-red-900/50 transition-all shadow-sm"
                                                    >
                                                        Unequip
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Backpack</h3>
                                {visibleInventory.length === 0 ? (
                                    <div className="p-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-700/50 border-dashed">
                                        <p className="text-sm text-zinc-500 font-medium">Your backpack is empty.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {visibleInventory.map((itemId, idx) => {
                                            const item = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies].find(i => i.id === itemId);
                                            if(!item) return null;
                                            const isEquipped = Object.values(equipped).includes(itemId);
                                            return (
                                                <div key={idx} className="bg-zinc-800/90 border border-zinc-700/80 rounded-xl p-4 flex flex-col shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="font-bold text-sm text-zinc-200 block">{item.name}</span>
                                                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.category}</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-700/50">{Math.floor(item.cost/2)}g Value</span>
                                                    </div>
                                                    {renderItemStats(item)}
                                                    <div className="mt-4 flex gap-2">
                                                        {['head', 'body', 'mainHand', 'offHand'].includes(item.type) && (
                                                            <button onClick={() => equipItem(item)} disabled={isEquipped} className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${isEquipped ? 'bg-indigo-950/50 text-indigo-500/50 border border-indigo-500/20 cursor-not-allowed' : 'bg-zinc-700 text-zinc-200 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-zinc-600 hover:border-indigo-500'}`}>
                                                                {isEquipped ? 'Equipped' : 'Equip'}
                                                            </button>
                                                        )}
                                                        {(item.type === 'food' || item.type === 'drink' || item.type === 'potion') && (
                                                            <button onClick={() => consumeItem(item)} className="flex-1 py-2.5 bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-all hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                                                                Consume
                                                            </button>
                                                        )}
                                                        {!isEquipped && (
                                                            <button onClick={() => sellItem(item)} className="px-5 py-2.5 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-amber-600 hover:text-white hover:border-amber-500 rounded-lg text-xs font-bold tracking-wider uppercase transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.4)]">
                                                                Sell
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                     )}

                     {/* --- SHOP PANEL --- */}
                     {openPanel === 'shop' && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-3 border-b border-zinc-800 pb-3">
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Daily Market</h3>
                                    <p className="text-[10px] text-zinc-500 mt-1">Stock refreshes every day.</p>
                                </div>
                                <button onClick={() => passTime(1)} className="text-[10px] bg-zinc-800 px-4 py-2.5 rounded-lg border border-zinc-700 hover:bg-indigo-900/60 hover:border-indigo-500/50 text-zinc-300 hover:text-indigo-200 font-bold uppercase tracking-wider transition-all flex items-center gap-2">
                                    <Clock size={12}/> Skip Day
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {shopStock.map(itemId => {
                                    const item = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies].find(i => i.id === itemId);
                                    if(!item) return null;
                                    let cost = item.cost;
                                    if (quirk && quirk.id === 'lightweight' && (item.type === 'drink' || item.id === 'ale' || item.id === 'wine')) cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
                                    const canAfford = resources.gold >= cost;

                                    return (
                                        <div key={itemId} className={`bg-zinc-800/80 border rounded-xl p-4 flex flex-col justify-between shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all ${canAfford ? 'border-zinc-600 hover:border-indigo-500/70 hover:bg-zinc-800' : 'border-zinc-800 opacity-60 grayscale-[0.5]'}`}>
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-bold text-sm text-zinc-200 block">{item.name}</span>
                                                        <span className="text-[9px] text-indigo-400/80 uppercase tracking-widest">{item.category}</span>
                                                    </div>
                                                    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border ${canAfford ? 'text-amber-400 bg-amber-950/60 border-amber-500/40' : 'text-red-400 bg-red-950/60 border-red-500/40'}`}>
                                                        {cost}g
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed">{item.description}</p>
                                                {renderItemStats(item)}
                                            </div>
                                            <button onClick={() => buyItem(item)} disabled={!canAfford || isDead} className={`mt-4 w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${canAfford && !isDead ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:border-indigo-500' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800'}`}>
                                                Purchase
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                     )}

                     {/* --- LOG PANEL --- */}
                     {openPanel === 'log' && (
                        <div className="space-y-3 pb-4">
                            {dailyLogs.length === 0 ? (
                                <div className="p-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-700/50 border-dashed">
                                    <p className="text-sm text-zinc-500 font-medium">No events recorded yet.</p>
                                </div>
                            ) : (
                                dailyLogs.map(log => (
                                    <div key={log.id} className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-4 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${log.type === 'morning' ? 'bg-amber-950/60 text-amber-500 border-amber-700/50' : 'bg-zinc-900 text-zinc-400 border-zinc-700'}`}>
                                                {log.type === 'morning' ? 'Morning Report' : 'Action Log'}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-zinc-500">Day {log.day}</span>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-200">{log.title || log.incidentTitle}</p>
                                        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{log.text || log.incidentText}</p>
                                        {(log.changes || log.status !== 'Success') && (
                                            <div className={`mt-3 p-2.5 rounded-lg text-[10px] font-bold border tracking-wide ${log.status === 'Failed' ? 'bg-red-950/50 text-red-400 border-red-900/50' : 'bg-indigo-950/50 text-indigo-300 border-indigo-900/50'}`}>
                                                {log.changes || log.status}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            <div className="flex justify-center mt-8 pt-4 border-t border-zinc-800">
                                <button onClick={resetGame} className="text-[10px] text-red-500/50 hover:text-red-400 font-bold uppercase tracking-widest transition-colors flex items-center gap-1 bg-red-950/20 px-4 py-2 rounded-lg border border-red-900/30 hover:bg-red-900/40">
                                    <X size={12}/> Hard Reset Game
                                </button>
                            </div>
                        </div>
                     )}

                 </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
