import React, { useState, useEffect } from 'react';
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
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-11 h-11 md:w-[72px] md:h-[72px] bg-slate-800/80 rounded-xl md:rounded-2xl border backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95 ${alert ? 'border-red-500/50 bg-red-900/40' : inverted ? 'border-amber-500/50 bg-amber-900/40' : 'border-slate-700/50 hover:border-slate-500'}`}>
        <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-tighter ${alert ? 'text-red-400' : inverted ? 'text-amber-400' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-xs md:text-lg font-bold font-mono ${alert ? 'text-red-400' : inverted ? 'text-amber-200' : 'text-slate-200'}`}>{Math.floor(value)}{max !== undefined && <span className="text-[9px] md:text-xs text-slate-500">/{max}</span>}</span>
        {subValue !== undefined && <span className="text-[8px] md:text-[10px] text-indigo-400 font-mono">+{subValue}</span>}
    </button>
);

const ActionButton = ({ icon: IconName, label, days, cost, costType = 'gp', onClick, disabled, description, effects }) => {
  const Icon = IconMap[IconName] || HelpCircle;
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center gap-3 p-3 w-full rounded-lg border text-left transition-all relative overflow-hidden group ${disabled ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed opacity-70' : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-indigo-900/30 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10'}`}>
      <div className={`p-2 rounded-md ${disabled ? 'bg-slate-700' : 'bg-slate-900 group-hover:text-indigo-400'}`}><Icon size={18} /></div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5"><span className="font-bold text-xs truncate">{label}</span>{days > 0 && <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Clock size={10}/> {days}d</span>}</div>
        <span className="text-[10px] text-slate-500 truncate leading-tight">{description}</span>{effects && renderEffectsList(effects)}
      </div>
      {cost > 0 && <div className={`text-[10px] font-mono px-2 py-1 rounded ml-2 ${disabled ? 'bg-slate-700' : 'bg-black/40'} ${costType === 'gp' ? 'text-amber-400' : 'text-cyan-400'}`}>-{cost}{costType}</div>}
    </button>
  );
};

const renderItemStats = (item) => renderEffectsList(item.stats || item.effects);

const VillageRoadBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900/20" />
    <div className="absolute top-10 left-20 w-1 h-1 bg-white opacity-40 rounded-full" /><div className="absolute top-20 left-1/4 w-0.5 h-0.5 bg-white opacity-60 rounded-full" />
    <div className="absolute top-5 right-1/3 w-1 h-1 bg-white opacity-30 rounded-full" /><div className="absolute top-10 right-10 w-12 h-12 rounded-full bg-indigo-100/20 blur-xl" />
    <div className="absolute top-12 right-12 w-8 h-8 rounded-full bg-indigo-50/80 shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
    <div className="absolute bottom-[35%] left-0 right-0 h-24 bg-slate-900 opacity-40 [clip-path:polygon(0%_100%,0%_20%,20%_0%,50%_30%,80%_10%,100%_40%,100%_100%)]" />
    <div className="absolute bottom-[35%] left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-60">
        <div className="w-16 h-12 bg-slate-900 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
        <div className="w-10 h-24 bg-slate-900 [clip-path:polygon(10%_100%,10%_10%,0%_10%,10%_0%,90%_0%,100%_10%,90%_10%,90%_100%)]" />
        <div className="w-20 h-16 bg-slate-900 [clip-path:polygon(0%_100%,0%_30%,20%_30%,50%_0%,80%_30%,100%_30%,100%_100%)]" />
        <div className="w-24" /><div className="w-14 h-14 bg-slate-900 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
    </div>
    <div className="absolute bottom-[35%] -left-10 w-32 h-24 bg-slate-950 opacity-80 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
    <div className="absolute bottom-[35%] -right-10 w-40 h-28 bg-slate-950 opacity-80 [clip-path:polygon(0%_100%,0%_40%,50%_0%,100%_40%,100%_100%)]" />
    <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#3f2e18]" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[35%] bg-[#5c4026] [clip-path:polygon(20%_0,80%_0,100%_100%,0%_100%)] opacity-80" />
    <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#0f172a_100%) opacity-60" />
  </div>
);

const InnRoomBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#1a120b]">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3f2e18_1px,transparent_1px)] [background-size:20px_20px]" />
    <div className="absolute top-10 left-1/4 w-32 h-48 bg-[#0f172a] border-4 border-[#3f2e18] rounded-t-full overflow-hidden">
       <div className="absolute top-4 right-6 w-6 h-6 bg-white rounded-full opacity-80 shadow-[0_0_15px_white]" />
       <div className="absolute bottom-0 w-full h-2 bg-black/50" /><div className="absolute w-2 h-full left-1/2 bg-[#3f2e18]" />
       <div className="absolute h-2 w-full top-1/2 bg-[#3f2e18]" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-[#2a1d10] border-t border-[#3f2e18]" />
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-16 bg-red-900/40 rounded-[50%]" />
  </div>
);

const getBackground = (locationId) => locationId === 'inn_room' ? InnRoomBackground : VillageRoadBackground;

const CharacterSVG = ({ equipped, appearance, isAlive }) => {
  const { gender, skinTone, hairColor, eyeColor, hairStyle } = appearance;
  const skin = APPEARANCE_OPTIONS.skinTones.find(t => t.id === skinTone) || APPEARANCE_OPTIONS.skinTones[1];
  const hair = APPEARANCE_OPTIONS.hairColors.find(c => c.id === hairColor)?.color || '#3f2307';
  const eyes = APPEARANCE_OPTIONS.eyeColors.find(c => c.id === eyeColor)?.color || '#451a03';
  const wearingHat = ['leather_cap', 'wizard_hat', 'iron_helm', 'crown'].includes(equipped.head);
  const wearingFullHelm = equipped.head === 'iron_helm';

  const getZoneStyles = () => {
    const styles = {
      head: { fill: 'url(#skin-gradient)', filter: 'none', stroke: skin.shadow }, torso: { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' }, 
      legs: { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }, pelvis: { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }, 
      arms: { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' }, boots: { fill: '#18181b', stroke: '#000000' } 
    };

    switch (equipped.body) {
      case 'tunic':
        styles.torso = { fill: '#d4d4d8', filter: 'url(#fabric-noise)', stroke: '#a1a1aa' }; styles.legs = { fill: '#525252', filter: 'url(#fabric-noise)', stroke: '#262626' }; styles.pelvis = { fill: '#525252', filter: 'url(#fabric-noise)', stroke: '#262626' }; break;
      case 'leather_armor':
        styles.torso = { fill: '#5f370e', filter: 'url(#leather-noise)', stroke: '#3f2307' }; styles.legs = { fill: '#3f2307', filter: 'url(#leather-noise)', stroke: '#271c19' }; styles.pelvis = { fill: '#3f2307', filter: 'url(#leather-noise)', stroke: '#271c19' }; styles.arms = { fill: '#5f370e', filter: 'url(#leather-noise)', stroke: '#3f2307' }; styles.boots = { fill: '#271c19', stroke: '#000000' }; break;
      case 'chainmail':
        const chainStyle = { fill: 'url(#chain-pattern)', filter: 'none', stroke: '#3f3f46' }; styles.torso = chainStyle; styles.pelvis = chainStyle; styles.arms = chainStyle; styles.legs = { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }; break;
      case 'plate':
        const plateStyle = { fill: 'url(#metal-sheen)', filter: 'none', stroke: '#27272a' }; styles.torso = plateStyle; styles.legs = plateStyle; styles.pelvis = plateStyle; styles.arms = plateStyle; styles.boots = { fill: 'url(#metal-sheen)', stroke: '#27272a' }; break;
      case 'robe':
        const robeStyle = { fill: '#312e81', filter: 'url(#fabric-noise)', stroke: '#1e1b4b' }; styles.torso = robeStyle; styles.legs = robeStyle; styles.pelvis = robeStyle; styles.arms = robeStyle; break;
    }
    if (equipped.head === 'iron_helm') styles.head = { fill: 'url(#metal-sheen)', filter: 'none', stroke: '#27272a' };
    return styles;
  };

  const s = getZoneStyles();
  let torsoPath = gender === 'female' ? `M142 80 Q 142 88 135 90 Q 115 92 112 105 Q 108 115 115 160 L 132 200 L 168 200 L 185 160 Q 192 115 188 105 Q 185 92 165 90 Q 158 88 158 80 Z` : `M142 80 Q 142 88 135 90 Q 115 92 110 105 Q 105 115 112 160 L 130 200 L 170 200 L 188 160 Q 195 115 190 105 Q 185 92 165 90 Q 158 88 158 80 Z`;
  let pelvisPath = gender === 'female' ? `M132 200 L 168 200 L 150 225 Z` : `M130 200 L 170 200 L 150 225 Z`;
  let headPath = gender === 'female' ? `M 132 60 C 132 35 168 35 168 60 C 168 75 150 85 150 85 C 150 85 132 75 132 60 Z` : null;

  return (
    <svg viewBox="0 0 300 450" className={`w-full h-full transition-all duration-1000 ${isAlive ? '' : 'grayscale opacity-50'}`} style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }}>
      <defs>
        <filter id="leather-noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" result="noise" /><feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.2 0" in="noise" result="softNoise"/><feComposite operator="in" in="softNoise" in2="SourceGraphic" result="composite"/><feBlend mode="multiply" in="composite" in2="SourceGraphic"/></filter>
        <filter id="fabric-noise"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" result="noise" /><feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.15 0" in="noise" result="softNoise"/><feComposite operator="in" in="softNoise" in2="SourceGraphic" result="composite"/><feBlend mode="multiply" in="composite" in2="SourceGraphic"/></filter>
        <linearGradient id="metal-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#52525b" /><stop offset="30%" stopColor="#e4e4e7" /><stop offset="60%" stopColor="#71717a" /><stop offset="100%" stopColor="#3f3f46" /></linearGradient>
        <radialGradient id="skin-gradient" cx="0.4" cy="0.4" r="0.8"><stop offset="0%" stopColor={skin.color} /><stop offset="100%" stopColor={skin.shadow} /></radialGradient>
        <pattern id="chain-pattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#52525b" /><circle cx="3" cy="3" r="2" fill="#71717a" /></pattern>
        <linearGradient id="gold-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#713f12" /><stop offset="40%" stopColor="#eab308" /><stop offset="50%" stopColor="#fef08a" /><stop offset="60%" stopColor="#ca8a04" /><stop offset="100%" stopColor="#713f12" /></linearGradient>
      </defs>

      <g id="legs" filter={s.legs.filter}>
        {equipped.body === 'robe' ? (
          <path d={`M125 210 L 110 390 Q 150 405 190 390 L 175 210 Z`} fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
        ) : (
          <g>
            <path d={`M${gender === 'female' ? 128 : 130} 200 Q 120 250 125 300 L 128 390 L 145 390 L 148 300 Q 150 250 ${gender === 'female' ? 148 : 148} 300 L 150 210 Z`} fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
            <path d={`M${gender === 'female' ? 172 : 170} 200 Q 180 250 175 300 L 172 390 L 155 390 L 152 300 Q 150 250 ${gender === 'female' ? 152 : 152} 300 L 150 210 Z`} fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
             {s.boots && s.boots.fill !== 'none' && (
               <g>
                 <path d="M125 300 L 128 390 L 145 390 L 148 300 Q 136 310 125 300" fill={s.boots.fill} stroke={s.boots.stroke} strokeWidth="1.5" />
                 <path d="M175 300 L 172 390 L 155 390 L 152 300 Q 164 310 175 300" fill={s.boots.fill} stroke={s.boots.stroke} strokeWidth="1.5" />
                 {equipped.body === 'plate' && ( <g stroke="#27272a" strokeWidth="1" fill="none"><path d="M126 330 L 147 330" /><path d="M127 360 L 146 360" /><path d="M153 330 L 174 330" /><path d="M154 360 L 173 360" /></g> )}
               </g>
             )}
          </g>
        )}
      </g>
      <g id="pelvis" filter={s.pelvis.filter}>{equipped.body !== 'robe' && (<path d={pelvisPath} fill={s.pelvis.fill} stroke={s.pelvis.stroke} strokeWidth="1.5" />)}</g>
      <g id="torso" filter={s.torso.filter}>
        <path d={torsoPath} fill={s.torso.fill} stroke={s.torso.stroke} strokeWidth="1.5" />
        {gender === 'female' && equipped.body !== 'plate' && ( <path d="M 128 115 Q 140 125 150 115 Q 160 125 172 115" stroke={s.torso.stroke} strokeWidth="1" fill="none" opacity="0.6" /> )}
        {(equipped.body === 'tunic' || equipped.body === 'leather_armor') && ( <path d="M150 95 L 150 200" stroke={s.torso.stroke} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" /> )}
        {equipped.body === 'plate' && ( <path d="M115 140 Q 150 160 185 140" stroke="#27272a" strokeWidth="1.5" fill="none" /> )}
      </g>
      <g id="arms" filter={s.arms.filter}>
        <path d="M110 105 Q 105 110 108 125 Q 110 145 100 190 L 95 210 L 110 210 L 120 190 Q 125 150 120 105 Z" fill={s.arms.fill} stroke={s.arms.stroke} strokeWidth="1.5" />
        <path d="M190 105 Q 195 110 192 125 Q 190 145 200 190 L 205 210 L 190 210 L 180 190 Q 175 150 180 105 Z" fill={s.arms.fill} stroke={s.arms.stroke} strokeWidth="1.5" />
        {equipped.body === 'plate' && ( <g><path d="M100 75 Q 85 85 90 115 L 120 105 Z" fill="url(#metal-sheen)" stroke="#27272a" /><path d="M200 75 Q 215 85 210 115 L 180 105 Z" fill="url(#metal-sheen)" stroke="#27272a" /></g> )}
      </g>
      <g id="hands">
         <circle cx="102" cy="215" r="8" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1"/>
         <circle cx="198" cy="215" r="8" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1"/>
      </g>
      <g id="head">
        {!wearingFullHelm && ( <g><ellipse cx="133" cy="60" rx="4" ry="7" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1" transform="rotate(-10, 133, 60)" /><ellipse cx="167" cy="60" rx="4" ry="7" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1" transform="rotate(10, 167, 60)" /></g> )}
        {headPath ? ( <path d={headPath} fill={s.head.fill} stroke={s.head.stroke} strokeWidth="1.5" /> ) : ( <ellipse cx="150" cy="60" rx="18" ry="22" fill={s.head.fill} stroke={s.head.stroke} strokeWidth="1.5" /> )}
        {!wearingFullHelm && (
           <g id="face-features">
             <path d="M138 54 Q 143 51 147 54" stroke="#3f2307" strokeWidth="1.5" fill="none" opacity="0.8" /><path d="M153 54 Q 157 51 162 54" stroke="#3f2307" strokeWidth="1.5" fill="none" opacity="0.8" />
             <circle cx="143" cy="60" r="2" fill={isAlive ? eyes : '#000'} stroke="black" strokeWidth="0.5" /><circle cx="157" cy="60" r="2" fill={isAlive ? eyes : '#000'} stroke="black" strokeWidth="0.5" />
             {isAlive && ( <><circle cx="143.5" cy="59.5" r="0.5" fill="#fff" opacity="0.6" /><circle cx="157.5" cy="59.5" r="0.5" fill="#fff" opacity="0.6" /></> )}
             {gender === 'female' && ( <g stroke={hair} strokeWidth="1"><path d="M141 58 L 139 56" /><path d="M159 58 L 161 56" /></g> )}
             {isAlive ? ( <path d="M150 60 L 149 68 L 152 70" fill="none" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> ) : ( <path d="M150 60 L 149 68 L 152 70" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> )}
             {isAlive ? ( <path d="M145 76 Q 150 79 155 76" stroke={skin.shadow} strokeWidth="1.5" fill="none" strokeLinecap="round" /> ) : ( <path d="M145 79 Q 150 76 155 79" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" /> )}
             {!wearingHat && hairStyle !== 'bald' && (
                <>
                  {hairStyle === 'short' && ( <path d="M150 35 Q 170 35 168 57 L 168 67 L 162 52 Q 150 42 138 52 L 132 67 L 132 57 Q 130 35 150 35" fill={hair} /> )}
                  {hairStyle !== 'long' && ( <path d="M150 35 Q 170 35 168 57 L 168 67 L 162 52 Q 150 42 138 52 L 132 67 L 132 57 Q 130 35 150 35" fill={hair} /> )}
                </>
             )}
             {hairStyle === 'long' && (
                <g>
                   <path d="M130 50 L 125 90 L 140 90 L 135 50" fill={hair} /><path d="M170 50 L 175 90 L 160 90 L 165 50" fill={hair} />
                   {!wearingHat && ( <path d="M150 35 Q 175 35 170 65 L 175 90 L 160 90 L 160 55 Q 150 45 140 55 L 140 90 L 125 90 L 130 65 Q 125 35 150 35" fill={hair} /> )}
                </g>
             )}
             {equipped.head === 'leather_cap' && ( <path d="M120 53 Q 150 0 180 53 L 180 58 L 120 58 Z" fill="#5f370e" stroke="#3f2307" /> )}
             {equipped.head === 'wizard_hat' && ( <g transform="translate(150, 45)"> <ellipse cx="0" cy="0" rx="35" ry="8" fill="#312e81" stroke="#1e1b4b" /><path d="M-18 0 L -2 -70 L 2 -70 L 18 0 Z" fill="#312e81" stroke="#1e1b4b" /></g> )}
             {equipped.head === 'crown' && ( <path d="M134 47 L 140 35 L 150 49 L 160 35 L 166 47 Q 150 52 134 47" fill="none" stroke="url(#gold-sheen)" strokeWidth="2" strokeLinejoin="round" /> )}
           </g>
        )}
        {wearingFullHelm && (
           <g>
             <path d="M129 35 Q 150 27 171 35 L 173 79 Q 150 87 127 79 L 129 35" fill="url(#metal-sheen)" stroke="#27272a" strokeWidth="1.5" />
             <path d="M129 52 L 171 52" stroke="#18181b" strokeWidth="2" />
             <line x1="150" y1="35" x2="150" y2="82" stroke="#18181b" strokeWidth="1" opacity="0.3" />
           </g>
        )}
      </g>
      <g id="main-hand" transform="translate(205, 200) rotate(45)">
        {equipped.mainHand === 'sword' && ( <g transform="scale(1.75) translate(0, 5)"><line x1="0" y1="10" x2="0" y2="-10" stroke="#3f2307" strokeWidth="2" /> <circle cx="0" cy="12" r="3" fill="#52525b" stroke="#27272a" strokeWidth="0.5"/><rect x="-10" y="-14" width="20" height="4" fill="#52525b" stroke="#27272a" rx="1" strokeWidth="0.5"/><path d="M-4 -14 L 4 -14 L 3 -80 L 0 -90 L -3 -80 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="0.5"/><line x1="0" y1="-14" x2="0" y2="-80" stroke="#52525b" strokeWidth="0.5" opacity="0.5" /></g> )}
        {equipped.mainHand === 'axe' && ( <g><rect x="-3" y="-15" width="6" height="120" fill="#3f2307" rx="1" transform="translate(0, -40)" /> <g transform="translate(0, -70)"><rect x="-6" y="-15" width="12" height="30" fill="#52525b" /><path d="M 6 -15 L 25 -15 Q 35 0 25 15 L 6 15 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="1.5" /><path d="M -6 -15 L -25 -15 Q -35 0 -25 15 L -6 15 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="1.5" /></g></g> )}
        {equipped.mainHand === 'staff' && ( <g><rect x="-3" y="-60" width="6" height="150" fill="#3f2307" rx="2" /><circle cx="0" cy="-60" r="10" fill="url(#skin-gradient)" /><circle cx="0" cy="-60" r="6" fill="#10b981" className="animate-pulse" /></g> )}
        {equipped.mainHand === 'dagger' && ( <g transform="scale(1.5)"><line x1="0" y1="8" x2="0" y2="-8" stroke="#3f2307" strokeWidth="2" /><circle cx="0" cy="10" r="2" fill="#52525b" /><rect x="-6" y="-10" width="12" height="2" fill="#52525b" /><path d="M-3 -10 L 3 -10 L 0 -40 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="0.5"/></g> )}
        {equipped.mainHand === 'hammer' && ( <g transform="scale(1.2)"><rect x="-3" y="-10" width="6" height="80" fill="#3f2307" transform="translate(0, -30)" /> <g transform="translate(0, -50)"><rect x="-15" y="-15" width="30" height="20" fill="#52525b" stroke="#27272a" /></g></g> )}
      </g>
      <g id="off-hand" transform="translate(95, 200) rotate(10)">
         {equipped.offHand === 'wooden_shield' && ( <g transform="translate(-20, -20)"><circle cx="20" cy="20" r="25" fill="#5f370e" stroke="#3f2307" strokeWidth="3" filter="url(#leather-noise)"/><circle cx="20" cy="20" r="5" fill="#52525b" /></g> )}
         {equipped.offHand === 'tower_shield' && ( <g transform="translate(-20, -40)"><path d="M0 0 L 40 0 L 40 80 L 20 90 L 0 80 Z" fill="url(#metal-sheen)" stroke="#27272a" strokeWidth="3" /></g> )}
         {equipped.offHand === 'orb' && ( <g transform="translate(0, -10)"><circle cx="0" cy="0" r="24" fill="#6366f1" fillOpacity="0.8" stroke="#4338ca" strokeWidth="2" /><circle cx="0" cy="0" r="16" fill="none" stroke="#c7d2fe" strokeWidth="1" className="animate-spin-slow" strokeDasharray="4 4"/></g> )}
      </g>
    </svg>
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
            <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">Start Day</button>
        </div>
      </div>
    </div>
  );
};

const CreationScreen = ({ creationStep, setCreationStep, appearance, updateAppearance, equipped, attributes, updateAttribute, pointsAvailable, getStatInfo, startGame }) => {
  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[85vh]">
            <div className="w-full md:w-1/3 bg-slate-950/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
                <h2 className="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-widest">New Adventurer</h2>
                <div className="w-48 h-72"><CharacterSVG equipped={equipped} appearance={appearance} isAlive={true} /></div>
            </div>
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex gap-4 mb-6 border-b border-slate-800">
                    <button onClick={() => setCreationStep(1)} className={`pb-2 text-sm font-bold uppercase tracking-wider ${creationStep === 1 ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500'}`}>1. Appearance</button>
                    <button onClick={() => setCreationStep(2)} className={`pb-2 text-sm font-bold uppercase tracking-wider ${creationStep === 2 ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500'}`}>2. Attributes</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {creationStep === 1 && (
                        <>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Gender</h3>
                                <div className="flex gap-2">{['male', 'female'].map(g => (<button key={g} onClick={() => updateAppearance('gender', g)} className={`flex-1 py-2 rounded border text-xs font-bold uppercase ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{g}</button>))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Skin Tone</h3>
                                <div className="flex gap-2">{APPEARANCE_OPTIONS.skinTones.map(t => (<button key={t.id} onClick={() => updateAppearance('skinTone', t.id)} className={`w-8 h-8 rounded-full border-2 ${appearance.skinTone === t.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: t.color }} />))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Eye Color</h3>
                                <div className="flex gap-2 flex-wrap">{APPEARANCE_OPTIONS.eyeColors.map(c => (<button key={c.id} onClick={() => updateAppearance('eyeColor', c.id)} className={`w-6 h-6 rounded-full border-2 ${appearance.eyeColor === c.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.color }} />))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Hair Style</h3>
                                <div className="grid grid-cols-3 gap-2">{APPEARANCE_OPTIONS.hairStyles.map(s => (<button key={s.id} onClick={() => updateAppearance('hairStyle', s.id)} className={`py-2 rounded border text-xs font-bold ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{s.label}</button>))}</div>
                            </div>
                            <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Hair Color</h3>
                                <div className="flex gap-2 flex-wrap">{APPEARANCE_OPTIONS.hairColors.map(c => (<button key={c.id} onClick={() => updateAppearance('hairColor', c.id)} className={`w-6 h-6 rounded border-2 ${appearance.hairColor === c.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.color }} />))}</div>
                            </div>
                        </>
                    )}
                    {creationStep === 2 && (
                        <>
                            <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg mb-4">
                                <span className="text-sm font-bold text-slate-300">Points Available</span>
                                <span className={`text-xl font-mono font-bold ${pointsAvailable > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>{pointsAvailable}</span>
                            </div>
                            {Object.keys(attributes).map(attr => (
                                <div key={attr} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                                    <div className="flex flex-col"><span className="text-sm font-bold text-white uppercase">{attr}</span><span className="text-[10px] text-slate-500">{getStatInfo(attr).desc}</span></div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => updateAttribute(attr, -1)} className="p-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300"><Minus size={14} /></button>
                                        <span className="w-4 text-center font-mono font-bold text-white">{attributes[attr]}</span>
                                        <button onClick={() => updateAttribute(attr, 1)} className="p-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300" disabled={pointsAvailable <= 0}><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                    {creationStep === 1 ? ( <button onClick={() => setCreationStep(2)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">Next: Attributes</button> ) : ( <button onClick={startGame} disabled={pointsAvailable > 0} className={`px-6 py-3 font-bold rounded-lg transition-colors ${pointsAvailable > 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>Start Adventure</button> )}
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
      <div className="absolute top-[140px] md:top-[90px] left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-auto w-full max-w-sm px-4">
        {messages.map(m => (
          <div key={m.id} className={`p-3 rounded-lg shadow-lg text-sm font-bold text-center animate-in slide-in-from-top-4 fade-in backdrop-blur-md border ${
            m.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-red-100' :
            m.type === 'success' ? 'bg-emerald-900/80 border-emerald-500/50 text-emerald-100' :
            m.type === 'warning' ? 'bg-amber-900/80 border-amber-500/50 text-amber-100' :
            'bg-indigo-900/80 border-indigo-500/50 text-indigo-100'
          }`}>
            {m.text}
          </div>
        ))}
      </div>

      {/* Top HUD Layer */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2 md:p-4 pointer-events-none flex flex-col gap-2">
        <header className="pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-2 md:gap-4 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 md:gap-4">
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Time</span>
                    <span className="text-lg md:text-xl font-bold text-indigo-400">Day {days}</span>
                </div>
                <div className="w-px h-6 md:h-8 bg-slate-700/50 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Location</span>
                    <span className="text-xs md:text-sm font-bold text-slate-200">{LOCATIONS[location]?.name}</span>
                </div>
                <div className="w-px h-6 md:h-8 bg-slate-700/50 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Housing</span>
                    <span className={`text-xs md:text-sm font-bold ${housing === 'homeless' ? 'text-amber-500' : 'text-emerald-400'}`}>
                        {housing === 'inn' ? 'Inn Room' : housing === 'estate' ? 'Estate' : 'Homeless'}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6 bg-slate-950/50 px-3 py-1.5 md:py-2 rounded-xl border border-slate-800/50">
                <div className="flex items-center gap-2">
                    <div className="p-1 md:p-1.5 bg-amber-500/20 rounded-md text-amber-400"><Coins size={14} className="md:w-4 md:h-4" /></div>
                    <span className="text-base md:text-lg font-mono font-bold text-amber-400">{resources.gold}g</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-1 md:p-1.5 bg-cyan-500/20 rounded-md text-cyan-400"><Activity size={14} className="md:w-4 md:h-4" /></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-bold text-cyan-400">Lv {resources.level}</span>
                        <span className="text-[8px] md:text-[9px] text-cyan-200/50 font-mono">{resources.xp}/{resources.level*100}</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Meters (Mobile Only) */}
        <div className="md:hidden pointer-events-auto bg-slate-900/60 backdrop-blur-md border border-slate-700/30 rounded-2xl py-2 px-3 shadow-xl shadow-black/20 flex justify-center gap-2 max-w-fit mx-auto">
            {metersContent}
        </div>
      </div>

      {/* Meters (Desktop Only - Left Side) */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-6 z-20 pointer-events-auto bg-slate-900/60 backdrop-blur-md border border-slate-700/30 rounded-3xl p-3 shadow-xl shadow-black/20 flex-col gap-3">
          {metersContent}
      </div>

      {/* Main Character Layer */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-end pt-[160px] pb-[100px] md:pt-[100px] md:pb-[40px] pointer-events-none">
          {quirk && (
             <div className="absolute top-[125px] md:top-[90px] bg-indigo-900/80 backdrop-blur-md border border-indigo-500/30 text-indigo-200 text-[10px] px-3 py-1 rounded-full font-bold shadow-lg shadow-indigo-500/20 z-10">
                Trait: {quirk.name}
             </div>
          )}
          {isDead && (
             <div className="absolute inset-0 bg-red-950/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-auto">
                <Skull size={64} className="text-red-500 mb-6 animate-bounce" />
                <h2 className="text-4xl font-bold text-red-500 mb-4 drop-shadow-lg">You Died.</h2>
                <button onClick={revive} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105 active:scale-95">Revive (Cost: 50 XP)</button>
             </div>
          )}
          
          {/* Main SVG Container */}
          <div className="w-full h-full flex items-end justify-center transition-all duration-500">
             <div className="w-auto h-full max-h-[600px] aspect-[2/3] max-w-[95vw]">
                <CharacterSVG equipped={equipped} appearance={appearance} isAlive={!isDead} />
             </div>
          </div>
      </div>

      {/* Navigation Layer (Mobile: Bottom, Desktop: Right) */}
      <div className="absolute bottom-6 md:bottom-auto md:top-1/2 left-1/2 md:left-auto md:right-6 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-20 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-2xl flex flex-row md:flex-col gap-2 shadow-black/50">
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
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 border border-indigo-400' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                      }`}
                  >
                      <Icon size={isActive ? 24 : 20} className="mb-1" />
                      <span className="text-[9px] md:text-[10px] font-bold tracking-wider">{tab.label}</span>
                  </button>
                );
              })}
          </div>
      </div>

      {/* Full Screen Overlay Modals */}
      {openPanel && (
          <div className="absolute inset-0 z-30 pointer-events-none flex justify-center items-end sm:items-center p-2 sm:p-6 pb-28 sm:pb-6">
              
              <div className="absolute inset-0 bg-slate-950/60 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={() => setOpenPanel(null)} />
              
              <div className="pointer-events-auto relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 rounded-3xl sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
                 
                 <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-700/50 bg-slate-950/50 shadow-sm">
                     <h2 className="font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                        {openPanel === 'actions' && <Tent size={18}/>}
                        {openPanel === 'inventory' && <Backpack size={18}/>}
                        {openPanel === 'shop' && <Store size={18}/>}
                        {openPanel === 'log' && <List size={18}/>}
                        {openPanel}
                     </h2>
                     <button onClick={() => setOpenPanel(null)} className="p-2 bg-slate-800 rounded-full hover:bg-red-900/50 hover:text-red-400 transition-colors border border-slate-700">
                         <X size={16} strokeWidth={3} />
                     </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
                     
                     {/* --- ACTIONS PANEL --- */}
                     {openPanel === 'actions' && (
                        <>
                           <div>
                              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">Maintenance</h3>
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
                                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Hammer size={14}/> Labor (STR/CON)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.labor.map(q => <ActionButton key={q.id} {...q} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests.adventure.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Shield size={14}/> Adventure (STR/DEX/AC)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.adventure.map(q => <ActionButton key={q.id} {...q} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests.social.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={14}/> Social (CHA)</h3>
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
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Equipped</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(equipped).map(([slot, itemId]) => {
                                        const item = ITEM_DB[slot].find(i => i.id === itemId);
                                        return (
                                            <div key={slot} className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-inner">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">{slot}</span>
                                                <span className="text-sm font-bold text-slate-200">{item ? item.name : 'None'}</span>
                                                {item && renderItemStats(item)}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Backpack</h3>
                                {inventory.filter(id => id !== 'none' && id !== 'fist').length === 0 ? (
                                    <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
                                        <p className="text-sm text-slate-500 font-medium">Your backpack is empty.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inventory.filter(id => id !== 'none' && id !== 'fist').map((itemId, idx) => {
                                            const item = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies].find(i => i.id === itemId);
                                            if(!item) return null;
                                            const isEquipped = Object.values(equipped).includes(itemId);
                                            return (
                                                <div key={idx} className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 flex flex-col shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="font-bold text-sm text-slate-200 block">{item.name}</span>
                                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.category}</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-900/20 px-2 py-1 rounded-md border border-amber-500/20">{Math.floor(item.cost/2)}g Value</span>
                                                    </div>
                                                    {renderItemStats(item)}
                                                    <div className="mt-4 flex gap-2">
                                                        {['head', 'body', 'mainHand', 'offHand'].includes(item.type) && (
                                                            <button onClick={() => equipItem(item)} disabled={isEquipped} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${isEquipped ? 'bg-indigo-900/30 text-indigo-400/50 border border-indigo-500/20 cursor-not-allowed' : 'bg-slate-700 text-slate-200 hover:bg-indigo-600 hover:text-white shadow-sm'}`}>
                                                                {isEquipped ? 'Equipped' : 'Equip'}
                                                            </button>
                                                        )}
                                                        {(item.type === 'food' || item.type === 'drink' || item.type === 'potion') && (
                                                            <button onClick={() => consumeItem(item)} className="flex-1 py-2 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                                                                Consume
                                                            </button>
                                                        )}
                                                        {!isEquipped && (
                                                            <button onClick={() => sellItem(item)} className="px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 hover:bg-amber-600 hover:text-white hover:border-amber-500 rounded-lg text-xs font-bold transition-colors shadow-sm">
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Market</h3>
                                    <p className="text-[10px] text-slate-400 mt-1">Stock refreshes every day.</p>
                                </div>
                                <button onClick={() => passTime(1)} className="text-[10px] bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold transition-colors shadow-sm flex items-center gap-2">
                                    <Clock size={12}/> Skip Day (Refresh)
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
                                        <div key={itemId} className={`bg-slate-800/90 border rounded-xl p-4 flex flex-col justify-between shadow-sm transition-colors ${canAfford ? 'border-slate-600 hover:border-indigo-500/50' : 'border-slate-700/50 opacity-75'}`}>
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-bold text-sm text-slate-200 block">{item.name}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.category}</span>
                                                    </div>
                                                    <span className={`text-[11px] font-mono font-bold px-2 py-1 rounded-md border ${canAfford ? 'text-amber-400 bg-amber-900/20 border-amber-500/30' : 'text-red-400 bg-red-900/20 border-red-500/30'}`}>
                                                        {cost}g
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">{item.description}</p>
                                                {renderItemStats(item)}
                                            </div>
                                            <button onClick={() => buyItem(item)} disabled={!canAfford || isDead} className={`mt-4 w-full py-2.5 rounded-lg text-xs font-bold transition-colors ${canAfford && !isDead ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white shadow-sm' : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'}`}>
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
                                <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
                                    <p className="text-sm text-slate-500 font-medium">No events recorded yet.</p>
                                </div>
                            ) : (
                                dailyLogs.map(log => (
                                    <div key={log.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${log.type === 'morning' ? 'bg-amber-900/30 text-amber-400 border border-amber-500/20' : 'bg-slate-900 text-slate-400 border border-slate-700'}`}>
                                                {log.type === 'morning' ? 'Morning Report' : 'Action Log'}
                                            </span>
                                            <span className="text-[10px] font-mono font-medium text-slate-500">Day {log.day}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-200">{log.title || log.incidentTitle}</p>
                                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{log.text || log.incidentText}</p>
                                        {(log.changes || log.status !== 'Success') && (
                                            <div className={`mt-3 p-2 rounded-lg text-[10px] font-bold border ${log.status === 'Failed' ? 'bg-red-900/10 text-red-400 border-red-500/10' : 'bg-indigo-900/10 text-indigo-300 border-indigo-500/10'}`}>
                                                {log.changes || log.status}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            <div className="flex justify-center mt-8 pt-4 border-t border-slate-700/50">
                                <button onClick={resetGame} className="text-[10px] text-red-500/60 hover:text-red-400 font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
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
