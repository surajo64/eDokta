import React from 'react'
import { assets } from '../../assets/admin_assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/adminContext'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/doctorContext'
import { AppContext } from '../../context/AppContext'
import { useLoading } from '../../context/loadingContext';


const Navbar = () => {

  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const { atoken, setAtoken, adminData, setAdminData } = useContext(AppContext)
  const navigate = useNavigate()
  const { setLoading } = useLoading();


  const logout = () => {
    setLoading(true);

    const logoutAndNavigate = () => {
      if (aToken) {
        setAToken('');
        localStorage.removeItem('aToken');
      }
      if (dToken) {
        setDToken('');
        localStorage.removeItem('dToken');
      }
      if (atoken) {
        setAtoken(false);
        setAdminData(false);
      }

      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 400);
    };

    logoutAndNavigate();



  }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-2 border-b bg-white rounded'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-40 sm:w-13 cursor-pointer' src={logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {aToken ? 'Admin' : dToken ? 'Doctor' : adminData?.role === 'educator' ? 'Educator' : adminData?.role === 'admin' ? 'Edu Admin' : 'Management'}
        </p>
      </div>
      <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar
