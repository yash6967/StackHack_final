import { useState } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";

export default function TheatresFormPage() {

    const [name, setName] = useState('');
    // const [ticketPrice, setTicketPrice] = useState('');
    // const [rows, setRows] = useState('');
    // const [cols, setCols] = useState('');
    // const [city, setCity] = useState('');


    
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    
    

    const [redirect,setRedirect] = useState(false);

    function isValidURL(url) {
        try{
            new URL(url);
            return true;
        }catch{
            return false;
        }
    }
    
    async function addPhotoByLink(ev) {
        
        ev.preventDefault();
    
        if (!isValidURL(photoLink)) {
            alert('Invalid URL');
            return;
        }
    
        try{
            const { data: filename } = await axios.post('/upload-by-link', { link: photoLink });
            setAddedPhotos(prev => [...prev, filename]);
            setPhotoLink('');
            console.log('Image uploaded successfully');
            alert('Image uploaded successfully');
        }catch (error){
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please check the URL.');
        }
    }

    function uploadPhoto(ev){

        const files = ev.target.files;
        const data = new FormData();

        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }

        axios.post('/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            const { data: filenames } = response;
            setAddedPhotos(prev => {
                return [...prev, ...filenames]
            });
        }).catch(error => {
            console.error('Error uploading photos:', error);
            alert('Error uploading photos');
        });

    }

    async function addNewtheatre(ev){

        ev.preventDefault(); 

        try{

            await axios.post('/theatre/adminTheatres', {

                name, addedPhotos
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

        return <Navigate to={'/account/admintheatres'} />

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
                    value={name} 
                    onChange={ev => setName(ev.target.value)} 
                    // required 
                    />

                <h2 className="text-xl mt-2">Photos</h2>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        // id="photo-url" 
                        // name="photoUrl" 
                        placeholder="Photo URL" 
                        value={photoLink} 
                        onChange={ev => setPhotoLink(ev.target.value)} />

                    <button 
                        type="button"
                        onClick={addPhotoByLink}
                        className="text-blue-500 bg-transparent">
                        {/* Add&nbsp;photo */}
                        Add
                    </button>

                </div>

                <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {addedPhotos.length > 0 && addedPhotos.map(link => (
                        <div key={link}>
                            <img 
                                className="w-full h-full max-w-100 max-h-100 object-cover rounded-2xl" 
                                // src={`http://localhost:4000/${link}`}
                                src={`http://localhost:4000/uploads/${link}`}
                                // src={`http://localhost:4000/` + link}

                                alt={`Uploaded ${link}`}
                            />
                        </div>
                    ))}

                    <label className="cursor-pointer border bg-transparent rounded-2xl p-8 text-2xl text-gray-600 flex items-center justify-center" 
                        style={{ width: '100px', height: '100px' }}
                        >
                        <input 
                            type="file" 
                            // id="photo-upload" 
                            // name="photos" 
                            multiple className="hidden"     
                            onChange={uploadPhoto} />
                        +
                    </label>

                </div>

{/* 
                <h2 className="text-xl mt-2">ticketPrice</h2>
                <input 
                    type="number" 
                    name="ticketPrice" 
                    placeholder="ticketPrice (comma separated)" 
                    value={formData.ticketPrice} 
                    onChange={ev => setTicketPrice(ev.target.value)} 
                    required />

                <h2 className="text-xl mt-2">rows</h2>
                <input type="number" 
                    name="rows" 
                    placeholder="0" 
                    value={formData.length} 
                        onChange={ev => setRows(ev.target.value)} 
                        required />

                <h2 className="text-xl mt-2">cols</h2>
                <input type="number" 
                    name="cols" placeholder="0" 
                    value={formData.genre} 
                    onChange={handleChange} 
                    required />

                <h2 className="text-xl mt-2">City</h2>
                <input type="text" 
                    name="city" 
                    placeholder="City" 
                    value={formData.certificate} 
                    onChange={ev => setCols(ev.target.value)} 
                    required />

                 */}

                <button 
                    className="bg-gray-100 py-2 px-4 rounded-lg mt-4">
                Submit
                </button>

            </form>

        </div>
    );

}