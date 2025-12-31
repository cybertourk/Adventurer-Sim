import React from 'react';
import { ITEM_DB, APPEARANCE_OPTIONS } from './data';

/* -------------------------------------------------------------------------
  COMPONENT: CharacterSVG
  Version: 1.11 (Eye Outlines)
  ------------------------------------------------------------------------- */

const CharacterSVG = ({ equipped, appearance, isAlive = true }) => {
  
  // -- Helper: Get Color Codes --
  const getSkinColor = () => {
    const tone = APPEARANCE_OPTIONS.skinTones.find(t => t.id === appearance.skinTone);
    return tone ? tone.color : '#f3e5dc'; // Default Pale
  };
  
  const getSkinShadow = () => {
    const tone = APPEARANCE_OPTIONS.skinTones.find(t => t.id === appearance.skinTone);
    return tone ? tone.shadow : '#e0c8b8';
  };

  const getHairColor = () => {
    const color = APPEARANCE_OPTIONS.hairColors.find(c => c.id === appearance.hairColor);
    return color ? color.color : '#3f2307'; // Default Brown
  };

  const getEyeColor = () => {
      const color = APPEARANCE_OPTIONS.eyeColors.find(c => c.id === appearance.eyeColor);
      return color ? color.color : '#000000';
  };

  // -- Render Helpers --

  const renderHead = () => {
    const skin = getSkinColor();
    const shadow = getSkinShadow();
    
    return (
      <g id="head">
        {/* Neck */}
        <rect x="90" y="110" width="20" height="15" fill={skin} />
        <rect x="90" y="110" width="20" height="4" fill={shadow} opacity="0.3" />

        {/* Face Shape */}
        <path d="M 75 70 Q 75 110 100 120 Q 125 110 125 70 Q 125 40 100 40 Q 75 40 75 70" fill={skin} />
        
        {/* Ears */}
        <ellipse cx="73" cy="85" rx="4" ry="6" fill={skin} />
        <ellipse cx="127" cy="85" rx="4" ry="6" fill={skin} />

        {renderFaceFeatures()}
        {renderHair()}
        {renderHeadGear()}
      </g>
    );
  };

  const renderFaceFeatures = () => {
     if (!isAlive) {
         return (
             <g id="face-dead">
                 <path d="M 85 82 L 95 92 M 95 82 L 85 92" stroke="#4a0404" strokeWidth="2" />
                 <path d="M 105 82 L 115 92 M 115 82 L 105 92" stroke="#4a0404" strokeWidth="2" />
                 <path d="M 90 105 Q 100 100 110 105" stroke="#4a0404" strokeWidth="2" fill="none" />
             </g>
         );
     }

     const eyeColor = getEyeColor();
     const gender = appearance.gender;

     return (
         <g id="face-alive">
             {/* Eyes with Outline */}
             <circle cx="88" cy="86" r="3.5" fill="white" stroke="black" strokeWidth="0.5" />
             <circle cx="112" cy="86" r="3.5" fill="white" stroke="black" strokeWidth="0.5" />
             
             <circle cx="88" cy="86" r="1.5" fill={eyeColor} />
             <circle cx="112" cy="86" r="1.5" fill={eyeColor} />

             {/* Eyebrows */}
             <path d="M 84 78 Q 88 76 92 78" stroke={getHairColor()} strokeWidth="1.5" fill="none" />
             <path d="M 108 78 Q 112 76 116 78" stroke={getHairColor()} strokeWidth="1.5" fill="none" />

             {/* Nose */}
             <path d="M 100 88 L 98 96 L 102 96" fill={getSkinShadow()} opacity="0.6" />

             {/* Mouth */}
             <path d="M 95 105 Q 100 108 105 105" stroke="#8c5858" strokeWidth="1.5" fill="none" />
             
             {/* Blush for Female */}
             {gender === 'female' && (
                 <>
                   <ellipse cx="82" cy="98" rx="4" ry="2" fill="#ff9999" opacity="0.3" />
                   <ellipse cx="118" cy="98" rx="4" ry="2" fill="#ff9999" opacity="0.3" />
                 </>
             )}
         </g>
     );
  };

  const renderHair = () => {
    const style = appearance.hairStyle;
    const color = getHairColor();
    const headGear = equipped.head;

    // Don't render big hair if wearing a full helm (bucket)
    if (headGear === 'iron_helm') return null;

    return (
      <g id="hair">
         {style === 'bald' && (
             <path d="M 75 70 Q 75 35 100 35 Q 125 35 125 70" fill="none" stroke={getSkinShadow()} strokeWidth="0.5" opacity="0.5" />
         )}
         
         {style === 'short' && (
             <path d="M 72 70 Q 70 30 100 30 Q 130 30 128 70 L 125 65 Q 125 40 100 40 Q 75 40 75 65 Z" fill={color} />
         )}

         {style === 'long' && (
             <g>
                {/* Back Hair */}
                <path d="M 70 60 L 65 110 Q 100 120 135 110 L 130 60" fill={color} />
                {/* Top */}
                <path d="M 70 75 Q 65 25 100 25 Q 135 25 130 75 L 125 55 Q 100 50 75 55 Z" fill={color} />
             </g>
         )}
      </g>
    );
  };

  const renderBody = () => {
     const armorId = equipped.body;
     
     // Base Body
     const renderBase = () => (
         <g id="base-body">
             {/* Torso */}
             <path d="M 80 120 L 70 180 L 130 180 L 120 120 Z" fill={getSkinColor()} />
             {/* Arms */}
             <path d="M 80 125 L 60 150 L 65 160 L 82 135" fill={getSkinColor()} />
             <path d="M 120 125 L 140 150 L 135 160 L 118 135" fill={getSkinColor()} />
             {/* Legs */}
             <rect x="80" y="180" width="18" height="60" fill="#4a3b2a" />
             <rect x="102" y="180" width="18" height="60" fill="#4a3b2a" />
         </g>
     );

     // Armor Logic
     const renderArmor = () => {
         switch(armorId) {
             case 'tunic':
                 return <path d="M 75 120 L 65 160 L 135 160 L 125 120 Z" fill="#7c6a56" />;
             case 'leather_armor':
                 return (
                     <g>
                        <path d="M 78 120 L 72 170 L 128 170 L 122 120 Z" fill="#5c4033" stroke="#3e2b22" strokeWidth="1" />
                        <rect x="75" y="145" width="50" height="5" fill="#3e2b22" />
                     </g>
                 );
             case 'chainmail':
                 return (
                     <g>
                         <path d="M 75 120 L 70 175 L 130 175 L 125 120 Z" fill="#a0a0a0" />
                         {/* Pattern */}
                         <pattern id="chainPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                             <circle cx="2" cy="2" r="1.5" fill="none" stroke="#666" strokeWidth="0.5"/>
                         </pattern>
                         <path d="M 75 120 L 70 175 L 130 175 L 125 120 Z" fill="url(#chainPattern)" opacity="0.5"/>
                     </g>
                 );
             case 'plate':
                 return (
                     <g>
                         <path d="M 70 115 L 65 160 L 135 160 L 130 115 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                         <path d="M 90 130 L 110 130 L 100 160 Z" fill="#94a3b8" />
                         <circle cx="80" cy="125" r="5" fill="#64748b" />
                         <circle cx="120" cy="125" r="5" fill="#64748b" />
                     </g>
                 );
             case 'robe':
                 return (
                     <path d="M 75 118 L 60 200 L 140 200 L 125 118 Z" fill="#4c1d95" />
                 );
             default:
                 return null;
         }
     };

     return (
         <g id="body">
             {renderBase()}
             {renderArmor()}
         </g>
     );
  };

  const renderHeadGear = () => {
      const helmId = equipped.head;
      switch(helmId) {
          case 'leather_cap':
              return <path d="M 72 70 Q 75 35 100 35 Q 125 35 128 70 L 125 72 Q 100 65 75 72 Z" fill="#5c4033" />;
          case 'iron_helm':
              return (
                  <g>
                      <path d="M 70 65 Q 70 30 100 30 Q 130 30 130 65 L 130 100 L 70 100 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                      <rect x="85" y="75" width="30" height="4" fill="#0f172a" rx="1" />
                      <rect x="98" y="75" width="4" height="25" fill="#475569" />
                  </g>
              );
          case 'wizard_hat':
              return (
                  <g>
                      <ellipse cx="100" cy="65" rx="35" ry="10" fill="#312e81" />
                      <path d="M 80 65 L 100 10 L 120 65 Z" fill="#312e81" />
                      <path d="M 85 55 L 90 60 L 95 55" fill="none" stroke="#fbbf24" strokeWidth="1" /> 
                  </g>
              );
          default:
              return null;
      }
  };

  const renderWeapons = () => {
      const main = equipped.mainHand;
      const off = equipped.offHand;

      return (
          <g id="weapons">
              {/* Main Hand (Right side of screen, Left Hand of char) */}
              {main === 'dagger' && <path d="M 55 140 L 65 150 L 55 170 Z" fill="#cbd5e1" stroke="#475569" />}
              {main === 'sword' && (
                  <g transform="translate(50, 130) rotate(-45)">
                      <rect x="0" y="0" width="4" height="40" fill="#cbd5e1" stroke="#475569" />
                      <rect x="-5" y="30" width="14" height="4" fill="#475569" />
                      <circle cx="2" cy="35" r="3" fill="#94a3b8" />
                  </g>
              )}
              {main === 'axe' && (
                   <g transform="translate(50, 130) rotate(-30)">
                       <rect x="0" y="0" width="4" height="40" fill="#5c4033" />
                       <path d="M -5 5 Q 10 0 10 15 L -5 15 Z" fill="#94a3b8" />
                   </g>
              )}
              {main === 'hammer' && (
                  <g transform="translate(50, 130) rotate(-45)">
                      <rect x="0" y="0" width="4" height="35" fill="#5c4033" />
                      <rect x="-6" y="2" width="16" height="10" fill="#475569" />
                  </g>
              )}
              {main === 'staff' && (
                  <g transform="translate(55, 120)">
                      <rect x="0" y="0" width="4" height="70" fill="#3f2307" />
                      <circle cx="2" cy="0" r="5" fill="#ef4444" opacity="0.8" />
                  </g>
              )}

              {/* Off Hand */}
              {off === 'wooden_shield' && (
                  <path d="M 135 140 Q 135 170 145 180 Q 155 170 155 140 Z" fill="#5c4033" stroke="#3e2b22" />
              )}
              {off === 'tower_shield' && (
                  <rect x="135" y="130" width="25" height="50" fill="#475569" stroke="#1e293b" />
              )}
              {off === 'orb' && (
                  <circle cx="145" cy="145" r="8" fill="#3b82f6" opacity="0.7">
                      <animate attributeName="opacity" values="0.7;1;0.7" duration="2s" repeatCount="indefinite" />
                  </circle>
              )}
          </g>
      );
  };

  return (
    <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="1" dy="1" result="offsetblur"/>
              <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge> 
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/> 
              </feMerge>
          </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="100" cy="235" rx="40" ry="10" fill="black" opacity="0.3" filter="url(#shadow)" />

      <g filter="url(#shadow)">
        {renderBody()}
        {renderHead()}
        {renderWeapons()}
      </g>
      
    </svg>
  );
};

export default CharacterSVG;
