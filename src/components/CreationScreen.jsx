import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { APPEARANCE_OPTIONS } from '../data/constants';
import CharacterCanvas from './CharacterCanvas';

const CreationScreen = ({ creationStep, setCreationStep, characterName, setCharacterName, appearance, updateAppearance, equipped, attributes, updateAttribute, pointsAvailable, getStatInfo, startGame }) => {
  return (
    <div className="h-[100dvh] bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-center p-0 md:p-4 overflow-hidden">
        <div className="w-full h-full max-w-4xl bg-zinc-900 border border-zinc-700 md:rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden md:h-[85vh]">
            <div className="w-full md:w-1/3 h-[40vh] md:h-auto bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 relative shrink-0">
                <h2 className="text-xl font-bold mb-2 md:mb-4 text-indigo-400 uppercase tracking-widest drop-shadow-md">New Adventurer</h2>
                <div className="w-[100vw] h-[100vw] max-w-[280px] max-h-[280px] md:max-w-[350px] md:max-h-[350px] aspect-square flex items-center justify-center">
                    <CharacterCanvas equipped={equipped} appearance={appearance} isAlive={true} activeCurse={null} activeCompanion={null} companionVariant={null} curseVariant={null} expression="neutral" />
                </div>
            </div>
            <div className="flex-1 p-4 md:p-6 flex flex-col bg-zinc-900/50 min-h-0">
                <div className="flex gap-4 mb-4 border-b border-zinc-800 shrink-0">
                    <button onClick={() => setCreationStep(1)} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${creationStep === 1 ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}>1. Details</button>
                    <button onClick={() => setCreationStep(2)} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${creationStep === 2 ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}>2. Attributes</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-5 pb-6">
                    {creationStep === 1 && (
                        <>
                            <div><h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Identity</h3>
                                <div className="flex gap-3">
                                    <input type="text" placeholder="First Name" value={characterName.first} onChange={(e) => setCharacterName({...characterName, first: e.target.value})} className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm font-bold text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                    <input type="text" placeholder="Last Name" value={characterName.last} onChange={(e) => setCharacterName({...characterName, last: e.target.value})} className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm font-bold text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                </div>
                            </div>
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
                <div className="mt-2 pt-4 border-t border-zinc-800 flex justify-end shrink-0">
                    {creationStep === 1 ? ( <button onClick={() => setCreationStep(2)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">Next: Attributes</button> ) : ( <button onClick={startGame} disabled={pointsAvailable > 0 || !characterName.first} className={`px-8 py-3 font-bold tracking-wider uppercase text-sm rounded-xl transition-all ${(pointsAvailable > 0 || !characterName.first) ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_20px_rgba(52,211,153,0.5)]'}`}>Start Adventure</button> )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default CreationScreen;
