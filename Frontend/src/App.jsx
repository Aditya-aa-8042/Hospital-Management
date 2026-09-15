import About from "./Pages/About";
import Contact from "./Pages/Contact";
import {  Routes, Route } from "react-router-dom";
import RegisterUser from './Pages/RegisterUser';
import Home from './Pages/Home';
import LoginUserPage from './Pages/LoginUserPage';
import Profile from './Pages/Profile';
import Appointment from './Pages/Appointment';
import Doctors from './Pages/Doctors';
import DoctorHome from "./Pages/DoctorHome";
import Department from "./Pages/Department";

const App = () => {
  return (
    
    <Routes>
      <Route path="/login" element={<LoginUserPage />} />
      <Route path="/departments" element={<Department/>} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/" element={<Home/>} /> 
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctor/dashboard" element={<DoctorHome />} />
    </Routes>

);
}

export default App
