import React, { useState, useEffect, useRef } from 'react';

const CharacterCanvas = ({ equipped, appearance, isAlive, activeCurse, activeCompanion, companionVariant, curseVariant, expression = 'neutral' }) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL; 
    
    const sources = {
      base_male_pale: `${baseUrl}base_male_pale.png`,
      base_male_fair: `${baseUrl}base_male_fair.png`,
      base_male_tan: `${baseUrl}base_male_tan.png`,
      base_male_dark: `${baseUrl}base_male_dark.png`,
      base_male_deep: `${baseUrl}base_male_deep.png`,
      base_female_pale: `${baseUrl}base_female_pale.png`,
      base_female_fair: `${baseUrl}base_female_fair.png`,
      base_female_tan: `${baseUrl}base_female_tan.png`,
      base_female_dark: `${baseUrl}base_female_dark.png`,
      base_female_deep: `${baseUrl}base_female_deep.png`,
      
      exp_male_neutral: `${baseUrl}exp_male_neutral.png`,
      exp_male_smug: `${baseUrl}exp_male_smug.png`,
      exp_male_stressed: `${baseUrl}exp_male_stressed.png`,
      exp_male_miserable: `${baseUrl}exp_male_miserable.png`,
      exp_male_unhinged: `${baseUrl}exp_male_unhinged.png`,
      exp_female_neutral: `${baseUrl}exp_female_neutral.png`,
      exp_female_smug: `${baseUrl}exp_female_smug.png`,
      exp_female_stressed: `${baseUrl}exp_female_stressed.png`,
      exp_female_miserable: `${baseUrl}exp_female_miserable.png`,
      exp_female_unhinged: `${baseUrl}exp_female_unhinged.png`,

      eyes_male_blue: `${baseUrl}eyes_male_blue.png`,
      eyes_male_brown: `${baseUrl}eyes_male_brown.png`,
      eyes_male_green: `${baseUrl}eyes_male_green.png`,
      eyes_male_hazel: `${baseUrl}eyes_male_hazel.png`,
      eyes_male_red: `${baseUrl}eyes_male_red.png`,
      eyes_female_blue: `${baseUrl}eyes_female_blue.png`,
      eyes_female_brown: `${baseUrl}eyes_female_brown.png`,
      eyes_female_green: `${baseUrl}eyes_female_green.png`,
      eyes_female_hazel: `${baseUrl}eyes_female_hazel.png`,
      eyes_female_red: `${baseUrl}eyes_female_red.png`,
      
      hair_long_male_black: `${baseUrl}hair_long_male_black.png`,
      hair_long_male_blonde: `${baseUrl}hair_long_male_blonde.png`,
      hair_long_male_brown: `${baseUrl}hair_long_male_brown.png`,
      hair_long_male_grey: `${baseUrl}hair_long_male_grey.png`,
      hair_long_male_red: `${baseUrl}hair_long_male_red.png`,
      hair_long_male_white: `${baseUrl}hair_long_male_white.png`,
      
      hair_short_male_black: `${baseUrl}hair_short_male_black.png`,
      hair_short_male_blonde: `${baseUrl}hair_short_male_blonde.png`,
      hair_short_male_brown: `${baseUrl}hair_short_male_brown.png`,
      hair_short_male_grey: `${baseUrl}hair_short_male_grey.png`,
      hair_short_male_red: `${baseUrl}hair_short_male_red.png`,
      hair_short_male_white: `${baseUrl}hair_short_male_white.png`,
      
      hair_long_female_black: `${baseUrl}hair_long_female_black.png`,
      hair_long_female_blonde: `${baseUrl}hair_long_female_blonde.png`,
      hair_long_female_brown: `${baseUrl}hair_long_female_brown.png`,
      hair_long_female_grey: `${baseUrl}hair_long_female_grey.png`,
      hair_long_female_red: `${baseUrl}hair_long_female_red.png`,
      hair_long_female_white: `${baseUrl}hair_long_female_white.png`,
      
      hair_short_female_black: `${baseUrl}hair_short_female_black.png`,
      hair_short_female_blonde: `${baseUrl}hair_short_female_blonde.png`,
      hair_short_female_brown: `${baseUrl}hair_short_female_brown.png`,
      hair_short_female_grey: `${baseUrl}hair_short_female_grey.png`,
      hair_short_female_red: `${baseUrl}hair_short_female_red.png`,
      hair_short_female_white: `${baseUrl}hair_short_female_white.png`,
      
      armor_leather_armor_male: `${baseUrl}armor_leather_male.png`,
      armor_leather_armor_female: `${baseUrl}armor_leather_female.png`,
      armor_chainmail_male: `${baseUrl}armor_chain_male.png`,
      armor_chainmail_female: `${baseUrl}armor_chain_female.png`,
      armor_plate_male: `${baseUrl}armor_plate_male.png`,
      armor_plate_female: `${baseUrl}armor_plate_female.png`,
      
      robe_blue_male: `${baseUrl}robe_blue_male.png`,
      robe_blue_female: `${baseUrl}robe_blue_female.png`,
      robe_red_male: `${baseUrl}robe_red_male.png`,
      robe_red_female: `${baseUrl}robe_red_female.png`,
      robe_green_male: `${baseUrl}robe_green_male.png`,
      robe_green_female: `${baseUrl}robe_green_female.png`,
      robe_yellow_male: `${baseUrl}robe_yellow_male.png`,
      robe_yellow_female: `${baseUrl}robe_yellow_female.png`,
      robe_black_male: `${baseUrl}robe_black_male.png`,
      robe_black_female: `${baseUrl}robe_black_female.png`,
      
      hat_male_blue: `${baseUrl}hat_male_blue.png`,
      hat_female_blue: `${baseUrl}hat_female_blue.png`,
      hat_male_red: `${baseUrl}hat_male_red.png`,
      hat_female_red: `${baseUrl}hat_female_red.png`,
      hat_male_green: `${baseUrl}hat_male_green.png`,
      hat_female_green: `${baseUrl}hat_female_green.png`,
      hat_male_yellow: `${baseUrl}hat_male_yellow.png`,
      hat_female_yellow: `${baseUrl}hat_female_yellow.png`,
      hat_male_black: `${baseUrl}hat_male_black.png`,
      hat_female_black: `${baseUrl}hat_female_black.png`,
      iron_helm_male: `${baseUrl}iron_helm_male.png`,
      iron_helm_female: `${baseUrl}iron_helm_female.png`,
      leather_cap_male: `${baseUrl}leather_cap_male.png`,
      leather_cap_female: `${baseUrl}leather_cap_female.png`,
      
      belt_hip_base: `${baseUrl}belt_hip.png`,
      belt_back_base: `${baseUrl}belt_back.png`,
      belt_hip_chain_mail: `${baseUrl}belt_hip_chain_mail.png`,
      belt_back_chain_mail: `${baseUrl}belt_back_chain_mail.png`,
      belt_hip_leather: `${baseUrl}belt_hip_leather.png`,
      belt_back_leather: `${baseUrl}belt_back_leather.png`,
      belt_hip_plate: `${baseUrl}belt_hip_plate.png`,
      belt_back_plate: `${baseUrl}belt_back_plate.png`,
      belt_hip_robe1: `${baseUrl}belt_hip_robe1.png`,
      belt_back_robe1: `${baseUrl}belt_back_robe1.png`,
      belt_hip_robe2: `${baseUrl}belt_hip_robe2.png`,
      belt_back_robe2: `${baseUrl}belt_back_robe2.png`,

      weapon_dagger: `${baseUrl}weapon_dagger.png`,
      weapon_sword: `${baseUrl}weapon_sword.png`,
      weapon_hammer: `${baseUrl}weapon_warhammer.png`,
      weapon_axe: `${baseUrl}weapon_battleaxe.png`,
      weapon_staff: `${baseUrl}weapon_staff.png`,
      shield_wooden: `${baseUrl}offhand_shield.png`,
      shield_tower: `${baseUrl}offhand_tower_shield.png`,
      offhand_book: `${baseUrl}offhand_book.png`,

      companion_goblin: `${baseUrl}companion_goblin.png`,
      companion_groupie: `${baseUrl}companion_groupie.png`,
      companion_mimic: `${baseUrl}companion_mimic.png`,
      companion_spouse_male1: `${baseUrl}companion_spouse_male1.png`,
      companion_spouse_male2: `${baseUrl}companion_spouse_male2.png`,
      companion_spouse_male3: `${baseUrl}companion_spouse_male3.png`,
      companion_spouse_female1: `${baseUrl}companion_spouse_female1.png`,
      companion_spouse_female2: `${baseUrl}companion_spouse_female2.png`,
      companion_spouse_female3: `${baseUrl}companion_spouse_female3.png`,
      companion_pet_rock: `${baseUrl}companion_rock.png`,
      
      curse_butterfingers_male: `${baseUrl}Curse_Butterfingers_male.png`,
      curse_butterfingers_female: `${baseUrl}Curse_Butterfingers_female.png`,

      curse_cult1_male: `${baseUrl}Curse_cult1_male.png`,
      curse_cult1_female: `${baseUrl}Curse_cult1_female.png`,
      curse_cult2_male: `${baseUrl}Curse_cult2_male.png`,
      curse_cult2_female: `${baseUrl}Curse_cult2_female.png`,

      curse_girdle_male: `${baseUrl}Curse_girdle_male.png`,
      curse_girdle_female: `${baseUrl}Curse_girdle_female.png`,

      curse_dye1_male: `${baseUrl}Curse_dye1_male.png`,
      curse_dye1_female: `${baseUrl}Curse_dye1_female.png`,
      curse_dye2_male: `${baseUrl}Curse_dye2_male.png`,
      curse_dye2_female: `${baseUrl}Curse_dye2_female.png`,
      curse_dye3_male: `${baseUrl}Curse_dye3_male.png`,
      curse_dye3_female: `${baseUrl}Curse_dye3_female.png`,
      curse_dye4_male: `${baseUrl}Curse_dye4_male.png`,
      curse_dye4_female: `${baseUrl}Curse_dye4_female.png`
    };

    let loadedCount = 0;
    const totalImages = Object.keys(sources).length;

    Object.entries(sources).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesRef.current[key] = img;
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) setImagesLoaded(true);
      };
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isAlive) ctx.filter = 'grayscale(100%) opacity(50%)';
      else ctx.filter = 'none';

      const renderGender = activeCurse === 'girdle' ? (appearance.gender === 'male' ? 'female' : 'male') : appearance.gender;

      const getBaseId = (itemId) => {
        if (!itemId || itemId === 'none') return 'none';
        let base = itemId;
        if (base.startsWith('magical_')) base = base.replace('magical_', '');
        if (base.startsWith('enchanted_')) base = base.replace('enchanted_', '');
        if (base.startsWith('aegis_')) base = base.replace('aegis_', '');
        if (base.startsWith('arch_mage_')) base = 'wizard_';
        return base;
      };

      const resolvedMainHand = getBaseId(equipped.mainHand);
      const resolvedOffHand = getBaseId(equipped.offHand);
      const resolvedBody = getBaseId(equipped.body);
      const resolvedHead = getBaseId(equipped.head);

      const hipWeapons = ['dagger', 'book'];
      const backWeapons = ['sword', 'hammer', 'axe', 'staff'];
      
      const hasHipItem = hipWeapons.includes(resolvedMainHand) || hipWeapons.includes(resolvedOffHand);
      const hasBackItem = backWeapons.includes(resolvedMainHand) || backWeapons.includes(resolvedOffHand);

      let beltSuffix = 'base';
      if (resolvedBody === 'leather_armor') beltSuffix = 'leather';
      else if (resolvedBody === 'chainmail') beltSuffix = 'chain_mail';
      else if (resolvedBody === 'plate') beltSuffix = 'plate';
      else if (resolvedBody && (resolvedBody.startsWith('robe') || resolvedBody === 'cultist_robe')) beltSuffix = 'robe1';

      let armorBaseStr = 'base';
      if (resolvedBody === 'leather_armor') armorBaseStr = 'armor_leather';
      else if (resolvedBody === 'chainmail') armorBaseStr = 'armor_chain';
      else if (resolvedBody === 'plate') armorBaseStr = 'armor_plate';
      else if (resolvedBody && resolvedBody.startsWith('robe')) {
          const color = resolvedBody.includes('_') ? resolvedBody.split('_')[1] : 'blue';
          armorBaseStr = `robe_${color}`;
      }

      const drawLayer = (key) => {
          const img = imagesRef.current[key];
          if (img) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
      };

      if (backWeapons.includes(resolvedMainHand)) drawLayer(`weapon_${resolvedMainHand}`);
      if (backWeapons.includes(resolvedOffHand)) drawLayer(`weapon_${resolvedOffHand}`);

      const baseKey = `base_${renderGender}_${appearance.skinTone}`;
      if (imagesRef.current[baseKey]) drawLayer(baseKey);
      else drawLayer(renderGender === 'female' ? 'base_female_pale' : 'base_male_pale');

      drawLayer(`exp_${renderGender}_${expression}`);

      drawLayer(`eyes_${renderGender}_${appearance.eyeColor}`);

      if (resolvedBody && resolvedBody !== 'tunic' && resolvedBody !== 'none' && resolvedBody !== 'cultist_robe') {
          let armorKey = `armor_${resolvedBody}_${renderGender}`;
          if (resolvedBody.startsWith('robe')) armorKey = `${armorBaseStr}_${renderGender}`;
          drawLayer(armorKey);
      }

      const wearingFullHelm = resolvedHead === 'iron_helm';
      
      if (!wearingFullHelm && resolvedBody !== 'cultist_robe') {
          if (activeCurse === 'dungeon_dye_job') {
              drawLayer(`curse_dye${curseVariant || 1}_${renderGender}`);
          } else if (appearance.hairStyle !== 'bald') {
              drawLayer(`hair_${appearance.hairStyle}_${renderGender}_${appearance.hairColor}`);
          }
      }

      if (resolvedBody === 'cultist_robe') {
          drawLayer(`curse_cult${curseVariant || 1}_${renderGender}`);
      }

      if (hasBackItem) drawLayer(`belt_back_${beltSuffix}`);
      if (hasHipItem) drawLayer(`belt_hip_${beltSuffix}`);

      if (hipWeapons.includes(resolvedMainHand) && resolvedMainHand !== 'book') drawLayer(`weapon_${resolvedMainHand}`);
      if (hipWeapons.includes(resolvedOffHand) && resolvedOffHand !== 'book') drawLayer(`weapon_${resolvedOffHand}`);

      if (resolvedOffHand && resolvedOffHand !== 'none') {
          if (resolvedOffHand.includes('shield')) drawLayer(`shield_${resolvedOffHand.split('_')[0]}`);
          else if (resolvedOffHand === 'book') drawLayer('offhand_book');
      }

      if (resolvedHead && resolvedHead !== 'none' && resolvedBody !== 'cultist_robe') {
          if (resolvedHead === 'wizard_hat') {
              drawLayer(`hat_${renderGender}_blue`);
          } else if (resolvedHead.startsWith('hat_')) {
              const color = resolvedHead.split('_')[1];
              drawLayer(`hat_${renderGender}_${color}`);
          } else {
              drawLayer(`${resolvedHead}_${renderGender}`);
          }
      }

      if (activeCompanion) {
          if (activeCompanion === 'spouse' && companionVariant) {
              const variantKey = companionVariant.replace('_', '');
              drawLayer(`companion_spouse_${variantKey}`);
          } else {
              drawLayer(`companion_${activeCompanion}`);
          }
      }

      if (activeCurse === 'butterfingers') {
          drawLayer(`curse_butterfingers_${renderGender}`);
      }

      if (activeCurse === 'girdle') {
          drawLayer(`curse_girdle_${renderGender}`);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [equipped, appearance, isAlive, imagesLoaded, activeCurse, activeCompanion, companionVariant, curseVariant, expression]);

  return (
    <canvas 
        ref={canvasRef} 
        width={768} 
        height={768} 
        className="w-full h-full object-contain" 
        style={{ filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.8))' }} 
    />
  );
};

export default CharacterCanvas;
