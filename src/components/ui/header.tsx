'use client';
import React, { useCallback } from 'react';
import { HelpCircle, Moon, Sun } from "lucide-react";
import { useTheme } from 'next-themes';

import { Button } from "./button";
import { Logo } from "./logo";

const themes = ['light', 'dark', 'toned'];

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = useCallback(() => {
    const currentIndex = themes.indexOf(theme || 'light');
    const nextIndex = (currentIndex + 1) % themes.length;

    setTheme(themes[nextIndex]);
  }, [theme, setTheme]);

  return (
    <header className="w-full flex justify-between">
      <Logo />

      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-text-header hover:text-text-header"
        >
          <HelpCircle />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-text-header hover:text-text-header"
          onClick={cycleTheme}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
};