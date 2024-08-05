import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./layout";
import axios from "axios";

export default function App() {

  axios.defaults.baseURL = 'http://localhost:4000';

  return (
    <Router>
      <Routes>
        <Route path = "/" element ={<Layout/>}>
        
          <Route path = "/" element={<IndexPage />} />
          <Route path = "/login" element = {<LoginPage />} />
          <Route path = "/register" element = {<RegisterPage />} />
          
        </Route>
      </Routes>
    </Router>
  );
}
