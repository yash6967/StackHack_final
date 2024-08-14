import { useState,useEffect } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";


export default function TheatresFormPage() {

    const {id} = useParams();
    const [theatreName, setName] = useState('');
    // const [ticketPrice, setTicketPrice] = useState('');
    // const [rows, setRows] = useState('');
    // const [cols, setCols] = useState('');
    // const [city, setCity] = useState('');



    const [redirect,setRedirect] = useState(false);

    useEffect(() => {

        if(!id){ 
            return;
        }
        
        axios.get('/adminTheatres/' + id).then(response => {

            const {data} = response;
            setName(data.theatreName);

            /* AND EXTRA SETS */

        });

    }, [id]);

    

    async function savetheatre(ev){

        ev.preventDefault(); 

        const theatreData = {

            id,
            theatreName

        };

        if(id){

            /* update */

            try{
                
                console.log('theatre Successfully updated');

                await axios.put('/adminTheatres', {
                    id, ...theatreData
                });
                
                setRedirect(true);
                alert('theatre Successfully updated');
    
            }catch(error){
    
                console.error('Error updating theatre:', error);
                alert('Failed to upate this theatre');
    
            }

        }else{

            /* new */

            try{

                await axios.post('/adminTheatres', theatreData);
    
                setRedirect(true);
                alert('theatre Successfully added');
    
            }catch(error){
    
                console.error('Error adding new theatre:', error);
                alert('Failed to add new theatre');
    
            }

        }

    }
    if (redirect) {
        return <Navigate to='/account/adminTheatres' />;
    }

    return (

        <div>

            <AccountNavigation/>
            

            <form onSubmit={savetheatre}>

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