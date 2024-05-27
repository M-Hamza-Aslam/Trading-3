// import { getWebSocketURL } from "../script.js";
import { parseFullSymbol } from "./helpers.js";
const channelToSubscription = new Map();
let ws;

// let channelToSubscription = {
//   subscriberUID: null,
//   ws: null,
//   lastBar: null,
//   resolution: null,
//   callback: null,
// };

function getNextBarTime(barTime, resolution) {
  // Convert the bar time to a Date object.
  const barTimeDate = new Date(barTime);

  // Calculate the next bar time based on the resolution.
  if (resolution === "1") {
    barTimeDate.setMinutes(barTimeDate.getMinutes() + 1);
  } else if (resolution === "5") {
    barTimeDate.setMinutes(barTimeDate.getMinutes() + 5);
  } else if (resolution === "15") {
    barTimeDate.setMinutes(barTimeDate.getMinutes() + 15);
  } else if (resolution === "30") {
    barTimeDate.setMinutes(barTimeDate.getMinutes() + 30);
  } else if (resolution === "1H") {
    barTimeDate.setHours(barTimeDate.getHours() + 1);
  } else if (resolution === "4H") {
    barTimeDate.setHours(barTimeDate.getHours() + 4);
  } else if (resolution === "1D") {
    barTimeDate.setDate(barTimeDate.getDate() + 1);
  } else if (resolution === "1W") {
    barTimeDate.setDate(barTimeDate.getDate() + 7);
  } else if (resolution === "1M") {
    barTimeDate.setMonth(barTimeDate.getMonth() + 1);
  } else {
    throw new Error(`Invalid resolution: ${resolution}`);
  }

  // Convert the Date object back to seconds.
  const nextBarTime = barTimeDate.getTime();
  // console.log("nextBarTime", nextBarTime);
  return nextBarTime;
}

const connectToWebSocket = (currentSymbol, market) => {
  try {
    const coinId = parseFullSymbol(currentSymbol);
    const ws = new WebSocket(`wss://socket.polygon.io/${market}`);

    ws.onopen = () => {
      console.log("Connected to Polygon WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let symbols;
      let channelString;
      let subscriptionItem;
      switch (data[0].ev) {
        case "status":
          if (data[0].status === "connected") {
            console.log("", data[0].message);
            ws.send(
              JSON.stringify({
                action: "auth",
                params: import.meta.env.VITE_POLYGON_API_KEY,
              })
            );
          } else if (data[0].status === "auth_success") {
            let coin = coinId.substring(0, 3); // Extract the first three characters
            let currency = coinId.substring(3); // Extract the rest of the characters
            ws.send(
              JSON.stringify({
                action: "subscribe",
                params: `${market === "forex" ? "CAS." : "XAS."}${coin}${
                  market === "forex" ? "/" : "-"
                }${currency}`,
              })
            );
          }
          break;
        case `${market === "forex" ? "CAS" : "XAS"}`:
          // console.log("webhook Live Data: ", data[0]);
          symbols = data[0].pair.split(market === "forex" ? "/" : "-").join("");
          channelString = `0~${symbols}`;
          subscriptionItem = channelToSubscription.get(channelString);

          if (subscriptionItem === undefined) {
            return;
          }
          subscriptionItem.handlers.forEach((handler) => {
            // updation logic
            const nextBarTime = getNextBarTime(
              handler.lastBar.time,
              handler.resolution
            );
            let bar;
            if (data[0].e >= nextBarTime) {
              bar = {
                time: nextBarTime,
                open: data[0].c,
                high: data[0].c,
                low: data[0].c,
                close: data[0].c,
                volume: data[0].v,
              };
            } else {
              bar = {
                ...handler.lastBar,
                high: Math.max(handler.lastBar.high, data[0].c),
                low: Math.min(handler.lastBar.low, data[0].c),
                close: data[0].c,
              };
            }

            handler.lastBar = bar;

            handler.callback(bar);
          });

          break;
        default:
          break;
      }
    };

    ws.onerror = (error) => console.error(error);
    ws.onclose = () => console.log("Disconnected from Polygon WebSocket");
    return ws;
  } catch (err) {
    console.log(err.error);
  }
};

const DisconnectToWebSocket = () => {
  ws.close();
};

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback,
  lastBar
) {
  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  const channelString = `0~${parsedSymbol}`;
  const handler = {
    subscriberUID,
    resolution,
    lastBar,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // Already subscribed to the channel, use the existing subscription
    console.log(
      "already subscribed to the channel, use the existing subscription"
    );
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  console.log(
    "[subscribeBars]: Subscribe to streaming. Channel:",
    parsedSymbol
  );
  const market = localStorage.getItem("market");
  console.log("market name: ", market);
  ws = connectToWebSocket(symbolInfo.full_name, market);
}

export function unsubscribeFromStream(subscriberUID) {
  const symbol = subscriberUID.split("_")[0];
  const parsedSymbol = parseFullSymbol(symbol);
  const channelString = `0~${parsedSymbol}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  const handlerIndex = subscriptionItem.handlers.findIndex(
    (handler) => handler.subscriberUID === subscriberUID
  );
  if (handlerIndex !== -1) {
    // Remove from handlers
    subscriptionItem.handlers.splice(handlerIndex, 1);
    console.log("[unsubscribeBars]: removed handler. Channel:", channelString);
    if (subscriptionItem.handlers.length === 0) {
      // Unsubscribe from the channel if it is the last handler
      console.log(
        "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
        channelString
      );
      DisconnectToWebSocket();
      channelToSubscription.delete(channelString);
    }
  }
}
