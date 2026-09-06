import React from 'react';
import { Scroll, X } from 'lucide-react';
import { COMPANIONS, CURSES } from '../data/constants';

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

export default DailySummaryModal;
