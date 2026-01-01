import React from 'react';
import { 
  Clock, HelpCircle
} from 'lucide-react';

/* -------------------------------------------------------------------------
   COMPONENT LIBRARY: GameUI
   Contains reusable UI elements for the Adventurer Sim to clean up App.jsx.
   ------------------------------------------------------------------------- */

// Helper for rendering effects (used in ActionButton and renderItemStats)
const renderEffectsList = (effects) => {
    if (!effects) return null;
    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(effects).map(([key, val]) => {
                if (val === 0) return null;
                let isGood = false;
                // Determine if the effect is positive or negative for the player
                if (['health', 'mood', 'xp', 'gold', 'ac', 'str', 'dex', 'con', 'int', 'cha'].includes(key)) isGood = val > 0;
                else if (['hunger', 'thirst', 'stress'].includes(key)) isGood = val < 0;
                
                // Format the label
                let label = key.charAt(0).toUpperCase() + key.slice(1);
                if (key === 'xp') label = 'XP';
                if (key === 'ac') label = 'AC';
                if (['str', 'dex', 'con', 'int', 'cha'].includes(key)) label = key.toUpperCase();

                return (
                    <span key={key} className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isGood ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                        {label} {val > 0 ? '+' : ''}{val}
                    </span>
                );
            })}
        </div>
    );
};

export const StatBlock = ({ label, value, max, alert, inverted, onClick, subValue }) => (
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

export const ActionButton = ({ icon: Icon, label, days, cost, costType = 'gp', onClick, disabled, description, effects }) => (
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
      <div className="flex justify-between items-center mb-0.5">
        <span className="font-bold text-xs truncate">{label}</span>
        {days > 0 && <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Clock size={10}/> {days}d</span>}
      </div>
      <span className="text-[10px] text-slate-500 truncate leading-tight">{description}</span>
      {effects && renderEffectsList(effects)}
    </div>
    {cost > 0 && (
      <div className={`text-[10px] font-mono px-2 py-1 rounded ml-2 ${disabled ? 'bg-slate-700' : 'bg-black/40'} ${costType === 'gp' ? 'text-amber-400' : 'text-cyan-400'}`}>
        -{cost}{costType}
      </div>
    )}
  </button>
);

export const renderItemStats = (item) => {
  if (item.stats) return renderEffectsList(item.stats);
  if (item.effects) return renderEffectsList(item.effects);
  return null;
};
