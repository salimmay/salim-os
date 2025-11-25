"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, User, Code, Image, Gamepad2, BrainCircuit, Music, Palette,
  Cpu, FileCode, Bell, X, Zap, Mail, Layout, Bomb, Settings
} from "lucide-react";
import { WindowState } from "../types";
import { BOOT_SEQUENCE, BACKGROUND_COMPONENTS } from "../constants/data";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";
import { useToast } from "../contexts/ToastContext";

// Apps
import { BSOD } from "../apps/BSOD";
import { ReadmeApp } from "../apps/ReadmeApp";
import { VSCodeApp } from "../apps/VSCodeApp";
import { InteractiveTerminal } from "../apps/InteractiveTerminal";
import { GalleryApp } from "../apps/GalleryApp";
import { BioApp } from "../apps/BioApp";
import { SnakeGame } from "../apps/SnakeGame";
import { InterestsApp } from "../apps/InterestsApp";
import { MusicPlayer } from "../apps/MusicPlayer";
import { PaintApp } from "../apps/PaintApp";
import { CalculatorApp } from "../apps/CalculatorApp";
import { CalendarApp } from "../apps/CalendarApp";
import { NotepadApp } from "../apps/NotepadApp";
import { MinesweeperApp } from "../apps/MinesweeperApp";
import { SettingsApp } from "../apps/SettingsApp";

// Components
import { TopBar } from "./TopBar";
import { StartMenu } from "./StartMenu";
import { ContextMenu } from "./ContextMenu";
import { DraggableDesktopIcon } from "./DraggableDesktopIcon";
import { Window } from "./Window";
import { DockIcon } from "./DockIcon";
import { PhysicsOverlay } from "../PhysicsOverlay";
import FilterLegend from "../features/skills/FilterLegend"; 
import SkillsOverlay from "../features/skills/SkillsOverlay"; 

