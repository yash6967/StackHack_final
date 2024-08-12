import { useState } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";

export default function MoviesFormPage() {

    const [title, setTitle] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    // const [languages, setLanguages] = useState([]);
    // const [length, setLength] = useState('');
    // const [genre, setGenre] = useState('');
    // const [certificate, setCertificate] = useState('');
    // const [releaseDate, setReleaseDate] = useState('');
    // const [director, setDirector] = useState('');
    // const [description, setDescription] = useState('');
    // const [cast, setCast] = useState([]);
    // const [crew, setCrew] = useState([]);

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

    async function addNewMovie(ev){

        ev.preventDefault(); 

        try{

            await axios.post('/adminMovies', {

                title, addedPhotos
                // ,languages, length, genre, certificate, releaseDate, director, description, cast, crew
    
            });

            setRedirect(true);
            alert('Movie Successfully added');

        }catch(error){

            console.error('Error adding new movie:', error);
            alert('Failed to add new movie');

        }

    }

    if (redirect) {

        return <Navigate to={'/account/adminMovies'} />

    }

    return (

        <div>

            <AccountNavigation/>

            <form onSubmit={addNewMovie}>

                <h2 className="text-xl mt-2">Title</h2>
                <input 
                    type="text" 
                    // id="movie-title"
                    // name="title" 
                    placeholder="Name of movie" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)} 
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


                {/* <h2 className="text-xl mt-2">Languages</h2>
                <input 
                    type="text" 
                    name="languages" 
                    placeholder="Languages (comma separated)" 
                    value={formData.languages} 
                    onChange={handleChange} 
                    required />

                <h2 className="text-xl mt-2">Length</h2>
                <input type="text" 
                    name="length" 
                    placeholder="Length (HH:MM:SS)" 
                    value={formData.length} 
                        onChange={handleChange} 
                        required />

                <h2 className="text-xl mt-2">Genre</h2>
                <input type="text" 
                    name="genre" placeholder="Genre" 
                    value={formData.genre} 
                    onChange={handleChange} 
                    required />

                <h2 className="text-xl mt-2">Certificate</h2>
                <input type="text" 
                    name="certificate" 
                    placeholder="Certificate" 
                    value={formData.certificate} 
                    onChange={handleChange} 
                    required />

                <h2 className="text-xl mt-2">Director</h2>
                <input type="text" 
                    name="director" 
                    placeholder="Director" 
                    value={formData.director} 
                    onChange={handleChange} />

                <h2 className="text-xl mt-2">Release Date</h2>
                <input type="date" 
                    name="releaseDate" 
                    placeholder="Release Date" 
                    value={formData.releaseDate} 
                    onChange={handleChange} 
                    required />

                <h2 className="text-xl mt-2">Description</h2>
                <textarea 
                    name="description" 
                    placeholder="Description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required />

                <h2 className="text-xl mt-2">Cast</h2>
                <input 
                    type="text" 
                    name="cast" 
                    placeholder="Cast (comma separated)" 
                    value={formData.cast} 
                    onChange={handleChange} />

                <h2 className="text-xl mt-2">Crew</h2>
                <input 
                    type="text" 
                    name="crew" 
                    placeholder="Crew (comma separated)" 
                    value={formData.crew} 
                    onChange={handleChange} /> */}

                <button 
                    className="bg-gray-100 py-2 px-4 rounded-lg mt-4">
                Submit
                </button>

            </form>

        </div>
    );

}