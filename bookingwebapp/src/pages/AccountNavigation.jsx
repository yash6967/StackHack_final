import { Link, useLocation } from "react-router-dom";

export default function AccountNavigation(){

    const {pathname} =  useLocation();
    let subpage = pathname.split('/')?.[2];
    if(subpage === undefined){
        subpage = 'profile';
    }

    const linkClasses = (page) => {
        
        return page === subpage ? 'inline-flex gap-1 bg-primary text-white rounded-full px-6 py-2' : 'inline-flex gap-1 rounded-full border-2 px-6 py-2';

    };

    return(

        <nav className="w-full flex justify-center mt-8 gap-2 mb-8">

            <Link className={linkClasses('profile')} to={'/account'}>My Account</Link>
            <Link className={linkClasses('adminMovies')} to={'/account/adminMovies'}>My Movies</Link>
            
            <Link className={linkClasses('adminTheatres')} to={'/account/adminTheatres'}>My Theatres</Link>

        </nav>
    );
}