import { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

export default function TrendingMoviesPage(){
    
    const [trendingMovies, setTrendingMovies] = useState([]);

    useEffect(() => {
        
        axios.get('/').then(response => {
            
            const allMovies = response.data;

            const moviesWithPhotos = allMovies.filter(movie => movie.photos?.[0]);

            const shuffledMovies = [...moviesWithPhotos].sort(() => 0.5 - Math.random());
            const selectedTrendingMovies = shuffledMovies.slice(0, 10);
            setTrendingMovies(selectedTrendingMovies);

        });

    }, []);

    return (

        <div className="mt-8">

            <h2 className="text-xl font-semibold mb-4 ml-6">Trending Movies</h2>
        
            <div className="scroller" data-animated="true">

                <div className="flex flex-nowrap gap-4 scroller__inner">
 
                    {[...trendingMovies, ...trendingMovies].map((movie, index) => (

                        <Link
                            className="
                                
                                h-60 w-40
                                sm:h-64 sm:w-40
                                md:h-72 md:w-48
                                lg:h-72 lg:w-52
                                xl:h-96 xl:w-60

                                "
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

    );

}