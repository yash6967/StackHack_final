import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import MoviesPage from "./MoviesPage";
import AccountNavigation from "./AccountNavigation";

export default function AccountPage(){

    const {ready, user, setUser} = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);

    let { subpage } = useParams();

    if(subpage === undefined){
        subpage = 'profile';
    }

    async function logout(){

        // await axios.post('/logout', {}, { withCredentials: true });
        // // await axios.post('/logout');
        // setRedirect('/');
        // setUser(null);

        try {

            await axios.post('/logout', {}, { withCredentials: true });
            setRedirect('/');
            setUser(null);

        } catch (error) {

            console.error('Logout failed:', error);
            
        }

    }
    
    if(!ready){
        return 'Loading...';
    }
    
    if(ready && !user && !redirect){
        return <Navigate to ={'/login'} />
    }

    if(redirect){

        return <Navigate to = {redirect} />

    }

    return (

        <div>

            <AccountNavigation/>

            {subpage === 'profile' && (

                <div className="flex flex-col items-center max-w-lg mx-auto dark:text-primary-50">

                    <div className="font-light">
                        Logged in as {user.name} ({user.email})<br/>
                    </div>

                    <button 
                        // onClick = {logout} 
                        className="min-w-32 bg-orange-400 rounded py-1 px-3 text-primary-50 mt-9">My Bookings</button>

                    <button 
                        onClick = {logout} 
                        className="min-w-32 bg-orange-400 rounded py-1 px-3 text-primary-50 mt-4">Logout</button>


                </div>
            )}

            {subpage === 'adminMovies' && (

                <MoviesPage/>

            )}

        </div>

    );
}