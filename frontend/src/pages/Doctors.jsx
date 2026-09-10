import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Extract unique specialties from doctors list
  useEffect(() => {
    const uniqueSpecialties = ['All Specialties', ...new Set(doctors.map((doc) => doc.speciality))];
    setSpecialties(uniqueSpecialties);
  }, [doctors]);

  // Apply filtering based on the selected specialty and search term
  useEffect(() => {
    let filtered = doctors;
    if (speciality && speciality !== 'All Specialties') {
      filtered = filtered.filter((doc) => doc.speciality === speciality);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilterDoc(filtered);
  }, [doctors, speciality, searchTerm]);

  const handleSpecialtyClick = (spec) => {
    if (spec === 'All Specialties') {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${spec}`);
    }
  };

  const activeSpecialty = speciality || 'All Specialties';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 py-16 px-6 mb-10">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-purple-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-white/30">
            eDokta Medical Network
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Find Your Trusted Doctor
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our network of verified, experienced specialists and book your appointment in seconds.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg select-none">🔍</span>
            <input
              type="text"
              placeholder="Search by name or specialty…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-gray-800 bg-white shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm placeholder-gray-400 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">



        {/* ── Specialty Filter Pills ── */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Filter by Specialty</h2>
          <div className="flex flex-wrap gap-2">
            {specialties.map((spec, index) => {
              const isActive = activeSpecialty === spec;
              return (
                <button
                  key={index}
                  onClick={() => handleSpecialtyClick(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md shadow-blue-200 scale-105'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-semibold text-gray-800">{filterDoc.length}</span> doctor{filterDoc.length !== 1 ? 's' : ''}
            {activeSpecialty !== 'All Specialties' && (
              <span> in <span className="text-blue-600 font-semibold">{activeSpecialty}</span></span>
            )}
          </p>
          {(activeSpecialty !== 'All Specialties' || searchTerm) && (
            <button
              onClick={() => { navigate('/doctors'); setSearchTerm(''); }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 transition"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Doctors Grid ── */}
        {filterDoc.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterDoc.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 ${
                  item.available
                    ? 'cursor-pointer hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1'
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                {/* ── Image Area ── */}
                <div className="relative h-56 bg-gradient-to-br from-teal-100 via-blue-100 to-indigo-100 overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                    alt={item.name}
                  />
                  {/* Badge – top right, white pill */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                        item.available
                          ? 'bg-white text-green-600'
                          : 'bg-white text-red-500'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.available ? 'bg-green-500 animate-pulse' : 'bg-red-400'
                        }`}
                      ></span>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* ── Info Area ── */}
                <div className="p-5">
                  {/* Name */}
                  <p className="text-gray-900 font-bold text-lg leading-tight">{item.name}</p>

                  {/* Specialty – blue/purple */}
                  <p className="text-indigo-500 text-sm font-medium mt-0.5">{item.speciality}</p>

                  {/* Degree · Experience */}
                  {(item.degree || item.experience) && (
                    <p className="text-gray-400 text-xs mt-1.5">
                      {[item.degree, item.experience ? `${item.experience}` : null]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                  )}

                  {/* Book Appointment Button */}
                  <button
                    onClick={() => {
                      if (!item.available) return;
                      navigate(`/appointment/${item._id}`);
                      scrollTo(0, 0);
                    }}
                    disabled={!item.available}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      item.available
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {/* Camera / video icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-5xl">
              🔍
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              We couldn't find any doctors matching your current filters. Try a different specialty or clear your search.
            </p>
            <button
              onClick={() => { navigate('/doctors'); setSearchTerm(''); }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-200 transition-all"
            >
              Browse All Doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
