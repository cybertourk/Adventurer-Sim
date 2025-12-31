import React, { useState, useEffect } from 'react';
import { 
  Shield, Sword, VenetianMask, Shirt, User, Backpack, X, 
  Activity, Scroll, MapPin, ShoppingBag, DollarSign, HelpCircle, 
  Key, Apple, Beer, Wine, Heart, Trash2, Coins, Sun, Skull
} from 'lucide-react';

import CharacterSVG from './CharacterSVG';
import { getBackground } from './Backgrounds';
import { StatBlock, ActionButton, renderItemStats } from './GameUI';
import CreationScreen from './CreationScreen';
import { useGameLogic } from './useGameLogic';
import { 
  ITEM_DB, 
  MAINTENANCE_ACTIONS, 
  LOCATIONS, 
  APPEARANCE_OPTIONS 
} from './data';

/* -------------------------------------------------------------------------
  THEME: CHAOTIC ADVENTURER SIMULATOR
  Version: 1.33 (Report Panel Integration)
  -------------------------------------------------------------------------
*/

const ICON_MAP = {
  'Shield': Shield, 'Sword': Sword, 'Scroll': Scroll, 'Activity': Activity, 
  'Beer': Beer, 'User': User, 'Coins': Coins, 'Heart': Heart, 'DollarSign': DollarSign
};

export default function App() {
  const {
    gameStarted, setGameStarted,
    creationStep, setCreationStep,
    attributes, updateAttribute,
    stats,
    resources,
    inventory,
    shopStock,
    equipped, equipItem,
    appearance, updateAppearance,
    days,
    location,
    housing,
    dailyQuests,
    messages,
    isDead,
    maxStats,
    currentStats,
    dailyLogs,
    setDailyLogs,
    quirk, 
    performAction,
    revive,
    buyItem,
    sellItem,
    consumeItem,
    startGame,
    resetGame,
    pointsAvailable
  } = useGameLogic();

  // Local UI State
  const [activeTab, setActiveTab] = useState('actions');
  const [questTab, setQuestTab] = useState('labor');
  const [activeSlot, setActiveSlot] = useState('head');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState('buy');
  const [activeStatInfo, setActiveStatInfo] = useState(null);

  // Auto-open Report Panel when a new day occurs (if game is started)
  useEffect(() => {
      if (days > 1 && gameStarted) {
          setActiveTab('reports');
          setIsPanelOpen(true);
      }
  }, [days, gameStarted]);

  // --- View Helpers ---

  const getItemById = (id) => {
      const all = [...ITEM_DB.head, ...ITEM_DB.body, ...ITEM_DB.mainHand, ...ITEM_DB.offHand, ...ITEM_DB.supplies];
      return all.find(i => i.id === id);
  };

  const togglePanel = (tab) => {
    if (isPanelOpen && activeTab === tab) setIsPanelOpen(false);
    else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

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

  const CurrentSceneBackground = getBackground(location);
  const currentLocData = LOCATIONS[location] || LOCATIONS['village_road'];

  // --- VIEW: Creation ---
  if (!gameStarted) {
      return (
        <CreationScreen 
          creationStep={creationStep}
          setCreationStep={setCreationStep}
          appearance={appearance}
          updateAppearance={updateAppearance}
          equipped={equipped}
          attributes={attributes}
          updateAttribute={updateAttribute}
          pointsAvailable={pointsAvailable}
          getStatInfo={getStatInfo}
          startGame={startGame}
        />
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

      <div className="flex-1 relative bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
          <CurrentSceneBackground />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50 pointer-events-none" />
          
          {/* Top HUD */}
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

          {/* Central Character & Stats */}
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
         <button onClick={() => togglePanel('reports')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'reports' && isPanelOpen ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Sun size={20} />
            <span className="text-[10px] font-bold">Reports</span>
         </button>
      </div>

      <div className={`fixed md:relative z-40 transition-transform duration-300 ease-out bg-slate-900 border-slate-700 shadow-2xl md:w-72 md:h-full md:border-l md:translate-y-0 bottom-28 left-4 right-4 rounded-2xl border h-[55vh] ${isPanelOpen ? 'translate-y-0' : 'translate-y-[150%] md:translate-x-full md:hidden'}`}>
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-800/50 rounded-t-2xl md:rounded-none">
             <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                {activeTab === 'actions' && <><Activity size={14}/> Actions</>}
                {activeTab === 'quests' && <><Scroll size={14}/> Quests</>}
                {activeTab === 'equip' && <><Backpack size={14}/> Equipment</>}
                {activeTab === 'reports' && <><Sun size={14}/> Morning Reports</>}
             </div>
             <button onClick={() => setIsPanelOpen(false)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 hover:text-white">
               <X size={14} />
             </button>
          </div>
          <div className="hidden md:flex border-b border-slate-800">
             <button onClick={() => setActiveTab('actions')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'actions' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Actions</button>
             <button onClick={() => setActiveTab('quests')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'quests' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Quests</button>
             <button onClick={() => setActiveTab('equip')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'equip' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Gear</button>
             <button onClick={() => setActiveTab('reports')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'reports' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>Reports</button>
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

            {activeTab === 'reports' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">History of Incidents</div>
                    {dailyLogs.length === 0 ? (
                        <div className="text-xs text-slate-500 italic text-center p-4 border border-dashed border-slate-800 rounded">No incidents reported yet. Sleep more!</div>
                    ) : (
                        dailyLogs.map((log) => (
                            <div key={log.id} className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden mb-2">
                                {/* Header */}
                                <div className="bg-slate-800 p-3 flex justify-between items-center">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Day {log.day}</span>
                                    <span className="text-[10px] text-slate-500">{log.sleepLoc}</span>
                                </div>
                                {/* Content */}
                                <div className="p-3 space-y-2">
                                    <div className="relative pl-3 border-l-2 border-slate-600">
                                        <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                                            "{log.incidentText}"
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-700/30">
                                        <span className="text-slate-400">{log.rent}</span>
                                        <span className="text-indigo-300">{log.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
          </div>
      </div>
    </div>
  );
}
