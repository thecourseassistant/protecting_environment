import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { RubbishType } from '../types';

export interface FeedbackEvent {
  id: number;
  itemId: string;
  targetCategory: RubbishType;
  isCorrect: boolean;
}

interface FeedbackBannerProps {
  event: FeedbackEvent | null;
  onDismiss: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ event, onDismiss }) => {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2200);
    return () => clearTimeout(timer);
  }, [event, onDismiss]);

  if (!event) return null;

  return (
    <div className="absolute top-13 sm:top-15 left-3 sm:left-6 z-40 pointer-events-none animate-in slide-in-from-top-2 fade-in duration-150">
      <div
        className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-xl border backdrop-blur-md flex items-center gap-2 text-white ${
          event.isCorrect
            ? 'bg-emerald-950/90 border-emerald-400/80 shadow-emerald-950/60'
            : 'bg-rose-950/90 border-rose-400/80 shadow-rose-950/60'
        }`}
      >
        {event.isCorrect ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold text-emerald-300 font-fredoka tracking-wide">
              CORRECT! +1
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold text-rose-300 font-fredoka tracking-wide">
              WRONG! -1
            </span>
          </>
        )}
      </div>
    </div>
  );
};
