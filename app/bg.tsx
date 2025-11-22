import React from 'react';

const COLORS = {
  frontend: '#22d3ee', // Cyan
  backend: '#34d399',  // Emerald
  creative: '#c084fc', // Purple
  future: '#ffffff'    // White
};

class Star {
  x: number; y: number; size: number; alpha: number; speed: number;
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 1.5;
    this.alpha = Math.random();
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

class Explosion {
  x: number; y: number; particles: any[]; dead: boolean;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.dead = false; this.particles = [];
    for(let i=0; i<20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3;
      this.particles.push({ x: 0, y: 0, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 1.0, color: Math.random()>0.5?'#f59e0b':'#ef4444' });
    }
  }
  update() {
    let alive = false;
    this.particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.life-=0.02; if(p.life>0) alive=true; });
    if(!alive) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    this.particles.forEach(p => { if(p.life>0) { ctx.globalAlpha=p.life; ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill(); } });
    ctx.restore();
  }
}

class Rocket {
  x: number; y: number; vx: number; vy: number; dead: boolean;
  constructor(canvasWidth: number, canvasHeight: number) {
    this.dead = false;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.x = Math.random() * canvasWidth; this.y = -50; }
    else if (side === 1) { this.x = canvasWidth + 50; this.y = Math.random() * canvasHeight; }
    else if (side === 2) { this.x = Math.random() * canvasWidth; this.y = canvasHeight + 50; }
    else { this.x = -50; this.y = Math.random() * canvasHeight; }
    const targetX = (canvasWidth/2) + (Math.random()-0.5)*canvasWidth;
    const targetY = (canvasHeight/2) + (Math.random()-0.5)*canvasHeight;
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const speed = 1 + Math.random() * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }
  update(isMouseDown: boolean, mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) {
    if (isMouseDown) {
       const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
       if (dist > 10) { this.vx += (dx/dist) * 0.5; this.vy += (dy/dist) * 0.5; }
    }
    this.x += this.vx; this.y += this.vy;
    if (this.x < -100 || this.x > canvasWidth + 100 || this.y < -100 || this.y > canvasHeight + 100) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(this.vy, this.vx));
    ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(-12, -2); ctx.lineTo(-20 - Math.random() * 5, 0); ctx.lineTo(-12, 2); ctx.fill();
    ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-8, 6); ctx.lineTo(2, 0); ctx.fill();
    ctx.restore();
  }
}

class SkillParticle {
  x: number; y: number; vx: number; vy: number; text: string; color: string; size: number; type: string; exploded: boolean; id: number;
  
  constructor(data: { text: string, type: string }, index: number, canvasWidth: number, canvasHeight: number) {
    this.id = index;
    this.x = canvasWidth / 2; this.y = canvasHeight / 2;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 4; 
    this.vx = Math.cos(angle) * velocity; this.vy = Math.sin(angle) * velocity;
    this.text = data.text;
    this.type = data.type;
    this.size = data.type === 'future' ? 12 : 14 + Math.random() * 6;
    this.exploded = false;
    
    if (this.type === 'frontend') this.color = COLORS.frontend;
    else if (this.type === 'backend') this.color = COLORS.backend;
    else if (this.type === 'creative') this.color = COLORS.creative;
    else this.color = COLORS.future;
  }

