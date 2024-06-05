import { getHistoricalBars, getTimestamp } from "./helpers.js";

const configurationData = {
  supported_resolutions: ["1D"],
  exchanges: [],
  symbols_types: [
    { name: "crypto", value: "crypto" },
    { name: "stock", value: "stock" },
    { name: "forex", value: "forex" },
    { name: "index", value: "index" },
    { name: "commodity", value: "commodity" },
  ],
};

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map();
let currentResolution = "";

const dataFeedObject = {
  onReady: (callback) => {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData));
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
    // extension
  ) => {
    console.log("[resolveSymbol]: Method call", symbolName);

    //  hardcode the symbol object
    const symbolItem = {
      symbol: symbolName,
      description: symbolName,
      type: localStorage.getItem("market"),
    };

    if (!symbolItem) {
      console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
      onResolveErrorCallback("Cannot resolve symbol");
      return;
    }

    // Symbol information object
    const symbolInfo = {
      ticker: symbolItem.symbol,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 1000,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 5,
      data_status: "streaming",
    };

    console.log("[resolveSymbol]: Symbol resolved", symbolName);

    // just for this example we will use a timeout to simulate a server response
    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfo);
    }, 0);

    // onSymbolResolvedCallback(symbolInfo);
  },
  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log(
      "[getBars]: Method call",
      symbolInfo,
      resolution,
      from * 1000,
      to * 1000
    );

    // If the resolution has changed, run the changeCandleSize function
    if (currentResolution !== resolution) {
      currentResolution = resolution;
    }

    try {
      const rawData = await getHistoricalBars(symbolInfo.full_name);

      // creating OHLC Objects
      const bars = Object.keys(rawData.time).map((index) => {
        return {
          time: getTimestamp(rawData.time[index]),
          open: rawData.open[index],
          high: rawData.high[index],
          low: rawData.low[index],
          close: rawData.close[index],
          volume: rawData.volume[index],
          is_special: rawData.is_special[index],
        };
      });
      if (bars.length === 0) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], { noData: true });
        return;
      }
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, { ...bars[bars.length - 1] });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID
    // onResetCacheNeededCallback
  ) => {
    console.log(
      "[subscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
  },
};

export default dataFeedObject;