export const Desktop = () => {
  // --- STATE ---
  const [bootStep, setBootStep] = useState(0);
  const [booting, setBooting] = useState(true);
  const [notification, setNotification] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [startOpen, setStartOpen] = useState(false);
  const [bsod, setBsod] = useState(false);
  const [gravityEnabled, setGravityEnabled] = useState(false);
  
  // Zen Mode & Filters
  const [zenMode, setZenMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'frontend' | 'backend' | 'creative' | 'future' | null>(null);

  // Refs
  const windowConstraintsRef = useRef(null);

  // Contexts
  const { play } = useSound();
  const { unlock } = useAchievements();
  const { addToast } = useToast();

  // Windows State
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    readme: { id: "readme", title: "README.md", icon: FileCode, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    terminal: { id: "terminal", title: "Terminal", icon: Terminal, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    vscode: { id: "vscode", title: "VS Code", icon: Code, isOpen: false, isMinimized: false, isMaximized: false, z: 2 },
    gallery: { id: "gallery", title: "Creative Gallery", icon: Image, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    bio: { id: "bio", title: "Profile.pdf", icon: User, isOpen: true, isMinimized: false, isMaximized: false, z: 10 },
    game: { id: "game", title: "Snake.exe", icon: Gamepad2, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    interests: { id: "interests", title: "Brain.exe", icon: BrainCircuit, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    music: { id: "music", title: "Salim FM", icon: Music, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    paint: { id: "paint", title: "Paint.exe", icon: Palette, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    calc: { id: "calc", title: "Calculator", icon: Code, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    calendar: { id: "calendar", title: "Calendar", icon: Cpu, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    notepad: { id: "notepad", title: "Notepad", icon: FileCode, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    minesweeper: { id: "minesweeper", title: "Minesweeper", icon: Bomb, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
    settings: { id: "settings", title: "Settings", icon: Settings, isOpen: false, isMinimized: false, isMaximized: false, z: 1 },
  });

  // Fixed Desktop Icons (Removed 'color' property)
  const desktopIcons = [
    { id: 'bio', icon: User, label: 'Profile', position: { x: 20, y: 60 } },
    { id: 'readme', icon: FileCode, label: 'README.md', position: { x: 20, y: 140 } },
    { id: 'interests', icon: BrainCircuit, label: 'Brain.exe', position: { x: 20, y: 220 } },
    { id: 'vscode', icon: Code, label: 'VS Code', position: { x: 20, y: 300 } },
    { id: 'gallery', icon: Image, label: 'Gallery', position: { x: 20, y: 380 } },
    { id: 'game', icon: Gamepad2, label: 'DevBreak', position: { x: 20, y: 460 } },
    { id: 'terminal', icon: Terminal, label: 'Terminal', position: { x: 20, y: 540 } },
  ];

  // --- EFFECTS ---

  useEffect(() => {
    if (bootStep < BOOT_SEQUENCE.length) {
      const t = setTimeout(() => setBootStep((p) => p + 1), 600);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setBooting(false), 800);
    }
  }, [bootStep]);

  useEffect(() => { 
    const t = setTimeout(() => setNotification(true), 6000); 
    return () => clearTimeout(t); 
  }, []);

  useEffect(() => {
    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let current = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === konami[current]) {
        current++;
        if (current === konami.length) {
          document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
          unlock('konami', 'Konami Code - Secret unlocked!');
          current = 0;
        }
      } else current = 0;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [unlock]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const activeWindow = Object.values(windows).filter(w => w.isOpen && !w.isMinimized).sort((a, b) => b.z - a.z)[0];
        if (activeWindow) { closeWindow(activeWindow.id); addToast(`Closed ${activeWindow.title}`, 'info'); }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        const activeWindow = Object.values(windows).filter(w => w.isOpen && !w.isMinimized).sort((a, b) => b.z - a.z)[0];
        if (activeWindow) { minimizeWindow(activeWindow.id); addToast(`Minimized ${activeWindow.title}`, 'info'); }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        const activeWindow = Object.values(windows).filter(w => w.isOpen && !w.isMinimized).sort((a, b) => b.z - a.z)[0];
        if (activeWindow) maximizeWindow(activeWindow.id);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault(); setStartOpen(!startOpen);
      }
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        const openWindows = Object.values(windows).filter(w => w.isOpen).sort((a, b) => b.z - a.z);
        if (openWindows.length > 1) {
          const nextWindow = openWindows[1];
          focusWindow(nextWindow.id);
          if (nextWindow.isMinimized) restoreWindow(nextWindow.id);
          addToast(`Switched to ${nextWindow.title}`, 'info');
        }
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [windows, startOpen, addToast]);

  // --- HANDLERS ---

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    play('click');
  };

  const handleMenuAction = (action: string) => {
    if (action === 'refresh') { 
      setBooting(true); 
      setBootStep(0); 
      play('success'); 
    }
    if (action === 'wallpaper') {
      setWallpaperIndex(prev => (prev + 1) % BACKGROUND_COMPONENTS.length);
      play('swoosh');
      unlock('indecisive', 'Indecisive - Changed wallpaper');
    }
    if (action === 'vscode') toggleWindow('vscode');
    if (action === 'properties') {
      addToast("System: SalimOS v2.0\\nKernel: React Next.js\\nMemory: 100% Creative Capacity", 'info');
      play('click');
    }
    setContextMenu(null);
  };

  const toggleWindow = (id: string) => {
    if (id === 'bsod') { setBsod(true); play('error'); return; }
    setWindows((prev) => {
      const win = prev[id];
      const maxZ = Math.max(...Object.values(prev).map(w => w.z)) + 1;
      if (win.isOpen && !win.isMinimized) { 
        play('click'); 
        return { ...prev, [id]: { ...win, isMinimized: true } }; 
      } else if (win.isOpen && win.isMinimized) { 
        play('swoosh'); 
        return { ...prev, [id]: { ...win, isMinimized: false, z: maxZ } }; 
      } else { 
        play('swoosh'); 
        return { ...prev, [id]: { ...win, isOpen: true, isMinimized: false, z: maxZ } }; 
      }
    });
  };

  const closeWindow = (id: string) => { 
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: false, isMinimized: false } })); 
    play('click'); 
  };
  const minimizeWindow = (id: string) => { 
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isMinimized: true } })); 
    play('click'); 
  };
  const restoreWindow = (id: string) => { 
    const maxZ = Math.max(...Object.values(windows).map(w => w.z)) + 1; 
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isMinimized: false, z: maxZ } })); 
    play('swoosh'); 
  };
  const maximizeWindow = (id: string) => { 
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isMaximized: !prev[id].isMaximized } })); 
    play('click'); 
  };
  const focusWindow = (id: string) => { 
    setWindows((prev) => { 
      const maxZ = Math.max(...Object.values(prev).map(w => w.z)) + 1; 
      return { ...prev, [id]: { ...prev[id], z: maxZ } }; 
    }); 
  };

  const toggleGravity = () => {
    setGravityEnabled(!gravityEnabled);
    play('click');
    if (!gravityEnabled) unlock('physics_master', 'Physics Master - Enabled gravity');
  };

  const ActiveWallpaper = BACKGROUND_COMPONENTS[wallpaperIndex];

  if (booting) return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 flex flex-col justify-end z-[100]">
      {BOOT_SEQUENCE.slice(0, bootStep).map((txt, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-1">
          {`> ${txt}`}
        </motion.div>
      ))}
    </div>
  );

  if (bsod) return <BSOD onRestart={() => setBsod(false)} />;

  return (
    <div className="fixed inset-0 overflow-hidden font-sans select-none bg-slate-950" onContextMenu={handleContextMenu}>
      
      {/* LAYER 1: Background */}
      <div className="absolute inset-0 -z-10">
         <ActiveWallpaper />
      </div>

      {/* LAYER 2: Physics & Particles */}
      <div className="absolute inset-0 z-0">
        <PhysicsOverlay />
        {!zenMode && <SkillsOverlay activeFilter={activeFilter} />}
      </div>
      
      {/* LAYER 2.5: Filter Legend (Hidden in Zen Mode) */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <FilterLegend activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 3: UI Container */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />
      
      <TopBar zenMode={zenMode} onToggleZen={() => setZenMode(!zenMode)} />
      
      {/* Constraint Box */}
      <div 
        ref={windowConstraintsRef} 
        className="fixed top-[40px] left-[-500px] right-[-500px] bottom-[-500px] pointer-events-none z-0" 
      />

      {/* Hint Text */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div 
             initial={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed top-12 right-4 z-10 text-[10px] text-white/20 font-mono select-none pointer-events-none hidden md:block"
          >
            <div>⌘W: Close | ⌘M: Minimize | ⌘F: Maximize</div>
            <div>⌘Space: Start Menu | Alt+Tab: Switch</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications & Menus */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="notification"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            onClick={() => { toggleWindow('bio'); setNotification(false); play('click'); }}
            className="fixed top-16 right-4 w-72 bg-slate-800/90 backdrop-blur p-4 rounded-lg border-l-4 border-blue-500 shadow-2xl z-[100] cursor-pointer hover:bg-slate-800 transition-colors pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-500/20 p-2 rounded-full text-blue-400"><Bell size={16} /></div>
              <div className="flex-1"><h4 className="text-white text-sm font-bold">New Opportunity</h4><p className="text-slate-400 text-xs mt-1">Recruiters are viewing your profile. Click to see details.</p></div>
              <button onClick={(e) => { e.stopPropagation(); setNotification(false); play('click'); }} className="text-slate-500 hover:text-white"><X size={14} /></button>
            </div>
          </motion.div>
        )}
        {contextMenu && <ContextMenu key="context-menu" x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onAction={handleMenuAction} />}
        {startOpen && <StartMenu key="start-menu" isOpen={startOpen} toggleStart={() => setStartOpen(false)} onOpenWindow={toggleWindow} />}
      </AnimatePresence>

      {/* Desktop Icons */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div 
             className="absolute inset-0 z-10 pointer-events-none"
             initial={{ opacity: 1 }}
             exit={{ opacity: 0, filter: "blur(10px)" }}
             transition={{ duration: 0.5 }}
          >
            {desktopIcons.map(icon => (
              <DraggableDesktopIcon
                key={icon.id}
                icon={icon.icon}
                label={icon.label}
                onClick={() => toggleWindow(icon.id)}
                // REMOVED THE 'color' PROP HERE
                defaultPosition={gravityEnabled ? { 
                  x: Math.random() * (window.innerWidth - 100), 
                  y: window.innerHeight - 100 
                } : icon.position}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {Object.values(windows).map((win) => (
            <Window
              key={win.id}
              {...win}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onClick={() => focusWindow(win.id)}
              isActive={win.z === Math.max(...Object.values(windows).filter(w => w.isOpen && !w.isMinimized).map(w => w.z))}
              dragConstraints={windowConstraintsRef}
            >
              {win.id === "readme" && <ReadmeApp />}
              {win.id === "vscode" && <VSCodeApp />}
              {win.id === "terminal" && <InteractiveTerminal onOpenWindow={(id) => { if (!windows[id].isOpen) toggleWindow(id); focusWindow(id); }} />}
              {win.id === "gallery" && <GalleryApp />}
              {win.id === "bio" && <BioApp />}
              {win.id === "game" && <SnakeGame />}
              {win.id === "interests" && <InterestsApp />}
              {win.id === "music" && <MusicPlayer />}
              {win.id === "paint" && <PaintApp />}
              {win.id === "calc" && <CalculatorApp />}
              {win.id === "calendar" && <CalendarApp />}
              {win.id === "notepad" && <NotepadApp />}
              {win.id === "minesweeper" && <MinesweeperApp />}
              {win.id === "settings" && <SettingsApp />}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div 
             initial={{ y: 0, opacity: 1 }}
             exit={{ y: 100, opacity: 0 }}
             transition={{ duration: 0.5 }}
             className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-3 shadow-2xl z-[80] w-max max-w-[90vw] overflow-x-auto overflow-y-hidden pointer-events-auto"
          >
            <button 
              onClick={() => { setStartOpen(!startOpen); play('click'); }} 
              className={`p-3 rounded-lg transition-all mr-2 ${startOpen ? 'bg-blue-600 text-white' : 'bg-slate-800/80 text-blue-400 hover:bg-slate-700'}`}
            >
              <Layout size={24} />
            </button>
            <div className="w-px h-8 bg-white/20 mx-1 shrink-0" />
            
            <DockIcon icon={User} label="Profile" isOpen={windows.bio.isOpen} isMinimized={windows.bio.isMinimized} onClick={() => toggleWindow("bio")} onClose={() => closeWindow("bio")} />
            <DockIcon icon={FileCode} label="README" isOpen={windows.readme.isOpen} isMinimized={windows.readme.isMinimized} onClick={() => toggleWindow("readme")} onClose={() => closeWindow("readme")} />
            <DockIcon icon={BrainCircuit} label="Interests" isOpen={windows.interests.isOpen} isMinimized={windows.interests.isMinimized} onClick={() => toggleWindow("interests")} onClose={() => closeWindow("interests")} />
            <DockIcon icon={Code} label="VS Code" isOpen={windows.vscode.isOpen} isMinimized={windows.vscode.isMinimized} onClick={() => toggleWindow("vscode")} onClose={() => closeWindow("vscode")} />
            <DockIcon icon={Image} label="Gallery" isOpen={windows.gallery.isOpen} isMinimized={windows.gallery.isMinimized} onClick={() => toggleWindow("gallery")} onClose={() => closeWindow("gallery")} />
            <DockIcon icon={Gamepad2} label="Snake Game" isOpen={windows.game.isOpen} isMinimized={windows.game.isMinimized} onClick={() => toggleWindow("game")} onClose={() => closeWindow("game")} />
            <DockIcon icon={Terminal} label="Terminal" isOpen={windows.terminal.isOpen} isMinimized={windows.terminal.isMinimized} onClick={() => toggleWindow("terminal")} onClose={() => closeWindow("terminal")} />
            
            <div className="w-px h-8 bg-white/20 mx-1 shrink-0" />
            <button onClick={toggleGravity} className={`p-2 rounded-lg transition-colors ${gravityEnabled ? 'bg-yellow-600 text-white' : 'bg-slate-700 hover:bg-slate-500 text-white'}`}>
              <Zap size={20} />
            </button>
            <a href="mailto:maysalimp@gmail.com" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-500 transition-colors text-white"><Mail size={20} /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};