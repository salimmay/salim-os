"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeColor = "blue" | "purple" | "green" | "orange" | "red" | "pink" | "cyan";

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  // Display Settings
  brightness: number;
  setBrightness: (val: number) => void;
  saturation: number;
  setSaturation: (val: number) => void;
  // Konami / Special Effects
  invert: boolean;
  setInvert: (val: boolean) => void;
  hueRotate: number;
  setHueRotate: (val: number) => void;
  
  // Helper to get Tailwind classes based on current theme
  getColor: (type: "text" | "bg" | "border" | "ring") => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeColor>("blue");
  
  // Display State
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [invert, setInvert] = useState(false);
  const [hueRotate, setHueRotate] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("salim-os-theme") as ThemeColor;
    if (savedTheme) setTheme(savedTheme);
    
    const savedBright = localStorage.getItem("salim-os-brightness");
    if (savedBright) setBrightness(Number(savedBright));

    const savedSat = localStorage.getItem("salim-os-saturation");
    if (savedSat) setSaturation(Number(savedSat));
  }, []);

  const changeTheme = (newTheme: ThemeColor) => {
    setTheme(newTheme);
    localStorage.setItem("salim-os-theme", newTheme);
  };

  const changeBrightness = (val: number) => {
    setBrightness(val);
    localStorage.setItem("salim-os-brightness", String(val));
  };

  const changeSaturation = (val: number) => {
    setSaturation(val);
    localStorage.setItem("salim-os-saturation", String(val));
  };

  // Apply all filters to root
  useEffect(() => {
    const filterString = `brightness(${brightness}%) saturate(${saturation}%) invert(${invert ? 1 : 0}) hue-rotate(${hueRotate}deg)`;
    document.documentElement.style.filter = filterString;
  }, [brightness, saturation, invert, hueRotate]);

  // Helper map to keep code clean
  const getColor = (type: "text" | "bg" | "border" | "ring") => {
    const maps: Record<string, Record<ThemeColor, string>> = {
      text: {
        blue: "text-blue-400", purple: "text-purple-400", green: "text-emerald-400",
        orange: "text-orange-400", red: "text-red-400", pink: "text-pink-400", cyan: "text-cyan-400"
      },
      bg: {
        blue: "bg-blue-600", purple: "bg-purple-600", green: "bg-emerald-600",
        orange: "bg-orange-600", red: "bg-red-600", pink: "bg-pink-600", cyan: "bg-cyan-600"
      },
      border: {
        blue: "border-blue-500", purple: "border-purple-500", green: "border-emerald-500",
        orange: "border-orange-500", red: "border-red-500", pink: "border-pink-500", cyan: "border-cyan-500"
      },
      ring: {
        blue: "ring-blue-500", purple: "ring-purple-500", green: "ring-emerald-500",
        orange: "ring-orange-500", red: "ring-red-500", pink: "ring-pink-500", cyan: "ring-cyan-500"
      }
    };
    return maps[type][theme];
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, setTheme: changeTheme, 
      brightness, setBrightness: changeBrightness,
      saturation, setSaturation: changeSaturation,
      invert, setInvert,
      hueRotate, setHueRotate,
      getColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};