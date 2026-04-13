import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TILE, COLS, ROWS, WW, WH, T, INTERACT_DIST, WANDER_RADIUS, NPC_SPEED, TYPEWRITER_SPEED } from './constants';
import { Player, NPC, GameObject, DialogueLine } from './types';
import { createWorldMap, createTileNoise } from './worldMap';
import { INTERIORS, DOOR_MAP } from './interiors';
import { DIALOGUE, createNPCs, OVERWORLD_OBJECTS, DESKS, STUDY_CENTER, KIOSKS, BUILDING_DEFS } from './gameData';
import { drawTile, drawObjects, drawNPC, drawPlayer, drawDesks, drawBuildingLabels, drawPathArrows, drawCompass, drawInteriorLabel, drawBuildings, drawKiosks } from './renderer';
import InfoOverlay from './overlays/InfoOverlay';
import ChatOverlay from './overlays/ChatOverlay';
import QuizOverlay from './overlays/QuizOverlay';
import DialogueBox from './overlays/DialogueBox';

const worldMap = createWorldMap();
const tileNoise = createTileNoise();

const StoryJumpGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compassRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const playerRef = useRef<Player>({
    worldX: 4.5 * TILE, worldY: 4.5 * TILE,
    speed: 3, dir: 'down', walkFrame: 0, moving: false, interior: null,
  });
  const npcsRef = useRef<NPC[]>(createNPCs());
  const interactCooldownRef = useRef(0);
  const transitionRef = useRef<{ active: boolean; entering: boolean; progress: number; targetInterior: string | null; exitWorldRow?: number; exitWorldCol?: number }>({ active: false, entering: false, progress: 0, targetInterior: null });

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState<{ open: boolean; speaker: string; text: string; fullText: string; npcId: string | null }>({ open: false, speaker: '', text: '', fullText: '', npcId: null });
  const [locationLabel, setLocationLabel] = useState('📚 HET DINER');
  const [visitedNpcs, setVisitedNpcs] = useState<Set<string>>(new Set());
  const [visitedObjects, setVisitedObjects] = useState<Set<string>>(new Set());
  const [visitedKiosks, setVisitedKiosks] = useState<Set<string>>(new Set());
  const [visitedBuildings, setVisitedBuildings] = useState<Set<string>>(new Set());
  const [trackerMenu, setTrackerMenu] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const dialogueRef = useRef(dialogue);
  dialogueRef.current = dialogue;
  const overlayOpenRef = useRef(overlayOpen);
  overlayOpenRef.current = overlayOpen;

  const typewriterRef = useRef({ idx: 0, timer: 0, full: '', callback: null as (() => void) | null });

  const closeAll = useCallback(() => {
    setOverlayOpen(false);
    setActiveOverlay(null);
    setDialogue({ open: false, speaker: '', text: '', fullText: '', npcId: null });
  }, []);

  const showDialogue = useCallback((speaker: string, text: string, emoji?: string) => {
    setDialogue({ open: true, speaker, text: '', fullText: text, npcId: emoji || null });
    setOverlayOpen(true);
    typewriterRef.current = { idx: 0, timer: 0, full: text, callback: null };
  }, []);

  const advanceDialogue = useCallback(() => {
    if (interactCooldownRef.current > 0) return;
    interactCooldownRef.current = 12;
    const tw = typewriterRef.current;
    if (tw.idx < tw.full.length) {
      tw.idx = tw.full.length;
      setDialogue(prev => ({ ...prev, text: tw.full }));
      return;
    }
    closeAll();
  }, [closeAll]);

  const isWalkable = useCallback((wx: number, wy: number): boolean => {
    const player = playerRef.current;
    if (player.interior) {
      const interior = INTERIORS[player.interior];
      const c = Math.floor(wx / TILE), r = Math.floor(wy / TILE);
      if (r < 0 || r >= interior.height || c < 0 || c >= interior.width) return false;
      const t = interior.map[r][c];
      return t !== T.WALL && t !== T.TABLE;
    }
    const c = Math.floor(wx / TILE), r = Math.floor(wy / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
    const t = worldMap[r][c];
    if (t === T.DOOR) return true;
    return t !== T.TREE && t !== T.WATER && t !== T.BUILDING;
  }, []);

  const enterInterior = useCallback((interiorId: string) => {
    const interior = INTERIORS[interiorId];
    if (!interior) return;
    setVisitedBuildings(prev => {
      if (!prev.has(interiorId)) {
        setScore(s => s + 25);
        const next = new Set(prev); next.add(interiorId); return next;
      }
      return prev;
    });
    transitionRef.current = { active: true, entering: true, progress: 0, targetInterior: interiorId };
  }, []);

  const exitInterior = useCallback(() => {
    const player = playerRef.current;
    if (!player.interior) return;
    const interior = INTERIORS[player.interior];
    transitionRef.current = {
      active: true, entering: false, progress: 0, targetInterior: null,
      exitWorldRow: interior.exitWorldRow, exitWorldCol: interior.exitWorldCol
    };
  }, []);

  const tryInteract = useCallback(() => {
    if (interactCooldownRef.current > 0) return;
    if (dialogueRef.current.open) { advanceDialogue(); return; }

    const player = playerRef.current;
    interactCooldownRef.current = 20;

    if (player.interior) {
      const interior = INTERIORS[player.interior];
      // Check door
      const pr = Math.floor(player.worldY / TILE), pc = Math.floor(player.worldX / TILE);
      if (Math.abs(pr - interior.exitRow) <= 1 && Math.abs(pc - interior.exitCol) <= 1) {
        exitInterior();
        return;
      }
      // Check interior objects
      for (const obj of interior.objects) {
        const ox = (obj.col + 0.5) * TILE, oy = (obj.row + 0.5) * TILE;
        if (Math.hypot(ox - player.worldX, oy - player.worldY) < INTERACT_DIST) {
          showDialogue(obj.label, obj.info, '📦');
          return;
        }
      }
      return;
    }

    // Check door tiles
    const pr = Math.floor(player.worldY / TILE), pc = Math.floor(player.worldX / TILE);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const key = `${pr + dr},${pc + dc}`;
        if (DOOR_MAP[key]) {
          enterInterior(DOOR_MAP[key]);
          return;
        }
      }
    }

    // NPCs
    for (const npc of npcsRef.current) {
      const nx = (npc.col + 0.5) * TILE + npc.subX;
      const ny = (npc.row + 0.5) * TILE + npc.subY;
      if (Math.hypot(nx - player.worldX, ny - player.worldY) < INTERACT_DIST) {
        setVisitedNpcs(prev => {
          if (!prev.has(npc.id)) {
            setScore(s => s + 20);
            const next = new Set(prev); next.add(npc.id); return next;
          }
          return prev;
        });
        const lines = DIALOGUE[npc.id];
        const line = lines[npc.dialogueIndex];
        npc.dialogueIndex = (npc.dialogueIndex + 1) % lines.length;
        showDialogue(line.speaker, line.text, npc.emoji);
        return;
      }
    }

    // Objects
    for (const obj of OVERWORLD_OBJECTS) {
      const ox = (obj.col + 0.5) * TILE, oy = (obj.row + 0.5) * TILE;
      if (Math.hypot(ox - player.worldX, oy - player.worldY) < INTERACT_DIST) {
        setVisitedObjects(prev => {
          if (!prev.has(obj.id)) {
            setScore(s => s + 15);
            const next = new Set(prev); next.add(obj.id); return next;
          }
          return prev;
        });
        showDialogue(obj.label, obj.info, '📦');
        return;
      }
    }

    // Kiosks
    for (const kiosk of KIOSKS) {
      const kx = (kiosk.col + 0.5) * TILE, ky = (kiosk.row + 0.5) * TILE;
      if (Math.hypot(kx - player.worldX, ky - player.worldY) < INTERACT_DIST) {
        setVisitedKiosks(prev => {
          if (!prev.has(kiosk.id)) {
            setScore(s => s + 10);
            const next = new Set(prev); next.add(kiosk.id); return next;
          }
          return prev;
        });
        showDialogue(kiosk.title, kiosk.text, '📋');
        return;
      }
    }

    // Desks
    for (const desk of DESKS) {
      const dx = (desk.col + 0.5) * TILE, dy = (desk.row + 0.5) * TILE;
      if (Math.hypot(dx - player.worldX, dy - player.worldY) < INTERACT_DIST) {
        if (desk.id === 'desk_info') { setActiveOverlay('info'); setOverlayOpen(true); }
        if (desk.id === 'desk_chat') { setActiveOverlay('chat'); setOverlayOpen(true); }
        if (desk.id === 'desk_quiz') { setActiveOverlay('quiz'); setOverlayOpen(true); }
        return;
      }
    }
  }, [advanceDialogue, showDialogue, enterInterior, exitInterior]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Escape') closeAll();
      if ((e.code === 'KeyE' || e.code === 'Enter') && !overlayOpenRef.current) tryInteract();
      if ((e.code === 'KeyE' || e.code === 'Enter') && dialogueRef.current.open) advanceDialogue();
    };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [closeAll, tryInteract, advanceDialogue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const compassCanvas = compassRef.current;
    if (!canvas || !compassCanvas) return;
    const ctx = canvas.getContext('2d')!;
    const compassCtx = compassCanvas.getContext('2d')!;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let animId: number;
    let lastTime = performance.now();
    const TARGET_DT = 1000 / 60;

    function gameLoop(now: number) {
      const rawDt = now - lastTime;
      lastTime = now;
      const dt = Math.min(rawDt, 100) / TARGET_DT; // normalize: 1.0 at 60fps

      const player = playerRef.current;
      const keys = keysRef.current;
      const trans = transitionRef.current;

      // Transition handling
      if (trans.active) {
        trans.progress += 0.04 * dt;
        if (trans.progress >= 1) {
          trans.active = false;
          if (trans.entering && trans.targetInterior) {
            const interior = INTERIORS[trans.targetInterior];
            player.interior = trans.targetInterior;
            player.worldX = (interior.spawnCol + 0.5) * TILE;
            player.worldY = (interior.spawnRow + 0.5) * TILE;
            setLocationLabel(interior.name);
          } else {
            player.interior = null;
            player.worldX = (trans.exitWorldCol! + 0.5) * TILE;
            player.worldY = (trans.exitWorldRow! + 0.5) * TILE;
            setLocationLabel('📚 HET DINER');
          }
          trans.progress = 0;
        }
      }

      // Movement
      if (!overlayOpenRef.current && !dialogueRef.current.open && !trans.active) {
        const spd = player.speed * dt;
        let dx = 0, dy = 0;
        if (keys['ArrowLeft'] || keys['KeyA']) { dx = -spd; player.dir = 'left'; }
        if (keys['ArrowRight'] || keys['KeyD']) { dx = spd; player.dir = 'right'; }
        if (keys['ArrowUp'] || keys['KeyW']) { dy = -spd; player.dir = 'up'; }
        if (keys['ArrowDown'] || keys['KeyS']) { dy = spd; player.dir = 'down'; }
        player.moving = dx !== 0 || dy !== 0;
        if (player.moving) player.walkFrame += 0.15;

        const pw = TILE * 0.35;
        const maxX = player.interior ? INTERIORS[player.interior].width * TILE - TILE : WW - TILE * 2;
        const maxY = player.interior ? INTERIORS[player.interior].height * TILE - TILE : WH - TILE * 2;
        const minX = player.interior ? TILE : TILE * 2;
        const minY = player.interior ? TILE : TILE * 2;

        if (isWalkable(player.worldX + dx - pw, player.worldY) &&
          isWalkable(player.worldX + dx + pw, player.worldY) &&
          isWalkable(player.worldX + dx - pw, player.worldY + pw) &&
          isWalkable(player.worldX + dx + pw, player.worldY + pw))
          player.worldX = Math.max(minX, Math.min(maxX, player.worldX + dx));

        if (isWalkable(player.worldX - pw, player.worldY + dy) &&
          isWalkable(player.worldX + pw, player.worldY + dy) &&
          isWalkable(player.worldX - pw, player.worldY + dy + pw) &&
          isWalkable(player.worldX + pw, player.worldY + dy + pw))
          player.worldY = Math.max(minY, Math.min(maxY, player.worldY + dy));

        // Auto-enter door when walking on it in overworld
        if (!player.interior) {
          const pr = Math.floor(player.worldY / TILE), pc = Math.floor(player.worldX / TILE);
          const key = `${pr},${pc}`;
          if (DOOR_MAP[key] && !trans.active) {
            enterInterior(DOOR_MAP[key]);
          }
        }

        // Auto-exit when on door in interior
        if (player.interior) {
          const interior = INTERIORS[player.interior];
          const pr = Math.floor(player.worldY / TILE), pc = Math.floor(player.worldX / TILE);
          if (pr === interior.exitRow && pc === interior.exitCol && !trans.active) {
            exitInterior();
          }
        }
      }

      // NPC wander (only in overworld)
      if (!dialogueRef.current.open && !player.interior) {
        npcsRef.current.forEach(npc => {
          npc.wanderTimer -= dt;
          if (npc.wanderTimer <= 0) {
            const r = Math.random();
            if (r < 0.3) { npc.wanderDx = 0; npc.wanderDy = 0; npc.wanderTimer = 80 + Math.random() * 80; }
            else {
              const angle = Math.random() * Math.PI * 2;
              npc.wanderDx = Math.cos(angle) * NPC_SPEED;
              npc.wanderDy = Math.sin(angle) * NPC_SPEED;
              npc.wanderTimer = 40 + Math.random() * 60;
            }
          }
          if (npc.wanderDx !== 0 || npc.wanderDy !== 0) {
            const nx = npc.subX + npc.wanderDx * dt;
            const ny = npc.subY + npc.wanderDy * dt;
            const newWorldX = (npc.col + 0.5) * TILE + nx;
            const newWorldY = (npc.row + 0.5) * TILE + ny;
            const dSpawnX = (npc.col + nx / TILE) - npc.spawnCol;
            const dSpawnY = (npc.row + ny / TILE) - npc.spawnRow;
            const dist = Math.sqrt(dSpawnX * dSpawnX + dSpawnY * dSpawnY);
            const tileAtPos = (() => {
              const c = Math.floor(newWorldX / TILE), r = Math.floor(newWorldY / TILE);
              if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return T.TREE;
              return worldMap[r][c];
            })();
            if (dist < WANDER_RADIUS && tileAtPos !== T.TREE && tileAtPos !== T.WATER && tileAtPos !== T.BUILDING) {
              npc.subX = nx; npc.subY = ny;
              if (Math.abs(npc.subX) >= TILE) { npc.col += Math.sign(npc.subX); npc.subX = 0; }
              if (Math.abs(npc.subY) >= TILE) { npc.row += Math.sign(npc.subY); npc.subY = 0; }
            } else {
              npc.wanderDx = 0; npc.wanderDy = 0; npc.wanderTimer = 0;
            }
          }
        });
      }

      // Typewriter
      if (dialogueRef.current.open) {
        const tw = typewriterRef.current;
        if (tw.idx < tw.full.length) {
          tw.timer += dt;
          if (tw.timer >= TYPEWRITER_SPEED) {
            tw.timer = 0;
            tw.idx++;
            const newText = tw.full.slice(0, tw.idx);
            setDialogue(prev => ({ ...prev, text: newText }));
          }
        }
      }

      if (interactCooldownRef.current > 0) interactCooldownRef.current--;

      // RENDER
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      if (player.interior) {
        // Interior rendering
        const interior = INTERIORS[player.interior];
        const totalW = interior.width * TILE;
        const totalH = interior.height * TILE;
        const camX = Math.max(0, Math.min(totalW - canvas!.width, player.worldX - canvas!.width / 2));
        const camY = Math.max(0, Math.min(totalH - canvas!.height, player.worldY - canvas!.height / 2));

        // Dark background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas!.width, canvas!.height);

        // Draw interior tiles
        for (let r = 0; r < interior.height; r++) {
          for (let c = 0; c < interior.width; c++) {
            const sx = c * TILE - camX, sy = r * TILE - camY;
            if (sx > canvas!.width || sy > canvas!.height || sx + TILE < 0 || sy + TILE < 0) continue;
            const noise = (Math.sin(r * 127.1 + c * 311.7) * 43758.5453) % 1;
            drawTile(ctx, r, c, sx, sy, interior.map[r][c], Math.abs(noise));
          }
        }

        // Ambient overlay
        ctx.fillStyle = interior.ambientColor;
        ctx.fillRect(0, 0, canvas!.width, canvas!.height);

        // Interior objects
        drawObjects(ctx, interior.objects, player, camX, camY);

        // Player
        drawPlayer(ctx, player, camX, camY);

        // Interior label
        drawInteriorLabel(ctx, interior);
      } else {
        // Overworld rendering
        const cx = player.worldX - canvas!.width / 2;
        const cy = player.worldY - canvas!.height / 2;
        const camX = Math.max(0, Math.min(WW - canvas!.width, cx));
        const camY = Math.max(0, Math.min(WH - canvas!.height, cy));

        const startCol = Math.max(0, Math.floor(camX / TILE) - 1);
        const endCol = Math.min(COLS, startCol + Math.ceil(canvas!.width / TILE) + 3);
        const startRow = Math.max(0, Math.floor(camY / TILE) - 1);
        const endRow = Math.min(ROWS, startRow + Math.ceil(canvas!.height / TILE) + 3);

        for (let r = startRow; r < endRow; r++) {
          for (let c = startCol; c < endCol; c++) {
            drawTile(ctx, r, c, c * TILE - camX, r * TILE - camY, worldMap[r][c], tileNoise[r][c]);
          }
        }

        drawPathArrows(ctx, camX, camY);
        drawBuildings(ctx, camX, camY);
        drawBuildingLabels(ctx, camX, camY);
        drawObjects(ctx, OVERWORLD_OBJECTS, player, camX, camY);
        drawKiosks(ctx, KIOSKS, player, camX, camY);
        npcsRef.current.forEach(npc => drawNPC(ctx, npc, player, camX, camY));
        drawDesks(ctx, DESKS, player, camX, camY);
        drawPlayer(ctx, player, camX, camY);
        drawCompass(compassCtx, player, STUDY_CENTER.worldX, STUDY_CENTER.worldY);
      }

      // Transition overlay
      if (trans.active) {
        const alpha = trans.entering ? trans.progress : (1 - trans.progress);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      }

      animId = requestAnimationFrame(gameLoop);
    }

    animId = requestAnimationFrame(gameLoop);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [isWalkable, enterInterior, exitInterior]);

  const totalScore = visitedNpcs.size * 20 + visitedObjects.size * 15 + visitedKiosks.size * 10 + visitedBuildings.size * 25;
  const maxScore = npcsRef.current.length * 20 + OVERWORLD_OBJECTS.length * 15 + KIOSKS.length * 10 + BUILDING_DEFS.length * 25;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', position: 'relative', fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Isometric wrapper */}
      <div style={{
        width: '100%', height: '100%',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}>
        <canvas ref={canvasRef} style={{
          display: 'block', imageRendering: 'pixelated',
          transform: 'rotateX(25deg) scale(1.15)',
          transformOrigin: '50% 55%',
        }} />
      </div>

      {/* HUD — outside isometric transform */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 40 }}>
        {/* Location label */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(0,0,0,0.7)', color: '#39ff14',
          fontFamily: "'VT323', monospace", fontSize: 16,
          padding: '4px 10px', borderRadius: 4, letterSpacing: 1,
          border: '1px solid #1e3e1e'
        }}>
          {locationLabel}
        </div>

        {/* Score display */}
        <div style={{
          position: 'absolute', top: 14, left: 200,
          background: 'rgba(0,0,0,0.75)', color: '#ffd700',
          fontFamily: "'VT323', monospace", fontSize: 18,
          padding: '4px 12px', borderRadius: 6, letterSpacing: 1,
          border: '1px solid #3a3000', pointerEvents: 'auto', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }} onClick={() => setShowLeaderboard(prev => !prev)}>
          <span>⭐</span>
          <span>{score}</span>
          <span style={{ fontSize: 11, color: '#999' }}>/ {maxScore}</span>
        </div>

        {/* Progress tracker */}
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 2, background: 'rgba(0,0,0,0.75)',
          padding: '4px 6px', borderRadius: 8, border: '1px solid #333',
          fontFamily: "'VT323', monospace", fontSize: 15, letterSpacing: 1,
          pointerEvents: 'auto',
        }}>
          {([
            { key: 'npcs', icon: '👤', label: 'Karakters', pts: 20, visited: visitedNpcs, total: npcsRef.current, items: npcsRef.current.map(n => ({ id: n.id, name: n.name, visited: visitedNpcs.has(n.id) })) },
            { key: 'objects', icon: '📦', label: 'Objecten', pts: 15, visited: visitedObjects, total: OVERWORLD_OBJECTS, items: OVERWORLD_OBJECTS.map(o => ({ id: o.id, name: o.label, visited: visitedObjects.has(o.id), info: o.info })) },
            { key: 'kiosks', icon: '📋', label: 'Kiosken', pts: 10, visited: visitedKiosks, total: KIOSKS, items: KIOSKS.map(k => ({ id: k.id, name: k.title, visited: visitedKiosks.has(k.id), info: k.text })) },
            { key: 'buildings', icon: '🏠', label: 'Gebouwen', pts: 25, visited: visitedBuildings, total: BUILDING_DEFS, items: BUILDING_DEFS.map(b => ({ id: b.id, name: b.id.charAt(0).toUpperCase() + b.id.slice(1), visited: visitedBuildings.has(b.id) })) },
          ] as const).map(cat => (
            <div key={cat.key} style={{ position: 'relative' }}>
              <button
                onClick={() => setTrackerMenu(prev => prev === cat.key ? null : cat.key)}
                style={{
                  background: trackerMenu === cat.key ? 'rgba(57,255,20,0.15)' : 'transparent',
                  border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 6,
                  display: 'flex', alignItems: 'center', gap: 5, color: 'inherit',
                  fontFamily: "'VT323', monospace", fontSize: 15,
                }}
              >
                <span>{cat.icon}</span>
                <span style={{ color: cat.visited.size === cat.total.length ? '#39ff14' : '#aaa' }}>
                  {cat.visited.size}/{cat.total.length}
                </span>
              </button>
              {trackerMenu === cat.key && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginTop: 8, background: 'rgba(10,10,10,0.95)', border: '1px solid #333',
                  borderRadius: 8, padding: '8px 0', minWidth: 220, maxHeight: 320, overflowY: 'auto',
                  fontFamily: "'VT323', monospace", fontSize: 14, zIndex: 100,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                }}>
                  <div style={{ padding: '4px 14px 8px', color: '#39ff14', fontSize: 16, borderBottom: '1px solid #222' }}>
                    {cat.icon} {cat.label} <span style={{ color: '#666', fontSize: 12 }}>({cat.pts} pts elk)</span>
                  </div>
                  {cat.items.map((item: any) => (
                    <div key={item.id} style={{
                      padding: '6px 14px', display: 'flex', alignItems: 'flex-start', gap: 8,
                      borderBottom: '1px solid #1a1a1a',
                    }}>
                      <span style={{ color: item.visited ? '#39ff14' : '#333', flexShrink: 0 }}>
                        {item.visited ? '✓' : '?'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: item.visited ? '#ccc' : '#333' }}>
                          {item.visited ? item.name : '???'}
                        </div>
                        {item.visited && item.info && (
                          <div style={{ color: '#666', fontSize: 12, marginTop: 2, lineHeight: 1.3 }}>
                            {item.info.length > 80 ? item.info.slice(0, 80) + '…' : item.info}
                          </div>
                        )}
                      </div>
                      {item.visited && <span style={{ color: '#ffd700', fontSize: 11 }}>+{cat.pts}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <button
            onClick={() => {
              const p = playerRef.current;
              p.worldX = 4.5 * TILE;
              p.worldY = 4.5 * TILE;
              p.interior = null;
              p.dir = 'down';
              p.moving = false;
              transitionRef.current = { active: false, entering: false, progress: 0, targetInterior: null };
              setOverlayOpen(false);
              setDialogue(null);
              
              npcsRef.current = createNPCs();
            }}
            title="Respawn"
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)',
            }}
          >↺</button>
          <canvas ref={compassRef} width={68} height={68} style={{
            width: 68, height: 68, pointerEvents: 'none',
            display: playerRef.current.interior ? 'none' : 'block'
          }} />
        </div>
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)', color: '#aaa',
          padding: '5px 14px', borderRadius: 16, fontSize: 12, whiteSpace: 'nowrap'
        }}>
          WASD / pijltjes = lopen &nbsp;|&nbsp; E = interacteren &nbsp;|&nbsp; Esc = sluiten
        </div>
      </div>

      {/* Leaderboard overlay */}
      {showLeaderboard && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, pointerEvents: 'auto',
        }} onClick={() => setShowLeaderboard(false)}>
          <div style={{
            background: 'rgba(10,10,10,0.95)', border: '2px solid #ffd700', borderRadius: 16,
            padding: '24px 32px', minWidth: 320, maxWidth: 400,
            fontFamily: "'VT323', monospace",
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#ffd700', fontSize: 24, margin: '0 0 16px', textAlign: 'center' }}>🏆 Scorebord</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '👤 Karakters', pts: visitedNpcs.size * 20, max: npcsRef.current.length * 20 },
                { label: '📦 Objecten', pts: visitedObjects.size * 15, max: OVERWORLD_OBJECTS.length * 15 },
                { label: '📋 Kiosken', pts: visitedKiosks.size * 10, max: KIOSKS.length * 10 },
                { label: '🏠 Gebouwen', pts: visitedBuildings.size * 25, max: BUILDING_DEFS.length * 25 },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: 16, marginBottom: 4 }}>
                    <span>{row.label}</span>
                    <span style={{ color: row.pts === row.max ? '#39ff14' : '#ffd700' }}>{row.pts} / {row.max}</span>
                  </div>
                  <div style={{ background: '#222', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{
                      width: `${(row.pts / row.max) * 100}%`, height: '100%',
                      background: row.pts === row.max ? '#39ff14' : 'linear-gradient(90deg, #ffd700, #ff8c00)',
                      borderRadius: 4, transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #333', marginTop: 16, paddingTop: 12, textAlign: 'center' }}>
              <span style={{ color: '#ffd700', fontSize: 28 }}>⭐ {score}</span>
              <span style={{ color: '#666', fontSize: 16, marginLeft: 8 }}>/ {maxScore} punten</span>
            </div>
            {score >= maxScore && (
              <div style={{ textAlign: 'center', marginTop: 12, color: '#39ff14', fontSize: 18 }}>
                🎉 Alles ontdekt! Gefeliciteerd!
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button onClick={() => setShowLeaderboard(false)} style={{
                background: '#ffd700', color: '#000', border: 'none', padding: '6px 20px',
                borderRadius: 6, cursor: 'pointer', fontFamily: "'VT323', monospace", fontSize: 16,
              }}>Sluiten</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialogue Box */}
      {dialogue.open && (
        <DialogueBox
          speaker={dialogue.speaker}
          text={dialogue.text}
          isComplete={typewriterRef.current.idx >= typewriterRef.current.full.length}
          onAdvance={advanceDialogue}
          emoji={dialogue.npcId}
        />
      )}

      {/* Overlays */}
      {activeOverlay === 'info' && <InfoOverlay onClose={closeAll} />}
      {activeOverlay === 'chat' && <ChatOverlay onClose={closeAll} />}
      {activeOverlay === 'quiz' && <QuizOverlay onClose={closeAll} />}
    </div>
  );
};

export default StoryJumpGame;
