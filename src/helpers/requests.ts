import axios from "axios";
import { category } from "../context/SymbolsContext";
const API_URL = import.meta.env.VITE_APP_API_URL;

const CATEGORY_LIST = `${API_URL}/get_category_list`;
const SYMBOL_LIST = `${API_URL}/get_category_symbols`;
const HISTORICAL_SYMBOL_DATA = `${API_URL}/get_symbol_historical_data`;
const OCCURENCES = `${API_URL}/get_occurences`;

interface occurencesBody {
  symbol: string;
  start_range: string;
  end_range: string;
  tolerance: number;
}

export function getCategoryList() {
  return axios.get(CATEGORY_LIST);
}
export function getSymbolList(category: category) {
  return axios.get(`${SYMBOL_LIST}?category=${category}`);
}

export function getHistoricalSymbolData(symbol: string) {
  return axios.get(`${HISTORICAL_SYMBOL_DATA}?symbol=${symbol}`);
}

export function getOccurences(body: occurencesBody) {
  console.log("update slide: ", body);
  return axios.get(
    `${OCCURENCES}?symbol=${"AAPL"}&start_range=${body.start_range}&end_range=${
      body.end_range
    }&tolerance=${body.tolerance}`
  );
}
