import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
import CitySelector from './CitySelector';
import DarkModeToggle from './DarkModeToggle';
import { UserContext } from "../UserContext";
import SearchPage from '../pages/SearchPage';
import axios from 'axios';

export default function Header() {
    const { user } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('/profile');
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchUserRole();
    }, []);

    const linkClasses = () => {
        return 'inline-flex items-center justify-center w-full rounded-full py-2 border-2 border-transparent hover:border-black dark:hover:border-white transition dark:text-white';
    };

    return (
        <header className="relative flex justify-between gap-4 px-4">
            {/* LOGO */}
            <Link to={'/'} className="flex gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d9488" className="size-6">
                    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                </svg>
                <span className="font-bold dark:text-white">StackHack</span>
            </Link>

            {/* Search Menu */}
            <SearchPage />

            <CitySelector />

            {/* Profile Icon */}
            <Link to={user ? '/account' : '/login'} className="flex items-center dark:text-primary-50">
                {user ? (
                    <span className="mr-2">{user.name}</span>
                ) : (
                    <span>Sign In</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            </Link>

            <DarkModeToggle />

            {/* Hamburger Button for Smaller Screens */}
            <div className="flex items-center md:hidden">
                <button
                    className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full shadow-md focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg
                        className="w-6 h-6 text-primary dark:text-primary-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Dropdown Menu for Smaller Screens */}
            <div
                className={`absolute top-full right-0 md:hidden flex flex-col items-center w-1/4 bg-gray-50 dark:bg-gray-800 bg-opacity-90 backdrop-blur shadow-lg mt-2 p-4 space-y-2 transition-all duration-300 ease-out transform z-50 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                style={{ transformOrigin: 'top right' }}
            >
                <Link className={linkClasses('profile')} to={'/account'} onClick={() => setIsMenuOpen(false)}>My Account</Link>
                {userRole === 'admin' && (
                    <>
                        <Link className={linkClasses('adminMovies')} to={'/account/adminMovies'} onClick={() => setIsMenuOpen(false)}>My Movies</Link>
                        <Link className={linkClasses('adminTheatres')} to={'/account/adminTheatres'} onClick={() => setIsMenuOpen(false)}>My Theatres</Link>
                        <Link className={linkClasses('adminShowtimes')} to={'/account/adminShowtimes'} onClick={() => setIsMenuOpen(false)}>My Showtimes</Link>
                    </>
                )}
                {userRole === 'superAdmin' && (
                    <Link className={linkClasses('superAdmin')} to={'/account/superAdmin'} onClick={() => setIsMenuOpen(false)}>SuperAdmin</Link>
                )}
            </div>
        </header>
    );
}
