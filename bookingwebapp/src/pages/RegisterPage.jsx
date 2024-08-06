import { useState } from "react";
import {Link} from "react-router-dom";
import axios from "axios";

export default function RegisterPage(){

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    async function registerUser (ev){

        ev.preventDefault();

        try{

            await axios.post('/register', {
                name,
                email,
                password,
            });
    
            alert('You have been registered');

        }catch(duplicateMailError){

            alert('This mail has already been registered');

        }

    }

    return(

        <div className="flex grow items-center justify-around">

            <div className="mb-64">

                <h1 className="text-2xl text-center p-3">Register</h1>

                <form className="max-w-md mx-auto" onSubmit={registerUser}>

                    <input type="text" placeholder="name" 
                        value={name} 
                        onChange={ev => setName(ev.target.value)}/>

                    <input type="email" placeholder="your@email.com" 
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}/>

                    <input type="password" placeholder="password" 
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}/>

                    <button className="primary">Register</button>

                    <div className="text-right py-2 text-gray-500">
                        Already have an account? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>

                </form>

            </div>

        </div>
    );
    
}