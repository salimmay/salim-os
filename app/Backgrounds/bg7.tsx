"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = {
  bg: '#050a14',
  grid: 'rgba(0, 255, 170, 0.15)',
  hud: '#00ffaa',
  hudWarn: '#ff0055',
  missile: '#ffffff',
  trail: 'rgba(100, 200, 255, 0.5)',
  enemy: '#ff0055',
  hero: '#00aaff'
};

class Missile {
  x: number; y: number; vx: number; vy: number;
  history: {x: number, y: number}[];
  life: number;
  angle: number;
  speed: number;
  turnRate: number;
  wobble: number;
  
  constructor(w: number, h: number) {
    // Spawn randomly off-screen
    const side = Math.floor(Math.random() * 4);
    if(side === 0) { this.x = Math.random() * w; this.y = -50; }
    else if(side === 1) { this.x = w + 50; this.y = Math.random() * h; }
    else if(side === 2) { this.x = Math.random() * w; this.y = h + 50; }
    else { this.x = -50; this.y = Math.random() * h; }

    this.vx = 0; this.vy = 0;
    this.history = [];
    this.life = 200 + Math.random() * 100;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 4 + Math.random() * 3;
    this.turnRate = 0.05 + Math.random() * 0.05;
    this.wobble = Math.random() * 0.2;
  }

  update(targetX: number, targetY: number) {
    this.life--;
    
    // Homing Logic
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const targetAngle = Math.atan2(dy, dx);
    
    // Smooth turning
    let diff = targetAngle - this.angle;
    // Normalize angle
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    
    this.angle += Math.sign(diff) * Math.min(Math.abs(diff), this.turnRate);
    
    // Add anime "wobble" to flight path
    this.angle += Math.sin(this.life * 0.2) * this.wobble;

    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    this.x += this.vx;
    this.y += this.vy;

    // Record trail
    this.history.push({x: this.x, y: this.y});
    if (this.history.length > 20) this.history.shift();
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw Trail (The "Itano Circus" effect)
    ctx.beginPath();
    ctx.strokeStyle = COLORS.trail;
    ctx.lineWidth = 2;
    for(let i=0; i<this.history.length - 1; i++) {
      const p1 = this.history[i];
      const p2 = this.history[i+1];
      ctx.globalAlpha = i / this.history.length;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();
    
    // Draw Missile Head
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-10, -3); ctx.lineTo(-10, 3);
    ctx.fill();
    ctx.restore();
  }
}

class PerspectiveGrid {
  offsetY: number;
  speed: number;

  constructor() {
    this.offsetY = 0;
    this.speed = 2;
  }

  update() {
    this.offsetY = (this.offsetY + this.speed) % 100;
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const Horizon = h * 0.5; // Horizon line
    
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    
    // Vertical lines (converging to center)
    const centerX = w / 2;
    for (let x = -w; x < w * 2; x += 100) {
      ctx.beginPath();
      // Simple perspective simulation
      ctx.moveTo(x, h);
      const distToCenter = x - centerX;
      ctx.lineTo(centerX + distToCenter * 0.1, Horizon);
      ctx.stroke();
    }

    // Horizontal lines (moving down)
    // To fake depth, the gap between lines should get smaller as they go up
    for (let i = 0; i < 20; i++) {
        const y = h - ((i * 50 + this.offsetY) % (h/2));
        if (y < Horizon) continue;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
    
    // Horizon glow
    const g = ctx.createLinearGradient(0, Horizon - 50, 0, Horizon + 50);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.5, COLORS.grid);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, Horizon - 50, w, 100);
  }
}

class HUD {
  rotation: number;
  textAlpha: number;

  constructor() {
    this.rotation = 0;
    this.textAlpha = 1;
  }

  draw(ctx: CanvasRenderingContext2D, mx: number, my: number) {
    this.rotation += 0.02;
    this.textAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.4;

    ctx.strokeStyle = COLORS.hud;
    
    // Outer Ring (dashed)
    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(this.rotation);
    ctx.setLineDash([10, 20]);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    // Inner Ring (Static)
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(mx, my, 20, 0, Math.PI * 2); ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(mx - 50, my); ctx.lineTo(mx - 25, my);
    ctx.moveTo(mx + 50, my); ctx.lineTo(mx + 25, my);
    ctx.moveTo(mx, my - 50); ctx.lineTo(mx, my - 25);
    ctx.moveTo(mx, my + 50); ctx.lineTo(mx, my + 25);
    ctx.stroke();

    // Text Elements
    ctx.fillStyle = COLORS.hud;
    ctx.font = "10px monospace";
    ctx.fillText(`TGT_LOCK: [ ${Math.floor(mx)}, ${Math.floor(my)} ]`, mx + 50, my - 40);
    
    ctx.fillStyle = COLORS.hudWarn;
    ctx.globalAlpha = this.textAlpha;
    ctx.fillText("WARNING: HIGH VELOCITY", mx + 50, my - 25);
    ctx.globalAlpha = 1;
  }
}

class SpeedLine {
    x: number; y: number; z: number; length: number; speed: number;
    constructor(w: number, h: number) {
        this.x = (Math.random() - 0.5) * w;
        this.y = (Math.random() - 0.5) * h;
        this.z = Math.random() * 2 + 1; // Depth factor
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 10 + 20;
    }

    update(w: number, h: number) {
        this.z -= 0.1;
        if(this.z <= 0) {
             this.x = (Math.random() - 0.5) * w;
             this.y = (Math.random() - 0.5) * h;
             this.z = 3;
        }
    }

    draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
        const cx = w/2; 
        const cy = h/2;
        
        // Perspective projection
        const scale = 1 / this.z;
        const sx = cx + this.x * scale;
        const sy = cy + this.y * scale;

        // Calculate tail position based on speed/direction (radial burst)
        const angle = Math.atan2(sy - cy, sx - cx);
        const tx = sx - Math.cos(angle) * this.length * scale;
        const ty = sy - Math.sin(angle) * this.length * scale;

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
    }
}

const Background7 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let missiles: Missile[] = [];
    const grid = new PerspectiveGrid();
    const hud = new HUD();
    const speedLines = Array.from({length: 50}, () => new SpeedLine(width, height));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Clear with slight trail effect for extra speed feel
      ctx.fillStyle = 'rgba(5, 10, 20, 0.6)';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      grid.update();
      grid.draw(ctx, width, height);
      
      // Draw Speed Lines
      speedLines.forEach(sl => {
          sl.update(width, height);
          sl.draw(ctx, width, height);
      });

      // Spawn Missiles
      if (missiles.length < 15 && Math.random() < 0.05) {
        missiles.push(new Missile(width, height));
      }

      // Update & Draw Missiles
      missiles.forEach(m => {
        m.update(mouseX, mouseY);
        m.draw(ctx);
        
        // Reset if it hits target (or close enough)
        if(Math.hypot(m.x - mouseX, m.y - mouseY) < 30) {
            m.life = 0;
            // Draw explosion flash
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(m.x, m.y, 20, 0, Math.PI*2); ctx.fill();
        }
      });
      missiles = missiles.filter(m => m.life > 0);

      // Draw HUD (on top)
      hud.draw(ctx, mouseX, mouseY);

      // Draw Vignette
      const grad = ctx.createRadialGradient(width/2, height/2, height/2, width/2, height/2, height);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-[#050a14]" />;
};

export default Background7;