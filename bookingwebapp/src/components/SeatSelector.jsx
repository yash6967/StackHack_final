import React, { useState, useEffect } from "react";
import axios from 'axios';
import DummyPayment from "./DummyPayment"; // Import the DummyPayment component

const SeatSelector = (props) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]); 
  const [showPayment, setShowPayment] = useState(false); // State to toggle payment form

  useEffect(() => {
    const fetchBookedSeatsAndGenerateSeats = async () => {
      try {
        const response = await axios.get('/bookedSeats', {
          params: {
            showtimeId: props.chooseShowtimeId,
            daytime: props.chooseTime
          }
        });

        const bookedSeatNumbers = response.data.seats;
        setBookedSeats(bookedSeatNumbers);

        const generatedSeats = [];
        const rowLabels = Array.from({ length: props.rows }, (_, i) => String.fromCharCode(65 + i));

        for (let row = 0; row < props.rows; row++) {
          for (let col = 0; col < props.cols; col++) {
            const seatId = `${rowLabels[row]}${col + 1}`;
            generatedSeats.push({
              id: seatId,
              row: rowLabels[row],
              col: col + 1,
              booked: bookedSeatNumbers.includes(seatId),
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

  const bookingHandler = async () => {
    try {
      const response = await axios.post('/bookTicket', {
        chooseShowtimeId: props.chooseShowtimeId,
        userId: props.userId,
        chooseTime: props.chooseTime,
        selectedSeatIds,
        ticketPrice: props.ticketPrice
      });
      alert("Ticket successfully booked!");
      console.log(response);
    } catch (error) {
      console.error("Failed to book tickets:", error);
      alert("Login to book tickets!");
    }
  };

  const handleBookNowClick = () => {
    setShowPayment(true); // Show the payment form when "Book Now" is clicked
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false); // Hide payment form after successful payment
    bookingHandler(); // Proceed to book the ticket
  };

  const handlePaymentCancel = () => {
    setShowPayment(false); // Hide payment form if payment is cancelled
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-300 to-indigo-700 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <div className="bg-gray-200 p-6 rounded-lg flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col">
              <div className="w-full h-8 my-4 bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
                SCREEN {props.chooseTime}
              </div>

              <div 
                className="grid gap-1 mt-2 overflow-x-auto"
                style={{
                  gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))`,
                  width: `${Math.min(props.cols * 45, 100)}%`,
                  maxWidth: '100%',
                }}
              >
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

        {showPayment ? (
          <DummyPayment
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        ) : (
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
            <button onClick={handleBookNowClick} className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-500 transition duration-300">
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelector;
