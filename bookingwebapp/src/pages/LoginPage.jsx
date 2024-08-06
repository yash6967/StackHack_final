import { useState } from "react";
import {Link, Navigate} from "react-router-dom"
import axios from "axios";

export default function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function handleLoginSubmit(ev) {
        
        ev.preventDefault();
        
        try{

            await axios.post('/login', {email, password} );
            alert('Login Successful');

            setRedirect(true);

        }catch(loginFailedError){

            alert('Login Failed');

        }
    }

    if(redirect){

        return <Navigate to={'/'}/>

    }

    return(

        <div className="flex grow items-center justify-around">

            <div className="mb-64">

                <h1 className="text-2xl text-center p-3">Login</h1>

                <form className="max-w-md mx-auto" 

                    onSubmit={handleLoginSubmit}>

                    <input type="email"   

                        placeholder="your@email.com"       
                        value={email} 
                        onChange={ev => setEmail(ev.target.value)} />

                    <input type="password"  

                        placeholder="password" 
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)}/>

                    <button className="primary">login</button>

                    <div className="text-right py-2 text-gray-500">
                        Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register</Link>
                    </div>

                </form>

            </div>

        </div>
    );
    
}