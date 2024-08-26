import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CityContext } from '../CityContext';
import SeatSelector from '../components/SeatSelector';
import DateSelector from '../components/DateSelector';
import { format } from 'date-fns';

export default function ReservationFormPage() {
    const { id } = useParams();
    const { city, setCity } = useContext(CityContext);

    const [chooseCity, setChooseCity] = useState(city || '');
    const [chooseShowDate, setChooseShowDate] = useState(new Date());
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const cities = ['Delhi', 'Jaipur', 'Bhopal', 'Pune', 'Ahmedabad', 'Kota', 'Mumbai'];
    const [showSeatSelector, setShowSeatSelector] = useState(false);
    const [rows, setRows] = useState(5);
    const [cols, setCols] = useState(5);
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
        setChooseCity(city);
    }, [city]);

    useEffect(() => {
        if (chooseCity && chooseShowDate) {
            findMovie(); // Automatically update showtimes when city or date changes
        }
    }, [chooseCity, chooseShowDate]);

    if (!movie) {
        return;
    }

    async function findMovie() {

        if (!chooseCity) {
            console.log('City is required');
            return;
        }

        const params = {
            movieid: id,
            city: chooseCity,
            showdate: format(chooseShowDate, 'yyyy-MM-dd'),
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
        setCity(event.target.value);
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
        setChooseShowDate(date || new Date()); // Default to today's date if no date is selected
    };

    return (
        <section className='mt-14 mb-10'>

            <div className="flex flex-col mx-10">

                <h2 className="text-5xl text-primary-950 font-bold">{movie.title}</h2>

                <div className="flex mx-2 text-black dark:text-primary-50 mt-3 text-sm font-thin items-center">
                    <div className="text-red-600 dark:text-red-400 py-1 pr-3 text-lg font-medium">{movie.certificate}</div>
                    <div className="flex gap-3">
                        {movie.genre.map((genre, index) => (
                            <div className="border rounded-full px-3 py-1" key={index}>
                                {genre}
                            </div>
                        ))}
                    </div>
                </div>   

                {/* City + Date */}
                <div className="flex justify-between items-center">

                    <div>
                        <select
                            value={chooseCity}
                            onChange={ev => handleChange(ev, setChooseCity)}
                            className="p-2 bg-transparent text-primary-950 dark:text-primary-600 font-semibold"
                            required
                        >
                            <option value="">Select a city</option>
                            {cities.map(cityName => (
                                <option key={cityName} value={cityName}>
                                    {cityName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <DateSelector onSelect={handleDateSelect} />
                    </div>

                </div>

            </div>

            {showtimes.length > 0 ? (
                showtimes.map(it => (
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
                            <div>No showtimes available</div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center text-red-500 font-bold mt-4">Ohoo, no showtimes available.</div>
)}

        </section>
    );
}
