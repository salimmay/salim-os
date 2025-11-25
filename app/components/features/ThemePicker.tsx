"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ThemePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { id: "blue", bg: "bg-blue-500" },
  { id: "purple", bg: "bg-purple-500" },
  { id: "green", bg: "bg-emerald-500" },
  { id: "cyan", bg: "bg-cyan-500" },
  { id: "orange", bg: "bg-orange-500" },
  { id: "red", bg: "bg-red-500" },
  { id: "pink", bg: "bg-pink-500" },
];

export const ThemePicker = ({ isOpen, onClose }: ThemePickerProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent Backdrop to handle clicking outside */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            // CHANGED: Removed 'top-12 right-40'. Added 'top-full right-0 mt-2'
            // This anchors it exactly below the parent button aligned to the right
            className="absolute top-full right-0 mt-3 w-48 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl z-50 origin-top-right"
          >
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2 text-slate-300">
              <Palette size={14} />
              <span className="text-xs font-bold tracking-wider">ACCENT COLOR</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setTheme(c.id as any)}
                  className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center transition-transform hover:scale-110 border-2 ${theme === c.id ? "border-white" : "border-transparent"}`}
                >
                  {theme === c.id && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};