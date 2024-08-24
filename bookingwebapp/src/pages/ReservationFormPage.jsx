import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CityContext } from '../CityContext';
import SeatSelector from '../components/SeatSelector'
import DateSelector from '../components/DateSelector';
export default function ReservationFormPage() {

    const {id} = useParams();
    const { city } = useContext(CityContext);

    const [chooseCity, setChooseCity] = useState('');
    const [chooseShowDate,setChooseShowDate] = useState('');
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


    async function findMovie(ev) {
        ev.preventDefault();
    
        if (!chooseCity && !chooseShowDate) {
            console.log('City or Date name is required.');
            return;
        }
    
        const params = {
            movieid: id,
        };
    
        if (chooseCity) {
            params.city = chooseCity;
        }
    
        if (chooseShowDate instanceof Date && !isNaN(chooseShowDate)) {
            params.showdate = chooseShowDate.toISOString().split('T')[0];
        }
    
        try {
            const response = await axios.get('/findShowtimes', { params });
            setShowtimes(response.data);
        } catch (error) {
            console.error("Error fetching showtimes:", error);
        }
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

   
      const handleDateSelect = (date) => {
        console.log("Selected Date:", date);  // Ensure the correct date is being selected
        const formattedDate = date.toString().split('T')[0]; // Convert to YYYY-MM-DD
        setChooseShowDate(date);
        console.log("Formatted Date:", formattedDate);
      
        // Use formattedDate for any API calls or further processing
      };
     
    if (!movie) {
        return <div>Loading movie details...</div>;
    }


    return(

        <div>
            { city }
            <h2>{movie.title}</h2>
            <form onSubmit={findMovie}>
                <label 
                    className="text-xl mt-2"
                    >Select a City</label><br></br>
                    <select onChange={ev => handleChange(ev, setChooseCity)}>
                        <option>Select a city</option>
                        {cities.map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                        ))};
                    </select>
                    <div className="relative bg-gray-100">
                    <h1 className="text-xl font-bold text-center my-8">Select a Date</h1><br></br>
                    <DateSelector onSelect={handleDateSelect}  />
                    <div className="text-center mt-8">
                        {/* Additional content of the app */}
                    </div>
                    </div>


                    
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
