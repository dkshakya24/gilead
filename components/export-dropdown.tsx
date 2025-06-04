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

export default function ExportDropdown({ disabled }: { disabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    },
    {
      label: "PDF",
      icon: <FileCheck className="h-5 w-5 text-[#C5203F]" />,
    },
    {
      label: "PPT",
      icon: <FileBarChart2 className="h-5 w-5 text-orange-500" />,
    },
    {
      label: "Mail",
      icon: <Mail className="h-5 w-5 text-[#C5203F]" />,
    },
  ];

  return (
    <div className="flex gap-4">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          aria-expanded={isOpen}
          aria-haspopup="true"
          disabled={disabled}
          className={`flex h-[38px] items-center gap-x-2 px-3 py-2 rounded-3xl border text-sm transition
            ${
              disabled
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
                  className={`flex w-full ${
                    exportOptions.length === index + 1
                      ? ""
                      : "border-b border-gray-200"
                  } items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50`}
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
