"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = { grid: 'rgba(71, 85, 105, 0.2)', diskOuter: '#7c3aed', diskInner: '#22d3ee', data: ['#3b82f6', '#8b5cf6', '#10b981'] };

class SpacetimeGrid {
  points: {x: number, y: number, ox: number, oy: number}[]; cols: number; rows: number; gap: number;
  constructor(w: number, h: number) {
    this.gap = 40; this.cols = Math.ceil(w / this.gap) + 1; this.rows = Math.ceil(h / this.gap) + 1; this.points = [];
    for (let i = 0; i < this.cols; i++) for (let j = 0; j < this.rows; j++) this.points.push({ x: i * this.gap, y: j * this.gap, ox: i * this.gap, oy: j * this.gap });
  }
  update(centerX: number, centerY: number, isReversed: boolean) {
    const strength = isReversed ? -2000 : 1000;
    this.points.forEach(p => {
      const dx = p.ox - centerX; const dy = p.oy - centerY; const dist = Math.sqrt(dx*dx + dy*dy);
      const pull = Math.max(0, strength / (dist + 1)); const angle = Math.atan2(dy, dx);
      p.x = p.ox - Math.cos(angle) * pull; p.y = p.oy - Math.sin(angle) * pull;
    });
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 0.5; ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if ((i + 1) % this.cols !== 0) { const right = this.points[i+1]; ctx.moveTo(p.x, p.y); ctx.lineTo(right.x, right.y); }
      if (i + this.cols < this.points.length) { const down = this.points[i + this.cols]; ctx.moveTo(p.x, p.y); ctx.lineTo(down.x, down.y); }
    }
    ctx.stroke();
  }
}

class BlackHole {
  x: number; y: number; radius: number; accretionParticles: any[]; pulse: number;
  constructor(w: number, h: number) {
    this.x = w / 2; this.y = h / 2; this.radius = 60; this.accretionParticles = []; this.pulse = 0;
    for(let i=0; i<800; i++) this.accretionParticles.push({ angle: Math.random() * Math.PI * 2, r: this.radius + Math.random() * 150, speed: 0.02 + Math.random() * 0.03, size: Math.random() * 2, color: Math.random() > 0.5 ? COLORS.diskOuter : COLORS.diskInner });
  }
  update(isReversed: boolean) {
    this.pulse += 0.05;
    this.accretionParticles.forEach(p => {
      p.angle += p.speed * (isReversed ? -2 : 1);
      if (isReversed) { p.r += 2; if(p.r > 300) p.r = this.radius; } 
      else { p.r = Math.max(this.radius, p.r + Math.sin(this.pulse + p.angle) * 0.5); }
    });
  }
  draw(ctx: CanvasRenderingContext2D, isReversed: boolean) {
    ctx.save(); ctx.translate(this.x, this.y);
    this.accretionParticles.forEach(p => { const px = Math.cos(p.angle) * p.r; const py = Math.sin(p.angle) * p.r * 0.4; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.fill(); });
    const g = ctx.createRadialGradient(0, 0, this.radius * 0.8, 0, 0, this.radius * 1.5);
    if (isReversed) { g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#22d3ee'); g.addColorStop(1, 'transparent'); } 
    else { g.addColorStop(0, '#000000'); g.addColorStop(0.5, '#7c3aed'); g.addColorStop(1, 'transparent'); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = isReversed ? '#fff' : '#000'; ctx.beginPath(); ctx.arc(0, 0, isReversed ? this.radius * 0.8 : this.radius, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
}

const Background4 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let width = window.innerWidth; let height = window.innerHeight;
    canvas.width = width; canvas.height = height;
    const hole = new BlackHole(width, height);
    const grid = new SpacetimeGrid(width, height);
    let isMouseDown = false;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; ctx.fillRect(0, 0, width, height);
      hole.update(isMouseDown); grid.update(hole.x, hole.y, isMouseDown);
      grid.draw(ctx); hole.draw(ctx, isMouseDown);
      requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    return () => { window.removeEventListener('mousedown', () => isMouseDown = true); window.removeEventListener('mouseup', () => isMouseDown = false); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" />;
};
export default Background4;