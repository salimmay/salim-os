"use client";

import { ToastProvider } from "./components/contexts/ToastContext";
import { AchievementsProvider } from "./components/contexts/AchievementsContext";
import { SoundProvider } from "./components/contexts/SoundContext";
import { ThemeProvider } from "./components/contexts/ThemeContext";
import { Desktop } from "./components/ui/Desktop";

export default function SalimOS() {
  return (
    <SoundProvider>
      <ThemeProvider>
        <ToastProvider>
          <AchievementsProvider>
            <Desktop />
          </AchievementsProvider>
        </ToastProvider>
      </ThemeProvider>
    </SoundProvider>
  );
}