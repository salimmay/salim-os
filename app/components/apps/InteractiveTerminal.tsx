"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";

const ASCII_LOGO = `
   _____       ___           ____  _____ 
  / ___/____ _/ (_)___ ___  / __ \\/ ___/ 
  \\__ \\/ __ \`/ / / __ \`__ \\/ / / /\\__ \\  
 ___/ / /_/ / / / / / / / / /_/ /___/ /  
/____/\\__,_/_/_/_/ /_/ /_/\\____//____/   
`;

const APPS = ['vscode', 'game', 'gallery', 'minesweeper', 'bio', 'interests', 'readme', 'music', 'paint', 'settings'];
const COMMANDS = ['help', 'about', 'neofetch', 'ls', 'open', 'clear', 'whoami', 'date', 'weather', 'matrix', 'joke', 'sudo'];

export const InteractiveTerminal = ({ onOpenWindow }: { onOpenWindow: (id: string) => void }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([
    { type: "output", content: "SalimOS Kernel v2.0.4 LTS" },
    { type: "output", content: "Type 'help' for available commands." }
  ]);
  
  // Command History (Up/Down Arrow)
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  
  const { addToast } = useToast();
  const { play } = useSound();
  const { unlock } = useAchievements();

  // Auto-scroll to bottom
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  // Keep focus on input
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 100);
    return () => clearInterval(focusInterval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 1. Command History Navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
    // 2. Tab Completion
    else if (e.key === "Tab") {
      e.preventDefault();
      const term = input.trim();
      if (!term) return;
      
      // Check apps or commands
      const matchCmd = COMMANDS.find(c => c.startsWith(term));
      const matchApp = APPS.find(a => a.startsWith(term));
      
      if (matchCmd) setInput(matchCmd);
      else if (matchApp) setInput(matchApp);
    }
    // 3. Execute
    else if (e.key === "Enter") {
      executeCommand();
    }
  };

  const executeCommand = () => {
    if (!input.trim()) return;

    play('keyboard');
    const rawInput = input;
    const cmd = input.trim().toLowerCase();
    const args = cmd.split(" ").slice(1);
    let output: any = null;

    // Add to history stack
    setCmdHistory(prev => [...prev, rawInput]);
    setHistoryIndex(-1);

    // Unlock achievement for using terminal
    unlock('script_kiddie', 'Script Kiddie - Executed a terminal command');

    // --- COMMAND LOGIC ---
    switch (args[0] ? cmd.split(' ')[0] : cmd) {
      case 'help':
        output = (
          <div className="space-y-2 text-slate-300">
            <div className="border-b border-slate-700 pb-1 mb-2">SalimOS Bash Shell Help</div>
            <div className="grid grid-cols-[120px_1fr] gap-1 text-xs">
              <span className="text-yellow-400">about</span> <span>Display developer info</span>
              <span className="text-yellow-400">ls</span> <span>List applications</span>
              <span className="text-yellow-400">open [app]</span> <span>Launch an application</span>
              <span className="text-yellow-400">neofetch</span> <span>System Information</span>
              <span className="text-yellow-400">whoami</span> <span>Current user</span>
              <span className="text-yellow-400">matrix</span> <span>Enter the matrix</span>
              <span className="text-yellow-400">weather</span> <span>Check server status</span>
              <span className="text-yellow-400">clear</span> <span>Clear terminal</span>
            </div>
          </div>
        );
        break;

      case 'ls':
        output = (
          <div className="flex flex-wrap gap-4 text-blue-400 font-bold">
            {APPS.map(app => <span key={app}>{app}.app</span>)}
            <span className="text-slate-500">private_keys.txt</span>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="p-2 bg-white/5 rounded border-l-2 border-blue-500">
            <p>Salim May | Full Stack Developer</p>
            <p className="text-slate-400 text-xs mt-1">Building digital experiences with React, Node, and Caffeine.</p>
          </div>
        );
        break;

      case 'neofetch':
        output = (
          <div className="flex flex-col md:flex-row gap-4 text-xs font-mono mt-2">
            <pre className="text-blue-500 font-bold leading-none hidden md:block select-none">
              {ASCII_LOGO}
            </pre>
            <div className="space-y-1 min-w-[200px]">
              <div><span className="text-blue-400">salim</span>@<span className="text-blue-400">production</span></div>
              <div>-------------------</div>
              <div><span className="text-yellow-400">OS</span>: SalimOS v2.0 (Web)</div>
              <div><span className="text-yellow-400">Host</span>: Vercel Edge Network</div>
              <div><span className="text-yellow-400">Kernel</span>: Next.js 14.2</div>
              <div><span className="text-yellow-400">Uptime</span>: 99.9%</div>
              <div><span className="text-yellow-400">Shell</span>: ZSH (Simulated)</div>
              <div><span className="text-yellow-400">CPU</span>: 100% Creative Capacity</div>
              <div className="flex gap-1 mt-2">
                <div className="w-3 h-3 bg-red-500"/>
                <div className="w-3 h-3 bg-green-500"/>
                <div className="w-3 h-3 bg-yellow-500"/>
                <div className="w-3 h-3 bg-blue-500"/>
                <div className="w-3 h-3 bg-purple-500"/>
              </div>
            </div>
          </div>
        );
        break;

      case 'open':
        const appName = args[0];
        if (APPS.includes(appName)) {
          output = <span className="text-green-400">➜ Launching process: {appName}...</span>;
          play('swoosh');
          setTimeout(() => onOpenWindow(appName), 500);
        } else {
          output = <span className="text-red-400">Error: Application '{appName}' not found. Type 'ls' to see list.</span>;
        }
        break;

      case 'whoami':
        output = "root";
        break;

      case 'date':
        output = new Date().toString();
        break;

      case 'weather':
        output = "Cloudy with a chance of bugs. Server temp: 45°C";
        break;

      case 'joke':
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs.",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
          "I would tell you a UDP joke, but you might not get it.",
          "Real programmers count from 0."
        ];
        output = jokes[Math.floor(Math.random() * jokes.length)];
        break;

      case 'matrix':
        output = (
          <div className="text-green-500 text-[10px] leading-none opacity-80 overflow-hidden h-24">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>{Math.random().toString(2).substring(2, 80)}</div>
            ))}
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput("");
        return;

      case 'sudo':
        if (args.join(' ') === 'rm -rf /') {
          addToast("⚠️ KERNEL PANIC: DESTRUCTIVE COMMAND", 'error');
          play('error');
          
          // Visual Glitch Effect
          document.body.style.transition = "filter 0.2s";
          document.body.style.filter = "invert(1) hue-rotate(90deg) blur(2px)";
          
          setTimeout(() => {
             document.body.style.filter = "none";
             output = <span className="text-red-500 font-bold">SYSTEM INTEGRITY RESTORED. DO NOT ATTEMPT AGAIN.</span>;
             // Force update to show message
             setHistory(prev => [...prev, { type: "output", content: output }]);
          }, 2000);
          
          output = <span className="text-red-500 blink">INITIATING DELETION...</span>;
        } else {
          output = <span className="text-red-400">Permission denied: You need to be a superuser (or ask nicely).</span>;
        }
        break;

      default:
        output = <span className="text-red-400">Command not found: {cmd}. Type 'help' for assistance.</span>;
    }

    setHistory(prev => [...prev, { type: "command", content: rawInput }, { type: "output", content: output }]);
    setInput("");
  };

  return (
    <div 
      className="h-full bg-[#0c0c0c] p-4 font-mono text-sm overflow-auto custom-scrollbar cursor-text" 
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-2">
        {history.map((line, i) => (
          <div key={i} className={line.type === "command" ? "mt-4 flex items-center gap-2" : "text-slate-400 ml-2 leading-relaxed"}>
            {line.type === "command" ? (
              <>
                <span className="text-green-500 font-bold">➜</span>
                <span className="text-blue-400 font-bold">~</span>
                <span className="text-slate-200">{line.content}</span>
              </>
            ) : (
              line.content
            )}
          </div>
        ))}
      </div>
      
      {/* Active Input Line */}
      <div className="flex gap-2 mt-2 items-center">
        <span className="text-green-500 font-bold">➜</span>
        <span className="text-blue-400 font-bold">~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
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