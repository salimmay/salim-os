"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Folder, FileCode, Lock, ChevronRight, Home, FileText, KeyRound, Terminal } from "lucide-react";
import { FILE_SYSTEM } from "../constants/data";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";
import { useToast } from "../contexts/ToastContext"; // Assuming you have this

type PathItem = {
  id: string;
  name: string;
};

export const FileExplorer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<PathItem[]>([{ id: 'root', name: FILE_SYSTEM.root.name }]);
  const [unlockedFolders, setUnlockedFolders] = useState<Set<string>>(new Set());
  
  // Modal States (To replace alerts)
  const [viewingFile, setViewingFile] = useState<{ name: string; content: string } | null>(null);
  const [passwordPrompt, setPasswordPrompt] = useState<{ folderId: string; folderName: string } | null>(null);
  const [passwordInput, setPasswordInput] = useState("");

  const { play } = useSound();
  const { unlock } = useAchievements();
  const { addToast } = useToast();

  // --- TRAVERSAL LOGIC ---
  const getCurrentFolder = () => {
    let current: any = FILE_SYSTEM;
    for (let i = 0; i < currentPath.length; i++) {
      const key = currentPath[i].id;
      if (i === 0) current = current[key];
      else if (current && current.children) current = current.children[key];
      if (!current) return { children: {} }; 
    }
    return current;
  };

  const currentFolder = getCurrentFolder();

  // --- ACTIONS ---
  const handleNavigate = (key: string, item: any) => {
    play('click');
    
    // 1. Handle Files -> Open Custom Viewer
    if (item.type === 'file') {
      setViewingFile({ name: item.name, content: item.content || "Binary file. Cannot display content." });
      return;
    }

    // 2. Handle Locked Folders -> Open Custom Password Modal
    if (item.locked && !unlockedFolders.has(key)) {
      setPasswordPrompt({ folderId: key, folderName: item.name });
      setPasswordInput(""); // Reset input
      return;
    }

    // 3. Normal Navigation
    setCurrentPath(prev => [...prev, { id: key, name: item.name }]);
  };

  const handleSubmitPassword = () => {
    if (!passwordPrompt) return;
    
    // Check Password
    if (['admin', 'password', '1234', 'secret'].includes(passwordInput.toLowerCase())) {
      play('success');
      setUnlockedFolders(prev => new Set([...prev, passwordPrompt.folderId]));
      unlock('hacker', 'Master Hacker - Directory Unlocked');
      
      // Auto-navigate after unlock
      setCurrentPath(prev => [...prev, { id: passwordPrompt.folderId, name: passwordPrompt.folderName }]);
      setPasswordPrompt(null);
    } else {
      play('error');
      addToast("Access Denied: Incorrect Password", "error");
      setPasswordInput(""); // Clear input on fail
    }
  };

  const goBack = () => {
    if (currentPath.length > 1) {
      play('click');
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  const jumpTo = (index: number) => {
    play('click');
    setCurrentPath(prev => prev.slice(0, index + 1));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[100] pointer-events-auto flex flex-col overflow-hidden"
    >
      {/* --- HEADER --- */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 bg-white/5">
        <button 
          onClick={goBack} 
          disabled={currentPath.length === 1} 
          className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeft size={16} className="text-white" />
        </button>

        {/* Address Bar */}
        <div className="flex-1 bg-black/40 h-8 rounded border border-white/10 flex items-center px-3 gap-1 overflow-x-auto no-scrollbar">
           <Home size={12} className="text-blue-400 mr-1 shrink-0" />
           {currentPath.map((step, index) => (
             <div key={step.id} className="flex items-center whitespace-nowrap">
               {index > 0 && <ChevronRight size={12} className="text-slate-600 mx-1" />}
               <button onClick={() => jumpTo(index)} className="text-xs text-slate-300 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors">
                 {step.name}
               </button>
             </div>
           ))}
        </div>

        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors">
          <X size={16} />
        </button>
      </div>
      
      {/* --- MAIN CONTENT (Grid) --- */}
      <div className="flex-1 p-2 overflow-auto bg-black/20 relative">
        <div className="grid grid-cols-1 gap-1">
          {currentFolder.children && Object.entries(currentFolder.children).map(([key, item]: [string, any]) => (
            <div
              key={key}
              onClick={() => handleNavigate(key, item)}
              className="flex items-center gap-3 p-2 hover:bg-blue-500/20 rounded-lg cursor-pointer group transition-colors border border-transparent hover:border-blue-500/30"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-md group-hover:bg-blue-500/20 transition-colors">
                {item.type === 'folder' ? (
                  <Folder size={18} className={item.locked && !unlockedFolders.has(key) ? "text-yellow-500" : "text-blue-400"} />
                ) : (
                  <FileCode size={18} className="text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-200 text-sm font-medium truncate group-hover:text-blue-200">{item.name}</div>
                <div className="text-slate-500 text-[10px] flex items-center gap-2">
                   {item.type === 'folder' ? 'Directory' : 'Source File'}
                   {item.locked && !unlockedFolders.has(key) && <span className="text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-1.5 rounded"><Lock size={8} /> Protected</span>}
                </div>
              </div>
              {item.type === 'folder' && <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400" />}
            </div>
          ))}
          {(!currentFolder.children || Object.keys(currentFolder.children).length === 0) && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
               <Folder size={32} className="mb-2 opacity-50" />
               <span className="text-xs">This folder is empty</span>
            </div>
          )}
        </div>

        {/* --- OVERLAY: FILE VIEWER --- */}
        <AnimatePresence>
          {viewingFile && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-2 bg-slate-900 rounded-lg shadow-2xl border border-white/10 flex flex-col overflow-hidden z-20"
            >
              <div className="h-10 border-b border-white/10 bg-slate-800 flex items-center justify-between px-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText size={14} className="text-emerald-400" />
                  <span className="text-xs font-mono">{viewingFile.name}</span>
                </div>
                <button onClick={() => setViewingFile(null)} className="text-slate-400 hover:text-white"><X size={14} /></button>
              </div>
              <div className="flex-1 p-4 overflow-auto bg-slate-950 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                {viewingFile.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- OVERLAY: PASSWORD PROMPT --- */}
        <AnimatePresence>
          {passwordPrompt && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }}
                className="w-64 bg-slate-900 border border-red-500/30 rounded-xl p-4 shadow-2xl"
              >
                <div className="flex flex-col items-center gap-3 text-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Lock size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-bold">Restricted Access</h3>
                    <p className="text-slate-400 text-xs">Enter password for "{passwordPrompt.folderName}"</p>
                  </div>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitPassword(); }}>
                  <input 
                    autoFocus
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none mb-3 text-center tracking-widest"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPasswordPrompt(null)} className="flex-1 py-1.5 text-xs text-slate-400 hover:bg-white/5 rounded">Cancel</button>
                    <button type="submit" className="flex-1 py-1.5 text-xs bg-red-600 hover:bg-red-500 text-white rounded font-medium">Unlock</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- FOOTER --- */}
      <div className="h-6 bg-slate-900 border-t border-white/10 flex items-center px-3 gap-4 text-[10px] text-slate-500 select-none">
        <div className="flex items-center gap-2">
           <Terminal size={10} />
           <span>PS:admin</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <span>{currentFolder.children ? Object.keys(currentFolder.children).length : 0} objects</span>
      </div>
    </motion.div>
  );
};