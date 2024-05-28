import { candleBars } from "./ChartModule.js";
import {
  // parseFullSymbol,
  getBarsApiRequest,
  // formatDate,
  // candleBars,
} from "./helpers.js";

import { subscribeOnStream, unsubscribeFromStream } from "./streaming.js";

const configurationData = {
  supported_resolutions: ["1"],
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

    //setting the resolution and type for the API
    // let resln;
    let type;
    if (resolution === "1D" || resolution === "1W" || resolution === "1M") {
      // resln = "1D";
      type = "day";
    } else if (resolution === "60" || resolution === "240") {
      // resln = "1H";
      type = "hour";
    } else if (
      resolution === "1" ||
      resolution === "5" ||
      resolution === "15" ||
      resolution === "30"
    ) {
      // resln = "1M";
      type = "minute";
    }

    // getting bars from the API and passing them to the chart

    try {
      let data = {};
      data = await getBarsApiRequest(
        symbolInfo.full_name,
        type,
        from * 1000,
        to * 1000,
        2000
      );
      if (
        (data.Response && data.Response === "Error") ||
        data.resultsCount === 0
      ) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], { noData: true });
        return;
      }
      let bars = data.results.map((agg) => ({
        time: agg.t,
        open: agg.o,
        high: agg.h,
        low: agg.l,
        close: agg.c,
        volume: agg.v,
        test: 123,
      }));
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, { ...bars[bars.length - 1] });
      }

      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      candleBars.unshift(...bars);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },
  subscribeBars: async (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    console.log(
      "[subscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name)
    );
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    unsubscribeFromStream(subscriberUID);
  },
};

export default dataFeedObject;
