import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/adminContext'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/doctorContext'
import { AppContext } from '../../context/AppContext'
import { useLoading } from '../../context/loadingContext'
import { Menu, LogOut } from 'lucide-react'

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const { atoken, setAtoken, adminData, setAdminData } = useContext(AppContext)
  const navigate = useNavigate()
  const { setLoading } = useLoading()

  const logout = () => {
    setLoading(true)

    const logoutAndNavigate = () => {
      setAToken('')
      localStorage.removeItem('aToken')

      setDToken('')
      localStorage.removeItem('dToken')

      setAtoken(false)
      setAdminData(false)
      localStorage.removeItem('atoken')
      localStorage.removeItem('adminData')

      setTimeout(() => {
        setLoading(false)
        navigate('/login')
      }, 400)
    }

    logoutAndNavigate()
  }

  return (
    <header className='flex justify-between items-center px-4 md:px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-30 h-16 shadow-xs select-none'>
      <div className='flex items-center gap-3'>
        {/* Toggle sidebar button for mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className='md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200'
          aria-label='Toggle navigation sidebar'
        >
          <Menu size={20} />
        </button>

        {/* Mobile Logo (Visible only on mobile) */}
        <img
          onClick={() => navigate('/')}
          className='w-28 cursor-pointer object-contain hover:opacity-90 transition-opacity block md:hidden'
          src={logo}
          alt='eDokta Logo'
        />

        {/* Desktop Portal Title (Visible only on desktop) */}
        <span className='hidden md:inline-block font-semibold text-slate-700 text-lg'>
          {aToken ? 'Admin Dashboard' : dToken ? 'Doctor Portal' : 'Educator Dashboard'}
        </span>
      </div>

      <button
        onClick={logout}
        className='flex items-center gap-2 bg-red-400 hover:bg-red-500 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200'
      >
        <LogOut size={16} />
        <span className='hidden sm:inline'>Logout</span>
      </button>
    </header>
  )
}

export default Navbar

