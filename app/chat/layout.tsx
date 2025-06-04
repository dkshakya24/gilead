import { auth } from "@/auth";
import Header from "@/components/Header";
import InsightsPaneWrapper from "@/components/insights-panel-wrapper";
import Sidebar from "@/components/Sidebar";
import { Session } from "@/lib/types";
import { redirect } from "next/navigation";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const session = (await auth()) as Session;
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar session={session} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="h-[calc(100vh-2rem)] flex flex-col border-2 border-solid border-gray-200 rounded-xl mr-4 my-4 p-4 overflow-hidden">
          <Header />
          {children}
        </div>
      </main>
      <InsightsPaneWrapper />
    </div>
  );
}
