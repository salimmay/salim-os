"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = { coreSafe: '#3b82f6', coreDanger: '#ef4444', grid: 'rgba(30, 41, 59, 0.5)' };

class SingularityCore {
  x: number; y: number; radius: number; angle: number; color: string; shockwave: number;
  constructor(w: number, h: number) {
    this.x = w / 2; this.y = h / 2; this.radius = 45; this.angle = 0; this.color = COLORS.coreSafe; this.shockwave = 0;
  }
  update(time: number) {
    this.radius = 45 + Math.sin(time * 0.05) * 5; this.angle += 0.01;
    if (this.shockwave > 0) { this.shockwave += 15; if (this.shockwave > 1200) this.shockwave = 0; }
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    if (this.shockwave > 0) {
      ctx.beginPath(); ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - this.shockwave/1000)})`;
      ctx.lineWidth = 50; ctx.arc(0, 0, this.shockwave, 0, Math.PI * 2); ctx.stroke();
    }
    const g = ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, this.radius * 2);
    g.addColorStop(0, 'rgba(59, 130, 246, 0.6)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, this.radius * 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 2;
    [0, Math.PI/3, -Math.PI/3].forEach(rot => {
        ctx.rotate(rot + this.angle); ctx.beginPath(); ctx.ellipse(0, 0, this.radius * 1.8, this.radius * 0.6, 0, 0, Math.PI * 2); ctx.stroke(); ctx.rotate(-(rot + this.angle));
    });
    ctx.restore();
  }
}

const Background3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let core = new SingularityCore(canvas.width, canvas.height);
    let time = 0;

    const init = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; core = new SingularityCore(canvas.width, canvas.height); };
    window.addEventListener('resize', init); init();

    const drawGrid = () => {
        const w = canvas.width; const h = canvas.height; const horizon = h * 0.55; const step = (time * 0.5) % 50;
        ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = -w; i < w * 2; i += 100) { ctx.moveTo(i, h); ctx.lineTo(w/2 + (i - w/2) * 0.2, horizon); }
        for (let i = h; i > horizon; i -= 50) { const y = i + step; if (y > h) continue; ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        const g = ctx.createLinearGradient(0, horizon, 0, h); g.addColorStop(0, 'rgba(2, 6, 23, 1)'); g.addColorStop(0.2, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      time++;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); gradient.addColorStop(0, '#020617'); gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      core.update(time); core.draw(ctx);
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', init);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-slate-950" />;
};
export default Background3;