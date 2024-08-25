import { useState, useEffect } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

export default function TheatresFormPage() {
  const { id } = useParams();
  const [theatreName, setName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [rows, setRows] = useState("");
  const [cols, setCols] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({});
  const cities = ["Delhi", "Jaipur", "Bhopal", "Pune", "Ahmedabad", "Kota", "Mumbai"];
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get("/adminTheatres/" + id).then((response) => {
      const { data } = response;
      setName(data.theatreName);
      setTicketPrice(data.ticketPrice);
      setCity(data.city);
      setRows(data.rows);
      setCols(data.cols);
    });
  }, [id]);

  function validateForm() {
    const newErrors = {};
    if (!theatreName) newErrors.theatreName = "Theatre name is required";
    if (!ticketPrice) newErrors.ticketPrice = "Ticket Price is required";
    if (!city) newErrors.city = "City is required";
    if (!rows || rows === "") newErrors.rows = "Rows is required";
    if (!cols || cols === "") newErrors.cols = "Cols is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleCitySelect = (ev) => {
    setCity(ev.target.value);
  };

  async function saveTheatre(ev) {
    ev.preventDefault();

    if (!validateForm()) {
      return;
    }

    const theatreData = {
      id,
      theatreName,
      city,
      ticketPrice,
      rows,
      cols,
    };

    if (id) {
      try {
        await axios.put("/adminTheatres", {
          id,
          ...theatreData,
        });

        setRedirect(true);
        alert("Theatre successfully updated");
      } catch (error) {
        console.error("Error updating theatre:", error);
        alert("Failed to update this theatre");
      }
    } else {
      try {
        await axios.post("/adminTheatres", theatreData);

        setRedirect(true);
        alert("Theatre successfully added");
      } catch (error) {
        console.error("Error adding new theatre:", error);
        alert("Failed to add new theatre");
      }
    }
  }

  async function deleteTheatre() {
    if (window.confirm("Are you sure you want to delete this theatre?")) {
      try {
        await axios.delete(`/adminTheatres/${id}`);
        setRedirect(true);
        alert("Theatre successfully deleted");
      } catch (error) {
        console.error("Error deleting theatre:", error);
        alert("Failed to delete the theatre");
      }
    }
  }

  if (redirect) {
    return <Navigate to="/account/adminTheatres" />;
  }

  return (
    <div className="flex flex-col items-center mb-10">
      <AccountNavigation />

      <form className="min-w-[40rem] max-w-[60rem]" onSubmit={saveTheatre}>
        <h2 className="text-xl mt-6 mb-2">Theatre Name</h2>
        <input
          type="text"
          placeholder="Name of theatre"
          value={theatreName}
          onChange={(ev) => setName(ev.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        {errors.theatreName && <div className="text-red-500">{errors.theatreName}</div>}

        <h2 className="text-xl mt-6 mb-2">Select a City</h2>
        <select
          onChange={handleCitySelect}
          className={`border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-lg py-2 px-4 w-full`}
        >
          <option>Select a city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}

        <h2 className="text-xl mt-6 mb-2">Ticket Price</h2>
        <input
          type="number"
          placeholder="Price of ticket"
          value={ticketPrice}
          onChange={(ev) => setTicketPrice(ev.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        {errors.ticketPrice && <div className="text-red-500">{errors.ticketPrice}</div>}

        <h2 className="text-xl mt-6 mb-2">Rows</h2>
        <input
          type="number"
          placeholder="Rows in theatre"
          value={rows}
          onChange={(ev) => setRows(ev.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        {errors.rows && <div className="text-red-500">{errors.rows}</div>}

        <h2 className="text-xl mt-6 mb-2">Cols</h2>
        <input
          type="number"
          placeholder="Cols in theatre"
          value={cols}
          onChange={(ev) => setCols(ev.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        {errors.cols && <div className="text-red-500">{errors.cols}</div>}

        <div className="flex gap-4 mt-4">
          <button type="submit" className="bg-gray-100 py-2 px-4 rounded-lg">
            Submit
          </button>

          {id && (
            <button
              type="button"
              onClick={deleteTheatre}
              className="bg-red-500 text-white py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
