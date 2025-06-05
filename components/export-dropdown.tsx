"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  ArrowRight,
  FileText,
  FileCheck,
  FileBarChart2,
  Mail,
} from "lucide-react";
import { Session } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export default function ExportDropdown({
  disabled,
  session,
}: {
  disabled: boolean;
  session: Session;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [DOCX, setDOCX] = useState("");
  const [PPT, setPPT] = useState("");
  const [DOCXName, setDOCXName] = useState("");
  const [PPTName, setPPTName] = useState("");
  const [isChatDownloaded, setIsChatDownloaded] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const payload = {
    headers: {
      "User-Id": `${session.user.email}`,
    },
    body: {
      session_id: sessionId,
    },
  };
  const fetchChatFiles = async () => {
    try {
      const response = await fetch(
        `https://g6dy9f8dr4.execute-api.us-east-1.amazonaws.com/dev/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'User-id': userId || '' // Add your user_id in the headers
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data, "kjhjgjhgjghjdeep");
      if (response.ok && data.statusCode === 200) {
        console.log("chat is downloaded");
        setIsChatDownloaded(false);
      }
      setDOCX(data?.body?.docx.file);
      setPPT(data?.body?.pptx.file);
      setDOCXName(data?.body?.docx.fileName);
      setPPTName(data?.body?.pptx.fileName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchChatFiles();
    }
    setIsChatDownloaded(true);
  }, [searchParams]);

  const downloadPPTFile = () => {
    try {
      // MIME type for .pptx files
      const mimeType =
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";

      const base64 = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${PPT}`;
      // Extract base64 data if it includes a MIME type prefix
      const data = base64.startsWith("data:") ? base64.split(",")[1] : base64;

      // Decode base64 string
      const byteCharacters = atob(data);

      // Convert byte characters to byte numbers
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob from the byte array
      const blob = new Blob([byteArray], { type: mimeType });

      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = PPTName; // Default file name for .pptx

      // Append the link to the body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download presentation:", error);
    }
    console.log("clickingwppt");
  };

  const downloadDocxFile = () => {
    try {
      // Base64 string without the Data URI prefix
      const mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      // Check if DOCX is defined and not empty
      if (!DOCX) {
        throw new Error("No document data provided.");
      }
      const base64 = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${DOCX}`;
      // Extract the base64 data part if it includes a MIME type prefix
      const data = base64.startsWith("data:") ? base64.split(",")[1] : base64;

      // Decode the base64 string
      const byteCharacters = atob(data);

      // Convert byte characters to byte numbers
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob from the byte array
      const blob = new Blob([byteArray], { type: mimeType });
      console.log(byteArray, "dkshakya");

      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = DOCXName; // Default file name for .docx
      console.log(link.href, blob, "dkshakya1");

      // Append the link to the body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download document:", error);
    }
    console.log("clickingwork");
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (!disabled) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [disabled]);

  const exportOptions = [
    {
      label: "Word",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      onClick: downloadDocxFile,
      disabled: false,
    },
    {
      label: "PPT",
      icon: <FileBarChart2 className="h-5 w-5 text-orange-500" />,
      onClick: downloadPPTFile,
      disabled: false,
    },
    {
      label: "PDF",
      icon: <FileCheck className="h-5 w-5 text-[#C5203F]" />,
      disabled: true,
    },
    {
      label: "Mail",
      icon: <Mail className="h-5 w-5 text-[#C5203F]" />,
      disabled: true,
    },
  ];

  return (
    <div className="flex gap-4">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            if (!isChatDownloaded) setIsOpen((prev) => !prev);
          }}
          aria-expanded={isOpen}
          aria-haspopup="true"
          // disabled={disabled}
          className={`flex h-[38px] items-center gap-x-2 px-3 py-2 rounded-3xl border text-sm transition
            ${
              isChatDownloaded
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-200 text-black cursor-pointer"
            }`}
        >
          Export
          <Download className="h-4 w-4" />
        </button>

        {isOpen && !disabled && (
          <div className="absolute right-0 mt-1 w-60 p-2 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-200 ring-opacity-5 z-10">
            <div className="py-1">
              {exportOptions.map((option, index) => (
                <button
                  key={option.label}
                  disabled={option.disabled}
                  onClick={option.onClick}
                  className={`flex w-full ${
                    exportOptions.length === index + 1
                      ? ""
                      : "border-b border-gray-200"
                  } items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 ${
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
