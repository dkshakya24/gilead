import React, { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { ChatMessage } from "./ChatMessage";
import { username } from "@/lib/utils";

export interface ChatEntry {
  role: "user" | "bot";
  content: string;
  created_time: string;
  responseTime?: number;
}

export interface MessageGroup {
  message_id: string;
  message: ChatEntry[];
}

export interface ChatResponse {
  user_id: string;
  session_id: string;
  messages: MessageGroup[];
}

export default function ChatList({ sessionId }: { sessionId: string | null }) {
  const {
    messages,
    streamingMessage,
    isLoading,
    errorMessage,
    setMessages,
    clearMessages,
    setErrorMessage,
  } = useChatStore();
  // Scroll target
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Fetch chat history when sessionId changes
  const fetchChatHistory = useCallback(
    async (sessionId: string) => {
      if (sessionId) {
        try {
          // Clear existing messages before loading new ones
          clearMessages();
          
          const response = await fetch(
            `https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev/get-chat-history?user_id=${username}&session_id=${sessionId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch chat history");
          }

          const data = await response.json();

          // Transform and add messages to the chat store
          if (data.messages) {
            data.messages.forEach((group: MessageGroup) => {
              group.message.forEach((msg: ChatEntry) => {
                setMessages({
                  role: msg.role,
                  content: msg.content,
                  timestamp: new Date(msg.created_time || Date.now()),
                  responseTime: msg.responseTime,
                });
              });
            });
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
          setErrorMessage("Failed to load chat history");
        }
      }
    },
    [clearMessages, setMessages, setErrorMessage]
  );

  useEffect(() => {
    if (sessionId) {
      fetchChatHistory(sessionId);
    }
  }, [fetchChatHistory, sessionId]);

  return (
    <div className="flex flex-col mb-4 space-y-3 w-full overflow-y-auto">
      {messages.map((msg, idx) => (
        <ChatMessage
          key={idx}
          msg={msg}
          isUser={msg.role === "user"}
          sessionId={sessionId ?? ''}
        />
      ))}

      {streamingMessage && (
        <ChatMessage msg={streamingMessage} isUser={false} />
      )}

      {isLoading && !streamingMessage && (
        <div className="flex flex-col max-w-[80%] w-fit mr-auto items-start animate-pulse">
          <div className="flex gap-x-2 items-center mb-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-3 rounded-tl-none space-y-2 w-[300px]">
            <div className="h-3 bg-gray-300 rounded w-[90%]" />
            <div className="h-3 bg-gray-300 rounded w-[80%]" />
            <div className="h-3 bg-gray-300 rounded w-[70%]" />
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="text-[#C5203F] text-sm bg-red-100 border border-red-300 p-2 rounded-md max-w-md">
          {errorMessage}
        </div>
      )}

      {/* 👇 Dummy div for auto-scrolling */}
      <div ref={bottomRef} />
    </div>
  );
}
