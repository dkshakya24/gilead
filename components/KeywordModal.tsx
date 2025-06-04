"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { MonthSlider } from "./month-slider";
import { YearSlider } from "./year-slider";

interface Keyword {
  id: string;
  title: string;
  description: string;
}

interface KeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeywordModal({ isOpen, onClose }: KeywordModalProps) {
  const [searchValue, setSearchValue] = useState("");
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: "1",
      title: "Keyword 1",
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      id: "2",
      title: "Keyword 2",
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
  ]);
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");

  const handleAddKeyword = () => {
    if (!searchValue.trim()) return;

    const newKeyword: Keyword = {
      id: Date.now().toString(),
      title: searchValue,
      description: "Lorem ipsum dolor sit amet consectetur.",
    };

    setKeywords([...keywords, newKeyword]);
    setSearchValue("");
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords(keywords.filter((keyword) => keyword.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left text-[16px] font-medium text-[#27272A]">
            Add Keywords
          </DialogTitle>
        </DialogHeader>
        <div className="h-px bg-gray-200 -mx-6" />

        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search Keywords here..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-4 py-2 shadow-sm"
            />
          </div>
          <Button
            onClick={handleAddKeyword}
            className="bg-white text-red-600 border border-red-600 hover:bg-red-50 cursor-pointer hover:text-red-700"
          >
            Add
          </Button>
        </div>

        <div>
          <h3 className="text-[14px] font-normal text-[#27272A] mt-2 mb-4">
            Added Keywords
          </h3>

          <div className="space-y-4">
            {keywords.map((keyword) => (
              <div key={keyword.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-normal text-[14px] text-[#000000]">
                      {keyword.title}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {keyword.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteKeyword(keyword.id)}
                    className="h-8 w-8 cursor-pointer rounded-full bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>

                {keyword.id === "1" && (
                  <div className="mt-4 bg-[#F8F8FA] p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Choose Timeframe
                      </span>
                      <div className="flex gap-1 bg-white rounded-2xl p-2">
                        <Button
                          size="sm"
                          onClick={() => setTimeframe("monthly")}
                          className={`px-3 py-1 text-xs cursor-pointer rounded-md ${
                            timeframe === "monthly"
                              ? "bg-gradient-to-b from-[#E44F6B] to-[#C5203F] text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Monthly
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => setTimeframe("yearly")}
                          className={`px-3 py-1 text-xs cursor-pointer rounded-md ${
                            timeframe === "yearly"
                              ? "bg-gradient-to-b from-[#E44F6B] to-[#C5203F] text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Yearly
                        </Button>
                      </div>
                    </div>

                    {/* Conditionally render MonthSlider or YearSlider */}
                    {timeframe === "monthly" ? <MonthSlider /> : <YearSlider />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            className="bg-[#C5203F] cursor-pointer hover:bg-red-600 text-white"
            onClick={onClose}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
