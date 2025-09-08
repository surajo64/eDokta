import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from "../../context/adminContext";
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets'
import { useLoading } from '../../context/loadingContext';
const DoctorList = () => {
  const { doctors, setDoctors, aToken, getAllDoctors, backendUrl, changeAvailability, currencySymbol } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [monthlyCompletedAppointments, setMonthlyCompletedAppointments] = useState(0);
  const { setLoading } = useLoading();
  const states = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", 
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", 
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe"
  ];

  // Fetch doctor statistics (earnings & completed appointments)
  const fetchDoctorStats = async (docId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/doctor-stats/${docId}`, {
        headers: { aToken }
      });

      if (data.success) {
        setTotalEarnings(data.totalEarnings);
        setCompletedAppointments(data.completedAppointments);
        setMonthlyEarnings(data.monthlyEarnings);
        setMonthlyCompletedAppointments(data.monthlyCompletedAppointments);
      } else {
        toast.error("Failed to fetch doctor stats");
      }
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);

    setSelectedDoctor(doctor);
    fetchDoctorStats(doctor._id);
    return () => clearTimeout(timer);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedDoctor || !selectedDoctor._id) {
      toast.error("Error: No doctor selected.");
      return;
    }

    const requestData = {
      docId: selectedDoctor._id,
      name: selectedDoctor.name,
      address: selectedDoctor.address,
      phone: selectedDoctor.phone,
      degree: selectedDoctor.degree,
      state: selectedDoctor.state,
      experience: selectedDoctor.experience
    };

    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/update-profile`, requestData, {
        headers: { "Content-Type": "application/json", aToken }
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedDoctor(null);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = (docId) => {
    changeAvailability(docId, setLoading);
  }

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
      return;

    }

    setFilteredDoctors(
      (doctors || []).filter(doctor =>
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )

    );
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [searchTerm, doctors]);

  return (
    <div className='m-5 max-h-[90vh] overflow-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>

      {/* Search Input */}
      <div className='mb-10 flex flex-col sm:flex-row justify-center items-center gap-3 text-center'>
        <p className='text-lg font-medium'>Search Doctor</p>
        <input
          type="text"
          placeholder="Search by name or specialty or Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-60 p-2 border border-gray-300 rounded-md mb-3"
        />
      </div>

      {/* Doctor Cards */}
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {filteredDoctors.map((doctor, index) => (
          <div
            className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white'
            key={index}
          >
            <img onClick={() => handleSelectDoctor(doctor)} className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={doctor.image} alt="" />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium'>{doctor.name}</p>
              <p className='text-zinc-600 text-sm'>{doctor.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input
                  onChange={() => handleAvailabilityChange(doctor._id)}
                  type="checkbox"
                  checked={doctor.available}
                  className="w-3 h-3 accent-green-600 cursor-pointer"
                />
                <p className='text-green-600'>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[500px] relative">

            {/* Close Button */}
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-3">
              {selectedDoctor.name}'s Details
            </h2>

            {/* Doctor Stats (Compact Grid) */}
            <div className="grid grid-cols-2 gap-3 mb-4">

              {/* Total Earnings */}
              <div className="flex items-center bg-white p-2 rounded-xl shadow-md border border-blue-300">
                <img className="w-8 h-8 mr-2" src={assets.earning_icon} alt="Earnings" />
                <div>
                  <p className="text-md font-bold text-blue-600">{currencySymbol}{totalEarnings}</p>
                  <p className="text-gray-500 text-xs">Total Earnings</p>
                </div>
              </div>

              {/* Completed Appointments */}
              <div className="flex items-center bg-white p-2 rounded-xl shadow-md border border-blue-300">
                <img className="w-8 h-8 mr-2" src={assets.appointment_icon} alt="Appointments" />
                <div>
                  <p className="text-md font-bold text-blue-600">{completedAppointments}</p>
                  <p className="text-gray-500 text-xs">Total Completed</p>
                </div>
              </div>

              {/* Monthly Earnings */}
              <div className="flex items-center bg-white p-2 rounded-xl shadow-md border border-blue-300">
                <img className="w-8 h-8 mr-2" src={assets.earning_icon} alt="Monthly Earnings" />
                <div>
                  <p className="text-md font-bold text-blue-600">{currencySymbol}{monthlyEarnings}</p>
                  <p className="text-gray-500 text-xs">Current Month Earnings</p>
                </div>
              </div>

              {/* Monthly Completed Appointments */}
              <div className="flex items-center bg-white p-2 rounded-xl shadow-md border border-blue-300">
                <img className="w-8 h-8 mr-2" src={assets.appointment_icon} alt="Monthly Completed" />
                <div>
                  <p className="text-md font-bold text-blue-600">{monthlyCompletedAppointments}</p>
                  <p className="text-gray-500 text-xs">Current Month Completed</p>
                </div>
              </div>


            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium text-sm">Full Name</label>
                <input
                  name="name"
                  onChange={(e) => setSelectedDoctor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  type="text"
                  value={selectedDoctor.name}
                  className="w-full p-2 border rounded-md text-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm">Qualification</label>
                <input
                  name="degree"
                  onChange={(e) => setSelectedDoctor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  type="text"
                  value={selectedDoctor.degree}
                  className="w-full p-2 border rounded-md text-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm">Experience</label>
                <select
                  onChange={(e) => setSelectedDoctor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  value={selectedDoctor.experience || ''}
                  name="experience"
                  className="w-full p-2 border border-blue-200 rounded"
                  required>
                    
                  <option value="1-5 Years">1-5 Years</option>
                  <option value="6-10 Years">6-10 Years</option>
                  <option value="11-15 Years">11-15 Years</option>
                  <option value="16-20 Years">16-20 Years</option>
                  <option value="More than 20 Years">More than 20 Years</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm">State</label>
                <select
                onChange={(e) => setSelectedDoctor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  name="state"
                value={selectedDoctor.state || ''}
                className="w-full p-2 border border-blue-200 rounded"
                required>
                {states.map((docstate, index) => (
                  <option key={index} value={docstate}>{docstate}</option>
                ))}
              </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm">Location</label>
                <input
                  name="address"
                  onChange={(e) => setSelectedDoctor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  type="text"
                  value={selectedDoctor.address || ''}
                  className="w-full p-2 border rounded-md text-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm">Phone</label>
                <input
                  name="phone"
                  onChange={(e) => setSelectedDoctor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  type="text"
                  value={selectedDoctor.phone || ''}
                  className="w-full p-2 border rounded-md text-gray-600 text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-600 transition"
              >
                Update Profile
              </button>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="bg-red-500 text-white py-2 px-4 rounded-md text-sm hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  );
};

export default DoctorList;
