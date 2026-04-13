import { create } from 'zustand';
import type { ChatMessage } from '@/types';

interface ChatState {
  currentMatchId: string | null;
  messages: ChatMessage[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;

  setCurrentMatchId: (matchId: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setUnreadCount: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentMatchId: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  hasMore: true,

  setCurrentMatchId: (matchId) => set({ currentMatchId: matchId }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setHasMore: (hasMore) => set({ hasMore }),
  clearChat: () =>
    set({
      currentMatchId: null,
      messages: [],
      unreadCount: 0,
      hasMore: true,
    }),
}));