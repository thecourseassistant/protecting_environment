import React, { useState, useEffect } from 'react';
import bgImage from '../assets/images/ocean_sunny_islands_bg_1794239125079.jpg';
import boatSpriteImage from '../assets/images/doraemon_nobita_boat_sprite_1794239126062.jpg';

export const SurfaceScene: React.FC = () => {
  const [transparentBoatUrl, setTransparentBoatUrl] = useState<string | null>(null);

  // Cut out Doraemon, Nobita, and the boat by keying out the solid white background
  useEffect(() => {
    const img = new Image();
    img.src = boatSpriteImage;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Chroma key: convert pure white / near-white background to transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // If pixel is white / light background
          if (r > 235 && g > 235 && b > 235) {
            data[i + 3] = 0; // alpha = 0
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setTransparentBoatUrl(canvas.toDataURL('image/png'));
      } catch {
        // Fallback to original image if canvas security policies restrict
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#38bdf8] overflow-hidden select-none flex items-end justify-center">
      {/* 
        Enlarged panoramic background fitting the entire upper half edge-to-edge:
        Clear blue sky, radiant shining sun, fluffy white clouds, tropical islands, and calm sea.
      */}
      <img
        src={bgImage}
        alt="Enlarged ocean background with sun, sky, clouds, and islands"
        className="absolute inset-0 w-full h-full object-cover object-[center_65%] pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* 
        Clean cutout of Doraemon, Nobita, and the boat:
        Scaled down to sit naturally in full on the water without covering the sky or islands.
      */}
      <div className="relative z-10 flex items-end justify-center h-full pb-1 sm:pb-2 pointer-events-none">
        <img
          src={transparentBoatUrl || boatSpriteImage}
          alt="Doraemon and Nobita in their boat"
          className="h-[68%] sm:h-[72%] max-h-full w-auto max-w-[62vw] mx-auto object-contain object-bottom drop-shadow-xl"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Surface Waterline wave shimmer at the bottom boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-sky-500/80 to-transparent pointer-events-none flex items-end z-20">
        <div className="w-full h-0.5 bg-white/60 animate-pulse" />
      </div>
    </div>
  );
};
