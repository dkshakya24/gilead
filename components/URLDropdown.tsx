"use client";

import * as React from "react";
import { ChevronDown, Link2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UrlItem = {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
};

export function UrlDropdown({ disabled }: { disabled: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [urls, setUrls] = React.useState<UrlItem[]>([
    // ... same urls list ...
  ]);

  const [selectedUrls, setSelectedUrls] = React.useState<string[]>([]);

  const toggleUrl = (id: string) => {
    if (disabled) return;
    setSelectedUrls((prev) =>
      prev.includes(id) ? prev.filter((urlId) => urlId !== id) : [...prev, id]
    );
  };

  const deleteUrl = (id: string, e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setUrls((prev) => prev.filter((url) => url.id !== id));
  };

  return (
    <DropdownMenu onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled}
          className={`flex h-[38px] gap-x-2 items-center px-3 rounded-3xl py-2 border text-sm
            ${
              disabled
                ? "opacity-50 cursor-not-allowed  border-gray-200"
                : "cursor-pointer bg-white border-gray-200"
            }`}
        >
          <span>URL</span>
          <ChevronDown
            className={`transition-transform duration-200 w-4 h-4 ${
              !disabled && isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      {!disabled && (
        <DropdownMenuContent className="w-[400px] p-3 rounded-xl">
          <div className="p-0">
            {urls.map((url, index) => (
              <div
                key={url.id}
                className={`flex items-center gap-3 p-3 hover:bg-gray-50 ${
                  urls.length === index + 1 ? "" : "border-b-2 border-gray-200"
                } cursor-pointer`}
                onClick={() => toggleUrl(url.id)}
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedUrls.includes(url.id)}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                  />
                </div>
                {url.icon}
                <div className="flex-1">
                  <div className="font-medium text-sm">{url.name}</div>
                  <div className="text-xs text-gray-500">{url.description}</div>
                </div>
                <button
                  onClick={(e) => deleteUrl(url.id, e)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-red-50 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-[#C5203F]" />
                </button>
              </div>
            ))}
            <button
              disabled={disabled}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-gray-700 
                ${
                  disabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "cursor-pointer bg-gray-100 hover:bg-gray-200"
                }`}
            >
              <Link2 className="h-4 w-4" />
              <span className="font-medium">Add URL</span>
            </button>
          </div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
