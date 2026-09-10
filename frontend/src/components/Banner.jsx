import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const { setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 my-20">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      </div>

      <div className="relative flex flex-col md:flex-row items-stretch justify-between px-4 sm:px-[5%]">
        {/* Left */}
        <div className="flex-1 z-10 py-12 md:py-16 lg:py-20">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-white/30">
            Join eDokta Today
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Book Appointment<br />
            <span className="text-blue-200">With 100+ Trusted Doctors</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => { setShowLogin(true); scrollTo(0, 0); }}
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/doctors')}
              className="px-8 py-3 bg-white/15 text-white font-semibold rounded-full border border-white/30 hover:bg-white/25 transition-all duration-300 text-sm backdrop-blur-sm"
            >
              Browse Doctors
            </button>
          </div>
        </div>

        {/* Right: doctor image */}
        <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
          <img
            className="w-full absolute bottom-0 right-0 max-w-[290px] lg:max-w-[340px] object-contain drop-shadow-2xl"
            src={assets.appointment_img}
            alt="Book Appointment"
          />
        </div>
      </div>
    </div>
  )
}

export default Banner
