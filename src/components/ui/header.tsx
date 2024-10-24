"use client";
import React, { useCallback } from "react";
import { HelpCircle, Palette } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./button";
import { Logo } from "./logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Help } from "./help";

const themes = ["light", "dark", "toned"];

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = useCallback(() => {
    const currentIndex = themes.indexOf(theme || "light");
    const nextIndex = (currentIndex + 1) % themes.length;

    setTheme(themes[nextIndex]);
  }, [theme, setTheme]);

  return (
    <header className="w-full flex justify-between">
      <Logo />

      <div className="flex gap-2 items-center">
        <Sheet>
          <SheetTrigger asChild className="focus:outline-none">
            <Button
              variant="ghost"
              size="icon"
              className="text-text-header hover:text-text-header"
            >
              <HelpCircle />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Tabata training guide</SheetTitle>
            </SheetHeader>
            <Help />
          </SheetContent>
        </Sheet>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-header hover:text-text-header"
                onClick={cycleTheme}
              >
                <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change themes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};
