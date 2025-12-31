import React from 'react';
import { Minus, Plus } from 'lucide-react';
import CharacterSVG from './CharacterSVG';
import { APPEARANCE_OPTIONS } from './data';

/* -------------------------------------------------------------------------
   COMPONENT: CreationScreen
   Handles the character creation UI (Appearance & Stats).
   ------------------------------------------------------------------------- */

const CreationScreen = ({ 
  creationStep, 
  setCreationStep, 
  appearance, 
  updateAppearance, 
  equipped, 
  attributes, 
  updateAttribute, 
  pointsAvailable, 
  getStatInfo, 
  startGame 
}) => {

  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[85vh]">
            
            {/* Left: Preview */}
            <div className="w-full md:w-1/3 bg-slate-950/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
                <h2 className="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-widest">New Adventurer</h2>
                <div className="w-48 h-72">
                    <CharacterSVG equipped={equipped} appearance={appearance} isAlive={true} />
                </div>
            </div>

            {/* Right: Controls */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex gap-4 mb-6 border-b border-slate-800">
                    <button onClick={() => setCreationStep(1)} className={`pb-2 text-sm font-bold uppercase tracking-wider ${creationStep === 1 ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500'}`}>1. Appearance</button>
                    <button onClick={() => setCreationStep(2)} className={`pb-2 text-sm font-bold uppercase tracking-wider ${creationStep === 2 ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500'}`}>2. Attributes</button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {creationStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Gender</h3>
                                <div className="flex gap-2">
                                    {['male', 'female'].map(g => (
                                        <button key={g} onClick={() => updateAppearance('gender', g)} className={`flex-1 py-2 rounded border text-xs font-bold uppercase ${appearance.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{g}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Skin Tone</h3>
                                <div className="flex gap-2">
                                    {APPEARANCE_OPTIONS.skinTones.map(t => (
                                        <button key={t.id} onClick={() => updateAppearance('skinTone', t.id)} className={`w-8 h-8 rounded-full border-2 ${appearance.skinTone === t.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: t.color }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Eye Color</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {APPEARANCE_OPTIONS.eyeColors.map(c => (
                                        <button key={c.id} onClick={() => updateAppearance('eyeColor', c.id)} className={`w-6 h-6 rounded-full border-2 ${appearance.eyeColor === c.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.color }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Hair Style</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {APPEARANCE_OPTIONS.hairStyles.map(s => (
                                        <button key={s.id} onClick={() => updateAppearance('hairStyle', s.id)} className={`py-2 rounded border text-xs font-bold ${appearance.hairStyle === s.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{s.label}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Hair Color</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {APPEARANCE_OPTIONS.hairColors.map(c => (
                                        <button key={c.id} onClick={() => updateAppearance('hairColor', c.id)} className={`w-6 h-6 rounded border-2 ${appearance.hairColor === c.id ? 'border-indigo-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.color }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {creationStep === 2 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg mb-4">
                                <span className="text-sm font-bold text-slate-300">Points Available</span>
                                <span className={`text-xl font-mono font-bold ${pointsAvailable > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>{pointsAvailable}</span>
                            </div>
                            {Object.keys(attributes).map(attr => (
                                <div key={attr} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white uppercase">{attr}</span>
                                        <span className="text-[10px] text-slate-500">{getStatInfo(attr).desc.split('.')[1]}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => updateAttribute(attr, -1)} className="p-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300"><Minus size={14} /></button>
                                        <span className="w-4 text-center font-mono font-bold text-white">{attributes[attr]}</span>
                                        <button onClick={() => updateAttribute(attr, 1)} className="p-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300" disabled={pointsAvailable <= 0}><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                    {creationStep === 1 ? (
                        <button onClick={() => setCreationStep(2)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">Next: Attributes</button>
                    ) : (
                        <button onClick={startGame} disabled={pointsAvailable > 0} className={`px-6 py-3 font-bold rounded-lg transition-colors ${pointsAvailable > 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>Start Adventure</button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default CreationScreen;
