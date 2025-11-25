"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ShieldAlert, Cpu, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { HACKER_CODE } from "../constants/data";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";

// Helper component for visual keys
const KeyCap = ({ children, label }: { children?: React.ReactNode; label?: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center justify-center w-8 h-8 bg-black/80 text-green-400 border-b-2 border-green-600 rounded font-bold shadow-[0_0_10px_rgba(74,222,128,0.2)]">
      {children || label}
    </div>
  </div>
);

export const HackerTyperMode = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [typedCode, setTypedCode] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { play } = useSound();
  const { unlock } = useAchievements();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [typedCode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen || accessGranted) return;
      
      e.preventDefault();
      play('keyboard');
      
      // Turbo Mode logic
      const charsToAdd = Math.floor(Math.random() * 4) + 3;
      const nextIndex = Math.min(typingIndex + charsToAdd, HACKER_CODE.length);
      const chunk = HACKER_CODE.slice(typingIndex, nextIndex);
      
      setTypedCode(prev => prev + chunk);
      setTypingIndex(nextIndex);

      if (nextIndex >= HACKER_CODE.length) {
        setAccessGranted(true);
        play('success');
        unlock('master_hacker', 'Master Hacker - System Breached');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, typingIndex, play, accessGranted, unlock]);

  const resetTyping = () => {
    setTypedCode("");
    setTypingIndex(0);
    setAccessGranted(false);
    play('click');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100] pointer-events-auto flex font-mono"
    >
      {/* SIDEBAR VISUALS */}
      <div className="w-64 border-r border-green-800 bg-green-950/10 p-4 hidden md:flex flex-col gap-6 text-green-500/80">
        <div className="border border-green-700/50 p-3 rounded">
          <div className="flex items-center gap-2 mb-2 text-green-400 font-bold border-b border-green-800 pb-1">
            <ShieldAlert size={16} /> TARGET: MAINFRAME
          </div>
          <div className="text-xs space-y-1 opacity-70">
            <p>PORT: 443 [OPEN]</p>
            <p>FIREWALL: BYPASSING...</p>
            <p>ENCRYPTION: 2048-BIT</p>
          </div>
        </div>

        <div className="border border-green-700/50 p-3 rounded">
           <div className="flex items-center gap-2 mb-2 text-green-400 font-bold border-b border-green-800 pb-1">
            <Cpu size={16} /> RESOURCES
          </div>
          <div className="space-y-2 text-xs">
            <div>CPU LOAD</div>
            <div className="w-full h-1 bg-green-900"><div className="h-full bg-green-500 w-[85%] animate-pulse"></div></div>
            <div>RAM USAGE</div>
            <div className="w-full h-1 bg-green-900"><div className="h-full bg-green-500 w-[60%]"></div></div>
          </div>
        </div>
        
        <div className="mt-auto border-t border-green-800 pt-4 text-xs opacity-50">
          SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>

      {/* MAIN TERMINAL */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-4 border-b border-green-800 flex justify-between items-center bg-black">
          <div className="text-green-400 font-bold flex items-center gap-2">
            <TerminalIcon /> BASH_TERMINAL_V2.0
          </div>
          <button onClick={onClose} className="text-green-400 hover:text-white hover:bg-green-900/50 p-1 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-1 text-green-400 text-sm p-6 overflow-auto whitespace-pre leading-relaxed scroll-smooth"
          style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.5)' }}
        >
          {typedCode}
          <span className="animate-pulse bg-green-500 text-black px-1 ml-1">_</span>
        </div>
        
        {/* STATUS BAR */}
        <div className="p-2 border-t border-green-800 bg-black flex justify-between items-center px-6">
          <div className="text-green-600 text-xs">
            BYTES: {typingIndex} / {HACKER_CODE.length}
          </div>
          <div className="w-64 h-2 bg-green-900 rounded-full overflow-hidden">
             <div 
               className="h-full bg-green-400 transition-all duration-100 ease-out"
               style={{ width: `${(typingIndex / HACKER_CODE.length) * 100}%` }}
             />
          </div>
        </div>

        {/* --- SUCCESS OVERLAY --- */}
        <AnimatePresence>
          {accessGranted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md z-20"
            >
              <div className="bg-green-500 text-black p-8 rounded-xl border-4 border-green-400 shadow-[0_0_100px_rgba(74,222,128,0.6)] text-center max-w-lg w-full">
                <Lock className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                
                <h1 className="text-3xl font-black tracking-widest mb-1">ACCESS GRANTED</h1>
                <p className="font-mono text-xs mb-6 opacity-75">SYSTEM BREACH SUCCESSFUL</p>
                
                {/* THE REWARD: KONAMI CODE */}
                <div className="bg-black/10 rounded-lg p-4 mb-6 border border-black/10">
                  <p className="text-xs font-bold mb-3 text-black/70 uppercase tracking-wider">Decrypted Secret File:</p>
                  
                  <div className="flex flex-wrap justify-center gap-1.5">
                    <KeyCap><ArrowUp size={14} /></KeyCap>
                    <KeyCap><ArrowUp size={14} /></KeyCap>
                    <KeyCap><ArrowDown size={14} /></KeyCap>
                    <KeyCap><ArrowDown size={14} /></KeyCap>
                    <KeyCap><ArrowLeft size={14} /></KeyCap>
                    <KeyCap><ArrowRight size={14} /></KeyCap>
                    <KeyCap><ArrowLeft size={14} /></KeyCap>
                    <KeyCap><ArrowRight size={14} /></KeyCap>
                    <KeyCap label="B" />
                    <KeyCap label="A" />
                  </div>
                  
                  <p className="text-[10px] mt-3 font-mono text-black/60">
                    Input this sequence on your keyboard to unlock God Mode.
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                   <button 
                     onClick={resetTyping} 
                     className="bg-black text-green-400 px-4 py-2 rounded hover:bg-green-900 font-bold text-xs flex items-center gap-2"
                   >
                     <RefreshCw size={12} /> HACK AGAIN
                   </button>
                   <button 
                     onClick={onClose} 
                     className="bg-transparent border-2 border-black px-4 py-2 rounded hover:bg-black/10 font-bold text-xs"
                   >
                     CLOSE TERMINAL
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const TerminalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);