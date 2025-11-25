"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = {
  bg: '#0a0a0a',
  bladeIdle: 'rgba(56, 189, 248, 0.2)', // Dim Blue
  bladeActive: '#cyan', // Bright Cyan
  bladeCore: '#ffffff',
  enemy: '#ef4444', // Red
  enemyCore: '#7f1d1d',
  spark: '#bef264', // Lime/Yellow sparks
  blood: '#ef4444'  // Digital red blood
};

// --- CLASSES ---

class Spark {
  x: number; y: number; vx: number; vy: number; life: number; color: string;
  constructor(x: number, y: number, color: string, speedMulti: number) {
    this.x = x; this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * speedMulti;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1.0;
    this.color = color;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.life -= 0.05;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 2, 2);
    ctx.globalAlpha = 1;
  }
}

class Debris {
  x: number; y: number; vx: number; vy: number; life: number; size: number; rotation: number; rotSpeed: number;
  constructor(x: number, y: number, impactAngle: number) {
    this.x = x; this.y = y;
    this.size = Math.random() * 10 + 5;
    this.life = 1.0;
    // Explode perpendicular to the cut usually, but let's just do chaotic scatter
    const angle = impactAngle + (Math.random() - 0.5) * 2; 
    const speed = Math.random() * 10 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.rotation = Math.random() * Math.PI;
    this.rotSpeed = (Math.random() - 0.5) * 0.5;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.95; this.vy *= 0.95; // Friction
    this.rotation += this.rotSpeed;
    this.life -= 0.02;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life;
    ctx.fillStyle = COLORS.enemy;
    ctx.beginPath();
    ctx.moveTo(-this.size/2, -this.size/2);
    ctx.lineTo(this.size/2, -this.size/2);
    ctx.lineTo(0, this.size/2);
    ctx.fill();
    ctx.restore();
  }
}

class Enemy {
  x: number; y: number; size: number; dead: boolean; angle: number;
  constructor(w: number, h: number) {
    this.size = 20 + Math.random() * 15;
    this.dead = false;
    this.angle = 0;
    
    // Spawn edges
    const side = Math.floor(Math.random() * 4);
    if(side === 0) { this.x = Math.random() * w; this.y = -50; }
    else if(side === 1) { this.x = w + 50; this.y = Math.random() * h; }
    else if(side === 2) { this.x = Math.random() * w; this.y = h + 50; }
    else { this.x = -50; this.y = Math.random() * h; }
  }

