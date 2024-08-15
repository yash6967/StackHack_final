import { useState, useEffect } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";

export default function MoviesFormPage() {

    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [formFillError, setFormFillError] = useState('');
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

    useEffect(() => {

        if(!id){ 
            return;
        }
        
        axios.get('/adminMovies/' + id).then(response => {

            const {data} = response;
            setTitle(data.title);
            setAddedPhotos(data.photos);

            /* AND EXTRA SETS */

        });

    }, [id]);

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

    async function saveMovie(ev){

        ev.preventDefault(); 

        if (!title) {

            setFormFillError('Title is required');
            return;

        }else{

            setFormFillError('');

            const movieData = {

                id,
                title, addedPhotos
                // ,languages, length, genre, certificate, releaseDate, director, description, cast, crew
    
            };
    
            if(id){
    
                /* update */
    
                try{
                    
                    console.log('Movie Successfully updated');
    
                    await axios.put('/adminMovies', {
                        id, ...movieData
                    });
                    
                    setRedirect(true);
                    alert('Movie Successfully updated');
        
                }catch(error){
        
                    console.error('Error updating movie:', error);
                    alert('Failed to upate this movie');
        
                }
    
            }else{
    
                /* new */
    
                try{
    
                    await axios.post('/adminMovies', movieData);
        
                    setRedirect(true);
                    alert('Movie Successfully added');
        
                }catch(error){
        
                    console.error('Error adding new movie:', error);
                    alert('Failed to add new movie');
        
                }
    
            }

        }

    }

    async function deleteMovie(){
        if (window.confirm("Are you sure you want to delete this movie?")) {
            try {
              await axios.delete(`/adminMovies/${id}`);
              setRedirect(true);
              alert("movie successfully deleted");
            } catch (error) {
              console.error("Error deleting movie:", error);
              alert("Failed to delete the movie");
            }
          }
    }
    if (redirect) {
        return <Navigate to='/account/adminMovies' />;
    }

    function removePhoto(photoName){

        setAddedPhotos([...addedPhotos.filter(photo => photo != photoName)])

    }

    return (

        <div>

            <AccountNavigation/>

            <form onSubmit={saveMovie}>

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
                {formFillError && <div style={{ color: 'red' }}>{formFillError}</div>}

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
                        <div className = "flex relative" key={link}>

                            <img 
                                className="w-full h-full max-w-100 object-cover rounded-2xl" 
                                // src={`http://localhost:4000/${link}`}
                                src={`http://localhost:4000/uploads/${link}`}
                                // src={`http://localhost:4000/` + link}

                                alt={`Uploaded ${link}`}
                            />

                            <button 
                                
                                onClick = {() => removePhoto(link)}
                                className="absolute right-2 top-2 text-white bg bg-black bg-opacity-50 rounded-2xl cursor-pointer">

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                            </button>

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

        <div className="flex gap-4 mt-4">
          <button type="submit" className="bg-gray-100 py-2 px-4 rounded-lg">
            Submit
          </button>

          {id && (
            <button
              type="button"
              onClick={deleteMovie}
              className="bg-red-500 text-white py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          )}
        </div>

            </form>

        </div>
    );

}