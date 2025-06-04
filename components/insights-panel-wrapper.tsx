'use client'
import React from "react";
import InsightsPanel from "@/components/insights-panel";
import { usePanelStore } from "@/store/InsightsStore";

export default function InsightsPaneWrapper() {
  const { open } = usePanelStore();

  return (
    <>
      {open && (
        <div className="my-4 w-full max-w-[280px] mr-4 overflow-y-auto border-2 border-solid border-gray-200 rounded-xl">
          <InsightsPanel />
        </div>
      )}
    </>
  );
}
