"use client";

import React, { useState, useEffect } from "react";
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
  Server,
  Database,
  Cpu,
  Play,
  FileCode,
  Folder,
  ChevronRight,
  Layout,
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
} from "lucide-react"; 
import GravityBackground from "./bg";

// --- DATA ---
const BehanceIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z" />{" "}
    {/* Outer Box */}
    <path d="M16 10h2" /> {/* The little dash in 'e' */}
    <path d="M16 14c.5 0 1-.2 1-.5v-1c0-.8-.7-1.5-1.5-1.5h-1.5v3h1.5c.3 0 .5-.1.5-.5" />{" "}
    {/* The 'e' loop */}
    <path d="M6 14h1.5a1.5 1.5 0 0 0 0-3H6v3z" /> {/* Bottom loop of 'B' */}
    <path d="M6 11h1.5a1.5 1.5 0 0 0 0-3H6v3z" /> {/* Top loop of 'B' */}
  </svg>
);
const BOOT_SEQUENCE = [
  "Initializing SalimOS kernel...",
  "Loading React.js modules...",
  "Mounting file system...",
  "Starting UI/UX services...",
  "Access Granted.",
];
const InterestsApp = () => {
  const interests = [
    {
      title: "Social Work",
      icon: <HeartHandshake className="text-pink-400" size={24} />,
      desc: "Active Volunteer",
      stat: "Humanity First",
      col: "col-span-2",
    },
    {
      title: "Gaming",
      icon: <Gamepad2 className="text-purple-400" size={24} />,
      desc: "Competitive & Story",
      stat: "Rank: High",
      col: "col-span-1",
    },
    {
      title: "Nature & Camping",
      icon: <TreePine className="text-green-400" size={24} />,
      desc: "System Recharge",
      stat: "Offline Mode",
      col: "col-span-1",
    },
    {
      title: "The Caffeine Engine",
      icon: <Coffee className="text-yellow-400" size={24} />,
      desc: "Fuel for Code",
      stat: "98% Intake",
      col: "col-span-2",
    },
    {
      title: "Anime & Manga",
      icon: <span className="text-2xl">⛩️</span>,
      desc: "Cultural Database",
      stat: "Watching: One Piece",
      col: "col-span-1",
    },
    {
      title: "Cinematic Universe",
      icon: <Tv className="text-blue-400" size={24} />,
      desc: "Marvel / DC / Sci-Fi",
      stat: "Lore Expert",
      col: "col-span-1",
    },
    {
      title: "Psychology",
      icon: <BrainCircuit className="text-teal-400" size={24} />,
      desc: "Human Behavior",
      stat: "Analyzing...",
      col: "col-span-2",
    },
    {
      title: "Meme Logistics",
      icon: <Smile className="text-orange-400" size={24} />,
      desc: "Humor Distribution",
      stat: "Dank Certified",
      col: "col-span-2",
    },
  ];

  return (
    <div className="h-full bg-slate-950 p-6 overflow-auto custom-scrollbar">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-teal-500/10 rounded-xl">
          <BrainCircuit className="text-teal-400" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Neural_Dump</h2>
          <p className="text-slate-400 text-sm">
            Personal Interests & Background Processes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {interests.map((item, i) => (
          <div
            key={i}
            className={`${item.col} bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:bg-slate-800/80 transition-colors group hover:border-teal-500/30`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider border border-slate-800 px-2 py-1 rounded-full">
                {item.stat}
              </span>
            </div>
            <h3 className="text-slate-200 font-bold mb-1">{item.title}</h3>
            <p className="text-slate-400 text-xs">{item.desc}</p>

            {/* Little "Process Bar" visual */}
            <div className="w-full h-1 bg-slate-800 mt-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500/50"
                style={{ width: `${Math.random() * 40 + 40}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Badge */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-200 text-sm font-medium">
            AI Enthusiast Mode
          </span>
        </div>
        <span className="text-xs text-blue-400 font-mono">RUNNING</span>
      </div>
    </div>
  );
};
const EXPERIENCE = [
  {
    company: "Tunisiair",
    role: "Full Stack Engineer Intern",
    time: "02/24 - 05/24",
    cmd: "Developed 'Tunisair Recrute' portal. Reduced application processing time by 40% via digital workflows.",
  },
  {
    company: "Terkina",
    role: "Creative Lead & Editor",
    time: "05/22 - 08/25",
    cmd: "Managed visual delivery for high-volume campaigns (2000+ assets). Streamlined post-production workflows.",
  },
  {
    company: "NextWave",
    role: "Brand Ambassador",
    time: "07/22 - 02/23",
    cmd: "Executed data-driven sales strategies. Analyzed consumer feedback to improve product positioning.",
  },
];

const PROJECTS = [
  {
    id: "fiesta",
    name: "Fiesta App",
    file: "fiesta.tsx",
    tag: "SaaS Ecosystem",
    tech: ["React", "TypeScript", "Node.js", "MongoDB", "Redux Toolkit"],
    desc: "A comprehensive SaaS solution for event venue management. Engineered a complex Role-Based Access Control (RBAC) system for multi-user environments. Features include real-time calendar synchronization, financial analytics dashboards, and an integrated partner marketplace. Migrated codebase from JSX to TypeScript to improve type safety and maintainability.",
    status: "Production Ready",
    color: "text-blue-400",
  },
  {
    id: "cuisine",
    name: "Cuisine IQ",
    file: "cuisine_iq.jsx",
    tag: "Real-Time Platform",
    tech: ["React", "Express", "Socket.io", "QR API", "JWT"],
    desc: "Digitizing the dining experience with a contactless ordering system. Implemented WebSocket connections for sub-second synchronization between client devices and kitchen display systems (KDS). Features dynamic QR code generation per table and a responsive admin panel for menu and inventory management.",
    status: "Live Beta",
    color: "text-orange-400",
  },
  {
    id: "tunisair",
    name: "Tunisair Recrute",
    file: "recruitment.jsx",
    tag: "Enterprise Portal",
    tech: ["MERN Stack", "Secure Uploads", "Admin Panel", "Data Filtering"],
    desc: "Official recruitment portal developed for the national airline. Streamlined the internship application process by digitizing workflows. Built a secure backend for handling sensitive candidate data and file uploads. Designed an intuitive dashboard for HR staff to filter, track, and manage thousands of applications efficiently.",
    status: "Enterprise",
    color: "text-red-500",
  },
  {
    id: "syrvis",
    name: "Syrvis",
    file: "marketplace.js",
    tag: "E-Commerce",
    tech: ["React", "State Management", "Payment Gateway", "REST API"],
    desc: "A fully functional marketplace for tech accessories. Implemented a custom shopping cart logic using Redux, secure user authentication, and product search filtering. Focused heavily on performance optimization (Lazy loading, image optimization) to ensure high Google Lighthouse scores.",
    status: "Completed",
    color: "text-purple-400",
  },
];

// --- COMPONENTS ---

const TopBar = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
      1000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 text-xs font-medium text-white z-50 border-b border-white/5 select-none">
      <div className="flex items-center gap-4">
        <span className="font-bold text-blue-400">SalimOS</span>
        <span className="hidden md:inline opacity-80 hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">
          File
        </span>
        <span className="hidden md:inline opacity-80 hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">
          Edit
        </span>
        <span className="hidden md:inline opacity-80 hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">
          View
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Battery size={14} /> <Wifi size={14} /> <span>{time}</span>
      </div>
    </div>
  );
};

// Draggable Window
const Window = ({
  id,
  title,
  icon: Icon,
  children,
  onClose,
  isOpen,
  isActive,
  onClick,
  isMaximized = false,
}: any) => {
  if (!isOpen) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragMomentum={false}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        width: isMaximized ? "100vw" : "min(90vw, 800px)",
        height: isMaximized ? "calc(100vh - 32px)" : "600px",
        x: isMaximized ? 0 : 0,
        y: isMaximized ? 0 : 0,
        top: isMaximized ? 32 : undefined,
        left: isMaximized ? 0 : undefined,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      onMouseDown={onClick}
      // pointer-events-auto is CRITICAL here so the window captures clicks,
      // but the container doesn't block the desktop icons
      className={`absolute ${
        !isMaximized ? "top-10 md:top-20 md:left-24" : ""
      } bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden flex flex-col pointer-events-auto ${
        isActive ? "z-50 ring-1 ring-blue-500/50" : "z-40"
      }`}
    >
      <div className="h-9 bg-slate-800/80 flex items-center justify-between px-3 border-b border-slate-700/50 shrink-0 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center justify-center group"
          >
            <X
              size={8}
              className="opacity-0 group-hover:opacity-100 text-black"
            />
          </div>
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <Icon size={12} /> <span>{title}</span>
        </div>
        <div className="w-10" />
      </div>
      <div className="flex-1 overflow-hidden relative cursor-default">
        {children}
      </div>
    </motion.div>
  );
};

// --- APPS ---

const InteractiveTerminal = ({
  onOpenWindow,
}: {
  onOpenWindow: (id: string) => void;
}) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([
    { type: "output", content: "SalimOS Kernel v1.0.0 initialized..." },
    { type: "output", content: "Type 'help' to see available commands." },
  ]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input when clicking anywhere in terminal
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      const args = cmd.split(" ").slice(1);
      const baseCmd = cmd.split(" ")[0];

      // Add command to history
      const newHistory = [...history, { type: "command", content: input }];
      let output: any = null;

      switch (baseCmd) {
        case "help":
          output = (
            <div className="space-y-1 text-slate-300">
              <div>Available commands:</div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-yellow-400">about</span>{" "}
                <span>Who is Salim?</span>
                <span className="text-yellow-400">neofetch</span>{" "}
                <span>System Information</span>
                <span className="text-yellow-400">ls</span>{" "}
                <span>List projects</span>
                <span className="text-yellow-400">open</span>{" "}
                <span>Open app (e.g., 'open game')</span>
                <span className="text-yellow-400">clear</span>{" "}
                <span>Clear terminal</span>
                <span className="text-yellow-400">sudo</span>{" "}
                <span>Admin privileges</span>
              </div>
            </div>
          );
          break;

        case "whoami":
        case "about":
          output = "Salim May | Full Stack Developer | System Admin | Creative";
          break;

        case "ls":
        case "ll":
          output = (
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <span className="text-blue-400">fiesta_app.tsx</span>
              <span className="text-orange-400">cuisine_iq.jsx</span>
              <span className="text-red-400">tunisair_portal.js</span>
              <span className="text-purple-400">syrvis_market.js</span>
            </div>
          );
          break;

        case "neofetch":
          output = (
            <div className="flex gap-4 text-xs md:text-sm font-mono mt-2">
              <div className="text-blue-500 hidden sm:block">
                {`
       .---.
      /     \\
      |  SM |
      \\     /
       '---'
                `}
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-blue-400">salim</span>@
                  <span className="text-blue-400">macbook-pro</span>
                </div>
                <div>-------------------</div>
                <div>
                  <span className="text-yellow-400">OS</span>: SalimOS v1.0
                  (Web)
                </div>
                <div>
                  <span className="text-yellow-400">Host</span>: Vercel Edge
                  Network
                </div>
                <div>
                  <span className="text-yellow-400">Kernel</span>: React 18.2.0
                </div>
                <div>
                  <span className="text-yellow-400">Uptime</span>: Forever
                </div>
                <div>
                  <span className="text-yellow-400">Packages</span>: 24 (npm)
                </div>
                <div>
                  <span className="text-yellow-400">Shell</span>: zsh 5.8
                </div>
                <div>
                  <span className="text-yellow-400">Resolution</span>: 1920x1080
                </div>
                <div>
                  <span className="text-yellow-400">Theme</span>: Dark Mode
                  (Dracula)
                </div>
              </div>
            </div>
          );
          break;

        case "open":
          if (args.length === 0) {
            output = "Usage: open [vscode | game | gallery | bio]";
          } else {
            const appName = args[0];
            if (["vscode", "game", "gallery", "bio"].includes(appName)) {
              output = `Launching ${appName}...`;
              onOpenWindow(appName); // Trigger window open
            } else {
              output = `Error: App '${appName}' not found.`;
            }
          }
          break;

        case "sudo":
          output = (
            <span className="text-red-500 font-bold">
              Permission denied: You are not Salim May.
            </span>
          );
          break;

        case "clear":
          setHistory([]);
          setInput("");
          return;

        case "":
          output = null;
          break;

        default:
          output = `command not found: ${baseCmd}`;
      }

      if (output) {
        newHistory.push({ type: "output", content: output });
      }

      setHistory(newHistory);
      setInput("");
    }
  };

  return (
    <div
      className="h-full bg-[#1e1e1e] p-4 font-mono text-sm overflow-auto custom-scrollbar cursor-text"
      onClick={handleContainerClick}
    >
      <div className="space-y-2">
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "command"
                ? "text-slate-300 mt-4"
                : "text-slate-400 ml-2"
            }
          >
            {line.type === "command" ? (
              <div className="flex gap-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <span>{line.content}</span>
              </div>
            ) : (
              <div>{line.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Active Input Line */}
      <div className="flex gap-2 mt-2 items-center">
        <span className="text-green-400">➜</span>
        <span className="text-blue-400">~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none text-slate-200 flex-1 font-mono"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <div ref={endRef} />
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
            <div className="flex items-center gap-4">
              <span className="text-2xl">🔭</span> 
              <span>I’m currently working on <strong className="text-blue-400">Fiesta App</strong></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">🌱</span> 
              <span>I’m currently learning <strong className="text-green-400">AWS & Microservices</strong></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">⚡</span> 
              <span>Fun fact: I used to be a <strong className="text-purple-400">professional photographer</strong>!</span>
            </div>
          </div>

          <div className="pt-6">
             <p className="text-slate-500 text-sm">
               * This README.md is rendered directly from the SalimOS kernel.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VSCodeApp = () => {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);

  return (
    <div className="flex h-full text-sm font-mono bg-[#1e1e1e] text-slate-300">
      <div className="w-12 md:w-48 bg-[#252526] border-r border-[#333] flex flex-col">
        <div className="hidden md:block p-3 text-xs font-bold text-slate-500 tracking-wider">
          EXPLORER
        </div>
        <div className="px-1 md:px-2 pt-2">
          <div className="hidden md:flex items-center gap-1 text-blue-400 mb-2 font-bold">
            <ChevronRight size={12} className="rotate-90" /> PORTFOLIO
          </div>
          <div className="md:pl-3 space-y-1">
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveProject(p)}
                className={`flex items-center justify-center md:justify-start gap-2 p-1.5 rounded cursor-pointer ${
                  activeProject.id === p.id
                    ? "bg-[#37373d] text-white"
                    : "hover:text-white"
                }`}
              >
                <FileCode
                  size={16}
                  className={
                    p.file.endsWith("tsx") ? "text-blue-400" : "text-yellow-400"
                  }
                />
                <span className="truncate hidden md:block">{p.file}</span>
              </div>
            ))}
            <div className="flex items-center justify-center md:justify-start gap-2 p-1.5 text-slate-500 mt-2 opacity-50 cursor-not-allowed">
              <Folder size={16} />{" "}
              <span className="hidden md:block">legacy_photos</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-4 flex flex-col bg-[#1e1e1e]">
        <div className="flex bg-[#252526] border-b border-[#333] overflow-x-auto">
          <div className="px-4 py-2 bg-[#1e1e1e] border-t-2 border-blue-500 text-white flex items-center gap-2 text-xs min-w-fit">
            <FileCode
              size={12}
              className={
                activeProject.file.endsWith("tsx")
                  ? "text-blue-400"
                  : "text-yellow-400"
              }
            />
            {activeProject.file}
            <X
              size={12}
              className="ml-2 hover:bg-slate-700 rounded cursor-pointer"
            />
          </div>
        </div>
        <div className="flex-1 p-6 overflow-auto relative">
          <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-[#333] text-[#858585] text-right pr-3 pt-6 select-none hidden md:block">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="md:pl-6">
            <h1 className={`text-2xl font-bold mb-2 ${activeProject.color}`}>
              {activeProject.name}
            </h1>
            <p className="text-[#ce9178] mb-4">"{activeProject.desc}"</p>
            <div className="grid grid-cols-2 gap-2 mb-6 max-w-md">
              {activeProject.tech.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-xs bg-[#2d2d2d] p-2 rounded border border-[#3e3e42]"
                >
                  {t.includes("React") ? (
                    <Cpu size={12} className="text-blue-400" />
                  ) : (
                    <Code size={12} />
                  )}{" "}
                  {t}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs transition-colors">
                <Play size={12} /> Run Demo
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeProject.status.includes("Live") ||
                    activeProject.status.includes("Ready")
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />
                {activeProject.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const GalleryApp = () => {
  // --- DATA: Update links and images here ---
  const CATEGORIES = [
    {
      title: "Dar Kadra Unveiling Luxury",
      image: "DarKadra.jpg", // Replace with your specific cover
      link: "https://www.behance.net/gallery/220339077/Dar-Kadra-Unveiling-Luxury" // Replace with your Real Estate Project Link
    },
    {
      title: "Whispers of Love in Heritage Walls",
      image: "Weeding.jpg",
      link: "https://www.behance.net/gallery/225719867/Whispers-of-Love-in-Heritage-Walls" // Your specific link
    },
    {
      title: "Capturing the Essence of Asiatic Cuisine",
      image: "LeBao.jpg",
      link: "https://www.behance.net/gallery/220338231/Le-Bao-Capturing-the-Essence-of-Asiatic-Cuisine"
    },
    {
      title: "Tunisian Princess",
      image: "TunisianPrincess.jpg",
      link: "https://www.behance.net/gallery/167700185/Tunisian-Princess"
    },
    {
      title: "Roof Street Photoshoot",
      image: "RoofStreet.jpg",
      link: "https://www.behance.net/gallery/173225295/Roof-Street-Photoshoot"
    },
        {
      title: "Opening Ceremony of the FMT Olympic Days",
      image: "Ceremony.jpg",
      link: "https://www.behance.net/gallery/165199847/Cremonie-douverture-des-Journes-Olympiques-de-la-FMT-Street-Photoshoot"
    },
        {
      title: "Please Comfort Calm Nurture and Power",
      image: "Nurture.jpg",
      link: "https://www.behance.net/gallery/161599243/Please-Comfort-Calm-Nurture-and-Power"
    },
    {
      title: "Girl and Her Micro",
      image: "GirlandHerMicro.jpg",
      link: "https://www.behance.net/gallery/173227183/A-Girl-and-Her-Micro-in-the-charming-Streets-of-Tunisia"
    },
    {
      title: "Unleash the Beast: Sculpted by Iron, Forged in Sweat",
      image: "UnleashTheBeast.jpg",
      link: "https://www.behance.net/gallery/179283047/Unleash-the-Beast-Sculpted-by-Iron-Forged-in-Sweat"
    }
  ];

  return (
    <div className="h-full bg-slate-950 p-6 overflow-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <ImageIcon className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Creative Studio</h2>
            <p className="text-slate-400 text-sm">Selected Works & Retouching</p>
          </div>
        </div>
        <a 
          href="https://www.behance.net/SalimMaytn" 
          target="SalimMay"
          rel="noopener noreferrer"
          className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          Visit Behance Profile <ExternalLink size={12}/>
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <a 
            key={i} 
            href={cat.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 cursor-pointer bg-slate-900"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${cat.image}')` }}
            />
            
            {/* Dark Overlay (Fades out on hover) */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-300" />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                {cat.title}
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
              </h3>
              <div className="w-full h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <p className="text-slate-300 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                View Project on Behance
              </p>
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-xs">
          All photography & retouching works are copyright © Salim May.
        </p>
      </div>
    </div>
  );
};

const BioApp = () => (
  <div className="h-full bg-white text-slate-800 p-8 overflow-auto custom-scrollbar">
    {/* Header */}
    <div className="flex flex-col items-center border-b border-slate-100 pb-6 mb-6">
      <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-xl">
        <img src="me.jpg" alt="Salim May" className="w-full h-full object-cover rounded-full" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Salim May</h2>
      <p className="text-blue-600 font-medium text-lg">
        Business Information Systems Graduate
      </p>
      <p className="text-slate-500 text-sm mt-1">
        Full Stack Developer • System Admin • UI/UX Enthusiast
      </p>
      {/* SOCIAL LINKS ROW */}
      <div className="flex gap-4 mt-6 justify-center">
        <a
          href="https://www.linkedin.com/in/salim-may-456a271a3/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-slate-100 rounded hover:bg-blue-50 text-blue-600 transition-colors"
          title="LinkedIn"
        >
          <Linkedin size={20} />
        </a>

        <a
          href="https://github.com/salimmay"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-slate-100 rounded hover:bg-slate-200 text-slate-900 transition-colors"
          title="GitHub"
        >
          <Github size={20} />
        </a>

        {/* NEW: BEHANCE LINK */}
        <a
          href="https://www.behance.net/SalimMaytn"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-slate-100 rounded hover:bg-blue-600 hover:text-white text-blue-700 transition-colors group"
          title="Behance Portfolio"
        >
          <BehanceIcon size={20} />
        </a>

        <a
          href="mailto:maysalimp@gmail.com"
          className="p-2 bg-slate-100 rounded hover:bg-red-50 text-red-500 transition-colors"
          title="Send Email"
        >
          <Mail size={20} />
        </a>
      </div>
    </div>

    {/* About Section */}
    <div className="mb-8">
      <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
        <User size={18} className="text-blue-600" /> About Me
      </h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        I am a developer who bridges the gap between <b>robust backend logic</b>{" "}
        and <b>pixel-perfect frontend design</b>. With a strong foundation in
        System Administration (Linux, Docker) and a creative background in
        professional photography, I build applications that are not only stable
        and scalable but also visually engaging.
        <br />
        <br />
        {/* UPDATED SENTENCE HERE: */}
        Specializing in <b>TypeScript</b> and <b>Full Stack Architecture</b> to
        deliver secure, scalable, and high-performance web applications.
      </p>
    </div>

    {/* Hard Skills Grid */}
    <div className="mb-8">
      <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
        <Code size={18} className="text-blue-600" /> Technical Stack
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Frontend
          </span>
          <span className="text-sm font-medium text-slate-700">
            React.js, Next.js, Tailwind, Redux
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Backend
          </span>
          <span className="text-sm font-medium text-slate-700">
            Node.js, Express, Spring Boot, PHP
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Database
          </span>
          <span className="text-sm font-medium text-slate-700">
            MongoDB, MySQL, PostgreSQL
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
            DevOps
          </span>
          <span className="text-sm font-medium text-slate-700">
            Linux, Docker, Git, Agile/Scrum
          </span>
        </div>
      </div>
    </div>

    {/* Contact Footer */}
    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg">
      <h3 className="font-bold text-sm mb-4">Let's work together</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <Mail size={16} className="text-blue-400" /> maysalimp@gmail.com
        </div>
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <MapPin size={16} className="text-blue-400" /> Manouba, Tunisia
        </div>
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <Phone size={16} className="text-blue-400" /> +216 27 004 058
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const gridSize = 20;
  const boardSize = 20; // 20x20 grid

  // Game Loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        // Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= boardSize ||
          newHead.y < 0 ||
          newHead.y >= boardSize
        ) {
          setGameOver(true);
          return prev;
        }
        // Self Collision
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat Food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          setFood({
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
          });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(moveSnake);
  }, [gameStarted, gameOver, dir, food]);

  // Controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (dir.y === 0) setDir({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (dir.y === 0) setDir({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (dir.x === 0) setDir({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (dir.x === 0) setDir({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    if (score > highScore) setHighScore(score);
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>

      <div className="mb-4 text-center z-20">
        <h3 className="text-green-500 text-xl font-bold tracking-widest">
          SNAKE.EXE
        </h3>
        <div className="flex gap-6 text-sm mt-2">
          <span className="text-slate-400">
            SCORE: <span className="text-white">{score}</span>
          </span>
          <span className="text-slate-400">
            HI-SCORE:{" "}
            <span className="text-yellow-400">
              {Math.max(score, highScore)}
            </span>
          </span>
        </div>
      </div>

      <div className="relative border-4 border-slate-700 bg-black/80 p-1 rounded-lg shadow-2xl z-20">
        {/* Game Board */}
        <div
          className="grid bg-slate-900/50"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            width: "min(70vw, 400px)",
            height: "min(70vw, 400px)",
          }}
        >
          {Array.from({ length: boardSize * boardSize }).map((_, i) => {
            const x = i % boardSize;
            const y = Math.floor(i / boardSize);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            const isHead = snake[0].x === x && snake[0].y === y;

            return (
              <div
                key={i}
                className={`
                ${
                  isHead
                    ? "bg-green-400 rounded-sm"
                    : isSnake
                    ? "bg-green-600/80 rounded-sm scale-95"
                    : isFood
                    ? "bg-red-500 rounded-full scale-75 animate-pulse"
                    : "border-[0.5px] border-white/5"
                }
              `}
              />
            );
          })}
        </div>

        {/* Overlay Screens */}
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center backdrop-blur-sm z-30">
            {gameOver && (
              <div className="text-red-500 font-bold text-2xl mb-2">
                GAME OVER
              </div>
            )}
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition-all hover:scale-105"
            >
              {gameOver ? (
                <>
                  <RefreshCw size={18} /> RETRY
                </>
              ) : (
                <>
                  <Play size={18} /> START SYSTEM
                </>
              )}
            </button>
            <p className="text-slate-500 text-xs mt-4">
              Use Arrow Keys to Navigate
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default function SalimOS() {
  const [bootStep, setBootStep] = useState(0);
  const [booting, setBooting] = useState(true);

  const [windows, setWindows] = useState<any>({
    AboutMe: {
      id: "readme",
      title: "README.md",
      icon: FileCode,
      isOpen: false,
      z: 1,
    },
    terminal: {
      id: "terminal",
      title: "Terminal",
      icon: Terminal,
      isOpen: false,
      z: 1,
    },
    vscode: {
      id: "vscode",
      title: "VS Code - Projects",
      icon: Code,
      isOpen: false,
      z: 2,
    },
    gallery: {
      id: "gallery",
      title: "Creative Gallery",
      icon: ImageIcon,
      isOpen: false,
      z: 1,
    },
    bio: { id: "bio", title: "Profile.pdf", icon: User, isOpen: true, z: 1 },
    game: {
      id: "game",
      title: "Snake.exe",
      icon: Gamepad2,
      isOpen: false,
      z: 1,
    },
    interests: {
      id: "interests",
      title: "Brain.exe",
      icon: BrainCircuit,
      isOpen: false,
      z: 1,
    },
  });

  useEffect(() => {
    if (bootStep < BOOT_SEQUENCE.length) {
      const t = setTimeout(() => setBootStep((p) => p + 1), 600);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setBooting(false), 800);
    }
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

  if (booting) {
    return (
      <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 flex flex-col justify-end z-[100]">
        {BOOT_SEQUENCE.slice(0, bootStep).map((txt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-1"
          >
            {`> ${txt}`}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden font-sans select-none bg-slate-950">
      <GravityBackground />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <TopBar />

      {/* Desktop Icons - Z-Index 10 ensures they are above background but below windows */}
      <div className="absolute top-12 left-4 flex flex-col gap-6 z-10">
        <DesktopIcon
          icon={User}
          label="Profile"
          onClick={() => toggleWindow("bio")}
          color="bg-purple-600"
        />
        <DesktopIcon
          icon={FileCode}
          label="README.md"
          onClick={() => toggleWindow("AboutMe")}
          color="bg-slate-500"
        />
        <DesktopIcon
          icon={BrainCircuit}
          label="Brain.exe"
          onClick={() => toggleWindow("interests")}
          color="bg-teal-600"
        />
        <DesktopIcon
          icon={Code}
          label="VS Code"
          onClick={() => toggleWindow("vscode")}
          color="bg-blue-600"
        />
        <DesktopIcon
          icon={ImageIcon}
          label="Gallery"
          onClick={() => toggleWindow("gallery")}
          color="bg-indigo-600"
        />
        <DesktopIcon
          icon={Gamepad2}
          label="DevBreak"
          onClick={() => toggleWindow("game")}
          color="bg-emerald-600"
        />
        <DesktopIcon
          icon={Terminal}
          label="Terminal"
          onClick={() => toggleWindow("terminal")}
          color="bg-slate-800"
        />
      </div>

      {/* Windows Layer - Z-Index 20. Pointer events NONE on container so clicks pass through to icons */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {Object.values(windows).map((win: any) => (
            <Window
              key={win.id}
              {...win}
              onClose={() => toggleWindow(win.id)}
              onClick={() => focusWindow(win.id)}
              isActive={
                win.z ===
                Math.max(
                  ...Object.values(windows)
                    .filter((w: any) => w.isOpen)
                    .map((w: any) => w.z)
                )
              }
            >
              {win.id === "readme" && <ReadmeApp />}
              {win.id === "vscode" && <VSCodeApp />}
              {win.id === "terminal" && (
                <InteractiveTerminal
                  onOpenWindow={(id) => {
                    if (!windows[id].isOpen) toggleWindow(id);
                    focusWindow(id);
                  }}
                />
              )}
              {win.id === "gallery" && <GalleryApp />}
              {win.id === "bio" && <BioApp />}
              {win.id === "game" && <SnakeGame />}
              {win.id === "interests" && <InterestsApp />}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Dock - Z-Index 50 (Always on top) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-3 shadow-2xl z-50">
        <DockIcon
          icon={User}
          isOpen={windows.bio.isOpen}
          onClick={() => toggleWindow("bio")}
        />
        <DockIcon
          icon={FileCode}
          isOpen={windows.AboutMe.isOpen}
          onClick={() => toggleWindow("AboutMe")}
        />
        <DockIcon
          icon={BrainCircuit}
          isOpen={windows.interests.isOpen}
          onClick={() => toggleWindow("interests")}
        />
        <DockIcon
          icon={Code}
          isOpen={windows.vscode.isOpen}
          onClick={() => toggleWindow("vscode")}
        />
        <DockIcon
          icon={ImageIcon}
          isOpen={windows.gallery.isOpen}
          onClick={() => toggleWindow("gallery")}
        />
        <DockIcon
          icon={Gamepad2}
          isOpen={windows.game.isOpen}
          onClick={() => toggleWindow("game")}
        />
        <DockIcon
          icon={Terminal}
          isOpen={windows.terminal.isOpen}
          onClick={() => toggleWindow("terminal")}
        />
        <div className="w-px h-8 bg-white/20 mx-1" />
        <a
          href="mailto:maysalimp@gmail.com"
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-500 transition-colors text-white"
        >
          <Mail size={20} />
        </a>
      </div>
    </div>
  );
}

// Helpers
const DesktopIcon = ({ icon: Icon, label, onClick, color }: any) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-1 w-20 cursor-pointer"
  >
    <div
      className={`w-12 h-12 ${color} rounded-xl shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
    >
      <Icon size={24} />
    </div>
    <span className="text-white text-xs font-medium drop-shadow-md bg-black/40 px-2 rounded-full border border-white/10">
      {label}
    </span>
  </button>
);

const DockIcon = ({ icon: Icon, isOpen, onClick }: any) => (
  <button
    onClick={onClick}
    className="relative p-2.5 bg-slate-800/80 rounded-lg hover:bg-slate-700 hover:-translate-y-2 transition-all"
  >
    <Icon className="text-white" size={24} />
    {isOpen && (
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
    )}
  </button>
);
