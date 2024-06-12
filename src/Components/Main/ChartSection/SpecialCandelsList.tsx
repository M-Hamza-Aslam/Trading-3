import { useState } from "react";

const formateDate = (timestamp: number) => {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Extract the day, month, and year
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are zero-indexed
  const year = date.getUTCFullYear();

  // Format the day and month to be two digits
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Create the formatted date string
  const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
  return formattedDate;
};

const SpecialCandelsList = ({
  specialCandles,
}: {
  specialCandles: number[];
}) => {
  const [selectedCandle, setSelectedCandle] = useState<number | null>(null);

  const handleCandleSelection = (candle: number) => {
    setSelectedCandle(candle);
  };
  return (
    <div className="h-[500px] px-3 pb-4 overflow-y-auto bg-white ">
      <ul className="space-y-2 font-medium">
        {specialCandles.map((candle, index) => {
          return (
            <li className="" key={index}>
              <button
                type="button"
                onClick={() => handleCandleSelection(candle)}
                className={`${
                  selectedCandle === candle ? "text-blue-500" : ""
                } p-2 hover:text-blue-500 w-fit`}
                key={index}
              >
                {formateDate(candle)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default SpecialCandelsList;
