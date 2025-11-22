"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  User,
  Image as ImageIcon,
  X,
  Github,
  Linkedin,
  Mail,
  Wifi,
  Battery,
  Code,
  Cpu,
  Play,
  FileCode,
  Folder,
  ChevronRight,
  BrainCircuit,
  Coffee,
  TreePine,
  Tv,
  HeartHandshake,
  Smile,
  Gamepad2,
  RefreshCw,
  MapPin,
  Phone,
  ExternalLink,
  Maximize2,
  ArrowLeft
} from "lucide-react";

// ==========================================
// 1. UTILITY COMPONENTS & BACKGROUND
// ==========================================

const BehanceIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z" />
    <path d="M16 10h2" />
    <path d="M16 14c.5 0 1-.2 1-.5v-1c0-.8-.7-1.5-1.5-1.5h-1.5v3h1.5c.3 0 .5-.1.5-.5" />
    <path d="M6 14h1.5a1.5 1.5 0 0 0 0-3H6v3z" />
    <path d="M6 11h1.5a1.5 1.5 0 0 0 0-3H6v3z" />
  </svg>
);

const GravityBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filterRef = useRef<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (type: string) => {
    const newValue = activeFilter === type ? null : type;
    setActiveFilter(newValue);
    filterRef.current = newValue;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const allSkills = [
      { text: "React", type: "frontend" }, { text: "Next.js", type: "frontend" },
      { text: "TypeScript", type: "frontend" }, { text: "Tailwind", type: "frontend" },
      { text: "Node.js", type: "backend" }, { text: "MongoDB", type: "backend" },
      { text: "Linux", type: "backend" }, { text: "Docker", type: "backend" },
      { text: "Photoshop", type: "creative" }, { text: "Lightroom", type: "creative" },
      { text: "AWS", type: "future" }, { text: "Rust", type: "future" },
    ];

    let particles: any[] = [];
    let stars: any[] = [];
    let rockets: any[] = [];
    let explosions: any[] = [];
    let animationFrameId: number;
    let planetRotation = 0;
    let isMouseDown = false;
    let time = 0;
    const ROCKET_COUNT = 5;

    const COLORS: any = {
      frontend: '#22d3ee', backend: '#34d399', creative: '#c084fc', future: '#ffffff'
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    resizeCanvas();

    // Classes
    class Star {
      x: number; y: number; size: number; alpha: number; speed: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5;
        this.alpha = Math.random();
        this.speed = Math.random() * 0.05;
      }
      update() {
        this.alpha += this.speed;
        if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    class Rocket {
      x: number; y: number; vx: number; vy: number; dead: boolean;
      constructor() {
        this.dead = false;
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { this.x = Math.random() * canvas!.width; this.y = -50; }
        else if (side === 1) { this.x = canvas!.width + 50; this.y = Math.random() * canvas!.height; }
        else if (side === 2) { this.x = Math.random() * canvas!.width; this.y = canvas!.height + 50; }
        else { this.x = -50; this.y = Math.random() * canvas!.height; }
        const targetX = (canvas!.width/2) + (Math.random()-0.5)*canvas!.width;
        const targetY = (canvas!.height/2) + (Math.random()-0.5)*canvas!.height;
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        const speed = 1 + Math.random() * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
      }
      update() {
        if (isMouseDown) {
           const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
           if (dist > 10) { this.vx += (dx/dist) * 0.5; this.vy += (dy/dist) * 0.5; }
        }
        this.x += this.vx; this.y += this.vy;
        if (this.x < -100 || this.x > canvas!.width + 100 || this.y < -100 || this.y > canvas!.height + 100) this.dead = true;
      }
      draw() {
        if(!ctx) return;
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(this.vy, this.vx));
        ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(-12, -2); ctx.lineTo(-20 - Math.random() * 5, 0); ctx.lineTo(-12, 2); ctx.fill();
        ctx.restore();
      }
    }

    class SkillParticle {
      x: number; y: number; vx: number; vy: number; text: string; color: string; size: number; type: string; exploded: boolean; id: number;
      constructor(data: any, index: number) {
        this.id = index;
        this.x = canvas!.width / 2; this.y = canvas!.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4; 
        this.vx = Math.cos(angle) * velocity; this.vy = Math.sin(angle) * velocity;
        this.text = data.text;
        this.type = data.type;
        this.size = data.type === 'future' ? 12 : 14 + Math.random() * 6;
        this.exploded = false;
        this.color = COLORS[this.type];
      }
      update(mouseX: number, mouseY: number, mouseSpeed: number) {
        const activeCategory = filterRef.current;
        if (activeCategory && this.type === activeCategory) {
             const centerX = canvas!.width / 2;
             const centerY = canvas!.height / 2;
             const angle = (time * 0.05) + (this.id * 0.5);
             const radius = 150 + Math.sin(time * 0.1 + this.id) * 30;
             const targetX = centerX + Math.cos(angle) * radius;
             const targetY = centerY + Math.sin(angle) * radius;
             this.x += (targetX - this.x) * 0.1;
             this.y += (targetY - this.y) * 0.1;
        } else {
            if (!this.exploded) {
               this.vx *= 0.99; this.vy *= 0.99;
               if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) this.exploded = true;
            } else {
                this.vx *= 0.96; this.vy *= 0.96;
                if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
                if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;
            }
            if (isMouseDown) {
                const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
                this.vx += (dx / dist) * 0.5; this.vy += (dy / dist) * 0.5;
            }
            this.x += this.vx; this.y += this.vy;
        }
        if (this.x + this.size > canvas!.width+100 || this.x - this.size < -100) this.vx = -this.vx;
        if (this.y + this.size > canvas!.height+100 || this.y - this.size < -100) this.vy = -this.vy;
        this.draw();
      }
      draw() {
        if(!ctx) return;
        const activeCategory = filterRef.current;
        let alpha = (activeCategory && this.type !== activeCategory) ? 0.1 : 1;
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${this.size}px monospace`;
        if (this.type === 'future') { ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.strokeText(this.text, this.x, this.y); } 
        else { ctx.fillStyle = this.color; ctx.fillText(this.text, this.x, this.y); }
        ctx.globalAlpha = 1;
      }
    }

    const init = () => {
      particles = []; stars = []; rockets = []; explosions = [];
      for (let i = 0; i < 100; i++) stars.push(new Star());
      allSkills.forEach((skill, i) => particles.push(new SkillParticle(skill, i)));
      for (let i = 0; i < ROCKET_COUNT; i++) rockets.push(new Rocket());
    };

    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      const dist = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
      mouseSpeed = dist; lastMouseX = mouseX; lastMouseY = mouseY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawWireframePlanet = () => {
       if(!ctx) return;
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

      stars.forEach(star => { star.update(); star.draw(); });
      drawWireframePlanet();

      if (rockets.length < ROCKET_COUNT && Math.random() < 0.05) rockets.push(new Rocket());
      rockets.forEach((r, i) => { r.update(); r.draw(); if (r.dead) rockets.splice(i, 1); });
      particles.forEach(p => p.update(mouseX, mouseY, mouseSpeed));
      mouseSpeed *= 0.9;
      animationFrameId = requestAnimationFrame(animate);
    };

    init(); animate();
    return () => { 
      window.removeEventListener('resize', resizeCanvas); 
      window.removeEventListener('mousemove', handleMouseMove); 
      cancelAnimationFrame(animationFrameId); 
    };
  }, []);

  const LegendItem = ({ color, label, type }: any) => {
    const isActive = activeFilter === type;
    const isInactive = activeFilter && activeFilter !== type;
    return (
      <div 
        onClick={() => handleFilterClick(type)}
        className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition-all duration-300
          ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5'}
          ${isInactive ? 'opacity-30 grayscale' : 'opacity-100'}`}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: isActive ? `0 0 12px ${color}` : 'none' }}></div>
        <span className={`text-slate-300 font-medium ${isActive ? 'text-white' : ''}`}>{label}</span>
      </div>
    );
  };

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto" />
      <div className="fixed bottom-24 right-4 z-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs shadow-2xl transform transition-all hover:scale-105 hidden md:block">
        <h4 className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-[10px] border-b border-white/10 pb-2">System Protocol</h4>
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

