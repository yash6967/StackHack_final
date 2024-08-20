import React, { useContext } from 'react';
import { CityContext } from '../CityContext';

const CitySelector = () => {

    const { city, setCity } = useContext(CityContext); 

    const handleChange = (event) => {
        setCity(event.target.value); 
    };

    return (
        <div className="relative">
            <select
                id="countries"
                value={city || ''} 
                onChange={handleChange}
                className="p-2 border rounded-full border-primary-500 bg-transparent dark:bg-primary-950 text-gray-400"
            >
                <option value="">Select a City</option>
                <option value="delhi">Delhi</option>
                <option value="jaipur">Jaipur</option>
                <option value="bhopal">Bhopal</option>
                <option value="pune">Pune</option>
                <option value="ahmedabad">Ahmedabad</option>
                <option value="kota">Kota</option>
                <option value="mumbai">Mumbai</option>
            </select>
        </div>
    );
};

export default CitySelector;
