import axios from "axios";

const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const API_URL = import.meta.env.VITE_APP_API_URL;
const HISTORICAL_SYMBOL_DATA = `${API_URL}/get_symbol_historical_data`;

export async function getBarsApiRequest(coinId, type, from, to, limit) {
  try {
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${coinId}/range/1/${type}/${from}/${to}?sort=asc&limit=${limit}&apiKey=${API_KEY}`;
    const response = await fetch(apiUrl);
    return response.json();
  } catch (error) {
    throw new Error(`request error: ${error.status}`);
  }
}

export async function getHistoricalBars(coinId, resolution) {
  try {
    const response = await axios.get(
      `${HISTORICAL_SYMBOL_DATA}?symbol=${coinId}&resolution=${resolution}`
    );
    const data = await JSON.parse(response.data);
    return data;
  } catch (error) {
    throw new Error(`request error: ${error.status}`);
  }
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol) {
  return fullSymbol.split(":")[1];
}

export function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  //   console.log("query params", window.location.search);
  const results = regex.exec(window.location.search);
  //   console.log("results", results);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTimestamp(dateString) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");

  const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  return new Date(isoString).getTime();
}
