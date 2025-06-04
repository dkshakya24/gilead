// store/chatStore.ts
import { create } from "zustand";

// store/chatStore.ts
type Message = {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  responseTime?: number;
};

interface ChatState {
  messages: Message[];
  streamingMessage: Message | null;
  isConnected: boolean;
  isLoading: boolean;
  setConnected: (value: boolean) => void;
  setMessages: (message: Message) => void;
  setStreamingMessage: (message: Message) => void;
  appendStreamingContent: (chunk: string) => void;
  finalizeStreamingMessage: () => void;
  setIsLoading: (value: boolean) => void;
  clearMessages: () => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  streamingMessage: null,
  isConnected: false,
  isLoading: false,

  setConnected: (value) => set({ isConnected: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  errorMessage: null,
  setErrorMessage: (msg) => set({ errorMessage: msg }),

  setMessages: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setStreamingMessage: (message) => set({ streamingMessage: message }),

  appendStreamingContent: (chunk) =>
    set((state) => ({
      streamingMessage: {
        ...state.streamingMessage!,
        content: state.streamingMessage!.content + chunk,
      },
    })),

  finalizeStreamingMessage: () =>
    set((state) => {
      const responseTime =
        Date.now() - (state.messages.at(-1)?.timestamp.getTime() ?? Date.now());

      return {
        messages: [
          ...state.messages,
          {
            ...state.streamingMessage!,
            responseTime, // save response time here
          },
        ],
        streamingMessage: null,
      };
    }),

  clearMessages: () => set({ messages: [], streamingMessage: null }),
}));
