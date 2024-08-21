import axios from "axios";
import AccountNavigation from "./AccountNavigation";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from 'date-fns';

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

    const formatReleaseDate = (dateString) => {
        return format(new Date(dateString), 'dd MMM yyyy');
    };

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

                    Add New Showtime
                    
                </Link><br/>

                <div className="mt-4">
                    {showtimes.length > 0 && showtimes.map(it => (
                        <Link 
                            key={it._id} 
                            to = {'/account/adminShowtimes/' + it._id} 
                            className="flex cursor-pointer gap-4 bg-gray-200 p-4">


                            <h2 className="text-xl">

                                {it.movieName} <br></br>
                                {it.theatreName}<br></br>
                                {formatReleaseDate(it.showdate)}<br></br>
                                {it.daytime}<br></br>
                                
                            </h2>

                        </Link>
                    ))}
                </div>
                
            </div>

        </div>
    );
}
