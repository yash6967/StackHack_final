import { useState } from "react";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";

export default function RegisterPage(){

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    async function registerUser (ev){

        ev.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try{

            await axios.post('/register', {
                name,
                email,
                password,
            });
    
            setRedirectToLogin(true);
            alert('You have been registered');

        }catch(duplicateMailError){

            alert('This mail has already been registered');

        }

    }

    if(redirectToLogin){
        return <Navigate to='/login' />;
    }

    return(

        <div className="flex grow items-center justify-around">

            <div className="mb-64">

                <h1 className="text-2xl text-center p-3">Register</h1>

                <form className="max-w-md mx-auto" onSubmit={registerUser}>

                <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={ev => setConfirmPassword(ev.target.value)}
                        required
                    />
                    <button className="primary">Register</button>
                    <div className="text-right py-2 text-gray-500">
                        Already have an account? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>

                </form>

            </div>

        </div>
    );
    
}