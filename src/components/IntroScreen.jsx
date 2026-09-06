import React from 'react';

const IntroScreen = ({ onComplete }) => {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950 font-serif overflow-hidden select-none">
        
        {/* Background Image layer */}
        <div 
            className="absolute inset-0 w-full h-full opacity-40 mix-blend-luminosity"
            style={{
                backgroundImage: `url('${baseUrl}bg_intro.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                imageRendering: 'pixelated'
            }}
        />

        {/* Notebook Paper Overlay */}
        <div 
            className="relative z-10 w-full max-w-2xl max-h-[90vh] mx-4 bg-[#fdfaf3] text-slate-800 p-8 md:p-12 rounded-sm shadow-[10px_10px_40px_rgba(0,0,0,0.9)] overflow-y-auto transform -rotate-1"
            style={{ 
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #cbd5e1 32px)', 
                backgroundAttachment: 'local',
                lineHeight: '32px'
            }}
        >
            <div className="absolute left-6 md:left-10 top-0 bottom-0 w-0.5 bg-red-400/50" />
            
            <div className="pl-6 md:pl-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 leading-[32px] pt-1 underline decoration-wavy decoration-slate-400">
                    Session One: The "Adventure" Begins
                </h1>
                
                <div className="space-y-[32px]">
                    <p className="leading-[32px] m-0">
                        <strong>Session Notes - Campaign:</strong> The Realm of... something? (Ask DM later).
                    </p>
                    
                    <p className="leading-[32px] m-0">
                        <strong>Location:</strong> A quiet, peaceful village called <span className="line-through text-slate-500">Oakhaven</span>. (Wait, DM just corrected me. It's Ashhaven. Whatever. It's a town. There are buildings.)
                    </p>
                    
                    <p className="leading-[32px] m-0">
                        <strong>Character Profile:</strong> I am a Level 1 Human Adventurer. <span className="italic text-slate-600">(I pitched a half-dragon/half-vampire demigod who dual-wields scythes and is broodingly allergic to sunlight, but the DM sighed for like a full minute and told me to just pick Human. Fine. It's fine. I'll make it work).</span>
                    </p>
                    
                    <p className="leading-[32px] m-0">
                        <strong>Backstory:</strong> My family was tragically killed by... <span className="line-through text-slate-500">goblins? No, a wizard. A goblin wizard.</span> Actually, let's leave it blank. I'm a drifter with amnesia. That means I don't have to remember any lore.
                    </p>
                    
                    <p className="leading-[32px] m-0">
                        <strong>The Scene:</strong> The DM just spent ten minutes describing a sweeping valley, the smell of fresh pine, and a looming threat gathering in the dark mountains to the north. I stopped listening after "tavern."
                    </p>
                    
                    <p className="leading-[32px] m-0">
                        We are currently standing outside the Rusty Spoon Inn. The DM says there's a town guard looking at me like he needs my help. Nah.
                    </p>
                    
                    <div className="leading-[32px] m-0">
                        <strong>Current Objectives:</strong>
                        <ul className="list-disc pl-6 m-0">
                            <li className="leading-[32px]">Ignore the main quest.</li>
                            <li className="leading-[32px]">Find some gold.</li>
                            <li className="leading-[32px]">Get absolutely trashed.</li>
                            <li className="leading-[32px]">Fight a town guard. (Or a table. Whichever is worth more XP.).</li>
                        </ul>
                    </div>
                    
                    <p className="font-bold text-lg md:text-xl text-center leading-[32px] m-0 pt-4">
                        Let's roll some dice and make the DM regret inviting me.
                    </p>
                </div>

                <div className="mt-8 flex justify-center pb-8">
                    <button 
                        onClick={onComplete}
                        className="px-8 py-2 bg-zinc-900 text-zinc-100 font-sans font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-indigo-600 transition-all hover:scale-110 transform rotate-2 active:scale-95"
                    >
                        Start Session
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default IntroScreen;
