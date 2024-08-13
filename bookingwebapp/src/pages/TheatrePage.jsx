import { Link, useParams } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TheatrePage() {
    
    const [theatres, settheatres] = useState([]);

    useEffect(() => {

        axios.get('/admintheatres').then(({data}) => {

            settheatres(data);

        });

    }, []);

    return (
        <div>

            <AccountNavigation/>

            <div className="text-center">
                <Link
                    className="inline-flex gap-1 items-center bg-gray-100 rounded-l py-2 px-5"
                    to={'/account/admintheatres/new'}>

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

                    Add New theatre
                    
                </Link><br/>

                <div className="mt-4">
                    {theatres.length > 0 && theatres.map(it => (
                        <div className="flex gap-4 bg-gray-200 p-4">

                            <div className="w-32 h-32 bg-gray-300">

                                {it.photos.length > 0 && (

                                    <img src={it.photos[0]} alt="theatre Poster" />

                                )}

                            </div>

                            <h2 className="text-xl">

                                {it.title}
                                
                            </h2>

                        </div>
                    ))}
                </div>
                
            </div>

        </div>
    );
}