// ==========================================
// 2. DATA & CONSTANTS
// ==========================================

const BOOT_SEQUENCE = [
  "Initializing SalimOS kernel...",
  "Loading React.js modules...",
  "Mounting file system...",
  "Starting UI/UX services...",
  "Access Granted.",
];

// Unified Projects Data
const PROJECTS = [
  {
    id: "fiesta",
    name: "Fiesta App",
    file: "fiesta.tsx",
    tag: "SaaS Ecosystem",
    tech: ["React", "TypeScript", "Node.js", "MongoDB", "Redux Toolkit"],
    desc: "A comprehensive SaaS solution for event venue management. Engineered a complex Role-Based Access Control (RBAC) system for multi-user environments. Features include real-time calendar synchronization, financial analytics dashboards, and an integrated partner marketplace.",
    status: "Production Ready",
    color: "text-blue-400",
  },
  {
    id: "cuisine",
    name: "Cuisine IQ",
    file: "cuisine_iq.jsx",
    tag: "Real-Time Platform",
    tech: ["React", "Express", "Socket.io", "QR API", "JWT"],
    desc: "Digitizing the dining experience with a contactless ordering system. Implemented WebSocket connections for sub-second synchronization between client devices and kitchen display systems (KDS).",
    status: "Live Beta",
    color: "text-orange-400",
  },
  {
    id: "tunisair",
    name: "Tunisair Recrute",
    file: "recruitment.jsx",
    tag: "Enterprise Portal",
    tech: ["MERN Stack", "Secure Uploads", "Admin Panel", "Data Filtering"],
    desc: "Official recruitment portal developed for the national airline. Streamlined the internship application process by digitizing workflows. Built a secure backend for handling sensitive candidate data.",
    status: "Enterprise",
    color: "text-red-500",
  },
  {
    id: "syrvis",
    name: "Syrvis",
    file: "marketplace.js",
    tag: "E-Commerce",
    tech: ["React", "Redux", "Payment Gateway", "REST API"],
    desc: "A fully functional marketplace for tech accessories. Implemented a custom shopping cart logic using Redux, secure user authentication, and product search filtering.",
    status: "Completed",
    color: "text-purple-400",
  },
];

