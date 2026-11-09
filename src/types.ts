/**
 * Types and Answer Matrix for Doraemon Ocean Cleanup Rubbish Sorter
 */

export type RubbishType =
  | 'electronics'
  | 'glass'
  | 'paper_cardboard'
  | 'metal'
  | 'plastic';

export interface RubbishCategoryInfo {
  id: RubbishType;
  label: string;
  shortLabel: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  accentHex: string;
  iconName: string;
  hint: string;
}

export interface TrashItemDef {
  id: string;
  name: string;
  article: string; // 'a' or 'an'
  categories: RubbishType[];
  weight: number; // 1 (light), 2 (medium), 3 (heavy)
  explanation: string;
  descriptionForStudents: string;
  svgType: string;
}

export interface FloatingItem {
  uid: number;
  defId: string;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  radius: number;
  bobPhase: number;
  bobSpeed: number;
  rotation: number;
  isGrabbed: boolean;
  scale: number;
}

export type HookState = 'SWINGING' | 'SHOOTING' | 'RETRACTING';

export interface ClawState {
  originX: number;
  originY: number;
  angle: number; // in radians
  angularVelocity: number;
  length: number;
  maxLength: number;
  state: HookState;
  grabbedItemUid: number | null;
  speed: number;
}

export type GameMode = 'ENDLESS' | 'TIMED' | 'TARGET_10';

export interface GameStats {
  score: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  maxStreak: number;
  totalAttempts: number;
}
