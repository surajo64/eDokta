import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // Extract unique specialties from doctors list
  useEffect(() => {
    const uniqueSpecialties = ['All Specialties', ...new Set(doctors.map((doc) => doc.speciality))];
    setSpecialties(uniqueSpecialties);
  }, [doctors]);

  // Apply filtering based on the selected specialty
  useEffect(() => {
    if (speciality && speciality !== 'All Specialties') {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  // Handle specialty selection
  const handleSpecialtyChange = (e) => {
    const selectedSpecialty = e.target.value;
    if (selectedSpecialty === 'All Specialties') {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${selectedSpecialty}`);
    }
  };

  return (
    <div>
      {/* Specialty Dropdown */}
      <div className="mb-10 flex flex-col sm:flex-row justify-center items-center gap-3 text-center">
        <p className="text-gray-600">Browse through our extensive list of trusted doctors:</p>
        <select
          value={speciality || 'All Specialties'}
          onChange={handleSpecialtyChange}
          className="w-full sm:w-1/3 p-2 border rounded-md text-gray-700"
        >
          {specialties.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>



      {/* Doctors List */}
      <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
        {filterDoc.length > 0 ? (
          filterDoc.map((item, index) => (
            <div
              onClick={() => {
                if (!item.available) return;
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              key={index}
              className={`border border-blue-200 rounded-xl overflow-hidden transition-all duration-500 ${item.available ? 'cursor-pointer hover:translate-y-[-10px]' : 'cursor-not-allowed opacity-50'
                }`}
            >
              <img className="bg-blue-50" src={item.image} alt={item.name} />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center">
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></p>
                  <p className={`${item.available ? 'text-green-500' : 'text-red-500'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No doctors found for this specialty.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
