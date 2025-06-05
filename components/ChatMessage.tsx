import React from "react";
import { usePanelStore } from "@/store/InsightsStore";
import { cn } from "./utils";
import { Button } from "./button";
import { MessageMarkdown } from "./MessageMarkdown";
import { RefreshCw } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import useWebSocket from "@/hooks/useWebSocket";
import Image from "next/image";
import { format } from "date-fns";
import { useChatStore } from "@/store/chatStore";
import { Session } from "@/lib/types";

type Message = {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  responseTime?: number;
};

export function ChatMessage({
  msg,
  isUser,
  sessionId,
  session,
}: {
  msg: Message;
  isUser: boolean;
  sessionId?: string;
  session?: Session;
}) {
  const { setOpen } = usePanelStore();
  const timestamp = msg.timestamp || new Date();
  const { streamingMessage, isLoading } = useChatStore();
  const { sendMessage } = useWebSocket(
    "wss://7x4ndqse6e.execute-api.us-east-1.amazonaws.com/dev"
  );

  const onResend = (message: string, sessionId: string) => {
    sendMessage(message, sessionId, session?.user?.email);
  };

  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] w-fit",
        isUser ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div className="flex gap-x-2 items-center mt-3 mb-2">
        {!isUser && (
          <Image
            className="dark:invert"
            src="/Group.svg"
            alt="Gilead logo"
            width={12}
            height={12}
            priority
          />
        )}
        <span className="text-xs text-gray-500">
          {format(new Date(timestamp), "p, dd MMM")}
        </span>
        {!isUser && msg.responseTime && (
          <div className="text-xs text-gray-500 ml-2">
            Response Time: {(msg.responseTime / 1000).toFixed(2)} seconds
          </div>
        )}
      </div>

      <div
        className={cn(
          "rounded-2xl px-5 py-3 gap-y-[6px]",
          isUser
            ? "bg-[#DAE1E7] text-[#323F49] rounded-tr-none"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
        )}
      >
        <MessageMarkdown content={msg.content} isUser={isUser} />
        {!isUser && (
          <div className="mt-6 mb-1 flex gap-x-3">
            <Button disabled variant="gradient">
              Compare and Contrast
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setOpen(true)}
              disabled
              leftIcon={<Image src="/ai.svg" alt="ai" width={18} height={18} />}
            >
              AI Powered Insights
            </Button>
          </div>
        )}
      </div>
      {isUser && (
        <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                onClick={() => {
                  if (isLoading || streamingMessage) return;
                  onResend(msg.content, sessionId!);
                }}
                className={`${
                  isLoading || streamingMessage
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <RefreshCw className="h-4 w-8 mt-1" color="gray" />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="bg-black text-white text-xs rounded px-2 py-1 shadow-md"
            >
              {isLoading || streamingMessage
                ? "Please wait for the current response"
                : "Re-send the question"}
              <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
}
