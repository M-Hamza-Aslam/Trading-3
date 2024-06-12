import { useContext, useState } from "react";
import AdvanceChart from "./Chart/AdvanceChart.jsx";
import RangeModal from "../RangeModal/index.js";

import { SymbolsContext } from "../../../context/SymbolsContext";
import { RangeContext } from "../../../context/RangeContext";
import SpecialCandelsList from "./SpecialCandelsList.js";

const ChartSection = () => {
  const { selectedSymbol } = useContext(SymbolsContext);
  const { ranges, specialCandles } = useContext(RangeContext);
  const [isShowRangeModal, setIsShowRangeModal] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const status = selectedSymbol && showChart ? 2 : selectedSymbol ? 1 : 0;

  //hardcoded for now
  const symbol = selectedSymbol;
  const range = ranges.filter((range) => range.symbol === symbol)[0];
  return (
    <>
      {status === 0 ? (
        <div className="w-full">
          <h3 className="text-gray-400 font-semibold text-sm sm:text-lg text-center">
            Please Select a Symbol
          </h3>
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-4 ">
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setShowChart(!showChart)}
              className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            >
              {status === 1
                ? "Show TradingView chart"
                : "Hide TradingView chart"}
            </button>
            {range && (
              <button
                type="button"
                onClick={() => setIsShowRangeModal(true)}
                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              >
                Perform Advance Analysis
              </button>
            )}
          </div>
          {status === 2 && (
            <div className="flex gap-4">
              {specialCandles.length > 0 && (
                <SpecialCandelsList specialCandles={specialCandles} />
              )}
              <div className="flex-grow">
                <AdvanceChart coinId={symbol} />
              </div>
            </div>
          )}

          {isShowRangeModal && (
            <RangeModal
              closeModalHandler={() => setIsShowRangeModal(false)}
              symbol={symbol as string}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ChartSection;
