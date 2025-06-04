"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfileSection() {
    const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };
  

  return (
    <div className="flex gap-4">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 pl-2 h-[38px] cursor-pointer rounded-3xl border border-gray-200 hover:bg-gray-50"
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4 " />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <div className="overflow-hidden mr-1 h-8 w-8 rounded-full bg-gray-200">
            <Image
              src="/userImage.png"
              alt="Gilead Logo"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-80 origin-top-right rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none">
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src="/userImage.png"
                    alt="Gilead Logo"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="absolute cursor-pointer bottom-0 right-0 rounded-full bg-white p-[6px] shadow-md">
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <h2 className="mb-3 text-[16px] font-medium text-[#27272A">
                Personal details
              </h2>
            </div>

            <div className="mb-3 h-px bg-gray-200"></div>

            <div className="mb-3 space-y-2">
              <div className="flex items-start">
                <span className="mr-2 text-sm text-[#6B7280]">Name :</span>
                <span className="text-sm font-medium text-[#111827]">
                  Ashleigh Koss
                </span>
              </div>

              <div className="flex items-start">
                <span className="mr-2 text-sm text-[#6B7280]">Email :</span>
                <span className="text-sm font-medium text-[#111827]">
                  ashleighkoss@gileadsciences.com
                </span>
              </div>
            </div>

            <div className="mb-3 h-px bg-gray-200"></div>

            <button onClick={handleLogout} className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-md bg-gray-100 px-4 py-3 text-sm font-medium text-[#C5203F] hover:bg-gray-200">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
