import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { redirect } from "next/navigation";

import Chatlayout from "@/components/chat-layout";

export default async function IndexPage() {
  // const id = await getChatId()
  const session = (await auth()) as Session;
  if (!session) {
    redirect("/login");
  }
  console.log(session, "session122");

  return <Chatlayout />;
}
