"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ChatList from "@/components/chat-list";
import PromptForm from "@/components/prompt-form";
import { generateSessionId } from "@/lib/utils";
import { Session } from "@/lib/types";

const ChatContent = ({ session }: { session: Session }) => {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState("");
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
    <>
      {/* Sticky Header */}
      {/* <div className="sticky top-0 bg-white z-10"><Header /></div> */}

      {/* Scrollable Chat List */}
      <div className="flex-1 w-full overflow-y-auto mx-auto rounded-lg px-[150px]">
        <ChatList sessionId={sessionId} session={session} />
      </div>

      {/* Sticky Prompt Form */}
      <div className="sticky bottom-0 mx-auto w-[60%] bg-white pt-3">
        <PromptForm sessionId={sessionId} />
      </div>
    </>
  );
};

const Chatlayout = ({ session }: { session: Session }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent session={session} />
    </Suspense>
  );
};

export default Chatlayout;
