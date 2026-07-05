import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { AppContext } from '../context/AppContext'
import LoginModal from './LoginModal'

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [mobileDigitalClinicOpen, setMobileDigitalClinicOpen] = useState(false);
  const { token, setToken, userData, showLogin, setShowLogin } = useContext(AppContext)

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate('/');
  }

  return (
    <>
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


          <NavLink to='/education-training'>
            <li className='py-1'>eDOKTA ACADEMY</li>
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
                <li>
                  <NavLink
                    to="/ruralhealth"
                    className="block px-4 py-2 hover:bg-primary hover:text-white"
                  >
                    Rural Health
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <NavLink to='/insurance'>
            <li className='py-1'>TAKAFUL INSURANCE</li>
            <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
          </NavLink>

          <NavLink to='/research'>
            <li className='py-1'>RESEARCH</li>
            <hr className='border-none outline-none h-0.5 bg-primary w3/5 m-auto hidden' />
          </NavLink>


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
                    <p onClick={() => navigate('/my-courses')} className='hover:text-black cursor-pointer '>My Enrollments</p>
                    <p onClick={logout} className='hover:text-black cursor-pointer '>Logout</p>
                  </div>
                </div>
              </div>
              : <button onClick={() => setShowLogin(true)} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block '>Login</button>
          }
          <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
          {/*-------mobile menu --------*/}
          <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-y-auto bg-white transition-all`}>

            <div className='flex items-center justify-between px-5 py-6 border-b border-gray-100'>
              <img onClick={() => { navigate('/'); setShowMenu(false); }} className='w-32 cursor-pointer' src={logo} alt="Logo" />
              <img className='w-7 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close Menu" />
            </div>

            <div className='flex flex-col gap-2 mt-5 px-5 text-lg font-medium'>
              <NavLink onClick={() => setShowMenu(false)} to='/'>
                <p className='px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition block'>HOME</p>
              </NavLink>

              <NavLink onClick={() => setShowMenu(false)} to='/about'>
                <p className='px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition block'>ABOUT</p>
              </NavLink>

              <NavLink onClick={() => setShowMenu(false)} to='/doctors'>
                <p className='px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition block'>ALL DOCTORS</p>
              </NavLink>

              <NavLink onClick={() => setShowMenu(false)} to='/education-training'>
                <p className='px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition block'>eDOKTA ACADEMY</p>
              </NavLink>

              {/* Collapsible Digital Clinic */}
              <div className='w-full'>
                <button
                  onClick={() => setMobileDigitalClinicOpen(!mobileDigitalClinicOpen)}
                  className='w-full flex items-center justify-between px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition text-left text-lg font-medium'
                >
                  <span>DIGITAL CLINIC</span>
                  <span className={`transform transition-transform text-xs duration-200 ${mobileDigitalClinicOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileDigitalClinicOpen ? 'max-h-[500px] opacity-100 mt-1 pl-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                  <div className='flex flex-col gap-1 border-l-2 border-gray-100 pl-3'>
                    <NavLink onClick={() => setShowMenu(false)} to="/digital-clinic/teleconsultation" className="px-4 py-2 text-base text-gray-600 hover:text-primary hover:bg-gray-50 rounded block transition">
                      Teleconsultation
                    </NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to="/digital-clinic/home-healthcare" className="px-4 py-2 text-base text-gray-600 hover:text-primary hover:bg-gray-50 rounded block transition">
                      Home Healthcare
                    </NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to="/digital-clinic/wellness-checkup" className="px-4 py-2 text-base text-gray-600 hover:text-primary hover:bg-gray-50 rounded block transition">
                      Wellness Clinic & Medical Checkup
                    </NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to="/digital-clinic/medical-tourism" className="px-4 py-2 text-base text-gray-600 hover:text-primary hover:bg-gray-50 rounded block transition">
                      Medical Tourism & Booking
                    </NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to="/digital-clinic/travel-health" className="px-4 py-2 text-base text-gray-600 hover:text-primary hover:bg-gray-50 rounded block transition">
                      Travel Health
                    </NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to="/digital-clinic/e-pharmacy" className="px-4 py-2 text-base text-gray-600 hover:text-primary hover:bg-gray-50 rounded block transition">
                      e-Pharmacy
                    </NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to="/ruralhealth" className="px-4 py-2 text-base text-gray-600 hover:text-primary hover:bg-gray-50 rounded block transition">
                      Rural Health
                    </NavLink>
                  </div>
                </div>
              </div>

              <NavLink onClick={() => setShowMenu(false)} to='/insurance'>
                <p className='px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition block'>TAKAFUL INSURANCE</p>
              </NavLink>

              <NavLink onClick={() => setShowMenu(false)} to='/research'>
                <p className='px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition block'>RESEARCH</p>
              </NavLink>

              <NavLink onClick={() => setShowMenu(false)} to='/contact'>
                <p className='px-4 py-2 rounded hover:bg-gray-50 hover:text-primary transition block'>CONTACT</p>
              </NavLink>

              {/* Authentication section inside Mobile Menu */}
              <div className='mt-6 pt-6 border-t border-gray-100 mb-8'>
                {token && userData ? (
                  <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-3 px-4'>
                      <img className='w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm' src={userData.image} alt="User profile" />
                      <div>
                        <p className='font-semibold text-gray-800 leading-tight'>{userData.name}</p>
                        <p className='text-xs text-gray-500 mt-0.5'>{userData.email}</p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-1 mt-2'>
                      <NavLink onClick={() => setShowMenu(false)} to='/my-profile'>
                        <p className='px-4 py-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded block transition'>My Profile</p>
                      </NavLink>
                      <NavLink onClick={() => setShowMenu(false)} to='/my-appointment'>
                        <p className='px-4 py-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded block transition'>My Appointment</p>
                      </NavLink>
                      <NavLink onClick={() => setShowMenu(false)} to='/my-courses'>
                        <p className='px-4 py-2 text-base text-gray-700 hover:text-primary hover:bg-gray-50 rounded block transition'>My Enrollments</p>
                      </NavLink>
                      <button
                        onClick={() => { logout(); setShowMenu(false); }}
                        className='w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-50 rounded block transition mt-2 font-medium'
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setShowLogin(true); setShowMenu(false); }}
                    className='w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-opacity-95 transition shadow-sm'
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default Navbar
