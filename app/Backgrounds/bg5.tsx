"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = { hex: 'rgba(30, 41, 59, 0.3)', core: '#3b82f6', coreShield: 'rgba(59, 130, 246, 0.2)', guardian: '#22d3ee', virus: '#ef4444', laser: '#bef264' };

class HexGrid {
  hexagons: {x: number, y: number, size: number, active: number}[];
  constructor(w: number, h: number) {
    this.hexagons = []; const size = 40; const wStep = size * Math.sqrt(3); const hStep = size * 1.5;
    for (let y = 0; y < h + size; y += hStep) for (let x = 0; x < w + size; x += wStep) { const offset = (Math.floor(y / hStep) % 2 === 0) ? 0 : wStep / 2; this.hexagons.push({ x: x + offset, y: y, size: size, active: 0 }); }
  }
  update(mouseX: number, mouseY: number) {
    this.hexagons.forEach(hex => { const dist = Math.hypot(hex.x - mouseX, hex.y - mouseY); if (dist < 100) hex.active = 1; if (hex.active > 0) hex.active -= 0.02; });
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1;
    this.hexagons.forEach(hex => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) { const angle = (Math.PI / 3) * i; const hx = hex.x + hex.size * Math.cos(angle); const hy = hex.y + hex.size * Math.sin(angle); if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy); }
      ctx.closePath();
      if (hex.active > 0) { ctx.fillStyle = `rgba(56, 189, 248, ${hex.active * 0.2})`; ctx.fill(); ctx.strokeStyle = `rgba(56, 189, 248, ${hex.active * 0.5})`; } else { ctx.strokeStyle = COLORS.hex; } ctx.stroke();
    });
  }
}

class Kernel {
  x: number; y: number; radius: number; angle: number;
  constructor(w: number, h: number) { this.x = w / 2; this.y = h / 2; this.radius = 40; this.angle = 0; }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.beginPath(); ctx.strokeStyle = COLORS.coreShield; ctx.lineWidth = 2; ctx.arc(0, 0, this.radius + 15, 0, Math.PI * 2); ctx.stroke();
    ctx.rotate(this.angle += 0.02); ctx.fillStyle = COLORS.core; ctx.fillRect(-20, -20, 40, 40);
    ctx.restore();
  }
}

const Background5 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w = window.innerWidth; let h = window.innerHeight; canvas.width = w; canvas.height = h;
    const grid = new HexGrid(w, h); const kernel = new Kernel(w, h);
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.4)'; ctx.fillRect(0, 0, w, h);
      grid.update(mouseX, mouseY); grid.draw(ctx); kernel.draw(ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-slate-950" />;
};
export default Background5;