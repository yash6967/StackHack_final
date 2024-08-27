import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CityContext = createContext({});

export function CityContextProvider({children}){

    const [city, setCity] = useState(null);
    const [ready,setReady] = useState(false);

    useEffect(() => {

        axios.get('/profile').then(({ data }) => {

            setCity(data.city || null); 
            setReady(true);
            
        });

    }, []);

    return(

        <CityContext.Provider value = {{city, setCity, ready}}>
            {children}
        </CityContext.Provider>

    );

}