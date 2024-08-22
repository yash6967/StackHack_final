import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CityContext } from '../CityContext';
import SeatSelector from '../components/SeatSelector'

export default function ReservationFormPage() {

    const {id} = useParams();
    const { city } = useContext(CityContext);

    const [chooseCity, setChooseCity] = useState('');
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const cities = ['Delhi','Jaipur','Bhopal','Pune','Ahmedabad','Kota','Mumbai']
    const [showSeatSelector,setShowSeatSelector] = useState(false);
    const [rows,setRows] =useState(5); // Default values
    const [cols,setCols] = useState(5); // Default values
    const [ticketPrice,setTicketPrice] = useState([]);
    const [chooseTime,setChooseTime] = useState([]);
    const [chooseShowtimeId,setChooseShowtimeId] = useState([]);
    const [activeShowtime, setActiveShowtime] = useState(null);



    useEffect(() => {

        if(!id) {return};

        axios.get('/adminMovies/' + id).then( response => {

            setMovie(response.data);

        });

    }, [id]);

    if(!movie){
        return;
    }

    async function findMovie(ev){

        ev.preventDefault();

        if (!chooseCity) {
            console.log('City name is required.');
            return;
        }

        console.log('City name:', chooseCity);
        console.log('Movie ID:', id);

        const response = await axios.get('/findShowtimes', {
            params: {
                movieid: id,
                city: chooseCity
            }
        });
        
        setShowtimes(response.data);
        // console.log(response.data);

    }


    function handleChange(event, setter) {
        setter(event.target.value);
    }
    async function handleSeatSelection(it, time) {
        try {
            const response = await axios.get('/adminTheatres/' + it.theatreid);
            setRows(response.data.rows);
            setCols(response.data.cols);
            setTicketPrice(it.ticketPrice);
            setChooseTime(time);
            setChooseShowtimeId(it._id);
            setActiveShowtime({ id: it._id, time }); // Set the active showtime
            setShowSeatSelector(true);
        } catch (error) {
            console.error("Error fetching theatre details:", error);
        }
    }
     
    if (!movie) {
        return <div>Loading movie details...</div>;
    }


    return(

        <div>
            { city }
            <h2>{movie.title}</h2>

            <form onSubmit={findMovie}>

                {/* <h2>City</h2>
                <input
                    type="text"
                    name="city"
                    placeholder="Name of City"
                    value={chooseCity}
                    onChange={ev => handleChange(ev, setChooseCity)}
                /> */}

                <label 
                    className="text-xl mt-2"
                    >Select a City</label>
                    <select onChange={ev => handleChange(ev, setChooseCity)}>
                        <option>Select a city</option>
                        {cities.map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                        ))};
                    </select>
                    
                <button>
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
