import React, { useState, useEffect } from 'react';
import bgImage from '../assets/images/ocean_sunny_islands_bg_1794239125079.jpg';
import boatSpriteImage from '../assets/images/doraemon_nobita_boat_sprite_1794239126062.jpg';

export const SurfaceScene: React.FC = () => {
  const [transparentBoatUrl, setTransparentBoatUrl] = useState<string | null>(null);

  // Cut out ONLY the exterior white background using edge flood-fill
  // so Doraemon's white face/belly/eyes and Nobita's eyes/collar/socks remain 100% solid.
  useEffect(() => {
    let objectUrl: string | null = null;
    let isCancelled = false;

    const img = new Image();
    img.src = boatSpriteImage;
    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        const isNearWhite = (idx: number) => {
          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          return min > 215 && max - min < 25;
        };

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const enqueueIfWhite = (x: number, y: number) => {
          if (x < 0 || x >= w || y < 0 || y >= h) return;
          const idx = y * w + x;
          if (visited[idx]) return;
          if (isNearWhite(idx)) {
            visited[idx] = 1;
            queue[tail++] = idx;
          }
        };

        // Seed flood-fill from all 4 outer edges of the image
        for (let x = 0; x < w; x++) {
          enqueueIfWhite(x, 0);
          enqueueIfWhite(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          enqueueIfWhite(0, y);
          enqueueIfWhite(w - 1, y);
        }

        // BFS flood-fill through connected exterior white pixels
        while (head < tail) {
          const idx = queue[head++];
          data[idx * 4 + 3] = 0;

          const x = idx % w;
          const y = (idx - x) / w;

          if (x > 0) enqueueIfWhite(x - 1, y);
          if (x < w - 1) enqueueIfWhite(x + 1, y);
          if (y > 0) enqueueIfWhite(x, y - 1);
          if (y < h - 1) enqueueIfWhite(x, y + 1);
        }

        // Soften 1px fringe bordering the transparent background
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            if (visited[idx]) continue;
            const touchesBg =
              visited[idx - 1] ||
              visited[idx + 1] ||
              visited[idx - w] ||
              visited[idx + w];
            if (touchesBg) {
              const p = idx * 4;
              const min = Math.min(data[p], data[p + 1], data[p + 2]);
              if (min > 180) {
                data[p + 3] = Math.round(data[p + 3] * 0.45);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (isCancelled || !blob) return;
            objectUrl = URL.createObjectURL(blob);
            setTransparentBoatUrl(objectUrl);
          }, 'image/png');
        } else {
          setTransparentBoatUrl(canvas.toDataURL('image/png'));
        }
      } catch {
        setTransparentBoatUrl(boatSpriteImage);
      }
    };
    img.onerror = () => {
      if (!isCancelled) {
        setTransparentBoatUrl(boatSpriteImage);
      }
    };

    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#38bdf8] overflow-hidden select-none flex items-end justify-center">
      {/* Enlarged panoramic background fitting the entire upper half edge-to-edge */}
      <img
        src={bgImage}
        alt="Enlarged ocean background with sun, sky, clouds, and islands"
        className="absolute inset-0 w-full h-full object-cover object-[center_65%] pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Clean cutout of Doraemon, Nobita, and the boat */}
      <div className="relative z-10 flex items-end justify-center h-full pb-1 sm:pb-2 pointer-events-none">
        {transparentBoatUrl && (
          <img
            src={transparentBoatUrl}
            alt="Doraemon and Nobita in their boat"
            className="h-[68%] sm:h-[72%] max-h-full w-auto max-w-[62vw] mx-auto object-contain object-bottom drop-shadow-xl"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Surface Waterline wave shimmer at the bottom boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-sky-500/80 to-transparent pointer-events-none flex items-end z-20">
        <div className="w-full h-0.5 bg-white/60 animate-pulse" />
      </div>
    </div>
  );
};
