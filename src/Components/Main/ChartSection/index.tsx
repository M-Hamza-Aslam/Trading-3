import { useContext, useState } from "react";
import AdvanceChart from "./Chart/AdvanceChart.jsx";
import RangeModal from "../RangeModal/index.js";

import { SymbolsContext } from "../../../context/SymbolsContext";
import { RangeContext } from "../../../context/RangeContext";
import SpecialCandelsList from "./SpecialCandelsList.js";
import { Tooltip } from "flowbite-react";

const ChartSection = () => {
  const { selectedSymbol } = useContext(SymbolsContext);
  const { range, specialCandles, setSpecialCandles } = useContext(RangeContext);
  const [isShowRangeModal, setIsShowRangeModal] = useState(false);
  // const [showChart, setShowChart] = useState(false);
  const status = selectedSymbol ? 1 : 0;

  const symbol = selectedSymbol;

  const performAnalysisHandler = () => {
    setIsShowRangeModal(true);
    setSpecialCandles([]);
  };
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
          {status === 1 && (
            <>
              <div className="w-full flex justify-center">
                <Tooltip
                  content="Select a range on chart"
                  style="dark"
                  placement="right"
                  className={`${range && "invisible"}`}
                >
                  <button
                    type="button"
                    disabled={!range}
                    onClick={performAnalysisHandler}
                    className=" bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Perform Advance Analysis
                  </button>
                </Tooltip>
              </div>

              <div className="flex gap-4">
                {specialCandles.length > 0 && (
                  <SpecialCandelsList specialCandles={specialCandles} />
                )}
                <div className="flex-grow">
                  <AdvanceChart coinId={symbol} />
                </div>
              </div>
            </>
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
