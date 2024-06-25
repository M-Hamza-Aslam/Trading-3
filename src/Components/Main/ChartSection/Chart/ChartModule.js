import { widget } from "../../../../charting_library";
import { getLanguageFromURL } from "./helpers.js";
import Datafeed from "./datafeed";
import { customIndicatorStudy } from "./CustomIndicatorStudy.js";

export let chartDetails = {
  Widget: null,
};

let newRangeEvent = false;
export let LocalRangeId = null;
export let AdvancedColoringCandlesStudyId = null;
export const createCustomIndicatorStudy = async () => {
  const study = await chartDetails.Widget.activeChart().createStudy(
    "Advanced Coloring Candles",
    false,
    false
  );
  chartDetails.Widget.chart().getStudyById(study).bringToFront();
  AdvancedColoringCandlesStudyId = study;
};
export const removeCustomIndicatorStudy = async () => {
  if (AdvancedColoringCandlesStudyId) {
    await chartDetails.Widget.chart().removeEntity(
      AdvancedColoringCandlesStudyId
    );
    AdvancedColoringCandlesStudyId = null;
  }
};

export function initializeChart(
  chartContainerRef,
  symbol,
  range,
  addRange,
  updateRangePoints,
  updateRangeId,
  removeRange
) {
  // Initialize the chart widget if it doesn't exist
  const widgetOptions = {
    //this is temporary solution for bitfinex symbols
    symbol: symbol,
    // BEWARE: no trailing slash is expected in feed URL
    datafeed: Datafeed,
    interval: "1D",
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
      "study_dialog_fundamentaldata",
      "study_buttons",
    ],
    enabled_features: [
      "study_templates",
      "header_widget",
      "study_dialog_fundamentaldata",
    ],
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    fullscreen: false,
    autosize: true,
    theme: "Dark",
    custom_indicators_getter: customIndicatorStudy,
  };

  chartDetails.Widget = new widget(widgetOptions);
  chartDetails.Widget.onChartReady(async () => {
    console.log("chart ready");

    chartDetails.Widget.activeChart().dataReady(() => {
      console.log("Chart Data is loaded");
    });
    if (range) {
      const newRangeId = chartDetails.Widget.chart().createMultipointShape(
        range.rangePoints,
        {
          shape: "date_and_price_range",
        }
      );
      updateRangeId(range.rangeId, newRangeId);
      LocalRangeId = newRangeId;
      createCustomIndicatorStudy();
    }
    chartDetails.Widget.subscribe("drawing", (event) => {
      console.log("drawing: ", event);
      if (
        event.category === "drawings" &&
        event.value === "LineToolDateAndPriceRange"
      ) {
        newRangeEvent = true;
      }
    });
    chartDetails.Widget.subscribe("drawing_event", (id, type) => {
      console.log("drawing event: ", id, LocalRangeId, type);

      if (type === "create" && newRangeEvent) {
        const points = chartDetails.Widget.activeChart()
          .getShapeById(id)
          .getPoints();
        //add new range and remove the previous one
        if (LocalRangeId) {
          removeCustomIndicatorStudy();
          removeRange(LocalRangeId);
        }
        const range = {
          symbol: symbol,
          rangeId: id,
          rangePoints: points,
          toleranceInput: 0,
        };
        addRange(range);
        LocalRangeId = id;
        newRangeEvent = false;
      } else if (type === "remove" && id === LocalRangeId) {
        console.log("removing");
        removeRange(id);
        LocalRangeId = null;
        chartDetails.Widget.activeChart().removeAllStudies();
      } else if (type === "points_changed" && id === LocalRangeId) {
        const points = chartDetails.Widget.activeChart()
          .getShapeById(id)
          .getPoints();
        console.log(points);
        updateRangePoints(points, id);
      }
    });
  });
}
