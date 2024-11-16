import { create } from 'zustand';
import { Message } from '../types/message';

interface MessageState {
  messages: Message[];
  virtualNumber: string;
  addMessage: (message: Message) => void;
  markAsRead: (id: string) => void;
  setVirtualNumber: (number: string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  virtualNumber: '+1 (555) 0123-456',
  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages],
    })),
  markAsRead: (id) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, isRead: true } : msg
      ),
    })),
  setVirtualNumber: (number) =>
    set(() => ({
      virtualNumber: number,
    })),
}));