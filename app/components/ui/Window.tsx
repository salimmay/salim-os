"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useSound } from "../contexts/SoundContext";
import { useTheme } from "../contexts/ThemeContext"; // Import Theme

export const Window = ({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onClose, 
  onMinimize,
  onMaximize,
  isOpen, 
  isMinimized,
  isMaximized,
  isActive, 
  onClick 
}: any) => {
  const { play } = useSound();
  const { getColor } = useTheme(); // Get dynamic colors
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen || isMinimized) return null;

  return (
    <motion.div
      // 1. Spring Animation for opening/closing
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      
      // 2. Dynamic Border Color based on Theme
      className={`fixed flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl bg-slate-900/90 rounded-xl pointer-events-auto transition-shadow duration-300 ${
        isActive 
          ? `z-50 border ${getColor('border')} shadow-[0_0_40px_rgba(0,0,0,0.5)]` 
          : "z-40 border border-slate-700/50 shadow-xl grayscale-[0.5]"
      }`}
      
      // 3. Layout & Sizing
      style={
        isMaximized
          ? {
              top: 40,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 120px)',
              borderRadius: 0,
            }
          : {
              top: 80,
              left: 100,
              width: 'min(90vw, 900px)',
              height: '600px',
            }
      }
      
      // 4. Drag Logic
      drag={!isMaximized} // Disable drag when maximized
      dragMomentum={false} // Stops immediately (OS feel)
      dragElastic={0.05} // Slight bounce when hitting edges
      dragConstraints={{ top: 40, left: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
      
      onMouseDown={onClick} // Focus on click
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* TITLE BAR */}
      <div 
        className="window-titlebar h-10 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-between px-4 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
            // Prevent drag if clicking buttons
            if((e.target as HTMLElement).closest('button')) e.stopPropagation();
        }}
      >
        {/* Traffic Lights */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(id); play('click'); }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110"
          >
            <X size={8} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(id); play('click'); }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-all hover:scale-110"
          >
            <Minus size={8} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(id); play('click'); }}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-all hover:scale-110"
          >
            {isMaximized ? (
              <Minimize2 size={8} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Maximize2 size={8} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 text-slate-300 text-xs font-medium pointer-events-none select-none opacity-80">
          <Icon size={12} /> <span>{title}</span>
        </div>
        
        {/* Spacer for balance */}
        <div className="w-14" />
      </div>

      {/* CONTENT AREA */}
      <div className={`flex-1 overflow-hidden relative ${isDragging ? 'pointer-events-none' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
};