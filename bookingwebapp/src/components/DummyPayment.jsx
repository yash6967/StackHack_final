import React, { useState } from "react";

const DummyPayment = ({ onPaymentSuccess, onCancel }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Simulate payment processing
    const isPaymentSuccessful = true;

    if (isPaymentSuccessful) {
      onPaymentSuccess(); // Proceed with booking after payment
    } else {
      alert("Payment failed, please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-medium mb-4">Enter Payment Details</h2>
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date"
            value={paymentDetails.expiryDate}
            onChange={handleInputChange}
            required
            className="w-1/2 px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={paymentDetails.cvv}
            onChange={handleInputChange}
            required
            className="w-1/2 px-4 py-2 border rounded-md ml-2"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default DummyPayment;