  update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, mouseSpeed: number, activeCategory: string | null, time: number, canvasWidth: number, canvasHeight: number, isMouseDown: boolean) {
    // --- VORTEX MODE (If category selected) ---
    if (activeCategory) {
       if (this.type === activeCategory) {
         // 1. Match: Spiral towards center
         const centerX = canvasWidth / 2;
         const centerY = canvasHeight / 2;
         
         // Orbit logic
         const angle = (time * 0.05) + (this.id * 0.5);
         const radius = 150 + Math.sin(time * 0.1 + this.id) * 30; // Pulsing radius
         
         const targetX = centerX + Math.cos(angle) * radius;
         const targetY = centerY + Math.sin(angle) * radius;
         
         // Ease towards orbit position
         this.x += (targetX - this.x) * 0.1;
         this.y += (targetY - this.y) * 0.1;
         
         // Glow up
         this.vx = 0; this.vy = 0; // Kill physics velocity
       } else {
         // 2. No Match: Drift away / Dim
         this.x += this.vx;
         this.y += this.vy;
         // Push slightly away from center
         const dx = this.x - canvasWidth/2;
         const dy = this.y - canvasHeight/2;
         this.vx += dx * 0.0005; 
         this.vy += dy * 0.0005;
       }
    } 
    // --- NORMAL MODE ---
    else {
        if (!this.exploded) {
           this.vx *= 0.99; this.vy *= 0.99;
           if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) this.exploded = true;
        } else {
            this.vx *= 0.96; this.vy *= 0.96;
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
            if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;
        }

        // Mouse Interaction
        if (isMouseDown) {
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
            this.vx += (dx / dist) * 0.5; this.vy += (dy / dist) * 0.5;
        } else {
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
               const force = (150 - dist) / 150; const kick = force * mouseSpeed * 0.5;
               this.vx -= (dx/dist) * kick; this.vy -= (dy/dist) * kick;
            }
        }

        this.x += this.vx; this.y += this.vy;
    }

    // Wall Bounce (loose bounds in vortex mode)
    if (this.x + this.size > canvasWidth+200 || this.x - this.size < -200) this.vx = -this.vx;
    if (this.y + this.size > canvasHeight+200 || this.y - this.size < -200) this.vy = -this.vy;

    this.draw(ctx, activeCategory);
  }

  draw(ctx: CanvasRenderingContext2D, activeCategory: string | null) {
    
    // Opacity Logic
    let alpha = 1;
    if (activeCategory && this.type !== activeCategory) alpha = 0.1; // Dim others
    
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${this.size}px monospace`;
    
    if (this.type === 'future') { 
      ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.strokeText(this.text, this.x, this.y); 
    } else { 
      ctx.fillStyle = this.color; ctx.fillText(this.text, this.x, this.y); 
    }
    ctx.globalAlpha = 1; // Reset
  }
}

const GravityBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // We use a Ref for the animation loop to read current state without re-renders
  const filterRef = React.useRef<string | null>(null);
  // We use State to update the UI buttons (highlighting the legend)
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  const handleFilterClick = (type: string) => {
    // Toggle: if clicking same type, reset to null (show all)
    const newValue = activeFilter === type ? null : type;
    setActiveFilter(newValue);
    filterRef.current = newValue;
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- DATA ---
    const allSkills = [
      { text: "React", type: "frontend" },
      { text: "Next.js", type: "frontend" },
      { text: "TypeScript", type: "frontend" },
      { text: "Tailwind", type: "frontend" },
      { text: "Redux", type: "frontend" },
      
      { text: "Node.js", type: "backend" },
      { text: "MongoDB", type: "backend" },
      { text: "Laravel", type: "backend" },
      { text: "SpringBoot", type: "backend" },
      { text: "Linux", type: "backend" },
      { text: "Docker", type: "backend" },
      { text: "Git", type: "backend" },
      { text: "Express", type: "backend" },
      
      { text: "Photoshop", type: "creative" },
      { text: "Lightroom", type: "creative" },
      { text: "UI/UX", type: "creative" },
      { text: "Figma", type: "creative" },
      { text: "PremierPro", type: "creative" },
      { text: "AfterEffects", type: "creative" },
      { text: "Illustrator", type: "creative" },


      { text: "Python", type: "future" },
      { text: "Nest.js", type: "future" },
      { text: "AWS", type: "future" },
      { text: "Rust", type: "future" },
      { text: "AI Integration", type: "future" },
      { text: "CyberSec", type: "future" },
    ];

    // --- STATE ---
    let particles: SkillParticle[] = [];
    let stars: Star[] = [];
    let rockets: Rocket[] = [];
    let explosions: Explosion[] = [];
    let animationFrameId: number;
    let planetRotation = 0;
    let isMouseDown = false;
    const ROCKET_COUNT = 5;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    resizeCanvas();

    // --- INIT ---
    const init = () => {
      particles = []; stars = []; rockets = []; explosions = [];
      for (let i = 0; i < 100; i++) stars.push(new Star(canvas.width, canvas.height));
      allSkills.forEach((skill, i) => particles.push(new SkillParticle(skill, i, canvas.width, canvas.height)));
      for (let i = 0; i < ROCKET_COUNT; i++) rockets.push(new Rocket(canvas.width, canvas.height));
    };

    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      const dist = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
      mouseSpeed = dist; lastMouseX = mouseX; lastMouseY = mouseY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Draw Statics (same as before)
    const drawSun = () => {
      const gradient = ctx.createRadialGradient(100, 100, 10, 100, 100, 150);
      gradient.addColorStop(0, 'rgba(253, 186, 116, 0.8)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(100, 100, 150, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff7ed'; ctx.beginPath(); ctx.arc(100, 100, 40, 0, Math.PI * 2); ctx.fill();
    };
    const drawSmallPlanet = () => {
      const px = canvas.width * 0.85, py = canvas.height * 0.2, r = 40;
      const grad = ctx.createRadialGradient(px-10, py-10, 5, px, py, r); grad.addColorStop(0, '#a5b4fc'); grad.addColorStop(1, '#4338ca');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(224, 231, 255, 0.4)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(px, py, r+15, 10, -Math.PI/4, 0, Math.PI*2); ctx.stroke();
    };
    const drawWireframePlanet = () => {
       const cx = canvas.width * 0.85, cy = canvas.height * 0.85, r = 250;
       ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'; ctx.lineWidth = 1;
       for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.4 * (i/5), planetRotation, 0, Math.PI * 2); ctx.stroke(); }
       for (let i = 0; i <= 6; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(r * Math.cos(i + planetRotation)), r, 0, 0, Math.PI * 2); ctx.stroke(); }
       planetRotation += 0.002;
    };

    const animate = () => {
      if (!ctx) return;
      time++;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#020617'); gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => { star.update(); star.draw(ctx); });
      ctx.lineWidth = 0.5; ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            if (Math.sqrt(Math.pow(stars[i].x-stars[j].x,2)+Math.pow(stars[i].y-stars[j].y,2)) < 100) { 
                ctx.beginPath(); ctx.moveTo(stars[i].x, stars[i].y); ctx.lineTo(stars[j].x, stars[j].y); ctx.stroke(); 
            }
        }
      }

      drawSun(); drawSmallPlanet(); drawWireframePlanet();

      if (rockets.length < ROCKET_COUNT && Math.random() < 0.05) rockets.push(new Rocket(canvas.width, canvas.height));
      rockets.forEach((r, i) => { r.update(isMouseDown, mouseX, mouseY, canvas.width, canvas.height); r.draw(ctx); if (r.dead) rockets.splice(i, 1); });
      for (let i=0;i<rockets.length;i++) {
        for (let j=i+1;j<rockets.length;j++) {
             const d = Math.sqrt(Math.pow(rockets[i].x-rockets[j].x,2)+Math.pow(rockets[i].y-rockets[j].y,2));
             if(d<30) { explosions.push(new Explosion((rockets[i].x+rockets[j].x)/2, (rockets[i].y+rockets[j].y)/2)); rockets[i].dead=true; rockets[j].dead=true; }
        }
      }
      explosions.forEach((ex, i) => { ex.update(); ex.draw(ctx); if(ex.dead) explosions.splice(i, 1); });

      particles.forEach(p => p.update(ctx, mouseX, mouseY, mouseSpeed, filterRef.current, time, canvas.width, canvas.height, isMouseDown));
      mouseSpeed *= 0.9;
      animationFrameId = requestAnimationFrame(animate);
    };

    init(); animate();
    return () => { window.removeEventListener('resize', resizeCanvas); window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animationFrameId); };
  }, []);

  // Helper to render clickable legend items
  const LegendItem = ({ color, label, type }: { color: string, label: string, type: string }) => {
    const isActive = activeFilter === type;
    const isInactive = activeFilter && activeFilter !== type;
    
    return (
      <div 
        onClick={() => handleFilterClick(type)}
        className={`
          flex items-center gap-2 cursor-pointer p-1.5 rounded transition-all duration-300
          ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5'}
          ${isInactive ? 'opacity-30 grayscale' : 'opacity-100'}
        `}
      >
        <div 
          className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${isActive ? 'animate-pulse shadow-[0_0_12px_currentColor]' : ''}`} 
          style={{ backgroundColor: color, color: color, boxShadow: isActive ? `0 0 12px ${color}` : 'none', border: type === 'future' ? '1px solid white' : 'none' }}
        ></div>
        <span className={`text-slate-300 font-medium ${isActive ? 'text-white' : ''}`}>{label}</span>
      </div>
    );
  };

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto" />
      
      {/* INTERACTIVE LEGEND (Bottom Right) */}
      <div className="fixed bottom-24 right-4 z-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs shadow-2xl transform transition-all hover:scale-105">
        <h4 className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-[10px] border-b border-white/10 pb-2">
          System Protocol
        </h4>
        <div className="space-y-1">
          <LegendItem color="#22d3ee" label="Frontend Core" type="frontend" />
          <LegendItem color="#34d399" label="Backend Systems" type="backend" />
          <LegendItem color="#c084fc" label="Creative Engine" type="creative" />
          <LegendItem color="transparent" label="Future Modules" type="future" />
        </div>
      </div>
    </>
  );
};
export default GravityBackground;