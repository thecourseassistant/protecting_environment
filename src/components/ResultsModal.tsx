import React from 'react';
import { Trophy, Clock, AlertTriangle, RotateCcw, CheckCircle2, Star } from 'lucide-react';

interface ResultsModalProps {
  isOpen: boolean;
  score: number;
  timeSeconds: number;
  corrections: number;
  totalCorrect: number;
  onRestart: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  score,
  timeSeconds,
  corrections,
  totalCorrect,
  onRestart,
}) => {
  if (!isOpen) return null;

  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const timeFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  // Performance rating
  const stars = corrections === 0 ? 3 : corrections <= 3 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-300 pointer-events-auto">
      <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl p-5 sm:p-6 text-white text-center flex flex-col items-center gap-4">
        {/* Trophy & Stars Header */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/30">
            <Trophy className="w-9 h-9" />
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-fredoka text-amber-300">
            Ocean Cleanup Complete!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Doraemon and Nobita successfully collected all recyclable rubbish!
          </p>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5 justify-center">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-6 h-6 ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400 animate-bounce'
                  : 'text-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Performance Statistics Grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
          {/* Time Taken */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Time
              </span>
              <p className="text-sm font-extrabold text-white font-mono">{timeFormatted}</p>
            </div>
          </div>

          {/* Corrections (Mistakes made) */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Corrections
              </span>
              <p className="text-sm font-extrabold text-rose-300 font-mono">
                {corrections} {corrections === 1 ? 'error' : 'errors'}
              </p>
            </div>
          </div>

          {/* Final Score */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Final Score
              </span>
              <p className="text-sm font-extrabold text-amber-300 font-mono">{score} pts</p>
            </div>
          </div>

          {/* Items Cleared */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Correct Items
              </span>
              <p className="text-sm font-extrabold text-emerald-300 font-mono">
                {totalCorrect} / 14
              </p>
            </div>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onRestart}
          className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 font-bold font-fredoka rounded-2xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 text-base"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
};
