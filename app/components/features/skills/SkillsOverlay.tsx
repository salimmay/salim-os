"use client";

import React, { useRef, useEffect } from 'react';

const COLORS = {
  frontend: '#22d3ee',
  backend: '#34d399',
  creative: '#c084fc',
  future: '#ffffff',
};

const SKILLS_DATA = [
  { text: "React", type: "frontend" }, { text: "Next.js", type: "frontend" },
  { text: "TypeScript", type: "frontend" }, { text: "Tailwind", type: "frontend" },
  { text: "Node.js", type: "backend" }, { text: "MongoDB", type: "backend" },
  { text: "Docker", type: "backend" }, { text: "AWS", type: "future" },
  { text: "Figma", type: "creative" }, { text: "Three.js", type: "creative" },
  { text: "Rust", type: "future" }, { text: "AI/ML", type: "future" },
];

class SkillParticle {
  x: number; y: number; vx: number; vy: number; 
  text: string; color: string; size: number; type: string; 
  exploded: boolean; id: number;

  constructor(data: { text: string, type: string }, index: number, w: number, h: number) {
    this.id = index;
    this.x = w / 2; 
    this.y = h / 2;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 4;
    this.vx = Math.cos(angle) * velocity; 
    this.vy = Math.sin(angle) * velocity;
    this.text = data.text; 
    this.type = data.type;
    this.size = data.type === 'future' ? 12 : 14 + Math.random() * 6;
    this.exploded = false;
    this.color = COLORS[this.type as keyof typeof COLORS] || '#fff';
  }

  update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, mouseSpeed: number, activeCategory: string | null, time: number, w: number, h: number, isMouseDown: boolean) {
    if (activeCategory) {
       // Formation Mode
       if (this.type === activeCategory) {
         const centerX = w / 2; const centerY = h / 2;
         const angle = (time * 0.05) + (this.id * 0.5);
         const radius = 150 + Math.sin(time * 0.1 + this.id) * 30;
         const targetX = centerX + Math.cos(angle) * radius; 
         const targetY = centerY + Math.sin(angle) * radius;
         this.x += (targetX - this.x) * 0.1; 
         this.y += (targetY - this.y) * 0.1;
         this.vx = 0; this.vy = 0;
       } else {
         // Float away if not selected
         this.x += this.vx; this.y += this.vy;
         const dx = this.x - w/2; const dy = this.y - h/2;
         this.vx += dx * 0.0005; this.vy += dy * 0.0005;
       }
    } else {
        // Chaos / Exploded Mode
        if (!this.exploded) {
           this.vx *= 0.99; this.vy *= 0.99;
           if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) this.exploded = true;
        } else {
            // Gentle float
            this.vx *= 0.96; this.vy *= 0.96;
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
            if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;
        }
        
        // Mouse Interaction
        if (isMouseDown) {
            // Attract
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0) { this.vx += (dx / dist) * 0.5; this.vy += (dy / dist) * 0.5; }
        } else {
            // Repel
            const dx = mouseX - this.x; const dy = mouseY - this.y; 
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
               const force = (150 - dist) / 150; 
               const kick = force * mouseSpeed * 0.5;
               this.vx -= (dx/dist) * kick; 
               this.vy -= (dy/dist) * kick;
            }
        }
        this.x += this.vx; this.y += this.vy;
    }

    // Bounce off walls
    if (this.x + this.size > w + 200 || this.x - this.size < -200) this.vx = -this.vx;
    if (this.y + this.size > h + 200 || this.y - this.size < -200) this.vy = -this.vy;
    
    this.draw(ctx, activeCategory);
  }

  draw(ctx: CanvasRenderingContext2D, activeCategory: string | null) {
    let alpha = 1; 
    if (activeCategory && this.type !== activeCategory) alpha = 0.1;
    
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${this.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (this.type === 'future') { 
      ctx.strokeStyle = this.color; 
      ctx.lineWidth = 1; 
      ctx.strokeText(this.text, this.x, this.y); 
    } else { 
      ctx.fillStyle = this.color; 
      ctx.fillText(this.text, this.x, this.y); 
    }
    ctx.globalAlpha = 1;
  }
}

interface SkillsOverlayProps {
  activeFilter: string | null;
}

const SkillsOverlay: React.FC<SkillsOverlayProps> = ({ activeFilter }) => {
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

    const particles = SKILLS_DATA.map((s, i) => new SkillParticle(s, i, width, height));

    let animationId: number;
    let time = 0;
    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    let isMouseDown = false;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX; 
      mouseY = e.clientY;
      const dist = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
      mouseSpeed = dist; 
      lastMouseX = mouseX; 
      lastMouseY = mouseY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height); // Clear previous frame

      particles.forEach(p => {
        p.update(ctx, mouseX, mouseY, mouseSpeed, activeFilter, time, width, height, isMouseDown);
      });

      mouseSpeed *= 0.9; // Friction
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', () => isMouseDown = true);
      window.removeEventListener('mouseup', () => isMouseDown = false);
      cancelAnimationFrame(animationId);
    };
  }, [activeFilter]); // Re-run if filter changes, though internal logic handles it mostly dynamically

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-20 pointer-events-none" 
      style={{ pointerEvents: 'none' }} // Ensure clicks pass through to background if needed
    />
  );
};

export default SkillsOverlay;