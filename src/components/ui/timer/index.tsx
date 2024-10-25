"use client";
import React, { useEffect, useState } from "react";
import { TimerReset, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

import { formAnimation, indicatorsAnimation } from "./animation";
import { Button } from "../button";
import { TabataForm } from "./form";
import { TimerButton } from "./button";

import { useTabataStore } from "@/store/tabata";
import { cn } from "@/lib/utils";
import { Switch } from "../switch";
import { Label } from "../label";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

const timeStringToSeconds = (timeString: string): number => {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
};

const secondsToTimeString = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

let audioContext: AudioContext | null = null;

export const TabataTimer: React.FC = () => {
  const {
    config,
    isRunning,
    setIsRunning,
    currentSet,
    setCurrentSet,
    currentRound,
    setCurrentRound,
    isRest,
    setIsRest,
    isTimeOff,
    setIsTimeOff,
    setRestProgress,
    restProgress,
    isSettingsOpened,
    setIsSettingsOpened,
    resetTimer,
  } = useTabataStore();

  const timeOnSeconds = timeStringToSeconds(config.timeOn);
  const timeOffSeconds = timeStringToSeconds(config.timeOff);
  const restBetweenSetsSeconds = timeStringToSeconds(config.restBetweenSets);

  const [currentTime, setCurrentTime] = useState(0);
  const [intervalCountdown, setIntervalCountdown] =
    useState<number>(timeOnSeconds);

  const totalTime =
    config.sets *
    (config.roundsPerSet * (timeOnSeconds + timeOffSeconds) +
      (config.sets > 1 ? restBetweenSetsSeconds : 0));

  const [hasBeeped, setHasBeeped] = useState(false);
  const [hasTimeOffBeeped, setHasTimeOffBeeped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const handleSoundToggle = () => {
    setIsSoundOn((prev) => !prev);
  };

  const createBeep = (frequency = 800, duration = 0.1, volume = 0.1) => {
    if (!isSoundOn) {
      return;
    }
    if (!audioContext) {
      //@ts-expect-error error
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  };

  useEffect(() => {
    if (isRunning) {
      if (isSoundOn) {
        createBeep();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, isSoundOn]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;

          // Calculate current position
          let timeInCurrentSet = next;
          let setIndex = 0;
          const timePerSet =
            config.roundsPerSet * (timeOnSeconds + timeOffSeconds);
          const totalSetTime = timePerSet + restBetweenSetsSeconds;

          // Adjust calculations for set transitions
          while (
            timeInCurrentSet > totalSetTime &&
            setIndex < config.sets - 1
          ) {
            timeInCurrentSet -= totalSetTime;
            setIndex++;
          }

          // Handle rest period
          if (
            timeInCurrentSet > timePerSet &&
            timeInCurrentSet <= totalSetTime
          ) {
            const restTime = timeInCurrentSet - timePerSet;
            setIsRest(true);
            setRestProgress((restTime / restBetweenSetsSeconds) * 100);
            setIntervalCountdown(restBetweenSetsSeconds - restTime + 1);
          } else {
            setIsRest(false);
            if (timeInCurrentSet > totalSetTime) {
              timeInCurrentSet = timeInCurrentSet - restBetweenSetsSeconds;
            }

            // Calculate round and interval
            const roundTime = timeOnSeconds + timeOffSeconds;
            const roundIndex = Math.floor(timeInCurrentSet / roundTime);
            const timeInRound = timeInCurrentSet % roundTime;

            setCurrentSet(setIndex);
            setCurrentRound(roundIndex);
            setIsTimeOff(timeInRound >= timeOnSeconds);

            // Update interval countdown for time on and time off
            if (timeInRound < timeOnSeconds) {
              setIntervalCountdown(timeOnSeconds - timeInRound);
            } else {
              setIntervalCountdown(roundTime - timeInRound);
            }

            // Beep when entering time on
            if (timeInRound < timeOnSeconds && !isTimeOff && !hasBeeped) {
              createBeep(); // Beep for time on
              setHasBeeped(true);
            }

            // Check if we are in the time off phase
            if (timeInRound >= timeOnSeconds) {
              setIsTimeOff(true); // Ensure isTimeOff is set correctly

              // Beep when entering time off
              if (!hasTimeOffBeeped) {
                createBeep(600, 0.3, 0.2); // Beep for time off (different frequency)
                setHasTimeOffBeeped(true);
              }
            } else {
              setIsTimeOff(false);
            }

            if (timeInRound === 0) {
              setHasBeeped(false);
              setHasTimeOffBeeped(false);
            }
          }

          if (next >= totalTime) {
            setIsRunning(false);
            return 0;
          }

          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isRunning,
    config,
    timeOnSeconds,
    timeOffSeconds,
    restBetweenSetsSeconds,
    totalTime,
    setCurrentRound,
    setCurrentSet,
    setIsRest,
    setIsRunning,
    setIsTimeOff,
    setRestProgress,
    hasBeeped,
    hasTimeOffBeeped,
  ]);

  const reset = () => {
    setIntervalCountdown(0);
    resetTimer();
  };

  const toggleSettings = () => {
    setIsRunning(false);
    setIsRest(false);
    setIsTimeOff(false);
    setIsSettingsOpened(!isSettingsOpened);
  };

  const RoundDots = ({ setIndex }: { setIndex: number }) => {
    const isCurrentSet = setIndex === currentSet;
    const isPastSet = setIndex < currentSet;

    return (
      <div className="flex gap-2 w-full items-center justify-between">
        {Array.from({ length: config.roundsPerSet }).map((_, roundIndex) => {
          const isCurrentRound = roundIndex === currentRound;
          const isPastRound =
            isPastSet || (isCurrentSet && roundIndex < currentRound);

          return (
            <div key={roundIndex} className="flex gap-1.5">
              {/* Time ON dot */}
              <div
                className={`w-[9px] h-[9px]  rounded-full ${
                  isPastRound
                    ? "bg-card-foreground"
                    : isCurrentSet && isCurrentRound
                    ? !isRunning
                      ? "bg-primary"
                      : !isTimeOff
                      ? "bg-success"
                      : "bg-card-foreground opacity-20"
                    : "bg-card-foreground opacity-20"
                }`}
              />
              {/* Time OFF dot */}
              <div
                className={`w-[9px] h-[9px] rounded-full ${
                  isPastRound
                    ? "border-2 border-card-foreground bg-transparent"
                    : isCurrentSet && isCurrentRound
                    ? !isRunning
                      ? "border-2 border-primary bg-transparent"
                      : isTimeOff
                      ? "border-2 border-warning bg-transparent"
                      : "border-2 border-card-foreground opacity-20 bg-transparent"
                    : "border-2 border-card-foreground opacity-20 bg-transparent"
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (isSettingsOpened) {
      setIsSettingsOpened(false);
      setIsSettingsOpened(true);
    }
  }, [config, isSettingsOpened, setIsSettingsOpened]);

  const cardPanel = {
    closed: {
      height: 220,
      width: config.roundsPerSet > 12 ? 1100 : 764,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      width: config.roundsPerSet > 12 ? 1100 : 764,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const cardAnimation = {
    open: {
      height: 160,
      width:
        config.roundsPerSet > 12 ? 1097 : config.roundsPerSet > 16 ? 1000 : 760,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    closed: {
      height: 160,
      width: config.roundsPerSet > 12 ? 1097 : 760,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.section
      initial="open"
      animate={isSettingsOpened ? "open" : "closed"}
      variants={cardPanel}
      className="border-2 border-ring/30 flex flex-col items-end gap-1 justify-between bg-surface pt-3 rounded-t-[2rem] rounded-b-[5rem] px-0 relative text-foreground"
    >
      <div className="flex text-foreground justify-between w-full pl-10 items-center mr-1">
        {isSettingsOpened ? (
          <h2 className="font-medium tracking-wide text-lg">
            Configure your Tabata
          </h2>
        ) : (
          <h2 className="flex items-center gap-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground tracking-wide">
              Total time:{" "}
              <span className="font-bold text-base text-foreground">
                {secondsToTimeString(currentTime)}
              </span>
            </p>
            <span className="opacity-20"> | </span>
            <p className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground tracking-wide">
                Round:{" "}
              </span>
              <span className="font-bold text-base text-foreground">
                {currentRound + 1}
              </span>
              <span className="text-muted-foreground text-base">
                {" "}
                / {config.roundsPerSet * config.sets}
              </span>
            </p>
          </h2>
        )}
        <div className="flex items-center gap-1 mr-3">
          <div className="flex items-center space-x-3 mr-2">
            <Label htmlFor="sound" className="text-sm tracking-wide">
              Sound
            </Label>
            <Switch
              id="sound"
              checked={isSoundOn}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          <div className="w-px h-5 rounded-full bg-muted-foreground/20 mx-3" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={reset}>
                  <TimerReset className="-mt-px" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset timer</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    isSettingsOpened ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={toggleSettings}
                >
                  <SlidersHorizontal className="!h-[18px] !w-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Configure timer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <motion.div
        className="w-full"
        initial="open"
        animate={isSettingsOpened ? "open" : "closed"}
        variants={formAnimation}
      >
        <TabataForm />
      </motion.div>

      <motion.div
        initial="open"
        animate={isSettingsOpened ? "open" : "closed"}
        variants={cardAnimation}
        className="bg-card text-card-foreground rounded-t-[2rem] rounded-b-[5rem] flex items-center justify-between gap-4 overflow-hidden px-7"
      >
        {!isSettingsOpened && (
          <motion.div className="flex items-center gap-2">
            <div className="flex flex-col gap-6 items-center justify-center rounded-full w-36 h-36">
              <h1 className="text-[2.6rem] flex flex-col items-center gap-1 relative w-28 -mt-3">
                <span className="font-[family-name:var(--font-secondary)] font-medium tracking-wide">
                  {secondsToTimeString(intervalCountdown)}
                </span>

                <span
                  className={cn(
                    "text-base px-2 py-px rounded-md flex justify-center items-center before:contents-[''] before:absolute before:left-0 before:w-2 before:h-px after:contents-[''] after:absolute after:right-0 after:w-2 after:h-px",
                    isRunning &&
                      !isTimeOff &&
                      "text-card-foreground before:bg-success/50 after:bg-success/50",
                    isRunning &&
                      isTimeOff &&
                      "text-card-foreground before:bg-warning/50 after:bg-warning/50",
                    !isRunning &&
                      "text-card-foreground before:bg-primary/50 after:bg-primary/50"
                  )}
                >
                  {isRunning && isTimeOff
                    ? "Rest"
                    : isRest
                    ? "Interval"
                    : isRunning
                    ? "Work"
                    : "Paused"}
                </span>
              </h1>
            </div>
          </motion.div>
        )}

        <motion.div
          initial="open"
          animate={isSettingsOpened ? "open" : "closed"}
          variants={indicatorsAnimation}
          className="space-y-4 w-full flex flex-col mx-4"
        >
          {Array.from({ length: config.sets }).map((_, setIndex) => (
            <div className="w-full" key={setIndex}>
              {setIndex === currentSet && isRest ? (
                <div
                  className={cn("h-1 bg-stone-700 rounded")}
                  style={{
                    background: `linear-gradient(to right,
                    hsl(var(--success)) ${restProgress}%,
                    hsl(var(--ring)) ${restProgress}%)`,
                  }}
                />
              ) : (
                <RoundDots setIndex={setIndex} />
              )}
            </div>
          ))}
        </motion.div>

        <div
          className={cn(
            "flex gap-2 items-center justify-end relative ml-4 -mt-2",
            isSettingsOpened ? "hidden" : "flex"
          )}
        >
          <TimerButton
            onClick={() => {
              setIsRunning(!isRunning);
              setIsSettingsOpened(false);
            }}
            isRest={isRest}
            isPaused={!isRunning}
            isTimeOff={isTimeOff}
            countdown={intervalCountdown}
            totalTime={isTimeOff ? timeOffSeconds : timeOnSeconds}
            disabled={isSettingsOpened}
          />

          <div className="w-9 h-px bg-primary absolute -right-8 -mt-1" />
        </div>
      </motion.div>
    </motion.section>
  );
};
