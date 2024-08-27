import { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

import TrendingMoviesPage from './TrendingMoviesPage';

export default function IndexPage() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        
        axios.get('/').then(response => {
            
            const allMovies = response.data;
            setMovies(allMovies);

        });

    }, []);

    return (
            
        <div>

            {/* Trending Movies Section */}
            <TrendingMoviesPage/>

            {/* All Movies */}
            <h2 className='text-xl font-semibold ml-6 mt-10'>All Movies</h2>

            <div className="mt-4 px-4 gap-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9">
            
            {movies.length > 0 && movies.map(it => (

            <Link 
                className="group relative link-border-hover rounded-lg overflow-hidden"
                to={'/movie/' + it._id} key={it._id}
                > 

                {it.photos?.[0] ? (
                    <div className="relative w-full h-full">
                        <img 
                            className="rounded-md object-cover w-full h-full group hover:scale-[1.05] transition-transform duration-300 ease-in-out" 
                            src={'http://localhost:4000/uploads' + it.photos[0]} 
                            alt={it.title} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-md"></div>
                    </div>
                ) : (
                    <div className="rounded-md bg-gray-200 w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">NO COVER</span>
                    </div>
                )}

                <h2 className="absolute bottom-2 left-2 right-0 text-white p-2">
                    {it.title}
                </h2>

            </Link>


            ))}

            </div>

        </div>
    );
}

