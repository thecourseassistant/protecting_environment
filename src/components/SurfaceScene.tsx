import React, { useState, useEffect } from 'react';
import bgImage from '../assets/images/ocean_sunny_islands_bg_1794239125079.jpg';
import boatSpriteImage from '../assets/images/doraemon_nobita_boat_sprite_1794239126062.jpg';

export const SurfaceScene: React.FC = () => {
  const [transparentBoatUrl, setTransparentBoatUrl] = useState<string>(boatSpriteImage);

  // Cut out ONLY the exterior white background using a fast, non-blocking edge flood-fill
  useEffect(() => {
    let objectUrl: string | null = null;
    let isCancelled = false;

    const img = new Image();
    img.src = boatSpriteImage;
    img.onload = () => {
      if (isCancelled) return;
      // Defer pixel processing so the UI paints immediately
      setTimeout(() => {
        if (isCancelled) return;
        try {
          const maxDim = 900;
          const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
          const w = Math.max(1, Math.round(img.naturalWidth * scale));
          const h = Math.max(1, Math.round(img.naturalHeight * scale));

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          const total = w * h;
          const visited = new Uint8Array(total);
          const queue = new Int32Array(total);
          let head = 0;
          let tail = 0;

          // Seed top & bottom edges
          for (let x = 0; x < w; x++) {
            const topIdx = x;
            const tp = topIdx * 4;
            if (Math.min(data[tp], data[tp + 1], data[tp + 2]) > 215 &&
                Math.max(data[tp], data[tp + 1], data[tp + 2]) - Math.min(data[tp], data[tp + 1], data[tp + 2]) < 25) {
              visited[topIdx] = 1;
              queue[tail++] = topIdx;
            }
            const botIdx = (h - 1) * w + x;
            if (!visited[botIdx]) {
              const bp = botIdx * 4;
              if (Math.min(data[bp], data[bp + 1], data[bp + 2]) > 215 &&
                  Math.max(data[bp], data[bp + 1], data[bp + 2]) - Math.min(data[bp], data[bp + 1], data[bp + 2]) < 25) {
                visited[botIdx] = 1;
                queue[tail++] = botIdx;
              }
            }
          }

          // Seed left & right edges
          for (let y = 1; y < h - 1; y++) {
            const leftIdx = y * w;
            if (!visited[leftIdx]) {
              const lp = leftIdx * 4;
              if (Math.min(data[lp], data[lp + 1], data[lp + 2]) > 215 &&
                  Math.max(data[lp], data[lp + 1], data[lp + 2]) - Math.min(data[lp], data[lp + 1], data[lp + 2]) < 25) {
                visited[leftIdx] = 1;
                queue[tail++] = leftIdx;
              }
            }
            const rightIdx = y * w + (w - 1);
            if (!visited[rightIdx]) {
              const rp = rightIdx * 4;
              if (Math.min(data[rp], data[rp + 1], data[rp + 2]) > 215 &&
                  Math.max(data[rp], data[rp + 1], data[rp + 2]) - Math.min(data[rp], data[rp + 1], data[rp + 2]) < 25) {
                visited[rightIdx] = 1;
                queue[tail++] = rightIdx;
              }
            }
          }

          // Fast iterative BFS
          while (head < tail) {
            const idx = queue[head++];
            data[idx * 4 + 3] = 0;

            const x = idx % w;
            const y = (idx - x) / w;

            // Left
            if (x > 0) {
              const n = idx - 1;
              if (!visited[n]) {
                const p = n * 4;
                const r = data[p], g = data[p + 1], b = data[p + 2];
                const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
                const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
                if (min > 215 && max - min < 25) {
                  visited[n] = 1;
                  queue[tail++] = n;
                }
              }
            }
            // Right
            if (x < w - 1) {
              const n = idx + 1;
              if (!visited[n]) {
                const p = n * 4;
                const r = data[p], g = data[p + 1], b = data[p + 2];
                const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
                const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
                if (min > 215 && max - min < 25) {
                  visited[n] = 1;
                  queue[tail++] = n;
                }
              }
            }
            // Up
            if (y > 0) {
              const n = idx - w;
              if (!visited[n]) {
                const p = n * 4;
                const r = data[p], g = data[p + 1], b = data[p + 2];
                const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
                const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
                if (min > 215 && max - min < 25) {
                  visited[n] = 1;
                  queue[tail++] = n;
                }
              }
            }
            // Down
            if (y < h - 1) {
              const n = idx + w;
              if (!visited[n]) {
                const p = n * 4;
                const r = data[p], g = data[p + 1], b = data[p + 2];
                const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
                const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
                if (min > 215 && max - min < 25) {
                  visited[n] = 1;
                  queue[tail++] = n;
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
          // Keep original sprite fallback
        }
      }, 0);
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
        <img
          src={transparentBoatUrl}
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
