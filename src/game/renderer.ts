import { T, TILE, TILE_COLORS, INTERACT_DIST } from './constants';
import { Player, NPC, GameObject, Desk, Interior, BuildingDef, Kiosk } from './types';
import { BUILDING_LABELS, PATH_ARROWS, BUILDING_DEFS } from './gameData';

const DIR_ANGLES: Record<string, number> = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };

export function drawTile(ctx: CanvasRenderingContext2D, r: number, c: number, sx: number, sy: number, tileType: number, noise: number) {
  ctx.fillStyle = TILE_COLORS[tileType] || '#333';
  ctx.fillRect(sx, sy, TILE, TILE);

  if (tileType === T.GRASS) {
    // Layered ground variation for depth
    const n2 = ((Math.sin(r * 73.1 + c * 197.3) * 43758.5453) % 1);
    const absN2 = Math.abs(n2);
    // Subtle dappled light/shadow patches
    if (absN2 < 0.25) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(sx, sy, TILE, TILE);
    } else if (absN2 < 0.45) {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(sx, sy, TILE, TILE);
    }
    // Grass blades with varying height and color
    if (noise > 0.35) {
      const bladeCount = noise > 0.75 ? 5 : 3;
      for (let i = 0; i < bladeCount; i++) {
        const bx = sx + ((noise * 137 + i * 11) % TILE);
        const bh = 4 + (noise * 9 + i * 3) % 8;
        const colors = ['#4a9d54', '#5ab864', '#3d8a48', '#6cc476'];
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 0.7 + (i % 2) * 0.3;
        ctx.beginPath();
        ctx.moveTo(bx, sy + TILE);
        const sway = (i % 2 === 0 ? 3 : -2);
        ctx.quadraticCurveTo(bx + sway, sy + TILE - bh / 2, bx + sway * 0.7, sy + TILE - bh);
        ctx.stroke();
      }
    }
    // Small clover/dot patches
    if (absN2 > 0.85) {
      ctx.fillStyle = '#2d6e35';
      ctx.beginPath(); ctx.arc(sx + 10, sy + 8, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(sx + 22, sy + 22, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    // Tiny wildflower accent
    if (absN2 > 0.92) {
      ctx.fillStyle = '#e8e060';
      ctx.beginPath(); ctx.arc(sx + 16, sy + 14, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  if (tileType === T.FLOWER) {
    ctx.fillStyle = '#3a7d44'; ctx.fillRect(sx, sy, TILE, TILE);
    // Grass blades underneath
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = i % 2 === 0 ? '#4a9d54' : '#5ab864'; ctx.lineWidth = 0.6;
      const bx = sx + 5 + i * 10;
      ctx.beginPath(); ctx.moveTo(bx, sy + TILE); ctx.lineTo(bx + 1, sy + TILE - 5 - i); ctx.stroke();
    }
    // Stem
    const fx = sx + TILE / 2, fy = sy + TILE / 2;
    ctx.strokeStyle = '#2d6e35'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(fx, sy + TILE); ctx.quadraticCurveTo(fx - 2, fy + 6, fx, fy + 2); ctx.stroke();
    // Leaf with highlight
    ctx.fillStyle = '#3d8a48';
    ctx.beginPath(); ctx.ellipse(fx - 4, fy + 6, 3.5, 1.8, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.ellipse(fx - 4, fy + 5.5, 2, 0.8, -0.5, 0, Math.PI * 2); ctx.fill();
    // Petals with gradient-like shading
    const cols = ['#ff6b9d', '#ffd93d', '#a8e6cf', '#ff8c42', '#c792ea', '#f97583'];
    const petalColor = cols[Math.floor(noise * cols.length)];
    const petalCount = 5;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const px = fx + Math.cos(angle) * 4.5;
      const py = fy + Math.sin(angle) * 4.5;
      ctx.fillStyle = petalColor;
      ctx.beginPath(); ctx.ellipse(px, py, 3.2, 2.2, angle, 0, Math.PI * 2); ctx.fill();
      // Petal highlight
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.ellipse(px - 0.5, py - 0.5, 1.5, 1, angle, 0, Math.PI * 2); ctx.fill();
    }
    // Center with 3D dome
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath(); ctx.arc(fx, fy, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffeE44';
    ctx.beginPath(); ctx.arc(fx - 0.5, fy - 0.5, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e6a800';
    ctx.beginPath(); ctx.arc(fx + 0.5, fy + 0.5, 1.2, 0, Math.PI * 2); ctx.fill();
  }

  if (tileType === T.TREE) {
    // Ground beneath
    ctx.fillStyle = '#1e4d2b'; ctx.fillRect(sx, sy, TILE, TILE);

    // Ground shadow cast by tree
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(sx + TILE / 2 + 4, sy + TILE - 2, 14, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Root details
    ctx.fillStyle = '#3a2a1a';
    ctx.beginPath(); ctx.moveTo(sx + 10, sy + TILE); ctx.lineTo(sx + 13, sy + 24); ctx.lineTo(sx + 8, sy + TILE); ctx.fill();
    ctx.beginPath(); ctx.moveTo(sx + 22, sy + TILE); ctx.lineTo(sx + 19, sy + 24); ctx.lineTo(sx + 24, sy + TILE); ctx.fill();

    // Trunk with 3D roundness
    const tx = sx + 12, tw = 8;
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(tx, sy + 14, tw, 18);
    // Trunk highlight (left)
    ctx.fillStyle = '#7a5a2a';
    ctx.fillRect(tx, sy + 14, 3, 18);
    // Trunk dark edge (right)
    ctx.fillStyle = '#3a2010';
    ctx.fillRect(tx + tw - 2, sy + 14, 2, 18);
    // Bark lines
    ctx.strokeStyle = '#4a2a10'; ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const ty = sy + 16 + i * 4;
      ctx.beginPath(); ctx.moveTo(tx + 1, ty); ctx.lineTo(tx + tw - 1, ty + 1); ctx.stroke();
    }

    // Multi-layer foliage — back (dark, shadow)
    ctx.fillStyle = '#1a5028';
    ctx.beginPath(); ctx.arc(sx + TILE / 2 + 2, sy + TILE / 2 + 4, 15, 0, Math.PI * 2); ctx.fill();
    // Mid foliage
    ctx.fillStyle = '#236e34';
    ctx.beginPath(); ctx.arc(sx + TILE / 2, sy + TILE / 2, 14, 0, Math.PI * 2); ctx.fill();
    // Upper clusters
    ctx.fillStyle = '#2d8040';
    ctx.beginPath(); ctx.arc(sx + TILE / 2 - 5, sy + TILE / 2 - 4, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#35904a';
    ctx.beginPath(); ctx.arc(sx + TILE / 2 + 5, sy + TILE / 2 - 2, 8, 0, Math.PI * 2); ctx.fill();
    // Top highlight cluster
    ctx.fillStyle = '#4aaa5a';
    ctx.beginPath(); ctx.arc(sx + TILE / 2 - 2, sy + TILE / 2 - 7, 7, 0, Math.PI * 2); ctx.fill();
    // Specular highlight
    ctx.fillStyle = '#60c070';
    ctx.beginPath(); ctx.arc(sx + TILE / 2 - 4, sy + TILE / 2 - 9, 4, 0, Math.PI * 2); ctx.fill();
    // Light dapples
    if (noise > 0.5) {
      ctx.fillStyle = 'rgba(180,255,180,0.15)';
      ctx.beginPath(); ctx.arc(sx + TILE / 2 - 3, sy + TILE / 2 - 6, 5, 0, Math.PI * 2); ctx.fill();
    }
    // Bottom shadow on foliage
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(sx + TILE / 2 + 1, sy + TILE / 2 + 6, 10, 0, Math.PI); ctx.fill();
  }

  if (tileType === T.WATER) {
    const t2 = Date.now() * 0.001;
    const wave = Math.sin(t2 + (r + c) * 0.8) * 0.04;
    // Depth gradient — darker toward center
    const depthFactor = 0.08 + wave;
    ctx.fillStyle = `rgba(40,100,200,${depthFactor + 0.05})`;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = `rgba(80,160,240,${0.1 + wave})`;
    ctx.fillRect(sx, sy, TILE, TILE / 2);
    // Multiple wave lines with varying thickness
    for (let i = 0; i < 3; i++) {
      const wy = sy + 5 + i * 10 + Math.sin(t2 * 1.5 + c * 0.5 + i) * 2;
      ctx.strokeStyle = `rgba(255,255,255,${0.06 + wave + i * 0.02})`;
      ctx.lineWidth = 0.6 + i * 0.2;
      ctx.beginPath();
      ctx.moveTo(sx, wy);
      ctx.bezierCurveTo(sx + TILE * 0.25, wy - 2 - i, sx + TILE * 0.5, wy + 2, sx + TILE, wy - 1);
      ctx.stroke();
    }
    // Caustic light patterns
    if (noise > 0.6) {
      const caustAlpha = 0.06 + 0.04 * Math.sin(t2 * 2 + r * 3 + c * 5);
      ctx.fillStyle = `rgba(180,220,255,${caustAlpha})`;
      ctx.beginPath(); ctx.ellipse(sx + noise * 20 + 4, sy + 14, 6, 3, noise * 2, 0, Math.PI * 2); ctx.fill();
    }
    // Sparkle
    if (noise > 0.85) {
      const sparkle = 0.3 + 0.4 * Math.sin(t2 * 3 + r * c);
      ctx.fillStyle = `rgba(255,255,255,${sparkle})`;
      ctx.beginPath(); ctx.arc(sx + noise * 24, sy + 10, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  if (tileType === T.PATH) {
    // Subtle color variation for worn stone look
    if (noise > 0.4) {
      ctx.fillStyle = noise > 0.7 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
      ctx.fillRect(sx, sy, TILE, TILE);
    }
    // Edge darkening (faux 3D)
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(sx, sy, TILE, 2);
    ctx.fillRect(sx, sy, 2, TILE);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(sx, sy + TILE - 2, TILE, 2);
    ctx.fillRect(sx + TILE - 2, sy, 2, TILE);
    // Pebbles & stones with 3D highlights
    if (noise > 0.6) {
      // Stone 1
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.ellipse(sx + 8, sy + 12, 3, 2, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath(); ctx.ellipse(sx + 7.5, sy + 11.5, 1.5, 1, 0.3, 0, Math.PI * 2); ctx.fill();
      // Stone 2
      ctx.fillStyle = 'rgba(0,0,0,0.09)';
      ctx.beginPath(); ctx.ellipse(sx + 22, sy + 20, 2.5, 1.8, -0.2, 0, Math.PI * 2); ctx.fill();
    }
    if (noise > 0.85) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath(); ctx.ellipse(sx + 15, sy + 6, 1.8, 1.2, 0.5, 0, Math.PI * 2); ctx.fill();
    }
    // Cracks
    if (noise > 0.9) {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(sx + 10, sy + 16); ctx.lineTo(sx + 18, sy + 20); ctx.lineTo(sx + 16, sy + 26); ctx.stroke();
    }
  }

  if (tileType === T.BUILDING) {
    // Brick wall with 3D shading
    ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 0.5;
    const brickH = 8;
    for (let row = 0; row < TILE / brickH; row++) {
      const by = sy + row * brickH;
      ctx.beginPath(); ctx.moveTo(sx, by); ctx.lineTo(sx + TILE, by); ctx.stroke();
      const offset = row % 2 === 0 ? 0 : TILE / 2;
      ctx.beginPath(); ctx.moveTo(sx + offset, by); ctx.lineTo(sx + offset, by + brickH); ctx.stroke();
      if (offset === 0) {
        ctx.beginPath(); ctx.moveTo(sx + TILE / 2, by); ctx.lineTo(sx + TILE / 2, by + brickH); ctx.stroke();
      }
      // Brick highlight top edge
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(sx, by, TILE, 1);
    }
  }

  if (tileType === T.STUDY) {
    ctx.fillStyle = 'rgba(57,255,20,0.04)'; ctx.fillRect(sx, sy, TILE, TILE);
    if ((r + c) % 2 === 0) { ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(sx, sy, TILE, TILE); }
  }
  if (tileType === T.SAND) {
    if (noise > 0.4) { ctx.fillStyle = 'rgba(0,0,0,0.04)'; ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2); }
    // Sand dots with subtle depth
    if (noise > 0.6) {
      ctx.fillStyle = 'rgba(160,120,60,0.15)';
      ctx.beginPath(); ctx.arc(sx + 9, sy + 14, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(sx + 23, sy + 8, 1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,240,200,0.08)';
      ctx.beginPath(); ctx.arc(sx + 9, sy + 13.5, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    // Sand ripples
    if (noise > 0.8) {
      ctx.strokeStyle = 'rgba(180,150,80,0.08)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(sx + 4, sy + 20); ctx.quadraticCurveTo(sx + 16, sy + 18, sx + 28, sy + 21); ctx.stroke();
    }
  }
  if (tileType === T.DOOR) {
    // 3D door frame
    ctx.fillStyle = '#6a3a10'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#5a3210'; ctx.fillRect(sx + 2, sy, TILE - 4, TILE);
    // Door panels
    ctx.fillStyle = '#a0522d'; ctx.fillRect(sx + 4, sy + 2, TILE - 8, TILE / 2 - 2);
    ctx.fillStyle = '#8B4513'; ctx.fillRect(sx + 4, sy + TILE / 2 + 1, TILE - 8, TILE / 2 - 3);
    // Panel highlight
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(sx + 5, sy + 3, (TILE - 10) / 2, TILE / 2 - 4);
    // Doorknob with shine
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(sx + TILE - 8, sy + TILE / 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe870'; ctx.beginPath(); ctx.arc(sx + TILE - 8.5, sy + TILE / 2 - 0.5, 1, 0, Math.PI * 2); ctx.fill();
    // Pulse glow
    const pulse = 0.3 + 0.3 * Math.sin(Date.now() * 0.003);
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.fillRect(sx, sy, TILE, TILE);
  }
  if (tileType === T.FLOOR) {
    if ((r + c) % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(sx, sy, TILE, TILE);
    }
    // Subtle tile edge
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(sx, sy, TILE, 1); ctx.fillRect(sx, sy, 1, TILE);
  }
  if (tileType === T.WALL) {
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
    // Wall highlight top
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(sx + 1, sy + 1, TILE - 2, 2);
  }
  if (tileType === T.TABLE) {
    ctx.fillStyle = '#5c4a3a'; ctx.fillRect(sx, sy, TILE, TILE);
    // Table top with 3D bevel
    ctx.fillStyle = '#8a7a6a'; ctx.fillRect(sx + 3, sy + 3, TILE - 6, TILE - 6);
    ctx.fillStyle = '#7a6a5a'; ctx.fillRect(sx + 4, sy + 4, TILE - 8, TILE - 8);
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(sx + 4, sy + 4, TILE - 8, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(sx + 4, sy + TILE - 6, TILE - 8, 2);
    ctx.strokeStyle = '#4a3a2a'; ctx.lineWidth = 1;
    ctx.strokeRect(sx + 3, sy + 3, TILE - 6, TILE - 6);
  }
  if (tileType === T.CHAIR) {
    ctx.fillStyle = '#5c4a3a'; ctx.fillRect(sx, sy, TILE, TILE);
    // Chair seat with cushion highlight
    ctx.fillStyle = '#8b7355'; ctx.fillRect(sx + 7, sy + 7, TILE - 14, TILE - 14);
    ctx.fillStyle = '#9b8365'; ctx.fillRect(sx + 8, sy + 8, TILE - 16, TILE - 16);
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(sx + 8, sy + 8, TILE - 16, 3);
  }
}

// ═══════════════════════════════════════════
//  BUILDING RENDERER — draws buildings as actual structures over the tile map
// ═══════════════════════════════════════════
export function drawBuildings(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  BUILDING_DEFS.forEach(b => {
    const bx = b.leftCol * TILE - camX;
    const by = b.topRow * TILE - camY;
    const bw = b.cols * TILE;
    const bh = b.rows * TILE;

    if (bx + bw < -20 || bx > ctx.canvas.width + 20 || by + bh < -20 || by > ctx.canvas.height + 20) return;

    if (b.type === 'restaurant') drawRestaurant(ctx, bx, by, bw, bh, b);
    else if (b.type === 'house') drawHouse(ctx, bx, by, bw, bh, b);
    else if (b.type === 'cafe') drawCafe(ctx, bx, by, bw, bh, b);
  });
}

function drawBuilding3D(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  depth: number,
  wallColor: string, wallDarkColor: string, roofColor: string, roofDarkColor: string,
  drawDetails: (ctx: CanvasRenderingContext2D, fx: number, fy: number, fw: number, fh: number) => void,
) {
  // The building is drawn as a 3D box with:
  // - Front face (main wall) at (x, y, w, h)
  // - Right side face offset by depth
  // - Top face connecting front top edge to back top edge
  const dx = depth * 0.7;  // horizontal offset for 3D
  const dy = -depth;       // vertical offset for 3D (goes up-right)

  // ── Ground shadow ──
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.moveTo(x + 4, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w + dx + 6, y + h + 4);
  ctx.lineTo(x + 4, y + h + 4);
  ctx.closePath();
  ctx.fill();

  // ── Right side face ──
  ctx.fillStyle = wallDarkColor;
  ctx.beginPath();
  ctx.moveTo(x + w, y);           // front top-right
  ctx.lineTo(x + w + dx, y + dy); // back top-right
  ctx.lineTo(x + w + dx, y + h + dy * 0.3); // back bottom-right
  ctx.lineTo(x + w, y + h);       // front bottom-right
  ctx.closePath();
  ctx.fill();
  // Side wall shading gradient
  const sideGrad = ctx.createLinearGradient(x + w, y, x + w + dx, y);
  sideGrad.addColorStop(0, 'rgba(0,0,0,0)');
  sideGrad.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = sideGrad;
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + dx, y + dy);
  ctx.lineTo(x + w + dx, y + h + dy * 0.3);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  // Side wall edge
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + w, y); ctx.lineTo(x + w + dx, y + dy);
  ctx.lineTo(x + w + dx, y + h + dy * 0.3); ctx.lineTo(x + w, y + h);
  ctx.stroke();

  // ── Front face ──
  ctx.fillStyle = wallColor;
  ctx.fillRect(x, y, w, h);
  // Front face lighting gradient (top lighter, bottom darker)
  const frontGrad = ctx.createLinearGradient(x, y, x, y + h);
  frontGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
  frontGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
  frontGrad.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = frontGrad;
  ctx.fillRect(x, y, w, h);
  // Front face border
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);

  // ── Top face (roof) ──
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(x, y);                 // front top-left
  ctx.lineTo(x + dx, y + dy);       // back top-left
  ctx.lineTo(x + w + dx, y + dy);   // back top-right
  ctx.lineTo(x + w, y);             // front top-right
  ctx.closePath();
  ctx.fill();
  // Roof highlight
  const roofGrad = ctx.createLinearGradient(x, y + dy, x, y);
  roofGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
  roofGrad.addColorStop(1, 'rgba(0,0,0,0.05)');
  ctx.fillStyle = roofGrad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.lineTo(x + w + dx, y + dy);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  // Roof edge
  ctx.strokeStyle = roofDarkColor; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x + dx, y + dy);
  ctx.lineTo(x + w + dx, y + dy); ctx.lineTo(x + w, y);
  ctx.closePath(); ctx.stroke();

  // ── Front edge highlight (eave) ──
  ctx.fillStyle = roofDarkColor;
  ctx.fillRect(x - 2, y - 2, w + 4, 4);

  // ── Draw building-specific details on front face ──
  drawDetails(ctx, x, y, w, h);
}

function drawRestaurant(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, b: BuildingDef) {
  drawBuilding3D(ctx, x, y, w, h, 18,
    b.wallColor, '#8a6040', b.roofColor, '#5a0000',
    (ctx, fx, fy, fw, fh) => {
      // Windows with depth/recess (3 windows)
      const winW = 22, winH = 18;
      for (let i = 0; i < 3; i++) {
        const wx = fx + 16 + i * ((fw - 32) / 2.5);
        const wy = fy + fh * 0.15 + 6;
        // Window recess
        ctx.fillStyle = '#1a0a00'; ctx.fillRect(wx - 3, wy - 3, winW + 6, winH + 6);
        ctx.fillStyle = '#3a2010'; ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);
        // Glass — warm glow
        const g = ctx.createLinearGradient(wx, wy, wx, wy + winH);
        g.addColorStop(0, 'rgba(255,230,170,0.9)'); g.addColorStop(1, 'rgba(255,200,120,0.7)');
        ctx.fillStyle = g; ctx.fillRect(wx, wy, winW, winH);
        // Cross bars
        ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(wx + winW / 2, wy); ctx.lineTo(wx + winW / 2, wy + winH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx, wy + winH / 2); ctx.lineTo(wx + winW, wy + winH / 2); ctx.stroke();
        // Sill
        ctx.fillStyle = '#deb887'; ctx.fillRect(wx - 3, wy + winH + 1, winW + 6, 3);
      }

      // Awning
      const awY = fy + fh * 0.52;
      ctx.fillStyle = '#8B0000';
      ctx.beginPath();
      ctx.moveTo(fx + 6, awY); ctx.lineTo(fx + fw - 6, awY);
      ctx.lineTo(fx + fw - 14, awY + 14); ctx.lineTo(fx + 14, awY + 14);
      ctx.closePath(); ctx.fill();
      // Awning shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(fx + 14, awY + 12, fw - 28, 4);
      // Awning stripes
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 5; i++) {
        const asx = fx + 18 + i * (fw - 36) / 5;
        ctx.fillRect(asx, awY + 2, (fw - 36) / 10, 10);
      }
      // Scallop edge
      ctx.strokeStyle = '#6a0000'; ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const scx = fx + 14 + i * (fw - 28) / 8;
        ctx.beginPath();
        ctx.arc(scx + (fw - 28) / 16, awY + 14, (fw - 28) / 16, 0, Math.PI);
        ctx.stroke();
      }

      // Sign
      ctx.fillStyle = '#1a0a00';
      ctx.fillRect(fx + fw / 2 - 50, fy - 6, 100, 16);
      ctx.fillStyle = b.accentColor;
      ctx.font = 'bold 11px "VT323", monospace'; ctx.textAlign = 'center';
      ctx.fillText('🍽️ RESTAURANT', fx + fw / 2, fy + 6);

      // Door
      const doorX = fx + fw / 2 - 12, doorY = fy + fh - 30;
      ctx.fillStyle = '#1a0800'; ctx.fillRect(doorX - 3, doorY - 3, 30, 36);
      ctx.fillStyle = '#4a2a0a'; ctx.fillRect(doorX, doorY, 24, 30);
      ctx.fillStyle = '#6a4a2a'; ctx.fillRect(doorX + 3, doorY + 3, 18, 24);
      // Door panels
      ctx.fillStyle = '#7a5a3a'; ctx.fillRect(doorX + 5, doorY + 5, 14, 9);
      ctx.fillStyle = '#7a5a3a'; ctx.fillRect(doorX + 5, doorY + 17, 14, 9);
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(doorX + 5, doorY + 5, 6, 9);
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(doorX + 18, doorY + 16, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe870'; ctx.beginPath(); ctx.arc(doorX + 17.5, doorY + 15.5, 0.8, 0, Math.PI * 2); ctx.fill();
      // Step
      ctx.fillStyle = '#8a7a6a'; ctx.fillRect(doorX - 4, doorY + 30, 32, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(doorX - 4, doorY + 30, 32, 1);
    }
  );
}

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, b: BuildingDef) {
  drawBuilding3D(ctx, x, y, w, h, 14,
    b.wallColor, '#a08060', b.roofColor, '#5a2a0a',
    (ctx, fx, fy, fw, fh) => {
      // Chimney (drawn on top of roof)
      const chimX = fx + fw * 0.72;
      ctx.fillStyle = '#5a2a10'; ctx.fillRect(chimX + 2, fy - 22, 4, 22);
      ctx.fillStyle = '#6a3a1a'; ctx.fillRect(chimX, fy - 22, 12, 22);
      ctx.fillStyle = '#7a4a2a'; ctx.fillRect(chimX, fy - 22, 3, 22);
      ctx.fillStyle = '#4a2a0a'; ctx.fillRect(chimX - 2, fy - 22, 16, 3);
      // Smoke
      const t = Date.now() * 0.001;
      ctx.fillStyle = 'rgba(180,180,180,0.3)';
      ctx.beginPath(); ctx.arc(chimX + 6, fy - 28 - Math.sin(t) * 4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(180,180,180,0.2)';
      ctx.beginPath(); ctx.arc(chimX + 9, fy - 36 - Math.sin(t + 1) * 3, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(200,200,200,0.1)';
      ctx.beginPath(); ctx.arc(chimX + 4, fy - 44 - Math.sin(t + 2) * 2, 6, 0, Math.PI * 2); ctx.fill();

      // Windows
      const winW = 20, winH = 16;
      for (let i = 0; i < 2; i++) {
        const wx = fx + 12 + i * (fw - 44);
        const wy = fy + fh * 0.2 + 4;
        ctx.fillStyle = '#1a0a00'; ctx.fillRect(wx - 3, wy - 3, winW + 6, winH + 6);
        ctx.fillStyle = '#2a1a0a'; ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);
        const g = ctx.createLinearGradient(wx, wy, wx, wy + winH);
        g.addColorStop(0, 'rgba(135,206,235,0.8)'); g.addColorStop(1, 'rgba(100,170,210,0.6)');
        ctx.fillStyle = g; ctx.fillRect(wx, wy, winW, winH);
        // Curtains
        ctx.fillStyle = '#c8a0a0'; ctx.fillRect(wx, wy, 4, winH); ctx.fillRect(wx + winW - 4, wy, 4, winH);
        ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(wx + winW / 2, wy); ctx.lineTo(wx + winW / 2, wy + winH); ctx.stroke();
        ctx.fillStyle = '#deb887'; ctx.fillRect(wx - 2, wy + winH, winW + 4, 3);
      }

      // Door
      const doorX = fx + fw / 2 - 10, doorY = fy + fh - 26;
      ctx.fillStyle = '#2a1005'; ctx.fillRect(doorX - 2, doorY - 2, 24, 30);
      ctx.fillStyle = '#5a3210'; ctx.fillRect(doorX, doorY, 20, 26);
      ctx.fillStyle = '#7a5230'; ctx.fillRect(doorX + 3, doorY + 3, 14, 20);
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(doorX + 4, doorY + 4, 6, 18);
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(doorX + 14, doorY + 14, 2, 0, Math.PI * 2); ctx.fill();
      // Step
      ctx.fillStyle = '#9a8a7a'; ctx.fillRect(doorX - 3, doorY + 26, 26, 3);
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(doorX - 3, doorY + 26, 26, 1);

      // House number
      ctx.fillStyle = '#fff'; ctx.font = '9px "Share Tech Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText('42', fx + fw / 2, doorY - 3);
    }
  );
}

function drawCafe(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, b: BuildingDef) {
  drawBuilding3D(ctx, x, y, w, h, 16,
    b.wallColor, '#704020', b.roofColor, '#1a2a2a',
    (ctx, fx, fy, fw, fh) => {
      // Large front window
      const winX = fx + 10, winY = fy + fh * 0.12 + 4;
      const winW = fw - 20, winH = fh * 0.28;
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(winX - 4, winY - 4, winW + 8, winH + 8);
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(winX - 2, winY - 2, winW + 4, winH + 4);
      const g = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      g.addColorStop(0, 'rgba(220,200,160,0.7)'); g.addColorStop(0.6, 'rgba(180,160,120,0.5)');
      g.addColorStop(1, 'rgba(160,140,100,0.6)');
      ctx.fillStyle = g; ctx.fillRect(winX, winY, winW, winH);
      // Dividers
      ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(winX + winW / 3, winY); ctx.lineTo(winX + winW / 3, winY + winH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(winX + winW * 2 / 3, winY); ctx.lineTo(winX + winW * 2 / 3, winY + winH); ctx.stroke();
      // Sill
      ctx.fillStyle = '#6a5a4a'; ctx.fillRect(winX - 4, winY + winH + 2, winW + 8, 3);

      // Sign board
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(fx + fw / 2 - 39, fy - 8, 80, 18);
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(fx + fw / 2 - 40, fy - 10, 80, 18);
      ctx.fillStyle = b.accentColor;
      ctx.font = 'bold 13px "VT323", monospace'; ctx.textAlign = 'center';
      ctx.fillText('☕ CAFÉ', fx + fw / 2, fy + 4);

      // Awning
      const awY = fy + fh * 0.48;
      ctx.fillStyle = '#2F4F4F';
      ctx.beginPath();
      ctx.moveTo(fx + 6, awY); ctx.lineTo(fx + fw - 6, awY);
      ctx.lineTo(fx + fw - 14, awY + 12); ctx.lineTo(fx + 14, awY + 12);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(fx + 14, awY + 10, fw - 28, 4);
      ctx.fillStyle = '#FFE4B5';
      for (let i = 0; i < 4; i++) {
        const asx = fx + 18 + i * (fw - 36) / 4;
        ctx.fillRect(asx, awY + 2, (fw - 36) / 8, 9);
      }

      // Outdoor table & chairs
      const tableX = fx + fw / 2 - 8, tableY = fy + fh - 18;
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath(); ctx.ellipse(tableX + 8, tableY + 12, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(tableX, tableY, 16, 10);
      ctx.fillStyle = '#6a5a4a'; ctx.fillRect(tableX + 1, tableY, 14, 2);
      ctx.fillStyle = '#4a3a2a';
      ctx.beginPath(); ctx.arc(tableX - 6, tableY + 5, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(tableX + 22, tableY + 5, 4, 0, Math.PI * 2); ctx.fill();

      // Door
      const doorX = fx + fw / 2 - 10, doorY = fy + fh - 30;
      ctx.fillStyle = '#1a0a00'; ctx.fillRect(doorX - 2, doorY - 2, 24, 32);
      ctx.fillStyle = '#3a2a1a'; ctx.fillRect(doorX, doorY, 20, 28);
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(doorX + 3, doorY + 3, 14, 22);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(doorX + 4, doorY + 4, 6, 20);
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(doorX + 14, doorY + 14, 2, 0, Math.PI * 2); ctx.fill();
      // Step
      ctx.fillStyle = '#7a6a5a'; ctx.fillRect(doorX - 3, doorY + 28, 26, 3);
    }
  );
}

// ═══════════════════════════════════════════
//  STICK FIGURE DRAWING
// ═══════════════════════════════════════════
function drawStickFigure(ctx: CanvasRenderingContext2D, sx: number, sy: number, color: string, skinColor: string, dir: string, walkFrame: number, moving: boolean, scale: number = 1) {
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(scale, scale);

  const legSwing = moving ? Math.sin(walkFrame * 2) * 8 : 0;
  const armSwing = moving ? Math.sin(walkFrame * 2 + Math.PI) * 6 : 0;
  const bodyBob = moving ? Math.abs(Math.sin(walkFrame * 2)) * 2 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(0, 16, 8, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Legs
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  // Left leg
  ctx.beginPath(); ctx.moveTo(0, 4 - bodyBob); ctx.lineTo(-3 - legSwing, 14); ctx.stroke();
  // Right leg
  ctx.beginPath(); ctx.moveTo(0, 4 - bodyBob); ctx.lineTo(3 + legSwing, 14); ctx.stroke();

  // Body
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -6 - bodyBob); ctx.lineTo(0, 4 - bodyBob); ctx.stroke();

  // Arms
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round';
  // Left arm
  ctx.beginPath(); ctx.moveTo(0, -3 - bodyBob); ctx.lineTo(-6 + armSwing, 4 - bodyBob); ctx.stroke();
  // Right arm
  ctx.beginPath(); ctx.moveTo(0, -3 - bodyBob); ctx.lineTo(6 - armSwing, 4 - bodyBob); ctx.stroke();

  // Head
  ctx.fillStyle = skinColor;
  ctx.beginPath(); ctx.arc(0, -11 - bodyBob, 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -11 - bodyBob, 6, 0, Math.PI * 2); ctx.stroke();

  // Eyes (direction-aware)
  const eyeOffX = dir === 'left' ? -2 : dir === 'right' ? 2 : 0;
  const eyeOffY = dir === 'up' ? -2 : dir === 'down' ? 1 : 0;
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(-2 + eyeOffX, -12 - bodyBob + eyeOffY, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(2 + eyeOffX, -12 - bodyBob + eyeOffY, 1, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ═══════════════════════════════════════════
//  KIOSK DRAWING
// ═══════════════════════════════════════════
export function drawKiosks(ctx: CanvasRenderingContext2D, kiosks: Kiosk[], player: Player, camX: number, camY: number) {
  const now = Date.now();
  kiosks.forEach(kiosk => {
    const sx = (kiosk.col + 0.5) * TILE - camX;
    const sy = (kiosk.row + 0.5) * TILE - camY;
    if (sx < -60 || sx > ctx.canvas.width + 60 || sy < -60 || sy > ctx.canvas.height + 60) return;

    const pulse = Math.sin(now * 0.002 + kiosk.row) * 0.15;

    // Kiosk post
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(sx - 2, sy - 4, 4, 20);

    // Sign board
    ctx.fillStyle = '#2a1a0a';
    ctx.beginPath();
    (ctx as any).roundRect(sx - 18, sy - 24, 36, 22, 3);
    ctx.fill();
    // Colored accent top
    ctx.fillStyle = kiosk.color;
    ctx.fillRect(sx - 18, sy - 24, 36, 4);

    // Category icon
    const icons: Record<string, string> = { motief: '💡', thema: '📖', samenvatting: '📝', personage: '👤' };
    ctx.font = '12px serif';
    ctx.textAlign = 'center';
    ctx.fillText(icons[kiosk.category] || '📋', sx, sy - 8);

    // Glow when near
    const dist = Math.hypot((kiosk.col + 0.5) * TILE - player.worldX, (kiosk.row + 0.5) * TILE - player.worldY);
    if (dist < INTERACT_DIST * 1.5) {
      ctx.fillStyle = `rgba(${hexToRgb(kiosk.color)}, ${0.15 + pulse})`;
      ctx.beginPath(); ctx.arc(sx, sy - 10, 24, 0, Math.PI * 2); ctx.fill();

      // Title
      ctx.font = 'bold 10px "Share Tech Mono", monospace';
      const tw = ctx.measureText(kiosk.title).width + 10;
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.beginPath(); (ctx as any).roundRect(sx - tw / 2, sy - 42, tw, 14, 3); ctx.fill();
      ctx.fillStyle = kiosk.color;
      ctx.fillText(kiosk.title, sx, sy - 32);

      if (dist < INTERACT_DIST) {
        const bounce = Math.sin(now * 0.005) * 2;
        ctx.font = '12px "VT323", monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText('[E] Lees', sx, sy - 48 + bounce);
      }
    }
  });
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ═══════════════════════════════════════════
//  PUBLIC DRAW FUNCTIONS
// ═══════════════════════════════════════════
export function drawObjects(ctx: CanvasRenderingContext2D, objects: GameObject[], player: Player, camX: number, camY: number) {
  const now = Date.now();
  objects.forEach(obj => {
    const sx = (obj.col + 0.5) * TILE - camX;
    const sy = (obj.row + 0.5) * TILE - camY;
    if (sx < -80 || sx > ctx.canvas.width + 80 || sy < -80 || sy > ctx.canvas.height + 80) return;

    const phase = obj.pulsePhase || 0;
    const pulse = Math.sin(now * 0.003 + phase);
    const floatY = Math.sin(now * 0.002 + phase) * 4;

    // Outer glow
    const glowRadius = 24 + pulse * 4;
    const gradient = ctx.createRadialGradient(sx, sy + floatY, 0, sx, sy + floatY, glowRadius);
    gradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(sx, sy + floatY, glowRadius, 0, Math.PI * 2); ctx.fill();

    // Sparkle particles
    for (let i = 0; i < 4; i++) {
      const angle = (now * 0.001 + i * Math.PI / 2 + phase) % (Math.PI * 2);
      const dist = 18 + Math.sin(now * 0.004 + i) * 6;
      const px = sx + Math.cos(angle) * dist;
      const py = sy + floatY + Math.sin(angle) * dist;
      const sparkleSize = 1.5 + Math.sin(now * 0.005 + i * 2) * 1;
      ctx.fillStyle = `rgba(255, 255, 200, ${0.4 + Math.sin(now * 0.006 + i) * 0.3})`;
      ctx.beginPath(); ctx.arc(px, py, sparkleSize, 0, Math.PI * 2); ctx.fill();
    }

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(sx, sy + 14, 12, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Item circle
    ctx.fillStyle = `rgba(255, 200, 50, ${0.2 + pulse * 0.1})`;
    ctx.beginPath(); ctx.arc(sx, sy + floatY, 18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255, 200, 50, ${0.7 + pulse * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(sx, sy + floatY, 18, 0, Math.PI * 2); ctx.stroke();

    // Emoji
    ctx.font = '22px serif'; ctx.textAlign = 'center';
    ctx.fillText(obj.emoji, sx, sy + floatY + 7);

    // Label
    ctx.font = 'bold 11px "Share Tech Mono", monospace';
    const labelW = ctx.measureText(obj.label).width + 12;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.beginPath(); (ctx as any).roundRect(sx - labelW / 2, sy + 20, labelW, 16, 4); ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.fillText(obj.label, sx, sy + 32);

    // Interact hint
    const dist = Math.hypot((obj.col + 0.5) * TILE - player.worldX, (obj.row + 0.5) * TILE - player.worldY);
    if (dist < INTERACT_DIST) {
      const bounce = Math.sin(now * 0.005) * 3;
      ctx.font = '14px "VT323", monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('[E] Onderzoek', sx, sy - 28 + bounce);
    }
  });
}

export function drawNPC(ctx: CanvasRenderingContext2D, npc: NPC, player: Player, camX: number, camY: number) {
  const wx = (npc.col + 0.5) * TILE + npc.subX;
  const wy = (npc.row + 0.5) * TILE + npc.subY;
  const sx = wx - camX, sy = wy - camY;
  if (sx < -60 || sx > ctx.canvas.width + 60 || sy < -60 || sy > ctx.canvas.height + 60) return;

  const t = Date.now() * 0.002;
  const isMoving = npc.wanderDx !== 0 || npc.wanderDy !== 0;
  const dir = npc.wanderDx > 0 ? 'right' : npc.wanderDx < 0 ? 'left' : npc.wanderDy > 0 ? 'down' : 'up';

  // Glow ring when nearby
  const dist = Math.hypot(wx - player.worldX, wy - player.worldY);
  if (dist < INTERACT_DIST * 1.5) {
    const glowPulse = 0.3 + 0.2 * Math.sin(Date.now() * 0.004);
    const glowRadius = 22 + Math.sin(Date.now() * 0.003) * 4;
    const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowRadius);
    gradient.addColorStop(0, `rgba(${hexToRgb(npc.color)}, ${glowPulse})`);
    gradient.addColorStop(0.6, `rgba(${hexToRgb(npc.color)}, ${glowPulse * 0.4})`);
    gradient.addColorStop(1, `rgba(${hexToRgb(npc.color)}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(sx, sy, glowRadius, 0, Math.PI * 2); ctx.fill();

    // Outline ring
    ctx.strokeStyle = `rgba(${hexToRgb(npc.color)}, ${0.5 + glowPulse})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(sx, sy + 2, 16, 0, Math.PI * 2); ctx.stroke();
  }

  drawStickFigure(ctx, sx, sy, npc.color, npc.skinColor || '#e8b88a', dir, t * 30, isMoving, 1.1);

  // Name bubble
  ctx.font = 'bold 10px "Share Tech Mono", monospace';
  ctx.textAlign = 'center';
  const nw = ctx.measureText(npc.name).width + 8;
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.beginPath(); (ctx as any).roundRect(sx - nw / 2, sy - 30, nw, 14, 3); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(npc.name, sx, sy - 20);

  // Interaction indicator
  if (dist < INTERACT_DIST) {
    const bounce = Math.sin(t * 4) * 3;
    ctx.font = '13px "VT323", monospace';
    ctx.fillStyle = '#ffb000';
    ctx.fillText('💬 E', sx, sy - 38 + bounce);
  }
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, camX: number, camY: number) {
  const sx = player.worldX - camX, sy = player.worldY - camY;

  drawStickFigure(ctx, sx, sy, '#2980b9', '#f0c8a0', player.dir, player.walkFrame, player.moving, 1.2);

  // Player tag
  ctx.font = 'bold 10px "Share Tech Mono", monospace';
  ctx.textAlign = 'center';
  const lw = ctx.measureText('Speler').width + 8;
  ctx.fillStyle = 'rgba(41,128,185,0.85)';
  ctx.beginPath(); (ctx as any).roundRect(sx - lw / 2, sy - 32, lw, 14, 3); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText('Speler', sx, sy - 22);
}

export function drawDesks(ctx: CanvasRenderingContext2D, desks: Desk[], player: Player, camX: number, camY: number) {
  desks.forEach(desk => {
    const sx = (desk.col + 0.5) * TILE - camX, sy = (desk.row + 0.5) * TILE - camY;
    if (sx < -80 || sx > ctx.canvas.width + 80 || sy < -80 || sy > ctx.canvas.height + 80) return;

    const sc = desk.screenColor;
    ctx.fillStyle = '#3a2a1a'; ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = 1;
    ctx.fillRect(sx - 20, sy - 6, 40, 14); ctx.strokeRect(sx - 20, sy - 6, 40, 14);
    ctx.fillStyle = '#1a1a1a'; ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); (ctx as any).roundRect(sx - 14, sy - 30, 28, 20, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#030503';
    ctx.beginPath(); (ctx as any).roundRect(sx - 11, sy - 27, 22, 14, 2); ctx.fill();
    ctx.font = 'bold 8px "VT323", monospace';
    ctx.textAlign = 'center'; ctx.fillStyle = sc;
    ctx.shadowColor = sc; ctx.shadowBlur = 6;
    ctx.fillText(desk.emoji, sx, sy - 18);
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(sx + 12, sy - 12, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = sc; ctx.shadowColor = sc; ctx.shadowBlur = 5; ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#222'; ctx.fillRect(sx - 14, sy - 3, 28, 5);
    ctx.font = '11px "VT323", monospace'; ctx.fillStyle = '#ccc';
    ctx.textAlign = 'center';
    ctx.fillText(desk.name, sx, sy + 16);

    const dist = Math.hypot((desk.col + 0.5) * TILE - player.worldX, (desk.row + 0.5) * TILE - player.worldY);
    if (dist < INTERACT_DIST) {
      ctx.font = '12px "VT323", monospace'; ctx.fillStyle = '#fff';
      ctx.fillText('[E]', sx, sy - 36);
    }
  });
}

export function drawBuildingLabels(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  BUILDING_LABELS.forEach(b => {
    const sx = b.col * TILE - camX, sy = b.row * TILE - camY;
    if (sx < -200 || sx > ctx.canvas.width + 200 || sy < -60 || sy > ctx.canvas.height + 60) return;
    ctx.font = 'bold 14px "VT323", monospace';
    ctx.textAlign = 'center';
    const w = ctx.measureText(b.text).width + 14;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.beginPath(); (ctx as any).roundRect(sx - w / 2, sy - 16, w, 22, 5); ctx.fill();
    ctx.fillStyle = b.color; ctx.fillText(b.text, sx, sy);
  });
}

export function drawPathArrows(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  PATH_ARROWS.forEach(arr => {
    const sx = (arr.col + 0.5) * TILE - camX, sy = (arr.row + 0.5) * TILE - camY;
    if (sx < -40 || sx > ctx.canvas.width + 40 || sy < -40 || sy > ctx.canvas.height + 40) return;
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003 + arr.col);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(DIR_ANGLES[arr.dir]);
    ctx.globalAlpha = 0.4 + pulse * 0.4;
    ctx.fillStyle = '#ffb000';
    ctx.beginPath();
    ctx.moveTo(8, 0); ctx.lineTo(-4, -5); ctx.lineTo(-4, 5);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  });
}

export function drawCompass(compassCtx: CanvasRenderingContext2D, player: Player, targetX: number, targetY: number) {
  const cx2 = 34, cy2 = 34, r = 28;
  compassCtx.clearRect(0, 0, 68, 68);
  compassCtx.fillStyle = 'rgba(0,0,0,0.75)';
  compassCtx.beginPath(); compassCtx.arc(cx2, cy2, r, 0, Math.PI * 2); compassCtx.fill();
  compassCtx.strokeStyle = '#333'; compassCtx.lineWidth = 2;
  compassCtx.beginPath(); compassCtx.arc(cx2, cy2, r, 0, Math.PI * 2); compassCtx.stroke();

  const dx = targetX - player.worldX;
  const dy = targetY - player.worldY;
  const angle = Math.atan2(dy, dx);
  const al = 20;
  const ax = cx2 + Math.cos(angle) * al;
  const ay = cy2 + Math.sin(angle) * al;
  compassCtx.strokeStyle = '#39ff14'; compassCtx.lineWidth = 2.5;
  compassCtx.beginPath(); compassCtx.moveTo(cx2, cy2); compassCtx.lineTo(ax, ay); compassCtx.stroke();
  const headLen = 7, headAngle = 0.4;
  compassCtx.fillStyle = '#39ff14';
  compassCtx.beginPath();
  compassCtx.moveTo(ax, ay);
  compassCtx.lineTo(ax - headLen * Math.cos(angle - headAngle), ay - headLen * Math.sin(angle - headAngle));
  compassCtx.lineTo(ax - headLen * Math.cos(angle + headAngle), ay - headLen * Math.sin(angle + headAngle));
  compassCtx.closePath(); compassCtx.fill();
  compassCtx.fillStyle = '#fff';
  compassCtx.beginPath(); compassCtx.arc(cx2, cy2, 3, 0, Math.PI * 2); compassCtx.fill();
  compassCtx.font = '9px "Share Tech Mono", monospace';
  compassCtx.fillStyle = '#39ff14'; compassCtx.textAlign = 'center';
  compassCtx.fillText('📚', cx2, cy2 + r - 5);
}

export function drawInteriorOverlay(ctx: CanvasRenderingContext2D, interior: Interior, entering: boolean, progress: number) {
  const alpha = entering ? (1 - progress) : progress;
  if (alpha > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

export function drawInteriorLabel(ctx: CanvasRenderingContext2D, interior: Interior) {
  ctx.font = 'bold 16px "VT323", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  const text = interior.name;
  const w = ctx.measureText(text).width + 20;
  ctx.beginPath();
  (ctx as any).roundRect(ctx.canvas.width / 2 - w / 2, 12, w, 28, 6);
  ctx.fill();
  ctx.fillStyle = '#ffd700';
  ctx.fillText(text, ctx.canvas.width / 2, 32);

  ctx.font = '13px "VT323", monospace';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Loop naar de deur om te vertrekken', ctx.canvas.width / 2, 52);
}
