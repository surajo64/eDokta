import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate("/login");
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 marging-b marging-b-3 border-b border-b-grey-400'>
      <img onClick={() => navigate('/')} src={logo} alt=" Logo" className='w-40 cursor-pointer' />
      <ul className='hidden md:flex items-start gap-5 font-medium'>

        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
        </NavLink>

        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
        </NavLink>

        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
        </NavLink>


        {/* DIGITAL CLINIC with fixed dropdown */}
        <li className="relative group">
          <div className="relative">
            <button className="py-1 flex items-center gap-1">
              DIGITAL CLINIC
              <span className="text-xs">▼</span>
            </button>

            {/* Invisible bridge */}
            <div className="absolute left-0 right-0 h-3 bg-transparent"></div>

            {/* Dropdown Menu */}
            <ul
              className="
      absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg 
      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
      transition duration-200 z-50
    "
            >
              <li>
                <NavLink
                  to="/digital-clinic/teleconsultation"
                  className="block px-4 py-2 hover:bg-primary hover:text-white"
                >
                  Teleconsultation
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/digital-clinic/home-healthcare"
                  className="block px-4 py-2 hover:bg-primary hover:text-white"
                >
                  Home Healthcare
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/digital-clinic/wellness-checkup"
                  className="block px-4 py-2 hover:bg-primary hover:text-white"
                >
                  Wellness Clinic & Medical Checkup
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/digital-clinic/medical-tourism"
                  className="block px-4 py-2 hover:bg-primary hover:text-white"
                >
                  Medical Tourism & Booking
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/digital-clinic/travel-health"
                  className="block px-4 py-2 hover:bg-primary hover:text-white"
                >
                  Travel Health
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/digital-clinic/e-pharmacy"
                  className="block px-4 py-2 hover:bg-primary hover:text-white"
                >
                  e-Pharmacy
                </NavLink>
              </li>
            </ul>
          </div>
        </li>


        <NavLink to='/ruralhealth'>
          <li className='py-1'>RURAL HEALTH</li>
          <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
        </NavLink>

        <NavLink to='/insurance'>
          <li className='py-1'>TAKAFUL INSURANCE</li>
          <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
        </NavLink>

        <li className="relative group">
          <div className='relative'>
          <button className="py-1 flex items-center gap-1">
            EDUCATION & RESEARCH
            <span className="text-xs">▼</span>
          </button>

          {/* Invisible bridge */}
          <div className="absolute left-0 right-0 h-3 bg-transparent"></div>
          
          <ul className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-200 z-50">
            <li>
              <NavLink
                to="/education-training"
                className="block px-4 py-2 hover:bg-primary hover:text-white"
              >
                Education and Training
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/digital-health-research"
                className="block px-4 py-2 hover:bg-primary hover:text-white"
              >
                Digital Health Research
              </NavLink>
            </li>
          </ul>
          </div>
        </li>


        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <div className='flex item-center gap-4'>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />

              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer '>My Profile</p>
                  <p onClick={() => navigate('/My-Appointment')} className='hover:text-black cursor-pointer '>My Appointment</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer '>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block '>Login</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
        {/*-------mobile menu --------*/}
        <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>

          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-20' src="logo" alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>

          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => showMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
            <NavLink onClick={() => showMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
            <NavLink onClick={() => showMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About Us</p></NavLink>
            <NavLink onClick={() => showMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact Us</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
