import { useState } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";


export default function TheatresFormPage() {

    const [theatreName, setName] = useState('');
    // const [ticketPrice, setTicketPrice] = useState('');
    // const [rows, setRows] = useState('');
    // const [cols, setCols] = useState('');
    // const [city, setCity] = useState('');



    const [redirect,setRedirect] = useState(false);

    
    
    
        
    

    

    

    async function addNewtheatre(ev){

        ev.preventDefault(); 

        try{

            await axios.post('/adminTheatres', {

                theatreName
                //,ticketPrice, rows, cols, city
    
            });

            setRedirect(true);
            alert('theatre Successfully added');

        }catch(error){

            console.error('Error adding new theatre:', error);
            alert('Failed to add new theatre');

        }

    }

    if (redirect) {

        return <Navigate to={'/admintheatres'} />

    }

    return (

        <div>

            <AccountNavigation/>
            

            <form onSubmit={addNewtheatre}>

                <h2 className="text-xl mt-2">Theatre Name</h2>
                <input 
                    type="text" 
                    // id="theatre-name"
                    // name="name" 
                    placeholder="Name of theatre" 
                    value={theatreName} 
                    onChange={ev => setName(ev.target.value)} 
                    // required 
                    />

                
                

                

                <button 
                    className="bg-gray-100 py-2 px-4 rounded-lg mt-4">
                Submit
                </button>

            </form>

        </div>
    );

}