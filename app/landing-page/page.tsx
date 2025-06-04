"use client";

import { useState } from "react";
import { ArrowRight, LinkIcon, List } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReasoningFactor from "@/components/ReasoningFactor";
import { IngestUrlModal } from "@/components/ingest-url-modal";
import { KeywordModal } from "@/components/KeywordModal";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);

  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative">
        {/* GILEAD Logo */}
        <div className="absolute top-6 left-6">
          <Image
            src="/GileadLogo.svg"
            alt="Gilead Logo"
            width={123}
            height={31}
            className="mb-5"
          />
        </div>

        {/* Centered Content */}
        <div className="flex flex-col items-center space-y-3">
          <Image
            src="/LandingPageImage.svg"
            alt="Logo"
            width={140}
            height={140}
            className="rounded-full"
          />
          <div className="text-[24px] font-medium text-center bg-gradient-to-r from-[#FF9892] to-[#870002] bg-clip-text text-transparent">
            Welcome to GABI ARC, Ashleigh Koss!
          </div>

          <p className="text-[#666666] text-center text-[16px]">
            Ask me anything – from quick info to deep dives, I&apos;m here to
            assist you anytime.
          </p>

          {/* Input Box */}
          <div className="mt-4 w-[700px] shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-xl p-4">
            <textarea
              placeholder="Ask Anything here..."
              rows={2}
              className="w-full text-gray-700 h-[80px] resize-none border-none outline-none"
            />

            {/* Actions */}
            <div className="flex items-center cursor-pointer flex-wrap gap-x-4">
              {/* Reasoning Selector Dropdown */}
              <ReasoningFactor disabled={false} />

              {/* URL and Keywords */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center cursor-pointer px-3 py-2 border border-gray-300 rounded-full text-sm text-gray-600"
                >
                  <LinkIcon className="w-4 h-4 mr-1" /> URL
                </button>
                <button
                  onClick={() => setIsKeywordModalOpen(true)}
                  className="flex items-center cursor-pointer px-3 py-2 border border-gray-300 rounded-full text-sm text-gray-600"
                >
                  <List className="w-4 h-4 mr-1" /> Keywords
                </button>
              </div>

              {/* Submit */}
              <div className="ml-auto">
                <button
                  onClick={() => router.push("/chat")}
                  className="bg-[#C5203F] cursor-pointer p-2 rounded-full text-white hover:bg-red-600"
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IngestUrlModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <KeywordModal
        isOpen={isKeywordModalOpen}
        onClose={() => setIsKeywordModalOpen(false)}
      />
    </>
  );
}
