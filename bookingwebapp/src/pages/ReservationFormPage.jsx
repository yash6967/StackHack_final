import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ReservationFormPage() {

    const {id} = useParams();
    const [city, setCity] = useState('');
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);

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

        if (!city) {
            console.log('City name is required.');
            return;
        }

        console.log('City name:', city);
        console.log('Movie ID:', id);

        const response = await axios.get('/findShowtimes', {
            params: {
                movieid: id,
                city: city
            }
        });
        
        setShowtimes(response.data);

    }

    function handleChange(event, setter) {
        setter(event.target.value);
    }

    return(

        <div>

            <h2>{movie.title}</h2>

            <form onSubmit={findMovie}>

                <h2>City</h2>
                <input
                    type="text"
                    name="city"
                    placeholder="Name ofCity"
                    value={city}
                    onChange={ev => handleChange(ev, setCity)}
                />

                <button>
                    Submit
                </button>

            </form>

            {showtimes.length > 0 && showtimes.map(it => (

                <div>

                    <strong>Theatre:</strong> {it.theatreName} <br />
                    <strong>Date:</strong> {new Date(it.showdate).toLocaleDateString()} <br />
                    <strong>Time:</strong> {it.daytime} <br />
                       
                </div>

            ))}

        </div>

    );    
   
}
