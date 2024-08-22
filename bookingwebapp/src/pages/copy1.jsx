import AccountNavigation from "./AccountNavigation";
import axios from "axios";

import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { format, parseISO } from 'date-fns';

export default function ShowtimesFormPage() {

    const { id } = useParams();
    const [movieID, setMovieID] = useState('');
    const [movieName, setMovieName] = useState('');
    const [theatreID, setTheatreID] = useState('');
    const [theatreName, setTheatreName] = useState('');
    const [showDate, setShowDate] = useState('');

    const [slot, setSlot] = useState([]);
    const [inputValueSlot, setInputValueSlot] = useState('')

    const [formFillError, setFormFillError] = useState({});
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [city, setCity] = useState('');

    const [selectedMovie, setSelectedMovie] = useState([null]);
    const [selectedTheatre, setSelectedTheatre] = useState([null]);

    useEffect(() => {

        if (!id) return;

        axios.get('/adminShowtimes/' + id).then(response => {
            const { data } = response;
            setMovieID(data.movieID);
            setMovieName(data.movieName);
            setTheatreID(data.theatreID);
            setTheatreName(data.theatreName);
            setReleaseDate(data.setShowDate ? format(parseISO(data.setShowDate), 'yyyy-MM-dd') : '');
            setSlot(data.slot || []);
            setCity(data.city);
        });

    }, [id]);

    useEffect(() => {

        const fetchMovies = async () => {
            try {
                const response = await axios.get('/adminMovies');
                setMovies(response.data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();

    }, []);

    useEffect(() => {

        const fetchTheatres = async () => {

            try {
                const response = await axios.get('/adminTheatres');
                setTheatres(response.data);
            } catch (error) {
                console.error('Error fetching theatres:', error);
            }

        };

        fetchTheatres();

    }, []);

    const addSlot = () => {
        const trimmedValue = inputValueSlot.trim();
        if (trimmedValue && !slot.includes(trimmedValue)) {
            setSlot([...slot, trimmedValue]);
            setInputValueSlot('');
            setFormFillError(prevErrors => ({
                ...prevErrors,
                slot: ''
            }));
        } else {
            setFormFillError({ slot: 'This slot is either empty or already added.' });
        }
    }

    const removeSlot = (index) => {
        setSlot(slot.filter((_, i) => i !== index));
    };

    function validateForm() {

        const newErrors = {};

        if (!movieID) newErrors.movieID = 'Movie name is required';
        if (!theatreID) newErrors.theatreID = 'Theatre name is required';
        if (!showDate) newErrors.showDate = 'Show date is required';
        if (!slot.length) newErrors.slot = 'Slot is required';
        if (!city) newErrors.city = 'City is required';

        setFormFillError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function saveShowtime(ev) {

        ev.preventDefault();

        if (!validateForm()) return;

        const showtimeData = {
            id,
            movieID,
            movieName,
            theatreID,
            theatreName,
            showDate,
            slot,
            city,
        };

        if(id){
            /* update */
            try{
                await axios.put('/adminShowtimes', {
                    id, ...showtimeData
                });
                
                setRedirect(true);
                alert('Showtime successfully updated');
            }catch(error){
                console.error('Error updating showtime:', error);
                alert('Failed to upate this showtime');
            }
    
        }else{
            /* new */
            try{        
                await axios.post('/adminShowtimes', showtimeData);
                setRedirect(true);
                alert('showtime Successfully added');
            }catch(error){
                console.error('Error adding new showtime:', error);
                alert('Failed to add new showtime');
            }
        }
    }

    async function deleteShowtime() {
        if (window.confirm("Are you sure you want to delete this showtime?")) {
            try {
                await axios.delete(`/adminShowtimes/${id}`);
                alert("Showtime successfully deleted");
                setRedirect(true);
            } catch (error) {
                console.error("Error deleting showtime:", error);
                alert("Failed to delete the showtime");
            }
        }
    }

    const handleMovieSelect = (event) => {
        const movieID = event.target.value;
        const movie = movies.find(m => m._id === movieID);
        setSelectedMovie(movie);
        setMovieID(movieID);
        setMovieName(movie.title);
    };

    const handleTheatreSelect = (event) => {
        const theatreID = event.target.value;
        const theatre = theatres.find(t => t._id === theatreID);
        setSelectedTheatre(theatre);
        setTheatreID(theatreID);
        setTheatreName(theatre.theatreName);
        setCity(theatre.city);
    };

    if (redirect) {
        return <Navigate to='/account/adminShowtimes' />;
    }

    function handleChange(event, setter) {
        setter(event.target.value);
        
        /* For Clearing */
        if (formFillError[event.target.name]) {
            setFormFillError(prevErrors => ({
                ...prevErrors,
                [event.target.name]: ''
            }));
        }
    }

    return (
        <div className="flex flex-col items-center mb-10">

            <AccountNavigation />

            <form 
                className="min-w-[40rem] max-w-[60rem]" 
                onSubmit={saveShowtime}>

                {/* Show Date */}
                <h2 className="text-xl mt-6 mb-2">Show Date</h2>
                <input 
                    type="date" 
                    value={showDate} 
                    onChange={ev => {
                        setShowDate(ev.target.value);
                        if (formFillError.showDate) {
                            setFormFillError(prevErrors => ({
                                ...prevErrors,
                                showDate: ''
                            }));
                        }
                    }}
                />
                {formFillError.showDate && <div style={{ color: 'red' }}>{formFillError.showDate}</div>}

                {/* Slot */}
                <h2 className="text-xl mt-6 mb-2">Slot</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {slot.map((slot, index) => (
                        <span key={index} className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 flex items-center">
                            {slot}
                            <button
                                type="button"
                                onClick={() => {
                                    console.log(`Removing slot at index ${index}`);
                                    removeSlot(index);
                                }}
                                className="ml-2 text-red-500 hover:text-red-700 bg-transparent"
                                aria-label={`Remove ${slot}`}
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                
                <div className="flex gap-2">
                    <input
                        type="time"
                        name="slotInput"
                        placeholder="Enter a slot"
                        value={inputValueSlot}
                        onChange={(ev) => handleChange(ev, setInputValueSlot)}
                        className="border rounded p-2 mb-2"
                    />
                    <button
                        type="button"
                        onClick={addSlot}
                        className="text-blue-500 bg-transparent">
                        Add
                    </button>
                </div>
                {formFillError.slot && <div style={{ color: 'red' }}>{formFillError.slot}</div>}
                
                {/* Movie */}
                <h2 className="text-xl mt-6 mb-2">Movie</h2>
                <select 
                    // value={movieID} 
                    onChange={handleMovieSelect}
                    className="w-full p-2 rounded-lg bg-transparent dark:bg-gray-800 dark:text-gray-300 overflow-hidden">
                    <option value="">Select a movie</option>
                    {movies.map(movie => (
                        <option key={movie._id} value={movie._id}>
                            {movie.title}
                        </option>
                    ))}
                </select>
                {formFillError.movieID && <div style={{ color: 'red' }}>{formFillError.movieID}</div>}

                <h2 className="text-xl mt-6 mb-2">Theatre</h2>
                <select 
                    // value={theatreID} /-
                    onChange={handleTheatreSelect}
                    className="w-full p-2 rounded-lg bg-transparent dark:bg-gray-800 dark:text-gray-300 overflow-hidden">
                    <option value="">Select a theatre</option>
                    {theatres.map(theatre => (
                        <option key={theatre._id} value={theatre._id}>
                            {theatre.theatreName}
                        </option>
                    ))}
                </select>
                {formFillError.theatreID && <div style={{ color: 'red' }}>{formFillError.theatreID}</div>}

                {city && <h2 className="text-sm mt-1 mx-2">City: {city}</h2>}      

                <div className="flex gap-4 mt-4">
                    <button type="submit" className="bg-gray-100 py-2 px-4 rounded-lg">
                        Submit
                    </button>

                    {id && (
                        <button
                            type="button"
                            onClick={deleteShowtime}
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
