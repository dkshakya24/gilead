import { useState, useMemo } from "react";
import { Slider } from "./ui/Slider";

export const GenerateYearLabels = (start: string, end: string): string[] => {
  const result: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  let currentYear = startDate.getFullYear();

  while (currentYear <= endDate.getFullYear()) {
    result.push(currentYear.toString());
    currentYear++;
  }

  return result;
};

export const YearSlider = () => {
  const yearLabels = useMemo(
    () => GenerateYearLabels("2020-01-01", new Date().toISOString()), // example start year 2020
    []
  );
  const [sliderIndex, setSliderIndex] = useState(yearLabels.length - 1);

  return (
    <div className="mt-4 px-1">
      <Slider
        min={0}
        max={yearLabels.length - 1}
        step={1}
        value={[sliderIndex]}
        onValueChange={([val]) => setSliderIndex(val)}
        className="mt-2"
        trackClassName="bg-red-500 h-1"
        thumbClassName="h-5 w-5 bg-red-500 border-2 border-white"
      />

      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{yearLabels[0]}</span>
        <span>{yearLabels[yearLabels.length - 1]}</span>
      </div>

      {/* <div className="mt-2 text-sm text-center text-gray-700">
        Selected Year: <strong>{yearLabels[sliderIndex]}</strong>
      </div> */}
    </div>
  );
};
