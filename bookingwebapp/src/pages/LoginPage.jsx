import { useContext, useState } from "react";
import {Link, Navigate} from "react-router-dom"
import axios from "axios";
import { UserContext } from "../UserContext.jsx";

export default function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev) {

        ev.preventDefault();

        try {
            const response = await axios.post('/login', { email, password });
    
            if (response.status === 200) {

                const userDocument = response.data;
                setUser(userDocument);
                alert('Login successful');
                setRedirect(true);

            } else {

                alert(response.data);

            }

        } catch (error) {

            if (error.response) {
              
                if (error.response.status === 401) {
                    alert('Incorrect password. Please try again.');
                } else if (error.response.status === 404) {
                    alert('Email not registered. Please check your email or sign up.');
                } else {
                    alert('Login failed. Please try again later.');
                }

            } else {

                alert('Login failed. Please try again later.');
                
            }
        }
    }

    async function handleGuestLogin(ev) {

        ev.preventDefault();

        try {
            const response = await axios.post('/login', { email:'guest@gmail.com', password:'guest' });
    
            if (response.status === 200) {

                const userDocument = response.data;
                setUser(userDocument);
                alert('Login Successful');
                setRedirect(true);

            } else {

                alert(response.data);

            }

        } catch (error) {

            if (error.response) {
              
                if (error.response.status === 401) {
                    alert('Incorrect password. Please try again.');
                } else if (error.response.status === 404) {
                    alert('Email not registered. Please check your email or sign up.');
                } else {
                    alert('Login failed. Please try again later.');
                }

            } else {

                alert('Login failed. Please try again later.');
                
            }
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

                    <button className="primary my-1">Login</button>
                    <button className="primary" onClick={handleGuestLogin}>Guest User</button>

                    <div className="text-right py-2 text-gray-500">
                        Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register</Link>
                    </div>

                </form>

            </div>

        </div>
    );
    
}