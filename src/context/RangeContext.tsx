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
  ranges: range[];
  addRange: (range: range) => void;
  updateRangePoints: (rangePoints: point[], rangeId: string) => void;
  updateRangeToleranceInput: (toleranceInput: number, rangeId: string) => void;
  updateRangeId: (rangeId: string, newRangeId: string) => void;
  removeRange: (rangeId: string) => void;
  specialCandles: number[];
  addSpecialCandle: (candle: number) => void;
  setSpecialCandles: (candles: number[]) => void;
}

export const RangeContext = createContext<RangeContextState>({
  ranges: [],
  addRange: () => {},
  updateRangePoints: () => {},
  updateRangeToleranceInput: () => {},
  updateRangeId: () => {},
  removeRange: () => {},
  specialCandles: [],
  addSpecialCandle: () => {},
  setSpecialCandles: () => {},
});

let addSpecialCandle;

export const RangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [ranges, setRanges] = useState<range[]>([]);
  const [specialCandles, setSpecialCandles] = useState<number[]>([]);

  addSpecialCandle = (candle: number) => {
    if (specialCandles.includes(candle)) {
      return;
    }
    setSpecialCandles((prevCandles) => {
      const tempCandles = [...prevCandles];
      tempCandles.push(candle);
      return tempCandles;
    });
  };

  const addRange = (range: range) => {
    setRanges((prevRanges) => {
      const tempRanges = [...prevRanges];
      tempRanges.push(range);
      return tempRanges;
    });
  };
  const updateRangePoints = (rangePoints: point[], rangeId: string) => {
    setRanges((prevRanges) => {
      const tempRanges = [...prevRanges];
      const index = tempRanges.findIndex((range) => range.rangeId === rangeId);
      tempRanges[index].rangePoints = rangePoints;
      return tempRanges;
    });
  };
  const updateRangeToleranceInput = (
    toleranceInput: number,
    rangeId: string
  ) => {
    setRanges((prevRanges) => {
      const tempRanges = [...prevRanges];
      const index = tempRanges.findIndex((range) => range.rangeId === rangeId);
      tempRanges[index].toleranceInput = toleranceInput;
      return tempRanges;
    });
  };
  const updateRangeId = (rangeId: string, newRangeId: string) => {
    setRanges((prevRanges) => {
      const tempRanges = [...prevRanges];
      const index = tempRanges.findIndex((range) => range.rangeId === rangeId);
      tempRanges[index].rangeId = newRangeId;
      return tempRanges;
    });
  };

  const removeRange = (rangeId: string) => {
    setRanges((prevRanges) => {
      const tempRanges = [...prevRanges];
      const index = tempRanges.findIndex((range) => range.rangeId === rangeId);
      tempRanges.splice(index, 1);
      return tempRanges;
    });
  };

  return (
    <RangeContext.Provider
      value={{
        ranges,
        addRange,
        updateRangePoints,
        updateRangeToleranceInput,
        updateRangeId,
        removeRange,
        specialCandles,
        addSpecialCandle,
        setSpecialCandles,
      }}
    >
      {children}
    </RangeContext.Provider>
  );
};

export const updateSpecialCandelsExternally = (candle: number) => {
  addSpecialCandle(candle);
};
