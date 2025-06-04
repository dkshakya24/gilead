"use client";

import * as React from "react";
import { Search, LogOut, Plus } from "lucide-react";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";
// import { username } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { Session } from "@/lib/types";

type ChatItem = {
  Session_id: string;
  user_id: string;
  deletedAt: string | null;
  deletedReason: string | null;
  deletedBy: string | null;
  created_time: string;
  header_name: string;
};

type ApiResponse = {
  today: ChatItem[];
  others: ChatItem[];
};

const Sidebar = ({ session }: { session?: Session }) => {
  const router = useRouter();
  const { clearMessages } = useChatStore();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(0);
  const [today, setToday] = React.useState<ChatItem[]>([]);
  const [others, setOthers] = React.useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev/get-chat-history?user_id=${session?.user?.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: ApiResponse = await response.json();
        setToday(data.today);
        setOthers(data.others);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleChatClick = (sessionId: string, index: number) => {
    setActiveIndex(index);
    router.push(`/chat?sessionId=${sessionId}`);
  };

  const handleNewChat = () => {
    clearMessages(); // Clear all messages
    setActiveIndex(null); // Reset active chat
    router.push("/chat"); // Navigate to chat without sessionId
  };

  const renderChatList = (chats: ChatItem[], title: string) => (
    <div className="px-3 mb-4">
      <h3 className="text-sm font-medium text-[#7893A4] mb-2">{title}</h3>
      <ul className="space-y-1">
        {chats.map((chat, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={chat.Session_id}>
              <button
                onClick={() => handleChatClick(chat.Session_id, index)}
                className={cn(
                  "relative flex cursor-pointer items-center rounded-md py-2 pl-3 pr-3 text-sm group text-left w-full",
                  isActive ? "bg-[#F7F7F7]" : "hover:bg-[#F7F7F7]"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-[8px] bottom-[8px] w-1 bg-[#C5203F] rounded-r" />
                )}
                <div className="flex justify-between items-center w-full gap-[10px]">
                  <span
                    title={chat.header_name}
                    className={cn(
                      "truncate",
                      isActive ? "text-[#27272A]" : "text-[#72737C]"
                    )}
                  >
                    {chat.header_name}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatTime(chat.created_time)}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className="w-[320px] h-screen flex flex-col">
      <div className="m-4 h-full flex flex-col border-2 border-solid border-gray-200 rounded-xl">
        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-[#d1214c] hover:bg-[#b91c43] text-white py-3 px-4 rounded-md"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="px-3 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="px-3 text-center text-red-500">{error}</div>
          ) : (
            <>
              {renderChatList(today, "Today")}
              {renderChatList(others, "Others")}
            </>
          )}
        </div>

        {/* Log Out */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center cursor-pointer mx-auto gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
