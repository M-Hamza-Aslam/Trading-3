const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

interface ErrorWithStatus {
  status: number;
}
function isErrorWithStatus(error: unknown): error is ErrorWithStatus {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as ErrorWithStatus).status === "number"
  );
}

export async function getBarsApiRequest(
  coinId: string,
  type: string,
  from: number,
  to: number,
  limit: number
) {
  try {
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${coinId}/range/1/${type}/${from}/${to}?sort=asc&limit=${limit}&apiKey=${API_KEY}`;
    const response = await fetch(apiUrl);
    return response.json();
  } catch (error: unknown) {
    if (isErrorWithStatus(error)) {
      throw new Error(`CryptoCompare request error: ${error.status}`);
    } else if (error instanceof Error) {
      throw new Error(`CryptoCompare request error: ${error.message}`);
    } else {
      throw new Error("CryptoCompare request error: Unknown error occurred");
    }
  }
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol: string) {
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

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
