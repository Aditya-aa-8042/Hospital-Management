import About from "./Pages/About";
import Contact from "./Pages/Contact";
import {  Routes, Route } from "react-router-dom";
import RegisterUser from './Pages/RegisterUser';
import Home from './Pages/Home';
import LoginUserPage from './Pages/LoginUserPage';
import Profile from './Pages/Profile';
import Appointment from './Pages/Appointment';
import Doctors from './Pages/Doctors';
import Department from "./Pages/Department";
import DoctorDashboard from "./Pages/DoctorDashboard";
import DoctorAppointments from "./Pages/DoctorAppointments";
import DoctorProfile from "./Pages/DoctorProfile";
import AppointmentDetails from "./Pages/AppointmentDetails";
import ServiceDetails from "./Pages/ServiceDetails";
import Services from "./Pages/Services";
import Emergency from "./Pages/Emergency";




const App = () => {
  return (
    
    <Routes>
      <Route path="/login" element={<LoginUserPage />} />
      <Route path="/department" element={<Department/>} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/" element={<Home/>} /> 
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      {/* <Route path="/appointments/:id" element={<AppointmentDetails />} /> */}
       <Route path="/appointments" element={<AppointmentDetails/>} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:serviceSlug" element={<ServiceDetails />} />
      <Route path="/emergency" element={<Emergency />} />

    </Routes>

);
}

export default App
