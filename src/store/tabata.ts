import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface TabataConfig {
  sets: number;
  roundsPerSet: number;
  timeOn: string;
  timeOff: string;
  restBetweenSets: string;
}

interface TabataState {
  config: TabataConfig;
  isRunning: boolean;
  currentTime: number;
  currentSet: number;
  currentRound: number;
  isRest: boolean;
  isTimeOff: boolean;
  restProgress: number;
  isSettingsOpened: boolean;

  setIsSettingsOpened: (isSettingsOpened: boolean) => void;
  setConfig: (config: TabataConfig) => void;
  setIsRunning: (isRunning: boolean) => void;
  setCurrentTime: (time: number) => void;
  setCurrentSet: (set: number) => void;
  setCurrentRound: (round: number) => void;
  setIsRest: (isRest: boolean) => void;
  setIsTimeOff: (isTimeOff: boolean) => void;
  setRestProgress: (progress: number) => void;
  resetTimer: () => void;
}

export const initialTabataConfig: TabataConfig = {
  sets: 3,
  roundsPerSet: 8,
  timeOn: "00:20",
  timeOff: "00:10",
  restBetweenSets: "01:00",
};

export const useTabataStore = create<TabataState>()(
  devtools(
    persist(
      (set) => ({
        config: initialTabataConfig,
        isRunning: false,
        currentTime: 0,
        currentSet: 0,
        currentRound: 0,
        isRest: false,
        isTimeOff: false,
        restProgress: 0,
        isSettingsOpened: true,

        setIsSettingsOpened: (isSettingsOpened) => set({ isSettingsOpened }),
        setConfig: (config) => set({ config }),
        setIsRunning: (isRunning) => set({ isRunning }),
        setCurrentTime: (time) => set({ currentTime: time }),
        setCurrentSet: (cSet) => set({ currentSet: cSet }),
        setCurrentRound: (round) => set({ currentRound: round }),
        setIsRest: (isRest) => set({ isRest }),
        setIsTimeOff: (isTimeOff) => set({ isTimeOff }),
        setRestProgress: (progress) => set({ restProgress: progress }),
        resetTimer: () =>
          set({
            isRunning: false,
            currentTime: 0,
            currentSet: 0,
            currentRound: 0,
            isRest: false,
            isTimeOff: false,
            restProgress: 0,
            config: initialTabataConfig,
          }),
      }),
      {
        name: "@timeta/storage",
        partialize: (state) => ({ config: state.config }),
      }
    )
  )
);
