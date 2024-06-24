import { createContext, useState } from "react";

type point = {
  price: number;
  time: number;
};

type range = {
  symbol: string;
  rangeId: string | null;
  rangePoints: point[];
  toleranceInput: number | null;
};

interface RangeContextState {
  range: range | null;
  addRange: (range: range) => void;
  updateRangePoints: (rangePoints: point[]) => void;
  updateRangeToleranceInput: (toleranceInput: number) => void;
  updateRangeId: (newRangeId: string) => void;
  removeRange: () => void;
  specialCandles: number[];
  setSpecialCandles: (candles: number[]) => void;
}

export const RangeContext = createContext<RangeContextState>({
  range: null,
  addRange: () => {},
  updateRangePoints: () => {},
  updateRangeToleranceInput: () => {},
  updateRangeId: () => {},
  removeRange: () => {},
  specialCandles: [],
  setSpecialCandles: () => {},
});

export const RangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [range, setRange] = useState<range | null>(null);
  const [specialCandles, setSpecialCandles] = useState<number[]>([]);

  const addRange = (range: range) => {
    setRange(range);
  };
  const updateRangePoints = (rangePoints: point[]) => {
    setRange((prevRange) => {
      if (prevRange) {
        return {
          ...prevRange,
          rangePoints: rangePoints,
        };
      } else {
        // Handle the case where prevRange is null
        return {
          symbol: "",
          rangeId: null,
          rangePoints: rangePoints,
          toleranceInput: null,
        };
      }
    });
  };
  const updateRangeToleranceInput = (toleranceInput: number) => {
    setRange((prevRange) => {
      if (prevRange) {
        return {
          ...prevRange,
          toleranceInput: toleranceInput,
        };
      } else {
        // Handle the case where prevRange is null
        return {
          symbol: "",
          rangeId: null,
          rangePoints: [],
          toleranceInput: toleranceInput,
        };
      }
    });
  };
  const updateRangeId = (newRangeId: string) => {
    setRange((prevRange) => {
      if (prevRange) {
        return {
          ...prevRange,
          rangeId: newRangeId,
        };
      } else {
        // Handle the case where prevRange is null
        return {
          symbol: "",
          rangeId: newRangeId,
          rangePoints: [],
          toleranceInput: null,
        };
      }
    });
  };

  const removeRange = () => {
    setRange(null);
    setSpecialCandles([]);
  };

  return (
    <RangeContext.Provider
      value={{
        range,
        addRange,
        updateRangePoints,
        updateRangeToleranceInput,
        updateRangeId,
        removeRange,
        specialCandles,
        setSpecialCandles,
      }}
    >
      {children}
    </RangeContext.Provider>
  );
};
