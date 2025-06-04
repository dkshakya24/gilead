import { useState, useMemo } from "react";
import { Slider } from "./ui/Slider";

export const GenerateMonthLabels = (start: string, end: string): string[] => {
  const result: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  while (startDate <= endDate) {
    const month = startDate.toLocaleString("default", { month: "short" });
    const year = startDate.getFullYear().toString().slice(-2);
    result.push(`${month} ${year}`);
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return result;
};

export const MonthSlider = () => {
  const monthLabels = useMemo(
    () => GenerateMonthLabels("2024-01-01", new Date().toISOString()),
    []
  );
  const [sliderIndex, setSliderIndex] = useState(monthLabels.length - 1);

  return (
    <div className="mt-4 px-1">
      <Slider
        min={0}
        max={monthLabels.length - 1}
        step={1}
        value={[sliderIndex]}
        onValueChange={([val]) => setSliderIndex(val)}
        className="mt-2"
        trackClassName="bg-red-500 h-1"
        thumbClassName="h-5 w-5 bg-red-500 border-2 border-white"
      />

      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{monthLabels[0]}</span>
        <span>{monthLabels[monthLabels.length - 1]}</span>
      </div>

      {/* <div className="mt-2 text-sm text-center text-gray-700">
        Selected Month: <strong>{monthLabels[sliderIndex]}</strong>
      </div> */}
    </div>
  );
};
