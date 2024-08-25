import React, { useState, useEffect, useRef } from "react";
import { addDays, format } from "date-fns";

const DateSelector = ({ onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Generate an array of dates starting from today using date-fns
    const startDate = new Date();
    const datesArray = Array.from({ length: 30 }, (_, i) => addDays(startDate, i));
    setDates(datesArray);
  }, []);

  const handleDateClick = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedDate(date);
      if (onSelect) {
        onSelect(date);
      }
    } else {
      console.error("Invalid date selected:", date);
    }
  };

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -200, // Adjust scroll amount as needed
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: 200, // Adjust scroll amount as needed
      behavior: "smooth",
    });
  };

  const formatDate = (date) => {
    return format(date, "EEE, MMM d"); // Example: "Fri, Aug 25"
  };

  return (
    <div className="flex items-center justify-center my-4">
      <button
        onClick={scrollLeft}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l-lg"
      >
        &#8249;
      </button>
      <div
        ref={containerRef}
        className="flex space-x-4 p-4 bg-white shadow-lg rounded-lg overflow-x-auto scrollbar-hide"
        style={{ width: "300px" }} // Adjust width as needed
      >
        {dates.map((date, index) => (
          <div
            key={index}
            className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-colors duration-300 ${
              date.toDateString() === selectedDate.toDateString()
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleDateClick(date)}
          >
            <span className="text-sm">{formatDate(date)}</span>
          </div>
        ))}
      </div>
      <button
        onClick={scrollRight}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r-lg"
      >
        &#8250;
      </button>
    </div>
  );
};

export default DateSelector;
