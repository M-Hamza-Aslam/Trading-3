import { widget } from "../../../../charting_library";
import { getLanguageFromURL } from "./helpers.js";
import Datafeed from "./datafeed";

export let chartDetails = {
  Widget: null,
};

const customIndicatorStudy = (PineJS) => {
  return Promise.resolve([
    /* Advanced Coloring Candles */
    {
      name: "Advanced Coloring Candles",
      metainfo: {
        _metainfoVersion: 51,

        id: "advancedcolouringcandles@tv-basicstudies-1",
        name: "Advanced Coloring Candles",
        description: "Advanced Coloring Candles",
        shortDescription: "Advanced Coloring Candles",

        isCustomIndicator: true,
        is_price_study: true, // whether the study should appear on the main series pane.
        linkedToSeries: true, // whether the study price scale should be the same as the main series one.

        format: {
          type: "price",
          precision: 2,
        },

        plots: [
          {
            id: "plot_open",
            type: "ohlc_open",
            target: "plot_candle",
          },
          {
            id: "plot_high",
            type: "ohlc_high",
            target: "plot_candle",
          },
          {
            id: "plot_low",
            type: "ohlc_low",
            target: "plot_candle",
          },
          {
            id: "plot_close",
            type: "ohlc_close",
            target: "plot_candle",
          },
          {
            id: "plot_bar_color",
            type: "ohlc_colorer",
            palette: "palette_bar",
            target: "plot_candle",
          },
          {
            id: "plot_wick_color",
            type: "wick_colorer",
            palette: "palette_wick",
            target: "plot_candle",
          },
          {
            id: "plot_border_color",
            type: "border_colorer",
            palette: "palette_border",
            target: "plot_candle",
          },
        ],

        palettes: {
          palette_bar: {
            colors: [{ name: "Green" }, { name: "Red" }, { name: "Blue" }],
            valToIndex: {
              0: 0,
              1: 1,
              2: 2,
            },
          },
          palette_wick: {
            colors: [{ name: "Green" }, { name: "Red" }, { name: "Blue" }],
            valToIndex: {
              0: 0,
              1: 1,
              2: 2,
            },
          },
          palette_border: {
            colors: [{ name: "Green" }, { name: "Red" }, { name: "Blue" }],
            valToIndex: {
              0: 0,
              1: 1,
              2: 2,
            },
          },
        },

        ohlcPlots: {
          plot_candle: {
            title: "Candles",
          },
        },

        defaults: {
          ohlcPlots: {
            plot_candle: {
              borderColor: "#000000",
              color: "#000000",
              drawBorder: true,
              drawWick: true,
              plottype: "ohlc_candles",
              visible: true,
              wickColor: "#000000",
            },
          },

          palettes: {
            palette_bar: {
              colors: [
                { color: "#089981", width: 1, style: 0 },
                { color: "#F23645", width: 1, style: 0 },
                { color: "#0000FF", width: 1, style: 0 },
              ],
            },
            palette_wick: {
              colors: [
                { color: "#089981" },
                { color: "#F23645" },
                { color: "#0000FF" },
              ],
            },
            palette_border: {
              colors: [
                { color: "#089981" },
                { color: "#F23645" },
                { color: "#0000FF" },
              ],
            },
          },

          precision: 2,
          inputs: {},
        },
        styles: {},
        inputs: [],
      },
      constructor: function () {
        this.main = function (context, inputCallback) {
          this._context = context;
          this._input = inputCallback;

          this._context.select_sym(0);

          const o = PineJS.Std.open(this._context);
          const h = PineJS.Std.high(this._context);
          const l = PineJS.Std.low(this._context);
          const c = PineJS.Std.close(this._context);

          // Example condition: Change candle color to blue if close price is greater than 100
          const myCondition = c == h || c == l || c == o;

          // Determine the color based on the default behavior and the condition
          let barColor, wickColor, borderColor;
          if (myCondition) {
            barColor = 2; // Blue color index
            wickColor = 2; // Blue color index
            borderColor = 2; // Blue color index
          } else {
            // Default behavior based on price change
            barColor =
              PineJS.Std.close(this._context) >= PineJS.Std.open(this._context)
                ? 0
                : 1;
            wickColor = barColor;
            borderColor = barColor;
          }

          return [o, h, l, c, barColor, wickColor, borderColor];
        };
      },
    },
  ]);
};

let newRangeEvent = false;
export let LocalRangeId = null;

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
    const study = await chartDetails.Widget.activeChart().createStudy(
      "Advanced Coloring Candles",
      false,
      true
    );
    chartDetails.Widget.chart().getStudyById(study).bringToFront();
    if (range) {
      const newRangeId = chartDetails.Widget.chart().createMultipointShape(
        range.rangePoints,
        {
          shape: "date_and_price_range",
        }
      );
      updateRangeId(range.rangeId, newRangeId);
      LocalRangeId = newRangeId;
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
          chartDetails.Widget.activeChart().removeEntity(LocalRangeId);
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
