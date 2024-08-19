import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function MoviePage(){

    const {id} = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {

        if(!id) {return};

        axios.get('/adminMovies/' + id).then( response => {

            setMovie(response.data);

        });

    }, [id]);

    if(!movie){
        return;
    }

    return (
    
        <div className="mt-8 bg-back">

            <h1 className="text-4xl">
                {movie.title}
            </h1>

            <img src={'http://localhost:4000/uploads' + movie.photos[0]} alt="" />
        
            <div>
                <h2 className="text-2xl">Description</h2>
                {movie.description}
            </div>

            <Link
                className="inline-flex gap-1 items-center bg-gray-100 rounded-l py-2 px-5"
                to = {'/movie/book/' + id}> 

                Book
                
            </Link>

        </div>

    );
}