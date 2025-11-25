"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "../contexts/SoundContext";
import { useTheme } from "../contexts/ThemeContext";

export const DraggableDesktopIcon = ({ icon: Icon, label, onClick, defaultPosition }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const { play } = useSound();
  const { getColor } = useTheme(); // Access global theme

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: defaultPosition?.x || 0, y: defaultPosition?.y || 0, scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      
      className={`group flex flex-col items-center gap-2 w-24 cursor-pointer absolute pointer-events-auto touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ zIndex }}
      
      onDragStart={() => {
        setIsDragging(true);
        setZIndex(50);
        play('click');
      }}
      onDragEnd={() => {
        setZIndex(1);
        setTimeout(() => setIsDragging(false), 150);
      }}
      onPointerDown={(e) => e.stopPropagation()} 
      
      // Subtle hover animation
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon Container - GLASSMORPHISM STYLE */}
      <div 
        className={`
          w-14 h-14 rounded-2xl 
          flex items-center justify-center 
          text-slate-200 
          bg-slate-900/40 backdrop-blur-sm       /* Dark Glass Background */
          border border-white/10                 /* Subtle border */
          shadow-sm
          transition-all duration-300
          
          /* HOVER EFFECTS */
          group-hover:bg-slate-800/60            /* Lighten bg on hover */
          group-hover:text-white                 /* Brighten icon */
          group-hover:border-${getColor('border').replace('border-', '')} /* Theme Border Color */
          group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
        `}
        onClick={() => {
          if (!isDragging) {
            onClick();
            play('swoosh');
          }
        }}
      >
        <Icon size={26} strokeWidth={1.5} />
      </div>

      {/* Label - Clean text with shadow */}
      <span className="
        text-slate-200 text-[11px] font-medium tracking-wide text-center leading-tight
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
        px-2 py-0.5 rounded
        group-hover:text-white
      ">
        {label}
      </span>
    </motion.div>
  );
};