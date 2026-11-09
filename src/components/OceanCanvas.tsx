import React, { useRef, useEffect, useCallback } from 'react';
import { ClawState, FloatingItem, RubbishType } from '../types';
import { TRASH_ITEMS, TRASH_ITEMS_MAP } from '../data/gameData';
import { soundEffects } from '../services/soundEffects';

interface OceanCanvasProps {
  currentCategory: RubbishType;
  onItemCollected: (itemId: string, isCorrect: boolean) => void;
  onClawStateChange?: (state: 'SWINGING' | 'SHOOTING' | 'RETRACTING') => void;
  isPaused?: boolean;
}

export const OceanCanvas: React.FC<OceanCanvasProps> = ({
  currentCategory,
  onItemCollected,
  onClawStateChange,
  isPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game physics state stored in refs for 60fps performance
  const clawRef = useRef<ClawState>({
    originX: 0,
    originY: 0,
    angle: 0,
    angularVelocity: 1.5, // radians per sec
    length: 54, // Long enough to hang fully below the boat into the water
    maxLength: 700,
    state: 'SWINGING',
    grabbedItemUid: null,
    speed: 560, // pixels per second
  });

  const itemsRef = useRef<FloatingItem[]>([]);
  const currentCategoryRef = useRef<RubbishType>(currentCategory);
  currentCategoryRef.current = currentCategory;

  const lastTimeRef = useRef<number>(performance.now());
  const uidCounter = useRef<number>(1);

  // Background bubbles
  const bubblesRef = useRef<Array<{ x: number; y: number; r: number; speed: number; phase: number }>>([]);

  // Initialize bubbles
  useEffect(() => {
    bubblesRef.current = Array.from({ length: 20 }, () => ({
      x: Math.random() * 900,
      y: 50 + Math.random() * 500,
      r: 2.5 + Math.random() * 4,
      speed: 18 + Math.random() * 26,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Helper to spawn a varied set of floating items in the ocean with horizontal velocities
  const spawnInitialItems = useCallback((width: number, height: number) => {
    const spawned: FloatingItem[] = [];
    const availableDefs = [...TRASH_ITEMS];

    // Ensure all matching items for this category are present with zero duplicates
    const matchingDefs = availableDefs.filter((d) => d.categories.includes(currentCategoryRef.current));
    const nonMatchingDefs = availableDefs.filter((d) => !d.categories.includes(currentCategoryRef.current));

    const pickedMap = new Map<string, (typeof TRASH_ITEMS)[0]>();

    // 1. Add ALL matching items for the current category so player can collect them all
    matchingDefs.forEach((def) => {
      pickedMap.set(def.id, def);
    });

    // 2. Fill remaining slots up to target count from non-matching items (no duplicates)
    const targetCount = Math.min(8, Math.max(6, Math.floor(width / 110)));
    const shuffledNonMatching = [...nonMatchingDefs].sort(() => Math.random() - 0.5);
    for (const def of shuffledNonMatching) {
      if (pickedMap.size >= targetCount) break;
      pickedMap.set(def.id, def);
    }

    const pickedDefs = Array.from(pickedMap.values()).sort(() => Math.random() - 0.5);

    // Distribute across ocean depths
    const minX = 80;
    const maxX = width - 80;
    const minY = Math.max(80, height * 0.25);
    const maxY = height * 0.85;

    const cols = Math.ceil(pickedDefs.length / 2);
    const colWidth = (maxX - minX) / cols;

    pickedDefs.forEach((def, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const x = minX + col * colWidth + (Math.random() * 0.5 + 0.25) * colWidth;
      const y = minY + (row * 0.45 + Math.random() * 0.28) * (maxY - minY);

      // Random horizontal drift velocity (18 to 34 px/sec, left or right)
      const speed = 18 + Math.random() * 16;
      const direction = Math.random() > 0.5 ? 1 : -1;

      spawned.push({
        uid: uidCounter.current++,
        defId: def.id,
        x,
        y,
        baseY: y,
        vx: speed * direction,
        radius: 28,
        bobPhase: Math.random() * Math.PI * 2,
        bobSpeed: 1.2 + Math.random() * 0.8,
        rotation: (Math.random() - 0.5) * 0.25,
        isGrabbed: false,
        scale: 1,
      });
    });

    itemsRef.current = spawned;
  }, []);

  // Update canvas size and origin
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Claw hangs directly from the top waterline below the boat
    clawRef.current.originX = rect.width / 2;
    clawRef.current.originY = 2; // top waterline edge
    clawRef.current.maxLength = Math.hypot(rect.width, rect.height) * 1.1;

    // Spawn items if empty
    if (itemsRef.current.length === 0) {
      spawnInitialItems(rect.width, rect.height);
    }
  }, [spawnInitialItems]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // When currentCategory changes to a new rubbish type, ensure all matching items are populated
  useEffect(() => {
    currentCategoryRef.current = currentCategory;
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      if (width > 0 && height > 0) {
        spawnInitialItems(width, height);
      }
    }
  }, [currentCategory, spawnInitialItems]);

  // Launch claw action trigger
  const launchClaw = useCallback(() => {
    if (clawRef.current.state === 'SWINGING') {
      clawRef.current.state = 'SHOOTING';
      soundEffects.playClawLaunch();
      onClawStateChange?.('SHOOTING');
    }
  }, [onClawStateChange]);

  // Handle pointer down anywhere on canvas
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      launchClaw();
    },
    [launchClaw]
  );

  // Global window listeners for spacebar or external clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowDown') {
        e.preventDefault();
        launchClaw();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [launchClaw]);

  // Main game animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let swingTime = 0;

    const render = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Deep Ocean Gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
      oceanGrad.addColorStop(0, '#0284c7'); // Surface cyan
      oceanGrad.addColorStop(0.25, '#0369a1'); // Upper ocean
      oceanGrad.addColorStop(0.7, '#075985'); // Mid depths
      oceanGrad.addColorStop(1, '#0c4a6e'); // Deep seabed
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated Sunbeams streaming down from the surface
      ctx.save();
      ctx.globalAlpha = 0.09;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        const rayOffset = ((time * 0.025 + i * 200) % (width + 300)) - 150;
        ctx.beginPath();
        ctx.moveTo(rayOffset, 0);
        ctx.lineTo(rayOffset + 70, 0);
        ctx.lineTo(rayOffset + 160, height);
        ctx.lineTo(rayOffset + 30, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. Ambient Bubbles
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      bubblesRef.current.forEach((b) => {
        b.y -= b.speed * dt;
        b.x += Math.sin(time * 0.002 + b.phase) * 0.35;
        if (b.y < 0) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();

      // 4. Sandy Seabed & Plants
      ctx.save();
      const seabedY = height - 26;
      ctx.fillStyle = '#0f3a58';
      ctx.beginPath();
      ctx.moveTo(0, seabedY);
      for (let x = 0; x <= width; x += 30) {
        ctx.lineTo(x, seabedY + Math.sin(x * 0.04 + time * 0.001) * 3.5);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Seaweed / Coral silhouettes
      for (let s = 40; s < width; s += 110) {
        ctx.fillStyle = '#064e3b';
        ctx.globalAlpha = 0.35;
        const sway = Math.sin(time * 0.002 + s) * 7;
        ctx.beginPath();
        ctx.moveTo(s, height);
        ctx.quadraticCurveTo(s + sway, height - 35, s + sway * 1.5, height - 58);
        ctx.quadraticCurveTo(s + sway, height - 35, s + 10, height);
        ctx.fill();
      }
      ctx.restore();

      // 5. Update Floating Items (Horizontal Drift + Vertical Bobbing)
      const claw = clawRef.current;
      itemsRef.current.forEach((item) => {
        if (!item.isGrabbed) {
          // Horizontal drift movement
          item.x += item.vx * dt;

          // Bounce gently off screen boundaries
          if (item.x < item.radius + 20 && item.vx < 0) {
            item.vx = Math.abs(item.vx);
          } else if (item.x > width - item.radius - 20 && item.vx > 0) {
            item.vx = -Math.abs(item.vx);
          }

          // Vertical wave bobbing
          item.bobPhase += dt * item.bobSpeed;
          item.y = item.baseY + Math.sin(item.bobPhase) * 6;
        }
      });

      // 6. Update Claw State
      if (!isPaused) {
        if (claw.state === 'SWINGING') {
          swingTime += dt * claw.angularVelocity;
          const maxSwingAngle = 1.1; // ~63 degrees
          claw.angle = Math.sin(swingTime) * maxSwingAngle;
          claw.length = 54; // Clearly visible below waterline
        } else if (claw.state === 'SHOOTING') {
          claw.length += claw.speed * dt;

          const clawTipX = claw.originX + Math.sin(claw.angle) * claw.length;
          const clawTipY = claw.originY + Math.cos(claw.angle) * claw.length;

          // Check boundaries
          if (
            clawTipX < 15 ||
            clawTipX > width - 15 ||
            clawTipY > height - 15 ||
            claw.length >= claw.maxLength
          ) {
            claw.state = 'RETRACTING';
            onClawStateChange?.('RETRACTING');
          } else {
            // Collision detection with items
            for (const item of itemsRef.current) {
              if (item.isGrabbed) continue;

              const dist = Math.hypot(clawTipX - item.x, clawTipY - item.y);
              if (dist <= item.radius + 15) {
                // Grabbed!
                item.isGrabbed = true;
                claw.grabbedItemUid = item.uid;
                claw.state = 'RETRACTING';
                soundEffects.playClawGrab();
                onClawStateChange?.('RETRACTING');
                break;
              }
            }
          }
        } else if (claw.state === 'RETRACTING') {
          let retractSpeed = claw.speed * 0.95;
          if (claw.grabbedItemUid !== null) {
            const item = itemsRef.current.find((it) => it.uid === claw.grabbedItemUid);
            if (item) {
              const def = TRASH_ITEMS_MAP.get(item.defId);
              const weightFactor = def ? def.weight : 1.2;
              retractSpeed = claw.speed / (1 + weightFactor * 0.35);

              // Update item position to follow claw tip
              const clawTipX = claw.originX + Math.sin(claw.angle) * claw.length;
              const clawTipY = claw.originY + Math.cos(claw.angle) * claw.length;
              item.x = clawTipX;
              item.y = clawTipY + 10;
            }
          }

          claw.length -= retractSpeed * dt;

          if (claw.length <= 54) {
            // Reeled back up to boat!
            claw.length = 54;
            claw.state = 'SWINGING';
            onClawStateChange?.('SWINGING');

            if (claw.grabbedItemUid !== null) {
              const item = itemsRef.current.find((it) => it.uid === claw.grabbedItemUid);
              if (item) {
                const def = TRASH_ITEMS_MAP.get(item.defId);
                if (def) {
                  const isCorrect = def.categories.includes(currentCategoryRef.current);
                  onItemCollected(item.defId, isCorrect);
                }
              }

              // Remove grabbed item and respawn
              const removedUid = claw.grabbedItemUid;
              itemsRef.current = itemsRef.current.filter((it) => it.uid !== removedUid);
              claw.grabbedItemUid = null;

              // Respawn replacement item without duplicating any item currently present
              setTimeout(() => {
                const activeIds = new Set(itemsRef.current.map((it) => it.defId));
                // Only candidate items not currently in the water
                const unpickedDefs = TRASH_ITEMS.filter((def) => !activeIds.has(def.id));

                if (unpickedDefs.length > 0 && itemsRef.current.length < 8) {
                  // If no matching items remain in the water, prioritize spawning one
                  const matchingUnpicked = unpickedDefs.filter((d) =>
                    d.categories.includes(currentCategoryRef.current)
                  );
                  const hasMatchingInWater = itemsRef.current.some((it) => {
                    const d = TRASH_ITEMS_MAP.get(it.defId);
                    return d && d.categories.includes(currentCategoryRef.current);
                  });

                  const newDef =
                    !hasMatchingInWater && matchingUnpicked.length > 0
                      ? matchingUnpicked[Math.floor(Math.random() * matchingUnpicked.length)]
                      : unpickedDefs[Math.floor(Math.random() * unpickedDefs.length)];

                  const rx = 80 + Math.random() * (width - 160);
                  const ry = Math.max(90, height * 0.28 + Math.random() * (height * 0.5));
                  const speed = 18 + Math.random() * 16;
                  const direction = Math.random() > 0.5 ? 1 : -1;

                  itemsRef.current.push({
                    uid: uidCounter.current++,
                    defId: newDef.id,
                    x: rx,
                    y: ry,
                    baseY: ry,
                    vx: speed * direction,
                    radius: 28,
                    bobPhase: Math.random() * Math.PI * 2,
                    bobSpeed: 1.2 + Math.random() * 0.8,
                    rotation: (Math.random() - 0.5) * 0.25,
                    isGrabbed: false,
                    scale: 1,
                  });
                }
              }, 400);
            }
          }
        }
      }

      // 7. Draw Floating Items with English Labels
      itemsRef.current.forEach((item) => {
        const def = TRASH_ITEMS_MAP.get(item.defId);
        if (!def) return;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        // Water ripple oval under item
        ctx.beginPath();
        ctx.ellipse(0, 20, 24, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fill();

        // Background bubble container
        ctx.beginPath();
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw Item Graphic
        drawItemGraphic(ctx, def.svgType, item.radius * 0.85);

        ctx.restore();

        // English word label tag below item
        ctx.save();
        ctx.translate(item.x, item.y + item.radius + 12);

        const labelText = def.name;
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        const tagW = textWidth + 14;
        const tagH = 20;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-tagW / 2, -tagH / 2, tagW, tagH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, 0, 0);

        ctx.restore();
      });

      // 8. Draw Waterline Winch Mount Bracket (where cable emerges from boat)
      ctx.save();
      ctx.translate(claw.originX, claw.originY);
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-20, -2, 40, 10, [0, 0, 6, 6]);
      ctx.fill();
      ctx.stroke();
      // Center Pulley wheel
      ctx.beginPath();
      ctx.arc(0, 5, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.restore();

      // 9. Draw Mechanical Cable & Prominent Visible Claw
      const tipX = claw.originX + Math.sin(claw.angle) * claw.length;
      const tipY = claw.originY + Math.cos(claw.angle) * claw.length;

      // Steel Cable line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(claw.originX, claw.originY + 5);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner cable wire highlight
      ctx.beginPath();
      ctx.moveTo(claw.originX, claw.originY + 5);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Mechanical Claw Head (Large & fully visible in ocean)
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(-claw.angle);

      // Claw Hub (Metallic gold & steel ring)
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#475569';
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Mechanical Prongs / Pincers
      const isClamping = claw.grabbedItemUid !== null;
      const prongSpread = isClamping ? 0.35 : 0.8;

      // Left Prong
      ctx.save();
      ctx.rotate(-prongSpread);
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-9, 18);
      ctx.lineTo(0, 26);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      // Sharp golden tip hook
      ctx.beginPath();
      ctx.moveTo(0, 26);
      ctx.lineTo(5, 22);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();

      // Right Prong
      ctx.save();
      ctx.rotate(prongSpread);
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(9, 18);
      ctx.lineTo(0, 26);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      // Sharp golden tip hook
      ctx.beginPath();
      ctx.moveTo(0, 26);
      ctx.lineTo(-5, 22);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();

      // Center Laser Targeting Glow
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = claw.state === 'SHOOTING' ? '#22c55e' : '#ef4444';
      ctx.fill();

      ctx.restore();

      ctx.restore(); // Restore DPR scale

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, onItemCollected, onClawStateChange]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative w-full h-full cursor-pointer select-none overflow-hidden touch-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

/**
 * Pure Canvas 2D vector drawing for each trash item
 */
function drawItemGraphic(ctx: CanvasRenderingContext2D, type: string, size: number) {
  ctx.save();

  switch (type) {
    case 'computer': {
      // Monitor body
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size * 0.75, -size * 0.7, size * 1.5, size * 1.1, 4);
      ctx.fill();
      ctx.stroke();

      // Screen
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(-size * 0.6, -size * 0.55, size * 1.2, size * 0.8);

      // Glare
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, -size * 0.5);
      ctx.lineTo(-size * 0.1, -size * 0.5);
      ctx.lineTo(-size * 0.4, size * 0.2);
      ctx.closePath();
      ctx.fill();

      // Stand
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-size * 0.2, size * 0.4, size * 0.4, size * 0.25);
      ctx.fillRect(-size * 0.45, size * 0.65, size * 0.9, size * 0.15);
      break;
    }

    case 'tv': {
      // Antenna
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, -size * 0.9);
      ctx.lineTo(-size * 0.1, -size * 0.6);
      ctx.moveTo(size * 0.4, -size * 0.9);
      ctx.lineTo(size * 0.1, -size * 0.6);
      ctx.stroke();

      // Body (Wood/Plastic)
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size * 0.8, -size * 0.6, size * 1.6, size * 1.2, 5);
      ctx.fill();
      ctx.stroke();

      // CRT Glass Screen
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(-size * 0.65, -size * 0.45, size * 0.95, size * 0.9, 3);
      ctx.fill();

      // Knobs
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(size * 0.5, -size * 0.2, size * 0.12, 0, Math.PI * 2);
      ctx.arc(size * 0.5, size * 0.15, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bottle': {
      // Cap
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-size * 0.18, -size * 0.85, size * 0.36, size * 0.2);

      // Plastic body
      ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-size * 0.15, -size * 0.65);
      ctx.lineTo(size * 0.15, -size * 0.65);
      ctx.lineTo(size * 0.38, -size * 0.25);
      ctx.lineTo(size * 0.38, size * 0.7);
      ctx.lineTo(-size * 0.38, size * 0.7);
      ctx.lineTo(-size * 0.38, -size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-size * 0.36, -size * 0.05, size * 0.72, size * 0.4);
      break;
    }

    case 'jar': {
      // Metal lid
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-size * 0.45, -size * 0.75, size * 0.9, size * 0.22, 2);
      ctx.fill();
      ctx.stroke();

      // Glass body
      ctx.fillStyle = 'rgba(186, 230, 253, 0.8)';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size * 0.55, -size * 0.5, size * 1.1, size * 1.15, 6);
      ctx.fill();
      ctx.stroke();

      // Jam contents
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.roundRect(-size * 0.42, -size * 0.15, size * 0.84, size * 0.7, 4);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(-size * 0.35, -size * 0.05, size * 0.7, size * 0.35);
      break;
    }

    case 'aluminum_foil': {
      const grad = ctx.createLinearGradient(-size * 0.6, 0, size * 0.6, 0);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.3, '#ffffff');
      grad.addColorStop(0.6, '#cbd5e1');
      grad.addColorStop(1, '#64748b');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-size * 0.75, -size * 0.35, size * 1.5, size * 0.7, 6);
      ctx.fill();
      ctx.stroke();

      // Shiny foil wrinkles
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-size * 0.3, -size * 0.25);
      ctx.lineTo(-size * 0.1, size * 0.25);
      ctx.moveTo(size * 0.1, -size * 0.25);
      ctx.lineTo(size * 0.3, size * 0.25);
      ctx.stroke();

      // Foil end sheet
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(size * 0.4, size * 0.3);
      ctx.lineTo(size * 0.75, size * 0.65);
      ctx.lineTo(size * 0.4, size * 0.75);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'milk_carton': {
      // Top fold
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-size * 0.4, -size * 0.85, size * 0.8, size * 0.2);

      // Sloped gable
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, -size * 0.65);
      ctx.lineTo(size * 0.4, -size * 0.65);
      ctx.lineTo(size * 0.5, -size * 0.35);
      ctx.lineTo(-size * 0.5, -size * 0.35);
      ctx.closePath();
      ctx.fill();

      // Carton box
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size * 0.5, -size * 0.35, size * 1.0, size * 1.05, 3);
      ctx.fill();
      ctx.stroke();

      // Blue banner
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-size * 0.5, -size * 0.1, size * 1.0, size * 0.4);

      // "MILK" text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MILK', 0, size * 0.15);
      break;
    }

    case 'tin_can': {
      const canGrad = ctx.createLinearGradient(-size * 0.5, 0, size * 0.5, 0);
      canGrad.addColorStop(0, '#94a3b8');
      canGrad.addColorStop(0.35, '#ffffff');
      canGrad.addColorStop(0.8, '#cbd5e1');
      canGrad.addColorStop(1, '#64748b');

      ctx.fillStyle = canGrad;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size * 0.45, -size * 0.65, size * 0.9, size * 1.3, 4);
      ctx.fill();
      ctx.stroke();

      // Rib lines
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-size * 0.45, -size * 0.35);
      ctx.lineTo(size * 0.45, -size * 0.35);
      ctx.moveTo(-size * 0.45, -size * 0.2);
      ctx.lineTo(size * 0.45, -size * 0.2);
      ctx.moveTo(-size * 0.45, size * 0.2);
      ctx.lineTo(size * 0.45, size * 0.2);
      ctx.moveTo(-size * 0.45, size * 0.35);
      ctx.lineTo(size * 0.45, size * 0.35);
      ctx.stroke();

      // Red label
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-size * 0.45, -size * 0.1, size * 0.9, size * 0.2);
      break;
    }

    case 'cereal_box': {
      // 3D side
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(size * 0.45, -size * 0.65);
      ctx.lineTo(size * 0.65, -size * 0.75);
      ctx.lineTo(size * 0.65, size * 0.45);
      ctx.lineTo(size * 0.45, size * 0.55);
      ctx.closePath();
      ctx.fill();

      // Front box
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size * 0.48, -size * 0.65, size * 0.93, size * 1.25, 3);
      ctx.fill();
      ctx.stroke();

      // Bowl
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(0, size * 0.2, size * 0.32, 0, Math.PI);
      ctx.fill();

      // Flakes
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-size * 0.15, size * 0.1, size * 0.08, 0, Math.PI * 2);
      ctx.arc(size * 0.05, size * 0.08, size * 0.08, 0, Math.PI * 2);
      ctx.arc(size * 0.2, size * 0.15, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'magazine': {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-size * 0.35, -size * 0.65, size * 0.85, size * 1.3);

      ctx.fillStyle = '#ec4899';
      ctx.strokeStyle = '#9d174d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-size * 0.45, -size * 0.7, size * 0.85, size * 1.35, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.fillRect(-size * 0.38, -size * 0.58, size * 0.7, size * 0.18);

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-size * 0.38, -size * 0.3, size * 0.7, size * 0.45);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-size * 0.38, size * 0.25, size * 0.6, size * 0.08);
      ctx.fillRect(-size * 0.38, size * 0.4, size * 0.45, size * 0.08);
      break;
    }

    case 'bag': {
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -size * 0.5, size * 0.25, Math.PI, 0);
      ctx.stroke();

      ctx.fillStyle = 'rgba(52, 211, 153, 0.88)';
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size * 0.45, -size * 0.35);
      ctx.lineTo(size * 0.45, -size * 0.35);
      ctx.lineTo(size * 0.55, size * 0.6);
      ctx.lineTo(-size * 0.55, size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, size * 0.1, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(0, size * 0.1, size * 0.09, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    default:
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}
