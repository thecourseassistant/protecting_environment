import React from 'react';
import { Volume2, VolumeX, RotateCcw, Flame, Clock } from 'lucide-react';
import { RubbishCategoryInfo } from '../types';

interface GameHUDProps {
  score: number;
  streak: number;
  timeSeconds: number;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  onRestart: () => void;
  currentCategory: RubbishCategoryInfo;
  collectedCount: number;
  totalRequired: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  streak,
  timeSeconds,
  sfxEnabled,
  onToggleSfx,
  onRestart,
  currentCategory,
  collectedCount,
  totalRequired,
}) => {
  // Format seconds to MM:SS
  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-2.5 py-1.5 sm:px-5 sm:py-2.5 pointer-events-none">
      {/* Top-Left: Compact Score & Time Box */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-900/85 backdrop-blur-md border border-sky-500/40 rounded-xl shadow-lg">
          {/* Score */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-700">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Score:
            </span>
            <span className="text-sm sm:text-base font-extrabold font-fredoka text-amber-400 tabular-nums">
              {score}
            </span>
          </div>

          {/* Time Counter */}
          <div className="flex items-center gap-1 text-slate-200">
            <Clock className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold font-mono tabular-nums tracking-wide text-sky-200">
              {timeFormatted}
            </span>
          </div>
        </div>

        {/* Streak Indicator */}
        {streak > 1 && (
          <div className="hidden xs:flex items-center gap-0.5 px-2 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-400/50 rounded-lg shadow-md animate-bounce">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] sm:text-xs font-bold text-amber-300 tabular-nums">
              {streak}x
            </span>
          </div>
        )}
      </div>

      {/* 
        Top-Center: Reduced-Size Sleek Instruction Badge
        Placed centrally away from Nobita's face so it NEVER obstructs the character.
      */}
      <div className="pointer-events-auto">
        <div className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-xl shadow-lg border border-amber-400/80">
          <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Collect:</span>
          <span
            style={{ color: currentCategory.accentHex }}
            className="font-extrabold uppercase text-xs sm:text-sm drop-shadow-sm"
          >
            {currentCategory.label}
          </span>
          <span className="px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-mono font-bold border border-amber-400/40 ml-0.5">
            {collectedCount}/{totalRequired}
          </span>
        </div>
      </div>

      {/* Top-Right: Sound toggle & Restart buttons */}
      <div className="flex items-center gap-1 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSfx();
          }}
          className={`p-1.5 sm:p-2 rounded-xl border backdrop-blur-md transition-all active:scale-90 ${
            sfxEnabled
              ? 'bg-amber-600/80 border-amber-400 text-white shadow-md'
              : 'bg-slate-900/70 border-slate-700 text-slate-400'
          }`}
          title={sfxEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          aria-label="Toggle sound effects"
        >
          {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
          }}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 active:scale-90 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
          title="Restart Game"
          aria-label="Restart Game"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};
