import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);

    }
    
    if(!ready){
        return 'Loading...';
    }
    
    if(ready && !user && !redirect){
        return <Navigate to ={'/login'} />
    }

    // const linkClasses = (page) => {
        
    //     return page === subpage ? 'inline-flex gap-1 bg-primary text-white rounded-full px-6 py-2' : 'inline-flex gap-1 rounded-full border-2 px-6 py-2';

    // };

    if(redirect){

        return <Navigate to = {redirect} />

    }

    return (

        <div>

            <AccountNavigation/>

            {/* <nav className="w-full flex justify-center mt-8 gap-2 mb-8">

                <Link className={linkClasses('profile')} to={'/account'}>My Account</Link>
                <Link className={linkClasses('adminMovies')} to={'/account/adminMovies'}>Your Movies</Link>

            </nav> */}

            {subpage === 'profile' && (

                <div className="text-center max-w-lg mx-auto">

                    Logged in as {user.name} ({user.email})<br/>
                    <button onClick = {logout} className="primary max-w-xs mt-2">Logout</button>

                </div>
            )}

            {subpage === 'adminMovies' && (

                <MoviesPage/>

            )}

        </div>

    );
}