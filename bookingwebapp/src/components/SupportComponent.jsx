import React, { useState, useContext } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { UserContext } from "../UserContext"; // Import UserContext to access user information

export default function SupportComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSending, setIsSending] = useState(false); // State to indicate sending process
  const { user } = useContext(UserContext); // Access user information from context

  // Function to handle form submission and send email
  const sendQuery = async (e) => {
    e.preventDefault();
    setIsSending(true); // Set sending state to true

    try {
      // Sending query along with user information
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/send-email`, {
        query,
        userEmail: user?.email, // Include user email from context
        userName: user?.name, // Include user name from context
      });
      alert(response.data);
      setQuery(""); // Clear input after sending
      setIsOpen(false); // Close the modal
    } catch (error) {
      console.error("Failed to send query", error);
      alert("Failed to send query. Please try again.");
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  return (
    <>
      {/* Floating Button to open support modal */}
      <button
        className={`fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-transform duration-300 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => setIsOpen(true)}
      >
        Support
      </button>

      {/* Modal for sending query */}
      <div
        className={`fixed bottom-5 right-5 bg-white p-6 rounded shadow-lg max-w-sm w-full transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90"
        }`}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <h2 className="text-lg font-bold mb-4">Send Query</h2>
        <form onSubmit={sendQuery}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            placeholder="Write your query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            rows="4"
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${
                isSending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
