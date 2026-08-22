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
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-11 h-11 md:w-[72px] md:h-[72px] bg-slate-900/90 rounded-xl md:rounded-2xl border backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 ${alert ? 'border-red-500/50 bg-red-950/80' : inverted ? 'border-amber-500/50 bg-amber-950/80' : 'border-slate-700/80 hover:border-slate-500'}`}>
        <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${alert ? 'text-red-400' : inverted ? 'text-amber-500' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-xs md:text-lg font-bold font-mono ${alert ? 'text-red-400' : inverted ? 'text-amber-300' : 'text-slate-200'}`}>{Math.floor(value)}{max !== undefined && <span className="text-[9px] md:text-xs text-slate-500">/{max}</span>}</span>
        {subValue !== undefined && <span className="text-[8px] md:text-[10px] text-indigo-400 font-mono">+{subValue}</span>}
    </button>
);

const ActionButton = ({ icon: IconName, label, days, cost, costType = 'gp', onClick, disabled, description, effects }) => {
  const Icon = IconMap[IconName] || HelpCircle;
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center gap-3 p-3 w-full rounded-lg border text-left transition-all relative overflow-hidden group ${disabled ? 'bg-slate-900/80 border-slate-800 text-slate-600 cursor-not-allowed opacity-70' : 'bg-slate-800/90 border-slate-600 text-slate-200 hover:bg-indigo-950/50 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
      <div className={`p-2 rounded-md ${disabled ? 'bg-slate-800' : 'bg-slate-950 group-hover:text-indigo-400'}`}><Icon size={18} /></div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5"><span className="font-bold text-xs truncate">{label}</span>{days > 0 && <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Clock size={10}/> {days}d</span>}</div>
        <span className="text-[10px] text-slate-500 truncate leading-tight">{description}</span>{effects && renderEffectsList(effects)}
      </div>
      {cost > 0 && <div className={`text-[10px] font-mono px-2 py-1 rounded ml-2 ${disabled ? 'bg-slate-800' : 'bg-black/60'} ${costType === 'gp' ? 'text-amber-500' : 'text-cyan-500'}`}>-{cost}{costType}</div>}
    </button>
  );
};

const renderItemStats = (item) => renderEffectsList(item.stats || item.effects);

const VillageRoadBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#18181b] to-[#271c19]/40" />
    
    <div className="absolute top-16 right-24 w-20 h-20 rounded-full bg-slate-200/10 blur-xl" />
    <div className="absolute top-18 right-26 w-16 h-16 rounded-full bg-indigo-100/20 shadow-[0_0_40px_rgba(199,210,254,0.3)]" />
    <div className="absolute top-10 left-1/4 w-1 h-1 bg-white opacity-40 rounded-full shadow-[0_0_4px_white]" />
    <div className="absolute top-32 left-1/3 w-0.5 h-0.5 bg-white opacity-60 rounded-full" />
    <div className="absolute top-24 right-1/2 w-1.5 h-1.5 bg-white opacity-30 rounded-full" />

    <div className="absolute bottom-[35%] left-0 right-0 h-40 flex items-end justify-center gap-2 opacity-30 blur-[1px]">
        <div className="w-12 h-32 bg-[#09090b] [clip-path:polygon(50%_0%,100%_20%,100%_100%,0%_100%,0%_20%)]" />
        <div className="w-8 h-40 bg-[#09090b] [clip-path:polygon(50%_0%,80%_10%,100%_100%,0%_100%,20%_10%)]" />
        <div className="w-24 h-20 bg-[#09090b] [clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)]" />
        <div className="w-32" />
        <div className="w-16 h-28 bg-[#09090b] [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)]" />
    </div>

    <div className="absolute bottom-[35%] left-0 right-0 h-24 flex items-end justify-between opacity-60 px-10">
        <div className="w-24 h-32 bg-[#050505] [clip-path:polygon(20%_0,40%_15%,15%_30%,35%_50%,0%_70%,20%_100%,100%_100%,80%_80%,100%_50%,70%_30%,90%_10%,60%_0)]" />
        <div className="w-20 h-28 bg-[#050505] [clip-path:polygon(50%_0,70%_20%,60%_40%,80%_60%,50%_100%,20%_100%,10%_60%,30%_40%,20%_20%)]" />
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#110d0a] to-[#2a2015]" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[35%] bg-gradient-to-t from-[#2c1d11] to-[#3a2818] [clip-path:polygon(25%_0,75%_0,100%_100%,0%_100%)] border-x border-black/20" />
    
    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent" />
  </div>
);

const InnRoomBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#0c0a09]">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#292524_2px,transparent_2px)] [background-size:30px_30px]" />
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#44403c_1px,transparent_1px)] [background-size:15px_15px] translate-x-4 translate-y-4" />

    <div className="absolute top-12 left-1/4 w-32 h-56 bg-[#050505] border-8 border-[#292524] rounded-t-[4rem] shadow-[inset_0_0_40px_black]">
       <div className="absolute top-8 right-8 w-4 h-4 bg-indigo-100 rounded-full opacity-60 shadow-[0_0_20px_white]" />
       <div className="absolute bottom-0 w-full h-3 bg-black/80" />
       <div className="absolute w-2 h-full left-1/2 bg-[#292524] shadow-[2px_0_5px_rgba(0,0,0,0.5)]" />
       <div className="absolute h-2 w-full top-1/2 bg-[#292524] shadow-[0_2px_5px_rgba(0,0,0,0.5)]" />
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-b from-[#1c140d] to-[#0a0704] border-t-4 border-[#292524]">
       <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#000_40px,#000_42px)]" />
    </div>

    <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-amber-600/10 rounded-full blur-[80px]" />
    <div className="absolute bottom-0 right-1/4 w-[300px] h-[150px] bg-red-600/10 rounded-full blur-[60px]" />
  </div>
);

const getBackground = (locationId) => locationId === 'inn_room' ? InnRoomBackground : VillageRoadBackground;