// Gallery Data - FIX: Use leading slash for public files
const GALLERY_ITEMS = [
  {
    title: "Dar Kadra Unveiling Luxury",
    image: "/DarKadra.jpg",
    embedSrc: "https://www.behance.net/embed/project/220339077?ilo0=1"
  },
  {
    title: "Whispers of Love in Heritage Walls",
    image: "/Weeding.jpg",
    embedSrc: "https://www.behance.net/embed/project/225719867?ilo0=1"
  },
  {
    title: "Capturing the Essence of Asiatic Cuisine",
    image: "/LeBao.jpg",
    embedSrc: "https://www.behance.net/embed/project/220338231?ilo0=1"
  },
  {
    title: "Tunisian Princess",
    image: "/TunisianPrincess.jpg",
    embedSrc: "https://www.behance.net/embed/project/167700185?ilo0=1"
  },
  {
    title: "Roof Street Photoshoot",
    image: "/RoofStreet.jpg",
    embedSrc: "https://www.behance.net/embed/project/173225295?ilo0=1"
  },
  {
    title: "Opening Ceremony of the FMT Olympic Days",
    image: "/Ceremony.jpg",
    embedSrc: "https://www.behance.net/embed/project/165199847?ilo0=1"
  },
  {
    title: "Please Comfort Calm Nurture",
    image: "/Nurture.jpg",
    embedSrc: "https://www.behance.net/embed/project/161599243?ilo0=1"
  },
  {
    title: "Girl and Her Micro",
    image: "/GirlandHerMicro.jpg",
    embedSrc: "https://www.behance.net/embed/project/173227183?ilo0=1"
  },
  {
    title: "Unleash the Beast",
    image: "/UnleashTheBeast.jpg",
    embedSrc: "https://www.behance.net/embed/project/179283047?ilo0=1"
  }
];

