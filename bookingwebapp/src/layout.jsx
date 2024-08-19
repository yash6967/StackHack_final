import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function Layout(){

    return(

        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4">

            <Header/>
            <Outlet/>

        </div>

    );
}