import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, X } from 'lucide-react';

export const OrientationNotice: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if width is significantly smaller than height and screen is mobile-sized
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth <= 768;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
      <div className="max-w-xs w-full bg-slate-900 border border-sky-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-white">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-sky-500/20 rounded-full animate-ping" />
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-sky-600/30 border border-sky-400 flex items-center justify-center text-sky-300">
            <Smartphone className="w-8 h-8 rotate-90 animate-bounce" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold font-fredoka text-amber-300">
            Rotate Phone to Landscape
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            For the best Doraemon Gold Mining experience, please turn your phone horizontally.
          </p>
        </div>

        <div className="flex flex-col w-full gap-2 pt-2">
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-900/30 transition-all"
          >
            <span>Play Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
};