// ==========================================
// 3. APP COMPONENTS
// ==========================================

const InterestsApp = () => {
  // FIX: Removed JSX from data array to solve Minified React Error #130
  const interests = [
    { title: "Social Work", Icon: HeartHandshake, color: "text-pink-400", desc: "Active Volunteer", stat: "Humanity First", col: "col-span-2" },
    { title: "Gaming", Icon: Gamepad2, color: "text-purple-400", desc: "Competitive & Story", stat: "Rank: High", col: "col-span-1" },
    { title: "Nature & Camping", Icon: TreePine, color: "text-green-400", desc: "System Recharge", stat: "Offline Mode", col: "col-span-1" },
    { title: "The Caffeine Engine", Icon: Coffee, color: "text-yellow-400", desc: "Fuel for Code", stat: "98% Intake", col: "col-span-2" },
    { title: "Anime & Manga", emoji: "⛩️", desc: "Cultural Database", stat: "Watching: One Piece", col: "col-span-1" },
    { title: "Cinematic Universe", Icon: Tv, color: "text-blue-400", desc: "Marvel / DC / Sci-Fi", stat: "Lore Expert", col: "col-span-1" },
    { title: "Psychology", Icon: BrainCircuit, color: "text-teal-400", desc: "Human Behavior", stat: "Analyzing...", col: "col-span-2" },
    { title: "Meme Logistics", Icon: Smile, color: "text-orange-400", desc: "Humor Distribution", stat: "Dank Certified", col: "col-span-2" },
  ];

  return (
    <div className="h-full bg-slate-950 p-6 overflow-auto custom-scrollbar">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-teal-500/10 rounded-xl"><BrainCircuit className="text-teal-400" size={32} /></div>
        <div><h2 className="text-2xl font-bold text-white">Neural_Dump</h2><p className="text-slate-400 text-sm">Personal Interests & Background Processes</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {interests.map((item: any, i) => (
          <div key={i} className={`${item.col} bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:bg-slate-800/80 transition-colors group hover:border-teal-500/30`}>
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:scale-110 transition-transform">
                {item.Icon ? <item.Icon className={item.color} size={24} /> : <span className="text-2xl">{item.emoji}</span>}
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider border border-slate-800 px-2 py-1 rounded-full">{item.stat}</span>
            </div>
            <h3 className="text-slate-200 font-bold mb-1">{item.title}</h3>
            <p className="text-slate-400 text-xs">{item.desc}</p>
            <div className="w-full h-1 bg-slate-800 mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500/50" style={{ width: `${Math.random() * 40 + 40}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" /><span className="text-blue-200 text-sm font-medium">AI Enthusiast Mode</span></div>
        <span className="text-xs text-blue-400 font-mono">RUNNING</span>
      </div>
    </div>
  );
};

const ReadmeApp = () => {
  return (
    <div className="h-full bg-[#1e1e1e] text-slate-300 p-6 md:p-10 font-mono overflow-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
        <h1 className="text-4xl font-bold text-white mb-8 border-b border-slate-700 pb-6 flex items-center gap-4">
          Hi there! <span className="animate-bounce inline-block">👋</span>
        </h1>
        <div className="space-y-8 text-lg leading-relaxed">
          <p>
            I write <span className="text-green-400">clean</span>, <span className="text-blue-400">reusable</span>, and <span className="text-yellow-400">documented</span> code. 
            I believe that great software is a combination of <span className="text-white font-bold">solid architecture</span> and <span className="text-white font-bold">intuitive design</span>.
          </p>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
            <div className="flex items-center gap-4"><span className="text-2xl">🔭</span> <span>I’m currently working on <strong className="text-blue-400">Fiesta App</strong></span></div>
            <div className="flex items-center gap-4"><span className="text-2xl">🌱</span> <span>I’m currently learning <strong className="text-green-400">AWS & Microservices</strong></span></div>
            <div className="flex items-center gap-4"><span className="text-2xl">⚡</span> <span>Fun fact: I used to be a <strong className="text-purple-400">professional photographer</strong>!</span></div>
          </div>
          <div className="pt-6"><p className="text-slate-500 text-sm">* This README.md is rendered directly from the SalimOS kernel.</p></div>
        </div>
      </div>
    </div>
  );
};

const InteractiveTerminal = ({ onOpenWindow }: { onOpenWindow: (id: string) => void }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([{ type: "output", content: "SalimOS Kernel v1.0.0 initialized..." }]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);
  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      const args = cmd.split(" ").slice(1);
      let output: any = null;
      if (cmd === 'help') output = "Available: about, neofetch, ls, open [app], clear";
      else if (cmd === 'about') output = "Salim May | Full Stack Dev";
      else if (cmd.startsWith('open')) {
         const app = args[0];
         if(['vscode','game','gallery','bio','interests','readme'].includes(app)) { output = `Opening ${app}...`; onOpenWindow(app); }
         else output = "App not found.";
      }
      else if (cmd === 'clear') { setHistory([]); setInput(""); return; }
      else output = `Command not found: ${cmd}`;
      setHistory([...history, { type: "command", content: input }, { type: "output", content: output }]);
      setInput("");
    }
  };
  return (
    <div className="h-full bg-[#1e1e1e] p-4 font-mono text-sm overflow-auto custom-scrollbar cursor-text" onClick={() => inputRef.current?.focus()}>
      <div className="space-y-2">
        {history.map((line, i) => (
          <div key={i} className={line.type === "command" ? "text-slate-300 mt-4" : "text-slate-400 ml-2"}>
            {line.type === "command" ? <span className="text-green-400">➜ ~ {line.content}</span> : line.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2 items-center">
        <span className="text-green-400">➜ ~</span>
        <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} className="bg-transparent border-none outline-none text-slate-200 flex-1" autoFocus />
      </div>
      <div ref={endRef} />
    </div>
  );
};

const VSCodeApp = () => {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]); 
  return (
    <div className="flex h-full text-sm font-mono bg-[#1e1e1e] text-slate-300">
      <div className="w-12 md:w-48 bg-[#252526] border-r border-[#333] flex flex-col">
        <div className="hidden md:block p-3 text-xs font-bold text-slate-500 tracking-wider">EXPLORER</div>
        <div className="px-1 md:px-2 pt-2">
          <div className="md:pl-3 space-y-1">
            {PROJECTS.map((p) => (
              <div key={p.id} onClick={() => setActiveProject(p)} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${activeProject.id === p.id ? "bg-[#37373d] text-white" : "hover:text-white"}`}>
                <FileCode size={16} className={p.file.endsWith("tsx") ? "text-blue-400" : "text-yellow-400"} />
                <span className="truncate hidden md:block">{p.file}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
        <div className="flex bg-[#252526] border-b border-[#333] px-4 py-2 text-white text-xs gap-2">
           <FileCode size={12} className="text-yellow-400" /> {activeProject.file}
        </div>
        <div className="flex-1 p-6 overflow-auto">
           <h1 className={`text-2xl font-bold mb-2 ${activeProject.color}`}>{activeProject.name}</h1>
           <div className="text-[#ce9178] whitespace-pre-wrap font-sans leading-relaxed">{activeProject.desc}</div>
           {activeProject.tech && (
             <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
               {activeProject.tech.map(t => <div key={t} className="bg-[#2d2d2d] p-2 rounded text-xs border border-[#3e3e42]">{t}</div>)}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const GalleryApp = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  return (
    <div className="h-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedProject ? (
            <button onClick={() => setSelectedProject(null)} className="p-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-bold">
              <ArrowLeft size={16}/> Back
            </button>
          ) : (
            <div className="p-2 bg-indigo-500/10 rounded-lg"><ImageIcon className="text-indigo-400" size={20} /></div>
          )}
          <h2 className="text-lg font-bold text-white">{selectedProject ? selectedProject.title : "Creative Gallery"}</h2>
        </div>
        <a href="https://www.behance.net/SalimMaytn" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-white flex items-center gap-1">Behance <ExternalLink size={12}/></a>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-slate-950">
        {selectedProject ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-xl overflow-hidden border border-slate-800 relative">
            <iframe src={selectedProject.embedSrc} height="100%" width="100%" allowFullScreen loading="lazy" frameBorder="0" className="w-full h-full"></iframe>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((cat, i) => (
              <div key={i} onClick={() => setSelectedProject(cat)} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 cursor-pointer bg-slate-900 shadow-lg hover:scale-[1.02] transition-all">
                <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => (e.target as HTMLImageElement).style.display='none'} />
                <div className="absolute inset-0 bg-slate-800 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white font-bold text-md mb-1">{cat.title}</h3>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={12} /> Open Project</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BioApp = () => (
  <div className="h-full bg-white text-slate-800 p-8 overflow-auto custom-scrollbar">
    <div className="flex flex-col items-center border-b border-slate-100 pb-6 mb-6">
      <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-xl overflow-hidden">
        <img src="/me.jpg" alt="Salim May" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Salim May</h2>
      <p className="text-blue-600 font-medium text-lg">Business Information Systems Graduate</p>
      <p className="text-slate-500 text-sm mt-1">Full Stack Developer • System Admin • UI/UX Enthusiast</p>
      <div className="flex gap-4 mt-6 justify-center">
        <a href="https://www.linkedin.com/in/salim-may-456a271a3/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded hover:bg-blue-50 text-blue-600"><Linkedin size={20} /></a>
        <a href="https://github.com/salimmay" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded hover:bg-slate-200 text-slate-900"><Github size={20} /></a>
        <a href="https://www.behance.net/SalimMaytn" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded hover:bg-blue-600 hover:text-white text-blue-700"><BehanceIcon size={20} /></a>
        <a href="mailto:maysalimp@gmail.com" className="p-2 bg-slate-100 rounded hover:bg-red-50 text-red-500"><Mail size={20} /></a>
      </div>
    </div>
    <div className="mb-8">
      <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2"><User size={18} className="text-blue-600" /> About Me</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        I am a developer who bridges the gap between <b>robust backend logic</b> and <b>pixel-perfect frontend design</b>. 
        Specializing in <b>TypeScript</b> and <b>Full Stack Architecture</b> to deliver secure, scalable, and high-performance web applications.
      </p>
    </div>
    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg">
      <h3 className="font-bold text-sm mb-4">Let's work together</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-3"><Mail size={16} className="text-blue-400" /> maysalimp@gmail.com</div>
        <div className="flex items-center gap-3"><MapPin size={16} className="text-blue-400" /> Manouba, Tunisia</div>
        <div className="flex items-center gap-3"><Phone size={16} className="text-blue-400" /> +216 27 004 058</div>
      </div>
    </div>
  </div>
);

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const boardSize = 20;

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize || prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true); return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          setFood({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
        } else newSnake.pop();
        return newSnake;
      });
    }, 150);
    return () => clearInterval(moveSnake);
  }, [gameStarted, gameOver, dir, food]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && dir.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && dir.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && dir.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && dir.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir]);

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="mb-4 text-center z-20">
        <h3 className="text-green-500 text-xl font-bold tracking-widest">SNAKE.EXE</h3>
        <div className="text-slate-400 text-sm mt-2">SCORE: <span className="text-white">{score}</span></div>
      </div>
      <div className="relative border-4 border-slate-700 bg-black/80 p-1 rounded-lg shadow-2xl z-20">
        <div className="grid bg-slate-900/50" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, width: "min(70vw, 400px)", height: "min(70vw, 400px)" }}>
          {Array.from({ length: boardSize * boardSize }).map((_, i) => {
            const x = i % boardSize; const y = Math.floor(i / boardSize);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return <div key={i} className={`${isSnake ? "bg-green-600/80" : isFood ? "bg-red-500 rounded-full" : "border-[0.5px] border-white/5"}`} />;
          })}
        </div>
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-30">
            <button onClick={() => { setSnake([{x:10,y:10}]); setGameOver(false); setScore(0); setGameStarted(true); }} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded">
              <Play size={18} /> {gameOver ? "RETRY" : "START"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN LAYOUT
// ==========================================

const TopBar = () => {
  const [time, setTime] = useState("");
  useEffect(() => { const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 text-xs font-medium text-white z-50 border-b border-white/5 select-none">
      <div className="flex items-center gap-4"><span className="font-bold text-blue-400">SalimOS</span></div>
      <div className="flex items-center gap-4"><Battery size={14} /> <Wifi size={14} /> <span>{time}</span></div>
    </div>
  );
};

const Window = ({ id, title, icon: Icon, children, onClose, isOpen, isActive, onClick, isMaximized = false }: any) => {
  if (!isOpen) return null;
  return (
    <motion.div
      drag={!isMaximized} dragMomentum={false}
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1, width: isMaximized ? "100vw" : "min(90vw, 800px)", height: isMaximized ? "calc(100vh - 32px)" : "600px", x: isMaximized?0:0, y: isMaximized?0:0, top: isMaximized?32:undefined, left: isMaximized?0:undefined }}
      onMouseDown={onClick}
      className={`absolute ${!isMaximized ? "top-10 md:top-20 md:left-24" : ""} bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden flex flex-col pointer-events-auto ${isActive ? "z-50 ring-1 ring-blue-500/50" : "z-40"}`}
    >
      <div className="h-9 bg-slate-800/80 flex items-center justify-between px-3 border-b border-slate-700/50 shrink-0 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div onClick={(e) => { e.stopPropagation(); onClose(id); }} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center justify-center group"><X size={8} className="opacity-0 group-hover:opacity-100 text-black" /></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono"><Icon size={12} /> <span>{title}</span></div>
        <div className="w-10" />
      </div>
      <div className="flex-1 overflow-hidden relative cursor-default">{children}</div>
    </motion.div>
  );
};

