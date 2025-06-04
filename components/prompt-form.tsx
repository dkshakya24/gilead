"use client";

import type React from "react";

import { useCallback, useState } from "react";
import { Mic, FileUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import useWebSocket from "@/hooks/useWebSocket";
import { useChatStore } from "@/store/chatStore";

export default function PromptForm({ sessionId }: { sessionId : string}) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useWebSocket(
    "wss://7x4ndqse6e.execute-api.us-east-1.amazonaws.com/dev"
  );
  const { streamingMessage, isLoading } = useChatStore();

  const handleSend = useCallback(() => {
    if (message.trim()) {
      sendMessage(message, sessionId);
      setMessage("");
    }
  }, [sendMessage, message, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex items-center gap-2 w-full")}>
      <button
        type="button"
        className="flex items-center cursor-pointer justify-center h-12 w-12 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
        aria-label="Voice input"
      >
        <Mic className="h-5 w-5" />
      </button>

      <button
        type="button"
        className="flex items-center cursor-pointer justify-center h-12 w-12 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
        aria-label="Upload file"
      >
        <FileUp className="h-5 w-5" />
      </button>

      <div className="relative flex-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Anything..."
          className="w-full h-12 px-4 py-2 bg-gray-100 rounded-lg outline-none placeholder:text-gray-500"
        />
      </div>

      <button
        type="button"
        onClick={handleSend}
        className={cn(
          "flex items-center justify-center h-12 w-12 rounded-lg text-white transition-colors duration-150",
          "bg-[#C5203F] hover:bg-red-600 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        )}
        disabled={
          !message.trim() || streamingMessage ? true : false || isLoading
        }
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
