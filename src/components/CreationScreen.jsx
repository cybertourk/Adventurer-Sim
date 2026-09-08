import React from 'react';
import { Shield, Hammer, Zap, Heart, User } from 'lucide-react';
import CharacterCanvas from './CharacterCanvas';

const CreationScreen = ({ creationStep, setCreationStep, characterName, setCharacterName, appearance, updateAppearance, equipped, attributes, updateAttribute, pointsAvailable, getStatInfo, startGame }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
      
      <div className="w-full md:w-2/5 lg:w-1/3 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col relative shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10">
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-1">Create Character</h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Step {creationStep} of 3</p>
          </div>

          {creationStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">First Name</label>
                <input type="text" value={characterName.first} onChange={(e) => setCharacterName({ ...characterName, first: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-bold" placeholder="Enter first name" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Last Name</label>
                <input type="text" value={characterName.last} onChange={(e) => setCharacterName({ ...characterName, last: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-bold" placeholder="Enter last name" />
              </div>
            </div>
          )}

          {creationStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Body Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => updateAppearance('gender', 'male')} className={`py-3 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all ${appearance.gender === 'male' ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}>Male</button>
                  <button onClick={() => updateAppearance('gender', 'female')} className={`py-3 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all ${appearance.gender === 'female' ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}>Female</button>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Skin Tone</label>
                <div className="grid grid-cols-5 gap-2">
                  {['pale', 'fair', 'tan', 'dark', 'deep'].map(tone => (
                    <button key={tone} onClick={() => updateAppearance('skinTone', tone)} className={`aspect-square rounded-lg border-2 transition-all ${appearance.skinTone === tone ? 'border-indigo-400 scale-110 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: tone === 'pale' ? '#fde0d0' : tone === 'fair' ? '#f1c27d' : tone === 'tan' ? '#c68642' : tone === 'dark' ? '#8d5524' : '#4a2f1d' }} title={tone} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Hair Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {['black', 'brown', 'blonde', 'red', 'gray'].map(color => (
                    <button key={color} onClick={() => updateAppearance('hairColor', color)} className={`aspect-square rounded-lg border-2 transition-all ${appearance.hairColor === color ? 'border-indigo-400 scale-110 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: color === 'black' ? '#1a1a1a' : color === 'brown' ? '#4a3018' : color === 'blonde' ? '#e8c37d' : color === 'red' ? '#8c2614' : '#808080' }} title={color} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Hair Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {['bald', 'short', 'long'].map(style => (
                    <button key={style} onClick={() => updateAppearance('hairStyle', style)} className={`py-2 rounded-lg border text-[10px] font-bold tracking-widest uppercase transition-all ${appearance.hairStyle === style ? 'bg-indigo-900/50 border-indigo-500 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}>{style}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {creationStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-4 flex justify-between items-center shadow-inner">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Points Available</span>
                <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{pointsAvailable}</span>
              </div>
              
              <div className="space-y-3">
                {['str', 'dex', 'con', 'int', 'cha'].map(attr => (
                  <div key={attr} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                    <div>
                      <div className="font-bold text-zinc-200 uppercase tracking-widest text-sm flex items-center gap-2">
                        {attr === 'str' && <Hammer size={14} className="text-amber-500"/>}
                        {attr === 'dex' && <Shield size={14} className="text-emerald-500"/>}
                        {attr === 'con' && <Heart size={14} className="text-red-500"/>}
                        {attr === 'int' && <Zap size={14} className="text-cyan-500"/>}
                        {attr === 'cha' && <User size={14} className="text-pink-500"/>}
                        {getStatInfo(attr).name}
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest max-w-[180px]">{getStatInfo(attr).desc}</div>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-900 p-1.5 rounded-lg border border-zinc-700/50">
                      <button onClick={() => updateAttribute(attr, -1)} disabled={attributes[attr] <= 10} className={`p-1.5 rounded-md transition-colors ${attributes[attr] <= 10 ? 'text-zinc-700 cursor-not-allowed' : 'text-red-400 hover:bg-red-950/50 hover:text-red-300'}`}><Minus size={14} strokeWidth={3} /></button>
                      <span className="w-6 text-center font-mono font-bold text-lg text-white">{attributes[attr]}</span>
                      <button onClick={() => updateAttribute(attr, 1)} disabled={pointsAvailable <= 0 || attributes[attr] >= 20} className={`p-1.5 rounded-md transition-colors ${pointsAvailable <= 0 || attributes[attr] >= 20 ? 'text-zinc-700 cursor-not-allowed' : 'text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300'}`}><Plus size={14} strokeWidth={3} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950 shrink-0">
          <div className="flex justify-between gap-4">
            {creationStep > 1 && (
              <button onClick={() => setCreationStep(prev => prev - 1)} className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all text-xs">Back</button>
            )}
            {creationStep < 3 ? (
              <button onClick={() => setCreationStep(prev => prev + 1)} disabled={creationStep === 1 && (!characterName.first || !characterName.last)} className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest transition-all text-xs shadow-lg ${creationStep === 1 && (!characterName.first || !characterName.last) ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'}`}>Next Step</button>
            ) : (
              <button onClick={startGame} disabled={pointsAvailable > 0} className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest transition-all text-xs shadow-lg ${pointsAvailable > 0 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'}`}>Begin Journey</button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#09090b] flex items-center justify-center min-h-[50vh] md:min-h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}bg_village.png')`, backgroundSize: 'cover', backgroundPosition: 'center bottom', imageRendering: 'pixelated' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />
        
        <div className="relative w-full h-full max-w-[800px] max-h-[800px] flex items-end justify-center pb-[5vh] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <CharacterCanvas 
                equipped={equipped} 
                appearance={appearance} 
                isAlive={true} 
                expression="neutral" 
            />
        </div>
      </div>

    </div>
  );
};

export default CreationScreen;
