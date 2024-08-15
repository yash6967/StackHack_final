import { Link, useParams } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ShowtimesPage() {
    
    const [showtimes, setShowtimes] = useState([]);
    const [movieid, setmovieid] = useState([]);
    const [theatreid,settheatreid] = useState([]);
    const [date,setdate] = useState([]);
    const [daytime,settime] = useState([]);
    const [theatreName,settheatrename] = useState([]);
    const [movieTitle,setmovietitle] = useState([]);
    const [moviePhotos,setmoviephotos] = useState([]);


    useEffect(() => {

        axios.get('/adminShowtimes').then(({data}) => {

            setShowtimes(data);

        });

        // axios.get('/adminTheatres/:'+ theatreid).then(({data})=>{
        //     settheatrename(data.theatreName);
        // })

        // axios.get('/adminMovies/:'+ movieid).then(({data})=>{
        //     setmovietitle(data.title);
        //     setmoviephotos(data.photos);

        // })

    }, []);

    

    return (
        <div>

            <AccountNavigation/>

            <div className="text-center">
                <Link
                    className="inline-flex gap-1 items-center bg-gray-100 rounded-l py-2 px-5"
                    to={'/account/adminShowtimes/new'}>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5">
                            
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>

                    Add New showtime
                    
                </Link><br/>

                <div className="mt-4">
                    {showtimes.length > 0 && showtimes.map(it => (
                        <Link 
                            key={it._id} 
                            to = {'/account/adminShowtimes/' + it._id} 
                            className="flex cursor-pointer gap-4 bg-gray-200 p-4">

                            {/* <div className="flex w-32 h-32 bg-gray-300">

                                {it.photos.length > 0 && (

                                    <img src={'http://localhost:4000/uploads/' + it.photos[0]} alt="showtime Poster" />

                                )}

                            </div> */}

                            <h2 className="text-xl">

                                {it.movie} <br></br>
                                {it.theatre}<br></br>
                                {it.showdate}<br></br>
                                {it.daytime}<br></br>
                                
                            </h2>

                        </Link>
                    ))}
                </div>
                
            </div>

        </div>
    );
}