// UPDATED: HTML5 Canvas Engine loading actual 2D Sprites
const CharacterCanvas = ({ equipped, appearance, isAlive }) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all available sprite layers
  useEffect(() => {
    // We append Vite's BASE_URL to the paths so it resolves properly on GitHub Pages
    const baseUrl = import.meta.env.BASE_URL; 
    
    // Wire up all the male bases and both long/short hair variants
    const sources = {
      base_male_pale: `${baseUrl}base_male_pale.png`,
      base_male_fair: `${baseUrl}base_male_fair.png`,
      base_male_tan: `${baseUrl}base_male_tan.png`,
      base_male_dark: `${baseUrl}base_male_dark.png`,
      base_male_deep: `${baseUrl}base_male_deep.png`,
      hair_long_black: `${baseUrl}hair_long_black.png`,
      hair_long_blonde: `${baseUrl}hair_long_blonde.png`,
      hair_long_brown: `${baseUrl}hair_long_brown.png`,
      hair_long_grey: `${baseUrl}hair_long_grey.png`,
      hair_long_red: `${baseUrl}hair_long_red.png`,
      hair_long_white: `${baseUrl}hair_long_white.png`,
      hair_short_black: `${baseUrl}hair_short_black.png`,
      hair_short_blonde: `${baseUrl}hair_short_blonde.png`,
      hair_short_brown: `${baseUrl}hair_short_brown.png`,
      hair_short_grey: `${baseUrl}hair_short_grey.png`,
      hair_short_red: `${baseUrl}hair_short_red.png`,
      hair_short_white: `${baseUrl}hair_short_white.png`
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
      // Fallback in case an image fails to load so the game doesn't freeze
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${src}`);
        loadedCount++;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
    });
  }, []);

  // Main Game Loop Render
  useEffect(() => {
    if (!imagesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      // 1. Clear the canvas frame for transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply death state visual filter
      if (!isAlive) {
          ctx.filter = 'grayscale(100%) opacity(50%)';
      } else {
          ctx.filter = 'none';
      }

      // 2. Draw Base Body Layer (Bottom-most layer)
      const baseKey = `base_${appearance.gender}_${appearance.skinTone}`;
      // Fallback to our male pale test image if the player selects an option we haven't uploaded yet
      const baseImage = imagesRef.current[baseKey] || imagesRef.current['base_male_pale'];
      
      if (baseImage) {
          // Calculate scaling to perfectly fit the canvas height while maintaining aspect ratio
          const scale = canvas.height / baseImage.height;
          const drawWidth = baseImage.width * scale;
          const drawX = (canvas.width - drawWidth) / 2; // Centers the sprite
          
          ctx.drawImage(baseImage, drawX, 0, drawWidth, canvas.height);
      }

      // 3. Draw Hair Layer (Stacked on top of base)
      // Check if they are wearing a full helmet that would hide the hair
      const wearingFullHelm = equipped.head === 'iron_helm';
      
      if (appearance.hairStyle !== 'bald' && !wearingFullHelm) {
          const hairKey = `hair_${appearance.hairStyle}_${appearance.hairColor}`;
          // Only draw if the specific hair file is found
          const hairImage = imagesRef.current[hairKey];
          
          if (hairImage) {
              const scale = canvas.height / hairImage.height;
              const drawWidth = hairImage.width * scale;
              const drawX = (canvas.width - drawWidth) / 2;
              
              ctx.drawImage(hairImage, drawX, 0, drawWidth, canvas.height);
          }
      }

      // 4. Draw Equipment Layers (Stacked on top)
      if (equipped.body === 'leather_armor') {
          const armorImage = imagesRef.current['leather_armor'];
          if (armorImage) {
              const scale = canvas.height / armorImage.height;
              const drawWidth = armorImage.width * scale;
              const drawX = (canvas.width - drawWidth) / 2;
              
              ctx.drawImage(armorImage, drawX, 0, drawWidth, canvas.height);
          }
      }

      // Request next frame to keep the loop running
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup loop when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-amber-900/40 to-slate-900 p-6 border-b border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-full text-amber-400 border border-amber-500/30"><Sun size={28} /></div>
            <div><h2 className="text-xl font-bold text-white tracking-wide">Day {log.day}</h2><div className="text-xs text-amber-200/60 font-mono uppercase tracking-widest">Morning Report</div></div>
        </div>
        <div className="p-6 space-y-6">
            <div className="relative">
                <div className="absolute -left-2 -top-2 text-4xl text-slate-700 font-serif">“</div>
                <p className="text-lg text-slate-200 italic font-serif leading-relaxed px-4">{log.incidentText}</p>
                <div className="absolute -right-2 -bottom-4 text-4xl text-slate-700 font-serif">”</div>
            </div>
            <div className="h-px bg-slate-800 w-full" />
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Last Night's Sleep</span>
                    <span className="text-sm text-slate-300 font-medium flex items-center gap-2">{log.sleepLoc}</span>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Expenses</span>
                    <span className="text-sm text-amber-400 font-medium">{log.rent.includes('Paid') ? log.rent.split(':')[1] : '0g'}</span>
                </div>
            </div>
            <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20 text-center">
                <span className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">Current Mood</span>
                <span className="text-xs text-indigo-200">{log.status}</span>
            </div>
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">Start Day</button>
        </div>
      </div>
    </div>
  );
};

const CreationScreen = ({ creationStep, setCreationStep, appearance, updateAppearance, equipped, attributes, updateAttribute, pointsAvailable, getStatInfo, startGame }) => {
  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden h-[85vh]">
            <div className="w-full md:w-1/3 bg-gradient-to-b from-slate-900 to-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
                <h2 className="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-widest drop-shadow-md">New Adventurer</h2>
                <div className="w-48 h-72"><CharacterCanvas equipped={equipped} appearance={appearance} isAlive={true} /></div>
            </div>
            <div className="flex-1 p-6 flex flex-col bg-slate-900/50">
                <div className="flex gap-4 mb-6 border-b border-slate-800">
                    <button onClick={() => setCreationStep(1)} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${creationStep === 1 ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>1. Appearance</button>
                    <button onClick={() => setCreationStep(2)} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${creationStep === 2 ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>2. Attributes</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {creationStep === 1 && (
                        <>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Gender</h3>
                                <div className="flex gap-2">{['male', 'female'].map(g => (<button key={g} onClick={() => updateAppearance('gender', g)} className={`flex-1 py-2.5 rounded-lg border text-xs font-bold uppercase transition-all ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>{g}</button>))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Skin Tone</h3>
                                <div className="flex gap-3">{APPEARANCE_OPTIONS.skinTones.map(t => (<button key={t.id} onClick={() => updateAppearance('skinTone', t.id)} className={`w-8 h-8 rounded-full border-2 transition-transform ${appearance.skinTone === t.id ? 'border-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'border-slate-700 hover:scale-110'}`} style={{ backgroundColor: t.color }} />))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Eye Color</h3>
                                <div className="flex gap-3 flex-wrap">{APPEARANCE_OPTIONS.eyeColors.map(c => (<button key={c.id} onClick={() => updateAppearance('eyeColor', c.id)} className={`w-6 h-6 rounded-full border-2 transition-transform ${appearance.eyeColor === c.id ? 'border-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'border-slate-700 hover:scale-110'}`} style={{ backgroundColor: c.color }} />))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hair Style</h3>
                                <div className="grid grid-cols-3 gap-2">{APPEARANCE_OPTIONS.hairStyles.map(s => (<button key={s.id} onClick={() => updateAppearance('hairStyle', s.id)} className={`py-2 rounded-lg border text-xs font-bold transition-all ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>{s.label}</button>))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hair Color</h3>
                                <div className="flex gap-3 flex-wrap">{APPEARANCE_OPTIONS.hairColors.map(c => (<button key={c.id} onClick={() => updateAppearance('hairColor', c.id)} className={`w-7 h-7 rounded border-2 transition-transform ${appearance.hairColor === c.id ? 'border-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'border-slate-700 hover:scale-110'}`} style={{ backgroundColor: c.color }} />))}</div>
                            </div>
                        </>
                    )}
                    {creationStep === 2 && (
                        <>
                            <div className="flex justify-between items-center bg-slate-800/80 border border-slate-700 p-4 rounded-xl mb-4 shadow-inner">
                                <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Points Available</span>
                                <span className={`text-2xl font-mono font-bold ${pointsAvailable > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-slate-500'}`}>{pointsAvailable}</span>
                            </div>
                            {Object.keys(attributes).map(attr => (
                                <div key={attr} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                                    <div className="flex flex-col"><span className="text-sm font-bold text-indigo-200 uppercase tracking-wider">{attr}</span><span className="text-[10px] text-slate-400">{getStatInfo(attr).desc}</span></div>
                                    <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                                        <button onClick={() => updateAttribute(attr, -1)} className="p-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-300 transition-colors"><Minus size={14} /></button>
                                        <span className="w-6 text-center font-mono font-bold text-white text-lg">{attributes[attr]}</span>
                                        <button onClick={() => updateAttribute(attr, 1)} className="p-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-300 transition-colors" disabled={pointsAvailable <= 0}><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                    {creationStep === 1 ? ( <button onClick={() => setCreationStep(2)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">Next: Attributes</button> ) : ( <button onClick={startGame} disabled={pointsAvailable > 0} className={`px-8 py-3 font-bold tracking-wider uppercase text-sm rounded-xl transition-all ${pointsAvailable > 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_20px_rgba(52,211,153,0.5)]'}`}>Start Adventure</button> )}
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
      cha: { name: 'Charisma', desc: 'Increases success in social interactions and haggling.' }
    };
    return info[attr] || { name: attr, desc: '' };
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

  const Background = getBackground(location);

  const metersContent = (
    <>
         <StatBlock label="HP" value={stats.health} max={maxStats.health} alert={stats.health < maxStats.health * 0.3} />
         <StatBlock label="Hunger" value={stats.hunger} max={maxStats.hunger} alert={stats.hunger > 70} inverted />
         <StatBlock label="Thirst" value={stats.thirst} max={maxStats.thirst} alert={stats.thirst > 70} inverted />
         <StatBlock label="Mood" value={stats.mood} max={maxStats.mood} alert={stats.mood < 30} />
         <StatBlock label="Stress" value={stats.stress} max={maxStats.stress} alert={stats.stress > 70} inverted />
    </>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Background />
      </div>
      
      {/* Modals & Overlays */}
      {showMorningReport && dailyLogs[0] && ( <MorningReport log={dailyLogs[0]} onClose={() => setShowMorningReport(false)} /> )}

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
        <header className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-2 md:gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 md:gap-5">
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Time</span>
                    <span className="text-lg md:text-xl font-bold text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">Day {days}</span>
                </div>
                <div className="w-px h-6 md:h-8 bg-slate-700/60 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Location</span>
                    <span className="text-xs md:text-sm font-bold text-slate-200">{LOCATIONS[location]?.name}</span>
                </div>
                <div className="w-px h-6 md:h-8 bg-slate-700/60 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Housing</span>
                    <span className={`text-xs md:text-sm font-bold ${housing === 'homeless' ? 'text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]' : 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]'}`}>
                        {housing === 'inn' ? 'Inn Room' : housing === 'estate' ? 'Estate' : 'Homeless'}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6 bg-slate-950/70 px-3 py-1.5 md:py-2 rounded-xl border border-slate-800/80 shadow-inner">
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

        {/* Meters (Mobile Only) */}
        <div className="md:hidden pointer-events-auto flex flex-col items-center gap-2 max-w-fit mx-auto mt-1">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl py-2 px-3 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex justify-center gap-2">
                {metersContent}
            </div>
        </div>
      </div>

      {/* Meters (Desktop Only - Left Side) */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-6 z-20 pointer-events-auto flex-col items-center gap-3 w-[96px]">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex flex-col gap-3 w-full">
              {metersContent}
          </div>
          
          {quirk && (
              <div className="bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 text-indigo-200 text-[10px] px-2 py-2.5 rounded-xl font-bold shadow-[0_5px_15px_rgba(99,102,241,0.2)] flex flex-col items-center text-center w-full animate-in fade-in zoom-in duration-500">
                  <span className="text-[8px] text-indigo-400 uppercase tracking-widest mb-1 border-b border-indigo-500/30 pb-0.5 w-full">Trait</span>
                  <span className="leading-tight text-indigo-100">{quirk.name}</span>
              </div>
          )}
      </div>
      
      <div className="md:hidden absolute bottom-24 left-4 z-20 pointer-events-auto">
         {quirk && (
            <div className="bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 text-indigo-200 text-[10px] px-3 py-2 rounded-xl font-bold shadow-[0_5px_15px_rgba(99,102,241,0.2)] flex flex-col items-start text-left max-w-[120px] animate-in fade-in zoom-in duration-500">
                <span className="text-[8px] text-indigo-400 uppercase tracking-widest mb-0.5">Trait</span>
                <span className="leading-tight text-indigo-100">{quirk.name}</span>
            </div>
         )}
      </div>

      {/* Main Character Layer (Now using Canvas) */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-end pt-[160px] pb-[100px] md:pt-[100px] md:pb-[40px] pointer-events-none">
          {isDead && (
             <div className="absolute inset-0 bg-red-950/90 z-40 flex flex-col items-center justify-center backdrop-blur-md pointer-events-auto">
                <Skull size={72} className="text-red-500 mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
                <h2 className="text-5xl font-black text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest uppercase">You Died.</h2>
                <div className="text-red-300/70 mb-8 font-mono text-sm">Your adventure has come to an end.</div>
                <button onClick={revive} className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-105 active:scale-95 border border-red-500 uppercase tracking-wider">Revive (Cost: 50 XP)</button>
             </div>
          )}
          
          {/* Main Canvas Container */}
          <div className="w-full h-full flex items-end justify-center transition-all duration-500">
             <div className="w-auto h-full max-h-[600px] aspect-[2/3] max-w-[95vw]">
                <CharacterCanvas equipped={equipped} appearance={appearance} isAlive={!isDead} />
             </div>
          </div>
      </div>

      {/* Navigation Layer (Mobile: Bottom, Desktop: Right) */}
      <div className="absolute bottom-6 md:bottom-auto md:top-1/2 left-1/2 md:left-auto md:right-6 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-20 pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-row md:flex-col gap-2">
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
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
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
              
              <div className="absolute inset-0 bg-slate-950/70 pointer-events-auto backdrop-blur-md transition-opacity" onClick={() => setOpenPanel(null)} />
              
              <div className="pointer-events-auto relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
                 
                 <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-700/80 bg-slate-950/60 shadow-sm">
                     <h2 className="font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-3 text-lg drop-shadow-[0_0_5px_rgba(99,102,241,0.4)]">
                        {openPanel === 'actions' && <Tent size={20}/>}
                        {openPanel === 'inventory' && <Backpack size={20}/>}
                        {openPanel === 'shop' && <Store size={20}/>}
                        {openPanel === 'log' && <List size={20}/>}
                        {openPanel}
                     </h2>
                     <button onClick={() => setOpenPanel(null)} className="p-2 bg-slate-800 rounded-full hover:bg-red-900/80 hover:text-red-400 transition-colors border border-slate-700 shadow-sm">
                         <X size={16} strokeWidth={3} />
                     </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-slate-950/30">
                     
                     {/* --- ACTIONS PANEL --- */}
                     {openPanel === 'actions' && (
                        <>
                           <div>
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-800 pb-1">Maintenance</h3>
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
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-800 pb-1"><Hammer size={14} className="text-amber-500"/> Labor (STR/CON)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.labor.map(q => <ActionButton key={q.id} {...q} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests.adventure.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-800 pb-1"><Shield size={14} className="text-indigo-400"/> Adventure (STR/DEX/AC)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.adventure.map(q => <ActionButton key={q.id} {...q} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests.social.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-800 pb-1"><User size={14} className="text-emerald-400"/> Social (CHA)</h3>
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
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">Equipped</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(equipped).map(([slot, itemId]) => {
                                        const item = ITEM_DB[slot].find(i => i.id === itemId);
                                        return (
                                            <div key={slot} className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                                                <span className="text-[9px] text-indigo-400 uppercase font-bold tracking-widest mb-1 z-10">{slot}</span>
                                                <span className="text-sm font-bold text-slate-200 z-10">{item ? item.name : 'None'}</span>
                                                <div className="z-10">{item && renderItemStats(item)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">Backpack</h3>
                                {inventory.filter(id => id !== 'none' && id !== 'fist').length === 0 ? (
                                    <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-700/50 border-dashed">
                                        <p className="text-sm text-slate-500 font-medium">Your backpack is empty.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inventory.filter(id => id !== 'none' && id !== 'fist').map((itemId, idx) => {
                                            const item = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies].find(i => i.id === itemId);
                                            if(!item) return null;
                                            const isEquipped = Object.values(equipped).includes(itemId);
                                            return (
                                                <div key={idx} className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex flex-col shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="font-bold text-sm text-slate-200 block">{item.name}</span>
                                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{item.category}</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-700/50">{Math.floor(item.cost/2)}g Value</span>
                                                    </div>
                                                    {renderItemStats(item)}
                                                    <div className="mt-4 flex gap-2">
                                                        {['head', 'body', 'mainHand', 'offHand'].includes(item.type) && (
                                                            <button onClick={() => equipItem(item)} disabled={isEquipped} className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${isEquipped ? 'bg-indigo-950/50 text-indigo-500/50 border border-indigo-500/20 cursor-not-allowed' : 'bg-slate-700 text-slate-200 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-slate-600 hover:border-indigo-500'}`}>
                                                                {isEquipped ? 'Equipped' : 'Equip'}
                                                            </button>
                                                        )}
                                                        {(item.type === 'food' || item.type === 'drink' || item.type === 'potion') && (
                                                            <button onClick={() => consumeItem(item)} className="flex-1 py-2.5 bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-all hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                                                                Consume
                                                            </button>
                                                        )}
                                                        {!isEquipped && (
                                                            <button onClick={() => sellItem(item)} className="px-5 py-2.5 bg-slate-900 border border-slate-700 text-slate-400 hover:bg-amber-600 hover:text-white hover:border-amber-500 rounded-lg text-xs font-bold tracking-wider uppercase transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.4)]">
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-3 border-b border-slate-800 pb-3">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Market</h3>
                                    <p className="text-[10px] text-slate-500 mt-1">Stock refreshes every day.</p>
                                </div>
                                <button onClick={() => passTime(1)} className="text-[10px] bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-indigo-900/60 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-200 font-bold uppercase tracking-wider transition-all flex items-center gap-2">
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
                                        <div key={itemId} className={`bg-slate-800/80 border rounded-xl p-4 flex flex-col justify-between shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all ${canAfford ? 'border-slate-600 hover:border-indigo-500/70 hover:bg-slate-800' : 'border-slate-800 opacity-60 grayscale-[0.5]'}`}>
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-bold text-sm text-slate-200 block">{item.name}</span>
                                                        <span className="text-[9px] text-indigo-400/80 uppercase tracking-widest">{item.category}</span>
                                                    </div>
                                                    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border ${canAfford ? 'text-amber-400 bg-amber-950/60 border-amber-500/40' : 'text-red-400 bg-red-950/60 border-red-500/40'}`}>
                                                        {cost}g
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">{item.description}</p>
                                                {renderItemStats(item)}
                                            </div>
                                            <button onClick={() => buyItem(item)} disabled={!canAfford || isDead} className={`mt-4 w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${canAfford && !isDead ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:border-indigo-500' : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'}`}>
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
                                <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-700/50 border-dashed">
                                    <p className="text-sm text-slate-500 font-medium">No events recorded yet.</p>
                                </div>
                            ) : (
                                dailyLogs.map(log => (
                                    <div key={log.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${log.type === 'morning' ? 'bg-amber-950/60 text-amber-500 border-amber-700/50' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                                                {log.type === 'morning' ? 'Morning Report' : 'Action Log'}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-slate-500">Day {log.day}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-200">{log.title || log.incidentTitle}</p>
                                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{log.text || log.incidentText}</p>
                                        {(log.changes || log.status !== 'Success') && (
                                            <div className={`mt-3 p-2.5 rounded-lg text-[10px] font-bold border tracking-wide ${log.status === 'Failed' ? 'bg-red-950/50 text-red-400 border-red-900/50' : 'bg-indigo-950/50 text-indigo-300 border-indigo-900/50'}`}>
                                                {log.changes || log.status}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            <div className="flex justify-center mt-8 pt-4 border-t border-slate-800">
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
