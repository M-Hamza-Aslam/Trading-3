import { useContext, useState } from "react";
import { SymbolsContext } from "../../../context/SymbolsContext";
import AdvanceChart from "./Chart/AdvanceChart.jsx";

const ChartSection = () => {
  const { selectedSymbol } = useContext(SymbolsContext);
  const [showChart, setShowChart] = useState(false);
  const status = selectedSymbol && showChart ? 2 : selectedSymbol ? 1 : 0;
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
          <button
            type="button"
            onClick={() => setShowChart(!showChart)}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
          >
            {status === 1 ? "Show TradingView chart" : "Hide TradingView chart"}
          </button>
          {status === 2 && <AdvanceChart coinId={"X:BTCEUR"} />}
        </div>
      )}
    </>
  );
};

export default ChartSection;
