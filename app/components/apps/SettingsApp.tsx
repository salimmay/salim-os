"use client";

import { useState, useEffect } from "react";
import { 
  Monitor, MousePointer2, RefreshCcw, Palette, Check, 
  Sun, Droplets, Laptop, LucideIcon, Terminal 
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";
import { useToast } from "../contexts/ToastContext"; // <--- Import Toast

// --- Constants ---
const CURSORS = [
  { id: "default", name: "Default", css: "auto" },
  { id: "blade", name: "Plasma Blade", css: "url('https://cur.cursors-4u.net/others/oth-6/oth589.cur'), auto" },
  { id: "hud", name: "Mech HUD", css: "url('https://cur.cursors-4u.net/games/gam-13/gam1282.cur'), auto" },
  { id: "glitch", name: "Data Glitch", css: "url('https://cur.cursors-4u.net/mechanics/mec-4/mec393.cur'), auto" },
  { id: "retro", name: "Retro Pixel", css: "url('https://cur.cursors-4u.net/games/gam-13/gam1282.cur'), auto" },
  { id: "cyber", name: "Cyber Hand", css: "url('https://cur.cursors-4u.net/cursors/cur-11/cur1054.cur'), auto" },
];

// --- Sub-Component: Sidebar Item ---
interface SidebarItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  activeColorClass: string;
}

const SidebarItem = ({ id, icon: Icon, label, isActive, onClick, activeColorClass }: SidebarItemProps) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium ${
      isActive
        ? `${activeColorClass} text-white shadow-md scale-105`
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

// --- Main Component ---
export const SettingsApp = () => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [currentCursor, setCurrentCursor] = useState("default");
  const [kernelInput, setKernelInput] = useState("");

  const { 
    theme, setTheme, getColor,
    brightness, setBrightness,
    saturation, setSaturation,
    setInvert, setHueRotate 
  } = useTheme();
  
  const { play } = useSound();
  const { unlock, unlocked } = useAchievements();
  const { addToast } = useToast(); // <--- Hook

  // --- Handle Navigation ---
  const handleTabChange = (id: string) => {
    play('click');
    setActiveTab(id);
  };

  // --- Handle Cursor CSS Injection ---
  useEffect(() => {
    const selected = CURSORS.find(c => c.id === currentCursor);
    const cssValue = selected ? selected.css : "auto";
    const styleId = "global-cursor-override";
    
    let styleTag = document.getElementById(styleId);
    if (currentCursor === "default") {
      if (styleTag) styleTag.remove();
      return;
    }

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `* { cursor: ${cssValue} !important; }`;
  }, [currentCursor]);

  // --- Handle Kernel/Root Injection ---
  const handleKernelCommand = () => {
    const cmd = kernelInput.trim().toUpperCase();
    
    // 1. ENABLE GOD MODE
    if (['KONAMI', 'UPUPDOWNDOWN', 'SALIM', 'GODMODE', 'SUDO'].includes(cmd)) {
      play('success');
      setInvert(true);
      setHueRotate(180);
      unlock('konami', 'Konami Code - Root Access Granted via Terminal');
      setKernelInput("");
      // Replaced alert with Toast
      addToast("SYSTEM OVERRIDE: VISUAL FILTERS ENGAGED", "warning");
    } 
    // 2. DISABLE GOD MODE (RESET)
    else if (['RESET', 'EXIT', 'CLEAR', 'NORMAL', 'OFF'].includes(cmd)) {
      play('click');
      setInvert(false);
      setHueRotate(0);
      setKernelInput("");
      // Replaced alert with Toast
      addToast("SYSTEM NORMALIZED", "success");
    }
    // 3. INVALID
    else {
      play('error');
      setKernelInput("");
      addToast("KERNEL ERROR: Invalid Command", "error");
    }
  };

  // --- Handle Factory Reset ---
  const handleReset = () => {
    play('error');
    // Using confirm here is still safer than a toast for destructive actions, 
    // unless you implement a custom modal.
    if(confirm("SYSTEM WARNING: This will reset all achievements, theme data, and settings. Proceed?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <div className="flex h-full text-slate-200 font-sans">
      
      {/* --- SIDEBAR --- */}
      <div className="w-40 border-r border-white/10 p-3 space-y-1 bg-black/20 flex flex-col h-full shrink-0">
        <SidebarItem 
          id="appearance" icon={Palette} label="Appearance" 
          isActive={activeTab === "appearance"} onClick={handleTabChange} activeColorClass={getColor('bg')}
        />
        <SidebarItem 
          id="display" icon={Monitor} label="Display" 
          isActive={activeTab === "display"} onClick={handleTabChange} activeColorClass={getColor('bg')}
        />
        <SidebarItem 
          id="input" icon={MousePointer2} label="Input" 
          isActive={activeTab === "input"} onClick={handleTabChange} activeColorClass={getColor('bg')}
        />
        
        <div className="h-px bg-white/10 my-2 mx-2" />
        
        <SidebarItem 
          id="system" icon={RefreshCcw} label="System" 
          isActive={activeTab === "system"} onClick={handleTabChange} activeColorClass={getColor('bg')}
        />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
        
        {/* 1. APPEARANCE */}
        {activeTab === "appearance" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Palette size={16} /> Accent Color
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {["blue", "purple", "green", "orange", "red", "pink", "cyan"].map((c) => (
                  <button
                    key={c}
                    onClick={() => { setTheme(c as any); play('click'); }}
                    className={`h-10 rounded-md bg-${c === 'green' ? 'emerald' : c}-500 border-2 transition-all hover:scale-105 flex items-center justify-center ${theme === c ? 'border-white shadow-lg scale-105' : 'border-transparent opacity-80 hover:opacity-100'}`}
                  >
                    {theme === c && <Check size={16} className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. DISPLAY */}
        {activeTab === "display" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Monitor size={16} /> Display Adjustments
            </h3>

            {/* Brightness */}
            <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2"><Sun size={14}/> Brightness</span>
                    <span className="font-mono">{brightness || 100}%</span>
                </div>
                <input 
                    type="range" min="50" max="150" 
                    value={brightness || 100}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${getColor('bg')}`}
                />
            </div>

            {/* Saturation */}
            <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2"><Droplets size={14}/> Saturation</span>
                    <span className="font-mono">{saturation || 100}%</span>
                </div>
                <input 
                    type="range" min="0" max="200" 
                    value={saturation || 100}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${getColor('bg')}`}
                />
            </div>
          </div>
        )}

        {/* 3. INPUT */}
        {activeTab === "input" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <MousePointer2 size={16} /> Cursor Style
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {CURSORS.map((cursor) => (
                            <button
                                key={cursor.id}
                                onClick={() => { setCurrentCursor(cursor.id); play('click'); }}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                    currentCursor === cursor.id 
                                    ? `bg-white/10 ${getColor('border')} text-white` 
                                    : "border-white/5 hover:bg-white/5 text-slate-400"
                                }`}
                            >
                                <span className="text-xs">{cursor.name}</span>
                                {currentCursor === cursor.id && <div className={`w-2 h-2 rounded-full ${getColor('bg')}`} />}
                            </button>
                        ))}
                    </div>
                 </div>
            </div>
        )}

        {/* 4. SYSTEM */}
        {activeTab === "system" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Kernel Injector */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-slate-200 font-bold text-xs flex items-center gap-2">
                            <Terminal size={14} className="text-green-400" /> KERNEL INJECTOR
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">
                            STATUS: {unlocked.has('konami') ? 
                                <span className="text-green-400 font-bold">ROOT_ACCESS</span> : 
                                <span className="text-red-400 font-bold">LOCKED</span>
                            }
                        </span>
                    </div>
                    
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={kernelInput}
                            onChange={(e) => setKernelInput(e.target.value)}
                            placeholder="Enter Root Key..."
                            className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-green-400 placeholder:text-slate-600 focus:outline-none focus:border-green-500/50 uppercase tracking-widest"
                            onKeyDown={(e) => e.key === 'Enter' && handleKernelCommand()}
                        />
                        <button 
                            onClick={handleKernelCommand}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-3 rounded text-xs font-medium transition-colors"
                        >
                            EXEC
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500">
                        Commands: <span className="text-slate-400 font-mono">GODMODE</span> to enable, <span className="text-slate-400 font-mono">RESET</span> to normalize.
                    </p>
                </div>

                <div className="h-px bg-white/10" />

                {/* Factory Reset */}
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3">
                    <h4 className="text-red-400 font-bold text-xs flex items-center gap-2">
                        <RefreshCcw size={14} /> DANGER ZONE
                    </h4>
                    <p className="text-[10px] text-red-300/70 leading-relaxed">
                        Performing a factory reset will clear all local storage, achievements, 
                        and theme preferences. The system will reboot immediately.
                    </p>
                    <button 
                        onClick={handleReset}
                        className="w-full py-2 bg-red-500/20 hover:bg-red-500 hover:text-white border border-red-500 text-red-400 text-xs font-bold rounded transition-colors"
                    >
                        FACTORY RESET
                    </button>
                </div>
                
                <div className="text-[10px] text-slate-600 font-mono text-center mt-8 opacity-50">
                    SalimOS v1.0.9 (Build 2024)<br/>
                    Kernel: React / Next.js<br/>
                    Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};