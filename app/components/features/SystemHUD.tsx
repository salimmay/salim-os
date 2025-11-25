"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, HardDrive, Wifi, Thermometer } from "lucide-react";

interface SystemHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemHUD = ({ isOpen, onClose }: SystemHUDProps) => {
  const [stats, setStats] = useState({ cpu: 12, ram: 42, net: 120, temp: 45 });

  // Simulate fluctuating system stats
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setStats({
        cpu: Math.min(100, Math.max(5, Math.floor(Math.random() * 30) + 10)),
        ram: Math.min(100, Math.max(20, Math.floor(Math.random() * 10) + 40)),
        net: Math.floor(Math.random() * 500) + 50,
        temp: Math.floor(Math.random() * 15) + 40,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to close when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-20 w-56 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl z-50 text-xs font-mono select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className="text-slate-400 font-bold tracking-wider">SYSTEM DIAGNOSTICS</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
              </div>
            </div>

            <div className="space-y-4">
              {/* CPU */}
              <div className="group">
                <div className="flex items-center justify-between text-blue-400 mb-1">
                  <div className="flex items-center gap-2"><Cpu size={14} /> <span>CORE_LOAD</span></div>
                  <span>{stats.cpu}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    animate={{ width: `${stats.cpu}%` }} 
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* RAM */}
              <div className="group">
                <div className="flex items-center justify-between text-purple-400 mb-1">
                  <div className="flex items-center gap-2"><HardDrive size={14} /> <span>MEMORY</span></div>
                  <span>{stats.ram}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-purple-500 h-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                    animate={{ width: `${stats.ram}%` }} 
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Network */}
              <div className="group">
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <div className="flex items-center gap-2"><Wifi size={14} /> <span>NET_LINK</span></div>
                  <span>{stats.net} Mb/s</span>
                </div>
                <div className="flex gap-0.5 h-1.5 mt-1">
                   {Array.from({ length: 10 }).map((_, i) => (
                     <div 
                        key={i} 
                        className={`flex-1 rounded-sm ${i < (stats.net / 60) ? 'bg-emerald-500' : 'bg-slate-800'}`}
                     />
                   ))}
                </div>
              </div>

              {/* Temperature */}
              <div className="group">
                <div className="flex items-center justify-between text-orange-400 mb-1">
                  <div className="flex items-center gap-2"><Thermometer size={14} /> <span>THERMAL</span></div>
                  <span>{stats.temp}°C</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${stats.temp > 50 ? 'bg-red-500' : 'bg-orange-400'}`}
                    animate={{ width: `${(stats.temp / 80) * 100}%` }} 
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-2 border-t border-white/5 flex justify-between text-[10px] text-slate-500">
               <span>STATUS: OPTIMAL</span>
               <span>UPTIME: ∞</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};