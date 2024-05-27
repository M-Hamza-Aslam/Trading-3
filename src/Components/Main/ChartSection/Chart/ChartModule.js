import { widget } from "../../../../charting_library";
import { getLanguageFromURL } from "./helpers.js";
import Datafeed from "./datafeed";

export let chartDetails = {
  Widget: null,
};

export let candleBars = [];

export function initializeChart(chartContainerRef, symbol) {
  // Initialize the chart widget if it doesn't exist
  const widgetOptions = {
    //this is temporary solution for bitfinex symbols
    symbol: symbol,
    // BEWARE: no trailing slash is expected in feed URL
    datafeed: Datafeed,
    interval: "1",
    container: chartContainerRef,
    library_path: "/charting_library/",

    locale: getLanguageFromURL() || "en",
    disabled_features: [
      "use_localstorage_for_settings",
      "header_symbol_search",
      "header_compare",
      "control_bar",
      "timeframes_toolbar",
      "go_to_date",
    ],
    enabled_features: ["study_templates"],
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    fullscreen: false,
    autosize: true,
    theme: "Dark",
  };

  chartDetails.Widget = new widget(widgetOptions);
  chartDetails.Widget.onChartReady(() => {
    console.log("chart ready");
    chartDetails.Widget.activeChart().dataReady(() => {
      console.log("Chart Data is loaded");
    });
  });
}
