import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function AccountNavigation(){

    const [userRole,setUserRole] = useState('');

    const {pathname} =  useLocation();
    let subpage = pathname.split('/')?.[2];
    if(subpage === undefined){
        subpage = 'profile';
    }

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('/profile');
                setUserRole(response.data.role); // Ensure you're accessing the correct property
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchUserRole();
    },[]);


    // useEffect(()=>{
    //     axios.get('/profile').then(response=>{
    //         setUserRole(response.role)
    //     })
    // })
    

    const linkClasses = (page) => {
        
        return page === subpage ? 'inline-flex gap-1 bg-primary text-white rounded-full px-6 py-2' : 'inline-flex gap-1 rounded-full border-2 px-6 py-2';

    };

    return(

        <nav className="w-full flex justify-center mt-8 gap-2 mb-8">

            <Link className={linkClasses('profile')} to={'/account'}>My Account</Link>
            {userRole==='admin' && (<Link className={linkClasses('adminMovies')} to={'/account/adminMovies'}>My Movies</Link>)}
            {userRole==='admin' && <Link className={linkClasses('adminTheatres')} to={'/account/adminTheatres'}>My Theatres</Link>}
            {userRole==='admin' && <Link className={linkClasses('adminShowtimes')} to={'/account/adminShowtimes'}>My Showtimes</Link>}
            {userRole==='superAdmin' && <Link className={linkClasses('superAdmin')} to={'/account/superAdmin'}>superAdmin</Link>}
            {userRole==='superAdmin' && (<Link className={linkClasses('adminMovies')} to={'/account/adminMovies'}>My Movies</Link>)}


        </nav>
    );
}