import { create } from 'zustand';
import type { Match } from '@/types';

interface MatchState {
  currentMatch: Match | null;
  nextMatchTime: string;
  isJoined: boolean;
  isLoading: boolean;

  setCurrentMatch: (match: Match | null) => void;
  setNextMatchTime: (time: string) => void;
  setIsJoined: (joined: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  clearMatch: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  currentMatch: null,
  nextMatchTime: '',
  isJoined: false,
  isLoading: false,

  setCurrentMatch: (match) => set({ currentMatch: match }),
  setNextMatchTime: (time) => set({ nextMatchTime: time }),
  setIsJoined: (joined) => set({ isJoined: joined }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearMatch: () =>
    set({
      currentMatch: null,
      isJoined: false,
    }),
}));