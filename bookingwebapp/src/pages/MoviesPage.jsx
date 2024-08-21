import axios from "axios";
import AccountNavigation from "./AccountNavigation";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from 'date-fns';

export default function MoviesPage() {

    const [movies, setMovies] = useState([]);
    const [expandedMovieId, setExpandedMovieId] = useState('');

    useEffect(() => {

        axios.get('/adminMovies').then(({ data }) => {

            setMovies(data);

        });

    }, []);

    const formatReleaseDate = (dateString) => {
        return format(new Date(dateString), 'dd MMM yyyy');
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${parseInt(hours, 10)}h ${parseInt(minutes, 10)}m`;
    };

    const toggleDetails = (movieId) => {
        // Toggle the expanded state for the clicked movie
        setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
    };

    return (
        <div className="px-4 mb-10">

            <AccountNavigation />

            <div className="text-center">
                <Link
                    className="inline-flex gap-1 items-center bg-gray-100 rounded py-2 px-5"
                    to={'/account/adminMovies/new'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    Add New Movie
                </Link><br />
            </div>

            <h2 className="dark:text-primary-50 my-10 text-xl font-thin"> You are currently listing {movies.length} movies !</h2>
            
            <div className="mt-4">
                
                {movies.length > 0 && movies.map(it => (
                    <div key={it._id} className="flex cursor-pointer gap-4 my-4">
                        <div className="flex w-32 h-40 overflow-hidden">
                            {it.photos.length > 0 && (
                                <img
                                    src={'http://localhost:4000/uploads/' + it.photos[0]}
                                    alt="Movie Poster"
                                    className="w-full h-full object-cover rounded-sm"
                                />
                            )}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-lg">{it.title}</h2>
                            <div className="mt-2 flex gap-2">
                                <Link to={'/account/adminMovies/' + it._id}>
                                    <button className="bg-black text-white px-3 py-1 rounded">
                                        Edit
                                    </button>
                                </Link>
                                <button 
                                    className="bg-black text-white px-3 py-1 rounded"
                                    onClick={() => toggleDetails(it._id)}
                                >
                                    Details
                                </button>
                            </div>

                            {expandedMovieId === it._id && (
                                <div className="mt-2 bg-gray-100 p-2 rounded">
                                    <p><strong>Director:</strong> {it.director}</p>
                                    <p><strong>Release Date:</strong> {formatReleaseDate(it.releaseDate)} </p>
                                    <p><strong>Genre:</strong> {it.genre.map((genre, index) => (
                                        <span>
                                            {genre}{index < it.genre.length - 1 && ', '}
                                        </span>
                                    ))}</p>
                                    <p><strong>Duration:</strong> {formatTime(it.length)}</p>
                                    <p><strong>Certification:</strong> {it.certificate}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );

}
