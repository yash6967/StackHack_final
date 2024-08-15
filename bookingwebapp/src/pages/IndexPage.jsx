import { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';

export default function IndexPage() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        
        axios.get('/adminMovies').then(response => {
            
            // setMovies([...response.data, ...response.data, ...response.data]);
            setMovies(response.data);

        });

    }, []);

    return (
            
        <div className="mt-8 gap-x-6 gap-y-8 grid grid-col-2 md:grid-cols-3 lg:grid-cols-4">
   
           {movies.length > 0 && movies.map(it => (

                <div key={it._id}> 
                    
                    <div>

                        {it.photos?.[0] && (
                            <img className="rounded-lg object-cover w-full h-80 mb-1" src = {'http://localhost:4000/uploads' + it.photos?.[0]} alt = {it.title} />
                        )}

                        <h2 className="text-s truncate">
                            {it.title}
                        </h2>

                    </div>

                </div>

           ))}

        </div>
    );
}