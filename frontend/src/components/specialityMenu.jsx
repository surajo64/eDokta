import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div id='speciality' className="py-20">
      {/* Section header */}
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Browse by Category</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">Find Doctor by Speciality</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          Simply browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
        </p>
      </div>

      {/* Scrollable pill row */}
      <div className="flex gap-5 overflow-x-auto pb-4 justify-start sm:justify-center px-2">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            key={index}
            to={`/doctors/${item.speciality}`}
            className="group flex flex-col items-center flex-shrink-0 cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center mb-3 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:border-transparent group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300 overflow-hidden">
              <img
                className="w-12 sm:w-14 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
                src={item.image}
                alt={item.speciality}
              />
            </div>
            <p className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors text-center max-w-[80px] leading-tight">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu
