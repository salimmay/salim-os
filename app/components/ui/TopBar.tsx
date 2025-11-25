"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added motion/AnimatePresence
import {
  Terminal,
  Wifi,
  Folder,
  BrainCircuit,
  Zap,
  Monitor,
  Volume2,
  VolumeX,
  Activity,
  Palette,
  Maximize,
  Minimize,
  Trophy,
  Lock,
} from "lucide-react";

// --- Features & Utils ---
import { WiFiMenu } from "../features/WiFiMenu";
import { FileExplorer } from "../features/FileExplorer";
import { SalimAIChat } from "../features/SalimAIChat";
import { HackerTyperMode } from "../features/HackerTyperMode";
import { SystemHUD } from "../features/SystemHUD";
import { ThemePicker } from "../features/ThemePicker";
import { CRTShader } from "../utils/CRTShader";

// --- Contexts ---
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";
import { useTheme } from "../contexts/ThemeContext";

interface TopBarProps {
  zenMode: boolean;
  onToggleZen: () => void;
}

// Achievement Data Definition
const ACHIEVEMENT_LIST = [
  { id: "konami", title: "Konami Code", desc: "↑ ↑ ↓ ↓ ← → ← → B A" },
  { id: "hacker", title: "Master Hacker", desc: "Breached the mainframe" },
  { id: "script_kiddie", title: "Script Kiddie", desc: "Opened the terminal" },
  { id: "retro_gamer", title: "Retro Gamer", desc: "Enabled CRT Mode" },
  { id: "indecisive", title: "Indecisive", desc: "Changed wallpaper too much" },
  {
    id: "physics_master",
    title: "Physics Master",
    desc: "Defied gravity laws",
  },
];

export const TopBar = ({ zenMode, onToggleZen }: TopBarProps) => {
  // --- Local State ---
  const [time, setTime] = useState("");

  // Toggles
  const [wifiMenuOpen, setWifiMenuOpen] = useState(false);
  const [retroMode, setRetroMode] = useState(false);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [salimAIOpen, setSalimAIOpen] = useState(false);
  const [hackerModeOpen, setHackerModeOpen] = useState(false);
  const [hudOpen, setHudOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false); // Added

  // --- Context Hooks ---
  const { muted, toggleMute, play } = useSound();
  const { unlock, unlocked } = useAchievements(); // Added unlocked
  const { getColor } = useTheme();

  // --- Effects ---
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

  // --- Handlers ---
  const handleRetroModeToggle = () => {
    setRetroMode(!retroMode);
    play("click");
    if (!retroMode) unlock("retro_gamer", "Retro Gamer - Enabled CRT Mode");
  };

  const handleHackerModeToggle = () => {
    setHackerModeOpen(!hackerModeOpen);
    play("click");
    if (!hackerModeOpen)
      unlock("hacker_typer", "Hacker Typer - Enabled typing mode");
  };

  const handleZenToggle = () => {
    play("click");
    onToggleZen();
  };

  // --- Render Helpers ---
  const IconButton = ({
    onClick,
    active,
    icon: Icon,
    colorClass = "hover:bg-white/5",
  }: any) => (
    <button
      onClick={onClick}
      className={`transition-colors p-1.5 rounded ${
        active ? getColor("text") : `hover:text-white ${colorClass}`
      }`}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <>
      {/* --- MAIN BAR --- */}
      <div
        className={`fixed top-0 left-0 right-0 h-10 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl flex items-center justify-between px-6 text-xs font-medium text-white z-50 border-b border-white/10 shadow-lg select-none pointer-events-auto transition-transform duration-500 ease-in-out ${
          zenMode ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* LEFT SECTION: Logo & Apps */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 bg-gradient-to-br ${getColor(
                "bg"
              )} to-slate-700 rounded-lg flex items-center justify-center shadow-lg`}
            >
              <Terminal size={14} className="text-white" />
            </div>
            <span
              className={`font-bold text-sm bg-gradient-to-r ${getColor(
                "text"
              )} to-white bg-clip-text text-transparent`}
            >
              SalimOS
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <div className="flex items-center gap-1">
            <IconButton
              onClick={() => setFileExplorerOpen(true)}
              icon={Folder}
              colorClass="hover:text-blue-400"
            />
            <IconButton
              onClick={() => setSalimAIOpen(true)}
              icon={BrainCircuit}
              colorClass="hover:text-green-400"
            />
            <IconButton
              onClick={handleHackerModeToggle}
              active={hackerModeOpen}
              icon={Zap}
              colorClass="hover:text-red-400"
            />
          </div>
        </div>

        {/* RIGHT SECTION: Utilities & Status */}
        <div className="flex items-center gap-4 relative">
          {/* Feature Toggles Group */}
          <div className="flex items-center gap-1">
            <IconButton
              onClick={handleZenToggle}
              icon={Maximize}
              colorClass="hover:text-cyan-300"
            />

            {/* Achievements Dropdown */}
            <div className="relative">
              <div className="relative">
                <IconButton
                  onClick={() => {
                    setAchievementsOpen(!achievementsOpen);
                    play("click");
                  }}
                  active={achievementsOpen}
                  icon={Trophy}
                  colorClass="hover:text-yellow-400"
                />
                {unlocked.size > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-yellow-500 text-[8px] font-bold text-black pointer-events-none">
                    {unlocked.size}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {achievementsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAchievementsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-right"
                    >
                      <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <Trophy size={14} className="text-yellow-400" />
                          Achievements
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {unlocked.size} / {ACHIEVEMENT_LIST.length} Unlocked
                        </span>
                      </div>
                      <div className="p-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {ACHIEVEMENT_LIST
                          // 1. SORT LOGIC: Unlocked items first
                          .sort((a, b) => {
                            const aUnlocked = unlocked.has(a.id);
                            const bUnlocked = unlocked.has(b.id);
                            if (aUnlocked && !bUnlocked) return -1;
                            if (!aUnlocked && bUnlocked) return 1;
                            return 0;
                          })
                          // 2. MAP LOGIC
                          .map((ach) => {
                            const isUnlocked = unlocked.has(ach.id);
                            return (
                              <div
                                key={ach.id}
                                className={`p-2 rounded mb-1 border transition-all ${
                                  isUnlocked
                                    ? "border-yellow-500/20 bg-yellow-500/10 opacity-100"
                                    : "border-transparent opacity-40 hover:opacity-60" // Dimmed locked items
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {isUnlocked ? (
                                    <Trophy
                                      size={12}
                                      className="text-yellow-400 shrink-0"
                                    />
                                  ) : (
                                    <Lock
                                      size={12}
                                      className="text-slate-500 shrink-0"
                                    />
                                  )}
                                  <span
                                    className={`text-xs font-bold ${
                                      isUnlocked
                                        ? "text-white"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {isUnlocked
                                      ? ach.title
                                      : "Locked Achievement"}
                                  </span>
                                </div>

                                {/* Hide description if locked for mystery effect */}
                                <p className="text-[10px] text-slate-400 pl-5 truncate">
                                  {isUnlocked ? ach.desc : "???"}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Picker */}
            <div className="relative">
              <IconButton
                onClick={() => {
                  setThemePickerOpen(!themePickerOpen);
                  play("click");
                }}
                active={themePickerOpen}
                icon={Palette}
              />
              <ThemePicker
                isOpen={themePickerOpen}
                onClose={() => setThemePickerOpen(false)}
              />
            </div>

            {/* System HUD */}
            <div className="relative">
              <IconButton
                onClick={() => {
                  setHudOpen(!hudOpen);
                  play("click");
                }}
                active={hudOpen}
                icon={Activity}
              />
              <SystemHUD isOpen={hudOpen} onClose={() => setHudOpen(false)} />
            </div>
          </div>

          <div className="h-4 w-px bg-white/20" />

          {/* System Status */}
          <div className="flex items-center gap-1">
            <div className="relative">
              <IconButton
                onClick={() => setWifiMenuOpen(!wifiMenuOpen)}
                active={wifiMenuOpen}
                icon={Wifi}
                colorClass="hover:text-blue-400"
              />
              <WiFiMenu
                isOpen={wifiMenuOpen}
                onClose={() => setWifiMenuOpen(false)}
              />
            </div>

            <IconButton
              onClick={handleRetroModeToggle}
              active={retroMode}
              icon={Monitor}
              colorClass="hover:text-green-400"
            />

            <IconButton
              onClick={toggleMute}
              icon={muted ? VolumeX : Volume2}
              colorClass="hover:text-yellow-400"
            />
          </div>

          <div className="h-4 w-px bg-white/20" />

          {/* Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
            <div
              className={`w-2 h-2 ${getColor("bg")} rounded-full animate-pulse`}
            />
            <span className="font-mono text-sm tracking-wide">{time}</span>
          </div>
        </div>
      </div>

      {/* --- FLOATING EXIT BUTTON (Visible in Zen Mode) --- */}
      {zenMode && (
        <button
          onClick={handleZenToggle}
          className="fixed top-4 right-4 z-[60] p-2 bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all border border-white/10 hover:scale-110"
        >
          <Minimize size={20} />
        </button>
      )}

      {/* --- GLOBAL OVERLAYS --- */}
      {retroMode && <CRTShader />}
      <FileExplorer
        isOpen={fileExplorerOpen}
        onClose={() => setFileExplorerOpen(false)}
      />
      <SalimAIChat isOpen={salimAIOpen} onClose={() => setSalimAIOpen(false)} />
      <HackerTyperMode
        isOpen={hackerModeOpen}
        onClose={() => setHackerModeOpen(false)}
      />
    </>
  );
};
