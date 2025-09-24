import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Appointment from './pages/Appointment'
import MyAppointment from './pages/MyAppointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MyProfile from './pages/Myprofile'
import ResetPassword from './pages/resetPassword'
import ForgotPassword from './pages/ForgotPassword '
import TelehealthRoom from './pages/telehealthRoom'
import Test from './pages/test'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from "./context/loadingContext";
import RuralHealth from './pages/ruralHealth'
import Insurance from './pages/insurance'

const App = () => {
  const { setLoading } = useLoading(); 

  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className='mx-4 sm:mx-[5%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/ruralhealth' element={<RuralHealth />} />
         <Route path='/insurance' element={<Insurance />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/telehealth/:appointmentId' element={<TelehealthRoom/>} />
        <Route path='/test' element={<Test/>} />
      </Routes>
      <Footer /> 
    </div>
  )
}

export default App
