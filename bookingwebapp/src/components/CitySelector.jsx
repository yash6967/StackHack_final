// CitySelector.js
import React, { useState } from 'react';

const CitySelector = () => {

    return (
        <div className="relative">
            
            <select  
                id="countries"
                className="p-2 border rounded-full border-primary-500 bg-transparent dark:bg-primary-950 text-gray-400">

                <option selected="">Select a City</option>
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
