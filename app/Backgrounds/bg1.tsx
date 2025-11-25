"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = {
  explosions: ['#ef4444', '#f59e0b', '#ffffff']
};

class Star {
  x: number; y: number; size: number; alpha: number; speed: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w; this.y = Math.random() * h;
    this.size = Math.random() * 1.5; this.alpha = Math.random();
    this.speed = Math.random() * 0.05;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}

class Planet {
  x: number; y: number; radius: number; color: string; hasRing: boolean; type: string;
  constructor(w: number, h: number, type: 'sun' | 'gas' | 'rock') {
    this.x = Math.random() * w; this.y = Math.random() * h; this.type = type;
    if (type === 'sun') { this.radius = 80 + Math.random() * 40; this.color = '#fb923c'; this.hasRing = false; } 
    else if (type === 'gas') { this.radius = 30 + Math.random() * 20; this.color = Math.random() > 0.5 ? '#4c1d95' : '#0f766e'; this.hasRing = true; } 
    else { this.radius = 10 + Math.random() * 15; this.color = '#3b82f6'; this.hasRing = false; }
  }
  update() {
    this.x += 0.05; if(this.x > window.innerWidth + 100) this.x = -100;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    if (this.type === 'sun') {
        const g = ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, this.radius * 1.5);
        g.addColorStop(0, 'rgba(253, 186, 116, 0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff7ed'; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
    } else {
        if (this.hasRing) { ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, this.radius * 1.8, this.radius * 0.5, -0.2, Math.PI, 0); ctx.stroke(); }
        const g = ctx.createRadialGradient(-5, -5, 0, 0, 0, this.radius); g.addColorStop(0, this.color); g.addColorStop(1, '#020617');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2); ctx.fill();
        if (this.hasRing) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, this.radius * 1.8, this.radius * 0.5, -0.2, 0, Math.PI); ctx.stroke(); }
    }
    ctx.restore();
  }
}

class Rocket {
  x: number; y: number; vx: number; vy: number; dead: boolean;
  constructor(w: number, h: number) {
    this.dead = false;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.x = Math.random() * w; this.y = -50; } else if (side === 1) { this.x = w + 50; this.y = Math.random() * h; } else if (side === 2) { this.x = Math.random() * w; this.y = h + 50; } else { this.x = -50; this.y = Math.random() * h; }
    const targetX = (w/2) + (Math.random()-0.5)*w; const targetY = (h/2) + (Math.random()-0.5)*h;
    const angle = Math.atan2(targetY - this.y, targetX - this.x); const speed = 2 + Math.random() * 3;
    this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
  }
  update(w: number, h: number) {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -200 || this.x > w + 200 || this.y < -200 || this.y > h + 200) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(this.vy, this.vx));
    ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#ef4444'; 
    ctx.beginPath(); ctx.moveTo(-15, -3); ctx.lineTo(-25 - Math.random() * 8, 0); ctx.lineTo(-15, 3); ctx.fill();
    ctx.restore();
  }
}

const Background1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let width = window.innerWidth; let height = window.innerHeight;
    canvas.width = width; canvas.height = height;

    const stars = Array.from({ length: 100 }, () => new Star(width, height));
    const planets = [new Planet(width, height, 'sun'), new Planet(width, height, 'gas'), new Planet(width, height, 'rock')];
    let rockets: Rocket[] = [];

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => { s.update(); s.draw(ctx); });
      planets.forEach(p => { p.update(); p.draw(ctx); });
      
      if (Math.random() < 0.02) rockets.push(new Rocket(canvas.width, canvas.height));
      rockets.forEach(r => { r.update(canvas.width, canvas.height); r.draw(ctx); });
      rockets = rockets.filter(r => !r.dead);

      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-slate-950" />;
};
export default Background1;