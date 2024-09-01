import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function AccountNavigation() {
  const [userRole, setUserRole] = useState('');
  const {ready, user, setUser} = useContext(UserContext);
  const { pathname } = useLocation();
  let subpage = pathname.split('/')?.[2];
  if (subpage === undefined) {
    subpage = 'profile';
  }

  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     try {
  //       //const response = await axios.get('/profile');
  //       if(ready){
  //         setUserRole(user.role);
  //       }

        
  //     } catch (error) {
  //       console.error('Error fetching user role:', error);
  //     }
  //   };
  //   fetchUserRole();
  // }, [ready]);

  useEffect(() => {
    if (ready && user) {  // Ensure user is defined
      setUserRole(user.role);
    }
  }, [ready, user]);  // Add user as a dependency


  const linkClasses = (page) => {
    return page === subpage
      ? 'px-6 py-2 text-primary-600 dark:text-primary-300'
      : 'rounded-full border px-6 py-2 text-gray-700 dark:text-gray-300';
  };

  return (
    <nav className="flex items-center justify-between mb-8 mt-12 md:flex-row md:justify-center md:gap-5 font-medium">
      {/* Links for larger screens */}
      <div className="hidden md:flex gap-3">
        <Link className={linkClasses('profile')} to={'/account'}>My Account</Link>
        {userRole === 'admin' && (
          <>
            <Link className={linkClasses('adminMovies')} to={'/account/adminMovies'}>My Movies</Link>
            <Link className={linkClasses('adminTheatres')} to={'/account/adminTheatres'}>My Theatres</Link>
            <Link className={linkClasses('adminShowtimes')} to={'/account/adminShowtimes'}>My Showtimes</Link>
          </>
        )}
        {userRole === 'superAdmin' && (
          <Link className={linkClasses('superAdmin')} to={'/account/superAdmin'}>superAdmin</Link>
        )}
      </div>
    </nav>
  );
}