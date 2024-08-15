import { useState,useEffect } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";


export default function ShowtimesFormPage() {

    const {id} = useParams();
    const [movie, setmovie] = useState('');
    const [theatre,settheatre] = useState('');
    const [showdate,setdate] = useState([]);
    const [daytime,settime] = useState([]);
    const [errors, setErrors] = useState({});

    const [redirect,setRedirect] = useState(false);

    useEffect(() => {

        if(!id){ 
            return;
        }
        
        axios.get('/adminShowtimes/' + id).then(response => {

            const {data} = response;
            setmovie(data.movie);
            settheatre(data.theatre);
            setdate(data.showdate);
            settime(data.daytime);

            /* AND EXTRA SETS */

        });

    }, [id]);

    function validateForm() {
        const newErrors = {};
        if (!movie) newErrors.movie = 'Movie name is required';
        if (!theatre) newErrors.theatre = 'Theatre name is required';
        if (!showdate || showdate === '') newErrors.showdate = 'showDate is required';
        if (!daytime || daytime === '') newErrors.daytime = 'Time is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    

    async function saveshowtime(ev){

        ev.preventDefault(); 

        if (!validateForm()) {
            return;
        }

        const showtimeData = {

            id,
            movie,
            theatre,
            showdate,
            daytime
        };

        if(id){

            /* update */

            try{
                
                console.log('showtime Successfully updated');

                await axios.put('/adminShowtimes', {
                    id, ...showtimeData
                });
                
                setRedirect(true);
                alert('showtime Successfully updated');
    
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

    async function deleteshowtime(){
        if (window.confirm("Are you sure you want to delete this showtime?")) {
            try {
              await axios.delete(`/adminShowtimes/${id}`);
              setRedirect(true);
              alert("showtime successfully deleted");
            } catch (error) {
              console.error("Error deleting showtime:", error);
              alert("Failed to delete the showtime");
            }
          }
    }
    
    if (redirect) {
        return <Navigate to='/account/adminShowtimes' />;
    }


    

    return (

        <div>

            <AccountNavigation/>
            

            <form onSubmit={saveshowtime}>

                <h2 className="text-xl mt-2">movie Name</h2>
                <input 
                    type="text" 
                    // id="showtime-name"
                    // name="name" 
                    placeholder="Name of moviee" 
                    value={movie} 
                    onChange={ev => setmovie(ev.target.value)}
                    className={`border ${errors.movie ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 w-full`} 
                    // required 
                    />
                    {errors.movie && <div className="text-red-500 text-sm mt-1">{errors.movie}</div>}

                <h2 className="text-xl mt-2">theatre Name</h2>
                <input 
                    type="text" 
                    // id="showtime-name"
                    // name="name" 
                    placeholder="Name of showtime" 
                    value={theatre} 
                    onChange={ev => settheatre(ev.target.value)}
                    className={`border ${errors.theatre ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 w-full`} 
                    // required 
                    />
                    {errors.theatre && <div className="text-red-500 text-sm mt-1">{errors.theatre}</div>}

                <h2 className="text-xl mt-2">showdate</h2>
                <input 
                    type="date" 
                    // id="showtime-name"
                    // name="name" 
                    placeholder="Name of showtime" 
                    value={showdate} 
                    onChange={ev => setdate(ev.target.value)}
                    className={`border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 w-full`} 
                    // required 
                    />  
                    {errors.showdate && <div className="text-red-500 text-sm mt-1">{errors.showdate}</div>}

                <h2 className="text-xl mt-2">time</h2>
                <input 
                    type="time" 
                    // id="showtime-name"
                    // name="name" 
                    placeholder="time" 
                    value={daytime} 
                    onChange={ev => settime(ev.target.value)} 
                    className={`border ${errors.daytime ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 w-full`}
                    // required 
                    />
                    {errors.daytime && <div className="text-red-500 text-sm mt-1">{errors.daytime}</div>} 
                
                

                

                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="bg-gray-100 py-2 px-4 rounded-lg">
                            Submit
                        </button>

                        {id && (
                            <button
                            type="button"
                            onClick={deleteshowtime}
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