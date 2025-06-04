"use client";

import { useState } from "react";
import { X, Trash2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface UploadedUrl {
  id: string;
  url: string;
  description: string;
  progress?: number;
  isLoading?: boolean;
}

export function IngestUrlModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [inputUrl, setInputUrl] = useState("");
  const [uploadedUrls, setUploadedUrls] = useState<UploadedUrl[]>([
    {
      id: "1",
      url: "drugs.com",
      description: "Lorem ipsum dolor sit amet consectetur.",
      progress: 75,
      isLoading: true,
    },
    {
      id: "2",
      url: "goodrx.com",
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
  ]);

  const handleAddUrl = () => {
    if (!inputUrl.trim()) return;

    const newUrl: UploadedUrl = {
      id: Date.now().toString(),
      url: inputUrl,
      description: "Lorem ipsum dolor sit amet consectetur.",
      progress: 0,
      isLoading: true,
    };

    setUploadedUrls([...uploadedUrls, newUrl]);
    setInputUrl("");

    // Simulate progress (in a real app, this would be based on actual upload progress)

    setTimeout(() => {
      setUploadedUrls((prev) =>
        prev.map((item) =>
          item.id === newUrl.id
            ? { ...item, progress: 30, isLoading: false }
            : item
        )
      );
    }, 1000);

    setTimeout(() => {
      setUploadedUrls((prev) =>
        prev.map((item) =>
          item.id === newUrl.id
            ? { ...item, progress: 60, isLoading: false }
            : item
        )
      );
    }, 2000);

    setTimeout(() => {
      setUploadedUrls((prev) =>
        prev.map((item) =>
          item.id === newUrl.id
            ? { ...item, progress: 99, isLoading: false }
            : item
        )
      );
    }, 3000);

    setTimeout(() => {
      setUploadedUrls((prev) =>
        prev.map((item) =>
          item.id === newUrl.id
            ? { ...item, progress: 100, isLoading: false }
            : item
        )
      );
    }, 4000);
  };

  const handleRemoveUrl = (id: string) => {
    setUploadedUrls(uploadedUrls.filter((url) => url.id !== id));
  };

  const handleSave = () => {
    // Handle save logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-left text-[16px] font-medium text-[#27272A]">
            INGEST URL
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <Link className="h-5 w-5 text-gray-400" />
            <Input
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Paste Link Here"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            />
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-red-600 border border-red-600 hover:bg-red-50 cursor-pointer hover:text-red-700"
              onClick={handleAddUrl}
            >
              Add
            </Button>
          </div>
        </div>

        {uploadedUrls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm text-[#27272A] font-normal mb-2">
              Uploaded URL&apos;s
            </h3>
            <div className="space-y-2">
              {uploadedUrls.map((item) => (
                <div key={item.id} className="border rounded-md p-3 relative">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {item.url.includes("drugs") ? (
                        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">
                            Rx
                          </span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                          <span className="text-yellow-600 text-xs font-bold">
                            +
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#000000] font-medium">
                        {item.url}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.isLoading ? (
                        <button
                          className="text-gray-400 hover:text-gray-500 cursor-pointer"
                          onClick={() => handleRemoveUrl(item.id)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          className="text-gray-400 hover:text-gray-500 cursor-pointer"
                          onClick={() => handleRemoveUrl(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.progress !== undefined && item.progress < 100 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-red-600 h-1.5 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            className="bg-[#C5203F] cursor-pointer hover:bg-red-600 text-white"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
