import React, { useRef, useEffect } from 'react';

const CharacterCanvas = ({ equipped, appearance, isAlive = true, activeCurse = null, activeCompanion = null, companionVariant = null, curseVariant = null, expression = 'neutral' }) => {
    const canvasRef = useRef(null);
    const baseUrl = import.meta.env.BASE_URL;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load ${src}`));
                img.src = src;
            });
        };

        const renderCharacter = async () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (!isAlive) return;

            const layerUrls = [];
            
            // 1. Base Body
            layerUrls.push(`${baseUrl}base_${appearance.gender}_${appearance.skinTone}.png`);
            
            // 2. Base Underclothes
            if (equipped.body === 'tunic') layerUrls.push(`${baseUrl}body_tunic.png`);
            
            // 3. Expression Layer
            layerUrls.push(`${baseUrl}exp_${expression}.png`);

            // 4. Hair
            if (appearance.hairStyle !== 'bald') {
                layerUrls.push(`${baseUrl}hair_${appearance.gender}_${appearance.hairStyle}_${appearance.hairColor}.png`);
            }

            // 5. Equipped Armor / Weapons
            if (equipped.body && equipped.body !== 'none' && equipped.body !== 'tunic') layerUrls.push(`${baseUrl}body_${equipped.body}.png`);
            if (equipped.head && equipped.head !== 'none') layerUrls.push(`${baseUrl}head_${equipped.head}.png`);
            if (equipped.offHand && equipped.offHand !== 'none') layerUrls.push(`${baseUrl}offHand_${equipped.offHand}.png`);
            if (equipped.mainHand && equipped.mainHand !== 'none' && equipped.mainHand !== 'fist') layerUrls.push(`${baseUrl}mainHand_${equipped.mainHand}.png`);

            // 6. Curses and Companions
            if (activeCurse) {
                let curseSrc = `${baseUrl}curse_${activeCurse}`;
                if (curseVariant) curseSrc += `_${curseVariant}`;
                curseSrc += `.png`;
                layerUrls.push(curseSrc);
            }
            if (activeCompanion) {
                let compSrc = `${baseUrl}companion_${activeCompanion}`;
                if (companionVariant) compSrc += `_${companionVariant}`;
                compSrc += `.png`;
                layerUrls.push(compSrc);
            }

            for (const url of layerUrls) {
                try {
                    const img = await loadImage(url);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                } catch (err) {
                    console.warn(err.message);
                }
            }
        };

        renderCharacter();
    }, [equipped, appearance, isAlive, activeCurse, activeCompanion, companionVariant, curseVariant, expression, baseUrl]);

    return (
        <canvas 
            ref={canvasRef} 
            width={64} 
            height={64} 
            className="w-full h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
        />
    );
};

export default CharacterCanvas;
