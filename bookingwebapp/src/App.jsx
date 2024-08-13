import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TheatrePage from "./pages/TheatrePage";
import Layout from "./layout";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";
import MoviesPage from "./pages/MoviesPage";
import MoviesFormPage from "./pages/MoviesFormPage";
import TheatresFormPage from "./pages/TheatresFormPage";

export default function App() {

  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;

  return (
    
    <UserContextProvider>

      <Router>
        <Routes>
          <Route path = "/" element ={<Layout/>}>
          
            <Route path = "/" element={<IndexPage />} />
            <Route path = "/login" element = {<LoginPage />} />
            <Route path = "/register" element = {<RegisterPage />} />
            <Route path = "/account" element = {<AccountPage />} />
            <Route path = "/account/adminMovies" element = {<MoviesPage />} />
            <Route path = "/account/adminMovies/new" element = {<MoviesFormPage />} />
            <Route path = "account/adminTheatres" element = {<TheatrePage></TheatrePage>}/>
            <Route path = "/account/adminTheatres/new" element = {<TheatresFormPage />} />
      
          </Route>
        </Routes>
      </Router>

    </UserContextProvider>
    
  );
}