  update(w: number, h: number) {
    // Slowly float towards center
    const dx = (w/2) - this.x;
    const dy = (h/2) - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    this.x += (dx/dist) * 1.5;
    this.y += (dy/dist) * 1.5;
    this.angle += 0.02;
    
    if (dist < 20) {
        // Reset if it hits player/center without dying
        this.dead = true; 
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Draw "Oni" Diamond
    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.enemy;
    ctx.fillStyle = COLORS.enemyCore;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    
    ctx.strokeStyle = COLORS.enemy;
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
    
    ctx.restore();
    ctx.shadowBlur = 0;
  }
}

class BladePoint {
  x: number; y: number; life: number; width: number;
  constructor(x: number, y: number, velocity: number) {
    this.x = x; this.y = y; 
    this.life = 1.0;
    // Faster movement = thinner, sharper blade. Slower = thicker, distinct aura.
    this.width = Math.min(10, Math.max(2, 20 / (velocity + 1))); 
  }
}

const Background8 = () => {
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

    let enemies: Enemy[] = [];
    let debris: Debris[] = [];
    let sparks: Spark[] = [];
    let trail: BladePoint[] = [];
    
    let lastMouseX = width/2;
    let lastMouseY = height/2;
    let mouseX = width/2;
    let mouseY = height/2;
    let mouseSpeed = 0;
    
    // Camera shake effect
    let shakeIntensity = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = mouseX; lastMouseY = mouseY;
      mouseX = e.clientX; mouseY = e.clientY;
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      mouseSpeed = Math.sqrt(dx*dx + dy*dy);
      
      // Add blade trail point
      trail.push(new BladePoint(mouseX, mouseY, mouseSpeed));
      if (trail.length > 10) trail.shift();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Line segment intersection helper
    const intersect = (x1:number, y1:number, x2:number, y2:number, cx:number, cy:number, r:number) => {
        // Simplified check: line vs circle (enemy radius)
        // Returns true if line passes close to center
        const dx = x2 - x1; const dy = y2 - y1;
        const t = ((cx - x1) * dx + (cy - y1) * dy) / (dx * dx + dy * dy);
        const closestX = x1 + t * dx;
        const closestY = y1 + t * dy;
        const dist = Math.hypot(closestX - cx, closestY - cy);
        
        // Only count intersection if t is on the segment (0..1)
        return dist < r && t >= 0 && t <= 1;
    };

    const animate = () => {
      // 1. Draw Background with Motion Blur
      ctx.fillStyle = 'rgba(10, 10, 10, 0.3)'; // High trails for "anime speed" look
      ctx.fillRect(0, 0, width, height);
      
      // Apply Shake
      ctx.save();
      if (shakeIntensity > 0) {
          const dx = (Math.random() - 0.5) * shakeIntensity;
          const dy = (Math.random() - 0.5) * shakeIntensity;
          ctx.translate(dx, dy);
          shakeIntensity *= 0.9;
          if (shakeIntensity < 0.5) shakeIntensity = 0;
      }

      // 2. Spawn Enemies
      if (enemies.length < 8 && Math.random() < 0.03) {
        enemies.push(new Enemy(width, height));
      }

      // 3. Draw & Logic for Enemies
      enemies.forEach(e => {
        e.update(width, height);
        e.draw(ctx);
        
        // Collision Detection with Blade
        if (mouseSpeed > 15) { // Only cut if moving fast
             // Check against last few segments of the blade
             const p1 = {x: lastMouseX, y: lastMouseY};
             const p2 = {x: mouseX, y: mouseY};
             
             if(intersect(p1.x, p1.y, p2.x, p2.y, e.x, e.y, e.size)) {
                 e.dead = true;
                 shakeIntensity = 15; // IMPACT!
                 
                 // Spawn Debris
                 const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                 for(let i=0; i<4; i++) debris.push(new Debris(e.x, e.y, angle));
                 
                 // Spawn Sparks/Blood
                 for(let i=0; i<10; i++) sparks.push(new Spark(e.x, e.y, COLORS.spark, 5));
                 for(let i=0; i<10; i++) sparks.push(new Spark(e.x, e.y, COLORS.blood, 3));
             }
        }
      });
      enemies = enemies.filter(e => !e.dead);

      // 4. Update & Draw Debris/Sparks
      debris.forEach(d => { d.update(); d.draw(ctx); });
      debris = debris.filter(d => d.life > 0);
      
      sparks.forEach(s => { s.update(); s.draw(ctx); });
      sparks = sparks.filter(s => s.life > 0);

      // 5. Draw The Blade (Katana Trail)
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (trail.length > 1) {
          ctx.beginPath();
          // Draw the glow
          ctx.shadowBlur = mouseSpeed > 15 ? 20 : 5;
          ctx.shadowColor = mouseSpeed > 15 ? '#00ffff' : '#38bdf8';
          
          for(let i=0; i<trail.length - 1; i++) {
              const p1 = trail[i];
              const p2 = trail[i+1];
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              p1.life -= 0.1;
          }
          
          ctx.lineWidth = mouseSpeed > 15 ? 2 : 4; 
          ctx.strokeStyle = mouseSpeed > 15 ? COLORS.bladeCore : COLORS.bladeIdle;
          ctx.stroke();
          
          // Draw extra "Sharp" line for fast movement
          if (mouseSpeed > 15) {
              ctx.shadowBlur = 30;
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 1;
              ctx.stroke();
          }
      }
      trail = trail.filter(p => p.life > 0);

      // 6. Rain/Digital Noise (Ambient)
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(40, 40, 50, 0.5)';
      for(let i=0; i<5; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          ctx.fillRect(rx, ry, 1, Math.random() * 20 + 10);
      }
      
      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-[#0a0a0a]" />
      <div className="fixed bottom-10 left-10 z-10 text-red-500/50 text-[10px] font-mono pointer-events-none hidden md:block">
         <p>STANCE: {`[ LETHAL ]`}</p>
         <p>VELOCITY_REQUIRED_FOR_CUT: 15m/s</p>
      </div>
    </>
  );
};

export default Background8;