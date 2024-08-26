import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CityContext } from '../CityContext';
import SeatSelector from '../components/SeatSelector';
import DateSelector from '../components/DateSelector';
import { format } from 'date-fns';

export default function ReservationFormPage() {
    const { id } = useParams();
    const { city, setCity } = useContext(CityContext); // Access city and setCity from CityContext

    const [chooseCity, setChooseCity] = useState(city || ''); // Initialize with city context
    const [chooseShowDate, setChooseShowDate] = useState(new Date());
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const cities = ['Delhi', 'Jaipur', 'Bhopal', 'Pune', 'Ahmedabad', 'Kota', 'Mumbai'];
    const [showSeatSelector, setShowSeatSelector] = useState(false);
    const [rows, setRows] = useState(5); // Default values
    const [cols, setCols] = useState(5); // Default values
    const [ticketPrice, setTicketPrice] = useState([]);
    const [chooseTime, setChooseTime] = useState([]);
    const [chooseShowtimeId, setChooseShowtimeId] = useState([]);
    const [activeShowtime, setActiveShowtime] = useState(null);

    useEffect(() => {
        if (!id) return;

        axios.get('/adminMovies/' + id).then(response => {
            setMovie(response.data);
        });
    }, [id]);

    useEffect(() => {
        setChooseCity(city); // Sync chooseCity with city context whenever city changes
    }, [city]);

    if (!movie) {
        return;
    }

    async function findMovie(ev) {
        ev.preventDefault();

        if (!chooseCity) {
            console.log('City is required.');
            return;
        }

        const params = {
            movieid: id,
            city: chooseCity,
            showdate: format(chooseShowDate, 'yyyy-MM-dd'), // Use formatted date
        };

        try {
            const response = await axios.get('/findShowtimes', { params });
            setShowtimes(response.data);
        } catch (error) {
            console.error("Error fetching showtimes:", error);
        }
    }

    function handleChange(event, setter) {
        setter(event.target.value);
        setCity(event.target.value); // Update city context when selection changes
    }

    async function handleSeatSelection(it, time) {
        try {
            const response = await axios.get('/adminTheatres/' + it.theatreid);
            setRows(response.data.rows);
            setCols(response.data.cols);
            setTicketPrice(it.ticketPrice);
            setChooseTime(time);
            setChooseShowtimeId(it._id);
            setActiveShowtime({ id: it._id, time });
            setShowSeatSelector(true);
        } catch (error) {
            console.error("Error fetching theatre details:", error);
        }
    }

    const handleDateSelect = (date) => {
        if (date) {
            setChooseShowDate(date);
        } else {
            setChooseShowDate(new Date()); // Default to today's date
        }
    };

    return (
        <div>
            <h2>{movie.title}</h2>
            <form onSubmit={findMovie}>
                <label className="text-xl mt-2">Select a City</label><br />
                <select
                    value={chooseCity} // Set default value from city context
                    onChange={ev => handleChange(ev, setChooseCity)} 
                    required
                >
                    <option value="">Select a city</option>
                    {cities.map(cityName => (
                        <option key={cityName} value={cityName}>
                            {cityName}
                        </option>
                    ))}
                </select>
                <div className="relative bg-gray-100">
                    <h1 className="text-xl font-bold text-center my-8">Select a Date</h1><br />
                    <DateSelector onSelect={handleDateSelect} />
                </div>
                <button type="submit">
                    Submit
                </button>
            </form>

            {showtimes.length > 0 && showtimes.map(it => (
                <div key={it._id}>
                    <strong>Theatre:</strong> {it.theatreName} <br />
                    <strong>Date:</strong> {new Date(it.showdate).toLocaleDateString()} <br />
                    <strong>Times:</strong> <br />
                    {Array.isArray(it.daytime) && it.daytime.length > 0 ? (
                        it.daytime.map((time, index) => (
                            <div key={index}>
                                <button onClick={() => handleSeatSelection(it, time)} className='hover:bg-black bg-slate-500 ml-2'>
                                    {time}
                                </button>
                                {showSeatSelector && activeShowtime?.id === it._id && activeShowtime?.time === time && (
                                    <SeatSelector
                                        rows={rows}
                                        cols={cols}
                                        ticketPrice={ticketPrice}
                                        chooseTime={chooseTime}
                                        chooseShowtimeId={chooseShowtimeId}
                                        userId={id}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <span>No showtimes available</span>
                    )}
                </div>
            ))}
        </div>
    );
}
