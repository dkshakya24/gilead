"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ChatList from "@/components/chat-list";
import Header from "@/components/Header";
import PromptForm from "@/components/prompt-form";
import { generateSessionId } from "@/lib/utils";

const ChatContent = () => {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState('');
  const id = searchParams.get("sessionId");

  useEffect(() => {
    if (id) {
      setSessionId(id);
    } else {
      // Generate new session ID for new chat
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
    }
  }, [id]);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col border-2 border-solid border-gray-200 rounded-xl mr-4 my-4 p-4 overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-10">
        <Header />
      </div>

      {/* Scrollable Chat List */}
      <div className="flex-1 w-full overflow-y-auto mx-auto rounded-lg px-[150px]">
        <ChatList sessionId={sessionId} />
      </div>

      {/* Sticky Prompt Form */}
      <div className="sticky bottom-0 mx-auto w-[60%] bg-white pt-3">
        <PromptForm sessionId={sessionId} />
      </div>
    </div>
  );
};

const Chat = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
};

export default Chat;
