"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = { explosion: ['#ef4444', '#f59e0b', '#ffffff', '#7dd3fc'] };

class Star {
  x: number; y: number; size: number; alpha: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w; this.y = Math.random() * h;
    this.size = Math.random() * 1.5; this.alpha = Math.random() * 0.5 + 0.1;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
  }
}

class Explosion {
  x: number; y: number; particles: any[]; dead: boolean;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.dead = false; this.particles = [];
    for(let i=0; i<25; i++) {
      const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 3 + 1;
      this.particles.push({ x: 0, y: 0, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1.0, color: COLORS.explosion[Math.floor(Math.random() * COLORS.explosion.length)], size: Math.random() * 3 + 1 });
    }
  }
  update() {
    let active = false;
    this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.02; p.vx *= 0.95; p.vy *= 0.95; if(p.life > 0) active = true; });
    if(!active) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    this.particles.forEach(p => { if(p.life <= 0) return; ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); });
    ctx.restore();
  }
}

class Rocket {
  x: number; y: number; vx: number; vy: number; size: number; angle: number; dead: boolean; type: number;
  constructor(w: number, h: number) {
    this.dead = false; this.size = 15; this.type = Math.random() > 0.5 ? 1 : 2;
    if (Math.random() < 0.5) { this.x = Math.random() < 0.5 ? -50 : w + 50; this.y = Math.random() * h; } 
    else { this.x = Math.random() * w; this.y = Math.random() < 0.5 ? -50 : h + 50; }
    const targetX = w/2 + (Math.random() - 0.5) * w * 0.5; const targetY = h/2 + (Math.random() - 0.5) * h * 0.5;
    this.angle = Math.atan2(targetY - this.y, targetX - this.x); const speed = Math.random() * 2 + 1.5;
    this.vx = Math.cos(this.angle) * speed; this.vy = Math.sin(this.angle) * speed;
  }
  update(w: number, h: number) {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -100 || this.x > w+100 || this.y < -100 || this.y > h+100) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
    ctx.fillStyle = this.type === 1 ? '#cbd5e1' : '#94a3b8'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.lineTo(-15, -12); ctx.lineTo(-5, -6); ctx.moveTo(-10, 6); ctx.lineTo(-15, 12); ctx.lineTo(-5, 6); ctx.fill();
    ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#ef4444'; ctx.beginPath(); ctx.moveTo(-15, -3); ctx.lineTo(-25 - Math.random() * 10, 0); ctx.lineTo(-15, 3); ctx.fill();
    ctx.restore();
  }
}

const Background2 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let stars: Star[] = []; let rockets: Rocket[] = []; let explosions: Explosion[] = [];
    
    const init = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      stars = Array.from({ length: 100 }, () => new Star(canvas.width, canvas.height));
    };
    window.addEventListener('resize', init); init();

    const animate = () => {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height); g.addColorStop(0, '#020617'); g.addColorStop(1, '#1e293b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => s.draw(ctx));

      if (rockets.length < 6 && Math.random() < 0.05) rockets.push(new Rocket(canvas.width, canvas.height));
      
      for (let i = 0; i < rockets.length; i++) {
        const r1 = rockets[i]; r1.update(canvas.width, canvas.height); r1.draw(ctx);
        for (let j = i + 1; j < rockets.length; j++) {
          const r2 = rockets[j]; if (r1.dead || r2.dead) continue;
          if (Math.hypot(r1.x - r2.x, r1.y - r2.y) < r1.size + r2.size) {
            r1.dead = true; r2.dead = true; explosions.push(new Explosion((r1.x + r2.x) / 2, (r1.y + r2.y) / 2));
          }
        }
      }
      rockets = rockets.filter(r => !r.dead);
      explosions.forEach(ex => { ex.update(); ex.draw(ctx); });
      explosions = explosions.filter(ex => !ex.dead);
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', init);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-slate-900" />;
};
export default Background2;