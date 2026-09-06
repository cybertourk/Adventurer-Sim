import React, { useState, useEffect } from 'react';
import { Clock, HelpCircle, Minus, Plus, Sun, X, Shield, Hammer, Scroll, Zap, Heart, User, Coins, DollarSign, Activity, Tent, Droplets, Beer, Skull, Utensils, Backpack, Store, List, TrendingUp } from 'lucide-react';
import { ITEM_DB, MAINTENANCE_ACTIONS, LOCATIONS, COMPANIONS, CURSES } from './data/constants';
import { useGameLogic } from './hooks/useGameLogic';
import CharacterCanvas from './components/CharacterCanvas';
import CreationScreen from './components/CreationScreen';

const IconMap = { Clock, HelpCircle, Minus, Plus, Sun, X, Shield, Hammer, Scroll, Zap, Heart, User, Coins, DollarSign, Activity, Tent, Droplets, Beer, Skull, Utensils, Backpack, Store, List, Zap, TrendingUp };

const renderEffectsList = (effects) => {
    if (!effects) return null;
    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(effects).map(([key, val]) => {
                if (val === 0 || typeof val === 'boolean' || typeof val === 'string') return null;
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

const renderArrayBadges = (changesArr) => {
    if (!changesArr || changesArr.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {changesArr.map((change, i) => {
                const isBad = (change.includes('-') && (change.includes('Health') || change.includes('Mood') || change.includes('Gold') || change.includes('XP') || change.includes('Lost'))) || 
                              (change.includes('+') && (change.includes('Stress') || change.includes('Hunger') || change.includes('Thirst')));
                const isGood = (change.includes('+') && (change.includes('Health') || change.includes('Mood') || change.includes('Gold') || change.includes('XP'))) || 
                               (change.includes('-') && (change.includes('Stress') || change.includes('Hunger') || change.includes('Thirst'))) || change.includes('Cured');
                
                let colorClass = 'bg-zinc-900/50 text-zinc-400 border-zinc-800';
                if (isGood) colorClass = 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50';
                if (isBad) colorClass = 'bg-red-950/50 text-red-400 border-red-900/50';

                return <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${colorClass}`}>{change}</span>;
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

const AttributeBlock = ({ label, value, onClick, onPlus }) => (
    <div className="relative group">
        <button onClick={onClick} className="flex flex-col items-center justify-center w-[42px] h-[42px] md:w-[60px] md:h-[60px] bg-zinc-900/90 rounded-xl md:rounded-2xl border border-indigo-900/50 hover:border-indigo-500 shadow-sm transition-all hover:scale-105 active:scale-95">
            <span className="text-[8px] md:text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{label}</span>
            <span className="text-xs md:text-base font-bold font-mono text-indigo-100">{value}</span>
        </button>
        {onPlus && (
            <button onClick={(e) => { e.stopPropagation(); onPlus(); }} className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-[0_0_10px_rgba(52,211,153,0.5)] hover:bg-emerald-400 hover:scale-110 transition-all z-10 animate-bounce">
                <Plus size={12} strokeWidth={3} />
            </button>
        )}
    </div>
);

const ActionButton = ({ icon: IconName, label, days, cost, costType = 'gp', onClick, disabled, description, effects, successRate }) => {
  const Icon = IconMap[IconName] || HelpCircle;
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center gap-3 p-3 w-full rounded-lg border text-left transition-all relative overflow-hidden group ${disabled ? 'bg-zinc-900/80 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-70' : 'bg-zinc-800/90 border-zinc-600 text-zinc-200 hover:bg-indigo-950/50 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
      <div className={`p-2 rounded-md ${disabled ? 'bg-zinc-800' : 'bg-zinc-950 group-hover:text-indigo-400'}`}><Icon size={18} /></div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
            <span className="font-bold text-xs truncate">{label}</span>
            <div className="flex items-center gap-2">
                {successRate !== undefined && successRate !== null && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${successRate >= 80 ? 'bg-emerald-900/30 text-emerald-400 border-emerald-900/50' : successRate >= 50 ? 'bg-amber-900/30 text-amber-400 border-amber-900/50' : 'bg-red-900/30 text-red-400 border-red-900/50'}`}>
                        {successRate}% Success
                    </span>
                )}
                {days > 0 && <span className="text-[9px] text-zinc-400 flex items-center gap-0.5"><Clock size={10}/> {days}d</span>}
            </div>
        </div>
        <span className="text-[10px] text-zinc-500 truncate leading-tight">{description}</span>{effects && renderEffectsList(effects)}
      </div>
      {cost > 0 && <div className={`text-[10px] font-mono px-2 py-1 rounded ml-2 ${disabled ? 'bg-zinc-800' : 'bg-black/60'} ${costType === 'gp' ? 'text-amber-500' : 'text-cyan-500'}`}>-{cost}{costType}</div>}
    </button>
  );
};

const StatRow = ({ label, value, colorClass }) => (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-3 flex justify-between items-center shadow-[0_2px_5px_rgba(0,0,0,0.2)]">
        <span className="text-xs text-zinc-300 font-bold tracking-wide">{label}</span>
        <span className={`font-mono font-black text-lg ${colorClass}`}>{value}</span>
    </div>
);

const RollModal = ({ action, rollState, calculateOdds, executeRoll, finalizeAction, setStagedAction }) => {
    if (!action) return null;
    const odds = calculateOdds(action);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col">
                <div className="bg-indigo-950/40 p-5 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-indigo-400 uppercase tracking-widest leading-tight">{action.label}</h2>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{action.type} Check</span>
                    </div>
                    {!rollState.result && !rollState.isRolling && (
                        <button onClick={() => setStagedAction(null)} className="text-zinc-500 hover:text-zinc-300 bg-zinc-800/80 p-2 rounded-full transition-colors"><X size={16} strokeWidth={3}/></button>
                    )}
                </div>

                <div className="p-6 space-y-5 bg-gradient-to-b from-transparent to-zinc-950/50">
                    <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block mb-1">Target Number</span>
                        <span className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{odds.finalSuccessRate}%</span>
                        <span className="text-xs text-zinc-500 block mt-1">Roll Equal or Under to Succeed</span>
                    </div>

                    <div className="space-y-2.5 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 font-mono text-xs shadow-inner">
                        <div className="flex justify-between text-zinc-400">
                            <span>Base Chance</span><span>{odds.baseSuccess}%</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                            <span>Attribute Bonus</span><span>+{odds.attrBonus}%</span>
                        </div>
                        {odds.stressPenalty < 0 && (
                            <div className="flex justify-between text-amber-400 font-bold">
                                <span>Stress Penalty</span><span>{odds.stressPenalty}%</span>
                            </div>
                        )}
                        {odds.miscPenalty < 0 && (
                            <div className="flex justify-between text-red-400 font-bold">
                                <span>Misc Penalty</span><span>{odds.miscPenalty}%</span>
                            </div>
                        )}
                        <div className="h-px w-full bg-zinc-800 my-2" />
                        <div className="flex justify-between text-white font-black text-sm">
                            <span>Final Success Rate</span><span className={odds.finalSuccessRate >= 50 ? 'text-emerald-400' : 'text-red-400'}>{odds.finalSuccessRate}%</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center h-28 border border-zinc-800 rounded-xl bg-zinc-950/50 relative overflow-hidden">
                        {rollState.isRolling ? (
                            <div className="text-3xl font-black text-indigo-400 animate-pulse tracking-widest drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">ROLLING...</div>
                        ) : rollState.result !== null ? (
                            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">You Rolled</span>
                                <span className="text-6xl font-black text-white drop-shadow-lg leading-none">{rollState.result}</span>
                                <span className={`text-sm font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-md border ${rollState.isSuccess ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50' : 'bg-red-950/50 text-red-500 border-red-900/50'}`}>
                                    {rollState.isSuccess ? 'Success' : 'Failed'}
                                </span>
                            </div>
                        ) : (
                            <span className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Awaiting Roll</span>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex justify-center">
                    {!rollState.result && !rollState.isRolling ? (
                        <button onClick={executeRoll} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-95 text-lg">Roll d100</button>
                    ) : rollState.result !== null ? (
                        <button onClick={finalizeAction} className={`w-full py-4 font-bold tracking-widest uppercase rounded-xl transition-all hover:scale-[1.02] active:scale-95 text-lg shadow-lg ${rollState.isSuccess ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-zinc-700 hover:bg-zinc-600 text-white shadow-zinc-900/50'}`}>Continue</button>
                    ) : (
                        <button disabled className="w-full py-4 bg-zinc-800 text-zinc-600 font-bold tracking-widest uppercase rounded-xl cursor-not-allowed text-lg">Rolling...</button>
                    )}
                </div>
            </div>
        </div>
    );
};

const DailySummaryModal = ({ reportDay, dailyLogs, onClose, currentStats, activeCompanion, activeCurse }) => {
    const dayLogs = dailyLogs.filter(l => l.day === reportDay);
    const actionLogs = dayLogs.filter(l => l.type !== 'night');
    const nightLog = dayLogs.find(l => l.type === 'night');

    const statsToDisplay = nightLog?.endOfDayStats || currentStats;
    const compToDisplay = nightLog?.endOfDayCompanion !== undefined ? nightLog.endOfDayCompanion : activeCompanion;
    const curseToDisplay = nightLog?.endOfDayCurse !== undefined ? nightLog.endOfDayCurse : activeCurse;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[85vh] shadow-2xl relative overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-indigo-900/40 to-zinc-900 p-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400 border border-indigo-500/30"><Scroll size={24} /></div>
                        <div><h2 className="text-xl font-bold text-white tracking-wide">Day {reportDay} Record</h2><div className="text-[10px] text-indigo-200/60 font-mono uppercase tracking-widest">Full Daily Summary</div></div>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white p-2 bg-zinc-800 rounded-full transition-colors"><X size={16}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 scroll-smooth">
                    <section>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Daytime Activities</h3>
                        <div className="space-y-3">
                            {actionLogs.length === 0 ? <p className="text-xs text-zinc-600 italic">No actions recorded.</p> : actionLogs.map((log, i) => (
                                <div key={i} className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-3 shadow-inner">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="font-bold text-sm text-zinc-200">{log.title}</span>
                                        {log.status && <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${log.status === 'Success' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50' : 'bg-red-950/50 text-red-400 border-red-900/50'}`}>{log.status}</span>}
                                    </div>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed italic">"{log.text}"</p>
                                    {renderArrayBadges(log.changesArr)}
                                </div>
                            ))}
                        </div>
                    </section>

                    {nightLog && (
                        <section>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">The Night Phase</h3>
                            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4 shadow-inner space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><span className="block text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Sleep Loc</span><span className="text-sm font-bold text-zinc-200">{nightLog.sleepLoc}</span></div>
                                    <div><span className="block text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Rent</span><span className="text-sm font-mono text-amber-400">{nightLog.rent}</span></div>
                                </div>
                                <div className="h-px bg-zinc-800 w-full" />
                                <div>
                                    <span className="font-bold text-sm text-zinc-200 block mb-1">{nightLog.incidentTitle}</span>
                                    <p className="text-xs text-zinc-400 italic">"{nightLog.incidentText}"</p>
                                </div>
                                {renderArrayBadges(nightLog.changesArr)}
                            </div>
                        </section>
                    )}
                    
                    <section>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Waking Status (Day {reportDay + 1})</h3>
                        <div className="grid grid-cols-5 gap-1.5 mb-3">
                            <div className="bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg text-center flex flex-col items-center">
                                <span className="text-[8px] text-red-400 font-bold uppercase mb-1">HP</span><span className="text-xs font-mono font-bold text-white">{statsToDisplay.health}</span>
                            </div>
                            <div className="bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg text-center flex flex-col items-center">
                                <span className="text-[8px] text-amber-500 font-bold uppercase mb-1">HNG</span><span className="text-xs font-mono font-bold text-white">{statsToDisplay.hunger}</span>
                            </div>
                            <div className="bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg text-center flex flex-col items-center">
                                <span className="text-[8px] text-blue-400 font-bold uppercase mb-1">THR</span><span className="text-xs font-mono font-bold text-white">{statsToDisplay.thirst}</span>
                            </div>
                            <div className="bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg text-center flex flex-col items-center">
                                <span className="text-[8px] text-indigo-400 font-bold uppercase mb-1">MOOD</span><span className="text-xs font-mono font-bold text-white">{statsToDisplay.mood}</span>
                            </div>
                            <div className="bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg text-center flex flex-col items-center">
                                <span className="text-[8px] text-zinc-400 font-bold uppercase mb-1">STRS</span><span className="text-xs font-mono font-bold text-white">{statsToDisplay.stress}</span>
                            </div>
                        </div>
                        
                        {(compToDisplay || curseToDisplay) && (
                            <div className="flex gap-2">
                                {compToDisplay && (
                                    <div className="flex-1 bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg text-center">
                                        <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest block mb-1">Companion</span>
                                        <span className="text-[10px] font-bold text-zinc-300 truncate block">{COMPANIONS[compToDisplay].name}</span>
                                    </div>
                                )}
                                {curseToDisplay && (
                                    <div className="flex-1 bg-zinc-950/80 border border-zinc-800 p-2 rounded-lg text-center">
                                        <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest block mb-1">Curse</span>
                                        <span className="text-[10px] font-bold text-zinc-300 truncate block">{CURSES[curseToDisplay].name}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
                
                <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex justify-end shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest uppercase rounded-lg transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)] text-xs">Start Day</button>
                </div>
            </div>
        </div>
    );
};

const renderItemStats = (item) => renderEffectsList(item.stats || item.effects);

const getItemCategoryTab = (item) => {
    if (!item) return 'All';
    const itemId = String(item.id || '');
    const itemCat = String(item.category || '');
    const itemType = String(item.type || '');
    
    if (itemId.includes('robe') || itemCat === 'Arcane Focus' || itemId === 'staff' || itemId.includes('hat')) return 'Magic';
    if (itemType === 'head' || itemType === 'body') return 'Armor';
    if (itemType === 'mainHand') return 'Weapons';
    if (itemType === 'offHand') return 'Shields';
    if (itemType === 'food' || itemType === 'drink' || itemType === 'potion') return 'Supplies';
    
    return 'All';
};

const getSerial = (id) => {
    if (!id) return '';
    return id.split('_')[1]?.substring(0,4).toUpperCase() || id.slice(-4).toUpperCase();
};

const ResponsiveBackground = ({ locationId }) => {
    const baseUrl = import.meta.env.BASE_URL;
    let bgImage = `${baseUrl}bg_village.png`;
    
    if (locationId === 'inn_room') bgImage = `${baseUrl}bg_inn.png`;
    else if (locationId === 'estate') bgImage = `${baseUrl}bg_estate.png`;

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#09090b]">
            <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full min-w-[1440px] min-h-[810px] md:min-w-[1920px] md:min-h-[1080px]"
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

const App = () => {
  const {
    gameStarted, setGameStarted, creationStep, setCreationStep, characterName, setCharacterName, edgyName, attributes, updateAttribute,
    stats, setStats, resources, inventory, shopStock, equipped, equipItem,
    appearance, updateAppearance, days, location, housing, rentActive, dailyQuests, messages,
    isDead, maxStats, currentStats, dailyLogs, setDailyLogs, quirk, activeCompanion, companionVariant, activeCurse,
    curseVariant, shitfacedToday, performAction, revive, buyItem, sellItem, consumeItem, startGame, resetGame, pointsAvailable,
    stagedAction, setStagedAction, rollState, calculateOdds, executeRoll, finalizeAction, reportData, setReportData, passTime, gameStats
  } = useGameLogic();

  const [openPanel, setOpenPanel] = useState(null);
  const [activeDetailModal, setActiveDetailModal] = useState(null);
  const [inventoryTab, setInventoryTab] = useState('All');
  const [shopTab, setShopTab] = useState('All');
  const [logTab, setLogTab] = useState('daily');

  const resolveItemId = (instanceId) => {
      if (!instanceId) return 'none';
      if (instanceId.startsWith('inst_') && ['none', 'tunic', 'fist', 'cultist_robe'].includes(instanceId.replace('inst_', ''))) {
          return instanceId.replace('inst_', '');
      }
      const invItem = inventory.find(i => i.instanceId === instanceId);
      return invItem ? invItem.itemId : 'none';
  };

  const resolvedEquipped = {
      head: resolveItemId(equipped.head),
      body: resolveItemId(equipped.body),
      mainHand: resolveItemId(equipped.mainHand),
      offHand: resolveItemId(equipped.offHand)
  };

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

  const getAttributeTotal = (attrKey) => currentStats[attrKey] || 0;

  const getModalDetails = (statKey) => {
      let isAttribute = ['str', 'dex', 'con', 'int', 'cha', 'ac'].includes(statKey);
      let isMeter = ['health', 'hunger', 'thirst', 'mood', 'stress'].includes(statKey);

      let details = { title: '', description: '', base: 0, modifiers: [], total: 0 };

      if (isAttribute) {
          details.title = getStatInfo(statKey).name;
          details.description = getStatInfo(statKey).desc;
          details.base = statKey === 'ac' ? 10 + Math.floor(((attributes.dex || 10) - 10)/2) : (attributes[statKey] || 0);
          details.total = currentStats[statKey] || 0;
          
          if (quirk && quirk.effects?.stats && quirk.effects.stats[statKey]) {
              details.modifiers.push({ source: `Trait: ${quirk.name}`, value: quirk.effects.stats[statKey] });
          }

          Object.entries(resolvedEquipped).forEach(([slot, itemId]) => {
              if (itemId !== 'none' && itemId !== 'fist' && itemId !== 'tunic') {
                  let item = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand].find(i => i.id === itemId);
                  if (item && item.stats && item.stats[statKey]) {
                      details.modifiers.push({ source: item.name, value: item.stats[statKey] });
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
      }

      return details;
  };
  
  const currentLoc = housing === 'inn' ? 'inn_room' : housing === 'estate' ? 'estate' : 'village_road';
  const isMaintenanceDisabled = (action) => {
      if (isDead) return true;
      if (action.cost > 0 && resources.gold < action.cost) return true;
      if (action.id === 'shitfaced' && shitfacedToday) return true;
      if (action.reqLocation && action.reqLocation !== 'any' && action.reqLocation !== currentLoc) return true;
      return false;
  };

  const groupedLogs = dailyLogs.reduce((acc, log) => {
      if (!acc[log.day]) acc[log.day] = { day: log.day, logs: [] };
      acc[log.day].logs.push(log);
      return acc;
  }, {});
  const sortedDays = Object.values(groupedLogs).sort((a,b) => b.day - a.day);

  if (!gameStarted) {
    return (
      <CreationScreen 
        creationStep={creationStep} setCreationStep={setCreationStep} characterName={characterName} setCharacterName={setCharacterName} appearance={appearance} updateAppearance={updateAppearance} 
        equipped={resolvedEquipped} attributes={attributes} updateAttribute={updateAttribute} pointsAvailable={pointsAvailable} 
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
    </>
  );

  const attributesContent = (
    <>
         {['str', 'dex', 'con', 'int', 'cha', 'ac'].map(attr => (
             <AttributeBlock 
                 key={attr} label={attr} value={getAttributeTotal(attr)} 
                 onClick={() => setActiveDetailModal(attr)} 
                 onPlus={attr !== 'ac' && pointsAvailable > 0 ? () => updateAttribute(attr, 1) : null}
             />
         ))}
    </>
  );

  const displayedInventory = inventory
      .filter(invItem => !['inst_none', 'inst_tunic', 'inst_fist', 'inst_cultist_robe'].includes(invItem.instanceId))
      .map(invItem => {
          const dbItem = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies].find(i => i.id === invItem.itemId);
          return dbItem ? { ...dbItem, instanceId: invItem.instanceId, displayName: invItem.displayName } : null;
      })
      .filter(Boolean)
      .filter(item => inventoryTab === 'All' || getItemCategoryTab(item) === inventoryTab);

  const displayedShop = shopStock
      .map(shopItem => {
          const dbItem = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies].find(i => i.id === shopItem.itemId);
          return dbItem ? { ...dbItem, instanceId: shopItem.instanceId, displayName: shopItem.displayName } : null;
      })
      .filter(Boolean)
      .filter(item => shopTab === 'All' || getItemCategoryTab(item) === shopTab);

  const modalDetails = activeDetailModal ? getModalDetails(activeDetailModal) : null;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden text-zinc-200 font-sans select-none selection:bg-indigo-500/30">
      
      <ResponsiveBackground locationId={location} />
      
      {reportData && (
          <DailySummaryModal 
              reportDay={reportData} 
              dailyLogs={dailyLogs} 
              onClose={() => setReportData(null)} 
              currentStats={currentStats}
              activeCompanion={activeCompanion}
              activeCurse={activeCurse}
          />
      )}

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

      <div className="absolute top-0 left-0 right-0 z-10 p-2 md:p-4 pointer-events-none flex flex-col items-center">
        <header className="pointer-events-auto bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/60 rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-wrap items-center justify-center gap-3 md:gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] w-fit max-w-[96vw]">
            <div className="flex items-center gap-3 md:gap-5">
                <div className="flex flex-col pr-3 md:pr-4 border-r border-zinc-700/60">
                    <span className="text-[10px] md:text-xs font-bold text-zinc-200 leading-tight truncate max-w-[70px] md:max-w-[100px]">{edgyName ? edgyName.first : (characterName.first || 'Unknown')}</span>
                    <span className="text-[10px] md:text-xs font-bold text-zinc-400 leading-tight truncate max-w-[70px] md:max-w-[100px]">{edgyName ? edgyName.last : (characterName.last || 'Adventurer')}</span>
                </div>
                
                <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Time</span>
                    <span className="text-sm md:text-xl font-bold text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] whitespace-nowrap">Day {days}</span>
                </div>
                
                <div className="w-px h-6 md:h-8 bg-zinc-700/60 hidden sm:block"></div>
                
                <div className="hidden sm:flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Location</span>
                    <span className="text-xs md:text-sm font-bold text-zinc-200">{LOCATIONS[location]?.name}</span>
                </div>

                <div className="hidden sm:flex flex-col">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Housing</span>
                    <span className={`text-xs md:text-sm font-bold ${housing === 'homeless' ? 'text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]' : 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]'}`}>
                        {housing === 'inn' ? 'Inn Room' : housing === 'estate' ? 'Estate' : 'Homeless'}
                    </span>
                </div>

                <div className="flex sm:hidden flex-col border-l border-zinc-700/60 pl-3">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest truncate max-w-[70px]">{LOCATIONS[location]?.name}</span>
                    <span className={`text-[10px] font-bold ${housing === 'homeless' ? 'text-amber-500' : 'text-emerald-400'}`}>
                        {housing === 'inn' ? 'Inn' : housing === 'estate' ? 'Estate' : 'Homeless'}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-6 bg-zinc-950/70 px-2 py-1 md:py-2 rounded-lg md:rounded-xl border border-zinc-800/80 shadow-inner">
                <div className="flex items-center gap-1 md:gap-2">
                    <div className="p-1 md:p-1.5 bg-amber-500/20 rounded-md md:rounded-lg text-amber-400 border border-amber-500/30"><Coins size={12} className="md:w-4 md:h-4" /></div>
                    <span className="text-xs md:text-lg font-mono font-bold text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]">{resources.gold}g</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                    <div className="p-1 md:p-1.5 bg-cyan-500/20 rounded-md md:rounded-lg text-cyan-400 border border-cyan-500/30"><Activity size={12} className="md:w-4 md:h-4" /></div>
                    <div className="flex flex-col">
                        <span className="text-[9px] md:text-xs font-bold text-cyan-400 whitespace-nowrap">Lv {resources.level}</span>
                        <span className="text-[7px] md:text-[9px] text-cyan-200/50 font-mono leading-none">{resources.xp}/{resources.level*100}</span>
                    </div>
                </div>
            </div>
        </header>
      </div>

      <div className="absolute top-[160px] md:top-1/2 md:-translate-y-1/2 left-2 md:left-6 z-20 pointer-events-none flex items-start">
          <div className="bg-zinc-900/80 pointer-events-auto backdrop-blur-md border border-zinc-700/50 rounded-2xl md:rounded-3xl p-2 md:p-3 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex flex-col gap-2 md:gap-3">
              {metersContent}
          </div>
      </div>

      <div className="absolute inset-0 z-0 flex flex-col items-center justify-end pb-[2vh] pointer-events-none">
          {isDead && (
             <div className="absolute inset-0 bg-red-950/90 z-40 flex flex-col items-center justify-center backdrop-blur-md pointer-events-auto">
                <Skull size={72} className="text-red-500 mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
                <h2 className="text-5xl font-black text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest uppercase">You Died.</h2>
                <div className="text-red-300/70 mb-8 font-mono text-sm">Your adventure has come to an end.</div>
                <button onClick={revive} className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-105 active:scale-95 border border-red-500 uppercase tracking-wider">Revive (Cost: 50 XP)</button>
             </div>
          )}
          
          <div className="h-[45vh] w-[45vh] md:h-[85vh] md:w-[85vh] max-h-[900px] max-w-[900px] flex shrink-0 items-end justify-center transition-all duration-500">
             <CharacterCanvas equipped={resolvedEquipped} appearance={appearance} isAlive={!isDead} activeCurse={activeCurse} activeCompanion={activeCompanion} companionVariant={companionVariant} curseVariant={curseVariant} />
          </div>
      </div>

      <div className="absolute top-[160px] md:top-1/2 md:-translate-y-1/2 right-2 md:right-6 z-20 pointer-events-auto">
          <div className="bg-zinc-900/95 pointer-events-auto backdrop-blur-xl border border-zinc-700/60 p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-col gap-2">
              {[
                { id: 'character', icon: User, label: 'Char', alert: pointsAvailable > 0 },
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
                      className={`relative flex flex-col items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl transition-all ${
                          isActive 
                              ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-400 scale-105' 
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent'
                      }`}
                  >
                      {tab.alert && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                      {tab.alert && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                      <Icon size={isActive ? 24 : 20} className="mb-1" />
                      <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">{tab.label}</span>
                  </button>
                );
              })}
          </div>
      </div>

      {openPanel && (
          <div className="absolute inset-0 z-30 pointer-events-none flex justify-center items-center p-2 sm:p-6 pb-6">
              
              <div className="absolute inset-0 bg-zinc-950/70 pointer-events-auto backdrop-blur-md transition-opacity" onClick={() => setOpenPanel(null)} />
              
              <div className="pointer-events-auto relative bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                 
                 <div className="flex justify-between items-center p-4 sm:p-5 border-b border-zinc-700/80 bg-zinc-950/60 shadow-sm shrink-0">
                     <h2 className="font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-3 text-lg drop-shadow-[0_0_5px_rgba(99,102,241,0.4)]">
                         {openPanel === 'character' && <User size={20}/>}
                         {openPanel === 'actions' && <Tent size={20}/>}
                         {openPanel === 'inventory' && <Backpack size={20}/>}
                         {openPanel === 'shop' && <Store size={20}/>}
                         {openPanel === 'log' && <List size={20}/>}
                         {openPanel === 'character' ? 'Character Sheet' : openPanel}
                     </h2>
                     <button onClick={() => setOpenPanel(null)} className="p-2 bg-zinc-800 rounded-full hover:bg-red-900/80 hover:text-red-400 transition-colors border border-zinc-700 shadow-sm">
                         <X size={16} strokeWidth={3} />
                     </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-zinc-950/30">
                     
                     {openPanel === 'character' && (
                        <div className="space-y-6">
                            <div className="bg-zinc-800/80 p-5 rounded-xl border border-zinc-700 shadow-inner flex flex-col gap-1">
                                <h3 className="text-2xl font-bold text-indigo-400 drop-shadow-md">
                                    {edgyName ? `${edgyName.first} ${edgyName.last}` : `${characterName.first || 'Unknown'} ${characterName.last || 'Adventurer'}`}
                                </h3>
                                {edgyName && <p className="text-[10px] font-bold text-zinc-500 italic mb-1">(Formerly known as {characterName.first} {characterName.last})</p>}
                                <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">Level {resources.level} • {resources.xp} XP</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-1">
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Attributes</h3>
                                    {pointsAvailable > 0 && <span className="text-[10px] font-bold text-emerald-400 animate-pulse tracking-widest uppercase">Points: {pointsAvailable}</span>}
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    {attributesContent}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Status Effects</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-indigo-950/30 border border-indigo-900/50 p-4 rounded-xl">
                                        <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-2 tracking-widest">Trait</h4>
                                        {quirk ? (
                                            <div>
                                                <span className="text-sm font-bold text-indigo-300 block mb-1">{quirk.name}</span>
                                                <p className="text-[10px] text-zinc-400 leading-relaxed">{quirk.desc}</p>
                                            </div>
                                        ) : <span className="text-xs text-zinc-600 italic">None</span>}
                                    </div>

                                    {(activeCompanion || activeCurse) && (
                                        <>
                                            {activeCompanion && (
                                                <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
                                                    <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-2 tracking-widest">Companion</h4>
                                                    <div>
                                                        <span className="text-sm font-bold text-emerald-400 block mb-1">{COMPANIONS[activeCompanion].name}</span>
                                                        <p className="text-[10px] text-zinc-400 leading-relaxed">{COMPANIONS[activeCompanion].desc}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {activeCurse && (
                                                <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl">
                                                    <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-2 tracking-widest">Curse</h4>
                                                    <div>
                                                        <span className="text-sm font-bold text-red-400 block mb-1">{CURSES[activeCurse].name}</span>
                                                        <p className="text-[10px] text-zinc-400 leading-relaxed">{CURSES[activeCurse].desc}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                     )}

                     {openPanel === 'actions' && (
                        <>
                           <div>
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1">Maintenance</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {MAINTENANCE_ACTIONS.map(action => (
                                    <ActionButton 
                                        key={action.id} 
                                        {...action} 
                                        onClick={() => performAction(action)} 
                                        disabled={isMaintenanceDisabled(action)} 
                                    />
                                 ))}
                              </div>
                           </div>
                           
                           {dailyQuests?.labor?.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1"><Hammer size={14} className="text-amber-500"/> Labor (STR/CON)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.labor.map(q => <ActionButton key={q.id} {...q} successRate={calculateOdds(q)?.finalSuccessRate} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests?.adventure?.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1"><Shield size={14} className="text-indigo-400"/> Adventure (STR/DEX/AC)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.adventure.map(q => <ActionButton key={q.id} {...q} successRate={calculateOdds(q)?.finalSuccessRate} onClick={() => performAction(q)} disabled={isDead || activeCurse === 'pacifism'} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests?.social?.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1"><User size={14} className="text-emerald-400"/> Social (CHA)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.social.map(q => <ActionButton key={q.id} {...q} successRate={calculateOdds(q)?.finalSuccessRate} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}

                           {dailyQuests?.magic?.length > 0 && (
                              <div>
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-zinc-800 pb-1"><Zap size={14} className="text-cyan-400"/> Magic (INT)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                      {dailyQuests.magic.map(q => <ActionButton key={q.id} {...q} successRate={calculateOdds(q)?.finalSuccessRate} onClick={() => performAction(q)} disabled={isDead} />)}
                                  </div>
                              </div>
                           )}
                        </>
                     )}

                     {openPanel === 'inventory' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Equipped</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(equipped).map(([slot, instanceId]) => {
                                        const itemId = resolveItemId(instanceId);
                                        const item = ITEM_DB[slot]?.find(i => i.id === itemId);
                                        const isDefault = ['none', 'fist', 'tunic', 'cultist_robe'].includes(itemId);
                                        
                                        let displayName = item ? item.name : 'None';
                                        if (instanceId.startsWith('inv_') || instanceId.startsWith('loot_')) {
                                            const invItem = inventory.find(i => i.instanceId === instanceId);
                                            if (invItem && invItem.displayName) displayName = invItem.displayName;
                                        }

                                        return (
                                            <div key={slot} className="bg-zinc-900/80 border border-zinc-700/60 rounded-xl p-3 flex flex-col items-center justify-between text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden h-full min-h-[90px]">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                                                <div className="flex flex-col items-center z-10 w-full">
                                                    <span className="text-[9px] text-indigo-400 uppercase font-bold tracking-widest mb-1">{slot}</span>
                                                    <span className="text-sm font-bold text-zinc-200 block truncate w-full">{displayName}</span>
                                                    <div className="mt-1">{item && renderItemStats(item)}</div>
                                                </div>
                                                {!isDefault && !(activeCurse === 'cult_member' && (slot === 'body' || slot === 'head')) && (
                                                    <button 
                                                        onClick={() => equipItem({ type: slot, instanceId: slot === 'mainHand' ? 'inst_fist' : slot === 'body' ? 'inst_tunic' : 'inst_none' })} 
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
                                
                                <div className="flex flex-wrap gap-2 mb-4 border-b border-zinc-800 pb-3">
                                    {['All', 'Armor', 'Weapons', 'Shields', 'Magic', 'Supplies'].map(tab => (
                                        <button 
                                            key={tab} 
                                            onClick={() => setInventoryTab(tab)}
                                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${inventoryTab === tab ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {displayedInventory.length === 0 ? (
                                    <div className="p-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-700/50 border-dashed">
                                        <p className="text-sm text-zinc-500 font-medium">Nothing found in this category.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {displayedInventory.map(item => {
                                            const isEquipped = Object.values(equipped).includes(item.instanceId);
                                            const canEquip = ['head', 'body', 'mainHand', 'offHand'].includes(item.type);
                                            const canConsume = ['food', 'drink', 'potion'].includes(item.type);
                                            const isCultistLock = activeCurse === 'cult_member' && (item.type === 'body' || item.type === 'head');

                                            return (
                                                <div key={item.instanceId} className="bg-zinc-800/90 border border-zinc-700/80 rounded-xl p-4 flex flex-col shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="font-bold text-sm text-zinc-200 block flex items-center gap-2">
                                                                {item.displayName || item.name} 
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.name} • {item.category}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-700/50">
                                                                {Math.floor((item.cost || 0)/2)}g Value
                                                            </span>
                                                            {isEquipped && (
                                                                <span className="text-[9px] text-emerald-400 font-bold uppercase mt-1">Equipped</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {renderItemStats(item)}
                                                    <div className="mt-4 flex gap-2">
                                                        {canEquip && (
                                                            <button onClick={() => equipItem(item)} disabled={isEquipped || isCultistLock} className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${(isEquipped || isCultistLock) ? 'bg-indigo-950/50 text-indigo-500/50 border border-indigo-500/20 cursor-not-allowed' : 'bg-zinc-700 text-zinc-200 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-zinc-600 hover:border-indigo-500'}`}>
                                                                {isEquipped ? 'Equipped' : 'Equip'}
                                                            </button>
                                                        )}
                                                        {canConsume && (
                                                            <button onClick={() => consumeItem(item)} className="flex-1 py-2.5 bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-all hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                                                                Consume
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => sellItem(item)} 
                                                            disabled={isEquipped} 
                                                            className={`px-5 py-2.5 border rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${!isEquipped ? 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-amber-600 hover:text-white hover:border-amber-500 hover:shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                                                        >
                                                            Sell
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                     )}

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

                            <div className="flex flex-wrap gap-2 mb-4 border-b border-zinc-800 pb-3">
                                {['All', 'Armor', 'Weapons', 'Shields', 'Magic', 'Supplies'].map(tab => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setShopTab(tab)}
                                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${shopTab === tab ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {displayedShop.length === 0 ? (
                                <div className="p-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-700/50 border-dashed">
                                    <p className="text-sm text-zinc-500 font-medium">Nothing found in this category.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {displayedShop.map((item) => {
                                        let cost = item.cost || 0;
                                        if (quirk && quirk.id === 'iron_liver' && (item.type === 'drink' || item.id === 'courage' || item.id === 'stout')) cost = Math.floor(cost * (quirk.effects.drinkCostMultiplier || 1));
                                        const canAfford = resources.gold >= cost;

                                        return (
                                            <div key={item.instanceId} className={`bg-zinc-800/80 border rounded-xl p-4 flex flex-col justify-between shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all ${canAfford ? 'border-zinc-600 hover:border-indigo-500/70 hover:bg-zinc-800' : 'border-zinc-800 opacity-60 grayscale-[0.5]'}`}>
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="font-bold text-sm text-zinc-200 block flex items-center gap-2">
                                                                {item.displayName || item.name}
                                                            </span>
                                                            <span className="text-[9px] text-indigo-400/80 uppercase tracking-widest">{item.name} • {item.category}</span>
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
                            )}
                        </div>
                     )}

                     {openPanel === 'log' && (
                        <div className="space-y-4">
                            <div className="flex gap-2 border-b border-zinc-800 pb-3">
                                <button onClick={() => setLogTab('daily')} className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${logTab === 'daily' ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}>
                                    <List size={14} /> Daily Records
                                </button>
                                <button onClick={() => setLogTab('stats')} className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${logTab === 'stats' ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}>
                                    <TrendingUp size={14} /> Lifetime Stats
                                </button>
                            </div>

                            {logTab === 'daily' && (
                                <div className="space-y-3 pb-4">
                                    {sortedDays.length === 0 ? (
                                        <div className="p-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-700/50 border-dashed">
                                            <p className="text-sm text-zinc-500 font-medium">No events recorded yet.</p>
                                        </div>
                                    ) : (
                                        sortedDays.map(dayGroup => (
                                            <button 
                                                key={dayGroup.day} 
                                                onClick={() => setReportData(dayGroup.day)} 
                                                className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-4 flex justify-between items-center hover:bg-zinc-800 transition-colors text-left shadow-[0_4px_10px_rgba(0,0,0,0.2)] group"
                                            >
                                                <div>
                                                    <h3 className="font-bold text-zinc-200">Day {dayGroup.day} Record</h3>
                                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{dayGroup.logs.length} events logged</span>
                                                </div>
                                                <List size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}

                            {logTab === 'stats' && (
                                <div className="space-y-6 pb-4">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-3 border-b border-zinc-800 pb-1">Survival & Degeneracy</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            <StatRow label="Times Died" value={gameStats?.deaths || 0} colorClass="text-red-400" />
                                            <StatRow label="Times Got Shitfaced" value={gameStats?.shitfacedCount || 0} colorClass="text-amber-400" />
                                            <StatRow label="Puddle Water Drank" value={gameStats?.puddlesDrank || 0} colorClass="text-blue-400" />
                                            <StatRow label="Void Screams Released" value={gameStats?.voidScreams || 0} colorClass="text-indigo-400" />
                                            <StatRow label="Survival Auto-Consumes" value={gameStats?.autoConsumes || 0} colorClass="text-emerald-400" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-3 border-b border-zinc-800 pb-1">Chaos & Autonomy</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            <StatRow label="Spontaneous Marriages" value={gameStats?.marriages || 0} colorClass="text-pink-400" />
                                            <StatRow label="Dungeon Floor-Meat Eaten" value={gameStats?.dungeonFoodEaten || 0} colorClass="text-lime-400" />
                                            <StatRow label="Tables Fought (And Lost)" value={gameStats?.tablesFought || 0} colorClass="text-orange-400" />
                                            <StatRow label="Innocent Beds Stabbed" value={gameStats?.bedsStabbed || 0} colorClass="text-zinc-300" />
                                            <StatRow label="Times Arrested" value={gameStats?.timesArrested || 0} colorClass="text-cyan-400" />
                                            <StatRow label="Times Blacklisted" value={gameStats?.timesBlacklisted || 0} colorClass="text-red-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-3 border-b border-zinc-800 pb-1">Quests & Combat</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            <StatRow label="Total Checks Passed" value={gameStats?.checksPassed || 0} colorClass="text-emerald-400" />
                                            <StatRow label="Total Checks Failed" value={gameStats?.checksFailed || 0} colorClass="text-red-400" />
                                            <StatRow label="Magic Backfires" value={gameStats?.magicBackfires || 0} colorClass="text-purple-400" />
                                            <StatRow label="Dungeon Loot Found" value={gameStats?.dungeonLootFound || 0} colorClass="text-yellow-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-3 border-b border-zinc-800 pb-1">Financials</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            <StatRow label="Lifetime Gold Earned" value={`${gameStats?.lifetimeGoldEarned || 0}g`} colorClass="text-amber-400" />
                                            <StatRow label="Lifetime Gold Spent on Rent" value={`${gameStats?.lifetimeRentPaid || 0}g`} colorClass="text-amber-500" />
                                            <StatRow label="Cult Tithes Paid" value={`${gameStats?.cultTithesPaid || 0}g`} colorClass="text-red-400" />
                                            <StatRow label="Gold Stolen by Goblins" value={`${gameStats?.goldStolenByGoblins || 0}g`} colorClass="text-zinc-400" />
                                        </div>
                                    </div>
                                </div>
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

      {stagedAction && (
          <RollModal 
              action={stagedAction} 
              rollState={rollState} 
              calculateOdds={calculateOdds} 
              executeRoll={executeRoll} 
              finalizeAction={finalizeAction} 
              setStagedAction={setStagedAction} 
          />
      )}

    </div>
  );
};

export default App;
