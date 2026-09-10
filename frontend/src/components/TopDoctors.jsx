import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <div className="py-20">
      {/* Section header */}
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Our Specialists</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">Top Doctors to Book</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* Doctor cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 ${
              item.available
                ? 'cursor-pointer hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-2'
                : 'cursor-not-allowed opacity-60'
            }`}
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-teal-100 via-blue-100 to-indigo-100 overflow-hidden">
              <img
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                src={item.image}
                alt={item.name}
              />
              {/* Badge top-right */}
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm bg-white ${item.available ? 'text-green-600' : 'text-red-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}></span>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {/* Hover CTA overlay */}
              {item.available && (
                <div className={`absolute inset-0 bg-gradient-to-t from-blue-700/70 via-transparent to-transparent flex items-end justify-center pb-3 transition-opacity duration-300 ${hoveredCard === index ? 'opacity-100' : 'opacity-0'}`}>
                  <button
                    onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                    className="text-white text-xs font-semibold px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/30"
                  >
                    Book Appointment →
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <p
                onClick={() => { if (!item.available) return; navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                className="text-gray-900 font-semibold text-sm leading-tight"
              >{item.name}</p>
              <p className="text-indigo-500 text-xs font-medium mt-0.5">{item.speciality}</p>
              <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${hoveredCard === index ? 'w-full' : 'w-8'}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0); }}
          className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-200"
        >
          View All Doctors
        </button>
      </div>
    </div>
  )
}

export default TopDoctors
