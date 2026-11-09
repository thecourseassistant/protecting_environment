import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RUBBISH_CATEGORIES,
  RUBBISH_TYPE_LIST,
  TRASH_ITEMS_MAP,
  getItemsForCategory,
} from './data/gameData';
import { RubbishType, HookState } from './types';
import { SurfaceScene } from './components/SurfaceScene';
import { OceanCanvas } from './components/OceanCanvas';
import { GameHUD } from './components/GameHUD';
import { FeedbackBanner, FeedbackEvent } from './components/FeedbackBanner';
import { ResultsModal } from './components/ResultsModal';
import { OrientationNotice } from './components/OrientationNotice';
import { soundEffects } from './services/soundEffects';

export default function App() {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [corrections, setCorrections] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  const [categoryIndex, setCategoryIndex] = useState<number>(0);
  const [collectedInCat, setCollectedInCat] = useState<Set<string>>(new Set());
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);

  const [hookState, setHookState] = useState<HookState>('SWINGING');
  const [feedbackEvent, setFeedbackEvent] = useState<FeedbackEvent | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);

  const currentCategoryKey = RUBBISH_TYPE_LIST[categoryIndex % RUBBISH_TYPE_LIST.length];
  const currentCategory = RUBBISH_CATEGORIES[currentCategoryKey];
  const requiredItems = getItemsForCategory(currentCategoryKey);

  const lastFeedbackId = useRef<number>(1);

  // Time counter: runs every second while game is active
  useEffect(() => {
    if (isGameComplete) return;
    const interval = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameComplete]);

  // Toggle sound effects
  const handleToggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      soundEffects.setSoundEnabled(next);
      return next;
    });
  }, []);

  // Touch anywhere on screen to trigger the claw
  const handleGlobalPointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement | null;
    // Don't fire claw if user tapped a control button or modal
    if (target?.closest('button') || target?.closest('[role="button"]') || target?.closest('.modal-content')) {
      return;
    }
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
  }, []);

  // When an item is grabbed and delivered to the boat
  const handleItemCollected = useCallback(
    (itemId: string, isCorrect: boolean) => {
      const itemDef = TRASH_ITEMS_MAP.get(itemId);
      if (!itemDef) return;

      const feedbackId = lastFeedbackId.current++;
      setFeedbackEvent({
        id: feedbackId,
        itemId,
        targetCategory: currentCategoryKey,
        isCorrect,
      });

      if (isCorrect) {
        // Correct catch! +1 Point
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setTotalCorrect((prev) => prev + 1);
        soundEffects.playCorrectCatch();

        const updatedSet = new Set(collectedInCat);
        updatedSet.add(itemId);
        setCollectedInCat(updatedSet);

        // Check if all items for the current category have been collected!
        if (updatedSet.size >= requiredItems.length) {
          // Check if all 5 categories are completed
          if (categoryIndex >= RUBBISH_TYPE_LIST.length - 1) {
            // All categories finished! VICTORY!
            setTimeout(() => {
              setIsGameComplete(true);
              soundEffects.playFanfare();
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.4 },
              });
            }, 800);
          } else {
            // Move to next category after a brief celebration
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.45 },
            });
            setTimeout(() => {
              setCategoryIndex((prev) => prev + 1);
              setCollectedInCat(new Set());
            }, 1200);
          }
        }
      } else {
        // Wrong catch! -1 Point and increment corrections (errors)
        setScore((prev) => Math.max(0, prev - 1));
        setStreak(0);
        setCorrections((prev) => prev + 1);
        soundEffects.playWrongCatch();
      }
    },
    [currentCategoryKey, collectedInCat, requiredItems.length, categoryIndex]
  );

  // Restart game
  const handleRestart = useCallback(() => {
    soundEffects.playButtonClick();
    setScore(0);
    setStreak(0);
    setTimeSeconds(0);
    setCorrections(0);
    setTotalCorrect(0);
    setCategoryIndex(0);
    setCollectedInCat(new Set());
    setIsGameComplete(false);
    setFeedbackEvent(null);
  }, []);

  return (
    <main
      onPointerDown={handleGlobalPointerDown}
      className="relative w-screen h-screen overflow-hidden bg-sky-950 flex flex-col select-none touch-none"
    >
      {/* Mobile Landscape Orientation Notice */}
      <OrientationNotice />

      {/* Top HUD: Score & Time on top-left, Sound & Restart on top-right, Instruction under sound */}
      <GameHUD
        score={score}
        streak={streak}
        timeSeconds={timeSeconds}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        onRestart={handleRestart}
        currentCategory={currentCategory}
        collectedCount={collectedInCat.size}
        totalRequired={requiredItems.length}
      />

      {/* Feedback Banner: positioned on the left directly under the Score box */}
      <FeedbackBanner
        event={feedbackEvent}
        onDismiss={() => setFeedbackEvent(null)}
      />

      {/* Upper Half: Full-bleed Surface Scene (fills the upper 50% of the screen) */}
      <div className="relative w-full h-1/2 shrink-0 z-20">
        <SurfaceScene />
      </div>

      {/* Lower Half: Underwater Ocean Canvas (fills the lower 50% of the screen) */}
      <div className="relative w-full h-1/2 overflow-hidden z-10">
        <OceanCanvas
          currentCategory={currentCategoryKey}
          onItemCollected={handleItemCollected}
          onClawStateChange={setHookState}
          isPaused={isGameComplete}
        />
      </div>

      {/* Final Results Modal reporting time, corrections, score, and stars */}
      <ResultsModal
        isOpen={isGameComplete}
        score={score}
        timeSeconds={timeSeconds}
        corrections={corrections}
        totalCorrect={totalCorrect}
        onRestart={handleRestart}
      />
    </main>
  );
}