export default function SalimOS() {
  const [bootStep, setBootStep] = useState(0);
  const [booting, setBooting] = useState(true);
  const [windows, setWindows] = useState<any>({
    readme: { id: "readme", title: "README.md", icon: FileCode, isOpen: false, z: 1 },
    terminal: { id: "terminal", title: "Terminal", icon: Terminal, isOpen: false, z: 1 },
    vscode: { id: "vscode", title: "VS Code", icon: Code, isOpen: false, z: 2 },
    gallery: { id: "gallery", title: "Creative Gallery", icon: ImageIcon, isOpen: false, z: 1 },
    bio: { id: "bio", title: "Profile.pdf", icon: User, isOpen: true, z: 10 },
    game: { id: "game", title: "Snake.exe", icon: Gamepad2, isOpen: false, z: 1 },
    interests: { id: "interests", title: "Brain.exe", icon: BrainCircuit, isOpen: false, z: 1 },
  });

  useEffect(() => {
    if (bootStep < BOOT_SEQUENCE.length) { const t = setTimeout(() => setBootStep((p) => p + 1), 600); return () => clearTimeout(t); } 
    else { setTimeout(() => setBooting(false), 800); }
  }, [bootStep]);

  const toggleWindow = (id: string) => {
    setWindows((prev: any) => {
      const isOpen = !prev[id].isOpen;
      const maxZ = Math.max(...Object.values(prev).map((w: any) => w.z)) + 1;
      return { ...prev, [id]: { ...prev[id], isOpen, z: maxZ } };
    });
  };
  const focusWindow = (id: string) => {
    setWindows((prev: any) => {
      const maxZ = Math.max(...Object.values(prev).map((w: any) => w.z)) + 1;
      return { ...prev, [id]: { ...prev[id], z: maxZ } };
    });
  };

  if (booting) return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 flex flex-col justify-end z-[100]">
      {BOOT_SEQUENCE.slice(0, bootStep).map((txt, i) => <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-1">{`> ${txt}`}</motion.div>)}
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden font-sans select-none bg-slate-950">
      <GravityBackground />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <TopBar />

      <div className="absolute top-12 left-4 flex flex-col gap-6 z-10">
        <DesktopIcon icon={User} label="Profile" onClick={() => toggleWindow("bio")} color="bg-purple-600" />
        <DesktopIcon icon={FileCode} label="README.md" onClick={() => toggleWindow("readme")} color="bg-slate-500" />
        <DesktopIcon icon={BrainCircuit} label="Brain.exe" onClick={() => toggleWindow("interests")} color="bg-teal-600" />
        <DesktopIcon icon={Code} label="VS Code" onClick={() => toggleWindow("vscode")} color="bg-blue-600" />
        <DesktopIcon icon={ImageIcon} label="Gallery" onClick={() => toggleWindow("gallery")} color="bg-indigo-600" />
        <DesktopIcon icon={Gamepad2} label="DevBreak" onClick={() => toggleWindow("game")} color="bg-emerald-600" />
        <DesktopIcon icon={Terminal} label="Terminal" onClick={() => toggleWindow("terminal")} color="bg-slate-800" />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {Object.values(windows).map((win: any) => (
            <Window key={win.id} {...win} onClose={() => toggleWindow(win.id)} onClick={() => focusWindow(win.id)} isActive={win.z === Math.max(...Object.values(windows).filter((w: any) => w.isOpen).map((w: any) => w.z))}>
              {win.id === "readme" && <ReadmeApp />}
              {win.id === "vscode" && <VSCodeApp />}
              {win.id === "terminal" && <InteractiveTerminal onOpenWindow={(id) => { if (!windows[id].isOpen) toggleWindow(id); focusWindow(id); }} />}
              {win.id === "gallery" && <GalleryApp />}
              {win.id === "bio" && <BioApp />}
              {win.id === "game" && <SnakeGame />}
              {win.id === "interests" && <InterestsApp />}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-3 shadow-2xl z-50">
        <DockIcon icon={User} isOpen={windows.bio.isOpen} onClick={() => toggleWindow("bio")} />
        <DockIcon icon={FileCode} isOpen={windows.readme.isOpen} onClick={() => toggleWindow("readme")} />
        <DockIcon icon={BrainCircuit} isOpen={windows.interests.isOpen} onClick={() => toggleWindow("interests")} />
        <DockIcon icon={Code} isOpen={windows.vscode.isOpen} onClick={() => toggleWindow("vscode")} />
        <DockIcon icon={ImageIcon} isOpen={windows.gallery.isOpen} onClick={() => toggleWindow("gallery")} />
        <DockIcon icon={Gamepad2} isOpen={windows.game.isOpen} onClick={() => toggleWindow("game")} />
        <DockIcon icon={Terminal} isOpen={windows.terminal.isOpen} onClick={() => toggleWindow("terminal")} />
        <div className="w-px h-8 bg-white/20 mx-1" />
        <a href="mailto:maysalimp@gmail.com" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-500 transition-colors text-white"><Mail size={20} /></a>
      </div>
    </div>
  );
}

const DesktopIcon = ({ icon: Icon, label, onClick, color }: any) => (
  <button onClick={onClick} className="group flex flex-col items-center gap-1 w-20 cursor-pointer">
    <div className={`w-12 h-12 ${color} rounded-xl shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}><Icon size={24} /></div>
    <span className="text-white text-xs font-medium drop-shadow-md bg-black/40 px-2 rounded-full border border-white/10">{label}</span>
  </button>
);
const DockIcon = ({ icon: Icon, isOpen, onClick }: any) => (
  <button onClick={onClick} className="relative p-2.5 bg-slate-800/80 rounded-lg hover:bg-slate-700 hover:-translate-y-2 transition-all">
    <Icon className="text-white" size={24} /> {isOpen && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />}
  </button>
);