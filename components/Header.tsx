import Image from "next/image";
import React from "react";
import ReasoningFactor from "./ReasoningFactor";
import { Bell } from "lucide-react";
import { UrlDropdown } from "./URLDropdown";
import { KeywordsDropdown } from "./KeywordsDropdown";
import ExportDropdown from "./export-dropdown";
import ProfileSection from "./personal-details";
import { auth, signOut } from "@/auth";
import { Session } from "@/lib/types";
// import { Session } from "next-auth";

export default async function Header() {
  const session = (await auth()) as Session;
  const handleSignOut = async () => {
    "use server";
    await signOut();
    window.location.href = "/login";
  };
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex justify-between gap-x-4">
        <div>
          <Image
            src="/GileadLogo.svg"
            alt="Gilead Logo"
            width={123}
            height={0}
            className="mb-3"
          />
        </div>
        <div className="flex flex-wrap gap-4 mb-3">
          <ReasoningFactor disabled />
          <UrlDropdown disabled />
          <KeywordsDropdown disabled />
          <ExportDropdown disabled />
          <button className="flex items-center cursor-not-allowed opacity-50 justify-center w-[38px] h-[38px] bg-white border border-gray-200 rounded-full">
            <Bell className="h-4 w-4" />
          </button>
          <ProfileSection handleSignOut={handleSignOut} session={session} />
        </div>
      </div>
    </div>
  );
}
