import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { redirect } from "next/navigation";

import ChatForm from "@/components/chat-form";

export default async function IndexPage() {
  // const id = await getChatId()
  const session = (await auth()) as Session;
  if (!session) {
    redirect("/login");
  }
  console.log(session, "session122");

  return (
    <>
      <ChatForm />
    </>
  );
}
