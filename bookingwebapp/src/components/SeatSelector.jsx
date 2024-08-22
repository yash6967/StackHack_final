import React, { useState, useEffect } from "react";
import axios from 'axios';

const SeatSelector = (props) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]); 

  useEffect(() => {
    // Function to fetch booked seats from the backend and generate seats
    const fetchBookedSeatsAndGenerateSeats = async () => {
      try {
        const response = await axios.get('/bookedSeats', {
          params: {
            showtimeId: props.chooseShowtimeId,
            daytime: props.chooseTime
          }
        });

        const bookedSeatNumbers = response.data.seats; // Adjust according to your response structure
        setBookedSeats(bookedSeatNumbers);

        // Now that we have the booked seats, we can generate the seats correctly
        const generatedSeats = [];
        const rowLabels = Array.from({ length: props.rows }, (_, i) => String.fromCharCode(65 + i));

        for (let row = 0; row < props.rows; row++) {
          for (let col = 0; col < props.cols; col++) {
            const seatId = `${rowLabels[row]}${col + 1}`;
            generatedSeats.push({
              id: seatId,
              row: rowLabels[row],
              col: col + 1,
              booked: bookedSeatNumbers.includes(seatId), // Mark as booked if it's in the bookedSeats array
              selected: false,
              price: props.ticketPrice,
            });
          }
        }
        setSeats(generatedSeats);

      } catch (error) {
        console.error("Failed to fetch booked seats:", error);
      }
    };

    // Fetch booked seats and generate the seat grid when component mounts or when props change
    fetchBookedSeatsAndGenerateSeats();
  }, [props.chooseShowtimeId, props.chooseTime, props.rows, props.cols, props.ticketPrice]);

  const handleSeatSelection = (index) => {
    const updatedSeats = [...seats];
    const seat = updatedSeats[index];
    if (!seat.booked) {
      seat.selected = !seat.selected;
      setSelectedSeats((prevSelectedSeats) =>
        seat.selected ? prevSelectedSeats + 1 : prevSelectedSeats - 1
      );
      setTotalAmount((prevTotalAmount) =>
        seat.selected ? prevTotalAmount + seat.price : prevTotalAmount - seat.price
      );
      setSelectedSeatIds((prevSelectedSeatIds) =>
        seat.selected
          ? [...prevSelectedSeatIds, seat.id]
          : prevSelectedSeatIds.filter((id) => id !== seat.id)
      );
    }
    setSeats(updatedSeats);
  };

  async function bookingHandler(chooseShowtimeId, chooseTime, ticketPrice, selectedSeatIds){ 
    try {
      const response = await axios.post('/bookTicket', {
        chooseShowtimeId,
        chooseTime,
        selectedSeatIds,
        ticketPrice
      });
      alert("Ticket successfully booked!");
      console.log(response);
    } catch (error) {
      console.error("Failed to book tickets:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-300 to-indigo-700 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <div className="bg-gray-200 p-6 rounded-lg flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col">
              {/* Theater screen representation */}
              <div className="w-full h-8 my-4 bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
                SCREEN {props.chooseTime}
              </div>

              {/* Seat Grid */}
              <div className={`grid grid-cols-${props.cols} gap-1 mt-2`}>
                {seats.map((seat, index) => (
                  <label
                    key={seat.id}
                    className={`w-10 h-10 rounded-md cursor-pointer transition-colors duration-300 ${
                      seat.booked
                        ? "bg-gray-400 cursor-not-allowed"
                        : seat.selected
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-400 hover:bg-gray-100"
                    } flex items-center justify-center text-xs font-semibold relative`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={seat.selected}
                      onChange={() => handleSeatSelection(index)}
                      disabled={seat.booked}
                    />
                    <span className="absolute text-xs text-gray-700">{seat.id}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="my-4 text-gray-500 text-sm">Select your seats carefully!</div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex flex-col text-gray-700">
            <span className="text-xl font-medium">{selectedSeats} Tickets (price: {props.ticketPrice})</span>
            <div className="flex items-center gap-1">
              ₹ <span className="text-xl font-medium">{totalAmount}</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Selected Seats: {selectedSeatIds.join(", ")}
            </div>
          </div>
          <button onClick={() => {
            bookingHandler(props.chooseShowtimeId, props.chooseTime, props.ticketPrice, selectedSeatIds)
          }} className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-500 transition duration-300">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
