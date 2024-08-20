import { useEffect, useState } from 'react';
import {Link, Navigate} from "react-router-dom";
import Header from '../components/Header';
import axios from 'axios';

export default function IndexPage() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        
        axios.get('/').then(response => {
            
            // setMovies([...response.data, ...response.data, ...response.data]);
            setMovies(response.data);

        });

    }, []);

    return (
            
        <div className="mt-8 px-4 gap-x-4 gap-y-8 grid grid-col-2 md:grid-cols-4 lg:grid-cols-5">
   
           {movies.length > 0 && movies.map(it => (

                <Link 
                    className="relative h-82 w-50"
                    to = {'/movie/' + it._id} key={it._id}> 

                        {it.photos?.[0] && (
                            <img 
                                className="rounded-lg object-cover w-full h-full" 
                                src = {'http://localhost:4000/uploads' + it.photos?.[0]} 
                                alt = {it.title} 
                            />
                        )}

                    <h2 className= "absolute bottom-2 left-2 right-0 text-white p-2">
                        {it.title}
                    </h2>

                </Link>

           ))}

        </div>
    );
}

