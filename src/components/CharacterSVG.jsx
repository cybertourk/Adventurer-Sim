import React from 'react';
// We import the appearance options from the Data file to calculate colors
import { APPEARANCE_OPTIONS } from '../data/GameData.jsx';

const CharacterSVG = ({ equipped, appearance, isAlive }) => {
  const { gender, skinTone, hairColor, eyeColor, hairStyle } = appearance;
   
  // Helper to find color values safely
  const skin = APPEARANCE_OPTIONS.skinTones.find(t => t.id === skinTone) || APPEARANCE_OPTIONS.skinTones[1];
  const hair = APPEARANCE_OPTIONS.hairColors.find(c => c.id === hairColor)?.color || '#3f2307';
  const eyes = APPEARANCE_OPTIONS.eyeColors.find(c => c.id === eyeColor)?.color || '#451a03';

  // Equipment flags
  const wearingHat = ['leather_cap', 'wizard_hat', 'iron_helm'].includes(equipped.head);
  const wearingFullHelm = equipped.head === 'iron_helm';

  const getZoneStyles = () => {
    const styles = {
      head: { fill: 'url(#skin-gradient)', filter: 'none', stroke: skin.shadow },
      torso: { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' }, 
      legs: { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }, 
      pelvis: { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }, 
      arms: { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' }, 
      boots: { fill: '#18181b', stroke: '#000000' } 
    };

    switch (equipped.body) {
      case 'tunic':
        styles.torso = { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' };
        styles.legs = { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' };
        styles.pelvis = { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' }; 
        styles.arms = { fill: '#f8fafc', filter: 'url(#fabric-noise)', stroke: '#94a3b8' };
        styles.boots = { fill: '#18181b', stroke: '#000000' };
        break;
      case 'leather_armor':
        styles.torso = { fill: '#5f370e', filter: 'url(#leather-noise)', stroke: '#3f2307' };
        styles.legs = { fill: '#3f2307', filter: 'url(#leather-noise)', stroke: '#271c19' };
        styles.pelvis = { fill: '#3f2307', filter: 'url(#leather-noise)', stroke: '#271c19' }; 
        styles.arms = { fill: '#5f370e', filter: 'url(#leather-noise)', stroke: '#3f2307' }; 
        styles.boots = { fill: '#271c19', stroke: '#000000' };
        break;
      case 'chainmail':
        const chainStyle = { fill: 'url(#chain-pattern)', filter: 'none', stroke: '#3f3f46' };
        styles.torso = chainStyle;
        styles.pelvis = chainStyle;
        styles.arms = chainStyle;
        styles.legs = { fill: '#713f12', filter: 'url(#fabric-noise)', stroke: '#451a03' };
        styles.boots = { fill: '#18181b', stroke: '#000000' };
        break;
      case 'plate':
        const plateStyle = { fill: 'url(#metal-sheen)', filter: 'none', stroke: '#27272a' };
        styles.torso = plateStyle;
        styles.legs = plateStyle;
        styles.pelvis = plateStyle;
        styles.arms = plateStyle;
        styles.boots = { fill: 'url(#metal-sheen)', stroke: '#27272a' };
        break;
      case 'robe':
        const robeStyle = { fill: '#312e81', filter: 'url(#fabric-noise)', stroke: '#1e1b4b' };
        styles.torso = robeStyle;
        styles.legs = robeStyle;
        styles.pelvis = robeStyle;
        styles.arms = robeStyle; 
        styles.boots = { fill: '#1e1b4b', stroke: '#000000' }; 
        break;
      default:
        break;
    }

    switch (equipped.head) {
      case 'iron_helm':
        styles.head = { fill: 'url(#metal-sheen)', filter: 'none', stroke: '#27272a' };
        break;
      default: 
        break;
    }

    return styles;
  };

  const s = getZoneStyles();

  // --- Gender Specific Paths ---
  let torsoPath;
  if (gender === 'female') {
    torsoPath = `M142 80 Q 142 88 135 90 Q 115 92 112 105 Q 108 115 115 160 L 132 200 L 168 200 L 185 160 Q 192 115 188 105 Q 185 92 165 90 Q 158 88 158 80 Z`;
  } else {
    torsoPath = `M142 80 Q 142 88 135 90 Q 115 92 110 105 Q 105 115 112 160 L 130 200 L 170 200 L 188 160 Q 195 115 190 105 Q 185 92 165 90 Q 158 88 158 80 Z`;
  }

  let pelvisPath;
  if (gender === 'female') {
    pelvisPath = `M132 200 L 168 200 L 150 225 Z`; 
  } else {
    pelvisPath = `M130 200 L 170 200 L 150 225 Z`;
  }

  let headPath;
  if (gender === 'female') {
    headPath = `M 132 60 C 132 35 168 35 168 60 C 168 75 150 85 150 85 C 150 85 132 75 132 60 Z`; 
  } else {
    headPath = null;
  }

  return (
    <svg viewBox="0 0 300 450" className={`w-full h-full transition-all duration-1000 ${isAlive ? '' : 'grayscale opacity-50'}`}>
      <defs>
        <filter id="leather-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.2 0" in="noise" result="softNoise"/>
          <feComposite operator="in" in="softNoise" in2="SourceGraphic" result="composite"/>
          <feBlend mode="multiply" in="composite" in2="SourceGraphic"/>
        </filter>

        <filter id="fabric-noise">
           <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" result="noise" />
           <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.15 0" in="noise" result="softNoise"/>
           <feComposite operator="in" in="softNoise" in2="SourceGraphic" result="composite"/>
           <feBlend mode="multiply" in="composite" in2="SourceGraphic"/>
        </filter>

        <linearGradient id="metal-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="30%" stopColor="#e4e4e7" />
          <stop offset="60%" stopColor="#71717a" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>

        <radialGradient id="skin-gradient" cx="0.4" cy="0.4" r="0.8">
           <stop offset="0%" stopColor={skin.color} />
           <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>

        <pattern id="chain-pattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
           <rect width="6" height="6" fill="#52525b" />
           <circle cx="3" cy="3" r="2" fill="#71717a" />
        </pattern>
        
        <linearGradient id="gold-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#713f12" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>

      {/* --- ZONES --- */}

      <g id="legs" filter={s.legs.filter}>
        {equipped.body === 'robe' ? (
          <path d={`M125 210 L 110 390 Q 150 405 190 390 L 175 210 Z`}
                fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
        ) : (
          <g>
            <path d={`M${gender === 'female' ? 128 : 130} 200 Q 120 250 125 300 L 128 390 L 145 390 L 148 300 Q 150 250 ${gender === 'female' ? 148 : 148} 300 L 150 210 Z`} 
                  fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
            <path d={`M${gender === 'female' ? 172 : 170} 200 Q 180 250 175 300 L 172 390 L 155 390 L 152 300 Q 150 250 ${gender === 'female' ? 152 : 152} 300 L 150 210 Z`} 
                  fill={s.legs.fill} stroke={s.legs.stroke} strokeWidth="1.5" />
            
             {s.boots && s.boots.fill !== 'none' && (
               <g>
                 <path d="M125 300 L 128 390 L 145 390 L 148 300 Q 136 310 125 300" fill={s.boots.fill} stroke={s.boots.stroke} strokeWidth="1.5" />
                 <path d="M175 300 L 172 390 L 155 390 L 152 300 Q 164 310 175 300" fill={s.boots.fill} stroke={s.boots.stroke} strokeWidth="1.5" />
                 
                 {equipped.body === 'plate' && (
                    <g stroke="#27272a" strokeWidth="1" fill="none">
                        <path d="M126 330 L 147 330" />
                        <path d="M127 360 L 146 360" />
                        <path d="M153 330 L 174 330" />
                        <path d="M154 360 L 173 360" />
                    </g>
                 )}
               </g>
             )}

             <path d="M128 375 Q 136.5 370 145 375" 
                   stroke="#000000" 
                   strokeWidth="1.5" fill="none" opacity="0.6" />
             <path d="M155 375 Q 163.5 370 172 375" 
                   stroke="#000000" 
                   strokeWidth="1.5" fill="none" opacity="0.6" />

             {equipped.body === 'plate' && (
               <g>
                 <circle cx="137" cy="300" r="10" fill="url(#metal-sheen)" stroke="#27272a" />
                 <circle cx="163" cy="300" r="10" fill="url(#metal-sheen)" stroke="#27272a" />
               </g>
             )}
          </g>
        )}
      </g>

      <g id="pelvis" filter={s.pelvis.filter}>
         {equipped.body !== 'robe' && (
            <path d={pelvisPath} fill={s.pelvis.fill} stroke={s.pelvis.stroke} strokeWidth="1.5" />
         )}
      </g>

      <g id="torso" filter={s.torso.filter}>
        <path d={torsoPath} fill={s.torso.fill} stroke={s.torso.stroke} strokeWidth="1.5" />
        
        {gender === 'female' && equipped.body !== 'plate' && (
           <path d="M 128 115 Q 140 125 150 115 Q 160 125 172 115"
                 stroke={s.torso.stroke} strokeWidth="1" fill="none" opacity="0.6" />
        )}

        {(equipped.body === 'tunic' || equipped.body === 'leather_armor') && (
           <path d="M150 95 L 150 200" stroke={s.torso.stroke} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
        )}
        {equipped.body === 'plate' && (
            <path d="M115 140 Q 150 160 185 140" stroke="#27272a" strokeWidth="1.5" fill="none" />
        )}
      </g>
      
      <g id="arms" filter={s.arms.filter}>
        <path d="M110 105 Q 105 110 108 125 Q 110 145 100 190 L 95 210 L 110 210 L 120 190 Q 125 150 120 105 Z" 
              fill={s.arms.fill} stroke={s.arms.stroke} strokeWidth="1.5" />
        
        <path d="M190 105 Q 195 110 192 125 Q 190 145 200 190 L 205 210 L 190 210 L 180 190 Q 175 150 180 105 Z" 
              fill={s.arms.fill} stroke={s.arms.stroke} strokeWidth="1.5" />
        
        {equipped.body === 'plate' && (
           <g>
             <path d="M100 75 Q 85 85 90 115 L 120 105 Z" fill="url(#metal-sheen)" stroke="#27272a" />
             <path d="M200 75 Q 215 85 210 115 L 180 105 Z" fill="url(#metal-sheen)" stroke="#27272a" />
           </g>
        )}
      </g>

      <g id="hands">
         <circle cx="102" cy="215" r="8" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1"/>
         <circle cx="198" cy="215" r="8" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1"/>
      </g>

      <g id="head">
        {!wearingFullHelm && (
          <g>
             <ellipse cx="133" cy="60" rx="4" ry="7" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1" transform="rotate(-10, 133, 60)" />
             <ellipse cx="167" cy="60" rx="4" ry="7" fill="url(#skin-gradient)" stroke={skin.shadow} strokeWidth="1" transform="rotate(10, 167, 60)" />
          </g>
        )}

        {headPath ? (
           <path d={headPath} fill={s.head.fill} stroke={s.head.stroke} strokeWidth="1.5" />
        ) : (
           <ellipse cx="150" cy="60" rx="18" ry="22" fill={s.head.fill} stroke={s.head.stroke} strokeWidth="1.5" />
        )}

        {!wearingFullHelm && (
           <g id="face-features">
             <path d="M138 54 Q 143 51 147 54" stroke="#3f2307" strokeWidth="1.5" fill="none" opacity="0.8" />
             <path d="M153 54 Q 157 51 162 54" stroke="#3f2307" strokeWidth="1.5" fill="none" opacity="0.8" />

             <circle cx="143" cy="60" r="2" fill={isAlive ? eyes : '#000'} />
             <circle cx="157" cy="60" r="2" fill={isAlive ? eyes : '#000'} />
             {isAlive && (
              <>
               <circle cx="143.5" cy="59.5" r="0.5" fill="#fff" opacity="0.6" />
               <circle cx="157.5" cy="59.5" r="0.5" fill="#fff" opacity="0.6" />
              </>
             )}
             
             {gender === 'female' && (
                <g stroke={hair} strokeWidth="1">
                   <path d="M141 58 L 139 56" />
                   <path d="M159 58 L 161 56" />
                </g>
             )}

             {isAlive ? (
               <path d="M150 60 L 149 68 L 152 70" fill="none" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
             ) : (
               <path d="M150 60 L 149 68 L 152 70" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
             )}

             {isAlive ? (
               <path d="M145 76 Q 150 79 155 76" stroke={skin.shadow} strokeWidth="1.5" fill="none" strokeLinecap="round" />
             ) : (
               <path d="M145 79 Q 150 76 155 79" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round" />
             )}
             
             {!wearingHat && hairStyle !== 'bald' && (
                <>
                  {hairStyle === 'short' && (
                      <path d="M150 35 Q 170 35 168 57 L 168 67 L 162 52 Q 150 42 138 52 L 132 67 L 132 57 Q 130 35 150 35" fill={hair} />
                  )}
                  {hairStyle !== 'long' && (
                     <path d="M150 35 Q 170 35 168 57 L 168 67 L 162 52 Q 150 42 138 52 L 132 67 L 132 57 Q 130 35 150 35" fill={hair} />
                  )}
                </>
             )}

             {hairStyle === 'long' && (
                <g>
                   <path d="M130 50 L 125 90 L 140 90 L 135 50" fill={hair} />
                   <path d="M170 50 L 175 90 L 160 90 L 165 50" fill={hair} />
                   
                   {!wearingHat && (
                      <path d="M150 35 Q 175 35 170 65 L 175 90 L 160 90 L 160 55 Q 150 45 140 55 L 140 90 L 125 90 L 130 65 Q 125 35 150 35" fill={hair} />
                   )}
                </g>
             )}

             {equipped.head === 'leather_cap' && (
                <path d="M120 53 Q 150 0 180 53 L 180 58 L 120 58 Z" fill="#5f370e" stroke="#3f2307" />
             )}
             
             {equipped.head === 'wizard_hat' && (
                <g transform="translate(150, 45)"> 
                   <ellipse cx="0" cy="0" rx="35" ry="8" fill="#312e81" stroke="#1e1b4b" />
                   <path d="M-18 0 L -2 -70 L 2 -70 L 18 0 Z" fill="#312e81" stroke="#1e1b4b" />
                </g>
             )}
             
             {equipped.head === 'crown' && (
                <path d="M134 47 L 140 35 L 150 49 L 160 35 L 166 47 Q 150 52 134 47" 
                      fill="none" stroke="url(#gold-sheen)" strokeWidth="2" strokeLinejoin="round" />
             )}
           </g>
        )}
        
        {wearingFullHelm && (
           <g>
             <path d="M129 35 Q 150 27 171 35 L 173 79 Q 150 87 127 79 L 129 35" 
                   fill="url(#metal-sheen)" stroke="#27272a" strokeWidth="1.5" />
             <path d="M129 52 L 171 52" stroke="#18181b" strokeWidth="2" />
             <line x1="150" y1="35" x2="150" y2="82" stroke="#18181b" strokeWidth="1" opacity="0.3" />
           </g>
        )}
      </g>

      <g id="main-hand" transform="translate(205, 200) rotate(45)">
        {equipped.mainHand === 'sword' && (
          <g transform="scale(1.75) translate(0, 5)">
            <line x1="0" y1="10" x2="0" y2="-10" stroke="#3f2307" strokeWidth="2" /> 
            <circle cx="0" cy="12" r="3" fill="#52525b" stroke="#27272a" strokeWidth="0.5"/>
            <rect x="-10" y="-14" width="20" height="4" fill="#52525b" stroke="#27272a" rx="1" strokeWidth="0.5"/>
            <path d="M-4 -14 L 4 -14 L 3 -80 L 0 -90 L -3 -80 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="0.5"/>
            <line x1="0" y1="-14" x2="0" y2="-80" stroke="#52525b" strokeWidth="0.5" opacity="0.5" />
          </g>
        )}
        {equipped.mainHand === 'axe' && (
           <g>
             <rect x="-3" y="-15" width="6" height="120" fill="#3f2307" rx="1" transform="translate(0, -40)" /> 
             <g transform="translate(0, -70)">
                <rect x="-6" y="-15" width="12" height="30" fill="#52525b" />
                <path d="M 6 -15 L 25 -15 Q 35 0 25 15 L 6 15 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="1.5" />
                <path d="M -6 -15 L -25 -15 Q -35 0 -25 15 L -6 15 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="1.5" />
             </g>
           </g>
        )}
        {equipped.mainHand === 'hammer' && (
           <g transform="translate(0, -20) rotate(-10)">
              <rect x="-4" y="-20" width="8" height="100" fill="#3f2307" rx="1" />
              <rect x="-15" y="-35" width="30" height="20" fill="#52525b" stroke="#27272a" />
           </g>
        )}
        {equipped.mainHand === 'staff' && (
            <g>
              <rect x="-3" y="-60" width="6" height="150" fill="#3f2307" rx="2" />
              <circle cx="0" cy="-60" r="10" fill="url(#skin-gradient)" />
              <circle cx="0" cy="-60" r="6" fill="#10b981" className="animate-pulse" />
            </g>
        )}
         {equipped.mainHand === 'dagger' && (
           <g transform="scale(1.5)">
             <line x1="0" y1="8" x2="0" y2="-8" stroke="#3f2307" strokeWidth="2" />
             <circle cx="0" cy="10" r="2" fill="#52525b" />
             <rect x="-6" y="-10" width="12" height="2" fill="#52525b" />
             <path d="M-3 -10 L 3 -10 L 0 -40 Z" fill="url(#metal-sheen)" stroke="#52525b" strokeWidth="0.5"/>
           </g>
        )}
      </g>

      <g id="off-hand" transform="translate(95, 200) rotate(10)">
         {equipped.offHand === 'wooden_shield' && (
            <g transform="translate(-20, -20)">
               <circle cx="20" cy="20" r="25" fill="#5f370e" stroke="#3f2307" strokeWidth="3" filter="url(#leather-noise)"/>
               <circle cx="20" cy="20" r="5" fill="#52525b" />
            </g>
         )}
         {equipped.offHand === 'tower_shield' && (
            <g transform="translate(-20, -40)">
               <path d="M0 0 L 40 0 L 40 80 L 20 90 L 0 80 Z" fill="url(#metal-sheen)" stroke="#27272a" strokeWidth="3" />
            </g>
         )}
         {equipped.offHand === 'orb' && (
           <g transform="translate(0, -10)">
            <circle cx="0" cy="0" r="24" fill="#6366f1" fillOpacity="0.8" stroke="#4338ca" strokeWidth="2" />
            <circle cx="0" cy="0" r="16" fill="none" stroke="#c7d2fe" strokeWidth="1" className="animate-spin-slow" strokeDasharray="4 4"/>
           </g>
         )}
      </g>
    </svg>
  );
};

export default CharacterSVG;
