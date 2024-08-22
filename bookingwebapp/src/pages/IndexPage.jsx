import { useEffect, useState } from 'react';
import {Link, Navigate} from "react-router-dom";
import axios from 'axios';

export default function IndexPage() {

    const [movies, setMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);

    // useEffect(() => {
        
    //     axios.get('/').then(response => {
            
    //         // setMovies([...response.data, ...response.data, ...response.data]);
    //         setMovies(response.data);

    //     });

    // }, []);

    useEffect(() => {
        
        axios.get('/').then(response => {
            
            const allMovies = response.data;
            setMovies(allMovies);

            const shuffledMovies = [...allMovies].sort(() => 0.5 - Math.random());
            const selectedTrendingMovies = shuffledMovies.slice(0, 10);
            setTrendingMovies(selectedTrendingMovies);

        });

    }, []);

    return (
            
        <div>

            {/* Trending Movies Section */}
            <div className="mt-8">

                <h2 className="text-xl font-semibold mb-4 ml-6">Trending Movies</h2>
            
                <div className="scroller" data-animated="true">
                    <div className="scroller__inner">
                        {/* Duplicate movies array to create seamless loop */}
                        {[...trendingMovies, ...trendingMovies].map((movie, index) => (
                        <Link
                            className="relative flex-shrink-0 h-82 w-60"
                            to={'/movie/' + movie._id}
                            key={index + movie._id} /* Use a unique key */
                        >
                            {movie.photos?.[0] && (
                            <img
                                className="rounded-lg object-cover w-full h-full"
                                src={'http://localhost:4000/uploads' + movie.photos[0]}
                                alt={movie.title}
                            />
                            )}
                        </Link>
                        ))}
                    </div>
                </div>

            </div>

            {/* All Movies */}
            <h2 className='text-xl font-semibold ml-6 mt-10'>All Movies</h2>

            <div className="mt-4 px-4 gap-x-4 gap-y-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9">
            
            {movies.length > 0 && movies.map(it => (

                    <Link 
                        className="relative h-82 w-50 link-border-hover rounded-lg"
                        to = {'/movie/' + it._id} key={it._id}> 

                            {it.photos?.[0] && (
                                <img 
                                    className="rounded-md object-cover w-full h-full" 
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
        </div>
    );
}

